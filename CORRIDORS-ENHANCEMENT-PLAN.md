# Corridors Section — Enhancement & Elevation Plan

Prepared: 2026-08-16 (after full audit: code, data layer, live DOM measurements at 390px/1440px, and screenshot review).

## Audit summary — what's strong

- **Data layer is rich**: all 11 corridors have Readiness Scores (4 axes), tiers, SPV/funding/DFC/investment/jobs; **38 deep nodes** carry stage, area, investment, jobs, sectors, companies+commitments, infrastructure, incentives, timeline, sections, sources; deep-dive "view" paragraphs exist for all 11.
- **SEO/GEO already strong**: ItemList, datasetLd, faqLd, Place + Organization JSON-LD per node; canonicals; rich metadata.
- **Dholera is the standout**: the only node with a satellite opportunity map (anchor projects → supplier ecosystem "bloom"), plan overlay, and full-screen mode.

## Audit findings — the gaps

### A. Broken / unprofessional on mobile (verified, not guessed)
1. **Dholera map mobile is genuinely broken**: the header badge (`max-width:58%`) overflows and reads as stray text fragments ("…bloom its opportunity…"); the draft-plan layer + provenance overlay are ON by default and cover the map and legend; zoom/opacity controls crowd the 422px map; anchor labels (Tata Electronics / PSMC / ReNew) overlap. Confirmed by screenshot review + source (`public/maps/dholera-sir.html`).
2. **CorridorGLMap has no resize/orientation handler** — MapLibre renders stale after rotation or viewport change; the controls bar wraps to ~146px tall on mobile, leaving less map.
3. **Index hero is 1,177px tall on mobile** (abstract animated canvas map + 11-corridor list stack) — a huge dead scroll before any real content. The canvas "network" map (INDUSTRIAL CORE / FABRICATION / POWER nodes) is decorative and sits confusingly next to the real geographic GL map on the same page.

### B. Missing professional/investor artifacts
4. **No cross-corridor comparison table** — the single most useful investor artifact (11 corridors side-by-side: status, score, length, states, anchor nodes, investment) doesn't exist. All the data is already in `corridor-intel.ts` / `data.ts`.
5. **No methodology explainer** for the proprietary Readiness Score → trust gap.
6. **No freshness stamp / source line** on the index (dossiers do carry "Source: DPIIT/NICDC…" deep in the page).
7. **"Deep-dive analysis in progress" placeholders** on some corridor dossiers read as unfinished product.
8. **No data export** (CSV of the 38-node dataset) for analysts.
9. **No stage filter** on dossier anchor-node cards; index has no state/node-level filtering.

### C. Elevation — the pain points only Dholera solves today
10. Dholera answers "**what can I supply here / what pulls this ecosystem**". The other 37 nodes answer almost nothing beyond stats — no supplier-opportunity surface, no plan context, no satellite map (only centroid-approximate dots on the GL map).
11. No **"what changed this quarter"** feed per corridor (DPIIT/NICDC publish monthly status reports; the site is static vs their cadence).

## Proposed work

### Phase 1 — Fix (ship first, ~1 commit)
- CorridorGLMap: add ResizeObserver + orientationchange → `map.resize()`; compact the mobile control bar (smaller chips, legend inline); min-height guard.
- Index hero mobile: collapse the decorative canvas map (hide below ~880px or move after the corridor list); cut hero height ~40%.
- Dholera map mobile: badge full-width with proper wrapping; plan layer + provenance **off by default** (toggle to show); compact controls into one row; reduce label overlap (smaller labels / higher halo); map ≥55% of viewport.
- Replace "Deep-dive analysis in progress" with the intel fallback (content exists in `corridor-intel.ts`).

### Phase 2 — Professional polish (1–2 commits)
- **Cross-corridor comparison table** on the index (11 × status, readiness score w/ tier color, length, states, anchor count, top node, investment, jobs) — pure data-layer work, plus Table JSON-LD for GEO.
- **Readiness methodology**: short inline explainer + link (new `/corridors/methodology/` page or inline block).
- **Freshness stamp + sources** line on index: "Sources: DPIIT/NICDC status report (30 Nov 2025) + PIB/India Investment Grid · Updated Aug 2026".
- **Node cards: stage filter chips** (All / Operational / Construction / Approved / Planned) on each dossier.
- **CSV export** of the 38-node dataset (build-time static file in `public/`, linked from index + node pages).

### Phase 3 — Elevation (pain-point parity beyond Dholera)
- **Replicate the opportunity-map pattern** for 3 flagship nodes (Sanand, Shendra–Bidkin/AURIC, Greater Noida IITGNL): satellite map + anchor projects + supplier-opportunity bloom + plan overlay, reusing the `dholera-sir.html` architecture.
- **"What this node pulls" supplier-opportunity block for all 38 nodes** (text version: consumables, sub-assembly, testing, facility services the anchor ecosystem demands) — so every node answers "what can I supply here?".
- **Quarterly delta feed** per corridor ("What changed in Q3 2026") from DPIIT/NICDC monthly reports; surfaced on dossiers + index.
- **State filter** on the index (click a state → its corridors + nodes).

## Sequencing / effort
- Phase 1: half a day; highest impact on the user's two explicit complaints (professional touch + mobile map).
- Phase 2: ~1 day; the comparison table is the flagship add and doubles as a GEO artifact.
- Phase 3: ongoing; Dholera parity is the differentiator that makes the section a destination, not a directory.
