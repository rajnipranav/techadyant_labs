# SEOGEO Query Analysis - 2026-08-15

Source: Google Search Console export (Performance on Search, 2026-08-15),
search type Web, last 3 months (28 May - 15 Aug 2026). 850 queries / 766 pages
(top-N rows only - Google truncates the export).

## Headline

- 15 clicks / 2,924 impressions across the exported top queries (0.51% CTR,
  avg pos ~25). Full-period totals are higher (the export is truncated).
- The entire traffic base is **near-zero-Click informational**: 96% of
  impressions at <=1% CTR. Rankings exist; clicks do not. Metadata is the
  cheapest lever, authority the compounding one.

## Buckets (export impressions)

| bucket | clicks | impr | CTR | pos |
|---|---|---|---|---|
| other (market reports + long-tails) | 2 | 928 | 0.2% | 40.5 |
| minerals-ree | 5 | 784 | 0.6% | 10.2 |
| defence-aero | 0 | 497 | 0.0% | 47.6 |
| company | 4 | 247 | 1.6% | 33.4 |
| corridors | 4 | 231 | 1.7% | 24.8 |
| ai | 0 | 101 | 0.0% | 21.5 |
| semis-ai-hardware | 0 | 89 | 0.0% | 38.4 |
| brand | 0 | 47 | 0.0% | 15.9 |

## FIXED in this batch (2026-08-15)

1. **Report meta** - /reports/the-end-of-the-application-era/ (559 impr, 0
   clicks, pos 11.9): metaTitle now leads with the focus keyword "AI Agents
   Replacing Applications" (was "Who Captures Computing..."). Also the page
   that ranks for the stray "agentforce subagents" query family (45+11 impr).
2. **Signal title (CMS)** - /signals/indiaai-mission-gpu-compute-expansion/
   (226 impr, 0 clicks, pos 7.9): old title 76 chars (truncated in SERP);
   now "IndiaAI Mission: 15,916 New GPUs Expand Sovereign AI Compute" (63).
3. **Signal title (CMS)** - /signals/lt-precision-engineering-drone-revenue-
   threefold-growth/ (96 impr, 1 click, pos 7.2): "L&T Drone Division Targets
   Threefold Revenue Growth" (54).
4. **UAS company descriptions** (acronym "full form" queries - 131+78+67
   impr, 0 clicks, pos 8-20): _drones.json products now lead with
   "CABS/DLRL/RCI full form: ..." for MFR-031/032/033; feeds meta description
   and body. Targets queries: cabs full form in drdo, cabs drdo, dlrl,
   research centre imarat, rci imarat, advanced systems laboratory.
5. **OSCOM explainer meta** - /research/explainers/oscom-odisha/ (139 impr,
   0.7% CTR, pos 7.2): title "OSCOM Odisha: IREL Mineral Sands Complex - Map,
   Monazite & Rare Earths" + description "What is OSCOM Odisha? ..." (4
   occurrences incl. JSON-LD TechArticle name/desc).
6. **301 consolidation** - second legacy URL: /research/entities/
   irel-odisha-sand-complex-oscom-chhatrapur/ (204 impr, 0 clicks, pos 9.7)
   -> /research/entities/irel-india-limited/ (one-to-one, no splat; both
   slash variants). Combined with the earlier player 301, the full OSCOM
   cluster (610+79+514+204+139 impr) now points at live pages.

## Backlog (not done - needs content work, not metadata)

- **P1 Market reports at pos 50-90 with exact-match titles**: india-cargo-
  drone-market (118 i), india-loitering-munitions-market (93 i),
  india-drone-sensors-payloads-imaging-market (56 i), india-medical-drones
  (35 i), india-ammunition (25 i), india-counter-uas (22 i), india-remote-
  weapon-stations (24 i), us-magnetite-nanoparticles (22 i), india-water-
  treatment (25 i), india-quantum-computing (18 i). Fix: refresh each with
  2026 data + FAQ + internal links from the drones/UAS and research hubs;
  these are commercial-intent queries the site is title-matched for.
- **P1 Corridor pages with 0 clicks at pos 8-14**: chennai-bengaluru
  (119 i), amritsar-kolkata (151 i), hisar (59 i), raghunathpur (42 i).
  Titles/descriptions are auto-generated and decent; add corridor deep-dives
  (node-by-node status tables, map embeds already exist) and link from the
  /corridors/ hub. Query family "imc khurpia" (22% CTR) shows intent to buy.
- **P2 New content**: "india counter uas market" (22 i) - a dedicated
  counter-UAS market page (we have /research/counter-uas/ hub); "hyderabad
  nagpur industrial corridor" ranks 8.6 on an existing page - add HNIC
  deep-dive; "india stack" (16 i) - explainer opportunity; "brahmos
  aerospace" (20 i) / "general aeronautics" (19 i) - company pages in the
  aerospace atlas already exist, add internal links from drones-uas hub.
- **P3 Authority**: market reports + signal pages need backlinks (Qwoted kit,
  Tier-1 outreach drafts) to move from page 2+ to page 1. oscom odisha
  cluster CTR also depends on outranking IREL's own site/Wikipedia - the
  consolidated 301s + explainer meta are the correct response.

## Repeatable wins (this export's pattern)

- Acronym/full-form queries (cabs, dlrl, rci, akic, cemilac, oscom) rank
  well but never click - front-load the expansion in title/desc. Done for
  CABS/DLRL/RCI/OSCOM; apply to AKIC (11 i, pos 10.6) and CEMILAC (12 i,
  pos 33.4) next.
- Every metadata fix targets the exact impression-rich, click-poor pages;
  re-run node scripts/gsc-report.mjs in 2-3 weeks to measure CTR movement.
