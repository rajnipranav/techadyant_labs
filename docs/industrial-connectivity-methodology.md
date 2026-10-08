# Industrial Connectivity Methodology — v1.0

**Applies to:** Industrial Intelligence & Connectivity Layer, Phase 1 · **Effective:** 8 Oct 2026
**Single source of truth for weights and bands:** `app/research/industrial/scoring.ts` (this document mirrors it; `scripts/test-industrial-scoring.mjs` checks the two agree on weights summing to 100).

## 0. Principles
1. **No score without a method.** Every score has named components, weights, input rules, a missing-data rule, a confidence rule and a version.
2. **Unknown is not zero.** A component with no evidence is *missing*, not scored 0. A 0 is only given when absence is itself evidenced.
3. **Completeness gate.** If known component weight is below **70%** of the total, the score is not shown — the UI shows **Insufficient Data** with the completeness figure.
4. **No false precision.** Scores are rounded to the nearest 5 and shown with a band. Distances are straight-line, computed from approximate coordinates, rounded to 5 km and labelled as such.
5. **Separation of claims.** Every dossier separates **FACT** (sourced), **TECHADYANT ANALYSIS** (interpretation), **TECHADYANT SCORE** (this methodology) and **OPPORTUNITY SURFACE** (hypothesis).

## 1. Shared rules

### 1.1 Computation
```
completeness = Σ weight(components with a value) / Σ weight(all components)
score        = round5( 100 × Σ(weight × value) / Σ weight(components with a value) )
status       = completeness ≥ 0.70 ? 'computed' : 'insufficient_data'
```
`value` ∈ [0, 1]. `round5(x) = 5 × round(x / 5)`.

### 1.2 Confidence
- *Completeness tier:* ≥ 0.90 → high · ≥ 0.80 → medium · otherwise low.
- *Evidence tier:* if > 25% of known weight rests on low-confidence inputs → low; if ≥ 50% rests on high-confidence inputs → high; otherwise medium.
- **Score confidence = the lower of the two tiers.**

### 1.3 Bands (display)
0–39 **Weak** · 40–59 **Moderate** · 60–79 **Strong** · 80–100 **Very strong**. (For CGI the words are *Low / Moderate / High / Severe* gap.)

### 1.4 Distances
- `straight_line_km` — great-circle distance between two recorded coordinates (haversine, R = 6,371 km), rounded to 5 km. Always labelled *straight-line*.
- `road_km` / `rail_km` — only when a source states it; stored with the source and labelled *road (sourced)*.
- Travel time — only when a source states it.
- Coordinates carry `coord_source` (`verified` · `gis` · `gazetteer` · `approximate`) and a confidence. Distance-derived component values inherit the lower confidence of the two coordinates.

### 1.5 Versioning
Any change to weights, bands or rules increments the version (1.0 → 1.1 for band/threshold tweaks, 2.0 for new components). Scores always display their methodology version.

---

## 2. Industrial Connectivity Score (ICS) — computed in Phase 1
**Question:** How well is this industrial node physically connected to the national freight, gateway and logistics network?

| Component | Weight | Value rule |
|---|---|---|
| Road | 20 | 1.0 access-controlled expressway documented serving the node · 0.8 expressway opened for trial/testing · 0.6 national highway documented through/adjacent · 0.3 state highway only |
| Rail | 20 | 1.0 operational DFC station in/≤ 25 km of node · 0.6 broad-gauge mainline station with documented goods handling · 0.5 broad-gauge line/station documented, goods handling not documented · 0.3 new line approved / under construction |
| Seaport | 20 | Nearest registered gateway seaport, straight-line: ≤ 150 km 1.0 · ≤ 300 km 0.7 · ≤ 500 km 0.4 · > 500 km 0.15 |
| Airport (cargo) | 20 | Nearest *operational* international airport with cargo handling, straight-line: ≤ 50 km 1.0 · ≤ 100 km 0.7 · ≤ 200 km 0.4 · > 200 km 0.15. Airports under construction are noted, not scored |
| Logistics node | 10 | Operational MMLP / ICD / MMLH ≤ 50 km 1.0 · under construction ≤ 50 km or operational 50–150 km 0.5 · unknown → missing |
| Freight corridor | 10 | Operational DFC ≤ 50 km 1.0 · ≤ 150 km 0.5 · evidenced > 150 km 0.0 |

**Inputs:** relationships of type `connected_by`, `served_by`, `nearest_port`, `nearest_airport`, `connected_to`, `on_freight_corridor`, plus infrastructure-node coordinates and status.
**Limitation (v1.0):** "nearest" is nearest among the infrastructure nodes registered in `infrastructure-nodes.json`; the registry covers every gateway considered for each pilot node, but is not a national inventory.

## 3. Connectivity Gap Index (CGI) — computed in Phase 1 where evidence allows
**Question:** How far does the available infrastructure fall short of what this node's anchor industry needs? **High CGI = large gap = constraint *and* opportunity.**

