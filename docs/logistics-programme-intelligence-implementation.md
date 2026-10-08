# Logistics & Programme Intelligence — Implementation Report (Phase 1, 8 Oct 2026)

Scope delivered: the audit, a reusable Programme Intelligence architecture, a redesigned Logistics & Mobility gateway, a programme index, and three pilot programme pages (PM GatiShakti, Bharatmala, Sagarmala). The freight corridors, industrial corridors and ULIP are on the roadmap as Phase 2, as the brief requires.

## 1. Existing architecture audit
See `docs/logistics-programme-intelligence-audit.md`. Three findings shaped the build:

* **The programme entity already existed.** It is SID `logistics.programmes`, with 12 records, a four-level verification label and captured sources. It was extended, not duplicated.
* **The industrial graph already existed** in `data/industrial-intelligence/`: projects, infrastructure, nodes, relationships, opportunities and signal links. It had no programme edges.
* **`/research/*` is the Atlas URL space**, so programme pages live at `/research/programmes/<slug>/` rather than a parallel `/atlas/` tree.

## 2. Programme Intelligence architecture
A programme is one entity with two layers sharing one id:

| Layer | Where | Holds |
|---|---|---|
| Fact layer (unchanged) | SID `logistics.programmes` → `_logistics.json` | Headline metrics, status, verification label, captured sources |
| Intelligence layer (new) | `data/programme-intelligence/programmes.json` | Angle, stage, glance facts, status ledger, components, timeline, gaps, why-it-matters, consequences, supply-chain path, programme relations, match rules, data gaps |

Graph edges live on the evidenced entity:

* projects carry `programme_links`;
* opportunity surfaces carry `programme_ids`;
* signal links carry `related_programmes`.

Everything else on a programme page is derived at build time in `app/research/programmes/data.ts`.

## 3. Programme schema
`app/research/programmes/types.ts`:

* **`ProgrammeIntel`** — id `prog:<slug>` and `logistics_id` (FK to the SID record).
  * Identity and status: role (`cross_cutting` | `programme`), category, stage (`announced · approved · under_implementation · completed · operational`).
  * Launch and horizon: `launch`, `time_horizon`.
  * Facts: `glance[]`, `ledger[]`, `components[]`, `timeline[]`, `gaps[]`.
  * Analysis: `why_it_matters[]` and `consequences[]` (six dimensions; every claim is `fact` or `analysis` and carries provenance), plus `supply_chain[]`, a fixed six-stage path.
  * Links: `related_programmes[]` (typed relations), `corridor_refs[]`, `signal_match` and `report_match`.
  * Housekeeping: `data_gaps[]`.
* **`ProgrammeLink`** (on projects) — `programme_id` plus a typed edge (`built_under · funded_under · planned_on · operated_under`) with provenance.
* **`RoadmapProgramme`** — a programme that has no intelligence page yet.

The schema carries future programmes (National Logistics Policy, UDAN, NIP, PM MITRA, sub-programmes) without change.

## 4. Relationship model
```
Programme ─programme_links→ Project ─infra_ids→ Infrastructure node ←explicit relationship─ Industrial node
                              └─affected_node_ids→ Industrial node → companies, corridor node, reports
Opportunity surface ←programme_ids / relevant_project_ids
Signal ←name match │ signal-links.related_programmes │ signal-links on a reached node or project
Report ←include │ name match │ related_reports of reached nodes
Programme ↔ Programme (coordinates · coordinated_by · complements · feeds)
```
**Rule:** only explicit, sourced relationships are traversed. The synthesised straight-line "nearest" edges are excluded, so geographic proximity alone never links a programme to a node.

## 5. Logistics page redesign
`/research/logistics/` is now the gateway. Sections in order:

1. Hero — the USP contrast and the five questions.
2. The logistics system at a glance — six dated, sourced figures.
3. Programme Intelligence — six flagship cards and the Gati Shakti cross-cutting diagram.
4. Featured research.
5. What we are watching.
6. Signals from the system — auto-selected.
7. Industrial consequences.
8. Industrial connectivity — every node with its ICS and the programmes reaching it.
9. Opportunity surfaces.
10. Related industrial ecosystems.
11. Reference layer — the full SID record, kept intact with its `#<id>` anchors.
12. Methodology.

