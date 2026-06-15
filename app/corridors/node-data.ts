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
      'The headline shift came on 28 August 2024, when the Cabinet Committee on Economic Affairs approved six AKIC nodes in one stroke. A year and a half on the picture is no longer “all planned”: by early 2026 EPC contractors had been appointed at several nodes (Prayagraj’s award came first, in October 2025; Rajpura–Patiala and Khurpia followed), Hisar is in master planning, Gaya’s EPC tender is out with land acquired, Jharkhand is relocating after losing its original site, and Raghunathpur — a state-led West Bengal township — is on hold. No anchor tenants are public anywhere yet, which is correct for greenfield sites at this stage.',
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
        statusLabel: 'EPC contractor appointed · pre-construction', coords: [159, 174],
        areaAc: 1098, projectCostCr: 1367, investmentCr: 7500, jobs: 64204,
        sectors: 'ESDM, food & beverage, textiles, metals, machinery, chemicals', nearest: 'New Rajpura EDFC station (12 km)',
        developer: 'NICDC Punjab Industrial Corridor Development Corporation Ltd (Centre–Punjab JV; SPV incorporated 30 Dec 2022)',
        epc: 'EPC contractor for internal trunk infrastructure appointed (by early 2026; one of 9 of the 12 NICDP projects to reach this stage per PIB, Feb 2026). Foundation stone not yet laid.',
        industries: ['Electronics system design & manufacturing (ESDM)', 'Food & beverages', 'Textiles & apparel', 'Rubber & plastics', 'Fabricated metal products', 'Chemicals', 'Machinery & equipment'],
        infrastructure: ['1,098 ac. Land use: industrial 661 ac (60%), green/waterbody 168 ac (15%), transport 153 ac (14%), services 36 ac, residential 33 ac, institutional 30 ac, commercial 17 ac', 'New Rajpura EDFC station 12 km — the closest dedicated freight link of any AKIC node; Sirhind Junction EDFC 25 km; Rajpura Junction 12 km', 'NH-44 (Ludhiana–Delhi) 10 km; NH-7 (Patiala–Chandigarh) 7.5 km; SH-8 11 km', 'Chandigarh airport 45 km; ICD Ludhiana ~65 km'],
        incentives: 'Land ~₹3 cr/acre (the corridor’s highest), plots 0.5–35 acres; Punjab industrial-policy incentives apply.',
        summary: [
          'Punjab’s AKIC node, between Rajpura and Patiala, is the most diversified of the corridor’s nodes by target sector — ESDM, food, textiles, metals and machinery — and the best-connected to a freight station. Environmental clearance is in hand, the state SPV (incorporated December 2022) is funded, and by early 2026 the EPC contractor for internal trunk infrastructure had been appointed — putting it among the corridor’s more advanced nodes, though no foundation stone is yet laid and no tenant is named.',
        ],
        sections: [
          { heading: 'Built beside India’s steel mandi', body: [
            'Rajpura–Patiala’s real edge is what surrounds it. The Mandi Gobindgarh “Loha Mandi” steel-rolling cluster next door runs 500-plus units — roughly 48 induction furnaces and ~40 foundries — and serves about a quarter of India’s secondary-steel market (~₹2,300 cr invested, ~10,000 jobs); brands present include JSW Steel, Madhav Alloys, Modern Steel and Belco Special Steel.',
            'The Ludhiana belt (Preet Tractors, Claas India, TI Cycles/Hercules) and the Patiala cutting-tools hub (SC Tool Corp, Mohindra Tools — supplying Mahindra, Honda, Hero and Maruti) complete a ready metals-and-machinery ecosystem. The IMC is best read as the freight-linked, plug-and-play extension of that existing base rather than a greenfield gamble.',
          ] },
          { heading: 'Anchor tenants & demand signals', body: [
            'No tenants are allotted yet — expected for a node still in trunk-infrastructure works. A project-management consultant (Voyants Solutions) was appointed in 2025 and the EPC contractor for internal infrastructure has now been appointed; plot allotment and named tenants follow once trunk works are built.',
          ] },
          { heading: 'Risks & open questions', body: [
            'Punjab’s groundwater stress is the watch-item — the cluster’s water-supply arrangement is not yet detailed. No foundation stone has been laid (true of all 12 NICDP nodes as of February 2026), and no anchor investor is named, so the ₹7,500 cr investment potential remains a projection.',
          ] },
        ],
        timeline: [
          { date: 'Dec 2022', label: 'SPV incorporated' },
          { date: 'Aug 2024', label: 'CCEA approval' },
          { date: '2025', label: 'PMC (Voyants) onboarded; EPC tender floated' },
          { date: 'Jan–Feb 2026', label: 'EPC contractor appointed; environmental clearance obtained' },
        ],
        sources: [DPIIT, NICDC('imc-rajpura-patiala-punjab', 'NICDC — IMC Rajpura–Patiala'), { label: 'PIB — work advances on 12 greenfield industrial cities', url: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2227592' }],
      },
      {
        slug: 'hisar', name: 'Hisar IMC', state: 'Haryana', stage: 'approved',
        statusLabel: 'Approved · master planning · SPV signed', coords: [149, 191],
        areaAc: 2988, projectCostCr: 4680, investmentCr: 32417, jobs: 125000,
        sectors: 'Aerospace & defence MRO, engineering, food, garments, logistics',
        anchors: 'Built around Maharaja Agrasen Airport (Integrated Aviation Hub)', nearest: 'Hisar Junction (4.3 km)',
        developer: 'NICDC Haryana IMC Hisar Project Ltd (NICDC + Haryana Airports Development Corporation JV; SSA/SHA signed 20 Aug 2025, SPV incorporated 25 Sep 2025)',
        industries: ['Aerospace & defence (MRO)', 'Engineering & fabrication', 'Food processing', 'Readymade garments', 'Aviation & cargo-linked industries', 'Logistics'],
        infrastructure: ['2,988-acre site (~4,000 ac demarcated as an Integrated Aviation Hub); developed area 1,605 ac — industrial & logistics 980 ac (61%), green 243 ac (15%), roads/utilities 231 ac (16%)', 'Maharaja Agrasen International Airport adjacent (under development) — the only AKIC node built around an airport', 'Hisar Junction 4.3 km; a freight station is proposed inside the IMC (3.5 km); New Rewari EDFC 156 km, New Ambala EDFC 208 km — between the Western and Eastern DFCs', 'Delhi 180 km; IMLH Nangal Chaudhary dry port ~190 km'],
        incentives: 'Haryana Enterprises & Employment Policy incentives; the differentiator is airport co-location (cargo + MRO). Plot sizes and pricing not yet published.',
        summary: [
          'Hisar is the largest AKIC node by area (2,988 acres) and by investment potential (₹32,417 cr / ~1.25 lakh jobs), and the only one built around an international airport — Maharaja Agrasen — to give the corridor an aerospace, defence-MRO and air-cargo anchor (NICDC brands it an “Integrated Aviation Hub”). The State Support and Shareholder Agreements were signed in August 2025 and the SPV — a NICDC–Haryana Airports Development Corporation joint venture — was incorporated in September 2025.',
          'It is the largest of the approved six on paper but among the earliest in execution: master planning is under way with a consultant appointed, while environmental clearance, EPC award and land transfer are not yet on record.',
        ],
        sections: [
          { heading: 'An aviation hub, not just a cluster', body: [
            'What sets Hisar apart on the corridor is the airport. The IMC wraps around Maharaja Agrasen International Airport, and roughly 4,000 acres are demarcated as an “Integrated Aviation Hub” — the brief explicitly targets aerospace, defence MRO and air-cargo-linked industry alongside engineering and food processing.',
            'It also sits between the Western (Rewari) and Eastern (Ambala) dedicated freight corridors, with a freight station proposed inside the IMC — positioning it as a multimodal air-plus-rail node rather than a single-freight-line cluster.',
          ] },
          { heading: 'The Jindal steel base next door', body: [
            'Hisar is the home of the O.P. Jindal group: Jindal Stainless — one of India’s largest stainless-steel makers — and Jindal Saw anchor a deep metals-and-fabrication ecosystem, alongside numerous galvanised-steel MSMEs. That gives the IMC’s engineering & fabrication sector a ready raw-material and supplier base, the same “build beside an existing cluster” logic that underpins the Punjab node.',
          ] },
          { heading: 'Anchor tenants & demand signals', body: [
            'No tenants are named yet — expected for a node still in master planning. The SPV is formed and a planning consultant appointed; environmental clearance, EPC award and land transfer are the next gates before plots can be allotted.',
          ] },
        ],
        timeline: [
          { date: 'Aug 2024', label: 'CCEA approval (largest of the 12 new IMCs)' },
          { date: 'Aug 2025', label: 'State Support & Shareholder Agreements signed' },
          { date: 'Sep 2025', label: 'SPV incorporated (NICDC–HADC JV); master planning under way' },
        ],
        sources: [DPIIT, { label: 'PIB PRID 2158558', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2158558' }, NICDC('imc-hisar-haryana', 'NICDC — IMC Hisar')],
      },
      {
        slug: 'khurpia', name: 'Khurpia IMC (Prag-Khurpia)', state: 'Uttarakhand', stage: 'construction',
        statusLabel: 'EPC contractor appointed · pre-construction', coords: [196, 191],
        areaAc: 1002, projectCostCr: 1265, investmentCr: 6180, jobs: 75057,
        sectors: 'Automobiles, auto components, engineering', nearest: 'Kichha rail station (3 km)',
        developer: 'NICDC Uttarakhand Industrial Township Ltd (NUITL; Centre–SIIDCUL JV, SSA/SHA Apr 2022, incorporated Oct 2022)',
        epc: 'EPC contractor for internal trunk infrastructure appointed (by early 2026, per PIB). Scope: roads & wet utilities, CETP + STP, and 3×33 kV + 1×11 kV substations.',
        industries: ['Automobiles & auto components', 'Engineering & fabrication'],
        infrastructure: ['Power 115 MVA (100 MVA industrial + 15 MVA utilities); CETP + STP and 3×33 kV + 1×11 kV substations within the EPC scope — the best-specified utility plan of the AKIC nodes', 'Land use: industrial/anchor 618 ac (62%), green 153 ac (15%), transport 140 ac (14%), residential 39 ac, utilities 36 ac, commercial 16 ac', 'NH-09 3 km; SH-44 adjacent; Kichha rail station 3 km; Pantnagar airport 15 km', 'New Khurja EDFC station 216 km — the AKIC node furthest from a dedicated freight station'],
        incentives: 'Land ~₹1.7 cr/acre, plots 0.5–120 acres; Uttarakhand SIIDCUL incentives; extends the established Pantnagar auto/engineering belt.',
        summary: [
          'The Uttarakhand node at Khurpia (Udham Singh Nagar) is the most narrowly focused of the four — automobiles and engineering, positioned as an extension of the Pantnagar industrial ecosystem. It has the clearest published infrastructure spec on the corridor (115 MVA power, CETP+STP and substations in the EPC scope), and by early 2026 its internal-infrastructure EPC contractor had been appointed.',
        ],
        sections: [
          { heading: 'The Pantnagar auto belt next door', body: [
            'Khurpia is an extension of one of India’s densest auto clusters. The adjacent SIIDCUL Pantnagar estate already hosts Tata Motors, Ashok Leyland and Bajaj Auto, ringed by component makers (Endurance Technologies, Minda Industries, Varroc, Spicer, Yazaki, Lucas TVS) and consumer-goods plants (Nestlé, Britannia, Parle, Dabur, Haldiram).',
            'None of these are IMC Khurpia allottees — they are the ready demand-and-supplier base the node is designed to absorb as Pantnagar runs out of room. That existing ecosystem is Khurpia’s strongest card.',
          ] },
          { heading: 'Status & the freight-distance catch', body: [
            'No tenants are named yet, which is expected pre-allotment. The genuine constraint is logistics: at 216 km from the nearest EDFC station (New Khurja), Khurpia is the AKIC node furthest from a dedicated freight line, so it leans on road and the Pantnagar rail link rather than the corridor’s freight economics. Its clean utility spec and ready cluster partly offset that.',
          ] },
        ],
        timeline: [
          { date: '2016', label: 'Node identified' },
          { date: 'Apr 2022', label: 'State Support & Shareholder Agreements' },
          { date: 'Oct 2022', label: 'SPV (NUITL) incorporated' },
          { date: 'Mar 2023', label: 'Environmental clearance (SEIAA Uttarakhand)' },
          { date: 'Aug 2024', label: 'CCEA approval' },
          { date: 'Jan–Feb 2026', label: 'EPC contractor appointed (internal trunk infrastructure)' },
        ],
        sources: [DPIIT, NICDC('imc-khurpia-uttarakhand', 'NICDC — IMC Khurpia'), { label: 'PIB — work advances on 12 greenfield industrial cities', url: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2227592' }],
      },
      {
        slug: 'agra', name: 'Agra IMC', state: 'Uttar Pradesh', stage: 'approved',
        statusLabel: 'Approved · SPV signed · TTZ-constrained', coords: [178, 214],
        areaAc: 1058, projectCostCr: 1812, investmentCr: 3447, jobs: 69516,
        sectors: 'Leather & footwear, food processing, engineering, ESDM, medical', nearest: 'New Tundla EDFC station (25 km)',
        developer: 'Integrated Manufacturing Cluster Agra-Prayagraj Ltd (NICDC–UPSIDA JV; State Support & Shareholder Agreements signed 8 Nov 2024)',
        industries: ['Leather articles & apparel', 'Food processing & beverage', 'Engineering & fabrication', 'Medicine & medical consumables', 'Electronics System Design & Manufacturing (ESDM)'],
        infrastructure: ['1,058 ac (428 ha). Land use: industrial 443.8 ac (41.9%), green/parks 362.1 ac (34.2%, high — a TTZ compliance feature), roads 181.1 ac (17.1%), utilities 29.5 ac, amenities 27.3 ac, commercial 10.6 ac, residential 3.9 ac', 'Eastern DFC: 25 km to New Tundla station; proposed NW-110 (Yamuna) waterway terminal ~1 km', 'Yamuna Expressway + NH-19 (Agra–Kolkata) 2 km north; Agra–Lucknow Expressway linkage', 'Agra airport 25 km; Noida International (Jewar) 140 km'],
        incentives: 'Non-polluting (green-category) units qualify under the UP Industrial Investment & Employment Promotion Policy 2022 (capital subsidy, GST reimbursement, land concessions). Defence/aerospace units at the UPDIC node additionally fall under the UP Defence & Aerospace Manufacturing Policy 2018 — 25% subsidy on plant & machinery (cap ₹25 cr), 100% stamp-duty exemption, interest subsidy.',
        summary: [
          'IMC Agra sits at a rare three-way convergence — a national AKIC manufacturing cluster, a node of the UP Defence Industrial Corridor, and India’s largest legacy footwear hub, all in one district. The 1,058-acre IMC (₹1,812 cr build, ₹3,447 cr investment potential, ~69,516 jobs) is developed by the NICDC–UPSIDA SPV, whose State Support and Shareholder Agreements were signed on 8 November 2024, and is designed for non-polluting industry on the Eastern DFC freight backbone.',
          'It is sanctioned but not yet built: master planning and environmental clearance are done, land is being assembled, and the permissible-industry envelope is gated by the Taj Trapezium Zone. The honest read is a diversification play layered on a legacy monocluster — footwear plus an engineering/ESDM/food pivot riding the freight corridor, with defence as a forward option rather than committed capacity.',
        ],
        sections: [
          { heading: 'A Defence Industrial Corridor node', body: [
            'Agra is one of the six nodes of the Uttar Pradesh Defence Industrial Corridor (developed by UPEIDA), alongside Kanpur, Jhansi, Lucknow, Aligarh and Chitrakoot. As of September 2025 the Agra node carried ~₹407 cr of investment proposals, and land allotment at Agra was set to begin shortly as of December 2025 — making it the corridor’s least-developed node, with no allottees publicly named yet.',
            'The corridor’s marquee defence anchors sit at other nodes, not at Agra: Jhansi (~₹11,276 cr, 17 firms, including BrahMos Aerospace and Bharat Dynamics), Lucknow (~₹4,850 cr, 16 firms, including Tata Advanced Systems and Adani Defence), Kanpur (~₹1,283 cr, including L&T Defence, PTC Industries and MKU) and Aligarh (~₹3,872 cr, including Rolex Rings and Shakti Forgings). Across the corridor UPEIDA reports ~₹33,896 cr of investment (September 2025). For Agra the state plan flags a Defence Park, technical-textiles and electronics development — so treat its defence role as optionality, not yet capacity.',
          ] },
          { heading: 'India’s footwear capital — the demand catchment', body: [
            'Agra is India’s largest footwear cluster — roughly 200 mechanised units (AFMEC) plus ~500 domestic-brand manufacturers (ASMA), a combined capacity near 500,000 pairs a day, and a workforce in the hundreds of thousands across the wider ecosystem. AFMEC’s 100-plus members export about ₹3,000 cr a year and target ₹10,000 cr. Established exporters include Dawar Footwear Industries, Virola International, Gupta HC Overseas, Nuova Shoes and Leiner Shoes.',
            'None of these firms is an IMC allottee yet — they are the demand-and-supply base the cluster can draw on. The IMC is designed partly as expansion land for them, and Agra’s Foundry Nagar adds a metal-casting and light-engineering base, though many of those foundries were named in the original Taj-pollution case and have had to convert to gas or relocate.',
          ] },
          { heading: 'The Taj Trapezium Zone constraint', body: [
            'The binding caveat. In March 2026 the Supreme Court disposed of the original 1984 M.C. Mehta petition that had governed the Taj Trapezium Zone, but immediately registered four new suo-motu petitions — a TTZ vision document, tree-planting and green cover, the regulation of industries, and water bodies — and retained a strict regime on tree-felling.',
            'Polluting industry remains capped across the zone, which is exactly why the IMC is positioned for non-polluting (green-category) sectors and why ~34% of its land is reserved as green cover for compliance. The live “regulation of industries” case means the permissible-industry list can still move, so any Agra manufacturing plan must be designed around the TTZ from the outset.',
          ] },
          { heading: 'Risks & open questions', body: [
            'No anchor tenants yet: as of mid-2026 no private company has a confirmed land allotment at IMC Agra or the UPDIC Agra node. Agra attracted ~78 investment MoUs worth ~₹13,543 cr at the 2023 UP Global Investors Summit, but those are statements of intent, not committed allotments.',
            'Land and water: the share of the 1,058 acres physically transferred to the SPV is not yet public, and Agra’s depleting water table means the cluster will lean on treated-sewage/STP water — the supply arrangement is not yet detailed. A mild cost discrepancy also persists (₹1,812 cr full development cost per NICDC versus a ₹1,046 cr core-infrastructure figure reported elsewhere).',
          ] },
        ],
        timeline: [
          { date: '2023', label: 'Environmental clearance' },
          { date: 'Aug 2024', label: 'CCEA approval (one of the 12 new IMCs)' },
          { date: 'Nov 2024', label: 'State Support & Shareholder Agreements signed (NICDC–UPSIDA SPV)' },
          { date: '2025', label: 'Master planning complete; UPDIC Agra-node allotment to begin' },
          { date: 'Mar 2026', label: 'Supreme Court disposes M.C. Mehta TTZ petition; 4 suo-motu cases registered' },
          { date: '2026–29', label: 'Build window (~36 months from construction start)' },
        ],
        sources: [
          { label: 'NICDC — IMC Agra', url: 'https://nicdc.in/projects/12-new-projects/imc-agra-uttar-pradesh' },
          { label: 'PIB — NICDC–UPSIDA partner for Agra & Prayagraj clusters (8 Nov 2024)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2071860' },
          { label: 'Invest UP — UP Defence Industrial Corridor (23 Sep 2025)', url: 'https://invest.up.gov.in/wp-content/uploads/2025/10/3-Eng-PressRelease_UPDIC_23Sep_2025_041025.pdf' },
          { label: 'Supreme Court Observer — Taj Trapezium PIL reorganised (11 Mar 2026)', url: 'https://www.scobserver.in/supreme-court-observer-law-reports-scolr/taj-trapezium-pil-reorganised/' },
          { label: 'CSE — Agra footwear production capacity', url: 'https://www.cseindia.org/content/downloadreports/12354' },
          { label: 'AFMEC — Agra footwear industry overview', url: 'https://www.afmec.org/industry-overview' },
        ],
      },
      {
        slug: 'prayagraj', name: 'Prayagraj IMC', state: 'Uttar Pradesh', stage: 'construction',
        statusLabel: 'Construction contract awarded (most advanced)', coords: [228, 238],
        areaAc: 351, projectCostCr: 658, investmentCr: 1600, jobs: 17700,
        sectors: 'E-mobility, cycles, food, garments, leather', nearest: 'New Karchana EDFC station (7 km)',
        developer: 'IMC Agra-Prayagraj Ltd (NICDC–UPSIDA JV; SSA/SHA 7–8 Nov 2024; SPV incorporated 30 Jan 2025)',
        epc: 'EPC contractor LoA issued 27 Oct 2025 for trunk infrastructure (contractor name not disclosed in the NICDC status report) — the corridor’s only node past EPC award.',
        industries: ['E-mobility / automobile', 'Cycle manufacturing', 'Food processing & beverages', 'Readymade garments', 'Leather articles', 'Packaging'],
        infrastructure: ['Built on assembled land — 238 ac from the PSU Bharat Pumps & Compressors + 114 ac from the existing Saraswati Hi-Tech City; ~81% of 351 acres zoned industrial', 'New Karchana EDFC station 7 km; Naini ICD (dry port) 5 km', 'NH-35 adjacent; NH-30 at 10 km; Prayagraj airport 24 km; inland-waterways terminal ~5.5 km', '24×7 power and a dedicated substation inherited from Saraswati Hi-Tech City; UP NiveshMitra single-window allotment'],
        incentives: 'Land ~₹2 cr/acre, plots 0.5–50 acres; UP industrial / EV policy incentives. The smallest AKIC node, built partly on serviced land — which is why it moved fastest.',
        summary: [
          'Prayagraj is the most advanced node on the entire corridor: the letter of award to the EPC contractor for trunk-infrastructure works was issued on 27 October 2025 — construction is contracted, not merely tendered. At 351 acres it is the smallest AKIC node, and crucially it is not truly greenfield.',
        ],
        sections: [
          { heading: 'Why it moved first', body: [
            'The reason Prayagraj could move ahead of every other node is its land. The 352 acres were assembled from a sick public-sector unit — Bharat Pumps & Compressors (238 ac) — and from the already-serviced Saraswati Hi-Tech City (114 ac), an estate that comes with 24×7 power, a dedicated substation and UP’s NiveshMitra single-window allotment. Smallest AKIC node, on part-serviced land — hence fastest to an EPC award.',
          ] },
          { heading: 'Anchor tenants & demand signals', body: [
            'NICDC markets a developed land parcel here specifically for the EV / e-mobility sector — the clearest forward demand signal on the corridor — and Prayagraj is the only node past EPC award. Even so, no tenant is publicly named yet; allotment follows the trunk works now under construction.',
          ] },
        ],
        timeline: [
          { date: 'Aug 2024', label: 'CCEA approval' },
          { date: 'Nov 2024', label: 'State Support & Shareholder Agreements signed' },
          { date: 'Jan 2025', label: 'Agra–Prayagraj SPV incorporated' },
          { date: 'Mar 2025', label: 'Environmental clearance submitted (SEIAA UP)' },
          { date: 'Oct 2025', label: 'EPC contractor LoA issued (trunk infrastructure)' },
        ],
        sources: [DPIIT, NICDC('imc-prayagraj-uttar-pradesh', 'NICDC — IMC Prayagraj'), { label: 'PIB — NICDC–UPSIDA partner for Agra & Prayagraj clusters (8 Nov 2024)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2071860' }],
      },
      {
        slug: 'gaya', name: 'Gaya IMC', state: 'Bihar', stage: 'construction',
        statusLabel: 'EPC procurement · land acquired · agency selection by Mar 2026', coords: [283, 260],
        areaAc: 1670, projectCostCr: 1339, investmentCr: 16524, jobs: 109185,
        sectors: 'Agro/food, engineering, auto, aerospace & defence', anchors: 'Dobhi / Sherghati', nearest: 'New Paharpur EDFC station (45 km)',
        developer: 'Bihar Integrated Manufacturing City Gaya Ltd (BIMCGL) — Centre–BIADA JV; SSA/SHA 12 Nov 2024; incorporated 6 Jan 2025; authorised capital ₹1,000 cr',
        epc: '2nd-call EPC tender floated Oct 2025; the Bihar Chief Secretary directed implementation-agency selection by Mar 2026; contractor not yet awarded.',
        industries: ['Agro & food processing', 'Readymade garments', 'Engineering & fabrication', 'Auto components & steel-based products', 'Aerospace & defence', 'Building materials', 'Furniture & handloom', 'Leather & medical equipment'],
        infrastructure: ['Assured power 162 MVA via 220/33 kV + 33/11 kV substations; water 19 MLD; 29.89 km internal roads; CETP + STP + WTP planned — the largest industrial township proposed in Bihar', 'Land use: industrial 919 ac (55%), green 351 ac (21%), roads/parking 284 ac (17%), residential 50 ac, utilities 33 ac, commercial 17 ac', 'New Paharpur EDFC station 45 km; Gaya Junction 40 km; a 7 km greenfield link to NH-19/GT Road approved (₹142 cr)', 'NH-22 (Patna–Gaya–Dobhi) 2 km; Gaya international airport 30 km; Haldia port 550 km'],
        incentives: 'Land ~₹1.42 cr/acre (lowest of the four), plots 1–50 acres; Bihar industrial incentives + a stamp-duty waiver granted March 2025.',
        summary: [
          'Bihar’s Gaya node (at Dobhi/Sherghati) is the corridor’s single largest opportunity: ₹16,524 cr of investment potential and ~1.09 lakh projected jobs on 1,670 acres, near Bodh Gaya and the mineral-rich Jharkhand hinterland. The SPV (BIMCGL) is live, land acquisition is complete, and a second-call EPC tender is out.',
        ],
        sections: [
          { heading: 'The corridor’s largest single bet', body: [
            'Gaya is the corridor’s biggest opportunity by investment potential. It draws on the mineral-rich Jharkhand hinterland for steel and engineering feedstock, sits near Bodh Gaya’s tourism economy, and its declared sectors stretch from agro-processing and handloom to auto components, steel products and aerospace & defence.',
            'It is also unusually well-specified for its stage: 162 MVA of assured power through dedicated 220/33 kV and 33/11 kV substations, 19 MLD of water, ~30 km of internal roads, and CETP/STP/WTP all planned — the infrastructure backbone of what would be Bihar’s largest industrial township.',
          ] },
          { heading: 'Status & tenants', body: [
            'Execution is well advanced for a node this size: the SPV is live, land acquisition (₹462 cr) is complete, environmental clearance came in March 2025 alongside a stamp-duty waiver, and the Bihar Chief Secretary has directed that the implementation agency be selected by March 2026. No tenants are named yet — allotment follows trunk works. The watch-item is freight distance: 45 km to the nearest EDFC station.',
          ] },
        ],
        timeline: [
          { date: 'Aug 2024', label: 'CCEA approval' },
          { date: 'Nov 2024', label: 'State Support & Shareholder Agreements signed' },
          { date: 'Jan 2025', label: 'SPV (BIMCGL) incorporated' },
          { date: 'Mar 2025', label: 'Environmental clearance + stamp-duty waiver; land acquisition complete' },
          { date: '2025–26', label: 'EPC tender; implementation agency to be selected by Mar 2026' },
        ],
        sources: [DPIIT, NICDC('imc-gaya-bihar', 'NICDC — IMC Gaya')],
      },
      {
        slug: 'jharkhand', name: 'Jharkhand IMC', state: 'Jharkhand', stage: 'planned',
        statusLabel: 'Site being relocated · no SPV, no land',
        sectors: 'To be defined (metals / engineering likely)',
        summary: [
          'The Jharkhand node is the corridor’s one genuine laggard. Its originally identified site at New Bahri is no longer available, an alternate site is still being identified, and there is no SPV, no approval, no master plan and no confirmed metrics. Per NICDC’s own status report the Government of Jharkhand has been asked to finalise land before any development can begin — making it the only AKIC node fairly described as stalled.',
        ],
        sections: [
          { heading: 'Why a Jharkhand node still makes sense', body: [
            'The case for the node is feedstock, not readiness. Jharkhand’s mineral wealth — iron ore, coal, copper, bauxite, limestone — and its existing metals and heavy-engineering base give the corridor its natural steel-and-engineering supply source, and NICDC’s perspective plan singles out the resource-rich eastern states for exactly this. Once a site is confirmed and an SPV formed, metals, heavy engineering and auto components are the logical sectors. For now it is a watch-item, not an investable node.',
          ] },
        ],
        sources: [DPIIT, { label: 'NICDC — AKIC DMU status report', url: 'https://nicdc.in/' }],
      },
      {
        slug: 'raghunathpur', name: 'Raghunathpur (Jangal Sundari Karmanagari)', state: 'West Bengal', stage: 'planned',
        statusLabel: 'State-led (WBIDC) · on hold since 2021', coords: [308, 280], areaAc: 2483,
        sectors: 'Steel, metals, engineering, logistics', nearest: 'Adra / Purulia',
        developer: 'WBIDC (state-led township) — no Centre–State joint-venture SPV, unlike the other AKIC nodes',
        industries: ['Steel & metal products', 'Ancillary engineering', 'Logistics & warehousing (EDFC-linked)', 'General manufacturing'],
        infrastructure: ['Two parcels — Raghunathpur Steel & Allied Industrial Park I (1,749 ac) + II (734 ac) = 2,483 ac; ~40%+ industrial', 'In the south Damodar industrial belt (Barjora–Mejia–Raghunathpur); the DVC Raghunathpur thermal power plant is alongside', 'Nearest station Adra; ~211 km from Dankuni, ~119 km from Ranchi'],
        summary: [
          'Raghunathpur in Purulia — West Bengal’s “Jangal Sundari Karmanagari” — IS listed as an AKIC node in NICDC’s FY2020-21 annual report (2,483 acres across two parcels), but it is unlike any other node on the corridor: a state-led WBIDC township with no Centre–State joint-venture SPV, on hold since June 2021 pending funding clarity on the EDFC’s Sonnagar–Dankuni section. The master plan is complete; environmental clearance is not.',
        ],
        sections: [
          { heading: 'Steel is already here', body: [
            'The site sits in a working steel-and-power belt. Shyam Steel is investing ~₹1,500 cr in a ~600-acre integrated plant (1.19 MTPA TMT) at Raghunathpur — though sources don’t confirm whether that land is inside the IMC boundary or adjacent — and the DVC Raghunathpur thermal power plant anchors the area’s power. The node’s natural vocation is steel, metals and EDFC-linked logistics; the IMC itself has no announced allottees.',
          ] },
          { heading: 'The West Bengal incentive caveat', body: [
            'A risk specific to this node: in 2025 West Bengal passed a Bill retrospectively revoking industrial incentives granted since 1993 — capital subsidy, SGST reimbursement, land and power concessions — and several majors (UltraTech, Electrosteel, Grasim, Nuvoco, Dalmia) have challenged it in the Calcutta High Court. A replacement industrial policy is said to be in draft. Until it lands, the incentive backdrop for any investor here is unsettled, on top of the node’s on-hold status.',
          ] },
        ],
        sources: [
          { label: 'Silpasathi, Govt of West Bengal', url: 'https://silpasathi.wb.gov.in' },
          { label: 'NICDC Annual Report FY 2020-21 (AKIC node list)', url: 'https://nicdc.in/' },
        ],
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
        statusLabel: 'Activation zone live · fab under construction',
        areaAc: 227337, projectCostCr: 2550, jobs: 800000,
        sectors: 'Semiconductors, solar, electronics, chemicals, data centres', nearest: 'Dholera greenfield airport ~15 km; Pipavav port ~200 km',
        developer: 'Dholera Industrial City Development Ltd (DICDL), incorporated 2016; planning by DSIRDA',
        industries: ['Semiconductor fabrication', 'Solar cell & module manufacturing', 'Electronics / EMS', 'Renewable energy', 'AI data centres'],
        infrastructure: ['422 sq km industrial of a 920 sq km plan; activation zone ~5,800 ac; 15–20% green', 'Dholera airport ~15 km; exclusive Torrent Power 220/400 kV supply', 'Two reservoirs, 9 ESRs, 60 MLD CETP, 30 MLD STP; 99-year leasehold (~₹1.1 cr/acre base)'],
        incentives: 'Gujarat Industrial Policy 2020 (mega-project capital subsidy, SGST reimbursement); plug-and-play; common cleanroom for OSAT.',
        companies: [{ name: 'Tata Electronics', sector: 'Semiconductor fab', note: 'Under construction; Fiscal Support Agreement signed Mar 2025 (~₹91,526 cr)' }, { name: 'Tata Power Renewable', sector: '300 MW solar', note: 'Operational' }, { name: 'ReNew Power', sector: 'Solar cell manufacturing', note: 'Under construction' }, { name: 'L&T', sector: '250 MW AI data centre', note: 'MoU (~₹25,000 cr)' }],
        summary: [
          'Dholera is India’s largest greenfield smart city (a 920 sq km plan) and the DMIC’s flagship, de-risked by the Tata Electronics semiconductor fab.',
          'Trunk infrastructure in the activation area is live and a Tata Power solar plant is operational, but most manufacturing — the fab included — is still 2–4 years from production.',
        ],
        sections: [
          { heading: 'Risks & open questions', body: [
            'Water security in a semi-arid zone for water-intensive fabs, and an aggressive 2027 Tata production target, are the chief execution risks.',
            'Allottee-versus-MoU transparency is poor — several named firms show no ground-breaking yet.',
          ] },
        ],
        timeline: [
          { date: '2016', label: 'DICDL incorporated' },
          { date: 'Mar 2025', label: 'Tata fab Fiscal Support Agreement (~₹91,526 cr)' },
          { date: '2027', label: 'Tata fab production target' },
        ],
        sources: [
          { label: 'PIB — Tata semiconductor (PRID 2108602)', url: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2108602' },
          { label: 'Dholera SIR — DSIRDA', url: 'http://www.dholerasir.co.in/faq.html' },
        ],
      },
            {
        slug: 'auric-shendra-bidkin', name: 'Shendra–Bidkin (AURIC)', state: 'Maharashtra', stage: 'operational',
        statusLabel: 'Phase 1 operational, nearly sold out', coords: [143, 337],
        areaAc: 9930, projectCostCr: 7948, investmentCr: 67815, jobs: 55000,
        sectors: 'EV & auto, aerospace, electronics, pharma, textiles', nearest: 'Chhatrapati Sambhajinagar airport ~15 km; NH-52 adjacent',
        developer: 'Maharashtra Industrial Township Ltd (MITL, formerly AITL), incorporated 2014',
        industries: ['EV & automotive manufacturing', 'Auto components', 'Chemicals / additives', 'Technical textiles', 'Electronics'],
        infrastructure: ['Shendra 8.39 sq km + Bidkin 31.79 sq km (~9,930 ac); plots 1–100 ac', 'Airport ~15 km; NH-52 adjacent; sits in the established Aurangabad auto/pharma belt', 'Bidkin ₹400 cr / 70 MLD water project from Jayakwadi Dam (~3-year build); land base ~₹1.42 cr/acre'],
        incentives: 'Maharashtra Industrial Policy 2025 (land concessions, SGST refunds, capital subsidy, electricity-duty exemption, MAITRI 2.0); plug-and-play.',
        companies: [{ name: 'Hyosung', sector: 'Technical textiles', note: 'Operational — first mega investor, 2018 (~₹1,500 cr)' }, { name: 'Toyota Kirloskar Motor', sector: 'EV / auto', note: 'Committed' }, { name: 'JSW Green Mobility', sector: 'EV', note: 'Committed' }, { name: 'Ather Energy', sector: 'EV scooters', note: 'Committed' }, { name: 'Lubrizol India', sector: 'Chemicals', note: 'Committed' }, { name: 'Polycab', sector: 'Wires & cables', note: 'Allotted' }],
        summary: [
          'AURIC is the corridor’s operational success story — the most advanced DMIC node after Dholera, with Phase 1 (Shendra) nearly sold out and anchors in production.',
          'Cumulative confirmed investment is ~₹56,200 cr, EV-led, drawing on an established Aurangabad auto and pharma base (Bajaj, Skoda-VW, Aurobindo nearby).',
        ],
        sections: [
          { heading: 'Status & tenants', body: [
            'Anchored by Hyosung (2018, ~₹1,500 cr) plus committed EV majors Toyota, JSW and Ather; a August 2025 PIB note confirms fresh ~₹200 cr land allotments.',
            'Bidkin’s water risk is mitigated by the ₹400 cr Jayakwadi project, though that carries a ~2028 execution timeline.',
          ] },
        ],
        timeline: [
          { date: '2014', label: 'SPV (MITL) incorporated' },
          { date: '2018', label: 'Hyosung first mega investment' },
          { date: 'Mar 2025', label: 'Bidkin ₹400 cr water project approved' },
          { date: 'Aug 2025', label: 'New land allotments (5 firms)' },
        ],
        sources: [
          { label: 'NICDC — Shendra–Bidkin', url: 'https://nicdc.in/projects/4-projects-developed/shendra-bidkin-industrial-area-maharashtra' },
          { label: 'PIB — allotments (PRID 2159657)', url: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2159657' },
        ],
      },
            {
        slug: 'iitgnl-greater-noida', name: 'Integrated Industrial Township, Greater Noida (IITGNL)', state: 'Uttar Pradesh', stage: 'operational',
        statusLabel: 'Trunk infra complete; allotment active', coords: [177, 205],
        areaAc: 747, projectCostCr: 1715,
        sectors: 'IT/ITES, hi-tech, biotech, electronics, automobile', nearest: 'Bodaki railway station (adjacent); Noida International (Jewar) ~40 km',
        developer: 'DMIC Integrated Industrial Township Greater Noida Ltd (IITGNL), incorporated 2014 (NICDIT : GNIDA)',
        industries: ['IT/ITES & hi-tech manufacturing', 'Electronics & electrical', 'Biotechnology & R&D', 'Automobile / auto components'],
        infrastructure: ['747.5 ac (302.6 ha); a brownfield township inside Greater Noida with trunk infrastructure complete', 'NCR location; near Bodaki station; ~40 km to the upcoming Jewar airport', '24-hour power; allotment via an online e-Land Management System'],
        incentives: 'Plug-and-play (24×7 power, eco-friendly infra); e-LMS single-window allotment; UP industrial-policy rates apply.',
        companies: [{ name: 'Haryana Gas City', sector: 'Piped-gas meters', note: 'Land allotted 2023 (~₹108 cr)' }, { name: 'Time Server Services', sector: 'Mobile packaging', note: 'Land allotted 2023 (~₹55 cr)' }],
        summary: [
          'Unlike greenfield Dholera, IITGNL sits inside Greater Noida with trunk infrastructure already complete (PIB, Dec 2024), so the focus has shifted to plot allotment and investor onboarding.',
          'It is a compact 747-acre node leaning on the established NCR ecosystem rather than building one from scratch.',
        ],
        sections: [
          { heading: 'Status & open questions', body: [
            'Despite “trunk infra complete” status, public allottee disclosure is thin — only two named industrial allottees so far.',
            'It also faces competition from the cluster of new mega-cities planned around the Jewar airport.',
          ] },
        ],
        timeline: [
          { date: '2014', label: 'IITGNL incorporated' },
          { date: 'Mar 2023', label: 'First e-auction land allotments' },
          { date: 'Dec 2024', label: 'PIB confirms trunk infrastructure complete' },
        ],
        sources: [
          { label: 'NICDC — IITGNL', url: 'https://www.nicdc.in/projects/national-industrial-corridor-development-programme/integrated-industrial-township-greater-noida-uttar-pradesh' },
          { label: 'PIB — 12 industrial smart cities (PRID 2081537)', url: 'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2081537' },
        ],
      },
            {
        slug: 'vikram-udyogpuri', name: 'Vikram Udyogpuri', state: 'Madhya Pradesh', stage: 'operational',
        statusLabel: 'Operational; Phase 1 nearly full', coords: [150, 285],
        areaAc: 1100, investmentCr: 5000,
        sectors: 'Pharma & medical devices, food processing, auto, textiles, electronics', nearest: 'Ujjain–Dewas rail; near SH-18; central-India logistics location',
        developer: 'DMIC Vikram Udyogpuri Ltd, incorporated 2010 (NICDIT + Govt of MP / MPIDC)',
        industries: ['Medical devices (350-acre park)', 'Food processing', 'Pharmaceuticals & biotech', 'Textiles', 'White goods / electronics'],
        infrastructure: ['Phase 1 ~1,100 ac (458 ha), nearly full; a dedicated 350-acre Medical Devices Park; Phase 2 (400+ ha) acquired', 'Near SH-18 and the Ujjain–Dewas rail line; central-India location', 'Narmada (NVDA) water agreement; 5.2 MLD CETP; trunk infra ~98% complete; land ~₹0.86 cr/acre'],
        incentives: 'Plug-and-play; dedicated Medical Devices Park (NIPER-Ahmedabad technical MoU); single-window including environmental approvals.',
        companies: [{ name: 'Amul', sector: 'Dairy / food', note: 'Operational (anchor)' }, { name: 'PepsiCo India', sector: 'Beverage ingredients', note: 'Under construction (~₹1,225 cr; op. ~2026)' }, { name: 'Haier', sector: 'White goods', note: 'Operational' }, { name: 'Inox Air Products', sector: 'Industrial gases', note: 'Operational' }],
        summary: [
          'Vikram Udyogpuri is the most fully realised DMIC manufacturing node — beyond MoUs into production, with ~67 industries allotted and 20+ units operational on ~₹5,000 cr of Phase 1 investment.',
          'A 350-acre Medical Devices Park (a technical MoU with NIPER-Ahmedabad) differentiates it from every other corridor node.',
        ],
        sections: [
          { heading: 'Status & tenants', body: [
            'Amul anchors the node; PepsiCo is the largest single named investor (~₹1,225 cr, ~2,000 jobs), corroborated across multiple sources.',
            'Phase 1 filling up drove Phase 2 (400+ ha acquired), with ~₹8,000 cr of fresh intent from ~35 firms.',
          ] },
        ],
        timeline: [
          { date: '2010', label: 'SPV incorporated' },
          { date: '2024–25', label: 'Phase 2 land acquired (400+ ha)' },
          { date: '2026', label: '17 units incl. 8 medical-device set to launch' },
        ],
        sources: [
          { label: 'NICDC — Vikram Udyogpuri', url: 'https://nicdc.in/projects/4-projects-developed/integrated-industrial-township-vikram-udyogpuri' },
          { label: 'ET Infra — Phase 2', url: 'https://infra.economictimes.indiatimes.com/news/urban-infrastructure/mpidc-acquires-400-ha-to-develop-vikram-udyogpuri-phase-2/117038761' },
        ],
      },
            {
        slug: 'nangal-chaudhary-imlh', name: 'IMLH Nangal Chaudhary', state: 'Haryana', stage: 'construction',
        statusLabel: 'Phase I under development (logistics hub)', coords: [152, 232],
        areaAc: 886, projectCostCr: 1029, investmentCr: 47480, jobs: 10000,
        sectors: 'Multi-modal logistics, EXIM, warehousing, cold storage', nearest: 'Adjacent to the Western DFC; New Dabla DFC station 12 km; Nizampur railway 1.6 km',
        developer: 'NICDC Haryana Multi-Modal Logistic Hub Project Ltd (50:50 NICDIT : HSIIDC), incorporated 2016',
        industries: ['Multi-modal logistics operators', 'Warehousing & cold storage', 'EXIM / customs zone', 'Container freight stations', '3PL / freight forwarding'],
        infrastructure: ['886 ac (358.6 ha) — a freight village, not a manufacturing node', 'Adjacent WDFC; NH-11 12 km; NH-148B 20 km; Delhi airport 140 km; gateway for IMC Hisar (~190 km)', 'PPP concession model (concessionaire not yet awarded); AIIB financing proposed'],
        incentives: 'PPP-mode development; strategic WDFC adjacency; single-point logistics solution; Haryana logistics incentives.',
        summary: [
          'Nangal Chaudhary is a logistics-first freight village — built for rail-road transfer, warehousing and customs — so named manufacturing tenants are not expected here.',
          'It serves the Manesar–Bawal–Dharuhera and east-Rajasthan industrial belts and acts as the dry-port gateway for IMC Hisar.',
        ],
        sections: [
          { heading: 'Risks & open questions', body: [
            'Phase I missed its original 2020-21 target and remains under development (DPIIT review, Apr 2026); the PPP concession is not yet awarded.',
            'There is no public operator data yet, and the 2018 projection of 10M TEUs by 2025 looks overstated.',
          ] },
        ],
        timeline: [
          { date: '2016', label: 'SPV incorporated' },
          { date: 'May 2018', label: 'CCEA approval (₹1,029 cr Phase I)' },
          { date: 'Apr 2026', label: 'DPIIT Secretary Phase-I review' },
        ],
        sources: [
          { label: 'NICDC — IMLH Nangal Chaudhary', url: 'https://nicdc.in/projects/4-projects-nearing-completion/integrated-multi-modal-logistics-hub-nangal-chaudhary' },
          { label: 'PIB — CCEA approval (PRID 1532272)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1532272' },
        ],
      },
            {
        slug: 'dadri-boraki', name: 'MMLH Dadri + MMTH Boraki', state: 'Uttar Pradesh', stage: 'construction',
        statusLabel: 'PPP procurement; bids under evaluation',
        areaAc: 1209, projectCostCr: 4034, investmentCr: 115092, jobs: 100000,
        sectors: 'Multi-modal logistics, warehousing, cold chain, EXIM', nearest: 'Confluence of the Eastern & Western DFCs; Eastern Peripheral Expressway 5 km',
        developer: 'DMIC Integrated Industrial Township Greater Noida Ltd (NICDIT + GNIDA)',
        industries: ['3PL / 4PL logistics', 'Container & bulk cargo handling', 'Cold chain & pharma logistics', 'E-commerce fulfilment', 'Customs-bonded warehousing'],
        infrastructure: ['MMLH 849 ac + MMTH 360 ac (1,209 ac); Phase I = 3M sq ft warehousing, 0.74M TEUs', 'At the EDFC/WDFC confluence; Yamuna Expressway 10 km; Jewar airport 40 km; a 1.8 km elevated metro link approved', 'Environmental clearance granted Apr 2023; 45-year PPP concession'],
        incentives: '45-year PPP concession; government-provided land/rail/power (~₹2,337 cr); UP UPSIDA capital subsidy; Nivesh Mitra single-window.',
        summary: [
          'Dadri–Boraki combines a multi-modal logistics hub and a transport hub at the meeting point of both dedicated freight corridors — the highest investment-potential node in the set (~₹1.15 lakh cr).',
          'It is a dry port plus passenger-transport hub serving the Noida/Greater Noida/Ghaziabad demand base.',
        ],
        sections: [
          { heading: 'Status & open questions', body: [
            'Land transfer, environmental clearance and rail DPRs are done; PPP concessionaire bids closed in February 2026 and are under evaluation.',
            'No named tenants yet; the project cost is disputed across sources (₹4,034 cr core vs higher full-PPP figures).',
          ] },
        ],
        timeline: [
          { date: 'Dec 2020', label: 'Union Cabinet approval' },
          { date: 'Apr 2023', label: 'Environmental clearance' },
          { date: 'Feb 2026', label: 'PPP concessionaire bids closed' },
        ],
        sources: [
          { label: 'NICDC — MMLH/MMTH Dadri', url: 'https://nicdc.in/projects/4-projects-nearing-completion/multi-modal-logistics-and-transport-hub-dadri-greater-noida-up' },
          { label: 'NICDC DMU Report (Apr 2023)', url: 'https://nicdc.in/images/documents/DMU_Report_April_2023.pdf' },
        ],
      },
            {
        slug: 'jodhpur-pali-marwar', name: 'Jodhpur–Pali–Marwar (JPMIA)', state: 'Rajasthan', stage: 'construction',
        statusLabel: 'Phase-A trunk infrastructure underway', coords: [114, 245],
        areaAc: 38140, projectCostCr: 922, investmentCr: 7500, jobs: 40000,
        sectors: 'Solar components, textiles & handicrafts, agro/food, heavy engineering, logistics', nearest: 'Marwar WDFC station 60 km; Jodhpur airport 30 km; Rohat railway station on-site',
        developer: 'Rajasthan Industrial Corridors Development Corporation Ltd (RIICO 51% : NICDIT 49%)',
        industries: ['Solar component manufacturing', 'Handicrafts & textiles', 'Agro / food processing', 'Stainless-steel & engineering', 'Logistics / warehousing'],
        infrastructure: ['154 sq km notified (~38,140 ac); 64.6 sq km urbanisable; Phase-A 1,578 ac', 'Marwar WDFC 60 km; Jodhpur airport 30 km; Rohat station on-site; NH-65 underpass underway', 'Water 110 MLD from the IGNP via RGLC; urbanisable land-use ~33% industrial'],
        incentives: 'RIPS 2024 (entry from ₹25 cr, 25% upfront land + instalments, 5× super-incentive above ₹3,000 cr, power-cost incentives); DFC freight ~40% cheaper than road.',
        summary: [
          'Rajasthan’s node is the largest DMIC node by notified area (154 sq km) but uses a phased, lower-outlay strategy (Phase-A ₹922 cr).',
          'It is designed to scale the region’s existing base — 500+ handicraft units (~200,000 workers), 1,192 agro units, 150+ stainless-steel re-rollers and 21 RIICO estates.',
        ],
        sections: [
          { heading: 'Status & open questions', body: [
            'Land acquisition is active (641 ha acquired) and ~₹465 cr of trunk-works tenders are issued; no named allottees or MoUs yet.',
            'Investment-potential (₹7,500 vs ₹19,000 cr) and jobs (40,000 vs 300,000) diverge by source — Phase-A versus full 2042 build-out.',
          ] },
        ],
        timeline: [
          { date: 'Jul 2017', label: 'Environmental clearance' },
          { date: 'Aug 2025', label: '₹465 cr civil-works tenders issued' },
          { date: 'Dec 2025', label: '₹922 cr Phase-A approved; 1,578 ac transferred' },
        ],
        sources: [
          { label: 'NICDC — JPMIA', url: 'https://nicdc.in/projects/12-new-projects/jodhpur-pali-marwar-rajasthan' },
          { label: 'ET Government — Phase-A funding', url: 'https://government.economictimes.indiatimes.com/news/governance/jodhpur-pali-marwar-industrial-area-receives-922-crore-for-development/125828883' },
        ],
      },
            {
        slug: 'khushkhera-bhiwadi-neemrana', name: 'Khushkhera–Bhiwadi–Neemrana (KBNIR)', state: 'Rajasthan', stage: 'approved',
        statusLabel: 'Master planning; cost not yet approved', coords: [160, 222],
        areaAc: 40920, jobs: 550000,
        sectors: 'Electronics, automotive, pharma, biotech, metals, textiles', nearest: 'Adjoins the WDFC influence zone; NH-8 through the region; abuts the Manesar–Bawal region',
        developer: 'Rajasthan Industrial Corridors Development Corporation Ltd (NICDIT + Govt of Rajasthan / RIICO)',
        industries: ['Automotive & auto components', 'Electronics manufacturing', 'Pharmaceuticals', 'Metal products & engineering', 'Textiles'],
        infrastructure: ['165.6 sq km delineated (~40,920 ac) across 42 villages; urbanisable ~101 sq km; Phase 1A ~1,425 ha', 'NH-8; planned Delhi–Alwar RRTS link and a 24 sq km aerotropolis; Delhi airport ~100 km', 'Water 380 MLD (Delhi Jal Board agreement); peak power ~4,404 MW + 170 MW solar'],
        incentives: 'Proposed under the Centre’s Bhavya scheme (2026); RIPS 2024 (state-wide); SPV framework in place.',
        summary: [
          'One of seven original Phase-1 DMIC nodes, KBNIR straddles the Rajasthan–Haryana border on the established Bhiwadi–Neemrana auto/electronics belt (~4,000 industries, a 1,100-acre Japanese Zone).',
          'Despite a 2014 environmental clearance, it is the least advanced node — the project cost remains unapproved.',
        ],
        sections: [
          { heading: 'Risks & open questions', body: [
            'As of an April 2023 Lok Sabha answer the Union had not approved the project cost; only ~₹4.9 cr was released for SPV incorporation.',
            'Aravalli regulations and assured water for later phases are unresolved; no node-level allottees or MoUs are disclosed (nearby belt firms — Honda, Saint-Gobain, Jaquar, Relaxo — are not node tenants).',
          ] },
        ],
        timeline: [
          { date: 'Jul 2014', label: 'Environmental clearance' },
          { date: 'Apr 2023', label: 'Lok Sabha: project cost “not approved yet”' },
          { date: '2026', label: 'Proposed under the Bhavya scheme' },
        ],
        sources: [
          { label: 'Lok Sabha — Unstarred Q 5417', url: 'https://sansad.in/getFile/loksabhaquestions/annex/1711/AU5417.pdf?source=pqals' },
          { label: 'Business Standard — KBNIR overview', url: 'https://www.business-standard.com/industry/news/strategic-location-significant-investments-an-expressway-to-industries-124042100681_1.html' },
        ],
      },
            {
        slug: 'dighi-port', name: 'Dighi Port Industrial Area (DPIA)', state: 'Maharashtra', stage: 'construction',
        statusLabel: 'EPC trunk-infrastructure phase', coords: [107, 358],
        areaAc: 6056, projectCostCr: 5468, investmentCr: 38000, jobs: 114183,
        sectors: 'Port-linked manufacturing, pharma, chemicals, engineering, logistics', nearest: 'Dighi Port (Adani-operated) 26–55 km; NH-66 (Mumbai–Goa) 10 km; Mumbai ~117 km',
        developer: 'Maharashtra Industrial Township Ltd (MITL; NICDIT + Govt of Maharashtra)',
        industries: ['Port-led & heavy engineering', 'Pharmaceuticals (1,000-ha life-sciences park)', 'Chemicals', 'Food processing', 'Multi-modal logistics'],
        infrastructure: ['6,056 ac (~2,451 ha); industrial land ~50% — the highest industrial share of any node', 'NH-66 10 km; Konkan Railway to the DFC/JNPT; Navi Mumbai airport upcoming; Adani-run Dighi Port alongside', 'Environmental clearance Oct 2022; 1,180 ac transferred to the SPV; Phase-1 infra cost ~₹3,862 cr'],
        incentives: 'Plug-and-play trunk infra; Industry 4.0 positioning; multi-modal logistics park targeting logistics cost from ~14–16% down to ~9%; port-led export advantage.',
        companies: [{ name: 'Maha Integrated Life Sciences City (Ramky)', sector: '1,000-ha pharma / life-sciences park', note: '95-year concession signed Mar 2026 (~₹3,000 cr)' }, { name: 'Ramky Infrastructure', sector: 'Phase-1 trunk-infra EPC', note: 'Contract awarded Mar 2026 (~₹1,402 cr)' }, { name: 'Adani Ports (APSEZ)', sector: 'Dighi Port expansion (adjacent, not in-node)', note: 'MoU Oct 2025 (~₹42,500 cr)' }],
        summary: [
          'Dighi Port is Maharashtra’s second DMIC node (with AURIC), differentiated by its Dighi Port linkage and the highest industrial-land share of any node (~50%).',
          'It is anchored conceptually by a 1,000-ha life-sciences park and an Adani-operated all-weather port.',
        ],
        sections: [
          { heading: 'Status & open questions', body: [
            'In active EPC construction: Ramky won the ~₹1,402 cr Phase-1 infra contract (Mar 2026) and a 95-year pharma-park concession; trunk infra is targeted within ~3 years of the Aug 2024 approval.',
            'No end-user industrial tenants yet, and the EPC tender faces an alleged-irregularity complaint (pending).',
          ] },
        ],
        timeline: [
          { date: 'Oct 2022', label: 'Environmental clearance' },
          { date: 'Aug 2024', label: 'Union Cabinet approval (₹5,468 cr)' },
          { date: 'Mar 2026', label: 'Ramky EPC contract awarded' },
        ],
        sources: [
          { label: 'NICDC — Dighi Port Industrial Area', url: 'https://nicdc.in/projects/12-new-projects/dighi-port-ind-area-maharashtra' },
          { label: 'Lok Sabha — Unstarred Q 2614', url: 'https://sansad.in/getFile/loksabhaquestions/annex/185/AU2614_KgDOB4.pdf?source=pqals' },
        ],
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
        statusLabel: 'Phase I operational electronics cluster', coords: [193, 419],
        areaAc: 6707, projectCostCr: 730, investmentCr: 35000, jobs: 350000,
        sectors: 'Electronics, mobile components, solar, EV, semiconductor R&D', nearest: 'Kadapa airport 5 km; Krishnapuram rail 5 km; Krishnapatnam seaport ~256 km',
        developer: 'APIIC (Andhra Pradesh Industrial Infrastructure Corporation) — nodal agency; the NICDP activation area is ~2,596 ac',
        industries: ['YSR Electronic Manufacturing Cluster (801 ac, MeitY EMC-2.0)', 'Mobile & consumer electronics', 'EV / e-mobility', 'Solar', 'Semiconductor R&D'],
        infrastructure: ['EMC land-use ~62% industrial / 12% green / 17% vital services / 3% semiconductor R&D', 'NH-40 5 km; NH-67 6 km; Kadapa town ~8 km', '46 MLD water project under development; EMC funded 50:50 GoI (₹350 cr) + State (₹380 cr)'],
        incentives: 'Special Package GO.Ms.No.87 (Dec 2020) — land concession, capital subsidy, SGST reimbursement, stamp-duty exemption; MeitY EMC-2.0 50% grant.',
        companies: [{ name: 'Dixon Technologies (AIL)', sector: 'Surveillance / laptops / tablets', note: 'Committed (~₹207 cr)' }, { name: 'United Telelinks (Neolyncs)', sector: 'Mobile phones / chargers', note: 'Committed (~₹112 cr)' }, { name: 'Chandrahas Enterprises', sector: 'Power banks / cables / audio', note: 'Committed (~₹110 cr)' }, { name: 'Causis e-Mobility', sector: 'Electric buses / EV ecosystem', note: 'Approved Sep 2022 (~₹386 cr)' }, { name: 'Celkon / Digiconn', sector: 'Smartphones / TVs / IoT', note: 'Committed (~₹50 cr each)' }],
        summary: [
          'Kopparthy is the only genuinely operational VCIC node — anchored by the 801-acre YSR Electronic Manufacturing Cluster under MeitY’s EMC-2.0, with eight named allottees committed at its December 2021 launch.',
          'The combined APIIC holding (~6,707 ac) carries projected potential of ~₹35,000 cr and ~350,000 jobs.',
        ],
        sections: [
          { heading: 'Status & tenants', body: [
            'Ready-to-occupy sheds and plots are available; ~₹1,052 cr and ~14,800 jobs were announced at launch, with five electronics manufacturers and 18 MSMEs committed.',
            'Causis e-Mobility (~₹386 cr, 1,000 electric buses) was added in September 2022; a power-equipment hub is planned.',
          ] },
        ],
        timeline: [
          { date: 'Aug 2020', label: 'EMC approved under EMC-2.0' },
          { date: 'Dec 2021', label: 'Mega Industrial Hub & EMC inaugurated — node operational' },
          { date: 'Sep 2022', label: 'Causis e-Mobility approved' },
        ],
        sources: [
          { label: 'NICDC — Kopparthy', url: 'https://nicdc.in/projects/12-new-projects/kopparthy-andhra-pradesh' },
          { label: 'New Indian Express — EMC approval', url: 'https://www.newindianexpress.com/states/andhra-pradesh/2020/Aug/27/rs-730-crore-electronic-cluster-to-come-up-in-kadapa-with-support-of-centre-2188813.html' },
        ],
      },
            {
        slug: 'visakhapatnam', name: 'Visakhapatnam node (Nakkapalli / Rambilli)', state: 'Andhra Pradesh', stage: 'construction',
        statusLabel: 'Phase I infrastructure under construction',
        areaAc: 7680, projectCostCr: 1795,
        sectors: 'Pharma / bulk drugs, transport equipment, electronics, textiles', nearest: 'Elamanchili rail 10–12 km; Visakhapatnam Port 20–40 km; Vizag airport 40 km',
        developer: 'Visakhapatnam Industrial Node Development Corporation Ltd (incorporated 4 Sep 2018)',
        industries: ['Pharmaceuticals & bulk drugs', 'Transport equipment', 'Electronics / IT', 'Textiles'],
        infrastructure: ['Two clusters — Rambilli (396 ac) + Nakkapalli (441 ha Phase I); Nakkapalli ~52% industrial', 'NH-16; Atchuthapuram–Anakapalli road widened; Vizag 35–40 km', 'Water from the Yeluru Left Main Canal; internal infra funded by ADB’s VCICDP Tranche 2 (~US$215m)'],
        incentives: 'No node-specific fiscal framework recorded; ADB VCICDP infrastructure support; statewide single-window via APIIC.',
        summary: [
          'A two-cluster pharma-and-port node in Anakapalli district, with internal infrastructure funded by ADB’s VCIC Development Programme.',
          'Its operational anchor is the adjoining 2,400-acre Jawaharlal Nehru Pharma City (104 industries, global majors) — context, not a VCIC allottee.',
        ],
        sections: [
          { heading: 'Risks & open questions', body: [
            'The SPV has only ₹1 lakh paid-up capital and the one named in-node allottee (Prana Pharmaceuticals) faced cancellation; investment and jobs targets are undisclosed.',
            'Land acquisition is near-complete (95.7% at Rambilli) and the ADB facility runs to September 2026.',
          ] },
        ],
        timeline: [
          { date: 'Sep 2018', label: 'SPV incorporated' },
          { date: 'Apr 2023', label: 'ADB Tranche-2 approval' },
          { date: '2026', label: 'ADB MFF availability extended to Sep 2026' },
        ],
        sources: [
          { label: 'ADB — VCICDP project documents', url: 'https://www.adb.org' },
          { label: 'PIB — VCIC / NICDP', url: 'https://www.nicdc.in/index.php/visakhapatnam-chennai-industrial-corridor-vcic.html' },
        ],
      },
            {
        slug: 'chittoor', name: 'Chittoor node (Srikalahasti–Yerpedu / Naidupeta)', state: 'Andhra Pradesh', stage: 'approved',
        statusLabel: 'Master plan done; developer selection underway', coords: [198, 442],
        areaAc: 11000,
        sectors: 'Automobile & auto components, engineering, electronics, textiles, food, logistics', nearest: 'Chennai / Krishnapatnam ports ~100 km; Chennai airport ~80 km; NH-16',
        developer: 'Chittoor Industrial Node Development Corporation Ltd (incorporated Oct 2018)',
        industries: ['Automobile & auto components', 'Engineering', 'Electronics', 'Textiles', 'Food processing', 'MSME / logistics'],
        infrastructure: ['Master plan ~11,000 ac; primary activity is the 2,300-acre Kosalanagaram Industrial Park (Phase I)', 'NH-16 (Golden Quadrilateral); Chennai ~80 km, Bengaluru ~200 km; Sri City adjacency', 'Naidupeta power augmentation ₹338 cr; 1 MLD CETP; VCIC ADB loan ~US$615m + State ~US$215m'],
        incentives: 'No node-specific fiscal framework recorded; statewide stamp-duty reimbursement, subsidies and power subsidies; Kosalanagaram on a PPP/private-developer model.',
        summary: [
          'Positioned between Chennai and Bengaluru with Sri City adjacency, Chittoor’s active development is the 2,300-acre Kosalanagaram Industrial Park, targeting automobiles, engineering and MSMEs on a “work, live and learn” township model.',
          'At ~11,000 acres it is the second-largest planned VCIC node, with master planning complete.',
        ],
        sections: [
          { heading: 'Status & tenants', body: [
            'No named allottee or MoU is tied to the node; APIIC began selecting private developers for Kosalanagaram in May 2026, starting with a 500-acre phase.',
            'Chittoor’s existing base (177 major projects, ~₹24,000 cr; 9,271 MSMEs) and Sri City tenants (Isuzu, PepsiCo, Colgate, Alstom) predate the node and are not VCIC allottees.',
          ] },
        ],
        timeline: [
          { date: 'Oct 2018', label: 'SPV incorporated' },
          { date: 'Nov 2019', label: 'Kosalanagaram ToR granted' },
          { date: 'May 2026', label: 'APIIC developer selection initiated' },
        ],
        sources: [
          { label: 'MoEFCC — Kosalanagaram ToR', url: 'https://environmentclearance.nic.in' },
          { label: 'NICDC — VCIC', url: 'https://www.nicdc.in/index.php/visakhapatnam-chennai-industrial-corridor-vcic.html' },
        ],
      },
            {
        slug: 'machilipatnam', name: 'Machilipatnam node', state: 'Andhra Pradesh', stage: 'planned',
        statusLabel: 'Port under construction; node pre-development', coords: [227, 395],
        areaAc: 12145, projectCostCr: 5156,
        sectors: 'Marine processing, boat-building, aquaculture, textiles (Kalamkari), logistics', nearest: 'Machilipatnam port (under construction) on-site; Vijayawada airport ~60 km',
        developer: 'No NICDC–AP SPV identified; the port is state-led (not in the NICDP approved list as of Aug 2025)',
        industries: ['Machilipatnam deep-water port (4 berths, 35→116 MTPA)', '300-acre MSME park (Gilakaladindi)', 'Marine product processing', 'Boat manufacturing'],
        infrastructure: ['Node area ~12,145 ac (NREDCAP); only a 300-acre MSME park is concretely earmarked', 'NH-65 and NH-216; Machilipatnam–Repalle rail line at DPR stage; Vijayawada ~60 km', 'Water from the Krishna river; port project cost ~₹5,156 cr, Phase I targeted Dec 2026'],
        incentives: 'No node-specific framework yet (pre-development); statewide AP policy to apply once an SPV is operational.',
        summary: [
          'Development hinges on the ₹5,156 cr Machilipatnam deep-water port (Phase I targeted Dec 2026); a 300-acre MSME park is earmarked at Gilakaladindi for marine processing, boat-building and Kalamkari.',
          'It is a port-led node that has not yet started as an industrial node.',
        ],
        sections: [
          { heading: 'Risks & open questions', body: [
            'Machilipatnam is absent from NICDP’s 20 approved projects (Aug 2025), has no SPV, no EPC contractor, no industrial-node DPR and no named tenants — well behind Krishnapatnam.',
            'Rail cargo connectivity depends on a Machilipatnam–Repalle line still at DPR stage.',
          ] },
        ],
        timeline: [
          { date: 'May 2023', label: 'Port project launched' },
          { date: '2025', label: '300-acre MSME park earmarked' },
          { date: 'Dec 2026', label: 'Port Phase I completion target' },
        ],
        sources: [
          { label: 'Lok Sabha — NICDP status (Aug 2025)', url: 'https://sansad.in' },
          { label: 'AP Maritime Board — Machilipatnam Port', url: 'https://apmaritime.in' },
        ],
      },
            {
        slug: 'donakonda', name: 'Donakonda node', state: 'Andhra Pradesh', stage: 'planned',
        statusLabel: 'Strategic land bank; not prioritised', coords: [208, 410],
        areaAc: 17117,
        sectors: 'Building materials, general manufacturing, logistics', nearest: 'Donakonda rail station (Guntur–Guntakal line); Ongole ~81 km',
        developer: 'No SPV identified; an APIIC “Donakonda Mega Industrial Hub” land bank (not in the 2024 NICDP Cabinet list)',
        industries: ['Building materials', 'General manufacturing', 'Logistics'],
        infrastructure: ['~17,117 ac — the largest VCIC node by planned area, but a land bank with no tenant activity', 'Rail via the Guntur–Guntakal line; no port linkage; in backward Prakasam district', 'No construction, no ADB funding (ADB works are at Vizag/Chittoor)'],
        incentives: 'No node-specific framework; general AP policy would apply if/when activated.',
        summary: [
          'At ~17,117 acres Donakonda is the biggest VCIC node by planned area, yet it was not prioritised for Phase I and is absent from the 2024 NICDP approvals.',
          'It functions as a strategic land bank with no SPV, no ADB funding and no construction.',
        ],
        sections: [
          { heading: 'Risks & open questions', body: [
            'The headline 2016 MoU (~₹43,120 cr) with two Chinese associations shows no land acquisition or implementation and should be read as lapsed intent, not pipeline.',
            'No environmental clearance, DPR, land-acquisition status or named tenant could be verified.',
          ] },
        ],
        timeline: [
          { date: 'Jun 2016', label: 'Chinese-associations MoU (now inactive)' },
          { date: 'Nov 2019', label: 'Confirmed not a Phase-I priority' },
          { date: 'Aug 2024', label: 'Excluded from the NICDP Cabinet approvals' },
        ],
        sources: [
          { label: 'Lok Sabha — Q 608', url: 'https://sansad.in/getFile/loksabhaquestions/annex/172/AU608.pdf' },
          { label: 'PIB — Cabinet (12 new projects)', url: 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2024/aug/doc2024830383401.pdf' },
        ],
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
        slug: 'tumakuru', name: 'Tumakuru node (Vasanthanarasapura)', state: 'Karnataka', stage: 'operational',
        statusLabel: 'Operational machine-tool park; Phase 1 building', coords: [169, 440],
        areaAc: 8500, projectCostCr: 13717, investmentCr: 50000, jobs: 220000,
        sectors: 'Machine tools, precision mfg, electronics, auto, textiles, pharma', nearest: 'NH-48 adjacent; Bengaluru ~120 km; Kempegowda airport ~115 km',
        developer: 'CBIC Tumakuru Industrial Township Ltd (50:50 NICDIT : KIADB; SHA/SSA signed 30 Oct 2018)',
        industries: ['Tumakuru Machine Tool Park (530 ac — India’s first)', 'Japan Industrial Township (160 ac, 107 firms)', 'Precision manufacturing', 'Auto components', 'Electronics'],
        infrastructure: ['~73% saleable / 27% non-saleable (JICA scope); Phase 1 = 1,736 ac under construction', 'NH-48; Bengaluru ~120 km; Kempegowda airport ~115 km; Dabhol–Bengaluru gas pipeline nearby', '~₹959 cr power provision; JICA water/effluent ~₹3,000 cr; 99-year KIADB lease (~₹1.2 cr/acre)'],
        incentives: '“Play-and-plug” ready facilities; Machine Tool Park concessional land (~₹1 cr/acre); 99-year lease; common engineering/test/incubation centres.',
        companies: [{ name: 'Havells India', sector: 'Wire & cable', note: 'Land allotted (62 ac)' }, { name: 'Toyota', sector: 'Automotive', note: 'In the Japan Industrial Township' }, { name: 'Ace Multi Axes Systems', sector: 'Multi-axis CNC', note: 'Allotted (Machine Tool Park)' }, { name: 'Coastal Chrome India', sector: 'Chrome products', note: 'Allotted (Machine Tool Park)' }],
        summary: [
          'Tumakuru is the only CBIC node with operational tenants: the 530-acre Machine Tool Park (India’s first) is occupied, and an existing Japan Industrial Township houses 107 firms including Toyota.',
          'Karnataka already accounts for ~52% of India’s machine-tool output and ~62% of exports, so the node extends a live base rather than a greenfield bet.',
        ],
        sections: [
          { heading: 'Status & what remains', body: [
            'Phase 1 (1,736 acres) is under construction targeting end-2026, with a play-and-plug model already operating.',
            'Beyond the sector parks, anchor tenants for the core 8,500-acre node are not yet disclosed; a new 300-acre Japan Industrial Park (Nov 2025) is yet to allot.',
          ] },
        ],
        timeline: [
          { date: '2016', label: 'JICA master plan (₹13,717 cr)' },
          { date: '2018', label: 'SHA/SSA signed; SPV finalised' },
          { date: '2021', label: 'Machine Tool Park ready' },
          { date: '2023', label: 'PM lays foundation stone' },
        ],
        sources: [
          { label: 'Indian Express — Tumakuru smart city', url: 'https://indianexpress.com/article/cities/bangalore/invest-karnataka-25-tumakurus-industrial-smart-city-2026-piyush-goyal-9833519/lite/' },
          { label: 'JICA — CBIC report', url: 'https://openjicareport.jica.go.jp/pdf/12249330.pdf' },
        ],
      },
            {
        slug: 'krishnapatnam', name: 'Krishnapatnam (KRIS City)', state: 'Andhra Pradesh', stage: 'construction',
        statusLabel: 'Trunk infrastructure under construction', coords: [212, 425],
        areaAc: 10835, projectCostCr: 2139, investmentCr: 37500, jobs: 515900,
        sectors: 'Textiles, food, auto, electronics, metals, port-linked manufacturing', nearest: 'Krishnapatnam Port adjacent / 15 km; NH-16 direct; bridges the CBIC and VCIC corridors',
        developer: 'Krishnapatnam Industrial City Development Ltd (50:50 NICDIT : APIIC; incorporated 7 Aug 2018)',
        industries: ['Port-linked manufacturing', 'Textiles', 'Food processing', 'Auto components', 'Electronics & metals'],
        infrastructure: ['Core node (KRIS City) trunk infra underway; ~5,500 ac industrial by 2040; 16 residential zones', 'NH-16 direct; Adani-run Krishnapatnam Port adjacent', 'Phase-1 trunk infra ₹1,200 cr budget (~₹350 cr spent by Mar 2026); EPC contract ~₹1,173 cr awarded'],
        incentives: 'Port-proximity export advantage; state-funded trunk infra; AP Maritime Policy (25% capital subsidy, 100% SGST for 10 yrs) for port-linked units.',
        summary: [
          'KRIS City sits beside the Adani-run Krishnapatnam Port and bridges the CBIC and VCIC corridors, making it AP’s flagship port-linked manufacturing node.',
          'Despite ArcelorMittal and ISMT plants in the wider region, APIIC records zero plots allotted in the ~4,855-acre core node as of 2026.',
        ],
        sections: [
          { heading: 'Status & open questions', body: [
            'The PM laid the foundation stone in January 2025; the EPC (~₹1,173 cr) is awarded and ~₹350 cr of the ₹1,200 cr Phase-1 budget spent, with Phase-1 completion targeted Feb 2027.',
            'No core-node land allotments yet; the only node-specific commitments (Petrogas LNG, a Tillman data centre) are state-level MoUs.',
          ] },
        ],
        timeline: [
          { date: '2017', label: 'SHA/SSA signed' },
          { date: '2018', label: 'SPV incorporated' },
          { date: 'Dec 2020', label: 'Union Cabinet approval' },
          { date: 'Jan 2025', label: 'PM foundation stone; EPC awarded' },
        ],
        sources: [
          { label: 'KRIS City — APICDC', url: 'https://apicdc.in/about-kriscity/' },
          { label: 'PIB — CBIC / Krishnapatnam (PRID 1897398)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1897398&reg=3&lang=2' },
        ],
      },
            {
        slug: 'ponneri', name: 'Ponneri node (Engineering Hub)', state: 'Tamil Nadu', stage: 'planned',
        statusLabel: 'Master planning; land acquisition stalled', coords: [214, 440],
        areaAc: 21966, projectCostCr: 32713,
        sectors: 'Auto & components, chemicals, machinery, electronics, metallurgy, textiles, pharma', nearest: 'Ennore Port within the node boundary; Chennai Port ~20 km; Chennai city 36 km',
        developer: 'CBIC Ponneri Industrial Township Ltd (incorporated 30 Jul 2020); state agency TIDCO',
        industries: ['Automobiles & auto components', 'Chemicals & petrochemicals', 'Machinery & electronics', 'Metallurgy', 'Textiles & pharmaceuticals'],
        infrastructure: ['Greenfield developable 13,581 ac of a 21,966-acre total; not yet developed', 'Ennore Port in-boundary; Chennai 36 km; Chennai airport ~50 km', 'EPC tenders not issued; ~3,375 ac notified; the 2,300-acre Manellore parcel withdrawn Jul 2022'],
        incentives: 'TN industrial-park capital subsidy 12% (Tiruvallur = B-category); SIPCOT 50% stamp-duty concession; TN EV Policy 2023 (100% SGST 15 yrs, 20% capital subsidy).',
        summary: [
          'Envisioned as an “Engineering Hub for Auto & Machinery” on 21,966 acres with Ennore Port inside its boundary, 36 km from Chennai’s automotive cluster.',
          'The node is stalled at land confirmation — the 2,300-acre Manellore parcel was withdrawn in July 2022 and much of the area remains unacquired.',
        ],
        sections: [
          { heading: 'Risks & open questions', body: [
            'The SPV was incorporated in 2020 and a master-plan consultant appointed for 4,000 acres, but no EPC tender has been issued and no construction has begun.',
            'No anchor tenants or MoUs exist for the core node; the only Ponneri-referenced commitments sit in a private park or are unbuilt state-level MoUs.',
          ] },
        ],
        timeline: [
          { date: '2015', label: 'JICA master plan (~22,000 ac)' },
          { date: 'Jul 2020', label: 'SPV incorporated' },
          { date: 'Jul 2022', label: 'Manellore parcel withdrawn' },
          { date: 'Sep 2022', label: '~3,375 ac notified; EPC not issued' },
        ],
        sources: [
          { label: 'NICDC DMU Report (Sep 2022)', url: 'https://nicdc.in/images/documents/DMU_report_of_Setember_2022_NICDC.pdf' },
          { label: 'DPIIT — CBIC node document', url: 'https://dipp.gov.in/sites/default/files/Details_of_three_CBIC_Node.pdf' },
        ],
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
  'odisha-economic': {
    slug: 'odisha-economic',
    intro: [
      'The Odisha Economic Corridor (OEC) runs ~600 km along NH-16 — the northern stretch of the East Coast Industrial Corridor, linking to VCIC. ADB prepared the concept plan and NICDIT approved its inclusion in August 2020, with two priority node-zones identified: GBK (Gopalpur–Bhubaneswar–Kalinganagar) and PKDS (Paradip–Kendrapada–Dhamra–Subarnarekha), ~11,366 acres in all.',
      'As of the DPIIT status report (31 Oct 2025), the NICDP nodes are on hold — land at both GBK and PKDS is not confirmed, and the state is studying alternative parcels. So while Odisha’s coast is one of India’s most industrialised, the corridor’s own nodes have not yet broken ground.',
      'The crucial distinction: the operating steel economy at Kalinganagar (Tata Steel, NINL, Jindal, VISA) is a separate state-led complex adjacent to the proposed GBK node, not the NICDP node itself. We show it as context, not as corridor delivery.',
    ],
    facts: [
      { k: 'Length', v: '~600 km along NH-16' },
      { k: 'State', v: 'Odisha' },
      { k: 'Part of', v: 'East Coast Industrial Corridor (links to VCIC)' },
      { k: 'Concept plan', v: 'Asian Development Bank' },
      { k: 'Developer', v: 'NICDC / NICDIT (approved Aug 2020)' },
      { k: 'Nodes', v: 'GBK + PKDS (~11,366 acres) — currently on hold' },
    ],
    nodes: [
            {
        slug: 'gbk', name: 'GBK Zone (Gopalpur–Bhubaneswar–Kalinganagar)', state: 'Odisha', stage: 'planned',
        statusLabel: 'Pre-development; land unconfirmed', coords: [295, 331],
        areaAc: 4748, investmentCr: 81000, jobs: 800000,
        sectors: 'Steel & metals, downstream metal products, manufacturing', nearest: 'NH-16 backbone; Gopalpur Port within the node footprint',
        developer: 'NICDC–Odisha SPV (registered name/shareholding not on record); OEC approved by NICDIT 19 Aug 2020',
        industries: ['Steel & metals', 'Downstream metal products', 'General manufacturing'],
        infrastructure: ['Bundles six clusters across four districts along NH-16 — not a single contiguous area', 'NH-16 backbone; Bhubaneswar airport; Gopalpur all-weather port', 'ADB prepared a Concept Development Plan; a salt-land suitability study is under way'],
        incentives: 'No node-specific framework recorded; statewide Electronics Component Policy 2025 (50% capital subsidy) and IT Policy 2025 (30% capital subsidy).',
        summary: [
          'GBK bundles six clusters across four districts along NH-16, anchored on Odisha’s Kalinganagar steel hub (Tata Steel, Jindal Stainless and others).',
          'Those are legacy industries within the footprint, not node allottees — the NICDC node itself has attracted none.',
        ],
        sections: [
          { heading: 'Risks & open questions', body: [
            'As of January 2023 the state had not confirmed Phase-1 land parcels in Khordha, and an April 2025 report shows land details still being requested.',
            'The SPV name, shareholding, DPR and environmental clearance are undocumented, and the 2020 projections (₹81,000 cr, 8 lakh jobs) are outdated.',
          ] },
        ],
        timeline: [
          { date: 'Aug 2020', label: 'OEC approved by NICDIT' },
          { date: 'Jan 2023', label: 'Consultant appointed; Khordha land unconfirmed' },
          { date: 'Apr 2025', label: 'NICDC still requesting land details' },
        ],
        sources: [
          { label: 'NICDC — Odisha Economic Corridor', url: 'https://www.nicdc.in/index.php/odisha-economic-corridor-oec.html' },
          { label: 'NICDC DMU Report (Jan 2023)', url: 'https://nicdc.in/images/documents/DMU_report_January_2023.pdf' },
        ],
      },
            {
        slug: 'pkds', name: 'PKDS Zone (Paradip–Kendrapada–Dhamra–Subarnarekha)', state: 'Odisha', stage: 'planned',
        statusLabel: 'Pre-development; IOCL anchor MoUs signed', coords: [306, 330],
        areaAc: 6618, investmentCr: 81000, jobs: 800000,
        sectors: 'Petrochemicals, ports & logistics, fertilisers & chemicals, technical textiles', nearest: 'Paradip Port (major) and Dhamra Port within the node footprint; NH-16 backbone',
        developer: 'NICDC–Odisha SPV (registered name/shareholding not on record); OEC approved by NICDIT Sep 2020',
        industries: ['Petrochemicals', 'Ports & logistics', 'Fertilisers & chemicals', 'Plastics', 'Technical textiles'],
        infrastructure: ['Bundles eight coastal clusters around Paradip (PCPIR, 15 MMTPA IOCL refinery) and Dhamra', 'NH-16 + a new Rameshwar–Paradip coastal highway (160 km, ₹8,301 cr, approved Jun 2026)', 'ADB Concept Development Plan; IDCO land-bank mission (₹1,000 cr grant, 2025)'],
        incentives: 'No node-specific framework recorded; Sagarmala port-led funding; IDCO land bank; statewide policies apply.',
        summary: [
          'PKDS bundles eight coastal clusters around Paradip (a 145 MT major port, 15 MMTPA IOCL refinery, PCPIR) and Dhamra — the OEC’s strongest infrastructure node.',
          'It has the corridor’s only sizeable committed investor: IOCL’s ~₹61,000 cr Paradip naphtha cracker plus a ~₹4,352 cr Bhadrak yarn project, with Odisha taking equity.',
        ],
        sections: [
          { heading: 'Status & open questions', body: [
            'Project development is “initiated” but no Phase-1 land parcels are confirmed and the IOCL projects remain at MoU / in-principle stage with no lease deed executed.',
            'The SPV name, shareholding, DPR and node-specific incentives are undocumented; the 2020 projections are outdated.',
          ] },
        ],
        timeline: [
          { date: 'Sep 2020', label: 'OEC approved by NICDIT' },
          { date: 'Jan 2025', label: 'IOCL MoU at the Utkarsh Odisha summit' },
          { date: 'Jun 2026', label: 'Coastal highway approved' },
        ],
        sources: [
          { label: 'NICDC — Odisha Economic Corridor', url: 'https://www.nicdc.in/index.php/odisha-economic-corridor-oec.html' },
          { label: 'PIB — Ports (PRID 2085503)', url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2085503' },
        ],
      },
    ],
    milestones: [
      { date: 'Aug 2020', label: 'NICDIT approves OEC inclusion' },
      { date: '2023', label: 'Alternative (Ganjam salt-land) parcels under study' },
      { date: 'Oct 2025', label: 'DPIIT: development on hold, land unconfirmed' },
    ],
    sources: [{ label: 'NICDC — OEC executive summary', url: 'https://api.nicdc.in/upload/image/OECExecutiveSummaryReport.pdf' }, { label: 'DPIIT status report (31 Oct 2025)', url: 'https://www.dpiit.gov.in/static/uploads/2025/11/34953d677cb89d642b15907555250523.pdf' }],
  },
  'hyderabad-nagpur': {
    slug: 'hyderabad-nagpur',
    intro: [
      'The Hyderabad–Nagpur Industrial Corridor (HNIC) runs along NH-44, with a single priority node in Telangana: Zaheerabad. CCEA approved it on 28 August 2024 and TGIIC is the state partner; the node is now in EPC procurement.',
    ],
    facts: [
      { k: 'Backbone', v: 'NH-44 (Hyderabad–Nagpur)' },
      { k: 'States', v: 'Telangana (priority node); Maharashtra in influence area' },
      { k: 'Developer', v: 'NICDIT + TGIIC' },
      { k: 'CCEA approval', v: '28 Aug 2024' },
      { k: 'Node', v: 'Zaheerabad (Phase-1 3,909 of ~12,635 acres)' },
    ],
    nodes: [
            {
        slug: 'zaheerabad', name: 'Zaheerabad NIMZ', state: 'Telangana', stage: 'construction',
        statusLabel: 'Execution phase began April 2026', coords: [176, 372],
        areaAc: 12635, projectCostCr: 2361, investmentCr: 10000, jobs: 174000,
        sectors: 'Automobile, EV, defence, electrical equipment, metals, electronics', nearest: 'NH-65 (Pune–Machilipatnam) 9 km via a new greenfield road; Bidar airport 20 km; Hyderabad 80 km',
        developer: 'NICDIT Zaheerabad Industrial Smart City Ltd (51% TGIIC : 49% NICDIT; 2024-25)',
        industries: ['EV manufacturing', 'Integrated defence systems', 'Automotive R&D & test track', 'Electrical equipment'],
        infrastructure: ['Phase-1 (3,245 ac): industrial/logistics ~61%, green ~19%, roads ~13%', 'NH-65 9 km; Hyderabad 80 km; RGIA airport 125 km; Bidar airport 20 km', '~9,000 of 12,635 ac acquired by April 2026'],
        incentives: 'Telangana state package; equal R&R compensation to assigned and registered landholders.',
        companies: [{ name: 'Hyundai Motor', sector: 'Automotive R&D / test track', note: 'Allotted, under construction (675 ac, ~₹8,528 cr)' }, { name: 'VEM Technologies', sector: 'Integrated defence systems', note: 'Allotted; bhoomi puja 2022 (511 ac, ~₹2,200 cr)' }, { name: 'Triton EV', sector: 'EVs & Li-ion batteries', note: 'MoU; land allotted (~₹3,500 cr)' }, { name: 'One Moto (UK)', sector: 'EV & battery', note: 'MoU (~₹400 cr)' }],
        summary: [
          'Approved as a NIMZ in 2016, Zaheerabad languished for over a decade before the August 2024 NICDP smart-city approval revived it.',
          'By April 2026 the execution phase had begun, with ~9,000 acres acquired and Hyundai, VEM and Triton committing over ₹14,000 cr combined.',
        ],
        sections: [
          { heading: 'Anchor tenants & open questions', body: [
            'Hyundai’s scope grew from a 300-acre R&D test track (2024) to a 675-acre, ~₹8,528 cr Global Innovation R&D Centre (2026) — the node’s largest commitment.',
            'The detailed NICDP master plan and precise SPV terms remain partly unconfirmed; ~3,600 acres are still to acquire.',
          ] },
        ],
        timeline: [
          { date: 'Jan 2016', label: 'NIMZ final approval' },
          { date: 'Aug 2024', label: 'Union Cabinet NICDP approval' },
          { date: 'Apr 2026', label: 'Execution phase commenced' },
        ],
        sources: [
          { label: 'NICDC — Zaheerabad', url: 'https://nicdc.in/projects/12-new-projects/zaheerabad-telangana' },
          { label: 'ET Infra — Zaheerabad', url: 'https://infra.economictimes.indiatimes.com/news/urban-infrastructure/zaheerabad-industrial-smart-city-a-15000-crore-investment-with-huge-job-creation/123293521' },
        ],
      },
    ],
    milestones: [
      { date: 'Aug 2024', label: 'CCEA approves Zaheerabad node' },
      { date: 'Jul 2025', label: 'PMC onboarded' },
      { date: 'Oct 2025', label: '2nd-call EPC tender floated' },
    ],
    sources: [{ label: 'DPIIT status report (31 Oct 2025)', url: 'https://www.dpiit.gov.in/static/uploads/2025/11/34953d677cb89d642b15907555250523.pdf' }],
  },
  'hyderabad-warangal': {
    slug: 'hyderabad-warangal',
    intro: [
      'The Hyderabad–Warangal Industrial Corridor (HWIC) runs 235 km along NH-163. As a national-programme corridor it is the weakest of the set: its proposed NICDP node — Hyderabad Pharma City — was withdrawn from the programme in June 2022 and later scrapped at scale by the state.',
      'The real on-the-ground industry on this axis is the state-led Kakatiya Mega Textile Park near Warangal, which is genuinely operational with named anchors — but it sits outside the NICDP node structure. We show both, clearly labelled.',
    ],
    facts: [
      { k: 'Length', v: '235 km along NH-163' },
      { k: 'State', v: 'Telangana' },
      { k: 'NICDP node', v: 'Hyderabad Pharma City — withdrawn (Jun 2022)' },
      { k: 'Live industry', v: 'Kakatiya Mega Textile Park (state-led)' },
    ],
    nodes: [
            {
        slug: 'kakatiya-textile-park', name: 'Kakatiya Mega Textile Park, Warangal', state: 'Telangana', stage: 'operational',
        statusLabel: 'India’s first operational PM MITRA park', coords: [203, 368],
        areaAc: 1327, projectCostCr: 1696, investmentCr: 6000, jobs: 24400,
        sectors: 'Spinning, weaving, processing, garments, technical textiles', nearest: 'NH-163 proximity; the planned Nagpur–Vijayawada Expressway (NH-163G) nearby',
        developer: 'TSIIC/TGIIC under the PM MITRA scheme (CETP SPV incorporated 19 Dec 2021)',
        industries: ['Apparel & technical textiles', 'PET-to-polyester recycling', 'Denim', 'Home textiles'],
        infrastructure: ['~62% of the 1,327-acre park allotted; full 5F (Farm-Fibre-Factory-Fashion-Foreign) value chain', 'NH-163 proximity; multimodal rail links cited', '232/132/33 kV substation + 220 kV line; 12 MLD water; 5 MLD ZLD CETP; 10 MW solar planned'],
        incentives: 'PM MITRA central grant ₹200 cr; plug-and-play; Telangana Textiles Policy (capital subsidy, SGST reimbursement, interest subsidy, power concession).',
        companies: [{ name: 'Youngone Corporation', sector: 'Apparel / export', note: 'Operational since Oct 2025 (~90% women workforce; ~₹1,000 cr proposed)' }, { name: 'Ganesha Ecosphere', sector: 'Recycled polyester', note: 'Operational' }, { name: 'Welspun Group', sector: 'Home textiles', note: 'MoU (~₹750 cr)' }, { name: 'Kitex Group', sector: 'Integrated fibre-to-apparel', note: 'MoU Sep 2025 (~₹2,400 cr across two clusters)' }],
        summary: [
          'Inaugurated by the PM on 10 May 2026, KMTP is India’s first fully functional PM MITRA park and its largest textile hub by area (1,327 acres).',
          'It pursues the full 5F value chain rather than a single stage like Tirupur or Surat.',
        ],
        sections: [
          { heading: 'Status & tenants', body: [
            'About 62% of the park is allotted, over ₹3,800 cr is grounded, and Youngone and Ganesha Ecosphere are already producing — Youngone exporting since October 2025.',
            'Verified operational tenants are still few; the larger MoU pipeline is mostly intent, and 863 R&R plots went to 1,398 displaced families.',
          ] },
        ],
        timeline: [
          { date: 'Jul 2017', label: 'Environmental clearance' },
          { date: 'Oct 2025', label: 'Youngone commercial production' },
          { date: 'May 2026', label: 'PM inauguration' },
        ],
        sources: [
          { label: 'Telangana Today — Youngone', url: 'https://telanganatoday.com/korean-firm-youngone-begins-commercial-production-from-warangal-textile-park' },
          { label: 'Textile Value Chain — Kitex', url: 'https://textilevaluechain.in/garment-giant-kitex-in-telangana-india-mou-signed-for-rs-2400-crore-investment-to-create-40000-jobs' },
        ],
      },
            {
        slug: 'hyderabad-pharma-city', name: 'Hyderabad Pharma City', state: 'Telangana', stage: 'construction',
        statusLabel: 'State-led NIMZ; Phase 1 under construction',
        areaAc: 19333, projectCostCr: 19098, investmentCr: 11100, jobs: 166000,
        sectors: 'Pharmaceuticals, bulk drugs, biotech, vaccines, life sciences, R&D', nearest: 'Outer Ring Road 25 km; Rajiv Gandhi International Airport 29 km',
        developer: 'Hyderabad Pharma City Ltd (TSIIC-implemented) — a state-led NIMZ, not on the NICDC list',
        industries: ['Bulk drug manufacturing', 'Formulations', 'R&D', 'Vaccines & biologics (later phases)'],
        infrastructure: ['Zoned (bulk drug, formulations, R&D, ancillary, townships, green buffers); ~12,000 of 19,300 ac acquired', 'ORR 25 km; RGIA 29 km; no DFC/port connectivity recorded', 'Tabreed district-cooling ($200m / 125,000 RT); dedicated water/power & CETP planned for Phase 1'],
        incentives: 'Telangana Next-Gen Life Sciences Policy 2026-30 (100% stamp duty, 100% net SGST 5 yrs, 25% land-cost reimbursement, power subsidy); NIMZ single-window.',
        companies: [{ name: 'Bharat Biotech', sector: 'Vaccines / biotech', note: 'MoU (BioAsia 2025)' }, { name: 'Biological E', sector: 'Vaccines / biologics', note: 'MoU' }, { name: 'Granules / Jubilant / Aragen / Sai Life Sciences', sector: 'Pharma / CDMO / R&D', note: 'MoUs (part of an 11-firm, ~₹5,445 cr pool)' }, { name: 'Amazon Data Services / Adani Defence', sector: 'Data centre / defence (non-pharma)', note: 'Allotted — CAG-flagged as off-mandate' }],
        summary: [
          'At 19,000+ acres this is larger than any existing pharma cluster in India (Genome Valley is ~2,000 ac) and has held NIMZ status since December 2019.',
          'Despite ~17 MoUs worth ~₹11,100 cr, no facility is operational and the CAG has documented land-acquisition delays and fund diversions.',
        ],
        sections: [
          { heading: 'Risks & open questions', body: [
            'Over 10,000 acquired acres are non-contiguous, environmental-clearance status is undocumented, and water sourcing — critical for pharma — is unspecified.',
            'Two flagship allotments, Amazon (a 48-acre data centre) and Adani Defence, were formally questioned by the CAG as deviations from the pharma mandate.',
          ] },
        ],
        timeline: [
          { date: 'Dec 2019', label: 'NIMZ status granted' },
          { date: 'Feb 2025', label: '11 MoUs at BioAsia (~₹5,445 cr)' },
          { date: '2026', label: 'Phase 1 industries projected to commence' },
        ],
        sources: [
          { label: 'PIB — pharma city', url: 'https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1905210' },
          { label: 'Times of India — CAG on land allotment', url: 'https://timesofindia.indiatimes.com/city/hyderabad/cag-questions-land-allotment-by-telangana-govt-to-amazon-in-pharma-city/articleshow/129905143.cms' },
        ],
      },
    ],
    sources: [{ label: 'DPIIT status report (31 Oct 2025)', url: 'https://www.dpiit.gov.in/static/uploads/2025/11/34953d677cb89d642b15907555250523.pdf' }],
  },
  'hyderabad-bengaluru': {
    slug: 'hyderabad-bengaluru',
    intro: [
      'The Hyderabad–Bengaluru Industrial Corridor (HBIC) runs along NH-44 in Andhra Pradesh, and is the most advanced of the newer southern corridors: both its nodes — Orvakal and Kopparthy — received Prime-Ministerial foundation stones on 16 October 2025, with EPC contractors on board and land and equity released.',
      'A structural note: Kopparthy is officially cross-listed as a VCIC node, folded into the same AP SPV as Orvakal. We profile it here too because it is an HBIC anchor, but its primary corridor listing is VCIC.',
    ],
    facts: [
      { k: 'Backbone', v: 'NH-44 (Hyderabad–Bengaluru)' },
      { k: 'State', v: 'Andhra Pradesh' },
      { k: 'Developer', v: 'AP Industrial Corridor Infrastructure Development Corp + NICDIT' },
      { k: 'CCEA approval', v: '28 Aug 2024' },
      { k: 'Nodes', v: 'Orvakal + Kopparthy (PM foundation 16 Oct 2025)' },
    ],
    nodes: [
            {
        slug: 'orvakal', name: 'Orvakal node', state: 'Andhra Pradesh', stage: 'construction',
        statusLabel: 'EPC appointed; construction not yet started', coords: [183, 406],
        areaAc: 9719, projectCostCr: 2786, investmentCr: 12000, jobs: 45071,
        sectors: 'Aerospace & defence, engineering, steel, food, pharma, drones', nearest: 'Kurnool airport 12 km; NH-40 4 km; Krishnapatnam Port 320 km',
        developer: 'AP Industrial Corridor Infrastructure Development Corporation (APICDC) + NICDIT',
        industries: ['Integrated food & beverage (Reliance)', 'Steel', 'APIs / pharma', 'Drone manufacturing (Drone City)', 'Aerospace & defence'],
        infrastructure: ['NICDC area 2,621 ac: industrial/logistics ~54%, green ~14%, roads ~11%; total declared node ~9,719 ac', 'Kurnool airport 12 km; NH-40 4 km; NH-44 28 km; Krishnapatnam Port 320 km', 'Power-surplus state; utilities planned via the EPC contract'],
        incentives: 'AP Industrial Policy 4.0 (up to 15% capital subsidy, 100% net SGST 5 yrs, power ₹1/unit, 100% stamp duty); Early-Bird 30–40% subsidy.',
        companies: [{ name: 'Reliance Consumer Products', sector: 'Integrated food & beverage', note: 'Approved; incentives sanctioned (~₹1,622 cr)' }, { name: 'Virupaksha Organics', sector: 'APIs / organic chemicals', note: 'Allotment approved (~₹1,225 cr)' }, { name: 'Jai Raj Ispat', sector: 'Steel', note: '413 ac allotted; EC for 400 ac' }, { name: 'aerpace Industries', sector: 'Drones / defence UAVs', note: 'MoU; foundation laid (300-acre Drone City)' }],
        summary: [
          'Orvakal is the only one of AP’s three NICDC nodes with a confirmed major anchor — Reliance Consumer Products committing ~₹1,622 cr in integrated food and beverage manufacturing.',
          'It is also building India’s first Drone City (300 acres) and an emerging pharma cluster around Guttapadu, with Virupaksha Organics adding ~₹1,225 cr.',
        ],
        sections: [
          { heading: 'Status & dependencies', body: [
            'The SPV is incorporated, environmental clearance secured and an EPC contractor appointed by February 2026, but trunk construction has not yet begun.',
            'The node leans heavily on a single large anchor; the state targets ~₹50,000 cr regionally to diversify, and Krishnapatnam Port is 320 km away.',
          ] },
        ],
        timeline: [
          { date: '2024', label: 'Cabinet approval; SPV incorporated' },
          { date: 'Dec 2025', label: 'Reliance investment approved' },
          { date: 'Feb 2026', label: 'EPC contractor appointed; EC secured' },
        ],
        sources: [
          { label: 'NICDC — Orvakal', url: 'https://nicdc.in/projects/12-new-projects/orvakal-andhra-pradesh' },
          { label: 'The Hindu — Orvakal node declaration', url: 'https://www.thehindu.com/news/national/andhra-pradesh/11-villages-in-orvakal-mandal-declared-as-industrial-node-in-hbic/article69307090.ece' },
        ],
      },
            {
        slug: 'kopparthy-hbic', name: 'Kopparthy (shared with VCIC)', state: 'Andhra Pradesh', stage: 'construction',
        statusLabel: 'Electronics node (shared with VCIC)', coords: [193, 419],
        areaAc: 2596, projectCostCr: 2137, investmentCr: 8860, jobs: 54500,
        sectors: 'Electronics / ESDM, renewables, auto components, textiles', nearest: 'Kadapa airport 11 km; NH-40 5 km; Krishnapatnam Port 200 km',
        developer: 'AP Industrial Corridors Infrastructure Development Corporation Ltd (APICDC), 50:50 GoAP : GoI; 2024',
        industries: ['Electronics Manufacturing Cluster (810 ac) + Electronic City (3,164 ac)', 'Engineering / rail components', 'Renewables', 'Drones (Drone City)'],
        infrastructure: ['NICDC area 2,596 ac: industrial 47%, greens/waterbody 26%, roads 13%, residential 5%', 'Kadapa airport 11 km; NH-40 5 km; Krishnapatnam Port 200 km; Kopparthy rail cargo terminal 9 km', '46 MLD industrial water under development; a power-equipment hub planned'],
        incentives: 'Kopparthy MIH package GO.Ms.No.87 (2020): 100% stamp duty, 100% net SGST 8 yrs, 20% investment subsidy, power ₹1/unit; early-bird land ~₹10 lakh/acre.',
        companies: [{ name: 'Pitti Rail & Engineering', sector: 'Engineering / rail components', note: '118 ac allotted (~₹401 cr)' }, { name: 'Shirdi Sai Electricals', sector: 'Transformers & wind masts', note: 'MoU, CII 2025 (~₹5,000 cr)' }, { name: 'Dixon / United Telelinks', sector: 'Electronics', note: 'Allotment recommended (EMC)' }],
        summary: [
          'Kopparthy is anchored by a dedicated 810-acre Electronic Manufacturing Cluster plus an adjacent 3,164-acre Electronic City, with Dixon and United Telelinks recommended as EMC anchors.',
          'This is the same physical Kopparthy node also listed under VCIC — it is cross-listed across both corridors in government documents.',
        ],
        sections: [
          { heading: 'Status & open questions', body: [
            'The SPV is incorporated, EC secured and an EPC appointed by February 2026, and the PM inaugurated the node in October 2025 — but trunk construction is yet to commence and no tenant is operational.',
            'The broader state Mega Industrial Hub spans ~6,740 acres against the NICDC 2,596-acre phase.',
          ] },
        ],
        timeline: [
          { date: 'Dec 2020', label: 'State Mega Industrial Hub declared' },
          { date: '2021', label: 'Pitti Rail allotted 118 ac' },
          { date: 'Oct 2025', label: 'PM inauguration' },
        ],
        sources: [
          { label: 'NICDC — Kopparthy', url: 'https://nicdc.in/projects/12-new-projects/kopparthy-andhra-pradesh' },
          { label: 'BusinessLine — Kopparthy node', url: 'https://www.thehindubusinessline.com/economy/ap-govt-to-develop-kopparthy-node-in-6740-acres-under-visakhapatnam-chennai-industrial-corridor/article70041642.ece' },
        ],
      },
    ],
    milestones: [
      { date: 'Aug 2024', label: 'CCEA approves HBIC + Orvakal' },
      { date: 'Sep 2025', label: 'Orvakal + Kopparthy master plans notified' },
      { date: '16 Oct 2025', label: 'PM foundation stones; EPC LoAs issued' },
    ],
    sources: [{ label: 'DPIIT status report (31 Oct 2025)', url: 'https://www.dpiit.gov.in/static/uploads/2025/11/34953d677cb89d642b15907555250523.pdf' }],
  },
  'bengaluru-mumbai': {
    slug: 'bengaluru-mumbai',
    intro: [
      'The Bengaluru–Mumbai Industrial Corridor (BMIC) runs ~1,000 km across Karnataka and Maharashtra along NH-48, with NICDC developing it alongside KIADB (Karnataka) and MIDC (Maharashtra). It has two priority nodes — Dharwad and Satara — of which Dharwad is the active one.',
    ],
    facts: [
      { k: 'Length', v: '~1,000 km along NH-48' },
      { k: 'States', v: 'Karnataka, Maharashtra' },
      { k: 'Developer', v: 'NICDC + KIADB (Dharwad) / MIDC (Satara)' },
      { k: 'Target', v: '~₹3 lakh cr investment; ~2.5 m jobs (corridor-wide)' },
      { k: 'Nodes', v: 'Dharwad (active), Satara (master-planning)' },
    ],
    nodes: [
            {
        slug: 'dharwad', name: 'Dharwad node', state: 'Karnataka', stage: 'planned',
        statusLabel: 'Master planning; MMLP tender invited', coords: [139, 406],
        sectors: 'Heavy engineering, auto, ancillaries, aerospace, defence', nearest: 'Hubballi airport 30 km; Dharwad railway station 25 km; Karwar/Goa ports ~170–180 km',
        developer: 'NICDIT + KIADB; SPV not yet formed (post-CCEA)',
        industries: ['Heavy engineering', 'Automobiles', 'Auto & engineering ancillaries', 'Aerospace', 'Defence'],
        infrastructure: ['~6,042 ac delineated; a 3-phase build (Phase 1 a multi-modal logistics park)', 'NH-48 & NH-67; Dharwad rail 25 km; Hubballi airport 30 km; Karwar port 170 km', 'Master-plan stage — utilities not yet specified'],
        incentives: 'Karnataka Industrial Policy 2025-30 (up to 20% capital subsidy or PLI, stamp-duty reimbursement, 5-year electricity-duty exemption).',
        summary: [
          'As of June 2026 the node has no CCEA approval and zero implementation funds — only ~₹4.2 cr of project-development funds spent on master planning.',
          'It lags peer nodes (Tumakuru received ₹608 cr equity), though a June 2026 multi-modal-logistics-park tender signals forward movement.',
        ],
        sections: [
          { heading: 'Status & tenants', body: [
            'No land allotments, MoUs or operational tenants at the node; it is in master planning.',
            'A real regional base exists nearby (Aequs ~₹3,540 cr, NIDAC ~₹600 cr) plus IIT/IIIT Dharwad, but these sit outside the confirmed BMIC boundary.',
          ] },
        ],
        timeline: [
          { date: 'Nov 2021', label: 'Consultant kick-off; master planning' },
          { date: 'Mar 2022', label: 'Perspective plan complete; CCEA approval pending' },
          { date: 'Jun 2026', label: 'Logistics-park tender invited' },
        ],
        sources: [
          { label: 'PIB — Dharwad node (PRID 1775265)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1775265' },
          { label: 'PIB — corridor status (PRID 1806625)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1806625' },
        ],
      },
            {
        slug: 'satara', name: 'Satara node', state: 'Maharashtra', stage: 'planned',
        statusLabel: 'Master planning; CCEA approval pending', coords: [124, 371],
        areaAc: 12355,
        sectors: 'General manufacturing (engineering, textiles, heavy fabrication)', nearest: 'JNPT Mumbai ~315 km road / 239 km rail; Dighi Port ~271 km; Pune 180 km',
        developer: 'Maharashtra Industrial Township Ltd (MITL; NICDIT + MIDC) — also manages AURIC',
        industries: ['Engineering', 'Textiles', 'Heavy fabrication', 'General manufacturing'],
        infrastructure: ['~12,355 ac (5,000 ha) delineated — the larger of the two Phase-1 BMIC nodes', 'NH-548C & NH-548E through the site; Mumbai ~350 km; Pune 180 km', 'Master-plan stage — utilities not yet specified'],
        incentives: 'Maharashtra investment-promotion scheme (2026): Satara in Zone 2 (1.25× returns via GST/SGST concessions + concessional land for ₹500 cr+).',
        summary: [
          'At ~12,355 acres Satara is the bigger of the two Phase-1 BMIC nodes, yet it has no CCEA approval and zero implementation funds as of June 2026.',
          'The perspective plan is complete, an RfP was issued (2021) and a consultant appointed for the detailed master plan.',
        ],
        sections: [
          { heading: 'Status & tenants', body: [
            'No node-level allotments, MoUs or tenants — the project is in master planning.',
            'The district has a genuine engineering/textile base (Cummins, Pidilite, an operational engineering SEZ), but these are existing MIDC estates, not confirmed inside the node.',
          ] },
        ],
        timeline: [
          { date: 'May 2021', label: 'NICDC RfP for the 5,000-ha master plan' },
          { date: 'Mar 2022', label: 'Perspective plan complete; CCEA pending' },
          { date: 'Jan 2026', label: 'Satara placed in Zone 2' },
        ],
        sources: [
          { label: 'NICDC — Satara RfP', url: 'https://www.nicdc.in/phocadownload/153tenfile_RfPforSataraNode.pdf' },
          { label: 'PIB — corridor status (PRID 1806625)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1806625' },
        ],
      },
    ],
    milestones: [{ date: '2021', label: 'BMIC nodes notified' }, { date: '2025', label: 'Dharwad MMLP tendering; Satara master-planning' }],
    sources: [{ label: 'NICDC — BMIC', url: 'https://nicdc.in/projects/national-industrial-corridor-development-programme/bengaluru-mumbai-industrial-corridor' }],
  },
  'cbic-kochi-extension': {
    slug: 'cbic-kochi-extension',
    intro: [
      'The CBIC extension to Kochi (via Coimbatore) carries the Chennai–Bengaluru corridor south into Tamil Nadu and Kerala, with NICDC and state SPVs (KICDC in Kerala, SIPCOT in Tamil Nadu). Its two priority nodes are Palakkad and Salem–Dharmapuri — and Palakkad is notably advanced: Kerala became the first state to finalise an EPC contract for core infrastructure under the national programme.',
    ],
    facts: [
      { k: 'States', v: 'Tamil Nadu, Kerala' },
      { k: 'Developer', v: 'NICDC + KICDC (Kerala) / SIPCOT (Tamil Nadu)' },
      { k: 'Nodes', v: 'Palakkad (EPC awarded), Salem–Dharmapuri (master-planning)' },
      { k: 'Milestone', v: 'Kerala first to finalise core-infra EPC under NICDP' },
    ],
    nodes: [
            {
        slug: 'palakkad', name: 'Palakkad node', state: 'Kerala', stage: 'construction',
        statusLabel: 'EPC tendering; pre-construction', coords: [162, 480],
        areaAc: 1710, projectCostCr: 3815, investmentCr: 38000, jobs: 98000,
        sectors: 'Pharma & medical devices, food, hi-tech, defence, electronics, textiles', nearest: 'NH-544 backbone; Coimbatore airport ~55 km; Kochi Port ~150 km; Palakkad Junction rail',
        developer: 'Kerala Industrial Corridor Development Corporation Ltd (KICDC), incorporated 21 Apr 2021 (50:50 NICDIT : State)',
        industries: ['Pharma & medical devices (420 ac)', 'Food processing (172 ac)', 'Hi-tech (55 ac)', 'Electronics', 'Textiles & rubber'],
        infrastructure: ['Land-use: pharma 420 ac (25%), food 172 ac (10%), hi-tech 55 ac (3%), utility 282 ac, green 100 ac', 'NH-544; Coimbatore airport 55 km; Kochi Port 150 km; two rail overbridges planned', '~1,240 ac (72%) acquired; 110 ac transferred to the SPV; rainwater harvesting + quarry source'],
        incentives: 'Land-for-equity model (state land valued ~₹1,790 cr as equity); single-window + a Special Industrial Township designation announced (notification pending).',
        summary: [
          'Kerala’s first NICDP node, CCEA-approved 28 Aug 2024 at ~₹3,815 cr, with both environmental clearances granted and a ~₹1,100 cr EPC tender floated in May 2025.',
          'Master plan, DPR and tender documents are complete; the first equity tranche (~₹104.5 cr) is released against 110 acres transferred.',
        ],
        sections: [
          { heading: 'Status & open questions', body: [
            'No anchor tenants yet; construction awaits the EPC award.',
            'The ₹38,000 cr / 98,000-job projections rest on comparable-node methodology, not committed investment.',
          ] },
        ],
        timeline: [
          { date: 'Oct 2020', label: 'SHA/SSA executed' },
          { date: 'Apr 2021', label: 'KICDC SPV incorporated' },
          { date: 'Aug 2024', label: 'CCEA approval (~₹3,815 cr)' },
          { date: 'May 2025', label: '~₹1,100 cr EPC tender floated' },
        ],
        sources: [
          { label: 'NICDC DMU Report (Jan 2025)', url: 'https://nicdc.in/images/documents/DMU_Report_Jan_2025.pdf' },
          { label: 'Construction World — Palakkad EPC tender', url: 'https://www.constructionworld.in/amp/urban-infrastructure/smart-cities-projects/kerala-floats-rs-11-bn-tender-for-palakkad-smart-city/73723' },
        ],
      },
            {
        slug: 'salem-dharmapuri', name: 'Salem–Dharmapuri node', state: 'Tamil Nadu', stage: 'construction',
        statusLabel: 'State-led SIPCOT EV estate (not a formal NICDP node)', coords: [184, 466],
        areaAc: 1725, jobs: 20000,
        sectors: 'Electric vehicles & components, EV batteries, metallurgy, EV spares', nearest: 'NH-44; Salem airport 53 km; Dharmapuri / Salem Junction rail',
        developer: 'SIPCOT (State Industries Promotion Corporation of Tamil Nadu); no NICDC SPV identified',
        industries: ['EV manufacturing', 'EV battery (anode/cathode/separator/electrolyte)', 'Metallurgy', 'EV spares'],
        infrastructure: ['~1,725-acre SIPCOT Dharmapuri estate; EC granted Nov 2024; Phase 1 200+ ac released', 'NH-44; Salem airport 53 km; no DFC link', 'Land-use ~27% metallurgy/battery; remainder EV battery/spares + general plots'],
        incentives: 'State SIPCOT estate incentives (no NICDP-node incentive framework recorded).',
        companies: [{ name: 'Ola Electric', sector: 'EV manufacturing', note: 'MoU signed; 500 ac allocated' }, { name: '200+ companies', sector: 'EV / battery / metallurgy', note: 'MoUs; land applications in progress (~20,000 aggregate jobs)' }],
        summary: [
          'There is no NICDC node page, SPV, master plan or CCEA approval for a “Salem–Dharmapuri node” — development is driven independently by SIPCOT and Tamil Nadu as an EV manufacturing hub.',
          'The ~1,725-acre SIPCOT Dharmapuri estate is the real on-the-ground activity, with EC granted November 2024.',
        ],
        sections: [
          { heading: 'Status & tenants', body: [
            'Phase 1 (200+ acres) is released and 200+ companies have signed MoUs, headlined by Ola Electric on 500 acres; road works are under way.',
            'Individual allottee names beyond Ola are undisclosed, and the 20,000+ jobs figure is an aggregate state projection.',
          ] },
        ],
        timeline: [
          { date: '2018', label: 'SIPCOT estate announced' },
          { date: 'Apr 2023', label: 'Ola Electric MoU (500 ac)' },
          { date: 'Nov 2024', label: 'Environmental clearance; DPR submitted' },
        ],
        sources: [
          { label: 'The Hindu — Ola MoU', url: 'https://www.thehindu.com/news/cities/Coimbatore/minister-lays-stone-for-scheme-works-in-dharmapuri/article66691971.ece' },
          { label: 'New Indian Express — SIPCOT estate', url: 'https://www.newindianexpress.com/states/tamil-nadu/2025/May/03/hasten-establishment-of-sipcot-estate-in-dharmapuri' },
        ],
      },
    ],
    milestones: [{ date: 'Aug 2024', label: 'Palakkad ~82% land acquired' }, { date: 'Sep 2025', label: 'Palakkad EPC awarded (first under NICDP)' }],
    sources: [{ label: 'NICDC — CBIC to Kochi (ECKC)', url: 'https://api.nicdc.in/upload/image/ExecutivesummaryreportECKC.pdf' }],
  },
  'delhi-nagpur': {
    slug: 'delhi-nagpur',
    intro: [
      'The Delhi–Nagpur Industrial Corridor (DNIC) is the newest and least-developed of the eleven — planned along NH-44 and the future North–South Dedicated Freight Corridor. As of mid-2025 it is at perspective-plan stage only: a consultant is preparing the plan, but no nodes are notified or approved.',
      'Two early land conversations exist — a proposed parcel at Wardha (Maharashtra, near MIDC Butibori) and discussions with the Bundelkhand Industrial Development Authority in UP — but neither is a confirmed node. Treat DNIC as a watch-list corridor, not yet investable.',
    ],
    facts: [
      { k: 'Alignment', v: 'NH-44 + future North–South DFC' },
      { k: 'Influence states', v: 'Delhi, UP, Rajasthan, MP, Maharashtra' },
      { k: 'Developer', v: 'NICDC (perspective-plan consultant appointed)' },
      { k: 'Status', v: 'Perspective-plan stage — no notified nodes' },
    ],
    nodes: [
            {
        slug: 'perspective-plan', name: 'Perspective-plan stage', state: 'Multiple', stage: 'planned',
        statusLabel: 'DNIC perspective-plan stage only',
        sectors: 'To be defined (manufacturing, agro-processing, export units)', nearest: 'North-South DFC alignment + the National Highways N-S corridor; inland, no port',
        developer: 'NICDC (consultant appointed for the perspective plan); no SPV formed',
        industries: ['To be identified via the perspective plan'],
        infrastructure: ['No nodes identified yet; a 20-year regional perspective plan is under preparation', 'North-South DFC + NH backbone across Delhi, UP, Rajasthan, MP and Maharashtra', 'Existing clusters to be assessed (Noida–Greater Noida, Bhiwadi–Neemrana, Gwalior, Nagpur region)'],
        incentives: 'Not applicable at this planning stage.',
        summary: [
          'DNIC is the 11th NICDP corridor, conceptualised along the North-South DFC through five states, and sits at the perspective-plan stage with a consultant appointed.',
          'No nodes are identified, no SPV exists and no land is acquired — the brief is feasibility, node identification and early-bird projects.',
        ],
        sections: [
          { heading: 'Open questions', body: [
            'Area, project cost, investment and employment are all unprojected; sectors and node locations await the perspective plan.',
            'Alignment finalisation and land-parcel identification were in progress via state-government discussions as of the latest reporting.',
          ] },
        ],
        timeline: [
          { date: 'Jul 2021', label: 'RfQ-cum-RfP for the perspective-plan consultant' },
          { date: 'Aug 2022', label: 'Consultant appointed; alignment discussions begin' },
          { date: 'Aug 2024', label: 'Confirmed as the 11th corridor in the National Infrastructure Pipeline' },
        ],
        sources: [
          { label: 'NICDC — DNIC RFP', url: 'https://www.nicdc.in/phocadownload/154tenfile_final-rfq-cum-rfp-dnic-nicdc-gem.pdf' },
          { label: 'PIB — corridor document (Aug 2024)', url: 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2024/aug/doc2024830383401.pdf' },
        ],
      },
    ],
    sources: [{ label: 'NICDC — DNIC', url: 'https://nicdc.in/projects/national-industrial-corridor-development-programme/delhi-nagpur-industrial-corridor-dnic' }],
  },
};

export const deepFor = (slug: string): CorridorDeep | undefined => corridorDeep[slug];
export const nodeBySlugs = (slug: string, node: string): DeepNode | undefined =>
  corridorDeep[slug]?.nodes.find((n) => n.slug === node);
export const allCorridorNodePairs = (): { corridor: string; node: string }[] =>
  Object.values(corridorDeep).flatMap((c) => c.nodes.map((n) => ({ corridor: c.slug, node: n.slug })));

// The NICDC "12 New Projects" — the 12 Integrated Manufacturing Clusters grouped under
// nicdc.in/projects/12-new-projects (CCEA approved 11 on 28 Aug 2024 for Rs 28,602 cr;
// NICDC files Hisar alongside them as the 12th). Each maps to the corridor it sits on.
export const NEW_IMCS: { node: string; corridor: string }[] = [
  { node: 'khurpia', corridor: 'amritsar-kolkata' },
  { node: 'rajpura-patiala', corridor: 'amritsar-kolkata' },
  { node: 'hisar', corridor: 'amritsar-kolkata' },
  { node: 'agra', corridor: 'amritsar-kolkata' },
  { node: 'prayagraj', corridor: 'amritsar-kolkata' },
  { node: 'gaya', corridor: 'amritsar-kolkata' },
  { node: 'dighi-port', corridor: 'delhi-mumbai' },
  { node: 'jodhpur-pali-marwar', corridor: 'delhi-mumbai' },
  { node: 'kopparthy', corridor: 'vizag-chennai' },
  { node: 'orvakal', corridor: 'hyderabad-bengaluru' },
  { node: 'zaheerabad', corridor: 'hyderabad-nagpur' },
  { node: 'palakkad', corridor: 'cbic-kochi-extension' },
];

export interface NewImc { node: DeepNode; corridor: string }
export const newImcNodes = (): NewImc[] =>
  NEW_IMCS
    .map((x) => ({ node: nodeBySlugs(x.corridor, x.node), corridor: x.corridor }))
    .filter((x): x is NewImc => Boolean(x.node));
