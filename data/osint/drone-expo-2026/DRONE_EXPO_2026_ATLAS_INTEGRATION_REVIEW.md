# Drone Expo 2026 → Techadyant Atlas: integration review

**Event:** Drone Expo & Conference 2026, Yashobhoomi (IICC), New Delhi, 28–30 Sep 2026
**Intake date:** 2026-09-30
**Generator:** `scripts/ingest-drone-expo-2026.py`. Every decision below lives in that file, and every output is regenerated from it.

## The core question

> *What did Drone Expo 2026 teach Techadyant about India's drone industrial ecosystem that was not already captured in the Atlas?*

1. **Indian "drone brain" vendors now market full stacks.** Arkin Labs (AeroMind FC + Navroc GNSS + power), YARI Robotics (V6X FC, GNSS, power modules, ESCs, flight-data platform) and Zerosum (autopilots + GNSS-denied navigation) each sell a complete stack. The Atlas previously modelled the flight controller as Chinese-sourced (Holybro, CUAV, Radiolink), with no Indian nodes at all. The new nodes are company claims (L3). Their chip-level content is undisclosed, so the dependency has **moved down a layer**, not away.
2. **The semiconductor dependency is visible through distributors.** Millennium Semiconductors publishes a drone-specific portfolio of foreign-brand processors, sensors, GNSS, MOSFETs, BMS and connectors. Distributor line cards are a cheap, repeatable way to read the imported bill of materials, and they become a method for the Atlas (DOSF-09).
3. **Battery localisation is pack localisation.** Ascend Powerpacks (packs, BMS and semi-solid-state packs, all L3) and six other energy exhibitors appeared. **None has verified drone-cell manufacturing.** The existing Atlas edge "cells are the imported core of domestically assembled packs" now has an Indian pack node sitting on it.
4. **Defence UAV makers are crossing from prototype to delivery (L2).** Drogo Aerospace's first batch of 41 JK 250e drones reached Army Southern Command in June 2026 under a ₹72 crore contract. Drogo also signed an MoU with Munitions India (DPSU) in September 2026 on loitering munitions. VU Dynamics (IIT Kanpur SIIC) acquired an industrial backer, PATH Group, which plans an Indore factory.
5. **The datalink is emerging as a distinct Indian subsystem.** WARG Robotics has an encrypted digital link (L3), and Rangsons Aerospace reports SATCOM-on-the-move and secure datalinks (L4). The Atlas had no datalink node, so one was added.
6. **Propulsion did *not* localise.** No verified Indian drone-grade BLDC motor maker appeared (Tobitek has no public footprint). T-MOTOR exhibited directly, so the propulsion dependency is, if anything, reinforced.
7. **C-UAS: nothing new that is evidenced.** Vajron and Stellar Invictus showed C-UAS positioning but have no public product, trial or customer. The existing C-UAS register (60 systems, 43 makers) is unchanged.

## Numbers

| Measure | Count |
|---|---|
| Exhibitors in the universe | 77 (A 26 · B 28 · C 17 · D 6) |
| Companies reviewed (A + B) | **54** |
| Already in the Atlas (UPDATE_EXISTING) | **1**: T-Motor, ID `0ee70e5e-…` preserved |
| Added (ADD_NEW) | **11** |
| Converted to Signals only (SIGNAL_ONLY) | **3**: Vajron, Stellar Invictus, Vayuron |
| Research-only / specialist dataset (RESEARCH_ONLY) | **33** |
| Rejected (IGNORE) | **6** |
| New value-chain nodes | **3**: Drone connectors & cable harnesses; UAV datalink modules; GNSS-denied UAV navigation |
| Relationships added | **27** |
| Opportunity surfaces | **10** (DOSF-01…10), mapped onto **10 existing** SID opportunity-surface entities. No new ones were created. |
| Signals drafted | **5**: 3 ready for editorial review, 2 held for monitoring. Another **4 hypotheses** were rejected for publication. |
| Dossiers published | **11**, at `/research/drones-uas/company/<slug>/` |

The 11 additions and their evidence levels:

| Entity | Layer | Evidence |
|---|---|---|
| Arkin Labs | Avionics (FC / GNSS) | L3 |
| YARI Robotics | Avionics + ESC | L3 |
| Zerosum Technologies | Subsystems / GNSS-denied nav | L3 |
| Ascend Powerpacks | Energy (pack / BMS) | L3 |
| Millennium Semiconductors India | Electronics distribution (intelligence node) | L3 |
| Nicomatic India | Interconnect (foreign tech + Indian mfg) | L3 |
| TE Connectivity | Interconnect (foreign benchmark) | L3 |
| Rangsons Aerospace | EW / SATCOM / secure comms | L3 / L4 |
| WARG Robotics | Datalink + air-ground autonomy | L3 |
| Drogo Aerospace | Defence UAV / loitering | **L2** |
| VU Dynamics | Defence UAV platforms | **L2** |

## How reconciliation was done

- Each of the 54 names was searched in the live SID: `sid.entities`, `sid.entity_aliases`, `sid.entity_candidates` and `sid.zai_entities`.
- The same names were searched in every committed register: `_atlas.json`, `_platform.json`, `_drones.json`, `_cuas.json`, `_suppliers.json`, `_aerospace.json`, `_space.json`, both dossier folders, `thin_registry.json` and the Atlas MANIFEST.
- Search keys were the legal name, the short name, abbreviations, former names, domains and product names (AeroMind, Navroc, V6X, JK 250e and so on).
- Only **T-Motor** matched. Every string hit for the other 53 was a false positive ("Skyi" → "Aero360 SkyInspect", "Arkin" → "Benchmarking", "Stellar" → a Forbes quote).
- The Phase 5A "NEW_ENTITY" labels were **not** trusted. Phase 5A labelled 45 companies NEW_ENTITY; only 11 were added and **34 were not**. All 8 "VERIFY_EXISTING_MATCH" candidates were confirmed as not in the Atlas.

