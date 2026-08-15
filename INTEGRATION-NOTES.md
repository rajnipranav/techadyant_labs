# Integration Notes — Military Transport Aircraft Manufacturing vertical

**Site:** labs.techadyant.com · **Repo:** `techadyant_labs-main` (Next.js App Router, static export, Cloudflare Pages)
**Vertical:** `/research/military-aerospace/` — India's military transport aircraft manufacturing ecosystem
**Date:** 2026-08-14 (Phase 0 audit + build + correction pass) · **Project id:** website-d2ada95805a804e69d439d34

---

## 1. Phase 0 — source provenance audit

**Dataset:** `Database\MTA Manufacturing\MTA Atlas\` — 88 sources, 256 records.
**Deliverables:** `source-verification.csv` + `records-affected.md` in `Database\MTA Manufacturing\`; `sources.json` carries per-source `verification` blocks (verdict, resolved URL/title/date, note), corrected `published_at`, and re-scored `trust_tier`.

| Verdict | Count | Meaning |
|---|---|---|
| RESOLVED | 74 | URL verified and pinned to a specific document (never a bare domain root) |
| CORRECTED | 3 | Original URL wrong; replaced with the correct primary document |
| UNRESOLVED | 9 | Could not be verified to a primary source — demoted to `indicative` |
| RETIRED | 2 | Claim contradicted by evidence — record rewritten, source retired |

**Gate:** 9/88 = 10.2% UNRESOLVED (< 25%) — **passed**. **Zero `official`-tier URLs sit on a domain root.**

## 2. Correction pass (brief 2) — applied at the SOURCE level, then re-baked

Phase 0's corrections were previously applied only as a bake-time CORRECTIONS map, which the shipped data did not fully honour (e.g. `plat-c390` still read "Selected by IAF in 2024" with a HAL partner). This pass edits **`Database/MTA Manufacturing/MTA Atlas/*.json` directly** — the dataset is now the single source of truth — and the bake script's CORRECTIONS map was **removed** so re-baking is idempotent.

### 2a. The two retired C-390 claims — gone from the data
- **Partner is Mahindra Defence, not HAL.** Added `org-mahindra-defence` (companies.json, 52 records now) and `src-embraer-mahindra-mou-2024` (sources.json, 89 sources now — Embraer media centre release, URL re-confirmed by web search 2026-08-14). `plat-c390` partner fields, `org-embraer` role/partnership, `rel-embraer-hal-c390-industrial` (re-pointed to Mahindra), `mro-c390-future-hal`, and every HAL reference across systems/localization/opportunities re-pointed or re-scoped. `org-hal` cleaned: C-390 removed from programmes, tier map, role, partnership and sources.
- **No IAF selection of the C-390.** Every "selection" statement reworded to: the C-390 is a **contender in the open IAF MTA competition** (DPB cleared a 60-aircraft requirement; formal tender not released as of mid-2026). The four `prog-c390-india-*` milestones were rewritten (competition status, Embraer–Mahindra MoU Feb 2024, projected contract/first-delivery labelled as projections).
- Retitled the sources whose **titles asserted the false claims** (`src-embraer-pr-c390-2024`, `src-iaf-c390-selection-2024`, `src-hal-embraer-mou-2024`) plus the re-scoped `src-dynamatic-c295-flap-track` and `src-ceinsys-c295-supplier`.

### 2b. Other factual corrections (also from `records-affected.md` §2)
| Item | Corrected to |
|---|---|
| C-295 contract | **8 Sep 2021** (PIB PRID 1757634; Cabinet approval PRID 1753260) — programmes + platform prose |
| HTT-40 contract | **7 Mar 2023**, ₹6,838 cr, 70 aircraft (PIB PRID 1904828) |
| C-295 propeller | **Ratier-Figeac 568F-5, 6-blade** (FH386 = A400M) |
| C-295 APU | **Pratt & Whitney Canada** APS2600-class (dependency fields: name, component, country, OEM → org-pwc) |
| Do-228 design authority | **General Atomics AeroTec Systems** (left RUAG 2020) — platform full_name, partner role, localization summary |
| Dynamatic flap-track beams | **A320/A330 family** — org, supplier edge, systems, localization, geography re-scoped; C-295 role no longer asserted |
| C-130J first induction | **February 2011** — programme milestone |

### 2c. Confidence demotions — flag and field now agree
- 44 records had `confidence` demoted to **`indicative`** (42 via the automated rule + 2 geography records): any record citing an indicative-tier source now carries `confidence: "indicative"`, so the baked `indicative` flag and the `confidence` field are never in conflict.
- Records re-pointed/corrected with clean sources were promoted back to their honest tier (e.g. `org-hal`, `org-dynamatic`, `rel-embraer-hal-c390-industrial`, `geo-dynamatic-bengaluru` → `strong-evidence`).
- Net: **92 of 257 records** are flagged indicative in the baked data (previously 102/256) — the drop is the C-390/HAL records that now rest on the verified Embraer–Mahindra source.

## 3. Verification (run against the regenerated `app/research/_aerospace.json`)

```
'Selected by IAF'    : 0
'IAF selection'      : 0
'Embraer and HAL'    : 0
'HAL-Embraer'        : 0
'selection announced': 0
'Mahindra'           : 63
indicative records whose confidence is not indicative: 0
```
`npm run build:only` (next build): **✓ 1,398 static pages** — includes the aerospace index and all 86 detail routes (1 + 12 platforms + 52 companies + 21 dependencies, verified in `out/sitemap.xml`). Built HTML spot-checks: C-390 page renders "Mahindra Defence", "contender", the indicative badge and Product JSON-LD; the HAL company page no longer mentions the C-390; the new `company/mahindra-defence/` page exists. The full `npm run build` was deliberately not run — it triggers `sync-cms-to-data.mjs` and `indexnow-submit.mjs` external side-effects.

## 4. Deliverables in this pass

| Artifact | Location |
|---|---|
| Corrected Atlas sources (11 JSON files) | `Database\MTA Manufacturing\MTA Atlas\` (not under git — working files) |
| Regenerated baked data | `app/research/_aerospace.json` (committed) |
| Simplified bake script (CORRECTIONS removed) | `scripts/bake-aerospace.mjs` |
| Updated llms.txt copy (52 companies, 78/89 sources) | `app/llms.txt/route.ts` |
| This note | `INTEGRATION-NOTES.md` |

## 5. Honest caveats
- 11 of 89 sources remain unresolvable/retired (9 UNRESOLVED, 2 RETIRED). They stay in the ledger and every record resting on them is visibly labelled indicative — including the An-32 RE upgrade, No. 3 BRD engine MRO, AN/APN-241 radar, CEINSYS and Dynamatic-C-295 claims, which are qualified in prose rather than deleted.
- `src-embraer-spec-c390` (official Embraer C-390 page) is still UNRESOLVED at the URL level; it remains the cited spec source and keeps its records indicative. If the URL is re-verified, re-run the bake and the badges clear.
- Projected C-390 milestones (contract, first delivery) are explicitly labelled projections contingent on the MTA competition.
- No `projects/projects.json` written (Next.js repo — Function-Compute auto-preview does not apply) and no deployment claimed. Static export lives in `out/` (gitignored) for Cloudflare Pages CI.

## 6. Re-bake / maintenance
```
node scripts/bake-aerospace.mjs   # idempotent; dataset is the source of truth
npm run build:only                # type-check + static export (avoids IndexNow/CMS side-effects)
```
The bake script no longer carries a corrections map — all factual fixes live in the Atlas JSON files.

## 7. Cleanup pass (brief 3, 2026-08-14) — five defects closed

| # | Defect | Fix |
|---|---|---|
| 1 | Card in the wrong section | Removed from `DATABASES` (Deep databases back to three entries); added to `EXTRA_ECOSYSTEMS` in `app/research/extra-ecosystems.tsx` with counts imported from the aerospace `data.ts` (12 platforms, 52 companies, 21 dependencies). Appears automatically on the /research pillars grid **and** the home-page Atlas grid via `ExtraEcosystemCardFull`/`ExtraEcosystemCardSimple`. |
| 2 | Every cluster showed "0 sites" | `GeoRec.industrial_cluster` stores the cluster **name**, but the view joined against the cluster **id** (`c.id`), which never matched. Join now runs on `c.company_ids.includes(s.company_id)` (the baker already preserved `company_ids`), and each cluster shows **both** numbers: sites mapped and member companies. Verified in the built HTML: 12/9, 4/3, 1/1, 2/1, 2/2, 5/2, 2/2, 4/1, 4/1. |
| 3 | Two rows both "Composite propeller" | The matrix (and the browse strip) used the generic `component`; both propeller dependencies share `component: "Composite propeller"`. Now render the specific `dependency` label: **Ratier-Figeac 568F-5 composite propeller** (C-295, oligopoly) vs **Dowty R391 composite propeller** (C-130J, single-source). |
| 4 | "92 of 256" vs "92 of 257" | The stat card hardcoded 256 while the FAQ computed 257. Added `meta.records` (computed once in the bake: 257) and both surfaces read `m.records`. Built output shows "92 of 257" in four places, "92 of 256" nowhere. |
| 5 | String slips | Lede comma: `companies,{' '}{m.suppliers}` (JSX collapses the newline). Companies stat card: raw `join()` of the type array replaced with human copy: "HAL and Tata-Airbus led; Tier-1 to Tier-3 tracked". |

**Verification:** `next build` passes (1,398 pages); /research shows the card in the pillars grid with Deep databases back to three; the home Atlas grid picks the card up automatically; no cluster shows 0 sites; the two propellers are distinguishable in the matrix; the record count is identical everywhere; all detail routes render; `_redirects` untouched (no splat, no loops). Commit: see git log.
