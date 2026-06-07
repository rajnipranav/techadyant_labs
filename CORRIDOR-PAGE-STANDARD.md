# Corridor & node page — frozen standard (v1)

_Frozen from the Amritsar–Kolkata (AKIC) build, June 2026. Every corridor is upgraded to this exact spec; build corridor-by-corridor. If a change is needed, change it here first, then re-apply to all upgraded corridors._

---

## 1. Principle
A corridor page is a **decision-grade investor/analyst dossier**, not a brochure. Three rules:
1. **Every load-bearing number carries a source** (URL + date). Primary source first.
2. **Status reflects reality**, not aspiration — a node is only "under construction" if a contract/works are awarded.
3. **One template, applied identically** to all 11 corridors. Differences are data, never layout.

---

## 2. Data model — `app/corridors/node-data.ts`
One `corridorDeep['<slug>']` entry per corridor. Adding it is what "upgrades" a corridor — the map, node pages, node cards and charts all switch on automatically.

```ts
NodeStage = 'operational' | 'construction' | 'approved' | 'planned'

CorridorDeep {
  slug, intro: string[],            // 2–4 paragraphs, house voice, lead with the conclusion
  facts: {k,v}[],                   // 5–8 at-a-glance rows
  nodes: DeepNode[],
  milestones?: {date,label}[],      // corridor-level timeline (6–8)
  sources: {label,url}[],
}
DeepNode {
  slug, name, state, stage, statusLabel,    // REQUIRED
  sectors, summary: string[], sources[],     // REQUIRED (>=1 paragraph, >=1 source)
  coords?: [x,y],                            // map placement (see §4) — omit if site undefined
  areaAc?, projectCostCr?, investmentCr?, jobs?, anchors?, nearest?,   // OPTIONAL (light tier)
  timeline?: {date,label}[],

  // --- DEEP-TIER fields (REQUIRED-WHERE-AVAILABLE for operational/construction; see §3b) ---
  developer?: string;        // master developer / implementing SPV / nodal agency
  epc?: string;              // EPC contractor(s) once awarded
  companies?: { name: string; sector?: string; commitment?: string; note?: string; source?: string }[];  // real allotted / committed / MoU tenants
  industries?: string[];     // specific industries/units coming up (named where possible)
  infrastructure?: string[]; // power, water, road, rail/ICD, CETP specifics with numbers
  incentives?: string;       // node-specific policy / incentive package
  sections?: { heading: string; body: string[] }[];  // free-form deep analysis sections
}
```
Required fields are mandatory for every node. Optional fields render only when present (cards/stats hide empties). Never invent a number to fill a slot — leave it out.

---

## 3. Status taxonomy (frozen)
| Stage | Colour | Use when |
|---|---|---|
| `operational` | teal `#0F8E78` | trunk infra done / plots being allotted / units operating |
| `construction` | amber `#B5891E` | EPC contract awarded **or** EPC tender floated; works contracted |
| `approved` | blue `#2E86C1` | CCEA/cabinet approved + SPV, but no EPC yet (pre-construction) |
| `planned` | grey `#8593A6` | identified/perspective-plan only, or site not finalised, or state-led/unverified |

`statusLabel` carries the precise human phrase ("EPC procurement", "Approved · court bottleneck", "Site being relocated", "State-led · linkage unverified").


## 3b. Node depth tiers (frozen)
Page depth follows the stage. **The closer to reality, the deeper the page.**

| Tier | Stages | What the node page MUST carry (where it exists in open sources) |
|---|---|---|
| **Full intelligence file** | `operational`, `construction` | Everything in the light tier **plus**: named **anchor tenants / allotted companies** (`companies[]`), the **specific industries/units coming up** (`industries[]`), **master developer + EPC contractor** (`developer`, `epc`), **infrastructure build** with numbers (`infrastructure[]` — power MW, water MLD, road/rail/ICD), **incentives** (`incentives`), and free-form **analysis sections** (`sections[]`). Pull *all relevant open-source insight that exists*: PIB/state releases, SPV tenders & award notices, India Investment Grid, company announcements, MoU lists, news. Every name/number sourced. |
| **Light** | `approved`, `planned` | The required + optional light-tier fields only (area, cost, investment, sectors, status, timeline, sources). No need to chase tenants/industries that don't exist yet — say what's decided and stop. |

Rule of thumb: an `operational`/`construction` node with no `companies[]`/`industries[]` is **incomplete** unless research confirms none are public yet (note that explicitly). `approved`/`planned` nodes are complete with the light fields. Back-fill applies retroactively: AKIC's four construction nodes (Prayagraj, Gaya, Khurpia, Rajpura–Patiala) are to be upgraded to the full file.

---