## 6. Programmes implemented
| Programme | Route | Stage | Linked projects | Nodes reached |
|---|---|---|---|---|
| PM GatiShakti National Master Plan (cross-cutting) | `/research/programmes/gati-shakti/` | Operational | Sarkhej–Dholera rail line (*planned on* NMP) | Dholera |
| Bharatmala Pariyojana | `/research/programmes/bharatmala/` | Under implementation (Phase-I sanctions closed Nov 2023) | NE-8 Ahmedabad–Dholera; Bengaluru–Chennai Expressway | Dholera |
| Sagarmala | `/research/programmes/sagarmala/` | Under implementation | Deendayal Port ROB at LC-235 (*funded under*) | Sanand (via its gateway port, explicit `nearest_port` relationship) |

Edges were also added for the WDFC final sections (`operated_under` the DFC). They already show on the Sanand and Jewar dossiers.

**Pages now available:**

* the programme index, `/research/programmes/`;
* each programme page carries all 15 template sections;
* the programme scorecard is **deliberately omitted**, with a note, because no methodology exists yet.

## 7. Sources used (new in the shared registry)
**Primary (government and Parliament):**

* PIB research note on the PM GatiShakti framework (Oct 2021)
* PIB release and press note on three years of GatiShakti (Oct 2024)
* PIB note on Gati Shakti Cargo Terminals (Jan 2026)
* Lok Sabha AU 1077 on Bharatmala components (Feb 2018)
* Public Accounts Committee 144th Report on Bharatmala Phase-I (Apr 2024)
* PIB "Building Bharat" (Apr 2025)
* PIB "Sagarmala: Transforming India's maritime landscape" (Apr 2026)
* Sagarmala portal FAQ on Coastal Economic Zones

**Secondary (each flagged medium confidence in the registry):**

* Swarajya on the NPG count of 396 projects (Aug 2026, citing PIB PRID 2297818)
* Swarajya on the Rajya Sabha reply of 22 Jul 2026 (22,709 km constructed)
* IANS on the Bengaluru–Chennai Expressway (Jun 2026)
* The Week on the Deendayal Port ROB (Apr 2026)

**Existing sources reused:** PIB on NE-8 and on the Sarkhej–Dholera line, PM India and JICA on the WDFC.

## 8. Data provenance
* Every glance fact, ledger row, component, timeline entry, gap, related-programme edge and fact claim cites a registry source. The validator enforces this.
* Analysis is labelled on the page, and the validator warns if analysis uses "will".
* Mixed-date figures are never combined; each carries its own as-of date.
* The SID reference record is shown beside the intelligence layer, with its own as-on date. Bharatmala's SID figure (19,826 km at Feb 2025) is older than the intelligence-layer figure (22,709 km at May 2026), and the page labels both.

## 9. Cross-linking
* Programme → projects, nodes, opportunities, companies (location context only), corridors, signals, reports, related programmes.
* Industrial node dossier → "National programmes reaching this node" (also covers the DFC, which has no page yet).
* Infrastructure-projects table → programme per project.
* Signal pages → programme (`SignalAtlasLinks` now renders programme and opportunity links even when a signal has no node).
* AtlasNav → new **Infrastructure** group (Logistics & Mobility, Programme Intelligence, the three pilots, Industrial Nodes, Infrastructure Projects).

## 10. UI components
`app/research/programmes/ui.tsx` and the scoped `programmes.css` (`.pi-*`, `.lg-*`):

* Page frame: `SectionHead` (with claim-class tag), `StageChip`, `VerifChip`, `StageLadder` (announced → operational).
* Graph views: `NodePaths` (evidence path per node), `LogisticsSystem` (road → … → nodes), `SupplyPath`.
* Content blocks: `Consequences`, `OppCard`, `SignalCards` (with "why it is here"), `ProjectTable`, `RelatedProgrammes`.
* Navigation: `CrossCuttingDiagram`, `FlagshipCardView`.
* Reused: `IndustrialMap` for the footprint, plus `Cite` and `SourceList`.

The design uses the existing tokens, fine borders, 3–4 px radii, serif headings and no stock imagery.

## 11. SEO
* Unique title and description per page, canonical, Open Graph and Twitter tags (default OG image).
* Breadcrumb JSON-LD.
* Programme pages: `WebPage` about a `GovernmentService`, with node `mentions` and an FAQ (status, why it matters, nodes reached).
* Index: `CollectionPage` + `ItemList`.
* Gateway: `CollectionPage` with `hasPart` plus the existing `Dataset`.
* `app/sitemap.ts` lists the index and every programme page from the data file.

