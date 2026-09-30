#!/usr/bin/env python3
"""
Drone Expo & Conference 2026 (New Delhi, 28-30 Sep 2026) OSINT -> Techadyant Atlas.

Single source of truth for the Drone Expo 2026 ingestion. All editorial decisions
(dispositions, relationships, classifications, evidence levels) live in the
curated tables below; everything else is generated from them:

  data/osint/drone-expo-2026/
    drone_expo_2026_entity_reconciliation.json   (A) 54 A/B companies -> action
    drone_expo_2026_dependency_matrix.json       (B) subsystem x technology matrix
    drone_expo_2026_atlas_ingestion_manifest.json(C) update/add/signal/research/ignore
    drone_expo_2026_opportunity_surfaces.json    (D) 10 industrial opportunity surfaces
    drone_expo_2026_signals.json                 (E) signal drafts (intelligence format)
    drone_expo_2026_signals.cms-draft.json       (E) publish-ready drafts for scripts/publish-signals.mjs
    drone_expo_2026_relationships.json               new SID relationships (value chain)
    sid_ingest_drone_expo_2026.sql                   idempotent SID insert (NOT auto-applied)
  data/company-dossiers/<slug>.json                  one dossier per ADD_NEW entity
  app/research/_atlas.json                           snapshot patched (players + relationships)
  app/research/_platform.json                        snapshot patched (new product/tech nodes + edges)

IDs are deterministic UUIDv5, so re-running is idempotent and the committed
snapshot matches what the SQL inserts into SID.

Usage:
  python3 scripts/ingest-drone-expo-2026.py          # generate + validate
  python3 scripts/ingest-drone-expo-2026.py --check  # validate only (no writes)
"""
import csv, json, os, re, sys, uuid

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, 'data', 'osint', 'drone-expo-2026')
SRC = os.path.join(OUT, 'source')
DOSSIER_DIR = os.path.join(ROOT, 'data', 'company-dossiers')
ATLAS = os.path.join(ROOT, 'app', 'research', '_atlas.json')
PLATFORM = os.path.join(ROOT, 'app', 'research', '_platform.json')
SCHEMA = os.path.join(ROOT, 'schema', 'dossier.schema.json')

EVENT = 'Drone Expo & Conference 2026'
EXPO_URL = 'https://www.droneexpo.in/exhibitors-list'
TODAY = '2026-09-30'
OSINT_DATE = '2026-09-29'
DOSSIER_BASE = '/research/drones-uas/company/'


def uid(key: str) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_URL, f'techadyant:sid:drone-expo-2026:{key}'))


# --------------------------------------------------------------------------
# Existing SID entities (verified against sid.entities on 2026-09-30)
# --------------------------------------------------------------------------
EX = {
    't_motor':        ('0ee70e5e-0cc5-45a7-a388-3f043475fba7', 'T-Motor'),
    'bldc':           ('ee904753-3e56-461d-a775-9a58a099eb4b', 'BLDC drone motors'),
    'esc':            ('fd2ff0c1-e166-449c-9fe1-b384381dd98b', 'Electronic speed controller'),
    'packs':          ('6f859a25-d872-4d66-8307-c8133c3560ed', 'Drone battery packs'),
    'fc':             ('47065355-aa57-497c-bcf9-032132c386dd', 'Drone flight controller'),
    'mcu':            ('8e5fb42b-e531-4198-8c17-22e44e46bf58', 'Drone microcontrollers and SoCs'),
    'gnss':           ('06e3420d-55e3-46b3-a79d-92eef922e86e', 'GNSS navigation modules'),
    'cuas':           ('07ff95e3-89f0-4a07-bad6-2b9755cc54ce', 'Counter-UAS / anti-drone systems'),
    'ew':             ('b6f764bf-b79e-4a31-bc21-c26e89262780', 'Electronic warfare & ELINT'),
    'sdr':            ('4a28c361-a3f6-43b1-a5f6-ebe930348c6c', 'Software-defined radio & secure comms'),
    'loiter':         ('e40fd689-67d4-4b6e-9b16-8a00437180cd', 'Loitering munitions'),
    'small_uav':      ('c5e5bd7b-bcde-47d8-b533-383f667dd37f', 'Small UAV (multirotor)'),
    'cells':          ('3b19bd89-8cc0-4414-aa82-28badad6fa3b', 'High-energy Li-ion cells'),
    'autonomy':       ('822f650e-54c9-4e3a-b4d6-09687dcb03c4', 'AI, autonomy & target recognition'),
    'motor_pe':       ('c8bbc285-b1f1-46d7-81d0-758056bfb5a2', 'Motor-control power electronics'),
    'male':           ('5fe8dcd9-2396-463e-be75-4f0a566a9aeb', 'MALE / HALE UAV platforms'),
    'pcb':            ('37b47739-82e1-401f-9d4f-42d18fc6e379', 'Multilayer / HDI PCB'),
    'army':           ('8963fd6a-e689-489d-9b4e-e43f18bbadb2', 'Indian Army'),
    'mil':            ('dd592284-c565-4f97-ae62-167e84e6413b', 'Munitions India Limited'),
    'iitk':           ('a7cbd40b-5bcf-4f67-aec0-ba669c593a76', 'IIT Kanpur'),
}
# Existing (non-watchlist) SID opportunity surfaces the Drone Expo surfaces map onto.
EX_OPP = {
    'satcom_datalink': ('a0c80f20-1824-4fea-bc7a-120d6bae38dd', 'Indigenous SATCOM datalink module for BVLOS / BLOS UAV ops'),
    'cuas_opp':        ('7ea34eb4-e0ac-468f-ac38-daeed1763adb', 'Counter-UAS (kinetic + EW)'),
    'ew_suites':       ('0e341f9e-4caa-4c38-a05f-b46e8b6193f3', 'Electronic warfare suites'),
    'mems_imu':        ('6da6bf61-fbd9-40c2-aabf-310f4dbcd82c', 'MEMS IMU manufacturing for UAV guidance'),
    'composites':      ('6244fa3b-56a0-43f8-b358-139c036fd4bf', 'Carbon-fiber prepreg & composites manufacturing'),
    'propellers':      ('75af62da-14ba-4bfd-9d6f-9a02dcaef804', 'UAV propeller manufacturing (precision, high-volume)'),
    'pcb_gap':         ('80670c11-9963-47fa-bbd2-3c67180993e0', 'PCB manufacturing gap (multi-layer)'),
    'loiter_opp':      ('9919aed8-3e5e-43b2-bc67-06aa37f5b554', 'Loitering munitions and smart UAVs'),
    'swarm_ai':        ('d09c5b73-7bbd-47d4-9da3-b9e942f804b2', 'Indigenous AI / swarm algorithms for UAVs'),
    'magnets':         ('d9f96ef1-23db-4dd7-8d22-ccd89c57fe49', 'Sintered NdFeB magnet manufacturing'),
}

# --------------------------------------------------------------------------
# Sources (dossier + SID).  Evidence level: 1 govt/procurement, 2 independent
# media/institution, 3 company primary, 4 secondary/social, 5 unverified.
# --------------------------------------------------------------------------
SOURCES = {
    'expo': dict(title='Drone Expo & Conference 2026 — official exhibitor list', publisher='Drone Expo & Conference (organiser)',
                 url=EXPO_URL, published_date=None, level=5, sid_type=11,
                 note='Establishes exhibitor presence only. Presence does not establish indigenous technology, Indian manufacturing, procurement or deployment.'),
    'arkin_web': dict(title='Arkin Labs — company website', publisher='Arkin Labs', url='https://arkinlabs.in/', published_date=None, level=3, sid_type=8,
                      note='Company primary source (OSINT pass 2026-09-29): AeroMind flight controllers/autopilots, Navroc GNSS, sensors, power systems, ground control; states products designed and manufactured in India.'),
    'yari_web': dict(title='YARI Robotics — company website', publisher='YARI Robotics', url='https://yarirobotics.com/', published_date=None, level=3, sid_type=8,
                     note='Company primary source (OSINT pass 2026-09-29): V6X flight controller (stated designed and built in India), GNSS modules, power modules, ESCs, sensors, YARI Atlas data platform.'),
    'ascend_web': dict(title='Ascend Powerpacks — company website', publisher='Ascend Powerpacks', url='https://www.ascendpowerpacks.com/', published_date=None, level=3, sid_type=8,
                       note='Company primary source (OSINT pass 2026-09-29): drone Li-ion, Li-HV and semi-solid-state packs, intelligent BMS, smart charging; states design, manufacture and service of packs. Cell origin not disclosed.'),
    'millennium_web': dict(title='Millennium Semiconductors — drone solutions portfolio', publisher='Millennium Semiconductors India', url='https://www.millenniumsemi.com/solutions/drones/', published_date=None, level=3, sid_type=8,
                           note='Company primary source (OSINT pass 2026-09-29): drone component portfolio across processors, CMOS sensors, GPS/cellular, sensors, motor control, MOSFETs, Hall sensors, BMS, power and connectors, sourced from globally named component brands.'),
    'nicomatic_web': dict(title='Nicomatic India — subsidiary profile', publisher='Nicomatic', url='https://www.nicomatic.com/company/subsidiaries/nicomatic-india', published_date=None, level=3, sid_type=8,
                          note='Company primary source: located in Hi-Tech Defence & Aerospace Park, Bengaluru; operating since 2011; manufacturing since 2022; AS9100D for design and development of connectors and cable assemblies; lists drones among application domains.'),
    'te_web': dict(title='TE Connectivity — unmanned aerial vehicle applications', publisher='TE Connectivity', url='https://www.te.com/en/industries/defense-military/applications/unmanned-aerial-vehicles.html', published_date=None, level=3, sid_type=8,
                   note='Company primary source (OSINT pass 2026-09-29): UAV RF connectors, cables, wiring, power connectors, DEUTSCH Wildcat UAV connectors. Indian manufacturing of this portfolio not established.'),
    'rangsons_web': dict(title='Rangsons Aerospace — company website', publisher='Rangsons Aerospace', url='https://www.rangsonsaerospace.com/', published_date=None, level=3, sid_type=8,
                         note='Company primary source (OSINT pass 2026-09-29): EW suite, RWR, electronic jamming, mission systems; states integrated R&D and manufacturing; identifies MoD/IAF EW programme work.'),
    'rangsons_idrw': dict(title='Rangsons Aerospace and DRDO showcase indigenous EW and mission systems for IAF Su-30MKI and Jaguar', publisher='IDRW', url='https://idrw.org/?p=397717', published_date=None, level=4, sid_type=10,
                          note='Secondary defence blog; read via search abstract only (page not retrieved). Describes a showcase/demonstration, not a contract award. Used as a lead, never as sole source.'),
    'drogo_web': dict(title='Drogo Aerospace — company website', publisher='Drogo Aerospace', url='https://drogoaerospace.com/', published_date=None, level=3, sid_type=8,
                      note='Company primary source (OSINT pass 2026-09-29): defence UAVs, JK-250e, ISR and loitering-munition development.'),
    'drogo_delivery': dict(title='Drogo Aerospace delivers first batch of 41 JK 250e drones to Army', publisher='Asianet Newsable', url='https://newsable.asianetnews.com/india/drogo-aerospace-delivers-first-batch-of-41-jk-250e-drones-to-army-articleshow-1ng38bh', published_date='2026-06', level=2, sid_type=10,
                           note='Independent media (search abstract, 2026-09-30): first batch of 41 JK 250e drones received by Army Southern Command officials at Nashik under a ₹72 crore contract; balance targeted by August 2026. Corroborated by Siasat. No MoD primary document located.'),
    'drogo_delivery_2': dict(title='Hyderabad defence firm supplies drones to Indian Army', publisher='Siasat Daily', url='https://www.siasat.com/hyderabad-defence-firm-supplies-drones-to-indian-army-3490157/', published_date='2026-06', level=2, sid_type=10,
                             note='Independent media corroboration of the JK 250e first-batch delivery; company formerly Drogo Drones Pvt Ltd, headquartered in Madhapur, Hyderabad.'),
    'drogo_mou': dict(title='Munitions India, Drogo Aerospace sign MoU for loitering munition, UAV systems', publisher='The Hans India', url='https://www.thehansindia.com/business/market-compass/drogo-aerospace-signs-mou-with-munitions-india-for-loitering-munition-uav-systems-1118309', published_date='2026-09-04', level=2, sid_type=10,
                      note='Independent media (search abstract): MoU signed in Pune on 4 Sep 2026 between Munitions India Limited (DPSU) and Drogo Aerospace for design, development and integration of indigenous UAVs and loitering munitions. An MoU is not an order. Corroborated by Devdiscourse, GKToday, Newsable.'),
    'vu_web': dict(title='VU Dynamics — company website', publisher='VU Dynamics', url='https://vudynamics.co.in/', published_date=None, level=3, sid_type=8,
                   note='Company primary source (OSINT pass 2026-09-29): aerial platforms, launchers, simulators.'),
    'vu_iitk': dict(title='IIT Kanpur-incubated startup VU Dynamics collaborates with PATH Group to advance indigenous defence manufacturing', publisher='IIT Kanpur', url='https://iitk.ac.in/startup-vu-dynamics-collaborates-with-path-group', published_date='2025-05', level=2, sid_type=11,
                    note='Institutional source (search abstract; page not retrieved): incubated at SIIC IIT Kanpur; led by Prof Subrahmanyam Saderla and Dr Sravanthi Saderla; long-endurance aerial systems with proprietary technologies developed in India; strategic partnership with Prakash Asphaltings and Toll Highways (India) Ltd (PATH Group).'),
    'vu_takeover': dict(title='PATH takes over drone start-up VU Dynamics, to set up factory in Indore (as indexed)', publisher='The Hindu BusinessLine (via Venture Intelligence)', url='https://news.ventureintelligence.com/private-equity/prakash-asphaltings-acquires-iit-kanpur-incubated-drones-maker-vu-dynamics', published_date='2025-05-19', level=2, sid_type=10,
                        note='Reports the PATH deal as a takeover with an Indore factory. IIT Kanpur describes it as a collaboration. Ownership structure unresolved.'),
    'zerosum_web': dict(title='Zerosum Technologies — company website', publisher='Zerosum Technologies', url='https://www.zerosumtechnologies.com/', published_date=None, level=3, sid_type=8,
                        note='Company primary source (OSINT pass 2026-09-29): UAV propulsion, autopilots, GNSS-denied navigation, RF communications, parachute recovery, testing. Technology-origin claims need component-level verification; a technology-partnership model is indicated but not mapped.'),
    'warg_web': dict(title='WARG Robotics — company website', publisher='WARG Robotics', url='https://www.wargrobotics.com/', published_date=None, level=3, sid_type=8,
                     note='Company primary source (OSINT pass 2026-09-29): digital low-latency video/telemetry link, encrypted digital link, autonomous flight supervision, FPV air and ground platforms; proprietary technology claimed.'),
    'tmotor_web': dict(title='T-MOTOR — official store / product catalogue', publisher='T-MOTOR', url='https://store.tmotor.com/', published_date=None, level=3, sid_type=8,
                       note='Company primary source: UAV motors, ESCs and propulsion systems. Indian manufacturing not established.'),
    'atlas_uas': dict(title="Who Builds India's Drones? — Drone Manufacturing Ecosystem", publisher='Techadyant Labs', url='https://labs.techadyant.com/reports/who-builds-indias-drones/', published_date=None, level=3, sid_type=11,
                      note='Techadyant internal cross-reference (existing SID source a6c39a70). Sovereignty scores are Techadyant estimates — indicative, not external verification.', sid_existing='a6c39a70-f18a-4f8c-93a3-d51c6b275d3f'),
}
TRUST = {1: 'official', 2: 'credible', 3: 'indicative', 4: 'indicative', 5: 'indicative'}
VERIF = {1: 'verified', 2: 'corroborated', 3: 'single_source', 4: 'unverified', 5: 'unverified'}

