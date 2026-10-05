# Atlas sourcing dossier: promoting assessments to "Verified"

Prepared 5 Oct 2026. Read-only investigation of SID (Supabase project `n8ndb`, schema `sid`). **Nothing was written to SID or to this repo's data.**

## Outcome

No assessment can be promoted to Verified yet. Three findings explain why, in order of importance.

### 1. SID holds no external primary source for any current assessment
- `sid.capture_assessments` has 90 rows = 45 cells × 2 snapshots (31 May 2026 seed, 27 Aug 2026 "audit").
- The 45 seed rows have **no** `primary_source_id` at all (their citation exists only as a bracketed domain in the rationale text, and only for some).
- The 45 audit rows point to one source: `internal://atlas-updates/aug-2026`, publisher "Techadyant Labs", `is_primary = false`.
- 34 of the 45 seed rows are labelled `single_source` with no source linked. So "single-source" currently means "one cited domain in free text", not "one primary source on file".
- The audit rows are attributed to "Grok pack … audited Techadyant 2026-08-27", i.e. AI-assisted drafts reviewed internally. That provenance should be stated honestly wherever the labels are explained.

### 2. The data model cannot express "two sources"
`capture_assessments.primary_source_id` is a single uuid. "Verified = two or more independent primary sources" therefore cannot be computed from the data; it can only be asserted by hand. A link table is needed (proposed SQL below, **not applied**).

### 3. One headline figure looks wrong and must be checked before it is reused or promoted
Critical Minerals · Components & Inputs says "~100% imported (53,748 t FY25)". Official parliamentary replies, as surfaced by search (not yet opened by us), report quantity-wise import dependence of **84.8–90.4%** across 2022-23 to 2024-25 and a domestic requirement of roughly **4,000 t** (rising to ~8,000 t by 2030). 53,748 t does not fit a 4,000 t requirement; it may be a broader HS code or a different unit. Until resolved: do **not** rescore this cell to 0 on a "~100%" basis, and treat the existing rationale as unverified.

## Candidate primary sources (found via search; **none opened or verified**, because this environment blocks pib.gov.in, static.pib.gov.in and ism.gov.in)

Each must be opened, and the exact claim quoted with date and ministry, before use.

| Cell | Candidate | What it is reported to support |
|---|---|---|
| CM · Components & Inputs | PIB PRID 2194684: Cabinet approves ₹7,280 cr REPM scheme (26 Nov 2025) | 6,000 MTPA target; domestic midstream magnet gap |
| CM · Components & Inputs | PIB PRID 2248182: Parliament question, rare earth reserves and magnet manufacturing | import dependence 84.8–90.4% by quantity; requirement ~4,000 t |
| CM · Components & Inputs | PIB PRID 2245038: Lok Sabha reply (Dr Jitendra Singh) | domestic REPM capacity ~5,000 t by 2030 |
| CM · Components & Inputs | PIB PRID 2287130: assessment of REPM scheme (Jul 2026) | scheme status |
| CM · Refining & Processing | PIB PRID 2220295 (Parliament question: rare earth minerals); PIB Note 157165 (India's Rare Earth Strategy, Feb 2026) | processing gap; policy response |
| CM · Refining & Processing | Independent: USGS Mineral Commodity Summaries and IEA Global Critical Minerals Outlook | China share of refining (needed for "~98% gallium", "~90% graphite") |
| Defence · Components & Inputs | PIB PRID 2210154: MoD Year End Review 2025 | engine programmes |
| Defence · Components & Inputs | HAL–GE contract for 113 F404-GE-IN20 engines (7 Nov 2025) and MoD contract for 97 LCA Mk1A (25 Sep 2025), via HAL/MoD releases | LCA Mk1A flies on imported F404 engines |
| Defence · Components & Inputs | PIB PRID 1776092: Kaveri (2021) | LCA integrated with imported engine (older) |
| Semis · Raw Materials | PIB PRID 2224839 and PIB Press Note 154968 (ISM 2.0); ism.gov.in/schemes/semicon2.0 | ISM 2.0 targets materials, chemicals and gases |
| Semis · Raw Materials | **Gap:** no primary source found for ">90% imported". SEMI or MeitY data needed | the quantitative claim |

Note: the Defence "wholly import-dependent" wording applies to jet engines specifically; the layer also includes components improving domestically (the Aug audit row scores it 2). Whether a single score of 0 is defensible is a judgement call that primary sources alone will not settle.

## Suggested path
1. Open each source above from an unrestricted machine. Record URL, publisher, date, exact quote.
2. Resolve the 53,748 t discrepancy first.
3. Apply the schema change so two sources can be recorded.
4. Insert sources and links; promote only cells with two independent primary sources.
5. Rebuild: the Atlas charts and "evidence standard" panel update automatically.

## Proposed SQL (NOT APPLIED; review before running)

```sql
-- 1. Allow many sources per assessment
create table if not exists sid.capture_assessment_sources (
  assessment_id uuid not null references sid.capture_assessments(assessment_id) on delete cascade,
  source_id     uuid not null references sid.sources(source_id),
  supports      text,            -- the exact claim this source supports
  quoted_text   text,            -- verbatim quote
  added_at      timestamptz not null default now(),
  primary key (assessment_id, source_id)
);

-- 2. Example promotion, only after two independent primary sources are linked
-- update sid.capture_assessments a set verification_status = 'verified'
-- where a.assessment_id = '<id>'
--   and (select count(*) from sid.capture_assessment_sources x
--        join sid.sources s on s.source_id = x.source_id
--        where x.assessment_id = a.assessment_id and s.is_primary) >= 2;
```

## Security issue found while inspecting SID (needs your decision)
Row Level Security is **disabled on all 31 tables in `sid`**, including `capture_assessments` and `sources`. Anyone holding the project's anon key could read **or modify** them. If the site's build or any client uses the anon key, that key is public by design. Enable RLS and add read-only policies for the exports the site needs (`atlas_export` RPC), and restrict writes to service-role. Not applied: enabling RLS without policies would block the site's bake. See https://supabase.com/docs/guides/database/postgres/row-level-security
