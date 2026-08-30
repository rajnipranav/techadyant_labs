# COMMIT_AND_PR — Commit and Pull Request Runbook

**Project:** Techadyant Atlas Entity Dossier
**Generated:** 2026-08-29
**Purpose:** Step-by-step runbook for committing and opening a PR for the Techadyant Atlas Entity Dossier project.

## Pre-commit checklist

Before opening a PR, ensure:

- [ ] `ENG_QA_CHECKLIST.md` — all items ✅
- [ ] `STAGING_QA_SCRIPT.md` — all phases pass on staging
- [ ] `MANIFEST.json` and `MANIFEST.csv` are regenerated and reflect the current `data/dossiers/*.json` files
- [ ] `docs/PROJECT_STATUS.md` counts match actual file counts
- [ ] `docs/QUALITY_GATES_REPORT.md` shows all gates PASS (or FAIL items have been triaged)
- [ ] `docs/REGISTER_TICKETS.md` lists every open data conflict
- [ ] No `labs.techadyant.com` URLs anywhere in any source (run the validator in `ENG_QA_CHECKLIST.md` section 3)
- [ ] All Tier C dossiers have `noindex: true`
- [ ] All Tier A/B dossiers have at least one source

## Branch strategy

### Branch naming

```
feat/atlas-entity-dossier-<milestone>
```

Examples:
- `feat/atlas-entity-dossier-initial-scaffold` — the initial React scaffold + loadDossier + page templates
- `feat/atlas-entity-dossier-cuas-systems-tier-a` — Tier A counter-UAS system dossiers
- `feat/atlas-entity-dossier-cuas-manufacturers` — counter-UAS manufacturer dossiers
- `feat/atlas-entity-dossier-defence-hub` — defence hub entity dossiers
- `feat/atlas-entity-dossier-tier-c-placeholders` — Tier C placeholder dossiers for remaining inventory
- `feat/atlas-entity-dossier-d4-other-verticals` — D4 follow-up (drones-uas, military-aerospace, space)

### Commit message convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat` — new feature (new dossier, new section component, new page template)
- `fix` — bug fix (typo in dossier, broken link, schema violation)
- `docs` — documentation only (ENG_QA_CHECKLIST, PROJECT_STATUS)
- `chore` — maintenance (regenerate MANIFEST, bump dependencies)
- `refactor` — code change that neither fixes a bug nor adds a feature
- `test` — adding or correcting tests

Scopes:
- `schema` — `schema/dossier.schema.json` changes
- `react` — `react/` directory changes (types, components, jsonLd, css)
- `lib` — `lib/loadDossier.ts` changes
- `app` — `app/` directory changes (page templates)
- `data` — `data/dossiers/*.json` changes (individual dossiers)
- `manifest` — `MANIFEST.json` / `MANIFEST.csv` changes
- `docs` — `docs/*.md` changes

Examples:
```
feat(react): add EntityDossierView composer with tier-aware section rendering

feat(data): add BEL ICDS V2 dossier (cus-001) with 4 primary sources

fix(data): correct Bhargavastra maker attribution from BBBS to SDAL (cus-004)

docs: add ENG_QA_CHECKLIST and STAGING_QA_SCRIPT runbooks

chore(manifest): regenerate MANIFEST after adding 12 defence entity dossiers
```

## Step-by-step PR workflow

### Step 1: Create a feature branch

```bash
git checkout main
git pull origin main
git checkout -b feat/atlas-entity-dossier-<milestone>
```

### Step 2: Stage and commit changes

Group related changes into logical commits. Do NOT mix data, code, and docs in the same commit if they can be separated.

```bash
# Example: separate commits for schema, react scaffold, data, docs
git add schema/dossier.schema.json
git commit -m "feat(schema): add dossier.schema.json matching Techadyant Atlas spec"

git add react/
git commit -m "feat(react): add TypeScript types, EntityDossierView, 13 section components, jsonLd, design tokens"

git add lib/loadDossier.ts app/
git commit -m "feat(lib,app): add loadDossier MAP and 6 App Router page templates"

git add data/dossiers/*.json
git commit -m "feat(data): add 30 Tier A dossiers (cuas systems + manufacturers + defence entities)"

git add MANIFEST.json MANIFEST.csv docs/
git commit -m "docs: add MANIFEST, REGISTER_TICKETS, PROJECT_STATUS, ENG_QA_CHECKLIST, STAGING_QA_SCRIPT, PHASE_SOFT_LAUNCH_OPS"
```

