# Industrial Intelligence — Phase 2 report (8 Oct 2026)

## What changed
| Area | Change |
|---|---|
| Official coordinates | Gazetteer coordinates (high confidence) for Noida International Airport, LGBI Guwahati, Mundra and Pipavav; Deendayal classified `major_port` with its own source. |
| Duplicate records | Four duplicate Atlas player IDs used by the pilot nodes were remapped to their survivors. `scripts/sid-merge-semiconductor-duplicates.py` wrote `data/sid-maintenance/merge_duplicates_2026-10-08_semiconductors.sql` (6 × `sid.merge_entity`), patched `_atlas.json` (809 → 803 players) and added 12 redirects. **The SQL has not been run on the SID** — owner approval is needed first. |
| Supplier mapping | New `supplier-map.json` with 32 assessments for the 4 semiconductor nodes; SCCS is now computed (Dholera 45 · Sanand 75 · Jewar–YEIDA 60 · Jagiroad 30). |
| Electronics nodes | New `electronics_assembly` requirement profile (CGI weights, gateway mix, 8 supplier categories) plus two nodes: **Sriperumbudur–Oragadam** (ICS 75, SCCS 70) and **Kopparthy** (ICS 50, SCCS 40). CGI reads *Insufficient Data* for both. 9 infrastructure nodes, 8 relationships and 14 sources were added. |

## Honest limits
- The electronics nodes' supplier maps are partial: 3 of 8 categories for Sriperumbudur, 0 of 8 for Kopparthy. Supplier proximity therefore reads *missing*, and SCCS rests on the gateway and infrastructure components (75% completeness, low confidence).
- The Atlas has no electronics-assembly sector, so these nodes are not linked to an Atlas sector. The validator warns instead of failing.
- Foxconn's Oragadam display and enclosure units are taken from a June 2025 secondary report. Their operating status since then has not been verified.
- SID `supplies_to` edges from the 17 Aug 2026 batch cite only stock-screener pages and look templated, so they are excluded from SCCS. One option is to relabel them `unverified`, but that is a SID write and needs approval.

## Deployment order
1. Run the merge SQL on the SID (after review).
2. Then commit and push these changes. If the build re-bakes `_atlas.json` before the merge, the dropped records come back while the redirects point to their survivors.

## Checks run (cloud clone)
`validate-industrial` reports 0 errors and 17 warnings (unassessed supplier categories, no Atlas sector, unlinked suppliers). 16/16 scoring tests pass. `tsc` is clean. `next build` succeeds with a local font stub. Playwright QA on two dossiers and the hub found no overflow at 390 px or 1280 px and no page errors.
