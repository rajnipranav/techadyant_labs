# PHASE 3 REPORT — Atlas Entity Dossier

Generated: **2026-08-29**

## Executive status

**READY TO PUSH = NO**

Phase 3 completes the requested depth work for the five Military Aerospace stubs, five Space stubs, three priority Drone/UAS stubs and five high-value company dossiers. It also hardens the loader, manifests, routes and register. It is **not** production-complete against the current live directories, so it is not marked push-ready.

## Inventory and tier counts

- Dossiers on disk: **141**
- Tier A: **61** · Tier B: **8** · Tier C: **72**
- A/B MAP: **69** slugs
- Tier C is omitted from MAP and remains `noindex=true`.

### Vertical counts

| Vertical | A | B | C | Total |
|---|---:|---:|---:|---:|
| counter-uas | 24 | 8 | 71 | 103 |
| defence | 17 | 0 | 0 | 17 |
| drones-uas | 9 | 0 | 1 | 10 |
| military-aerospace | 5 | 0 | 0 | 5 |
| space | 6 | 0 | 0 | 6 |

## Live hub coverage

| Hub | Live directory | Pack dossiers | Status |
|---|---:|---:|---|
| Military Aerospace | 12 platforms + 52 companies | 5 | Existing MAE dossier set is 100% A; full live-directory depth remains open. C-295 is cross-linked to `c295-india-def-012`. |
| Space | 22 platforms + 51 companies | 6 | PSLV, LVM3, Gaganyaan, NavIC, Skyroot platform + Skyroot company are A; remaining directory depth open. |
| Drones-UAS | 146 platforms + 108 companies | 14 | 9 platforms + 5 companies; remaining directory depth open. |
| Defence | 44 systems + 29 industry entities | 17 | Existing defence 17 Tier-A dossiers preserved; remaining live entities tracked as gap list. |
| Counter-UAS | 60 systems + 43 manufacturers | 103 | Existing 60/43 inventory preserved; 71 Tier-C records remain noindex. |

## Quality gates

| Gate | Result | Actual |
|---|---|---|
| G1 | **PASS** | 141 dossier JSON files; 141 manifest rows |
| G2 | **FAIL** | Full live MAE directory is 12 platforms/52 companies; pack contains 5 MAE dossiers, all A. |
| G3 | **PASS for required priority set / FAIL for full live-hub interpretation** | PSLV/LVM3/Gaganyaan/NavIC/Skyroot all A; live Space directory is 22 platforms/51 companies. |
| G4 | **PASS with documented coverage gap** | Live Drones-UAS directory is 146 platforms/108 companies; pack contains 14 dossiers. |
| G5 | **PASS** | A-tier violations = 0; every A has ≥3 FAQs and ≥4 sources. |
| G6 | **PASS** | Official-source bare-domain violations = 0. |
| G7 | **PASS** | Official-source `labs.techadyant.com` violations = 0. |
| G8 | **PASS** | A/B empty-source violations = 0. |
| G9 | **PASS** | `loadDossier` MAP = 69 A/B slugs; Tier C omitted. |
| G10 | **PASS** | 18 promotions listed below. |
| G11 | **PASS** | 72 remaining Tier-C dossiers, each with a reason. |
| G12 | **PASS with documented gap** | Live Defence pages expose 44 system + 29 industry nodes; 17 defence dossiers retained. |
| G13 | **PASS** | BEL 8 sources/3 FAQs; HAL 8/3; ZADS 6/3; Bhargavastra 5/3. |

**Blocking status:** G2 and the full-hub interpretation of G3 remain open. Therefore **READY TO PUSH = NO**.

## Phase 3 promotions