## 12. Validation
* `scripts/validate-programmes.mjs`, wired into `npm run build` after `validate-industrial`. It checks:
  * schema, ids and SID foreign keys;
  * provenance on every fact, dates, stage and relation vocabularies;
  * supply-chain order, regex patterns, report slugs and corridor slugs;
  * programme edges on projects, opportunities and signal links.
* `validate-industrial` now accepts a project or opportunity that leads to a programme instead of a node, and counts programme-layer citations.

Results:

* `validate-industrial`: 0 errors, 17 warnings — the same electronics-node warnings as before (unassessed supplier categories, no Atlas sector, unlinked suppliers).
* `validate-programmes`: 0 errors, 0 warnings.
* Scoring tests: 16/16 pass.

## 13. Build status
* `tsc --noEmit` is clean.
* ESLint is clean on all touched files. The repo's own ESLint config fails to load, so a temporary FlatCompat config was used, the same workaround as earlier.
* `next build` succeeds in the cloud clone with Google Fonts stubbed (the sandbox cannot fetch fonts). `app/layout.tsx` was restored afterwards.
* Playwright at 390, 768 and 1280 px across the index, three programme pages, the gateway, the Dholera dossier, the projects page and a linked signal:
  * no page errors and no broken internal links;
  * no horizontal overflow on any new page.
* **Fixed along the way:** the infrastructure-projects page did not load its table stylesheet, which caused mobile overflow.
* **Not fixed:** one existing signal (S-129) overflows on mobile because a long source URL does not wrap. It predates this work and was left as is.
* Not deployed. Cloudflare builds `main` once these changes are pushed.

## 14. Remaining work
* Pin the primary text for the two secondary-sourced figures: PIB PRID 2297818 (NPG 396 projects) and the Rajya Sabha reply of 22 Jul 2026 (22,709 km).
* Update the SID `logistics.programmes` records for Bharatmala, Sagarmala and Gati Shakti with the newer figures and URLs. This is a gated SID write and needs approval.
* Map Gati Shakti Cargo Terminal locations against industrial nodes.
* Add port coordinates for Mumbai and JNPA.
* Few signals name these programmes. The S-081 EDFC bypass signal should be curated to the DFC page in Phase 2.

## 15. Phase 2 recommendations
1. **Dedicated Freight Corridors page.** SID facts are already verified. Link the GCT layer, WDFC and EDFC stations, and the Sanand and Jewar nodes.
2. **Industrial Corridors (NICDP) page** that fronts `/corridors/` rather than duplicating it. Each corridor node becomes a programme-linked entity.
3. **ULIP page** built from the data-governance fields in the source registry (access model, API, licence). Clearly separate what ULIP exposes from what Techadyant uses.
4. Move `programme_links` into the SID (a `logistics.project_programme` edge table) when `logistics.projects` (v2) is populated, so programme edges bake with the rest of the graph.
5. Draft a programme-level scoring methodology (connectivity effect, supply-chain impact) in `docs/` before any score is shown.

## Files created / modified
**Created**

* `app/research/programmes/types.ts`
* `app/research/programmes/data.ts`
* `app/research/programmes/ui.tsx`
* `app/research/programmes/programmes.css`
* `app/research/programmes/page.tsx`
* `app/research/programmes/[slug]/page.tsx`
* `data/programme-intelligence/programmes.json`
* `scripts/validate-programmes.mjs`
* `docs/logistics-programme-intelligence-audit.md`
* `docs/logistics-programme-intelligence-implementation.md`

**Modified**

* `app/research/logistics/page.tsx` — gateway redesign
* `app/research/AtlasNav.tsx` — Infrastructure group
* `app/sitemap.ts`
* `package.json` — build chain and `validate:programmes`
* `app/research/industrial/types.ts` — `programme_links`, `programme_ids`, `related_programmes`
* `app/research/industrial/Backlinks.tsx`
* `app/research/industrial-nodes/page.tsx` and `[slug]/page.tsx` — opportunity links, programme back-links
* `app/research/infrastructure-projects/page.tsx`
* `scripts/validate-industrial.mjs`
* `data/industrial-intelligence/sources.json` (+13 sources)
* `data/industrial-intelligence/infrastructure-nodes.json` (+1)
* `data/industrial-intelligence/infrastructure-projects.json` (+2 projects, +3 programme links)
* `data/industrial-intelligence/opportunity-surfaces.json` (+3)
* `data/industrial-intelligence/signal-links.json` (+2)
