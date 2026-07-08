# Techadyant Labs — SEO + GEO + Promotion Plan
Source of truth for growth work on https://labs.techadyant.com/

## 1. Executive Summary
Techadyant Labs has a strong niche: India-first industrial systems intelligence. The potential is high because the topic is strategic, undercovered, and relevant to policy, procurement, and venture audiences. Current risk is low discoverability: core metadata, knowledge-graph signals, and backlink authority are incomplete. This plan closes that gap with a tiered roadmap and a daily execution system.

For day-to-day operations, **`WEBSITE-MANAGER.md`** is the operating manual. This document remains the strategic plan and task log.

## 2. Current-State Assessment (Observed)
- Clear value proposition on homepage: industrial corridors, reports, signals, atlas, services.
- Strong topical cluster keywords already implied: AI infrastructure, semiconductors, advanced packaging, OSAT, drone battery ecosystem, coastal AI, talent constraint, Indian industry corridors.
- Missing or unverified: canonical SEO basics, structured data, GEO-optimized summaries, editorial authority pages, backlink acquisition system.
- Most pages appear framework-rendered (likely Astro/Next style), so metadata durability depends on code-level SEO configuration and a deployment build step.

## 3. Goals
- Increase organic discovery for high-intent industrial/systems keywords.
- Improve AI citation rate in generative answers for India industrial topics.
- Earn high-authority editorial and backlink placements.
- Convert research users into subscribers, briefings, or paid services.

## 4. SEO Roadmap
### Tier 1 — Foundation (Week 1–2)
1. Metadata audit: title, description, OG, Twitter cards, canonical URL for all main routes.
2. Add sitewide structured data: Organization, WebSite with SearchAction, Article/BlogPosting for signals.
3. Add or verify: robots.txt, XML sitemap, hreflang if needed.
4. Create core service and topical pillar pages.
5. Fix internal linking hygiene: no orphaned report or signal pages.

### Tier 2 — Content Authority (Week 3–6)
1. Build topic clusters: AI infrastructure, semiconductor dependency, industrial corridors, drone battery ecosystem, OSAT and packaging.
2. Publish long-form reference briefs for search capture.
3. Create author profiles and contributor pages for E-E-A-T.

### Tier 3 — Technical SEO (Week 7–8)
1. Core Web Vitals audit and fix.
2. Crawlability: review JS-rendered content exposure.
3. Analytics and monitoring setup.

## 5. GEO Roadmap
1. Create AI-friendly summaries: 1-sentence, 3-bullet, and 200-word plain-language summaries for every report/signal.
2. Publish machine-readable knowledge cards with explicit claims + evidence citations.
3. Add GEO terms to page metadata: "India strategic intelligence", "industrial systems analysis", "corridor intelligence".
4. Publish structured datasets or digestible outputs that AI systems can reference.
5. Register and monitor brand mentions on AI platforms.

## 6. Backlink & Promotion Strategy
Priority 1 — Authority
- Government and multilateral citations: DPIIT, NITI Aayog, industrial corridor pages, Indian embassies, World Bank, ADB.
- Industry associations: CII, FICCI, ASSOCHAM, IESA, SEMI, DSDP.
- Policy news and research desks: The Ken, Mint, Economic Times, Business Standard, Inc42, Medianama.
- International strategic analysis: RUSI, IISS, Carnegie India, CSEP.

Priority 2 — Niche Credibility
- Contributed analysis pieces, expert roundups, sector outlook posts.
- Conference and summit submissions for India tech/manufacturing/climate events.
- University research portals and think-tank libraries.

Priority 3 — Content Syndication
- Resumable signal-to-post adaptation for LinkedIn, X, and niche communities.
- Embeddable summary widgets for partners and analysts.
- Research paper citations and dataset dumps where relevant.

## 7. Daily Execution Playbook
Use this cadence to keep the program moving without bottlenecks.

### Every Day
- 1 content or metadata task (30–60 min)
- 1 outreach or connection action (20–40 min)
- 1 quality check on published content (15 min)
- Quick note: log the task, outcome, and next action in this doc.

### Weekly
- Review analytics and coverage anomalies.
- Publish one new signal or brief with complete SEO metadata and GEO summary.
- Outreach to 3–5 new high-authority contacts with a specific reason to cite Techadyant Labs.

### Monthly
- Backlink audit and lost-link recovery.
- Keyword and AI-citation tracking report.
- Editorial calendar review and adjustment.

