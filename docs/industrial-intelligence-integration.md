# Industrial Intelligence & Connectivity Layer — Integration Architecture

**Status:** Phase 1 (semiconductor pilot) · **Written:** 8 Oct 2026 · **Owner:** Techadyant Labs
**Positioning:** *From Infrastructure Maps to Industrial Intelligence.* We don't replicate India's infrastructure databases. We interpret them.

This is the internal implementation document required before any large change. It records what existed, what was added, and why. Companions: `docs/industrial-connectivity-methodology.md` (scores), `docs/industrial-intelligence-phase1-report.md` (what shipped), `data/industrial-intelligence/README.md` (data + source registry).

---

## 1. Existing relevant architecture (audit, 8 Oct 2026)

| Area | What exists | Where |
|---|---|---|
| Framework | Next.js 15 App Router, **`output: 'export'`** (fully static), `trailingSlash: true`, deployed on **Cloudflare Pages from `main` only** | `next.config.ts`, `COWORK-HANDOFF.md` |
| Build pipeline | `sync-cms-to-data` → `bake-sid` → `bake-platform` → `prune-redirects` → `next build` → `indexnow-submit` | `package.json` |
| Atlas core | 6 scored ecosystems (semiconductors, critical minerals, AI infra, defence, enterprise software, AI medtech) × value-chain layers; 0–5 capture status; players; relationships; events. **Baked from SID** (Supabase `n8ndb`, schema `sid`) via `public.atlas_export()` → `app/research/_atlas.json`. **Never hand-edited.** | `app/research/atlas.ts`, `_atlas.json` |
| Atlas routes | `/research` overview, `/research/pillars/*`, `/research/players/[slug]`, `/research/dependencies`, `/research/entities/[slug]`, `/research/e/[kind]/[slug]`, `/research/explorer`, `/research/search`, `/research/supply-chains`, `/research/suppliers`, `/research/datasets` (uncommitted on the owner's machine), `/research/sources`, `/research/methodology` | `app/research/**` |
| Defence pillar | Army / Navy+CG / Air Force / High-Altitude atlases with their own JSON + entity dossiers | `app/research/pillars/defence/**` |
| Drones / C-UAS / aerospace / space | Separate baked JSON per pillar (`_drones.json`, `_cuas.json`, `_aerospace.json`, `_space.json`) | `app/research/*` |
| Knowledge-graph model | `AtlasGraphEntity` / `AtlasGraphEdge` with kinds incl. `industrial_corridor`, `opportunity_surface`, `supply_chain`; `curated-seed.ts` adds 8 sector-level opportunity surfaces | `app/research/graph-types.ts`, `graph.ts`, `curated-seed.ts` |
| **Industrial corridors** | 11 NICDP corridors, ~39 node dossiers (`DeepNode`: stage, area, cost, companies, infrastructure prose, sources) incl. **Dholera SIR**, IITGNL, Dadri–Boraki MMLH; corridor Readiness Score (4 axes); sector → supplier "pull" taxonomy; MapLibre satellite map + SVG maps | `app/corridors/node-data.ts`, `corridor-intel.ts`, `opportunity.ts`, `geo.ts`, `CorridorGLMap.tsx`, `CorridorNodeMap.tsx` |
| Geometry | Canonical SVG India outline (`VIEWBOX 0 0 550 563.58`) + WGS84 node coordinates with a `CoordSource` provenance tag (`gis` / `gazetteer` / `verified`) | `app/corridors/data.ts`, `geo.ts` |
| Signals | **CMS-generated** (`cms_signals` → `app/signals/data.ts` on every build). Hand-maintained side maps are allowed and precedented: `signals/report-links.ts` (signal → report) | `app/signals/**` |
| Reports | `cms_reports` → `app/reports/data.ts`; executive summaries as components | `app/reports/**` |
| Verification vocabulary | `verified` / `single_source` / `modelled` / `unverified`; `VERIFICATION_DEFINITIONS` in `insights.ts`; node-data uses `[V]/[V1]/[U]` tags | `app/research/insights.ts`, `graph-types.ts` |
| SEO helpers | `JsonLd`, `breadcrumb`, `faqLd`, `datasetLd`, `SITE` | `app/research/seo.tsx` |
| Design system | Dark-first tokens (`--bg`, `--surface`, `--rule`, `--brass` …), `.ed-page-head`, `.wrap`/`.wrap-narrow`, `.node-*` dossier classes, `.atlas-card`, mono kickers, serif ledes | `app/globals.css` |
| Tests | **No test framework.** Quality gates are `tsc --noEmit`, `eslint`, `next build` | — |

### Notable audit findings
- **Semiconductor pilot coverage already existed in three disconnected places:** SID players (`Sanand semiconductor cluster`, `Jagiroad semiconductor cluster`, `Tata Semiconductor Fab, Dholera`, `Micron ATMP Sanand`, `India Chip (HCL-Foxconn JV)` …), the Dholera corridor-node dossier, and live Signals (S-011 Jewar, S-012 Dholera water, S-062 Sanand, S-113 Dholera vendor park, S-130 Linde Sanand). Nothing joined them. **That join is the product.**
- **SID duplicates** for one real-world entity (three CG Semi records, three Micron records, two TSAT records, two India Chip records, two Kaynes Semicon records). The new layer links to *all* known IDs per entity and flags this for a SID merge (`scripts/sid-merge-duplicates.py` exists) rather than silently picking one.
- Corridor nodes and the Atlas had **no connectivity model** — infrastructure lived in free-text `infrastructure[]` and `nearest` strings, with unlabelled distances (road vs straight-line unknown).
- A previous brief (`../zai-logistics-atlas-brief.md`) proposed a separate **SID `logistics` schema + `/research/logistics`** module. That is complementary: it models national freight programmes; this layer models *what connectivity means for industrial nodes*. §5 keeps the two compatible.
- `npx eslint .` fails at baseline (flat-config / `.eslintrc.json` mismatch with ESLint 9) — pre-existing, not introduced here.
- Local `node_modules` on the owner's machine is a pnpm/Windows junction tree unreadable from Linux; verification builds ran in a clean container from `origin/main` (`cd49ac2`).

## 2. Existing reusable datasets

| Dataset | Reuse in this layer |
|---|---|
| `_atlas.json` players + relationships | Companies/facilities/clusters are **referenced by SID player ID**, never copied. Slugs resolved at build via `playerSlug()` |
| `corridors/node-data.ts` | Industrial nodes that are also NICDP nodes (Dholera) **reference** the corridor dossier (`corridor_node_refs`) instead of duplicating area, cost and tenant tables |
| `corridors/geo.ts` | Dholera's `verified` coordinate and Dadri MMLH's `gis` coordinate reused with their provenance tag |
| `corridors/opportunity.ts` | Sector "pull" layers stay the sector-generic surface; new **Opportunity Surfaces** are node-specific, triggered, evidence-linked hypotheses — a complementary object |
| Signals + `report-links.ts` pattern | Signal → entity links held in a hand-reviewed side map (`signal-links.json`), never written into the CMS-generated `data.ts` |
| Reports catalogue | Reports linked by slug; validator checks they exist |

## 3. Existing reusable components
`AtlasNav`, `JsonLd`/`breadcrumb`/`faqLd`, `.ed-page-head`, `.node-stats`/`.node-facts`/`.node-h2`/`.node-sources`/`.node-chips`/`.node-timeline`/`.node-companies`, `.atlas-cards`, `INDIA_OUTLINE` SVG path. No new dependency was needed — the map is a static SVG with a small client-side filter, not MapLibre.

## 4. Missing capabilities (before Phase 1)
1. A **connectivity object** per industrial node (road / rail / ports / airports / waterways / logistics nodes / freight corridors) with typed distances.
2. **Infrastructure nodes** and **infrastructure projects** as first-class, sourced entities.
3. A **typed relationship registry** across Atlas players, corridor nodes, infrastructure, projects, opportunity surfaces, signals and reports.
4. **Provenance at fact level** (source registry + per-fact references + fact / analysis / score separation).
5. **Transparent scores** with completeness thresholds and an explicit *Insufficient Data* state.
6. **Build-time validation** for referential integrity, provenance, coordinates and score ranges.
7. Back-links from players, signals and corridor-node dossiers into the new layer.

## 5. Architecture (implemented in Phase 1)

```
PUBLIC SOURCES (PIB, PMO, ministries, DFCCIL/JICA, GIDC, AIR …)
   │  read and cite — never bulk-copied        ── sources.json (source registry)
   ▼
FACTS (dated, sourced)                          ── industrial-nodes.json · infrastructure-nodes.json · infrastructure-projects.json
   ▼
RELATIONSHIPS (typed, evidence-classed)         ── relationships.json  (fact | derived | analysis)
   ▼
DERIVED METRICS                                 ── straight-line distances computed at build from coordinates (labelled, banded)
   ▼
TECHADYANT SCORES                               ── scoring.ts (ICS, CGI computed; SCCS, IOS, SNS defined → Insufficient Data)
   ▼
OPPORTUNITY SURFACES (hypotheses)               ── opportunity-surfaces.json (trigger → effect chain → constraints)
   ▼
SURFACES                                        ── /research/industrial-nodes/ · /[slug]/ · /methodology/ · /research/infrastructure-projects/
                                                   + back-links on players, signals, corridor-node dossiers
```

**Storage decision — static JSON in git, not SID (Phase 1).** (a) SID writes are gated on owner approval (`COWORK-HANDOFF.md`); (b) the layer is small and editorially curated; (c) static JSON is reviewable in PRs and free on Cloudflare. The schema is **SID-shaped** (string IDs, typed edges, source-link semantics), so Phase 2 can migrate to SID tables + an `industrial_export()` RPC + `bake-industrial.mjs` without touching pages — the loader (`app/research/industrial/data.ts`) is the only seam.

**Entity ID convention:** `inode:<slug>`, `infra:<slug>`, `proj:<slug>`, `opp:<slug>`; external refs `player:<sid-uuid>`, `corridor-node:<corridor>/<node>`, `sector:<atlas corridor code>`, `report:<slug>`, `signal:<slug>`. Relationship types live in a registry (`RELATIONSHIP_TYPES` in `types.ts`) — adding a type is one entry, no restructuring.

**Compatibility with the logistics-atlas brief:** `infrastructure-nodes.json` ≈ `logistics.nodes`; `infrastructure-projects.json` ≈ `logistics.projects` (incl. the ≥ ₹500 cr ITLA-appraisal-tier flag); `sources.json` ≈ `logistics.sources`. If that module ships in SID, this layer switches its loader to the baked JSON.

**ITLA and SME Growth Fund** are modelled as *compatibility placeholders* (`itla.json`, `sme-champions.json`): the institutions and their officially stated data scope are recorded; **no dataset is fabricated**, and no SME is labelled as SGF-eligible.

## 6. Files modified
| File | Change |
|---|---|
| `app/research/AtlasNav.tsx` | +2 links under *Data* (Industrial Nodes, Infrastructure Projects) |
| `app/research/page.tsx` | +1 entry block linking to the new layer |
| `app/research/players/[slug]/page.tsx` | +back-link block (industrial nodes the player is linked to) |
| `app/signals/[slug]/page.tsx` | +"In the Atlas" block for signals linked to industrial nodes |
| `app/corridors/[slug]/[node]/page.tsx` | +link from a corridor node to its connectivity dossier |
| `app/sitemap.ts`, `app/llms.txt/route.ts` | +new URLs |
| `package.json` | +`validate:industrial`, `test:industrial`; validator runs first in `build` |

## 7. New files
- `data/industrial-intelligence/` — `sources.json`, `industrial-nodes.json`, `infrastructure-nodes.json`, `infrastructure-projects.json`, `relationships.json`, `opportunity-surfaces.json`, `signal-links.json`, `itla.json`, `sme-champions.json`, `README.md`
- `app/research/industrial/` — `types.ts`, `scoring.ts`, `geo.ts`, `data.ts`, `ui.tsx`, `IndustrialMap.tsx`, `Backlinks.tsx`, `industrial.css` (scoped `.ii-*` styles; `globals.css` untouched)
- `app/research/industrial-nodes/page.tsx`, `[slug]/page.tsx`, `methodology/page.tsx`
- `app/research/infrastructure-projects/page.tsx`
- `scripts/validate-industrial.mjs`, `scripts/test-industrial-scoring.mjs`, `scripts/apply-industrial-integration.py` (idempotent, anchored edits to the host files above)
- `docs/industrial-intelligence-integration.md`, `docs/industrial-connectivity-methodology.md`, `docs/industrial-intelligence-phase1-report.md`

## 8. Data migration implications
- **None for existing data.** No SID row, CMS row, `_atlas.json`, `signals/data.ts` or `node-data.ts` record is altered.
- Future SID migration: one table per JSON file + a `record_sources` link table; IDs carry over unchanged.
- Merge SID duplicate players *before* migrating; the validator will then flag any now-dangling player IDs.
- If Signals gain a CMS `related_entities jsonb` column, `signal-links.json` becomes the fallback and can be retired.

## 9. Risks
| Risk | Mitigation |
|---|---|
| Being read as a GatiShakti clone | No base-layer GIS; only industrially relevant infrastructure *referenced* by a node; every page leads with interpretation and answers "Why not just use PM GatiShakti?" |
| Redistributing restricted data | PM GatiShakti Public is self-registration, non-sensitive datasets only, terms unpublished; ULIP is NDA-gated → **neither is ingested**. Only public press releases and official pages are cited |
| False precision | Distances banded and labelled straight-line; scores rounded to 5; completeness < 0.70 ⇒ *Insufficient Data* |
| Approximate coordinates | Each coordinate carries `coord_source` + confidence; validator rejects values outside India's bounding box |
| Analysis read as fact | Four visual classes (FACT / TECHADYANT ANALYSIS / TECHADYANT SCORE / OPPORTUNITY SURFACE) on every dossier |
| Staleness | `last_verified` + `data_as_of` per entity; validator warns at > 120 days |
| Thin pages | Four dossiers only; opportunity surfaces render inside dossiers, no standalone thin pages |
| SID duplicates | Linked as a set and flagged |

## 10. Implementation sequence (followed)
AUDIT → ARCHITECT → RESEARCH (primary sources, Oct 2026) → MODEL (types + JSON) → PILOT (4 semiconductor nodes) → VALIDATE (script + scoring tests) → INTEGRATE (nav, back-links, sitemap) → DOCUMENT (phase-1 report).

### Pilot node selection
| Node | Why selected | Existing coverage |
|---|---|---|
| **Dholera** (GJ) | India's only approved commercial logic fab; NICDP node; three dated connectivity projects (NE-8 expressway, Sarkhej–Dholera rail, airport) | corridor dossier, SID fab + Tata records, S-012, S-113, 3 reports |
| **Sanand** (GJ) | Three ISM units in commercial production (Micron, Kaynes, CG Semi); WDFC New Sanand (N) section dedicated 8 Sep 2026 | SID cluster + 9 player records, S-062, S-130 |
| **Jewar / YEIDA** (UP) | HCL–Foxconn India Chip OSAT; Noida International Airport cargo operations from Jun 2026 | 2 SID records, S-011, S-045 |
| **Jagiroad** (AS) | Tata TSAT ₹27,000 cr OSAT; the only pilot far from the western freight spine — it tests the gap logic | SID cluster + 2 TSAT records |

Not selected for Phase 1: Bengaluru, Hyderabad, Chennai (design- or EMS-led; no single industrial-node boundary), Bhubaneswar (SiCSem / 3DGS — Phase 1.5 candidate once project status is primary-sourced).
