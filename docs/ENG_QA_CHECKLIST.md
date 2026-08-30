# ENG_QA_CHECKLIST — Engineering QA Checklist

**Project:** Techadyant Atlas Entity Dossier
**Generated:** 2026-08-29
**Purpose:** Pre-merge engineering QA checklist. Every item must be ✅ before PR is opened.

## 1. Type safety

- [ ] `react/types.ts` compiles with strict TypeScript (no `any` in public types)
- [ ] Every section component imports types from `../types` (no inline type literals)
- [ ] `EntityDossier` interface matches `schema/dossier.schema.json` field-for-field
- [ ] `DOSSIER_SECTION_ORDER` and `TIER_SECTIONS` are `as const` (readonly tuples)
- [ ] `tierAllowsSection()` returns false for any (tier, section) not in `TIER_SECTIONS`

## 2. Dossier JSON validation

- [ ] Every `data/dossiers/*.json` file parses with `JSON.parse` (no trailing commas, no comments)
- [ ] Every dossier has all required top-level keys: `entity_id`, `entity_type`, `tier`, `noindex`, `slug`, `name`, `vertical`, `parent_hub_path`, `last_verified`, `status`, `header`, `at_a_glance`, `sources`, `seo`
- [ ] Every Tier A/B dossier has `sources[]` with at least 1 entry
- [ ] Every source has: `id`, `title`, `publisher`, `url`, `trust_tier`, `accessed` (the 6 required fields)
- [ ] `trust_tier` ∈ {`official`, `credible`, `indicative`, `methodology`}
- [ ] `status` ∈ {`Operational`, `In trials`, `Ordered`, `Prototype`, `Development`, `Retired`, `Unknown`}
- [ ] `severity` (if present) ∈ {`Critical`, `High`, `Medium`, `Low`, `Unknown`}
- [ ] `tier` ∈ {`A`, `B`, `C`}
- [ ] `noindex: true` for every Tier C dossier
- [ ] `last_verified` is a valid ISO date (YYYY-MM-DD)

## 3. Source hygiene

- [ ] No `labs.techadyant.com` URLs anywhere in any `sources[].url`
- [ ] No `labs.techadyant.com` URLs in `canonical_path` (canonical_path is relative, starting with `/`)
- [ ] Each `sources[]` entry has exactly ONE publisher (no " + ", " & ", " and ", " / " separators in `publisher` field)
- [ ] `trust_tier: "official"` only used for PIB, MoD, exchange filings, BEL/BDL/HAL/MDL/GRSE IR pages, DRDO, OEM official product pages
- [ ] `trust_tier: "credible"` for ET, TOI, Janes, Livefist, The Hindu, Reuters, Bloomberg, NDTV, HT
- [ ] `trust_tier: "indicative"` for trade press, blogs, vendor brochures, Wikipedia
- [ ] `trust_tier: "methodology"` reserved for Atlas methodology references

## 4. React component behaviour

- [ ] `EntityDossierView` renders only sections in `TIER_SECTIONS[dossier.tier]`
- [ ] `EntityDossierView` hides any section whose data is missing (no empty headings)
- [ ] Every section component handles the case where `sources[]` is empty (no `[1]` citations rendered)
- [ ] `HeaderSection` displays the status chip with correct `data-status` attribute for CSS styling
- [ ] `SourcesSection` sorts sources by `id` (e.g., `src-1`, `src-2`, ...)
- [ ] `GraphSection` returns `null` if all graph arrays are empty (no empty "Knowledge Graph" heading)
- [ ] `FAQSection` returns `null` if `faq[]` is empty
- [ ] `OpenQuestionsSection` returns `null` if `open_questions[]` is empty

## 5. JSON-LD structured data

- [ ] `robotsForTier("C")` returns `{ index: false, follow: true }`
- [ ] `robotsForTier("A")` and `robotsForTier("B")` return `{ index: true, follow: true }`
- [ ] `webPageJsonLd()` emits `@type: WebPage` with `name`, `description`, `url`, `dateModified`
- [ ] `productJsonLd()` returns `null` for `entity_type` ∈ {`manufacturer`, `company`, `programme`}
- [ ] `organizationJsonLd()` returns `null` for `entity_type` ∈ {`system`, `platform`}
- [ ] `faqJsonLd()` returns `null` when `faq[]` is empty
- [ ] `breadcrumbJsonLd()` always emits (every dossier has breadcrumbs)
- [ ] `renderJsonLdScripts()` emits one `<script type="application/ld+json">` per non-null block

