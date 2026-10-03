# Organic CTR improvement — 3 October 2026

The supplied GA4 Search Console-linked exports cover 1 January–3 October 2026. Landing pages: 303 clicks / 30,079 impressions = 1.01% CTR. Visible queries: 62 / 7,809 = 0.79%. Query totals cover a smaller population and must not be treated as the site total. These are exported-row totals, not independently verified property totals.

## First changes

Shorten Matangi and CEMILAC dossier search titles and remove duplicated brand suffixes from dossiers and signals. Add a plant-specific OSCOM player snippet. Give the IndiaAI GPU signal a dated, descriptive snippet and support CMS metadata overrides. Give BMIC a searchable acronym and node-map title. Preserve published report headlines, canonical URLs, tier/noindex rules and user edits to signals/data.ts.

## Highest-impact follow-up

AI infrastructure report: 8 clicks / 2,279 impressions, position 8.39. Its existing SEO title already names data centres and GPUs; do not assume it is still using the editorial headline. Get query-by-page data before another title change. The visible export contains Agentforce quiz queries, but these exports do not prove which page received them. Do not add quiz content to the industrial research report.

IndiaAI signal: 0 / 992, position 8.09. Test the dated compute-update snippet; it describes an August update rather than promising current GPU inventory.

OSCOM: player 3 / 518, explainer 2 / 452, entity 1 / 212. This overlap is a possible intent conflict, not proof of cannibalisation. Keep the explainer for “what is OSCOM” and player for plant/products. Confirm canonical destinations and query-by-page overlap before redirecting or noindexing anything.

Application-era report: 0 / 823, position 13.19. Ranking is part of the problem. It already has an agent/application SEO title. Inspect query intent and competing results before restructuring it.

Reports index: 0 / 405, position 56.21. Title rewriting alone is unlikely to fix this. Prioritise topic hubs and useful internal links from relevant indexed pages.

## Measurement

Record the actual deployment date; local changes cannot affect Google. Export Search Console Web-search data for the 28 days before deployment and days 8–35 after it, with page, query, country and device. Compare the same query/page/device/country cohorts and similar position ranges. Keep branded and non-branded traffic separate. Wait for recrawl and check which title Google actually displays. For pages with few impressions, extend the window rather than declaring a winner from a handful of clicks.

An illustrative 3% CTR on the AI report's existing impressions would mean about 68 clicks versus 8, or about 60 extra clicks. This is a test assumption, not a forecast or promise. The priority CSV uses that same explicitly modelled 3% assumption only for pages with at least 100 impressions and average position 4–12 whose CTR is below 3%. Do not sum its projections as guaranteed growth.

Google can choose different title links and snippets. Relevant concise titles and accurate page-specific descriptions are the controllable inputs; position, SERP features and query mix also affect CTR.

Sources: https://developers.google.com/search/docs/appearance/title-link and https://developers.google.com/search/docs/appearance/snippet


## Live Search Console follow-up

Read the existing authorised Search Console property using Web search and final data. Recent period: 3–30 September 2026; previous: 6 August–2 September 2026. Recent property aggregate: 157 clicks / 11,708 impressions = 1.34% CTR, average position 11.32. Previous: 95 / 10,547 = 0.90%, position 22.85. Clicks rose 65.3%; CTR rose 0.44 percentage points (48.9% relative). This predates deployment of these changes and cannot be attributed to them. The changing ranking and query mix prevent a causal comparison.

The recent AI report has 1 click / 953 impressions (0.10%, position 5.92), but its filtered query export exposes only 12 impressions. Search Console suppresses anonymised queries and filters can change the returned population. We cannot explain the remaining impressions or promise that a title rewrite will fix them. The recent IndiaAI signal similarly has no disclosed filtered query rows despite 175 page impressions; zero rows means unavailable query evidence, not zero traffic.

The Agentforce quiz queries are confirmed on the application-era report in the previous period. Preserve its intended industrial analysis rather than adding quiz answers. OSCOM has verified query intent for full form and location; its explainer now directly answers that intent, cites IREL and correctly uses IREL’s official expansion, Orissa Sands Complex. Its rare-earth output is described as mixed chloride rather than finished magnets or individual high-purity metals. The OSCOM player links readers to that explainer. ADA and GTRE now have concise acronym/programme search snippets.

Matangi’s recent “matangi ship” cohort in India: mobile 10 / 539 = 1.86%, desktop 3 / 45 = 6.67%. Mobile is the larger test population, but device positions and small desktop volume differ; this is not proof of a mobile layout defect.

Raw API evidence is saved locally as gsc-28-day-comparison.json; ranked recent/previous page metrics are in recent-page-comparison.csv. API rows are top-returned rows, not guaranteed complete inventories. New metadata and source-checked OSCOM content still require deployment and recrawl.

Validation: the first pass compiled, exported all 3,494 static pages and passed TypeScript. The production build reported an existing ESLint flat-config compatibility issue; successful compilation did not constitute a clean lint pass. A second production export must verify this follow-up before release.


### Canonical route correction

Export verification found that legacy military-company manifest paths omit `/company/`. This makes the CEMILAC, ADA and GTRE pages declare canonicals different from their actual public routes; their JSON-LD repeats the legacy paths. The loader now normalises matching military company/manufacturer entries to `/research/military-aerospace/company/<slug>/`, keeps generated maps intact and aligns dossier canonical, entity path, breadcrumb parent and ecosystem CTA. Other verticals, system/platform dossiers, deep paths and indexing tiers are unaffected. This fixes the declared canonical; Google’s selected canonical still needs a post-deployment inspection.


### Structured-data correction

HTML verification also found that the dossier JSON-LD helper returned complete script tags while both React callers wrapped those strings in another script tag. The exported payload therefore was not valid JSON. The shared react-dossier helper now returns JSON payloads only, escaping `<` for safe embedding; callers retain one script element per block. Export verification parses every JSON-LD block on the target pages and checks that military-company schema URLs use the corrected public paths. Valid schema does not guarantee rich results or a CTR increase.


### Release validation

Production export completed for 3,494 routes. The eight target exports have verified descriptions, one brand suffix per title, expected canonical URLs and no noindex restriction. Their JSON-LD blocks parse as JSON, and checked military-company schema URLs match their real routes. Canonical and JSON-LD regression checks pass, including preservation of modern routes, platforms, other verticals, pointer entries, tier rules and imported source data. Run `node scripts/seo-ctr-regression.cjs` for those regression checks. The existing ESLint configuration warning remains and is not described as a clean lint result. The staged release excludes the user’s pre-existing signal-data edits and raw API query evidence.

Final check: TypeScript passed after the final build. Canonical and WebPage schema correction verified on all 12 affected non-pointer military-company exports; cross-vertical pointer entries retain their existing handling. All eight priority pages passed metadata and JSON-LD parsing checks.
