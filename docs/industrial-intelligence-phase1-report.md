# Industrial Intelligence & Connectivity Layer — Phase 1 Implementation Report

**Date:** 8 Oct 2026 · **Scope:** semiconductor pilot · **Status:** built and verified locally; **not deployed** (nothing is live until the change is merged to `main` and Cloudflare rebuilds).

## 1. Repository audit (before)
Next.js 15 static export on Cloudflare Pages. The Atlas lives under `/research` and is baked from SID (`_atlas.json`); Signals and Reports are CMS-generated; NICDP corridors have ~39 hand-curated node dossiers (`app/corridors/node-data.ts`) with free-text infrastructure and no connectivity model. Semiconductor coverage for the pilot nodes already existed in three unjoined places (SID players, the Dholera corridor dossier, five Signals). SID holds duplicate records for several pilot companies. No test framework; `eslint .` fails at baseline because of a flat-config/eslintrc mismatch. Full audit: `docs/industrial-intelligence-integration.md` §1–4.

## 2. Architecture (added, and why)
A cross-cutting layer, not a new microsite or a GatiShakti clone: static, SID-shaped JSON (`data/industrial-intelligence/`) → one loader (`app/research/industrial/data.ts`) → static pages under the existing Atlas. JSON-in-git was chosen over SID because SID writes are approval-gated and the layer is small and editorial; the loader is the only thing that changes on a later SID migration. No new dependencies; no server; ~2.7 kB client JS on the hub (map filter only).

## 3. Data model
Entities: Industrial Node · Infrastructure Node · Infrastructure Project · Opportunity Surface · Source (registry) · Relationship · ITLA placeholder · SME-champion placeholder. External references by ID: `player:<sid-uuid>`, `corridor-node:<c>/<n>`, `sector:<code>`, `report:<slug>`, `signal:<slug>`.
Relationship types (registry in `types.ts`, extensible by one line): `located_in, anchors, overlaps_with, specialises_in, connected_by, served_by, on_freight_corridor, nearest_port, nearest_airport, connected_to, improves_connectivity_of, affects, creates, potentially_benefits_from, depends_on, part_of`. Each edge carries evidence class (fact / derived / analysis), confidence and provenance. Standardised `connectivity` object (road, rail, ports, airports, waterways, logistics_nodes, freight_corridors) is built by the loader from edges.

## 4. Data sources
37 registry entries; primary government sources dominate: PIB Cabinet releases for every ISM project, PIB/MoRTH (NE-8), PIB/Railways (Sarkhej–Dholera, EDFC), PMO (Micron, WDFC, ITLA, SME Growth Fund), JICA (WDFC completion — independent second source), DFCCIL, GIDC, All India Radio. Trade press is used only where no primary was found and is marked low/medium confidence (Dholera airport status, Noida cargo start, Kaynes production date). Governance findings: **PM GatiShakti Public** = self-registration, 230 non-sensitive datasets, no published licence or redistribution terms → not ingested; **ULIP** = NDA-gated → not used; **ITLA** = no public data yet. Retrieval date 8 Oct 2026 throughout.

## 5. Methodology
ICS and CGI are computed; SCCS, IOS and SNS are fully defined but read *Insufficient Data* because their inputs (node-level supplier mapping, export relevance, graph centrality) are not yet collected. Unknown ≠ zero; 70% completeness gate; scores rounded to 5; distances straight-line, banded, labelled. Details: `docs/industrial-connectivity-methodology.md` and `/research/industrial-nodes/methodology/`.