## 6. loadDossier MAP

- [ ] `loadDossier("nonexistent-slug")` returns `{ found: false, dossier: null }`
- [ ] `loadDossier(<MAP'd slug>)` returns `{ found: true, dossier: <EntityDossier> }`
- [ ] `listDossierSlugs()` returns an array of all MAP keys
- [ ] `listDossiersByVertical("counter-uas")` returns only counter-uas dossiers
- [ ] Adding a new dossier requires: (1) drop JSON at `data/dossiers/{slug}.json`, (2) add import + MAP entry in `lib/loadDossier.ts`

## 7. App Router page templates

- [ ] `/research/counter-uas/system/[slug]` route exists with `generateMetadata` + `generateStaticParams`
- [ ] `/research/counter-uas/manufacturer/[slug]` route exists
- [ ] `/research/pillars/defence/entity/[slug]` route exists
- [ ] `/research/drones-uas/platform/[slug]` route exists (reserved for D4)
- [ ] `/research/drones-uas/company/[slug]` route exists (reserved for D4)
- [ ] `/research/military-aerospace/entity/[slug]` route exists (reserved for D4)
- [ ] `/research/space/entity/[slug]` route exists (reserved for D4)
- [ ] `generateMetadata` returns `robots: { index: false, follow: true }` for Tier C dossiers
- [ ] `generateMetadata` returns `robots: { index: true, follow: true }` for Tier A/B dossiers
- [ ] Non-MAP'd slugs render the thin legacy page (not a 404)

## 8. Soft-launch gate

- [ ] `lib/loadDossier.ts` MAP contains only the slugs intended for soft-launch
- [ ] All MAP'd Tier A/B dossiers have been reviewed for source hygiene (G3, G4, G5)
- [ ] All Tier C dossiers have `noindex: true` (G6)
- [ ] `MANIFEST.json` and `MANIFEST.csv` regenerated after any MAP change
- [ ] `PROJECT_STATUS.md` counts match actual file counts

## 9. Build verification

- [ ] `npm run build` (or `pnpm build`) succeeds with no TypeScript errors
- [ ] `npm run lint` (or `pnpm lint`) succeeds with no warnings
- [ ] At least one dossier of each tier (A, B, C) renders correctly in dev mode
- [ ] At least one dossier of each entity_type (system, manufacturer, platform) renders correctly
- [ ] `/research/counter-uas/system/integrated-counter-drone-system-cus-001/` returns HTTP 200
- [ ] `/research/counter-uas/system/nonexistent-slug/` returns HTTP 200 with thin legacy page (not 404)

## 10. Post-merge verification

- [ ] Staging deployment succeeds
- [ ] Sitemap.xml regenerated (if applicable) — Tier C slugs should be excluded
- [ ] Google Search Console: submit staging sitemap; verify Tier A/B pages indexed within 14 days (see PHASE_SOFT_LAUNCH_OPS.md)
- [ ] Spot-check 3 Tier A dossiers: BEL ICDS, Zen ZADS, HAL
- [ ] Spot-check 1 Tier C dossier: confirms noindex meta is set in HTTP response

---

## Quick command reference

```bash
# Validate every dossier JSON parses
python3 -c "
import json, glob
for p in sorted(glob.glob('data/dossiers/*.json')):
    with open(p) as f:
        json.load(f)
print('All JSON valid')
"

# Check no labs.techadyant.com URLs in sources
python3 -c "
import json, glob
for p in sorted(glob.glob('data/dossiers/*.json')):
    with open(p) as f:
        d = json.load(f)
    for s in d.get('sources', []):
        if 'labs.techadyant.com' in s.get('url', ''):
            print(f'FAIL: {p} {s[\"id\"]}')
print('Source URL check complete')
"

# Count dossiers by tier
python3 -c "
import json, glob
from collections import Counter
c = Counter()
for p in glob.glob('data/dossiers/*.json'):
    with open(p) as f:
        d = json.load(f)
    c[d['tier']] += 1
print(f'Tier A: {c[\"A\"]}, Tier B: {c[\"B\"]}, Tier C: {c[\"C\"]}')
"
```