# --------------------------------------------------------------------------
# New SID nodes (only three — added because the value-chain edges need them)
# --------------------------------------------------------------------------
NEW_NODES = {
    'connectors': dict(name='Drone connectors & cable harnesses', type_code='product', type='Product / Component', country='IN',
                       description='Electrical/RF connectors, interconnects and cable harnesses in UAV avionics, power and payload wiring. Mapped from Drone Expo 2026 OSINT; the Atlas UAS sovereignty table scores connectors & passives as import-reliant.',
                       kind_label='Product / Component'),
    'datalink': dict(name='UAV datalink modules', type_code='product', type='Product / Component', country='IN',
                     description='Command-and-control, telemetry and video radio links for UAVs, from ISM-band modules to encrypted digital links and SATCOM terminals. The datalink is where contested-spectrum resilience is won or lost.',
                     kind_label='Product / Component'),
    'gnss_denied': dict(name='GNSS-denied UAV navigation', type_code='technology', type='Technology', country='IN',
                        description='Navigation that keeps a UAV on track when GNSS is jammed or spoofed: visual/terrain-referenced navigation, inertial fusion and alternative PNT. A defence-critical complement to GNSS modules.',
                        kind_label='Technology'),
}

# --------------------------------------------------------------------------
# ADD_NEW entities (11) + T-Motor update.  Everything the dossiers, SID rows and
# manifest need is here.
# --------------------------------------------------------------------------
ADD = [
    dict(key='arkin', company='Arkin Labs Private Limited', name='Arkin Labs', slug='arkin-labs', type_code='company', country='IN',
         hq='Chennai, Tamil Nadu, India', web='https://arkinlabs.in/', layer='Avionics',
         layers=['Avionics / Flight controller', 'Avionics / Autopilot', 'Avionics / GNSS', 'Avionics / Sensors', 'Avionics / Power module', 'Software / Mission planning (ground control)'],
         products='AeroMind flight controllers / autopilots; Navroc GNSS; sensors and peripherals; power systems; ground control',
         description='Chennai-based UAV avionics company (flight controllers/autopilots, Navroc GNSS, sensors, power modules, ground control). Company states products are designed and manufactured in India; component sourcing undisclosed. Drone Expo 2026 exhibitor.',
         cls=dict(company_origin=('Indian', 3, 'Company website'), design_origin=('Indian', 3, 'Company claim — not independently verified'),
                  manufacturing=('India', 3, 'Company claim — facility not verified'), assembly_integration=('India', 3, 'Company claim')),
         tech_origin=('UNKNOWN', 'Company claims "Indian designed + Indian manufactured"; MCU, IMU and GNSS-chipset origin undisclosed, so the product-level class cannot be assigned.'),
         defence='Company states deployment across OEM and defence programmes (L3, unverified — no programme named or corroborated).',
         evidence=3, status='Operational', sources=['arkin_web', 'expo'], opp=['DOSF-01'],
         open_q=['Which MCU/SoC, IMU and GNSS chipsets are inside AeroMind and Navroc, and who makes them?',
                 'Which named OEMs or defence programmes use AeroMind? No customer is independently corroborated.',
                 'Is manufacturing in-house PCB assembly, contract EMS, or final integration only?']),
    dict(key='yari', company='YARI Robotics Private Limited', name='YARI Robotics', slug='yari-robotics', type_code='company', country='IN',
         hq='Coimbatore, Tamil Nadu, India', web='https://yarirobotics.com/', layer='Avionics',
         layers=['Avionics / Flight controller', 'Avionics / GNSS', 'Avionics / Power module', 'Propulsion / ESC', 'Software / Data platform'],
         products='V6X flight controller; GNSS modules; power modules; ESCs; sensors; YARI Atlas data platform',
         description='Coimbatore-based drone avionics and propulsion-electronics company: V6X flight controller (company states designed and built in India), GNSS and power modules, ESCs and the YARI Atlas flight-data platform. Drone Expo 2026 exhibitor.',
         cls=dict(company_origin=('Indian', 3, 'Company website'), design_origin=('Indian', 3, 'Company claim for V6X'),
                  manufacturing=('India', 3, 'Company claim for V6X — facility not verified'), assembly_integration=('India', 3, 'Company claim')),
         tech_origin=('UNKNOWN', 'V6X is claimed "designed and built in India"; semiconductor content (MCU, IMU, gate drivers/MOSFETs in the ESCs) undisclosed.'),
         defence='Company targets defence, commercial, research and development teams (L3). No defence customer corroborated.',
         evidence=3, status='Operational', sources=['yari_web', 'expo'], opp=['DOSF-01', 'DOSF-03'],
         open_q=['Semiconductor bill of materials of V6X and the ESC line.',
                 'Whether the ESCs are in-house designs or rebadged/partner products.',
                 'Adoption: which OEMs integrate V6X in production aircraft?']),
    dict(key='ascend', company='Ascend Powerpacks Private Limited', name='Ascend Powerpacks', slug='ascend-powerpacks', type_code='company', country='IN',
         hq='Hyderabad, Telangana, India', web='https://www.ascendpowerpacks.com/', layer='Energy',
         layers=['Energy / Battery pack', 'Energy / BMS', 'Energy / Charger'],
         products='Drone Li-ion packs; Li-HV packs; semi-solid-state packs; intelligent BMS; smart charging',
         description='Hyderabad-based drone battery-pack company (Li-ion, Li-HV, semi-solid-state packs, BMS, chargers). Company states it designs, manufactures and services packs; cell origin undisclosed. Drone Expo 2026 exhibitor.',
         cls=dict(company_origin=('Indian', 3, 'Company website'), design_origin=('Indian', 3, 'Company claim for packs/BMS'),
                  manufacturing=('India', 3, 'Company claim — pack-level only'), assembly_integration=('India', 3, 'Company claim')),
         tech_origin=('UNKNOWN', 'Pack assembly and BMS are claimed as in-house; the cell — the strategic content of a pack — is not disclosed. Not classified "Indian designed + foreign components" because cell origin is unevidenced.'),
         defence='Company lists research and defence applications (L3). No customer corroborated.',
         evidence=3, status='Operational', sources=['ascend_web', 'expo', 'atlas_uas'], opp=['DOSF-04'],
         open_q=['Cell supplier and country of origin for each pack family — especially the semi-solid-state line.',
                 'Is the BMS silicon (AFE, MCU) sourced from the same foreign vendors seen in distributor portfolios?',
                 'Production capacity (packs/month) and any DGCA type-certified platforms using Ascend packs.']),
    dict(key='millennium', company='Millennium Semiconductors India Private Limited', name='Millennium Semiconductors India', slug='millennium-semiconductors-india', type_code='company', country='IN',
         hq='India (HQ not verified in this pass)', web='https://www.millenniumsemi.com/solutions/drones/', layer='Electronics / Distribution',
         layers=['Avionics / MCU', 'Avionics / Sensors', 'Avionics / GNSS', 'Propulsion / Power semiconductors', 'Energy / BMS', 'Avionics / Power management', 'Communications / Connectors'],
         products='Drone component supply: processors, CMOS sensors, GPS/cellular, sensors, motor control, MOSFETs, Hall sensors, BMS, power and connectors',
         node_role='MARKET / COMPONENT INTELLIGENCE NODE (distributor)',
         description='Indian electronic-component distributor with a public drone-component portfolio (processors, CMOS sensors, GNSS/cellular, motor control, MOSFETs, BMS, power, connectors) drawn from globally sourced brands. A market/component intelligence node, not an OEM. Drone Expo 2026 exhibitor.',
         cls=dict(company_origin=('Indian', 3, 'Company website'), design_origin=('Foreign', 3, 'Portfolio consists of globally sourced component brands'),
                  manufacturing=('Unknown', 5, 'Not established — distribution and design-support'), assembly_integration=('Unknown', 5, 'Not established')),
         tech_origin=('Distributor', 'Distributes foreign-designed components; does not establish Indian component manufacturing.'),
         defence='No defence customer or programme evidenced for the drone portfolio — defence relevance unknown and left unverified.', evidence=3, status='Operational', sources=['millennium_web', 'expo'], opp=['DOSF-02', 'DOSF-09'],
         open_q=['Exact line card for the drone portfolio (which MCU, IMU, GNSS, MOSFET and BMS brands) — the page could not be re-read in this pass.',
                 'Volume signal: which component families move most to Indian drone OEMs?',
                 'Does the design-support service extend to reference flight-controller or ESC designs used by Indian OEMs?']),
    dict(key='nicomatic', company='Nicomatic India Electronics Private Limited', name='Nicomatic India', slug='nicomatic-india', type_code='company', country='IN',
         hq='Hi-Tech Defence & Aerospace Park, KIADB, Bengaluru, Karnataka, India', web='https://www.nicomatic.com/company/subsidiaries/nicomatic-india', layer='Electronics / Interconnect',
         layers=['Communications / Connectors', 'Avionics / Electrical interconnect', 'Manufacturing / Cable assembly'],
         products='Electrical/electronic connectors and cable assemblies; MIL-standard interconnect solutions',
         description='Bengaluru manufacturing subsidiary of France\'s Nicomatic group: connectors and cable assemblies to MIL standards; company states manufacturing since 2022 and AS9100D certification; lists drones among target domains. Drone Expo 2026 exhibitor.',
         cls=dict(company_origin=('Foreign', 3, 'Indian subsidiary of the French Nicomatic group'), design_origin=('Unknown', 5, 'India unit certified for design & development; group IP ownership not established'),
                  manufacturing=('India', 3, 'Company states manufacturing in Bengaluru since 2022'), assembly_integration=('India', 3, 'Cable assemblies — company claim')),
         tech_origin=('Foreign technology + Indian manufacturing', 'Evidence level 3: foreign group, company-stated Indian manufacturing. Drone-specific product lines not individually verified.'),
         defence='Company lists defence optronics, radar, missiles, military communications and drones (L3).',
         evidence=3, status='Operational', sources=['nicomatic_web', 'expo'], opp=['DOSF-02'],
         open_q=['Which UAV OEMs source Nicomatic India interconnects, and at what volume?',
                 'Share of contacts/plating/insulators made in Bengaluru versus imported from the group.']),
    dict(key='te', company='TE Connectivity', name='TE Connectivity', slug='te-connectivity', type_code='foreign_supplier', country='IE',
         hq='Global (Ireland-domiciled multinational)', web='https://www.te.com/en/industries/defense-military/applications/unmanned-aerial-vehicles.html', layer='Electronics / Interconnect',
         layers=['Communications / Connectors', 'Communications / RF', 'Avionics / Power'],
         products='UAV RF connectors, cables, wiring, power connectors, DEUTSCH Wildcat UAV connectors',
         description='Global interconnect multinational with a dedicated UAV portfolio (RF and power connectors, cables, DEUTSCH Wildcat UAV connectors). Benchmark for defence-grade UAV interconnect; Indian manufacturing of this portfolio not established. Drone Expo 2026 exhibitor.',
         cls=dict(company_origin=('Foreign', 3, 'Multinational'), design_origin=('Foreign', 3, 'Global product lines'),
                  manufacturing=('Unknown', 5, 'Not established for the UAV portfolio'), assembly_integration=('Unknown', 5, 'Not established')),
         tech_origin=('UNKNOWN', 'Foreign company; whether UAV connectors sold in India are imported or locally made is not evidenced.'),
         defence='Dedicated defence UAV interconnect portfolio (L3). No Indian defence programme use of this portfolio evidenced.', evidence=3, status='Operational', sources=['te_web', 'expo'], opp=['DOSF-02'],
         open_q=['Is any of the UAV interconnect portfolio made or assembled in India?']),
    dict(key='rangsons', company='Rangsons Aerospace Private Limited', name='Rangsons Aerospace', slug='rangsons-aerospace', type_code='company', country='IN',
         hq='India (Karnataka)', web='https://www.rangsonsaerospace.com/', layer='Communications / EW',
         layers=['Communications / SATCOM', 'Communications / Datalink', 'Communications / Secure communications', 'Counter-UAS / EW', 'Counter-UAS / Jamming'],
         products='EW suite; RWR; electronic jamming; mission systems; SATCOM-on-the-move and secure datalink (reported)',
         description='Indian aerospace/defence electronics company: EW suites, RWR, jamming and mission systems; reported SATCOM-on-the-move and secure datalink work with DRDO for IAF fleets. Company states integrated R&D and manufacturing. Drone Expo 2026 exhibitor.',
         cls=dict(company_origin=('Indian', 3, 'Company website'), design_origin=('Unknown', 4, 'Company and secondary reporting describe indigenous EW; component origin unknown'),
                  manufacturing=('India', 3, 'Company claim'), assembly_integration=('India', 3, 'Company claim')),
         tech_origin=('UNKNOWN', 'EW/SATCOM systems described as indigenous in company and blog sources; RF front-end, FPGA and GaN content unknown.'),
         defence='Company identifies MoD/IAF EW programme work (L3); a DRDO-collaborative showcase for Su-30MKI/Jaguar is reported by a defence blog (L4). No contract award located. UAV-specific products not evidenced.',
         evidence=3, status='Operational', sources=['rangsons_web', 'rangsons_idrw', 'expo'], opp=['DOSF-05', 'DOSF-06'],
         open_q=['Which EW/datalink products are packaged for UAV or C-UAS use (the Drone Expo positioning)?',
                 'Contract evidence for the IAF EW programme and SATCOM systems (reported as operational with IAF in secondary sources only).']),
    dict(key='drogo', company='Drogo Aerospace Pvt Ltd', name='Drogo Aerospace', slug='drogo-aerospace', type_code='company', country='IN',
         hq='Madhapur, Hyderabad, Telangana, India', web='https://drogoaerospace.com/', layer='Platform',
         layers=['Platform / Tactical UAV', 'Platform / Loitering munition'],
         products='JK 250e surveillance/recon UAV; Delta Wing Kamikaze UAV / loitering-munition platform (development)',
         aliases=[('Drogo Drones Pvt Ltd', 'former_name'), ('Drogo Drones', 'former_name')],
         description='Hyderabad defence UAV maker (formerly Drogo Drones). Reported to have delivered a first batch of 41 JK 250e drones to the Indian Army (Southern Command) in June 2026 under a ₹72 crore contract; MoU with Munitions India (Sep 2026) on UAVs and loitering munitions.',
         cls=dict(company_origin=('Indian', 2, 'Media reporting'), design_origin=('Indian', 3, 'Company describes platforms as indigenous'),
                  manufacturing=('Unknown', 5, 'Facility status not verified'), assembly_integration=('India', 2, 'Delivery to Army implies Indian integration — facility and content unverified')),
         tech_origin=('UNKNOWN', 'JK 250e described as Make in India; propulsion, battery, avionics and datalink sourcing undisclosed.'),
         defence='Reported delivery of 41 JK 250e to Indian Army Southern Command (Nashik) under ₹72 crore contract, June 2026 (L2 — multiple outlets, no MoD primary). MoU with Munitions India Ltd, 4 Sep 2026, for design/development/integration of UAVs and loitering munitions (L2; an MoU is not an order).',
         evidence=2, status='Operational', sources=['drogo_delivery', 'drogo_delivery_2', 'drogo_mou', 'drogo_web', 'expo'], opp=['DOSF-07'],
         deployments=[
             dict(agency='Indian Army (Southern Command)', context='JK 250e surveillance/reconnaissance drones — first batch received at Nashik', year='2026',
                  quantity_or_note='41 units (first batch) under a reported ₹72 crore contract; balance targeted by August 2026. Media-reported; no MoD primary document located. Completion of the balance not verified.', sources=['drogo_delivery', 'drogo_delivery_2']),
             dict(agency='Munitions India Limited (DPSU)', context='MoU for design, development and integration of indigenous UAVs and loitering munitions (Delta Wing Kamikaze platform)', year='2026',
                  quantity_or_note='MoU signed 4 Sep 2026, Pune. Collaboration framework only — no order, quantity or value.', sources=['drogo_mou'])],
         timeline=[('2026-06', 'First batch of 41 JK 250e drones reported delivered to Army Southern Command, Nashik (₹72 crore contract).', ['drogo_delivery', 'drogo_delivery_2']),
                   ('2026-09-04', 'MoU with Munitions India Limited on indigenous UAVs and loitering munitions, signed in Pune.', ['drogo_mou']),
                   ('2026-09-28', 'Exhibits at Drone Expo & Conference 2026, New Delhi.', ['expo'])],
         open_q=['Primary MoD/Army contract reference for the ₹72 crore JK 250e order, and whether the August 2026 balance was delivered.',
                 'JK 250e bill of materials: motors, cells, flight controller and datalink origin.',
                 'Whether the Delta Wing Kamikaze platform has entered any formal trial or procurement route.']),
    dict(key='vu', company='VU-Dynamics Private Limited', name='VU Dynamics', slug='vu-dynamics', type_code='company', country='IN',
         hq='SIIC, IIT Kanpur, Uttar Pradesh, India', web='https://vudynamics.co.in/', layer='Platform',
         layers=['Platform / Fixed-wing', 'Platform / Tactical UAV', 'Platform / Launcher', 'Software / Simulation'],
         products='Long-endurance aerial platforms; launchers; simulators',
         aliases=[('VU-Dynamics Private Limited', 'legal_name'), ('VU-Dynamics', 'common')],
         description='IIT Kanpur-incubated (SIIC) defence UAV developer led by Prof Subrahmanyam Saderla: long-endurance aerial platforms, launchers and simulators. Strategic partnership with PATH Group (reported by BusinessLine as a takeover, with an Indore factory).',
         cls=dict(company_origin=('Indian', 2, 'IIT Kanpur'), design_origin=('Indian', 2, 'IIT Kanpur: proprietary technologies developed in India'),
                  manufacturing=('India', 3, 'Company/partner statements; Indore factory reported, not verified as operating'), assembly_integration=('India', 3, 'Company/partner statements')),
         tech_origin=('UNKNOWN', 'Airframe and systems design is institutionally attributed to India; propulsion, avionics and datalink sourcing undisclosed.'),
         defence='Defence-focused autonomous aerial platforms (L2 institutional description). No procurement located.',
         evidence=2, status='Development', sources=['vu_iitk', 'vu_takeover', 'vu_web', 'expo'], opp=['DOSF-07'],
         timeline=[('2022', 'Company founded (IIT Kanpur SIIC incubation).', ['vu_iitk']),
                   ('2025-05', 'Strategic partnership with PATH Group announced; BusinessLine reports a takeover and an Indore factory.', ['vu_iitk', 'vu_takeover']),
                   ('2026-09-28', 'Exhibits at Drone Expo & Conference 2026, New Delhi.', ['expo'])],
         open_q=['Is VU Dynamics now a PATH subsidiary (takeover) or a partner (collaboration)? Sources disagree.',
                 'Status of the Indore factory: announced, under construction or producing?',
                 'Any Army/tri-service trial or order for VU Dynamics platforms.']),
    dict(key='zerosum', company='Zerosum Technologies Pvt Ltd.', name='Zerosum Technologies', slug='zerosum-technologies', type_code='company', country='IN',
         hq='India (HQ not verified in this pass)', web='https://www.zerosumtechnologies.com/', layer='Subsystems',
         layers=['Propulsion / Propulsion controller', 'Avionics / Autopilot', 'Avionics / GNSS-denied navigation', 'Communications / RF', 'Manufacturing / Testing'],
         products='UAV propulsion, autopilots, GNSS-denied navigation, RF communications, parachute recovery, testing',
         description='Indian UAV subsystem engineering/integration company: propulsion, autopilots, GNSS-denied navigation, RF communications, parachute recovery and testing. Technology-partnership model indicated; which subsystems are in-house is unmapped. Drone Expo 2026 exhibitor.',
         cls=dict(company_origin=('Indian', 3, 'Company website'), design_origin=('Mixed', 3, 'Technology-partnership model indicated; split unmapped'),
                  manufacturing=('Unknown', 5, 'Not established'), assembly_integration=('India', 3, 'Integration — company claim')),
         tech_origin=('UNKNOWN', 'Candidate "System integrator"; which lines are partner technology versus in-house design is not evidenced.'),
         defence='UAV subsystem, navigation and communications relevance (L3).', evidence=3, status='Operational', sources=['zerosum_web', 'expo'], opp=['DOSF-01', 'DOSF-03', 'DOSF-05'],
         open_q=['Who are the technology partners, and which product lines are theirs?',
                 'Is the GNSS-denied navigation in-house (visual/terrain-referenced) or a licensed foreign product?']),
    dict(key='warg', company='WARG Robotics', name='WARG Robotics', slug='warg-robotics', type_code='company', country='IN',
         hq='Bengaluru, Karnataka, India', web='https://www.wargrobotics.com/', layer='Communications / Autonomy',
         layers=['Communications / Datalink', 'Communications / Secure communications', 'Software / Autonomy', 'Platform / FPV'],
         products='Digital low-latency video/telemetry link; encrypted digital link; autonomous flight supervision; FPV air and ground platforms',
         description='Bengaluru unmanned-systems company building an encrypted, low-latency digital video/telemetry link, autonomous flight supervision and FPV air and ground platforms; proprietary technology claimed. Drone Expo 2026 exhibitor.',
         cls=dict(company_origin=('Indian', 3, 'Company website'), design_origin=('Indian', 3, 'Proprietary technology claimed'),
                  manufacturing=('Unknown', 5, 'Not established'), assembly_integration=('Unknown', 5, 'Not established')),
         tech_origin=('UNKNOWN', 'Link protocol/software claimed proprietary; RF chipset and radio hardware origin undisclosed.'),
         defence='Autonomy, encrypted digital link and unmanned air/ground architecture (L3). No customer corroborated.',
         evidence=3, status='Development', sources=['warg_web', 'expo'], opp=['DOSF-05', 'DOSF-10'],
         open_q=['RF chipset / SDR platform underneath the digital link.',
                 'Encryption implementation and any certification (e.g. for defence use).',
                 'Customers or trials for the air-ground platforms.']),
]