## 8. Task Log
|----------------------------------------------------------|------------------------------------------------------|------------------|------------------|------------------------------------------------------|--------------------------------|
| 2026-06-16 | Audit live site and repo; create this plan | Ready | Start metadata audit and GEO summaries | SEOGEO-PLAN.md | Operator |
| 2026-06-16 | Rewrote /llms.txt structure and created GEO delivery template | Completed | Add GEO summary blocks to signal/report page components next | GEO-PACKAGE-SIGNALS.md | Hermes |
| 2026-06-16 | Added GEO block to signal page component and extended signal data schema with `sources` | Completed | Add sample `sources` to at least one published signal and one report entry | app/signals/data.ts | Hermes |
| 2026-06-16 | Added `sources` to report and signal `talent-may-matter-more-than-subsidies` | Completed | Wire `sources` into report page and add glossary/evidence-labels | app/reports/data.ts | Hermes |
| 2026-06-16 | Added Primary sources block to published report pages and Evidence labels line below FAQ | Completed | Verify markdown/compliance artifacts under facts/ folder and create if missing | app/reports/[slug]/page.tsx | Hermes |
| 2026-06-16 | Added Article JSON-LD to live signal page template and added `sources` to S-012/S-006/S-004 | Completed | Continue sequential signal source enrichment from oldest live signal forward | app/signals/[slug]/page.tsx | Hermes |
| 2026-06-16 | Completed sequential signal source enrichment for all live and monitoring signals (S-012, S-007, S-006, S-005, S-004, S-003, S-002, S-011, S-010, S-009, S-008) | Completed | Begin Tier 1 outreach per SEOGEO-OUTREACH-LOG.md; verify no duplicate `sources` blocks | app/signals/data.ts | Hermes |
| 2026-06-16 | Verified report page structured data block in `app/reports/[slug]/page.tsx` — Article JSON-LD + FAQPage JSON-LD already present | Completed | Begin Tier 1 outreach using required wording primer in SEOGEO-OUTREACH-LOG.md | app/reports/[slug]/page.tsx | Hermes |
| 2026-06-16 | Prepared Tier 1 outreach target list and citation primer for quality backlink creation | Ready | Send first batch of curated outreach emails to Priority 1 targets | SEOGEO-OUTREACH-LOG.md | Hermes |
| 2026-06-16 | Wrote ready-to-send outreach drafts and action playbook for backlink creation | Completed | Execute outreach sends for first 4 Tier 1 targets and update log outcomes | SEOGEO-OUTREACH-DRAFTS.md / SEOGEO-BACKLINK-ACTIONS.md / SEOGEO-OUTREACH-LOG.md | Hermes + Operator |
| 2026-06-16 | Verified send capability on current host and identified blocker: no mail tool present | Blocked | Operator should send drafts to Tier 1 targets as-is; next Hermes task is non-outreach workflow | Outreach execution environment | Hermes |
| 2026-06-16 | Verified internal linking surface and missing theme/crosslinks surface | Blocked | Operator to provide first outreach recipient or approve skipping outreach to continue; I should continue with LinkedIn/growth work next | Internal linking + outreach blocker | Hermes |
|| 2026-06-16 | Wrote GEO-LINKEDIN-PACKAGE.md with post bank and report-to-LinkedIn mapping | Completed | Publish first LinkedIn post draft and add site link CTA in engagement queue | LinkedIn growth package | Hermes |
|| 2026-06-22 | Took over permanent website management from Claude coworker onboard | Completed | Absorbed all coworker workstreams (Atlas, Corridors, Admin, Reports, Signals) into daily rhythm | WEBSITE-MANAGER.md | Hermes |
|| 2026-06-22 | Created WEBSITE-MANAGER.md — comprehensive operating manual | Completed | Daily 4-step rhythm established; cron jobs to be scheduled | WEBSITE-MANAGER.md | Hermes |
|| 2026-06-22 | Audit Atlas completeness: all 6 modules live, bake script ready | Completed | Verify `bake-sid.mjs` integrates with Supabase service-role and freshens `_atlas.json` on each deploy | scripts/bake-sid.mjs | Hermes |
|| 2026-06-22 | Audit corridor completeness: all 11 corridors to frozen standard | Completed | Back-fill nodes when PIB/IIG/state releases new data; verify `node-data.ts` type-checks | app/corridors/node-data.ts | Hermes |
|| 2026-06-22 | Audit admin panel: 16 pages live, Cloudflare Access gated | Completed | Review candidacy queue + subscribers weekly | app/admin/ | Hermes |
|| 2026-06-22 | India Fab Ecosystem report: config ready, entry in reports/data.ts | Ready | Publish PDF to Supabase `reports-free` and verify previewObject URL resolves 200 | report-configs/india-fab-ecosystem.json | Operator + Hermes |
| 2026-07-06 | Created quality backlink campaign and day-one outreach queue | Ready | Send 5 prepared pitches and log sent/replied outcomes | BACKLINK-CAMPAIGN-2026-07-06.md / SEOGEO-OUTREACH-DRAFTS.md / SEOGEO-OUTREACH-LOG.md | Hermes + Operator |
|
## 10. Daily Execution Strategy (Repeatable)
Do not improvise work selection. Use this sequence each day so progress is measurable and maintainable.

### Daily 4-Step Rhythm
1. Metadata / GEO task
2. Outreach / partnership task
3. Quality check
4. Log update

### Daily Task Templates
- "Update", "audit", or "add" metadata for one page.
- "Write and publish" one GEO summary for one report or signal.
- "Send" one outreach message or fill one partnership form.
- "Verify" one internal link or one structured-data item.

### Commitment Rule
The operator must reply with exactly one of:
- 1
- continue
- confirmed

Interpretation:
- 1 = execute the next item from Day 1 list
- continue = proceed with the current batch
- confirmed = accept recommendation and commit resources

If no reply is given, execute the next highest-priority item and report the result.

## 11. Validation Rule Set
Apply before closing any work item:
- Signal and report pages must be cross-linked by keyword or topic.
- Every report page has title, meta description, OG/Twitter summary.
- Every signal publish has GEO summary appended.
- Outreach messages contain one precise reason to cite Techadyant Labs.
- Log row is updated before moving to the next task.

## 12. Assigned Scope
This workflow applies only to https://labs.techadyant.com/ and the repository at D:\techadyant\labs_techadyant\techadyant_labs-main unless explicitly extended.

## 13. Expected Output Contract
Each daily deliverable is one verifiable artifact:
- metadata fix in code
- GEO summary in markdown
- outreach log with date and target
- corrected backlink or removed competitor pollution
