# Data Submission Guide — execute these, in this order

Status: READY TO EXECUTE. Every route below is verified live (checked 7 Oct 2026).
This is an execution file, not a plan. Nothing here needs more research.

**What you are uploading** (already packaged, nothing to prepare):

| Path | What it is |
|---|---|
| `techadyant-atlas-datasets.zip` | 56 KB upload bundle (README, LICENSE, CITATION.cff, DATA-DICTIONARY, 3 CSVs, forward-slash paths) |
| `data-deposit\` | The same package as an unpacked folder, if a target wants files one by one |

**The three datasets inside** (872 data rows total, all CC BY 4.0):

| File | Rows | Cols | Page it powers |
|---|---|---|---|
| `atlas/dependency-grid.csv` | 45 | 7 | `/research/dependencies` — 6 corridors x 27 value-chain layers, 0–5 capture status |
| `atlas/players.csv` | 788 | 5 | `/research/players` — named organisations by type, country, corridor |
| `corridor-nodes.csv` | 39 | 17 | `/resources` — 11 industrial corridors, node area/cost/jobs/tenants |

---

## Route 1 — Zenodo (highest trust; gives you a citable DOI)

- URL: <https://zenodo.org> → sign in (GitHub or ORCID) → **New upload**
- Blocked in our sandbox by a bot-check (real site, just needs your browser). ~10 minutes.
- Upload `techadyant-atlas-datasets.zip`. Fields:
  - **Title:** `Techadyant Atlas: India Industrial Dependency Grid, Players and Corridor Nodes`
  - **Authors:** Techadyant Labs
  - **Description:** paste `data-deposit\README.md`
  - **Licence:** Creative Commons Attribution 4.0 (CC BY 4.0)
  - **Keywords:** india, industrial policy, supply chain, semiconductors, defence, data centres, critical minerals, value chain, import dependency, industrial corridors
  - **Related works:** `https://labs.techadyant.com/research/` (relation type: `isSupplementTo` or `isDocumentedBy`)
- You get a DOI like `10.5281/zenodo.XXXXXXX`.
- **After:** paste the DOI into `data-deposit\CITATION.cff` (`identifiers` → DOI), into `/resources`, and into the datasets page footer. A DOI is the single most-citable form of a backlink — academic and policy papers use it instead of the bare URL.

## Route 2 — Kaggle (dataset page; good referral traffic + a profile link)

- URL: <https://www.kaggle.com/datasets> → **New Dataset** (needs a Kaggle account) ~15 min.
- Upload the three CSVs (Kaggle takes the folder). Fields:
  - **Title:** `Techadyant Atlas — India Industrial Dependency, Players and Corridor Nodes`
  - **Category:** `Economics` · **Subcategory:** `Industry`
  - **Description:** paste `data-deposit\README.md`, first line = the one-sentence value ("872 rows mapping which layers of India's strategic industries are import-dependent vs sovereign, plus 788 named players and 39 corridor nodes").
  - **Licence:** CC BY 4.0 · **Source:** `https://labs.techadyant.com/research/`
- Add a **discussion** or notebook linking the CSVs back to `/research/dependencies` if you want a second link.

## Route 3 — awesome-public-datasets via `apd-core` (the 79.4k-star list)

**Do not edit `awesomedata/awesome-public-datasets` README.rst directly — it is auto-generated
from `apd-core` and your edit will be discarded.** Confirmed: PRs to the parent repo get closed
with "please contribute via apd-core".

- Target: <https://github.com/awesomedata/apd-core> (400 stars, GPL-3.0, active PRs)
- Format verified from `CONTRIBUTING.md`: fork → add ONE `.yml` file under `core/<Category>/`
  → `category:` in the file **must equal the folder name** → validate → PR.
- **Category to use: `Economics`** (folder exists and is the correct fit; also available:
  `Government`, `InterDisciplinary`, `SocialSciences`, `GIS`, `TimeSeries`).
- Validation command (from `CONTRIBUTING.md`):
  `pip install -r tests/requirements.txt && ./tests/testing.sh`