Each node is assigned a **requirement profile** from its anchor industry. Each requirement is assessed `met` (0) · `partial` (0.5) · `gap` (1.0) · `unknown` (missing), with evidence.

| Requirement | Fab profile | Backend (OSAT/ATMP) profile |
|---|---|---|
| Air cargo (time-critical, high-value) | 20 | 30 |
| Power reliability | 20 | 20 |
| Industrial water | 20 | 10 |
| Seaport access (bulk chemicals, gases, equipment) | 15 | 15 |
| Specialised warehousing (bonded, ESD, climate-controlled) | 10 | 15 |
| Multimodal integration (rail–road–air) | 15 | 10 |

CGI uses the shared computation (§1.1) with `value = gap weight`. The requirement weights are a Techadyant judgement, documented here and versioned.

## 4. Supply Chain Connectivity Score (SCCS) — defined; Insufficient Data in Phase 1
**Question:** How efficiently can a node's critical inputs and outputs move?

| Component | Weight | Input required |
|---|---|---|
| Supplier proximity | 25 | Share of the anchor industry's critical input categories with a documented domestic supplier ≤ 300 km |
| Import-gateway access | 20 | ICS seaport/airport values weighted by the node's inbound mix |
| Export-gateway access | 20 | Same, weighted by outbound mix |
| Multimodal access | 15 | Count of operational modes with documented interchange |
| Freight infrastructure | 20 | DFC / MMLP / ICD status and distance |

**Why not computed yet:** supplier-by-input-category mapping for each node does not exist in the Atlas yet (the Atlas maps suppliers by ecosystem, not by node). Phase 2 task.

## 5. Industrial Opportunity Score (IOS) — defined; Insufficient Data in Phase 1
**Question:** How much industrial opportunity is a change (infrastructure, policy, anchor investment) likely to open at this node?

| Component | Weight | Input required |
|---|---|---|
| Infrastructure investment trigger | 20 | Sourced projects affecting the node (cost, status) |
| Demand growth | 15 | Sourced anchor capacity ramp (e.g. units/day, WSPM) |
| Import dependency of relevant inputs | 20 | Atlas grid status for the anchor ecosystem's layers |
| Supplier gap | 15 | Count of critical input categories with no supplier ≤ 300 km |
| Localisation feasibility | 10 | Analyst rubric (capex, IP barrier, volume) |
| Logistics improvement | 10 | ICS delta from projects completing within 3 years |
| Policy support | 10 | Sourced scheme coverage (ISM, ECMS, state policy) |

**Why not computed yet:** supplier gap and localisation feasibility need the SCCS supplier mapping; demand ramp is only partly sourced.

## 6. Strategic Node Score (SNS) — defined; Insufficient Data in Phase 1
**Question:** How important is this location to India's industrial network?

| Component | Weight | Input required |
|---|---|---|
| Sector concentration | 20 | Count of approved/operating units in strategic sectors |
| Strategic industry presence | 20 | ISM / defence / critical-mineral designations |
| Transport convergence | 15 | Count of operational modes (from ICS) |
| Supply-chain centrality | 15 | Degree / betweenness in the Atlas graph |
| Export relevance | 10 | Sourced export share or export-oriented designation |
| Infrastructure investment | 10 | Sum of sourced project costs affecting the node |
| National strategic designation | 10 | NICDP node, SEZ/SIR, defence corridor, etc. |

**Why not computed yet:** export relevance and centrality are not yet computed consistently across nodes; publishing SNS for four nodes would invite false ranking.

---

## 7. Opportunity Surfaces (not a score)
An Opportunity Surface is an **analytical hypothesis**, never a fact or a procurement forecast. Each record must carry:
- **Triggering development** — a sourced FACT (project, approval, commissioning).
- **Effect chain** — infrastructure change → connectivity effect → industrial impact → supply-chain effect → strategic dependency → opportunity. Each step is labelled `fact` or `analysis`.
- **Constraints** — what could stop it.
- **Horizon** — near (0–2 yrs) · medium (2–5) · long (5+).
- **Confidence** — *high*: trigger has ≥ 2 independent primary sources and the chain follows a documented precedent · *medium*: trigger primary-sourced, chain reasoned · *low*: trigger is an MoU/announcement or the chain is speculative.
- **Opportunity type** — `supplier_localisation` · `component_manufacturing` · `logistics_service` · `specialised_infrastructure` · `shared_services` · `skills_capacity`.

Language rule: "may", "could", "creates conditions for" — never "will".

## 8. SME classifications (future layer)
Allowed labels, always marked *Techadyant analysis*: `potential_strategic_sme` · `scale_up_relevance` · `manufacturing_ecosystem_relevance`. The field `sgf_status` is fixed to `not_documented` unless an official source documents SME Growth Fund investment in that company. The validator enforces this.

## 9. Freshness
Every entity carries `last_verified`; facts carry `as_of`. The validator warns when `last_verified` is older than 120 days. The UI says "Data verified: <Month YYYY>", never "live".
