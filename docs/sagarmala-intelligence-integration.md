# Sagarmala Intelligence Database — integration notes

Architecture for the maritime, port and industrial intelligence layer behind
`/research/programmes/sagarmala/`. Written to the same conventions as
`docs/industrial-intelligence-integration.md`.

## What was added

| Layer | Path | Holds |
|---|---|---|
| Data | `data/sagarmala-intelligence/*.json` (11 files) | Programme dossier, five-pillar project database, national port registry, performance time series, connectivity records, CEZ database, coastal community dataset, company ecosystem, policy records, opportunity register, coverage manifest |
| Loader | `app/research/programmes/sagarmala-data.ts` | Server-only typed access; `sagarmalaFor(programme)` returns the database for the Sagarmala page and `undefined` for every other programme |
| UI | `app/research/programmes/sagarmala-ui.tsx`, `sagarmala-explorer.tsx` | Server-rendered sections 05-10 plus a client-side searchable/filterable project explorer |
| Page | `app/research/programmes/[slug]/page.tsx` | Conditional Sagarmala sections between Components and Industrial nodes; dynamic section numbering (`kn()`) so other programmes keep 01-15 |
| Docs page | `app/research/programmes/methodology/page.tsx` | Data dictionary, source hierarchy, statistical standards, update procedure |
| Validator | `scripts/validate-sagarmala.mjs` | Build-gate for the whole layer (ids, provenance, enums, dates, cross-references, coverage-vs-records) |
| Extracts | `scripts/export-sagarmala-csv.mjs` → `public/downloads/sagarmala/*.csv` | Five downloadable research extracts, regenerated in the build chain |

## What was reused (not duplicated)

- **Source registry** — all 81 cited sources live in the shared
  `data/industrial-intelligence/sources.json`; the Sagarmala layer only references them.
  `validate-industrial.mjs` was taught to count citations from this layer so the registry
  stays warning-clean.
- **Infrastructure registry** — Mumbai Port was added and JNPA's coordinates upgraded to
  gazetteer grade inside `data/industrial-intelligence/infrastructure-nodes.json` (closing a
  declared data gap), and Vizhinjam/Vadhavan nodes were added there so the Atlas project
  layer can reference them. The Sagarmala port registry (`sgport:` records) is the
  programme intelligence view; `infra:` records remain the shared Atlas entities.
- **Programme dossier** — `data/programme-intelligence/programmes.json` keeps the single
  Sagarmala intel record; it was enriched (pillar-wise progress, timeline milestones,
  retired data gaps) rather than forked.
- **Project & opportunity layers** — Vadhavan and Vizhinjam Phase 1 entered
  `infrastructure-projects.json` with `programme_links`, and three Sagarmala opportunity
  surfaces entered `opportunity-surfaces.json`, so the existing page sections (Projects,
  Opportunities, footprint map, graph traversal) light up automatically.

## Build chain

```
validate-industrial → validate-programmes → validate-sagarmala → export-sagarmala-csv
→ sync-cms-to-data → bake-sid → bake-logistics → bake-platform → prune-redirects → next build
```

`validate-sagarmala.mjs` exits non-zero on: malformed ids, unknown source ids, invalid
dates/enums, broken cross-file references (projects↔ports, opportunities↔companies/policies),
timeline disorder, scheme-funded arithmetic that does not add up, a CEZ classified as
anything but "proposed", Sagarmala 2.0 classified as anything but "proposed", and — the
honesty gate — any `coverage.json` count that does not match the actual records.

## Evidence model

Identical to the industrial layer: every claim carries `evidence` (fact | derived | analysis)
and `provenance` refs into the shared registry. Two scope rules are enforced in data rather
than prose: the programme portfolio (845 projects) and the scheme-funded projects (128) are
never mixed, and FY-series never mix with calendar-year series. Where official publications
disagree (845 vs 839; 915.17 vs 914.73; three turnaround-time definitions; the IWT FY26
218 MMT claim), both observations are retained and the `discrepancies` register in
`coverage.json` records the resolution.

## Adding another programme database later

1. Create `data/<programme>-intelligence/` files following the Sagarmala shapes.
2. Write a `<programme>-data.ts` loader exporting `<programme>For(programme)`.
3. Guard the page sections with that loader; extend `sourcesWithDatabase`.
4. Teach `validate-industrial.mjs`'s citation scan about the new directory (it already
   scans every JSON under `data/sagarmala-intelligence/`; generalise the path list).
5. Add the validator and CSV export to the build chain.
