# PHASE_SOFT_LAUNCH_OPS — Phase Soft-Launch Ops Runbook

**Project:** Techadyant Atlas Entity Dossier
**Generated:** 2026-08-29
**Purpose:** Operational runbook for the soft-launch phase. Defines what to monitor, what to roll back, and what to do at each milestone.

## Soft-launch definition

Per spec section C.7: **Only MAP'd slugs get the dossier view; all other slugs render the existing thin legacy page.** Rollback = remove slug from MAP.

## Soft-launch scope

**MAP'd slugs (current):** 115 total
- Tier A: 30 slugs (priority Indian operational systems + manufacturers + defence entities)
- Tier B: 3 slugs (Indian systems with thin primary-source record — cus-056, 057, 058)
- Tier C: 85 slugs (foreign + Indian entities with insufficient evidence — `noindex=true`)

**Stricter soft-launch option:** If desired, the MAP can be reduced to Tier A+B only (33 slugs) by removing Tier C imports from `lib/loadDossier.ts`. Tier C slugs would then render the thin legacy page instead of the noindex dossier card. To do this, comment out the Tier C import block in `lib/loadDossier.ts` and remove the corresponding MAP entries.

## T-7 days (one week before launch)

- [ ] Confirm `MANIFEST.json` and `MANIFEST.csv` match the intended MAP
- [ ] Run `ENG_QA_CHECKLIST.md` — all items must be ✅
- [ ] Merge PR per `COMMIT_AND_PR.md` to staging branch
- [ ] Run `STAGING_QA_SCRIPT.md` against staging — all phases must pass
- [ ] Notify stakeholders (Atlas editorial team, SEO lead, devops) of soft-launch date
- [ ] Prepare rollback plan (see "Rollback procedure" below)

## T-0 (launch day)

- [ ] Promote staging to production per devops runbook
- [ ] Smoke test production: `curl -sI https://labs.techadyant.com/research/counter-uas/system/integrated-counter-drone-system-cus-001/` returns HTTP 200
- [ ] Verify sitemap.xml regenerated and contains Tier A/B URLs only
- [ ] Submit sitemap.xml to Google Search Console
- [ ] Submit sitemap.xml to Bing Webmaster Tools
- [ ] Monitor error rate in application logs for the first hour
- [ ] Spot-check 5 Tier A dossiers in production browser:
  - `/research/counter-uas/system/integrated-counter-drone-system-cus-001/` (BEL ICDS)
  - `/research/counter-uas/system/zen-anti-drone-system-zads-cus-003/` (Zen ZADS)
  - `/research/counter-uas/system/bhargavastra-counter-drone-system-cus-004/` (Bhargavastra)
  - `/research/counter-uas/manufacturer/bharat-electronics-limited-bel-mfg-001/` (BEL)
  - `/research/pillars/defence/entity/zorawar-light-tank-def-001/` (Zorawar)
- [ ] Spot-check 1 Tier C dossier: verify `noindex` meta is set in HTTP response headers AND in HTML `<meta>` tag

## T+1 day

- [ ] Check Google Search Console for any crawl errors
- [ ] Check server logs for any 404s or 500s on dossier URLs
- [ ] Verify Google has started crawling the new dossier URLs (Search Console → URL Inspection)
- [ ] Monitor organic traffic to dossier pages in analytics

## T+7 days

- [ ] Check Google Search Console: Tier A/B dossier URLs should be "Discovered — currently not indexed" or "Indexed"
- [ ] Run a sample query on Google: `site:labs.techadyant.com "BEL Integrated Counter Drone"` — should return the cus-001 page
- [ ] Verify Tier C dossier URLs are NOT indexed: `site:labs.techadyant.com "Rafael Drone Dome"` — should return 0 results (noindex is working)

## T+14 days (POST_LAUNCH_14_DAY checkpoint)

- [ ] **All Tier A/B dossier URLs should be indexed by Google.** If any are still "Discovered — currently not indexed" after 14 days, investigate:
  - Is the canonical URL correct?
  - Are there any internal links to the dossier from other indexed pages?
  - Is the sitemap.xml correctly submitted?
  - Are there any manual actions in Search Console?
- [ ] Check organic impressions and clicks for dossier pages in Search Console Performance report
- [ ] Compare dossier page engagement metrics (bounce rate, time on page, scroll depth) against the legacy thin pages
- [ ] Collect feedback from Atlas editorial team on editorial usability
- [ ] Identify the top 5 dossiers by organic traffic and the bottom 5 — investigate why bottom 5 underperform

