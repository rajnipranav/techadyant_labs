# PHASE 3b — WORK-IN-PROGRESS CHECKPOINT (2026-08-30)

READY TO PUSH = **NO** (coverage incomplete — Space partial; Drones/Defence not started this run).

## Done
- Hotfix: Chinook bare-domain `boeing.net.in` official source replaced with PIB/MoD induction release.
  Corpus: official+bare-domain = 0; official+labs.techadyant.com = 0.
- Military Aerospace: **COMPLETE** — 64/64 live-hub entities (12 platforms + 52 companies) built under
  exact live slugs, PIB/MoD/OEM-India sourcing, correctly tiered. G2 PASS.
- Space: **PARTIAL 12/73** (see HANDOFF_PROMPT.md for the 61 remaining slugs).
- MANIFEST.csv/json + lib/loadDossier.ts regenerated (215 files; 120 A+B mapped; 95 Tier C excluded).
- Route folders added for MAE platform/ + company/.

## Corpus now
- 215 dossiers (baseline 141 + 74 new). Tiers: A=88, B=32, C=95.
- Full validation: 0 issues (parse, tier floors, bare/labs-official, canonical, dangling graph, slug).

## Remaining (see HANDOFF_PROMPT.md)
Space (61) → Drones-UAS (254) → Defence gap-fill → optional C-UAS promotions → gates → FINAL zip.

## Known issue for register
`godrej-aerospace` is a cross-vertical slug shared by military-aerospace and space hubs; kept as a single
shared file (flat filename namespace / single loader key) — document, do not duplicate.