## Special handling

- **T-Motor.** The existing SID entity was kept, and its ID was preserved. Its description gains one sentence recording its direct Drone Expo presence and noting that no Indian manufacturing is established. Its two existing edges (motors, ESCs) are unchanged, and no duplicate was created.
- **C-UAS.** No parallel database was created. Vajron and Stellar Invictus are recorded as SIGNAL_ONLY emerging-capability references. Rangsons is linked to the existing *Electronic warfare & ELINT* and *SDR & secure comms* nodes, not to C-UAS, because no C-UAS system is evidenced.
- **Supplier directory and distributors.** Bharat Skytech, Robu.in, UAVGarage and Macnica Cytech are classified as **market / component intelligence nodes** (RESEARCH_ONLY, flag `CAPTURE LINE CARD`), not as OEMs. Millennium was added because its drone portfolio is public and specific.
- **Four classification layers.** Company origin, design origin, manufacturing and assembly/integration are recorded separately in the reconciliation file and in each dossier's *At a glance*, each with its own evidence level.
- **Technology origin.** Nine of the 11 additions are **UNKNOWN**. Millennium is "Distributor" and Nicomatic India is "Foreign technology + Indian manufacturing" (L3). Assigning "Indian designed + Indian manufactured" requires component-level evidence, and none of them discloses a bill of materials. That gap is itself a finding.

## What was deliberately *not* asserted

- That any company's technology is indigenous. Claims are labelled as claims.
- That the Army "operates" JK 250e. The record says a first batch was *reported delivered*, with no MoD primary document and the balance unverified.
- That the Drogo–MIL MoU is an order.
- That Rangsons fields C-UAS, or that its SATCOM is "operational with IAF". That claim comes from a secondary source only, which is L4.
- That VU Dynamics is a PATH subsidiary. IIT Kanpur calls the deal a collaboration, while BusinessLine calls it a takeover.
- That any Indian exhibitor makes drone cells or drone-grade BLDC motors.

## Unresolved questions (priority verification queue)

1. **Tobitek:** does it manufacture BLDC motors, and where do its magnets come from? (PRIORITY)
2. **Nsure, Godi Nova, Enovix R&D India:** does any of them manufacture drone-grade cells in India? (PRIORITY)
3. **Maksat Technologies:** what UAV RF/datalink products does it actually make? (PRIORITY)
4. Capture the drone line cards of Millennium, Bharat Skytech, Robu.in, UAVGarage and Macnica.
5. Chip-level bills of materials for Arkin AeroMind/Navroc, YARI V6X and the YARI ESCs.
6. The MoD reference for Drogo's ₹72 crore order, and whether the balance was delivered.
7. VU Dynamics ownership and the status of the Indore factory.
8. Vajron and Stellar Invictus: any trial or customer evidence (the precondition for C-UAS register entry).

## Evidence limitations

- The Phase 3/4 OSINT pass (2026-09-29) is the basis for all L3 company-site claims. In this session, **direct page fetches were blocked by the network egress proxy**, so independent checks (Drogo, VU Dynamics, Nicomatic, Rangsons, Tobitek, Vajron, Stellar Invictus) used search-result abstracts. Each source note records this.
- No Level-1 (government or procurement) document was located for any Drone Expo entity.
- Sovereignty scores cited in the dependency matrix are Techadyant's internal estimates (indicative), not external verification.
- C (17) and D (6) exhibitors kept their Phase 3 screening and were not re-reviewed.

## What was changed in the repo

| Change | Files |
|---|---|
| Deliverables A–F | `data/osint/drone-expo-2026/*.json`, this file, and `ATLAS_STRUCTURE.md` |
| Source inputs, preserved | `data/osint/drone-expo-2026/source/` |
| 11 entity dossiers | `data/company-dossiers/<slug>.json`, registered in the `lib/companyDossierMap.ts` MANUAL ADDITIONS block |
| Static params and sitemap for the dossier-only slugs | `app/research/drones-uas/company/[slug]/page.tsx`, `app/sitemap.ts` |
| Hub section "Newly mapped subsystem suppliers" | `app/research/drones-uas/page.tsx` |
| SID snapshot patched (+14 players, +27 relationships, T-Motor description) | `app/research/_atlas.json` |
| Platform snapshot patched (+3 nodes and new edges on FC, GNSS, ESC, packs, cells, MCU, EW, SDR, loitering, small UAV and MALE) | `app/research/_platform.json` |
| **SID insert, prepared but NOT applied** | `data/osint/drone-expo-2026/sid_ingest_drone_expo_2026.sql` |
| Signal drafts, **not published** | `drone_expo_2026_signals.json` (all), `drone_expo_2026_signals.cms-draft.json` (the 3 ready) |

**Important:** `npm run build` re-bakes `_atlas.json` and `_platform.json` from SID when the N8NDB credentials are present. Until the SQL is applied to SID, a credentialed build will **drop** the 14 players and 27 relationships from those snapshots. The 11 dossier pages, the hub section and the sitemap entries are file-based and unaffected. Apply the SQL before, or together with, the next credentialed build. The UUIDs are deterministic, so the snapshot and the database will match exactly.

## Not started (by design)

The report *India's Drone Technology Stack — Domestic Capability, Critical Dependencies and Emerging Industrial Opportunity Surfaces* was not begun. Per the brief, it starts only after the Atlas integration is accepted, and Drone Expo 2026 will be one OSINT source among several.
