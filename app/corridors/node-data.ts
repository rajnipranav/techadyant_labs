// Deep per-node + per-corridor intelligence for corridor pages, node pages and the
// dark clickable map. Coordinates are in the shared INDIA_OUTLINE space (viewBox
// "34 6 448 548") — same system as data.ts `pts`. Sourced from the DPIIT/NICDC
// "Status of Industrial Corridor Projects" reports (31 Oct + 30 Nov 2025), the
// NICDC node pages (nicdc.in), PIB and India Investment Grid. Project costs,
// CCEA/EPC dates are official; investment-potential and jobs are NICDC projections.
// Depth tiers (CORRIDOR-PAGE-STANDARD.md §3b): operational/construction = full file;
// approved/planned = light.

export type NodeStage = 'operational' | 'construction' | 'approved' | 'planned';

export const STAGE: Record<NodeStage, { label: string; color: string }> = {
  operational:  { label: 'Operational',        color: '#0F8E78' },
  construction: { label: 'Under construction',  color: '#B5891E' },
  approved:     { label: 'Approved',            color: '#2E86C1' },
  planned:      { label: 'Planned',             color: '#8593A6' },
};

export interface DeepNode {
  slug: string; name: string; state: string; stage: NodeStage; statusLabel: string;
  coords?: [number, number];
  areaAc?: number; projectCostCr?: number; investmentCr?: number; jobs?: number;
  sectors: string; anchors?: string; nearest?: string;
  developer?: string; epc?: string;
  companies?: { name: string; sector?: string; commitment?: string; note?: string }[];
  industries?: string[];
  infrastructure?: string[];
  incentives?: string;
  sections?: { heading: string; body: string[] }[];
  summary: string[];
  timeline?: { date: string; label: string }[];
  sources: { label: string; url: string }[];
}
export interface CorridorDeep {
  slug: string;
  intro: string[];
  facts: { k: string; v: string }[];
  nodes: DeepNode[];
  milestones?: { date: string; label: string }[];
  sources: { label: string; url: string }[];
}

const DPIIT = { label: 'DPIIT/NICDC status report, 30 Nov 2025', url: 'https://www.dpiit.gov.in/static/uploads/2025/12/1647e68e9f6e646136f0dc92dcbc4a80.pdf' };
const NICDC = (path: string, label: string) => ({ label, url: `https://nicdc.in/projects/12-new-projects/${path}` });
const noTenants = (extra: string): { heading: string; body: string[] } => ({
  heading: 'Anchor tenants & demand signals',
  body: [`No anchor tenants or MoUs are publicly recorded yet — at a greenfield IMC, plots are allotted only after trunk infrastructure is built, so the absence of named tenants this early is expected, not a red flag. ${extra}`],
});

