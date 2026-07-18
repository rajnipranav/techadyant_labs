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
  status: 'live',
  excerpt: 'Capital and policy can be assembled in a board meeting. The deep process-engineering and yield-management talent that makes a fab or a hyperscale DC productive cannot. The asymmetry is what sets the realistic ramp curve.',
  readingTime: '5 min',
  body: [{
  text: 'India\'s industrial-policy instruments are overwhelmingly capital instruments — capex subsidies, production-linked incentives, viability-gap funding. They are well-designed for what capital solves: getting a fab or a hyperscale data centre financed and built. They are far weaker on the problem that actually sets the ramp once the building exists, which is talent — the deep process-engineering and yield-management capability that turns installed capacity into competitive output.',
  type: 'p'
}, {
  text: 'The asymmetry is structural. A fab can be financed in a board meeting and built in two to three years; the tacit knowledge to run it at competitive yield is accumulated over careers and cannot be procured on the same timeline. A subsidy can close a financing gap overnight; it cannot close a capability gap. When policy over-indexes on capex and under-invests in pipelines, the predictable result is built capacity that ramps slowly because the people to run it are scarce.',
  type: 'p'
}, {
  text: 'Subsidies buy buildings; talent runs them',
  type: 'h'
}, {
  text: 'This is visible across India\'s strategic-technology push. The semiconductor mission and the AI-infrastructure build-out both carry generous capital support and comparatively thin, slower-moving talent programmes. The standard answer wherever late entrants have succeeded is a deliberate blend: seed the first lines with experienced expatriate and returning-diaspora engineers while building domestic pipelines through universities, vendor-run training and structured on-the-job ramp. Both halves take years — which is exactly why they should be funded with the same urgency as the capex, and earlier.',
  type: 'p'
}, {
  text: 'The implication is not to cut subsidies but to pair them. A capex subsidy with no matched talent programme funds a building that under-utilises; a talent programme with no capex funds engineers with nowhere to work. The two are complements, and India\'s current mix leans heavily toward the first.',
  type: 'p'
}, {
  text: 'The signal to watch',
  type: 'h'
}, {
  type: 'list',
  items: ['The ratio of talent-pipeline funding to capex subsidy in semiconductor and AI-infrastructure schemes.', 'Returning-diaspora and expatriate hiring at the first fabs and hyperscale campuses.', 'University-to-fab and vendor-training placement programmes, and their throughput.', 'Utilisation and yield-ramp rates once facilities are commissioned — the real test of talent depth.']
}, {
  text: 'Capital is the easy half of industrial policy and talent is the hard half, and India\'s instruments are calibrated for the easy half. The economies that converted subsidies into competitive industries funded the people with the same seriousness as the plants. Whether India does the same is the variable that separates built capacity from productive capacity.',
  type: 'p'
}],
  takeaways: ['Equipment can be bought; tacit process knowledge has to be grown or imported.', 'Yield ramp — not construction — is where talent depth becomes decisive.', 'Expatriate seeding plus domestic pipelines is the standard pattern; both take years.'],
  sources: ['https://www.ism.gov.in/', 'https://indiaai.gov.in/']
}, {
  slug: 'indias-hidden-industrial-water-crisis',
  no: 'S-010',
  title: 'India’s hidden industrial water crisis',
  domain: 'Industrial Infrastructure',
  date: '2026-06-19',
  dateLabel: '19 Jun 2026',
  status: 'live',
  excerpt: 'CGWB classifies Bengaluru and Hyderabad as over-exploited, Chennai as critical. The DC pipeline is densest where the water position is most stressed. This signal names the corridor-level audits that are not yet being published.',
  readingTime: '4 min',
  body: [{
  text: 'India\'s industrial-water risk is hiding in plain sight. The Central Ground Water Board\'s assessment places many of the urban units around Bengaluru and Hyderabad in the over-exploited category and Chennai\'s position as critical — and these are precisely the metros where the data-centre and advanced-manufacturing pipeline is densest. The geography of new high-water-intensity industry overlaps with the geography of water stress.',
  type: 'p'
}, {
  text: 'Data centres, through cooling and humidity control, and fabs, through ultrapure water, are among the most water-intensive facilities being built, and they are landing in city-regions whose groundwater is already drawn down faster than it recharges. The mitigation — municipal supply, treated-wastewater reuse and recycling — exists, but it competes with household and agricultural demand and leans on monsoon-sensitive surface sources.',
  type: 'p'
}, {
  text: 'Why this stays hidden',
  type: 'h'
}, {
  text: 'The risk is under-discussed because it is assessed at the wrong resolution. National water-availability figures look adequate; CGWB categories are reported by assessment unit; and individual project clearances treat water as a line item rather than a system. What does not exist publicly is the corridor-level audit: for a given industrial cluster, the firm water available across sources, the committed industrial draw, the competing municipal and agricultural demand, and the resilience under a weak monsoon. Without it, water risk is invisible until it binds.',
  type: 'p'
}, {
  text: 'This is the Dholera lesson generalised. Dholera\'s exposure is a single canal; the metros\' exposure is over-drawn aquifers plus monsoon-dependent reservoirs. In both cases the binding question is corridor-level, and in both the audit is missing.',
  type: 'p'
}, {
  text: 'The signal to watch',
  type: 'h'
}, {
  type: 'list',
  items: ['CGWB category changes in the assessment units hosting data-centre and fab clusters.', 'Treated-wastewater reuse ratios actually achieved by industrial clusters, versus targets.', 'Water allocations granted to new industrial load against municipal and agricultural demand.', 'Whether any state publishes a corridor-level industrial-water audit.']
}, {
  text: 'The water position will not announce itself. It will surface as a permitting delay, a tanker bill, or a curtailed ramp in a dry year. The clusters to watch are the ones where the pipeline is densest and the aquifer is already over-exploited — and the document to demand is the corridor-level audit that no one is yet publishing.',
  type: 'p'
}],
  takeaways: ['Central Ground Water Board assessments place urban units around Bengaluru and Hyderabad as over-exploited and Chennai as critical — the same metros where the data-centre and fab pipeline is densest.', 'Data centres and fabs are highly water-intensive and are landing where aquifers are already over-drawn and surface water is monsoon-dependent.', 'The missing tool is the corridor-level industrial-water audit; until it is published, water risk stays invisible until it binds.'],
  sources: ['https://cgwb.gov.in/', 'https://www.niti.gov.in/']
}, {
  slug: 'vendor-economy-behind-semiconductor-fabs',
  no: 'S-009',
  title: 'The vendor economy behind semiconductor fabs',
  domain: 'Semiconductor Ecosystems',
  date: '2026-06-26',
  dateLabel: '26 Jun 2026',
  status: 'live',
  excerpt: 'Of a ₹91,000 crore mature-node fab, roughly two-thirds flows to ASML, AMAT, Lam, TEL and KLA. The Indian-capture economy lives in the remaining one-third — construction, gases, UPW, logistics and the durable industrial capabilities those build.',
  readingTime: '5 min',
  body: [{
  text: 'A fab\'s headline number flatters the local economy. Of the roughly Rs 91,000 crore committed to a mature-node fab, the majority does not stay in India. It flows to the handful of global firms that make the tools — ASML for lithography, Applied Materials, Lam Research and Tokyo Electron for deposition, etch and processing, and KLA for inspection and metrology. Process equipment is typically the largest line in fab capex, often two-thirds to three-quarters of the total.',
  type: 'p'
}, {
  text: 'This is not a criticism; no country, including the most advanced, makes the full set of wafer-fabrication equipment domestically. But it reframes what India is buying with a fab. The wafer-fab-equipment portion is imported capability. The Indian-capture economy lives in the remaining third — and in what that third builds that lasts beyond the single project.',
  type: 'p'
}, {
  text: 'Where India actually captures value',
  type: 'h'
}, {
  text: 'That remaining third is substantial and strategically useful: cleanroom construction and the specialist civil and services trades it trains; industrial and electronic gases and the on-site plants that supply them; ultrapure-water systems; chemicals and slurries; precision logistics and bonded warehousing; facilities management, calibration and equipment-servicing skills. These are lower-glamour than lithography, but they are real industrial capabilities, reusable across fabs, OSATs and other advanced manufacturing, and they are where domestic suppliers can genuinely compete.',
  type: 'p'
}, {
  text: 'The strategic question is whether each fab leaves behind a deeper vendor ecosystem or merely a building. If gas, ultrapure-water, chemical and equipment-service firms localise around the first fabs, the second and third cost less and ramp faster, and the capability compounds. If every fab imports its inputs and flies in its service engineers, capture stays at one-third and never deepens. This is the same assembly-versus-ecosystem distinction that runs through our other work.',
  type: 'p'
}, {
  text: 'The signal to watch',
  type: 'h'
}, {
  type: 'list',
  items: ['Whether industrial-gas, ultrapure-water and chemical suppliers build local plants around the first fabs, or supply from imports.', 'The share of equipment installation, calibration and servicing performed by Indian engineers versus flown-in vendor teams.', 'Cleanroom-construction and specialist-trades capacity that persists between projects.', 'Whether vendor localisation lowers the capex and ramp time of the second and third fabs.']
}, {
  text: 'The lithography tools will be imported for the foreseeable future; that is true everywhere. The measure of success is not the tool bill but whether the one-third India does capture compounds into a vendor ecosystem that makes the next fab cheaper — or evaporates when the contractors leave.',
  type: 'p'
}],
  takeaways: ['Roughly two-thirds to three-quarters of a fab\'s capex is imported wafer-fab equipment (ASML, Applied Materials, Lam, Tokyo Electron, KLA); India\'s capture is the remaining third.', 'That third — cleanroom construction, industrial gases, ultrapure water, chemicals, logistics and equipment servicing — is where reusable domestic capability is actually built.', 'The test is whether each fab leaves a deeper vendor ecosystem that lowers the cost of the next, or merely a building.'],
  sources: ['https://www.meity.gov.in/content/semiconductor', 'https://www.ism.gov.in/']
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
  slug: 'dholera-water-signal',
  no: 'S-001',
  title: 'The Dholera Water Signal',
  domain: 'Industrial Infrastructure',
  date: '2026-06-30',
  dateLabel: '30 June 2026',
  status: 'live',
  excerpt: 'Dholera\'s industrial ambition rests on a single water artery. The fab can be financed and built on schedule; the water to run it at full utilisation has to arrive every day through the Narmada canal — and that concentration, not land or capital, is the binding constraint.',
  readingTime: '5 min',
  body: [{
  text: 'Dholera is India\'s most advanced greenfield industrial city and the site of its first commercial wafer fab. Its constraint is not land, power or capital — those are committed. It is water, and specifically the fact that almost all of it arrives through one channel: the Narmada canal.',
  type: 'p'
}, {
  text: 'The Rs 91,000 crore Tata-PSMC fab, designed for roughly 50,000 wafers a month, anchors the Dholera Special Investment Region. Dholera\'s current supply is a roughly 50 MLD treatment plant fed from the Narmada canal. The region\'s master-planned demand is far larger — on the order of 947 million litres a day at full build-out, of which around 491 MLD is industrial and 298 MLD residential.',
  type: 'p'
}, {
  text: 'Why water is the binding constraint',
  type: 'h'
}, {
  text: 'A modern fab is among the most water-intensive industrial facilities in existence. Producing ultrapure water — the solvent-grade water used to rinse wafers — consumes roughly 1,400 to 1,600 litres of municipal water for every 1,000 litres of ultrapure water it yields, before any is recovered. A 50,000-wafer line\'s daily draw runs into the millions of litres; co-located assembly, display and component plants add more. The fab can be financed and built on schedule; the water to run it at full utilisation has to be physically delivered, every day, through infrastructure that also serves a city.',
  type: 'p'
}, {
  text: 'The exposure is that this demand rests on essentially one source. The Narmada canal is a shared, allocation-governed system supplying agriculture, drinking water and industry across Gujarat; its delivery varies with the monsoon, reservoir levels and competing claims upstream. A single artery feeding a strategic national asset is a concentration risk, not a detail.',
  type: 'p'
}, {
  text: 'What the state is already signalling',
  type: 'h'
}, {
  text: 'Gujarat\'s response is the clearest evidence of the underlying problem. The state offers a 50 per cent capital subsidy to fab projects that build their own desalination plants — an unusually generous incentive that exists precisely because canal water alone is not treated as a resilient base load. Desalination on the nearby Gulf of Khambhat, treated-wastewater recycling and zero-liquid-discharge are the resilience layer being built around the canal, not instead of it.',
  type: 'p'
}, {
  text: 'The second-order effects matter. Desalination is energy-intensive, which ties Dholera\'s water resilience back to its power system; zero-liquid-discharge and recycling push cost and operational complexity onto every tenant; and brine and effluent loads create their own environmental and regulatory exposure on a sensitive coastline. Water resilience here is not a single project but a system — canal plus desalination plus recycling plus the power to run it.',
  type: 'p'
}, {
  text: 'The signal to watch',
  type: 'h'
}, {
  type: 'list',
  items: ['Desalination capacity actually commissioned on the Gulf of Khambhat, versus announced.', 'The recycled-water and zero-liquid-discharge ratio fabs achieve in practice, not on paper.', 'Narmada allocation to Dholera under competing agricultural and urban demand in a weak-monsoon year.', 'Whether the water system build-out keeps pace with the 2026-27 fab ramp, or lags behind it.']
}, {
  text: 'The fab will be commissioned on schedule. The question Dholera answers over the next few years is whether the water system beneath it is built as a resilient, multi-source utility — or whether a strategic industrial cluster is left resting on a single canal. The first is infrastructure; the second is a dependency.',
  type: 'p'
}],
  takeaways: ['Dholera\'s build-out — anchored by the Rs 91,000 crore Tata-PSMC fab (~50,000 wafers/month) — depends almost entirely on Narmada-canal water through a roughly 50 MLD plant today, against a master-planned demand near 947 MLD.', 'Ultrapure-water production for a fab consumes about 1.4-1.6 litres of municipal water per litre of UPW before recovery, which is why water — not land, power or capital — is the binding constraint.', 'Gujarat\'s 50 per cent capital subsidy for fab-owned desalination is the clearest signal that canal water alone is not considered a resilient base load.', 'Water resilience at Dholera is a system — canal plus desalination plus recycling plus the power to run it — and the metric that matters is commissioned desalination and real ZLD ratios, not announcements.'],
  sources: ['https://www.ijsrd.com/articles/LDRPTCP065.pdf', 'https://swarajyamag.com/tech/how-gujarat-is-shaping-up-as-indias-semiconductor-hub-building-on-its-strength-as-an-economic-powerhouse']
}, {
  slug: 'quantum-orders-industrial-policy',
  no: 'S-014',
  title: 'The Quantum Race Has Entered Its Industrial-Policy Phase',
  domain: 'Strategic Technology',
  date: '2026-06-30',
  dateLabel: '30 June 2026',
  status: 'live',
  excerpt: 'The headlines are about a quantum computer by 2028. The more important development is that the United States has reclassified quantum from a research programme into an industrial and national-security strategy — with procurement deadlines, standards and supply-chain intent attached. The question for India is what its equivalent roadmap looks like.',
  readingTime: '6 min',
  body: [{
  text: 'The headlines are about a quantum computer by 2028. The more important development is that the United States has reclassified quantum from a research programme into an industrial and national-security strategy — with procurement deadlines, standards and supply-chain intent attached. On 22 June 2026 two executive orders were signed: one to accelerate quantum innovation and commercialisation, the other to force a government-wide migration to post-quantum cryptography. Read together, they are less a science announcement than an industrial policy for the post-quantum era.',
  type: 'p'
}, {
  text: 'What the two orders actually do',
  type: 'h'
}, {
  text: 'The first order — Ushering in the Next Frontier of Quantum Innovation — establishes the Quantum Computer for Application Development and Discovery Science (QC-ADDS) effort, aimed at delivering at least one large-scale quantum computer to a Department of Energy facility for scientific use, and promotes quantum sensing and networking alongside computing. The second — Securing the Nation Against Advanced Cryptographic Attacks — sets hard deadlines: federal agencies must move their most sensitive systems to NIST post-quantum encryption by 31 December 2030 and to post-quantum authentication by 31 December 2031, federal contractors must meet post-quantum cryptographic standards by end-2030, and the Department of Commerce must run a migration pilot due by the end of 2027.',
  type: 'p'
}, {
  text: 'The decisive word in all of that is procurement. Deadlines, plus contractor mandates, plus standards, turn a cryptography transition into a market: every agency, and every company that sells to one, now carries a dated obligation to buy and deploy. That is the mechanism by which research becomes an industry.',
  type: 'p'
}, {
  text: 'Why this is an ecosystem story, not a computing story',
  type: 'h'
}, {
  text: 'The orders treat computing, sensing, networking, cryptography, standards, procurement and manufacturing as one programme rather than funding isolated technologies. The downstream demand is broad. Quantum processors need specialised fabrication, advanced packaging and cryogenic control electronics. Post-quantum migration creates sustained demand for encryption software, hardware security modules, key- and identity-management and compliance services. Quantum sensing pulls in photonics, precision materials and navigation systems for defence and critical infrastructure. And QC-ADDS frames quantum as a tool for materials, chemistry and energy discovery — industrial, not academic. The pattern is the one we keep returning to: a state building an ecosystem, not buying a machine.',
  type: 'p'
}, {
  text: 'Where this lands for India',
  type: 'h'
}, {
  text: 'India is not the subject of these orders, but it is affected by them, and the more useful question for an Indian reader is what equivalent roadmap they imply. India has a National Quantum Mission and CERT-In and MeitY guidance, but it does not yet have the binding, dated procurement architecture the United States has just adopted — the deadlines, the contractor mandates, the standards lock-in. The exposure and the opportunity sit in the same places.',
  type: 'p'
}, {
  text: 'On cryptography, the migration clock is global. Harvest-now-decrypt-later means data exfiltrated today can be broken once a cryptographically relevant quantum computer exists, so Indian banks, telecom operators, defence systems and government records carry the same latent risk regardless of US timelines — which makes post-quantum migration a procurement question for them too, not only a technical one. On hardware, the build-out of quantum processors, cryogenics and sensing opens supply-chain surfaces — advanced packaging, specialised electronics, photonics, precision materials — adjacent to capabilities India is already trying to build in semiconductors and electronics. On sensing, quantum-enabled navigation, underground detection and infrastructure monitoring are under-built in India and dual-use by nature. The common thread is that a US industrial policy sets the standards and the pace; India either aligns deliberately or inherits the timeline by default.',
  type: 'p'
}, {
  text: 'The signal to watch',
  type: 'h'
}, {
  type: 'list',
  items: ['Whether India attaches dated post-quantum migration mandates to government and critical-infrastructure procurement, rather than issuing guidance.', 'NIST-standard alignment in Indian financial-sector and telecom security rules (RBI, SEBI, TRAI, CERT-In).', 'National Quantum Mission allocations that fund hardware supply chains and sensing, not only computing research.', 'Indian cybersecurity vendors building post-quantum, HSM and key-management products versus reselling foreign ones.', 'Whether Indian semiconductor and electronics capacity is positioned for cryogenic electronics, packaging and photonics demand.']
}, {
  text: 'The United States has aligned research, procurement, manufacturing, standards and cybersecurity around quantum technologies on a fixed clock. The question that matters for India is not what Washington decided, but what India\'s equivalent roadmap looks like — and whether it arrives as deliberate industrial policy, or as a deadline inherited from someone else\'s.',
  type: 'p'
}],
  takeaways: ['Two US executive orders (22 June 2026) reclassify quantum from research to industrial and national-security strategy — accelerating commercialisation while mandating a dated, government-wide post-quantum cryptography migration.', 'Hard deadlines (federal PQC encryption by 31 Dec 2030, authentication by 2031, contractor standards by 2030, a Commerce pilot by 2027) turn cryptography migration into a procurement market, not just a technical upgrade.', 'The orders create demand across semiconductors, packaging and cryogenics, cybersecurity (PQC, HSMs, key and identity management), quantum sensing and materials — an ecosystem, not a single machine.', 'For India the exposure is identical — harvest-now-decrypt-later threatens banks, telecom, defence and government data — but the binding procurement architecture is missing; the opening is to align standards and fund hardware and sensing, not only research.'],
  sources: ['https://www.whitehouse.gov/presidential-actions/2026/06/ushering-in-the-next-frontier-of-quantum-innovation/', 'https://www.whitehouse.gov/presidential-actions/2026/06/securing-the-nation-against-advanced-cryptographic-attacks/', 'https://www.cybersecuritydive.com/news/quantum-cryptography-white-house-executive-order/823530/', 'https://www.reuters.com/legal/litigation/trump-signs-orders-calling-powerful-quantum-computer-targeting-2028-2026-06-22/']
}, {
  slug: 'real-constraint-behind-ai-infrastructure',
  no: 'S-008',
  title: 'The real constraint behind AI infrastructure',
  domain: 'AI Infrastructure',
  date: '2026-07-03',
  dateLabel: '3 Jul 2026',
  status: 'live',
  excerpt: 'Not capital, not policy, not aggregate talent supply. The binding constraint on India’s 4.5–9 GW DC trajectory is local: transmission, water rights, fibre right-of-way and DISCOM-level interconnection-queue execution at the level of seven specific districts.',
  readingTime: '4 min',
  body: [{
  text: 'India\'s data-centre conversation is dominated by national aggregates — gigawatts announced, billions committed, a national AI mission funded. Those aggregates are real, but they are not where the build-out is won or lost. The binding constraint is local, and unglamorous: transmission, water rights, fibre right-of-way, and the execution capacity of individual distribution utilities.',
  type: 'p'
}, {
  text: 'At the national level India has surplus generation and ample headline capital. Disaggregate to where the hyperscale and colocation pipeline actually clusters — a handful of districts around Mumbai, Chennai, Hyderabad, Pune, Noida and Bengaluru — and the picture changes. A campus needs firm power delivered to a specific substation, an interconnection approved and built by a specific distribution utility, water rights secured against competing urban demand, and fibre routed through congested right-of-way. Each is a local-execution problem on its own timeline, regardless of how much national capital is available.',
  type: 'p'
}, {
  text: 'Why aggregates mislead',
  type: 'h'
}, {
  text: 'Generation surplus does not equal deliverable power at a node. The constraint migrates from generation to transmission and to the last-mile interconnection queue — the sequence in which a utility energises new high-load connections. A campus can be financed and its servers ordered while the grid connection that makes them useful sits in a multi-year queue. Mature markets show the same pattern: in Northern Virginia and Dublin it was the local grid and the interconnection queue, not capital, that set the realistic ramp.',
  type: 'p'
}, {
  text: 'The result is that the realistic 4.5-9 GW trajectory we model for India\'s data-centre build-out through 2030 is set district by district, not nationally. The spread between the low and high case is mostly a function of how quickly a small number of state utilities and transmission planners can execute — not of how much capital or policy intent exists.',
  type: 'p'
}, {
  text: 'The signal to watch',
  type: 'h'
}, {
  type: 'list',
  items: ['Interconnection-queue throughput at the distribution utilities serving the top data-centre districts.', 'Dedicated transmission and substation build-out timelines versus campus commissioning dates.', 'Water allocations granted to data-centre clusters against competing municipal demand.', 'Fibre right-of-way approvals in congested metropolitan corridors.']
}, {
  text: 'The announcements will continue to be national; the execution will be local. Track the seven or eight districts where the pipeline concentrates, and watch the utilities and transmission planners that serve them — that is where India\'s AI-infrastructure ramp is actually decided.',
  type: 'p'
}],
  takeaways: ['India\'s data-centre constraint is local execution — transmission, interconnection queues, water rights and fibre right-of-way — not national capital, policy or talent.', 'Generation surplus does not equal deliverable power at a node; the bottleneck sits in transmission and the DISCOM interconnection queue.', 'The 4.5-9 GW trajectory to 2030 is set district by district, and the spread reflects how fast a few state utilities can execute.'],
  sources: ['https://cea.nic.in/', 'https://indiaai.gov.in/']
}, {
  slug: 'container-sovereignty-trade-infrastructure',
  no: 'S-015',
  title: 'Container manufacturing is really a trade-infrastructure signal',
  domain: 'Industrial Infrastructure',
  date: '2026-07-13',
  dateLabel: '13 July 2026',
  status: 'live',
  excerpt: 'The headline is that India wants to manufacture shipping containers. The strategic signal is larger: India is beginning to localize a physical layer of global trade infrastructure, with spillovers into steel, coatings, rail freight, ports, cold chain, defence logistics and containerized infrastructure.',
  readingTime: '6 min',
  body: [{
  text: 'The headline is easy to misread: India starts manufacturing shipping containers. The better question is what industrial ecosystems become possible when India localizes container manufacturing. A shipping container is not just a steel box. It is a standardised unit of global trade infrastructure: the object that lets ports, ships, railheads, inland depots, warehouses, exporters and insurers operate as one system.',
  type: 'p'
}, {
  text: 'That is why this signal belongs in the Atlas. Container manufacturing sits at the intersection of steel, fabrication, marine coatings, precision fittings, inspection, leasing, port logistics, rail freight, cold chain and defence logistics. If the capability stays at dry-box assembly, the opportunity is thin and cost-exposed. If it moves into specialised containers and the component ecosystem beneath them, it becomes a strategic industrial surface.',
  type: 'p'
}, {
  text: 'The hidden opportunity is not the box',
  type: 'h'
}, {
  text: 'The commodity dry container is a hard market. China has scale, integrated suppliers and price discipline. India has already seen first-wave entrants struggle when steel costs, small order sizes and Chinese pricing compressed margins. The more durable opportunity is therefore not only to replicate the cheapest standard container. It is to move up the stack: reefers for pharma, seafood and food exports; tank and chemical containers; hazardous-goods boxes; defence containers; battery transport containers; modular hospitals; disaster-relief units; containerised data centres and edge-compute units.',
  type: 'p'
}, {
  text: 'Each of those products pulls a deeper domestic supplier base. A reefer container needs insulation, refrigeration systems, sensors and validation. A tank container needs pressure-vessel capability, valves, seals and certification. A defence container needs ruggedisation, power, communications and deployable systems integration. A modular data-centre container needs power distribution, cooling, fire suppression, racks and monitoring. The value shifts from welding a box to building a repeatable industrial platform.',
  type: 'p'
}, {
  text: 'The dependency map',
  type: 'h'
}, {
  type: 'list',
  items: ['Weathering steel and structural sections: the cost and availability of container-grade steel sets the base economics.', 'Marine coatings and corrosion protection: a localisation surface adjacent to ports, ship repair and offshore equipment.', 'Corner castings, locking systems, hinges, seals and ISO fittings: the SME component layer that determines whether domestic assembly has depth.', 'Testing, certification and repair yards: the infrastructure that makes containers bankable for leasing companies and global shipping lines.', 'Refrigeration, tank systems and telematics: the higher-margin specialised-container layer where India can avoid a pure commodity fight.']
}, {
  text: 'This makes the right framing broader than a container-industry note. The report question is: who builds India\'s trade infrastructure? Containers are one chapter, but so are cargo-handling systems, multimodal logistics parks, inland container depots, rail freight interfaces, leasing pools, repair yards, tracking systems and port-adjacent manufacturing clusters.',
  type: 'p'
}, {
  text: 'What to watch',
  type: 'h'
}, {
  type: 'list',
  items: ['Whether policy support creates a durable cluster around steel supply, testing, coating, components and repair, or only subsidises final assembly.', 'Whether Indian manufacturers win specialised-container categories before they try to match Chinese dry-container scale.', 'Whether Gujarat, with Mundra, Kandla, Pipavav and an existing fabrication base, becomes the first credible container ecosystem.', 'Whether Dedicated Freight Corridors, ICDs and multimodal logistics parks generate predictable domestic demand for containers and repairs.', 'Whether defence, pharma, seafood, agriculture and data-centre buyers specify domestic specialised containers as procurement categories.']
}, {
  text: 'The strategic read',
  type: 'h'
}, {
  text: 'India is trying to localize one of the physical standards beneath global trade. That matters because trade sovereignty is not only about ports or ships; it is also about the containers, fittings, depots, repair yards, tracking systems and specialised modules that let exports move reliably. The signal to track is whether container manufacturing becomes another isolated production push, or the entry point into a broader trade-infrastructure ecosystem.',
  type: 'p'
}],
  takeaways: ['Container manufacturing is a trade-infrastructure signal, not only a steel-box manufacturing story.', 'The highest-value path is specialised containers - reefers, tanks, chemical, defence, battery, medical and modular data-centre units - rather than only commodity dry containers.', 'The SME opportunity sits in weathering steel access, coatings, corner castings, seals, locking systems, testing, repair, telematics and leasing infrastructure.', 'The Atlas should track container manufacturing as a supply chain linked to ports, rail freight, cold chain, defence logistics, industrial corridors and AI infrastructure.'],
  sources: ['https://timesofindia.indiatimes.com/city/ahmedabad/times-dhandho-gujarat-container-industrys-resurgence-unboxed/articleshow/128713762.cms', 'https://shipmin.gov.in/', 'https://sagarmala.gov.in/']
}, {
  slug: 'semicon-2-0-ecosystem-shift',
  no: 'S-016',
  title: 'Semicon 2.0 Confirms India\'s Shift from Fab Projects to Ecosystem Building',
  domain: 'Semiconductors',
  date: '2026-07-16',
  dateLabel: '16 July 2026',
  status: 'live',
  excerpt: 'Most coverage will lead with the Rs 1.27 lakh crore. The real story is one sentence - "building the complete ecosystem" - and a second pillar that finally incentivises the machines, materials, chemicals and gases beneath the fab.',
  readingTime: '7 min',
  body: [{
  text: 'The headline writes itself: the Union Cabinet has cleared Semicon 2.0, the second phase of the India Semiconductor Mission, with a Rs 1.27 lakh crore outlay - alongside a Rs 62,500 crore second phase of the mobile-manufacturing scheme. The number will dominate the coverage. It is also the least interesting thing about the announcement.',
  type: 'p'
}, {
  text: 'The line that matters is the one about scope. Semicon 1.0 was, in practice, a campaign to attract anchor investments - win a fab, win an ATMP plant, put India on the map. Semicon 2.0 is framed around a different idea: building the complete ecosystem. The second phase is organised around six pillars that span the entire value chain - design, machines and materials, fabs, ATMP and advanced packaging, R&D, and talent. That is not a bigger incentive. It is a different theory of how a semiconductor industry is actually built.',
  type: 'p'
}, {
  text: 'What actually changed',
  type: 'h'
}, {
  text: 'Phase one treated the fab as the prize. Phase two treats the fab as one layer of a stack. Pillar one deepens chip design and IP, building on the 105 design startups already in the ecosystem. Pillar three still covers fabs. But pillars two, four, five and six are where the shift lives: the machines, materials, chemicals and gases a fab consumes; advanced packaging and OSAT; the R&D to move from today\'s 28-110nm nodes toward more advanced ones; and the talent pipeline of 315 universities and roughly 68,000 students trained on industry EDA tools. The message is that semiconductor competitiveness is decided across the whole industrial stack, not at the fab door.',
  type: 'p'
}, {
  text: 'The pillar most coverage will miss',
  type: 'h'
}, {
  text: 'Read pillar two slowly: companies involved in manufacturing the machines, and in making the materials, chemicals and gases essential for semiconductor manufacturing, will be incentivised. That single sentence redirects policy attention to the layers almost no one studies - lithography support equipment, metrology, vacuum systems, gas delivery and abatement, wafer-handling robotics and cleanroom systems; photoresists, etchants, CMP slurries and pads, high-purity solvents and specialty gases; silicon, silicon carbide, gallium nitride, quartz, wafers and substrates. These are the true dependencies of a fab economy, and until now they sat outside the incentive frame.',
  type: 'p'
}, {
  text: 'This is also where the opportunity is most widely distributed. A fab is a billion-dollar bet made by a handful of players. The equipment, chemicals and precision-manufacturing layers are an SME and mid-cap opportunity - precision machining, cleanroom construction, ultrapure water and gas handling, process instrumentation, calibration, metrology, specialty packaging and maintenance services. Semicon 2.0\'s second pillar is, in effect, a demand signal for exactly that base.',
  type: 'p'
}, {
  text: 'What to watch',
  type: 'h'
}, {
  type: 'list',
  items: ['Whether the machines-and-materials pillar is notified with real allocations and eligibility rules, or remains a line in a press release - the difference between a demand signal and an actual market.', 'Whether the 105 design startups convert into products and IP that fabs and OSATs can build, rather than a pipeline that stalls at tape-out.', 'The node ambition: moving from 28-110nm toward advanced nodes is a decade-long industrial and R&D commitment, not a budget cycle.', 'Whether ATMP and OSAT deepen into genuine advanced packaging - the value-capture layer - rather than commodity assembly.', 'Whether the programme genuinely broadens beyond anchor investors to the equipment, chemicals and precision-manufacturing SMEs the second pillar names.']
}, {
  text: 'The strategic read',
  type: 'h'
}, {
  text: 'Strip away the headline number and Semicon 2.0 is the government formally adopting the ecosystem thesis: that a semiconductor industry is an industrial system - design, materials, chemicals, equipment, packaging, R&D and talent - and that owning the fab means little without the layers around it. For India, that reframes the question from can we win a fab? to can we build the stack a fab needs? The leverage, and most of the addressable opportunity, sits in the layers the second pillar has just brought inside the tent.',
  type: 'p'
}, {
  text: 'Go deeper',
  type: 'h'
}, {
  text: 'Techadyant Labs has mapped this shift in full: [The Semicon 2.0 Opportunity Map](/reports/semicon-2-0-opportunity-map/) sizes the Rs 45,500 crore serviceable opportunity across the eight upstream streams beyond the fab, ranks them, and sorts them into three capital-allocation tiers.',
  type: 'p'
}],
  takeaways: ['The significance is not the Rs 1.27 lakh crore - it is the explicit move from anchor-investment attraction (Semicon 1.0) to complete-ecosystem building across six pillars.', 'Pillar two - machines, materials, chemicals and gases - is the quiet centre of gravity: the equipment and specialty-chemical layers most analysts ignore.', 'The opportunity surfaces are heavily SME-shaped: precision machining, cleanroom systems, gas and ultrapure-water handling, metrology, CMP consumables and wafer-handling automation.', 'Semicon 2.0 validates the Atlas thesis - semiconductor competitiveness is an industrial-stack question, from design IP to specialty chemicals to equipment.'],
  sources: ['https://pib.gov.in/', 'https://www.business-standard.com/industry/news/cabinet-clears-india-semiconductor-mission-2-mobile-manufacturing-126071500754_1.html', 'https://swarajyamag.com/tech/what-is-semicon-20-inside-indias-rs-127-lakh-crore-six-pillar-strategy-to-become-a-major-global-semiconductor-player', 'https://www.dqindia.com/semiconductors/cabinet-approves-semicon-20-government-delivers-on-commitment-for-long-term-policy-support-to-semiconductors-in-india-12166952']
}];

export function getSignal(slug: string): SignalMeta | undefined {
  return signals.find((s) => s.slug === slug);
}
