# Techadyant Atlas — structure summary (discovery, 2026-09-30)

Written before any Drone Expo 2026 change was made. It records what the Atlas already is,
so the ingestion fits the existing schema. No new schema was invented.

## 1. Where Atlas data lives

The Atlas has **two layers**. They are keyed differently and populated by different pipelines.

| Layer | Canonical store | Site snapshot (committed) | Refreshed by |
|---|---|---|---|
| **Strategic Intelligence Database (SID)**: players, products, technologies, opportunity surfaces, relationships, events | Supabase project `n8ndb` (schema `sid`) | `app/research/_atlas.json` (via the `atlas_export()` RPC), `app/research/_platform.json` (via `platform_export()`) | `scripts/bake-sid.mjs`, `scripts/bake-platform.mjs`. Both run inside `npm run build` when `N8NDB_URL` / `N8NDB_SERVICE_ROLE_KEY` are set; otherwise the committed snapshot is kept |
| **Vertical registers**: drones-uas, counter-uas, military-aerospace, space, suppliers, patents | Local Excel workbooks under `../../Reports and DPR/…` (not in the repo) | `app/research/_drones.json`, `_cuas.json`, `_aerospace.json`, `_space.json`, `_suppliers.json`, `_patents.json` | `scripts/bake-drones.py`, `bake-cuas.py`, `bake-suppliers.py`, … Run manually and locally, never in CI |
| **Entity dossiers**: long-form evidence pages | `data/dossiers/*.json`, `data/company-dossiers/*.json` | the same files | Hand-authored. Registered in `lib/loadDossier.ts` (`DOSSIER_MAP`) and `lib/companyDossierMap.ts` (`COMPANY_DOSSIER_MAP`, including a `MANUAL ADDITIONS` block) |
| **Thin records** | `data/thin_registry.json` | the same file | Generated from `data/atlas/MANIFEST.json` |
| **Signals** | Supabase CMS table `cms_signals` (project `Research Reports`) | `app/signals/data.ts` (regenerated. **Do not hand-edit.**) | `scripts/publish-signals.mjs <draft.json>` → `scripts/sync-cms-to-data.mjs` |

## 2. Entity schema (SID, `sid.entities`)

- `entity_id` is a **UUID** and the **unique identifier**. `canonical_name` is not unique, so duplicate names exist (for example "Garuda Aerospace" and "Garuda Aerospace Pvt Ltd").
- `entity_type_id` points to `sid.entity_types.code`. The relevant codes are `company`, `psu`, `foreign_supplier`, `product`, `technology`, `opportunity_surface`, `uas_platform`, `cuas_system`, `research_institution`, `university`, `govt_body`.
- Other fields: `home_country` (ISO-2), `description`, `status` (`active|dormant|merged`), `merged_into`, and `is_watchlist`. Only watchlist rows **with a description** are exported to the site.
- Aliases: `sid.entity_aliases(alias, alias_norm, alias_type ∈ legal_name|ticker|abbreviation|former_name|common|brand)`.
- Corridors: `sid.entity_corridors(entity_id, corridor_id)`. Drones, UAS and C-UAS sit in corridor **4 `defence`**.
- Candidates: `sid.entity_candidates` and `sid.zai_entities`. These hold pre-promotion mentions and were checked during reconciliation.

## 3. Relationship schema (`sid.relationships`)

- The fields are `source_entity_id → target_entity_id`, `relationship_type_id`, `corridor_id`, `magnitude` / `magnitude_unit`, `description`, `valid_from` / `valid_to`, `verification_status` (`verified | corroborated | single_source | unverified`), `primary_source_id`, and `established_by_event`.
- The types used in the drone value chain are `manufactures`, `develops`, `supplies_to`, `component_of`, `depends_on`, `partners_with`, `customer_of`, `related_to`.
- The drone value chain already modelled as SID product nodes is:
  `NdFeB magnets → BLDC drone motors → Small UAV (multirotor)`,
  `Li-ion cells → Drone battery packs → Small UAV`,
  `MCU/SoC + Multilayer PCB → Drone flight controller → Small UAV`,
  `GNSS navigation modules → Small UAV`, plus `Electronic speed controller`.
  Foreign suppliers (T-Motor, Hobbywing, SunnySky, Holybro, CUAV, Grepow, STMicroelectronics, DJI) point at those nodes.

## 4. Dossier schema (`schema/dossier.schema.json`)

- Required fields: `entity_id` (pattern `^(cus|mfg|def|drn|mae|spc|prg)-…`), `entity_type`, `tier` (A/B/C), `noindex`, `slug`, `name`, `vertical`, `parent_hub_path`, `last_verified`, `status`, `header{one_liner,chips,country}`, `at_a_glance` (string map), `sources[]`, and `seo{title,meta_description,canonical_path,og_type,json_ld_types}`.
- Optional sections: `what_it_is`, `deployments_procurement`, `import_dependencies`, `intelligence_assessment`, `graph`, `timeline`, `faq`, `open_questions`, and `cta`.
- `TIER_SECTIONS` (`react-dossier/types.ts`): Tier B drops `timeline`, `intelligence_assessment`, `faq` and `open_questions`. Tier C is `noindex`.
- Company dossiers render at `/research/<vertical>/company/<slug>/` through `renderCompanyDossierPage(slug, vertical)`. The route's `generateStaticParams` must list any slug that is not in `_drones.json`.

## 5. Signal schema (CMS `cms_signals`)

The fields are `slug, no (S-NNN), title, domain, date, date_label, reading_time, status (live|monitoring|placeholder), excerpt, body[{type:p|h|list|quote, text|items}], takeaways[], sources[]`. At discovery the last signal number was **S-127**.

## 6. Source conventions

- Dossier sources use `{id: src-NN, title, publisher, url, published_date, trust_tier: official|credible|indicative|methodology, accessed, note}`.
- SID sources (`sid.sources`) carry a `source_type_id`. The codes are `pib, ministry, psu_disclosure, sebi_exchange, regulator_order, scheme_dashboard, customs_dgft, company_disclosure, multilateral, trade_press` ("lead only, never sole source"), `other`, and `signal_engine`.
- This ingestion adds the brief's **Evidence Level 1–5** on top of those conventions. The mapping is L1 → `official` / `verified`, L2 → `credible` / `corroborated`, L3 → `indicative` / `single_source`, L4 → `indicative` / `unverified`, and L5 → not used for conclusions.

## 7. ID conventions

- SID: UUID v4 by default. This ingestion uses **deterministic UUID v5** values (namespace URL, `techadyant:sid:drone-expo-2026:<key>`), so reruns are idempotent and the committed snapshot matches the DB.
- Vertical registers: `MFR-NNN`, `DRN-NNNN`, `CMP-NNN`, `MFG-NNN`, `CUS-NNN`. Slugs take the form `<name>-<id>`.
- Dossiers: `entity_id` `mfg-…`, `drn-…`, and so on, with a clean kebab-case slug.

## 8. Validation / build commands

```bash
npm run lint                      # eslint
npx tsc --noEmit                  # typecheck
npm run build:only                # next build (static export) — no CMS/SID sync
npm run build                     # full chain: sync-cms → bake-sid → bake-platform → prune-redirects → next build → indexnow
python3 scripts/ingest-drone-expo-2026.py --check   # this ingestion's own validator (schema, IDs, relationships, URLs)
```

The repo has no separate relationship or entity-index validator, so the ingestion script carries its own checks.
