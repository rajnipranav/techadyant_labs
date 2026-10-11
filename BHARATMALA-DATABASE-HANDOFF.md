# BHARATMALA DATABASE HANDOFF — Techadyant Atlas

**Scope:** Bharatmala Pariyojana Comprehensive Highway & Industrial Connectivity Intelligence Database — research, build, validation and Atlas integration.
**Delivered:** 9 Oct 2026 · **Research window:** sources accessed 2026-10-09 · **Primary checkpoint:** Rajya Sabha AU414 (22 Jul 2026)
**Design rule obeyed throughout:** every number carries a source and a date; every relationship is evidenced or explicitly labelled as analysis; nothing was fabricated to fill a gap.

---

## 1. What this delivery is

Bharatmala was already integrated at programme level (`prog:bharatmala`, 2 linked projects, 1 opportunity surface, 5 sources, and a flagged data-quality gap: the May 2026 figures rested on a medium-confidence press report of a Rajya Sabha reply whose primary text was unpinned). This delivery deepens that existing graph rather than adding a parallel schema:

- **Pins the primary Rajya Sabha text** (AU414, answered 22 Jul 2026 — PDF captured and parsed) and upgrades the evidence chain for every programme aggregate, adding three previously unrecorded facts: **completion target 2028-29**, **expenditure Rs 5,63,779 crore till 30.06.2026**, and a **28-state/UT coverage annexure** (now the page's state coverage matrix).
- **Adds 6 new programme-linked projects** across the programme's components (expressways, economic corridors, port interface, border connectivity, urban efficiency) and **enriches** the existing Bengaluru–Chennai Expressway record.
- **Adds 7 infrastructure assets**, 2 explicit relationships, 1 evidenced industrial-node edge, 3 opportunity surfaces and 23 registry sources.
- **Adds a `state_coverage` capability** (optional programme field + validator + page section + CSV extract) and a **`contractors[]` capability** on projects (optional field + validator + projects-table column).
- **Keeps the industrial-node layer scoped as designed** (semiconductor/electronics profiles). Broader industrial consequences (steel, minerals, ports, border logistics) are carried at project, opportunity and programme level, where the existing model supports them without schema forks.

## 2. Files created and modified

**Created**
| Path | Purpose |
|---|---|
| `scripts/export-bharatmala-csv.mjs` | Regenerates the downloadable state-coverage CSV from `programmes.json` |
| `public/data/programmes/bharatmala-state-coverage.csv` | Committed static extract (provenance in header comments) |
| `BHARATMALA-DATABASE-HANDOFF.md` | This document |

**Modified — data**
| Path | Change |
|---|---|
| `data/industrial-intelligence/sources.json` | +23 sources (76 → 99): Rajya Sabha AU414 (primary, captured), 5 PIB releases, NHIDCL project status, MEIL, Business Standard, DD News, NDTV, Swarajya (DAK), India Today, India Infra Hub ×2, Wikipedia ×4, NHAI package status, Magicbricks |
| `data/industrial-intelligence/infrastructure-projects.json` | +6 projects; Bengaluru–Chennai Expressway enriched (alignment, state lengths, phases, cost estimate, districts incl. historical-name note, terminus node link) |
| `data/industrial-intelligence/infrastructure-nodes.json` | +7 assets (DME, DME JNPT spur, DAK, A–J, R–V EC, Dwarka, Zojila) |
| `data/industrial-intelligence/relationships.json` | +2 (Sriperumbudur ↔ BLR–Chennai Expressway; DME JNPT spur ↔ JNPA port) |
| `data/industrial-intelligence/industrial-nodes.json` | `inode:sriperumbudur-oragadam`: +1 fact (expressway terminus), `last_verified` bump |
| `data/industrial-intelligence/opportunity-surfaces.json` | +3 surfaces (DME warehousing consolidation; R–V mineral-belt export logistics; Ladakh all-weather logistics) |
| `data/programme-intelligence/programmes.json` | `prog:bharatmala`: glance +2 rows (Expenditure; Completion target), ledger +3 rows (Mar 2026 checkpoint; Expenditure series; 2028-29 target), timeline +5 entries, why_it_matters +2 claims, consequences +5 claims, gateway supply-chain step enriched, successor-framework gap evidenced (Rameshwar–Paradeep CCEA Jun 2026), data_gaps rewritten (the "primary text not pinned" gap is closed), new `state_coverage` matrix, `time_horizon` refreshed, `data_as_of` 2026-07-22, `last_verified` 2026-10-09 |

**Modified — code (all additive; no existing route or layout forked)**
| Path | Change |
|---|---|
| `app/research/industrial/types.ts` | +`ProjectContractor` interface; optional `contractors?` on `InfrastructureProject` |
| `app/research/programmes/types.ts` | +`StateCoverage`/`StateCoverageRow`; optional `state_coverage?` on `ProgrammeIntel` |
| `scripts/validate-industrial.mjs` | Contractors validation (name/role/evidence; provenance required for facts) |
| `scripts/validate-programmes.mjs` | `state_coverage` validation (dates, uniqueness, numeric columns, cross-foot vs declared totals — exact match required beyond a ±2 documented-rounding tolerance) |
| `app/research/programmes/ui.tsx` | ProjectTable gains a Contractors column + honesty caveat; new `StateCoverageTable` (bar column, declared-total row, note, CSV download link) |
| `app/research/programmes/[slug]/page.tsx` | New section **11 · Geographic coverage** (renders only when `state_coverage` exists); downstream sections renumbered; TOC gains "State coverage" |
| `app/research/programmes/programmes.css` | Styles for the coverage table and contractors cells |
| `data/industrial-intelligence/README.md` | Documents the `contractors[]` convention |

## 3. Schema changes and migrations

No database migrations (the Atlas is static-first; SID/Supabase untouched). Two **optional JSON fields** added with validator coverage:

- `InfrastructureProject.contractors?: { name, role, scope: string|null, evidence, provenance }[]`
- `ProgrammeIntel.state_coverage?: { as_of, note, provenance, rows: { state, total_km, awarded_km, constructed_km, under_construction_km }[] }`

Both are backward-compatible: absent fields change nothing for Gati Shakti / Sagarmala.

## 4. Counts (this layer)

| Metric | Count | Notes |
|---|---|---|
| Distinct projects in the industrial layer | 13 | 8 carry a `bharatmala` programme link (2 pre-existing + 6 new) |
| Package-level structure captured | DME: 52 packages / ~20 contractors (2 named); DAK: Packages 1–5 of a multi-package corridor; BLR–Chennai: 5 phases | Package registry beyond this remains with NHAI (gap, §9) |
| Highway / corridor entities (infra) | 38 total; 7 new | DME 1,386 km · DAK 667 km · A–J 1,256.95 km (EC-3) · R–V 465 km (EC-15) · Dwarka 29 km · Zojila 13.153 km · JNPT spur ~3 km |
| Industrial nodes | 6 (unchanged) | 1 new evidenced edge (Sriperumbudur ↔ BLR–Chennai Expressway); Dholera–NE-8 edge pre-existing |
| Contractor relationships | 3 named-company entries (G R Infraprojects, H G Infra, MEIL) + structure facts | Only where sources name them on the specific project |
| Opportunity surfaces | 12 (3 new) | All with sourced triggers, labelled chains, constraints, confidence |
| Sources | 99 (23 new) | 13 government/PSU/govt-agency (several with data-governance blocks), 1 company, 5 trade press, 4 reference |
| State coverage matrix | 28 states/UTs + declared total, as of 31 May 2026 | Single primary source (RS AU414 annexure) |

## 5. Geographic coverage

- **State-wise:** full 28-state matrix from the annexure (awarded column cross-foots exactly to 26,425 km). Largest awarded: UP 2,495 · Rajasthan 2,360 · Maharashtra 2,174 · MP 2,017 km. Largest pending: Punjab 672 · AP 382 · Karnataka 334 · UP 299 km under construction.
- **District-wise:** recorded per project where a source supports it (e.g. BLR–Chennai: Kolar, Chittoor, Vellore/Ranipet — historical name preserved with the bifurcation note; Dwarka: Dwarka/Gurugram; Zojila: Ganderbal/Kargil-Drass). A national district-level package inventory remains with MoRTH/NHAI and is declared as a gap.
- **Coverage honesty:** the matrix is programme totals per state at one date; it cannot separate Bharatmala lengths from other NH schemes — stated on the page and in the CSV.

## 6. Data-quality and verification distribution

- **Programme aggregates:** now **pinned to primary** (RS AU414 PDF parsed: 26,425/22,709 km; sanctions closed Nov 2023; target 2028-29; expenditure Rs 5,63,779 cr to 30.06.2026; delay causes; state annexure). The former medium-confidence chain (Swarajya reporting the reply) is retained as corroboration.
- **Known documented artefacts:** the annexure's state columns do not cross-foot perfectly (states sum to 34,801/22,708/3,717 vs declared 34,800/22,709/3,716). Reproduced as published; documented in the matrix note, the CSV header, and surfaced as validator warnings by design.
- **Medium-confidence programme links:** Delhi–Amritsar–Katra (`built_under` on secondary sources only — flagged in the record with an upgrade path); A–J and R–V are anchored by the official EC-3/EC-15 designations (Phase-I corridor list) plus government releases that name the corridors without the programme label — noted in sources.
- **Freshness:** all touched records `last_verified` 2026-10-09; validator 120-day freshness enforced.

## 7. Page implementation changes (live behaviour)

- **11 · Geographic coverage** — new fact-class section: sortable-by-nothing, deliberately a reproduced matrix with an awarded-length bar, declared-total row, full transcription note, numbered citation, reporting date and **CSV download**. Renders only when the field exists (other programmes unaffected).
- **Projects table** — new Contractors column with per-entry citations and the caveat "not documented ≠ none exists". DME shows G R Infraprojects (8 of 52 packages) + H G Infra; Zojila shows MEIL.
- **Auto-surfaced by the existing graph engine** (no per-programme hand-listing): 8 projects in the projects table; 10 road/system assets in the logistics system; 6 opportunity cards (3 new; 2 Dholera surfaces arrive via their shared NE-8 project, each card showing its reason); Zojila/DME/DAK/A–J/R–V/Dwarka in the delivery-record timeline; new facts in why-it-matters and consequences, all tagged Fact/Analysis with bracketed source links.
- **Sriperumbudur node dossier** now shows the Bengaluru–Chennai Expressway connectivity edge and terminus fact — the second evidenced programme→node path on the page (with Dholera).

## 8. Tests and build checks actually performed

| Check | Result |
|---|---|
| `node scripts/validate-industrial.mjs` | ✓ 0 errors · 17 warnings (all pre-existing electronics-node/supplier-map warnings) |
| `node scripts/validate-programmes.mjs` | ✓ 0 errors · 3 warnings (the documented annexure rounding artefacts — intentional) |
| `npx tsc --noEmit` | ✓ exit 0 |
| `npx next build` (static export, full site) | ✓ succeeded; 459+ routes prerendered |
| Generated-page inspection (HTML) | Coverage section, 29 rows, declared-total row, contractors column, all new projects/timeline/facts present; CSV present in export |
| **Browser verification** (agent-browser on the built site) | Page renders; 15 TOC items; TOC "State coverage" anchor navigates; coverage table 29 rows; projects table 8 rows with contractors; 6 opportunity cards; CSV link serves; no page errors |
| Regression | Gati Shakti, Sagarmala, programmes index, Sriperumbudur node pages all HTTP 200 and rendering |
| `npm run lint` | ✗ **pre-existing failure on the pristine tree too** (ESLint 9.x vs `eslint-config-next` `extends` incompatibility — unrelated to this delivery; untouched) |
| Not run | `npm run build` end-to-end (includes CMS/Supabase sync + IndexNow — requires credentials and performs external submissions; deliberately not executed from this environment). Documented for the maintainer. |

## 9. Major gaps and unresolved discrepancies (declared, not hidden)

1. **Package-level inventory** — MoRTH/NHAI sanction- and award-level package records are not in the Atlas; the state matrix is the finest geographic resolution carried. Next-phase target.
2. **Component-wise progress after March 2023** — not published in the sources captured; the component ladder still cites the PAC audit for progress percentages.
3. **DAK Bharatmala classification** rests on secondary sources; no primary sanction document captured yet (flagged in the record).
4. **A–J / R–V programme label** — anchored by the official 2017 EC list (via a reproduced table; the archive.pib.gov.in PDF was unreachable from the research environment — noted in the source record).
5. **Phase-II (48,877 km)** appears in secondary coverage; **no formal approval captured** — treated as unapproved, with the observed post-Phase-I pattern being standalone CCEA approvals (Rameshwar–Paradeep, Jun 2026, evidenced).
6. **SID layer lag** — the SID `bharatmala` fact record still carries Feb 2025 metrics (Rs 4,92,562 cr; 19,826 km). Updating it is a gated SID write (`supabase/logistics-*.sql` + rebuild) left to the maintainer; the intel layer labels both dates.
7. **Chennai Port–Maduravoyal** was researched and deliberately **excluded** (no Bharatmala classification in its primary coverage) — recorded here so the decision is auditable.
8. **No coordinates** for the new linear assets (kept null with "linear asset" notes rather than invented geometry).

## 10. Update instructions

- **Refresh aggregates:** when MoRTH publishes new Bharatmala numbers, update `prog:bharatmala` glance/ledger (keep the old rows — the ledger is historical), add a timeline entry, and re-run `node scripts/export-bharatmala-csv.mjs` if the matrix changed.
- **Add a project:** append to `infrastructure-projects.json` with a `programme_links` entry (`programme_id: "bharatmala"`, provenance required), an `infra:` asset, and facts with sources; the page picks it up on the next build. Name contractors only where a source names them.
- **Validate:** `npm run validate:industrial && npm run validate:programmes`, then `npx next build`.

## 11. Recommended next research phase

1. **Package registry (Tier B completion):** pull the NHAI Data Lake project-level records for the largest corridors (DME, DAK, A–J, BLR–Chennai) — package IDs, EPC values, awarded dates, contractors — replacing the two named-contractor entries with a full evidenced table.
2. **SID refresh (gated write):** update `logistics.programmes.bharatmala` to the Jul 2026 checkpoint (expenditure 30.06.2026; constructed May 2026; target 2028-29).
3. **Pin the remaining primaries:** DAK sanction document; the PIB Oct 2017 corridor-list PDF (via archive); the Rajya Sabha AU1212 twin annexure.
4. **Industrial-node expansion:** as the Atlas's node universe grows beyond semiconductor/electronics profiles, wire Raipur–Visakhapatnam's mineral-belt nodes (e.g. Nagarnar steel) through the same evidenced-edge discipline.
5. **Component re-baseline:** when MoRTH publishes post-2023 component-wise progress, replace the PAC-derived percentages.
