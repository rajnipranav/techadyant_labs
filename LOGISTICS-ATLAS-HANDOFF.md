# LOGISTICS-ATLAS-HANDOFF — India Integrated Logistics Atlas (v1)

_Module shipped 8 Oct 2026. Owner: Techadyant Labs research engineering._
_Companion signal: S-144 (SME Growth Fund + ITLA, 6 Oct 2026)._

---

## 1. What shipped (v1 — reference layer)

- **SID schema** `logistics` on Supabase project `umtfafscgbxgmmqlktlx` ("n8ndb"):
  `supabase/logistics-schema.sql` (tables + RPC) and `supabase/logistics-seed.sql` (sourced seed rows). Run **schema first, then seed**, in the Supabase SQL editor. Both are idempotent.
- **Export RPC** `public.logistics_export()` — SECURITY DEFINER, returns the whole dataset as jsonb with per-record `sources[]` joined from the `logistics.record_sources` link table (mirrors `sid.capture_assessment_sources`).
- **Bake script** `scripts/bake-logistics.mjs` — wired into `npm run build` (after `bake-sid`). Calls the RPC with `N8NDB_URL` + `N8NDB_SERVICE_ROLE_KEY`, writes `app/research/_logistics.json`. Env absent / RPC failure / invalid payload ⇒ keeps the committed snapshot, exit 0. First run with no committed snapshot ⇒ materialises the seed fallback `scripts/logistics-seed.json` (which mirrors the SQL seed; **the SQL is authoritative for the SID**).
- **Page** `/research/logistics` (`app/research/logistics/page.tsx` + `data.ts`), reusing the Atlas design system (`AtlasNav`, `VizPanel`/`StackedBar`/`BarList`, verification-label colours from `app/research/insights.ts`). Wired into: `AtlasNav` ("Logistics" top-level item), Atlas overview ("Deep databases" card), `/corridors/` hero ("Related" link), `sitemap.ts`, `llms.txt`.
- **Verification labels**: the Atlas's three labels verbatim (`verified`, `single-source`, `analyst-assessed`) **plus a fourth — `needs a human source`** — for records whose facts are not yet captured from any primary. Its definition ships in the page and in the RPC payload's `evidence_standard`.

## 2. Verification state — the honest ledger

**`verified` (two independent primaries on file):** WDFC corridor and the DFC programme row — corrected 8 Oct 2026 (see §8).
The two 6-Oct-2026 Cabinet decisions are *verified-able* the moment the PIB release URLs are pinned (see §4); PM India + PIB would then be two primary Government-of-India publications on file, with Business Standard / The Hindu / Economic Times / DD News (6–7 Oct 2026) as further corroboration.

**`single_source` (one primary captured; figures asserted):**