TMOTOR_UPDATE = dict(
    key='t_motor', company='T-MOTOR', existing_id=EX['t_motor'][0],
    append=' Exhibited directly at Drone Expo & Conference 2026 (New Delhi) — a direct India market presence; no Indian manufacturing established.',
    sources=['tmotor_web', 'expo'])

# --------------------------------------------------------------------------
# New SID relationships (value chain).  type, source key, target key,
# description, evidence level, sources.
# --------------------------------------------------------------------------
def E(k):
    """Resolve a key to (id, name) across existing, new-node and new-company tables."""
    if k in EX: return EX[k]
    if k in NEW_NODES: return (uid('node:' + k), NEW_NODES[k]['name'])
    for a in ADD:
        if a['key'] == k: return (uid('entity:' + k), a['name'])
    raise KeyError(k)

RELS = [
    ('develops', 'arkin', 'fc', 'AeroMind flight controllers/autopilots. Company-stated Indian design and manufacture; component origin undisclosed.', 3, ['arkin_web']),
    ('develops', 'arkin', 'gnss', 'Navroc GNSS modules. Company claim; GNSS chipset origin undisclosed.', 3, ['arkin_web']),
    ('develops', 'yari', 'fc', 'V6X flight controller — company states designed and built in India.', 3, ['yari_web']),
    ('develops', 'yari', 'gnss', 'GNSS modules (company product line).', 3, ['yari_web']),
    ('develops', 'yari', 'esc', 'ESCs (company product line); in-house vs partner design not established.', 3, ['yari_web']),
    ('develops', 'ascend', 'packs', 'Li-ion, Li-HV and semi-solid-state drone packs with in-house BMS — company claim.', 3, ['ascend_web']),
    ('depends_on', 'ascend', 'cells', 'Pack maker; cell supplier and origin undisclosed — the pack-vs-cell sovereignty gap.', 3, ['ascend_web', 'atlas_uas']),
    ('supplies_to', 'millennium', 'mcu', 'Distributes processors/MCUs for drone flight control from globally sourced brands (distributor, not manufacturer).', 3, ['millennium_web']),
    ('supplies_to', 'millennium', 'motor_pe', 'Distributes motor-control ICs, MOSFETs and Hall sensors for drone propulsion electronics.', 3, ['millennium_web']),
    ('supplies_to', 'millennium', 'gnss', 'Distributes GPS/cellular modules for drones.', 3, ['millennium_web']),
    ('develops', 'nicomatic', 'connectors', 'Connectors and cable assemblies; company states Bengaluru manufacturing since 2022 (foreign-group subsidiary).', 3, ['nicomatic_web']),
    ('manufactures', 'te', 'connectors', 'UAV RF/power connectors and DEUTSCH Wildcat UAV connectors (global portfolio; Indian manufacturing not established).', 3, ['te_web']),
    ('component_of', 'connectors', 'small_uav', 'Interconnect and harnessing across avionics, power and payload wiring.', 3, ['atlas_uas']),
    ('develops', 'rangsons', 'ew', 'EW suite, RWR and jamming systems — company claim; DRDO-collaborative showcase reported (blog).', 3, ['rangsons_web', 'rangsons_idrw']),
    ('develops', 'rangsons', 'sdr', 'SATCOM-on-the-move and secure datalink architectures (reported, secondary).', 4, ['rangsons_idrw']),
    ('supplies_to', 'drogo', 'army', 'First batch of 41 JK 250e drones reported delivered to Army Southern Command, Nashik (Jun 2026) under a ₹72 crore contract. Media-reported; no MoD primary.', 2, ['drogo_delivery', 'drogo_delivery_2']),
    ('partners_with', 'drogo', 'mil', 'MoU (4 Sep 2026) for design, development and integration of indigenous UAVs and loitering munitions. Not an order.', 2, ['drogo_mou']),
    ('develops', 'drogo', 'loiter', 'Delta Wing Kamikaze UAV / loitering-munition platform — development stage; company says recently tested.', 3, ['drogo_mou']),
    ('related_to', 'vu', 'iitk', 'Incubated at SIIC, IIT Kanpur; co-founder is IIT Kanpur aerospace faculty.', 2, ['vu_iitk']),
    ('develops', 'zerosum', 'fc', 'Autopilots (company product line); in-house vs partner technology unmapped.', 3, ['zerosum_web']),
    ('develops', 'zerosum', 'gnss_denied', 'GNSS-denied navigation offering (company claim); technology origin unverified.', 3, ['zerosum_web']),
    ('related_to', 'gnss_denied', 'gnss', 'Complements/backs up GNSS modules when GNSS is jammed or spoofed.', 3, ['atlas_uas']),
    ('develops', 'warg', 'datalink', 'Encrypted, low-latency digital video/telemetry link — proprietary technology claimed.', 3, ['warg_web']),
    ('develops', 'warg', 'autonomy', 'Autonomous flight supervision for air and ground platforms (company claim).', 3, ['warg_web']),
    ('component_of', 'datalink', 'small_uav', 'C2, telemetry and video link subsystem.', 3, ['atlas_uas']),
    ('component_of', 'datalink', 'male', 'LOS/BLOS datalinks and SATCOM terminals for MALE/HALE UAVs.', 3, ['atlas_uas']),
    ('related_to', 'datalink', 'sdr', 'Resilient/secure UAV datalinks increasingly built on SDR and secure-comms technology.', 3, ['atlas_uas']),
]
REL_LABEL = {'develops': 'Develops', 'manufactures': 'Manufactures / Produces', 'supplies_to': 'Supplies to', 'depends_on': 'Depends on',
             'component_of': 'Component of', 'partners_with': 'Partners / JV with', 'related_to': 'related to'}
REL_TYPE_ID = {'supplies_to': 1, 'depends_on': 2, 'partners_with': 12, 'develops': 14, 'manufactures': 15, 'component_of': 16, 'related_to': 30}