export const corridorDeep: Record<string, CorridorDeep> = {
  'amritsar-kolkata': {
    slug: 'amritsar-kolkata',
    intro: [
      'The Amritsar–Kolkata Industrial Corridor (AKIC) is the longest of India’s national industrial corridors at 1,839 km, threading seven states from Punjab to West Bengal along the Eastern Dedicated Freight Corridor (EDFC), the Ludhiana–Dankuni rail-freight spine. NICDC develops it under the NICDIT framework, with a 50:50 Centre–State SPV for each Integrated Manufacturing Cluster (IMC).',
      'The design rule is consistent: each IMC reserves at least 40% of its land for manufacturing and agro-processing, anchored to an EDFC station so finished goods can move to ports at rail-freight economics. The corridor’s influence band runs roughly 150–200 km on either side of the freight line.',
      'The headline shift came on 28 August 2024, when the Cabinet Committee on Economic Affairs approved six AKIC nodes in one stroke. A year on the picture is no longer “all planned”: four nodes are in active EPC procurement or have awarded construction contracts, two are approved and pre-construction, and one (Jharkhand) is relocating after losing its original site. No anchor tenants are public anywhere yet — correct for greenfield sites at this stage.',
    ],
    facts: [
      { k: 'Length', v: '1,839 km' },
      { k: 'States', v: '7 (Punjab, Haryana, UP, Uttarakhand, Bihar, Jharkhand, West Bengal)' },
      { k: 'Backbone', v: 'Eastern Dedicated Freight Corridor (Ludhiana–Dankuni)' },
      { k: 'Developer', v: 'NICDC under NICDIT; 50:50 Centre–State SPV per node' },
      { k: 'Influence band', v: '150–200 km either side of the EDFC' },
      { k: 'Land rule', v: '≥40% of each IMC reserved for manufacturing / agro-processing' },
      { k: 'Nodes', v: '6 CCEA-approved (28 Aug 2024) + 1 relocating + 1 state-led' },
    ],
    nodes: [
      {
        slug: 'rajpura-patiala', name: 'Rajpura–Patiala IMC', state: 'Punjab', stage: 'construction',
        statusLabel: 'EPC procurement · 7 bids under evaluation', coords: [159, 174],
        areaAc: 1098, projectCostCr: 1367, investmentCr: 7500, jobs: 64204,
        sectors: 'ESDM, pharma, textiles, machinery', nearest: 'New Rajpura EDFC station (12 km)',
        developer: 'NICDC Punjab Industrial Corridor Development Corporation Ltd (Centre–Punjab JV; state support agreement 19 Sep 2022)',
        epc: 'EPC tender floated 19 Sep 2025 — 7 bids received (15 Nov 2025), under evaluation; contractor not yet awarded',
        industries: ['Electronics system design & manufacturing (ESDM)', 'Pharmaceuticals', 'Textiles & apparel', 'Food & beverages', 'Machinery & equipment', 'Rubber & plastics', 'Fabricated metals & chemicals'],
        infrastructure: ['New Rajpura EDFC station 12 km — the closest dedicated freight link of any AKIC node', 'NH-44 (Ludhiana–Delhi) 10 km; NH-7 (Patiala–Chandigarh) 7.5 km', 'Chandigarh airport 45 km', '~60% of 1,099 acres zoned industrial'],
        incentives: 'Land ~₹3 cr/acre (the corridor’s highest), plots 0.5–35 acres; Punjab industrial-policy incentives apply.',
        summary: [
          'Punjab’s AKIC node, between Rajpura and Patiala, is the most diversified of the corridor’s nodes by target sector — ESDM, pharma, textiles and machinery — and the best-connected to a freight station. Environmental clearance was granted in May 2025, the state SPV is incorporated, and the EPC tender drew seven bidders by November 2025.',
        ],
        sections: [noTenants('Project-management consultant Voyants Solutions was appointed in September 2025; the seven-bidder EPC tender is an early sign of contractor interest.')],
        timeline: [
          { date: 'Aug 2024', label: 'CCEA approval' },
          { date: 'May 2025', label: 'Environmental clearance' },
          { date: 'Sep 2025', label: 'EPC tender floated; Voyants appointed PMC' },
          { date: 'Nov 2025', label: '7 EPC bids received; under evaluation' },
        ],
        sources: [DPIIT, NICDC('imc-rajpura-patiala-punjab', 'NICDC — IMC Rajpura–Patiala')],
      },
      {
        slug: 'hisar', name: 'Hisar IMC', state: 'Haryana', stage: 'approved',
        statusLabel: 'Approved, pre-construction', coords: [149, 191], areaAc: 2988, projectCostCr: 4680, investmentCr: 32417, jobs: 125000,
        sectors: 'Manufacturing, logistics, aerospace', anchors: 'Built around Maharaja Agrasen (Hisar) Airport', nearest: 'Hisar',
        developer: 'NICDC Haryana IMC Hisar Project Ltd (SPV incorporated 25 Sep 2025)',
        summary: [
          'Hisar is the largest AKIC node by area (2,988 acres) and by investment potential (₹32,417 cr / ~1.25 lakh jobs), built around the Maharaja Agrasen airport to give the corridor an aerospace-and-logistics anchor. But it is also the slowest of the approved six: the SPV was only incorporated on 25 September 2025 and land transfer is still pending. Largest on paper, earliest in execution.',
        ],
        timeline: [
          { date: 'Aug 2024', label: 'CCEA approval' },
          { date: 'Aug 2025', label: 'State support / shareholders’ agreement' },
          { date: 'Sep 2025', label: 'SPV incorporated; land transfer pending' },
        ],
        sources: [DPIIT, { label: 'PIB PRID 2158558', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2158558' }],
      },
      {
        slug: 'khurpia', name: 'Khurpia IMC (Prag-Khurpia)', state: 'Uttarakhand', stage: 'construction',
        statusLabel: 'EPC procurement (2nd call)', coords: [196, 191],
        areaAc: 1002, projectCostCr: 1265, investmentCr: 6180, jobs: 75057,
        sectors: 'Automobiles, auto components, engineering', nearest: 'Kichha rail station (3 km)',
        developer: 'NICDC Uttarakhand Industrial Township Ltd (Centre–SIIDCUL JV, incorporated Oct 2022)',
        epc: '2nd-call EPC tender floated 18 Oct 2025 (pre-bid 25 Oct); contractor not yet awarded',
        industries: ['Automobiles & auto components', 'Engineering & fabrication'],
        infrastructure: ['Power demand 115 MVA (100 MVA industrial + 15 MVA utilities) — the best-specified utility plan of the four nodes', 'CETP + STP within the EPC scope', 'NH-09 3 km; SH-44 adjacent; Kichha rail station 3 km; Pantnagar airport 15 km', 'New Khurja EDFC station 216 km — the AKIC node furthest from a dedicated freight station', '~62% of 1,002 acres zoned industrial'],
        incentives: 'Land ~₹1.7 cr/acre, plots 0.5–120 acres; Uttarakhand SIIDCUL incentives; extends the established Pantnagar auto/engineering belt.',
        summary: [
          'The Uttarakhand node at Khurpia (Udham Singh Nagar) is the most narrowly focused of the four — automobiles and engineering, positioned as an extension of the Pantnagar industrial ecosystem. It also has the clearest published infrastructure spec (115 MVA power, CETP+STP in the EPC scope). A second-call EPC tender was floated in October 2025 with ~500 acres and ₹207 cr of equity transferred.',
        ],
        sections: [noTenants('The node draws on the established Pantnagar belt — auto and white-goods manufacturers already cluster nearby — giving it a ready demand catchment once plots open.')],
        timeline: [
          { date: 'Aug 2024', label: 'CCEA approval' },
          { date: 'Jul 2025', label: 'PMC onboarded' },
          { date: 'Oct 2025', label: '2nd-call EPC tender; land + equity transferred' },
        ],
        sources: [DPIIT, NICDC('imc-khurpia-uttarakhand', 'NICDC — IMC Khurpia')],
      },
      {
        slug: 'agra', name: 'Agra IMC', state: 'Uttar Pradesh', stage: 'approved',
        statusLabel: 'Approved · court bottleneck', coords: [178, 214], areaAc: 1058, investmentCr: 3400,
        sectors: 'E-mobility, leather, garments, food processing, packaging', nearest: 'Agra',
        developer: 'AKIC IMC Agra-Prayagraj Ltd (shared SPV; incorporated 30 Jan 2025; state partner UPSIDA)',
        summary: [
          'Agra is CCEA-approved with its SPV (shared with Prayagraj) incorporated on 30 January 2025 and environmental clearance from 2023. Its bottleneck is unusual: tree-felling approval inside the Taj Trapezium Zone is pending before the Supreme Court, which gates site preparation. Sector positioning leans to e-mobility, leather and garments — Agra’s existing clusters.',
        ],
        timeline: [
          { date: 'Aug 2024', label: 'CCEA approval' },
          { date: 'Jan 2025', label: 'Agra–Prayagraj SPV incorporated' },
          { date: 'Pending', label: 'Taj Trapezium Zone clearance (Supreme Court)' },
        ],
        sources: [DPIIT, { label: 'PIB PRID 2071860', url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2071860' }],
      },
      {
        slug: 'prayagraj', name: 'Prayagraj IMC', state: 'Uttar Pradesh', stage: 'construction',
        statusLabel: 'Construction contract awarded (most advanced)', coords: [228, 238],
        areaAc: 351, projectCostCr: 658, investmentCr: 1600, jobs: 17700,
        sectors: 'E-mobility, cycles, food, garments', nearest: 'New Karchana EDFC station (7 km)',
        developer: 'AKIC IMC Agra-Prayagraj Ltd (shared SPV; incorporated 30 Jan 2025; state partner UPSIDA)',
        epc: 'EPC contractor LoA issued 27 Oct 2025 for trunk infrastructure (contractor name not disclosed in the NICDC status report)',
        industries: ['E-mobility / automobile', 'Cycle manufacturing', 'Food processing & beverages', 'Readymade garments', 'Leather articles', 'Packaging'],
        infrastructure: ['New Karchana EDFC station 7 km; Naini ICD 5 km', 'NH-35 adjacent; NH-30 at 10 km; Prayagraj airport 24 km; inland-waterways terminal 5.5 km', 'Part of the node sits inside the existing Saraswati Hi-Tech City', '~81% of 351 acres zoned industrial'],
        incentives: 'Land ~₹2 cr/acre, plots 0.5–50 acres; UP industrial / EV policy incentives. The smallest AKIC node, built partly on serviced land — which is why it moved fastest.',
        summary: [
          'Prayagraj is the most advanced node on the entire corridor: the letter of award to the EPC contractor for trunk-infrastructure works was issued on 27 October 2025 — construction is contracted, not merely tendered. At 351 acres (partly inside the existing Saraswati Hi-Tech City) it is the smallest AKIC node, which is precisely why it could move first.',
        ],
        sections: [noTenants('NICDC markets a developed land parcel specifically for the EV sector here — the clearest forward demand signal on the corridor, and Prayagraj is the only node past EPC award.')],
        timeline: [
          { date: 'Aug 2024', label: 'CCEA approval' },
          { date: 'Mar 2025', label: 'Environmental clearance (SEIAA UP)' },
          { date: 'Oct 2025', label: 'EPC contractor LoA issued (trunk infrastructure)' },
        ],
        sources: [DPIIT, NICDC('imc-prayagraj-uttar-pradesh', 'NICDC — IMC Prayagraj')],
      },
      {
        slug: 'gaya', name: 'Gaya IMC', state: 'Bihar', stage: 'construction',
        statusLabel: 'EPC procurement (2nd call)', coords: [283, 260],
        areaAc: 1670, projectCostCr: 1339, investmentCr: 16524, jobs: 109185,
        sectors: 'Agro/food, engineering, auto, aerospace & defence', anchors: 'Dobhi / Sherghati', nearest: 'New Paharpur EDFC station (45 km)',
        developer: 'Bihar Integrated Manufacturing City Gaya Ltd (BIMCGL) — Centre–BIADA JV, incorporated 6 Jan 2025',
        epc: '2nd-call EPC tender floated 16 Oct 2025 (pre-bid 24 Oct); Bihar Chief Secretary directed agency selection by Mar 2026; contractor not yet awarded',
        industries: ['Agro & food processing', 'Readymade garments', 'Engineering & fabrication', 'Auto components & steel-based products', 'Aerospace & defence', 'Building materials', 'Furniture & handloom', 'Leather & medical equipment'],
        infrastructure: ['New Paharpur EDFC station 45 km; Gaya Junction 40 km', 'NH-22 (Patna–Gaya–Dobhi) 2 km; NH-19/GT Road 10 km; Gaya international airport 30 km', 'Full central environmental clearance from MoEF&CC (Mar 2025)', '~55% of 1,670 acres zoned industrial, 21% green'],
        incentives: 'Land ~₹1.42 cr/acre (lowest of the four), plots 1–50 acres; Bihar industrial incentives. The largest industrial township proposed in Bihar.',
        summary: [
          'Bihar’s Gaya node (at Dobhi/Sherghati) is the corridor’s single largest opportunity: ₹16,524 cr of investment potential and ~1.09 lakh projected jobs on 1,670 acres, near Bodh Gaya and the mineral-rich Jharkhand hinterland. The SPV (BIMCGL) is live, the master plan approved, and a second-call EPC tender was floated in October 2025 with 414 acres and ₹132 cr of equity transferred.',
        ],
        sections: [noTenants('At ₹16,524 cr of investment potential it is the corridor’s largest single bet, drawing on the Jharkhand hinterland for steel and engineering feedstock; the BIMCGL board has approved the master plan but plot allotment awaits trunk infrastructure.')],
        timeline: [
          { date: 'Aug 2024', label: 'CCEA approval' },
          { date: 'Jan 2025', label: 'SPV (BIMCGL) incorporated' },
          { date: 'Mar 2025', label: 'Central environmental clearance (MoEF&CC)' },
          { date: 'Oct 2025', label: '2nd-call EPC tender; land + equity transferred' },
        ],
        sources: [DPIIT, NICDC('imc-gaya-bihar', 'NICDC — IMC Gaya')],
      },
      {
        slug: 'jharkhand', name: 'Jharkhand IMC', state: 'Jharkhand', stage: 'planned',
        statusLabel: 'Site being relocated',
        sectors: 'To be defined',
        summary: [
          'The Jharkhand node is the corridor’s one genuine laggard. Its original site at New Bahri is no longer available, and an alternate site is still being identified — there is no SPV, no approval and no land. Until the location is confirmed, no development activity is possible. It is the only AKIC node fairly described as stalled.',
        ],
        sources: [DPIIT],
      },
      {
        slug: 'raghunathpur', name: 'Raghunathpur (Jangal Sundari Karmanagari)', state: 'West Bengal', stage: 'planned',
        statusLabel: 'State-led · AKIC linkage unverified', coords: [308, 280], areaAc: 2483,
        sectors: 'Steel, manufacturing', nearest: 'Purulia',
        summary: [
          'Raghunathpur in Purulia — West Bengal’s “Jangal Sundari Karmanagari” — is frequently associated with AKIC in the media, but it does not appear in NICDC’s official AKIC node table. It is a state-led industrial township (~2,483 acres, steel-oriented) developed outside the NICDIT framework. We show it for completeness but flag its AKIC membership as unverified.',
        ],
        sources: [{ label: 'Silpasathi, Govt of West Bengal', url: 'https://silpasathi.wb.gov.in' }],
      },
    ],
    milestones: [
      { date: '28 Aug 2024', label: 'CCEA approves six AKIC nodes' },
      { date: 'Nov 2024', label: 'Agra/Prayagraj/Gaya state agreements executed' },
      { date: 'Jan 2025', label: 'Gaya and Agra–Prayagraj SPVs incorporated' },
      { date: 'Mar–May 2025', label: 'Environmental clearances (Prayagraj, Gaya, Rajpura)' },
      { date: 'Sep 2025', label: 'Rajpura EPC tender (Voyants PMC); Hisar SPV incorporated' },
      { date: 'Oct 2025', label: 'Gaya + Khurpia EPC tenders; Prayagraj EPC LoA (27 Oct)' },
    ],
    sources: [DPIIT, { label: 'DPIIT/NICDC status report, 31 Oct 2025', url: 'https://www.dpiit.gov.in/static/uploads/2025/11/34953d677cb89d642b15907555250523.pdf' }, { label: 'NICDC AKIC projects', url: 'https://nicdc.in' }],
  },
};

export const deepFor = (slug: string): CorridorDeep | undefined => corridorDeep[slug];
export const nodeBySlugs = (slug: string, node: string): DeepNode | undefined =>
  corridorDeep[slug]?.nodes.find((n) => n.slug === node);
export const allCorridorNodePairs = (): { corridor: string; node: string }[] =>
  Object.values(corridorDeep).flatMap((c) => c.nodes.map((n) => ({ corridor: c.slug, node: n.slug })));