| Record | Figures on file | Primary source (captured) |
|---|---|---|
| ITLA (authority) | ₹500 cr appraisal threshold; 10+ yr National Transport Master Plan; NTDR datasets (e-way bill, FASTag, Vahan, GPS, urban traffic); freight-flow/O-D analytics; NLP review mandate | PM India release, 6 Oct 2026 — https://www.pmindia.gov.in/en/news_updates/cabinet-approves-setting-up-of-integrated-transport-logistics-authority/ (full text captured 8 Oct 2026) |
| SME Growth Fund | ₹10,000 cr Government commitment; direct equity; Budget 2026-27 Para 28 anchor | PM India release, 6 Oct 2026 — https://www.pmindia.gov.in/en/news_updates/cabinet-approves-commitment-of-rs-10000-crore-towards-establishment-of-the-sme-growth-fund-for-direct-equity-investments-in-small-and-medium-enterprises-to-create-future-champions/ (full text captured 8 Oct 2026) |
| DFC (EDFC+WDFC) | Superseded 8 Oct 2026 — see §8 (EDFC 1,337 km complete; WDFC fully operational) | PIB 2023; PMO + JICA 2026 |
| Bharatmala Pariyojana | 26,425/34,800 km awarded; 19,826 km constructed; 6,669 km greenfield awarded; 4,610 km completed; ₹4,92,562 cr expenditure (as on 28 Feb 2025) | PIB/I&B specific doc, 1 Apr 2025 — https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/apr/doc202541530501.pdf (PDF downloaded + text-extracted 8 Oct 2026) |
| PM Gati Shakti | 115 NH/road projects, ~13,500 km, ₹6.38 lakh cr evaluated (13 Mar 2025); NPG programme-wide 352 projects, ₹16.10 lakh cr (10 Feb 2026) | PIB/I&B doc above (first figure set, captured); PIB release 10 Feb 2026 (second set, title+snippet confirmed, URL pin pending) |
| IWAI / National Waterways | 145.5 MMT cargo FY 2024-25 | PIB release, 24 Apr 2025 (snippet from pib.gov.in; URL pin pending) |
| Major ports cargo | 915 MT FY 2025-26 (PIB 11 Apr 2026); 855 MT FY 2024-25 and 819 MT FY 2023-24 (MoPSW via NewsOnAir/Prasar Bharati) | PIB release 11 Apr 2026 + newsonair.gov.in report (both snippet-confirmed; URL pins pending) |
| Mumbai Port (node) | 68.63 MT FY 2024-25, highest ever | MoPSW Annual Report 2025-26 (snippet from shipmin.gov.in; PDF path pin pending) |

**`needs a human source` (records exist, figures deliberately blank):**
National Logistics Policy (launch date/targets — dpiit.gov.in is Akamai-blocked from the build sandbox), Sagarmala (programme totals — shipmin.gov.in WAF-rejected automated fetch), ULIP (official API/system counts — secondary counts conflict: 114/36/8 vs 125/39/11, so none is asserted), LEADS (no edition captured), MMLPs (11-under-Phase-II vs 35-network framings unreconciled), EDFC/WDFC corridor rows (lengths/endpoints kept empty), Deendayal Port + JNPA nodes (throughput kept empty).

**Leads only (recorded as sources with `is_primary = false`, never asserted as facts):** IMPRI post citing a PIB-2026 "all 2,843 km commissioned" statement; MoRTH Year-End Review 2025 via indiashippingnews.com (35 MMLPs, ~₹46,000 cr); Business Standard 6 Oct 2026 (ITLA corroboration).

## 3. Full source register (every source, with date + capture status)