# --------------------------------------------------------------------------
# Dispositions for the other 43 A/B companies.
# --------------------------------------------------------------------------
SIGNAL_ONLY = {
    'Vajron Global Tech Private Limited': ('C-UAS / interceptor positioning at the expo; no public product, trial or customer evidence found (web search 2026-09-30 returned nothing). Referenced as emerging C-UAS capability in the existing C-UAS architecture; not added to the C-UAS register.', ['Counter-UAS / Interceptor', 'Counter-UAS / C2']),
    'Stellar Invictus Private Limited': ('UAS/C-UAS/AI positioning; no public product or system evidence found (web search 2026-09-30). Emerging-capability reference only; no duplicate C-UAS entry.', ['Counter-UAS / Detection', 'Software / AI']),
    'Vayuron Advanced Systems Private Limited': ('Defence ISR / VTOL / loitering claims ("Ghost Stalker") rest on company and LinkedIn material only. Watch for trial or procurement evidence before promotion.', ['Platform / VTOL', 'Platform / Tactical UAV', 'Platform / Loitering munition']),
}
IGNORE = {
    'Aerodrones India Company': 'UAV services/OEM listing with no distinctive technology or evidence; does not improve understanding of the industrial stack.',
    'UAS Glory Air': 'UAV services listing; no industrial-stack content.',
    'Janatics Industrial Automation Private Limited': 'Industrial pneumatics/automation; drone-specific role not established.',
    'Craftifai Technologies Private Limited': 'Generic AI/software positioning; excluded under the no-generic-AI rule.',
    'ShepHertz Technologies Private Limited': 'Generic cloud/software; excluded under the no-generic-AI rule.',
    'Nirmitsu Design Labs Private Limited': 'Design/AI services; no drone-stack product evidenced.',
}
RESEARCH_ONLY = {
    # name: (reason, layers, review_flag, opp)
    'ATC Energies System Limited': ('Battery/energy exhibitor; relevant to DOSF-04 cell-vs-pack question but only expo-listed.', ['Energy / Battery pack'], 'VERIFY: cell vs pack role', 'DOSF-04'),
    'Axldrone India Private Limited': ('Generic UAV OEM listing; specialist supplier-directory candidate only.', ['Platform / Multirotor'], '', ''),
    'Beni Aerospace Private Limited': ('VTOL/advanced UAV positioning; platform specifics unverified.', ['Platform / VTOL'], '', 'DOSF-07'),
    'Bharat Skytech Private Limited': ('Component distributor — MARKET / COMPONENT INTELLIGENCE NODE. Value is its line card (imported brands, demand), not OEM capability. No public drone line card retrieved.', ['Distribution / Components'], 'CAPTURE LINE CARD', 'DOSF-09'),
    'Bharatrohan Airborne Innovations Limited': ('Hyperspectral agri-drone payload/services; payload-layer relevance, expo-listed only in this pass.', ['Payload / Hyperspectral'], 'VERIFY: payload origin', ''),
    'Decouvertes Future Tech Private Limited': ('Emerging-technology UAV listing; nothing verifiable.', ['Platform'], '', ''),
    'EDITHFPV': ('FPV platform/component exhibitor; FPV is strategically relevant but no evidence retrieved.', ['Platform / FPV'], 'VERIFY: component origin', 'DOSF-03'),
    'Enovix Research and Development Services India Limited': ('Battery-technology R&D entity; if linked to US Enovix Corp (silicon-anode cells), it is a foreign-technology R&D node — relationship unverified.', ['Energy / Cell'], 'VERIFY: parent and India activity', 'DOSF-04'),
    'Espacio Aeronext Private Limited': ('Aerospace/UAV listing; nothing verifiable.', ['Platform'], '', ''),
    'FC TecNrgy Private Limited': ('Battery/energy exhibitor; expo-listed only.', ['Energy / Battery pack'], '', 'DOSF-04'),
    'Fligen Systems Private Limited': ('Screened as A (UAV OEM) but no product, customer or URL evidence retrieved — cannot justify an Atlas entity.', ['Platform'], 'VERIFY before promotion', 'DOSF-07'),
    'Godi Nova India Private Limited': ('Listed under battery cells. If it is part of the Hyderabad cell-maker GODI group it would matter for the cell question — relationship unverified.', ['Energy / Cell'], 'VERIFY: cell manufacturing + group link', 'DOSF-04'),
    'HYDROCOPTER': ('Advanced platform listing (possibly hydrogen-powered); unverified.', ['Platform', 'Energy'], '', ''),
    'JSM Composites Pvt. Ltd.': ('Composite manufacturing — enabling layer (DOSF-08); expo-listed only.', ['Manufacturing / Composite manufacturing'], '', 'DOSF-08'),
    'Macnica Cytech India Pvt Ltd': ('Semiconductor distributor (Indian arm of a Japanese distribution group) — MARKET / COMPONENT INTELLIGENCE NODE; no drone line card retrieved.', ['Distribution / Semiconductors'], 'CAPTURE LINE CARD', 'DOSF-02'),
    'Maksat Technologies Pvt Ltd': ('Screened as UAV communications/RF; no product evidence retrieved. High-priority verification for DOSF-05.', ['Communications / RF', 'Communications / Datalink'], 'PRIORITY VERIFY', 'DOSF-05'),
    'Mehta Hitech Industries Limited': ('Materials/manufacturing listing; drone role unverified.', ['Manufacturing'], '', 'DOSF-08'),
    'Ninetron Tech': ('Components/geospatial services listing.', ['Distribution / Components'], '', ''),
    'Nitpro Composites': ('Composite manufacturing — enabling layer (DOSF-08); expo-listed only.', ['Manufacturing / Composite manufacturing'], '', 'DOSF-08'),
    'Nsure Reliable Power Solutions Private Limited': ('Screened as battery cells/energy; cell-manufacturing claim (if any) is the key question for DOSF-04 and is unverified.', ['Energy / Cell'], 'PRIORITY VERIFY: cell manufacturing', 'DOSF-04'),
    'Phillips Machine Tools India Private Limited': ('Machine-tool / additive supplier — manufacturing-infrastructure node (DOSF-08). Likely distributes foreign machine brands; unverified.', ['Manufacturing / CNC', 'Manufacturing / Additive manufacturing'], 'VERIFY: brands represented', 'DOSF-08'),
    'Robu.in': ('Hobby/prosumer component e-commerce — MARKET / COMPONENT INTELLIGENCE NODE for imported component brands and demand.', ['Distribution / Components'], 'CAPTURE LINE CARD', 'DOSF-09'),
    'SANH Systems Private Limited': ('Multi-mission/VTOL/heavy-payload UAVs + DaaS; all capability and defence claims are company-stated. Track under DOSF-07/10; not a distinct stack contributor yet.', ['Platform / VTOL', 'Platform / Heavy lift', 'Software / Simulation'], 'VERIFY: defence evidence', 'DOSF-07'),
    'SIECHEM Technologies Private Limited': ('Materials listing; drone role unverified.', ['Manufacturing'], '', 'DOSF-08'),
    'SKYi Composites Private Limited': ('Composite manufacturing — enabling layer (DOSF-08); expo-listed only.', ['Manufacturing / Composite manufacturing'], '', 'DOSF-08'),
    'Sparrotronics Private Limited': ('Electronics/UAV listing; nothing verifiable.', ['Electronics'], '', ''),
    'Tactix Ai': ('Defence AI/autonomy positioning; no product evidence.', ['Software / Autonomy'], '', 'DOSF-10'),
    'Thrust Link Aerospace & Drone Technologies': ('Propulsion/UAV listing; could matter for DOSF-03 but unverified.', ['Propulsion'], 'VERIFY: motor/ESC manufacturing', 'DOSF-03'),
    'Tobitek Private Limited': ('Screened as Indian BLDC motors — potentially important for propulsion localisation, but no public footprint found (web search 2026-09-30). Not promoted.', ['Propulsion / BLDC motor'], 'PRIORITY VERIFY: motor manufacturing, magnet source', 'DOSF-03'),
    'UAVGarage Private Limited': ('Components/payloads distributor — MARKET / COMPONENT INTELLIGENCE NODE.', ['Distribution / Components', 'Payload'], 'CAPTURE LINE CARD', 'DOSF-09'),
    'XINGTO BATTERY': ('Battery brand, likely foreign (origin unverified); relevant as import-dependency evidence for DOSF-04 rather than as an Indian entity.', ['Energy / Cell', 'Energy / Battery pack'], 'VERIFY: country of origin', 'DOSF-04'),
    'Yali Aerospace Private Limited': ('UAV / autonomous networks listing; unverified.', ['Platform', 'Communications'], '', 'DOSF-10'),
    'ZSpace Robotics Private Limited': ('Robotics/autonomous systems; air-ground convergence candidate (DOSF-10), unverified.', ['Software / Autonomy'], '', 'DOSF-10'),
}

# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------
def load_records():
    d = json.load(open(os.path.join(SRC, 'Techadyant_Drone_Expo_2026_Atlas_Enriched_v2.json'), encoding='utf-8'))
    return [r for r in d['records'] if r['atlas_status'] in ('A', 'B')], d['records']


def src_entry(sid_key, n):
    s = SOURCES[sid_key]
    return {'id': f'src-{n:02d}', 'title': s['title'], 'publisher': s['publisher'], 'url': s['url'],
            'published_date': s['published_date'], 'trust_tier': TRUST[s['level']],
            'accessed': OSINT_DATE if s['level'] == 3 else TODAY,
            'note': f"Evidence level {s['level']}. " + s['note']}


def lvl_label(n):
    return {1: 'L1 — Government / procurement', 2: 'L2 — Independent media / institution', 3: 'L3 — Company primary source',
            4: 'L4 — Secondary / social', 5: 'L5 — Unverified'}[n]


def rels_for(key):
    out = []
    for (t, s, tg, desc, lvl, srcs) in RELS:
        if s == key or tg == key:
            out.append((t, s, tg, desc, lvl, srcs))
    return out


def build_dossier(a):
    keys = a['sources']
    ids = {k: f'src-{i+1:02d}' for i, k in enumerate(keys)}
    srcs = [src_entry(k, i + 1) for i, k in enumerate(keys)]
    ref = lambda ks: [ids[k] for k in ks if k in ids]
    cls = a['cls']
    path = f"{DOSSIER_BASE}{a['slug']}/"
    glance = {
        'Type': 'Foreign supplier' if a['type_code'] == 'foreign_supplier' else ('Distributor — market / component intelligence node' if a.get('node_role') else 'Private company'),
        'Headquarters': a['hq'],
        'Primary layer': a['layer'],
        'Technology layers': '; '.join(a['layers']),
        'Products (as stated)': a['products'],
        'Company origin': f"{cls['company_origin'][0]} — {cls['company_origin'][2]} (L{cls['company_origin'][1]})",
        'Design origin': f"{cls['design_origin'][0]} — {cls['design_origin'][2]} (L{cls['design_origin'][1]})",
        'Manufacturing': f"{cls['manufacturing'][0]} — {cls['manufacturing'][2]} (L{cls['manufacturing'][1]})",
        'Assembly / integration': f"{cls['assembly_integration'][0]} — {cls['assembly_integration'][2]} (L{cls['assembly_integration'][1]})",
        'Technology origin': f"{a['tech_origin'][0]} — {a['tech_origin'][1]}",
        'Defence relevance': a['defence'],
        'Overall evidence level': lvl_label(a['evidence']),
        'Atlas intake': f'{EVENT} (New Delhi, 28–30 Sep 2026) — OSINT intake {OSINT_DATE}',
    }
    edges = rels_for(a['key'])
    rel_lines = []
    for (t, s, tg, desc, lvl, rs) in edges:
        other = E(tg if s == a['key'] else s)[1]
        arrow = f"{REL_LABEL[t]} → {other}" if s == a['key'] else f"{other} → {REL_LABEL[t].lower()} {a['name']}"
        rel_lines.append(f"{arrow} (L{lvl})")
    prose = (
        f"{a['description']}\n\n"
        f"Value-chain position in the Atlas: " + '; '.join(rel_lines) + ".\n\n"
        "Evidence discipline: this record separates company claims from independent evidence. "
        f"Classifications above carry their evidence level; the technology-origin class is '{a['tech_origin'][0]}'. "
        "Exhibiting at Drone Expo 2026 establishes market presence only — not indigenous technology, Indian manufacturing, procurement or deployment."
    )
    dossier = {
        'entity_id': f"mfg-dx26-{a['slug']}",
        'entity_type': 'company',
        'tier': 'A',
        'noindex': False,
        'slug': a['slug'],
        'name': a['name'],
        'vertical': 'drones-uas',
        'parent_hub_path': '/research/drones-uas/',
        'last_verified': TODAY,
        'status': a['status'],
        'header': {
            'one_liner': ONE_LINER[a['key']],
            'chips': ['drones-uas', a['layer'].lower().replace(' / ', '-').replace(' ', '-'), 'foreign' if a['country'] != 'IN' else 'india', f"evidence-l{a['evidence']}", 'drone-expo-2026'],
            'maker': a['name'],
            'country': a['country'],
            'indigenous_pct': None,
            'indigenous_label': 'Not asserted',
            'mobility_or_class': a['layer'],
            'operational_domains': ['air'],
        },
        'at_a_glance': glance,
        'what_it_is': {'prose': prose, 'sources': ref(keys)},
        'deployments_procurement': {
            'summary': a['defence'],
            'rows': [dict(agency=r['agency'], context=r['context'], year=r['year'], quantity_or_note=r['quantity_or_note'], sources=ref(r['sources'])) for r in a.get('deployments', [])],
            'open_questions': [q for q in a['open_q'] if any(w in q.lower() for w in ('contract', 'order', 'customer', 'trial', 'adoption', 'oem', 'programme'))],
        },
        'import_dependencies': {
            'summary': 'No import share is asserted. The items below are the dependency questions this entity sits on, taken from the Atlas UAS sovereignty table (Techadyant internal estimate) — they describe the layer, not this company\'s disclosed bill of materials.',
            'items': [dict(component=c, severity=sev, note=n, pillar_link='/research/drones-uas/', sources=ref(['atlas_uas'])) for (c, sev, n) in DEP_ITEMS.get(a['key'], [])],
        },
        'intelligence_assessment': {
            'methodology_path': '/research/methodology/',
            'dimensions': [
                dict(id='evidence_quality', label='Evidence quality', value={1: 5, 2: 4, 3: 2, 4: 1, 5: 1}[a['evidence']],
                     note=f"{lvl_label(a['evidence'])}. Scores rise only with independent or procurement evidence.", sources=ref(keys)),
                dict(id='stack_criticality', label='Stack criticality of the layer', value=STACK_CRIT.get(a['key'], 3),
                     note='How strategically important the layer this entity sits in is (not how good the company is).', sources=ref(['atlas_uas']) or ref(keys)),
                dict(id='localisation_evidence', label='Localisation evidence', value=LOCAL_EV.get(a['key'], 1),
                     note='Strength of evidence that design/manufacture happens in India. Company claims alone score ≤2.', sources=ref(keys)),
            ],
        },
        'graph': {'maker_other_systems': [], 'peer_systems': [f"{DOSSIER_BASE}{p}/" for p in PEERS.get(a['key'], [])], 'related_components': [], 'related_pillars': ['/research/drones-uas/', '/research/counter-uas/'] if a['key'] in ('rangsons',) else ['/research/drones-uas/'], 'referenced_by': []},
        'timeline': [dict(date=d, event=e, sources=ref(s)) for (d, e, s) in a.get('timeline', [(ev_date(), f'Exhibits at {EVENT}, New Delhi.', ['expo'])])],
        'faq': [
            dict(question=f"What does {a['name']} make?", answer=f"{a['products']}. (As stated by the company unless noted; evidence level {a['evidence']}.)", sources=ref(keys[:1])),
            dict(question=f"Is {a['name']}'s technology indigenous?", answer=f"Not established. Company origin is {cls['company_origin'][0]}; the technology-origin class is '{a['tech_origin'][0]}': {a['tech_origin'][1]}", sources=ref(keys)),
            dict(question=f"Why is {a['name']} in the Atlas?", answer=f"It adds new information on the {a['layer']} layer of India's drone stack, surfaced at {EVENT}. Presence at the expo alone would not qualify an entity.", sources=ref(['expo']) or ref(keys)),
        ],
        'open_questions': a['open_q'],
        'sources': srcs,
        'seo': {
            'title': f"{a['name']} — {a['layer']} · India UAS Atlas | Techadyant",
            'meta_description': (a['description'][:150].rsplit(' ', 1)[0] + '…') if len(a['description']) > 155 else a['description'],
            'canonical_path': path,
            'og_type': 'article',
            'json_ld_types': ['Organization', 'FAQPage', 'BreadcrumbList'],
        },
        'cta': {'track_ecosystem': '/research/drones-uas/', 'submit_correction': 'mailto:labs@techadyant.com',
                'related_research': ['/research/drones-uas/', '/reports/who-builds-indias-drones/']},
    }
    return dossier


