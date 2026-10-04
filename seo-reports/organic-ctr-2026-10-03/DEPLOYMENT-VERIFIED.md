# CTR release deployed — 3 October 2026

Commit: `ff7dcee` — Improve organic search snippets and OSCOM intent match.

Pushed to `origin/main`; Cloudflare Pages check completed successfully. Live verification passed on all eight priority URLs: HTTP 200, expected title with one brand suffix, expected canonical and parseable JSON-LD. Local export also verified corrected canonical and WebPage schema URLs on all 12 affected non-pointer military-company pages. Regression checks and TypeScript passed; production export completed. The pre-existing ESLint flat-config incompatibility remains; no clean lint result is claimed.

The release excludes pre-existing user edits to `app/signals/data.ts` and the raw Search Console query export. Those remain local. GitHub’s existing IndexNow post-deploy workflow was still running at the successful live check; IndexNow targets participating engines and is not a Google recrawl request.

## Measure the effect

Pre-release comparison window: 5 September–2 October 2026, once final Search Console data is available. Transition window: 3–10 October. Post-release comparison window: 11 October–7 November 2026 (28 days). Compare matched page/query/device/country cohorts, similar position ranges and branded versus non-branded traffic. If Google has not recrawled the pages by the post-period start, shift the evaluation window and record that change. Extend the period for low-volume cohorts.

The already-observed rise from 0.90% to 1.34% CTR in the earlier consecutive windows predates this deployment. No CTR increase is attributed to the release yet. Google can still choose alternative title links, snippets and canonical URLs.

Priority observations: Matangi “matangi ship” on Indian mobile searches; OSCOM definition/full-form/location queries; CEMILAC/DRDO and GTRE queries. The AI infrastructure report’s filtered query evidence covers too little of its page impressions to justify another title rewrite. It remains a high-impression research question for the next analysis.

Evidence: `live-verification.json`, `deployment-checks.json`, `verified-metadata.json`, `recent-page-comparison.csv`. This deployment note and raw API evidence are local analysis files, separate from the pushed code release.
