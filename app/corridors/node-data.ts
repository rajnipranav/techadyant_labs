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
  'delhi-mumbai': {
    slug: 'delhi-mumbai',
    intro: [
      'The Delhi–Mumbai Industrial Corridor (DMIC) is the programme’s flagship and by far its most advanced — the first corridor sanctioned, the model the others copy. It runs ~1,504 km along the Western Dedicated Freight Corridor (Dadri to Jawaharlal Nehru Port), and NICDC (formerly DMICDC) develops it with Japan as a 26% equity partner via JBIC, against a programme-scale figure of ~US$90 billion.',
      'Four of its nine sub-nodes are genuinely operational — dedicated to the nation by the Prime Minister, with plots allotted and units producing. Two are the corridor’s marquee bets: Dholera, now positioned as India’s first semiconductor city around Tata Electronics’ ₹91,000-crore fab; and AURIC near Aurangabad, India’s first greenfield smart industrial city, anchoring a fast-filling EV-and-auto cluster (Toyota, JSW, Ather, Hyosung).',
      'The rest of the corridor is logistics hubs under construction (Dadri, Nangal Chaudhary) and CCEA-approved industrial areas still tendering trunk-infrastructure contracts (Dighi Port, Jodhpur–Pali–Marwar, Khushkhera–Bhiwadi–Neemrana). Unlike the younger corridors, DMIC already has deep, named, large-ticket tenants — so its operational nodes carry real company files, not just projections.',
    ],
    facts: [
      { k: 'Length', v: '~1,504 km' },
      { k: 'States', v: 'Delhi NCR + 6 (UP, Haryana, Rajasthan, MP, Gujarat, Maharashtra)' },
      { k: 'Backbone', v: 'Western Dedicated Freight Corridor (Dadri–JNPT)' },
      { k: 'Developer', v: 'NICDC (ex-DMICDC); Japan/JBIC 26% equity' },
      { k: 'Programme scale', v: '~US$90 billion' },
      { k: 'Sub-nodes', v: '9 (4 operational and PM-dedicated)' },
      { k: 'First sanctioned', v: 'Projects approved 2014–15 — the first corridor' },
    ],
    nodes: [
      {
        slug: 'dholera-sir', name: 'Dholera SIR', state: 'Gujarat', stage: 'operational',
        statusLabel: 'Operational · Phase-1 activation; India’s semiconductor city', coords: [90.8, 308.8],
        areaAc: 227000, investmentCr: 91000, sectors: 'Semiconductors, solar, chemicals',
        nearest: 'Dholera (WDFC) · Ahmedabad 100 km',
        developer: 'Dholera Industrial City Development Ltd (DICDL), incorporated 2016',
        companies: [
          { name: 'Tata Electronics (with PSMC, Taiwan)', sector: 'Semiconductors', commitment: '₹91,000 cr 12-inch wafer fab — India’s first; first chips ~2026' },
          { name: 'Tata Chemicals', sector: 'Chemicals', commitment: 'Anchor of the allotted industrial plots' },
          { name: 'Tata Power Solar', sector: 'Solar power', commitment: '300 MW commissioned of the 1,000 MW Dholera solar park' },
          { name: 'ReNew', sector: 'Solar cell & module mfg', commitment: '~₹1,200 cr facility' },
        ],
        industries: ['Semiconductors & electronics', 'Solar / renewable manufacturing', 'Chemicals', 'Heavy & defence manufacturing', 'Logistics'],
        infrastructure: ['22.5 sq km Phase-1 activation area — trunk infrastructure complete', '6-lane Ahmedabad–Dholera Expressway (NHAI)', 'Greenfield Dholera International Airport under construction (AAI–Gujarat–NICDIT JV)', 'Bhimnath–Dholera rail link approved; WDFC backbone', '1,000 MW solar park (300 MW live); smart underground utilities', '~495 acres allotted; ~1,091 acres industrial land still available'],
        incentives: 'Special Investment Region (SIR) Act benefits; fully serviced plots; marketed as India’s first semiconductor city.',
        summary: [
          'Dholera is the corridor’s flagship and largest node — a ~920 sq km greenfield Special Investment Region whose 22.5 sq km activation area has finished trunk infrastructure. Its identity now turns on one project: Tata Electronics’ ₹91,000-crore semiconductor fab, the largest single investment anywhere on the national corridors, around which a chemicals-and-solar cluster is forming.',
        ],
        sections: [{ heading: 'Why it matters', body: ['Dholera converts the corridor from a logistics story into a strategic-technology one. If the Tata–PSMC fab reaches volume (first chips targeted ~2026, though a 2026 report flags possible schedule slip), Dholera becomes India’s semiconductor anchor — and the clearest proof that corridor land + power + an airport can land a fab.'] }],
        timeline: [
          { date: '2014', label: 'Environmental clearance; SIR notified' },
          { date: '2016', label: 'DICDL SPV incorporated' },
          { date: 'Mar 2024', label: 'Tata Electronics ₹91,000 cr fab approved' },
          { date: '~2026', label: 'First Made-in-India chips targeted' },
        ],
        sources: [DPIIT, { label: 'PIB — Tata fab fiscal support (PRID 2108602)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2108602' }, { label: 'Tata — first Indian fab, Dholera', url: 'https://www.tata.com/newsroom/business/first-indian-fab-semiconductor-dholera' }],
      },
      {
        slug: 'auric-shendra-bidkin', name: 'Shendra–Bidkin (AURIC)', state: 'Maharashtra', stage: 'operational',
        statusLabel: 'Operational · India’s first greenfield smart industrial city', coords: [143, 337],
        areaAc: 9930, investmentCr: 71343, jobs: 62405, sectors: 'EV & auto, textiles, chemicals, steel',
        nearest: 'Chhatrapati Sambhajinagar (Aurangabad)',
        developer: 'Maharashtra Industrial Township Ltd (MITL, ex-AITL), incorporated 2014',
        companies: [
          { name: 'JSW Green Mobility', sector: 'Electric vehicles', commitment: '₹27,200 cr · 636 acres (Bidkin)' },
          { name: 'Toyota Kirloskar Motor', sector: 'Automobiles', commitment: '~₹20,000 cr · ~827 acres; production ~2029' },
          { name: 'Hyosung', sector: 'Technical textiles', commitment: 'Official anchor · 100 acres' },
          { name: 'Ather Energy', sector: 'Electric vehicles', commitment: 'Bidkin allotment' },
          { name: 'Lubrizol', sector: 'Specialty chemicals', commitment: 'Bidkin' },
          { name: 'Junna Solar Systems', sector: 'Solar cells', commitment: '₹400 cr' },
          { name: 'Siemens · Perkins · NLMK', sector: 'Engineering / steel', commitment: 'Shendra cluster' },
        ],
        industries: ['Automotive & EV manufacturing', 'Auto components', 'Technical textiles', 'Specialty chemicals', 'Steel', 'Green energy / solar'],
        infrastructure: ['~10,000 acres (60% industrial); Shendra ₹1,533 cr + Bidkin ₹6,414 cr trunk infrastructure (complete/under way)', 'Smart-city utilities: 24×7 power & water, zero-wastewater/circular, ICT surveillance, walk-to-work', '326 plots over ~3,277 acres allotted', 'Aurangabad airport + WDFC + rail linkage'],
        incentives: 'India’s first greenfield smart industrial city; Maharashtra industrial incentives; plug-and-play serviced plots.',
        summary: [
          'AURIC, near Chhatrapati Sambhajinagar (Aurangabad), is India’s first greenfield smart industrial city and the corridor’s fastest-filling node. Its EV-and-automobile cluster is the standout: JSW Green Mobility (₹27,200 cr) and Toyota Kirloskar (~₹20,000 cr) have taken large parcels, alongside anchor Hyosung, Ather, Lubrizol and a six-company Bidkin solar/engineering allotment in 2025.',
        ],
        sections: [{ heading: 'Why it matters', body: ['AURIC is the template working as designed — serviced smart-city land translating directly into marquee manufacturing commitments. Its self-reported six-year aggregate (~₹71,343 cr potential, ~62,405 jobs) runs ahead of the official plot tally, but the named tenants alone make it the corridor’s most proven industrial city after Dholera.'] }],
        timeline: [
          { date: '2014', label: 'AITL/MITL SPV incorporated' },
          { date: 'Sep 2019', label: 'AURIC Shendra dedicated to the nation (PM)' },
          { date: 'Oct 2024', label: 'JSW Green Mobility ₹27,200 cr allotment' },
          { date: 'Sep 2024', label: 'AURIC Bidkin dedicated to the nation (PM)' },
        ],
        sources: [DPIIT, { label: 'PIB — AURIC Bidkin allotments (PRID 2159657)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2159657' }, { label: 'Business Standard — JSW Green Mobility', url: 'https://www.business-standard.com/companies/news/jsw-green-mobility-gets-636-acre-land-for-maharashtra-manufacturing-plant-124101001239_1.html' }],
      },
      {
        slug: 'iitgnl-greater-noida', name: 'Integrated Industrial Township, Greater Noida (IITGNL)', state: 'Uttar Pradesh', stage: 'operational',
        statusLabel: 'Operational · dedicated to the nation 2024', coords: [177, 205],
        areaAc: 748, investmentCr: 2000, sectors: 'Electronics & appliances', nearest: 'Greater Noida · Noida International Airport',
        developer: 'DMIC Integrated Industrial Township Greater Noida Ltd (IITGNL), incorporated 2014',
        companies: [
          { name: 'Haier', sector: 'Home appliances', commitment: 'Anchor · 123.7 acres; ~₹2,000 cr (Phase 1 + 2)' },
          { name: 'Chenfeng Tech', sector: 'Manufacturing', commitment: 'Allotted plot' },
        ],
        industries: ['Electronics & home appliances', 'Light & electrical manufacturing', 'Renewable-energy components'],
        infrastructure: ['747.5 acres transferred; ₹1,097.5 cr trunk infrastructure (complete)', 'Plug-and-play utilities; 26 plots over 261 acres allotted', 'Yamuna Expressway + WDFC + the upcoming Noida International Airport (Jewar)'],
        incentives: 'Serviced plug-and-play plots; UP industrial incentives; NCR location with airport on the doorstep.',
        summary: [
          'IITGNL at Greater Noida was dedicated to the nation in January 2024. Anchored by Haier’s appliance complex (123.7 acres, ~₹2,000 cr across two phases), it is a compact, fast-absorbing electronics-and-appliances township benefiting from the NCR market and the forthcoming Noida International Airport.',
        ],
        timeline: [
          { date: '2014', label: 'IITGNL SPV incorporated' },
          { date: '2018', label: 'Haier anchor allotment (123.7 acres)' },
          { date: 'Jan 2024', label: 'Dedicated to the nation (PM)' },
        ],
        sources: [DPIIT, { label: 'Business Standard — Haier Phase-2', url: 'https://www.business-standard.com/companies/news/haier-s-iitgnl-unit-receives-govt-approval-rs-400-cr-investment-expected-123102001384_1.html' }],
      },
      {
        slug: 'vikram-udyogpuri', name: 'Vikram Udyogpuri', state: 'Madhya Pradesh', stage: 'operational',
        statusLabel: 'Operational · near fully allotted', coords: [150, 285],
        areaAc: 1096, sectors: 'Food processing, manufacturing', nearest: 'Ujjain / Dewas',
        developer: 'DMIC Vikram Udyogpuri Ltd, incorporated 2010',
        companies: [{ name: 'Amul', sector: 'Dairy / food processing', commitment: 'Anchor investor' }],
        industries: ['Food & dairy processing', 'General manufacturing'],
        infrastructure: ['1,026 acres transferred; ₹749.1 cr trunk infrastructure (complete)', '67 plots over 519 acres allotted — effectively near-full (≈2 acres industrial left)', 'SH-18 near Ujjain–Dewas; WDFC linkage'],
        incentives: 'MP industrial incentives; fully serviced plots — among the first DMIC nodes to fill.',
        summary: [
          'Vikram Udyogpuri near Ujjain was dedicated to the nation in October 2023 and is now effectively full — 519 of ~1,026 serviced acres allotted with only marginal industrial land left, anchored by Amul. A smaller node, but proof that DMIC serviced land absorbs demand in the right location.',
        ],
        timeline: [
          { date: '2010', label: 'SPV incorporated' },
          { date: 'Oct 2023', label: 'Dedicated to the nation (PM) at Ujjain' },
        ],
        sources: [DPIIT],
      },
      {
        slug: 'nangal-chaudhary-imlh', name: 'IMLH Nangal Chaudhary', state: 'Haryana', stage: 'construction',
        statusLabel: 'Under construction · logistics PPP (RFP stage)', coords: [152, 232],
        areaAc: 886, sectors: 'Multi-modal logistics, EXIM', nearest: 'Nangal Chaudhary (WDFC)',
        developer: 'NICDC Haryana Multi-Modal Logistic Hub Project Ltd, incorporated 2016',
        industries: ['Multi-modal logistics', 'EXIM / warehousing', 'Cold storage & de-stuffing'],
        infrastructure: ['~886 acres (689 transferred); 408-acre Phase-1A', 'External rail by DFCCIL complete (WDFC link)', 'PPPAC appraised Jul 2025; RFP for the logistics operator floated 22 Aug 2025'],
        summary: [
          'Nangal Chaudhary is a multi-modal logistics hub, not a tenant-driven industrial city — so it has no manufacturing anchors. Its external WDFC rail link is built and the operator PPP went to RFP in August 2025; it functions as the corridor’s western-Haryana freight gateway.',
        ],
        sources: [DPIIT],
      },
      {
        slug: 'dadri-boraki', name: 'MMLH Dadri + MMTH Boraki', state: 'Uttar Pradesh', stage: 'construction',
        statusLabel: 'Under construction · logistics + transport hub',
        areaAc: 1183, sectors: 'Logistics, multi-modal transport', nearest: 'Dadri (WDFC junction)',
        developer: 'NICDC / DFCCIL · CONCOR (PPP)',
        industries: ['Multi-modal logistics & warehousing', 'Passenger multi-modal transport (MMTH)'],
        infrastructure: ['MMLH 825 acres + MMTH Boraki 358 acres', 'MMTH declared a "Special Railway Project"; New Dadri (WDFC)→MMLH rail 5.1 km', 'Concessionaire NIT floated 11 Oct 2025'],
        summary: [
          'The Dadri MMLH (logistics) and Boraki MMTH (passenger transport) hubs sit at the corridor’s northern WDFC junction. Both are PPP logistics/transport assets rather than industrial cities; concessionaire selection began in October 2025.',
        ],
        sources: [DPIIT],
      },
      {
        slug: 'jodhpur-pali-marwar', name: 'Jodhpur–Pali–Marwar (JPMIA)', state: 'Rajasthan', stage: 'approved',
        statusLabel: 'Approved · Phase-A EPC tendering', coords: [114, 245],
        areaAc: 8121, sectors: 'General manufacturing', nearest: 'Marwar (WDFC)',
        summary: [
          'Jodhpur–Pali–Marwar is a large (8,121-acre) approved industrial area whose 1,577-acre Phase-A went to EPC tender in August 2025. Pre-construction: the headline opportunity is the scale, but trunk infrastructure is not yet built.',
        ],
        timeline: [{ date: 'Aug 2025', label: 'Phase-A EPCC tender floated' }],
        sources: [DPIIT],
      },
      {
        slug: 'khushkhera-bhiwadi-neemrana', name: 'Khushkhera–Bhiwadi–Neemrana (KBNIR)', state: 'Rajasthan', stage: 'approved',
        statusLabel: 'Approved · master-planning', coords: [160, 222],
        areaAc: 1378, sectors: 'General manufacturing', nearest: 'Rewari–Bhiwadi belt',
        summary: [
          'KBNIR in the Delhi–Jaipur NCR fringe is an approved node with ~98% of its 1,378 acres possessed, awaiting land-use change and master-planning before EPC. It rides an already-industrialised Bhiwadi–Neemrana belt, which makes it lower-risk than a pure greenfield site.',
        ],
        sources: [DPIIT],
      },
      {
        slug: 'dighi-port', name: 'Dighi Port Industrial Area (DPIA)', state: 'Maharashtra', stage: 'approved',
        statusLabel: 'Approved · EPC evaluation', coords: [107, 358],
        areaAc: 6056, sectors: 'Port-linked manufacturing, logistics', nearest: 'Dighi Port (Konkan coast)',
        summary: [
          'Dighi Port Industrial Area is a 6,056-acre coastal node (Phase-1 2,667 acres) whose EPC evaluation concluded in October 2025 — the southern, port-linked counterpart to the corridor’s inland cities. Pre-construction, but the closest of the approved nodes to award.',
        ],
        timeline: [{ date: 'Oct 2025', label: 'EPC final evaluation concluded' }],
        sources: [DPIIT],
      },
    ],
    milestones: [
      { date: '2014–15', label: 'DMIC projects approved — the first corridor' },
      { date: 'Sep 2019', label: 'AURIC Shendra dedicated to the nation' },
      { date: 'Oct 2023', label: 'Vikram Udyogpuri dedicated (Ujjain)' },
      { date: 'Jan 2024', label: 'IITGNL Greater Noida dedicated' },
      { date: 'Mar 2024', label: 'Tata Electronics ₹91,000 cr Dholera fab approved' },
      { date: 'Sep 2024', label: 'AURIC Bidkin dedicated' },
      { date: '2025', label: 'EPC tenders for Dighi, JPMIA, Dadri, Nangal Chaudhary' },
    ],
    sources: [DPIIT, { label: 'NICDC — DMIC', url: 'https://nicdc.in/projects/national-industrial-corridor-development-programme/delhi-mumbai-industrial-corridor-dmic' }, { label: 'Invest India — Blueprints of success', url: 'https://www.investindia.gov.in/blogs/blueprints-success' }],
  },
  'vizag-chennai': {
    slug: 'vizag-chennai',
    intro: [
      'The Visakhapatnam–Chennai Industrial Corridor (VCIC) is India’s first coastal industrial corridor — the ~800 km Andhra Pradesh first phase of the larger East Coast Economic Corridor (Kolkata–Tuticorin). Unusually for the national corridors, its lead partner is the Asian Development Bank, which approved US$631 million in 2016 (a US$500 m multitranche facility plus a US$125 m policy loan), with a further ~US$141 m Tranche-2 sanctioned in 2023.',
      'It is executed by the Andhra Pradesh government through APIIC and node SPVs under the AP Industrial Corridor Development Authority (APICDA), not NICDC. Of its identified nodes, the status hierarchy is clear: Kopparthy is operational (an electronics cluster with Dixon as anchor), Visakhapatnam and Chittoor are under construction (ADB Tranche-2 trunk works, foundation stones laid), and Machilipatnam and Donakonda were identified but never prioritised.',
      'VCIC’s long-run ADB case is large — manufacturing share of corridor-district GDP rising past 20% and up to ~9.5 million jobs by 2045 — but the live, on-the-ground story today is concentrated at Kopparthy and the Nakkapalli pharma zone near Vizag.',
    ],
    facts: [
      { k: 'Length', v: '~800 km (Andhra Pradesh coast)' },
      { k: 'Part of', v: 'East Coast Economic Corridor (ECEC) — phase 1' },
      { k: 'Lead partner', v: 'Asian Development Bank (ADB)' },
      { k: 'ADB finance', v: 'US$631 m (2016) + ~US$141 m Tranche-2 (2023)' },
      { k: 'Developer', v: 'GoAP via APIIC + node SPVs; APICDA authority' },
      { k: 'Nodes', v: 'Vizag, Chittoor, Kopparthy, Machilipatnam, Donakonda' },
      { k: 'Long-run target', v: '~9.5 m jobs in corridor districts by 2045 (ADB)' },
    ],
    nodes: [
      {
        slug: 'kopparthy', name: 'Kopparthy (KIA / YSR EMC)', state: 'Andhra Pradesh', stage: 'operational',
        statusLabel: 'Operational · electronics cluster live', coords: [193, 419],
        areaAc: 2596, projectCostCr: 1264, sectors: 'Electronics, MDF, solar, Li-ion',
        nearest: 'Kadapa (YSR district)',
        developer: 'APIIC / Kopparthy Industrial Area (KIA) node; YSR Electronic Manufacturing Cluster under MeitY EMC-2.0',
        companies: [
          { name: 'Dixon Technologies', sector: 'Electronics (EMS)', commitment: '₹300 cr · ~1,800 jobs · 70 acres (EMC anchor)' },
          { name: 'Greenpanel Industries', sector: 'MDF / wood panels', commitment: 'Operating plant in the hub' },
          { name: 'Digicon Solution', sector: 'Electronics', commitment: 'Part of a ~₹600 cr investor group' },
          { name: 'Celkon Resolute', sector: 'Mobiles / electronics', commitment: 'Part of the ~₹600 cr investor group' },
        ],
        industries: ['Electronics manufacturing (EMS)', 'MDF / wood panels', 'Solar PV modules', 'Li-ion batteries', 'MSME manufacturing'],
        infrastructure: ['YSR Jagananna Mega Industrial Hub + EMC inaugurated Dec 2021', 'YSR Electronic Manufacturing Cluster: 801 acres under MeitY EMC-2.0 (₹350 cr central grant)', 'KIA Phase-1: 2,595.74 acres, ~₹1,264 cr trunk infrastructure', 'Ready-to-occupy sheds and serviced plots; on the VCIC alignment near Kadapa'],
        incentives: 'MeitY EMC-2.0 grant + AP electronics manufacturing incentives; plug-and-play sheds — the corridor’s most ready-to-occupy node.',
        summary: [
          'Kopparthy is the only VCIC node with units on the ground. The YSR Electronic Manufacturing Cluster (801 acres, backed by MeitY’s EMC-2.0 scheme) is anchored by Dixon Technologies (₹300 cr, ~1,800 jobs) and includes an operating Greenpanel MDF plant, with a further ~₹600 cr group of electronics investors. It is the corridor’s electronics-manufacturing proof point.',
        ],
        sections: [{ heading: 'Anchor tenants & demand signals', body: ['Unlike the corridor’s greenfield nodes, Kopparthy already has a named anchor (Dixon) and operating units — the clearest demand signal on VCIC. A reported ~₹600 cr four-company electronics group (Digicon, Celkon and others) is single-source and worth re-confirming; battery (Avenge) and solar (Ronu) interest is at preliminary-talks stage.'] }],
        timeline: [
          { date: 'Dec 2021', label: 'Mega Industrial Hub + EMC inaugurated' },
          { date: '2022', label: 'MeitY EMC-2.0 grant; Dixon anchor allotment' },
        ],
        sources: [
          { label: 'APEDB — Electronic Manufacturing Cluster', url: 'https://apedb.gov.in/electronic-manufacturing-cluster.html' },
          { label: 'BizzBuzz — Dixon at Kadapa EMC', url: 'https://www.bizzbuzz.news/economy/meity-aid-to-kadapa-emc-dixon-to-invest-rs-300-crore-1011502' },
        ],
      },
      {
        slug: 'visakhapatnam', name: 'Visakhapatnam node (Nakkapalli / Rambilli)', state: 'Andhra Pradesh', stage: 'construction',
        statusLabel: 'Under construction · ADB Tranche-2 works', coords: [258.2, 374.2],
        areaAc: 2002, investmentCr: 1877, sectors: 'Pharma / bulk drugs, chemicals', nearest: 'Anakapalli / Visakhapatnam',
        developer: 'Visakhapatnam Industrial Node Development Corporation Ltd (SPV, incorporated Sep 2018)',
        industries: ['Pharmaceuticals & bulk drugs', 'Specialty chemicals', 'General manufacturing'],
        infrastructure: ['AP Bulk Drug Park at Nakkapalli: ~2,001.8 acres; GoAP sanction ₹1,876.66 cr; PM foundation stone 8 Jan 2025', 'Start-up clusters: Rambilli (160 ha) + Nakkapalli (441 ha)', 'Bulk water transmission line + widening of the 13.8 km Atchutapuram–Anakapalli road to NH-16 (ADB Tranche-2)', 'Visakhapatnam Port + NH-16 corridor'],
        incentives: 'Common-infrastructure pharma zone (Bulk Drug Park scheme); AP industrial incentives; Vizag region targeting a leading pharma cluster.',
        summary: [
          'The Visakhapatnam node is being built around the AP Bulk Drug Park at Nakkapalli (~2,001 acres, ₹1,876.66 cr sanction), whose foundation stone the Prime Minister laid in January 2025, plus the Rambilli cluster. It is a common-infrastructure pharma-and-chemicals zone funded under ADB Tranche-2 — trunk works under way.',
        ],
        sections: [noTenants('The Bulk Drug Park is a shared-infrastructure pharma zone rather than a single-anchor site, so tenant allotment follows the common facilities; no individual companies are publicly committed yet as of early 2025.')],
        timeline: [
          { date: 'Sep 2018', label: 'Node SPV incorporated' },
          { date: '2023', label: 'ADB Tranche-2 infrastructure sanctioned' },
          { date: 'Jan 2025', label: 'PM foundation stone — Nakkapalli Bulk Drug Park' },
        ],
        sources: [
          { label: 'PIB PRID 2091262', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2091262' },
          { label: 'ADB project 48434-004 (Tranche 2)', url: 'https://www.adb.org/projects/48434-004/main' },
        ],
      },
      {
        slug: 'chittoor', name: 'Chittoor node (Srikalahasti–Yerpedu / Naidupeta)', state: 'Andhra Pradesh', stage: 'construction',
        statusLabel: 'Under construction · ADB Tranche-2 works', coords: [198, 442],
        sectors: 'Electronics, auto, textiles', nearest: 'Tirupati / Sri City belt',
        developer: 'Chittoor Industrial Node Development Corporation Ltd (SPV, incorporated Oct 2018)',
        industries: ['Electronics', 'Automobiles & components', 'Textiles', 'General manufacturing'],
        infrastructure: ['Start-up clusters: Chittoor-South (938 ha) + Naidupeta', 'ADB Tranche-2: internal infrastructure + a 9.5 km access road (Chittoor-South) and 8.7 km access road (Naidupeta)', 'Earlier ADB works: Yerpedu–Srikalahasti energy subproject; Naidupeta economic zone + effluent treatment', 'Adjacent to the Tirupati–Sri City manufacturing belt; near Chennai'],
        incentives: 'AP industrial incentives; sits beside the established Sri City / Tirupati ecosystem, lowering ramp-up risk.',
        summary: [
          'The Chittoor node — Chittoor-South plus the Naidupeta cluster near Tirupati — is the corridor’s southern, Chennai-facing anchor, with ADB Tranche-2 funding internal infrastructure and access roads. The existing Naidupeta APIIC park already hosts operating units, giving the broader node industry on the ground even as the new VCIC cluster is built.',
        ],
        sections: [{ heading: 'Anchor tenants & demand signals', body: ['The adjacent Naidupeta APIIC park already hosts operating units — Hindustan National Glass, Loyal Textiles, Ardee Industries and Prime Electric among them — but these predate the VCIC cluster and sit around the node rather than as new VCIC-cluster allotments. No new anchor for the VCIC Chittoor-South cluster is publicly confirmed yet; the Sri City/Tirupati electronics belt next door is the demand catchment.'] }],
        timeline: [
          { date: 'Oct 2018', label: 'Node SPV incorporated' },
          { date: '2023', label: 'ADB Tranche-2 internal infrastructure + access roads' },
        ],
        sources: [{ label: 'ADB project 48434-004 (Tranche 2)', url: 'https://www.adb.org/projects/48434-004/main' }],
      },
      {
        slug: 'machilipatnam', name: 'Machilipatnam node', state: 'Andhra Pradesh', stage: 'planned',
        statusLabel: 'Identified · not prioritised', coords: [227, 395],
        sectors: 'Port-linked manufacturing', nearest: 'Machilipatnam (Krishna)',
        summary: [
          'Machilipatnam was identified as a VCIC node but not prioritised — ADB master planning was completed only for Visakhapatnam and Chittoor, so there is no VCIC-cluster construction or named tenant here. (Separate Machilipatnam port/SEZ activity exists but is not the VCIC node.)',
        ],
        sources: [{ label: 'PIB PRID 1579552', url: 'https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1579552' }],
      },
      {
        slug: 'donakonda', name: 'Donakonda node', state: 'Andhra Pradesh', stage: 'planned',
        statusLabel: 'Identified · not prioritised', coords: [208, 410],
        sectors: 'General manufacturing', nearest: 'Donakonda (Prakasam)',
        summary: [
          'Donakonda in Prakasam district is an identified VCIC node that was not prioritised for development — no master plan, cluster works or tenants. It remains a watch-list location rather than an investable node today.',
        ],
        sources: [{ label: 'PIB PRID 1579552', url: 'https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1579552' }],
      },
    ],
    milestones: [
      { date: 'Sep 2016', label: 'ADB approves US$631 m for VCIC' },
      { date: 'Oct 2017', label: 'APICDA constituted' },
      { date: '2018', label: 'Visakhapatnam + Chittoor node SPVs incorporated' },
      { date: 'Dec 2021', label: 'Kopparthy Mega Industrial Hub + EMC inaugurated' },
      { date: '2023', label: 'ADB Tranche-2 (~US$141 m) sanctioned' },
      { date: 'Jan 2025', label: 'PM foundation stone — Nakkapalli Bulk Drug Park' },
    ],
    sources: [
      { label: 'ADB — VCIC (48434-005)', url: 'https://www.adb.org/projects/48434-005/main' },
      { label: 'ADB — VCIC Tranche 2 (48434-004)', url: 'https://www.adb.org/projects/48434-004/main' },
      { label: 'AP Industries — VCIC', url: 'https://www.apindustries.gov.in/VCIC/' },
    ],
  },
  'chennai-bengaluru': {
    slug: 'chennai-bengaluru',
    intro: [
      'The Chennai–Bengaluru Industrial Corridor (CBIC) runs ~560 km along the NH-48 axis across three southern states — Tamil Nadu, Andhra Pradesh and Karnataka — with the master plan prepared by JICA and development led by NICDC (GoI 49%, JBIC 26%). Its 20-year master-plan estimate runs to ~US$181 billion, dominated by energy and transport.',
      'It has three Phase-1 nodes. The CCEA approved trunk infrastructure for two of them on 30 December 2020 — Krishnapatnam (₹2,139 cr) and Tumakuru (₹1,702 cr) — and both are now under construction toward plug-and-play readiness around 2026–27. The third, Ponneri in Tamil Nadu, remains at master-plan stage.',
      'Tumakuru is the corridor’s most-activated node, and unusually it already has named industrial momentum: a co-located Japanese Industrial Township that is fully occupied, plus a new 300-acre Japanese township announced in 2025. Krishnapatnam (KRIS City) is the large port-linked bet next to Krishnapatnam Port; Ponneri is an engineering hub still on the drawing board.',
    ],
    facts: [
      { k: 'Length', v: '~560 km along NH-48 (Chennai–Bengaluru)' },
      { k: 'States', v: 'Tamil Nadu, Andhra Pradesh, Karnataka (16 districts)' },
      { k: 'Developer', v: 'NICDC (GoI 49% / JBIC 26%); state SPVs (KIADB, SIPCOT, APIIC)' },
      { k: 'Master plan', v: 'JICA — Comprehensive Integrated Regional Master Plan' },
      { k: 'Programme estimate', v: '~US$181 bn over 20 years' },
      { k: 'Nodes', v: 'Tumakuru, Krishnapatnam (KRIS City), Ponneri' },
      { k: 'CCEA approval', v: 'Tumakuru + Krishnapatnam trunk infra, 30 Dec 2020' },
    ],
    nodes: [
      {
        slug: 'tumakuru', name: 'Tumakuru node (Vasanthanarasapura)', state: 'Karnataka', stage: 'construction',
        statusLabel: 'Under construction · Phase-A allotment open', coords: [169, 440],
        areaAc: 8484, projectCostCr: 1702, jobs: 88500, sectors: 'Precision mfg, electronics, auto, machine tools',
        nearest: 'Tumakuru · ~120 km from Bengaluru (NH-48)',
        developer: 'CBIC Tumakuru Industrial Township Ltd (state SPV via KIADB)',
        companies: [
          { name: 'Japan Industrial Township (existing, 160 acres)', sector: 'Japanese precision mfg / auto / electronics', commitment: '107 companies — fully occupied' },
          { name: 'New 300-acre Japanese Industrial Township (JIT)', sector: 'Japanese manufacturing', commitment: 'Announced Nov 2025; allotment opening' },
        ],
        industries: ['Precision manufacturing', 'Electronics', 'Automotive & components', 'Machine tools'],
        infrastructure: ['~8,484-acre node (3 phases); Phase-A activation ~1,722 acres acquired', 'Trunk infrastructure ₹1,701.81 cr (CCEA-approved 2020); plug-and-play targeted late 2026', 'NH-48 frontage; rail links to Chennai and Bengaluru ports', 'Co-located Japanese Industrial Township ecosystem at Vasanthanarasapura'],
        incentives: 'Karnataka industrial incentives + a dedicated Japanese-township track; Phase-A industrial-plot allotment open (late 2025).',
        summary: [
          'Tumakuru, near Bengaluru on NH-48, is the corridor’s most-activated node — PM-foundation in 2023, Phase-A trunk infrastructure under way, and plot allotment now open. Its distinctive asset is the co-located Japanese Industrial Township: an existing 160-acre park with 107 companies fully occupied, now extended by a new 300-acre Japanese township announced in 2025.',
        ],
        sections: [{ heading: 'Anchor tenants & demand signals', body: ['Individual CBIC Phase-A allottees are not yet publicly named, but Tumakuru has the strongest demand signal on the corridor: the adjoining Japanese Industrial Township is fully occupied by 107 firms, and a 300-acre extension was announced in November 2025 — a rare case of proven, named-cluster demand pulling a corridor node forward.'] }],
        timeline: [
          { date: 'Dec 2020', label: 'CCEA approves trunk infrastructure' },
          { date: '2023', label: 'PM lays foundation stone for the township' },
          { date: 'Nov 2025', label: '300-acre Japanese township announced; Phase-A allotment open' },
        ],
        sources: [
          { label: 'PIB PRID 1684631 (CCEA approval)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1684631' },
          { label: 'NICDC — CBIC', url: 'https://nicdc.in/projects/national-industrial-corridor-development-programme/chennai-bengaluru-industrial-corridor' },
        ],
      },
      {
        slug: 'krishnapatnam', name: 'Krishnapatnam (KRIS City)', state: 'Andhra Pradesh', stage: 'construction',
        statusLabel: 'Under construction · Phase-1 EPC', coords: [212, 425],
        areaAc: 11098, projectCostCr: 2139, investmentCr: 10500, jobs: 98000, sectors: 'Textiles, food, auto, electronics, metals',
        nearest: 'Krishnapatnam Port (NH-16)',
        developer: 'Krishnapatnam Industrial City Development Ltd (NICDIT + APIIC 50:50 SPV)',
        industries: ['Textiles & apparel', 'Food processing', 'Automobiles', 'Electronics', 'Engineering & metals', 'Port-linked logistics & warehousing'],
        infrastructure: ['~11,098-acre greenfield smart city (Phase-1 ~2,500 acres); trunk infrastructure ₹2,139.44 cr (CCEA-approved 2020)', 'Targeted manufacturing investment ~₹10,500 cr; Phase-1 plug-and-play by end-2026 / early 2027', 'Adjacent to Krishnapatnam Port; NH-16; rail-linked; near Tirupati airport', 'Large 100–200-acre plots created for port-linked heavy industry'],
        incentives: 'AP industrial incentives; port-adjacency for EXIM-oriented manufacturing; PM-dedicated greenfield smart city.',
        summary: [
          'Krishnapatnam / KRIS City is CBIC’s large coastal bet — an ~11,098-acre greenfield smart industrial city beside Krishnapatnam Port whose foundation stone the Prime Minister laid in January 2025. Phase-1 (~2,500 acres) is in EPC, targeting ~₹10,500 cr of manufacturing investment and ~98,000 jobs, with large plots shaped for port-linked heavy industry.',
        ],
        sections: [noTenants('Sector targeting (textiles, food, auto, electronics, metals, port logistics) is announced and large port-linked plots are being created, but no individual anchor tenant or MoU is on the public record at the node yet — expected at this pre-allotment, EPC stage.')],
        timeline: [
          { date: 'Dec 2020', label: 'CCEA approves trunk infrastructure' },
          { date: 'Jan 2025', label: 'PM lays foundation stone (KRIS City)' },
          { date: '2026–27', label: 'Phase-1 plug-and-play infrastructure targeted' },
        ],
        sources: [
          { label: 'PIB PRID 1684631 (CCEA approval)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1684631' },
          { label: 'NICDC — Krishnapatnam', url: 'https://nicdc.in/projects/4-projects-nearing-completion/krishnapatnam-industrial-area-andhra-pradesh' },
        ],
      },
      {
        slug: 'ponneri', name: 'Ponneri node (Engineering Hub)', state: 'Tamil Nadu', stage: 'planned',
        statusLabel: 'Master-plan stage', coords: [214, 440],
        areaAc: 3375, sectors: 'Engineering, logistics', nearest: 'Ponneri · ~35 km N of Chennai',
        summary: [
          'Ponneri in Tiruvallur, ~35 km north of Chennai, is master-planned by JICA as an “engineering hub” adjacent to the Chennai, Kattupalli and Ennore ports. It is the least advanced CBIC node — detailed master plan and preliminary engineering done, but no Cabinet trunk-infra approval or construction comparable to Tumakuru and Krishnapatnam, and no tenants yet.',
        ],
        sources: [{ label: 'NICDC — Ponneri', url: 'https://nicdc.in/projects/national-industrial-corridor-development-programme/ponneri-industrial-area-tamil-nadu' }],
      },
    ],
    milestones: [
      { date: '2014–15', label: 'JICA master plan (~US$181 bn / 20 yr estimate)' },
      { date: '30 Dec 2020', label: 'CCEA approves Tumakuru + Krishnapatnam trunk infra' },
      { date: '2023', label: 'PM lays foundation stone, Tumakuru township' },
      { date: '8 Jan 2025', label: 'PM lays foundation stone, Krishnapatnam / KRIS City' },
      { date: 'Nov 2025', label: '300-acre Japanese township announced, Tumakuru' },
      { date: '2026–27', label: 'Phase-1 plug-and-play targeted (Tumakuru + Krishnapatnam)' },
    ],
    sources: [
      { label: 'NICDC — CBIC', url: 'https://nicdc.in/projects/national-industrial-corridor-development-programme/chennai-bengaluru-industrial-corridor' },
      { label: 'PIB PRID 1684631', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1684631' },
      { label: 'JICA master plan', url: 'https://openjicareport.jica.go.jp/pdf/12249322.pdf' },
    ],
  },
};

export const deepFor = (slug: string): CorridorDeep | undefined => corridorDeep[slug];
export const nodeBySlugs = (slug: string, node: string): DeepNode | undefined =>
  corridorDeep[slug]?.nodes.find((n) => n.slug === node);
export const allCorridorNodePairs = (): { corridor: string; node: string }[] =>
  Object.values(corridorDeep).flatMap((c) => c.nodes.map((n) => ({ corridor: c.slug, node: n.slug })));