## 4. Coordinates (frozen)
Node + route coordinates live in the **shared INDIA_OUTLINE space** (viewBox `34 6 448 548`). Source of truth: `figure-library/corridor-figs/clean_old_figs.py` — `ENDPTS` (corridor termini) and `NODES` (per-corridor node coords) already hold all 11 corridors. Copy those `(name, x, y)` into the node `coords`. For nodes not in that list, estimate from the route polyline (`data.ts` `pts`) + geography and mark the placement approximate. Route comes from `data.ts` `corridors[].pts`.

---

## 5. Sourcing & verification (frozen)
- **Primary source for NICDP corridors:** the latest **DPIIT/NICDC "Status of Industrial Corridor Projects"** report (PDF). Use its CCEA dates, project costs and stage facts verbatim.
- **Secondary (projections):** PIB / India Investment Grid / state portals for investment-potential and jobs — label these as projections, not built outcomes.
- **State-led / non-NICDP nodes** (e.g. Raghunathpur): include for completeness, stage `planned`, statusLabel flagged "state-led · linkage unverified".
- Every `DeepNode.sources[]` has ≥1 entry; the corridor `sources[]` ≥1. No naked numbers.

---

## 6. Corridor page anatomy (frozen section order) — `app/corridors/[slug]/page.tsx`
1. **Header** — chip (tag · Corridor NN), name, blurb, stat strip (length / states / nodes / status).
2. **Readiness score** (existing `corridor-intel.ts`) — 0–100 + 4 axes + rank.
3. **On the map** — `<CorridorNodeMap>` when `deepFor(slug)` exists, else the static white SVG.
4. **Corridor insights** (deep only) — nodes-by-stage split bar; area-by-node + investment-by-node bar charts; milestone timeline; source line.
5. **At a glance** — facts + snapshot (SPV/funding/DFC/investment/jobs) + connectivity chips.
6. **Anchor nodes** — clickable node cards (stage badge + key stats + first summary line → node page) when deep; else intel table / plain cards.
7. **The Techadyant view** — `deepdive.ts` 4-paragraph analysis.
8. **Related research** → reports. **9. Official sources.** **10. Track this corridor** + prev/next.

JSON-LD: BreadcrumbList + Dataset + FAQPage (already wired).

---

## 7. Node page anatomy (frozen) — `app/corridors/[slug]/[node]/page.tsx`
SSG via `allCorridorNodePairs()`, async params, canonical, `Place` JSON-LD. Order:
1. Header — breadcrumb, name, **stage badge + state + statusLabel**.
2. Stat cards — area / trunk-infra cost / investment potential / jobs (only those present).
3. Narrative — `summary` paragraphs.
4. Fact grid — sectors / nearest hub / **developer** / **EPC** / status.
5. **Companies & industries coming up** (deep tier) — table of named tenants (company · sector · commitment) + the industries list.
6. **Infrastructure & incentives** (deep tier) — power/water/road/rail build with numbers; incentive package.
7. **Analysis sections** (`sections[]`, deep tier) — free-form, sourced.
8. Timeline. 9. Sources. 10. Prev / all-nodes / next.

---

## 8. Map standard — `CorridorNodeMap.tsx` (frozen)
Dark panel, faint India outline, red route from `pts`, red termini dots labelled from corridor name, **status-coloured node markers** (click → node page), hover highlight + label, legend of the stages used + "Tap a node" hint. ViewBox auto-zooms to route+nodes bbox (pad 26). No chart libraries anywhere — charts are CSS/inline-SVG, server-rendered.

---

## 9. Voice & length (frozen)
House voice: calm, analytical, India-first, lead with the conclusion, British spelling, no hype. Corridor `intro` 2–4 paras; each node `summary` 1–2 paras. Prose, not bullets, in narrative.

---

## 10. "Add a new corridor" checklist
1. **Research** the corridor to AKIC depth (DPIIT report + PIB/IIG/state) — facts, every node's stage/area/cost/investment/jobs/sectors/timeline/sources.
2. Add `corridorDeep['<slug>']` to `node-data.ts` (coords from `clean_old_figs.py`).
3. Confirm `data.ts` `pts` route + the corridor's basic fields are accurate; refresh `corridor-intel.ts` + `deepdive.ts` if thin.
4. No page/component code changes needed — the map, node pages, cards, charts and sitemap switch on from the data.
5. Verify: `node-data.ts` type-checks in isolation; TSX transpile-clean; Cloudflare `next build` is authoritative.
6. Commit; push from the labs folder.

---

## 11. Rollout backlog (priority order — confirm)
DMIC (flagship, most data) → VCIC (coastal, ADB-funded) → CBIC → OEC → the Hyderabad trio (HNIC/HWIC/HBIC) → BMIC → CBIC-Kochi → DNIC (perspective-plan only; keep light). Retire the static white `/figures/corridors/*.svg` per corridor only after it's upgraded.
