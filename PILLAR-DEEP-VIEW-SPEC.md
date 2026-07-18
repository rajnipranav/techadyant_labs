# Spec — Pillar Deep View (`/research/pillars/[corridor]`)

**Status:** ready to build · Edition 1 · depends on the deepened SID graph (5 pillars, 382 players, 979 relationships) already baked into `app/research/_atlas.json`.

## Goal
A dedicated, decision-grade page per industrial pillar (Semiconductors, Critical Minerals, AI Infrastructure, Defence, Enterprise Software) that shows the **structure** of the ecosystem — the value-chain/opportunity streams, who controls each chokepoint (with %), and the Indian challengers — the way the drone/CUAS atlas does. Turns the flat player directory into a readable *system map*.

## Why (gap it fills)
The existing views render the graph as a **directory + per-entity pages**. There is no page that shows a pillar as one connected picture: its streams, its chokepoints ranked by import-dependence, and its India-vs-foreign split. That system view is the differentiator.

## Route & data
- Route: `app/research/pillars/[corridor]/page.tsx` — 5 SSG pages, `generateStaticParams` from the 5 corridor codes (`semiconductors`, `critical-minerals`, `ai-infrastructure`, `defence`, `enterprise-software`).
- Data: **no new fetch** — import `app/research/_atlas.json` and filter by corridor:
  - players where `corridors` includes the code (already tagged via `entity_corridors`);
  - relationships where `corridor_id` = that corridor id.
- Add a `pillars` tab to `app/research/AtlasNav.tsx` and cards on `/research`.

## Page anatomy (v1)
1. **Header** — pillar name, one-line thesis, stat strip (players · relationships · chokepoints · India-vs-foreign %). Reuse `ed-page-head`.
2. **The stack** (signature visual) — server-rendered inline SVG, no chart lib:
   - Rows = the pillar's `opportunity_surface` / `ecosystem` nodes (the eight streams for Semiconductors; refining layers for Minerals; compute/power/silicon for AI; subsystem tiers for Defence; software layers for Enterprise SW).
   - Each row shows the stream name + the chokepoint node(s) inside it (`part_of` edges) and a status colour by India readiness (crimson = import-dependent chokepoint, brass = contested, teal = Indian capability). Mirror the drone dependency-stack look.
3. **Chokepoints table** — relationships of type `controls` / `depends_on` with a `magnitude`, ranked desc: *who controls what, %, verification tag*. This is the "who holds the veto" view (photoresist 87–91% JP, ASML litho 92%, EDA Big-3, China REE 91%, NVIDIA GPU ~80%, SAP ERP, etc.).
4. **Players by role** — grouped chips: Foreign incumbents · Indian challengers · Facilities/anchors · Schemes & agencies. Each links to its existing `/research/players/[slug]` page.
5. **Cross-pillar links** — relationships whose two endpoints sit in different corridors (e.g. Semiconductor → Flight Controller → UAS Platform). This is the moat; render as a small "connects to" strip.
6. **JSON-LD** — `Dataset` + `BreadcrumbList`; add routes to `sitemap.ts` and `llms.txt`.

## Reuse (don't rebuild)
- Server-render from `_atlas.json` (same pattern as `DependenciesView` / players) so pages are static HTML for SEO/GEO.
- Palette + `atlas-*` / `ci-*` CSS classes already in `globals.css`; add a small `.pillar-*` block.
- Colour encoding + inline-SVG stack: copy the approach from the corridor `clean_old_figs`/drone dependency-stack (crimson/brass/teal, text-as-text).

## Build steps
1. `app/research/pillars.ts` — helpers: `pillarPlayers(code)`, `pillarRelationships(code)`, `chokepoints(code)` (controls/depends_on with magnitude, sorted), `streamsOf(code)` (opportunity_surface + their `part_of` children), `crossPillarEdges(code)`.
2. `app/research/pillars/[corridor]/page.tsx` — the page + the inline-SVG stack component.
3. `AtlasNav.tsx` + `/research` cards + `sitemap.ts` + `llms.txt`.
4. Verify: `ts.transpileModule` syntax check (pnpm tsc is broken in-sandbox); `next build` authoritative on the user's side.

## Scope
- **v1:** the five static pages (stack + chokepoints table + players-by-role + cross-pillar strip). Data already in `_atlas.json` after the creds/bake step.
- **Later:** interactive graph (force layout from relationships), per-stream drill-down, "track this pillar" lead capture, choropleth for minerals/defence geography.

## Prerequisite
Live data only appears once the Cloudflare bake runs with `N8NDB_URL` + `N8NDB_SERVICE_ROLE_KEY` set (see the reconciliation session notes) — until then `_atlas.json` is the stale June snapshot and these pages would render the old graph.