ONE_LINER = {
    'arkin': 'Chennai UAV avionics maker — AeroMind flight controllers, Navroc GNSS, power modules. Claims Indian design and manufacture; chip-level sourcing undisclosed.',
    'yari': 'Coimbatore drone avionics firm — V6X flight controller (claimed designed and built in India), GNSS and power modules, ESCs, flight-data platform.',
    'ascend': 'Hyderabad drone battery-pack maker — Li-ion, Li-HV and semi-solid-state packs with in-house BMS. Cell origin undisclosed.',
    'millennium': 'Indian component distributor with a drone portfolio of foreign-brand processors, sensors, GNSS, MOSFETs and BMS — a component-intelligence node, not an OEM.',
    'nicomatic': 'Bengaluru subsidiary of France\'s Nicomatic — MIL-standard connectors and cable assemblies; states Indian manufacturing since 2022.',
    'te': 'Global interconnect multinational with a dedicated UAV connector portfolio; benchmark foreign supplier. Indian manufacturing of the UAV line not established.',
    'rangsons': 'Indian defence electronics house — EW suites, RWR, jamming; reported SATCOM-on-the-move and secure datalinks. UAV-specific products not yet evidenced.',
    'drogo': 'Hyderabad defence UAV maker. Reported first batch of 41 JK 250e drones to the Army (Jun 2026, ₹72 cr); loitering-munition MoU with Munitions India.',
    'vu': 'IIT Kanpur-incubated defence UAV developer — long-endurance platforms, launchers, simulators; PATH Group partnership (reported as takeover).',
    'zerosum': 'Indian UAV subsystem integrator — propulsion, autopilots, GNSS-denied navigation, RF, recovery. Partner vs in-house technology unmapped.',
    'warg': 'Bengaluru firm building an encrypted low-latency digital UAV link, autonomous supervision and FPV air/ground platforms. Proprietary tech claimed.',
}


def ev_date():
    return '2026-09-28'


DEP_ITEMS = {
    'arkin': [('Drone microcontrollers / SoC', 'Critical', 'Atlas sovereignty table: MCU/SoC is among the highest-risk UAS layers.'), ('MEMS IMU', 'High', 'IMU sensors largely imported across Indian UAS.'), ('GNSS receiver chipset', 'High', 'GNSS modules are commonly built on foreign chipsets.')],
    'yari': [('Drone microcontrollers / SoC', 'Critical', 'Flight-controller compute layer.'), ('Power MOSFETs / gate drivers (ESC)', 'High', 'ESC power electronics largely imported.'), ('GNSS receiver chipset', 'High', 'GNSS module chipsets.')],
    'ascend': [('Li-ion / Li-HV cells', 'Critical', 'Cells are the imported core of domestically assembled packs in the Atlas.'), ('BMS silicon (AFE/MCU)', 'High', 'BMS ICs typically foreign-sourced.')],
    'millennium': [('MCU / processors', 'Critical', 'Distributed from foreign brands.'), ('Power semiconductors (MOSFETs)', 'High', 'Distributed from foreign brands.'), ('CMOS image sensors', 'High', 'Distributed from foreign brands.')],
    'nicomatic': [('Connector raw materials / contacts', 'Medium', 'Share of contacts and plating made locally is unknown.')],
    'te': [('UAV interconnect (imported portfolio)', 'Medium', 'Benchmark foreign supplier for defence-grade UAV connectors.')],
    'rangsons': [('RF front-end / GaN', 'High', 'RF power and front-end devices import-sensitive across Indian EW.'), ('FPGAs', 'High', 'EW/SDR processing relies on imported FPGAs.')],
    'drogo': [('BLDC motors / magnets', 'High', 'Propulsion content undisclosed; layer is China-concentrated.'), ('Cells', 'Critical', 'Battery content undisclosed.'), ('Flight controller / datalink', 'High', 'Avionics and link content undisclosed.')],
    'vu': [('Propulsion', 'High', 'Propulsion sourcing undisclosed.'), ('Avionics / datalink', 'High', 'Avionics and link sourcing undisclosed.')],
    'zerosum': [('Partner technology', 'Unknown', 'Technology-partnership model — which subsystems are foreign is unmapped.'), ('GNSS-denied navigation sensors', 'High', 'Camera/IMU sensors for alternative navigation typically imported.')],
    'warg': [('RF chipset / SDR hardware', 'High', 'Radio silicon under the digital link undisclosed.')],
}
STACK_CRIT = {'arkin': 5, 'yari': 5, 'ascend': 5, 'millennium': 4, 'nicomatic': 3, 'te': 3, 'rangsons': 5, 'drogo': 4, 'vu': 4, 'zerosum': 4, 'warg': 4}
LOCAL_EV = {'arkin': 2, 'yari': 2, 'ascend': 2, 'millennium': 1, 'nicomatic': 2, 'te': 1, 'rangsons': 2, 'drogo': 3, 'vu': 3, 'zerosum': 1, 'warg': 2}
PEERS = {'arkin': ['yari-robotics', 'zerosum-technologies'], 'yari': ['arkin-labs', 'zerosum-technologies'], 'zerosum': ['arkin-labs', 'yari-robotics'],
         'nicomatic': ['te-connectivity'], 'te': ['nicomatic-india'], 'rangsons': ['warg-robotics'], 'warg': ['rangsons-aerospace'],
         'drogo': ['vu-dynamics'], 'vu': ['drogo-aerospace'], 'millennium': [], 'ascend': []}

# --------------------------------------------------------------------------
# Dependency matrix  (subsystem, technology, indian, foreign, dependency, localisation, level, opp, sources, sovereignty_ref)
# Sovereignty refs are the Atlas UAS sovereignty table in app/research/_drones.json.
# --------------------------------------------------------------------------
def sov_lookup():
    d = json.load(open(os.path.join(ROOT, 'app', 'research', '_drones.json'), encoding='utf-8'))
    return {s['component']: s for s in d['sovereignty']}


DEP = [
    ('Propulsion', 'Motor (BLDC)', ['YARI Robotics (ESC only, not motors)', 'Tobitek (unverified — RESEARCH_ONLY)', 'Thrust Link (unverified)', 'Zerosum Technologies (propulsion line, origin unmapped)'], ['T-Motor (CN, existing)', 'SunnySky (CN, existing)'], 'High', 'No Indian drone-grade BLDC maker evidenced at the expo; T-MOTOR exhibited directly.', 5, 'DOSF-03', ['tmotor_web', 'expo', 'atlas_uas'], 'Brushless motors'),
    ('Propulsion', 'ESC', ['YARI Robotics (L3 claim)'], ['T-Motor (CN)', 'Hobbywing (CN, existing)'], 'High', 'One Indian ESC product line claimed; semiconductor content undisclosed.', 3, 'DOSF-03', ['yari_web', 'atlas_uas'], 'Electronic speed controllers'),
    ('Propulsion', 'Magnets (NdFeB)', [], ['China-concentrated supply (existing Atlas)'], 'Critical', 'Nothing at the expo addressed magnets; existing SID opportunity surface "Sintered NdFeB magnet manufacturing" applies.', 5, 'DOSF-03', ['atlas_uas'], 'Rare-earth magnets (NdFeB)'),
    ('Propulsion', 'Bearings', [], [], 'Unknown', 'Not observed; not scored in Atlas.', 5, 'DOSF-03', ['expo'], None),
    ('Propulsion', 'Power semiconductors', ['Millennium Semiconductors (distributor of foreign MOSFETs)'], ['Foreign MOSFET/gate-driver brands via distributors'], 'High', 'Visible only through distribution — no Indian power-semiconductor supply to UAS observed.', 3, 'DOSF-02', ['millennium_web', 'atlas_uas'], 'Power electronics (GaN/SiC)'),
    ('Propulsion', 'Propellers', [], [], 'Medium', 'Not evidenced at expo; existing SID opportunity surface "UAV propeller manufacturing" applies.', 5, 'DOSF-03', ['atlas_uas'], 'Propellers'),
    ('Energy', 'Cells', ['Nsure (unverified)', 'Godi Nova (unverified)', 'Enovix R&D India (unverified)'], ['XINGTO (origin unverified)', 'Grepow (CN, existing)'], 'Critical', 'Several cell-adjacent exhibitors, none with verified drone-cell manufacturing. The cell remains the unresolved layer.', 5, 'DOSF-04', ['expo', 'atlas_uas'], 'Battery cells (Li-ion/Li-Po)'),
    ('Energy', 'Pack', ['Ascend Powerpacks (L3)', 'ATC Energies (unverified)', 'FC TecNrgy (unverified)'], ['Grepow/Tattu (CN, existing)'], 'Medium', 'Indian pack integration is visible and claimed; cell origin undisclosed.', 3, 'DOSF-04', ['ascend_web', 'atlas_uas'], 'Battery pack assembly'),
    ('Energy', 'BMS', ['Ascend Powerpacks (L3)'], ['Foreign BMS silicon via distributors'], 'High', 'BMS design claimed in India; BMS ICs distributed from foreign brands.', 3, 'DOSF-04', ['ascend_web', 'millennium_web'], 'Battery management system (BMS)'),
    ('Energy', 'Charging', ['Ascend Powerpacks (smart charging, L3)'], [], 'Unknown', 'Single claimed Indian product line; not scored in Atlas.', 3, 'DOSF-04', ['ascend_web'], None),
    ('Avionics', 'MCU', ['Millennium Semiconductors (distributor)'], ['STMicroelectronics (CH, existing)', 'foreign MCU brands via distributors'], 'Critical', 'Indian flight controllers (Arkin, YARI, Zerosum) sit on MCUs of undisclosed, presumably foreign origin — the expo made the dependency visible but did not resolve it.', 3, 'DOSF-02', ['millennium_web', 'atlas_uas'], 'Microcontroller / SoC'),
    ('Avionics', 'IMU', [], ['Foreign MEMS vendors (existing Atlas)'], 'High', 'No Indian drone-grade IMU seen; existing SID opportunity surface "MEMS IMU manufacturing for UAV guidance" applies.', 5, 'DOSF-01', ['atlas_uas'], 'Inertial measurement unit (MEMS)'),
    ('Avionics', 'GNSS', ['Arkin Labs — Navroc (L3)', 'YARI Robotics (L3)', 'Zerosum — GNSS-denied nav (L3)'], ['Foreign GNSS chipsets via distributors (Millennium)'], 'High', 'Indian GNSS modules claimed; chipset (and NavIC support) undisclosed.', 3, 'DOSF-01', ['arkin_web', 'yari_web', 'zerosum_web', 'millennium_web'], 'GNSS receiver module'),
    ('Avionics', 'Magnetometer', [], [], 'Unknown', 'Not observed; not scored in Atlas.', 5, 'DOSF-01', ['expo'], None),
    ('Avionics', 'Barometer', [], [], 'Unknown', 'Not observed; not scored in Atlas.', 5, 'DOSF-01', ['expo'], None),
    ('Avionics', 'Power management', ['Arkin Labs (power systems, L3)', 'YARI Robotics (power modules, L3)'], ['Foreign PMICs via distributors'], 'High', 'Indian power modules claimed; PMIC silicon undisclosed.', 3, 'DOSF-02', ['arkin_web', 'yari_web', 'millennium_web'], 'Power-management ICs'),
    ('Communications', 'RF', ['Rangsons Aerospace (L3/L4)', 'Zerosum Technologies (L3)', 'Maksat (unverified)'], ['Foreign RF front-end vendors (existing Atlas)'], 'High', 'Indian RF system capability claimed; RF device layer remains import-sensitive.', 3, 'DOSF-05', ['rangsons_web', 'zerosum_web', 'atlas_uas'], 'RF front-end IC'),
    ('Communications', 'Datalink', ['WARG Robotics (encrypted digital link, L3)', 'Rangsons Aerospace (secure datalink, L4)'], [], 'High', 'New: Indian encrypted digital datalinks now marketed for UAVs; radio silicon undisclosed.', 3, 'DOSF-05', ['warg_web', 'rangsons_idrw', 'atlas_uas'], 'Radio datalink module'),
    ('Communications', 'SDR', ['Rangsons Aerospace (L4)'], [], 'High', 'Reported only.', 4, 'DOSF-05', ['rangsons_idrw'], 'Anti-jam / secure comms'),
    ('Communications', 'SATCOM', ['Rangsons Aerospace (SATCOM-on-the-move, reported)'], [], 'High', 'Reported operational with IAF in secondary sources only; existing SID opportunity surface "Indigenous SATCOM datalink module" applies.', 4, 'DOSF-05', ['rangsons_idrw', 'atlas_uas'], 'Satcom terminal'),
    ('Communications', 'Antennas', [], [], 'Medium', 'Not observed at expo.', 5, 'DOSF-05', ['atlas_uas'], 'Antennas'),
    ('Communications', 'Encryption / security', ['WARG Robotics (encrypted link, L3)'], [], 'Unknown', 'Claimed encryption; implementation and certification unknown. Not scored in Atlas.', 3, 'DOSF-05', ['warg_web'], None),
    ('Communications', 'Connectors / interconnect', ['Nicomatic India (Indian manufacturing of a foreign group, L3)'], ['TE Connectivity (L3)'], 'Medium', 'Foreign-technology + Indian-manufacturing model visible; UAV-specific volumes unknown.', 3, 'DOSF-02', ['nicomatic_web', 'te_web', 'atlas_uas'], 'Connectors & passives'),
    ('Payload', 'EO', [], ['Existing Atlas: foreign EO detectors'], 'High', 'Expo intake added no EO payload maker with evidence.', 5, '', ['atlas_uas'], 'EO camera (detector)'),
    ('Payload', 'IR / Thermal', [], ['Existing Atlas: foreign IR detectors'], 'Critical', 'Expo intake added no thermal payload evidence; existing Atlas nodes (Tonbo, EON Space Labs) unchanged.', 5, '', ['atlas_uas'], 'Thermal / IR detector'),
    ('Payload', 'LiDAR', [], [], 'Medium', 'Not evidenced.', 5, '', ['atlas_uas'], 'LiDAR'),
    ('Payload', 'Hyperspectral', ['BharatRohan (RESEARCH_ONLY, unverified)'], [], 'Medium', 'Candidate only.', 5, '', ['expo', 'atlas_uas'], 'Multispectral / hyperspectral'),
    ('Payload', 'Gimbals', ['UAVGarage (distributor, unverified)'], [], 'Medium', 'Not evidenced.', 5, '', ['atlas_uas'], 'Gimbal / stabilisation'),
    ('Manufacturing', 'CNC', ['Phillips Machine Tools India (unverified; likely foreign brands)'], [], 'Medium', 'Enabling-infrastructure presence only.', 5, 'DOSF-08', ['expo', 'atlas_uas'], 'Precision-machined parts'),
    ('Manufacturing', 'Composites', ['JSM Composites', 'Nitpro Composites', 'SKYi Composites (all unverified)'], ['Foreign prepreg/carbon fibre (existing Atlas)'], 'High', 'Three composite fabricators exhibited; fibre/prepreg remains imported per existing Atlas.', 5, 'DOSF-08', ['expo', 'atlas_uas'], 'Carbon fibre (finished)'),
    ('Manufacturing', 'Additive manufacturing', ['Phillips Machine Tools India (unverified)'], [], 'Medium', 'Presence only.', 5, 'DOSF-08', ['expo', 'atlas_uas'], 'Additive-manufactured parts'),
    ('Manufacturing', 'Electronics assembly', ['Nicomatic India (cable assemblies, L3)'], [], 'High', 'No EMS/PCB fabricator evidenced; multilayer PCB remains a known gap.', 3, 'DOSF-08', ['nicomatic_web', 'atlas_uas'], 'Multilayer / HDI PCB'),
    ('Manufacturing', 'Battery manufacturing', ['Ascend Powerpacks (pack, L3)'], [], 'Critical', 'Pack assembly only; no cell manufacturing evidenced.', 3, 'DOSF-04', ['ascend_web', 'atlas_uas'], 'Battery pack assembly'),
]