## T+30 days

- [ ] First batch of Tier C elevation candidates identified — conduct primary-source research on the 10 most promising Tier C slugs and elevate to Tier B or A
- [ ] Run the next batch of D3 (defence hub full crawl) and D4 (drones-uas, military-aerospace, space verticals) per `PROJECT_STATUS.md` outstanding work
- [ ] Re-verify quality gates (G1–G9) — regenerate `QUALITY_GATES_REPORT.md`
- [ ] Regenerate `MANIFEST.json` and `MANIFEST.csv` with any new dossiers added

## Rollback procedure

If a critical issue is discovered post-launch:

### Full rollback (revert to pre-soft-launch state)

1. Revert the merge commit on the main branch: `git revert <merge-commit-sha>`
2. Deploy the reverted main branch to production
3. Verify production homepage and hub pages still return HTTP 200
4. Verify that all dossier URLs now return the thin legacy page (not the new dossier view)
5. File a post-mortem issue describing the rollback reason

### Partial rollback (remove specific slugs from MAP)

If only specific dossiers have issues (e.g., a fact error discovered in cus-004 Bhargavastra):

1. Edit `lib/loadDossier.ts`:
   - Comment out the import for the affected slug
   - Remove the affected slug from the `DOSSIER_MAP` object
2. Push a hotfix branch and merge to main per `COMMIT_AND_PR.md`
3. Deploy to production
4. Verify the affected slug URL now returns the thin legacy page (HTTP 200, no `ed-section` elements)
5. Fix the dossier JSON in a follow-up PR

### Emergency kill-switch

If a critical SEO issue is discovered (e.g., all Tier C pages are accidentally being indexed):

1. Edit `lib/loadDossier.ts` to comment out ALL imports and empty the `DOSSIER_MAP` object:
   ```typescript
   export const DOSSIER_MAP: Record<string, EntityDossier> = {
     // EMERGENCY KILL-SWITCH: all dossier rendering disabled
   };
   ```
2. Deploy immediately
3. All dossier URLs will now return the thin legacy page
4. Investigate and fix the underlying issue
5. Restore MAP entries one batch at a time, verifying each batch in staging before production

## Monitoring dashboards

The following dashboards should be set up before soft-launch:

### Application dashboard
- HTTP 5xx error rate on `/research/counter-uas/system/*` and `/research/counter-uas/manufacturer/*` and `/research/pillars/defence/entity/*` routes
- HTTP 4xx error rate on the same routes
- Average page load time for dossier URLs (target: < 2 seconds)
- Cache hit rate for dossier pages (if Next.js ISR is used)

### SEO dashboard (Google Search Console)
- Total impressions for dossier URLs (weekly trend)
- Total clicks for dossier URLs (weekly trend)
- Average position for dossier URLs in search results
- Crawl errors on dossier URLs
- Sitemap submission status and processed URLs count

### Content dashboard
- Number of dossiers by tier (should match MANIFEST.json)
- Number of dossiers with zero sources (should be 0 for Tier A/B)
- Number of Tier C dossiers with noindex=true (should equal Tier C count)
- Last verified date distribution (no dossier should be > 90 days old without re-verification)

## Escalation matrix

| Issue type | Severity | Escalate to | Response SLA |
|------------|----------|-------------|--------------|
| Production 5xx errors on dossier URLs | Sev-1 | DevOps + Engineering lead | 15 minutes |
| Tier C dossier URL appearing in Google index | Sev-1 | SEO lead + Engineering | 1 hour |
| Fact error discovered in a Tier A dossier | Sev-2 | Atlas editorial + Engineering | 4 hours |
| Performance regression (page load > 5s) | Sev-2 | DevOps + Engineering | 4 hours |
| Sitemap.xml not being processed by Google | Sev-3 | SEO lead | 24 hours |
| Tier A/B dossier not indexed after 14 days | Sev-3 | SEO lead | 24 hours |

## Communication plan

- **T-7 days:** Email to all-hands with soft-launch date and scope
- **T-0 (launch day):** Slack announcement in #atlas-launch channel when production is live
- **T+1 day:** Daily standup update on crawl/index status
- **T+7 days:** Weekly summary email to stakeholders with crawl/index status and any issues
- **T+14 days:** POST_LAUNCH_14_DAY checkpoint report to stakeholders
- **T+30 days:** Monthly retrospective with Atlas editorial, engineering, and SEO teams
