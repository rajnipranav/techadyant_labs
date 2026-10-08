# India Industrial Systems — Atlas Datasets (Techadyant Labs)

Three machine-readable CSV datasets backing **The Atlas** at
[https://labs.techadyant.com/research/](https://labs.techadyant.com/research/).

Techadyant Labs is an India-first strategic-intelligence research house covering
semiconductors, critical minerals, AI infrastructure, defence, enterprise software
and industrial corridors. These datasets are the open, citable extract of that work.

## Datasets

| File | Rows | What it contains |
|---|---|---|
| `corridor-nodes.csv` | 39 | Anchor nodes across India's 11 national industrial corridors: development stage, area (acres), project cost, investment potential, projected jobs, target sectors, developer, EPC status and anchor tenants, with a source URL per row. |
| `atlas/dependency-grid.csv` | 45 | Import-dependency assessments across 27 value-chain layers for six industrial corridors (Semiconductors, Critical Minerals, AI Infrastructure, Defence, Enterprise Software, AI MedTech). Scored 0 (import-dependent) to 5 (captured/sovereign), each with a verification label, assessment date and a written rationale. |
| `atlas/players.csv` | 788 | Organisations tracked across India's strategic industrial ecosystem — 526 India-linked records plus foreign suppliers from the US, Japan, Germany, China and Taiwan — classified by type, country, corridor tags and a sourced description. |

## Scoring scale (dependency-grid.csv)

`status` is a 0–5 capture score:

| Score | `status_label` | Meaning |
|---|---|---|
| 0 | Import-Dependent | No meaningful domestic capability |
| 1 | Nascent | Early/pilot-stage domestic activity |
| 2 | Emerging | Partial localisation underway |
| 3 | Partial | Credible domestic capability, not self-sufficient |
| 4 | Substantial | Largely domestic; residual foreign dependence |
| 5 | Captured / Sovereign | Effectively sovereign capability |

`verification` records evidence strength: `verified` (primary/official source),
`single_source` (one credible source) or `unverified` (analyst assessment pending
primary sourcing). This labelling is the house convention described at
[https://labs.techadyant.com/methodology/](https://labs.techadyant.com/methodology/).

## Provenance and limitations

- Assessment dates are recorded per row in `assessment_date`. The Atlas is a living
  dataset; the live versions may be newer than this deposit.
- Scores are analyst assessments against public evidence, not official government
  statistics. They are designed for comparison across corridors and layers over time,
  not as absolute measures.
- `rationale` explains each score and, where a score was revised, why.

## Citation

```bibtex
@misc{techadyant_labs_atlas_2026,
  author       = {Techadyant Labs},
  title        = {India Industrial Systems: Atlas Datasets},
  year         = {2026},
  publisher    = {Techadyant Labs},
  howpublished = {\url{https://labs.techadyant.com/research/}},
  note         = {Corridor nodes, import-dependency grid and ecosystem players}
}
```

## Licence

Released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
You may reuse and adapt this data with attribution to Techadyant Labs.

## Contact

labs@techadyant.com — https://labs.techadyant.com/
