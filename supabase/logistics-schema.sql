-- =====================================================================
-- Techadyant Labs — India Integrated Logistics Atlas
-- SID schema `logistics` for Supabase project umtfafscgbxgmmqlktlx ("n8ndb").
-- Run in Supabase SQL Editor (as postgres/service role): paste > Run.
-- Mirrors the `sid` Atlas pattern: tables + SECURITY DEFINER export RPC,
-- baked to app/research/_logistics.json by scripts/bake-logistics.mjs.
--
-- Evidence standard (non-negotiable):
--   verified           = two or more independent primary sources on file
--   single_source      = one primary source captured (url + content)
--   unverified         = analyst judgement, no external primary source
--   needs_human_source = no primary source fully captured yet; figures are
--                        deliberately left null rather than filled from memory
-- Never hand-edit app/research/_logistics.json — change data here and rebuild.
-- =====================================================================

create schema if not exists logistics;

-- ---------------------------------------------------------------- sources --
create table if not exists logistics.sources (
  id             text primary key,                 -- stable slug, e.g. 'pm-india-itla-20261006'
  publisher      text not null,                    -- e.g. 'PIB / Ministry of Railways'
  title          text not null,
  published_on   date,                             -- publication date (or as-of date)
  url            text,                             -- full URL when captured; null = capture pending
  url_host       text,                             -- host confirmed via search index even when path pending
  kind           text not null default 'government'
                   check (kind in ('pib','ministry','pm_india','government','dashboard','international','trade_press','academic','other')),
  is_primary     boolean not null default true,    -- trade press is a lead only -> false
  capture_status text not null default 'captured'
                   check (capture_status in ('captured','snippet_confirmed','title_date_confirmed','lead_only')),
  capture_note   text,                             -- how/where it was captured; what is still missing
  retrieved_on   date not null default current_date,
  notes          text
);

-- ------------------------------------------------------------- programmes --
-- Re-assert the kind check so re-runs fix databases created by an earlier version
-- of this file (which omitted 'government', the column default).
alter table logistics.sources drop constraint if exists sources_kind_check;
alter table logistics.sources add constraint sources_kind_check
  check (kind in ('pib','ministry','pm_india','government','dashboard','international','trade_press','academic','other'));

create table if not exists logistics.programmes (
  id                  text primary key,            -- stable slug, e.g. 'bharatmala'
  code                text unique,
  name                text not null,
  ministry            text,
  type                text not null check (type in ('corridor_programme','port','waterway','policy','authority')),
  summary             text,
  key_metrics         jsonb,                       -- only metrics with a source on file; null otherwise
  status              text,
  primary_source_id   text references logistics.sources(id),
  verification_status text not null default 'needs_human_source'
                        check (verification_status in ('verified','single_source','unverified','needs_human_source')),
  rationale           text,                        -- why this row exists / what would upgrade it
  updated_at          timestamptz not null default now()
);

-- -------------------------------------------------------------- corridors --
create table if not exists logistics.corridors (
  id                      text primary key,
  name                    text not null,
  mode                    text not null check (mode in ('rail','road','coastal','inland_waterway','multimodal')),
  endpoints               text,
  length_km               numeric,                 -- null unless a source is on file
  length_commissioned_km  numeric,                 -- null unless a source is on file
  status                  text,
  programme_id            text references logistics.programmes(id),
  verification_status     text not null default 'needs_human_source'
                            check (verification_status in ('verified','single_source','unverified','needs_human_source')),
  rationale               text
);

-- ----------------------------------------------------------------- nodes --
create table if not exists logistics.nodes (
  id                  text primary key,
  name                text not null,
  type                text not null check (type in ('port','mmlp','icd','airport','gateway','terminal')),
  state               text,
  lat                 numeric,                     -- only where publicly published; null otherwise
  lon                 numeric,
  throughput          jsonb,                       -- e.g. {"cargo_mt_fy25": ...} only with a source on file
  status              text,
  programme_id        text references logistics.programmes(id),
  verification_status text not null default 'needs_human_source'
                        check (verification_status in ('verified','single_source','unverified','needs_human_source')),
  rationale           text
);

-- --------------------------------------------------------------- projects --
-- v2: verified transport/logistics projects >= Rs 500 crore (the ITLA-appraisal
-- tier). Kept empty in v1 — rows are added only with a captured primary source.
create table if not exists logistics.projects (
  id                  text primary key,
  name                text not null,
  programme_id        text references logistics.programmes(id),
  cost_cr             numeric check (cost_cr >= 500),  -- ITLA-appraisal tier only
  mode                text,
  status              text,
  expected_completion text,
  verification_status text not null default 'needs_human_source'
                        check (verification_status in ('verified','single_source','unverified','needs_human_source')),
  rationale           text
);

-- --------------------------------------------------- opportunity surfaces --
-- Analyst-judgement rows: POTENTIAL areas where demand or capability may
-- emerge. Never a claim that government will procure anything, never a
-- forecast of contracts. Always verification_status = 'unverified'.
create table if not exists logistics.opportunity_surfaces (
  id                  text primary key,
  title               text not null,
  body                text not null,
  basis_programme_ids text[] not null default '{}',  -- sourced rows this reasoning stands on
  caveat              text not null default 'Potential, not procurement. Analyst judgement — no external primary source.',
  verification_status text not null default 'unverified'
                        check (verification_status in ('verified','single_source','unverified','needs_human_source'))
);

