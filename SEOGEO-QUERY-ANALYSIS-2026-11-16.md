# SEOGEO Query Analysis - 2026-11-16

Source: GA4 Search Console reports in `D:\techadyant\Misc\google analytics reports`
(19 Oct - 15 Nov 2026, 28 days): landing pages (1,436) and queries (1,475), plus a
live crawl of all 2,592 sitemap URLs on 16 Nov.

## Headline

- 181 clicks / 18,778 impressions, 0.96% CTR. Up from 15 clicks / 2,924
  impressions in the 3-month August export, so visibility has grown roughly
  sixfold per month. Clicks have not kept pace.
- Two pages earn 18% of all clicks: the OSCOM explainer and the Matangi dossier.
- Player pages are the biggest section by impressions (3,738) and the weakest by
  CTR (0.6%, 23 clicks across 464 pages).
- Corridors convert best: 57 clicks from 3,077 impressions (1.9%), with node pages
  such as Satara at 6.6%.

## Sections (28 days)

| section | pages | impr | clicks |
|---|---|---|---|
| /research/players | 464 | 3,738 | 23 |
| /corridors | 40 | 3,077 | 57 |
| /research/explainers (OSCOM) | 1 | 2,127 | 16 |
| /research/pillars (defence) | 58 | 1,600 | 20 |
| /reports | 46 | 1,434 | 14 |
| /research/military-aerospace | 51 | 1,307 | 5 |
| /signals | 140 | 1,294 | 13 |
| /research/drones-uas | 133 | 1,126 | 11 |
| /research/space | 47 | 572 | 2 |
| /research/suppliers | 17 | 519 | 1 |

## FIXED in this batch (code changed, not yet built or deployed)

1. **Canonicals pointing at 404s (27 indexable pages).** 18 space company pages
   and 9 military-aerospace "pointer" company pages declared a canonical of
   `/research/<vertical>/<slug>/`, which returns 404; the page lives at
   `/research/<vertical>/company/<slug>/`. `lib/companyDossier.ts` now resolves
   both verticals and pointer dossiers to the live URL. Regression test extended
   (`scripts/seo-ctr-regression.cjs`, passing).
2. **Sitemap listed 117 noindex URLs and 4 dead URLs.** `app/sitemap.ts` now drops
   company/manufacturer pages served noindex (Tier C or thin registry) and four
   atlas records with no generated page: `drones-uas/company/aerovironment-inc-mfr-004`,
   `military-aerospace/company/godrej-aerospace`, `military-aerospace/company/ratier`,
   `space/company/in-space`.
3. **Title length.** 2,251 of 2,588 pages (87%) had titles over 65 characters. The
   root template no longer appends " — Techadyant Labs" (18 characters; Google
   shows the site name separately). This also removes 51 titles that named the
   brand twice. `/about/` now names the brand in its own title.
4. **Player pages (803).** Title tail "— profile, capabilities & India supply
   chain" (44 characters, wrong for technologies and schemes) replaced with a
   short type-aware tail. About 560 players had stub descriptions such as "Drone
   Intelligence Atlas."; meta description, Organization JSON-LD and the page lede
   now use a sentence built from the relationship graph.
5. **Descriptions cut mid-word.** Dossier pages sliced prose at 160 characters
   ("...acquisition o"). Dossier, signal, dependency-product and `/research/e/`
   descriptions now clamp at a word boundary (`app/lib/seoText.ts`). 835 pages had
   descriptions over 165 characters.
6. **Missing canonicals** added on `/about/`, `/contact/`, `/research/space/`.
7. **No og:image on 144 `/research/e/` pages** - default card added.
8. **Search snippets** for three page-1/2 zero-click dossiers: `mahindra-aero`
   (182 impr, pos 20), `nal` (107 impr), `hex20` (76 impr).

