# Logistics & Programme Intelligence — Audit (8 Oct 2026)

Audit of the existing Techadyant Labs repository before building the Programme Intelligence layer. Branch base: `main` @ `0cae6be` (Industrial Intelligence Phase 2 merged; the SID duplicate merge confirmed applied — the 6 records read `status = merged`).

## 1. Current architecture

| Concern | What exists |
|---|---|
| Framework | Next.js 15 App Router, `output: 'export'`, `trailingSlash: true`; static HTML on Cloudflare Pages (builds `main` only). |
| Build chain | `validate-industrial → sync-cms-to-data → bake-sid → bake-logistics → bake-platform → prune-redirects → next build → indexnow`. |
| The Atlas | Lives under `/research/*`. `AtlasNav` (client) is the shared section nav. Pillars, Players, Dependencies, Logistics, Data (Industrial Nodes, Infrastructure Projects, Entities, Supply Chains…), Reference. |
| SID | Supabase `umtfafscgbxgmmqlktlx`. `sid` schema → `public.atlas_export()` → `app/research/_atlas.json`. `logistics` schema → `public.logistics_export()` → `scripts/bake-logistics.mjs` → `app/research/_logistics.json`. |
| Industrial layer | Static, SID-shaped JSON in `data/industrial-intelligence/` (sources, industrial nodes, infrastructure nodes, projects, relationships, opportunity surfaces, signal links, supplier map) with one loader `app/research/industrial/data.ts`, validator `scripts/validate-industrial.mjs`, scoring tests. |
| Signals | CMS-generated `app/signals/data.ts` (`SignalMeta`: slug, no, title, domain, date, excerpt, body, takeaways, sources). Never hand-edited; hand side-maps (`report-links.ts`, `signal-links.json`) carry links. |
| Reports | `app/reports/data.ts` (`ReportMeta`: slug, title, subtitle, domain, status, summary, keywords…). |
| Industrial corridors | `/corridors/` + `/corridors/<corridor>/<node>/` (NICDP corridors and node dossiers, `app/corridors/data.ts`, `node-data.ts`). |
| Design system | Global tokens in `app/globals.css` (`--bg`, `--bg-2`, `--surface`, `--border`, `--text*`, `--primary*`, `--brass`); editorial classes `ed-page-head`, `ed-kicker`, `section-head-ed`, `wrap`; viz kit `app/components/viz/Viz.tsx` (`VizPanel`, `BarList`, `StackedBar`, `PulseStrip`); scoped `.ii-*` (industrial) and `.log-*` (logistics) styles. |
| SEO | `app/research/seo.tsx` (`JsonLd`, `breadcrumb`, `faqLd`, `SITE`, `ORG_REF`); hand-built `app/sitemap.ts`; per-page `metadata` with canonical + OG. |

## 2. Existing relevant data

* **SID `logistics.programmes` already exists and is the programme entity.** 12 records: `itla`, `sme-growth-fund`, `dfc`, `bharatmala`, `pm-gati-shakti`, `national-logistics-policy`, `sagarmala`, `ulip`, `leads`, `mmlp`, `iwai`, `major-port-cargo`. Each has: ministry, type, summary, `key_metrics` (with `as_on`), status, a four-level verification label (`verified · single_source · unverified · needs_human_source`) and a source record (publisher, URL, capture status, supporting quote).
* `logistics.corridors` (4: DFC network, EDFC, WDFC, Bharatmala aggregate) and `logistics.nodes` (Mumbai Port, Deendayal, JNPA, MMLP stub) already carry `programme_id`.
* `logistics.projects` is empty by design (v2: ≥ ₹500 crore ITLA tier).
* Industrial layer: 6 industrial nodes, 30 infrastructure nodes, 5 projects (NE-8 expressway, Sarkhej–Dholera rail, Dholera airport, WDFC final sections, Noida airport), 6 opportunity surfaces.
* Signals: 145, of which only a handful mention these programmes by name (Gati Shakti in 1 body, DFC in 2, ports in ~7). Reports: 50; one forthcoming report (`industrial-logistics-behind-manufacturing-india`) covers the logistics system.

## 3. Reusable components

`AtlasNav`, `JsonLd`/`breadcrumb`/`faqLd`, `VizPanel`/`BarList`/`StackedBar`, industrial `ClassedHeading` (FACT / ANALYSIS / SCORE / OPPORTUNITY), `Cite` + numbered `SourceList`, `EvidenceTag`, `GatiShaktiContrast`, `IndustrialMap` (static SVG India outline + projected points — takes any point list), `INDIA_OUTLINE` (`app/corridors/data.ts`), logistics `VerifChip` + SID `SourceList`.

