# Home Page — Enhancement & Elevation Plan

Prepared: 2026-08-16 (after code audit of `app/page.tsx`, site-wide section inventory, and data-layer counts).

## Status: Phase A DONE (commit 242229e, live 2026-08-16) — hero rework, seven-surface platform strip, platform stats band, corridors teaser, dependencies heatmap, services band, Sanket spotlight. Phase B & C pending.

## Why this plan exists

The home page currently reads as **"a research-reports publication"** — and the site is much more than that. A first-time visitor sees: a research hero, report-centric stats, a featured report, signals, atlas cards, briefings, newsletter, about. **Five of the platform's assets are missing or don't register as offerings on the home page:**

1. **Corridors** — 11 national industrial corridors, 38 deep-node dossiers, interactive Esri-satellite GIS maps, 4 opportunity maps (Dholera/AURIC/IITGNL/Tumakuru), state filter, 11×9 comparison table, methodology, CSV data export. **Not referenced anywhere on the home page.**
2. **Atlas** — the free interactive ecosystem map ("India's industrial systems, mapped"). Present only as a flat card list that reads as a report appendix, not as a product.
3. **Dependencies** — the import-dependency layer maps (the site's most differentiated data). Present only as thin cards; no visual hook despite the site owning the underlying data and production heatmap charts.
4. **Sanket** — the monthly newsletter. Present only as a bare signup block; no issue spotlight, cover, or archive link.
5. **Services (commercial)** — bespoke research, investment-grade DPRs, strategic briefings, licensing. **Not referenced anywhere on the home page.**

Also weak: the "By the numbers" band is report-only (18+ chapters / 50+ tables / 30-yr forecasts); the hero copy names only "long-form research".

## What the site actually offers (inventory, verified)

| Surface | What it is | Counts (live) | On home today? |
|---|---|---|---|
| Reports | Long-form strategic research + executive summaries | 43 entries, 18+ published | ✅ Featured + Start-here |
| Corridors | National corridor intelligence: GIS maps, node dossiers, opportunity maps, comparison table, CSV | 11 corridors · 38 nodes · 4 opportunity maps | ❌ absent |
| Atlas | Free interactive map of India's industrial ecosystems, players, import layers | ~17 ecosystems (11 corridors + 6 extra) | ⚠️ card list only |
| Dependencies | Per-ecosystem import-dependency layer maps ("X of Y layers import-dependent") | rollup data per ecosystem | ⚠️ thin cards only |
| Signals | Compact intelligence dispatches | 57 live | ✅ 6 shown |
| Sanket | Monthly newsletter | issues since ~2026 | ⚠️ signup block only |
| Briefings | Executive-ready short analysis | ~10 | ✅ 3 shown |
| Services | Bespoke research, DPRs, briefings, licensing | 4 engagement shapes | ❌ absent |
| Methodology | Readiness Score / research method explainers | 2 pages | ❌ absent (link only) |

## Reference note — "Figure_36_sovereignty_risk_heatmap.svg"

The pasted filename does not exist in the repo (searched `public/` for `*sovereignty*`, `*heatmap*`, `fig-36*`). Closest production assets that can anchor a home-page heatmap teaser instead:
- `public/cmd/charts/14_supply_heatmap.svg` (critical-manufacturing-dependencies supply heatmap)
- `public/figures/library/iaf-autonomous-air-power/fig_06_dependency_heatmap.svg`
- `public/report-figures/the-sap-question/fig-10-1-sector-sovereignty.svg`

The plan below builds a compact "dependency radar" teaser from the live Atlas data (`corridorsOrdered` + `rollup()`), not from static figures.

## Goals

1. **First-screen breadth**: a visitor should see within one scroll that this is an intelligence stack — Research + Corridors + Atlas + Dependencies + Signals + Sanket + Services — not a reports blog.
2. **Data-rich and interactive**: surface the GIS map, the dependency heatmap, and real platform numbers as native home-page artifacts.
3. **Commercial surface**: the services offering must be discoverable (currently zero visibility).
4. **Preserve identity**: keep the dark, systems-intelligence editorial voice — no marketing-template feel, no stock imagery.
5. **GEO/SEO**: the home page should rank for platform-level queries ("India industrial corridors intelligence", "supply-chain dependency maps India") and enumerate the offering in structured data.

## Proposed work

### Phase A — Breadth at first sight (the perception fix, ~1–2 commits)
1. **Hero rework** — headline/lede name the full stack ("research · corridors · dependency maps · signals"); add secondary CTAs (Corridors, Commission research) alongside the featured-report CTA; keep the canvas + map.
2. **Stats band → platform numbers** — replace report-only stats with a mix: 11 corridors · 38 deep nodes · 57 live signals · ~17 ecosystems mapped · 43 report entries; each stat links to its section. Numbers auto-derive from data modules so they never go stale.
3. **"Explore the platform" section (new, above the fold)** — the core fix. 7 entry cards, one per offering: **Reports · Corridors · Atlas · Dependencies · Signals · Sanket · Services**, each with a 1-line pitch + a live number + arrow. Atlas/Dependencies/Sanket get their own named cards — no longer hidden inside generic lists.
4. **Corridors teaser band (new)** — compact national corridor strip (reuse `CorridorMap` SVG navigate or `CorridorGLMap` compact) + 3–4 stats + "Open the corridors intelligence map →".
5. **Dependency heatmap teaser (new)** — compact matrix built from `corridorsOrdered`/`rollup()` ("X of Y layers import-dependent" per ecosystem), styled like a mini sovereignty-risk heatmap, linking to `/research/dependencies/`. This is the **Dependencies** product surface.
6. **Sanket spotlight (new)** — latest issue: cover, title, teaser, archive link + signup. Replaces the bare newsletter block. This is the **Sanket** product surface.
7. **Services band (new)** — 3 cards (Bespoke research / DPRs / Briefings + licensing) with "Commission research →" CTA.
8. **Section order** — hero → platform strip → stats → featured report → corridors teaser → signals → dependency heatmap → atlas cards → briefings → services → sanket spotlight → about. Keep all existing sections; add the missing ones.

### Phase B — Engagement & freshness (~1 commit)
9. **"Now" indicators** — latest corridor update (reuse the per-corridor "what's new" feed), last-updated stamp, live-signal counter.
10. **Quarterly-change strip** — top 3–4 "what changed" items pulled from corridor node timelines.

### Phase C — Professional polish + GEO (~1 commit)
11. **Metadata + structured data** — retitle/redescribe for platform breadth; add `ItemList`/`WebSite` JSON-LD enumerating the sections (Reports, Corridors, Atlas, Dependencies, Signals, Sanket, Services); keep canonical.
12. **Perf/a11y pass** — lazy-load below-fold visuals, alt text on teaser images, keyboard nav on the new cards, mobile 390px check for the new bands.
13. **Optional impact strip** — 2–3 "what our work informed" case lines if content is available (skip if it would need fabrication).

## Sequencing / effort
- **Phase A: ~1 day.** The perception fix; highest impact. Recommend starting here.
- **Phase B: half a day.** Freshness indicators.
- **Phase C: half a day.** GEO + polish.

## Verification (when implemented)
- `tsc --noEmit` clean; real `next build` exit 0 (never trust `%ERRORLEVEL%` expansion); `out/` markers for each new section.
- CDP at 1440px and 390px: hero shows breadth above the fold; no horizontal overflow; new bands render; zero console errors; existing sections unchanged.
- GEO: home meta + JSON-LD validate; canonical unchanged.
- Content-language audit: all new copy in the site's established language (English), `lang="en"` preserved.