| # | Source id | Publisher | Title (abridged) | Date | URL | Capture |
|---|---|---|---|---|---|---|
| 1 | pm-india-itla-20261006 | PM India | Cabinet approves setting up of ITLA | 2026-10-06 | https://www.pmindia.gov.in/en/news_updates/cabinet-approves-setting-up-of-integrated-transport-logistics-authority/ | **captured** (full text) |
| 2 | pm-india-sgf-20261006 | PM India | Cabinet approves Rs 10,000 cr SME Growth Fund | 2026-10-06 | https://www.pmindia.gov.in/en/news_updates/cabinet-approves-commitment-of-rs-10000-crore-towards-establishment-of-the-sme-growth-fund-for-direct-equity-investments-in-small-and-medium-enterprises-to-create-future-champions/ | **captured** (full text) |
| 3 | pib-doc-infra-20250401 | PIB / I&B | Building Bharat — Powering Infrastructure Through Make in India | 2025-04-01 | https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/apr/doc202541530501.pdf | **captured** (PDF extracted) |
| 4 | pib-itla-20261006 | PIB | Cabinet approves setting up of ITLA | 2026-10-06 | (PRID pending) | title+date confirmed |
| 5 | pib-sgf-20261006 | PIB | Small and Medium Enterprises Growth Fund | 2026-10-06 | (PRID pending) | title+date confirmed |
| 6 | pib-bharatmala-20250313 | PIB | Implementation of Bharatmala Pariyojana | 2025-03-13 | (PRID pending) | snippet confirmed (matches #3 verbatim) |
| 7 | pib-dfc-20250319 | PIB / MoR | Advances Infrastructure with Dedicated Freight Corridors | 2025-03-19 | (PRID pending) | title+date confirmed |
| 8 | pib-gatishakti-npg-20260210 | PIB | PM GatiShakti NPG Evaluates 352 Projects Worth ₹16.10 Lakh Cr | 2026-02-10 | (PRID pending) | snippet confirmed |
| 9 | pib-iwai-20250424 | PIB / IWAI | India's Record Cargo Movement on Inland Waterways — 145.5 MMT FY25 | 2025-04-24 | (PRID pending) | snippet confirmed |
| 10 | pib-sagarmala-20260411 | PIB | Sagarmala: Transforming India's Maritime Landscape | 2026-04-11 | (PRID pending) | snippet confirmed |
| 11 | pib-nlp-3years-20250916 | PIB | India Marks Three Years of National Logistics Policy | 2025-09-16 | (PRID pending) | title+date confirmed |
| 12 | pib-ulip-nldsl-20260708 | PIB | NICDC's NLDSL and Govt of Punjab (ULIP) | 2026-07-08 | (PRID pending) | snippet confirmed |
| 13 | dpiit-nlp-page | DPIIT | National Logistics Policy (NLP) page | n.d. | (path pending; host www.dpiit.gov.in confirmed) | title confirmed |
| 14 | shipmin-sagarmala-page | MoPSW | SAGARMALA programme page | n.d. | (path pending; host shipmin.gov.in confirmed) | title confirmed |
| 15 | shipmin-ar-2025-26 | MoPSW | Annual Report 2025-26 | 2026 | (PDF path pending) | snippet confirmed |
| 16 | newsonair-ports-fy25 | NewsOnAir (Prasar Bharati) | Major ports cargo record 855 MT | ~Apr 2025 | (URL pending) | snippet confirmed |
| 17 | dfccil-statement-2025 | DFCCIL / MoR | 2025 statement: ~2,557 km commissioned | 2025 | (link pending; dfccil.com reachable, annual-report page is menu-generated) | snippet confirmed |
| 18 | morth-yer-2025-mirror | MoRTH via indiashippingnews.com | Year End Review 2025 (MMLP framing) | 2025-12-31 | (URL pending) | **lead only** |
| 19 | impri-dfc-2026 | IMPRI | DFC decade commentary (2,843 km claim) | 2026-08-09 | (URL pending) | **lead only** |
| 20 | bs-itla-20261006 | Business Standard | Cabinet approves new transport body | 2026-10-06 | (URL pending) | **lead only** |
| 21 | ddnews-itla-20261006 | DD News (Prasar Bharati) | Cabinet approves ITLA | 2026-10-06 | (URL pending) | lead (govt broadcaster) |

Note on the sandbox: `pib.gov.in` (main site), `dpiit.gov.in`, `shipmin.gov.in` (WAF), `iwai.nic.in`, `pmgatishakti.gov.in` rejected automated access from the build environment; `static.pib.gov.in`, `dfccil.com`, `newsonair.gov.in` and `pmindia.gov.in` (via reader) were accessible. That is why several PIB PRIDs are "title+date confirmed" rather than pinned — a human with a normal browser can close each gap in minutes.

## 4. Upgrade path to `verified` (the next human session)

1. Pin PIB PRIDs for #4–#12 (search pib.gov.in for each title; PRIDs land in `logistics.sources.url`). Upgrades: **ITLA → verified**, **SME Fund → verified**, Gati Shakti/IWAI/ports rows gain second references.
2. Capture the DFCCIL annual report from dfccil.com (Reports → Annual Report) → **DFC gains its second primary**; reconcile the 2026 "fully commissioned" claim (#19) against it.
3. Capture Sagarmala programme totals from shipmin.gov.in or #10 → **Sagarmala → single_source with figures**.
4. Capture the DPIIT NLP canonical URL + ULIP official API/system count → fills those rows.
5. Reconcile MMLP counts (11 Phase-II vs 35 network) from PIB/MoRTH originals.
6. After any capture: `insert/upsert` into `logistics.sources` + `logistics.record_sources`, re-run seed, rebuild (`npm run build`) — the page re-bakes automatically. Never edit `_logistics.json`.

## 5. v2 / v3 status

- **v2 (projects ≥ ₹500 crore)**: table `logistics.projects` exists with the `cost_cr >= 500` check; **deliberately empty**. Add rows only with a captured primary record per project. The page renders an honest empty-state explaining the gate.
- **v3 (freight-flow / O-D)**: **stub, marked "needs a human source"** on the page. ITLA's NTDR is the mandate hook; no public flow dataset is captured, so no flows are modelled. The "opportunity surfaces" block records this as a *potential* capability conditional on future public releases.
- **Opportunity surfaces**: 3 rows, all `unverified`, all carrying the caveat "Potential, not procurement." They never assert that government will procure anything.

## 6. Deploy — the ONE rule

Cloudflare Pages builds **only `main`**. Nothing is live until these changes are a commit on `main` and `main` is pushed. Steps for the operator:

1. Apply `supabase/logistics-schema.sql` then `supabase/logistics-seed.sql` on project `umtfafscgbxgmmqlktlx` (SQL editor). Verify: `select logistics_export();` returns the full payload.
2. Ensure Cloudflare build env has `N8NDB_URL` + `N8NDB_SERVICE_ROLE_KEY` (and the CMS pair). With them, `bake-logistics` replaces the seed fallback with live SID data on every build; without them the committed snapshot ships (still correct, just not SID-live).
3. Commit to `main` and push: `git push origin main`. Cloudflare rebuilds → `labs.techadyant.com/research/logistics/` goes live.

Local gates passed before commit: `tsc --noEmit` exit 0; `next build` (static export) exit 0; page visually verified desktop + mobile.

## 7. Guardrails honoured

- `data.ts`, `_atlas.json`, `_logistics.json` — none hand-edited; `_logistics.json` is generated by `scripts/bake-logistics.mjs` (current content == seed fallback, bit-for-bit from `scripts/logistics-seed.json`).
- No figure, date, company or coordinate was fabricated; every metric in the payload traces to a `record_sources` row with capture status.
- Trade press appears only as flagged leads; it is never a sole source.
- "Announced" (approved 6 Oct 2026) is distinguished from "built/operational" on every card via the `status` field.

## 8. Review correction — 8 Oct 2026 (applied before wiring)

The 2025 seed figure "~2,557 km commissioned (~90%)" was stale. Primary sources captured on 8 Oct 2026:
- **EDFC** Ludhiana–Sonnagar, **1,337 km**, construction fully completed — PIB, 13 Dec 2023 (https://pib.gov.in/PressReleaseIframePage.aspx?PRID=1985782).
- **WDFC** Dadri–JNPT completed and fully operational after the final 326 route km were dedicated on 8 Sep 2026 — PMO (https://www.pmindia.gov.in/?p=16920780) + JICA (https://www.jica.go.jp/english/overseas/india/information/press/2026/1585189_70871.html); DFCCIL route page gives 1,504 km, JICA 1,506 km.

Changes: `supabase/logistics-seed.sql` (appended idempotent correction block), `scripts/logistics-seed.json`, regenerated `app/research/_logistics.json` (via `bake-logistics.mjs` seed fallback), three metric labels in `data.ts`, corridor section note in `page.tsx`. The IMPRI lead is no longer cited for DFC. DFC programme and WDFC → `verified`; EDFC → `single_source`; network row → `verified` (combined 2,843 km completed, total-network length null because Sonnagar–Dankuni is excluded).

Still gated on the owner: applying `supabase/logistics-schema.sql` + `logistics-seed.sql` to SID. Until then the committed snapshot ships (correct content).
