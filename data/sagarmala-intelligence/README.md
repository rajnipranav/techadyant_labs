# data/sagarmala-intelligence — Sagarmala Programme Intelligence Database

Static, version-controlled maritime, port and industrial intelligence for the
Sagarmala programme page (`/research/programmes/sagarmala/`).
Architecture: `docs/sagarmala-intelligence-integration.md` · Methodology page:
`/research/programmes/methodology/`.

| File | Holds | id prefixes |
|---|---|---|
| `dossier.json` | Programme identity, Cabinet approval, National Perspective Plan, five official pillars, institutions, funding mechanics, dated statistics, Sagarmala 2.0 (proposed), MIV 2030 / MAKV 2047 links, timeline | `sginst:` `sgstat:` `sgvis:` |
| `pillar-projects.json` | Portfolio snapshots (802 → 839 → 845), scheme-funded lifecycle and pillar-wise splits, flagship project cards, CPCP connectivity aggregate | `sgpr:` |
| `ports.json` | 12 major ports + 2 under construction + the largest non-major ports, with authorities, coordinates, FY25/FY26 throughput and Sagarmala project links | `sgport:` |
| `port-performance.json` | Annual series (cargo, containers, capacity, turnaround, detention, IWT, coastal); every point sourced; incompatible definitions kept as separate series | `sgs:` |
| `connectivity.json` | Documented port connections (road/rail/waterway/Ro-Pax) and the Atlas node-link reading | `sgx:` |
| `industrialisation.json` | The 14 Coastal Economic Zones, CEU definition, and the verified zero-sanctions status of the pillar | `sgcez:` |
| `community.json` | Fishing harbours, skilling, tourism and Ro-Pax initiatives with reported outputs kept distinct from outcomes | `sgcc:` |
| `companies.json` | 24 companies with evidenced relationships (operator / concession / acquisition / contract / fleet) | `sgco:` |
| `policies.json` | Policy and programme-evolution records with status discipline (proposed / announced / approved / operational) | `sgpol:` |
| `opportunities.json` | Opportunity intelligence register (documented demand / emerging / hypothesis / research lead) | `sgo:` |
| `coverage.json` | Tier statuses, record counts (validator-checked), pillar/state coverage, verification distribution, discrepancy register, known gaps, update procedure | `sgdisc:` |

## Rules

- Every fact cites the shared registry (`data/industrial-intelligence/sources.json`); unknown = `null` with a note, never a guess.
- The programme portfolio (845 projects) and scheme-funded projects (128) are different scopes — never summed.
- Financial years never mix with calendar years in one series; advance estimates are labelled against finals and both are kept when official sources disagree.
- Port-level and terminal-level throughput live in different records; a port total never includes terminal subtotals.
- CEZs stay "proposed" until a notification is captured; Sagarmala 2.0 stays "proposed" until a Cabinet approval is captured.
- Update `last_verified` on any record you re-check; the validator warns after 120 days.

## Commands

```
npm run validate:sagarmala    # full layer validation (also runs in npm run build)
npm run export:sagarmala      # regenerate public/downloads/sagarmala/*.csv
```