# --------------------------------------------------------------------------
# Opportunity surfaces (validated/refined from Phase 5B)
# --------------------------------------------------------------------------
OPP = [
    dict(id='DOSF-01', theme='Drone Brain / Avionics', status='Partially validated', priority='High', sid=['mems_imu'],
         entities=['Arkin Labs (ADD_NEW)', 'YARI Robotics (ADD_NEW)', 'Zerosum Technologies (ADD_NEW)'],
         exists='At least three Indian companies market full flight-controller + GNSS + power-module stacks (Arkin AeroMind/Navroc, YARI V6X, Zerosum autopilots), plus GNSS-denied navigation (Zerosum).',
         imported='MCU/SoC, MEMS IMU and GNSS chipsets — not disclosed by any of them; the existing Atlas scores these as high-risk import layers.',
         assembled='Unknown — design + board assembly claimed; no facility or EMS partner evidenced.',
         weak='Silicon (MCU, IMU, GNSS RF front-end); no NavIC support claims were verified.',
         scaling='Not evidenced — no production volumes or named OEM adopters.',
         evidence='L3 company sources only.',
         unknown='Semiconductor BOM, OEM adoption, DGCA-certified platforms using these controllers.'),
    dict(id='DOSF-02', theme='Drone Electronics', status='Validated (as a dependency, not a capability)', priority='High', sid=['pcb_gap'],
         entities=['Millennium Semiconductors (ADD_NEW, distributor)', 'Nicomatic India (ADD_NEW)', 'TE Connectivity (ADD_NEW)', 'Macnica Cytech (RESEARCH_ONLY)'],
         exists='Distribution and design-support for drone electronics; one foreign-owned interconnect maker with stated Bengaluru manufacturing.',
         imported='Processors/MCUs, CMOS sensors, GNSS/cellular modules, MOSFETs, Hall sensors, BMS ICs — offered from globally sourced brands.',
         assembled='Cable assemblies (Nicomatic India, L3).', weak='Every active-semiconductor layer.',
         scaling='Distributor drone portfolios exist, which implies demand, but volume is not evidenced.',
         evidence='L3 company portfolios + existing Atlas sovereignty table.',
         unknown='Named line cards; which brands dominate Indian drone BOMs.'),
    dict(id='DOSF-03', theme='Propulsion', status='Not validated (Indian side)', priority='High', sid=['magnets', 'propellers'],
         entities=['T-MOTOR (UPDATE_EXISTING)', 'YARI Robotics (ESC)', 'Zerosum Technologies', 'Tobitek (RESEARCH_ONLY, unverified)', 'Thrust Link (RESEARCH_ONLY)'],
         exists='An Indian ESC line (YARI, claim). No verified Indian drone-grade BLDC motor maker in the intake.',
         imported='Motors and ESCs (T-MOTOR exhibited directly), NdFeB magnets, ESC power silicon.',
         assembled='Unknown.', weak='Magnets, bearings and power semiconductors; motor manufacturing not evidenced.',
         scaling='Global supplier presence is scaling (T-MOTOR direct).', evidence='L3 + existing Atlas.',
         unknown='Whether Tobitek/Thrust Link manufacture motors, and their magnet source.'),
    dict(id='DOSF-04', theme='Energy Storage', status='Validated as a question: pack ≠ cell', priority='High', sid=[],
         entities=['Ascend Powerpacks (ADD_NEW)', 'Nsure, Godi Nova, Enovix R&D India, ATC Energies, FC TecNrgy, XINGTO (RESEARCH_ONLY)'],
         exists='Indian pack + BMS integration (Ascend, L3), including semi-solid-state packs.',
         imported='Cells (origin undisclosed by every pack exhibitor); BMS silicon.',
         assembled='Packs — assembled/integrated in India on the evidence available.',
         weak='Drone-grade high-C-rate/high-energy cells.', scaling='Not evidenced.',
         evidence='L3 + existing Atlas relationship "cells are the imported core of domestically assembled packs".',
         unknown='Whether any exhibitor manufactures drone cells in India.'),
    dict(id='DOSF-05', theme='UAV Communications', status='Partially validated', priority='High', sid=['satcom_datalink', 'ew_suites'],
         entities=['Rangsons Aerospace (ADD_NEW)', 'WARG Robotics (ADD_NEW)', 'Zerosum Technologies (ADD_NEW)', 'Maksat (RESEARCH_ONLY)'],
         exists='Encrypted digital UAV links (WARG, L3); EW/SATCOM/secure-datalink systems from a defence electronics house (Rangsons, L3/L4).',
         imported='RF front-ends, FPGAs, GaN devices (existing Atlas).', assembled='Unknown.',
         weak='Radio silicon; certification of encryption.', scaling='Not evidenced for UAV-specific links.',
         evidence='L3/L4.', unknown='UAV-specific product packaging and customers for Rangsons; RF hardware under WARG\'s link.'),
    dict(id='DOSF-06', theme='C-UAS', status='Not validated (no new evidence) — integrate into existing C-UAS Atlas', priority='Medium', sid=['cuas_opp'],
         entities=['Vajron (SIGNAL_ONLY)', 'Stellar Invictus (SIGNAL_ONLY)', 'Rangsons Aerospace (EW capability, no C-UAS system evidenced)'],
         exists='Positioning only; the existing C-UAS register (60 systems / 43 makers) is unchanged.',
         imported='n/a from this intake.', assembled='n/a.', weak='Evidence — no product, trial or customer for either C-UAS exhibitor.',
         scaling='Not evidenced.', evidence='L5 (expo listing).',
         unknown='Whether Vajron/Stellar Invictus have fielded or trialled systems.'),
    dict(id='DOSF-07', theme='Defence UAV Scale-up', status='Validated', priority='High', sid=['loiter_opp'],
         entities=['Drogo Aerospace (ADD_NEW, L2)', 'VU Dynamics (ADD_NEW, L2)', 'Vayuron (SIGNAL_ONLY)', 'SANH Systems (RESEARCH_ONLY)'],
         exists='A private UAV maker delivering to the Army (Drogo: 41 JK 250e first batch, ₹72 crore, June 2026, L2) and moving into loitering munitions with a DPSU (MIL MoU, Sep 2026); an IIT-incubated developer with an industrial backer and a planned factory (VU Dynamics / PATH).',
         imported='Subsystem content undisclosed for all.', assembled='Drogo integration in India implied by delivery; content unknown.',
         weak='Bill-of-materials transparency; no MoD primary contract document located.',
         scaling='Yes — prototype-to-production transition evidenced for Drogo; capital/industrial backing for VU Dynamics.',
         evidence='L2 independent media + institutional source.', unknown='Completion of Drogo order; VU Dynamics ownership and factory status.'),
    dict(id='DOSF-08', theme='Manufacturing Infrastructure', status='Not validated (presence only)', priority='Medium', sid=['composites', 'pcb_gap'],
         entities=['Phillips Machine Tools, JSM, Nitpro, SKYi Composites, Mehta Hitech, SIECHEM (RESEARCH_ONLY)', 'Nicomatic India (ADD_NEW)'],
         exists='Composite fabricators and machine-tool suppliers now target drone makers.', imported='Carbon fibre/prepreg; likely machine-tool brands.',
         assembled='n/a.', weak='Materials (PAN precursor, prepreg); multilayer PCB.', scaling='Not evidenced.',
         evidence='L5 for new entrants; existing Atlas for materials.', unknown='Capacities, customers, brands represented.'),
    dict(id='DOSF-09', theme='Component Distribution Intelligence', status='Validated as a method', priority='High', sid=[],
         entities=['Millennium Semiconductors (ADD_NEW)', 'Bharat Skytech, Robu.in, UAVGarage, Macnica Cytech (RESEARCH_ONLY — intelligence nodes)'],
         exists='Distributors publish drone-specific portfolios — a cheap, repeatable OSINT window onto the imported BOM.',
         imported='By definition: the portfolios are foreign component brands.', assembled='n/a.',
         weak='Distributors do not establish Indian manufacturing.', scaling='More distributors exhibit drone-specific lines.',
         evidence='L3.', unknown='Line cards were not captured in this pass (egress blocked); capture is the next action.'),
    dict(id='DOSF-10', theme='Autonomous Air-Ground Systems', status='Partially validated', priority='Medium', sid=['swarm_ai'],
         entities=['WARG Robotics (ADD_NEW)', 'ZSpace Robotics, Tactix Ai, Yali Aerospace, SANH Systems (RESEARCH_ONLY)'],
         exists='One Indian company with an air + ground FPV architecture and autonomous supervision over its own encrypted link (WARG, L3).',
         imported='Radio silicon, compute.', assembled='Unknown.', weak='Evidence of fielding.', scaling='Not evidenced.',
         evidence='L3.', unknown='Customers/trials.'),
]

# --------------------------------------------------------------------------
# Signals (5 drafted, 3 held)
# --------------------------------------------------------------------------
SIGNALS = [
    dict(signal_id='DX26-S01', proposed_no='S-128', slug='indian-defence-uav-makers-cross-from-prototype-to-delivery', publication_status='ready_for_editorial_review',
         title='India\'s Defence UAV Start-ups Are Crossing From Prototype to Delivery',
         thesis='Private Indian UAV makers are now visible at the delivery and DPSU-partnership stage, not only the demonstration stage — but the evidence stops at the platform and says nothing about what is inside it.',
         evidence=['Drogo Aerospace: first batch of 41 JK 250e drones reported delivered to Army Southern Command (Nashik) in June 2026 under a ₹72 crore contract (L2, multiple outlets; no MoD primary).',
                   'Drogo Aerospace – Munitions India Ltd MoU (4 Sep 2026) for indigenous UAVs and loitering munitions (L2). An MoU is not an order.',
                   'VU Dynamics (IIT Kanpur SIIC) partnership with PATH Group; BusinessLine reports a takeover and an Indore factory (L2).'],
         entities=['Drogo Aerospace', 'VU Dynamics', 'Munitions India Limited', 'Indian Army'],
         technology_layers=['Platform / Tactical UAV', 'Platform / Loitering munition'],
         implications=['Delivery evidence shifts the question from "can they build it" to "what is in the bill of materials".', 'DPSU partnerships give private designers a production and qualification route for loitering munitions.'],
         uncertainties=['No MoD primary contract document located for the JK 250e order.', 'VU Dynamics ownership (takeover vs collaboration) unresolved.', 'Subsystem origin for every platform undisclosed.'],
         sources=['drogo_delivery', 'drogo_delivery_2', 'drogo_mou', 'vu_iitk', 'vu_takeover'], domain='Defence & Dual-Use'),
    dict(signal_id='DX26-S02', proposed_no='S-129', slug='hidden-semiconductor-dependency-of-indian-uavs', publication_status='ready_for_editorial_review',
         title='The Hidden Semiconductor Dependency of Indian UAVs',
         thesis='Indian drone avionics are increasingly designed in India, but the silicon inside them arrives through distributors\' drone portfolios — which makes distributors the clearest window onto the dependency.',
         evidence=['Millennium Semiconductors publishes a drone component portfolio spanning processors, CMOS sensors, GNSS/cellular, motor control, MOSFETs, Hall sensors, BMS and power — from globally sourced brands (L3).',
                   'Indian flight-controller vendors (Arkin Labs, YARI Robotics, Zerosum) claim Indian design but disclose no semiconductor BOM (L3).',
                   'Techadyant UAS sovereignty table already scores MCU/SoC, IMU, PMIC and power electronics among the highest-risk layers (internal, indicative).'],
         entities=['Millennium Semiconductors India', 'Arkin Labs', 'YARI Robotics', 'Zerosum Technologies', 'Macnica Cytech India'],
         technology_layers=['Avionics / MCU', 'Avionics / IMU', 'Avionics / GNSS', 'Propulsion / Power semiconductors', 'Energy / BMS'],
         implications=['"Designed in India" at board level and "dependent on imports" at chip level are both true at once.', 'Distributor line cards are a repeatable, low-cost dependency-tracking method.'],
         uncertainties=['Specific brands in the portfolio were not re-verified in this pass.', 'No Indian FC vendor BOM is public.'],
         sources=['millennium_web', 'arkin_web', 'yari_web', 'zerosum_web', 'atlas_uas'], domain='Critical Manufacturing Dependencies'),
    dict(signal_id='DX26-S03', proposed_no='S-130', slug='drone-battery-question-is-a-cell-question', publication_status='ready_for_editorial_review',
         title='India\'s Drone Battery Question Is Really a Cell Question',
         thesis='Drone Expo 2026 showed Indian pack and BMS integration — including semi-solid-state packs — but not one verified Indian drone-cell source. Pack localisation is being mistaken for battery localisation.',
         evidence=['Ascend Powerpacks claims in-house design and manufacture of drone packs, BMS and chargers; cell origin undisclosed (L3).',
                   'Six further energy exhibitors (Nsure, Godi Nova, Enovix R&D India, ATC Energies, FC TecNrgy, XINGTO) — none with verified drone-cell manufacturing (L5).',
                   'Existing Atlas: "cells are the imported core of domestically assembled packs".'],
         entities=['Ascend Powerpacks', 'Grepow (existing)', 'High-energy Li-ion cells (existing node)'],
         technology_layers=['Energy / Cell', 'Energy / Battery pack', 'Energy / BMS'],
         implications=['Endurance and payload — the performance levers defence buyers care about — are set by a cell India does not yet evidently make for drones.', 'Pack makers are the natural first customers for any Indian drone-grade cell line.'],
         uncertainties=['Cell-manufacturing status of the unverified energy exhibitors.'],
         sources=['ascend_web', 'expo', 'atlas_uas'], domain='Critical Manufacturing Dependencies'),
    dict(signal_id='DX26-S04', proposed_no='', slug='indias-drone-brain-is-emerging', publication_status='monitoring_hold',
         title='India\'s Drone Brain Is Emerging',
         thesis='Several Indian vendors now market complete flight-control stacks (FC + GNSS + power + ground/data software), contesting a layer the Atlas records as ~90% Chinese-sourced for small drones.',
         evidence=['Arkin Labs (AeroMind, Navroc), YARI Robotics (V6X), Zerosum (autopilots, GNSS-denied navigation) — all L3.'],
         entities=['Arkin Labs', 'YARI Robotics', 'Zerosum Technologies'], technology_layers=['Avionics'],
         implications=['If adoption is real, this is the most sovereignty-relevant layer for small UAS.'],
         uncertainties=['No independent evidence of OEM adoption or volume. Hold until one independent verification.'],
         sources=['arkin_web', 'yari_web', 'zerosum_web', 'atlas_uas'], domain='Defence & Dual-Use'),
    dict(signal_id='DX26-S05', proposed_no='', slug='uav-datalink-becoming-strategic-subsystem', publication_status='monitoring_hold',
         title='The UAV Datalink Is Becoming a Strategic Subsystem',
         thesis='Indian firms are productising encrypted, low-latency digital links and secure SATCOM/datalink architectures — the layer that decides whether a UAV survives contested spectrum.',
         evidence=['WARG Robotics encrypted digital video/telemetry link (L3).', 'Rangsons Aerospace SATCOM-on-the-move / secure datalink with DRDO (L4).'],
         entities=['WARG Robotics', 'Rangsons Aerospace'], technology_layers=['Communications / Datalink', 'Communications / SATCOM', 'Communications / Secure communications'],
         implications=['Datalink resilience is a better sovereignty metric than airframe origin for tactical UAS.'],
         uncertainties=['UAV-specific products and customers unevidenced; radio silicon undisclosed. Hold until L2 evidence.'],
         sources=['warg_web', 'rangsons_idrw', 'atlas_uas'], domain='Defence & Dual-Use'),
]
SIGNALS_HELD = [
    dict(title='Drone Propulsion Localisation Moves Upstream', reason='No verified Indian drone-grade BLDC motor maker in the intake (Tobitek/Thrust Link unverified); T-MOTOR exhibited directly. Evidence points the other way — do not publish.'),
    dict(title='C-UAS Is Becoming a Convergence Industry', reason='Vajron and Stellar Invictus have no public product/trial evidence; nothing new for the existing C-UAS register.'),
    dict(title='Indian Component Distributors Are Moving Upstream', reason='Distributors show drone portfolios, not upstream manufacturing. Folded into DX26-S02 as a method, not a thesis.'),
    dict(title='Drone Manufacturing Is Creating Demand for Aerospace Manufacturing Infrastructure', reason='Composite/machine-tool exhibitors are presence-only (L5); Nicomatic India alone is insufficient.'),
]


