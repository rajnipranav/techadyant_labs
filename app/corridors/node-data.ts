// Deep per-node + per-corridor intelligence for corridor pages, node pages and the
// dark clickable map. Coordinates are in the shared INDIA_OUTLINE space (viewBox
// "34 6 448 548") — same system as data.ts `pts`. Sourced from the DPIIT/NICDC
// "Status of Industrial Corridor Projects" report (31 Oct 2025) + PIB / India
// Investment Grid / state portals. Project costs + CCEA dates are official; the
// investment-potential and jobs figures are PIB/IIG/state projections.

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

const DPIIT = { label: 'DPIIT/NICDC status report, 31 Oct 2025', url: 'https://www.dpiit.gov.in/static/uploads/2025/11/34953d677cb89d642b15907555250523.pdf' };

export const corridorDeep: Record<string, CorridorDeep> = {
  'amritsar-kolkata': {
    slug: 'amritsar-kolkata',
    intro: [
      'The Amritsar–Kolkata Industrial Corridor (AKIC) is the longest of India’s national industrial corridors at 1,839 km, threading seven states from Punjab to West Bengal along the Eastern Dedicated Freight Corridor (EDFC), the Ludhiana–Dankuni rail freight spine. NICDC develops it under the NICDIT framework, with a per-state SPV for each Integrated Manufacturing Cluster (IMC).',
      'The design rule is consistent: each IMC reserves at least 40% of its land for manufacturing and agro-processing, anchored to an EDFC station so finished goods can move to ports at rail-freight economics. The corridor’s influence band runs roughly 150–200 km on either side of the freight line.',
      'The headline shift came on 28 August 2024, when the Cabinet Committee on Economic Affairs approved six AKIC nodes in one stroke. A year on, the picture is no longer “all planned”: four nodes are in active EPC procurement or have awarded construction contracts, two are approved and pre-construction, and one (Jharkhand) is relocating after losing its original site.',
    ],
    facts: [
      { k: 'Length', v: '1,839 km' },
      { k: 'States', v: '7 (Punjab, Haryana, UP, Uttarakhand, Bihar, Jharkhand, West Bengal)' },
      { k: 'Backbone', v: 'Eastern Dedicated Freight Corridor (Ludhiana–Dankuni)' },
      { k: 'Developer', v: 'NICDC under NICDIT; per-node state SPVs' },
      { k: 'Influence band', v: '150–200 km either side of the EDFC' },
      { k: 'Land rule', v: '≥40% of each IMC reserved for manufacturing / agro-processing' },
      { k: 'Nodes', v: '6 CCEA-approved (28 Aug 2024) + 1 relocating + 1 state-led' },
    ],
    nodes: [
      {
        slug: 'rajpura-patiala', name: 'Rajpura–Patiala IMC', state: 'Punjab', stage: 'construction',
        statusLabel: 'EPC procurement', coords: [159, 174], areaAc: 1098, projectCostCr: 1367, investmentCr: 7500, jobs: 64000,
        sectors: 'General manufacturing', nearest: 'Rajpura (EDFC)',
        summary: [
          'Punjab’s AKIC node, between Rajpura and Patiala, is in active procurement. Environmental clearance was granted in May 2025, the state SPV (NICDC Punjab Industrial Corridor Development Corporation) is incorporated, the project-management consultant is on board, and the EPCC tender for trunk infrastructure was floated on 19 September 2025. Roughly 610 acres have been transferred to the SPV and ₹215.6 cr of equity released.',
        ],
        timeline: [
          { date: 'Aug 2024', label: 'CCEA approval' },
          { date: 'May 2025', label: 'Environmental clearance' },
          { date: 'Sep 2025', label: 'EPCC tender floated; land + equity transferred' },
        ],
        sources: [DPIIT],
      },
      {
        slug: 'hisar', name: 'Hisar IMC', state: 'Haryana', stage: 'approved',
        statusLabel: 'Approved, pre-construction', coords: [149, 191], areaAc: 2988, projectCostCr: 4680, investmentCr: 32417, jobs: 125000,
        sectors: 'Manufacturing, logistics, aerospace', anchors: 'Built around Maharaja Agrasen (Hisar) Airport', nearest: 'Hisar',
        summary: [
          'Hisar is the largest AKIC node by area (2,988 acres) and by investment potential (₹32,417 cr / ~1.25 lakh jobs), built around the Maharaja Agrasen airport to give the corridor an aerospace-and-logistics anchor. But it is also the slowest of the approved six: the state SPV was only incorporated on 25 September 2025 and land transfer to the SPV is still pending. Largest on paper, earliest in execution.',
        ],
        timeline: [
          { date: 'Aug 2024', label: 'CCEA approval' },
          { date: 'Aug 2025', label: 'State support / shareholders’ agreement executed' },
          { date: 'Sep 2025', label: 'SPV incorporated; land transfer pending' },
        ],
        sources: [DPIIT, { label: 'PIB PRID 2158558', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2158558' }],
      },
      {
        slug: 'khurpia', name: 'Khurpia IMC (Prag-Khurpia)', state: 'Uttarakhand', stage: 'construction',
        statusLabel: 'EPC procurement', coords: [196, 191], areaAc: 1002, projectCostCr: 1265, investmentCr: 6180, jobs: 75000,
        sectors: 'Manufacturing, agro-processing', nearest: 'Udham Singh Nagar',
        summary: [
          'The Uttarakhand node at Khurpia (Udham Singh Nagar) was CCEA-approved on 28 August 2024 and is now in EPC procurement: a second-call EPC tender was floated on 18 October 2025, ~500 acres transferred to the SPV and ₹207 cr of equity released. Environmental clearance dates to 2023 and the project-management consultant was onboarded in July 2025.',
        ],
        timeline: [
          { date: 'Aug 2024', label: 'CCEA approval' },
          { date: 'Jul 2025', label: 'PMC onboarded' },
          { date: 'Oct 2025', label: '2nd-call EPC tender; land + equity transferred' },
        ],
        sources: [DPIIT, { label: 'India Investment Grid', url: 'https://indiainvestmentgrid.gov.in/opportunities/nip-project/701661' }],
      },
      {
        slug: 'agra', name: 'Agra IMC', state: 'Uttar Pradesh', stage: 'approved',
        statusLabel: 'Approved · court bottleneck', coords: [178, 214], areaAc: 1058, investmentCr: 3400,
        sectors: 'E-mobility, leather, garments, food processing, packaging', nearest: 'Agra',
        summary: [
          'Agra is CCEA-approved with its SPV (jointly with Prayagraj) incorporated on 30 January 2025 and environmental clearance from 2023. Its bottleneck is unusual: tree-felling approval inside the Taj Trapezium Zone is pending before the Supreme Court, which gates site preparation. Sector positioning leans to e-mobility, leather and garments — Agra’s existing clusters.',
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
        statusLabel: 'Construction contract awarded', coords: [228, 238], areaAc: 351, investmentCr: 1600,
        sectors: 'Industrial / manufacturing', nearest: 'Prayagraj (Saraswati Hi-Tech City)',
        summary: [
          'Prayagraj is the most advanced node on the entire corridor. The letter of award to the EPC contractor for trunk-infrastructure works was issued on 27 October 2025 — i.e. construction is contracted, not merely tendered. It is the smallest AKIC node (351 acres, partly inside the existing Saraswati Hi-Tech City), which is precisely why it could move fastest.',
        ],
        timeline: [
          { date: 'Aug 2024', label: 'CCEA approval' },
          { date: 'Mar 2025', label: 'Environmental clearance' },
          { date: 'Oct 2025', label: 'EPC contractor LoA issued (trunk infrastructure)' },
        ],
        sources: [DPIIT],
      },
      {
        slug: 'gaya', name: 'Gaya IMC', state: 'Bihar', stage: 'construction',
        statusLabel: 'EPC procurement', coords: [283, 260], areaAc: 1670, projectCostCr: 1339, investmentCr: 16524, jobs: 109000,
        sectors: 'Manufacturing, agro-processing', anchors: 'Dobhi / Sherghati', nearest: 'Gaya',
        summary: [
          'Bihar’s Gaya node (at Dobhi/Sherghati) is one of the corridor’s strongest stories: ₹16,524 cr of investment potential and ~1.09 lakh projected jobs on 1,670 acres. Environmental clearance came in March 2025, the SPV (Bihar Integrated Manufacturing City Gaya Ltd) is live, the consultant onboarded in July 2025, and a second-call EPC tender was floated on 16 October 2025 with 414 acres and ₹132 cr of equity transferred.',
        ],
        timeline: [
          { date: 'Aug 2024', label: 'CCEA approval' },
          { date: 'Jan 2025', label: 'SPV (BIMCGL) incorporated' },
          { date: 'Mar 2025', label: 'Environmental clearance' },
          { date: 'Oct 2025', label: '2nd-call EPC tender; land + equity transferred' },
        ],
        sources: [DPIIT, { label: 'India Investment Grid', url: 'https://indiainvestmentgrid.gov.in/opportunities/project/617108' }],
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
      { date: 'Sep 2025', label: 'Rajpura EPCC tender; Hisar SPV incorporated' },
      { date: 'Oct 2025', label: 'Gaya + Khurpia EPC tenders; Prayagraj EPC LoA (27 Oct)' },
    ],
    sources: [DPIIT, { label: 'Wikipedia: AKIC', url: 'https://en.wikipedia.org/wiki/Amritsar%E2%80%93Kolkata_Industrial_Corridor' }],
  },
};

export const deepFor = (slug: string): CorridorDeep | undefined => corridorDeep[slug];
export const nodeBySlugs = (slug: string, node: string): DeepNode | undefined =>
  corridorDeep[slug]?.nodes.find((n) => n.slug === node);
export const allCorridorNodePairs = (): { corridor: string; node: string }[] =>
  Object.values(corridorDeep).flatMap((c) => c.nodes.map((n) => ({ corridor: c.slug, node: n.slug })));
