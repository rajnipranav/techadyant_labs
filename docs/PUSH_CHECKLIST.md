# PUSH CHECKLIST — Atlas Entity Dossier Phase 3b

Generated: 2026-08-30

## Release status

**READY TO PUSH = YES**

All automatic quality gates G0–G10 pass. Slug coverage is complete across all verticals. Tier C dossiers are excluded from the MAP and remain `noindex=true`.

## Copy paths

Copy these paths into the Atlas application without redesigning the existing dossier architecture:

- `data/dossiers/*.json`
- `MANIFEST.csv`
- `MANIFEST.json`
- `lib/loadDossier.ts`
- `react/`
- `app/`
- `schema/`
- `docs/`

## Engineering QA

1. Confirm JSON parsing for every file under `data/dossiers/`.
2. Confirm MANIFEST row count equals dossier JSON count.
3. Confirm every Tier A/B slug is present in `DOSSIER_MAP`.
4. Confirm no Tier C slug is MAP'd.
5. Confirm Tier C remains `noindex=true`.
6. Run the existing TypeScript/Next build and route generation.
7. Spot-check:
   - `/research/counter-uas/system/[slug]/`
   - `/research/counter-uas/manufacturer/[slug]/`
   - `/research/pillars/defence/entity/[slug]/`
   - `/research/drones-uas/platform/[slug]/`
   - `/research/drones-uas/company/[slug]/`
   - `/research/military-aerospace/platform/[slug]/`
   - `/research/military-aerospace/company/[slug]/`
   - `/research/space/entity/[slug]/`
   - `/research/space/company/[slug]/`

## Environment

No new environment variables are required by this dossier pack. Use the existing Atlas application environment.

## SEO / GSC

For the eventual soft launch:

- Index **Tier A + Tier B only**.
- Keep Tier C `noindex`.
- Do not submit Tier C URLs to GSC.
- Regenerate the sitemap/index set from the A/B MAP rather than from all JSON files.
