# data/industrial-intelligence — Industrial Intelligence & Connectivity Layer

Static, version-controlled, SID-shaped data for `/research/industrial-nodes/` and `/research/infrastructure-projects/`.
Architecture: `docs/industrial-intelligence-integration.md` · Scores: `docs/industrial-connectivity-methodology.md`.

| File | Holds |
|---|---|
| `sources.json` | Source registry (provenance + data-governance terms per programme/platform) |
| `industrial-nodes.json` | Pilot nodes: facts, linked Atlas players (by SID id), ICS inputs, CGI assessments, gaps |
| `infrastructure-nodes.json` | Only infrastructure a pilot node references (not a national inventory) |
| `infrastructure-projects.json` | Projects → industrial consequence; `itla_appraisal_tier` for ≥ ₹500 cr GoI projects |
| `relationships.json` | Explicit typed edges (fact / derived / analysis). The loader synthesises the rest |
| `opportunity-surfaces.json` | Analytical hypotheses: sourced trigger → labelled effect chain → constraints |
| `signal-links.json` | Signal → entity links (CMS signals are regenerated; this side map is not) |
| `itla.json`, `sme-champions.json` | Compatibility placeholders — no fabricated data |

## Rules
- Never copy PM GatiShakti / ULIP / other restricted datasets. Cite public pages; store derived relationships.
- Every fact carries `provenance` → `sources.json`. Unknown = `null` / `"unknown"`, never a guess.
- Do not store straight-line distances — they are computed from coordinates. Store a distance only if a source states it (`sourced_distance`).
- Opportunity steps after the trigger are `analysis`; use "may/could", not "will".
- Update `last_verified` when you re-check a record. The validator warns after 120 days.

## Commands
```
npm run validate:industrial      # referential integrity, provenance, coordinates, ranges (also runs first in `npm run build`)
npm run test:industrial          # scoring engine + pilot golden values (Node ≥ 22.6)
```