## 4. Existing programme-like entities

* SID `logistics.programmes` (above) — **authoritative for programme facts and headline metrics**.
* Industrial `infrastructure-projects.json` — projects, but with no programme link.
* `/corridors/` — NICDP industrial corridors (the future "Industrial Corridors" programme page should front this, not duplicate it).

## 5. Weaknesses of the current Logistics page

1. It is a reference table, not an intelligence gateway: programmes appear as equal-weight cards grouped by type, with no route deeper than the card.
2. No industrial consequence, supply-chain or opportunity reading per programme; the page never answers "what does this change for industry?".
3. No cross-links from a programme to projects, industrial nodes, signals or reports — the graph exists in pieces but is not traversed.
4. Hero leads with the ITLA news hook (time-bound) rather than the module's purpose.
5. Long stub sections (v2/v3) sit high in the reading order.

## 6. Proposed architecture

**Two-layer programme entity, one ID.**

* **Fact layer (unchanged):** SID `logistics.programmes` — metrics, status, verification label, captured sources. Baked as today.
* **Intelligence layer (new):** `data/programme-intelligence/programmes.json`, keyed by the SID id (`logistics_id`), holding the Techadyant reading: components, status ledger (announced → operational), gaps/delays, industrial consequences, supply-chain path, programme-to-programme relations, signal/report match rules, data gaps. Every claim cites the shared `src:` registry (`data/industrial-intelligence/sources.json`).
* **Graph edges live on the entity that is evidenced**, not on the programme: projects get `programme_links` (typed: `built_under`, `funded_under`, `planned_on`, `operated_under`, with provenance); opportunity surfaces get optional `programme_ids`; signal links get optional `related_programmes`.
* **Derived, never hand-listed:** a programme's projects, infrastructure, industrial nodes, opportunity surfaces, signals and reports are computed at build time by traversing those edges (`app/research/programmes/data.ts`). A new project with a `programme_links` entry, a new signal matching the programme's terms, or a new report automatically appears on the page.

## 7. New schemas

`ProgrammeIntel` (see `app/research/programmes/types.ts`): id `prog:<slug>`, `logistics_id`, slug, names, `role` (`cross_cutting` | `programme`), category, analytical angle, launch, time horizon, current stage (`announced · approved · under_implementation · completed · operational`), glance facts, status ledger, components, timeline, gaps & delays, why-it-matters (analysis), industrial consequences (six dimensions, fact/analysis per claim), supply-chain path, related programmes (typed), `signal_match` / `report_match` (patterns + include/exclude), corridor refs, data gaps, `last_verified`.

## 8. New routes

* `/research/programmes/` — Programme Intelligence index (the "Programmes" layer of the Atlas).
* `/research/programmes/<slug>/` — Phase 1: `gati-shakti`, `bharatmala`, `sagarmala`.
* `/research/logistics/` — redesigned as the gateway.

`/research/*` is the established Atlas URL space (`/research/industrial-nodes/`, `/research/logistics/`); a parallel `/atlas/*` tree would split the Atlas. Programme slugs are short and stable; `pm-gati-shakti` (SID id) maps to the slug `gati-shakti`.

## 9. Cross-linking model

```
Programme ──programme_links──▶ Project ──infra_ids──▶ Infrastructure node
                                  │                          │
                                  └──affected_node_ids──▶ Industrial node ◀── relationships (nearest_port, …)
                                                             │
                                  Opportunity surface ◀──────┤ (relevant_project_ids / programme_ids)
Signal ◀── pattern match / signal-links.related_programmes   │
Report ◀── pattern match / node.related_reports ─────────────┘
Programme ◀──related_programmes──▶ Programme   (Gati Shakti: `coordinates` edges)
```

Reverse links: industrial-node dossiers and the infrastructure-projects page show the programmes behind each project.

## 10. Implementation sequence

1. Research current status (PIB / ministries / Parliament / PAC) for the three pilots; add sources to the shared registry.
2. Types, data file, loader, validator (wired into the build chain).
3. Evidence-based graph edges on projects (NE-8 → Bharatmala; Sarkhej–Dholera → Gati Shakti; WDFC final sections → DFC; new Deendayal ROB → Sagarmala; Bengaluru–Chennai Expressway → Bharatmala).
4. Programme index + common template + three pilot pages.
5. Logistics gateway redesign (keeps the SID reference layer, moved lower).
6. Reverse links, nav, sitemap, `llms`/SEO.
7. Lint, typecheck, tests, build, responsive QA; implementation report.
