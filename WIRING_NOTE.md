# WIRING NOTE — Matangi USV + Sagar Defence Engineering

**Branch intended:** `atlas/matangi-sagar-defence`
**Date:** 2026-09-09
**Scope:** two Entity Dossiers wired into the Defence (naval / maritime unmanned) vertical.

> The sandbox VM was unavailable for this session, so **no `git` branch was created and no build was run.**
> Changes are on disk in the working tree. Create the branch locally before committing:
> `git checkout -b atlas/matangi-sagar-defence`

---

## 1. Paths — and why they differ from the brief

The brief asked for `/research/defence/system/…` and `/research/defence/company/…`.
**There is no `app/research/defence/` route family in this repo.** Defence lives at
`app/research/pillars/defence/`, and its only dynamic entity route is `entity/[slug]`.
Per the brief's fallback ("create under the nearest live Defence / military pillar structure"),
both dossiers were wired there. No new routes were created.

| Entity | Type | Tier | Live path |
|---|---|---|---|
| Matangi (Autonomous Surface Vessel) | `system` | **A** | `/research/pillars/defence/entity/matangi-usv/` |
| Sagar Defence Engineering | `company` | **A** | `/research/pillars/defence/entity/sagar-defence-engineering/` |

Both `parent_hub_path` and `cta.track_ecosystem` point at `/research/pillars/defence/navy-coast-guard/`
(the live maritime service Atlas). **Matangi was NOT registered under `/research/drones-uas/`** — no file
under `app/research/drones-uas/` or `app/research/_drones.json` was touched.

Both are **Tier A** deliberately: `TIER_SECTIONS` in `react-dossier/types.ts` drops
`timeline`, `intelligence_assessment`, `faq` and **`open_questions`** at Tier B, and the
open questions are load-bearing for these two entities.

---

## 2. Files added

- `data/company-dossiers/matangi-usv.json`
- `data/company-dossiers/sagar-defence-engineering.json`

Placed in `data/company-dossiers/` (not `data/dossiers/`) because the defence vertical is served by
`COMPANY_DOSSIER_MAP` → `loadCompanyDossier(slug, 'defence')`, which is what
`app/research/pillars/defence/entity/[slug]/page.tsx` calls.

## 3. Files edited (4)

**`lib/companyDossierMap.ts`** — 2 imports + 2 map entries, both inside
`// --- MANUAL ADDITIONS (not from MANIFEST.json) — keep on regeneration ---` markers.
The file header says "Generated from Atlas MANIFEST.json. Do not edit manually." No generator was
available this session; the markers exist so a future regeneration does not silently drop these two.
**Follow-up: add both to the Atlas MANIFEST so the generator emits them.**

**`app/research/pillars/defence/entity/[slug]/page.tsx`** — `generateStaticParams` now also emits the
two slugs. Necessary because `listStaticParamsForBase()` reads `DOSSIER_MAP`, not `COMPANY_DOSSIER_MAP`;
existing defence dossiers only prerender when a same-slug entity happens to exist in `_defence.json`,
and these two have no counterpart there (verified: no `Sagar`/`Matangi` match in `_defence.json`).
Also added `seen.add()` in the pre-existing `dataSlugs` loop — it could previously emit duplicate params.

**`app/research/pillars/defence/page.tsx`** — one new "Maritime unmanned · naval autonomy" card in the
existing *Cross-service intelligence* grid, linking both entities. Uses the existing `card`/`kick`
styles and `Link`; no new component, no CSS.

**`app/sitemap.ts`** — the two routes added to `defenceRoutes`. The sitemap enumerates defence entities
from `_defence.json` only, so dossier-only entities were otherwise indexable but undiscoverable.
*(Note: this same gap silently affects the ~60 other defence dossiers registered only in
`COMPANY_DOSSIER_MAP`. Not fixed here — out of scope for this PR.)*

FAQ + JSON-LD ride the existing `_companyDossierPage` → `renderJsonLdScripts` path via each dossier's
`seo.json_ld_types`. No Signals pipeline change. Suggested future signal slug:
`india-maritime-autonomy-demonstration-to-induction`.

---

## 4. Claims deliberately NOT asserted

Everything below appears in press but is **not** stated as fact in the dossiers:

- **Any Matangi induction, fleet strength or platform order.** No primary MoD/Navy document located.
  Matangi's `status` is `In trials`; the transit is described throughout as a demonstration/validation
  passage. `induction_maturity` scored 1/5.
- **12 autonomous weaponised boat swarms (10 Navy / 2 Army, Pangong Lake) and 30 AUVs.** Recorded in
  `deployments_procurement.rows` prefixed **"REPORTED IN SECONDARY PRESS ONLY"** with the sourcing named,
  and flagged again in `open_questions`. Whether these are an AoN, a placed order or deliveries is unresolved.
- **The "iDEX 50th SPRINT contract, 5 January 2022".** Recorded as *disputed* — a January 2022 SPRINT
  contract conflicts with the public SPRINT launch timeline. Framework and date left open.
- **Indigenous content %.** Not disclosed anywhere; not inferred. `indigenous_label` is "Not disclosed".
- **Import dependency profile.** No BOM published, so `import_dependencies.items` is empty with an explicit
  note rather than an invented severity table.