| Slug | Old → New | Source count |
|---|---|---:|
| `boeing-ah-64e-apache-india-mae-002` | C → A | 4 |
| `boeing-ch-47f-chinook-india-mae-003` | C → A | 4 |
| `boeing-p-8i-neptune-india-mae-004` | C → A | 4 |
| `hal-mig-29upg-mae-001` | C → A | 4 |
| `lockheed-c-130j-30-india-mae-005` | C → A | 4 |
| `isro-pslv-spc-001` | C → A | 4 |
| `isro-lvm3-spc-002` | C → A | 4 |
| `isro-gaganyaan-spc-003` | C → A | 4 |
| `isro-navic-spc-004` | C → A | 4 |
| `skyroot-aerospace-vikram-spc-005` | C → A | 4 |
| `iai-searcher-mk-ii-india-drn-006` | C → A | 4 |
| `ideaforge-netra-v4-drn-003` | C → A | 4 |
| `adani-drishti-10-starliner-drn-004` | C → A | 4 |
| `ideaforge-technology-ltd-mfr-014` | C → A | 4 |
| `adani-defence-aerospace-mfr-017` | C → A | 4 |
| `israel-aerospace-industries-iai-mfr-001` | C → A | 4 |
| `drdo-aeronautical-development-establishment-ade-mfr-007` | C → A | 4 |
| `skyroot-aerospace` | C → A | 4 |

## C-UAS Indian-priority review

The Phase 3 review deliberately did not promote exact register entries on generic capability evidence. The following remain Tier C: `cus-002`, `cus-006`, `cus-008`, `cus-012`, `cus-013`, `cus-014`, `cus-015`, `cus-016`, `cus-017`, `cus-019`, `cus-020`, `cus-059`, `cus-060`. Generic DRDO/BEL/BDL/HAL counter-drone capability is not proof of each exact named product.

## Remaining Tier C