- Required fields are only `title`, `homepage`, `category` — everything else is optional.

Create `core/Economics/Techadyant-Atlas-Dependency-Grid.yml`:

```yaml
---
title: Techadyant Atlas - India Industrial Dependency Grid
homepage: https://labs.techadyant.com/research/dependencies
category: Economics
description: 45 rows scoring 6 Indian strategic-industry corridors across 27 value-chain
  layers on a 0-5 capture scale (0 import-dependent, 5 sovereign), each row carrying a
  verification label and a sourced rationale. Companion files in the same deposit cover
  788 named industry players and 39 industrial-corridor nodes.
version: 1.0
keywords: india, industrial policy, supply chain, import dependency, semiconductors,
  defence, data centres, critical minerals, value chain, sovereign capability
access_level: public
license: CC BY 4.0
language: en
spatial: India
issued_time: 2026.10
organization:
  - name: Techadyant Labs
    web: https://labs.techadyant.com
references:
  - title: Techadyant Atlas
    reference: https://labs.techadyant.com/research/
```

- PR title: `Add Techadyant Atlas (India industrial dependency grid) under Economics`
- Honest expectation: `github.com` README links are an **authority + referral** play more than a
  raw dofollow play — the value is the association with a 79.4k-star curated list and the
  researcher traffic, not a single link metric point.
- **Second PR, after the first merges:** `core/Economics/Techadyant-Corridor-Nodes.yml`
  pointing at `https://labs.techadyant.com/resources`. Ship one entry first — small PRs merge.

## Route 4 — `gurmanbh/india-data-sources` (the original, not the fork)

- **Target: <https://github.com/gurmanbh/india-data-sources> — NOT `pritharoy/india-data-sources`.**
  That account's repo is a fork (0 stars, 0 forks, 23 commits) and a PR there earns nothing.
  Verified original is alive: HEAD `6d6e673`.
- The README explicitly says: *"To add to this list, please submit a pull request."*
- Format is a markdown bullet under an existing section. Under **`## Economy`** add:

```markdown
- [Techadyant Atlas](https://labs.techadyant.com/research/dependencies): 45-row import-dependency
  grid scoring 6 Indian strategic-industry corridors across 27 value-chain layers (0 import-dependent
  → 5 sovereign), with 788 named industry players and 39 industrial-corridor nodes as companion
  CSVs. CC BY 4.0.
```

- PR title: `Add Techadyant Atlas dependency grid (Economy)`
- Note the repo's standing rule: **no personal-identifying data.** Our files contain only company
  and government-node names — compliant.

## Route 5 — `sunil-dhaka/india-data-directory` (optional, low authority)

- 1 star / 4 commits. Worth it only because it is a 5-minute PR and it is India-specific.
- Format: a numbered entry with `**Link:** / **Publisher:** / **What:** / **Use cases:**`.
  Its scope is government *statistical* sources, so file ours under a new `## Industrial and
  supply-chain data` heading rather than forcing it into an existing section.
- Do this last, or skip it.

---

## Order of operations (one sitting, ~45 min)

1. Zenodo deposit → get DOI (~10 min) — this unlocks the citable form everything else should use.
2. Kaggle dataset (~15 min).
3. `apd-core` PR with the YAML above (~10 min, mostly the validation run).
4. `gurmanbh/india-data-sources` PR (~5 min).
5. Log all four in `SEOGEO-OUTREACH-LOG.md` (Target / Reason / URL offered / Outcome).
6. Once Zenodo returns a DOI: update `data-deposit\CITATION.cff`, the `/resources` page, and the
   datasets page with the DOI, then commit.

## What these routes are NOT

- No paid link placements, no PBNs, no directories, no link exchanges — consistent with the
  campaign rules in `SEOGEO-SEND-QUEUE.md`.
- Kaggle/Zenodo/apd-core all require an account and a browser; the sandbox cannot do these for
  you. Everything that *can* be prepared in advance has been prepared.