## 6. Pilot
| Node | ICS | CGI | Notes |
|---|---|---|---|
| Dholera (GJ) | 55 Moderate (medium conf.) | 60 High gap | Expressway on trial; rail 2030-31; airport under construction |
| Sanand (GJ) | 85 Very strong (medium) | Insufficient Data (55%) | WDFC station dedicated 8 Sep 2026; 3 OSATs in production |
| Jewar–YEIDA (UP) | 75 Strong (medium) | Insufficient Data (55%) | Cargo airport live before the OSAT; seaports >900 km |
| Jagiroad (AS) | 45 Moderate (medium) | Insufficient Data (45%) | ~85 km to cargo airport, ~580 km to seaport, no DFC |
Plus 21 infrastructure assets, 5 projects, 23 explicit relationships (+ synthesised), 6 opportunity surfaces (one cross-node: Linde's Dholera–Sanand gas network).

## 7. UI
- `/research/industrial-nodes/` — positioning, analytical chain, schematic SVG map with layer/state filters and intelligence card, node cards, opportunity list, "Why not just use PM GatiShakti?", ITLA/SME/Phase-2 panel.
- `/research/industrial-nodes/[slug]/` — full dossier: scores, strategic overview, key facts, ecosystem (linked players), connectivity by mode, supply-chain position, dependencies, CGI/ICS breakdowns, opportunity surfaces with labelled chains, projects, signals, reports, data gaps, numbered sources. Every section carries a FACT / TECHADYANT ANALYSIS / TECHADYANT SCORE / OPPORTUNITY SURFACE label.
- `/research/industrial-nodes/methodology/` — score definitions rendered from `scoring.ts` + the public source registry with governance terms.
- `/research/infrastructure-projects/` — project → industrial consequence tracker.
SEO: unique titles/descriptions, canonicals, OpenGraph, JSON-LD (BreadcrumbList, Place with GeoCoordinates, ItemList, FAQPage), sitemap and llms.txt entries.

## 8. Cross-linking
Node → players (primary SID record, duplicates flagged), corridor dossier, sectors, infrastructure, projects, opportunities, signals, reports. Back-links added: player pages (`PlayerIndustrialLinks`), signal pages (`SignalAtlasLinks`, via `signal-links.json` — 7 signals), corridor node pages (`CorridorNodeDossierLink` — Dholera SIR, Dadri–Boraki). Each renders nothing outside the pilot, so other pages are unchanged.

## 9. Validation
`scripts/validate-industrial.mjs` (plain JS, runs first in `npm run build`): duplicate IDs/slugs, ID prefixes, required fields, provenance → registry, malformed URLs, ISO dates, India bounding box + coordinate provenance, relationship types and broken references (incl. SID players, corridor nodes, reports, signals, sectors), score-input ranges, derive targets, CGI profile keys, ITLA-tier/cost consistency, opportunity chain rules, SME `sgf_status` guard, orphans, stale data (>120 days). Current result: **0 errors, 6 warnings** (all six are SID duplicate-record merge candidates).
`scripts/test-industrial-scoring.mjs`: 13 tests (weights sum to 100, doc mirrors code, rounding, haversine, monotone bands, missing≠zero, threshold, confidence rule, 0–100 fuzz, golden pilot values) — **13/13 pass**.

## 10. Limitations / data gaps
Approximate coordinates (±10–15 km) for most points; New Sanand (N) station location unpublished; Dholera airport date and Noida cargo start single-source; Jagiroad road/rail facts from a gazetteer; no MMLP/ICD inventory; power, water and warehousing unassessed for three nodes; SID duplicates. Signal links only render for signals present in the synced `data.ts` (ITLA/SME signal S-144 is not in the committed snapshot).

## 11. Recommended Phase 2 (prioritised)
1. Replace approximate coordinates with authority-published ones; upgrade gazetteer facts to primary sources.
2. Merge SID duplicates (Micron, CG Semi, Kaynes, TSAT, India Chip, Tata fab).
3. Node-level supplier mapping → unlock SCCS and IOS.
4. National MMLP/ICD/port registry (public sources only) → better logistics component.
5. Add `related_entities` to `cms_signals`; retire `signal-links.json`.
6. Electronics nodes (Noida/Greater Noida EMS, Sriperumbudur, Hosur), then defence corridors (UP, TN), drones, aerospace, solar, EV.
7. Migrate to SID (`industrial_export()` + `bake-industrial.mjs`) once the entity count justifies it.
8. Tracker filters once projects > ~15.

## 12. Files changed
New: `docs/industrial-intelligence-integration.md`, `docs/industrial-connectivity-methodology.md`, `docs/industrial-intelligence-phase1-report.md`, `data/industrial-intelligence/{README.md,sources.json,industrial-nodes.json,infrastructure-nodes.json,infrastructure-projects.json,relationships.json,opportunity-surfaces.json,signal-links.json,itla.json,sme-champions.json}`, `app/research/industrial/{types.ts,scoring.ts,geo.ts,data.ts,ui.tsx,IndustrialMap.tsx,Backlinks.tsx,industrial.css}`, `app/research/industrial-nodes/{page.tsx,[slug]/page.tsx,methodology/page.tsx}`, `app/research/infrastructure-projects/page.tsx`, `scripts/{validate-industrial.mjs,test-industrial-scoring.mjs,apply-industrial-integration.py}`.
Modified (small anchored insertions via `apply-industrial-integration.py`): `app/research/AtlasNav.tsx`, `app/research/page.tsx`, `app/research/players/[slug]/page.tsx`, `app/signals/[slug]/page.tsx`, `app/corridors/[slug]/[node]/page.tsx`, `app/sitemap.ts`, `app/llms.txt/route.ts`, `package.json`.

## 13. Build status (clean clone of `origin/main` @ `cd49ac2` + this change, Node 22)
| Check | Result |
|---|---|
| `validate:industrial` | ✅ 0 errors, 6 warnings |
| `test:industrial` | ✅ 13/13 |
| `tsc --noEmit` | ✅ |
| ESLint on new/changed files (temporary flat config) | ✅ new files clean; pre-existing issues remain in host files (`signals/[slug]` `any` types, one unescaped `'` in corridor node page, an unused import in `research/page.tsx`) |
| `npm run lint` (repo config) | ❌ pre-existing config failure, unrelated |
| `next build` | ✅ all routes static (hub 2.73 kB client JS). Run with Google-font imports temporarily stubbed because `fonts.googleapis.com` is unreachable from the build sandbox — same constraint as the 5 Oct handoff; stub never committed |
| Visual QA (Playwright, 1360 px + 390 px) | ✅ no horizontal overflow on new pages, no console errors; back-links render on player, signal and corridor pages |
| Deployment | **Not performed.** |
