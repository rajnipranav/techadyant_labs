# SEO & GEO data connections (Route A - script reports)

Two scripts pull real search-performance and backlink data into `seo-reports/`.
They need credentials created **once** on your side (about 5-10 minutes), then
everything else is automated.

## 1. Google Search Console -> `scripts/gsc-report.mjs`

### You need to do (once)
1. Make sure **labs.techadyant.com** is verified in
   [Google Search Console](https://search.google.com/search-console)
   (add a *domain* property: `labs.techadyant.com`).
2. In [Google Cloud Console](https://console.cloud.google.com):
   - Create or select a project
   - **APIs & Services > Library** -> enable **"Search Console API"**
   - **Credentials > Create Credentials > OAuth client ID** -> type **Desktop app**
   - Download the JSON and save it to:
     `seo-credentials/gsc-client-secret.json` (folder is gitignored)
3. If the OAuth consent screen is in "Testing" mode, add your Google account
   as a **test user** (Console > OAuth consent screen > Audience > Test users).
4. In Search Console: **Settings > Users and permissions** -> add the same
   Google account (Owner or Full).

### Then
```bash
node scripts/gsc-report.mjs
```
First run opens a browser for one-time authorisation. The token is cached in
`seo-tokens/gsc-token.json` (gitignored) and auto-refreshes.

Output: `seo-reports/gsc-YYYY-MM-DD.md` - top queries, top pages, CTR
opportunities (>=100 impressions with CTR <2%), 28-day window.

Optional env: `GSC_SITE` (default `sc-domain:labs.techadyant.com`),
`GSC_CLIENT_SECRET` (path override).

## 2. Ahrefs -> `scripts/ahrefs-report.mjs`

### You need to do (once)
1. A **paid Ahrefs plan** - API access is included with paid plans.
2. Generate a token at [ahrefs.com/api](https://ahrefs.com/api)
   (or Ahrefs app > profile > **API token**).
3. Add to the repo `.env` (already gitignored):
   ```
   AHREFS_API_TOKEN=<your-token>
   ```

### Then
```bash
node scripts/ahrefs-report.mjs
```
Output: `seo-reports/ahrefs-YYYY-MM-DD.md` - domain summary (Domain Rating,
backlinks, referring domains), new backlinks (30d), top organic keywords.
Endpoints not included in your plan fail gracefully and are skipped.

Optional env: `AHREFS_TARGET` (default `labs.techadyant.com`).

## Security
- `seo-credentials/`, `seo-tokens/` and `.env` are gitignored - never commit
  credentials or tokens.
- `seo-reports/` is safe to commit (site metrics only, no secrets).
- Do not paste tokens in chat; put them in the files above and tell me the paths.

## Automation ideas (after first successful run)
- Weekly: `node scripts/gsc-report.mjs` via cron, report lands in `seo-reports/`.
- I can read the reports and turn them into action rows in `SEOGEO-PLAN.md`,
  or wire a monthly SEO digest.
