-- =====================================================================
-- Techadyant Labs — CMS schema (Supabase / Postgres)
-- Run in Supabase SQL Editor to add CMS tables.
-- =====================================================================

-- CMS Reports (mirrors app/reports/data.ts ReportMeta)
create table if not exists public.cms_reports (
  slug           text primary key,
  title          text not null,
  subtitle       text,
  domain         text,
  edition        text,
  published      text,           -- ISO date
  published_label text,
  reading_time   text,
  status         text not null check (status in ('published','forthcoming')),
  summary        text,
  accent         text,           -- hex color
  access         text not null check (access in ('free','paid')),
  price          integer,        -- INR whole rupees
  currency       text default 'INR',
  has_pdf        boolean default false,
  has_deck       boolean default false,
  pages          integer,
  cover          text,
  preview_object  text,
  preview_pages  integer,
  keywords       text[],
  faq            jsonb,
  sources        text[],
  date_modified  text,
  body_component text,           -- maps to app/reports/content/<name>.tsx
  body_params    jsonb,          -- params for the component
  seo            jsonb,          -- {title, description, ogImage, schema}
  author_id      uuid references auth.users(id),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- CMS Signals (mirrors app/signals/data.ts SignalMeta)
create table if not exists public.cms_signals (
  slug        text primary key,
  no          text,
  title       text not null,
  domain      text,
  date        text,              -- ISO
  date_label  text,
  status      text not null check (status in ('live','monitoring','placeholder')),
  excerpt     text,
  reading_time text,
  body        jsonb,             -- [{type:'p'|'h'|'list', text, items}]
  takeaways   text[],
  sources     text[],
  accent      text,
  category    text,
  priority    text check (priority in ('high','medium','low')),
  seo         jsonb,
  author_id   uuid references auth.users(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- CMS Briefings
create table if not exists public.cms_briefings (
  slug        text primary key,
  title       text not null,
  summary     text,
  published   text,              -- ISO
  status      text not null check (status in ('published','forthcoming')),
  accent      text,
  seo         jsonb,
  author_id   uuid references auth.users(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- CMS Newsletters
create table if not exists public.cms_newsletters (
  slug          text primary key,
  title         text not null,
  date          text,
  description   text,
  accent        text,
  seo           jsonb,
  author_id     uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- CMS Pages (about, services, etc.)
create table if not exists public.cms_pages (
  slug        text primary key,
  title       text not null,
  content     text,              -- HTML or markdown body
  seo         jsonb,
  author_id   uuid references auth.users(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Admin users table (for role-based access beyond Cloudflare Access)
-- Cloudflare Access is the edge gate; this table adds internal roles.
create table if not exists public.admin_users (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  role        text not null default 'editor' check (role in ('admin','editor','viewer')),
  active      boolean not null default true,
  last_login  timestamptz,
  created_at  timestamptz not null default now()
);

-- CMS audit log
create table if not exists public.cms_audit_log (
  id          uuid primary key default gen_random_uuid(),
  admin_email text not null,
  action      text not null,     -- 'create','update','delete','publish'
  table_name  text not null,
  record_slug text,
  changes     jsonb,
  ip          text,
  created_at  timestamptz not null default now()
);

-- Indexes
create index if not exists cms_reports_status_idx on public.cms_reports (status);
create index if not exists cms_reports_access_idx on public.cms_reports (access);
create index if not exists cms_signals_status_idx on public.cms_signals (status);
create index if not exists cms_briefings_status_idx on public.cms_briefings (status);
create index if not exists cms_newsletters_date_idx on public.cms_newsletters (date desc);
create index if not exists cms_audit_log_created_idx on public.cms_audit_log (created_at desc);

-- Row Level Security
alter table public.cms_reports    enable row level security;
alter table public.cms_signals    enable row level security;
alter table public.cms_briefings  enable row level security;
alter table public.cms_newsletters enable row level security;
alter table public.cms_pages     enable row level security;
alter table public.admin_users   enable row level security;
alter table public.cms_audit_log enable row level security;

-- Policies
drop policy if exists "cms public read" on public.cms_reports;
create policy "cms public read" on public.cms_reports for select using (true);

drop policy if exists "cms public read" on public.cms_signals;
create policy "cms public read" on public.cms_signals for select using (true);

drop policy if exists "cms public read" on public.cms_briefings;
create policy "cms public read" on public.cms_briefings for select using (true);

drop policy if exists "cms public read" on public.cms_newsletters;
create policy "cms public read" on public.cms_newsletters for select using (true);

drop policy if exists "cms public read" on public.cms_pages;
create policy "cms public read" on public.cms_pages for select using (true);

-- Admin users managed by admins only (no anon read)
drop policy if exists "admin only manage admin_users" on public.admin_users;
create policy "admin only manage admin_users" on public.admin_users for all using (false);

-- CMS write: service role bypasses RLS; policies below protect accidental browser writes
drop policy if exists "cms no anon write" on public.cms_reports;
create policy "cms no anon write" on public.cms_reports for insert using (false);
drop policy if exists "cms no anon write" on public.cms_signals;
create policy "cms no anon write" on public.cms_signals for insert using (false);
drop policy if exists "cms no anon write" on public.cms_briefings;
create policy "cms no anon write" on public.cms_briefings for insert using (false);
drop policy if exists "cms no anon write" on public.cms_newsletters;
create policy "cms no anon write" on public.cms_newsletters for insert using (false);
drop policy if exists "cms no anon write" on public.cms_pages;
create policy "cms no anon write" on public.cms_pages for insert using (false);