### Step 3: Push and open PR

```bash
git push -u origin feat/atlas-entity-dossier-<milestone>
```

Open a PR on GitHub/GitLab with:

**PR title:**
```
feat: Techadyant Atlas Entity Dossier — <milestone name>
```

**PR description template:**

```markdown
## Summary

- Brief description of what this PR adds/changes
- Number of new dossiers added (by tier)
- Number of new React components added
- Any new page templates added

## Inventory coverage

| Spec section | Slugs added | Tier A | Tier B | Tier C |
|--------------|-------------|--------|--------|--------|
| D1 Counter-UAS systems | N | N | N | N |
| D2 Counter-UAS manufacturers | N | N | N | N |
| D3 Defence hub entities | N | N | N | N |
| D4 Other verticals | N | N | N | N |

## Quality gates

- [ ] G1: Total dossiers vs inventory targets — PASS
- [ ] G2: Tier A/B/C counts — see PROJECT_STATUS.md
- [ ] G3: Tier A/B with zero sources — PASS (0 violations)
- [ ] G4: official sources pointing at labs.techadyant.com — PASS (0 violations)
- [ ] G5: Multi-publisher single source records — PASS (0 violations)
- [ ] G6: Tier C without noindex=true — PASS (0 violations)
- [ ] G7: Register conflicts documented — PASS (see REGISTER_TICKETS.md)
- [ ] G8: loadDossier MAP size — N slugs
- [ ] G9: Any entity skipped — PASS (only D4 deferred, documented)

## Engineering QA

- [ ] ENG_QA_CHECKLIST.md — all items ✅
- [ ] STAGING_QA_SCRIPT.md — all phases pass on staging
- [ ] TypeScript compiles with no errors
- [ ] Linter passes with no warnings
- [ ] At least one Tier A, one Tier B, and one Tier C dossier verified in dev mode

## Data conflicts (if any)

List any open register tickets from `docs/REGISTER_TICKETS.md` that this PR surfaces or resolves.

## Rollback plan

Per `docs/PHASE_SOFT_LAUNCH_OPS.md`:
- Full rollback: revert the merge commit
- Partial rollback: remove specific slug from `lib/loadDossier.ts` MAP
- Emergency kill-switch: comment out all imports in loadDossier.ts

## Test plan

Reviewer should:
1. Pull the branch and run `npm install && npm run dev`
2. Visit `/research/counter-uas/system/integrated-counter-drone-system-cus-001/` and verify the dossier renders
3. Visit `/research/counter-uas/system/rafael-drone-dome-cus-024/` and verify noindex meta is set
4. Visit `/research/counter-uas/system/nonexistent-slug/` and verify the thin legacy page renders (not 404)
5. Run `python3 scripts/build_manifest_and_docs.py` and verify MANIFEST.json counts match

## Related issues

Closes #<issue-number>
Refs #<issue-number>
```

### Step 4: Address review feedback

Common review feedback patterns:

**"This dossier has a fact error in section X"**
- Fix the JSON in `data/dossiers/<slug>.json`
- Add or update the source citation
- If the error is in the Atlas register itself, file a ticket in `REGISTER_TICKETS.md`
- Commit with: `fix(data): correct <fact> in <slug> dossier`

**"This source URL is broken / paywalled"**
- Replace the source with an alternative primary source
- Update the `sources[]` array and any references to the old `src-N` ID
- Commit with: `fix(data): replace broken source in <slug> dossier`

**"This Tier C dossier should be Tier B"**
- Conduct primary-source research on the entity
- If sufficient evidence is found, rewrite the dossier as Tier B with full sections
- Update `lib/loadDossier.ts` if needed (Tier C and Tier B are both in MAP)
- Commit with: `feat(data): elevate <slug> from Tier C to Tier B with primary sources`

