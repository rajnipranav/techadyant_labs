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
        statusLabel: 'EPC awarded for trunk infrastructure; no tenants yet', coords: [159, 174],
        areaAc: 1099, projectCostCr: 1367, investmentCr: 7500, jobs: 64204,
        sectors: 'ESDM, food & beverages, textiles & apparel, rubber & plastic, fabricated metal, chemicals, machinery & equipment',
        nearest: 'New Rajpura EDFC station ~12 km; NH-44 ~10 km; Chandigarh airport ~45 km; ICD Ludhiana ~65 km',
        developer: 'NICDC Punjab Industrial Corridor Development Corporation Limited (NICDC–Punjab JV; SPV incorporated 30 December 2022)',
        epc: 'EPC contractor appointed for internal trunk infrastructure works (January 2026); contractor name not disclosed',
        companies: [
          { name: 'No allotted tenants', sector: '—', commitment: 'Pre-allotment stage — zero named companies, allottees or signed MoUs verified at the IMC as of June 2026; tenant announcements follow trunk-infrastructure completion [V]' },
          { name: 'JSW Steel', sector: 'Adjacent legacy base — Mandi Gobindgarh steel cluster', commitment: 'Established firm in the Mandi Gobindgarh “Loha Mandi” ~25% of India’s secondary steel market; not an IMC allottee [V1]' },
          { name: 'Madhav Alloys / Modern Steel / Belco Special Steel', sector: 'Adjacent legacy base — steel alloys & rolling', commitment: 'Operational Mandi Gobindgarh cluster firms; potential feeder base, not IMC allottees [V1]' },
          { name: 'SC Tool Corp. / Mohindra Tools', sector: 'Adjacent legacy base — Patiala cutting-tools hub', commitment: 'Established precision cutting-tool makers in the Patiala engineering cluster; not IMC allottees [V1]' },
        ],
        industries: ['ESDM (electronics)', 'Food & beverages', 'Textiles & apparel', 'Fabricated metal products', 'Machinery & equipment', 'Rubber & plastic', 'Chemicals'],
        infrastructure: [
          '1,099 acres (state-confirmed 1,098 ac) — land-use 661 ac industrial (60%), 168 ac green/waterbody (15%), 153 ac transportation (14%), the balance services, residential, institutional and commercial.',
          'Strong DFC connectivity: 12 km to the New Rajpura EDFC station and Rajpura Junction, 11 km to Kauli station, 25 km to Sirhind Junction EDFC — among the best EDFC-linked AKIC nodes.',
          'Road via NH-44 (10 km), NH-7 (7.5 km) and SH-8 (11 km); Chandigarh airport 45 km; Kandla port ~1,290 km; ICDs at Ludhiana 65–89 km.',
          'Sits between the Mandi Gobindgarh steel cluster (500+ units, ~₹2,300 cr, ~10,000 jobs) and the Ludhiana–Patiala engineering and cutting-tools belt — a ready feeder ecosystem.',
        ],
        incentives: 'No node-specific framework published; standard Punjab industrial-policy incentives apply (Invest Punjab framework, reported up to a 125% investment subsidy). Specific power tariff and water terms for the IMC not found in sources.',
        summary: [
          'Rajpura–Patiala is one of the more advanced AKIC nodes: the SPV was incorporated on 30 December 2022, environmental clearance has been obtained, equity has been released and — as of the February 2026 PIB status report — it is among the nine of twelve NICDP greenfield cities where an EPC contractor has been appointed for internal trunk-infrastructure works.',
          'It is a 1,099-acre, ₹1,367 cr build projected to draw ₹7,500 cr of investment and 64,204 jobs, with the highest investment-to-area ratio of the early AKIC nodes. Its defining advantage is logistics: at just 12 km from the New Rajpura EDFC station it has the tightest freight-corridor linkage of any node in the corridor.',
          'No anchor tenants, allottees or MoUs have been verified for the IMC itself — consistent with its stage, since allotment follows trunk infrastructure. What it does have is a deep adjacent base: the Mandi Gobindgarh secondary-steel cluster and the Ludhiana–Patiala engineering and cutting-tools hubs sit on its doorstep as a natural feeder ecosystem.',
        ],
        sections: [
          { heading: 'Where the project stands', body: [
            'Per the February 2026 PIB review, Rajpura–Patiala has cleared the early gates: SPV formed (30 December 2022), equity released, Programme Manager for New Cities onboarded, environmental clearance obtained, and an EPC contractor appointed for internal trunk works (LoA awarded January 2026). The foundation stone had not been laid as of February 2026 — true of all twelve NICDP cities at that point.',
            'The original 2020 cabinet approval cited ~1,000 acres on panchayat land; the current scope is 1,099 acres (state-confirmed 1,098). Investment-potential figures vary between the NICDC ₹7,500 cr headline and an Indian Express report of ₹6,400 cr.',
          ] },
          { heading: 'The feeder ecosystem', body: [
            'The node is positioned to draw on three established clusters. Mandi Gobindgarh, in adjacent Fatehgarh Sahib district, is the “Loha Mandi” — 500+ steel units, 48 induction furnaces, ~₹2,300 cr invested and roughly a quarter of India’s secondary-steel market, with JSW Steel, Madhav Alloys, Modern Steel and Belco Special Steel present. The Ludhiana belt adds auto parts, bicycles, hosiery and light engineering; Patiala adds a major cutting-tools hub (SC Tool Corp., Mohindra Tools) supplying Mahindra, Honda, Hero, Maruti and others, with exports to the US and Europe.',
            'These firms are not IMC allottees, but they define the realistic best-fit sectors: fabricated metal and machinery, auto components, food processing and ESDM.',
          ] },
          { heading: 'Risks & open questions', body: [
            'The central open question is demand: zero anchor tenants have been announced, so off-take risk is unresolved until allotment begins. Water availability (Punjab faces groundwater depletion) and external power works requiring state coordination are noted but unquantified in sources. A separate PSIEC focal-point allotment scandal in the region named officials, not companies, and does not touch the IMC.',
          ] },
        ],
        timeline: [
          { date: 'Jul 2020', label: 'Cabinet approval of the industrial park on panchayat land (~1,000 ac)' },
          { date: 'Jan 2022', label: 'ToR granted by SEIAA, Punjab (6 January)' },
          { date: 'Dec 2022', label: 'SPV — NICDC Punjab Industrial Corridor Development Corp — incorporated (30 December)' },
          { date: 'Jan 2026', label: 'EPC contract awarded for internal trunk infrastructure' },
          { date: 'Feb 2026', label: 'PIB: EC obtained, equity released, EPC appointed; foundation stone not yet laid' },
        ],
        sources: [
          { label: 'NICDC — IMC Rajpura–Patiala', url: 'https://nicdc.in/projects/12-new-projects/imc-rajpura-patiala-punjab' },
          { label: 'PIB — Work advances on 12 new greenfield industrial cities', url: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2227592' },
          { label: 'NICDC — DMU Report May 2024', url: 'https://nicdc.in/images/documents/DMU_Report_May_2024.pdf' },
          { label: 'Indian Express — Rajpura set to boom with IMC', url: 'https://indianexpress.com/article/cities/chandigarh/punjabs-rajpura-all-set-to-boom-with-integrated-manufacturing-cluster-9539169/' },
          { label: 'NICDC — AKIC Executive Summary Report', url: 'https://www.nicdc.in/images/documents/AKIC_Executive_Summary_Report..pdf' },
        ],
      },
      {
        slug: 'hisar', name: 'Hisar IMC', state: 'Haryana', stage: 'approved',
        statusLabel: 'SPV formed; aviation-hub IMC in master planning', coords: [149, 191],
        areaAc: 2988, projectCostCr: 4680, investmentCr: 32417, jobs: 125000,
        sectors: 'Aerospace & defence (MRO), engineering & fabrication, food processing, readymade garments',
        nearest: 'Maharaja Agrasen International Airport (adjacent); Hisar Junction ~4.3 km; New Rewari EDFC ~156 km; Delhi airport ~180 km',
        developer: 'NICDC Haryana Integrated Manufacturing Cluster Hisar Project Limited (NICDC–Haryana via HADC; SPV incorporated 25 September 2025; SSA/SHA 20 August 2025)',
        companies: [
          { name: 'No allotted tenants', sector: '—', commitment: 'Pre-allotment — zero private allottees or MoUs verified; project in master planning, EPC tender not yet floated as of June 2026 [V]' },
          { name: 'US Trade and Development Agency (USTDA)', sector: 'Aviation-hub technical assistance (government-to-government)', commitment: '~₹10.53 cr grant — MoU with HADC signed 10 December 2024 to attract investors and package projects; not a private land allotment [V]' },
          { name: 'Jindal Stainless / O.P. Jindal Group', sector: 'Adjacent legacy base — stainless & carbon steel', commitment: 'Among India’s largest stainless-steel makers, founded the Hisar industrial base; feeder for the engineering & fabrication sector, not an IMC allottee [V1]' },
        ],
        industries: ['Aerospace & defence MRO', 'Aircraft component manufacturing', 'Air-cargo logistics & warehousing', 'Engineering & fabrication (steel-based)', 'Food processing (agri-exports)', 'Readymade garments'],
        infrastructure: [
          '2,988 acres — the largest AKIC node by area (the master-plan land-use table covers ~1,605 developed acres: 980 ac industrial & logistics at 61%, 243 ac green/waterbody, 231 ac roads & utilities; the balance is reserved for aviation-hub integration and buffer).',
          'Explicitly an Integrated Aviation Hub: adjacent to the new Maharaja Agrasen International Airport, with a proposed in-IMC freight station, MRO facilities and ICAO-aligned carbon-neutral design.',
          'Located between the Eastern and Western DFCs (New Ambala EDFC ~208 km, New Rewari EDFC ~156 km) with proposed feeder rail; Hisar Junction 4.3 km; Delhi 180 km; Kandla port ~1,055 km.',
          'Draws on the Hisar steel and stainless-steel cluster (Jindal Stainless, O.P. Jindal Group) and a regional cotton-textile and garments base.',
        ],
        incentives: 'No node-specific framework; standard Haryana industrial-policy incentives apply, with targeted schemes for textiles, EV manufacturing, ESDM and defence & aerospace (15% offset mandate, ₹25,000 cr investment target). The PADMA MSME scheme (up to ₹2 cr/unit, 75% SGST refund for 7 years, 100% electricity-duty exemption for 12 years) indicates the available regime. Specific IMC power tariff not found.',
        summary: [
          'Hisar is the largest AKIC node by area (2,988 acres) and carries the corridor’s biggest headline numbers — ₹4,680 cr development cost, ₹32,417 cr investment potential and 1,25,000 jobs — but it is also a late starter. The State Support and Shareholder Agreements were signed only on 20 August 2025 and the SPV, NICDC Haryana Integrated Manufacturing Cluster Hisar Project Limited, was incorporated on 25 September 2025.',
          'Its distinguishing feature is the aviation thesis: the IMC is conceived as an Integrated Aviation Hub wrapped around the new Maharaja Agrasen International Airport, with planned MRO, an in-IMC freight station and aerospace & defence as the lead focus sector — a higher-value, more capital-intensive mix than the other nodes.',
          'As of June 2026 the project remains in master planning with the EPC tender not yet floated, and the only signed agreement of any kind is a government-to-government technical-assistance MoU with the US Trade and Development Agency. No private allottees exist. The Jindal steel cluster and a regional textile base sit nearby as feeders.',
        ],
        sections: [
          { heading: 'The aviation-hub thesis', body: [
            'Hisar is unusual among AKIC nodes in being organised around an airport. The RFP describes the IMC as part of an Integrated Aviation Hub that must synergise with the large international airport at Hisar, with an MRO and aero-logistics focus, a proposed in-IMC freight terminal connecting to the EDFC, and carbon-neutral design to ICAO guidelines. This explains the aerospace & defence and engineering lead sectors and the high investment-per-acre projection.',
            'In December 2024 the Haryana Airport Development Corporation signed an MoU with the US Trade and Development Agency for technical assistance — a ~₹10.53 cr grant to help package projects and attract financiers. This is a facilitation agreement, not a land allotment; no private investor has been named.',
          ] },
          { heading: 'Status and the late start', body: [
            'The project was listed in August 2021 with development activities “not initiated”. It moved only in 2025: SSA and SHA signed on 20 August, SPV incorporated 25 September (authorised and paid-up capital ₹5 cr each), with a board chaired by NICDC and Haryana civil-aviation nominees. A consultant is appointed and the detailed master plan and design report are in progress; environmental clearance, EPC and land transfer to the SPV are not yet confirmed in sources. The June 2026 Tribune report explicitly notes the EPC tender — the start of physical work — had not been floated.',
          ] },
          { heading: 'Risks & open questions', body: [
            'Hisar trails Rajpura–Patiala by roughly three years and depends on a parallel airport build that is still “under development”. The land-use table accounts for only ~54% of the 2,988 acres, with the remainder unexplained. EDFC stations are 156–208 km away (an in-IMC freight station is targeted only by ~2032). Water (semi-arid region) and power terms are unquantified, and no anchor tenants exist. Historic interest — 2017 airport EOIs (GMR, GVK, L&T and others) and a 2018 SpiceJet MRO MoU — is dated and not current pipeline.',
          ] },
        ],
        timeline: [
          { date: 'Aug 2021', label: 'Listed in PIB with development activities not yet initiated' },
          { date: 'Feb 2024', label: 'ToR granted (5 February)' },
          { date: 'Dec 2024', label: 'HADC–USTDA aviation-hub technical-assistance MoU (~₹10.53 cr)' },
          { date: 'Aug 2025', label: 'SSA & SHA signed (20 August)' },
          { date: 'Sep 2025', label: 'SPV incorporated (25 September)' },
          { date: 'Jun 2026', label: 'In master planning; EPC tender not yet floated' },
        ],
        sources: [
          { label: 'NICDC — IMC Hisar, Haryana', url: 'https://nicdc.in/projects/12-new-projects/imc-hisar-haryana' },
          { label: 'PIB — NICDC supports Haryana for IMC Hisar', url: 'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2158558&reg=3&lang=2' },
          { label: 'The Company Check — Hisar IMC SPV (MCA)', url: 'https://www.thecompanycheck.com/company/nicdc-haryana-integrated-manufacturing-cluster-hisar-project-limited/U43290HR2025SGC136867' },
          { label: 'NICDC — RFP for master plan', url: 'https://www.nicdc.in/phocadownload/142tenfile_FinalRFP.pdf' },
          { label: 'The Tribune — USTDA–HADC pact for Hisar aviation hub', url: 'https://www.tribuneindia.com/news/haryana/haryana-airport-corporation-signs-pact-with-us-trade-agency/amp/' },
        ],
      },
      {
        slug: 'khurpia', name: 'Khurpia IMC (Prag-Khurpia)', state: 'Uttarakhand', stage: 'construction',
        statusLabel: 'EPC appointed; auto-cluster IMC in the Pantnagar belt', coords: [196, 191],
        areaAc: 1002, projectCostCr: 1265, investmentCr: 6180, jobs: 75057,
        sectors: 'Automobiles & auto components, light engineering & ancillaries (food processing & electronics potential)',
        nearest: 'Kichha station ~3 km; Pantnagar airport ~15 km; New Khurja EDFC ~216 km; Delhi ~270 km',
        developer: 'NICDC Uttarakhand Industrial Township Limited (NUITL) — NICDC–SIIDCUL JV; SPV incorporated 21 October 2022; SSA/SHA 30 April 2022',
        epc: 'EPC contractor appointed (by February 2026); tender issued July 2025 — roads, wet utilities, CETP/STP and three 33 kV plus one 11 kV substations',
        companies: [
          { name: 'No allotted tenants', sector: '—', commitment: 'Pre-allotment — zero IMC allottees or MoUs verified; project in the trunk-infrastructure phase as of June 2026 [V]' },
          { name: 'Tata Motors', sector: 'Adjacent legacy base — automobile manufacturing (IIE Pantnagar)', commitment: '~4.04 million sq m at IIE Pantnagar (allotted 2006); anchor of the adjacent auto hub, not a Khurpia allottee [V]' },
          { name: 'Ashok Leyland', sector: 'Adjacent legacy base — automobile manufacturing (IIE Pantnagar)', commitment: '~7.68 lakh sq m at IIE Pantnagar (2006); feeder anchor, not a Khurpia allottee [V]' },
          { name: 'Bajaj Auto', sector: 'Adjacent legacy base — automobile manufacturing (IIE Pantnagar)', commitment: '~2.51 lakh sq m at IIE Pantnagar (2006); feeder anchor, not a Khurpia allottee [V]' },
          { name: 'Nestlé India / Britannia / Parle / Dabur / Haldiram', sector: 'Adjacent legacy base — food processing & FMCG (IIE Pantnagar)', commitment: 'Established IIE Pantnagar units; indicate latent food-processing demand near the node, not Khurpia allottees [V]' },
        ],
        industries: ['Auto components manufacturing', 'EV components', 'Light engineering & fabrication ancillaries', 'Food processing (potential)', 'Electronics manufacturing (potential)'],
        infrastructure: [
          '1,002 acres at Khurpia Farm, Kichha tehsil — land-use 618 ac industrial/anchor/ancillary (62%), 153 ac green (15%), 140 ac transportation (14%), the balance utilities, residential and commercial.',
          'EPC scope (July 2025 tender): roads, civil and wet utilities, CETP and STP, plus power infrastructure of three 33 kV substations and one 11 kV substation — a dedicated power substation is in the common-infrastructure plan.',
          'Critical logistics constraint: ~216 km to the nearest EDFC station (New Khurja) — far weaker DFC linkage than Rajpura–Patiala (12 km) or Prayagraj (7 km). Kichha station 3 km; Pantnagar airport 15 km; Mundra port ~1,350 km.',
          'Embedded in the established Pantnagar SIIDCUL automobile belt (Tata Motors, Ashok Leyland, Bajaj Auto, Mahindra plus a deep auto-components and FMCG base) — the strongest ready ecosystem of any AKIC node.',
        ],
        incentives: 'No node-specific framework; standard Uttarakhand MSME Policy 2023 incentives apply (Udham Singh Nagar is a C-category plain district — 30% capital subsidy up to ₹1 cr, with stamp-duty, interest and electricity-duty reimbursements). Specific IMC power tariff not found; internal substations are within the EPC scope.',
        summary: [
          'Khurpia — also called Prag-Khurpia or IMC Khurpia Farm — is one of the earliest-cleared AKIC nodes: SSA/SHA executed 30 April 2022, SPV (NICDC Uttarakhand Industrial Township Limited) incorporated 21 October 2022, environmental clearance granted 9 March 2023, CCEA approval 28 August 2024, and an EPC contractor appointed by February 2026 with the tender issued in July 2025.',
          'It is a focused 1,002-acre, ₹1,265 cr auto-and-auto-components cluster designed as an extension of the Pantnagar industrial ecosystem — one of India’s major automobile hubs. Projected investment is ₹6,180 cr and 75,057 jobs, giving it the highest jobs-per-acre ratio among the early nodes.',
          'Its defining weakness is logistics: at ~216 km from the nearest EDFC station, it lacks the freight-corridor proximity that defines the AKIC thesis. Its defining strength is the ready ecosystem next door — Tata Motors, Ashok Leyland, Bajaj Auto and a deep components and FMCG base at IIE Pantnagar — though none are IMC allottees.',
        ],
        sections: [
          { heading: 'An extension of the Pantnagar auto hub', body: [
            'Khurpia’s single declared focus sector is automobiles & auto components, and it is explicitly positioned as an extension of the adjacent SIIDCUL Integrated Industrial Estate at Pantnagar. That estate already hosts Tata Motors (~4.04 million sq m, 2006), Ashok Leyland, Bajaj Auto and Mahindra, plus a deep components tier (Endurance, Minda, Varroc, Spicer, Yazaki, Lucas TVS) and major food and FMCG units (Nestlé, Britannia, Parle, Dabur, Haldiram).',
            'The plan reserves ~60% of the manufacturing zone for anchor units and ~40% for ancillaries — a structure built to capture the supplier overflow of the existing cluster. Realistic best-fit sectors extend into EV components, light engineering and, potentially, food processing and electronics, even though only auto is listed officially.',
          ] },
          { heading: 'The EDFC distance problem', body: [
            'Unlike the corridor’s logistics-led nodes, Khurpia sits ~216 km from the New Khurja EDFC station. This materially weakens the freight-corridor rationale and is the likely reason its investment potential (₹6,180 cr) is well below similarly sized nodes. The advantage that offsets it is the lowest project cost among the major AKIC nodes (₹1,265 cr), reflecting existing SIIDCUL infrastructure and lower trunk-works requirements.',
          ] },
          { heading: 'Risks & open questions', body: [
            'No anchor tenants are announced; land handover to the EPC contractor and the foundation-stone date are unconfirmed. A narrow single-sector focus and direct competition from vacant developed plots at IIE Pantnagar (which can court the same investors) are real market risks. Water is generally adequate in the region; specific IMC power and water allocations are not in sources.',
          ] },
        ],
        timeline: [
          { date: '2016', label: 'Node identified under AKIC (as Prag-Khurpia)' },
          { date: 'Apr 2022', label: 'SSA/SHA executed (30 April)' },
          { date: 'Oct 2022', label: 'SPV — NUITL — incorporated (21 October)' },
          { date: 'Mar 2023', label: 'Environmental clearance granted (9 March)' },
          { date: 'Aug 2024', label: 'CCEA approval (28 August)' },
          { date: 'Jul 2025', label: 'EPC tender issued for trunk infrastructure' },
          { date: 'Feb 2026', label: 'EPC contractor appointed; foundation stone not yet laid' },
        ],
        sources: [
          { label: 'NICDC — IMC Khurpia, Uttarakhand', url: 'https://nicdc.in/projects/12-new-projects/imc-khurpia-uttarakhand' },
          { label: 'NICDC — DMU Report October 2024', url: 'https://nicdc.in/images/documents/DMU_Report_Oct_2024.pdf' },
          { label: 'PIB — Work advances on 12 new greenfield industrial cities', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2227592&reg=3&lang=2' },
          { label: 'SIIDCUL — IIE Pantnagar 2023 allottee list', url: 'https://siidcul.com/UserFiles/files/IIE_Pantnagar_2023.pdf' },
          { label: 'SIIDCUL — Success Projects', url: 'https://siidcul.com/uploads/images/news/news_2244254_Success%20Projects.pdf' },
        ],
      },
      {
        slug: 'agra', name: 'Agra IMC', state: 'Uttar Pradesh', stage: 'approved',
        statusLabel: 'SSA/SHA signed; non-polluting IMC under the Taj Trapezium constraint', coords: [178, 214],
        areaAc: 1058, projectCostCr: 1812, investmentCr: 3447, jobs: 69516,
        sectors: 'Leather articles & apparel, food processing & beverage, engineering & fabrication, medical consumables, ESDM',
        nearest: 'New Tundla EDFC ~25 km; Yamuna Expressway ~2 km; NH-19 ~2 km; Agra airport ~25 km; Jewar/Noida airport ~140 km',
        developer: 'Integrated Manufacturing Cluster Agra Prayagraj Limited (NICDC–UPSIDA JV — a single SPV shared with Prayagraj; incorporated 30 January 2025; SSA/SHA 8 November 2024)',
        companies: [
          { name: 'No allotted tenants', sector: '—', commitment: 'Pre-allotment — zero named private allottees or MoUs verified at the IMC as of June 2026 [V]' },
          { name: 'Agra footwear & leather cluster (AFMEC/ASMA)', sector: 'Adjacent legacy base — leather & footwear', commitment: '~200 mechanised units plus 500 domestic-brand makers, ~5 lakh pairs/day, ~₹3,000 cr annual exports; the workforce pool for the leather focus sector, not IMC allottees [V1]' },
          { name: 'Foundry Nagar engineering units', sector: 'Adjacent legacy base — casting & engineering', commitment: 'Legacy iron/brass foundries (TTZ-constrained); a skilled engineering workforce for non-polluting fabrication, not IMC allottees [V1]' },
        ],
        industries: ['Leather & footwear (non-tanning, finishing & assembly)', 'EDFC-linked logistics & warehousing', 'ESDM & medical devices (light, non-polluting)', 'Food processing', 'Engineering & fabrication (non-polluting)'],
        infrastructure: [
          '1,058 acres — land-use 443.83 ac industrial (41.94%) and a notably high 362.05 ac green/parks (34.22%), a Taj Trapezium Zone compliance feature; the balance roads, utilities, amenities, commercial and residential.',
          'EDFC at 25 km (New Tundla station); adjacent to the Yamuna Expressway (2 km) and the Agra–Lucknow Expressway; NH-19 at 2 km; a proposed NW-110 (Yamuna) waterway terminal ~1 km.',
          'Agra airport 25 km; Jewar/Noida International Airport ~140 km (under construction).',
          'Sits on Agra’s legacy footwear/leather and (TTZ-constrained) foundry base — a skilled labour pool the IMC is designed to redeploy into non-polluting manufacturing.',
        ],
        incentives: 'No node-specific framework; units qualify under the UP Industrial Investment and Employment Promotion Policy 2022 (capital subsidy, SGST reimbursement, stamp-duty exemption), conditional on meeting non-polluting (Green-category) criteria for TTZ compliance. Specific IMC power and water terms not found; the node will rely heavily on treated water given Agra’s scarcity.',
        summary: [
          'Agra IMC is a 1,058-acre node whose entire design is shaped by the Taj Trapezium Zone: only non-polluting (Green-category) industries are permitted, which is why its focus sectors are leather articles, food processing, light engineering, medical consumables and ESDM, and why a third of the master plan is green cover. The State Support and Shareholder Agreements were signed on 8 November 2024, and it shares a single SPV — Integrated Manufacturing Cluster Agra Prayagraj Limited — with the Prayagraj node, incorporated 30 January 2025.',
          'Headline metrics are ₹1,812 cr development cost, ₹3,447 cr investment potential and 69,516 jobs (a high jobs-per-acre but the lowest investment-per-acre among AKIC nodes, reflecting the labour-intensive, lower-capital mix the TTZ permits). EDFC access is moderate at 25 km, but expressway and proposed-waterway links are strong.',
          'No private allottees have been announced for the IMC, and the parallel UP Defence Industrial Corridor Agra node — a separate programme — was still pre-allotment in 2025 with ~₹407 cr of proposals and no operational units (those sit in Kanpur, Jhansi and Lucknow). Agra’s real asset is its footwear/leather and foundry labour base, which the non-polluting IMC is meant to redeploy.',
        ],
        sections: [
          { heading: 'The Taj Trapezium constraint', body: [
            'Agra falls inside the ~40 km Taj Trapezium Zone, where polluting industry is strictly regulated. The IMC was approved on the basis that its focus sectors are non-polluting, and its 34% green cover is effectively a compliance feature. This is the defining fact of the node: it can host leather finishing and assembly (but not wet-blue tanning), light ESDM, medical devices, food processing and EDFC-linked logistics — not heavy or emitting processes.',
            'The legal backdrop shifted in March 2026, when the Supreme Court disposed of the original 1984 M.C. Mehta TTZ petition and registered four new suo-motu petitions, including one on “regulation of industries” — leaving some residual uncertainty over how light engineering is classified inside the zone.',
          ] },
          { heading: 'Two corridors, one city', body: [
            'Agra is simultaneously an AKIC node (this IMC) and a node of the UP Defence Industrial Corridor. The two should not be conflated: as of September 2025 the UPDIC Agra node had ~₹407 cr of proposals with land allotment “about to start” and no operational units, while the corridor’s named, operational defence firms — PTC Industries, L&T Defence, MKU, Bharat Dynamics, BrahMos, Tata Advanced Systems, Adani Defence — are at the Kanpur, Jhansi and Lucknow nodes, not Agra.',
          ] },
          { heading: 'Risks & open questions', body: [
            'There are no anchor tenants, and the share of the 1,058 acres physically acquired by UPSIDA is unconfirmed in sources. Water scarcity is acute in Agra, so the IMC will depend on treated/recycled supply. A mild project-cost conflict exists (₹1,812 cr NICDC versus a ₹1,046 cr figure that appears to cover the combined Agra+Prayagraj trunk works). And TTZ litigation remains a structural risk to the permitted-industry mix.',
          ] },
        ],
        timeline: [
          { date: 'May 2022', label: 'ToR granted (11 May)' },
          { date: 'Nov 2024', label: 'SSA & SHA signed with UPSIDA (8 November)' },
          { date: 'Jan 2025', label: 'Shared SPV — IMC Agra Prayagraj Ltd — incorporated (30 January)' },
          { date: 'Mar 2026', label: 'Supreme Court disposes the original TTZ petition; new suo-motu cases registered' },
        ],
        sources: [
          { label: 'NICDC — IMC Agra, Uttar Pradesh', url: 'https://nicdc.in/projects/12-new-projects/imc-agra-uttar-pradesh' },
          { label: 'PIB — NICDC & UPSIDA partner for Agra and Prayagraj clusters', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2071860' },
          { label: 'The Statesman — UP IMCs in Agra and Prayagraj', url: 'https://www.thestatesman.com/india/up-to-set-up-integrated-manufacturing-clusters-in-agra-prayagraj-to-boost-industrial-growth-1503449558.html' },
          { label: 'Supreme Court Observer — Taj Trapezium PIL reorganised', url: 'https://www.scobserver.in/supreme-court-observer-law-reports-scolr/taj-trapezium-pil-reorganised/' },
          { label: 'Invest UP / UPEIDA — UP Defence Corridor press release (Sep 2025)', url: 'https://invest.up.gov.in/wp-content/uploads/2025/10/3-Eng-PressRelease_UPDIC_23Sep_2025_041025.pdf' },
        ],
      },
      {
        slug: 'prayagraj', name: 'Prayagraj IMC', state: 'Uttar Pradesh', stage: 'construction',
        statusLabel: 'EPC LoA issued — among the most advanced AKIC nodes', coords: [228, 238],
        areaAc: 352, projectCostCr: 1046, investmentCr: 1600, jobs: 17700,
        sectors: 'E-mobility, food processing, leather articles & apparel, readymade garments, cycle manufacturing, packaging',
        nearest: 'New Karchana EDFC ~7 km (best in the corridor); Naini ICD ~5 km; Prayagraj airport ~24 km; NH-30/NH-35',
        developer: 'Integrated Manufacturing Cluster Agra Prayagraj Limited (NICDC–UPSIDA JV — single SPV shared with Agra; incorporated 30 January 2025; SSA/SHA 7–8 November 2024)',
        epc: 'EPC Letter of Award issued 27 October 2025 for internal trunk-infrastructure works; contractor name not disclosed',
        companies: [
          { name: 'No allotted tenants', sector: '—', commitment: 'Pre-allotment — zero named IMC allottees or MoUs verified; node in the trunk-infrastructure phase post-LoA as of June 2026 [V]' },
          { name: 'Saraswati Hi-Tech City allottees (15 units)', sector: 'Adjacent legacy base — mixed industrial (Naini)', commitment: 'The IMC is carved within the ~1,140-acre Saraswati Hi-Tech City, which has ~15 industrial allottees (names not disclosed) and 52 vacant plots — legacy, not IMC allottees [V1]' },
        ],
        industries: ['E-mobility (EV assembly & components)', 'Cycle manufacturing', 'Food processing', 'Leather & garments', 'Packaging'],
        infrastructure: [
          '352 acres — the smallest AKIC node — land-use 286.23 ac industrial (81.45%), the rest roads & truck parking, utilities, green, waterbody and PSP. Land assembled from 238 ac acquired from Bharat Pumps & Compressors Ltd plus 114 ac from Saraswati Hi-Tech City.',
          'Best freight-corridor connectivity of any AKIC node: 7 km to the New Karchana EDFC station and 5 km to the Naini ICD (dry port), with waterway connectivity nearby.',
          'Sits inside the developed Saraswati Hi-Tech City (24×7 power with dedicated substation, water supply, single-window allotment); Prayagraj airport 24 km; NH-30 and NH-35.',
          'Existing Saraswati Hi-Tech City infrastructure shortens the trunk build; legacy regional strengths in cycle manufacturing, food processing and garments.',
        ],
        incentives: 'No node-specific framework; UP Industrial Investment and Employment Promotion Policy 2022 incentives apply (capital subsidy, SGST reimbursement up to ~100% for mega projects, 100% stamp-duty exemption). Power is a relative strength — 24×7 supply with a dedicated substation already in Saraswati Hi-Tech City. Specific IMC power tariff not found.',
        summary: [
          'Prayagraj is the smallest AKIC node by area (352 acres) but one of the most advanced: an EPC Letter of Award was issued on 27 October 2025 for internal trunk infrastructure, putting it ahead of Hisar (still master planning) and roughly level with the other EPC-stage nodes. It shares the single Integrated Manufacturing Cluster Agra Prayagraj Limited SPV with Agra (incorporated 30 January 2025; SSA/SHA 7–8 November 2024).',
          'Its defining advantage is logistics: at 7 km from the New Karchana EDFC station and 5 km from the Naini ICD, it has the tightest freight linkage in the entire corridor — squarely on the AKIC thesis. The node is carved out of the existing ~1,140-acre Saraswati Hi-Tech City (238 acres from a former Bharat Pumps & Compressors site plus 114 acres from the park), so ready infrastructure shortens the build.',
          'Headline figures are modest in absolute terms — ₹1,600 cr investment potential and 17,700 jobs — across focus sectors of e-mobility, cycle manufacturing, food processing, leather, garments and packaging. No anchor tenants have been announced; the 15 industrial allottees inside Saraswati Hi-Tech City are legacy occupants, not IMC allottees.',
        ],
        sections: [
          { heading: 'A small node with the best connectivity', body: [
            'Prayagraj’s case rests on logistics. Of all AKIC nodes it is closest to the EDFC (7 km to New Karchana) and to an inland container depot (Naini ICD, 5 km), with waterway access nearby — the cleanest realisation of the corridor’s freight-led logic. Its land is 81% industrial, the highest share in the corridor, and it is being developed inside the already-serviced Saraswati Hi-Tech City, which carries 24×7 power and a dedicated substation. That combination explains why it reached EPC LoA quickly despite a late-2024 start.',
          ] },
          { heading: 'Land assembly and the shared SPV', body: [
            'The 352 acres were assembled from two sources: 238 acres acquired from the former Bharat Pumps & Compressors Limited site and 114 acres drawn from Saraswati Hi-Tech City. Agra and Prayagraj run on one shared SPV; the ₹1,046 cr cost figure that appears in reporting is the combined Agra+Prayagraj development cost, with a ₹125 cr figure referring specifically to the Naini component — so per-node cost allocation is not cleanly separable in sources.',
          ] },
          { heading: 'Risks & open questions', body: [
            'Environmental clearance was applied for in March 2025 but approval is unconfirmed in sources, and the EPC contractor name and land-handover status are not disclosed. As the smallest node, its absolute draw is limited, and the 115+ acres of vacant industrial plots still available inside Saraswati Hi-Tech City could compete with the IMC for the same investors. No anchor tenants exist yet.',
          ] },
        ],
        timeline: [
          { date: 'Nov 2024', label: 'SSA & SHA signed with UPSIDA (7–8 November)' },
          { date: 'Jan 2025', label: 'Shared SPV — IMC Agra Prayagraj Ltd — incorporated (30 January)' },
          { date: 'Mar 2025', label: 'Environmental-clearance application submitted' },
          { date: 'Oct 2025', label: 'EPC Letter of Award issued (27 October)' },
          { date: '2025–27', label: 'Trunk-infrastructure construction underway (36-month target)' },
        ],
        sources: [
          { label: 'NICDC — IMC Prayagraj, Uttar Pradesh', url: 'https://nicdc.in/projects/12-new-projects/imc-prayagraj-uttar-pradesh' },
          { label: 'Hindustan Times — UPSIDA seeks EC for Prayagraj industrial hub', url: 'https://www.hindustantimes.com/cities/others/upsida-seeks-environmental-clearance-for-prayagraj-industrial-hub-101741542463821.html' },
          { label: 'The Statesman — UP IMCs in Agra and Prayagraj', url: 'https://www.thestatesman.com/india/up-to-set-up-integrated-manufacturing-clusters-in-agra-prayagraj-to-boost-industrial-growth-1503449558.html' },
          { label: 'ETV Bharat — AKIC mega clusters in UP', url: 'https://www.etvbharat.com/en/!bharat/uttar-pradesh-set-to-shine-with-mega-industrial-clusters-under-amritsar-kolkata-corridor-enn24110807014' },
          { label: 'The Economic Times — Agra/Prayagraj IMCs at ₹1,046 cr', url: 'https://widget.economictimes.indiatimes.com/news/india/uttar-pradesh-to-develop-integrated-manufacturing-hubs-in-agra-prayagraj-at-rs-1046-crore-cost/articleshow/122072654.cms' },
        ],
      },
      {
        slug: 'gaya', name: 'Gaya IMC', state: 'Bihar', stage: 'construction',
        statusLabel: 'Land acquired, EC granted; Bihar’s largest industrial township', coords: [283, 260],
        areaAc: 1670, projectCostCr: 1339, investmentCr: 16524, jobs: 109185,
        sectors: 'Agro & food processing, building materials, handloom & handicraft, engineering & fabrication, leather, medical equipment, readymade garments, furniture',
        nearest: 'NH-19 (GT Road) ~10 km; NH-22 ~2 km; Gaya Junction ~40 km; New Paharpur EDFC ~45 km; Gaya airport ~30 km; Haldia port ~550 km',
        developer: 'Bihar Integrated Manufacturing City Gaya Limited (BIMCGL) — NICDC–BIADA JV; SPV incorporated 6 January 2025; SSA/SHA 12 November 2024',
        companies: [
          { name: 'No allotted tenants', sector: '—', commitment: 'Pre-construction — zero named IMC allottees or anchor MoUs verified; land allocation was slated to begin 1 April 2025 but no allottee names had surfaced by June 2026 [V]' },
          { name: 'BIADA statewide allottees (Aditya Birla Fashion, SLMG Beverages, Ganga Foods, Nostino Foods)', sector: 'Context — BIADA Project Clearance Committee', commitment: 'Among 21 units allotted across 15 Bihar industrial areas (incl. Gaya) in 2025, ~₹260 cr / 1,419 jobs total; which units are in Gaya is not disclosed — not confirmed IMC allottees [V1]' },
        ],
        industries: ['Agro & food processing', 'Steel-based products / engineering', 'Building materials', 'Handloom & handicraft', 'Leather goods', 'Medical equipment', 'Readymade garments', 'Furniture'],
        infrastructure: [
          '1,670 acres in Dobhi block (Sherghati sub-division), spanning 13 revenue villages — the second-largest AKIC node. Land-use 918.62 ac industrial (55%), 350.75 ac green (21%), 283.94 ac roads & parking (17%), the balance residential, utilities, commercial and amenities.',
          'Planned trunk infrastructure: 29.89 km internal road network, 220/33 kV and 33/11 kV substations, 162 MVA assured power, 19 MLD water supply, plus CETP, STP, WTP and solid-waste, drainage, skill-centre and fire-station provisions.',
          'A 7 km greenfield road to NH-19 (GT Road) approved at ₹142 cr; NH-22 at 2 km; New Paharpur EDFC station ~45 km (a moderate constraint); Gaya airport 30 km; Haldia port ~550 km.',
          'Proximity to Jharkhand’s mineral belt (iron ore, coal) feeds the steel/engineering sectors; Bihar’s agri base feeds food processing; Bodh Gaya heritage tourism links the handloom/handicraft sectors.',
        ],
        incentives: 'A stamp-duty waiver was granted for the project (March 2025). Bihar’s BIPPP-2025 (open until 31 March 2026) offers up to 25 acres free land (>₹1,000 cr investment), 30% capital subsidy, SGST reimbursement up to 300% of project cost over 14 years, interest subvention up to ₹40 cr, and employment, skill and export incentives. Specific IMC power tariff not found; 162 MVA assured supply is planned.',
        summary: [
          'Gaya is being built as Bihar’s largest industrial township and the second-largest AKIC node at 1,670 acres. It has moved fast for a late starter: CCEA approval 28 August 2024, SSA/SHA 12 November 2024, SPV (Bihar Integrated Manufacturing City Gaya Limited) incorporated 6 January 2025, environmental clearance 18 March 2025, industrial-area notification and stamp-duty waiver in March 2025, and land acquisition confirmed complete by mid-2025.',
          'It carries strong projected numbers — ₹1,339 cr development cost (including ₹462.14 cr land acquisition), ₹16,524 cr investment potential and 1,09,185 jobs — across a broad sector mix from agro-processing and engineering to handloom, leather and medical equipment. The investment-per-acre is the second-highest in the corridor after Hisar.',
          'In December 2025 the Bihar Chief Secretary inspected the site, presented a digital master plan and ordered the NH-22 upgrade, a dedicated helipad, the Chandauti grid power link and an underground water pipeline and reservoir. No anchor tenants have been named yet; the EPC tender was expected from July 2025 with the implementation agency to be finalised by March 2026.',
        ],
        sections: [
          { heading: 'A fast-moving greenfield', body: [
            'Gaya cleared its statutory gates in barely seven months — CCEA approval, agreements, SPV incorporation, environmental clearance, industrial-area notification and a stamp-duty waiver all fell between August 2024 and March 2025, with land acquisition complete by mid-2025. The SPV, BIMCGL, has authorised capital of ₹1,000 cr (₹5 cr paid-up) and a six-member Centre–State board, with BIADA’s Managing Director as CEO.',
            'The December 2025 Chief Secretary inspection signalled high-level priority: directives covered the NH-22 upgrade, a helipad, the Chandauti grid for power, and an underground water pipeline and reservoir — the “BIMCGL is Bihar’s future” framing.',
          ] },
          { heading: 'The hinterland advantage', body: [
            'Gaya’s sector logic draws on three hinterlands: Jharkhand’s adjacent mineral belt (iron ore, coal) for steel-based and engineering products; Bihar’s agricultural base for agro and food processing; and Bodh Gaya heritage tourism for handloom and handicraft. NH-19 (Golden Quadrilateral) is 10 km away, with a dedicated ₹142 cr, 7 km greenfield link being built to it — partly offsetting the moderate 45 km distance to the New Paharpur EDFC station.',
          ] },
          { heading: 'Risks & open questions', body: [
            'No anchor tenants or anchor MoUs exist for the IMC despite a declared April 2025 land-allocation start, and the four named BIADA statewide allottees cannot be tied to Gaya specifically. EPC-tender floating and implementation-agency selection (deadline March 2026) were unconfirmed as of June 2026, and the master-plan/DPR formal status, water source and external power connectivity remain open in sources. EDFC distance (45 km) is a moderate constraint, and the node competes with neighbouring states for the same investors.',
          ] },
        ],
        timeline: [
          { date: 'Aug 2024', label: 'CCEA approval (28 August)' },
          { date: 'Nov 2024', label: 'SSA & SHA signed with BIADA (12 November)' },
          { date: 'Jan 2025', label: 'SPV — BIMCGL — incorporated (6 January)' },
          { date: 'Mar 2025', label: 'Environmental clearance (18 March), industrial-area notification & stamp-duty waiver' },
          { date: 'Mid-2025', label: 'Land acquisition confirmed complete; EPC tender expected' },
          { date: 'Dec 2025', label: 'Chief Secretary inspection — NH-22, helipad, power & water directives' },
        ],
        sources: [
          { label: 'NICDC — IMC Gaya, Bihar', url: 'https://nicdc.in/projects/12-new-projects/imc-gaya-bihar' },
          { label: 'PIB — NICDC, BIADA agreements for Gaya cluster', url: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2072787&reg=3&lang=2' },
          { label: 'Patna Press — Gaya to be Bihar’s largest industrial township', url: 'https://patnapress.com/gaya-set-to-become-bihars-largest-industrial-township-under-amritsar-kolkata-corridor/' },
          { label: 'IndiaFilings — BIMCGL company details (CIN)', url: 'https://www.indiafilings.com/search/bihar-integrated-manufacturing-city-gaya-limited-cin-U43900BR2025PLC072955' },
          { label: 'TV9 Bharatvarsh — CS inspection of Gaya township (Dec 2025)', url: 'https://www.tv9hindi.com/india/industrial-township-project-of-gaya-cs-amrit-pratyaya-directed-to-expedite-the-works-3598910.html' },
        ],
      },
      {
        slug: 'jharkhand', name: 'Jharkhand IMC', state: 'Jharkhand', stage: 'planned',
        statusLabel: 'Stalled at site identification — no SPV, no metrics', coords: [300, 268],
        sectors: 'Not yet officially designated (metals, heavy engineering, auto components likely, based on state endowment)',
        nearest: 'Site-dependent — no land parcel confirmed',
        developer: 'No SPV incorporated. Government of Jharkhand requested by NICDC to finalise land; SPV to be formed only after a site is confirmed.',
        companies: [
          { name: 'No site, no allottees', sector: '—', commitment: 'No named companies, allottees, investors or MoUs are possible — the node has no confirmed land parcel; the original New Bahri site is unavailable [V]' },
          { name: 'Bokaro Steel Plant (proposed site only)', sector: 'Context — potential alternate site', commitment: '~740 acres at Bokaro identified by BSP (June 2023 DMU); state validation pending and not confirmed in later Lok Sabha records — a proposal, not an allotment [U]' },
        ],
        industries: ['Metals & metal products (potential)', 'Heavy engineering (potential)', 'Auto & auto components (potential)', 'Chemicals & petrochemicals (potential)', 'Textiles & leather (potential)'],
        infrastructure: [
          'No confirmed site, area, land-use plan, master plan or DPR — the original New Bahri site is unavailable and an alternate is still being identified by the state government (NICDC DMU, October 2024).',
          'Sits within the broader AKIC framework (EDFC alignment ~1,839 km across six states; influence area across seven states including Jharkhand), but no node-level infrastructure can be assessed until a site is fixed.',
          'State endowment is the rationale: Jharkhand’s mineral and metals base (iron ore, coal, copper, mica, bauxite, limestone) and existing heavy-engineering clusters at Adityapur, Bokaro, Ranchi and Jamshedpur — none linked to the IMC, which has no land to allot.',
        ],
        incentives: 'No node-specific incentives — none can exist without a confirmed site and SPV. Jharkhand state industrial-policy terms would apply once the IMC is established; specific figures not found in sources.',
        summary: [
          'The Jharkhand IMC is the corridor’s sole stalled node. Unlike every other AKIC node, it has no confirmed site, no SPV, no master plan or DPR, and therefore no area, cost, investment or employment figures — because the originally identified New Bahri site is no longer available and an alternate is still being identified by the state government, per the NICDC DMU report of October 2024.',
          'Approved in principle since the 2014 AKIC Cabinet decision, it remains roughly twelve years on at the site-identification stage. A June 2023 DMU note recorded Bokaro Steel Plant having identified ~740 acres at Bokaro, but state validation was pending and later Lok Sabha records still list the status simply as “State Govt. to confirm land.”',
          'There are no tenants, allottees or MoUs, and there cannot be without land. The state’s mineral and metals base — and existing heavy-engineering clusters at Adityapur, Bokaro, Ranchi and Jamshedpur — is the only rationale on record, but none of it is connected to this IMC. A frequent source of confusion is the neighbouring, far-advanced Gaya IMC in Bihar, which is a separate project.',
        ],
        sections: [
          { heading: 'Stuck at site identification', body: [
            'The NICDC DMU report (October 2024) states that the New Bahri site is unavailable, that an alternate is being identified, and that project-development activities will begin only after a land parcel is finally confirmed — with the Government of Jharkhand formally requested to finalise land. The May 2024 and October 2024 reports use identical language, indicating no progress between them.',
            'This places Jharkhand two to three years behind every other AKIC node, all of which have at minimum incorporated SPVs or appointed consultants. The contrast with neighbouring Gaya in Bihar — 1,670 acres, SPV incorporated, EC granted — is stark, and the two are frequently conflated in secondary reporting.',
          ] },
          { heading: 'The Bokaro question', body: [
            'The one concrete alternative on record is Bokaro: the June 2023 DMU noted that Bokaro Steel Plant had identified ~740 acres and provided a preliminary land cost, awaiting state validation. That validation does not appear in subsequent official sources, and the Lok Sabha status line remained “State Govt. to confirm land.” Whether Bokaro was rejected or simply stalled is unresolved.',
          ] },
          { heading: 'Risks & open questions', body: [
            'The critical open issue is whether — and where — the state will finalise land at all, given that all other AKIC states have advanced their nodes. Without a site there is no SPV, no metrics, no clearances, no EDFC assessment and no possible tenant pipeline. The risk is that investor commitments flow to already-advanced neighbouring nodes before Jharkhand confirms a parcel.',
          ] },
        ],
        timeline: [
          { date: 'Jan 2014', label: 'AKIC approved by Cabinet — one IMC mandated per state, including Jharkhand' },
          { date: 'Jun 2023', label: 'Bokaro Steel Plant identifies ~740 ac at Bokaro (state validation pending)' },
          { date: 'May 2024', label: 'DMU: New Bahri site unavailable; alternate being identified' },
          { date: 'Oct 2024', label: 'DMU: status unchanged — Jharkhand govt requested to finalise land' },
        ],
        sources: [
          { label: 'NICDC — DMU Report October 2024', url: 'https://nicdc.in/images/documents/DMU_Report_Oct_2024.pdf' },
          { label: 'NICDC — DMU Report May 2024', url: 'https://nicdc.in/images/documents/DMU_Report_May_2024.pdf' },
          { label: 'NICDC — AKIC Executive Summary Report', url: 'https://www.nicdc.in/images/documents/AKIC_Executive_Summary_Report..pdf' },
          { label: 'Lok Sabha — IMC status (State Govt. to confirm land)', url: 'https://sansad.in/getFile/loksabhaquestions/annex/177/AU607.pdf' },
        ],
      },
      {
        slug: 'raghunathpur', name: 'Raghunathpur (Jangal Sundari Karmanagari)', state: 'West Bengal', stage: 'planned',
        statusLabel: 'AKIC node on hold since 2021; state-led steel park with real allottees', coords: [308, 280],
        areaAc: 2483,
        sectors: 'Steel & metal products, ancillary engineering, logistics & warehousing, general manufacturing (no official IMC target sectors published)',
        nearest: 'Adra railway station; Dankuni ~211 km; Kolkata ~255 km; Ranchi ~119 km; EDFC Sonnagar–Dankuni section pending',
        developer: 'No Centre–State joint SPV. State-led township under WBIDC (West Bengal Industrial Development Corporation); NICDIT listed as co-founder. On hold since 22 June 2021 pending EDFC funding clarity.',
        companies: [
          { name: 'No IMC allottees', sector: '—', commitment: 'The AKIC IMC component itself has no announced allottees or MoUs — it is on hold pending EDFC funding; the firms below are WBIDC steel-park allottees in the same land, not NICDP IMC tenants [V]' },
          { name: 'Jai Balaji Group', sector: 'Steel', commitment: '~1,455.02 ac + 180.61 ac allotted (2011); operational; part of a ~₹20,000 cr steel-majors pipeline at the park [V]' },
          { name: 'Shyam Steel / Shyam Metalics', sector: 'Integrated steel plant (TMT bars)', commitment: '~600–610 ac · ₹1,500–4,591 cr · ~1.19 MTPA Phase-1 · ~10,000 jobs expected — under construction (2023–25); location within vs adjacent to the IMC boundary unclear [V/V1]' },
          { name: 'Rashmi Steel', sector: 'Steel', commitment: '~800 ac allotted at Jangal Sundari Karmanagari [V]' },
          { name: 'Captain Steel', sector: 'Steel', commitment: '~300 ac allotted at Jangal Sundari Karmanagari [V]' },
          { name: 'DPSC Ltd', sector: 'Thermal power (2×270 MW)', commitment: '~155.50 ac · ₹3,024 cr — land allotted (2011) [V]' },
          { name: 'Tanti Construction Ltd', sector: 'Wagon manufacturing', commitment: '~60 ac · ₹475 cr · 1,500 jobs — land allotted (2011) [V]' },
          { name: 'OMM Sai Infra Holding Pvt Ltd', sector: 'Integrated logistics park', commitment: '~120 ac · ₹455.50 cr · 750 direct + 4,500 indirect jobs — land allotted (2011) [V]' },
          { name: 'Maithan Alloys / Super Smelter / Vikash Metal & Power / DVC', sector: 'Alloys, smelting, metal & power, power infrastructure', commitment: 'WBIDC allottees / infrastructure at the park (DVC ~65.02 ac rail-cum-road corridor); steel-belt anchors, not IMC tenants [V]' },
        ],
        industries: ['Steel & metal products (downstream)', 'Ancillary engineering / auto components', 'Logistics & warehousing (EDFC-linked)', 'Thermal power', 'General manufacturing'],
        infrastructure: [
          '2,483 acres in two parcels (Raghunathpur Steel & Allied Industrial Park I, 1,749.07 ac; Park II, 733.99 ac) — Wikipedia/WBIDC cite ~2,843 ac including buffer. Land-use is 40%+ industrial; detailed splits not published. Master plan completed (2016); environmental clearance was “underway” in 2020-21, not yet obtained.',
          'Situated in the south Damodar industrial belt (Barjora–Mejia–Raghunathpur) with DVC power from the Raghunathpur Thermal Power Plant; nearest railway station Adra.',
          'Distances: Dankuni ~211 km, Kolkata ~255 km, Ranchi ~119 km. The defining blocker is the unfunded Sonnagar–Dankuni section of the EDFC, on which the IMC has been paused since 2021.',
          'A genuine, operational steel cluster already exists on the land (Jai Balaji, Shyam Steel/Metalics, Rashmi, Captain Steel, DPSC, Maithan Alloys, Tanti, OMM Sai) — but as WBIDC steel-park allottees, distinct from the stalled NICDP IMC.',
        ],
        incentives: 'No node-specific IMC incentives — the project is on hold. Critically, West Bengal’s Revocation of Incentive Schemes Bill 2025 retrospectively withdrew all industrial incentives granted since 1993 (capital subsidy, SGST reimbursement, land-cost and power concessions); several firms (UltraTech, Electrosteel, Grasim, Nuvoco, Dalmia) have challenged it in the Calcutta High Court, and a new policy is reportedly being drafted.',
        summary: [
          'Raghunathpur — branded Jangal Sundari Karmanagari — is unusual among AKIC nodes: it is the second-largest by area (2,483 acres) yet the least advanced as an NICDP project. It is confirmed as an AKIC node in NICDC’s FY 2020-21 annual report, but it has no Centre–State joint SPV, remaining a state-led township under WBIDC, and the IMC component has been on hold since 22 June 2021 pending clarity on funding for the Sonnagar–Dankuni section of the EDFC.',
          'What sets it apart is that the land already hosts a real, operational steel cluster. Unlike the greenfield nodes with zero tenants, Raghunathpur’s WBIDC steel-and-allied park has named allottees — Jai Balaji, Shyam Steel/Metalics, Rashmi Steel, Captain Steel, DPSC, Maithan Alloys, Tanti Construction, OMM Sai and DVC — accounting for thousands of acres and multi-thousand-crore commitments. These are park allottees, not NICDP IMC tenants, and the IMC trunk works remain unbuilt.',
          'No project cost, investment-potential or employment figures exist for the IMC itself, and no target sectors are officially published. The master plan was completed in 2016, but environmental clearance has not been obtained, no SPV has been formed, and the 2025 retrospective revocation of West Bengal’s industrial incentives adds further uncertainty to any future investment.',
        ],
        sections: [
          { heading: 'A real steel park, a stalled IMC', body: [
            'Raghunathpur is two things at once. As a WBIDC steel-and-allied industrial park, it is a working cluster: Jai Balaji (~1,455 + 181 ac), Shyam Steel/Metalics (~600–610 ac, up to ₹4,591 cr, ~1.19 MTPA, ~10,000 jobs expected), Rashmi Steel (~800 ac), Captain Steel (~300 ac), DPSC thermal power (₹3,024 cr), Tanti Construction wagons (₹475 cr), OMM Sai logistics (₹455.50 cr), plus Maithan Alloys, Super Smelter, Vikash Metal & Power and DVC infrastructure. As a NICDP IMC, it is stalled — no SPV, no EC, no EPC.',
            'The distinction matters: whether Shyam Steel’s plant sits inside or merely adjacent to the 2,483-acre IMC boundary is unclear in sources, so even the apparent anchors cannot be cleanly attributed to the IMC component.',
          ] },
          { heading: 'The EDFC blocker and the incentive shock', body: [
            'The project has been paused since June 2021, when WBIDC communicated that it was on hold pending the EDFC Sonnagar–Dankuni funding strategy — and no resumption timeline appears in any source since. On top of that, West Bengal’s 2025 Revocation Bill retrospectively withdrew all industrial incentives granted since 1993; major firms have moved the Calcutta High Court, and the promised replacement policy has not surfaced. Together these create a uniquely uncertain investment environment for the node.',
          ] },
          { heading: 'Risks & open questions', body: [
            'The structural gaps are fundamental: no Centre–State SPV (unlike every other AKIC node), no environmental clearance, no published cost/investment/jobs metrics and no official target sectors. The two decisive open questions are whether the Sonnagar–Dankuni EDFC funding is ever clarified, and whether West Bengal forms a joint SPV with NICDC — the absence of which may indicate low state priority. The land is acquired and the master plan complete, so the bottleneck is policy and funding, not land.',
          ] },
        ],
        timeline: [
          { date: 'Jan 2014', label: 'AKIC approved by Cabinet — West Bengal node mandated' },
          { date: '2011', label: 'WBIDC steel-park allotments (Jai Balaji, Shyam Steel, DPSC, Tanti, OMM Sai, DVC)' },
          { date: '2016', label: 'Raghunathpur Industrial Park master plan finalised' },
          { date: 'Feb 2021', label: 'Environmental-clearance application submitted' },
          { date: 'Jun 2021', label: 'Project put on hold pending EDFC Sonnagar–Dankuni funding clarity' },
          { date: '2025', label: 'WB Revocation of Incentive Schemes Bill withdraws incentives; firms challenge in court' },
        ],
        sources: [
          { label: 'NICDC — Annual Report FY 2020-21 (AKIC status)', url: 'https://www.nicdc.in/phocadownload/Annual_Report_for%20the_FY_2020-21-NICDC.pdf' },
          { label: 'National Industrial Corridor — Raghunathpur Industrial Park', url: 'https://nationalindustrialcorridor.com/raghunathpur-industrial-park-west-bengal/' },
          { label: 'WBIDC — Land allotment newsletter (2011)', url: 'http://www.wbidc.com/images/pdf/news/land_allotment_28-feb-11.pdf' },
          { label: 'Business Standard / PTI — Purulia integrated industrial hub for freight corridor', url: 'https://www.business-standard.com/article/pti-stories/purulia-to-have-integrated-industrial-hub-for-freight-corridor-116070100882_1.html' },
          { label: 'Telegraph India — Bengal to recover idle industrial land', url: 'https://www.telegraphindia.com/business/bengal-government-to-initiate-process-of-recovering-idle-land/cid/1825582' },
        ],
      }
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
        statusLabel: 'Activation zone live — de-risked by the Tata semiconductor fab', coords: [97, 300],
        areaAc: 227337, projectCostCr: 2550, jobs: 800000,
        sectors: 'Semiconductors, solar, electronics, chemicals, defence, EV, data centres',
        nearest: 'Dholera greenfield airport ~15 km; Pipavav port ~200 km; on the Ahmedabad–Vadodara golden corridor',
        developer: 'Dholera Industrial City Development Ltd (DICDL), incorporated 2016; planning by DSIRDA; AECOM is project-management consultant. SPV shareholding not disclosed (presumed 50:50 Centre:State).',
        epc: 'Activation-zone trunk infrastructure (₹2,550 cr basic-amenities tender); Tata fab under construction; airport integrated terminal contract (~₹333 cr) to Yashnand Engineers',
        companies: [
          { name: 'Tata Electronics / Tata Semiconductor (TEPL/TSMPL)', sector: 'Semiconductor fabrication (50,000 WSPM)', commitment: '₹91,526 cr · 20,000+ jobs — Fiscal Support Agreement signed Mar 2025, under construction, production target 2027 [V]' },
          { name: 'Tata Power Renewable Energy', sector: '300 MW hybrid solar plant', commitment: 'Operational / commissioned — part of a wider Gujarat hybrid-renewables MoU [V]' },
          { name: 'ReNew Power', sector: 'Solar cell manufacturing', commitment: 'Under construction [V]' },
          { name: 'Grew Energy', sector: 'Solar component manufacturing (2.8 GW)', commitment: '~₹3,800 cr · 1,600+ jobs — Vibrant Gujarat 2024 MoU [V1]' },
          { name: 'L&T (VYOMA)', sector: '250 MW AI data centre', commitment: '~₹25,000 cr — MoU [V1]' },
          { name: 'Opera Energy', sector: 'Renewable energy', commitment: '~₹5,000 cr — MoU [V]' },
          { name: 'Jabil', sector: 'Electronics / EMS', commitment: 'Land allotted, no construction yet [U]' },
          { name: 'Polycab', sector: 'Electricals / wires', commitment: 'Land allotted, no construction yet [U]' },
          { name: 'GAP Group', sector: 'Real estate (Akhilam township, Hyatt hotel)', commitment: 'Early mover in the activation zone [V1]' },
        ],
        industries: ['Semiconductor fabrication', 'Solar cell & module manufacturing', 'Electronics / EMS', 'Renewable energy', 'AI data centres', 'Chemicals'],
        infrastructure: [
          '422 sq km of a 920 sq km plan earmarked industrial; activation zone ~5,800 ac under EPC; 15–20% green belt; new tenders released for 10 further TP schemes (~82 sq km).',
          'Dholera greenfield airport ~15 km (terminal contract awarded); exclusive Torrent Power distribution with 33/66 kV and 220/400 kV substations.',
          'Two reservoirs, 9 elevated storage reservoirs, 60 MLD CETP and 30 MLD STP; 99-year leasehold at a ~₹1.1 cr/acre base rate.',
        ],
        incentives: 'Gujarat Industrial Policy 2020 — mega-project capital subsidy and SGST reimbursement for semiconductors/electronics; plug-and-play plots with ICT/power/water at the gate; a common cleanroom facility being built to draw smaller OSAT players.',
        summary: [
          'Dholera is India’s largest greenfield smart city — a 920 sq km plan (~227,337 ac) and the DMIC’s flagship — but it is still pre-operational: the activation-zone trunk infrastructure is being completed and only a handful of solar installations are running, while most manufacturing is two to four years from production.',
          'The single development that de-risks the whole node is the Tata Electronics semiconductor fab: a ₹91,526 cr Fiscal Support Agreement was signed in March 2025 and construction is under way against a 2027 production target, anchoring Dholera’s identity as a high-tech manufacturing hub. A Tata Power 300 MW solar plant is already commissioned and ReNew’s solar-cell unit is under construction.',
          'Everything beyond that anchor should be read carefully. The official allottee register is not public, and several named firms — Jabil, Polycab — show land allotments but no ground-breaking; data-centre and renewable commitments such as the L&T VYOMA 250 MW project remain MoUs rather than committed builds.',
        ],
        timeline: [
          { date: '2016', label: 'DICDL incorporated; master plan finalised' },
          { date: 'Jan 2024', label: 'Vibrant Gujarat MoUs (Grew Energy, Tata Power hybrid renewables)' },
          { date: 'Mar 2025', label: 'Tata fab Fiscal Support Agreement (~₹91,526 cr) signed' },
          { date: '2027', label: 'Tata fab production target' },
        ],
        sections: [
          { heading: 'The Tata fab anchor', body: [
            'The Tata Electronics / Tata Semiconductor fab — a 50,000 wafer-starts-per-month facility worth ₹91,526 cr with 20,000-plus direct and indirect jobs — is the event that converts Dholera from a master-plan into a credible industrial destination. The Fiscal Support Agreement (a binding government commitment) was signed in March 2025 and construction is in progress, with an aggressive 2027 production target.',
            'Around it a semiconductor and electronics cluster is being seeded: a common cleanroom for smaller OSAT players, a dedicated industrial-gas yard, and EMS allotments to firms such as Jabil and Polycab — though those two are land-allotted only, with no construction yet visible.',
          ] },
          { heading: 'Renewables and the data-centre pipeline', body: [
            'Renewable energy is the node’s most-realised sector: Tata Power’s 300 MW solar plant is commissioned, ReNew’s solar-cell unit is under construction, and Grew Energy (~₹3,800 cr, 2.8 GW), Opera Energy (~₹5,000 cr) and others have signed on. The abundant land and dedicated Torrent Power grid also make Dholera attractive for high-power digital infrastructure — the L&T VYOMA 250 MW AI data centre (~₹25,000 cr) being the headline, still at MoU stage.',
          ] },
          { heading: 'Risks & open questions', body: [
            'Water security in a semi-arid zone for water-intensive fabs, and the aggressive 2027 Tata production target, are the chief execution risks; the airport’s 2025–26 completion looks likely to slip to 2027–28.',
            'Allottee-versus-MoU transparency is poor: the official land-allotment register is not published, so several headline names cannot be confirmed as committed builds. Grid stability will also be tested by the sudden addition of a fab plus a 250 MW data centre.',
          ] },
        ],
        sources: [
          { label: 'PIB — Tata semiconductor fab (PRID 2108602)', url: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2108602' },
          { label: 'Dholera SIR — DSIRDA FAQ', url: 'http://www.dholerasir.co.in/faq.html' },
          { label: 'The Daily Guardian — Dholera SIR allottees / construction', url: 'https://thedailyguardian.com/business/gap-group-hosts-gicea-delegation-in-dholera-sir-696602/' },
          { label: 'Construction World — Tata Power hybrid renewables Gujarat', url: 'https://www.constructionworld.in/amp/Latest-Construction-News/tata-power-commits-rs-700-bn-for-10000-mw-hybrid-renewables-in-gujarat/49472' },
          { label: 'iNDEXTb — Dholera industrial-gas ecosystem (land rates)', url: 'https://indextb.com/files/2024/2/7543b0fd-61f9-4b83-a661-5a90fd5e88f6_Gas%20Yard%20for%20Industrial%20Gas%20Supply%20for%20Semiconductor.pdf' },
        ],
      },
      {
        slug: 'auric-shendra-bidkin', name: 'Shendra–Bidkin (AURIC)', state: 'Maharashtra', stage: 'operational',
        statusLabel: 'Phase 1 operational, nearly sold out — EV-led cluster', coords: [143, 337],
        areaAc: 9930, projectCostCr: 7948, investmentCr: 67815, jobs: 55000,
        sectors: 'EV & auto, aerospace, electronics, pharma, textiles, chemicals',
        nearest: 'Chhatrapati Sambhajinagar airport ~15 km; NH-52 adjacent; within the Aurangabad auto belt',
        developer: 'Maharashtra Industrial Township Ltd (MITL, formerly AITL), incorporated 2014; shareholding 49% DMIC Trust : 51% MIDC (GoM)',
        epc: 'Phase 1 (Shendra) ₹1,533.45 cr and Phase 2 (Bidkin) ₹6,414.21 cr trunk infrastructure; ₹400 cr independent Bidkin water-supply scheme (70 MLD WTP, ~3-yr build) approved Mar 2025',
        companies: [
          { name: 'Hyosung', sector: 'Technical textiles (South Korea)', commitment: '~₹1,500 cr — operational; AURIC’s first mega investor (2018) [V1]' },
          { name: 'Toyota Kirloskar Motor', sector: 'EV / automotive', commitment: 'Committed (major Bidkin allotment), multi-crore [V]' },
          { name: 'JSW Green Mobility', sector: 'EV / green mobility', commitment: 'Committed, multi-crore [V]' },
          { name: 'Ather Energy', sector: 'EV scooters', commitment: 'Committed, multi-crore [V]' },
          { name: 'Lubrizol India', sector: 'Specialty chemicals / additives', commitment: 'Committed, multi-crore [V]' },
          { name: 'Lonbest India', sector: 'Electronics (chipsets, PCBs)', commitment: '₹110 cr · 500 jobs · Sector 12 — land allotted (mega-project), Aug 2025 [V]' },
          { name: 'Science for Society Techno Services', sector: 'Specialty food ingredients', commitment: '₹104 cr · 325+ jobs · Sector 12 — land allotted (mega-project), Aug 2025 [V]' },
          { name: 'Alankar Engineering Equipments', sector: 'Road-construction equipment', commitment: '₹17.5 cr · Sector 5 — expansion allotment, Aug 2025 [V]' },
          { name: 'Polycab Wires', sector: 'Electrical wires / cables', commitment: 'Allotted (cited in a CAG expansion-policy reference) [V]' },
          { name: 'Reliance Infrastructure / Anvi Power / Gensol Engineering', sector: 'Infrastructure, power, renewables', commitment: 'MoU / intent, multi-crore [V1]' },
        ],
        industries: ['EV & automotive manufacturing', 'Technical textiles', 'Specialty chemicals', 'Electronics', 'Engineering & ancillaries', 'Food processing'],
        infrastructure: [
          'Phase 1 Shendra ~2,073 ac (8.39 sq km) almost fully allotted; Phase 2 Bidkin ~7,857 ac (31.79 sq km) selling fast.',
          'Plug-and-play trunk infrastructure to the plot boundary; published utility rates (treated water ₹20/KL, recycled ₹10/KL); land base ~₹1.42 cr/acre.',
          '₹400 cr independent Bidkin water scheme drawing from Jayakwadi Dam approved Mar 2025 (~3-yr build), resolving the node’s main infrastructure risk; ~15 km from Chhatrapati Sambhajinagar airport.',
        ],
        incentives: 'Maharashtra Industries, Investment & Services Policy 2025 — land at Re 1/acre for qualifying global giants, SGST refunds, capital subsidy / interest subvention, electricity-duty exemption and power-tariff support; MAITRI 2.0 AI-driven approvals. (Re-1 land applicability to AURIC not yet confirmed.)',
        summary: [
          'Shendra–Bidkin, branded AURIC, is the DMIC’s clearest operational success after Dholera: Phase 1 (Shendra) is nearly sold out with firms in production, and Phase 2 (Bidkin) is in advanced development. Cumulative confirmed investment is cited by NICDC at ~₹56,200 cr, concentrated in the EV ecosystem.',
          'The marquee tenants are EV and auto — Toyota Kirloskar, JSW Green Mobility and Ather Energy — alongside Lubrizol in chemicals, with the South Korean textile giant Hyosung (~₹1,500 cr, operational since 2018) as the original anchor. A PIB land-allotment round in August 2025 added committed mega-projects (Lonbest India electronics ₹110 cr, Science for Society ₹104 cr) — these are committed allotments, not MoUs.',
          'The chief infrastructure risk — water for Bidkin — was substantially mitigated in March 2025 by approval of a ₹400 cr independent supply scheme from Jayakwadi Dam, though its ~3-year build means interim sourcing until ~2028.',
        ],
        timeline: [
          { date: '2014', label: 'MITL (then AITL) incorporated' },
          { date: '2015–16', label: 'CCEA approval of Shendra (2015) and Bidkin (2016)' },
          { date: '2018', label: 'Hyosung becomes AURIC’s first mega investor (~₹1,500 cr)' },
          { date: 'Mar 2025', label: '₹400 cr independent Bidkin water scheme approved' },
          { date: 'Aug 2025', label: 'PIB land-allotment round (Lonbest, Science for Society and others)' },
          { date: 'Dec 2025', label: 'Maharashtra 2025 industrial policy (Re-1/acre, SGST refunds)' },
        ],
        sections: [
          { heading: 'The EV and auto cluster', body: [
            'AURIC has built a genuine EV identity. Toyota Kirloskar, JSW Green Mobility and Ather Energy are all committed, most of them in the larger Bidkin phase, with Lubrizol anchoring a specialty-chemicals adjacency. Tier-1 and tier-2 auto ancillaries are the logical fill, supported by the deep legacy Aurangabad auto base — Bajaj Auto, Skoda Auto Volkswagen, Varroc and Endurance Technologies.',
            'Hyosung, the South Korean technical-textile giant, remains the foundational tenant: ~₹1,500 cr and operational since 2018, it proved the node could attract global mega-investment before the EV wave.',
          ] },
          { heading: 'Committed allotments vs intent', body: [
            'A PIB-documented August 2025 land-allotment round is the strongest evidence of committed (not merely intended) investment: Lonbest India (electronics, ₹110 cr, 500 jobs), Science for Society (food ingredients, ₹104 cr) and Alankar Engineering (₹17.5 cr expansion) received land under mega-project / priority categories. Reliance Infrastructure, Anvi Power and Gensol Engineering, by contrast, are at MoU / intent stage.',
          ] },
          { heading: 'Risks & open questions', body: [
            'The ₹400 cr Bidkin water scheme is approved but has a ~3-year execution horizon (≈2028), so units setting up now may rely on interim sources until the Jayakwadi pipeline is live.',
            'The 2025 policy’s Re-1/acre land offer is transformative but its qualifying criteria are not yet public, and there is no confirmation AURIC has allotted under it. Plot-level land-use splits and which firm sits in Shendra versus Bidkin are also not publicly itemised.',
          ] },
        ],
        sources: [
          { label: 'NICDC — Shendra-Bidkin node page', url: 'https://nicdc.in/projects/4-projects-developed/shendra-bidkin-industrial-area-maharashtra' },
          { label: 'PIB — AURIC land allotments (PRID 2159657)', url: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2159657' },
          { label: 'Times of India — Bidkin ₹400 cr water scheme', url: 'https://timesofindia.indiatimes.com/city/aurangabad/independent-water-supply-project-approved-at-400-crore-cost-for-bidkin-node-of-auric/articleshow/119874741.cms' },
          { label: 'Elets eGov — AURIC / Hyosung first mega investor', url: 'https://egov.eletsonline.com/2023/02/auric-maharashtras-golden-address/' },
          { label: 'Financial Express — CCEA approval (2015)', url: 'https://www.financialexpress.com/policy/economy-ccea-approves-development-of-shendra-bidkin-industrial-area-in-dmic-78198/' },
        ],
      },
      {
        slug: 'iitgnl-greater-noida', name: 'Integrated Industrial Township, Greater Noida (IITGNL)', state: 'Uttar Pradesh', stage: 'operational',
        statusLabel: 'Trunk infrastructure complete — brownfield, allotment-stage', coords: [177, 205],
        areaAc: 748, projectCostCr: 1715, investmentCr: 33000,
        sectors: 'IT/ITES, hi-tech, biotechnology, R&D, electronics & electrical, automobile',
        nearest: 'Within Gautam Budh Nagar / NCR; near Bodaki railway station; ~40 km from the upcoming Noida (Jewar) International Airport',
        developer: 'DMIC Integrated Industrial Township Greater Noida Ltd (IITGNL), incorporated 2014; 50% NICDIT : 50% GNIDA',
        epc: 'Trunk infrastructure classified complete (PIB, Dec 2024); e-Land Management System being upgraded; industrial-plot allotment scheme ran Dec 2025–Jan 2026',
        companies: [
          { name: 'Haier', sector: 'Consumer electronics / white goods', commitment: 'Allotted — the township’s anchor consumer-electronics investor [V1]' },
          { name: 'Haryana Gas City Company', sector: 'Piped-natural-gas meters', commitment: '₹108 cr · 5 ac · 630 jobs — land allotted via e-auction, Mar 2023 (3-yr setup) [V1]' },
          { name: 'Time Server Services', sector: 'Mobile-packaging boxes', commitment: '₹55 cr · 4.6 ac · 900 jobs — land allotted via e-auction, Mar 2023 [V1]' },
          { name: 'Six further planned units', sector: 'Unnamed (non-polluting industries)', commitment: 'Planning stage — GNIDA confirmed Mar 2023, names not disclosed [U]' },
        ],
        industries: ['White goods / consumer electronics', 'IT/ITES & hi-tech manufacturing', 'Electronics & electrical', 'Biotechnology & R&D', 'Automobile & components'],
        infrastructure: [
          '747.5 ac (302.63 ha) within the Dadri–Noida–Ghaziabad Investment Region; brownfield, inside an existing Greater Noida industrial ecosystem.',
          'Trunk infrastructure classified complete by PIB (Dec 2024); 24-hour power supply designed in; an end-to-end e-Land Management System for online allotment, plan approvals and payments (consultant upgrade tendered 2026).',
          'NCR proximity is the headline advantage; listed as one of five planned townships around the upcoming Jewar International Airport.',
        ],
        incentives: 'Develops under a two-stage model (trunk infra by DMIC Trust + GNIDA, then private development via PPP / land monetisation); plug-and-play plots; online single-window via the Nivesh Mitra portal. Specific UP fiscal-incentive rates not detailed in the node sources.',
        summary: [
          'IITGNL is the DMIC’s brownfield node — a 747.5-acre township inside the established Greater Noida industrial belt rather than a greenfield city — and is unusual in that its trunk infrastructure was already classified complete by PIB in December 2024. It is therefore in an allotment-and-onboarding phase rather than a construction phase.',
          'Confirmed activity is modest but real: white-goods major Haier is the anchor, and a March 2023 e-auction allotted plots to Haryana Gas City Company (₹108 cr, 630 jobs) and Time Server Services (₹55 cr, 900 jobs), with GNIDA confirming six further unnamed units in planning. The SPV ran a fresh industrial-plot allotment scheme into January 2026 and is upgrading its e-land system, signalling an active marketing push.',
          'The main intelligence gap is transparency: despite completed infrastructure, very few allottees are publicly named, so actual uptake is hard to gauge. The node also competes with the wider cluster of new mega-cities planned around the Jewar (Noida International) airport.',
        ],
        timeline: [
          { date: '2014', label: 'IITGNL incorporated (CIN U74900UP2014PLC063430)' },
          { date: 'Jul 2015', label: 'Master plan accepted by the UP government' },
          { date: 'Mar 2023', label: 'E-auction allotments (Haryana Gas City, Time Server Services)' },
          { date: 'Dec 2024', label: 'PIB classifies trunk infrastructure complete' },
          { date: 'Dec 2025 – Jan 2026', label: 'Industrial-plot allotment scheme (deadline 11 Jan 2026)' },
        ],
        sections: [
          { heading: 'A brownfield township with completed infrastructure', body: [
            'Unlike the greenfield nodes, IITGNL sits inside the Dadri–Noida–Ghaziabad Investment Region within an already-industrialised district. Its ₹1,714.70 cr trunk infrastructure was classified complete by PIB in December 2024, and the SPV runs a full electronic land-management system for online allotment, plan approvals and payments — a 50:50 NICDIT–GNIDA joint venture with a projected ₹33,000 cr private investment over 30 years.',
          ] },
          { heading: 'Tenants and the disclosure gap', body: [
            'Haier is the anchor consumer-electronics name; the clearest committed allotments are the March 2023 e-auction winners Haryana Gas City Company (₹108 cr, 5 ac, 630 jobs) and Time Server Services (₹55 cr, 4.6 ac, 900 jobs), with six more unnamed units reported in planning. The broader Greater Noida pipeline (DS Group, Haldiram, TCIL and others) feeds the catchment but is not confirmed within the IITGNL boundary.',
          ] },
          { heading: 'Risks & open questions', body: [
            'The conspicuous absence of publicly named allottees despite completed infrastructure points either to slow uptake or to non-disclosure; investor intelligence should track the Nivesh Mitra portal for post-January-2026 results.',
            'IITGNL is one of several townships competing for the same investment around the upcoming Jewar airport, and the long-term PPP / land-monetisation model leaves some uncertainty over later phases.',
          ] },
        ],
        sources: [
          { label: 'NICDC — IITGNL node page', url: 'https://www.nicdc.in/projects/national-industrial-corridor-development-programme/integrated-industrial-township-greater-noida-uttar-pradesh' },
          { label: 'PIB — 12 new industrial smart cities (PRID 2081537)', url: 'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2081537' },
          { label: 'Moneycontrol — IITGNL e-auction allottees', url: 'http://livecms.moneycontrol.com/business/real-estate/greater-noida-authority-land-allotment-to-bring-in-rs-400-cr-investment-10194141.html' },
          { label: 'IITGNL — allotment scheme notice', url: 'https://www.iitgnl.com/gnl-announceDetails/oTz0jUIcPWaq8Z2IH14xamP9pYv1qHHtzhjVjqf47qHNi9XwtAnOg6ZVMMeHzQemSYQAkf9lZGMk6aj-X3xhtA__' },
          { label: 'Times of India — e-LMS revamp (Feb 2026)', url: 'https://timesofindia.indiatimes.com/city/noida/dmic-integrated-industrial-township-greater-noida-limited-to-revamp-e-allotment-of-land-in-integrated-industrial-hub/articleshow/128273933.cms' },
        ],
      },
      {
        slug: 'vikram-udyogpuri', name: 'Vikram Udyogpuri', state: 'Madhya Pradesh', stage: 'operational',
        statusLabel: 'Phase 1 near full — 20+ units producing, Medical Devices Park', coords: [150, 285],
        areaAc: 1100, investmentCr: 5000,
        sectors: 'Medical devices, food processing, pharma & biotech, automobiles, textiles, electronics (ESDM)',
        nearest: 'Near Ujjain; SH-18 and the Ujjain–Dewas railway line; within the Pithampur–Dhar–Mhow Investment Region',
        developer: 'DMIC Vikram Udyogpuri Ltd, incorporated 2010; NICDIT (Centre) + Govt of Madhya Pradesh / MPIDC; AECOM project-management consultant',
        epc: 'Phase 1 trunk infrastructure 98.27% complete (Dec 2020) and operational; 5.2 MLD CETP (~₹24.6 cr); Phase 2 (400+ ha) land acquired Jan 2025, DPR pending',
        companies: [
          { name: 'AMUL (Panchmahal Co-op Milk Union)', sector: 'Dairy / food processing', commitment: 'Operational — the node’s anchor investor [V]' },
          { name: 'PepsiCo India Holdings', sector: 'Beverage-flavouring ingredients', commitment: '₹1,225–1,266 cr · ~22 ac · 2,000 jobs — under construction, operational by ~Q1 2026; largest single named investor [V]' },
          { name: 'Haier Appliances', sector: 'Consumer electronics / white goods', commitment: 'Operational (Chinese JV) [V]' },
          { name: 'Inox Air Products', sector: 'Industrial gases', commitment: 'Operational (among the first ~20 units) [V]' },
          { name: 'Ashirvad Pipes', sector: 'Pipes / manufacturing', commitment: 'Allotted / under construction [V]' },
          { name: 'Karnataka Antibiotics / Srinivas Pharma / Symbiotic Life', sector: 'Pharma & biotech', commitment: 'Allotted [V]' },
          { name: 'Yashoda Linen', sector: 'Textiles', commitment: 'Allotted [V]' },
          { name: 'CliniSupplies / VRM / HC Lifeline / KRM / Microgen / Bioline (Medical Device Park)', sector: 'Medical devices', commitment: 'Part of ₹254 cr · 2,400 jobs — 8 units set to begin operations 2026 [V]' },
          { name: 'LTI Mindtree', sector: 'IT services', commitment: '₹500 cr — MoU [V1]' },
          { name: 'South Korean EDC', sector: 'Cancer-detection kits (Medical Device Park)', commitment: '₹207 cr — MoU [V1]' },
        ],
        industries: ['Medical devices', 'Food processing & dairy', 'Pharmaceuticals & biotech', 'White goods / electronics', 'Textiles', 'Engineering & industrial machinery'],
        infrastructure: [
          'Phase 1 ~1,100 ac (458 ha) nearly full (~46 ac left as of Sep 2024), including a dedicated 350-ac Medical Devices Park; Phase 2 of 400+ ha acquired Jan 2025 for ~35 firms seeking ~800 ac.',
          'Phase 1 trunk infrastructure reached 98.27% physical progress (Dec 2020) and is operational; 5.2 MLD CETP; assured 24x7 power; land base ~₹0.86 cr/acre.',
          'Water supply agreement with the Narmada Valley Development Authority; environmental clearance obtained; single-window clearance including environmental approvals.',
        ],
        incentives: 'Madhya Pradesh industrial policy benefits (capital subsidy, sector incentives for food processing, pharma, textiles, electronics); central-India location for pan-India distribution; NIPER Ahmedabad technical-support MoU for the Medical Devices Park. Specific subsidy / SGST rates not detailed in the node sources.',
        summary: [
          'Vikram Udyogpuri is the most fully realised DMIC node in the open-source record: Phase 1 (~1,100 ac) is nearly full with 67 industries allotted, 20-plus already in production, and cumulative committed investment above ₹5,000 cr. AMUL is the operational anchor and PepsiCo (₹1,225–1,266 cr, 2,000 jobs) is the largest single named investor, with the figure corroborated across multiple sources.',
          'Its differentiator is a dedicated 350-acre Medical Devices Park — unique among DMIC nodes — where eight manufacturers (CliniSupplies, VRM, HC Lifeline, KRM, Microgen, Bioline and others) are set to launch in 2026 against ~₹254 cr of investment and 2,400 jobs, backed by a NIPER Ahmedabad technical MoU.',
          'Demand has outrun supply: with 200-plus proposals pending and ~₹50,000 cr in the pipeline, MPIDC acquired 400+ ha for Phase 2 in January 2025 and has logged ~₹8,000 cr of fresh intents — though the Phase 2 DPR is still to be prepared and the full 67-name allottee list and employment figures are not public.',
        ],
        timeline: [
          { date: '2010', label: 'DMIC Vikram Udyogpuri Ltd incorporated' },
          { date: 'Dec 2020', label: 'Phase 1 trunk infrastructure 98.27% complete' },
          { date: 'Mar 2024', label: 'Regional Industry Conclave MoUs (PepsiCo, LTI Mindtree, EDC)' },
          { date: 'Jan 2025', label: 'MPIDC acquires 400+ ha for Phase 2' },
          { date: 'Oct–Nov 2025', label: '~₹8,000 cr fresh intents from ~35 firms' },
          { date: '2026', label: '17 units (9 main + 8 Medical Device Park) set to begin operations' },
        ],
        sections: [
          { heading: 'An operational node with real production', body: [
            'Unlike Dholera (pre-operational) or IITGNL (limited disclosure), Vikram Udyogpuri has moved past MoUs into commercial production — 20-plus units running, 67 allottees, and Phase 1 nearly sold out. AMUL anchors food processing, Haier and Inox Air Products are operational, and PepsiCo’s ₹1,225–1,266 cr beverage-ingredients plant (2,000 jobs) is the largest single confirmed investment, due on stream around early 2026.',
          ] },
          { heading: 'The Medical Devices Park', body: [
            'The 350-acre Medical Devices Park is the node’s signature asset and has no equal among DMIC nodes. Eight manufacturers — CliniSupplies (catheters), VRM (nuclear medicines), HC Lifeline (syringes/cannulas), KRM, Microgen, Meepl, Shreeji Polymers and Bioline — are set to begin operations in 2026 on ~₹254 cr of investment and 2,400 jobs, with NIPER Ahmedabad providing technical support. A South Korean EDC cancer-kit MoU (₹207 cr) adds to the cluster.',
          ] },
          { heading: 'Phase 2 and open questions', body: [
            'Demonstrated demand — 200-plus proposals, ~₹50,000 cr pipeline — drove the January 2025 acquisition of 400+ ha for Phase 2 (₹475 cr land cost, ~₹8,000 cr of intents from ~35 firms). The Phase 2 DPR and construction timeline are still to be set.',
            'Disclosure remains partial: only about nine of the 67 Phase 1 allottees are publicly named, and the node’s projected employment figure is not published.',
          ] },
        ],
        sources: [
          { label: 'NICDC — Vikram Udyogpuri node page', url: 'https://nicdc.in/projects/4-projects-developed/integrated-industrial-township-vikram-udyogpuri' },
          { label: 'ET Infra — MPIDC acquires 400 ha for Phase 2', url: 'https://infra.economictimes.indiatimes.com/news/urban-infrastructure/mpidc-acquires-400-ha-to-develop-vikram-udyogpuri-phase-2/117038761' },
          { label: 'Times of India — investment proposals at Vikram Udyogpuri', url: 'https://timesofindia.indiatimes.com/city/indore/industries-line-up-investment-proposals-at-vikram-udyogpuri/articleshowprint/125004701.cms' },
          { label: 'Patrika — 17 factories launching 2026 (named units)', url: 'https://www.patrika.com/en/ujjain-news/ujjain-rs-1700-crore-investment-to-launch-17-factories-in-2026-over-4000-jobs-expected-20441982' },
          { label: 'The Economic Times — 20 companies begin DMIC operations', url: 'http://widget.economictimes.indiatimes.com/news/india/twenty-companies-begin-operations-from-delhi-mumbai-industrial-corridor-cities/articleshow/106301604.cms' },
        ],
      },
      {
        slug: 'nangal-chaudhary-imlh', name: 'IMLH Nangal Chaudhary', state: 'Haryana', stage: 'construction',
        statusLabel: 'Phase I trunk-infra under development — logistics hub, no manufacturing tenants', coords: [152, 232],
        areaAc: 886, projectCostCr: 1029, investmentCr: 47480, jobs: 10000,
        sectors: 'Multi-modal logistics, EXIM, warehousing, freight consolidation, cold storage',
        nearest: 'Nizampur railway station ~1.6 km; New Dabla DFC station ~12 km; NH-11 ~12 km; Delhi airport ~140 km',
        developer: 'NICDC Haryana Multi Modal Logistic Hub Project Ltd (formerly DMIC Haryana MMLH), incorporated 2016; 50:50 NICDIT : HSIIDC; PPP concession model',
        epc: 'Phase I trunk-infrastructure EPC under way (DPIIT Secretary review Apr 2026); PPP concessionaire not yet awarded',
        companies: [
          { name: 'No manufacturing allottees', sector: 'Logistics hub (PPP model)', commitment: 'None disclosed — tenants will be logistics operators / warehouse / EXIM users once the PPP concession is awarded [U]' },
        ],
        industries: ['Multi-modal logistics & freight transfer', 'Warehousing & cold storage', 'EXIM / customs-clearance zone', 'Container freight stations', 'Third-party logistics'],
        infrastructure: [
          '886 ac freight village positioned as India’s largest logistics hub south of NCR, adjacent to the Western Dedicated Freight Corridor.',
          'Components: rail-connectivity zone, container stacking, warehousing, transport zone, EXIM zone and commercial areas; New Dabla DFC station ~12 km, Nizampur station ~1.6 km, NH-11 ~12 km.',
          'AIIB has proposed financing as part of DMIC; Phase I land cost was ~₹266 cr for the 886 ac (an acquisition cost, not an allotment price); Phase II to be reappraised by 2028.',
        ],
        incentives: 'Developed on PPP mode — concession terms for logistics operators will follow the concessionaire award; strategic WDFC adjacency and a single-point logistics offering are the principal draws. HSIIDC is the state nodal agency. Specific Haryana fiscal incentives for the node not detailed in the sources.',
        summary: [
          'IMLH Nangal Chaudhary is a logistics-first node — a freight village for rail-road transfer, warehousing, customs and EXIM cargo — not a manufacturing destination, so it is not expected to host named industrial tenants. Approved by CCEA in May 2018 (Phase I trunk cost ₹1,029.49 cr) on 886 ac in Mahendragarh district, it is positioned as India’s largest logistics hub south of NCR, adjacent to the Western Dedicated Freight Corridor.',
          'As of April 2026 the project is in active Phase I trunk-infrastructure construction — the DPIIT Secretary reviewed external connectivity, internal rail and the proposed EXIM/warehousing/container facilities on 30 April 2026 — but it is well behind the original 2020-21 completion target.',
          'No tenants or operators have been announced because the PPP concession has not yet been awarded; until the concessionaire is appointed the ~₹47,480 cr projected investment remains a potential, realised mostly once private operators build facilities. The catchment it will serve includes Manesar, Bawal, Dharuhera and East Rajasthan.',
        ],
        timeline: [
          { date: '2016', label: 'SPV incorporated (then DMIC Haryana MMLH)' },
          { date: 'May 2018', label: 'CCEA approval (Phase I trunk cost ₹1,029.49 cr)' },
          { date: 'Dec 2024', label: 'PIB classes it under projects under development' },
          { date: 'Apr 2026', label: 'DPIIT Secretary reviews Phase I progress' },
          { date: '2028', label: 'Phase II reappraisal due' },
        ],
        sections: [
          { heading: 'A logistics node, not a manufacturing one', body: [
            'The defining feature of Nangal Chaudhary is that it is a multi-modal logistics hub developed on a PPP concession — so it allots concession rights to logistics operators, warehouse providers and EXIM users rather than land to manufacturers. That is why, unlike Dholera or Vikram Udyogpuri, it has no named tenant list, and its exclusion from the four-node land-allotment cohort is expected, not a gap.',
            'Its strategic value is location: adjacent to the WDFC with the New Dabla DFC station ~12 km away, designed to serve the Manesar–Bawal–Dharuhera industrial belts and East Rajasthan, and to act as the logistics gateway for the IMC Hisar node ~189.5 km away.',
          ] },
          { heading: 'Status and the PPP question', body: [
            'Phase I trunk-infrastructure EPC is under way and was reviewed by the DPIIT Secretary in April 2026, but completion has slipped far beyond the original 2020-21 target. The single biggest unknown is the PPP concession: no information is public on the bidding, selection or award, and the tenant/operator base cannot form until that concludes.',
          ] },
          { heading: 'Risks & open questions', body: [
            'Timeline slippage is the headline risk, alongside competition for the same NCR freight traffic from the MMLH Dadri + MMTH Boraki hub in Greater Noida.',
            'Environmental-clearance status was not confirmed in the sources, the 2018 projection of 10 million TEUs by 2025 is likely dated, and the logistics-plot allotment price (versus the ~₹30 lakh/acre land-acquisition cost) is not published.',
          ] },
        ],
        sources: [
          { label: 'NICDC — IMLH Nangal Chaudhary node page', url: 'https://nicdc.in/projects/4-projects-nearing-completion/integrated-multi-modal-logistics-hub-nangal-chaudhary' },
          { label: 'PIB — DPIIT Secretary review (PRID 2257374)', url: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2257374' },
          { label: 'PIB — CCEA approval (PRID 1532272)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1532272' },
          { label: 'PIB — 12 new industrial smart cities (PRID 2081537)', url: 'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2081537' },
          { label: 'ANI — eight NICDIT projects (parliamentary, Feb 2023)', url: 'https://www.aninews.in/news/national/general-news/eight-projects-under-nicdit-sanctioned-and-approved-by-government20230209051445/' },
        ],
      },
      {
        slug: 'dadri-boraki', name: 'MMLH Dadri + MMTH Boraki', state: 'Uttar Pradesh', stage: 'construction',
        statusLabel: 'PPP procurement — NCR’s largest logistics hub, at the DFC confluence', coords: [173, 206],
        areaAc: 1209, projectCostCr: 4034, investmentCr: 115092, jobs: 100000,
        sectors: 'Multi-modal logistics & transport, warehousing & distribution, cold chain, EXIM cargo, value-added services',
        nearest: 'Eastern Peripheral Expressway ~5 km; Noida–Greater Noida Expressway ~9 km; Delhi airport ~60 km; Jewar airport ~40 km',
        developer: 'DMIC Integrated Industrial Township Greater Noida Ltd (DMIC IITGNL); promoters NICDIT (GoI) + GNIDA (UP); shareholding not disclosed',
        epc: 'PPP concessionaire tender bids closed 9 Feb 2026, evaluation ongoing (45-yr concession); internal rail-siding EPC under finalisation; external connectivity by state agencies',
        companies: [
          { name: 'No anchor tenants', sector: 'Logistics & transport hub (PPP model)', commitment: 'None disclosed — project pre-concessionaire; tenants follow concession award [U]' },
          { name: 'Eight unnamed firms (adjacent IITGNL, ~5 km)', sector: 'Non-polluting industries', commitment: '~₹3,936 cr · 168 ac · ~12,000 jobs — allotted in the adjacent Integrated Industrial Township, not within MMLH/MMTH [V1]' },
        ],
        industries: ['Third-party logistics (3PL/4PL)', 'Container freight stations', 'Cold chain & perishables', 'E-commerce fulfilment', 'Automotive & pharma logistics'],
        infrastructure: [
          '~1,209 ac combined (849 ac MMLH Dadri + 360 ac MMTH Boraki) at the confluence of the Eastern and Western Dedicated Freight Corridors — a dry port with warehousing and customs.',
          'Phase I capacity ~0.74M TEUs + 6.7M tonnes bulk, 3M sqft warehousing and 0.3M sqft cold storage (expandable to 12.5M / 1.2M sqft); 5 km from the Eastern Peripheral Expressway, ~40 km from Jewar airport.',
          'Land in SPV possession 227.48 ha; environmental clearance granted 24 Apr 2023; MoUs executed with DFCCIL (rail connectivity) and the Ministry of Railways (MMTH); a 1.8 km elevated metro link to MMTH approved.',
        ],
        incentives: '45-year PPP concession with a Minimum Guaranteed Revenue share to NICDC; government-provided land, rail-yard, external connectivity and power (~₹2,337 cr); a 2-year promoter equity lock-in and 10-year technical-capacity window to attract experienced bidders. UP/UPSIDA incentives via Nivesh Mitra. Node-specific land rates not published.',
        summary: [
          'MMLH Dadri and MMTH Boraki together form NCR’s largest integrated logistics project — ~1,209 acres (849 ac logistics hub + 360 ac transport hub) at the unique confluence of the Eastern and Western Dedicated Freight Corridors. Approved by the Union Cabinet in December 2020, the government-infrastructure cost is ₹4,034 cr (news sources cite ₹5,881–5,942 cr inclusive of PPP), against a projected investment potential of ₹1,15,092 cr and 100,000 jobs.',
          'The project is in the PPP-procurement phase: concessionaire bids closed on 9 February 2026 and are under evaluation, with land transfer and a 24 April 2023 environmental clearance complete and internal rail-siding works being finalised. As a pre-concessionaire dry port, it has no disclosed anchor tenants or MoUs — the tenant list forms after the concessionaire is appointed.',
          'The nearest real allottees sit in the adjacent Integrated Industrial Township (~5 km): eight unnamed non-polluting firms with ~₹3,936 cr and ~12,000 jobs across 168 ac — the demand base the hub will serve, not tenants of the hub itself.',
        ],
        timeline: [
          { date: 'Dec 2020', label: 'Union Cabinet approval' },
          { date: 'Apr 2023', label: 'Environmental clearance granted (SEIAA UP)' },
          { date: '2025', label: 'Master Plan 2041 inclusion; MMTH alignment routes finalised' },
          { date: 'Feb 2026', label: 'PPP concessionaire bids closed (9 Feb), evaluation ongoing' },
        ],
        sections: [
          { heading: 'A dry port at the DFC confluence', body: [
            'The node’s defining advantage is geography: it sits where the Eastern and Western Dedicated Freight Corridors meet, making it a natural dry port for the NCR. Phase I is sized at ~0.74M TEUs plus 6.7M tonnes of bulk, 3M sqft of warehousing and 0.3M sqft of cold storage, expandable severalfold, with customs-bonded warehousing and value-added services (cross-docking, labelling, packaging).',
            'It is developed by DMIC IITGNL — the same SPV behind the adjacent industrial township — as a 45-year PPP concession, with government providing land, rail yard, external connectivity and power.',
          ] },
          { heading: 'Pre-concessionaire status', body: [
            'With concessionaire bids only closing in February 2026, no operator or tenant has been named, and the ₹1.15 lakh crore investment potential is a long-run projection rather than committed pipeline. Land (227.48 ha) is transferred to the SPV, environmental clearance is in hand (Apr 2023), and rail MoUs with DFCCIL and the Ministry of Railways are executed.',
          ] },
          { heading: 'Risks & open questions', body: [
            'Residual land acquisition (~83 ha under LARR, ~23 ha under the Railways Act) and external water/power works are still in progress, and the project depends on the Jewar airport timeline for air-cargo integration.',
            'Node-level land prices, SGST rates, the SPV shareholding ratio and the concessionaire-selection result are all not yet public — and it competes directly with IMLH Nangal Chaudhary for the same NCR freight traffic.',
          ] },
        ],
        sources: [
          { label: 'NICDC — MMLH/MMTH Dadri-Boraki node page', url: 'https://nicdc.in/projects/4-projects-nearing-completion/multi-modal-logistics-and-transport-hub-dadri-greater-noida-up' },
          { label: 'NICDC DMU Report (April 2023) — land/EC status', url: 'https://nicdc.in/images/documents/DMU_Report_April_2023.pdf' },
          { label: 'Financial Express — Cabinet approval (Dec 2020)', url: 'https://www.financialexpress.com/business/infrastructure-union-cabinet-approves-multi-modal-logistics-hub-details-2160857/' },
          { label: 'Hindustan Times — PPP tender / Phase I capacities', url: 'https://www.hindustantimes.com/cities/noida-news/greater-noida-work-set-to-begin-soon-on-multi-modal-logistics-hub-101762714432156.html' },
          { label: 'ET Infra — 8 firms in adjacent IIT (₹3,936 cr)', url: 'https://infra.economictimes.indiatimes.com/news/railways/rail-track-plan-almost-ready-work-on-logistics-hub-may-start-this-yr/100294942' },
        ],
      },
      {
        slug: 'jodhpur-pali-marwar', name: 'Jodhpur–Pali–Marwar (JPMIA)', state: 'Rajasthan', stage: 'construction',
        statusLabel: 'Phase-A trunk infra under way — large MSME-led node, no allottees yet', coords: [114, 245],
        areaAc: 38140, projectCostCr: 922, investmentCr: 7500, jobs: 40000,
        sectors: 'Manufacturing & MSME, solar components, handicrafts & textiles, furniture, agro-processing, heavy engineering, logistics',
        nearest: 'Rohat railway station within site; Marwar WDFC station ~60 km; Jodhpur airport ~30 km; ~30 km from Jodhpur',
        developer: 'Rajasthan Industrial Corridors Development Corporation Ltd (RIICO 51% : NICDIT 49%); Department of DMIC, Govt of Rajasthan is state nodal agency',
        epc: 'Phase-A (1,578 ac) trunk-infrastructure tenders issued (~₹465 cr + ~₹200 cr planned); NH-65 underpass nearing completion (~Mar 2026); Luni–Rohat–Marwar line doubling under way; Phase-B/C land acquisition ongoing',
        companies: [
          { name: 'No allottees at JPMIA', sector: 'Industrial node (Phase-A trunk infra)', commitment: 'None disclosed — land transferred to RIICO, not yet to private firms [U]' },
          { name: 'Regional base (not in-node)', sector: '21 RIICO estates, ~24,388 registered units (Jodhpur district)', commitment: 'Existing legacy base the node will integrate — handicrafts (500+ units, ~200,000 jobs), 1,192 agro units, ~150 stainless-steel re-rolling units [V]' },
        ],
        industries: ['Handicrafts & textiles', 'Solar-component manufacturing', 'Agro-processing & food', 'Stainless steel & engineering', 'Mineral-based industries', 'Logistics & warehousing'],
        infrastructure: [
          'Notified area 154.37 sq km (~38,140 ac); urbanisable area 64.62 sq km (~15,967 ac), of which the master plan earmarks ~32.66% industrial; Phase-A is 1,578 ac.',
          'Rohat station within site, Marwar WDFC station ~60 km, Jodhpur airport ~30 km; a multi-modal logistics hub planned on ~280 ha within the node.',
          'Water requirement 110 MLD (60 potable + 50 industrial) from the Indira Gandhi Nahar Pariyojana via the RGLC; environmental clearance granted 14 Jul 2017; NH-65 underpass and Luni–Rohat–Marwar line doubling under construction.',
        ],
        incentives: 'Rajasthan Investment Promotion Scheme (RIPS, Sep 2024) — flexible land payment (25% upfront + 75% over 10 instalments at 8%), power-cost incentives for high-energy industries, MSME interest exemption, 5× super-incentive above ₹3,000 cr, 100% SGST reimbursement for women-run startups; DFC freight benefits (~40% lower than road, 24-hour Delhi–Mumbai transit).',
        summary: [
          'JPMIA is the larger of Rajasthan’s two DMIC nodes — a notified 154.37 sq km (~38,140 ac) in Pali district, with a 64.62 sq km urbanisable core and a 1,578-ac Phase-A — pursued as a long-horizon, MSME-heavy industrial area rather than a single-anchor mega-project. The Union approved ₹922 cr for Phase-A (₹322.80 cr equity + ₹105 cr soft loan), with investment potential cited at ₹7,500 cr (NICDC) to ₹19,000 cr (press) and jobs of 40,000 to 300,000.',
          'The project is in active land-acquisition and trunk-infrastructure development: ₹465 cr of civil-works tenders are out (a further ₹200 cr planned), the NH-65 underpass is nearing completion and the Luni–Rohat–Marwar line is being doubled, while Phase-B and Phase-C land acquisition advances. No named anchor tenants or MoUs have been disclosed — land has been transferred to RIICO, not yet to private firms.',
          'JPMIA’s real strength is its legacy base: 21 RIICO estates and ~24,388 registered units in Jodhpur district, including 500-plus handicraft units employing ~200,000 people, ~1,192 agro-units and ~150 stainless-steel re-rolling units — the clusters the node is designed to formalise and scale around solar, textiles and agro-processing.',
        ],
        timeline: [
          { date: 'Jul 2017', label: 'Environmental clearance granted' },
          { date: 'Sep 2024', label: 'RIPS incentive scheme approved by Rajasthan Cabinet' },
          { date: '2025', label: '₹922 cr Phase-A approved; 1,578 ac transferred to RIICO; ₹465 cr tenders issued' },
          { date: '~Mar 2026', label: 'NH-65 underpass nearing completion; Phase-B/C acquisition advancing' },
          { date: '2042', label: 'Full build-out horizon (1,200+ target units)' },
        ],
        sections: [
          { heading: 'A long-horizon MSME node', body: [
            'JPMIA is conceived for breadth, not a marquee anchor: a notified 154.37 sq km master-planned for manufacturing, solar components, handicrafts, textiles, furniture, agro-processing and heavy engineering, with a 2042 build-out target of 1,200-plus units. Its design leans on the dense Jodhpur–Pali artisan economy rather than importing a single mega-investor.',
            'Connectivity is the pitch to industry: the Rohat station sits within the site, the Marwar WDFC station is ~60 km away, and a ~280 ha multi-modal logistics hub is planned inside the node, with RIICO citing ~40% lower freight and 24-hour Delhi–Mumbai transit via the DFC.',
          ] },
          { heading: 'The legacy base it will formalise', body: [
            'The node’s ready-made demand sits in the surrounding district: 21 RIICO estates (~2,080 ac, mostly full), ~24,388 registered units, 500-plus handicraft export units employing ~200,000 people, ~1,192 agro-based units and a ~150-unit stainless-steel re-rolling cluster. JPMIA’s opportunity is to give these clusters modern, DFC-connected land — handicrafts/textiles and agro-processing are the highest-fit immediate sectors.',
          ] },
          { heading: 'Risks & open questions', body: [
            'Land acquisition is the gating risk — total requirement ~3,604 ha, with only ~641 ha acquired and ~1,086 ha in final stage — alongside delivering 110 MLD of water from the IGNP/RGLC.',
            'No allottees or MoUs are disclosed; the SPV’s incorporation date, shareholding detail, plot sizes and land price per acre, and Phase-B/C timelines are all not yet public.',
          ] },
        ],
        sources: [
          { label: 'NICDC — JPMIA node page', url: 'https://nicdc.in/projects/12-new-projects/jodhpur-pali-marwar-rajasthan' },
          { label: 'ET Government — JPMIA ₹922 cr for Phase-A', url: 'https://government.economictimes.indiatimes.com/news/governance/jodhpur-pali-marwar-industrial-area-receives-922-crore-for-development/125828883' },
          { label: 'Times of India — PM review / ₹465 cr tenders', url: 'https://timesofindia.indiatimes.com/city/jaipur/pm-to-review-jodhpur-pali-marwar-smart-industrial-township-on-aug-27/articleshow/123439212.cms' },
          { label: 'NICDC — JPMIA EC compliance (area, water)', url: 'https://nicdc.in/phocadownload/JPMIA_EC_Compliance_Oct,2021_to_March_2022.pdf' },
          { label: 'JPMIA Master Plan 2042 (legacy clusters)', url: 'https://environment.rajasthan.gov.in/content/dam/industries/dmic/pdf/Final%20JPMIA/JPMIA%20MASTER%20PLAN-2042.pdf' },
        ],
      },
      {
        slug: 'khushkhera-bhiwadi-neemrana', name: 'Khushkhera–Bhiwadi–Neemrana (KBNIR)', state: 'Rajasthan', stage: 'approved',
        statusLabel: 'Master-planning stage — project cost not yet approved, strong legacy belt', coords: [160, 222],
        areaAc: 40920, jobs: 550000,
        sectors: 'Electronics, automotive & auto components, pharmaceuticals, bio-tech, ICT, metal products, textiles',
        nearest: 'On NH-8 in Alwar district; adjoins the Manesar–Bawal Investment Region (Haryana); Delhi airport ~100 km; planned 24 sq km aerotropolis within the region',
        developer: 'Rajasthan Industrial Corridors Development Corporation Ltd (NICDIT + Govt of Rajasthan / RIICO-BIP); master-planning consortium led by Kuiper Compagnons (Holland)',
        epc: 'Not yet initiated — project cost not approved by the Union Government as of Apr 2023 (only ₹4.9 cr released for SPV incorporation); proposed under the Centre’s Bhavya scheme in Apr 2026',
        companies: [
          { name: 'No KBNIR-node allottees', sector: 'Investment region (master-planning stage)', commitment: 'None disclosed — land-acquisition notifications issued, but no allotment to private firms in the core node [U]' },
          { name: 'Honda Motors', sector: 'Automobile manufacturing', commitment: 'Operational — ~400-ac facility near Khushkhera (existing belt, not a KBNIR-node allotment) [V1]' },
          { name: 'Saint-Gobain / Jaquar / Relaxo / Dr. Oetker', sector: 'Glass, sanitaryware, footwear, food processing', commitment: 'Operational in the Bhiwadi belt within the KBNIR influence zone (legacy base) [V1]' },
          { name: 'Japanese Zone, Neemrana', sector: 'Auto ancillaries / electronics', commitment: '~1,100 ac for Japanese companies under an India–Japan MoU (existing) [V1]' },
        ],
        industries: ['Automotive & auto components', 'Electronics manufacturing', 'Pharmaceuticals', 'Metal products & engineering', 'Textiles', 'Logistics & warehousing'],
        infrastructure: [
          'Delineated area 165.6 sq km (~40,920 ac) across 42 villages; urbanisable ~101 sq km; land use ~17% industrial / 14% residential; Phase 1A notifications issued (Section 4 ~15.06 sq km, Section 6 ~1,425.36 ha).',
          'NH-8 through the region with a 500 m green buffer; planned 24 sq km aerotropolis (~₹4,000 cr); a proposed 50 km Neemrana–Bhiwadi road link; an RRTS connection to the Delhi–Alwar line.',
          'Full build-out demand of 380 MLD water (Delhi Jal Board indicated 40–50 MGD from Okhla) and 4,404 MW peak power (170 MW solar within the region); existing Shahjahanpur, Neemrana, EPIP Neemrana and Bhiwadi estates sit inside or adjacent.',
        ],
        incentives: 'Proposed under the Centre’s Bhavya scheme (Apr 2026) to accelerate development; RIPS state incentives (flexible land payment, power-cost incentives, 5× super-incentive above ₹3,000 cr) apply state-wide; an SPV and substantial state land parcels are already in place. Node-specific incentives and land price not published.',
        summary: [
          'KBNIR is Rajasthan’s first DMIC node and its largest by delineated area — 165.6 sq km (~40,920 ac) across 42 villages along the Rajasthan–Haryana border in Alwar district — but it is the least advanced of the DMIC nodes in execution. As of the most recent official source (April 2023), the Union Government had not approved its project cost; only ₹4.9 cr had been released for SPV incorporation, against a sibling node (JPMIA) that secured ₹922 cr.',
          'The project remains in master-planning: environmental clearance was granted in July 2014, Phase 1A land-acquisition notifications are issued, and a Kuiper Compagnons-led consortium has master-planned a 558 ha tranche — but EPC has not begun and no anchor tenants or MoUs have been disclosed for the core node. In April 2026 Rajasthan proposed KBNIR under the Centre’s Bhavya scheme to revive momentum.',
          'What makes KBNIR attractive is the industrial belt already wrapped around it: Honda Motors’ ~400-ac plant near Khushkhera, the ~1,100-ac Japanese Zone at Neemrana, and Saint-Gobain, Jaquar, Relaxo and Dr. Oetker among the ~4,000 industries in the Bhiwadi cluster. These are legacy operations, not KBNIR-node allotments, but they give the node an immediate automotive-and-electronics gravity once funding is approved.',
        ],
        timeline: [
          { date: 'Jul 2014', label: 'Environmental clearance granted' },
          { date: '2013', label: 'Phase 1A Section 6 notification (1,425.36 ha)' },
          { date: 'Apr 2023', label: 'Lok Sabha: project cost still not approved; ₹4.9 cr released for SPV' },
          { date: 'Apr 2026', label: 'Rajasthan proposes KBNIR under the Bhavya scheme' },
        ],
        sections: [
          { heading: 'Furthest behind on execution', body: [
            'Despite being a Phase-1 DMIC node with environmental clearance since 2014, KBNIR has not cleared the funding gate: its project cost was still unapproved by the Centre as of April 2023, with only ₹4.9 cr released to incorporate the SPV. The SPV (Rajasthan Industrial Corridors Development Corporation Ltd, shared with JPMIA) is now in place, and a Kuiper Compagnons consortium has master-planned a 558 ha area, but no trunk-infrastructure EPC has begun.',
            'The April 2026 proposal to bring KBNIR under the Centre’s Bhavya scheme is the clearest sign of intent to revive it — leaning on an existing SPV and substantial state land parcels for faster execution.',
          ] },
          { heading: 'A strong existing belt', body: [
            'The node’s value proposition is the ready industrial gravity around it. Honda Motors runs a ~400-ac plant near Khushkhera; the Neemrana Japanese Zone (~1,100 ac under an India–Japan MoU) hosts auto ancillaries and electronics; and the Bhiwadi cluster — ~4,000 industries including Saint-Gobain, Jaquar, Relaxo and Dr. Oetker — sits within the influence zone. These are legacy operations rather than KBNIR allotments, but they make automotive and electronics the highest-fit sectors when the node is funded.',
          ] },
          { heading: 'Risks & open questions', body: [
            'The central risk is approval: until the Union clears KBNIR’s project cost, funding release and construction cannot start. Water (380 MLD full build-out, dependent on a Delhi Jal Board agreement) and 4,404 MW of power are large unmet requirements.',
            'No allottees or MoUs exist for the core node, and land price, plot sizes, the SPV shareholding ratio, and the aerotropolis and RRTS timelines are all unresolved.',
          ] },
        ],
        sources: [
          { label: 'Lok Sabha Unstarred Q No. 5417 — KBNIR cost not approved', url: 'https://sansad.in/getFile/loksabhaquestions/annex/1711/AU5417.pdf?source=pqals' },
          { label: 'MoEF&CC EC Minutes — area, land use, EC (Jul 2014)', url: 'http://environmentclearance.nic.in/writereaddata/Form-1A/Minutes/0_0_81122121712121136finalminutes.pdf' },
          { label: 'Business Standard — KBNIR belt (Honda, Japanese Zone, Bhiwadi)', url: 'https://www.business-standard.com/industry/news/strategic-location-significant-investments-an-expressway-to-industries-124042100681_1.html' },
          { label: 'ITU — DMIC presentation (KBNIR overview, aerotropolis)', url: 'https://www.itu.int/en/ITU-D/Regional-Presence/AsiaPacific/Documents/DMIC%20Presentation.pdf' },
          { label: 'Times of India — RIICO sales / KBNIR to be operationalised 2026', url: 'https://timesofindia.indiatimes.com/city/jaipur/riico-sells-plots-worth-rs-4k-cr-riding-on-rr-mou-demand/articleshow/126661266.cms' },
        ],
      },
      {
        slug: 'dighi-port', name: 'Dighi Port Industrial Area (DPIA)', state: 'Maharashtra', stage: 'construction',
        statusLabel: 'EPC under way — port-led node anchored by a Ramky life-sciences park', coords: [107, 358],
        areaAc: 6056, projectCostCr: 5468, investmentCr: 38000, jobs: 114183,
        sectors: 'Port-linked manufacturing, engineering, pharmaceuticals, chemicals, textiles, food processing, logistics',
        nearest: 'NH-66 (Mumbai–Goa) ~10 km; Dighi Port 26–55 km; Konkan Railway; ~117 km from Mumbai; Navi Mumbai International Airport upcoming',
        developer: 'Maharashtra Industrial Township Ltd (MITL, formerly AITL) — also the AURIC SPV; equity by NICDIT (GoI, ₹1,543 cr) + Govt of Maharashtra',
        epc: 'Phase-1 trunk-infrastructure EPC awarded to Ramky Infrastructure (₹1,401.84 cr, 930 days + 4-yr O&M) Mar 2026; trunk infra targeted within 3 years of Aug 2024; tender-process irregularity allegations pending',
        companies: [
          { name: 'Maha Integrated Life Sciences City (MILeS City), a Ramky Infrastructure subsidiary', sector: 'High-tech pharma / life-sciences park (1,000 ha)', commitment: '~₹3,000 cr — 95-year concession (incl. 5-yr construction) signed with MIDC, Mar 2026 [V]' },
          { name: 'Ramky Infrastructure Ltd', sector: 'Trunk-infrastructure EPC (Phase-1, Parcel B)', commitment: '₹1,401.84 cr — EPC contract from MITL (L-1 bidder), Mar 2026 [V]' },
          { name: 'Adani Ports & SEZ (APSEZ)', sector: 'Dighi Port expansion (adjacent, not in-node)', commitment: '~₹42,500 cr — MoU with Maharashtra, Oct 2025; APSEZ operates the port (acquired 2021, ~₹705 cr) [V]' },
          { name: 'No end-user industrial tenants', sector: 'Port-led industrial node', commitment: 'None disclosed — land transferred to MITL, not yet to manufacturers [U]' },
        ],
        industries: ['Port-linked / export manufacturing', 'Pharmaceuticals & life sciences', 'Engineering & heavy engineering', 'Chemicals', 'Food processing', 'Textiles & apparel'],
        infrastructure: [
          '6,056 ac (~2,451 ha) in Roha and Mangaon tehsils of Raigad — nearly 50% (3,005 ac) reserved industrial, the highest industrial share of the DMIC nodes; ~22% open space / waterbodies.',
          'NH-66 ~10 km, NH-753F (Mangaon–Pune) and SH-97 access, Konkan Railway to the DFC and JNPT; Dighi Port (Adani-operated, all-weather, oil/chemicals/container/bulk) 26–55 km; Navi Mumbai airport upcoming.',
          '1,180 ac transferred to the SPV (₹301.04 cr equity released of ₹1,543 cr GoI commitment); environmental clearance granted 17 Oct 2022; AECOM concept master plan (engineering, heavy-industry and food-processing clusters); a multi-modal logistics park proposed to cut logistics cost from 14–16% toward ~9%.',
        ],
        incentives: 'Plug-and-play trunk infrastructure, walk-to-work mixed-use layout and Industry-4.0 positioning; port-led industrialisation with reduced logistics costs for export manufacturing; a proposed multi-modal logistics park. Maharashtra fiscal-incentive specifics for DPIA not detailed in the sources.',
        summary: [
          'Dighi Port Industrial Area is the DMIC’s port-led node and Maharashtra’s second after AURIC — 6,056 ac in Raigad district with nearly half the land (3,005 ac) reserved for industry, the highest industrial share among DMIC nodes. Approved by the Union Cabinet in August 2024 at a ₹5,468 cr cost (₹1,543 cr GoI equity), it carries a ₹38,000 cr investment potential and ~114,000 projected jobs, with environmental clearance already in hand from October 2022.',
          'The node has moved into active EPC construction. In March 2026 Ramky Infrastructure won the ₹1,401.84 cr Phase-1 trunk-infrastructure contract (930-day build plus 4-year O&M), and a Ramky subsidiary, MILeS City, signed a 95-year concession to develop a 1,000-ha high-tech life-sciences/pharma park (~₹3,000 cr) — the node’s first major committed development, though tender-process irregularities have been alleged and are pending.',
          'No end-user manufacturers have been allotted land yet — the project is in the infrastructure-and-concession phase. The headline port story is adjacent rather than in-node: Adani Ports operates Dighi Port (acquired 2021) and signed a ~₹42,500 cr expansion MoU in October 2025, reinforcing the export-manufacturing logic but not constituting an industrial allotment.',
        ],
        timeline: [
          { date: 'Oct 2022', label: 'Environmental clearance granted (5,040 ha)' },
          { date: 'Aug 2024', label: 'Union Cabinet approval (one of 12 nodes)' },
          { date: 'Oct 2025', label: 'APSEZ ₹42,500 cr Dighi Port-expansion MoU' },
          { date: 'Mar 2026', label: 'Ramky EPC contract (₹1,401.84 cr); MILeS City pharma-park concession' },
          { date: '~Aug 2027', label: 'Trunk-infrastructure completion target' },
        ],
        sections: [
          { heading: 'A port-led, pharma-anchored node', body: [
            'DPIA’s differentiator is port linkage — built around the Adani-operated, all-weather Dighi Port to serve export-oriented manufacturing — and the highest industrial land share of any DMIC node (49.62%). Its first committed development is sector-specific: a 1,000-ha high-tech life-sciences and pharma park under a 95-year concession to MILeS City, a Ramky Infrastructure subsidiary (~₹3,000 cr), aligning with Maharashtra’s strong Mumbai–Pune pharma cluster.',
            'The AECOM master plan frames engineering, heavy-industry and food-processing clusters alongside it, and a proposed multi-modal logistics park is intended to pull logistics costs from 14–16% toward ~9%.',
          ] },
          { heading: 'EPC under way, tenants still to come', body: [
            'Construction is genuinely live: Ramky Infrastructure’s ₹1,401.84 cr Phase-1 EPC (roads, water, power, sewerage, ICT) was awarded in March 2026 with a 930-day build, and 1,180 ac is transferred to MITL. But no manufacturers have been allotted land yet — the ₹38,000 cr investment potential is a projection pending the post-infrastructure allotment phase, with first production units realistically 2028–29.',
            'The adjacent ₹42,500 cr Adani port-expansion MoU (Oct 2025) strengthens the export logic but is port infrastructure, not an in-node allotment.',
          ] },
          { heading: 'Risks & open questions', body: [
            'A live risk is governance: a Shiv Sena MLA has alleged irregularities in the ₹1,401 cr EPC tender, with a complaint filed to the CM and an investigation pending as of May 2026.',
            'Remaining land acquisition (~88% complete in 2022, 15 villages affected), the dependency on Dighi Port’s 304-ha reclamation/expansion EIA, and undocumented water and power provisioning are the other open questions; node land prices, plot sizes and the MITL shareholding split for DPIA are not public.',
          ] },
        ],
        sources: [
          { label: 'NICDC — Dighi Port Industrial Area node page', url: 'https://nicdc.in/projects/12-new-projects/dighi-port-ind-area-maharashtra' },
          { label: 'Lok Sabha Unstarred Q No. 2614 — cost, land, EC', url: 'https://sansad.in/getFile/loksabhaquestions/annex/185/AU2614_KgDOB4.pdf?source=pqals' },
          { label: 'UNI India — Ramky Infra ₹1,401.84 cr EPC', url: 'https://uniindia.com/ramky-infra-wins-rs-1-401-84-cr-contract-from-maharashtra-industrial-township-for-dpia-project/business-economy/news/3763555.html' },
          { label: 'Construction World — MIDC–Ramky life-sciences park concession', url: 'https://www.constructionworld.in/policy-updates-and-economic-news/midc-and-ramky-unit-sign-concession-for-life-sciences-park/88234' },
          { label: 'Hindustan Times — APSEZ ₹42,500 cr Dighi Port MoU', url: 'https://www.hindustantimes.com/cities/mumbai-news/maha-signs-42-500-crore-mou-with-adani-for-expansion-of-dighi-port-101761591727740.html' },
        ],
      }
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
        statusLabel: 'VCIC electronics node — operational, with three manufacturing units running', coords: [193, 419],
        areaAc: 801,
        investmentCr: 730,
        jobs: 14803,
        sectors: 'Electronics manufacturing, solar cells & modules, medical electronics, e-mobility, EMS/PCB, garments',
        anchors: 'TechnoDom India (LED TVs), Texana World (garments), AIL Dixon Technologies (surveillance/laptops)',
        nearest: 'Kadapa Airport ~5 km; Krishnapuram railway ~5 km; NH-40/NH-67/NH-716 within ~6 km; Krishnapatnam Port ~256 km (no port linkage)',
        developer: 'APIIC (Andhra Pradesh Industrial Infrastructure Corporation) is the nodal agency — this is an APIIC-led node, not a separate NICDC–State SPV. The 801-acre YSR Electronic Manufacturing Cluster (EMC) sits under MeitY’s EMC-2.0 scheme inside APIIC’s larger ~6,707-acre Kopparthy land holding; the multi-product YSR Jagananna Mega Industrial Hub (3,155 ac) wraps around it.',
        companies: [
          { name: 'TechnoDom India Pvt Ltd (Dubai-based TechnoDom Group)', sector: 'Electronics — LED TVs & monitors (10 lakh units each/yr)', commitment: '₹121 cr · 300 jobs — operational, inaugurated Sep 2025; ₹55 cr more planned for refrigerators/ACs/appliances [V]' },
          { name: 'Texana World Pvt Ltd (subsidiary of Tex Port India)', sector: 'Textiles — ready-made garments', commitment: '₹50 cr · 2,100 jobs (mostly women) — operational, inaugurated Sep 2025 [V]' },
          { name: 'AIL Dixon Technologies', sector: 'Electronics — surveillance systems, DVRs, laptops, tablets', commitment: '₹207 cr · 2,000+ employed by Sep 2025 — committed Dec 2021, now operational [V]' },
          { name: 'United Telelinks Neolyncs India Pvt Ltd (UNTPL)', sector: 'Electronics — mobile phones, chargers, components', commitment: '₹112 cr · 500 jobs — committed (MoU, Dec 2021) [V]' },
          { name: 'Celkon Resolute Electronics LLP', sector: 'Electronics — smartphones, tablets, PC accessories, GPON devices', commitment: '₹50 cr · 1,100 jobs — committed (MoU, Dec 2021) [V]' },
          { name: 'Digiconn Solutions', sector: 'Electronics — televisions, laptops, IoT devices', commitment: '₹50 cr · 1,200 jobs — committed (MoU, Dec 2021) [V]' },
          { name: 'Chandrahas Enterprises', sector: 'Electronics — power banks, cables, chargers, headphones, speakers', commitment: '₹110 cr · 1,320 jobs — committed (MoU, Dec 2021) [V]' },
          { name: 'Causis e-Mobility Pvt Ltd', sector: 'E-mobility — electric buses (1,000 buses, Phase I) + charging infra', commitment: '₹386 cr · 1,200 jobs — approved by SIPB Sep 2022 [V]' },
          { name: 'Shirdi Sai Electricals (SSEL) / Indosol Solar', sector: 'Transformer components & wind-mast fabrication', commitment: '₹5,000 cr — MoU at the 30th CII Partnership Summit, Nov 2025 [V]' },
          { name: '18 MSMEs (not individually named)', sector: 'Mixed MSME / ancillary', commitment: '₹84.3 cr combined · 1,192 jobs — groundbreaking Dec 2021 [V]' },
        ],
        industries: ['Electronics — mobile, components, surveillance, TVs', 'Solar cells, modules & balance-of-system', 'Medical electronics', 'Semiconductor design & R&D', 'E-mobility / EV buses', 'Garments & textiles'],
        infrastructure: [
          'The 801-acre YSR EMC is master-planned for electronics (277.9 ac for mobile components), solar (169.2 ac), medical electronics (25.6 ac) and a small semiconductor design & R&D zone (21 ac), with 493.7 ac (61.6%) as industrial area; environmental clearance is granted (Category B1).',
          'An Executive Centre building (₹31.5 cr, 46,700 sq ft G+2 over 6.3 ac) provides co-working, an APIIC office, a business centre and convention space; ready-to-occupy sheds and plots are available.',
          'A 46 MLD water-supply project is under development to serve the industrial region; Andhra Pradesh’s ~25 GW installed power base supplies the node.',
          'Road access via NH-40 (~5.4 km), NH-67 (~5.7 km) and NH-716 (~6.6 km); rail at Krishnapuram (~4.9 km) on the Chennai–Mumbai line; Kadapa Airport ~5.2 km. The node has no port linkage — Krishnapatnam (~256 km) and Chennai (~271 km) are distant.',
        ],
        incentives: 'A Special Package of Incentives (G.O.Ms.No.87, Industries & Commerce Dept, 1 Dec 2020) covers units in the Kopparthy Mega Industrial Hub — land concession, capital subsidy, power-tariff concessions, SGST reimbursement, stamp-duty exemption, single-window clearance and inspection exemptions for green units (specific quanta not published). The EMC component is co-funded 50:50 by MeitY (₹350 cr central grant under EMC-2.0) and the State (₹380.5 cr).',
        summary: [
          'Kopparthy is the most advanced node on the VCIC and one of the few corridor nodes anywhere in Andhra Pradesh that is genuinely operational. Built as a dual structure — the 801-acre YSR Electronic Manufacturing Cluster under MeitY’s EMC-2.0 scheme inside APIIC’s wider ~6,707-acre holding, with the 3,155-acre YSR Jagananna Mega Industrial Hub around it — it was inaugurated in December 2021 with a ₹1,052 cr investment commitment and 14,803 jobs.',
          'By September 2025 three units were running: TechnoDom India (LED TVs, ₹121 cr), Texana World (garments, ₹50 cr, 2,100 jobs) and AIL Dixon Technologies (surveillance and laptops, 2,000+ employed). The Prime Minister laid the formal foundation stone for the Kopparthy node, alongside Orvakal, on 16 October 2025.',
          'Five electronics manufacturers committed at the 2021 launch (UNTPL, AIL Dixon, Celkon, Digiconn, Chandrahas) and Causis e-Mobility was approved in 2022 for an electric-bus plant. The November 2025 CII Partnership Summit added a ₹5,000 cr Shirdi Sai Electricals / Indosol Solar MoU for transformer-component and wind-mast manufacturing — the node’s largest single pledge.',
        ],
        sections: [
          { heading: 'Status & tenants', body: [
            'Kopparthy’s differentiator is that it has moved from announcement to production. TechnoDom India (a Dubai-based group) and Texana World (a Tex Port India subsidiary) were both inaugurated as operational in September 2025, and AIL Dixon already employs more than 2,000 people — making this a working electronics cluster rather than a master plan.',
            'The EMC is deliberately sectored: roughly 278 acres for mobile phones and components, 169 acres for solar cells and modules, smaller zones for medical electronics and semiconductor design & R&D. That mix — electronics plus solar plus e-mobility — is what distinguishes Kopparthy from the pharma- and port-led VCIC nodes further up the corridor.',
          ] },
          { heading: 'The pipeline beyond the operational core', body: [
            'Alongside the three running units sit a stack of committed-but-not-yet-built projects: UNTPL, Celkon, Digiconn and Chandrahas from the 2021 launch (₹322 cr, ~4,120 jobs together), Causis e-Mobility’s ₹386 cr electric-bus plant approved in 2022, and 18 unnamed MSMEs (₹84.3 cr). The 2025 Shirdi Sai Electricals ₹5,000 cr MoU is the headline new pledge but, like all summit MoUs, is intent rather than allotment.',
            'A draft EIA for the hub’s North Block also identifies food & agro, metals, auto-component (future expansion) and bulk-drug MSME zones, signalling the multi-product ambition of the wider Mega Industrial Hub beyond the electronics EMC.',
          ] },
          { heading: 'Risks & open questions', body: [
            'Kadapa is classified as an industrially backward district, and the node’s distance from any major port (~256 km to Krishnapatnam) raises logistics costs for export-oriented electronics. Water is still being built out via the 46 MLD scheme.',
            'Several data points remain unconfirmed: the operational status of the four committed-only electronics firms, the land price per acre, and the specific capital-subsidy and power-tariff percentages in the incentive GO. APIIC e-auction records confirm the allotment process for EMC sheds but do not disclose successful bidder names.',
          ] },
        ],
        timeline: [
          { date: 'Aug 2020', label: 'State approval for the YSR EMC under MeitY EMC-2.0' },
          { date: 'Dec 2020', label: 'Special incentive package (G.O.Ms.No.87) issued' },
          { date: 'Dec 2021', label: 'YSR Mega Industrial Hub + EMC inaugurated (₹1,052 cr, 14,803 jobs)' },
          { date: 'Sep 2022', label: 'Causis e-Mobility (₹386 cr electric-bus plant) approved' },
          { date: 'Sep 2025', label: 'TechnoDom India + Texana World inaugurated operational' },
          { date: 'Oct 2025', label: 'PM lays foundation stone for the Kopparthy node' },
          { date: 'Nov 2025', label: '₹5,000 cr Shirdi Sai Electricals / Indosol Solar MoU (CII Summit)' },
        ],
        sources: [
          { label: 'New Indian Express — Kopparthi poised for giant leap (Sep 2025)', url: 'https://www.newindianexpress.com/states/andhra-pradesh/2025/Sep/03/kopparthi-poised-for-giant-leap-as-industrial-hub-3' },
          { label: 'Siasat — CM Jagan launches mega industrial hub (Dec 2021)', url: 'https://archive.siasat.com/news/ap-cm-jagan-launches-mega-industrial-hub-at-ysr-kadapa-2246749/' },
          { label: 'New Indian Express — ₹730 cr electronic cluster in Kadapa (Aug 2020)', url: 'https://www.newindianexpress.com/states/andhra-pradesh/2020/Aug/27/rs-730-crore-electronic-cluster-to-come-up-in-kadapa-with-support-of-centre-2188813.html' },
          { label: 'Times Now — Causis e-Mobility approval (Sep 2022)', url: 'https://www.timesnownews.com/india/andhra-pradesh-investments-worth-rs-81000-crore-approved-to-push-green-energy-projects-article-94006331' },
          { label: 'Energetica India — Shirdi Sai Electricals ₹30,650 cr MoUs (Nov 2025)', url: 'https://energetica-india.net/news/shirdi-sai-electricals-inks-inr-30650-crore-mous-with-ap-govt-for-clean-energy-and-infra-projects' },
          { label: 'PIB — CII Partnership Summit 2025 (Kopparthy & Orvakal)', url: 'https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=2190198&reg=3&lang=2' },
          { label: 'Lokmat Times — Jagan launches mega industrial hub', url: 'https://www.lokmattimes.com/politics/jagan-launches-mega-industrial-hub-in-home-district/' },
        ],
      },
      {
        slug: 'visakhapatnam', name: 'Visakhapatnam node (Nakkapalli / Rambilli)', state: 'Andhra Pradesh', stage: 'construction',
        statusLabel: 'Northern VCIC terminus — ADB-funded clusters next to a 104-firm pharma city', coords: [258, 374],
        areaAc: 4782,
        sectors: 'Pharmaceuticals & bulk drugs, transport equipment, electronics/IT, textiles, logistics',
        anchors: 'Jawaharlal Nehru Pharma City (adjacent, 104 firms); Nippon–ArcelorMittal steel plant (8 km); proposed Google/Raiden data centre',
        nearest: 'Visakhapatnam Port ~20–40 km; Visakhapatnam International Airport ~40 km; Elamanchili railway ~10–12 km; NH-16 (Golden Quadrilateral)',
        developer: 'Visakhapatnam Industrial Node Development Corporation Ltd — a State Government company (CIN U93090AP2018SGC109105) incorporated 4 September 2018. APIIC implements the industrial infrastructure, with APRDC (roads), GVMC (water) and APTRANSCO (power) as line agencies; the Department of Industries & Commerce is the executing agency. Internal works are financed through ADB’s VCIC Development Program (Tranche 2).',
        companies: [
          { name: 'Prana Pharmaceuticals Pvt Ltd', sector: 'Bulk drugs / APIs — oncology, cardiovascular, anti-HIV, anti-diabetic', commitment: '10 ac at Plot 14A, Krishnampalem (Rambilli) — allotted 2014–15; non-operational, cancellation proceedings from Dec 2020 [V] (the only named allottee inside the node boundary)' },
          { name: 'Champions Group (Champion InfoMetrics / InfraTech)', sector: 'Tech parks, GCCs, datacentre + Crystal Lagoon', commitment: '₹540 cr (tech parks/datacentre) + ₹225 cr (Crystal Lagoon) — MoU at CII Summit, Nov 2025 (Visakhapatnam & Amaravati) [V]' },
          { name: '5 unnamed companies (bhoomi puja, Visakhapatnam)', sector: 'Mixed', commitment: '₹3,800+ cr combined · ~30,000 direct jobs — groundbreaking at CII Summit, Nov 2025; companies not named [V1]' },
          { name: 'Jawaharlal Nehru Pharma City (JNPC) — adjacent, not a VCIC allottee', sector: 'Pharmaceuticals — API, formulations, CDMO', commitment: '2,400+ ac · 104 firms · ~30,000 employed — operational since 2010; the pre-existing base the node integrates [V]' },
          { name: 'Nippon Steel–ArcelorMittal plant — adjacent, not a VCIC allottee', sector: 'Steel manufacturing', commitment: '~₹1.4 lakh cr · 6,500 ac · 1 lakh+ jobs — ~8 km from Rambilli, under construction/planned [V1]' },
          { name: 'Raiden Infotech / Google (proposed) — adjacent, not a VCIC allottee', sector: 'Data centre', commitment: 'Proposed within ~2 km of Rambilli; the wider Google/Raiden AI data-centre plan is in Visakhapatnam/Anakapalli districts [V1]' },
        ],
        industries: ['Pharmaceuticals & bulk drugs (JNPC-anchored)', 'Steel & downstream metals', 'Transport equipment', 'Electronics / IT & data centres', 'Textiles', 'Logistics & warehousing (port-led)'],
        infrastructure: [
          'The node is two clusters: Rambilli (396.27 ac, of which 379.36 ac — 95.7% — already handed to APIIC) and Nakkapalli (1,089-ac/441-ha Phase I start-up area within a 4,386-ac/1,775-ha master plan). Nakkapalli Phase I sets aside ~571 ac (52.4%) for industrial plots and ~31 ac for residential/commercial use.',
          'ADB Tranche 2 (US$141.12 m loan; US$214.80 m total project cost) funds internal roads, storm-water drains, bulk water supply, power distribution and a CETP; external works include widening the 13.8 km Atchuthapuram–Anakapalli road to NH-16 and a 4.4 km access road to Nakkapalli. The MFF availability window runs to 19 September 2026.',
          'Water for Nakkapalli is drawn from the Yeluru Left Main Canal via a summer storage tank and treatment plant; power from the Chandanada substation through APTRANSCO. A CETP is to be built by APIIC after the trunk infrastructure.',
          'Connectivity is the node’s strongest card: NH-16 (Golden Quadrilateral), Visakhapatnam Port 20–40 km, Visakhapatnam Airport ~40 km, Elamanchili rail station 10–12 km, plus a proposed coastal-corridor road and a proposed Rambilli port; the Adani Gangavaram Port and INS Varsha naval base are in the wider region.',
        ],
        incentives: 'No node-specific fiscal incentive framework was found — VCIC/ADB support here is infrastructure-in-kind (roads, drains, water, power, CETP) rather than cash incentives. Units fall under general Andhra Pradesh industrial policy and APIIC’s 2015 industrial-parks allotment regulations, with single-window clearance; sector-specific bulk-drug incentives apply to pharma units. Market land rates near the node (Achyutapuram SEZ) are reported around ₹6 cr per acre, distinct from the official APIIC allotment rate (not published).',
        summary: [
          'Visakhapatnam is the northern terminus of the VCIC and its most infrastructure-ready node, developed as two ADB-funded clusters — Rambilli and Nakkapalli — in Anakapalli district. The implementing SPV, Visakhapatnam Industrial Node Development Corporation Ltd, was incorporated in September 2018, and Rambilli land acquisition is already 95.7% complete.',
          'What makes the node credible is what sits around it rather than inside it. The adjacent Jawaharlal Nehru Pharma City — 2,400+ acres, 104 firms including Pfizer, Mylan/Viatris, Eisai, PharmaZell, Aurobindo, Laurus Labs, Dr Reddy’s and Divi’s, employing ~30,000 — is the operational anchor the node integrates, while the ~₹1.4 lakh cr Nippon Steel–ArcelorMittal plant 8 km away and a proposed Google/Raiden data centre define its industrial gravity.',
          'Inside the node boundary itself, confirmed activity is still thin: the one named allottee, Prana Pharmaceuticals, was non-operational and in cancellation proceedings by 2020, and the November 2025 CII Summit produced mostly statewide or multi-location MoUs (Champions Group) plus five unnamed bhoomi-puja companies. The construction is real; the in-boundary tenant list is not yet filled.',
        ],
        sections: [
          { heading: 'Two clusters under ADB finance', body: [
            'The node is being built as Rambilli (396.27 ac, 379.36 ac handed over) and Nakkapalli (1,089-ac Phase I within a 4,386-ac master plan), with internal and external infrastructure funded by ADB’s VCIC Development Program Tranche 2 (US$141.12 m loan, US$214.80 m total). The MFF window closes in September 2026, which puts a clock on trunk-works completion.',
            'Target sectors are pharmaceuticals (anchored by JNPC), transport equipment (synergy with the steel plant), electronics/IT and textiles. The land-acquisition footprint is socially sensitive: 63 families (173 persons) are affected at Rambilli, 24% from vulnerable SC/OBC groups.',
          ] },
          { heading: 'The adjacent base — JNPC, steel and data', body: [
            'Jawaharlal Nehru Pharma City at Parawada is the real industrial engine in this corridor segment — a 2,400-acre integrated pharmaceutical cluster operational since 2010, built as an APIIC–Ramky PPP (Visakha Pharmacity Ltd), now hosting 104 companies and ~30,000 workers with US FDA, EMA, MHRA and WHO-GMP compliance. It predates the VCIC designation and is not a node allottee, but it is what the node is designed to feed off.',
            'The ~₹1.4 lakh cr Nippon Steel–ArcelorMittal plant (6,500 ac, 8 km away) and a proposed Google/Raiden data centre within ~2 km give the node a transport-equipment and electronics pull that no other VCIC node has.',
          ] },
          { heading: 'Risks & open questions', body: [
            'The in-boundary tenant pipeline is the weak point: the only named allottee, Prana Pharmaceuticals, never commissioned its 10-acre bulk-drug plant and faced cancellation from 2020 — a cautionary precedent for allottee discipline. No operational industry has been identified within the Rambilli or Nakkapalli start-up areas themselves.',
            'Open items include the node’s environmental-clearance status, the Nakkapalli plot allotment list, the official APIIC allotment price, whether the Google data centre is formally approved, and whether the CETP has been funded and bid out before the ADB window closes in September 2026.',
          ] },
        ],
        timeline: [
          { date: 'Sep 2016', label: 'ADB VCIC Tranche 1 approved' },
          { date: 'Sep 2018', label: 'Visakhapatnam Industrial Node Development Corporation Ltd incorporated' },
          { date: '2020', label: 'Prana Pharmaceuticals cancellation proceedings (AP High Court, WP 24092/2020)' },
          { date: 'Apr 2023', label: 'ADB Tranche 2 (US$141.12 m) voting; Rambilli 95.7% acquired' },
          { date: 'Nov 2025', label: 'CII Partnership Summit hosted at Visakhapatnam (Champions Group MoU; 5 bhoomi-puja firms)' },
          { date: 'Sep 2026', label: 'ADB MFF availability window closes — trunk-works deadline' },
        ],
        sources: [
          { label: 'Express Pharma — JNPC, a 20-year legacy', url: 'https://www.expresspharma.in/amp/jnpc-carrying-forward-a-20-year-old-legacy/' },
          { label: 'APIIC — JNPC PPP document', url: 'https://apiic.in/wp-content/themes/custom-theme/assets/uploads/ppp/JNPC.pdf' },
          { label: 'The Hindu — AP attracts ₹13.25 lakh cr at CII Summit', url: 'https://www.thehindu.com/news/national/andhra-pradesh/ap-attracts-1325617-cr-investments-at-cii-partnership-summit/article70284702.ece' },
          { label: 'Lokmat Times — Champions Group projects at CII Summit', url: 'https://www.lokmattimes.com/business/champions-group-unveils-three-iconic-world-class-projects-at-cii-partnership-summit-vizag/' },
          { label: 'Deccan Chronicle — AP hosts CII Summit (bhoomi puja, 5 firms)', url: 'https://www.deccanchronicle.com/southern-states/andhra-pradesh/ap-hosts-cii-summit-as-vice-president-hails-naidus-development-model-1917103' },
          { label: 'Business Standard — CII Summit investments', url: 'https://www.business-standard.com/amp/economy/news/andhra-investments-cii-summit-renewables-green-energy-2025-125111600447_1.html' },
          { label: 'The Hindu (2007) — Pharma City set to become operational', url: 'https://www.thehindu.com/todays-paper/Pharma-City-set-to-become-operational/article14859962.ece' },
        ],
      },
      {
        slug: 'chittoor', name: 'Chittoor node (Srikalahasti–Yerpedu / Naidupeta)', state: 'Andhra Pradesh', stage: 'approved',
        statusLabel: 'VCIC auto/engineering node — master-planned, developer selection under way',
        coords: [198, 442],
        areaAc: 11000,
        sectors: 'Automobile & auto components, heavy & light engineering, electronics, textiles, food processing, logistics',
        anchors: 'Kosalanagaram Industrial Park (2,300-ac Phase I); Sri City SEZ adjacency; Chennai auto-belt spillover',
        nearest: 'Chennai (~80–100 km) & Krishnapatnam ports (~100 km); Chennai International Airport (~80 km); NH-16 (Golden Quadrilateral)',
        developer: 'Chittoor Industrial Node Development Corporation Ltd — a State Government company incorporated October 2018 — is the VCIC node SPV. APIIC implements infrastructure (with APRDC for roads and APTRANSCO for power), and the Tirupati Urban Development Authority (TUDA) is the regional planning authority. For the flagship Kosalanagaram park, APIIC is selecting private developers on a PPP basis rather than allotting land directly.',
        companies: [
          { name: 'Genius Filters', sector: 'Technical textiles — filters', commitment: '₹120 cr · 250 jobs at Gandrajupalle — MoU at CII Partnership Summit, Nov 2025 [V]' },
          { name: 'AP Environmental Management Corporation Ltd (APEMCL)', sector: 'CETP / common effluent treatment', commitment: '6.65 ac at Gajulamandyam IP — land allotted Nov 2023 [V] (infrastructure operator, not a manufacturer)' },
          { name: 'Lakshmi Oil Industries', sector: 'Waste-tyre pyrolysis, rubber products', commitment: 'Plot S-8, Rachaguneri, Srikalahasti — under PNB bank auction (default, asset ~₹1.8 cr), Dec 2025 [V]' },
          { name: 'Kamadhenu Stika (Chittoor textile MoU)', sector: 'Textiles', commitment: '~₹90 cr — part of the statewide CII Summit textile MoUs naming Chittoor among five districts; location within Chittoor inferred [V/D]' },
          { name: 'Kosalanagaram Industrial Park (developer RFP)', sector: 'Auto & auto components, engineering, MSME (Work-Live-Learn township)', commitment: '2,300-ac Phase I (~10,000 ac ultimate) — MoEFCC ToR granted Nov 2019; private-developer selection initiated May 2026; no tenant yet [V]' },
        ],
        industries: ['Automobile & auto components', 'Heavy & light engineering', 'Electronics', 'Textiles & apparel', 'Food processing', 'Logistics & warehousing', 'MSME ancillary'],
        infrastructure: [
          'The node is master-planned at ~11,000 ac across the Srikalahasti–Yerpedu cluster, making it the second-largest VCIC node by planned area after Donakonda. Its centrepiece, the Kosalanagaram Industrial Park (Vijayapuram Mandal), has a 2,300-ac Phase I and a ~10,000-ac ultimate footprint built on a "Work, Live and Learn" township model; ToR was granted by MoEFCC on 21 November 2019.',
          'The Naidupeta cluster (Menakuru multi-product SEZ) carries the execution-stage works: ₹181.5 cr of internal roads and storm-water drains, a 1 MLD CETP (₹130 cr) and ₹337.8 cr of power-distribution augmentation at Rachagunneri, Naidupeta and Yerpedu via APTRANSCO.',
          'Road connectivity projects to NH-16 (Neleballi–Routhusuramala, Srikalahasti-Yerpedu–Pallamala, ThimmajiKandriga–NH-5) had DPRs submitted to ADB; the VCIC programme overall draws an ADB loan of US$615 m with a US$215 m state counterpart.',
          'The node is equidistant from Chennai and Bengaluru, with NH-16, two ports (Chennai and Krishnapatnam, each ~100 km) and Chennai airport (~80 km) — and sits adjacent to Sri City, one of South India’s largest integrated business zones, positioning it to capture auto and electronics spillover.',
        ],
        incentives: 'No node-specific fiscal framework was found; VCIC support here is infrastructure (roads, drains, power, CETP) under the ADB programme. Units fall under general Andhra Pradesh industrial policy — stamp-duty reimbursement, capital and power subsidies and export incentives are referenced by the District Industries Centre, though specific percentages are not published. The Kosalanagaram PPP model implies developer-led land rather than direct government concession.',
        summary: [
          'Chittoor is the VCIC’s auto-and-engineering node, master-planned at ~11,000 acres and positioned on the strength of its geography: equidistant from Chennai and Bengaluru, served by NH-16 and two ports, and sitting next to the Sri City SEZ. Its implementing SPV, Chittoor Industrial Node Development Corporation Ltd, was incorporated in October 2018, and master planning is complete.',
          'The active development within the node is the Kosalanagaram Industrial Park — 2,300 acres in Phase I, up to ~10,000 acres ultimately — conceived as a "Work, Live and Learn" township for automobiles, auto components, engineering and MSMEs. MoEFCC granted its Terms of Reference in November 2019, and APIIC has begun selecting private developers, starting with an initial 500-acre phase.',
          'No VCIC-node-specific tenant or allottee has been confirmed: the named entities in the district are either operators of existing APIIC estates (the APEMCL CETP at Gajulamandyam), bank-default cases (Lakshmi Oil Industries) or summit MoUs (Genius Filters, ₹120 cr). The district’s real strength is its existing base — 177 major projects and 9,271 MSMEs — which the node aims to scale.',
        ],
        sections: [
          { heading: 'Status & the Kosalanagaram park', body: [
            'The node’s progress runs through Kosalanagaram. Its ToR (MoEFCC, Nov 2019) fixes the focus sectors as automobile and auto components, heavy and light engineering, and MSMEs, with APIIC adding electronics, FMCG, food processing, logistics and leather as wider targets. The development model is PPP: APIIC is selecting private developers for the park’s construction, operation and maintenance rather than allotting plots itself, which means tenant names follow developer appointment.',
            'The Naidupeta cluster holds the funded civil works — internal roads and drains, a 1 MLD CETP, and a ₹337.8 cr power-distribution upgrade — while the Srikalahasti–Yerpedu cluster carries the master-planned acreage.',
          ] },
          { heading: 'Strategic position & the existing base', body: [
            'Chittoor district already hosts 177 major and mega projects (₹24,000 cr, 84,000 jobs) and 9,271 MSMEs (₹7,000 cr, 1.17 lakh jobs), with strengths in food processing (₹5,456 cr invested) and rankings of first in the state for mango, milk and tomato. Its adjacency to Sri City — home to Isuzu, Kellogg’s, PepsiCo, Colgate-Palmolive and Alstom — and reported relocation interest from Chennai’s Ambattur belt make the auto and electronics case credible.',
            'Andhra Pradesh is the only state with three NICDP corridors (VCIC, CBIC, HBIC), and Chittoor district sits at the VCIC/CBIC confluence, reinforcing its logistics and market-access advantage.',
          ] },
          { heading: 'Risks & open questions', body: [
            'VCIC development at Chittoor was described as "sluggish" as far back as 2016, and many 2019–2020 infrastructure deadlines have no documented completion. The Kosalanagaram developer-selection process began only in 2026, and ~32 acres at the Gajulamandyam estate are tied up in an Indian Bank vs APIIC dispute pending before the AP High Court.',
            'No anchor investor has been publicly secured for the VCIC node itself; the land price per acre, specific incentive percentages, the water source for Kosalanagaram, and the validity of the 2019 ToR are all unconfirmed. The node competes directly with Tamil Nadu’s established industrial base for the same manufacturers.',
          ] },
        ],
        timeline: [
          { date: '2016', label: 'DPR (~₹500 cr) for the Srikalahasti node submitted to ADB' },
          { date: 'Oct 2018', label: 'Chittoor Industrial Node Development Corporation Ltd incorporated' },
          { date: 'Nov 2019', label: 'Kosalanagaram Industrial Park ToR granted by MoEFCC' },
          { date: 'By 2019', label: 'Srikalahasti node master planning completed; Naidupeta works under execution' },
          { date: 'Nov 2025', label: 'Genius Filters ₹120 cr textile MoU (CII Summit)' },
          { date: 'May 2026', label: 'APIIC initiates private-developer selection for Kosalanagaram' },
        ],
        sources: [
          { label: 'AP Government — Industry, Employment & Skill Development', url: 'https://schooledu.ap.gov.in/DSENEW/JSP/9.%20Industry,%20Emp.%26%20skill%20Dev.pdf' },
          { label: 'The Hans India — 10k-acre industrial hub near Sri City', url: 'https://www.thehansindia.com/andhra-pradesh/10k-acre-industrial-hub-to-come-up-near-sri-city-1074025' },
          { label: 'Deccan Chronicle — Chittoor investments (2022)', url: 'https://www.deccanchronicle.com/nation/current-affairs/010322/chittoor-district-slated-to-witness-many-investments-in-near-future.html' },
          { label: 'Deccan Chronicle — Chittoor poised for big leap with industrial corridors (2021)', url: 'https://www.deccanchronicle.com/nation/in-other-news/280921/chittoor-poised-for-big-leap-with-industrial-corridors.html' },
          { label: 'New Indian Express — textiles sector ₹43k cr at CII Summit', url: 'https://www.newindianexpress.com/states/andhra-pradesh/2025/Nov/20/textiles-sector-nets-rs-43k-crore-investments-at-cii-summit' },
          { label: 'APIIC — vacant plots, Gajulamandyam IP', url: 'https://kpi.apiic.in:8443/KPI/apiicfi/VacantPlots.jsp?param=vacz2&zn=TIRUPATI&pname1=IP,GAJULAMANDYAM' },
          { label: 'Apparel Views — AP textile investments at CII Summit', url: 'https://www.apparelviews.com/investments-flow-into-andhra-pradesh-textile-industry-at-cii-partnership-summit' },
        ],
      },
      {
        slug: 'machilipatnam', name: 'Machilipatnam node', state: 'Andhra Pradesh', stage: 'planned',
        statusLabel: 'Port-led VCIC node — pre-development, anchored by a deep-water port due 2026',
        coords: [227, 395],
        sectors: 'Marine processing & aquaculture, boat manufacturing, textiles (Kalamkari), imitation jewellery, logistics, defence',
        anchors: 'Machilipatnam deep-water port (under construction); Gilakaladindi 300-ac MSME park; existing Machilipatnam Jewellery Park',
        nearest: 'On-site Machilipatnam Port (under construction); Vijayawada Airport ~57–63 km; Machilipatnam railway ~7 km; NH-65 & NH-216',
        developer: 'No NICDC–Andhra Pradesh SPV could be identified for the Machilipatnam node — unlike Krishnapatnam (which has an incorporated SPV and an EPC contractor), and the node is absent from the 20-project NICDP approved list as of August 2025. The anchor port is state-led, and the 300-acre Gilakaladindi industrial park sits under the Ministry of MSME; APIIC manages the pre-existing jewellery estate.',
        companies: [
          { name: 'Goa Shipyard Ltd', sector: 'Defence — warship building & defence manufacturing', commitment: 'MoU at CII Partnership Summit, Nov 2025 — investment not specified [V]' },
          { name: 'Kamadhenu Stika', sector: 'Textiles', commitment: '₹90 cr · 650 jobs — MoU at CII Partnership Summit, Nov 2025 (Machilipatnam) [V]' },
          { name: 'Machilipatnam Jewellery Park (JP_Machilipatnam, APIIC estate)', sector: 'Imitation jewellery & gold covering — 27 named firms', commitment: '47.72 ac · 258 plots (257 allotted) — operational APIIC estate, allotments 2007–09; predates the corridor [V]' },
          { name: 'Gilakaladindi MSME Industrial Park', sector: 'Aquaculture, marine processing, boat-building, Kalamkari, jewellery', commitment: '300 ac earmarked under the Ministry of MSME — land allotment not yet begun [V1]' },
        ],
        industries: ['Marine product processing & aquaculture', 'Boat & small-craft manufacturing', 'Textiles — Kalamkari', 'Handicrafts — imitation jewellery', 'Logistics & port-linked warehousing', 'Defence (Goa Shipyard MoU)'],
        infrastructure: [
          'The anchor is the Machilipatnam deep-water port at Gilakaladindi — sanctioned at ₹5,156 cr, launched May 2023, with a Phase I of four berths and 35 MTPA capacity (expandable to 116 MTPA) targeted for completion by December 2026, after which EXIM, container and port-linked industry are to begin.',
          'A 300-acre MSME industrial park is earmarked at Gilakaladindi under the Ministry of MSME, for aquaculture and marine processing, boat manufacturing, Kalamkari textiles, imitation jewellery and logistics; an existing fishing harbour (Phase II underway) sits alongside it.',
          'Connectivity runs via NH-65 (Pune–Hyderabad–Vijayawada–Machilipatnam) and NH-216 (Kattipudi–Ongole); Machilipatnam railway station (~7 km) is B-category, with a Machilipatnam–Repalle rail-line DPR under preparation; Vijayawada International Airport is ~57–63 km away.',
          'There is no NICDC SPV, no DPR or master plan for the industrial node, and no environmental clearance on record — the node is at an earlier pre-development stage than Krishnapatnam, with industrial land allotment yet to start.',
        ],
        incentives: 'No node-specific incentive framework was identified; with the SPV not yet formed and the port still under construction, fiscal incentives would follow general Andhra Pradesh industrial policy once development begins. Statewide policy benchmarks include 100% stamp-duty reimbursement, capital subsidy up to 25% for MSMEs and 100% SGST reimbursement (drawn from the 2024–29 tourism policy; the full industrial policy was not available). Water is available from the Krishna river; power allocation is not specified.',
        summary: [
          'Machilipatnam is the VCIC’s port-led node, but it is the least-developed of the corridor’s Andhra Pradesh nodes. It is not among the 20 NICDP projects approved as of August 2025, no NICDC–State SPV has been formed, and no DPR, master plan or environmental clearance for the industrial node could be found — its momentum rests almost entirely on the deep-water port under construction.',
          'That port is the anchor: a ₹5,156 cr deep-water facility at Gilakaladindi, launched in May 2023, with a four-berth Phase I and 35 MTPA capacity (expandable to 116 MTPA) targeted for completion by December 2026. A 300-acre MSME park has been earmarked beside it under the Ministry of MSME for marine processing, boat-building, Kalamkari textiles and imitation jewellery.',
          'No VCIC-node allottee has been confirmed. The named activity is either the pre-existing APIIC Machilipatnam Jewellery Park (47.72 ac, 257 allotted plots, dating to 2007) or November 2025 CII Summit MoUs — Goa Shipyard (defence, amount unstated) and Kamadhenu Stika (textiles, ₹90 cr, 650 jobs). Until the port operationalises and an SPV is formed, the node remains intent rather than pipeline.',
        ],
        sections: [
          { heading: 'The port as the anchor', body: [
            'Everything at Machilipatnam keys off the deep-water port. Sanctioned at ₹5,156 cr and launched in May 2023, its Phase I (four berths, 35 MTPA, expandable to 116 MTPA) is targeted for December 2026, with EXIM, container logistics and port-based industry to follow immediately. The Chief Minister framed it in 2023 as a port with "the potential to develop on the lines of Mumbai and Chennai", land acquisition complete and clearances obtained.',
            'The planned 300-acre Gilakaladindi MSME park draws directly on the surrounding economy — aquaculture and marine products, boat manufacturing, Kalamkari textiles and the region’s imitation-jewellery clusters — making the node’s logic genuinely port-and-MSME-led rather than heavy-industry-led.',
          ] },
          { heading: 'The existing base & the 2025 MoUs', body: [
            'The one operational industrial cluster is the APIIC Machilipatnam Jewellery Park — 47.72 acres, 258 plots with 257 allotted to 27 named gold-covering and imitation-jewellery firms, with allotments running 2007–09 (several now carrying "Notice Issued" status). It predates the corridor framework and is not a VCIC allottee.',
            'At the November 2025 CII Partnership Summit, two MoUs named Machilipatnam specifically: Goa Shipyard Ltd for warship building and defence manufacturing (amount not disclosed) and Kamadhenu Stika for textiles (₹90 cr, 650 jobs). Both are MoUs of intent, not land allotments.',
          ] },
          { heading: 'Risks & open questions', body: [
            'The node’s fundamentals are unresolved: it is not on the NICDP approved list, has no SPV, no EPC contractor for the industrial node, no DPR or master plan, and no environmental clearance — and it sits behind the more-advanced Krishnapatnam node nearby. Its credibility hinges on the port hitting its December 2026 completion target.',
            'Open items include whether Machilipatnam is ever formally taken into a later NICDP phase, the land-acquisition status of the 300-acre MSME park, the post-MoU progress of Goa Shipyard and Kamadhenu Stika, and the node’s power and water allocations and investment/job targets — none of which are documented.',
          ] },
        ],
        timeline: [
          { date: '2018', label: 'Gilakaladindi fishing harbour Phase II documented' },
          { date: 'May 2023', label: 'Machilipatnam deep-water port (₹5,156 cr) launched' },
          { date: '2025', label: '300-acre Gilakaladindi MSME industrial park earmarked' },
          { date: 'Aug 2025', label: 'Node absent from the 20-project NICDP approved list (Lok Sabha)' },
          { date: 'Nov 2025', label: 'Goa Shipyard + Kamadhenu Stika MoUs at CII Summit' },
          { date: 'Dec 2026', label: 'Port Phase I completion targeted; operations to commence' },
        ],
        sources: [
          { label: 'Telangana Today — Machilipatnam port launch (May 2023)', url: 'https://telanganatoday.com/machilipatnam-has-potential-to-develop-on-lines-of-mumbai-chennai-ap-cm-jagan' },
          { label: 'Urban Acres — Machilipatnam port construction by 2026', url: 'https://urbanacres.in/machilipatnam-port-construction-to-finish-by-2026/' },
          { label: 'Lok Sabha — NICDP approved projects (Q 2753, Aug 2025)', url: 'https://sansad.in/getFile/loksabhaquestions/annex/185/AU2753_hkDCfr.pdf' },
          { label: 'APIIC KPI — JP_Machilipatnam jewellery park', url: 'https://kpi.apiic.in:8443/KPI/apiicfi/TotalProperties.jsp?param=vacz2&usrzn=ALL&zn=VIJAYAWADA&pname1=JP_MACHILIPATNAM' },
          { label: 'The Hindu — Goa Shipyard MoU at CII Summit', url: 'https://www.thehindu.com/news/national/andhra-pradesh/ap-attracts-1325617-cr-investments-at-cii-partnership-summit/article70284702.ece' },
          { label: 'IFAB Media — textile MoUs (Kamadhenu Stika, Machilipatnam)', url: 'https://infashionbusiness.com/home/news_details/6771/9' },
          { label: 'GMC Machilipatnam — connectivity', url: 'https://www.gmcmachilipatnam-ap-gov.com/vmccollege/' },
        ],
      },
            {
        slug: 'donakonda', name: 'Donakonda node', state: 'Andhra Pradesh', stage: 'planned',
        statusLabel: 'VCIC land bank — now anchored by a defence-PSU plant', coords: [208, 410],
        areaAc: 17117,
        sectors: 'Defence manufacturing, building materials, general manufacturing, logistics, healthcare',
        nearest: 'Donakonda rail station (Guntur–Guntakal line); Ongole ~81 km; no port linkage; backward Prakasam district',
        developer: 'No VCIC node SPV. APIIC holds a “Donakonda Mega Industrial Hub” land bank (845.7 ac, “to be acquired”, 0 allotted on the APIIC KPI portal) and the node is absent from the 2024 NICDP Cabinet list. The live activity sits under the separate Jaggaiahpet–Donakonda defence industrial corridor, not the VCIC node.',
        companies: [
          { name: 'Bharat Dynamics Ltd (BDL)', sector: 'Defence — propellants & weapon-system integration', commitment: '₹1,400 cr · 1,400 ac (1,200 plant + 200 township) — land allotted; construction from Apr 2026, production from Oct 2028 [V]' },
          { name: 'Chan Jong Yun Challa Cancer Center', sector: 'Healthcare — diagnostics, oncology, med-device manufacturing', commitment: '~₹4,000 cr ($480m) · 25 ac · ~4,000 jobs — MoU Nov 2025 (WSCF Korea, Challa Group, Omexa, MACE, I-Holding UK); construction after approvals [V]' },
          { name: 'China Assn. of Small & Medium Enterprises', sector: 'Building-materials industrial park (20 sq km)', commitment: '~₹6,000 cr — 2016 MoU; no implementation found, treated as lapsed intent [V/D]' },
          { name: 'China Small & Medium Investment Group (Beijing)', sector: 'Building-materials logistics park (20 sq km)', commitment: '~₹36,889 cr — 2016 MoU; lapsed, no progress documented [V/D]' },
          { name: 'Antonov + Motor Sich (Ukraine)', sector: 'Aircraft manufacturing & helicopter overhaul', commitment: '~₹3,000 cr · 6,000 ac sought — 2016 discussions at the WWII airfield; lapsed [V/D]' },
        ],
        industries: ['Defence — propellants & weapon systems (BDL)', 'Healthcare & medical devices', 'Building materials', 'General manufacturing', 'Logistics & warehousing'],
        infrastructure: [
          '~17,117 ac master-planned — the largest VCIC node by planned area, but still a land bank: the APIIC “Donakonda Mega Industrial Hub” shows 845.7 ac “to be acquired”, 0 allotted (APIIC KPI portal), with a separate 380-ac cluster out for a 2nd-call developer RFP.',
          'Rail via the Guntur–Guntakal line (Donakonda station, SCR); the WWII-era Donakonda airfield (closed) is proposed as an IAF station; road via the Donakonda–Manginapudi road; no port linkage and Ongole (district HQ) ~81 km.',
          'Part of the Jaggaiahpet–Donakonda corridor — India’s third defence industrial corridor (after UP and Tamil Nadu): ~23,000 ac across five hubs north-to-south in AP, with a proposed IAF station, logistics centre, training facility and R&D hub.',
          'No ADB funding and no VCIC trunk works here — ADB’s VCIC civil works are at Visakhapatnam and Chittoor.',
        ],
        incentives: 'No node-specific VCIC framework (the node is unprioritised and has no SPV). Defence-corridor and general Andhra Pradesh industrial-policy incentives apply to the BDL and cancer-centre projects; the APIIC hub would follow standard AP allotment rules once land is acquired.',
        summary: [
          'Donakonda is, on paper, the largest VCIC node by planned area (~17,117 ac), yet it was never prioritised for Phase I and is absent from the 2024 NICDP Cabinet approvals — so for the VCIC programme it remains a strategic land bank with no SPV, no ADB funding and no trunk construction.',
          'The real story has shifted off the VCIC node and onto the land around it. In October 2025 Bharat Dynamics Ltd was allotted 1,400 acres for a ₹1,400 cr propellant and weapon-integration plant — Donakonda’s first confirmed major industrial investment — with construction from April 2026 and production targeted for October 2028, under the new Jaggaiahpet–Donakonda defence industrial corridor. A ~₹4,000 cr cancer-care and med-device complex was added by MoU in November 2025.',
          'Everything older should be read with care: the headline 2016 pledges — ~₹43,120 cr from two Chinese associations and ~₹3,000 cr from Ukraine’s Antonov and Motor Sich — show no land acquisition or implementation and are lapsed intent, not pipeline.',
        ],
        sections: [
          { heading: 'Bharat Dynamics and the defence corridor', body: [
            'The single most important development at Donakonda is not a VCIC allotment at all. Bharat Dynamics Ltd, a defence PSU, has been allotted ~1,400 acres (1,200 for the facility, 200 for a township) for a propellant-manufacturing and weapon-system-integration plant worth ~₹1,400 cr, with construction slated from April 2026 and commercial production from October 2028.',
            'It anchors the Jaggaiahpet–Donakonda corridor, India’s third defence industrial corridor after Uttar Pradesh and Tamil Nadu — ~23,000 acres across five hubs running north-to-south through Andhra Pradesh, with a proposed Indian Air Force station, logistics centre, training facility and R&D hub. The closed WWII-era Donakonda airfield is the asset that makes the aerospace/defence positioning credible.',
          ] },
          { heading: 'Healthcare and the 2025 MoUs', body: [
            'At the November 2025 CII Partnership Summit, a multi-party consortium (WSCF South Korea, the Challa Group, Omexa Biologies, MACE and I-Holding UK) signed an MoU for the Chan Jong Yun Challa Cancer Center at Donakonda — ~₹4,000 cr ($480m) over ~25 acres, with cancer detection, surgery, a training institute and medical-device manufacturing, and ~4,000 jobs. Construction follows statutory approvals.',
          ] },
          { heading: 'The lapsed 2016 MoUs', body: [
            'In June–July 2016 Donakonda attracted two sets of large foreign pledges: two Chinese associations signed for a building-materials industrial park (~₹6,000 cr) and a logistics park (~₹36,889 cr), ~₹43,120 cr in total with 55,000 direct and 1,20,000 indirect jobs; and Ukraine’s Antonov and Motor Sich discussed ~₹3,000 cr aircraft-manufacturing and helicopter-overhaul facilities, seeking ~6,000 acres at the airfield.',
            'Neither materialised. No land acquisition, construction or follow-up documentation exists for either, and Donakonda was confirmed as not a Phase-I priority in 2019 and excluded from the 2024 Cabinet approvals. These figures belong in the history of the node, not its investment pipeline.',
          ] },
          { heading: 'Risks & open questions', body: [
            'For the VCIC node proper, the gaps are fundamental: no SPV, no DPR or master-plan status, no environmental clearance, no verified land-acquisition figure and no ADB funding could be confirmed. The APIIC hub still lists its 845.7 acres as “to be acquired”.',
            'The defence and healthcare projects are real and verified, but they sit on Donakonda land under different programmes — so the node’s momentum is now defence-led, not VCIC-led. Whether Donakonda is ever formally taken into a later NICDP phase remains open.',
          ] },
        ],
        timeline: [
          { date: 'Jun–Jul 2016', label: 'Chinese (~₹43,120 cr) and Ukrainian (~₹3,000 cr) MoUs signed — later lapsed' },
          { date: 'Nov 2019', label: 'Confirmed not a VCIC Phase-I priority (Lok Sabha)' },
          { date: 'Aug 2024', label: 'Excluded from the 12-node NICDP Cabinet approvals' },
          { date: 'Oct 2025', label: 'BDL allotted 1,400 ac for a ₹1,400 cr propellant/weapons plant' },
          { date: 'Nov 2025', label: '~₹4,000 cr Chan Jong Yun Challa Cancer Center MoU' },
          { date: 'Apr 2026', label: 'BDL construction to begin (production targeted Oct 2028)' },
        ],
        sources: [
          { label: 'Economic Times — BDL propellant plant at Donakonda', url: 'https://m.economictimes.com/news/defence/bharat-dynamics-set-to-establish-propellant-plant-at-andhras-donakonda/amp_articleshow/124396479.cms' },
          { label: 'New Indian Express — cancer centre, Prakasam', url: 'https://www.newindianexpress.com/states/andhra-pradesh/2025/Nov/04/cancer-centre-to-come-up-in-andhra-pradeshs-prakasam' },
          { label: 'The Hindu — Antonov/Motor Sich at Donakonda', url: 'https://www.thehindu.com/news/national/andhra-pradesh/Sleepy-Donakonda-set-to-take-wing/article14500834.ece' },
          { label: 'Business Standard — 2016 China MoU', url: 'https://www.business-standard.com/article/news-ians/andhra-signs-mou-with-chinese-firms-for-industrial-park-116062800012_1.html' },
          { label: 'Lok Sabha — Q 608 (VCIC status, 2019)', url: 'https://sansad.in/getFile/loksabhaquestions/annex/172/AU608.pdf' },
          { label: 'PIB — Cabinet approval of 12 nodes (Aug 2024)', url: 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2024/aug/doc2024830383401.pdf' },
        ],
      }
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
        statusLabel: 'India’s first machine-tool park operational; Phase 1 building', coords: [169, 440],
        areaAc: 8500, projectCostCr: 13717, investmentCr: 50000, jobs: 220000,
        sectors: 'Machine tools, precision manufacturing, electronics, auto components, food products, textiles & apparel, pharmaceuticals, engineering',
        nearest: 'NH-48 adjacent; Bengaluru ~120 km; Kempegowda airport ~115 km; Tumakuru railway station ~25 km; Mangaluru Port ~300 km',
        developer: 'CBIC Tumakuru Industrial Township Ltd (state SPV via KIADB) — 50:50 NICDIT : KIADB/GoK; SHA & SSA signed 30 Oct 2018; central grant ceiling ₹3,000 cr matching the state land contribution; six-director board (3 state, 3 NICDIT).',
        epc: 'Phase 1 (1,736 ac) under construction toward end-2026; the 530-ac Tumakuru Machine Tool Park is already developed and occupied.',
        companies: [
          { name: 'Tumakuru Machine Tool Park (TMTP)', sector: 'India’s first integrated machine-tool park — 530 ac, 158 ready-to-build plots', commitment: '₹508 cr development cost; ₹125 cr equity each from Centre (DHI) + Karnataka; technical partner IMTMA; 22 large-company plots (128 ac) taken [V]' },
          { name: 'Japan Industrial Township (existing)', sector: 'Japanese-firm enclave', commitment: '160 ac · fully occupied by 107 companies incl. Toyota — opposite TMTP [V]' },
          { name: 'Japan Industrial Park (new)', sector: 'Japanese-firm enclave', commitment: '300 ac · announced Nov 2025, allotment opening soon; no allottees yet [V1]' },
          { name: 'Havells India Ltd', sector: 'Wire & cable manufacturing', commitment: '62.09 ac at Vasanthanarasapura Industrial Area — land allotted (allotment May 2016) [V]' },
          { name: 'Toyota', sector: 'Automotive', commitment: 'Land taken inside the Japan Industrial Township [V]' },
          { name: 'Coastal Chrome India', sector: 'Chrome-related products', commitment: 'Land allotted in TMTP (2021) [V]' },
          { name: 'Ace Multi Axes Systems Ltd', sector: 'Multi-axis CNC machines', commitment: 'Land allotted in TMTP (2021) [V]' },
          { name: 'Anupam CNC Machining Pvt Ltd', sector: 'CNC machining', commitment: 'Land allotted in TMTP (2021) [V]' },
          { name: 'Amwin Machining Pvt Ltd', sector: 'Precision machining', commitment: 'Land allotted in TMTP (2021) [V]' },
          { name: 'Advance Cooling', sector: 'Cooling systems', commitment: 'Land allotted in TMTP (2021) [V]' },
          { name: 'Nayak Precisions', sector: 'Precision components', commitment: 'Land allotted in TMTP (2021) [V]' },
          { name: 'Pragati Automation, BFW, Trishul, Ace Designers, Jyoti CNC', sector: 'Machine tools / automation', commitment: 'Expressed interest in TMTP plots — not yet allotted [V1]' },
        ],
        industries: ['Tumakuru Machine Tool Park (530 ac — India’s first integrated machine-tool park)', 'Japan Industrial Township (160 ac, 107 firms incl. Toyota)', 'Japan Industrial Park (300 ac, new — Nov 2025)', 'Precision manufacturing & CNC', 'Auto components', 'Electronics', 'Food products, textiles & pharmaceuticals'],
        infrastructure: [
          '8,500-ac smart city across three phases (JICA study scope 10,096 ac for Phases IV–VI; ₹13,717 cr total project cost). Phase 1 = 1,736.20 ac under construction toward end-2026; land-use ~73% saleable / 27% non-saleable.',
          'A “play-and-plug” model is already operating, offering ready-to-use facilities. By 2018 some 1,722 ac had been acquired against 7,900 ac notified; KIADB had developed ~3,500 ac in the wider Vasanthanarasapura estate.',
          'Infrastructure budget breakdown (JICA): land acquisition ₹4,862 cr, roads ₹1,768 cr, water & effluent ₹3,000 cr, solid-waste ₹1,172 cr, power ₹959 cr, railway ₹140 cr. 99-year KIADB lease at ~₹1.20 cr/acre (escalating 10% a year); TMTP concessional rate ₹1 cr/acre.',
          'NH-48 adjacent; Bengaluru ~120 km (TMTP ~90 km); Kempegowda airport ~115 km; Tumakuru station ~25 km; Mangaluru Port ~300 km. The Dabhol–Bengaluru gas pipeline passes nearby; a dedicated Tumakuru–Davanagere railway line (via Vasanthanarasapura) is planned. No environmental-clearance status was found in sources.',
        ],
        incentives: '“Play-and-plug” ready facilities; TMTP concessional land at ₹1 cr/acre (versus ₹1.20 cr+ elsewhere); 99-year KIADB lease; common engineering, test & certification, incubation and training centres at the Machine Tool Park; reduced 15% corporate tax for qualifying new manufacturers. Karnataka’s machine-tools/aerospace/automotive “Super Mega” incentives apply above the ₹1,000 cr threshold.',
        summary: [
          'Tumakuru is the only CBIC node with operational tenants. Its 530-acre Tumakuru Machine Tool Park — India’s first integrated machine-tool park — is developed with 158 ready-to-build plots, of which 22 (128 acres) have been taken by large companies, and a co-located 160-acre Japan Industrial Township is fully occupied by 107 firms including Toyota. The node therefore extends a live industrial base rather than launching a greenfield bet: Karnataka already accounts for ~52% of India’s machine-tool output and ~62% of exports.',
          'The wider node is an 8,500-acre smart city built in phases, costed by JICA at ₹13,717 crore, with a total investment potential of ₹50,000 crore and ~2,20,000 jobs; Phase 1 alone (1,736 acres) targets ₹7,000 crore and 88,000 jobs. Phase 1 is under construction toward end-2026, and a new 300-acre Japan Industrial Park was announced in November 2025.',
          'Outside the sector parks, anchor tenants for the core node are not yet disclosed — the named momentum sits in the Machine Tool Park, the Japan Industrial Township and a handful of allotments (Havells, Toyota), while the broader region already hosts 1,500-plus operating industries.',
        ],
        sections: [
          { heading: 'The Machine Tool Park and Japanese townships', body: [
            'The node’s operating core is the 530-acre Tumakuru Machine Tool Park, India’s first integrated machine-tool park, developed at ₹508 crore with ₹125 crore equity each from the Centre (Department of Heavy Industries) and Karnataka, and the Indian Machine Tools Manufacturers Association as technical partner. Of its 158 plots, 22 (128 acres) have been taken by large companies — including Coastal Chrome India, Ace Multi Axes Systems, Anupam CNC Machining, Amwin Machining, Advance Cooling and Nayak Precisions — with Pragati Automation, BFW, Trishul, Ace Designers and Jyoti CNC having expressed interest.',
            'Adjacent to the park, a 160-acre Japan Industrial Township is fully occupied by 107 companies, including Toyota; a new 300-acre Japan Industrial Park was announced in November 2025 with allotment opening soon. Havells India holds a separate 62.09-acre allotment in the wider Vasanthanarasapura estate.',
          ] },
          { heading: 'Status and what remains', body: [
            'Phase 1 (1,736 acres) is under construction toward an end-2026 target, with the play-and-plug model already operating. The SPV — CBIC Tumakuru Industrial Township Ltd — was formed on a 50:50 NICDIT:KIADB basis with the shareholders’ and state-support agreements signed on 30 October 2018, and the PM laid the foundation stone in February 2023.',
            'For the core 8,500-acre node, named anchor tenants beyond the sector parks have not been disclosed, and the new 300-acre Japan Industrial Park is yet to allot. Environmental-clearance status was not found in available sources.',
          ] },
          { heading: 'The legacy base', body: [
            'Tumakuru’s strength is its existing industrial fabric. KIADB had developed roughly 3,500 acres at Vasanthanarasapura before the CBIC node, the district hosts 1,500-plus operating industries, and Karnataka leads India in machine tools (~52% of output, ~62% of exports). Three engineering colleges in the district feed a trained workforce, and the Dabhol–Bengaluru gas pipeline runs nearby. This is why the node reads as a deepening of a live cluster rather than a speculative greenfield project.',
          ] },
        ],
        timeline: [
          { date: '2015', label: 'Karnataka Cabinet clears the NIMZ (13,327 ac)' },
          { date: '2016', label: 'JICA master plan completed — ₹13,717 cr project cost' },
          { date: '30 Oct 2018', label: 'SHA & SSA signed; SPV structure finalised' },
          { date: '2021', label: 'Tumakuru Machine Tool Park (530 ac) ready for occupation' },
          { date: 'Feb 2023', label: 'PM Modi lays the foundation stone for the node' },
          { date: 'Nov 2025', label: 'New 300-ac Japan Industrial Park announced' },
          { date: 'End 2026', label: 'Phase 1 (1,736 ac) completion targeted' },
        ],
        sources: [
          { label: 'Indian Express — Tumakuru industrial smart city', url: 'https://indianexpress.com/article/cities/bangalore/invest-karnataka-25-tumakurus-industrial-smart-city-2026-piyush-goyal-9833519/lite/' },
          { label: 'Deccan Herald — India’s first machine-tool park ready', url: 'https://www.deccanherald.com/amp/story/business/india-s-first-machine-tool-park-ready-for-investors-in-karnataka-956526.html' },
          { label: 'JICA — CBIC Tumakuru node development plan (2016)', url: 'https://openjicareport.jica.go.jp/pdf/12249330.pdf' },
          { label: 'YourStory — Tumakuru node / SPV formation', url: 'https://yourstory.com/smbstory/tumakuru-industrial-node-of-the-chennai-bengaluru-industrial-corridor-to-create-more-jobs' },
          { label: 'BookNewProperty — 300-acre Japan Industrial Park (Nov 2025)', url: 'https://booknewproperty.com/news/tumakuru-to-host-300-acre-japan-industrial-park-a-new-growth-vector-for-karnataka/' },
          { label: 'Wire & Cable India — Havells land allotment (KIADB)', url: 'https://www.wirecable.in/tag/kiadb/' },
        ],
      },
      {
        slug: 'krishnapatnam', name: 'Krishnapatnam (KRIS City)', state: 'Andhra Pradesh', stage: 'construction',
        statusLabel: 'Trunk infrastructure under construction; EPC awarded', coords: [212, 425],
        areaAc: 10835, projectCostCr: 2139, investmentCr: 37500, jobs: 515900,
        sectors: 'Textiles, food processing, auto components, electronics, metals, building materials, pharmaceuticals, port-linked manufacturing',
        nearest: 'Krishnapatnam Port adjacent / ~15 km; NH-16 (Chennai–Kolkata) direct; bridges the CBIC and VCIC corridors; Nellore/Tirupati district',
        developer: 'NICDIT Krishnapatnam Industrial City Development Ltd (NKICDL / APICDC) — 50:50 NICDIT : APIIC; incorporated 7 Aug 2018; SHA & SSA signed 29 Nov 2017; GoI equity released ₹533.86 cr.',
        epc: 'Phase-1 trunk-infrastructure EPC awarded at ₹1,173 cr; CCEA Phase-1 budget ₹2,139.43 cr; ~₹350 cr of the ₹1,200 cr provision spent by Mar 2026; Phase-1 completion targeted Feb 2027.',
        companies: [
          { name: 'MSME Krishnapuram Industrial Park (APIIC)', sector: 'MSME estate (separate, smaller APIIC park)', commitment: '23.68 ac · 100 of 120 plots allotted (10.02 ac); land cost ₹6,968/sq m — individual allottee names not disclosed [V]' },
          { name: 'Petrogas Private Limited', sector: 'LNG regasification terminal (5 MTPA, expandable to 10)', commitment: '~₹3,000 cr ($500m) · 500+ jobs — MoU at Krishnapatnam Port, Jan 2016; port-specific and pre-dates KRIS City [V]' },
          { name: 'Tillman Global Holdings', sector: 'Hyperscale data centre (300 MW)', commitment: '~₹1,50,000 cr — MoU at CII Partnership Summit, Nov 2025; state-level, not confirmed within the node boundary [V1]' },
          { name: 'ArcelorMittal', sector: 'Steel manufacturing', commitment: 'Foundation laid, under construction in the broader Krishnapatnam region; specific allotment within KRIS City not confirmed [V]' },
          { name: 'ISMT Ltd', sector: 'Special-steel manufacturing', commitment: 'Operational in the broader region — adjacent base, not a confirmed node allottee [V]' },
          { name: 'Krishnapatnam Port (KPCL / Adani Group)', sector: 'Port & logistics', commitment: 'Operational; major east-coast port acquired by Adani in 2021 — the node’s anchor logistics asset [V]' },
        ],
        industries: ['Port-linked manufacturing', 'Steel & metals (ArcelorMittal, ISMT)', 'Textiles', 'Food processing', 'Auto components', 'Electronics & building materials', 'Shipbuilding (proposed Dugarajapatnam cluster)'],
        infrastructure: [
          'Master-plan area ~10,834.5 ac (also cited 12,798 ac), phased 2,500 + 4,133 + 4,201 ac; ~5,500 ac to be industrial by 2040 with 16 residential zones and a ~2,91,000 resident population. Environmental clearance obtained; master planning and preliminary engineering completed for the ~2,500-ac activation area.',
          'APIIC’s KPI portal records 4,855.44 ac net area under the SPV with 0 plots allotted in the core node (classified “vacant but unallottable”); 2,139.15 ac had been transferred to the SPV by 2023. The only allotments sit in the separate MSME Krishnapuram park.',
          'Phase-1 trunk infrastructure (roads, underground drainage, power, sewage-treatment plants and ICT) is under construction: EPC awarded at ₹1,173 cr, ~₹350 cr of the ₹1,200 cr provision spent by March 2026, completion targeted February 2027 and key milestones by 2028.',
          'NH-16 direct access; the Adani-run Krishnapatnam Port sits adjacent (~15 km); the node uniquely bridges the CBIC and VCIC corridors. Nearest-airport and rail-link details were not found in sources.',
        ],
        incentives: 'Port-proximity export advantage and NH-16 access; state-funded trunk infrastructure (₹1,200 cr Phase-1 provision); smart-city design with 16 residential zones and integrated social infrastructure. The AP Maritime Policy offers up to 25% capital subsidy, 100% SGST reimbursement for 10 years (plus 20% on the first five ships), a PLI covering up to 25% of costs, stamp-duty and electricity-duty exemptions and single-window clearance for port-linked and shipbuilding units.',
        summary: [
          'Krishnapatnam — branded KRIS City — is Andhra Pradesh’s flagship port-linked CBIC node, built beside the Adani-run Krishnapatnam Port and uniquely bridging the CBIC and VCIC corridors. The SPV (NKICDL, a 50:50 NICDIT–APIIC venture) was incorporated on 7 August 2018, environmental clearance is in hand and master planning is complete for the ~2,500-acre activation area.',
          'The node is firmly in the trunk-infrastructure phase. The Union Cabinet approved it on 30 December 2020, the PM laid the foundation stone in January 2025, the Phase-1 EPC was awarded at ₹1,173 crore, and about ₹350 crore of the ₹1,200 crore provision had been spent by March 2026, with completion targeted for February 2027. Total investment potential is put at ₹37,500 crore and employment at ~5,15,900 jobs by 2040.',
          'No core-node tenants are yet disclosed: APIIC’s portal records zero plots allotted across the 4,855-acre node, with the only allotments sitting in the separate MSME Krishnapuram park. The named commitments — Petrogas’s 2016 port LNG terminal, a Tillman 300 MW data centre and steelmakers ArcelorMittal and ISMT — are either port-specific, state-level MoUs or regional plants not confirmed inside the SPV boundary.',
        ],
        sections: [
          { heading: 'Status and what is built', body: [
            'KRIS City has cleared its planning gates — Cabinet approval (December 2020), environmental clearance, and a completed master plan for the activation area — and is now executing Phase-1 trunk works. The EPC contract is awarded at ₹1,173 crore against a CCEA Phase-1 budget of ₹2,139.43 crore, roughly ₹350 crore of the ₹1,200 crore provision had been spent by March 2026, and Phase-1 completion is targeted for February 2027 with broader milestones by 2028.',
            'The node’s headline numbers — ~10,834.5 acres master-planned, ~5,500 acres industrial by 2040, ₹37,500 crore investment potential and ~5,15,900 jobs — make it the corridor’s largest port-linked bet, but they remain potential until land allotment to industries begins.',
          ] },
          { heading: 'The tenant question', body: [
            'APIIC’s public KPI portal shows 0 plots allotted across the 4,855-acre core node, the entire area still classified “vacant but unallottable”; 2,139.15 acres had been transferred to the SPV by 2023. The only recorded allotments are in the adjacent MSME Krishnapuram Industrial Park (23.68 acres, 100 of 120 plots taken), whose individual occupants are not disclosed.',
            'Named investment around the node should be read with care. Petrogas’s ~₹3,000 crore LNG terminal is a 2016 port-specific MoU pre-dating KRIS City; Tillman Global’s ~₹1,50,000 crore 300 MW data centre is a November 2025 CII-Summit MoU at state level, not confirmed inside the node; and ArcelorMittal (foundation laid) and ISMT are regional plants whose land within the SPV is not confirmed.',
          ] },
          { heading: 'The regional anchor and maritime play', body: [
            'The node’s real catalyst is the Adani-operated Krishnapatnam Port next door, giving export-oriented manufacturers direct sea access on the NH-16 axis. The wider region already runs on steel (ArcelorMittal under construction, ISMT operational) and the AP Maritime Policy is steering a proposed mega shipbuilding cluster at Dugarajapatnam, with the supporting SPV still under discussion with the Centre.',
          ] },
        ],
        timeline: [
          { date: '29 Nov 2017', label: 'Shareholders’ & state-support agreements signed' },
          { date: '7 Aug 2018', label: 'SPV (NKICDL) incorporated' },
          { date: '30 Dec 2020', label: 'Union Cabinet approval' },
          { date: '2023', label: '2,139.15 ac transferred to SPV; GoI equity ₹533.86 cr released' },
          { date: '8 Jan 2025', label: 'PM Modi lays the foundation stone (virtually); EPC awarded ₹1,173 cr' },
          { date: 'Mar 2026', label: '~₹350 cr of the ₹1,200 cr Phase-1 provision spent' },
          { date: 'Feb 2027', label: 'Phase-1 completion targeted (milestones by 2028)' },
        ],
        sources: [
          { label: 'KRIS City — APICDC (about / land-use plans)', url: 'https://apicdc.in/about-kriscity/' },
          { label: 'The Hans India — PM lays stone for KRIS City (Jan 2025)', url: 'https://www.thehansindia.com/amp/andhra-pradesh/pm-modi-virtually-lays-stone-for-kris-city-from-visakhapatnam-936063' },
          { label: 'PIB — NICDIT projects status (PRID 1897398, Feb 2023)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1897398&reg=3&lang=2' },
          { label: 'Times of India — ₹350 cr spent, KRIS City fast-tracked (Mar 2026)', url: 'https://timesofindia.indiatimes.com/city/vijayawada/rs-350-crore-spent-as-ap-govt-fast-tracks-kris-city-industrial-hub/articleshowprint/129869677.cms' },
          { label: 'Business Standard — Petrogas LNG terminal MoU (Jan 2016)', url: 'https://www.business-standard.com/amp/article/news-ians/mou-signed-for-rs-3-000-crore-lng-terminal-at-krishnapatnam-port-116011100709_1.html' },
          { label: 'Rajya Sabha — Unstarred Q.1190 (industrial corridors, Dec 2022)', url: 'https://sansad.in/getFile/annex/258/AU1190.pdf?source=pqars' },
        ],
      },
      {
        slug: 'ponneri', name: 'Ponneri node (Engineering Hub)', state: 'Tamil Nadu', stage: 'planned',
        statusLabel: 'Master planning; land acquisition stalled', coords: [214, 440],
        areaAc: 21966, projectCostCr: 32713,
        sectors: 'Auto & components, chemicals & petrochemicals, machinery, computer/electronic/optical components, metallurgy, electrical machinery, textiles & apparel, pharmaceuticals, medical equipment',
        nearest: 'Ennore (Kamarajar) Port within the node boundary; Chennai Port ~20 km; Chennai city ~36 km; Chennai airport ~50 km; Kattupalli Port adjacent',
        developer: 'CBIC Ponneri Industrial Township Ltd (incorporated 30 Jul 2020) — a NICDIT–Tamil Nadu joint venture; SHA & SSA executed; land delineation/acquisition by TIDCO, internal development by the SPV. Shareholding pattern not disclosed.',
        epc: 'No EPC tender issued (as of the Sep 2022 NICDC DMU report); a consultant is appointed for detailed master planning & preliminary engineering over 4,000 ac. Pre-construction.',
        companies: [
          { name: 'Chennai Power Generation (Indian–UK JV)', sector: '750 MW RLNG-based power generation', commitment: '~₹3,000 cr — state-level MoU referencing Ponneri (May 2020); not a confirmed allotment inside the node [V]' },
          { name: 'TJR Precision Technology', sector: 'Precision-components manufacturing', commitment: 'MoU (May 2020) at “Origins by Mahindra World City, Ponneri”, a private park — not the CBIC greenfield node [V]' },
          { name: 'APM Terminals India (Maersk)', sector: 'Container freight station / logistics', commitment: 'Operates the CFS Division, Ponneri; new + upgraded warehouse EPC awarded to Sathlokhar Synergys (₹23.57 cr of a ₹37.57 cr order), Feb 2026 — outside the formal node [V]' },
          { name: 'Manali Petrochemicals / CPCL', sector: 'Petrochemicals & refining', commitment: 'Operational at Manali, within / adjacent to the 530-ac Manali parcel identified for the node — legacy regional base [V]' },
          { name: 'Coromandel International, L&T Shipbuilding (Kattupalli)', sector: 'Fertilisers / shipbuilding', commitment: 'Operational near the Ennore–Kattupalli port belt — adjacent industrial base, not node allottees [V]' },
        ],
        industries: ['Automobiles & auto components (“Engineering Hub for Auto & Machinery”)', 'Chemicals & petrochemicals', 'Machinery & electronics', 'Metallurgy & electrical machinery', 'Textiles, apparel & pharmaceuticals', 'Port-linked manufacturing & logistics'],
        infrastructure: [
          'Total node ~21,966 ac (89 sq km), of which ~13,581 ac (55 sq km) is greenfield developable (residential ~2,213 ac; other uses ~2,198 ac; balance ~9,170 ac). The JICA master plan (2015) costs development at ₹32,713 cr ($5,452m) and projects a 2025 node population of ~1.29 million (~8,88,074 working, ~4,00,000 residential).',
          'The node is stalled at land confirmation. Parcels were identified at Katur (600 ac), Manali (530 ac) and Manellore (2,300 ac), but the 2,300-ac Manellore parcel was withdrawn in July 2022 owing to immediate demand for allotment to other industries; by September 2022 the state had notified only ~3,375 ac and was still to confirm alternate unencumbered, contiguous land. As of 2015 some 9,133 ac remained to be acquired.',
          'Ennore (Kamarajar) Port lies within the boundary; Chennai Port is ~20 km, Chennai airport ~50 km and Chennai city ~36 km, with Kattupalli Port adjacent. Planned external works include a Northern Port Access Road and rail links to Ennore Port (off the Chennai–Gudur line) and an Avadi–Guduvancherry corridor. Environmental-clearance status, plot sizes and land prices were not found in sources.',
        ],
        incentives: 'Tiruvallur is a “B”-category district, so industrial-park developers qualify for a 12% capital subsidy on internal infrastructure and SIPCOT-park units get a 50% stamp-duty concession; the TN industrial policy also offers 5% interest subvention for six years, five-year electricity-tax exemption and SGST refund on capital goods. The TN EV Policy 2023 is especially relevant given the auto/electronics target sectors — 100% SGST reimbursement on EV sales for 15 years, a 20% capital subsidy for EV-battery/ACC plants, and 100% electricity-tax and stamp-duty exemptions (minimum ₹50 cr investment and 50 jobs).',
        summary: [
          'Ponneri is the corridor’s largest planned node — ~21,966 acres, with ~13,581 acres of greenfield land — conceived in the JICA master plan as an “Engineering Hub for Auto & Machinery” at a development cost of ₹32,713 crore, 36 km from Chennai with Ennore Port inside its boundary. On paper it would house a 2025 node population of roughly 1.29 million.',
          'In practice the node is stalled at land confirmation. The SPV (CBIC Ponneri Industrial Township Ltd) was incorporated on 30 July 2020 and a consultant appointed for 4,000 acres of master planning, but the 2,300-acre Manellore parcel was withdrawn in July 2022, only ~3,375 acres had been notified by September 2022, and roughly 9,133 acres remained unacquired. No EPC tender has been issued and construction has not begun.',
          'No anchor tenants or MoUs exist for the core node. The only Ponneri-referenced commitments sit outside the greenfield boundary — a 2020 state-level MoU for a 750 MW RLNG power plant, a precision-components MoU inside the private Mahindra World City park, and an APM Terminals (Maersk) container-freight facility in the existing CFS area — alongside a legacy petrochemical and port base at Manali, Ennore and Kattupalli.',
        ],
        sections: [
          { heading: 'A large plan held up by land', body: [
            'Ponneri’s master plan is ambitious: ~21,966 acres total, ~13,581 acres greenfield, ₹32,713 crore of planned development and a projected 1.29 million node population by 2025, anchored by Ennore Port within the boundary and Chennai’s automotive cluster 36 km away. The SPV was formed on 30 July 2020 with the shareholders’ and state-support agreements executed and a consultant appointed for detailed master planning over 4,000 acres.',
            'But the project is stuck before construction. Three parcels were assessed — Katur (600 ac), Manali (530 ac) and Manellore (2,300 ac) — and the largest, Manellore, was withdrawn in July 2022 because of immediate demand to allot the land to other industries. By September 2022 the state had notified only about 3,375 acres and was still required to confirm alternate unencumbered, contiguous land; roughly 9,133 acres remained to be acquired. No EPC tender has been issued.',
          ] },
          { heading: 'No core-node tenants', body: [
            'No named anchor tenants, allottees or signed MoUs exist for the core CBIC node. The commitments that do reference Ponneri sit outside the greenfield boundary: a 2020 state-level MoU for a ~₹3,000 crore 750 MW RLNG power plant (Chennai Power Generation); a TJR Precision Technology MoU located inside the private “Origins by Mahindra World City, Ponneri” park; and an APM Terminals (Maersk) warehouse contract (Feb 2026) at the existing Ponneri CFS Division. None is a confirmed allotment within the node.',
          ] },
          { heading: 'The legacy port-and-petrochemical base', body: [
            'What Ponneri does have is an established industrial belt around it: the Ennore (Kamarajar) and Kattupalli ports, the Manali petrochemical cluster (Manali Petrochemicals, CPCL) on one of the identified parcels, Coromandel International near Ennore and the wider Chennai auto and electronics ecosystem. This is the base the node is meant to formalise into an engineering hub once land is secured.',
          ] },
          { heading: 'Risks and open questions', body: [
            'The node has not received CCEA trunk-infrastructure approval (unlike Tumakuru and Krishnapatnam), no environmental clearance was found, land acquisition is unresolved after the Manellore withdrawal, and no EPC or construction has started. Investment-potential and employment figures, plot sizes and land prices are all absent from sources — so for now Ponneri remains a large master plan rather than an investable node.',
          ] },
        ],
        timeline: [
          { date: '2015', label: 'JICA master plan completed (~22,000 ac, ₹32,713 cr)' },
          { date: '30 Jul 2020', label: 'SPV (CBIC Ponneri Industrial Township Ltd) incorporated' },
          { date: 'Feb 2022', label: 'Consultant presents assessment of three land parcels' },
          { date: '7 Jul 2022', label: 'Manellore parcel (2,300 ac) withdrawn' },
          { date: 'Sep 2022', label: '~3,375 ac notified; EPC not issued; alternate land pending' },
        ],
        sources: [
          { label: 'NICDC — DMU report (September 2022)', url: 'https://nicdc.in/images/documents/DMU_report_of_Setember_2022_NICDC.pdf' },
          { label: 'DPIIT — details of the three CBIC nodes', url: 'https://dipp.gov.in/sites/default/files/Details_of_three_CBIC_Node.pdf' },
          { label: 'The New Indian Express — Ponneri smart city (Sep 2015)', url: 'https://www.newindianexpress.com/states/tamil-nadu/2015/Sep/25/ponneri-smart-city-to-house-4-lakh-on-22000-acres-819961.html' },
          { label: 'ST Telemedia GDC — TN MoUs incl. Ponneri references (May 2020)', url: 'https://www.sttelemediagdc.com/resources/tamilnadu-signs-mou-17-foreign-investors' },
          { label: 'JICA — CBIC financing & access infrastructure report', url: 'https://openjicareport.jica.go.jp/pdf/12249322.pdf' },
        ],
      }
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
        statusLabel: 'NICDP node on hold — a steel-belt land bank with no SPV and no confirmed Phase-I land', coords: [295, 331],
        areaAc: 4748,
        sectors: 'Steel & downstream metals, metal fabrication & engineering, electronics components, ancillary industries, port-linked logistics, IT/ITeS',
        nearest: 'NH-16 (Golden Quadrilateral) backbone; Bhubaneswar airport and rail within the Khurda cluster; Gopalpur all-weather port at the southern end; Kalinganagar steel hub (Jajpur) as the core cluster',
        developer: 'NICDC (renamed Feb 2020 from DMICDC) with NICDIT (established Dec 2016) on the central side and the Government of Odisha (Industries Department / IDCO) as state counterpart. The exact NICDC–Odisha SPV name, Centre:State shareholding and incorporation date were not found in any source. ADB prepared the OEC Concept Development Plan; a consultant was appointed for GBK & PKDS master planning by Jan 2023, but the state had not confirmed Phase-I land parcels in Khorda (Khurda) district as of that report. The node is absent from a formed-SPV, broken-ground status.',
        companies: [
          { name: 'Tata Steel (Kalinganagar)', sector: 'Steel manufacturing (~6 MTPA)', commitment: 'Operational legacy plant in the Kalinganagar cluster — predates the GBK designation, not a GBK allottee [V1]' },
          { name: 'Jindal Stainless (JSL)', sector: 'Stainless steel', commitment: 'Operational at Kalinganagar; part of the ~1.5 lakh-direct-jobs NIMZ base — legacy, not a GBK allottee [V1]' },
          { name: 'Visa Steel', sector: 'Steel manufacturing', commitment: 'Operational at Kalinganagar — legacy industrial base, not a GBK allottee [V1]' },
          { name: 'MESCO Steel', sector: 'Steel manufacturing', commitment: 'Operational at Kalinganagar — legacy base, not a GBK allottee [V1]' },
          { name: 'Neelachal Ispat Nigam Ltd (NINL)', sector: 'Steel manufacturing', commitment: 'Operational at Kalinganagar — legacy base, not a GBK allottee [V1]' },
          { name: 'Tata Steel (Gopalpur Multi-Product SEZ)', sector: 'Multi-product SEZ', commitment: 'Distinct Gopalpur SEZ facility within the GBK footprint — legacy/proposed, not a GBK node allottee [V1]' },
          { name: 'Jindal Steel Odisha Ltd (JSOL)', sector: 'Steel plant (19.2 MTPA)', commitment: '~461 ac land-allotment permission granted Sep 2023 — but in Angul district, OUTSIDE the GBK districts; context only [V1]' },
        ],
        industries: ['Steel & downstream metal products (Kalinganagar anchor)', 'Metal fabrication & engineering', 'Electronics component manufacturing (new 2025 state policy)', 'Ancillary & support industries', 'Port-linked logistics & warehousing (Gopalpur)', 'IT/ITeS (Bhubaneswar belt)'],
        infrastructure: [
          'GBK is not a single contiguous area but six clusters across Ganjam, Khurda, Cuttack and Jajpur districts — NICDC lists 4,748 acres (2026), while 2020 reports cited 6,153 acres across six clusters; the discrepancy is unresolved and treated as a possible Phase-I-only figure [D].',
          'NH-16 (Golden Quadrilateral) is the corridor backbone; the broader OEC runs ~600 km along NH-16. The node bundles three existing bases — Gopalpur industrial area (with Gopalpur port, Ganjam), Bhubaneswar industrial belt (Khurda) and the Kalinganagar steel hub (Jajpur).',
          'Land readiness is the binding constraint: the NICDC DMU report (Jan 2023) records that the state had not confirmed Phase-I land parcels in Khorda district, and a salt-land suitability study (decision 10 Aug 2022) was still in progress; as late as the Apr 2025 DMU report NICDC was still requesting land details from the state.',
          'No ADB civil works, no DPR, no environmental clearance and no master-plan approval could be confirmed for GBK; the node has not reached EPC/construction stage.',
        ],
        incentives: 'No node-specific GBK/OEC incentive framework was found — the OEC remains in pre-development, and incentives may follow SPV formation and DPR approval. Statewide Odisha policies apply: the Electronics Component Manufacturing Policy-2025 (50% capital subsidy for the first ten large-scale projects, 35% thereafter, 10-year electricity-duty exemption, power-tariff reimbursement, plus mega-project concessions for projects above ₹500 cr or 1,000+ jobs) and the IT Policy-2025 (30% capital subsidy with no investment ceiling, interest subsidy, SGST reimbursement, utility waivers, a 1-million-jobs target).',
        summary: [
          'GBK is the southern of the OEC’s two priority node-zones — six clusters across four districts along NH-16, anchored on Odisha’s Kalinganagar steel belt — but for the NICDP programme it remains a land bank rather than a project: no formed SPV name on record, no confirmed Phase-I land, no DPR, no environmental clearance and no ADB trunk works.',
          'The headline 2020-era numbers — ~₹81,000 cr investment, ₹4 lakh crore of output and 8 lakh direct jobs by 2025 — were targets that available sources do not confirm as achieved; 2025 has passed and they should be read as outdated projections, not pipeline. NICDC’s own area figure (4,748 ac) is already well below the 2020 reports (6,153 ac), pointing to a possible scope reduction.',
          'The real industry here is the operating steel economy at Kalinganagar — Tata Steel, Jindal Stainless, Visa Steel, MESCO and NINL — but these are legacy state-led plants that predate and sit adjacent to the proposed GBK node, not NICDC allottees. No named anchor tenant, allottee or MoU signatory specific to the GBK node was identified as of mid-2026.',
        ],
        sections: [
          { heading: 'A land bank, not a project', body: [
            'NICDIT approved the OEC’s inclusion in the NICDP on 19 August 2020, with GBK and PKDS as its two priority node-zones and ADB preparing the concept development plan. A consultant was appointed for detailed master planning of both nodes by January 2023.',
            'But the node has not advanced past planning. The NICDC DMU report of January 2023 records that the state government was yet to confirm the land parcels for Phase-I development in Khorda district, and that a study of the suitability of salt lands had been commissioned. By the April 2025 DMU report NICDC was still requesting land details from the state. There is no recorded SPV name, DPR, environmental clearance or master-plan approval for GBK, and no construction has begun.',
          ] },
          { heading: 'The Kalinganagar steel base — context, not corridor delivery', body: [
            'The GBK footprint overlaps Odisha’s most industrialised belt. The Kalinganagar complex — described in profile documents as ~160 sq km (~40,000 ac) with a ~₹6,500 cr project cost and ~1.5 lakh direct jobs targeted — hosts Tata Steel, Jindal Stainless, Visa Steel, MESCO and NINL, with a separate Tata Steel multi-product SEZ at Gopalpur.',
            'These are operating, state-led plants that predate the 2020 GBK designation; no source links them to the NICDC node as allottees. They illustrate the legacy base the node hopes to integrate, not corridor delivery. A more recent Jindal Steel Odisha Ltd allotment (~461 ac, Sep 2023) sits in Angul district, outside the four GBK districts, and is context only.',
          ] },
          { heading: 'Risks & open questions', body: [
            'The gaps are fundamental and unchanged since 2020: land for Phase I is not confirmed, salt-land suitability is unresolved, and no milestone has been achieved since approval. The exact SPV name, Centre:State shareholding, incorporation date, DPR status, project cost, land price and environmental clearance were all not found in available sources.',
            'No named anchor investor exists for the GBK node. Whether the state confirms land and the node is taken forward into active development — or remains a paper node beside a thriving but separate steel economy — is the open question.',
          ] },
        ],
        timeline: [
          { date: 'Aug 19, 2020', label: 'NICDIT approves OEC inclusion in the NICDP (GBK + PKDS nodes)' },
          { date: 'Aug 10, 2022', label: 'Salt-land suitability study commissioned for GBK Phase-I land' },
          { date: 'Jan 2023', label: 'NICDC DMU report: state yet to confirm Phase-I land parcels in Khorda' },
          { date: 'Apr 2025', label: 'NICDC still requesting land-parcel details from the state' },
          { date: 'Aug 2025', label: 'Odisha approves IT Policy-2025 and Electronics Component Manufacturing Policy-2025 (statewide)' },
        ],
        sources: [
          { label: 'NICDC — Odisha Economic Corridor (OEC) page', url: 'https://www.nicdc.in/index.php/odisha-economic-corridor-oec.html' },
          { label: 'NICDC — DMU Report January 2023 (PDF)', url: 'https://nicdc.in/images/documents/DMU_report_January_2023.pdf' },
          { label: 'NICDC — DMU Report 30 April 2025 (PDF)', url: 'https://nicdc.in/images/documents/DMU_Report_30_Apr_2025.pdf' },
          { label: 'PIB — Cabinet release on NICDC/NICDIT history (Aug 2024)', url: 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2024/aug/doc2024830383401.pdf' },
          { label: 'Odisha Diary — OEC inclusion approved', url: 'https://orissadiary.com/inclusion-of-odisha-economic-corridor-under-the-national-industrial-corridor-development-program-approved/' },
          { label: 'OrissaPOST — Odisha clears new IT & electronics policies (2025)', url: 'https://www.orissapost.com/odisha-clears-new-it-electronics-manufacturing-policies/' },
          { label: 'CAG Odisha Report No. 5 of 2013 — IDCO land allotments', url: 'https://saiindia.gov.in/uploads/download_audit_report/2013/Odisha_Report_5_2013_para_2.1.pdf' },
        ],
      },
{
        slug: 'pkds', name: 'PKDS Zone (Paradip–Kendrapada–Dhamra–Subarnarekha)', state: 'Odisha', stage: 'planned',
        statusLabel: 'NICDP node on hold — but a ₹65,000 cr-plus IOCL bet is landing on the coast around it', coords: [306, 330],
        areaAc: 6618,
        sectors: 'Petrochemicals & downstream, ports & logistics, fertilizers & chemicals, plastics & polymers, technical textiles, fishing & marine processing, warehousing/MMLP',
        nearest: 'NH-16 (Golden Quadrilateral) backbone; Paradip major port (145.38 MT, FY2023-24) and Dhamra non-major port within the node; new Rameshwar–Paradeep coastal highway (160.18 km) approved Jun 2026; rail to Paradip/Dhamra under NPG review',
        developer: 'NICDC with NICDIT centrally and the Government of Odisha (Industries Department / IDCO) on the state side. The NICDC–Odisha SPV name, Centre:State shareholding and incorporation date were not found in any source. ADB prepared the OEC Concept Development Plan; NICDC describes PKDS project-development activities as "initiated", but no confirmed Phase-I land acquisition, DPR, environmental clearance or master-plan approval was found. IDCO is acquiring land in mission-mode in the Paradip (Jagatsinghpur) and Dhamara (Bhadrak/Balasore) regions under a ₹1,000 cr land-bank grant (May 2025).',
        companies: [
          { name: 'Indian Oil Corporation Ltd (IOCL) — Paradip naphtha cracker', sector: 'Petrochemicals — naphtha cracker', commitment: '₹61,000 cr · Paradip (Jagatsinghpur) — in-principle approved (Dec 2024), MoU scheduled at the Utkarsh Odisha / Make in Odisha 2025 summit (Jan 2025); state to be an equity holder; no formal land allotment confirmed [V]' },
          { name: 'Indian Oil Corporation Ltd (IOCL) — Bhadrak yarn project', sector: 'Textiles — yarn / polyester manufacturing', commitment: '₹4,352 cr · Bhadrak — foundation stone / MoU announced Dec 2024; anchors a Technical Textiles Park (300 KTPA polyester); no formal land allotment confirmed [V]' },
          { name: 'Indian Strategic Petroleum Reserves Ltd (ISPRL)', sector: 'Strategic petroleum reserves', commitment: 'MoU announced at the CM’s Delhi summit (Apr 2025); exact Odisha location unspecified — petrochemical-sector fit suggests PKDS but unverified [V1]' },
          { name: 'Petronet LNG', sector: 'LNG infrastructure', commitment: 'MoU announced Apr 2025; exact Odisha location unspecified — potential PKDS-linked LNG investment, location to be confirmed [V1]' },
          { name: 'IOCL Paradip Refinery', sector: 'Petroleum refining (15 MMTPA)', commitment: 'Operational refinery in the Paradip PCPIR — legacy base; a further expansion is part of IOCL’s ~₹1 lakh cr Odisha plan; not a PKDS node allottee [V]' },
        ],
        industries: ['Petrochemicals & downstream (Paradip PCPIR anchor)', 'Ports & logistics (Paradip major port + Dhamra)', 'Fertilizers & chemicals (IOCL, IFFCO, Paradip Phosphates)', 'Plastics & polymer processing (Plastics Park)', 'Technical textiles (Bhadrak)', 'Fishing & marine processing', 'Warehousing & multi-modal logistics (Jagatsinghpur MMLP)'],
        infrastructure: [
          'PKDS is not a single contiguous area but eight coastal clusters across Jagatsinghpur, Kendrapada, Bhadrak and Balasore districts — NICDC lists 6,618 acres (2026), against 10,558 acres in 2020 reports (a ~38% reduction), treated as an unresolved discrepancy and likely a Phase-I-only figure [D].',
          'It is the OEC’s strongest-infrastructure node: Paradip (a GoI major port handling 145.38 MT in FY2023-24) and Dhamra (a non-major port, part of the 54.24 MT non-major total) sit inside it, with Subarnarekha, Astarang, Chudamani and Jatadhar Muhan ports under construction in the influence zone.',
          'NH-16 (Golden Quadrilateral) is the road backbone; the CCEA-approved Rameshwar–Paradeep coastal highway (160.18 km, ₹8,300.79 cr, Jun 2026) will connect 9 economic and 5 logistic nodes including Paradip and Astarang ports and a Jagatsinghpur MMLP. Rail links to Paradip and Dhamra were reviewed by the NPG (82nd meeting, Oct 2024).',
          'The node leans on a deep legacy base — the Paradip PCPIR (hosting the 15 MMTPA IOCL refinery), the Dhamra Special Investment Region and a Plastics Park SPV — but no confirmed PKDS Phase-I land acquisition, DPR or environmental clearance was found; project development is described only as "initiated".',
        ],
        incentives: 'No node-specific PKDS/OEC incentive framework was found; the OEC is pre-development, with incentives expected after SPV formation and DPR approval. Statewide policies apply (IT Policy-2025 and Electronics Component Manufacturing Policy-2025), alongside Sagarmala port-led-development funding from the Ministry of Ports, Shipping and Waterways. IDCO provides industrial land, backed by a ₹1,000 cr land-bank grant (May 2025) for mission-mode acquisition in the Paradip and Dhamara regions; specific concession rates and land prices were not found.',
        summary: [
          'PKDS is the northern, port-led node-zone of the OEC — eight coastal clusters around Paradip and Dhamra, with the strongest existing infrastructure of any Odisha corridor node: a 145 MT major port, a 15 MMTPA IOCL refinery, the PCPIR, and a new ₹8,300 cr coastal highway approved in June 2026. Yet the NICDP node itself remains on hold: no recorded SPV name, no confirmed Phase-I land, no DPR and no environmental clearance.',
          'The momentum, as at Donakonda on the VCIC, has shifted onto the land around the node rather than the node proper. In December 2024 IOCL committed to a ₹61,000 cr naphtha cracker at Paradip — with the state government to take an equity stake — plus a ₹4,352 cr yarn project at Bhadrak, ₹65,352 cr of named investment in total. Both are at MoU / in-principle stage with no formal land allotment confirmed, but they are the corridor’s first real anchor commitments.',
          'The older programme numbers — ~₹81,000 cr, ₹4 lakh crore output and 8 lakh jobs by 2025 — are outdated 2020 targets that sources do not confirm. And NICDC’s 6,618-acre figure is well below the 2020 reports’ 10,558 acres, suggesting a meaningful scope reduction.',
        ],
        sections: [
          { heading: 'The IOCL anchor — investment landing beside the node', body: [
            'The single most important development for PKDS is not a NICDC allotment. In December 2024 IOCL announced a ₹61,000 cr naphtha cracker at Paradip, with the Odisha government set to be an equity holder earning dividends on top of taxes, and a ₹4,352 cr yarn/polyester project at Bhadrak that would anchor a Technical Textiles Park (300 KTPA polyester). The MoUs were scheduled for the Utkarsh Odisha / Make in Odisha 2025 summit in January 2025.',
            'Both projects sit squarely within the PKDS districts (Paradip in Jagatsinghpur, the yarn plant in Bhadrak), but neither has a confirmed formal land allotment or lease deed in the available sources — they are MoU/in-principle commitments. IOCL’s wider Odisha plan, including a refinery expansion, is reported at roughly ₹1 lakh crore. Further MoUs with ISPRL and Petronet LNG were announced at the CM’s April 2025 Delhi summit, but their exact Odisha locations were not specified.',
          ] },
          { heading: 'A port-led legacy base', body: [
            'PKDS encompasses Odisha’s coastal industrial spine. Paradip is a GoI major port (145.38 MT, FY2023-24) hosting the IOCL refinery, the PCPIR, fertilizer plants and a Plastics Park; Dhamra is an operational non-major port with a Special Investment Region and a 5,000+ acre port-based industrial complex. Subarnarekha, Astarang, Chudamani and Jatadhar Muhan ports are under construction in the zone.',
            'These pre-existing facilities are not PKDS node allottees — they predate the 2020 designation — but they make PKDS the most investable of Odisha’s corridor nodes. Odisha-wide, IDCO runs 126 operational industrial estates over 11,623+ acres, and the June 2026 coastal highway and Sagarmala port projects (53 in Odisha, ₹54,000+ cr) strengthen the connectivity case.',
          ] },
          { heading: 'Risks & open questions', body: [
            'For the NICDP node itself the gaps remain: project development is only "initiated", Phase-I land is not confirmed, and the SPV name, shareholding, incorporation date, DPR status, project cost, environmental clearance and node-specific incentives were all not found. The 38% area reduction (10,558 to 6,618 acres) is unexplained, and four of the eight clusters are still to be identified.',
            'The IOCL commitments are real but at MoU stage — whether they convert to executed lease deeds, and whether the state confirms PKDS Phase-I land in mission-mode, will determine if the node moves from infrastructure-on-paper to delivery. Coastal regulation-zone clearances are an additional, undocumented risk for port-centric industrialisation.',
          ] },
        ],
        timeline: [
          { date: 'Sep 2020', label: 'NICDIT approves OEC inclusion (PKDS node — 10,558 ac / 8 clusters announced)' },
          { date: 'Aug 2023', label: 'OEC confirmed within the NICDP; ₹9,899.89 cr sanctioned nationally (not OEC-specific)' },
          { date: 'Oct 2024', label: 'NPG reviews rail connectivity to Paradip & Dhamra ports' },
          { date: 'Dec 2024', label: 'IOCL announces ₹61,000 cr Paradip naphtha cracker + ₹4,352 cr Bhadrak yarn project' },
          { date: 'May 2025', label: 'IDCO directed into mission-mode land acquisition; ₹1,000 cr land-bank grant' },
          { date: 'Jun 2026', label: 'CCEA approves Rameshwar–Paradeep coastal highway (160.18 km, ₹8,300.79 cr)' },
        ],
        sources: [
          { label: 'NICDC — Odisha Economic Corridor (OEC) page', url: 'https://www.nicdc.in/index.php/odisha-economic-corridor-oec.html' },
          { label: 'OTV News — IOCL ₹61,000 cr naphtha cracker + Bhadrak yarn project', url: 'https://odishatv.in/news/odisha/indian-oil-corp-to-invest-rs-61k-crore-naphtha-cracker-project-in-odisha-251877' },
          { label: 'Business Standard — IOCL naphtha cracker, MoU at Make in Odisha 2025', url: 'https://www.business-standard.com/amp/companies/news/ioc-to-invest-rs-61-000-crore-for-naphtha-cracker-project-in-odisha-124122400994_1.html' },
          { label: 'Utkarsh Odisha 2025 — Integrated Infrastructure (PCPIR, Dhamra SIR, parks)', url: 'https://www.mio.investodisha.gov.in/integrated-infrastructure.php' },
          { label: 'PIB — Ports Development in Odisha (Dec 2024)', url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2085503' },
          { label: 'PIB — CCEA approval, Rameshwar–Paradeep coastal highway (Jun 2026)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2268347&reg=3&lang=1' },
          { label: 'The New Indian Express — IDCO mission-mode land acquisition', url: 'https://www.newindianexpress.com/states/odisha/2025/May/09/idco-to-acquire-land-in-odishas-key-districts-for-smooth-grounding-of-projects' },
        ],
      }
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
        statusLabel: 'Revived as an HNIC smart city — execution phase began April 2026', coords: [176, 372],
        areaAc: 12635, projectCostCr: 2361, investmentCr: 10000, jobs: 174000,
        sectors: 'Automobile, EVs & Li-ion batteries, defence systems, transport & electrical equipment, metals & non-metallic minerals, electronics (incl. semiconductors), food & agro-processing, pharma/biotech, logistics, green energy',
        nearest: 'NH-65 (Pune–Machilipatnam) 9 km via a new 4-lane greenfield road; Bidar domestic airport 20 km; Rajiv Gandhi International Airport (Hyderabad) 125 km; Hyderabad 80 km; Zaheerabad town 9 km; Metalkunta railway station 1.5–12 km [D]; Machilipatnam port (proposed) 485 km; JNPT Mumbai 600 km',
        developer: 'NICDIT Zaheerabad Industrial Smart City Ltd — 51% Telangana (TGIIC, via land) : 49% Centre (NICDIT, via cash for internal infrastructure); incorporated 2024–25 after the August 2024 Cabinet approval. The original vehicle was Zaheerabad NIMZ Limited (with L&T Infrastructure Engineering as master-plan/ESIA consultant).',
        epc: 'TGIIC invited an RFP (design–build–O&M of infrastructure works) in 2025 targeting finalisation by October 2025; execution began April 2026 with Phase-1 boundaries fixed and land handed over to SRR Projects. Infrastructure completion targeted ~1.5 years from tender award.',
        companies: [
          { name: 'Hyundai Motor Company', sector: 'Automotive — Global Innovation R&D Centre, test track & vehicle-testing/manufacturing unit (incl. EVs)', commitment: '~₹8,528 cr · 675 ac — land allotted, possession taken, soil testing complete, construction underway (Apr 2026). Scope grew from 300 ac/R&D test track (Aug 2024) → 407–408 ac/~₹2,100 cr (Nov 2024) → 675 ac/~₹8,528 cr (Apr 2026) [V/D]' },
          { name: 'VEM Technologies', sector: 'Defence — integrated defence systems; precision engineering for automotive & aerospace', commitment: '~₹2,200+ cr · 511 ac — bhoomi puja June 2022, land allotted, under construction (earlier estimate ~₹1,000 cr) [V/D]' },
          { name: 'Triton Electric Vehicle (Triton Solar, US)', sector: 'EVs — semi-trucks/sedans/SUVs/rickshaws, Li-ion batteries & EV components (Yelgoi village, Jharasangam mandal)', commitment: '~₹3,500 cr — MoU June 2021, site visit Oct 2021, land allotted; 50,000 vehicles over 5 years, 25,000+ jobs (earlier figures ₹1,200 cr → ₹2,100 cr) [V/D]' },
          { name: 'One Moto (UK)', sector: 'EVs — 40,000 units/yr + Li-ion battery manufacturing', commitment: '~₹400 cr · 500 direct + 2,000 indirect jobs — MoU signed (by June 2022); no land allotment confirmed [V]' },
        ],
        industries: ['Automotive R&D, test track & vehicle manufacturing (Hyundai)', 'Integrated defence systems & precision engineering (VEM Technologies)', 'EV manufacturing & Li-ion batteries (Triton, One Moto)', 'Transport & electrical equipment', 'Metals & non-metallic minerals', 'Electronics incl. semiconductors', 'Food & agro-processing, pharma/biotech', 'Logistics & green energy'],
        infrastructure: [
          '12,635-ac notified NIMZ across 17 villages in Nyalkal and Jarasangam mandals of Sangareddy district; NICDP Phase-1 activation area 3,245.48 ac. Original conceptual master plan by L&T Infrastructure Engineering (manufacturing 56%, green 13%, logistics 7%, roads 8%).',
          'Phase-1 land-use (3,245.48 ac): industrial & logistics 1,978.58 ac (60.96%), green 615.24 ac (18.96%), roads 434.56 ac (13.39%), utilities 101.79 ac (3.14%), commercial 62.99 ac (1.94%), amenities 29.02 ac (0.89%), water body 13.30 ac (0.41%), residential 10 ac (0.31%).',
          'Land acquisition: ~3,100 of 3,909 Phase-1 ac by 2022; ~2,900 Phase-1 ac by 2024; ~9,000 of 12,635 ac by April 2026 — roughly 3,600 ac still to acquire. Telangana is providing equal R&R compensation to assigned and registered landholders.',
          'Connectivity: NH-65 (Pune–Machilipatnam) 9 km via an under-construction 4-lane greenfield road; SH-14 (Bidar–Zaheerabad) 5 km; SH-16 (Nizampet–Bidar) 1.5 km; Hyderabad ORR 55 km, proposed Regional Ring Road 40 km; Bidar airport 20 km; RGIA 125 km. No port linkage — Machilipatnam (proposed) 485 km, Krishnapatnam 620 km, JNPT 600 km.',
          'Total project cost ₹2,361 cr (NICDP; alternate ₹2,369.82 cr); GoI ₹596 cr equity + ₹655 cr debt via NICDIT; the original NIMZ was costed at ₹4,704.90 cr plus ₹6,500 cr external linkages.',
        ],
        incentives: 'No node-specific framework published; standard Telangana industrial-policy incentives plus the NICDP plug-and-play model apply. Land is reported ~50% cheaper than Hyderabad Pharma City. Equal R&R compensation to assigned and registered landholders.',
        summary: [
          'Zaheerabad is the single Telangana priority node of the Hyderabad–Nagpur Industrial Corridor (HNIC), approved by the Union Cabinet in August 2024 as one of twelve NICDP greenfield cities. It is a revival: the site was notified as a National Investment and Manufacturing Zone (NIMZ) and given final central approval back in January 2016, then languished for over a decade — making it one of the more durable land banks in the programme.',
          'The headline scale is the 12,635-ac NIMZ across 17 villages, but the funded, under-construction project is the 3,245-ac NICDP Phase-1 activation area, costed at ₹2,361 cr with the Centre putting in ₹596 cr equity and ₹655 cr debt through NICDIT. NICDC projects ₹10,000 cr of investment and 174,000 jobs for Phase 1; the state cites ₹15,000 cr / 200,000 jobs for the NICDP city and ₹50,000 cr / 250,000 direct + 500,000 indirect jobs for the full NIMZ.',
          'Unusually for an HNIC node, Zaheerabad already has named anchor momentum. By April 2026 the execution phase had begun — ~9,000 acres acquired, Phase-1 boundaries fixed and handed to SRR Projects — with Hyundai (675 ac, ~₹8,528 cr R&D centre), VEM Technologies (511 ac, ~₹2,200 cr defence systems) and Triton EV (~₹3,500 cr) committing over ₹14,000 cr combined. The investment figures for each anchor have risen sharply over successive reports, so they should be read as scope expansions rather than fixed numbers.',
        ],
        sections: [
          { heading: 'From a stalled NIMZ to an HNIC smart city', body: [
            'Zaheerabad was first announced under the National Manufacturing Policy around 2011 and formally taken up by the Centre, with final NIMZ approval granted on 22 January 2016. Progress was slow: the Expert Appraisal Committee deferred Terms of Reference in December 2017 over 13 reserve forests near the site, granted ToR on 24 January 2018, and environmental clearance followed a public hearing in January 2021. L&T Infrastructure Engineering prepared the conceptual master plan and EIA/EMP studies for the original Zaheerabad NIMZ Limited.',
            'The August 2024 Cabinet approval folded the dormant NIMZ into the NICDP as an HNIC priority node, with a 3,245-ac Phase-1 activation area and a fresh 51:49 TGIIC–NICDIT SPV. TGIIC floated the infrastructure RFP in 2025 and the execution phase began in April 2026 — so the corridor frame finally gave a long-approved zone the central capital and SPV structure it had lacked.',
          ] },
          { heading: 'Hyundai and the anchor tenants', body: [
            'Hyundai Motor Company is the node’s defining commitment. What began in August 2024 as a 300-ac allotment for an R&D facility and test track had, by April 2026, grown to a 675-ac, ~₹8,528 cr Global Innovation R&D Centre with test track and vehicle-manufacturing/testing — possession taken, soil testing complete at 20 locations, and construction underway. The intermediate figures (407–408 ac, ~₹2,100 cr in late 2024) confirm the scope expanded materially as the project moved toward execution.',
            'VEM Technologies anchors the defence theme with an integrated defence-systems and precision-engineering facility on ~511 acres (bhoomi puja June 2022, under construction, ~₹2,200+ cr against an earlier ~₹1,000 cr estimate). Triton EV (a US-linked Triton Solar venture) holds allotted land at Yelgoi village for an EV and Li-ion battery plant (~₹3,500 cr, 50,000 vehicles over five years) following its 2021 MoU and site visit. One Moto, a UK EV start-up, signed a ~₹400 cr MoU by mid-2022, with no land allotment yet confirmed.',
          ] },
          { heading: 'Risks & open questions', body: [
            'The anchor numbers are real but volatile — Hyundai’s reported land roughly doubled and its investment quadrupled across successive reports, and Triton and VEM figures have similarly risen, so each should be treated as an evolving scope rather than a fixed commitment. One Moto remains at MoU stage with no allotment.',
            'Execution risk sits in land and master-planning: ~3,600 of 12,635 acres are still to be acquired, the detailed NICDP master plan is under preparation, and the original SPV’s precise terms are partly unconfirmed. The Metalkunta railway-station distance is reported as both 1.5 km and 12 km — a small but unresolved discrepancy in the connectivity picture.',
          ] },
        ],
        timeline: [
          { date: '2011', label: 'NIMZ announced under the National Manufacturing Policy' },
          { date: 'Jan 2016', label: 'Centre grants final NIMZ approval' },
          { date: 'Jan 2018', label: 'EAC grants Terms of Reference (183rd meeting)' },
          { date: 'Jan 2021', label: 'Public hearing completed; environmental clearance obtained' },
          { date: 'Jun 2022', label: 'VEM Technologies bhoomi puja; One Moto MoU' },
          { date: 'Aug 2024', label: 'Union Cabinet approves the NICDP smart-city node' },
          { date: 'Aug 2025', label: 'TGIIC infrastructure RFP invited (target finalisation Oct 2025)' },
          { date: 'Apr 2026', label: 'Execution phase begins; ~9,000 ac acquired; Hyundai construction underway' },
        ],
        sources: [
          { label: 'NICDC — Zaheerabad node page', url: 'https://nicdc.in/projects/12-new-projects/zaheerabad-telangana' },
          { label: 'Deccan Chronicle — execution begins after 13 years (Apr 2026)', url: 'https://www.deccanchronicle.com/southern-states/telangana/industrial-city-begins-operations-at-zaheerabad-after-13-years-1949588' },
          { label: 'ET Infra — Zaheerabad smart city, ₹15,000 cr (Aug 2025)', url: 'https://infra.economictimes.indiatimes.com/news/urban-infrastructure/zaheerabad-industrial-smart-city-a-15000-crore-investment-with-huge-job-creation/123293521' },
          { label: 'Times of India — Hyundai/VEM anchor allotments (Aug 2024)', url: 'https://timesofindia.indiatimes.com/city/hyderabad/zaheerabad-industrial-smart-city-project-to-attract-investments-worth-rs-15000-crore/articleshow/112878256.cms' },
          { label: 'Deccan Chronicle — Hyundai 407 ac in NIMZ (Nov 2024)', url: 'https://www.deccanchronicle.com/southern-states/telangana/hyundai-mou-materialises-swiftly-korean-giant-allocated-407-acres-in-nimz-zaheerabad-1840260' },
          { label: 'The Hindu — “The NIMZ bedlam” (Jun 2022)', url: 'https://www.thehindu.com/todays-paper/tp-miscellaneous/tp-others/the-nimz-bedlam/article65559353.ece' },
        ],
      }
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
        slug: 'kakatiya-textile-park', name: 'Kakatiya Mega Textile Park', state: 'Telangana', stage: 'operational',
        statusLabel: 'India’s first fully functional PM MITRA park — inaugurated May 2026', coords: [203, 368],
        areaAc: 1327, projectCostCr: 1696, investmentCr: 3800, jobs: 2000,
        sectors: 'Spinning, weaving, knitting, denim, processing, readymade garments, home & technical textiles, recycled polyester',
        nearest: 'Shayampet village, Geesugonda mandal, Warangal district; near NH-163 and the proposed Nagpur–Vijayawada greenfield expressway (NH-163G); multimodal links to rail and seaports',
        developer: 'Telangana State Industrial Infrastructure Corporation (TSIIC/TGIIC) under the Centre’s PM MITRA scheme (Pradhan Mantri Mega Integrated Textile Region and Apparel). Brownfield PM MITRA park; owned by the Government of Telangana. Centre:State shareholding and SPV incorporation not found in sources; a separate state company — CETP-Kakatiya Mega Textile Park Warangal Ltd — was incorporated Dec 2021 to run the effluent plant.',
        epc: 'Internal roads, water supply and street lighting complete; a fresh EPC tender for infrastructure works (design, construction, O&M) was issued 2 Apr 2026 (EMD ₹3.71 cr).',
        companies: [
          { name: 'Youngone Corporation', sector: 'Outdoor & technical apparel (South Korea) — exports', commitment: '~₹1,000 cr (proposed) · commercial production commenced Oct 2025 · ~90% women workforce · 11 factories ground-broken Jun 2023 — operational [V]' },
          { name: 'Kitex Group', sector: 'Integrated fibre-to-apparel / children’s wear (Kerala)', commitment: '₹2,400 cr (both clusters) · 22,000 direct + 18,000 indirect jobs · MoU Sep 2025 — only one cluster at Warangal (the other at Sitarampur, Ranga Reddy) [V]' },
          { name: 'Ganesha Ecosphere', sector: 'PET-bottle recycling into polyester staple fibre', commitment: 'Part of ₹3,800+ cr grounded investment · operations commenced — operational [V]' },
          { name: 'Welspun Group', sector: 'Home textiles, terry towels', commitment: '₹750 cr · MoU signed (~2018) [V]' },
          { name: 'Nandan Denim (Chiripal Group)', sector: 'Denim fabric', commitment: '₹700 cr · MoU signed (~2018) [V]' },
          { name: 'Shahi Exports, Gokaldas Images, Jaycot Industries', sector: 'Garment manufacturing & apparel exports', commitment: 'Among the 13 MoUs totalling ₹3,020 cr (~2018) [V]' },
          { name: 'Suryavansi Spinning, Surya Uday Spinning Mills, Srinath Spinning Mills, Ginni Filaments, GK Threads', sector: 'Spinning & yarn', commitment: 'Among the 13 MoUs totalling ₹3,020 cr (~2018) [V]' },
          { name: 'Urbaknitt Fabs, Shivani Group, The Swayamwar', sector: 'Knitting, fabrics & apparel', commitment: 'Among the 13 MoUs totalling ₹3,020 cr (~2018) [V]' },
        ],
        industries: ['Spinning & yarn', 'Weaving & denim', 'Knitting & fabrics', 'Processing — dyeing, printing, finishing', 'Readymade garments & apparel exports', 'Home & technical textiles', 'Recycled polyester staple fibre', 'Handloom & traditional weaving clusters'],
        infrastructure: [
          '1,327 ac brownfield PM MITRA park (an earlier 2017 estimate ran to 2,000–3,000 ac; reduced to the finalised developable area after master planning). ₹1,695.54 cr total project cost, including a ₹200 cr central PM MITRA grant; 62% of the park already allotted to anchor investors.',
          'A 232/132/33 KV power substation with a 220 KV transmission line nearing completion; a 12 MLD water-supply system in advanced stages; a 10 MW solar power plant planned.',
          'A Phase-I 5 MLD Common Effluent Treatment Plant with Zero Liquid Discharge under trial run, run by the dedicated state company CETP-Kakatiya Mega Textile Park Warangal Ltd; worker dormitories and common boiler facilities planned.',
          'Plug-and-play industrial infrastructure on the ‘5F’ vision — Farm to Fibre to Factory to Fashion to Foreign. Near NH-163 and the proposed Nagpur–Vijayawada greenfield expressway (NH-163G), with multimodal links to rail and seaports. Land price per acre and plot sizes not found in sources.',
        ],
        incentives: 'A ₹200 cr central grant under PM MITRA plus plug-and-play common infrastructure (CETP with ZLD, power substation, water supply, roads). State support comes via the Telangana Textiles & Apparel Policy — capital subsidy, SGST reimbursement, interest-on-term-loan subsidy, power-tariff concessions and effluent-treatment support (specific percentages and caps not found in sources).',
        summary: [
          'Kakatiya Mega Textile Park is the operational flagship of the Hyderabad–Warangal corridor and the country’s first fully functional PM MITRA park, virtually inaugurated by the Prime Minister on 10 May 2026. It spans 1,327 acres at Shayampet village in Geesugonda mandal, Warangal, developed at a total cost of ₹1,695.54 cr including a ₹200 cr central grant, and is anchored by the Telangana government’s ambition to make the state the textile capital of South Asia by 2047.',
          'It is substantially built out: 62% of the park is already allotted, internal roads, water and street lighting are complete, and the power substation, 12 MLD water system and a Zero-Liquid-Discharge effluent plant are in advanced stages or trial runs. More than ₹3,800 cr of private investment has been grounded, against a projected total exceeding ₹6,000 cr; ~2,000 direct jobs exist now, with full operationalisation targeted at 24,400+.',
          'The named pipeline mixes confirmed operations with older intent. Youngone Corporation of South Korea began commercial production in October 2025 and Ganesha Ecosphere’s recycling unit is operational; Kitex Group signed a ₹2,400 cr MoU in September 2025 (only one of its two clusters sits here). Behind them sit 13 MoUs worth ₹3,020 cr from ~2018 — Welspun, Nandan Denim, Shahi Exports, Gokaldas and a cluster of spinning mills — which mark intent rather than confirmed ground.',
        ],
        sections: [
          { heading: 'India’s first functional PM MITRA park', body: [
            'Launched under the Centre’s PM MITRA scheme and implemented by TSIIC/TGIIC, Kakatiya is positioned as a complete textile value chain rather than a single-segment cluster — spinning, weaving, knitting, processing, garments and made-ups under the government’s ‘5F’ vision (Farm to Fibre to Factory to Fashion to Foreign). Its competitive pitch against established hubs such as Tirupur, Surat and Solapur is that it is designed to handle all fabric types and garments end-to-end on one site.',
            'The park carries a ₹200 cr central grant, with internal infrastructure already complete and major utilities — a 232/132/33 KV substation, a 12 MLD water system, a Zero-Liquid-Discharge effluent plant and a planned 10 MW solar plant — at or near commissioning. Environmental clearance was granted in July 2017 and consent for establishment in June 2018.',
          ] },
          { heading: 'Operational tenants and the MoU pipeline', body: [
            'Two tenants are confirmed operational. Youngone Corporation, a South Korean apparel exporter, began commercial production in October 2025 from a facility built on the back of an 11-factory groundbreaking in June 2023, with a workforce that is roughly 90% women from the local region. Ganesha Ecosphere’s PET-recycling-to-polyester unit is also running, both part of the ₹3,800+ cr of grounded investment.',
            'In September 2025 the Kitex Group signed a ₹2,400 cr MoU spanning two clusters — one at Kakatiya, one at Sitarampur in Ranga Reddy — promising 22,000 direct and 18,000 indirect jobs across both. Beneath these sit the original 13 MoUs worth ₹3,020 cr from around 2018, including Welspun (₹750 cr), Nandan Denim (₹700 cr), Shahi Exports, Gokaldas Images and several spinning mills; these should be read as committed intent rather than grounded units.',
          ] },
          { heading: 'Risks & open questions', body: [
            'The headline numbers are partly aspirational. The ₹6,000 cr total investment target needs a further ~₹2,200 cr beyond what is grounded, and a central government claim of up to ₹10,000 cr investment and 2 lakh jobs is an unverified projection with no named allottees to account for it. The Zero-Liquid-Discharge effluent plant and the 12 MLD water system are still under trial or development — both load-bearing for a water-intensive, pollution-sensitive sector.',
            'Several governance and cost details are unconfirmed: the Centre:State shareholding, any park SPV incorporation date, the land price per acre, plot sizes and the specific SGST/power incentives under the state textiles policy were not found in sources. TGIIC’s formal allotment register was not publicly available, so beyond the named operators and MoU signatories the precise allottee list is opaque.',
          ] },
        ],
        timeline: [
          { date: '2017', label: 'Park announced by the Telangana government; EC granted Jul 2017' },
          { date: 'Jun 2018', label: 'Consent for Establishment granted' },
          { date: '~2018', label: '13 MoUs signed worth ₹3,020 cr (Welspun, Nandan Denim, Youngone et al.)' },
          { date: 'Jun 2023', label: 'Youngone grounds 11 factories' },
          { date: 'Sep 2025', label: 'Kitex Group ₹2,400 cr MoU (two clusters)' },
          { date: 'Oct 2025', label: 'Youngone begins commercial production / exports' },
          { date: 'May 2026', label: 'PM Modi virtually inaugurates India’s first functional PM MITRA park' },
        ],
        sources: [
          { label: 'The Rahnuma Daily (IANS) — ₹1,695 cr textile park', url: 'https://therahnuma.com/pm-modi-to-inaugurate-rs-1695-crore-textile-park-in-warangal-on-may-10/' },
          { label: 'Deccan Chronicle — India’s largest textile hub', url: 'https://www.deccanchronicle.com/southern-states/telangana/modi-to-inaugurate-indias-largest-textile-hub-in-warangal-1955686' },
          { label: 'Telangana Today — Youngone begins production', url: 'https://telanganatoday.com/korean-firm-youngone-begins-commercial-production-from-warangal-textile-park' },
          { label: 'Textile Value Chain — Kitex ₹2,400 cr MoU', url: 'https://textilevaluechain.in/garment-giant-kitex-in-telangana-india-mou-signed-for-rs-2400-crore-investment-to-create-40000-jobs' },
          { label: 'YarnsandFibers — major textile players at Warangal', url: 'https://www.yarnsandfibers.com/news/textile-news/major-textile-players-seen-enticed-to-warangal-textile-park/amp/' },
          { label: 'UNI India — Kakatiya Mega Textile Park inauguration', url: 'https://uniindia.com/~/pm-to-inaugurate-1-700-cr-kakatiya-mega-textile-park-at-warangala-in-telangana/Business%20Economy/news/3838242.html' },
          { label: 'Zauba Corp — CETP Kakatiya company', url: 'https://www.zaubacorp.com/CETP-KAKATIYA-MEGA-TEXTILE-PARK-WARANGAL-LIMITED-U90000TG2021SGC154218' },
        ],
      },
      {
        slug: 'hyderabad-pharma-city', name: 'Hyderabad Pharma City', state: 'Telangana', stage: 'construction',
        statusLabel: 'NIMZ pharma cluster — Phase 1 under construction, no operational tenants yet', coords: [193, 366],
        areaAc: 19333, projectCostCr: 19098, investmentCr: 11100, jobs: 22300,
        sectors: 'Bulk drugs (APIs), formulations, vaccines & biologics, biotechnology, CDMO, biosimilars, R&D and life sciences',
        nearest: 'Kandukur, Yacharam and Kadthal mandals, Ranga Reddy district; ~25 km from the Outer Ring Road and ~29 km from Rajiv Gandhi International Airport; no documented port or DFC linkage',
        developer: 'Hyderabad Pharma City Limited (state SPV) implemented through the Telangana State Industrial Infrastructure Corporation (TSIIC/TGIIC). Holds National Investment and Manufacturing Zone (NIMZ) status granted by the Government of India in December 2019. Centre:State shareholding and SPV incorporation date not found in sources.',
        epc: 'Phase 1 (9,212 ac) construction commenced in targeted zones; internal roads, dedicated water and power, common effluent treatment and employee townships planned; industries targeted to commence operations by 2026.',
        companies: [
          { name: 'Bharat Biotech', sector: 'Vaccines & biotech', commitment: 'MoU at BioAsia 2025 — part of the 11-company ₹5,445 cr / 9,800-job pool [V]' },
          { name: 'Biological E', sector: 'Vaccines & biologics', commitment: 'MoU at BioAsia 2025 — part of the ₹5,445 cr pool [V]' },
          { name: 'Granules, Virchow, Virupaksha', sector: 'Pharmaceuticals', commitment: 'MoUs at BioAsia 2025 — part of the ₹5,445 cr pool [V]' },
          { name: 'Jubilant, Aragen, Sai Life Sciences', sector: 'Life sciences & CDMO', commitment: 'MoUs at BioAsia 2025 — part of the ₹5,445 cr pool [V]' },
          { name: 'Orbicular, Aizant, Vimta', sector: 'Pharma R&D, drug delivery & clinical testing', commitment: 'MoUs at BioAsia 2025 — part of the ₹5,445 cr pool [V]' },
          { name: 'MSD (Merck Sharp & Dohme)', sector: 'Global technology centre', commitment: 'Separate BioAsia 2025 announcement (a 12th distinct company); investment not specified [V]' },
          { name: 'Amazon Data Services India', sector: 'Data centre (non-pharma)', commitment: '48 ac allotted — questioned by the CAG as a deviation from the pharma mandate [V/D]' },
          { name: 'Adani Defence Systems & Technologies', sector: 'Defence systems (non-pharma)', commitment: 'Land allotted — flagged by the CAG as an undue benefit (deviation from pharma mandate) [V/D]' },
        ],
        industries: ['Bulk drugs / APIs', 'Formulations', 'Vaccines & biologics', 'Biotechnology & biosimilars', 'CDMO (contract development & manufacturing)', 'R&D and life sciences', 'Ancillary industries & support services'],
        infrastructure: [
          '19,000–19,333 ac (~77 km²) across Kandukur, Yacharam and Kadthal mandals — the largest pharma-specific cluster planned in India, far above Genome Valley’s ~2,000 ac. Phased: Phase 1 (2023–26) 9,212 ac, Phase 2 (2026–29) ~5,000 ac for biotech/biosimilars/vaccines, Phase 3 (2029+) for smart technologies and Centres of Excellence.',
          '~12,000 of 19,300 ac acquired as of Aug 2024 (a CAG report flagged ~10,238 ac as non-contiguous); estimated project cost ~₹19,098 cr with a ₹1,550 cr land-acquisition budget. Market land price surged from under ₹50 lakh/acre to ~₹5 cr/acre after announcement; official TGIIC land price and plot sizes not found in sources.',
          'Master-plan zones cover bulk-drug manufacturing, formulations, an R&D hub, ancillary industries, residential townships and green buffer corridors; percentage land-use breakdown not found. Tabreed is contracted for Asia’s largest district-cooling concession (~$200m, 125,000 RT). Environmental clearance status was not found in sources and Hyderabad Pharma City does not appear on the NICDC EC-granted list.',
          '~25 km from the Outer Ring Road and ~29 km from Rajiv Gandhi International Airport; part of a planned set of pharma villages between the ORR and the proposed Regional Ring Road. No dedicated freight corridor or port linkage documented; the water source and power allocation — both critical for water-intensive pharma — were not found in sources.',
        ],
        incentives: 'NIMZ status (single-window clearance and infrastructure support) plus the Telangana Next-Gen Life Sciences Policy 2026–30, unveiled at Davos in January 2026: 100% stamp- and transfer-duty reimbursement, 25% land-cost reimbursement (capped at ₹10 lakh) in state parks, a power subsidy and 100% net SGST reimbursement for five years from commercial production. A ‘Green Pharma City’ net-zero mandate (district cooling, environmental corridors) frames the build-out.',
        summary: [
          'Hyderabad Pharma City — rebranded Green Pharma City — is the corridor’s flagship under-construction node and, at 19,000+ acres, the largest pharma-specific cluster planned in India. Sited across three mandals of Ranga Reddy district, ~25 km from the Outer Ring Road, it carries National Investment and Manufacturing Zone status (granted December 2019) and is implemented through TSIIC via the SPV Hyderabad Pharma City Limited.',
          'It is in Phase 1 (9,212 ac of a phased 19,333 ac), with roughly 12,000 acres acquired and construction commenced in targeted zones. Commitments stand at ₹11,100 cr across 17 MoUs (6 earlier plus 11 named at BioAsia 2025) for 22,300+ jobs, against a far larger government target of ₹64,000 cr and 1.66 lakh jobs. No tenant is operational yet — Phase 1 industries are targeted to begin in 2026.',
          'The named pipeline is strong on paper: Bharat Biotech, Biological E, Granules, Jubilant, Aragen, Sai Life Sciences and others signed MoUs at BioAsia 2025 (₹5,445 cr, 9,800 jobs), with MSD adding a global technology centre. But the only two formal land allottees identified — Amazon Data Services (48 ac) and Adani Defence — are both non-pharma and have been formally questioned by the CAG as deviations from the node’s mandate.',
        ],
        sections: [
          { heading: 'India’s largest pharma cluster, by design', body: [
            'Hyderabad Pharma City is conceived as an extension and consolidation of Hyderabad’s existing dominance in pharmaceuticals — the region already accounts for over 40% of India’s bulk-drug production, and adjacent Genome Valley hosts 200+ companies and roughly a third of global vaccine output. The NIMZ designation positions the park as a project of national importance with single-window clearance and infrastructure support.',
            'The master plan splits the 19,333 acres into bulk-drug, formulations, R&D, ancillary, residential and green-buffer zones across three phases through 2029 and beyond, with Phase 2 earmarked for biotech, biosimilars and vaccines. A Tabreed district-cooling concession and a ‘Green Pharma City’ net-zero framing are intended to differentiate it on environmental performance — a pointed response to Hyderabad’s legacy of pharmaceutical effluent pollution.',
          ] },
          { heading: 'MoUs, allottees and the CAG flags', body: [
            'At BioAsia 2025 the Telangana government signed 11 MoUs worth ₹5,445 cr for 9,800 jobs — Granules, Orbicular, Aizant, Biological E, Virchow, Virupaksha, Jubilant, Vimta, Aragen, Bharat Biotech and Sai Life Sciences — and MSD separately announced a global technology centre. Cumulative MoU commitments reach ₹11,100 cr for 22,300+ jobs across 17 companies. These are intent: no formal land-allotment orders for the BioAsia signatories were found.',
            'The only two formal land allotments identified are non-pharma and contentious. The CAG questioned a 48-acre allotment to Amazon Data Services and an allotment to Adani Defence Systems as undue benefits and deviations from the park’s pharmaceutical mandate under NIMZ, alongside wider findings of TSIIC fund diversion in 2018–2022. No pharmaceutical facility had commenced operations as of mid-2026.',
          ] },
          { heading: 'Risks & open questions', body: [
            'Execution is the central risk: converting ~12,000 acquired (and partly non-contiguous) acres into serviced industrial plots, against documented farmer-displacement disputes and legal hurdles over land-use change. The government’s ₹64,000 cr / 1.66 lakh-job target dwarfs the ₹11,100 cr of signed MoUs, and the CAG flagged delays severe enough that Phase 1 — originally 2017–2020 — was incomplete well into the decade.',
            'Several load-bearing details are absent from sources: the environmental clearance status (no SEAC/SEIAA order found, and the node is missing from the NICDC EC list), the water source and allocation for a water-intensive sector, the power allocation and tariff, export-port and DFC connectivity, and the Centre:State equity split in the SPV. Phase 1 completion timing also differs between the project portal (2026) and other sources (late 2025 initial segments).',
          ] },
        ],
        timeline: [
          { date: 'Mar 2018', label: 'Project announced by K. T. Rama Rao' },
          { date: 'Dec 2019', label: 'NIMZ status granted by the Government of India' },
          { date: '2023', label: 'Phase 1 construction commences in targeted zones' },
          { date: 'Aug 2024', label: '~12,000 ac acquired; market land price ~₹5 cr/acre' },
          { date: 'Feb 2025', label: '11 MoUs signed at BioAsia 2025 (₹5,445 cr); total commitments ₹11,100 cr' },
          { date: 'Jan 2026', label: 'Next-Gen Life Sciences Policy 2026–30 unveiled at Davos' },
          { date: '2026', label: 'Phase 1 industries targeted to commence operations' },
        ],
        sources: [
          { label: 'BioSpectrum India — 11 MoUs for Green Pharma City', url: 'https://biospectrumindia.com/news/73/25743/telangana-government-signs-mous-with-11-companies-for-green-pharma-city-project.html' },
          { label: 'Times of India — CAG questions Amazon land allotment', url: 'https://timesofindia.indiatimes.com/city/hyderabad/cag-questions-land-allotment-by-telangana-govt-to-amazon-in-pharma-city/articleshow/129905143.cms' },
          { label: 'The New Indian Express — TSIIC fund diversion / Adani Defence (CAG)', url: 'https://www.newindianexpress.com/states/telangana/2026/Mar/31/huge-diversion-of-tsiic-funds-during-2018-to-2022-cag-report' },
          { label: 'Business Standard (PTI) — Next-Gen Life Sciences Policy', url: 'https://www.business-standard.com/amp/industry/news/telangana-unveils-life-sciences-policy-to-attract-usd-25-bn-investments-in-five-years-126012100745_1.html' },
          { label: 'PIB — NIMZ / integrated pharma cluster', url: 'https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1905210' },
          { label: 'Pharma City Hyderabad — projects & master plan', url: 'https://pharmacityhyderabad.in/projects/' },
          { label: 'Wikipedia — Hyderabad Pharma City', url: 'https://en.wikipedia.org/?curid=56930559' },
        ],
      }
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
        statusLabel: 'EPC appointed; Reliance anchor secured; construction yet to start', coords: [183, 406],
        areaAc: 2621, projectCostCr: 2786, investmentCr: 12000, jobs: 45071,
        sectors: 'Aerospace & defence, engineering, steel, food processing, pharma, drones',
        nearest: 'Kurnool airport 12 km; NH-40 4 km; NH-44 28 km; Hyderabad ~210 km; Krishnapatnam Port 320 km',
        developer: 'AP Industrial Corridors Infrastructure Development Corporation (APICDC) + NICDIT; SPV incorporated 2024 as part of the 12-node NICDP approval (shareholding not separately disclosed; assumed 50:50 GoI:GoAP)',
        epc: 'EPC contractor appointed by February 2026; programme manager onboarded; trunk construction not yet commenced',
        companies: [
          { name: 'Reliance Consumer Products Ltd (RCPL)', sector: 'Integrated beverage & food manufacturing', commitment: '₹1,622 cr ($178.35m) · ~1,200 direct jobs — State Investment Promotion Board cleared Dec 2025; ₹601.87 cr incentive package (37.10% of FCI) sanctioned under AP Food Processing Policy 4.0; the node’s largest single commitment [V]' },
          { name: 'Virupaksha Organics Ltd', sector: 'APIs / organic chemicals', commitment: '₹1,225 cr · 100+ ac · ~1,500 direct jobs — allotment approved (IP Guttapadu cluster); formalised at the CII Partnership Summit, Vizag, Nov 2025 [V]' },
          { name: 'Jai Raj Ispat Ltd (JRIL)', sector: 'Steel', commitment: '413.19 ac allotted at Guttapadu (370.39 + 42.80); environmental clearance obtained for 400 ac; land excluded from the Guttapadu IP EC proposal [V]' },
          { name: 'aerpace Industries', sector: 'Drones / defence UAVs', commitment: '300-ac Drone City (India’s first) — MoU with APEDB; foundation laid at the CII Partnership Summit Nov 2025; verticals aerShield, aerWing [V]' },
          { name: 'Sigachi Industries Ltd', sector: 'Pharma excipients / microcrystalline cellulose', commitment: 'Allottee in the 41-ac Guttapadu cluster; expansion at Orvakal formalised at the CII summit Nov 2025 [V]' },
          { name: 'RPS Projects & Developers Pvt Ltd', sector: 'Industrial development', commitment: 'Allottee in the 41-ac Guttapadu cluster (with Sigachi and Primo Poly Pack; ₹30 cr first-phase proposals) [V]' },
          { name: 'Primo Poly Pack', sector: 'Packaging', commitment: 'Allottee in the 41-ac Guttapadu cluster [V]' },
        ],
        industries: ['Integrated food & beverage (Reliance)', 'APIs / pharma (Virupaksha Organics, Sigachi)', 'Steel (Jai Raj Ispat)', 'Drone manufacturing — Drone City (aerpace)', 'Aerospace & defence', 'Engineering'],
        infrastructure: [
          'NICDC project area 2,621 ac — land-use: industrial & logistics 1,424 ac (54%), green & waterbody 363 ac (14%), roads 276 ac (11%), logistics & parking 217 ac (8%), utilities 217 ac (8%), institutional 64 ac (2%), residential 42 ac (2%), commercial 18 ac (1%).',
          'The state has notified a far larger industrial node — 9,718.84 ac across 11 villages of Orvakal mandal under the AP Industrial Corridor Development Act 2017 (NICDIT area 4,742.34 ac, APIIC area 4,563.31 ac, Jai Raj Ispat 413.19 ac).',
          'Kurnool airport 12 km (operational since March 2021); NH-40 4 km, NH-44 28 km, NH-340C 26 km, MDR-180 crossing the site; nearest rail Veldurthi/Betamcherla ~28 km, Kurnool 35 km; Krishnapatnam Port 320 km east, Kattupalli ~420 km.',
          'APIIC has issued 2025 tenders for an adjacent estate at Brahmanapalle — a Flatted Factory Complex (~₹6.54 cr), a new industrial estate (~₹2.31 cr) and water supply (~₹2.37 cr).',
          'Power-surplus state (AP targets 40% renewable energy by 2030); internal trunk utilities to follow under the EPC contract.',
        ],
        incentives: 'AP Industrial Development Policy 4.0 (2024–29): capital subsidy up to 12% of FCI for sub-large/large and up to 15% (tailor-made) for mega/ultra-mega projects, 100% net SGST reimbursement for 5 years, power ₹1/unit, 100% stamp duty and land-conversion reimbursement; Early-Bird scheme 30% (first 200 projects) / 40% (PLI-aligned). The Reliance package was sanctioned under the AP Food Processing Policy 4.0.',
        summary: [
          'Orvakal is the only one of Andhra Pradesh’s three NICDC nodes with a confirmed major anchor — Reliance Consumer Products committing ₹1,622 cr in integrated food and beverage manufacturing, with the State Investment Promotion Board clearance and a ₹601.87 cr incentive package already sanctioned.',
          'Beyond Reliance, the node is building an emerging pharma cluster around Guttapadu (Virupaksha Organics adding ₹1,225 cr, Sigachi expanding) and India’s first 300-acre Drone City under an MoU with aerpace Industries; Jai Raj Ispat holds 413.19 acres of steel land.',
          'Delivery is at the pre-construction stage: the SPV is incorporated, environmental clearance secured and an EPC contractor appointed by February 2026, but trunk construction has not yet begun. The node leans heavily on a single large anchor; the state is targeting ~₹50,000 cr regionally to diversify, and the nearest major port is 320 km away.',
        ],
        sections: [
          { heading: 'The Reliance anchor', body: [
            'The defining commitment is Reliance Consumer Products’ ₹1,622 cr ($178.35m) integrated beverage and food plant — carbonated drinks, fruit juices, packaged water, spices, snacks, noodles, confectionery, rice and atta — creating ~1,200 direct jobs. The State Investment Promotion Board cleared it in December 2025 and sanctioned a ₹601.87 cr incentive package (37.10% of fixed capital investment) under the AP Food Processing Policy 4.0: 15% capital subsidy (capped ₹25 cr), 100% net SGST for 5 years (capped ₹493.95 cr), ₹1/unit power for 5 years (capped ₹81.72 cr) and stamp-duty reimbursement.',
            'It is the largest single investment announced for the node and the only confirmed anchor across Andhra Pradesh’s three NICDC nodes — making Orvakal’s early momentum food-processing-led rather than driven by its official aerospace/engineering/steel target sectors.',
          ] },
          { heading: 'The Guttapadu pharma and steel cluster', body: [
            'A pharma cluster is forming at Guttapadu within the node. Virupaksha Organics has been approved for 100+ acres with a ₹1,225 cr API and organic-chemicals investment and ~1,500 direct jobs, formalised at the November 2025 CII Partnership Summit, where Sigachi Industries also formalised an Orvakal expansion. The earlier 41-acre Guttapadu cluster was allotted to three units — Sigachi, RPS Projects & Developers and Primo Poly Pack — with ₹30 cr of first-phase proposals.',
            'Jai Raj Ispat anchors the steel side with 413.19 acres allotted (370.39 + 42.80) and environmental clearance obtained for 400 acres; the land was carved out of the larger Guttapadu Industrial Park, whose EC proposal was revised from 4,640.11 to 4,194.32 acres after the deletion.',
          ] },
          { heading: 'Drone City', body: [
            'At the November 2025 CII Partnership Summit, Andhra Pradesh signed an MoU with aerpace Industries (via APEDB) for a 300-acre Drone City at Orvakal — described as India’s first such facility — covering drone research, manufacturing, testing, defence UAVs and AI-driven platforms, with the foundation laid by the Chief Minister and Union Minister Piyush Goyal. aerpace’s aerShield and aerWing verticals anchor the defence-and-mobility positioning.',
          ] },
          { heading: 'Status & risks', body: [
            'The Union Cabinet approved the node in 2024 and the SPV was incorporated; the state notified 9,718.84 acres in March 2025; Union Minister Piyush Goyal reviewed progress in June 2025; environmental clearance was secured and an EPC contractor appointed by February 2026. Trunk construction is yet to commence and no tenant is operational.',
            'Open questions: the dedicated SPV name and shareholding are not separately disclosed; the gap between the 2,621-acre NICDC phase and the 9,718.84-acre state notification reflects different activation areas; and the node’s diversification depends on converting the ₹50,000 cr regional ambition beyond the single Reliance anchor. Krishnapatnam Port at 320 km is a real logistics constraint for export-oriented tenants.',
          ] },
        ],
        timeline: [
          { date: '2024', label: 'Union Cabinet approval; SPV incorporated' },
          { date: 'Mar 2025', label: 'State notifies 9,718.84 ac across 11 villages as an industrial node' },
          { date: 'Jun 2025', label: 'Union Minister Piyush Goyal reviews progress' },
          { date: 'Dec 2025', label: 'Reliance ₹1,622 cr investment cleared; incentives sanctioned' },
          { date: 'Feb 2026', label: 'EPC contractor appointed; environmental clearance secured' },
          { date: '2026 onwards', label: 'Trunk construction expected to commence' },
        ],
        sources: [
          { label: 'NICDC — Orvakal', url: 'https://nicdc.in/projects/12-new-projects/orvakal-andhra-pradesh' },
          { label: 'The Hindu — Orvakal node declaration (9,718.84 ac)', url: 'https://www.thehindu.com/news/national/andhra-pradesh/11-villages-in-orvakal-mandal-declared-as-industrial-node-in-hbic/article69307090.ece' },
          { label: 'The Tribune — work advances on 12 greenfield cities (EPC appointed)', url: 'https://www.tribuneindia.com/news/business/work-advances-on-12-new-greenfield-industrial-cities-ministry-of-commerce-industry/' },
          { label: 'Food Business MEA — Reliance ₹1,622 cr beverage plant', url: 'https://www.foodbusinessmea.com/reliance-consumer-products-to-invest-us178-35m-in-integrated-beverage-plant-in-andhra-pradesh/' },
          { label: 'News18 (PTI) — Orvakal pharmaceutical hub (Virupaksha, Sigachi)', url: 'https://www.news18.com/agency-feeds/orvakal-in-kurnool-district-emerging-as-pharmaceutical-hub-says-andhra-govt-9770695.html' },
          { label: 'Economic Times — India’s first Drone City at Kurnool (aerpace)', url: 'http://widget.economictimes.indiatimes.com/news/india/andhra-pradesh-signs-mou-for-building-indias-first-drone-city-in-kurnool/articleshow/125487044.cms' },
          { label: 'The Hans India — Guttapadu cluster (Sigachi, RPS, Primo Poly Pack)', url: 'https://www.thehansindia.com/news/cities/vijayawada/vijayawada-fm-buggana-rajendranath-reddy-to-lay-foundation-for-orvakal-industrial-park-works-today-764424' },
        ],
      },
      {
        slug: 'kopparthy-hbic', name: 'Kopparthy (shared with VCIC)', state: 'Andhra Pradesh', stage: 'construction',
        statusLabel: 'Electronics node — PM-inaugurated; EPC appointed; construction yet to start', coords: [193, 419],
        areaAc: 2596, projectCostCr: 2137, investmentCr: 8860, jobs: 54500,
        sectors: 'Electronics / ESDM, renewables, auto components, metallic & non-metallic minerals, textiles, chemicals',
        nearest: 'Kadapa airport 11 km; NH-40 5 km; NH-716 8 km; Kopparthy rail cargo terminal 9 km; Krishnapatnam Port 200 km; Chennai Port 270 km',
        developer: 'AP Industrial Corridors Infrastructure Development Corporation Ltd (APICDC), 50:50 GoAP : GoI; SPV incorporated 2024; implementing agencies NICDIT + APIIC',
        epc: 'EPC contractor appointed by February 2026; programme manager onboarded; PM Modi inaugurated the park in October 2025; trunk construction yet to commence',
        companies: [
          { name: 'Pitti Rail & Engineering Components Ltd', sector: 'Engineering / customised rail components', commitment: '₹401 cr · 118 ac · 2,000 jobs — land allotted (GO MS No. 56) at the concessional early-bird rate ₹10 lakh/acre vs APIIC ₹25 lakh/acre; one of five 2021–22 early-bird units [V]' },
          { name: 'Shirdi Sai Electricals (SSEL) Group', sector: 'Transformer components & wind masts', commitment: '₹5,000 cr (Kopparthy manufacturing component of a ₹30,650 cr three-MoU package) — signed at the CII Partnership Summit Nov 2025; only the ₹5,000 cr manufacturing leg is Kopparthy-specific [V]' },
          { name: 'AIL Dixon Technologies Pvt Ltd', sector: 'Electronics manufacturing', commitment: 'Up to 10 ac at the YSR EMC — anchor-unit allotment recommended by the APIIC Board (Sep 2021) [V]' },
          { name: 'United Telelinks Neolyincs Pvt Ltd', sector: 'Electronics / telelinks manufacturing', commitment: 'Up to 10 ac at the YSR EMC — anchor-unit allotment recommended by the APIIC Board (Sep 2021) [V]' },
          { name: 'Nectar Energy', sector: 'Electronics / energy', commitment: 'MoU for the Electronic Manufacturing Cluster — signed at the CII Partnership Summit 2025 [V]' },
          { name: 'Sigad Enterprises', sector: 'Electronics', commitment: 'MoU for the Electronic Manufacturing Cluster — CII Partnership Summit 2025 [V]' },
          { name: 'BCT Private Ltd', sector: 'Electronics', commitment: 'MoU for the Electronic Manufacturing Cluster — CII Partnership Summit 2025 [V]' },
          { name: 'Matrix IOT', sector: 'IoT / electronics', commitment: 'MoU for the Electronic Manufacturing Cluster — CII Partnership Summit 2025 [V]' },
          { name: 'Sainik Industries', sector: 'Defence / electronics', commitment: 'MoU for the Electronic Manufacturing Cluster — CII Partnership Summit 2025 [V]' },
        ],
        industries: ['Electronics — YSR EMC (810 ac) + Electronic City (3,164 ac)', 'Engineering / rail components (Pitti Rail)', 'Renewables / transformers (Shirdi Sai Electricals)', 'Auto components', 'Metallic & non-metallic minerals', 'Textiles & chemicals'],
        infrastructure: [
          'NICDC project area 2,596 ac (alt. 2,595) — land-use: industrial 1,213 ac (47%), greens/buffers/waterbodies 671 ac (26%), roads 337 ac (13%), residential 136 ac (5%), parking 129 ac (5%), commercial 54 ac (2%), utilities 28 ac (1%), amenities 27 ac (1%). First-phase trunk-infrastructure cost ₹1,264 cr.',
          'The wider YSR Jagananna Mega Industrial Hub spans ~6,707–6,740 ac (3,155 ac MIH + 810 ac Electronic Manufacturing Cluster) with a state-earmarked adjacent Electronic City of 3,164 ac; projected ₹25,000 cr investment, 2.5 lakh jobs and ₹45,000 cr annual turnover.',
          'Kadapa airport 11 km (state order cites 6 km), Tirupati ~150 km, Renigunta ~145 km; NH-40 5 km, NH-716 8 km, NH-544F 8 km, SH-51 adjacent; Krishnapuram station 9 km, Kadapa Junction 13 km, Kopparthy rail cargo terminal 9 km (under development); Krishnapatnam Port 200 km, Chennai Port 270 km; within 250 km of both Chennai and Bengaluru.',
          'A 46 MLD industrial-water project is under development and a power-equipment manufacturing hub is planned; the YSR EMC has 261.06 ac vacant in Phase II (540 ac total), allottable after Phase-II completion.',
          'Funded in part by the ADB VCIC loan (~₹3,300 cr in two tranches), Tranche-I in advanced stages.',
        ],
        incentives: 'Special Kopparthy MIH package GO.Ms.No.87 (Dec 2020): 100% stamp-duty, registration-fee and land-conversion-fee reimbursement; 100% net SGST for 8 years (limited to FCI); 20% investment subsidy (capped ₹10 cr); 5% interest subvention (capped ₹1.5 cr/yr for 5 years); power ₹1/unit for 5 years; quality-certification and patent subsidies. Early-bird land ₹10 lakh/acre (first 5 units, 2021–22) vs APIIC ₹25 lakh/acre. The YSR EMC priced land at ₹9.34 lakh/acre after a 100% GoI + 50% GoAP grant.',
        summary: [
          'Kopparthy is Andhra Pradesh’s electronics node — anchored by a dedicated 810-acre YSR Electronic Manufacturing Cluster plus an adjacent 3,164-acre Electronic City — and is physically the same node cross-listed across both the Hyderabad–Bengaluru and Visakhapatnam–Chennai corridors in government documents; this entry presents its HBIC framing.',
          'It has the deepest tenant pipeline of AP’s three NICDC nodes: Pitti Rail allotted 118 acres for a ₹401 cr engineering plant (2,000 jobs); Shirdi Sai Electricals’ ₹5,000 cr transformer-and-wind-mast manufacturing MoU; APIIC-Board-recommended EMC anchors AIL Dixon Technologies and United Telelinks Neolyincs; and five further EMC MoUs (Nectar Energy, Sigad, BCT, Matrix IOT, Sainik Industries) at the CII Partnership Summit 2025.',
          'Delivery is at the pre-construction stage: the SPV is incorporated, land transferred to APICDC, environmental clearance secured and an EPC contractor appointed by February 2026, and PM Modi inaugurated the node in October 2025 — but trunk construction is yet to commence and no tenant is operational. The state projects ₹25,000 cr and 2.5 lakh jobs for the wider Mega Industrial Hub against the NICDC 2,596-acre phase.',
        ],
        sections: [
          { heading: 'The electronics anchor: EMC and Electronic City', body: [
            'Kopparthy’s defining feature is electronics. The state’s 2020 order (GO.Ms.No.87) carved an 810-acre YSR Electronic Manufacturing Cluster out of the Mega Industrial Hub, and a further 3,164-acre Electronic City has been earmarked adjacent to the node. The APIIC Board recommended AIL Dixon Technologies and United Telelinks Neolyincs as anchor units (up to 10 acres each) in September 2021, and five more electronics/IoT MoUs — Nectar Energy, Sigad Enterprises, BCT Private Ltd, Matrix IOT and Sainik Industries — were signed for the EMC at the CII Partnership Summit 2025.',
            'EMC land was priced at ₹9.34 lakh/acre after a 100% GoI plus 50% GoAP grant (from ₹18.41 lakh/acre), with ready sheds offered at ₹1,000/sqft; Phase II has 261.06 acres still vacant (of 540 acres) pending completion. A 46 MLD industrial-water project and a power-equipment manufacturing hub are planned to support the cluster.',
          ] },
          { heading: 'Pitti Rail and the early-bird units', body: [
            'The node’s most advanced commitment is Pitti Rail & Engineering Components, allotted 118 acres (GO MS No. 56) for a ₹401 cr customised-engineering-products facility expected to create 2,000 jobs. It is one of five early-bird units (2021–22) that received land at the concessional ₹10 lakh/acre rate against APIIC’s standard ₹25 lakh/acre; the other four are not named in sources.',
            'Pitti Rail’s package mirrors the Kopparthy MIH terms — 100% stamp-duty reimbursement, 100% net SGST for 8 years (limited to FCI), a 20% investment subsidy (capped ₹10 cr), 5% interest subvention (capped ₹1.5 cr/yr) and ₹1/unit power for 5 years.',
          ] },
          { heading: 'The Shirdi Sai Electricals MoU', body: [
            'At the CII Partnership Summit 2025, the Shirdi Sai Electricals group signed three MoUs totalling ₹30,650 cr, but only the ₹5,000 cr transformer-components-and-wind-masts manufacturing facility is confirmed for Kopparthy. The renewable-energy leg (₹23,450 cr — solar, wind, battery storage, transmission and a power-management centre, via the Indosol Solar subsidiary) was signed at the state level and is not Kopparthy-specific, and the ₹2,200 cr coastal-infrastructure leg is at Karedu/Ramayapatnam in Nellore — so only the manufacturing component belongs in this node’s pipeline.',
          ] },
          { heading: 'Status & open questions', body: [
            'The Union Cabinet approved the node in 2024, the state transferred land to APICDC with a stamp-duty waiver in December 2024, environmental clearance was secured and an EPC contractor appointed by February 2026, and PM Modi inaugurated the park in October 2025 with foundation stones laid for multiple units. Trunk construction is yet to commence and no tenant is operational.',
            'Area figures vary — the NICDC phase is 2,596 acres against a ~6,707–6,740-acre Mega Industrial Hub master plan (53% industrial) — and the Kadapa airport distance is reported as 11 km (NICDC) or 6 km (state order). The wider EMC/Electronic City ambition depends on converting recommendations and MoUs into operational allotments once trunk works are complete.',
          ] },
        ],
        timeline: [
          { date: 'Dec 2020', label: 'State declares the YSR Jagananna Mega Industrial Hub (GO.Ms.No.87) with a special incentive package' },
          { date: '2021', label: 'Pitti Rail allotted 118 ac at the early-bird rate; APIIC Board recommends AIL Dixon & United Telelinks for the EMC' },
          { date: '2024', label: 'Union Cabinet approval; SPV incorporated; land transferred to APICDC' },
          { date: 'Feb 2026', label: 'Environmental clearance secured; EPC contractor appointed (dated by the Feb 2026 status report)' },
          { date: 'Oct 2025', label: 'PM Modi inaugurates the park; foundation stones laid at the CII Partnership Summit' },
          { date: '2026 onwards', label: 'Trunk construction expected to commence' },
        ],
        sources: [
          { label: 'NICDC — Kopparthy', url: 'https://nicdc.in/projects/12-new-projects/kopparthy-andhra-pradesh' },
          { label: 'BusinessLine — Kopparthy node in 6,740 ac under VCIC', url: 'https://www.thehindubusinessline.com/economy/ap-govt-to-develop-kopparthy-node-in-6740-acres-under-visakhapatnam-chennai-industrial-corridor/article70041642.ece' },
          { label: 'AP Govt Order GO.Ms.No.87 — Kopparthy Mega Industrial Hub incentives', url: 'https://www.apnrts.ap.gov.in/AssetsNew/pdf/investments/Incentives_2020INDS_MS87_Mega%20Industrial%20Hub%20Kopparthy%20Kadapa.pdf' },
          { label: 'Financial Express — PM opens AP industrial parks (EMC MoU signatories)', url: 'https://www.financialexpress.com/india-news/pm-opens-andhra-industrial-parks-with-rs-5k-cr-investment/4013254/' },
          { label: 'ETHRWorld — Pitti Rail unit, 2,000 jobs', url: 'https://hr.economictimes.indiatimes.com/news/industry/pitti-rail-to-set-up-manufacturing-unit-in-andhra-create-2000-jobs/84474346' },
          { label: 'India Renewable Energy News — Shirdi Sai Electricals ₹30,650 cr MoUs', url: 'https://indiarenews.in/blog/read/shirdi-sai-electricals-signs-inr-30-650-crore-mous-with-andhra-pradesh-government' },
          { label: 'APIIC Board Minutes (Sep 2021) — AIL Dixon & United Telelinks EMC anchors', url: 'https://apiic.in/wp-content/uploads/2024/09/223-233-BM_opt.pdf' },
          { label: 'Times of India — Kadapa/Kurnool node fast-track; Electronic City 3,164 ac', url: 'https://timesofindia.indiatimes.com/city/vijayawada/andhra-pradesh-accelerates-kadapa-and-kurnool-industrial-node-development/articleshowprint/116084020.cms' },
        ],
      }
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
        statusLabel: 'BMIC Phase-1 node — master-planning, MMLP tendered, CCEA approval pending', coords: [139, 406],
        areaAc: 6042,
        projectCostCr: 0,
        sectors: 'Heavy engineering, automobiles, auto & engineering ancillaries, aerospace, defence',
        nearest: 'Dharwad rail station ~25 km; Hubballi airport ~30 km; Karwar port ~170 km; Goa port ~180 km; NH-48 & NH-67',
        developer: 'Jointly developed by NICDIT (National Industrial Corridor Development and Implementation Trust) and KIADB (Karnataka Industrial Area Development Board). No SPV formed yet — likely to be constituted after CCEA approval. ₹0 in project-implementation funds allocated; only ~₹4.22 cr of Project Development Fund spent on consultancy and master planning.',
        companies: [
          { name: 'Aequs (CEDG cluster)', sector: 'Consumer electronics & durable goods', commitment: '~₹3,524–3,540 cr · 358 ac proposed near Ittigatti & Gamanagatti (400 ac applied to KIADB) · ~20,000 jobs — SHLCC-approved 2020; land allotment proposed/pending, in the KIADB region, not confirmed inside the BMIC node boundary [V/V1]' },
          { name: 'NIDAC (Nano India Development & Application Centre)', sector: 'Nano-technology / industrial', commitment: '~₹600 cr plant at Belur Industrial Area · 800 direct + 900 indirect jobs (4,000+ targeted) — operational, expansion planned; a KIADB estate distinct from the greenfield node [V]' },
          { name: 'BMIC Dharwad node (core 6,042 ac)', sector: 'Greenfield industrial node', commitment: 'No named anchor tenants, allottees or signed MoUs as of June 2026 — project in master-planning/tender stage, no land allotted [U]' },
        ],
        industries: ['Heavy engineering', 'Automobiles & auto ancillaries', 'Aerospace & defence', 'Consumer electronics (regional — Aequs, proposed EMC at Kotur-Belur)', 'Logistics & warehousing (Phase-1 MMLP)'],
        infrastructure: [
          '~6,042 ac master-planned (PIB: “over 6,000 acres”), to be developed in three phases — Phase 1: a Multi-Modal Logistics Park (MMLP) on a turnkey basis; Phase 2: industrial layouts across 3 sectors; Phase 3: layouts across 8 sectors.',
          'Strategically sited ~500 km equidistant from Bengaluru and Mumbai on the BMIC; rail at Dharwad (~25 km) with a proposed Dharwad–Belgavi line adjacent, Hubballi airport ~30 km, and ports at Karwar (~170 km) and Goa (~180 km); NH-48 and NH-67 connect Mumbai, Bengaluru and Goa.',
          'Land-use breakdown, plot sizes, land price, environmental clearance and the SPV structure are not yet finalised — all pending the Detailed Master Plan and CCEA approval. The Government of Karnataka has confirmed land availability; KIADB had acquired ~2,000 ac across Gamanagatti, Ittigatti, Mummigatti, Belur and Kotur villages by 2021.',
          'No project-implementation funds released — ₹0 in PIF and ₹0 released by DPIIT to NICDIT; only ~₹4.22 cr of Project Development Fund spent on master planning. The node is materially behind funded NICDP peers such as Tumakuru (CBIC), which secured CCEA approval and ₹608 cr equity in December 2020.',
        ],
        incentives: 'No node-specific BMIC incentives yet (CCEA approval pending). Karnataka Industrial Policy 2025–30 applies: up to 20% capital subsidy on fixed investment (or a PLI alternative), stamp-duty reimbursement, a 5-year electricity-duty exemption, an additional 10% incentive for co-locating R&D/GCC with manufacturing, and an industrial-dormitory subsidy; Dharwad likely falls in an industrially backward Zone 1/2 receiving higher incentives. The Karnataka Clean Mobility Policy 2025–30 proposes an Electronics Manufacturing Cluster at Kotur-Belur. Note a June 2025 Karnataka job-reservation policy (55% of Group A/B and 75% of Group C/D jobs reserved for Kannadigas).',
        summary: [
          'Dharwad is one of the two BMIC Phase-1 nodes (with Satara), a ~6,042-acre greenfield development jointly planned by NICDIT and KIADB and positioned ~500 km equidistant from Bengaluru and Mumbai on the NH-48 axis. Its officially targeted sectors are heavy engineering, automobiles and ancillaries, aerospace and defence.',
          'As of June 2026 the node has not received CCEA approval and no project-implementation funds have been allocated — only ~₹4.22 cr of Project Development Fund has been spent on consultancy. The perspective plan is complete and a consultant is preparing the Detailed Master Plan; the most concrete forward step is the Multi-Modal Logistics Park tender, invited in 2024 and reaffirmed in June 2026.',
          'No anchor tenants have been allotted land inside the node. The investable “base” sits in the surrounding KIADB region: Aequs’ proposed ~₹3,524–3,540 cr consumer-electronics cluster on ~358 acres near Ittigatti/Gamanagatti, and the operational ~₹600 cr NIDAC plant at Belur — both in the Dharwad region but not confirmed within the BMIC node boundary.',
        ],
        sections: [
          { heading: 'Status & what remains', body: [
            'The node has advanced from a completed perspective plan (2022) to consultant-led master planning (2021–2026). Tenders for the Phase-1 Multi-Modal Logistics Park — covering design, construction, testing, commissioning and 5 years of O&M — were invited in 2024 and reaffirmed in June 2026, the clearest sign of forward movement.',
            'The binding constraints are upstream of construction: CCEA approval is still pending, no implementation funds are allocated, the SPV is not yet formed, and the Detailed Master Plan, plot sizes, land price and environmental clearance are all unresolved. Until approval and funding land, trunk infrastructure and industrial allotment cannot proceed.',
          ] },
          { heading: 'The regional industrial base', body: [
            'The Hubballi-Dharwad twin city is Karnataka’s second-largest municipal corporation and gives the node a genuine catchment. KIADB had acquired ~2,000 acres across Gamanagatti, Ittigatti, Mummigatti, Belur and Kotur by 2021, against a wider ~5,000-acre target between Dharwad and Kittur next to NH-48.',
            'Aequs’ consumer-electronics cluster (~₹3,524–3,540 cr, ~358 acres proposed, ~20,000 jobs) is the marquee regional commitment, though it remains a proposed KIADB allotment rather than a confirmed node tenant. The operational NIDAC plant at Belur (~₹600 cr) and several KIADB estates — Belur, Mummigatti, Kotur-Belur, Gamanagatti — with vacant CA/amenity plots form the legacy base the node would integrate. IIT Dharwad, IIIT Dharwad and the University of Agricultural Sciences sit in close proximity.',
          ] },
          { heading: 'Risks & open questions', body: [
            'Approval and funding are the central risks: the project has been awaiting CCEA clearance since at least 2022 with ₹0 in implementation funds, leaving it behind funded peers such as Tumakuru. A regional FMCG cluster has stalled over land-price and legal issues, and the Aequs land allotment is still to be finalised.',
            'Key parameters remain undocumented — the SPV name and shareholding, land-use split and plot sizes, land price per acre, environmental clearance, and water and power allocation are all “not found in sources”. Karnataka’s 2025 job-reservation policy is an additional variable for investor sentiment, though industry has reportedly accepted it.',
          ] },
        ],
        timeline: [
          { date: 'Oct 2020', label: 'Aequs ₹3,540 cr consumer-electronics cluster approved by SHLCC' },
          { date: 'Nov 2021', label: 'Consultant kick-off for master planning & preliminary engineering' },
          { date: 'Mar 2022', label: 'PIB: project cost not approved; ₹0 PIF, ~₹4.22 cr PDF spent' },
          { date: 'Mar 2024', label: 'Tenders invited for the Multi-Modal Logistics Park' },
          { date: 'Jun 2026', label: 'MMLP tender reaffirmed — design, build, commission + 5-yr O&M' },
        ],
        sources: [
          { label: 'PIB — Dharwad node development (Nov 2021)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1775265' },
          { label: 'PIB — Industrial corridors status (Mar 2022)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1806625' },
          { label: 'WorldPorts — tenders invited for Dharwad node (Jun 2026)', url: 'https://www.worldports.org/tenders-invited-for-development-of-dharwad-node-on-bmic/' },
          { label: 'Times of India — tenders invited for Dharwad node (Mar 2024)', url: 'https://timesofindia.indiatimes.com/city/hubballi/tenders-invited-for-devpt-of-dharwad-node-on-bmic/articleshow/108908984.cms' },
          { label: 'The New Indian Express — Dharwad land acquisition & Aequs (Jul 2021)', url: 'https://www.newindianexpress.com/states/karnataka/2021/jul/19/govt-to-begin-land-acquisition-for-dharwad-industrial-area-2332183.html' },
          { label: 'IBEF — Aequs consumer-electronics cluster (Oct 2020)', url: 'https://www.ibef.org/news/aequs-to-invest-rs-3500-crore-to-set-up-consumer-electronics-cluster-in-karnataka' },
          { label: 'BusinessLine — Karnataka Industrial Policy 2025–30', url: 'https://www.thehindubusinessline.com/news/karnataka-unveils-industrial-policy-aiming-for-75-lakh-crore-investments-by-2030/article69207850.ece' },
          { label: 'CAGPT — status of industrial corridors (Apr 2025)', url: 'https://www.cagpt.in/corporate-law/status-industrial-corridors-india' },
        ],
      },
      {
        slug: 'satara', name: 'Satara node', state: 'Maharashtra', stage: 'planned',
        statusLabel: 'BMIC Phase-1 node — master-planning; original site found unsuitable, CCEA approval pending', coords: [124, 371],
        areaAc: 12355,
        projectCostCr: 0,
        sectors: 'General manufacturing — engineering, textiles, heavy fabrication, automotive components',
        nearest: 'Devabhumi Pandharpur rail station ~63 km; Pune ~180 km; Mumbai ~350 km; Dighi port ~271 km road / ~190 km rail; JNPT ~315 km road; NH-548C & NH-548E',
        developer: 'Jointly developed by NICDIT and MIDC (Maharashtra Industrial Development Corporation). The SPV is Maharashtra Industrial Township Limited (MITL) — formerly Aurangabad Industrial Township Limited (AITL), the same SPV that manages AURIC under DMIC. Centre:state shareholding not disclosed. ₹0 in project-implementation funds allocated.',
        companies: [
          { name: 'Filtrum Autocomp', sector: 'Automotive steel parts', commitment: '~₹100 cr at Wai, Satara — MoU signed at the Advantage Maharashtra / Steel Mahakumbh event, Sep 2025 (district-level MoU, not a confirmed BMIC-node allotment) [V]' },
          { name: 'Cummins (India Ltd. & Technologies India)', sector: 'Engines, turbines & power generation', commitment: 'Operational at Phaltan SEZ / MIDC Survadi — ~430 (power-gen unit) + ~800 (engines/turbines) workers; existing MIDC base, not a node tenant [V]' },
          { name: 'Pidilite Industries Ltd.', sector: 'Synthetic resins, paints & adhesives', commitment: 'Operational at Khandala MIDC, Shirwal — existing district base, not within the BMIC node boundary [V]' },
          { name: 'Thermax Babcock & Wilcox Energy Solutions', sector: 'Steam & vapour-generating boilers', commitment: 'Operational at Khandala MIDC Phase-I — ~150 workers; existing MIDC base [V]' },
          { name: 'BMIC Satara node (core ~12,355 ac)', sector: 'Greenfield industrial node', commitment: 'No named anchor tenants, allottees or signed MoUs as of June 2026 — master-planning stage; the originally proposed site was found unsuitable (Dec 2022) and an alternate land parcel is required [U]' },
        ],
        industries: ['Engineering & heavy engineering', 'Textiles', 'Automotive components', 'Chemicals & adhesives', 'Shipbuilding / heavy fabrication', 'General manufacturing', 'Logistics & warehousing'],
        infrastructure: [
          '~12,355 ac (5,000 ha) delineated — the larger of the two BMIC Phase-1 nodes (Dharwad is ~6,042 ac). Land-use breakdown, plot sizes and land price are not yet finalised; the NICDC RfP (May 2021) defines the consultant scope for the Detailed Master Plan, demand assessment, urban design and preliminary engineering.',
          'Sited ~350 km from Mumbai, ~180 km from Pune and ~85 km from Satara city, with NH-548C (Satara–Betul) and NH-548E (Mhaswad–Devbhumi Pandharpur) passing through the site; nearest rail at Devabhumi Pandharpur (~63 km), nearest ports Dighi (~271 km road / ~190 km rail) and JNPT Mumbai (~315 km road / ~239 km rail).',
          'A material setback: the originally proposed Satara site was assessed as unsuitable (NICDC DMU report, Dec 2022) and the State Government was asked to suggest an alternate land parcel — so the node’s footprint itself is unsettled pending a new site.',
          'No project-implementation funds released — ₹0 in PIF and ₹0 released by DPIIT to NICDIT; the perspective plan is complete and land availability has been confirmed by the Government of Maharashtra, but the node is well behind funded DMIC peers such as Shendra-Bidkin (~₹7,948 cr approved, operational).',
        ],
        incentives: 'No node-specific BMIC incentives yet (CCEA approval pending). Under Maharashtra’s January 2026 investment-promotion scheme for underdeveloped districts, Satara is classified Zone 2 — offering ~1.25x returns over 10 years through GST/SGST concessions, plus concessional land rates for investments of ₹500 cr or more that generate 1,000+ jobs (Zone 1 districts get 1.5x). An operational engineering-focused SEZ at Phaltan/Satara provides standard SEZ tax incentives and FDI facilitation.',
        summary: [
          'Satara is the Maharashtra half of the BMIC Phase-1 pair, a ~12,355-acre (5,000-ha) greenfield node jointly planned by NICDIT and MIDC and managed through the MITL SPV (the same vehicle behind AURIC). It is the larger of the two Phase-1 nodes and targets general manufacturing — engineering, textiles and heavy fabrication.',
          'As of June 2026 the node has not received CCEA approval and no implementation funds are allocated. A consultant is appointed and the perspective plan is complete, but progress is set back by a land problem: the originally proposed site was found unsuitable in December 2022 and the State Government was asked to identify an alternate parcel, so even the node’s boundary is unsettled.',
          'No tenants have been allotted land inside the node. The investable base is the surrounding district: a single district-level MoU (Filtrum Autocomp, ~₹100 cr at Wai, Steel Mahakumbh Sep 2025) and a deep legacy of 30+ operational MIDC factories — Cummins, Pidilite, Thermax, Dawlyer Pharma and others — across Khandala, Kesurdi, Phaltan (SEZ), Wai and Karad estates.',
        ],
        sections: [
          { heading: 'Status & what remains', body: [
            'The node has reached completed perspective planning and consultant appointment, with the NICDC RfP for the Detailed Master Plan issued in May 2021. Unlike Dharwad, no public MMLP or development tender for Satara was found — it trails its sister node on visible forward steps.',
            'The defining open issue is the site itself: the December 2022 DMU report recorded the proposed location as unsuitable and asked Maharashtra for an alternate parcel. With CCEA approval, implementation funds, the master plan, plot sizes, land price and environmental clearance all unresolved, the node remains firmly pre-construction.',
          ] },
          { heading: 'The district industrial base', body: [
            'Satara district carries a substantial existing industrial base concentrated in MIDC estates at Khandala (Phase I & II), Kesurdi, Survadi (the Phaltan SEZ), Wai, Karad (Taswade) and Satara. The official Maharashtra Pollution Control Board factory list (Dec 2023) records 30+ operational factories spanning engineering and metal products, power generation, plastics, chemicals and pharma, food and textiles.',
            'Anchors include Cummins (power generation and engines/turbines at Phaltan SEZ, ~1,200+ workers combined), Pidilite, Thermax, Dawlyer Pharma Packaging (~1,500 workers), Tata Power Renewable Energy, and engineering firms such as Cubuilt (1,000 MT/month structural steel) and Pushpak Infracon (shipbuilding at Lonand). This is the live base the node would extend rather than create from scratch.',
          ] },
          { heading: 'Risks & open questions', body: [
            'The site-suitability finding is the standout risk — it can reset master planning and timelines until an alternate parcel is confirmed. On top of that sit the standard pre-approval gaps: no CCEA clearance, ₹0 in implementation funds, and an undisclosed Centre:state shareholding in MITL.',
            'Several parameters are undocumented — the Project Development Fund spent, land-use split, plot sizes, land price, environmental clearance, and water and power allocation. Zone 2 status (1.25x returns) is also a notch below the Zone 1 (1.5x) offer available elsewhere in Maharashtra, a marginal disadvantage for footloose investment.',
          ] },
        ],
        timeline: [
          { date: 'May 2021', label: 'NICDC issues RfP for Satara node master planning (5,000 ha)' },
          { date: 'Mar 2022', label: 'PIB: perspective plan complete; project cost not approved; ₹0 PIF' },
          { date: 'Dec 2022', label: 'NICDC DMU: proposed site found unsuitable — alternate parcel sought' },
          { date: 'Mar 2024', label: 'Satara confirmed as a BMIC Phase-1 node (with Dharwad)' },
          { date: 'Sep 2025', label: 'Filtrum Autocomp ~₹100 cr MoU at Wai (Steel Mahakumbh)' },
          { date: 'Jan 2026', label: 'Maharashtra scheme classifies Satara as Zone 2 (1.25x returns)' },
        ],
        sources: [
          { label: 'PIB — Industrial corridors status (Mar 2022)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1806625' },
          { label: 'NICDC — RfP for Satara node', url: 'https://www.nicdc.in/phocadownload/153tenfile_RfPforSataraNode.pdf' },
          { label: 'National Industrial Corridor — Satara node, Maharashtra', url: 'https://nationalindustrialcorridor.com/satara-node-maharashtra/' },
          { label: 'Times of India — BMIC Phase-1 nodes (Mar 2024)', url: 'https://timesofindia.indiatimes.com/city/hubballi/tenders-invited-for-devpt-of-dharwad-node-on-bmic/articleshow/108908984.cms' },
          { label: 'Elets eGov — AURIC / MITL SPV (Feb 2023)', url: 'https://egov.eletsonline.com/2023/02/auric-maharashtras-golden-address/' },
          { label: 'Industry Outlook — Maharashtra MoUs / Steel Mahakumbh (Sep 2025)', url: 'https://www.theindustryoutlook.com/services-and-consulting/news/maharashtra-govt-signs-rs-80962-cr-mous-40k-jobs-to-be-created-nwid-14467.html' },
          { label: 'Lokmat Times — Maharashtra zone-based investment scheme (Jan 2026)', url: 'https://www.lokmattimes.com/aurangabad/invest-in-25-districts-earn-15x-returns/' },
          { label: 'MPCB — list of factories in Maharashtra (Dec 2023)', url: 'https://mahadish.in/media/front/images/LIST_OF_FACTORIES_DEC23.pdf' },
        ],
      }
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
        statusLabel: 'EPC awarded Sep 2025 — Kerala’s first NICDP node in construction', coords: [162, 480],
        areaAc: 1710, projectCostCr: 3815, investmentCr: 8729, jobs: 51000,
        sectors: 'Pharma & medical devices, food processing, hi-tech & electronics, defence & aerospace, semiconductors, textiles, rubber & plastics',
        nearest: 'NH-544 (Salem–Kochi) adjacent; Coimbatore international airport ~55 km; Kochi airport ~123 km; Kochi Port ~150 km; Palakkad Junction rail ~20 km',
        developer: 'Kerala Industrial Corridor Development Corporation Ltd (KICDC) — SPV incorporated 21 Apr 2021, 50:50 NICDIT : State (KINFRA); chaired by the Principal Secretary (Industries), MD shared with KINFRA. SHA/SSA executed 22 Oct 2020.',
        epc: 'EPC for infrastructure works at Pudussery Central, Pudussery West and Kannambra awarded 24 Sep 2025 to a Dilip Buildcon Ltd (DBL) + PSP Projects JV at ₹1,316.13 cr (incl. GST); construction under way, ~4-year build from award.',
        companies: [
          { name: 'Dilip Buildcon Ltd + PSP Projects (JV)', sector: 'EPC — roads, utilities & trunk infrastructure', commitment: '₹1,316.13 cr (incl. GST) · EPC contract awarded 24 Sep 2025; construction under way [V]' },
          { name: 'Instrumentation Ltd (Palakkad unit)', sector: 'Government land within the node footprint', commitment: '566.30 ac at Pudussery — being transferred GoI→Kerala (tripartite MoU 16 Nov 2018); falls inside the node area, not a private allottee [V]' },
        ],
        industries: ['Pharma & medical devices (420 ac)', 'Food processing & value addition (172 ac)', 'Hi-tech & electronics (55 ac)', 'Defence & aerospace', 'Semiconductors & printed circuits', 'Textiles, rubber & plastics'],
        infrastructure: [
          '~1,710 ac (≈692 ha) across Kannambra, Pudussery Central and Pudussery West villages; ~1,450 ac acquired by May 2025 against ~₹1,489 cr of KIIFB-funded compensation. Land-use (master plan, Sep 2024): pharma & medical devices 420 ac, food processing 172 ac, hi-tech 55 ac, utility 282 ac, residential 70 ac, green belt 100 ac, balance ~611 ac industrial/roads/commercial.',
          'Land-for-equity model: the State contributes land valued at ₹1,789.92 cr matched by an equal NICDIT equity contribution. Two transfer tranches recorded — 110 ac (Dec 2024, ₹104.5 cr released) and 220 ac (Mar 2025, ₹209 cr released), ~330 ac with the SPV.',
          'Both environmental clearances granted — IMC Kannambra by SEIAA Kerala (Jan 2024) and IMC Pudussery by MoEF&CC (Feb 2024); master plan, DPR and tender documents complete; a programme-management consultant tender was floated 23 Dec 2024.',
          'NH-544 frontage; Coimbatore airport ~55 km; Kochi airport ~123 km; Kochi Port ~150 km; Palakkad Junction ~20 km on the Chennai–Mangalore broad-gauge line; two rail overbridges planned; water via rainwater harvesting plus a nearby quarry source.',
        ],
        incentives: 'Land-for-equity (State land ~₹1,789.92 cr as equity); a Special Industrial Township designation and a single-window clearance system announced (notifications pending), with a State-level Network Planning Committee under the Chief Secretary for external electricity/water/road infrastructure and a project task force. State fiscal support flows from Kerala’s Sustainable Industry Incentive Scheme (Dec 2024) — capital-investment subsidy, SGST reimbursement, electricity-duty exemption, stamp-duty waiver, plus a special package for PLI investors.',
        summary: [
          'Palakkad is Kerala’s first node under the National Industrial Corridor Development Programme, on the CBIC extension to Kochi via Coimbatore (also styled the Kochi–Bengaluru Industrial Corridor). It is CCEA-approved (28 Aug 2024) at ₹3,815 cr, holds both environmental clearances, and crossed from tendering into construction when the EPC contract was awarded on 24 September 2025 — the corridor’s headline milestone.',
          'The on-the-ground state of play is real but pre-tenant: ~1,450 acres acquired, ~330 acres transferred to the SPV with ₹313.5 cr of NICDIT equity released across two tranches, and a ₹1,316.13 cr Dilip Buildcon–PSP Projects JV mobilising on trunk infrastructure. No private end-user has yet been allotted land; the master plan earmarks the largest blocks for pharma/medical devices (420 ac) and food processing (172 ac).',
          'The investment and jobs headline should be read with care. NICDC’s own node page cites ~₹8,729 cr investment potential and ~51,000 jobs; the higher ₹38,000 cr / ~98,000-job and earlier ₹10,000 cr / 1,02,000-job figures are comparable-node or early-estimate projections, not committed investment. The node deepens an existing Palakkad industrial base — KINFRA’s 211-acre textile park (120+ units), a 43-unit mega food park and a defence park at Ottapalam all sit nearby.',
        ],
        sections: [
          { heading: 'From CCEA approval to EPC award', body: [
            'The node was approved by the CCEA on 28 August 2024 at a project cost of ₹3,815 cr (a minister’s statement cited ₹3,806 cr; the ₹9 cr gap reflects post-DPR refinement). Both integrated manufacturing clusters cleared environment — Kannambra via SEIAA Kerala in January 2024 and Pudussery via MoEF&CC in February 2024 — and the master plan, DPR and tender documents were complete by late 2024.',
            'A ₹1,100 cr EPC tender was floated in May 2025 (bid deadline extended to 11 August 2025) and awarded on 24 September 2025 to a Dilip Buildcon Ltd–PSP Projects joint venture at ₹1,316.13 cr including GST, with an indicative four-year build. This made Palakkad the first node to reach an EPC award under the corridor’s Kochi extension.',
          ] },
          { heading: 'Land, equity and the land-for-equity model', body: [
            'The node runs on a land-for-equity structure: Kerala transfers encumbrance-free land valued at ₹1,789.92 cr as its equity, matched rupee-for-rupee by NICDIT. By May 2025 roughly 1,450 of the ~1,710 acres had been acquired, funded by ~₹1,489 cr of KIIFB compensation. Land moved to the SPV in two tranches — 110 acres (December 2024) and 220 acres (March 2025) — against which NICDIT released ₹104.5 cr and ₹209 cr respectively.',
            'A 566.30-acre Instrumentation Ltd parcel at Pudussery, being transferred from the Centre to Kerala under a 2018 tripartite MoU, sits inside the node footprint and adds to the land available, though it is a government holding rather than a private allotment.',
          ] },
          { heading: 'Status & open questions', body: [
            'Construction is on trunk infrastructure only; no private anchor tenant or land allottee has been disclosed, and land has not yet been allotted to end-users. The Special Industrial Township and single-window notifications announced in August 2024 remain pending.',
            'The wide spread in headline numbers — NICDC’s ₹8,729 cr / 51,000 jobs versus the ₹38,000 cr / 98,000-job projection — reflects different methodologies; none rests on committed private investment yet. The node’s near-term credibility leans on the existing Palakkad cluster (KINFRA textile, food and defence parks, MRF and HLL Lifecare nearby) rather than on new signed offtake.',
          ] },
        ],
        timeline: [
          { date: 'Aug 2020', label: 'CH2M HILL appointed to prepare the master plan (₹6.78 cr, 30 months)' },
          { date: 'Oct 2020', label: 'SHA/SSA executed for the corridor node' },
          { date: 'Apr 2021', label: 'KICDC SPV incorporated (50:50 NICDIT : State)' },
          { date: 'Jan–Feb 2024', label: 'Environmental clearances granted (Kannambra, then Pudussery)' },
          { date: 'Aug 2024', label: 'CCEA approval at ₹3,815 cr' },
          { date: 'Dec 2024 – Mar 2025', label: 'Land transferred to SPV in two tranches (~330 ac); ₹313.5 cr equity released' },
          { date: 'May 2025', label: '~₹1,100 cr EPC tender floated' },
          { date: 'Sep 2025', label: 'EPC awarded to DBL + PSP Projects JV (₹1,316.13 cr) — construction begins' },
        ],
        sources: [
          { label: 'NICDC — Palakkad node (investment potential, jobs)', url: 'https://nicdc.in/projects/12-new-projects/palakkad-kerala' },
          { label: 'NICDC DMU Report (Jan 2025) — EC/CCEA/equity status', url: 'https://nicdc.in/images/documents/DMU_Report_Jan_2025.pdf' },
          { label: 'The Week (PTI) — EPC contract to DBL + PSP JV (Sep 2025)', url: 'https://www.theweek.in/wire-updates/national/2025/09/24/mes27-kl-smart-city.html' },
          { label: 'Economic Times — KBIC Palakkad node gets green light (May 2025)', url: 'https://m.economictimes.com/news/india/kochi-bangalore-industrial-corridor-gathers-steam-palakkad-node-gets-green/articleshow/121137380.cms' },
          { label: 'Construction World — Palakkad EPC tender (May 2025)', url: 'https://www.constructionworld.in/amp/urban-infrastructure/smart-cities-projects/kerala-floats-rs-11-bn-tender-for-palakkad-smart-city/73723' },
          { label: 'New Indian Express — 1,240 acres acquired (Nov 2023)', url: 'https://www.newindianexpress.com/amp/story/states/kerala/2023/nov/14/industrial-corridor-1240-acres-acquired-in-palakkad-2632631.html' },
        ],
      },
      {
        slug: 'salem-dharmapuri', name: 'Salem–Dharmapuri node', state: 'Tamil Nadu', stage: 'construction',
        statusLabel: 'State-led SIPCOT EV estate — not a formal NICDP node', coords: [184, 466],
        areaAc: 1725, jobs: 20000,
        sectors: 'Electric vehicles & components, EV batteries (anode/cathode/separator/electrolyte), metallurgy, EV spares',
        nearest: 'NH-44 (Srinagar–Kanyakumari) via Salem; Salem airport ~53 km; Bengaluru airport ~129 km; Chennai/Ennore ports ~335–350 km; Salem Junction & Dharmapuri (DPJ) rail',
        developer: 'SIPCOT (State Industries Promotion Corporation of Tamil Nadu) — state-led; no NICDC SPV, no Centre:State shareholding identified. The Salem–Dharmapuri node has no NICDC node page, master plan or CCEA approval.',
        companies: [
          { name: 'Ola Electric', sector: 'Electric-vehicle manufacturing', commitment: '500 ac within the SIPCOT Dharmapuri estate — MoU signed (state-level, 2023); land allocated, construction not yet started [V1]' },
          { name: '200+ MoU signatories', sector: 'EV / battery / metallurgy / EV spares', commitment: 'MoUs signed; land applications in progress — names undisclosed; ~20,000+ aggregate jobs projected [V1]' },
        ],
        industries: ['EV manufacturing', 'EV battery — anode, cathode, separator, electrolyte', 'Metallurgy & battery elements (~27% of area)', 'EV spares & components', 'General engineering'],
        infrastructure: [
          '~1,724.5 ac (≈698 ha) SIPCOT Dharmapuri industrial estate; environmental clearance granted by the Ministry of Environment in November 2024; SIPCOT DPR submitted 2024. Phase-1 ~200+ ac released by May 2025.',
          'EC land-use earmarks ~27% for metallurgy/battery elements (anode production, electrolyte manufacturing); the balance is for EV battery separator/cathode, EV spares and general industrial plots. No full master-plan percentage split (residential/commercial/green/utility) is on record; plot sizes and land price not disclosed.',
          'NH-44 axis; Salem airport ~53 km; Bengaluru airport ~129 km; Salem Junction and Dharmapuri (DPJ) stations; no dedicated freight-corridor link. Chennai/Ennore ports are ~335–350 km away. Water and power availability are not documented in sources.',
        ],
        incentives: 'No NICDP node-incentive framework (the node is not formally established). Development sits on standard SIPCOT estate terms (developed, serviced plots) plus Tamil Nadu’s industrial policy: interest subvention (5% for 6 years, capped by project size), 5-year electricity-tax exemption, SGST refund on capital goods, and a 15% capital subsidy for industrial parks in “C”-category districts (Dharmapuri likely qualifies). EV units additionally draw on the Tamil Nadu EV Policy (2023) — up to 100% gross-SGST reimbursement on EV sales for 15 years.',
        summary: [
          'There is no formally established Salem–Dharmapuri node under the corridor programme — no NICDC node page, SPV, master plan or CCEA approval could be found. What exists on the ground is a state-led SIPCOT industrial estate in Dharmapuri, being positioned by the Tamil Nadu government as an EV-manufacturing hub.',
          'The estate is real and progressing: ~1,724.5 acres earmarked, environmental clearance granted in November 2024, a DPR submitted in 2024, and ~200+ acres released in Phase 1 by May 2025. Its anchor advantage is Ola Electric, which signed a state-level MoU for 500 acres (2023); more than 200 further companies have signed MoUs, with names undisclosed and ~20,000+ jobs projected in aggregate.',
          'Against the corridor’s formal nodes — Palakkad in particular — Salem–Dharmapuri is behind on programme integration (no SPV, no CCEA approval, no central funding), but ahead on a named anchor. It builds on a genuine regional base: SAIL’s Salem Steel Plant, a Salem ELCOT IT SEZ and the SAIL Salem SEZ (112.34 ac, steel) all sit in the wider district, though none is a SIPCOT estate.',
        ],
        sections: [
          { heading: 'A SIPCOT estate, not a corridor node', body: [
            'The development is driven independently by SIPCOT and the Tamil Nadu government, not by NICDC. Searches of NICDC, PIB and DPIIT corridor records returned no Salem–Dharmapuri node — no SPV name, no Centre:State shareholding, no master plan and no CCEA approval. This is the key distinction from Palakkad, the corridor’s only formally approved Kochi-extension node.',
            'The on-the-ground vehicle is the ~1,724.5-acre SIPCOT Dharmapuri estate, announced in 2018, granted environmental clearance in November 2024 and with a DPR submitted the same year. Phase-1 land of ~200+ acres had been released by May 2025, with road-laying under way and earlier land-acquisition issues reported resolved.',
          ] },
          { heading: 'The EV bet and the Ola anchor', body: [
            'The estate is being built around electric vehicles. Its environmental clearance earmarks ~27% of the area for metallurgy and battery elements — anode production and electrolyte manufacturing — with the remainder for battery separator/cathode and EV spares. Ola Electric is the anchor, with a 2023 state-level MoU for 500 acres; over 200 other companies have signed MoUs, though individual names are not disclosed and the ~20,000+ jobs figure is an aggregate state projection rather than committed headcount.',
            'No allottee beyond Ola is named, and Ola’s construction had not started in the sources reviewed, so the pipeline remains intent-stage. The estate’s draw is Tamil Nadu’s EV-policy package (up to 100% SGST reimbursement on EV sales for 15 years) layered on standard SIPCOT and “C”-district incentives.',
          ] },
          { heading: 'Risks & open questions', body: [
            'The central question is formalisation: whether NICDC ever takes Salem–Dharmapuri into the programme as a node, which would unlock central funding and a master plan. Until then it is a state estate with corridor branding. Progress has been slow — announced in 2018, EC only in late 2024, still in land-release phase in 2025.',
            'Water and power availability are undocumented, Dharmapuri’s economy is agriculture-dependent with significant out-migration, and the named tenant base is a single anchor on intent. The 1,724.5-acre area, the 500-acre Ola allocation and the 20,000+ jobs figure each rest on single news-sourced reporting.',
          ] },
        ],
        timeline: [
          { date: '2018', label: 'SIPCOT Dharmapuri estate announced' },
          { date: 'Apr 2023', label: 'Ola Electric MoU (500 ac); road works begin' },
          { date: '2024', label: 'SIPCOT DPR submitted' },
          { date: 'Nov 2024', label: 'Environmental clearance granted (Ministry of Environment)' },
          { date: 'May 2025', label: 'Phase-1 ~200+ ac released; 200+ company MoUs reported' },
        ],
        sources: [
          { label: 'New Indian Express — SIPCOT Dharmapuri estate (May 2025)', url: 'https://www.newindianexpress.com/states/tamil-nadu/2025/May/03/hasten-establishment-of-sipcot-estate-in-dharmapuri' },
          { label: 'The Hindu — Ola Electric MoU at Dharmapuri (Apr 2023)', url: 'https://www.thehindu.com/news/cities/Coimbatore/minister-lays-stone-for-scheme-works-in-dharmapuri/article66691971.ece' },
          { label: 'SEZ India — Operational SEZs list (ELCOT IT SEZ, Salem)', url: 'https://sezindia.gov.in/sites/default/files/operational_SEZ/Operational_SEZs_280.pdf' },
          { label: 'SEZ India — Formal Approvals (SAIL Salem SEZ, 112.34 ac)', url: 'http://www.sezindia.nic.in/writereaddata/pdf/ListofFormalapprovals.pdf' },
          { label: 'Govt of Tamil Nadu — fiscal incentives (industrial policy)', url: 'http://leatherindia.org/wp-content/uploads/2022/04/CLE-Booklet-States-Fiscal-Incentives-Subsidies-April-2022.pdf' },
        ],
      }
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
        slug: 'delhi', name: 'Delhi (northern gateway)', state: 'Delhi NCR', stage: 'planned',
        statusLabel: 'Perspective-plan corridor — northern anchor, no DNIC node here', coords: [170.4, 200.8],
        sectors: 'Manufacturing, agro-processing, services, export-oriented units (anticipated; to be fixed during the perspective plan)',
        nearest: 'National Capital Region; node-level connectivity undetermined — no DNIC node has been identified here',
        developer: 'No SPV formed for the DNIC. NICDC has appointed a consultant to prepare the perspective plan for the overall DNIC region; node identification is part of that consultant’s brief, not yet completed.',
        companies: [
          { name: 'No named allottees, investors or MoUs at perspective-plan stage', sector: '—', commitment: 'As of June 2026 the DNIC has no identified nodes, no SPV and no land acquired, so no companies are allotted at the Delhi end [V]' },
        ],
        industries: ['Manufacturing', 'Agro-processing', 'Services', 'Export-oriented units'],
        infrastructure: [
          'Conceptualised along the North–South Corridor of the Dedicated Freight Corridor (DFC, under development) and the NH-44 / North–South Corridor of the NHDP highway backbone — the spine that gives Delhi its role as the corridor’s northern terminus.',
          'The perspective plan is to assess integration with the NCR’s existing industrial base for potential corridor linkage: the Noida–Greater Noida electronics, IT, auto-component and apparel cluster in Gautam Buddh Nagar, Ghaziabad’s engineering belt, and the Bharatpur–Alwar (Bhiwadi–Neemrana–Khushkhera) auto-component and electronics belt just south in Rajasthan.',
          'No DNIC node, no acquired land and no node-level trunk infrastructure exist at the Delhi end — these existing clusters are within the influence area, not corridor allotments.',
        ],
        incentives: 'Not applicable at perspective-plan stage',
        summary: [
          'Delhi / NCR is the documented northern anchor of the proposed Delhi–Nagpur Industrial Corridor (DNIC), the eleventh corridor under India’s National Industrial Corridor Development Programme. It is shown here as an influence-area terminus, not as a notified greenfield node — as of June 2026 no DNIC node has been identified anywhere along the corridor, including at the Delhi end.',
          'The corridor is at its earliest phase: the perspective-plan stage. NICDC has appointed a consultant to assess feasibility, delineate the region across five states (Delhi, Uttar Pradesh, Rajasthan, Madhya Pradesh and Maharashtra), identify suitable nodes and recommend early-bird projects. There is no SPV, no acquired land and no CCEA approval.',
          'What anchors Delhi’s role is geography rather than any committed project: the North–South DFC alignment and the NH-44 highway backbone make NCR the natural northern origin, and the perspective plan is tasked with assessing how the dense existing NCR–Rajasthan industrial base might integrate into the corridor once nodes are defined.',
        ],
        sections: [
          { heading: 'Perspective-plan status', body: [
            'The DNIC is in the perspective-plan stage — the earliest phase of corridor development. No industrial nodes have been identified, no special-purpose vehicle has been formed and no land has been acquired anywhere along the corridor, the Delhi terminus included.',
            'NICDC has appointed a consultant under a Request for Qualification cum Request for Proposal to prepare the perspective plan for the overall DNIC region. Until that plan recommends nodes and those nodes are approved, there is no DNIC project on the ground at Delhi — only an influence-area role defined by the corridor’s northern origin.',
          ] },
          { heading: 'Scope of the consultant’s brief', body: [
            'The consultant’s terms of reference cover a 20-year regional perspective plan: assessing the feasibility of establishing the DNIC, delineating the corridor and its influence area across the five states, identifying suitable nodes with techno-economic feasibility studies and early-bird projects, and analysing the benefits for regional growth, employment, industrial output and exports.',
            'For the Delhi end specifically, the relevant work is the regional assessment — profiling NCR’s industrial hubs (Noida–Greater Noida, Ghaziabad) and the adjacent Bhiwadi–Neemrana belt, urbanisation and migration trends, MSME and skills gaps — to determine whether and where a node at the corridor’s northern origin is justified.',
          ] },
          { heading: 'What to watch', body: [
            'The key open question is whether the perspective plan has been completed: the consultant’s assignment ran six months from a 2021 start, so the timeline has long passed, but no completed plan or node announcement has surfaced in the public record.',
            'The signals that would move Delhi from influence-area terminus to a live node are: publication of the perspective plan, identification of an early-bird node near NCR, formation of a DNIC SPV, and confirmation of the North–South DFC progress on which the corridor’s logistics case depends.',
          ] },
        ],
        timeline: [
          { date: 'Jul 2021', label: 'NICDC issues the RfQ-cum-RfP for the DNIC perspective-plan consultant' },
          { date: 'Aug 2022', label: 'Consultant appointed; discussions with state governments initiated (NICDC DMU Report)' },
          { date: 'Aug 2024', label: 'DNIC confirmed as the 11th corridor in the National Infrastructure Pipeline (PIB)' },
        ],
        sources: [
          { label: 'NICDC RfQ-cum-RfP — DNIC perspective plan (Jul 2021)', url: 'https://www.nicdc.in/phocadownload/154tenfile_final-rfq-cum-rfp-dnic-nicdc-gem.pdf' },
          { label: 'NICDC DMU Report (Aug 2022)', url: 'https://www.nicdc.in/images/documents/DMU_Report_August_2022.pdf' },
          { label: 'PIB — DNIC as 11th NICDP corridor (Aug 2024)', url: 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2024/aug/doc2024830383401.pdf' },
        ],
      },
      {
        slug: 'nagpur', name: 'Nagpur (southern gateway)', state: 'Maharashtra', stage: 'planned',
        statusLabel: 'Perspective-plan corridor — southern anchor, early Wardha land conversation only', coords: [198, 318],
        sectors: 'Manufacturing, agro-processing, services, export-oriented units (anticipated; to be fixed during the perspective plan)',
        nearest: 'Nagpur multi-modal logistics region; an early site conversation near Wardha (adjacent to MIDC Butibori) — no DNIC node has been identified or notified',
        developer: 'No SPV formed for the DNIC. State governments have proposed land parcels for consideration — including one near Wardha adjacent to MIDC Butibori in Maharashtra — but none has been acquired, allotted or approved as a DNIC node.',
        companies: [
          { name: 'No named allottees, investors or MoUs at perspective-plan stage', sector: '—', commitment: 'As of June 2026 the DNIC has no identified nodes, no SPV and no acquired land at the Nagpur end; the Wardha–Butibori parcel is under site assessment only, with no companies allotted [V]' },
        ],
        industries: ['Manufacturing', 'Agro-processing', 'Services', 'Export-oriented units'],
        infrastructure: [
          'Conceptualised along the North–South Corridor of the Dedicated Freight Corridor (DFC, under development) and the NH-44 highway backbone, which place the Nagpur region as the corridor’s southern terminus.',
          'The perspective plan is to assess integration with the existing base around Nagpur: the operational Butibori MIDC estate (engineering, logistics, manufacturing), the Nagpur multi-modal logistics hub, and the Amravati textile and agro-processing cluster to the west.',
          'The only documented early site conversation is a land parcel near Wardha, adjacent to the existing MIDC industrial area at Butibori, recorded as under site assessment — not acquired, not allotted, and not a notified DNIC node.',
        ],
        incentives: 'Not applicable at perspective-plan stage',
        summary: [
          'The Nagpur region is the documented southern anchor of the proposed Delhi–Nagpur Industrial Corridor. It is shown here as an influence-area terminus, not as a notified greenfield node — as of June 2026 no DNIC node has been identified or approved anywhere along the corridor, the Nagpur end included.',
          'The one concrete sign of activity at this end is an early land conversation: state-government discussions have proposed a parcel near Wardha, adjacent to the existing MIDC industrial estate at Butibori, which is recorded as being under site assessment. This is a proposed parcel under consideration, not a land allotment, and no SPV has been formed.',
          'As at Delhi, Nagpur’s role rests on the corridor’s geography — the North–South DFC alignment and NH-44 — and on a strong existing industrial and logistics base that the perspective plan is to assess for potential integration once nodes are defined.',
        ],
        sections: [
          { heading: 'Perspective-plan status', body: [
            'The DNIC remains at the perspective-plan stage. No industrial nodes have been identified, no SPV has been formed and no land has been acquired — and the Nagpur terminus is no exception, despite being the corridor’s southern namesake.',
            'What exists at this end is a state-government proposal: a parcel near Wardha, adjacent to MIDC Butibori, recorded as under site assessment in the NICDC monitoring reports. It is one of several parcels proposed across the corridor states for consideration, none of which has been transferred or approved.',
          ] },
          { heading: 'Scope of the consultant’s brief', body: [
            'The consultant appointed by NICDC is tasked with a 20-year regional perspective plan: feasibility of establishing the DNIC, delineation of the corridor and its influence area across the five states, identification of suitable nodes with techno-economic feasibility studies and early-bird projects, and analysis of regional-growth, employment, output and export benefits.',
            'For the Nagpur end, the relevant work is profiling the existing industrial scenario — the Butibori MIDC estate, the Nagpur multi-modal logistics hub, the Amravati textile and agro-processing base — and assessing whether the proposed Wardha–Butibori parcel, or another site, should become an early-bird node.',
          ] },
          { heading: 'What to watch', body: [
            'The signals to track are whether the Wardha–Butibori site assessment converts into an identified node, whether the perspective plan is published and recommends an early-bird project at the southern end, and whether a DNIC SPV is eventually formed.',
            'The corridor’s logistics case at Nagpur also depends on the progress of the North–South DFC. Until a node is identified and approved, Nagpur’s position is that of a southern influence-area terminus with one early, unconfirmed land conversation — not an investable node.',
          ] },
        ],
        timeline: [
          { date: 'Jul 2021', label: 'NICDC issues the RfQ-cum-RfP for the DNIC perspective-plan consultant' },
          { date: 'Aug 2022', label: 'Consultant appointed; discussions with state governments initiated (NICDC DMU Report)' },
          { date: 'Aug 2024', label: 'DNIC confirmed as the 11th corridor in the National Infrastructure Pipeline (PIB)' },
        ],
        sources: [
          { label: 'NICDC RfQ-cum-RfP — DNIC perspective plan (Jul 2021)', url: 'https://www.nicdc.in/phocadownload/154tenfile_final-rfq-cum-rfp-dnic-nicdc-gem.pdf' },
          { label: 'NICDC DMU Report (Aug 2022)', url: 'https://www.nicdc.in/images/documents/DMU_Report_August_2022.pdf' },
          { label: 'PIB — DNIC as 11th NICDP corridor (Aug 2024)', url: 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2024/aug/doc2024830383401.pdf' },
        ],
      }
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