# --------------------------------------------------------------------------
# Generation
# --------------------------------------------------------------------------
def gen():
    ab, all_recs = load_records()
    assert len(ab) == 54, len(ab)
    add_by_company = {a['company']: a for a in ADD}

    # (A) reconciliation
    recon = []
    for r in ab:
        c = r['company']
        base = dict(company=c, source_entity_id=r['entity_id'], screening_status=r['atlas_status'], primary_layer_screened=r['primary_layer'])
        if c == 'T-MOTOR':
            recon.append({**base, 'action': 'UPDATE_EXISTING', 'existing_entity_id': TMOTOR_UPDATE['existing_id'], 'confidence': 'HIGH',
                          'reason': 'Exact match on SID entity "T-Motor" (foreign_supplier, CN; alias "T-Motor"). Already linked: manufactures → BLDC drone motors, manufactures → Electronic speed controller.',
                          'proposed_entity_id': '', 'notes': 'ID preserved. Description appended with Drone Expo 2026 direct-presence note; no duplicate created.',
                          'technology_layers': ['Propulsion / BLDC motor', 'Propulsion / ESC'],
                          'classification': dict(company_origin='Foreign', design_origin='Foreign', manufacturing='Foreign', assembly_integration='Foreign', basis='Existing Atlas (China supply-chain appendix) + company catalogue; L3'),
                          'technology_origin': 'Foreign company / imported product', 'evidence_level': 3, 'review_flag': ''})
        elif c in add_by_company:
            a = add_by_company[c]
            recon.append({**base, 'action': 'ADD_NEW', 'existing_entity_id': '', 'confidence': 'HIGH',
                          'reason': f"No match in sid.entities, entity_aliases, entity_candidates, zai_entities, dossiers, thin registry or vertical registers (name, legal name, abbreviation, domain, product names). Adds: {a['layer']} layer — {a['products']}.",
                          'proposed_entity_id': uid('entity:' + a['key']),
                          'notes': f"Dossier: {DOSSIER_BASE}{a['slug']}/ . " + (f"Node role: {a['node_role']}. " if a.get('node_role') else '') + ('Aliases: ' + ', '.join(x for x, _ in a.get('aliases', [])) if a.get('aliases') else ''),
                          'technology_layers': a['layers'],
                          'classification': {k: v[0] for k, v in a['cls'].items()} | {'basis': '; '.join(f"{k}: {v[2]} (L{v[1]})" for k, v in a['cls'].items())},
                          'technology_origin': a['tech_origin'][0], 'technology_origin_note': a['tech_origin'][1], 'evidence_level': a['evidence'], 'review_flag': ''})
        elif c in SIGNAL_ONLY:
            reason, layers = SIGNAL_ONLY[c]
            recon.append({**base, 'action': 'SIGNAL_ONLY', 'existing_entity_id': '', 'confidence': 'MEDIUM', 'reason': reason, 'proposed_entity_id': '',
                          'notes': 'No SID match. Flag for review if product/trial evidence appears.', 'technology_layers': layers,
                          'classification': dict(company_origin='Unknown', design_origin='Unknown', manufacturing='Unknown', assembly_integration='Unknown', basis='Insufficient evidence'),
                          'technology_origin': 'UNKNOWN', 'evidence_level': 5, 'review_flag': 'REVIEW'})
        elif c in IGNORE:
            recon.append({**base, 'action': 'IGNORE', 'existing_entity_id': '', 'confidence': 'MEDIUM', 'reason': IGNORE[c], 'proposed_entity_id': '',
                          'notes': 'No SID match.', 'technology_layers': [],
                          'classification': dict(company_origin='Unknown', design_origin='Unknown', manufacturing='Unknown', assembly_integration='Unknown', basis='Not assessed'),
                          'technology_origin': 'UNKNOWN', 'evidence_level': 5, 'review_flag': ''})
        elif c in RESEARCH_ONLY:
            reason, layers, flag, opp = RESEARCH_ONLY[c]
            recon.append({**base, 'action': 'RESEARCH_ONLY', 'existing_entity_id': '', 'confidence': 'LOW' if flag else 'MEDIUM', 'reason': reason, 'proposed_entity_id': '',
                          'notes': ('No SID match. ' + (f'Opportunity surface: {opp}.' if opp else '')).strip(), 'technology_layers': layers,
                          'classification': dict(company_origin='Unknown', design_origin='Unknown', manufacturing='Unknown', assembly_integration='Unknown', basis='Expo listing only (L5)'),
                          'technology_origin': 'UNKNOWN', 'evidence_level': 5, 'review_flag': flag})
        else:
            raise SystemExit(f'Undispositioned company: {c}')
    recon_doc = dict(dataset='Drone Expo 2026 — entity reconciliation against the Techadyant Atlas (SID)', generated=TODAY, event=EVENT,
                     method='Each of the 54 A/B companies was searched in sid.entities (canonical_name), sid.entity_aliases, sid.entity_candidates, sid.zai_entities, data/dossiers, data/company-dossiers, data/thin_registry.json, data/atlas/MANIFEST.json and every app/research/_*.json register, on legal name, short name, abbreviations, former names, domains and product names. Only T-Motor matched. Web evidence checks for key entities on 2026-09-30.',
                     evidence_levels={str(k): lvl_label(k) for k in range(1, 6)},
                     counts={a: sum(1 for x in recon if x['action'] == a) for a in ('UPDATE_EXISTING', 'ADD_NEW', 'SIGNAL_ONLY', 'RESEARCH_ONLY', 'IGNORE')},
                     records=recon)

    # (C) manifest
    man = {k: [] for k in ('update_existing', 'add_new', 'signal_only', 'research_only', 'ignore')}
    for x in recon:
        man[x['action'].lower()].append({'company': x['company'], 'entity_id': x['existing_entity_id'] or x['proposed_entity_id'] or None, 'confidence': x['confidence'], 'review_flag': x['review_flag']})
    manifest = dict(event=EVENT, generated=TODAY, universe=dict(total_exhibitors=len(all_recs), screened_A_B=len(ab),
                    screened_C=sum(1 for r in all_recs if r['atlas_status'] == 'C'), screened_D=sum(1 for r in all_recs if r['atlas_status'] == 'D')),
                    note='C (17) and D (6) exhibitors were not re-reviewed: they remain research-only / ignore as screened.',
                    **man,
                    new_value_chain_nodes=[{'name': n['name'], 'entity_id': uid('node:' + k), 'type': n['type_code']} for k, n in NEW_NODES.items()],
                    relationships_added=len(RELS), sid_sql='sid_ingest_drone_expo_2026.sql (prepared, not applied)',
                    dossiers=[f"{DOSSIER_BASE}{a['slug']}/" for a in ADD])

    # relationships file
    rel_doc = []
    for (t, s, tg, desc, lvl, srcs) in RELS:
        sid, sname = E(s); tid, tname = E(tg)
        rel_doc.append(dict(relationship_id=uid(f'rel:{t}:{s}:{tg}'), type=t, type_label=REL_LABEL[t], source_id=sid, source=sname, target_id=tid, target=tname,
                            description=desc, evidence_level=lvl, verification_status=VERIF[lvl], corridor='defence',
                            sources=[SOURCES[k]['url'] for k in srcs]))

    # (B) dependency matrix
    sov = sov_lookup()
    dep = []
    for (sub, tech, ind, forg, depn, loc, lvl, opp, srcs, sref) in DEP:
        row = dict(subsystem=sub, technology=tech, indian_entities=ind, foreign_entities=forg, foreign_component_dependency=depn,
                   localisation_status=loc, evidence_level=f'L{lvl}', opportunity_surface=opp, sources=[SOURCES[k]['url'] for k in srcs])
        if sref and sref in sov:
            s = sov[sref]
            row['atlas_sovereignty_ref'] = dict(component=s['component'], layer=s['layer'], india_score=s['india'], china_score=s['china'], risk=s['risk'],
                                                note='Techadyant UAS sovereignty table (app/research/_drones.json) — internal indicative estimate.')
        elif sref:
            raise SystemExit(f'sovereignty ref not found: {sref}')
        dep.append(row)

    # (D) opportunity surfaces
    opp = []
    for o in OPP:
        opp.append(dict(opportunity_id=o['id'], theme=o['theme'], label='Industrial opportunity surface', validation_status=o['status'], priority=o['priority'],
                        entities=o['entities'],
                        linked_existing_sid_opportunity_surfaces=[{'entity_id': EX_OPP[k][0], 'name': EX_OPP[k][1]} for k in o['sid']],
                        questions={'what_exists_in_india': o['exists'], 'what_is_imported': o['imported'], 'what_is_only_assembled': o['assembled'],
                                   'what_is_technologically_weak': o['weak'], 'what_is_scaling': o['scaling'], 'evidence': o['evidence'], 'what_is_still_unknown': o['unknown']}))
    opp_doc = dict(generated=TODAY, note='Industrial opportunity surfaces — analytical hypotheses about where capability is thin, not investment recommendations. Mapped onto existing SID opportunity-surface entities rather than creating new ones.', surfaces=opp)

    # (E) signals
    sig_doc = dict(generated=TODAY, drafted=[dict(**{k: v for k, v in s.items() if k != 'sources'}, sources=[SOURCES[k]['url'] for k in s['sources']]) for s in SIGNALS], held=SIGNALS_HELD,
                   note='Signals are published through the CMS (scripts/publish-signals.mjs). Only "ready_for_editorial_review" items are in the CMS draft file; "monitoring_hold" items wait for independent evidence. Signal numbers are proposals — confirm the next free S-number in cms_signals before publishing.')
    cms = []
    for s in SIGNALS:
        if s['publication_status'] != 'ready_for_editorial_review': continue
        body = [dict(type='p', text=s['thesis']), dict(type='h', text='What the evidence shows'), dict(type='list', items=s['evidence']),
                dict(type='h', text='Why it matters'), dict(type='list', items=s['implications']),
                dict(type='h', text='What we cannot yet say'), dict(type='list', items=s['uncertainties']),
                dict(type='p', text=f'Source note: surfaced through Techadyant\'s OSINT pass on {EVENT} (New Delhi, 28–30 Sep 2026). Exhibitor presence alone is not treated as evidence of capability; evidence levels are stated per claim.')]
        cms.append(dict(no=s['proposed_no'], slug=s['slug'], title=s['title'], domain=s['domain'], date=TODAY, date_label='30 Sep 2026', reading_time='4 min',
                        status='monitoring', excerpt=s['thesis'][:260], body=body, takeaways=s['implications'][:3], sources=[SOURCES[k]['url'] for k in s['sources']]))
    return recon_doc, manifest, rel_doc, dep, opp_doc, sig_doc, cms


# --------------------------------------------------------------------------
# SID SQL (idempotent; not applied automatically)
# --------------------------------------------------------------------------
def q(s):
    return 'NULL' if s is None else "'" + str(s).replace("'", "''") + "'"


