# Defence Atlas — Migration Plan

## Principle

Do not rebuild the Defence Atlas from scratch. Refactor the current Defence pillar around service views while preserving the shared Atlas graph and specialist datasets.

## Phase 1 — Inventory

Audit:

- current Defence corridor records
- Defence players
- Defence relationships
- Defence layers / grid cells
- Defence events
- service references already present in descriptions / relationships
- existing specialist Atlas records
- existing Defence routes and links

Produce a migration report with:

- reusable records
- records requiring service assignment
- ambiguous records
- duplicate candidates
- orphaned records
- missing high-value categories

## Phase 2 — Service classification

Assign service membership to existing Defence records.

Classification priority:

1. explicit operator / user evidence
2. explicit procurement evidence
3. manufacturer programme evidence
4. system integration evidence
5. credible secondary evidence
6. leave unclassified when evidence is insufficient

Do not use inference merely to fill the database.

Every assignment should have a confidence / evidence status.

## Phase 3 — Shared entity cleanup

Identify records that currently exist multiple times but represent the same entity.

Candidates should be reviewed using:

- exact name
- aliases
- manufacturer
- system role
- existing stable ID
- relationships

Do not merge records automatically if the distinction is meaningful.

## Phase 4 — Taxonomy enrichment

Add:

- service codes
- capability domains
- industrial roles
- platform types
- dependency tags
- procurement tags
- specialist Atlas cross-links

## Phase 5 — Parent Defence page

Replace the current Defence presentation at:

`/research/pillars/defence/`

with the Defence Atlas landing page.

The parent page should not try to display every service-level detail.

Its job is orientation, comparison and navigation.

## Phase 6 — Service views

Implement:

- Army
- Navy & Coast Guard
- Air Force

Each view should use the same helper/data functions where possible.

Avoid three large bespoke copies of the same component logic.

Recommended implementation approach:

```text
DefenceServicePage
  ├── ServiceHero
  ├── ServiceMetrics
  ├── CapabilitySections
  ├── PlatformGroups
  ├── IndustrialBase
  ├── Procurement
  ├── Chokepoints
  ├── Opportunities
  └── CrossServiceLinks
```

Service-specific taxonomy should be data-driven.

## Phase 7 — Specialist Atlas integration

Audit links to:

- Drones / UAS
- Counter-UAS
- Military Aerospace

Ensure service pages link into these rather than recreating their datasets.

## Phase 8 — SEO / navigation

Validate:

- canonical URLs
- breadcrumbs
- Dataset JSON-LD
- sitemap inclusion
- Atlas navigation
- internal entity links
- specialist Atlas links
- old links / redirects

## Phase 9 — Build validation

Run the project's normal checks and Atlas rebuild pipeline.

Minimum validation:

- TypeScript build
- lint if configured
- static generation
- no missing player routes
- no duplicate canonical routes
- no broken service links
- no broken specialist Atlas links
- no accidental changes to unrelated pillars

## Phase 10 — Editorial validation

Before publication, review each service Atlas for:

- factual service assignment
- missing major categories
- duplicate entities
- stale descriptions
- unsupported claims
- incorrect Indian / foreign classification
- procurement status
- dependency status

## Rollback strategy

The redesign must remain isolated on the `defence-atlas-architecture` branch until validated.

Do not merge directly into `main` until:

1. data classification is reviewed;
2. routes build successfully;
3. existing Atlas routes remain functional;
4. SEO / canonical behaviour is validated;
5. service pages are editorially reviewed.
