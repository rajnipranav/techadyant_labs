# The Atlas — a fresh plan for `/research`

_Working name: **The Atlas** (India's Industrial Systems, mapped). Route stays `/research` for SEO continuity; nav label changes from "Research" to "Atlas". Last updated: June 2026._

---

## 1. The problem, precisely

`/research` today is a **duplicate of the home page**, not a destination. The home page already renders all five themes with identical blurbs (`app/page.tsx`, the "Research themes / Lines of inquiry" grid). `/research` (`app/research/page.tsx`) re-prints the same five themes and adds three generic, hand-written bullets each. There is no data, no interactivity, nothing to return for. A visitor who has seen the home page has already seen `/research`.

It also wastes the single biggest unused asset in the whole operation.

## 2. The opportunity (what we already own)

The SID database — live in Supabase, already seeded — is exactly the raw material the vision calls for. Current live counts:

- **5 corridors / ecosystems**: Semiconductors, Critical Minerals, AI Infrastructure, Defence, Enterprise Software.
- **119 watchlist players** with canonical names, types (company / PSU / ministry / foreign supplier / material / scheme…), home country, descriptions, and aliases.
- **216 typed relationships** (`supplies_to`, `depends_on`, `controls`, `invests_in`, `regulates`, `beneficiary_of`…) — i.e. *who makes what and who depends on whom*.
- **35 import-dependency assessments**: every corridor scored across a **6-layer value chain** (raw materials → refining → components → equipment → manufacturing → services/IP) on a 0–5 capture scale, each with written rationale ("~100% China-dependent refined NdFeB", "total Nvidia dependency ~80% share"). **This is literally "the gaps which are imported," already structured.**
- **60 events** (capacity, dependency, capital, policy, capability, constraint) — the live feed spine.
- **165 figures** indexed as static SVGs (dependency trees, supply-chain flows, capture heatmaps, corridor maps).

None of this is on the website. The plan is to turn `/research` from a brochure into the **public face of this database**: a living reference that analysts, founders, investors, journalists and policymakers bookmark and return to.

## 3. Positioning — what The Atlas *is* (and is not)

Three products, three jobs:

- **Reports** — long-form arguments. Read once, deeply. (Paid/free flagships.)
- **Signals** — dated dispatches. Read when new.
- **The Atlas** — a **reference workbench**. Never "finished," always consulted. The thing you open *while doing your own work* to answer: *Who are the players in X? What do they make? What does India still import, and where's the gap?*

The Atlas is the **top-of-funnel lead magnet**: free to browse (drives bookmarks, SEO, AI-citation), with email-gated extras (downloads, alerts) that convert browsers into subscribers, and contextual cross-links that route serious readers into the paid reports.

It is **not** another themes list, not a blog, not gated behind a wall.

## 4. Information architecture — the horizontal sub-nav

A persistent secondary nav under the masthead, present on every Atlas page:

```
ATLAS   Overview · Ecosystems & Players · Import Dependencies · Industrial Corridors · Supply Chains · Methodology
```

Each is a **real route** (not just an anchor) so every view is bookmarkable, shareable and independently indexable:

| Sub-nav | Route | What it surfaces | Data source |
|---|---|---|---|
| **Overview** | `/research` | The map: 5 corridor cards, headline dependency score per corridor, "what changed this month", featured figures, entry points | corridors + capture rollup + events |
| **Ecosystems & Players** | `/research/players` (+ `/research/players/[entity]`) | Searchable directory of the 119 players: filter by corridor, type, domestic/foreign, value-chain layer; each card says *what they make / their role* | entities + relationships + entity_corridors |
| **Import Dependencies** | `/research/dependencies` | The centrepiece: per-corridor **6×capture grid**, colour-coded 0–5, expandable rationale; "what India imports" view | capture_assessments + dependency_layers |
| **Industrial Corridors** | `/research/corridors` (+ `/[corridor]`) | Folded-in ICIH: corridor profiles, scorecards (infra/power/water/talent/ecosystem/opportunity/risk), tracked projects | new corridor_scores + projects tables |
| **Supply Chains** | `/research/supply-chains` | Dependency / chokepoint maps — directed graph of supplies_to / depends_on, by corridor; the figure library's flow diagrams | relationships + figures |
| **Methodology** | `/research/methodology` | How we score capture, what the layers mean, verification labels, update cadence, sources. Trust + GEO anchor | static |

Per-corridor deep pages (`/research/corridors/semiconductors`) stitch the modules together for one ecosystem (players + dependency grid + supply chain + projects + related reports) — these become the **most linkable, most citable** pages on the whole site.

## 5. Module design (the four that matter for v1)

### 5.1 Import Dependency Map — the hero
A grid per corridor: rows = the 6 value-chain layers, a single cell each showing the 0–5 capture status as a colour band (deep-red import-dependent → teal captured/sovereign), the one-line label, and an expand for the full rationale + verification tag + assessment date. A corridor selector across the top. A "compare corridors" toggle puts all five side by side — the single most screenshot-able, most-shared artefact we can publish. This is the bookmark trigger: *"where does India actually stand on chips / rare earths / AI compute?"* answered in one glance, updated as we re-assess.

### 5.2 Ecosystems & Players — the directory
The 119 players as a filterable directory. Facets: corridor, entity type, country (domestic vs foreign), value-chain layer. Each player card: name, type chip, country flag, what they make / their role (from description + outgoing `supplies_to` edges), corridors they sit in, and links to any report/signal that references them. A detail page per player (`/players/tata-electronics`) with full relationships in/out — these are natural GEO landing pages ("what does Tata Electronics manufacture", "Indian rare-earth companies").

### 5.3 Industrial Corridors — the folded-in microservice
Rather than finish and deploy the separate Astro app, we **rebuild its concept inside the labs site** against the same Supabase. We add two tables (`corridor_scores`, `projects`) to the `sid` schema, seed them, and render: corridor profile + 7-axis scorecard radar + a tracked-projects table (investment, status, timeline). Retires the standalone ICIH codebase; one stack, one deploy.

### 5.4 Supply Chains — the dependency graph
A directed graph / Sankey per corridor built from `relationships`, highlighting chokepoints (high-in-degree `depends_on` nodes). Where a curated figure already exists (we have 165), embed the SVG; otherwise render from data. This is the "systems-level" signature visual that matches the brand.

## 6. Lead-magnet mechanics (open + gated extras)

Everything above is **free to browse** — that's what earns bookmarks, return visits, backlinks and AI-citations. Conversion comes from *extras*, not walls:

- **Email-gated downloads** — "Download the semiconductor dependency grid (PDF)" / "Export the players directory (CSV)". One email unlocks all downloads (stored against the existing Supabase auth/commerce layer).
- **Corridor watch** — "Track Semiconductors → get an email when an assessment or major project changes." Ties directly into the signal engine + Sanket newsletter. The single strongest return-driver.
- **"What changed" feed** — a dated changelog per corridor (powered by `events`); a visible `Last updated` stamp everywhere signals the page is alive.
- **Contextual report cross-sell** — every corridor/player view links the relevant paid/free report ("Go deeper: *The SAP Question* →").
- **Shareable cards** — every dependency grid and player card has an OG image + copy-link, engineered for LinkedIn/X reshare.

The funnel: *browse free → bookmark → return via alert → download (give email) → buy a report.*

## 7. Technical architecture (hybrid, on the existing stack)

The site is `output: 'export'` (Cloudflare Pages static) **but already runs Pages Functions** (the admin pipeline/promotion BFF, `functions/api/*`, calling Supabase RPCs). We use both layers:

1. **Build-time bake (SEO + first paint).** A new `scripts/bake-sid.mjs` runs in the build (`next build` → bake → export), querying Supabase with the service role and writing `public/data/atlas/*.json` (corridors, players, dependency grid, supply edges) + generating `generateStaticParams` for every corridor and player page. Result: fully pre-rendered, indexable, fast HTML — the data snapshot ships with the deploy.
2. **Live refresh (freshness).** New read-only Pages Functions (`functions/api/atlas/*`) expose Supabase RPCs (`sid_corridor_overview`, `sid_players`, `sid_capture_grid`, `sid_supply_edges`, `sid_player`). Client components hydrate from the baked JSON instantly, then optionally revalidate against the live endpoint for the dynamic bits (new events/projects). "Last updated" reflects the live call.
3. **New Supabase RPCs** (security-definer, anon-safe, read-only) mirror the admin pattern already in `functions/api/admin/[[path]].js`.
4. **Rebuild trigger.** A scheduled/`deploy hook` rebuild (or the signal-engine pipeline) refreshes the static snapshot daily so even cache-only visits see current data.
5. **SEO / GEO.** Per-corridor and per-player pages each emit JSON-LD (`Dataset` for grids, `Organization` for players), sit in `sitemap.ts`, and feed `/llms.txt`. Because `robots.ts` already welcomes GPTBot/ClaudeBot/PerplexityBot, a structured, queryable dependency atlas is precisely the kind of source AI engines cite — a compounding discovery channel.

## 8. De-duplication (home vs Atlas)

The home page stops duplicating. Its "Research themes" grid is **reframed as a gateway**: a compact "Explore The Atlas" band that teases the five corridors with their live headline dependency score and links into `/research`, rather than reprinting the same blurbs. The themes' editorial blurbs move into the corridor Overview. Home becomes a doorway; the Atlas is the room.

## 9. Phased roadmap

- **Phase 1 — MVP (this session).** Reframe `/research` as the Atlas shell + sub-nav; ship **Overview**, **Import Dependencies** (the hero grid, all 5 corridors), and **Ecosystems & Players** (directory + filters) from the existing SID seed, baked to static JSON. De-dup the home page. tsc-clean, committed.
- **Phase 2 — Depth + capture.** Player detail pages; Supply-Chains graph + figure embeds; email-gated CSV/PDF downloads; "Last updated" + per-corridor "what changed"; OG share cards; JSON-LD + sitemap/llms.txt.
- **Phase 3 — Corridors (fold-in ICIH).** Add `corridor_scores` + `projects` tables, seed them, build the corridor scorecards + projects tracker; retire the standalone Astro app.
- **Phase 4 — Live + alerts.** Pages-Functions live refresh; "Track this corridor" email alerts wired to the signal engine + Sanket; daily rebuild trigger; GEO entity-page expansion.

## 10. Success metrics

Return rate (returning vs new on `/research*`), bookmark/direct-traffic share, email captures from downloads + corridor-watch sign-ups, report click-through from Atlas, backlinks/AI-citations to corridor pages, and assessment-freshness (median age of a capture assessment shown).

---

## Appendix — Phase-1 MVP build scope (what gets built next)

1. `scripts/bake-sid.mjs` — pull corridors, players, capture grid from Supabase → `public/data/atlas/*.json`; chain into build.
2. `app/research/page.tsx` — Atlas Overview (corridor cards + headline scores + entry points), replacing the themes list.
3. `app/research/AtlasNav.tsx` — horizontal sub-nav (client, active-route aware).
4. `app/research/dependencies/page.tsx` — the import-dependency grid, 5 corridors, colour-coded, expandable rationale, compare view.
5. `app/research/players/page.tsx` — players directory with corridor/type/country/layer filters (client).
6. Home-page de-dup: reframe the themes section into an "Explore The Atlas" gateway.
7. CSS additions in `globals.css`; `sitemap.ts` entries; nav label Research→Atlas.
8. Verify: `tsc --noEmit` clean; commit.
