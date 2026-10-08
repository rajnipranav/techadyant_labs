# Data Dictionary

## corridor-nodes.csv (39 rows)

One row per anchor node across India's 11 national industrial corridors (NICDP).

| Column | Type | Description |
|---|---|---|
| corridor_slug | string | URL slug of the corridor |
| corridor_name | string | Full corridor name |
| corridor_abbr | string | Corridor abbreviation (e.g. AKIC) |
| node_slug | string | URL slug of the node (unique within corridor) |
| node_name | string | Node name |
| state | string | Indian state |
| stage | enum | operational (8 rows), construction (16), approved (3), planned (12) |
| status_label | string | Human-readable status summary |
| area_acres | integer | Notified/developed area in acres (blank where not disclosed) |
| project_cost_cr | integer | Project cost, INR crore |
| investment_potential_cr | integer | Stated investment potential, INR crore |
| projected_jobs | integer | Projected employment |
| sectors | list | Semicolon-separated target sectors |
| developer | string | Development agency / SPV |
| epc | string | EPC contractor status or name |
| anchor_tenants | list | Semicolon-separated anchor tenants, MoUs or allottees |
| url | url | Canonical source page for the node |

Currency: all columns ending `_cr` are INR crore (1 crore = 10 million INR).

## atlas/dependency-grid.csv (45 rows)

One row per corridor by value-chain-layer assessment.

| Column | Type | Description |
|---|---|---|
| corridor | enum | Semiconductors, Critical Minerals, AI Infrastructure, Defence, Enterprise Software, AI MedTech |
| layer | string | Value-chain layer. Industrial corridors use Raw Materials, Refining and Processing, Components and Inputs, Equipment and Capital Goods, Manufacturing and Integration, Services and IP. The software corridor uses Public Cloud, ERP, Productivity Platforms, Desktop OS, Databases, AI Platforms, Cybersecurity, CRM, Server OS, Identity, Payment Rails. AI MedTech uses its own clinical stack. 27 distinct layers in total. |
| status | integer 0-5 | Capture score (see README) |
| status_label | enum | Import-Dependent, Nascent, Emerging, Partial, Substantial, Captured / Sovereign |
| verification | enum | verified, single_source, unverified |
| assessment_date | date (ISO) | Date the score was last assessed |
| rationale | string | Written justification for the score; revisions are noted inline in square brackets |

## atlas/players.csv (788 rows)

One row per organisation tracked in the Atlas.

| Column | Type | Description |
|---|---|---|
| name | string | Organisation name (canonical) |
| type | enum | Private Company (304), Foreign Supplier (187), Technology (37), Research Institution (31), Facility / Plant (28), PSU / CPSE (26), Govt Body / Regulator (26), Scheme / Programme (24), Mineral / Material (18), Product / Component (18), Opportunity surface (17), Joint Venture (12), UAS Platform (11), Industry Body (7), Industrial Process (7), plus others |
| country | string | ISO 3166-1 alpha-2 code. Distribution: IN 526, US 91, JP 41, CN 27, DE 17, TW 13, FR 7 |
| corridors | list | Comma-separated corridor tags the player is active in |
| description | string | Sourced one-line description |