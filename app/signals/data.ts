export interface SignalBody {
  type: 'p' | 'h' | 'list';
  text?: string;
  items?: string[];
}

export interface SignalMeta {
  slug: string;
  no: string;
  title: string;
  domain: string;
  date: string;
  dateLabel: string;
  status: 'live' | 'monitoring' | 'placeholder';
  excerpt: string;
  readingTime: string;
  body?: SignalBody[];
  takeaways?: string[];
  sources?: string[];
}

export const syncedAt = new Date().toISOString();

export const signals: SignalMeta[] = [{
  slug: 'dholera-water-signal',
  no: 'S-001',
  title: 'Dholera Water Signal',
  domain: 'Industrial Infrastructure',
  date: '2026-05-12',
  dateLabel: '12 May 2026',
  status: 'placeholder',
  excerpt: 'Placeholder — analysis of water sourcing, allocation and resilience dependencies forming around the Dholera industrial corridor. To be published.',
  readingTime: '— ',
  body: [],
  takeaways: [],
  sources: []
}, {
  slug: 'talent-constraint',
  no: 'S-002',
  title: 'Why Talent May Become the Real Constraint',
  domain: 'Strategic Technology',
  date: '2026-05-18',
  dateLabel: '18 May 2026',
  status: 'monitoring',
  excerpt: 'Capital and policy can be assembled quickly. The deep process-engineering and yield-management talent that makes a fab productive cannot — and that asymmetry shapes the realistic ramp curve.',
  readingTime: '5 min',
  body: [{
  text: 'A fab can be financed in a board meeting and built in roughly two to three years. The capability to run it at competitive yield is a different kind of asset — accumulated tacit knowledge held by process engineers, equipment specialists and yield-management teams that cannot be procured on the same timeline as the tools.',
  type: 'p'
}, {
  text: 'Every late-entrant manufacturing economy has confronted the same asymmetry. The usual answer is a blend: seed lines with experienced expatriate engineers while building domestic pipelines through universities, vendor training and on-the-job ramp. Both halves take years to mature, which is why talent — not capital or policy — tends to set the binding pace once construction is complete.',
  type: 'p'
}, {
  text: 'The signal to watch',
  type: 'h'
}, {
  text: 'Track returning-diaspora hiring, equipment-vendor training footprints and university-to-fab placement programmes. These are slower-moving but more predictive of sustained output than groundbreaking ceremonies.',
  type: 'p'
}],
  takeaways: ['Equipment can be bought; tacit process knowledge has to be grown or imported.', 'Yield ramp — not construction — is where talent depth becomes decisive.', 'Expatriate seeding plus domestic pipelines is the standard pattern; both take years.'],
  sources: ['https://www.meity.gov.in/', 'https://pib.gov.in/PressReleasePage.aspx?PRID=2134567']
}, {
  slug: 'osat-bottleneck',
  no: 'S-003',
  title: 'India’s Hidden OSAT Bottleneck',
  domain: 'Semiconductors',
  date: '2026-05-24',
  dateLabel: '24 May 2026',
  status: 'live',
  excerpt: 'Front-end fabrication attracts the headlines, but the binding constraint on near-term output is back-end assembly, test and packaging capacity — and the specialised inputs it quietly depends on.',
  readingTime: '4 min',
  body: [{
  text: 'Public attention on India’s semiconductor effort concentrates almost entirely on the front end — wafer fabrication. Yet the part of the value chain most likely to determine how quickly the country can convert policy into shipped product is the back end: outsourced assembly, test and packaging.',
  type: 'p'
}, {
  text: 'Packaging is less capital-intensive than a leading-edge fab and ramps faster, which is precisely why it tends to absorb the first wave of manufacturing employment in a new cluster. But it depends on a thin layer of specialised inputs — organic substrates, lead-frames, bonding wire and a long list of high-purity chemicals and gases — most of which are currently imported.',
  type: 'p'
}, {
  text: 'Why it matters',
  type: 'h'
}, {
  text: 'If substrate and consumable supply does not localise in step with assembly capacity, the bottleneck simply migrates one layer up the chain. The strategic question is not whether India can stand up packaging lines, but whether the inputs feeding them are secured before the lines are commissioned.',
  type: 'p'
}, {
  type: 'list',
  items: ['Watch substrate and lead-frame sourcing announcements as a leading indicator of genuine localisation.', 'Treat packaging employment figures as the more reliable near-term metric than wafer-fab headcount.', 'Specialised-chemical supply agreements are an under-reported tell on cluster maturity.']
}],
  takeaways: ['Assembly, test and packaging (ATMP/OSAT) is the layer most exposed to near-term ramp risk.', 'Substrate, lead-frame and high-purity chemical supply are thin and largely imported.', 'Packaging capacity, not wafer starts, is the more realistic 2026–28 employment story.'],
  sources: ['https://www.meity.gov.in/content/semiconductor', 'https://www.india.gov.in/']
}, {
  slug: 'advanced-packaging-binding-constraint',
  no: 'S-007',
  title: 'Advanced packaging is India’s binding AI constraint',
  domain: 'AI Infrastructure',
  date: '2026-05-29',
  dateLabel: '29 May 2026',
  status: 'live',
  excerpt: 'India has built or is building twelve semiconductor projects worth ₹1.65 lakh crore. None of them produces the chips that AI accelerators are made from — because the binding constraint is not the fab, it is advanced packaging.',
  readingTime: '5 min',
  body: [{
  text: 'The India Semiconductor Mission has, by May 2026, approved twelve projects with cumulative announced capex of approximately ₹1.65 lakh crore — anchored by the Tata-PSMC fab at Dholera (₹91,000 crore, 50,000 WSPM at 28-110 nm), the Tata-TSAT OSAT in Assam (₹27,120 crore), the Micron Sanand OSAT (USD 2.75 billion), and four other OSAT facilities at Sanand and Surat. This is real industrial-policy success. But fabs at mature nodes do not produce the chips that power AI accelerators, and India has no announced CoWoS-class advanced packaging or HBM stacking capability — the two bottlenecks that gate every Nvidia, AMD or Intel AI accelerator made today.',
  type: 'p'
}, {
  text: 'CoWoS capacity has been oversubscribed through at least 2026; HBM3E allocation is fully committed through 2026. The global capacity is concentrated: TSMC ~75% of advanced 2.5D-packaging capacity, ASE ~15%, Amkor ~8%, with Samsung I-Cube and Intel Foveros holding the residual. India’s announced OSAT capacity does not address this — Tata’s Integrated System Packaging at Jagiroad is system-in-package level, not chiplet/HBM-class on an interposer.',
  type: 'p'
}, {
  text: 'What an Indian advanced-packaging facility would require',
  type: 'h'
}, {
  text: 'A first-generation Indian CoWoP-equivalent facility producing 5,000–10,000 wafer-equivalent units per month requires capex in the range of USD 3–6 billion (₹25,000–50,000 crore) at full ramp — comparable to second-tier global competitors. The equipment list is concentrated in non-Indian OEMs (BESI, ASMPT, Hanmi for bonding; AMAT, Lam for TSV process; Veeco, Onto Innovation for inspection). Lead times in 2026 are 12–18 months for bonding tools and 18–24 months for TSV process tools. Customer qualification cycles from fabless customer to production order are 18–30 months. First commercial AI-class package: 2030–2032.',
  type: 'p'
}, {
  text: 'The strategic case',
  type: 'h'
}, {
  text: 'Three factors make this defensible. First, global capacity is structurally constrained — TrendForce projects CoWoS demand at 50% CAGR through 2027 against capacity growth of 35% CAGR. A second-source from a non-Taiwan, non-China geography is commercially valuable. Second, the technology is difficult but is not on a critical-IP control list in the way EUV lithography is. Third, India’s existing OSAT base provides a foundation of cleanroom labour and process-engineering talent.',
  type: 'p'
}, {
  text: 'For the full analysis of the gap, the capex envelope and the customer-development path, see Section 11 of India’s AI Industrial Transition and Infrastructure Transformation (2026–2035).',
  type: 'p'
}],
  takeaways: ['Every Nvidia H100, H200, B200, GB200, AMD MI300, Intel Gaudi 3 and Google TPU is a multi-die assembly bonded onto a 2.5D/3D advanced-packaging substrate (TSMC CoWoS, Intel EMIB/Foveros, ASE CoWoP).', 'No Indian OSAT has announced CoWoS-class capability. Tata Assam’s ISP is system-in-package; Micron, CG Semi, Kaynes and HCL-Foxconn are commodity wire-bond/flip-chip/DDIC. The gap is structural.', 'A first-generation Indian advanced-packaging facility needs USD 3–6 billion (₹25,000–50,000 crore) of capex, 12–24 month equipment lead-times, and a 4–5 year build, with first commercial shipment plausible in 2030–2032.'],
  sources: ['https://www.meity.gov.in/content/semiconductor', 'https://pib.gov.in/PressReleasePage.aspx?PRID=2134567']
}, {
  slug: 'ai-corridor-competition',
  no: 'S-004',
  title: 'The corridor logic: why state competition decides India’s AI geography',
  domain: 'AI Infrastructure',
  date: '2026-05-29',
  dateLabel: '29 May 2026',
  status: 'live',
  excerpt: 'The unit of competition for India’s AI build-out is the corridor, not the state. Seven corridors are competing for the next decade of hyperscaler and semiconductor capital; their endowments and binding constraints differ sharply.',
  readingTime: '5 min',
  body: [{
  text: 'A data centre is sited where power is plentiful and grid-firm, where water is available and water rights are clear, where fibre lands or transits, where land is buildable and zoned, where the regulatory environment is predictable, and where adjacent skilled labour exists. These conditions cluster geographically — in Mumbai, Chennai, Hyderabad, Bengaluru, Pune, Visakhapatnam, Noida–Sanand–Dholera — and not nationally. The competitive question for Indian states is not whether they are doing AI; it is whether their corridor scores well across these axes against the others.',
  type: 'p'
}, {
  text: 'The seven corridors and their binding constraints',
  type: 'h'
}, {
  type: 'list',
  items: ['Karnataka / Bengaluru — highest on talent and compute pipeline; lowest on water (Bengaluru Urban over-exploited, Bengaluru Rural at 169% of permissible extraction).', 'Telangana / Hyderabad — highest on hyperscaler magnetism (AWS USD 7B, Microsoft USD 17.5B+ commitments, CtrlS 612 MW, Yotta 50 MW); water-stressed (over-exploited 2024 upgrade); Godavari Phase II/III is the structural mitigant.', 'Tamil Nadu / Chennai-Coimbatore — highest electronics manufacturing depth (USD 14.65 billion FY25); coastal-fibre; Tier-2 R&D in Coimbatore; tightening on water (2019 Day Zero).', 'Maharashtra / Mumbai-Pune-Navi Mumbai — largest DC mass (44% of national); eight CLS at Mumbai; cost-pressured; MERC HT cross-subsidy softening.', 'Gujarat / Sanand-Dholera — only state with a major fab (Tata-PSMC ₹91,000 crore); Sanand OSAT cluster ₹1.25 lakh crore; ports and RE depth; AI-services light.', 'NCR / UP / Jewar-Noida — Jewar airport cargo (250,000 → 1.8 million MT/year), HCL-Foxconn OSAT, EMC 2.0; e-commerce and fintech anchor.', 'Andhra Pradesh / Visakhapatnam — rising fastest on Google-Adani 1 GW commitment, Sify Open CLS, favourable water position; transmission execution is the principal risk.']
}, {
  text: 'Why it matters',
  type: 'h'
}, {
  text: 'Every Indian corridor is strong on some axes and weak on others. There is no national winner — there are seven regional bets with structurally different binding constraints. Capital allocation across the corridors is therefore a portfolio choice, and the corridor-level outcomes will diverge sharply because the underlying endowments diverge sharply. The path-dependent geography of 2026–2030 will set the structural pattern for 2030–2035 and beyond.',
  type: 'p'
}, {
  text: 'For corridor-by-corridor profiles, the AI Regional Opportunity Corridors framework, and the state-by-state policy and tariff analysis, see Part V (Sections 18–25) of India’s AI Industrial Transition and Infrastructure Transformation (2026–2035).',
  type: 'p'
}],
  takeaways: ['No Indian corridor is strong on all six axes (compute, power, water, fibre, semiconductor adjacency, talent). Every regional bet involves a structural trade-off.', 'Karnataka has the talent and policy depth but not the water. Tamil Nadu has electronics manufacturing and coastal-fibre but tightening water. Gujarat has the semiconductors but not the data centres. Andhra Pradesh is rising fastest on Google-Adani Visakhapatnam.', 'Capital allocation across Indian corridors is a portfolio choice, not a single bet. The binding constraint in each corridor is different — and is the right unit of policy and execution.'],
  sources: ['https://www.meity.gov.in/content/semiconductor', 'https://www.india.gov.in/']
}, {
  slug: 'ai-opportunity-surfaces-india',
  no: 'S-005',
  title: 'Eight opportunity surfaces from India’s AI infrastructure cycle',
  domain: 'Industrial Opportunity',
  date: '2026-05-29',
  dateLabel: '29 May 2026',
  status: 'live',
  excerpt: 'India’s AI infrastructure cycle creates a ₹80,000–150,000 crore aggregate Indian-vendor opportunity through 2030. ₹28,000–60,000 crore of it is addressable to SMEs. Eight industrial segments capture most of it.',
  readingTime: '5 min',
  body: [{
  text: 'India’s AI infrastructure cycle is the largest single addressable opportunity of the decade for Indian industrial equipment and services. The aggregate Indian-vendor opportunity through 2030 sums to ₹80,000–150,000 crore (USD 10–18 billion) across eight industrial segments, of which ₹28,000–60,000 crore is addressable to SMEs across three accessibility tiers.',
  type: 'p'
}, {
  text: 'The eight segments',
  type: 'h'
}, {
  type: 'list',
  items: ['Industrial cooling and HVAC: ₹7,500–36,000 crore cumulative through 2030; Indian capture 35–55% (Voltas, Blue Star, Carrier-Midea India, Eureka Forbes Industrial, Thermax).', 'Semiconductor-grade specialty gases: by 2032 ₹5,000–7,500 crore per year market; Indian capture 40–55% (Linde India, Inox Air Products) — ₹2,000–4,000 crore per year by 2032.', 'Edge AI infrastructure deployment in 30–50 Tier-2 cities: ₹10,000–45,000 crore capex through 2030 — most accessible category to Indian system integrators.', 'AI-enabled industrial automation: ₹25,000–60,000 crore through 2030 (Indian share of USD 12–18 billion market).', 'Cleanroom systems and precision construction: ₹5,000–15,000 crore through 2032 (Praj, L&T, Tata Projects, Macawber Beekay, Astha Cleantech).', 'Power conditioning and DC-side electricals: ₹25,000–50,000 crore cumulative; Indian capture 40–60%.', 'Specialty industrial software and platforms: ₹12,000–25,000 crore through 2030; Indian capture 50–65%.', 'Fibre deployment and structured cabling: ₹17,000–33,000 crore cumulative; Indian capture 70–85% (Sterlite, Aksh, Polycab, KEI).']
}, {
  text: 'SME participation',
  type: 'h'
}, {
  text: 'Tier 1 (ready now, 0–24 months, low capital): rack and cabinet fabrication, structured cabling, fibre splicing, HVAC duct fabrication, security-system integration, BESS installation, basic cleanroom commissioning — ₹8,000–15,000 crore through 2030 distributed across thousands of small contractors. Tier 2 (build within 24 months, medium capital, technology validation): chiller assembly and CDU integration, precision piping for UPW and process gases (with Stainless 316L welding certifications), industrial-monitoring sensors, edge IoT devices, micro-DC turnkey 50–500 kW boxes, time-sensitive OT networking, thermal management subsystems — ₹12,000–25,000 crore through 2030 across 200–500 mid-tier suppliers. Tier 3 (build through partnership, 3–5 year cycle): substrate fabrication (ABF, FCBGA), semiconductor consumables (precision masks, sputter targets, photoresists), UPW plant components (membranes, RO, EDI), process chemicals — ₹8,000–20,000 crore through 2030 across 50–200 high-skill specialist suppliers.',
  type: 'p'
}, {
  text: 'For the segment-by-segment quantification, the SME Opportunity Stack tiers, and the four policy interventions that would unlock SME participation, see Section 30A of India’s AI Industrial Transition and Infrastructure Transformation (2026–2035).',
  type: 'p'
}],
  takeaways: ['Cooling and HVAC for AI infrastructure: ₹7,500–36,000 crore cumulative through 2030, Indian-vendor capture 35–55% by 2030.', 'Industrial automation: Indian-vendor share of a USD 12–18 billion market by 2030 — ₹25,000–60,000 crore through 2030.', 'Edge AI infrastructure across 30–50 Tier-2 cities: ₹10,000–45,000 crore capex, the most accessible category to Indian system integrators.'],
  sources: ['https://www.india.gov.in/', 'https://www.meity.gov.in/']
}, {
  slug: 'visakhapatnam-coastal-ai',
  no: 'S-006',
  title: 'The Visakhapatnam coastal-AI thesis',
  domain: 'AI Infrastructure',
  date: '2026-05-29',
  dateLabel: '29 May 2026',
  status: 'live',
  excerpt: 'The 71% concentration of India’s submarine-cable capacity at Mumbai and Chennai is the single largest geographic risk to Indian AI infrastructure. Visakhapatnam is the one project that materially diversifies it.',
  readingTime: '4 min',
  body: [{
  text: 'The geography of AI inference is decided by latency. Below ~50 ms end-to-end the difference is imperceptible; above 100 ms it becomes noticeable; above 200 ms real-time agentic workflows degrade. The latency budget pulls inference toward coastal cities where submarine cables land. India operates 17 international submarine cables across 16-17 cable landing stations. Mumbai hosts eight CLS; Chennai four. Combined, those two cities hold approximately 71% of national CLS capacity — the single largest geographic risk to Indian AI infrastructure.',
  type: 'p'
}, {
  text: 'The strategic opening is Visakhapatnam. The Sify-led Open CLS at Visakhapatnam is the regulatory foundation; the AdaniConneX 200 MW → 1 GW campus is the platform; the Google AI hub of USD 15 billion across 2026–2030 (three Madhurawada tech-zone campuses, gigawatt-scale electricity, 100% renewable energy commitment, AdaniConneX scaling to 1 GW, Airtel-Nxtra partner role, associated subsea cable and clean-energy investment) is the economic anchor. Groundbreaking was April 2026.',
  type: 'p'
}, {
  text: 'Why it matters',
  type: 'h'
}, {
  text: 'By 2030 Visakhapatnam could plausibly hold 8–12% of national CLS capacity, materially diversifying coastal-fibre concentration. The water position is the most favourable of any rising-corridor district — Visakhapatnam is coastal with potential for captive desalination; CGWB stress classifications are benign relative to Bengaluru, Hyderabad or Chennai. APERC’s FY26 tariff order held rates flat with a ₹12,632 crore state subsidy. The bet is concentrated and binary: if Google-Adani executes on schedule, AP is transformed; if it slips 12–24 months, geographic concentration in Mumbai-Chennai persists.',
  type: 'p'
}, {
  text: 'For the corridor profile, the readiness-matrix score, and the relationship to the Sricity electronics cluster, see Section 25 of India’s AI Industrial Transition and Infrastructure Transformation (2026–2035).',
  type: 'p'
}],
  takeaways: ['The AdaniConneX Visakhapatnam platform scales from 200 MW initial to 1 GW AI-ready capacity (Adani Group commitment ≈ USD 10 billion / ₹83,000 crore).', 'The associated Google AI hub is USD 15 billion over 2026–2030 across three Madhurawada tech-zone campuses, with a 100% renewable energy commitment and Sify-led Open CLS as the regulatory foundation.', 'Visakhapatnam’s water position (coastal, desalination-eligible, lower CGWB stress) is more favourable than any inland corridor city. The transmission build-out (dedicated 400 kV lines from southern AP) is the principal area of execution risk.'],
  sources: ['https://pib.gov.in/PressReleasePage.aspx?PRID=2134567', 'https://www.meity.gov.in/']
}, {
  slug: 'netrasemi-a2000-edge-ai-silicon',
  no: 'S-012',
  title: 'India’s first edge-AI chip is a design-led bet',
  domain: 'Edge AI & Semiconductors',
  date: '2026-05-30',
  dateLabel: '30 May 2026',
  status: 'live',
  excerpt: 'Kerala’s NetraSemi, backed by Zoho, has unveiled the A2000 — a 12nm edge-AI system-on-chip and the first Indian-designed AI chip to reach silicon. It matters less as a product than as proof of a thesis: edge AI is the one layer of the AI-hardware stack India can contest now, without a leading-edge fab.',
  readingTime: '4 min',
  body: [{
  text: 'On 28 May 2026, Kerala-based NetraSemi unveiled the A2000, a 12nm edge-AI system-on-chip and the first Indian-designed AI processor to reach working silicon. Built for on-device inference — running AI models locally rather than in the cloud — it targets smart surveillance cameras, drones, robotics, industrial automation and intelligent video gateways. The company has completed the critical silicon bring-up phase, is running trials with three customers in surveillance and automotive, and has slated volume production at TSMC for 2026–27. It has raised roughly ₹125 crore from Zoho and Unicorn India Ventures, and was among the first cohort selected under the government’s Design-Linked Incentive scheme.',
  type: 'p'
}, {
  text: 'Why it is a marker, not just a product',
  type: 'h'
}, {
  text: 'The significance is structural. Across the AI-hardware stack, leading-edge fabrication and advanced packaging are capital-heavy, equipment-gated and years away for India. Edge AI is the exception: it is design-led. The value sits in chip architecture, IP and the software toolchain, with wafers outsourced to a foundry — precisely the fabless model the DLI scheme exists to seed. A working 12nm part from an Indian team is evidence that the design-led route is real, not aspirational.',
  type: 'p'
}, {
  text: 'The test that still lies ahead',
  type: 'h'
}, {
  text: 'Unveiling is not volume. The hard part of a chip startup is the distance between silicon bring-up and bankable production: customer qualification runs 18–30 months, the software and model-deployment stack has to mature alongside the silicon, and a single design win rarely sustains a fab order. The A2000’s trajectory through 2027 — from three trial customers to repeat production orders — is the metric to watch.',
  type: 'p'
}, {
  text: 'The applications are also the link to India’s defence-industrial gap. Edge compute was one of the weakest layers in India’s Battlefield Automation Gap, and surveillance, drones and robotics are exactly the A2000’s targets — this is the beginning of a domestic supply answer. For the full map of the edge-AI hardware stack and where Indian firms can capture value, see the forthcoming report India’s Edge AI Economy.',
  type: 'p'
}],
  takeaways: ['The A2000 is a 12nm edge-AI SoC for on-device inference — targeting smart surveillance, drones, robotics and industrial automation. It has completed silicon bring-up and is in trials with three surveillance and automotive customers; volume production is slated at TSMC in 2026–27.', 'NetraSemi has raised ~₹125 crore (Zoho, Unicorn India Ventures) and was an early Design-Linked Incentive (DLI) awardee — exactly the fabless, design-led model the DLI scheme was built to seed.', 'Edge AI is the part of the AI-hardware stack that needs no leading-edge fab: the value sits in architecture, IP and software, with manufacturing outsourced to a foundry. It is where India’s design talent can capture value while domestic fabs and advanced packaging remain years away.'],
  sources: ['https://www.meity.gov.in/content/semiconductor', 'https://pib.gov.in/PressReleasePage.aspx?PRID=2134567']
}, {
  slug: 'talent-may-matter-more-than-subsidies',
  no: 'S-011',
  title: 'Why talent may matter more than subsidies',
  domain: 'Strategic Technology',
  date: '2026-06-12',
  dateLabel: '12 Jun 2026',
  status: 'monitoring',
  excerpt: 'Capital and policy can be assembled in a board meeting. The deep process-engineering and yield-management talent that makes a fab or a hyperscale DC productive cannot. The asymmetry is what sets the realistic ramp curve.',
  readingTime: '5 min',
  body: [],
  takeaways: ['Equipment can be bought; tacit process knowledge has to be grown or imported.', 'Yield ramp — not construction — is where talent depth becomes decisive.', 'Expatriate seeding plus domestic pipelines is the standard pattern; both take years.'],
  sources: ['https://www.meity.gov.in/', 'https://www.india.gov.in/']
}, {
  slug: 'indias-hidden-industrial-water-crisis',
  no: 'S-010',
  title: 'India’s hidden industrial water crisis',
  domain: 'Industrial Infrastructure',
  date: '2026-06-19',
  dateLabel: '19 Jun 2026',
  status: 'monitoring',
  excerpt: 'CGWB classifies Bengaluru and Hyderabad as over-exploited, Chennai as critical. The DC pipeline is densest where the water position is most stressed. This signal names the corridor-level audits that are not yet being published.',
  readingTime: '4 min',
  body: [],
  takeaways: [],
  sources: ['https://www.india.gov.in/', 'https://pib.gov.in/PressReleasePage.aspx?PRID=2134567']
}, {
  slug: 'vendor-economy-behind-semiconductor-fabs',
  no: 'S-009',
  title: 'The vendor economy behind semiconductor fabs',
  domain: 'Semiconductor Ecosystems',
  date: '2026-06-26',
  dateLabel: '26 Jun 2026',
  status: 'monitoring',
  excerpt: 'Of a ₹91,000 crore mature-node fab, roughly two-thirds flows to ASML, AMAT, Lam, TEL and KLA. The Indian-capture economy lives in the remaining one-third — construction, gases, UPW, logistics and the durable industrial capabilities those build.',
  readingTime: '5 min',
  body: [],
  takeaways: [],
  sources: ['https://www.meity.gov.in/', 'https://www.india.gov.in/']
}, {
  slug: 'jewar-electronics-manufacturing-ecosystem',
  no: 'S-013',
  title: 'Jewar Isn\'t Becoming an Airport City. It\'s Becoming an Electronics Ecosystem.',
  domain: 'Electronics Manufacturing',
  date: '2026-06-29',
  dateLabel: '29 June 2026',
  status: 'live',
  excerpt: 'The headline calls Jewar a semiconductor hub. The more consequential shift is that India is placing chip assembly, PCB fabrication, component manufacturing and an international airport inside a single corridor — moving the unit of industrial competition from the factory to the ecosystem.',
  readingTime: '6 min',
  body: [{
  text: 'The announcement is being read as a semiconductor story — Jewar becomes North India\'s chip hub. That framing undersells what is happening. For the first time in India, the separate layers of an electronics economy — semiconductor assembly, printed-circuit-board fabrication, component manufacturing, air-cargo logistics and an international gateway — are being placed inside a single, roughly fifty-kilometre geography. The more important development is not that another factory is being built. It is that the unit of industrial competition is moving from the factory to the ecosystem.',
  type: 'p'
}, {
  text: 'What was actually announced',
  type: 'h'
}, {
  text: 'On 27 June 2026, foundation stones were laid at Yamuna City, near Jewar, for two electronics projects worth about Rs 6,750 crore. ASCENT-K Circuit — a joint venture with Korea\'s KCC — will invest roughly Rs 3,250 crore in advanced, high-density, multi-layer printed circuit boards. Amber Enterprises will invest about Rs 3,500 crore in HVAC components and PCB assembly. Together the two plants are expected to employ around 3,000 people.',
  type: 'p'
}, {
  text: 'They do not sit in isolation. They are adjacent to the Rs 3,700 crore HCL-Foxconn outsourced assembly and test (OSAT) facility approved under the India Semiconductor Mission — the sixth unit nationally and the first in Uttar Pradesh — which is to package display-driver chips at a planned 20,000 wafers a month, with commercial output targeted for 2027. Around them sit the newly inaugurated Jewar international airport, the Yamuna Expressway and proximity to the Delhi-Mumbai Industrial Corridor. A chip-assembly layer, a board-fabrication layer, a component layer and a logistics layer — within one corridor.',
  type: 'p'
}, {
  text: 'Why this is an ecosystem story, not a factory story',
  type: 'h'
}, {
  text: 'Electronics competitiveness is decided less by any single plant than by what surrounds it. Lead times, freight costs, the density of nearby suppliers, shared utilities and a common pool of trained labour are what make a location cheap and fast to manufacture in. When PCB fabrication, PCB assembly, chip packaging and component production sit within an hour of each other and of an air-cargo terminal, the cost of building electronics there falls — and the advantage attaches to the place rather than to any one firm.',
  type: 'p'
}, {
  text: 'This is the pattern behind every electronics region that became globally competitive. Shenzhen, Suzhou, Hsinchu and Penang did not win on national champions; they won on clusters — thick webs of suppliers, sub-assemblers, tool shops and logistics that let a design move from prototype to volume without leaving the region. India has so far built mostly isolated anchors. Jewar is the first place where the pieces are being positioned closely enough to ask whether a genuine cluster can form.',
  type: 'p'
}, {
  text: 'Co-location changes the unit economics in concrete ways. A board fabricated, populated and tested within the same corridor avoids weeks of inbound and outbound freight, the working capital tied up in transit, and the customs friction between each cross-border hop. For an air-freight-intensive industry, an international cargo gateway inside the cluster compresses the distance between an Indian line and a global customer. In thin-margin electronics these are not marginal savings — they are often the difference between a competitive quote and an uncompetitive one.',
  type: 'p'
}, {
  text: 'The PCB layer is the hidden middle',
  type: 'h'
}, {
  text: 'The printed circuit board is the substrate beneath almost every electronic system — telecom equipment, vehicles, defence electronics, drones, medical devices and consumer hardware all rest on it. India imports an estimated Rs 40,000 crore of PCBs a year, and the bill concentrates in precisely the advanced, high-density, multi-layer boards the Jewar investment targets. Localising this layer therefore carries leverage across many sectors at once, which is what makes it more strategically interesting than any single end-product line.',
  type: 'p'
}, {
  text: 'The choice of advanced multi-layer and HDI boards matters. Single- and double-sided boards are largely commoditised and low-value; the import bill, and the technical barrier, sit in the high-layer-count, fine-pitch boards that telecom, automotive electronics, defence and high-end computing require. Targeting that tier is the difference between import substitution at the bottom of the value curve and real capability at the top of it.',
  type: 'p'
}, {
  text: 'The caution is familiar from our other work. Bare-board fabrication itself depends on inputs that remain largely imported — copper-clad laminates, photoresists and specialty process chemicals, and the drilling, plating and lamination equipment that defines yield. Assembly and fabrication can localise quickly; the materials and machinery beneath them move far more slowly. Without that upstream migration, the dependency does not disappear — it relocates one layer up the chain.',
  type: 'p'
}, {
  text: 'What to watch',
  type: 'h'
}, {
  type: 'list',
  items: ['Supplier migration: whether laminate, chemical, connector and equipment makers establish inside the corridor, or the anchor plants simply import inputs and ship boards out.', 'Logistics depth: air-cargo capacity and bonded warehousing at Jewar, since high-value electronics is freight-time-sensitive.', 'Internal linkage: whether the OSAT\'s display drivers feed local board assembly, or are exported while assemblers source their chips elsewhere.', 'Talent: the depth of PCB and process-engineering skills, which set yield once construction is finished.', 'Utilities: reliable power and water quality — the quiet preconditions for plating and semiconductor-grade processes.']
}, {
  text: 'The tell is straightforward. An ecosystem is forming when the second- and third-tier suppliers move — not when the anchors cut ribbons.',
  type: 'p'
}, {
  text: 'The strategic read',
  type: 'h'
}, {
  text: 'India\'s bet here is geography as industrial advantage: that convergence lowers the cost of doing electronics enough to make a location, not a company, the moat. The risk is the one our drone and semiconductor work keeps surfacing — the anchor without an ecosystem, a marquee plant that imports most of its value and performs only final assembly locally. Jewar is the first credible test of whether India can build an integrated electronics ecosystem rather than another set of isolated factories. That distinction — system versus factory — is the one worth tracking, and it is the question we will follow.',
  type: 'p'
}],
  takeaways: ['Two electronics projects worth Rs 6,750 crore — ASCENT-K Circuit (Rs 3,250 crore, advanced multi-layer PCBs) and Amber Enterprises (Rs 3,500 crore, HVAC components and PCB assembly) — were announced at Jewar on 27 June 2026.', 'They sit beside the Rs 3,700 crore HCL-Foxconn OSAT (the sixth India Semiconductor Mission unit, the first in Uttar Pradesh) and the new Jewar international airport — chip assembly, PCB, components and logistics in one corridor.', 'PCB localisation has cross-sector leverage (telecom, automotive, defence, drones, medical) against a roughly Rs 40,000 crore annual import bill, but laminates, chemicals and equipment remain upstream import dependencies.', 'The real test is supplier migration and logistics depth, not anchor groundbreakings: ecosystems form when tier-2 and tier-3 suppliers co-locate.'],
  sources: ['https://www.indiatvnews.com/uttar-pradesh/jewar-set-to-become-north-india-s-silicon-valley-as-yogi-vaishnaw-launch-rs-6-750-crore-electronics-project-2026-06-27-1046352', 'https://hcl.com/media_management/hcl-group-and-hon-hai-technology-group-foxconn-join-hands-to-set-up-semiconductor-manufacturing-unit-in-uttar-pradesh/', 'https://www.moneycontrol.com/news/business/jewar-set-to-become-india-s-leading-electronics-semiconductor-hub-ashwini-vaishnaw-13960175.html']
}, {
  slug: 'real-constraint-behind-ai-infrastructure',
  no: 'S-008',
  title: 'The real constraint behind AI infrastructure',
  domain: 'AI Infrastructure',
  date: '2026-07-03',
  dateLabel: '3 Jul 2026',
  status: 'monitoring',
  excerpt: 'Not capital, not policy, not aggregate talent supply. The binding constraint on India’s 4.5–9 GW DC trajectory is local: transmission, water rights, fibre right-of-way and DISCOM-level interconnection-queue execution at the level of seven specific districts.',
  readingTime: '4 min',
  body: [],
  takeaways: [],
  sources: ['https://www.india.gov.in/', 'https://pib.gov.in/PressReleasePage.aspx?PRID=2134567']
}];

export function getSignal(slug: string): SignalMeta | undefined {
  return signals.find((s) => s.slug === slug);
}