- **Andhra Pradesh shipyard as capacity.** Recorded as announced industrial footprint (29.58 acres,
  foundation stone laid) with a published schedule — not delivered capacity.
- **Company website URL.** Omitted rather than guessed; corporate basics rest on a company database
  (`indicative`) and are flagged as unverified against a filing. One listing gives Mumbai, not Pune —
  noted in open questions.
- **Any equivalence between the Matangi transit hull and the weaponised FIC/swarm family.** The idrw
  source is carried at `indicative` and explicitly annotated as *not* supporting any Matangi claim.

No source is tiered `official` except the Indian Navy's own announcement of the passage.
`labs.techadyant.com` is **not** cited as a source in either dossier.

---

## 5. Open questions carried in the dossiers

Matangi: production vs demonstration configuration · relationship to the later weaponised/swarm products ·
existence of any primary platform contract · public technical baseline for the autonomy suite
(sensors, autonomy level, NavIC as primary or fallback) · **"Genesis" vs "GENISYS" naming** · indigenous %.

Sagar Defence: primary contract numbers and values for FIC/swarm and AUV offtake · AoN vs order vs delivery ·
iDEX contract date and framework · Matangi-to-swarm product lineage · autonomy-suite baseline and naming ·
indigenous % · incorporation details, founding year and HQ city unverified against a filing.

---

## 6. Sources used

| # | Publisher | Trust | URL |
|---|---|---|---|
| 1 | Indian Navy (@indiannavy) | official | https://x.com/indiannavy/status/1851593148620796287 |
| 2 | The Statesman | credible | https://www.thestatesman.com/india/autonomous-vessel-matangi-embarks-on-mumbai-tuticorin-mission-pioneering-indias-maritime-innovation-1503359356.html |
| 3 | India Strategic | credible | https://www.indiastrategic.in/sagar-defence-engineering-completes-sagarmala-parikrama-autonomous-voyage-with-indian-navy-support/ |
| 4 | Millennium Post | credible | https://www.millenniumpost.in/nation/sagarmala-parikrama-completes-first-leg-with-autonomous-passage-585197 |
| 5 | FORCE India | credible | https://forceindia.net/blog/sagar-defence-engineering-completes-sagarmala-parikrama-autonomous-voyage |
| 6 | Republic World | credible | https://www.republicworld.com/defence/defence-technology/india-making-strides-in-autonomous-maritime-security-with-matangi-usvs-350-nautical-miles-journey |
| 7 | Organiser | indicative | https://organiser.org/2023/10/05/199496/bharat/pune-defence-startup-to-provide-unmanned-weaponised-boats-undersea-drones-to-armed-forces-to-counter-chinese-forays/ |
| 8 | Indian Defence Research Wing | indicative | https://idrw.org/indian-navy-to-deploy-weaponised-unmanned-surface-vessels-developed-by-sagar-defence/ |
| 9 | YourStory | credible | https://yourstory.com/2026/08/sagar-defence-uncrewed-boats |
| 10 | Raksha Anirveda | credible | https://raksha-anirveda.com/silent-sentinels-at-sea-sagar-defence-and-indian-navys-unmanned-leap/ |
| 11 | The Week | credible | https://www.theweek.in/news/maritime/2026/03/13/andhra-pradesh-to-get-world-s-first-autonomous-maritime-shipbuilding-centre-why-it-matters.html |
| 12 | Maritime Gateway | credible | https://www.maritimegateway.com/andhra-pradesh-clears-sagar-defences-autonomous-maritime-shipyard-project/ |
| 13 | Tracxn | indicative | https://tracxn.com/d/companies/sagar-defence-engineering/__eXU6EUAmNumH8bR-TqsvjntkJnwZw9VdLam1nAW-MLw |

One publisher per source object; every entry is a deep link except the Tracxn profile.
`thehindu.com` is blocked to this agent's fetcher, so the referenced Hindu piece could not be verified
and is **not** cited — the same facts are carried by sources 1–6 instead.

---

## 7. Verification status — read before merging

**Not run this session (VM down):** `next build`, `tsc`, `git`, and JSON parse validation.
Both JSON files were re-read end-to-end after writing and are structurally complete and closed;
all `sources: [...]` id references were composed against the source lists in the same file.
Per `CLAUDE.md`, the Read tool is *not* authoritative about mount truncation — confirm with
`wc -l` / `tail` on the five touched files before committing.

Also note the standing repo caveat: standalone `tsc` reports ~20,000 environmental TS7026 errors
under pnpm. **`npm run build` is the only authoritative check.**

### Post-merge spot-check
- `/research/pillars/defence/entity/matangi-usv/` → 200, full dossier (What It Is, Deployments, Timeline, FAQ, Open Questions, Sources), **not** a thin stub
- `/research/pillars/defence/entity/sagar-defence-engineering/` → 200, same
- `/research/pillars/defence/` → "Maritime unmanned" card renders with both links
- Both URLs present in `/sitemap.xml`; neither carries `noindex`
- No new `/research/drones-uas/` route or platform-directory entry

## 8. Rollback
Revert the 4 map/route/hub/sitemap edits and delete the two JSON files. Nothing else depends on them.
