# SEO/GEO Verification Checklist
Run this before treating any page as complete.

## Page completeness
- [ ] Title and meta description are filled and unique for the route.
- [ ] OG and Twitter card fields are populated.
- [ ] Canonical URL is set and matches the published path.
- [ ] Structured data is present:
  - [ ] Organization/WebSite in site layout
  - [ ] Report JSON-LD on report pages
  - [ ] FAQPage JSON-LD on report pages with FAQ
  - [ ] Article JSON-LD on live signal pages
- [ ] No `U` claims in published content without an explicit uncertainty note.

## Internal linking
- [ ] Signal links to at least one related report or research page by keyword.
- [ ] Report links to at least one related signal or corridor page.
- [ ] No orphan pages with zero inbound internal links.

## GEO / AI citation readiness
- [ ] `/llms.txt` regenerates on deploy (`app/llms.txt/route.ts`).
- [ ] `GEO-PACKAGE-SIGNALS.md` guidance is applied to each live signal/report.
- [ ] Primary sources are present for every report/signal with factual claims.
- [ ] Evidence label glossary is present on published report pages.

## Outreach and backlinks
- [ ] Outreach targets are logged in `SEOGEO-OUTREACH-LOG.md`.
- [ ] Each outreach includes the required citation primer wording.
- [ ] Social amplification assets exist in `GEO-LINKEDIN-PACKAGE.md` with per-report hooks and CTAs.
- [ ] Each published LinkedIn/author post includes a link to a site landing page.

## Validation
- [ ] Log row in `SEOGEO-PLAN.md` is updated.
- [ ] Build passes after metadata/structured-data changes.
