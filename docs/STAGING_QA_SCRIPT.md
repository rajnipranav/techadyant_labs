# STAGING_QA_SCRIPT — Staging QA Script

**Project:** Techadyant Atlas Entity Dossier
**Generated:** 2026-08-29
**Purpose:** Step-by-step QA script to run against the staging deployment before promoting to production.

## Prerequisites

- Staging URL: `https://staging.labs.techadyant.com` (replace with actual staging URL)
- `curl` and `jq` installed
- Google Search Console access for the staging property
- A local clone of the `atlas-entity-dossier` repo with the latest changes

## Phase 1: Smoke tests (5 minutes)

### 1.1 Homepage + hub pages

```bash
STAGING_URL="https://staging.labs.techadyant.com"

# Homepage returns 200
curl -sI "$STAGING_URL/" | head -1
# Expected: HTTP/2 200

# Counter-UAS hub returns 200
curl -sI "$STAGING_URL/research/counter-uas/" | head -1
# Expected: HTTP/2 200

# Defence hub returns 200
curl -sI "$STAGING_URL/research/pillars/defence/" | head -1
# Expected: HTTP/2 200
```

### 1.2 Tier A dossier renders

```bash
# BEL ICDS — Tier A system
curl -sI "$STAGING_URL/research/counter-uas/system/integrated-counter-drone-system-cus-001/" | head -1
# Expected: HTTP/2 200

# Check key content is present in the rendered HTML
curl -s "$STAGING_URL/research/counter-uas/system/integrated-counter-drone-system-cus-001/" | grep -c "Operation Sindoor"
# Expected: >= 1

# HAL — Tier A manufacturer
curl -sI "$STAGING_URL/research/counter-uas/manufacturer/hindustan-aeronautics-limited-hal-mfg-017/" | head -1
# Expected: HTTP/2 200

# Zorawar — Tier A defence entity
curl -sI "$STAGING_URL/research/pillars/defence/entity/zorawar-light-tank-def-001/" | head -1
# Expected: HTTP/2 200
```

### 1.3 Tier C dossier renders with noindex

```bash
# A Tier C system (foreign)
curl -sI "$STAGING_URL/research/counter-uas/system/rafael-drone-dome-cus-024/" | head -1
# Expected: HTTP/2 200

# Check noindex meta tag is present
curl -s "$STAGING_URL/research/counter-uas/system/rafael-drone-dome-cus-024/" | grep -i "robots"
# Expected: <meta name="robots" content="noindex, follow">
```

### 1.4 Non-MAP'd slug renders thin legacy page

```bash
# A slug that is NOT in the MAP (if any remain in the Atlas register but not in MAP)
curl -sI "$STAGING_URL/research/counter-uas/system/some-future-slug-not-yet-in-map/" | head -1
# Expected: HTTP/2 200 (not 404 — the thin legacy page renders)

# Check that the page renders the "Atlas record not yet elevated" message
curl -s "$STAGING_URL/research/counter-uas/system/some-future-slug-not-yet-in-map/" | grep -c "not yet elevated"
# Expected: >= 1
```

## Phase 2: SEO / structured data validation (10 minutes)

### 2.1 canonical URL + robots meta per tier

```bash
STAGING_URL="https://staging.labs.techadyant.com"

# Tier A: index, follow + correct canonical
curl -s "$STAGING_URL/research/counter-uas/system/integrated-counter-drone-system-cus-001/" | \
  grep -E '(<meta name="robots"|<link rel="canonical")'
# Expected:
#   <meta name="robots" content="index, follow">
#   <link rel="canonical" href="https://labs.techadyant.com/research/counter-uas/system/integrated-counter-drone-system-cus-001/"/>

# Tier C: noindex, follow
curl -s "$STAGING_URL/research/counter-uas/system/rafael-drone-dome-cus-024/" | \
  grep -E '<meta name="robots"'
# Expected:
#   <meta name="robots" content="noindex, follow">
```

### 2.2 JSON-LD structured data

```bash
# Tier A dossier should have 4 JSON-LD blocks: WebPage, Product (or Organization), FAQPage (if faq present), BreadcrumbList
curl -s "$STAGING_URL/research/counter-uas/system/integrated-counter-drone-system-cus-001/" | \
  grep -c 'application/ld+json'
# Expected: >= 3 (WebPage + Product + BreadcrumbList; +1 if FAQ present)

# Validate each JSON-LD block parses
curl -s "$STAGING_URL/research/counter-uas/system/integrated-counter-drone-system-cus-001/" | \
  python3 -c "
import sys, re, json
html = sys.stdin.read()
blocks = re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.DOTALL)
print(f'Found {len(blocks)} JSON-LD blocks')
for i, b in enumerate(blocks):
    try:
        data = json.loads(b)
        print(f'  Block {i+1}: @type={data.get(\"@type\")} — VALID')
    except Exception as e:
        print(f'  Block {i+1}: INVALID — {e}')
"
```

### 2.3 Sitemap.xml