**"This section is empty for dossier X"**
- Either populate the section with sourced data, OR
- Verify that `EntityDossierView` correctly hides empty sections (per `ENG_QA_CHECKLIST.md` section 4)
- If the section is genuinely empty (no data), it should be hidden — no fix needed

### Step 5: Merge

After PR is approved and all CI checks pass:

- Use **Squash and merge** for feature branches with multiple commits (clean history on main)
- Use **Rebase and merge** for branches with logically-ordered commits that should be preserved
- Delete the feature branch after merge

### Step 6: Tag and release (optional)

For milestone releases, tag the merge commit:

```bash
git checkout main
git pull origin main
git tag -a v<milestone> -m "Techadyant Atlas Entity Dossier — <milestone name>"
git push origin v<milestone>
```

Examples:
- `v0.1.0-initial-scaffold` — initial React scaffold + loadDossier + page templates
- `v0.2.0-cuas-tier-a` — Tier A counter-UAS systems + manufacturers
- `v0.3.0-defence-hub` — defence hub entity dossiers
- `v0.4.0-tier-c-placeholders` — Tier C placeholders for remaining inventory
- `v1.0.0-soft-launch` — soft-launch ready, all quality gates passing

## Hotfix workflow

For urgent production fixes (fact errors, broken URLs, SEO issues):

```bash
git checkout main
git pull origin main
git checkout -b hotfix/<issue-description>
# ... make the fix ...
git commit -m "fix(data): <description>"
git push -u origin hotfix/<issue-description>
# Open PR with "hotfix" label
# After merge, deploy immediately
```

Hotfixes bypass the normal staging QA cycle but MUST still pass `ENG_QA_CHECKLIST.md` items 2 (JSON validation), 3 (source hygiene), and 6 (loadDossier MAP).

## File structure reference

```
atlas-entity-dossier/
├── schema/
│   └── dossier.schema.json
├── react/
│   ├── types.ts
│   ├── EntityDossierView.tsx
│   ├── jsonLd.tsx
│   ├── dossier.css
│   ├── index.ts
│   └── sections/
│       ├── HeaderSection.tsx
│       ├── AtAGlanceSection.tsx
│       ├── WhatItIsSection.tsx
│       ├── KillChainSection.tsx
│       ├── DeploymentsSection.tsx
│       ├── ImportDependenciesSection.tsx
│       ├── IntelligenceAssessmentSection.tsx
│       ├── GraphSection.tsx
│       ├── TimelineSection.tsx
│       ├── FAQSection.tsx
│       ├── OpenQuestionsSection.tsx
│       ├── SourcesSection.tsx
│       └── CTASection.tsx
├── lib/
│   └── loadDossier.ts
├── app/
│   ├── _dossierPage.tsx
│   └── research/
│       ├── counter-uas/
│       │   ├── system/[slug]/page.tsx
│       │   └── manufacturer/[slug]/page.tsx
│       ├── drones-uas/
│       │   ├── platform/[slug]/page.tsx
│       │   └── company/[slug]/page.tsx
│       ├── military-aerospace/
│       │   └── entity/[slug]/page.tsx
│       ├── space/
│       │   └── entity/[slug]/page.tsx
│       └── pillars/
│           └── defence/
│               └── entity/[slug]/page.tsx
├── data/
│   └── dossiers/
│       └── *.json (115 dossiers)
├── docs/
│   ├── ENG_QA_CHECKLIST.md
│   ├── STAGING_QA_SCRIPT.md
│   ├── PHASE_SOFT_LAUNCH_OPS.md
│   ├── COMMIT_AND_PR.md
│   ├── REGISTER_TICKETS.md
│   ├── PROJECT_STATUS.md
│   └── QUALITY_GATES_REPORT.md
├── scripts/
│   ├── build_dossiers.py
│   ├── build_dossiers_2.py
│   ├── build_dossiers_mfg.py
│   ├── build_dossiers_mfg2.py
│   ├── build_dossiers_mfg3.py
│   ├── build_dossiers_def.py
│   ├── build_dossiers_def2.py
│   ├── build_dossiers_tier_c.py
│   └── build_manifest_and_docs.py
├── MANIFEST.json
├── MANIFEST.csv
└── atlas_entity_dossier_COMPLETE.zip
```