-- ---------------------------------------------------------- record sources --
-- Link table mirroring sid.capture_assessment_sources: which source supports
-- which record, for which claim, with the quoted text that carries the fact.
create table if not exists logistics.record_sources (
  id           bigserial primary key,
  record_table text not null check (record_table in
                 ('programmes','corridors','nodes','projects','opportunity_surfaces')),
  record_id    text not null,
  source_id    text not null references logistics.sources(id),
  supports     text,                                -- the specific claim this source supports
  quoted_text  text,                                -- verbatim snippet from the source (where captured)
  is_primary   boolean not null default true,
  added_on     date not null default current_date,
  unique (record_table, record_id, source_id)
);

create index if not exists record_sources_record_idx on logistics.record_sources (record_table, record_id);
create index if not exists record_sources_source_idx on logistics.record_sources (source_id);

-- ---------------------------------------------------------------- export --
-- logistics_export(): whole-dataset jsonb for scripts/bake-logistics.mjs,
-- modelled on public.atlas_export(). SECURITY DEFINER so the service-role
-- key can read through PostgREST without per-table grants.
create or replace function public.logistics_export()
returns jsonb
language sql
security definer
set search_path = logistics, public
as $$
  with src as (
    select rs.record_table, rs.record_id, rs.supports, rs.quoted_text, rs.is_primary,
           s.id as source_id, s.publisher, s.title, s.published_on, s.url, s.url_host,
           s.kind, s.capture_status, s.capture_note, s.retrieved_on
    from logistics.record_sources rs
    join logistics.sources s on s.id = rs.source_id
  ),
  attach as (
    select
      record_table, record_id,
      jsonb_agg(jsonb_build_object(
        'id', source_id, 'publisher', publisher, 'title', title,
        'published_on', published_on, 'url', url, 'url_host', url_host,
        'kind', kind, 'is_primary', is_primary,
        'capture_status', capture_status, 'capture_note', capture_note,
        'retrieved_on', retrieved_on,
        'supports', supports, 'quoted_text', quoted_text
      ) order by is_primary desc, source_id) as sources
    from src group by record_table, record_id
  )
  select jsonb_build_object(
    'generated_at', to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
    'rpc', 'logistics_export',
    'evidence_standard', jsonb_build_object(
      'verified', 'Two or more independent primary sources on file (e.g. a ministry disclosure plus an independent dataset).',
      'single_source', 'One cited reference on file; not yet independently corroborated.',
      'unverified', 'Analyst judgement — no external primary source linked yet.',
      'needs_human_source', 'No primary source fully captured yet. Figures are deliberately left blank rather than filled from memory; a human must capture the source first.'
    ),
    'programmes', coalesce((
      select jsonb_agg(to_jsonb(p) || jsonb_build_object('sources', coalesce(a.sources, '[]'::jsonb)) order by p.id)
      from logistics.programmes p
      left join attach a on a.record_table = 'programmes' and a.record_id = p.id
    ), '[]'::jsonb),
    'corridors', coalesce((
      select jsonb_agg(to_jsonb(c) || jsonb_build_object('sources', coalesce(a.sources, '[]'::jsonb)) order by c.id)
      from logistics.corridors c
      left join attach a on a.record_table = 'corridors' and a.record_id = c.id
    ), '[]'::jsonb),
    'nodes', coalesce((
      select jsonb_agg(to_jsonb(n) || jsonb_build_object('sources', coalesce(a.sources, '[]'::jsonb)) order by n.id)
      from logistics.nodes n
      left join attach a on a.record_table = 'nodes' and a.record_id = n.id
    ), '[]'::jsonb),
    'projects', coalesce((
      select jsonb_agg(to_jsonb(j) || jsonb_build_object('sources', coalesce(a.sources, '[]'::jsonb)) order by j.id)
      from logistics.projects j
      left join attach a on a.record_table = 'projects' and a.record_id = j.id
    ), '[]'::jsonb),
    'opportunity_surfaces', coalesce((
      select jsonb_agg(to_jsonb(o) || jsonb_build_object('sources', coalesce(a.sources, '[]'::jsonb)) order by o.id)
      from logistics.opportunity_surfaces o
      left join attach a on a.record_table = 'opportunity_surfaces' and a.record_id = o.id
    ), '[]'::jsonb)
  );
$$;

grant execute on function public.logistics_export() to service_role, authenticated, anon;

-- RLS: read is only needed through the RPC (service-role bake). Tables stay
-- RLS-on with no anon policies, matching the commerce schema's posture.
alter table logistics.sources             enable row level security;
alter table logistics.record_sources      enable row level security;
alter table logistics.programmes          enable row level security;
alter table logistics.corridors           enable row level security;
alter table logistics.nodes               enable row level security;
alter table logistics.projects            enable row level security;
alter table logistics.opportunity_surfaces enable row level security;