```bash
# Sitemap should be regenerated and contain Tier A/B URLs but NOT Tier C URLs
curl -s "$STAGING_URL/sitemap.xml" | grep -c "integrated-counter-drone-system-cus-001"
# Expected: >= 1

curl -s "$STAGING_URL/sitemap.xml" | grep -c "rafael-drone-dome-cus-024"
# Expected: 0 (Tier C should be excluded from sitemap)
```

## Phase 3: Source hygiene validation (5 minutes)

### 3.1 No labs.techadyant.com URLs in any source

```bash
# Run from the repo root
python3 -c "
import json, glob
fail = 0
for p in sorted(glob.glob('data/dossiers/*.json')):
    with open(p) as f:
        d = json.load(f)
    for s in d.get('sources', []):
        if 'labs.techadyant.com' in s.get('url', ''):
            print(f'FAIL: {p} source {s[\"id\"]} — {s[\"url\"]}')
            fail += 1
if fail == 0:
    print('PASS: no labs.techadyant.com URLs in any source')
else:
    print(f'FAIL: {fail} violations found')
"
```

### 3.2 All Tier A/B dossiers have at least one source

```bash
python3 -c "
import json, glob
fail = 0
for p in sorted(glob.glob('data/dossiers/*.json')):
    with open(p) as f:
        d = json.load(f)
    if d['tier'] in ('A', 'B') and len(d.get('sources', [])) == 0:
        print(f'FAIL: {p} — Tier {d[\"tier\"]} with zero sources')
        fail += 1
if fail == 0:
    print('PASS: all Tier A/B dossiers have at least one source')
"
```

### 3.3 All Tier C dossiers have noindex=true

```bash
python3 -c "
import json, glob
fail = 0
for p in sorted(glob.glob('data/dossiers/*.json')):
    with open(p) as f:
        d = json.load(f)
    if d['tier'] == 'C' and not d.get('noindex', False):
        print(f'FAIL: {p} — Tier C without noindex=true')
        fail += 1
if fail == 0:
    print('PASS: all Tier C dossiers have noindex=true')
"
```

## Phase 4: Performance + accessibility (5 minutes)

### 4.1 Lighthouse audit (Chrome DevTools)

Open the following URLs in Chrome DevTools → Lighthouse → Performance + Accessibility + SEO:

- `https://staging.labs.techadyant.com/research/counter-uas/system/integrated-counter-drone-system-cus-001/`
- `https://staging.labs.techadyant.com/research/counter-uas/manufacturer/hindustan-aeronautics-limited-hal-mfg-017/`
- `https://staging.labs.techadyant.com/research/pillars/defence/entity/zorawar-light-tank-def-001/`

**Acceptance criteria:**
- Performance ≥ 90
- Accessibility ≥ 95
- SEO ≥ 95
- Best Practices ≥ 90

### 4.2 Mobile responsive check

Open each of the above URLs on a mobile viewport (375px width) and verify:
- Header title wraps cleanly
- At-a-glance grid stacks to 2 columns then 1
- Tables scroll horizontally if needed
- Source list stacks to 1 column

## Phase 5: Regression tests (10 minutes)

### 5.1 Verify pre-existing pages still work

The soft-launch must NOT break any pre-existing Atlas pages. Verify:

```bash
STAGING_URL="https://staging.labs.techadyant.com"

# Hub pages
curl -sI "$STAGING_URL/research/" | head -1
curl -sI "$STAGING_URL/research/counter-uas/" | head -1
curl -sI "$STAGING_URL/research/drones-uas/" | head -1
curl -sI "$STAGING_URL/research/military-aerospace/" | head -1
curl -sI "$STAGING_URL/research/space/" | head -1
curl -sI "$STAGING_URL/research/pillars/defence/" | head -1
# All should return HTTP/2 200

# Non-dossier entity pages (legacy register pages that are NOT in the MAP)
# These should continue to render the legacy page
# Replace with actual non-MAP'd slugs from the Atlas register
# curl -sI "$STAGING_URL/research/counter-uas/system/some-legacy-slug/" | head -1
# Expected: HTTP/2 200 with legacy page
```

### 5.2 Verify soft-launch slugs

Confirm that the Tier A+B dossiers render the new dossier view (not the legacy page):

```bash
# Should render EntityDossierView (with sections like "What It Is", "Kill Chain", etc.)
curl -s "$STAGING_URL/research/counter-uas/system/integrated-counter-drone-system-cus-001/" | grep -c "ed-section"
# Expected: >= 5 (multiple section elements rendered)
```

## Phase 6: Go/no-go decision

After all phases above pass:

- [ ] Phase 1 smoke tests: ALL PASS
- [ ] Phase 2 SEO/structured data: ALL PASS
- [ ] Phase 3 source hygiene: ALL PASS
- [ ] Phase 4 performance/accessibility: ALL within acceptance criteria
- [ ] Phase 5 regression tests: ALL PASS (no pre-existing pages broken)

**If all PASS:** proceed to production promotion per `COMMIT_AND_PR.md`.

**If any FAIL:** file an issue, block promotion, fix the issue on a new branch, re-run this script.

## Sign-off

- Engineer: __________________  Date: __________
- QA reviewer: __________________  Date: __________
- Product owner: __________________  Date: __________