def sql():
    L = ['-- Drone Expo 2026 OSINT -> SID. Generated by scripts/ingest-drone-expo-2026.py. Idempotent (ON CONFLICT DO NOTHING / guarded UPDATE).',
         '-- Review, then apply to the n8ndb project (schema sid). After applying, `npm run build` re-bakes _atlas.json / _platform.json.',
         'begin;', 'set search_path=sid,public;', '']
    L.append('-- sources')
    for k, s in SOURCES.items():
        if s.get('sid_existing'): continue
        pd = s['published_date']; pd = pd if pd and len(pd) == 10 else (pd + '-01' if pd and len(pd) == 7 else None)
        L.append(f"insert into sid.sources (source_id, source_type_id, publisher, title, url, published_date, is_primary) values ({q(uid('src:'+k))}, {s['sid_type']}, {q(s['publisher'])}, {q(s['title'])}, {q(s['url'])}, {q(pd)}, {'true' if s['level'] in (1, 3) else 'false'}) on conflict (source_id) do nothing;")
    L.append('\n-- new value-chain nodes')
    for k, n in NEW_NODES.items():
        tid = f"(select id from sid.entity_types where code={q(n['type_code'])})"
        L.append(f"insert into sid.entities (entity_id, canonical_name, entity_type_id, home_country, is_watchlist, watchlist_since, status, description) values ({q(uid('node:'+k))}, {q(n['name'])}, {tid}, {q(n['country'])}, true, {q(TODAY)}, 'active', {q(n['description'])}) on conflict (entity_id) do nothing;")
        L.append(f"insert into sid.entity_corridors (entity_id, corridor_id, role) values ({q(uid('node:'+k))}, 4, 'value_chain_node') on conflict do nothing;")
    L.append('\n-- new entities (ADD_NEW)')
    for a in ADD:
        eid = uid('entity:' + a['key'])
        tid = f"(select id from sid.entity_types where code={q(a['type_code'])})"
        L.append(f"insert into sid.entities (entity_id, canonical_name, entity_type_id, home_country, is_watchlist, watchlist_since, status, description) values ({q(eid)}, {q(a['name'])}, {tid}, {q(a['country'])}, true, {q(TODAY)}, 'active', {q(a['description'])}) on conflict (entity_id) do nothing;")
        L.append(f"insert into sid.entity_corridors (entity_id, corridor_id, role) values ({q(eid)}, 4, 'drone_expo_2026') on conflict do nothing;")
        aliases = [(a['company'], 'legal_name')] + a.get('aliases', [])
        seen = set()
        for al, typ in aliases:
            if al.lower() in seen or al == a['name']: continue
            seen.add(al.lower())
            # alias_norm is a generated column in SID — never insert it.
            L.append(f"insert into sid.entity_aliases (alias_id, entity_id, alias, alias_type) values ({q(uid('alias:'+a['key']+':'+al))}, {q(eid)}, {q(al)}, {q(typ)}) on conflict (alias_id) do nothing;")
    L.append('\n-- T-Motor: preserve ID, append Drone Expo evidence (guarded)')
    L.append(f"update sid.entities set description = description || {q(TMOTOR_UPDATE['append'])}, updated_at = now() where entity_id = {q(TMOTOR_UPDATE['existing_id'])} and position('Drone Expo' in coalesce(description,'')) = 0;")
    L.append('\n-- events (developments that establish relationships)')
    evs = [('drogo_delivery', 8, 'Drogo Aerospace delivers first batch of 41 JK 250e drones to Indian Army (₹72 cr contract)', 'Army Southern Command officials received the first batch at Nashik; balance targeted by Aug 2026. Media-reported; no MoD primary located.', '2026-06-01', 9, 'corroborated', ['drogo', 'army']),
           ('drogo_mou', 6, 'Munitions India and Drogo Aerospace sign MoU on indigenous UAVs and loitering munitions', 'MoU signed in Pune for design, development and integration of UAVs and loitering munitions incl. Drogo\'s Delta Wing Kamikaze platform. Not an order.', '2026-09-04', 2, 'corroborated', ['drogo', 'mil'])]
    for key, et, title, summ, date, stage, ver, ents in evs:
        L.append(f"insert into sid.events (event_id, event_type_id, corridor_id, title, summary, event_date, commitment_stage_id, verification_status, primary_source_id, review_status) values ({q(uid('event:'+key))}, {et}, 4, {q(title)}, {q(summ)}, {q(date)}, {stage}, {q(ver)}, {q(uid('src:'+key))}, 'pending') on conflict (event_id) do nothing;")
        L.append(f"insert into sid.event_sources (event_id, source_id) values ({q(uid('event:'+key))}, {q(uid('src:'+key))}) on conflict do nothing;")
        for e in ents:
            L.append(f"insert into sid.event_entities (event_id, entity_id, role) values ({q(uid('event:'+key))}, {q(E(e)[0])}, 'subject') on conflict do nothing;")
    L.append('\n-- relationships')
    for (t, s, tg, desc, lvl, srcs) in RELS:
        prim = srcs[0]
        psid = SOURCES[prim].get('sid_existing') or uid('src:' + prim)
        est = {'drogo:army': uid('event:drogo_delivery'), 'drogo:mil': uid('event:drogo_mou')}.get(f'{s}:{tg}')
        L.append(f"insert into sid.relationships (relationship_id, source_entity_id, target_entity_id, relationship_type_id, corridor_id, magnitude, magnitude_unit, description, verification_status, primary_source_id, established_by_event) values ({q(uid(f'rel:{t}:{s}:{tg}'))}, {q(E(s)[0])}, {q(E(tg)[0])}, {REL_TYPE_ID[t]}, 4, {'72' if (s, tg) == ('drogo', 'army') else 'NULL'}, {q('INR crore') if (s, tg) == ('drogo', 'army') else 'NULL'}, {q(desc)}, {q(VERIF[lvl])}, {q(psid)}, {q(est)}) on conflict (relationship_id) do nothing;")
    L += ['', 'commit;', '']
    return '\n'.join(L)


# --------------------------------------------------------------------------
# Snapshot patches (so the site reflects the ingestion before the next SID bake)
# --------------------------------------------------------------------------
def patch_atlas(dry):
    atlas = json.load(open(ATLAS, encoding='utf-8'))
    ids = {p['id'] for p in atlas['players']}
    added = 0
    new_players = [dict(id=uid('node:' + k), name=n['name'], type=n['type'], country=n['country'], corridors=['defence'], type_code=n['type_code'], description=n['description'][:280]) for k, n in NEW_NODES.items()]
    new_players += [dict(id=uid('entity:' + a['key']), name=a['name'], type='Foreign Supplier' if a['type_code'] == 'foreign_supplier' else 'Private Company', country=a['country'],
                         corridors=['defence'], type_code=a['type_code'], description=a['description'][:280]) for a in ADD]
    for p in new_players:
        if p['id'] not in ids:
            atlas['players'].append(p); added += 1
    for p in atlas['players']:
        if p['id'] == TMOTOR_UPDATE['existing_id'] and 'Drone Expo' not in p['description']:
            p['description'] = (p['description'] + TMOTOR_UPDATE['append'])[:280]
    rel_keys = {(r['source_id'], r['target_id'], r['type']) for r in atlas['relationships']}
    radd = 0
    for (t, s, tg, desc, lvl, srcs) in RELS:
        sid, sname = E(s); tid, tname = E(tg)
        if (sid, tid, t) in rel_keys: continue
        atlas['relationships'].append(dict(type=t, unit='INR crore' if (s, tg) == ('drogo', 'army') else None, source=sname, target=tname,
                                           magnitude=72 if (s, tg) == ('drogo', 'army') else None, source_id=sid, target_id=tid,
                                           type_label=REL_LABEL[t], corridor_id=4, description=desc[:200]))
        radd += 1
    if not dry:
        with open(ATLAS, 'w', encoding='utf-8') as f:
            json.dump(atlas, f, ensure_ascii=False, indent=1)
    return added, radd, atlas


def plat_slug(name, eid):
    return re.sub(r'^-+|-+$', '', re.sub(r'[^a-z0-9]+', '-', name.lower())) + '-' + eid[:6]


def patch_platform(dry):
    plat = json.load(open(PLATFORM, encoding='utf-8'))
    by_id = {e['id']: e for e in plat}
    kind_of = {}
    for k, n in NEW_NODES.items():
        eid = uid('node:' + k)
        kind_of[eid] = n['type_code']
        if eid not in by_id:
            e = dict(id=eid, kind=n['type_code'], name=n['name'], slug=plat_slug(n['name'], eid), country=n['country'], kind_label=n['kind_label'], description=n['description'], relationships=[])
            plat.append(e); by_id[eid] = e
    kinds = {a['key']: a['type_code'] for a in ADD}
    for (t, s, tg, desc, lvl, srcs) in RELS:
        sid, sname = E(s); tid, tname = E(tg)
        for this, other, oname, d, okey in ((sid, tid, tname, 'out', tg), (tid, sid, sname, 'in', s)):
            if this not in by_id: continue
            okind = kinds.get(okey) or (NEW_NODES[okey]['type_code'] if okey in NEW_NODES else None)
            if okind is None:
                okind = next((x['kind'] for x in by_id[this]['relationships'] if x['name'] == oname), None) or {'army': 'govt_body', 'mil': 'psu', 'iitk': 'university'}.get(okey, 'product')
            rel = dict(dir=d, kind=okind, name=oname, predicate=REL_LABEL[t])
            if rel not in by_id[this]['relationships']:
                by_id[this]['relationships'].append(rel)
    if not dry:
        with open(PLATFORM, 'w', encoding='utf-8') as f:
            json.dump(plat, f, ensure_ascii=False, separators=(',', ':'))
    return plat


# --------------------------------------------------------------------------
# Validation
# --------------------------------------------------------------------------
def validate(dossiers, atlas, rel_doc, recon_doc, plat):
    errs = []
    import jsonschema  # pip install jsonschema
    schema = json.load(open(SCHEMA, encoding='utf-8'))
    for d in dossiers:
        for e in jsonschema.Draft7Validator(schema).iter_errors(d):
            errs.append(f"dossier {d['slug']}: {e.message} at {list(e.path)}")
        known = {s['id'] for s in d['sources']}
        def refs(o):
            if isinstance(o, dict):
                for k, v in o.items():
                    if k == 'sources' and isinstance(v, list) and all(isinstance(x, str) for x in v):
                        yield from v
                    else:
                        yield from refs(v)
            elif isinstance(o, list):
                for x in o: yield from refs(x)
        for r in refs({k: v for k, v in d.items() if k != 'sources'}):
            if r not in known: errs.append(f"dossier {d['slug']}: dangling source ref {r}")
        for s in d['sources']:
            if not re.match(r'^https?://[^\s]+\.[a-z]{2,}', s['url']): errs.append(f"dossier {d['slug']}: malformed URL {s['url']}")
    # duplicate IDs / names
    pids = [p['id'] for p in atlas['players']]
    if len(pids) != len(set(pids)): errs.append('duplicate player ids in _atlas.json')
    names = {}
    for p in atlas['players']:
        names.setdefault(p['name'].lower(), []).append(p['id'])
    for a in ADD:
        if len(names.get(a['name'].lower(), [])) > 1: errs.append(f"duplicate company name in atlas: {a['name']}")
    if sum(1 for p in atlas['players'] if p['name'] == 'T-Motor') != 1: errs.append('T-Motor must exist exactly once')
    # relationships resolve + no orphans among new entities
    idset = set(pids) | {EX['iitk'][0]}
    for r in rel_doc:
        if r['source_id'] not in idset: errs.append(f"relationship source not in atlas: {r['source']}")
        if r['target_id'] not in idset: errs.append(f"relationship target not in atlas: {r['target']}")
    linked = {r['source_id'] for r in rel_doc} | {r['target_id'] for r in rel_doc}
    for a in ADD:
        if uid('entity:' + a['key']) not in linked: errs.append(f"orphan entity: {a['name']}")
    for k in NEW_NODES:
        if uid('node:' + k) not in linked: errs.append(f"orphan node: {k}")
    # taxonomy
    for r in rel_doc:
        if r['type'] not in REL_TYPE_ID: errs.append(f"invalid relationship type {r['type']}")
    for x in recon_doc['records']:
        if x['action'] not in ('UPDATE_EXISTING', 'ADD_NEW', 'SIGNAL_ONLY', 'RESEARCH_ONLY', 'IGNORE'): errs.append(f"bad action {x['action']}")
        if x['confidence'] not in ('HIGH', 'MEDIUM', 'LOW'): errs.append(f"bad confidence {x['company']}")
        for k in ('company_origin', 'design_origin', 'manufacturing', 'assembly_integration'):
            ok = {'company_origin': {'Indian', 'Foreign', 'Joint', 'Unknown'}}.get(k, {'Indian', 'Foreign', 'Mixed', 'Unknown', 'India'})
            if x['classification'][k] not in ok: errs.append(f"bad {k} for {x['company']}: {x['classification'][k]}")
    if len(recon_doc['records']) != 54: errs.append('reconciliation must cover 54 companies')
    # player slug collisions (atlas.ts kebab)
    kb = lambda s: re.sub(r'(^-|-$)', '', re.sub(r'[^a-z0-9]+', '-', s.lower().replace('&', 'and')))
    for a in ADD:
        same = [p['name'] for p in atlas['players'] if kb(p['name']) == kb(a['name'])]
        if len(same) > 1: errs.append(f"player slug collision: {same}")
    # dossier slug collisions with existing registers
    drones = json.load(open(os.path.join(ROOT, 'app', 'research', '_drones.json'), encoding='utf-8'))
    existing = {c['slug'] for c in drones['companies']} | set(os.path.splitext(f)[0] for f in os.listdir(DOSSIER_DIR) if not any(f == a['slug'] + '.json' for a in ADD))
    for a in ADD:
        if a['slug'] in existing: errs.append(f"dossier slug collides: {a['slug']}")
    pslugs = [(e['kind'], e['slug']) for e in plat]
    if len(pslugs) != len(set(pslugs)): errs.append('duplicate _platform.json kind/slug')
    return errs


def main():
    check = '--check' in sys.argv
    recon_doc, manifest, rel_doc, dep, opp_doc, sig_doc, cms = gen()
    dossiers = [build_dossier(a) for a in ADD]
    _, _, atlas = patch_atlas(dry=True)
    plat = patch_platform(dry=True)
    errs = validate(dossiers, atlas, rel_doc, recon_doc, plat)
    if errs:
        print('VALIDATION FAILED:'); [print('  -', e) for e in errs]; sys.exit(1)
    if check:
        print(f'OK — {len(recon_doc["records"])} companies reconciled, {len(dossiers)} dossiers, {len(rel_doc)} relationships validated.'); return
    os.makedirs(OUT, exist_ok=True)
    w = lambda name, obj: open(os.path.join(OUT, name), 'w', encoding='utf-8').write(json.dumps(obj, ensure_ascii=False, indent=2) + '\n')
    w('drone_expo_2026_entity_reconciliation.json', recon_doc)
    w('drone_expo_2026_atlas_ingestion_manifest.json', manifest)
    w('drone_expo_2026_relationships.json', rel_doc)
    w('drone_expo_2026_dependency_matrix.json', dep)
    w('drone_expo_2026_opportunity_surfaces.json', opp_doc)
    w('drone_expo_2026_signals.json', sig_doc)
    w('drone_expo_2026_signals.cms-draft.json', cms)
    # Small index the website imports (hub section, static params, sitemap).
    w('site_index.json', dict(event=EVENT, generated=TODAY, screened=54, counts=recon_doc['counts'],
                              entities=[dict(slug=a['slug'], name=a['name'], layer=a['layer'], one_liner=ONE_LINER[a['key']],
                                             evidence_level=a['evidence'], country=a['country'], path=f"{DOSSIER_BASE}{a['slug']}/") for a in ADD]))
    open(os.path.join(OUT, 'sid_ingest_drone_expo_2026.sql'), 'w', encoding='utf-8').write(sql())
    for d in dossiers:
        with open(os.path.join(DOSSIER_DIR, d['slug'] + '.json'), 'w', encoding='utf-8') as f:
            json.dump(d, f, ensure_ascii=False, indent=2); f.write('\n')
    pa, ra, _ = patch_atlas(dry=False)
    patch_platform(dry=False)
    print(f"Wrote outputs to {os.path.relpath(OUT, ROOT)}; {len(dossiers)} dossiers; _atlas.json +{pa} players +{ra} relationships.")
    print('Counts:', recon_doc['counts'])


if __name__ == '__main__':
    main()