Not verified by a full build: `next build` was not run here. The changed files
type-check and the regression script passes. Run `npm run build` before pushing.
Delete `D:\techadyant\_to_delete\` (a temp tsconfig, a git lock file and a
temp branch ref that this session created and could not delete).

## Backlog (needs content or data work)

- **P1 Duplicate TASL records.** Three player records ("Tata Advanced Systems
  (TASL)", "Tata Advanced Systems Ltd (TASL)", "TASL Interceptor Drone Concept")
  and a military-aerospace pointer page compete for "tasl" (204 impr, pos 9.3,
  0 clicks). The ranking page has 128 words and no relationships. Merge into one
  full dossier and 301 the rest.
- **P1 "India X market" queries, 451 impr at pos 45-80, 0 clicks.** Water treatment
  (63), counter-UAS (45), industrial AI (42), signal intelligence (41), electronic
  warfare (20). Each report page needs a visible market-size answer block (figure,
  year, CAGR, source) near the top and the exact phrase in the H1.
- **P1 Precision machining, 413 impr at pos 30-85.** The category directory ranks
  for "precision components manufacturers in India" but is a filterable list. Add a
  buyer's-guide section (clusters, certifications, tolerances) above the directory.
- **P2 Thin pages.** 1,301 sitemap pages have under 200 words of main content.
  Largest groups: drones companies (79) and platforms (77), dependencies (69),
  counter-UAS systems (41). Either enrich or noindex the weakest.
- **P2 Duplicate dependency products.** At least 8 product names appear twice with
  identical titles (Photomask Blanks (EUV), Bare PCB Laminates (FR4), Tactical
  Data Links, Aircraft Wiring Harnesses, and others).
- **P2 EDA explainer.** "electronic design automation" family: about 200 impr at
  pos 40-90 landing on a 253-word player record. Write a proper explainer.
- **P3 OSCOM.** 2,127 impr at pos 5.7, 0.75% CTR. The query is navigational
  (people want IREL's own site); title and description have been tuned three
  times. Leave it.
- **P3 UUID player URLs** (`/research/players/<uuid>`) return 404 and received
  visits. Find the internal or external links producing them.

## Topic demand (28-day impressions by query cluster)

| cluster | impr | clicks | note |
|---|---|---|---|
| OSCOM / IREL / rare earths | 1,695 | 13 | navigational, high volume |
| Military aerospace companies and platforms | 698 | 0 | TASL, Mahindra Aerospace, C-17, Mirage 2000 |
| Industrial corridors and nodes | 643 | 5 | best CTR on the site at page level |
| "India X market" | 451 | 0 | pos 45-80 |
| Matangi / autonomous vessels | 433 | 7 | pos 6-10 |
| Semiconductors / EDA | 428 | 1 | EDA family about 200 |
| Precision machining suppliers | 413 | 0 | pos 30-85 |
| Drones / counter-UAS | 273 | 0 | |
| AI infrastructure | 271 | 0 | networking fabric, GPU, cooling |
| DRDO labs / full forms | 263 | 1 | |

### Video candidates (not already in V03-V21)
1. Matangi: India's crewless ship and the Mumbai-Thoothukudi run
2. Inside OSCOM: the Odisha beach where India's rare earths start
3. Delhi-Mumbai Industrial Corridor: what is built, node by node
4. Tata's C-295 line: India's first private military aircraft factory
5. EDA: the three foreign software firms every Indian chip depends on
6. How India shoots down drones: the counter-UAS stack
7. IndiaAI's GPU pool: who gets the compute and where it sits
8. Who makes India's precision parts? The machining clusters
9. DRDO's labs explained (Shorts series: GTRE, CEMILAC, DEBEL, DIPAS, DIHAR)
10. AMCA: who builds India's stealth fighter, and with whose engine

### Report candidates (no existing report)
1. India Counter-UAS Market 2026-2035
2. India Precision Machining and Components Supplier Landscape
3. India's EDA and Chip-Design Software Dependency
4. India Industrial Corridors: Node-by-Node Investor Status
5. India AI Data-Centre Networking and Optical Interconnect Supply Chain
6. India EO/IR Payload and Thermal Imaging Supply Chain
7. India SIGINT and C4ISR Market (spin-off from the EW report)
8. India Military Transport Aircraft: C-295 Supply Chain and the MTA Decision