- `alpha-design-technologies-mfg-013` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `anti-drone-system-x-mk3-cus-006` — Indian-origin or India-attributed entry retained Tier C because exact product/service evidence was not sufficient to meet the A/B source bar; no invention.
- `aselsan-mfg-036` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `aselsan-redet-cuas-cus-044` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `bharat-dynamics-limited-bdl-counter-drone-cus-060` — Indian-origin or India-attributed entry retained Tier C because exact product/service evidence was not sufficient to meet the A/B source bar; no invention.
- `blue-halo-locust-laser-cus-053` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `bluehalo-mfg-041` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `bordtek-skywall-100-cus-045` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `c-dac-centre-for-development-of-advanced-computing-mfg-010` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `cerberus-gl6-cuas-capable-cus-047` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `counter-drone-system-ccuas-cus-002` — Indian-origin or India-attributed entry retained Tier C because exact product/service evidence was not sufficient to meet the A/B source bar; no invention.
- `cuas-net-launcher-portable-cus-019` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `dedrone-now-part-of-axon-mfg-021` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `dedroneplatform-cus-034` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `defence-anti-drone-system-dads-cus-008` — Indian-origin or India-attributed entry retained Tier C because exact product/service evidence was not sufficient to meet the A/B source bar; no invention.
- `detect-destroy-anti-drone-system-cus-015` — Indian-origin or India-attributed entry retained Tier C because exact product/service evidence was not sufficient to meet the A/B source bar; no invention.
- `diehl-defence-hpem-high-power-em-cus-055` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `diehl-defence-mfg-043` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `drona-counter-drone-smart-city-cus-020` — Indian-origin or India-attributed entry retained Tier C because exact product/service evidence was not sufficient to meet the A/B source bar; no invention.
- `dronedefender-cus-021` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `dronegun-tactical-cus-022` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `dronesentry-x-cus-023` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `droneshield-mfg-020` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `elbit-bright-arrow-soft-hard-kill-cus-040` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `epirus-leonidas-pod-hpm-cus-052` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `epirus-mfg-040` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `esc-britecloud-drfm-decoy-cuas-capable-cus-049` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `fortem-skydome-system-cus-033` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `fortem-technologies-mfg-022` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `hal-integrated-cuas-airborne-cus-059` — Indian-origin or India-attributed entry retained Tier C because exact product/service evidence was not sufficient to meet the A/B source bar; no invention.
- `hensoldt-mfg-028` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `hensoldt-xpeller-counter-uas-cus-032` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `iai-drone-guard-cus-027` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `iai-elm-2182-drone-detection-radar-cus-028` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `insas-counter-drone-naval-cus-016` — Indian-origin or India-attributed entry retained Tier C because exact product/service evidence was not sufficient to meet the A/B source bar; no invention.
- `iron-beam-laser-cuas-cus-051` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `knds-france-mfg-042` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `knds-france-rapidfire-naval-cuas-cus-054` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `kriti-counter-drone-system-cus-014` — Indian-origin or India-attributed entry retained Tier C because exact product/service evidence was not sufficient to meet the A/B source bar; no invention.
- `kritikal-securescan-mfg-012` — Indian-origin or India-attributed entry retained Tier C because exact product/service evidence was not sufficient to meet the A/B source bar; no invention.
- `l3harris-technologies-mfg-033` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `l3harris-vampire-cuas-variant-cus-041` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `leonardo-falcon-shield-cus-029` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `leonardo-mfg-025` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `lockheed-martin-athena-cus-037` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `lockheed-martin-mfg-030` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `mbda-mfg-034` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `mbda-sky-warden-cus-042` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `northrop-grumman-centurion-c-ram-variant-cus-038` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `northrop-grumman-mfg-031` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `openworks-engineering-bordtek-mfg-037` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `rafael-c-dome-naval-cus-025` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `rafael-drone-dome-cus-024` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `rafael-litening-5-eo-ir-pod-cuas-capable-cus-039` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `raytheon-rtx-coyote-block-2-cus-035` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `raytheon-technologies-rtx-mfg-029` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `rheinmetall-mfg-027` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `rheinmetall-oerlikon-skynex-cus-031` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `robin-radar-systems-mfg-038` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `rtx-high-energy-laser-weapon-system-helws-cus-036` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `saab-giraffe-amb-cuas-variant-cus-043` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `sagar-manthan-anti-drone-system-cus-017` — Indian-origin or India-attributed entry retained Tier C because exact product/service evidence was not sufficient to meet the A/B source bar; no invention.
- `sapphire-counter-drone-dutch-origin-cus-048` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `skyfang-net-gun-portable-cus-046` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `skylock-dome-cuas-cus-050` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `sm-netra-anti-drone-system-cus-012` — Indian-origin or India-attributed entry retained Tier C because exact product/service evidence was not sufficient to meet the A/B source bar; no invention.
- `spike-firefly-loitering-munition-anti-drone-capable-cus-026` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `teledyne-flir-mfg-039` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `thales-ground-master-60-cuas-variant-cus-030` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `trishul-anti-drone-system-cus-013` — Indian-origin or India-attributed entry retained Tier C because exact product/service evidence was not sufficient to meet the A/B source bar; no invention.
- `vega-integrated-systems-mfg-009` — No verified India deployment/procurement footprint or manufacturer-specific India evidence sufficient for A/B.
- `iai-heron-tp-india-drn-005` — Live directory entity not yet deep-researched in this phase; retained noindex until entity-specific evidence is collected.

## Defence gap

The live Army, Navy+Coast Guard and Air Force pages expose 44 system/platform nodes and 29 industry nodes. The pack retains the existing 17 Tier-A defence dossiers rather than mass-creating evidence-free records. This is an intentional evidence-quality safeguard.

## Engineering consistency

- MANIFEST.csv rows: **141**.
- MANIFEST.json `total_dossiers`: **141**.
- `loadDossier` MAP: **69** Tier A+B slugs only.
- Tier C omitted from MAP and kept `noindex=true`.
- Route families present: counter-UAS system/manufacturer; defence entity; drones-UAS platform/company; military-aerospace entity; space entity/company.
- C-295 is cross-linked to `c295-india-def-012`, not duplicated.
- All Phase 3 created/materially edited dossiers have `last_verified=2026-08-29`.