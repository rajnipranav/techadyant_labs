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
}, {
  slug: 'india-asia-mineral-processing-hub',
  no: 'S-022',
  title: 'Can India Be Asia\'s Mineral-Processing Hub?',
  domain: 'Critical Minerals & Economic Geography',
  date: '2026-07-19',
  dateLabel: '19 July 2026',
  status: 'live',
  excerpt: 'India has the ore, the energy-transition demand and the policy intent. Whether it can become the processing hub for Asian critical minerals depends on three execution bets — refinery policy, partner selection and talent — rather than geology.',
  readingTime: '8 min',
  body: [{
  text: 'The prevailing framing treats India as a minerals consumer or, at best, an upstream miner. The different question is whether India can capture the midstream: the refining, separation and high-purity chemical production that every manufacturer in Asia needs but that is currently concentrated in one geography. The answer is structurally plausible but execution-conditional — three bets decide it.',
  type: 'p'
}, {
  text: 'The base case',
  type: 'h'
}, {
  text: 'India has multiple advantages that most prospective processing hubs lack. It has domestic critical-mineral deposits plus long-term access to Australian, African and South American feedstock; cheap domestic coal and increasingly cheap solar power; a large domestic demand pull from semiconductors, EV, defence and AI infrastructure; and a policy architecture that treats critical minerals as strategic. It also has one structural disadvantage: the midstream talent base is small, the technology is proprietary, and the incumbent in China has 25 years of scale learning.',
  type: 'p'
}, {
  text: 'The three execution bets',
  type: 'h'
}, {
  type: 'list',
  items: ['Refinery policy — whether India attaches domestic-value-addition conditions to mineral imports and critical-minerals auctions, or treats processing as a private-sector decision.', 'Partner selection — whether technology-transfer partnerships are structured as genuine capability build or as black-box equipment supply with Indian civil works.', 'Talent — whether India builds a refinery-chemistry and hydromet-engineering pipeline in the 18–36 month window that the first-generation plants need, or imports operation teams for a decade.']
}, {
  text: 'The competitive set',
  type: 'h'
}, {
  text: 'Indonesia, Chile, Australia and Canada are all pursuing midstream lithium and nickel capacity with different success. Indonesia used export bans to force nickel refining domestic; the result was significant investment, but also a WTO dispute and environmental critique. Chile and Australia have the ore and a growing refining base but not the downstream chemistry. Canada has the critical-minerals policy but not yet the scale. India is entering this field later but with the largest single demand pool in Asia and the most capital-efficient power position.',
  type: 'p'
}, {
  text: 'Three scenarios',
  type: 'h'
}, {
  text: 'Base case — 35% probability: India builds 10–15 mtpa equivalent critical-mineral processing capacity by 2035, anchored by domestic demand but not enough to serve regional markets meaningfully. Accelerated case — 25% probability: India attaches processing mandates to mineral concessions, signs technology-transfer partnerships, and graduates 1,000+ hydromet and separation engineers by 2030. Stalled case — 40% probability: Refinery announcements outrun execution; first-generation plants miss yield and cost targets; the hub aspiration remains unrealised.',
  type: 'p'
}, {
  text: 'The verdict',
  type: 'h'
}, {
  text: 'India can be Asia\'s processing hub in the same way it can be a semiconductor manufacturer: it is not a geology question, it is a policy, technology-transfer and execution question. The minerals are here. The market is here. The policy intent is here. What is missing is the deliberate midstream architecture that connects those three things into an industrial system.',
  type: 'p'
}],
  takeaways: ['India has a structurally plausible path to becoming Asia\'s critical-mineral processing hub; the constraint is execution, not ore or demand.', 'Three bets decide the outcome: processing mandates in mineral policy, genuine technology-transfer partnerships, and a hydromet/separation-chemistry talent pipeline.', 'Indonesia shows what export-linked processing mandates can achieve in 3–5 years; India has better power and a larger domestic market but less coercive policy instruments.'],
  sources: ['https://www.iea.org/reports/global-critical-minerals-outlook-2025/executive-summary', 'https://www.wto.org/english/tratop_e/dispu_e/cases_e/ds592_e.htm', 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2097309']
}, {
  slug: 'refinery-equipment-technology-transfer',
  no: 'S-020',
  title: 'The Refinery Equipment and Technology-Transfer Layer Beneath Mineral Processing',
  domain: 'Industrial Infrastructure & Manufacturing',
  date: '2026-07-19',
  dateLabel: '19 July 2026',
  status: 'live',
  excerpt: 'Mineral processing plants are built by EPC contractors using proprietary separation technology. The equipment and know-how beneath every refinery announcement is the real leverage point — and the surface where Indian industry can compete.',
  readingTime: '7 min',
  body: [{
  text: 'Every announcement of a lithium refinery, rare-earth separation plant or high-purity chemical facility conceals a second story: the origin of the technology and the identity of the EPC contractor. A solvent-extraction train for lithium carbonate with 99.5% purity is not commodity civil engineering. It is proprietary column design, mixer-settler hydraulics, solvent chemistry, impurity profiles and controls logic — usually held by a small number of specialists in Europe, Japan and China.',
  type: 'p'
}, {
  text: 'The equipment stack',
  type: 'h'
}, {
  type: 'list',
  items: ['Solvent extraction: mixer-settlers, pulse and packed columns, centrifugal contactors — lead times 12–18 months.', 'Hydrometallurgical reactors: autoclaves, pressure leach vessels, thickeners, filters — pressure-vessel codes, corrosion alloys.', 'Ion exchange and chromatography: specialised resins, guard columns, elution systems.', 'Crystallisation and drying: forced-circulation crystallisers, spray dryers, fluidised beds.', 'Process control: SCADA, analysers, inline ICP-OES for quality assurance.', 'Utilities: ultrapure water, clean steam, nitrogen blanketing, waste-neutralisation circuits.']
}, {
  text: 'The European case',
  type: 'h'
}, {
  text: 'The reference to European technology is an example of the broader pattern, not the story itself. Several mid-tier hydromet and solvent-extraction specialists in Europe and Japan have proven technology for lithium, REE and battery-metal streams. What matters is not their nationality; it is whether the Indian partner structure transfers enough know-how to replicate and improve the plant without recurring foreign support, or whether it becomes a black-box dependency.',
  type: 'p'
}, {
  text: 'The Indian opportunity',
  type: 'h'
}, {
  text: 'Large EPC and process-engineering firms already deliver turnkey process plants domestically. The gap is not basic EPC capability. The gap is the know-how layer: proprietary separation chemistry, metallurgical process design, and the ability to operate and tune complex hydromet circuits at commercial scale. Firms that capture that capability now, through JV technology-acquisition or systematic reverse-engineering of first-generation plants, will own the repeat-order layer when the second and third Indian refineries are bid.',
  type: 'p'
}, {
  text: 'What to watch',
  type: 'h'
}, {
  type: 'list',
  items: ['EPC/technology-licensing announcements for lithium, REE and high-purity metal refineries.', 'Whether JV structures include technology-transfer clauses, local engineering content commitments and training mandates.', 'Indian instrumentation and control firms entering the hydromet stack — a leading indicator of domestic capability depth.', 'The durability of first-generation refineries: ramp rates, yield performance and solvent-management records are the metrics to watch, not groundbreaking photographs.']
}, {
  text: 'The picks-and-shovels layer is where the repeatable Indian industrial capability is built. Mine ownership is a one-off; refinery equipment and engineering know-how is a durable, exportable platform.',
  type: 'p'
}],
  takeaways: ['Every refinery announcement hides a second story — the origin of the separation technology and the identity of the EPC contractor.', 'The equipment and know-how layer — solvent extraction, hydromet, ion exchange, crystallisation — is the real leverage point and where Indian industry can build durable advantage.', 'Technology transfer, not just equipment supply, is the metric that separates genuine capability build from another import-dependent greenfield.'],
  sources: ['https://www.iea.org/reports/global-critical-minerals-outlook-2025/executive-summary', 'https://www.iea.org/commentaries/with-new-export-controls-on-critical-minerals-supply-concentration-risks-become-reality', 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2097309']
}, {
  slug: 'battery-materials-processing-india',
  no: 'S-021',
  title: 'Battery Materials Processing — Lithium, Cobalt, Nickel and the Cell-Ecosystem Opportunity',
  domain: 'Energy Storage & Industrial Infrastructure',
  date: '2026-07-19',
  dateLabel: '19 July 2026',
  status: 'live',
  excerpt: 'India is committing to gigafactory-scale cell manufacturing; the upstream chemistry — refining, precursor, cathode, anode — is where most of the value and most of the import risk actually sits.',
  readingTime: '7 min',
  body: [{
  text: 'A lithium-ion cell contains roughly 40% cathode chemistry by value, 25% anode, 15% casing and current collectors, 10% electrolyte and separator, and 10% assembly. Of those, India has credible indigenous capacity only in some casing, current collector and basic separator supply. Cathode active material, anode graphite, battery-grade lithium carbonate or hydroxide, cobalt sulphate and nickel-cobalt-manganese precursor are all largely imported. That is where the value concentrates, and that is where the domestic opportunity sits.',
  type: 'p'
}, {
  text: 'The demand is structural',
  type: 'h'
}, {
  text: 'India\'s EV road map targets 30% EV penetration by 2030, which implies roughly 80–120 GWh of annual cell demand by the end of the decade, against a current domestic cell-manufacturing base that is still scaling. Even conservative penetration scenarios land in the 60–100 GWh range by 2030. Energy storage systems, grid-scale BESS and defence-electric vehicles add more. That is a large, predictable domestic pull for upstream chemistry.',
  type: 'p'
}, {
  text: 'The processing steps',
  type: 'h'
}, {
  type: 'list',
  items: ['Lithium refining: spodumene or leach-lithium conversion to battery-grade carbonate or hydroxide — USD 500–800 million per 20,000 tpa plant, 18–24 month build.', 'Nickel and cobalt refining: HPAL or chloride leaching to MHP / cobalt sulphate; India uses some MHP but no large domestic cobalt-sulphate line.', 'Precursor synthesis: NCM, NCA, LFP precursor — a high-purity, tightly controlled synthesis step where yield and particle-size distribution dominate cost.', 'Cathode active material: calcination, coating, drying — the highest-margin step in the cell chain once precursor is secured.', 'Anode: purified graphite, artificial graphite synthesis — largely imported today despite graphite reserves.', 'Electrolyte and separator: fluorinated solvents, PVDF, ceramic-coated separators — specialty-chemical inputs with domestic pilot-stage capability.']
}, {
  text: 'The opportunity map',
  type: 'h'
}, {
  text: 'The nearest-term, highest-certainty Indian opportunity is cathode active material and precursor synthesis because the demand signal is domestic gigafactory offtake. The biggest import-dependence exposure is battery-grade lithium and cobalt chemicals, because the feedstock comes from abroad and the refining sits in China. An Indian midstream that can offer long-term offtake contracts tied to domestic cell production would change the investment case for every upstream lithium, nickel and cobalt project.',
  type: 'p'
}, {
  text: 'What to watch',
  type: 'h'
}, {
  type: 'list',
  items: ['Gigafactory offtake agreements with domestic cell makers as the anchor for upstream CAPEX.', 'Any lithium-refinery or precursor-plant announcements in Gujarat, Tamil Nadu or Andhra Pradesh.', 'Khanij Bids and overseas lithium-cobalt-nickel agreements that include processing commitments, not just ore ownership.', 'Battery Material PLI or similar demand-pull policy — catalytic for the same reason semiconductor PLIs were catalytic.']
}, {
  text: 'Battery materials processing is the largest processing demand-pull India has, because the cell is the universal intermediate — EV, storage, defence electric platforms, inverters, robotics all converge on the same chemistry. The question is whether India builds the chemistry first and the cells second, or the cells first and remains dependent on imported active material forever.',
  type: 'p'
}],
  takeaways: ['Cathode active material, precursor synthesis and battery-grade lithium/cobalt/nickel refining hold most of the cell-chain value and most of the import risk.', 'India has EV, stationary-storage and defence-electric demand that can anchor upstream chemistry investments — if offtake contracts are credible.', 'The sequence that matters is chemistry first, cells second: without domestic active material, gigafactories remain assembly dependency.'],
  sources: ['https://www.iea.org/reports/global-critical-minerals-outlook-2025/executive-summary', 'https://www.iea.org/reports/global-critical-minerals-outlook-2025/overview-of-outlook-for-key-minerals', 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2097309']
}, {
  slug: 'mineral-security-to-processing-thesis',
  no: 'S-017',
  title: 'From Mineral Security to Mineral Processing — Why the Midstream Layer Decides Competitiveness',
  domain: 'Critical Minerals',
  date: '2026-07-19',
  dateLabel: '19 July 2026',
  status: 'live',
  excerpt: 'India has secured mineral acreage abroad and is building domestic capacity; the missing layer is processing — the refining, separation and chemicals step that converts ore into feedstock. Whoever owns that layer owns the rent.',
  readingTime: '7 min',
  body: [{
  text: 'India has done the hard part of the upstream equation: long-term lithium, cobalt, nickel and REE agreements in Australia, Africa and South America; domestic coal and lignite blocks; the auction pipeline for offshore and critical minerals. But securing an ore block is not the same as controlling the metal. The value is added in the midstream — beneficiation, refining, separation and high-purity chemical production — and that is where India remains thin.',
  type: 'p'
}, {
  text: 'China illustrates the architecture: roughly 90% of global rare-earth separation, roughly 70% of lithium chemical refining and the dominant share of cobalt refining and precursor production sit in one country. The upstream deposits are distributed; the midstream is highly concentrated. That concentration is the leverage point.',
  type: 'p'
}, {
  text: 'The India opportunity',
  type: 'h'
}, {
  text: 'India already has the demand pull — semiconductors, AI infrastructure, EV batteries, defence magnet motors, renewable-energy inverters — each with different purity and specification requirements. What it lacks is a coherent midstream strategy that treats processing as industrial policy rather than commodity extraction. A domestic refining and chemicals base would simultaneously reduce import dependence, create an SME-grade equipment and chemicals market, and give downstream manufacturers a controllable supply base.',
  type: 'p'
}, {
  text: 'The exposure',
  type: 'h'
}, {
  text: 'Processing is capital- and chemistry-intensive, not just ore-intensive. A modern lithium refinery costs USD 400–800 million before working capital. A rare-earth separation train is similarly heavy, with lead times of 18–30 months for critical columns, solvents and controls. The talent — solvent-extraction engineers, process chemists, metallurgists — is concentrated in a handful of geographies. Technology transfer is therefore the real constraint, not money.',
  type: 'p'
}, {
  text: 'What to watch',
  type: 'h'
}, {
  type: 'list',
  items: ['Whether the Khanij Bids include midstream processing mandates or domestic-value-addition conditions.', 'Indian partnerships in separation technology and whether they transfer know-how or merely license equipment.', 'The pace and scale of lithium and nickel refinery announcements in Gujarat, Tamil Nadu and Andhra Pradesh.', 'Whether rare-earth separation is funded as a strategic national capability rather than left to market pricing.', 'Export-control alignment with the Minerals Security Partnership and Quad supply-chain frameworks.']
}, {
  text: 'The signal is not scarcity of ore. The signal is that downstream value in every critical-mineral chain concentrates at the processing node, and that node is currently owned elsewhere. India\'s next mineral-security win is not another acreage agreement. It is a refinery.',
  type: 'p'
}],
  takeaways: ['The midstream — refining, separation and high-purity chemical production — is where mineral value concentrates and where China holds dominant leverage.', 'India has secured upstream acreage; the binding constraint is processing know-how, chemistry capability and controlled feedstock supply.', 'A domestic mineral-processing base converts critical minerals from a geopolitical exposure into an industrial-policy asset.'],
  sources: ['https://www.iea.org/reports/global-critical-minerals-outlook-2025/executive-summary', 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2097309', 'https://pubs.usgs.gov/periodicals/mcs2025/mcs2025.pdf']
}, {
  slug: 'rare-earth-magnets-motors-chokepoint',
  no: 'S-018',
  title: 'Rare Earth Separation → Magnets → Motors: The Defence and Robotics Chokepoint',
  domain: 'Critical Minerals & Defence',
  date: '2026-07-19',
  dateLabel: '19 July 2026',
  status: 'live',
  excerpt: 'China controls roughly 90% of global rare-earth separation and the dominant share of sintered NdFeB magnet output. Every Indian precision motor — drone, robot, defence actuator — sits upstream of that bottleneck.',
  readingTime: '7 min',
  body: [{
  text: 'The rare-earth value chain runs from bastnaesite or ion-adsorption clay through separation into La, Ce, Pr, Nd and heavy REMs, then into metal alloys, sintered or bonded magnets, and finally into the motors and actuators that use them. India has neither commercial-scale heavy-rare-earth separation nor sintered NdFeB manufacturing capacity. Every kilogram of NdFeB magnet used domestically is currently imported, almost entirely from China.',
  type: 'p'
}, {
  text: 'Why this matters for defence and robotics',
  type: 'h'
}, {
  text: 'A single small military drone or loitering munition uses multiple brushless DC motors with sintered NdFeB rotors. A 6-axis robot uses 6. Multiply that across DRDO programmes, Army maritime surveillance drones and future combat-robot platforms — the volumes are large enough to matter, and the specifications are high enough that commodity substitutes are not always suitable.',
  type: 'p'
}, {
  text: 'NdFeB demand forecast',
  type: 'h'
}, {
  text: 'Global NdFeB demand is expected to grow from roughly 200,000 tonnes per year in 2024 toward 300,000–380,000 tpa by 2030. India\'s domestic demand is an order of magnitude smaller today — perhaps 1,500–3,000 tpa across all uses — but is growing fast as drone manufacturing scales. The strategic point is not current volume; it is that the entire base sits on a single-source supply chain with no domestic alternative.',
  type: 'p'
}, {
  text: 'The Indian response so far',
  type: 'h'
}, {
  text: 'The government has amended the Mines and Minerals Act to bring atomic minerals into the licensing fold; the Khanij Bids include monazite and beach-sand streams in Kerala, Tamil Nadu and Odisha; and the Department of Atomic Energy has domestic monazite-processing capability for light REMs. But converting monazite or any Indian rare-earth concentrate into separated high-purity Nd, Dy and Tb metal, and then into sintered magnets meeting defence-grade specs, requires dedicated capacity that does not yet exist at commercial scale.',
  type: 'p'
}, {
  text: 'What to watch',
  type: 'h'
}, {
  type: 'list',
  items: ['Whether the rare-earth processing mandate is attached to specific Khanij Bid blocks or remains advisory.', 'Any sintered NdFeB or heavy-RE metal announcements — these are rare and meaningful when they appear.', 'Defence acquisition orders for indigenously designed motors and actuators as a demand anchor for domestic magnet production.', 'Quad or MSP supply-chain projects that include rare-earth separation outside China — Japan, Australia and Canada are the likely partners.']
}, {
  text: 'The chokepoint is structural: the ore is here; the chemistry is elsewhere. Closing it requires a deliberate build, not a policy statement.',
  type: 'p'
}],
  takeaways: ['China holds roughly 90% of global rare-earth separation and the dominant share of sintered NdFeB output — India imports all of its magnet-grade REM feed.', 'India has monazite and beach-sand resources and DAE separation capability for light REMs, but no commercial heavy-RE or sintered NdFeB capacity.', 'Defence drones, military robotics, EV traction and industrial automation translate rare-earth availability into a direct strategic-capability question.'],
  sources: ['https://www.iea.org/reports/global-critical-minerals-outlook-2025/executive-summary', 'https://pubs.usgs.gov/periodicals/mcs2025/mcs2025-rare-earths.pdf', 'https://www.pmindia.gov.in/en/news_updates/cabinet-approves-rs-7280-crore-scheme-to-promote-manufacturing-of-sintered-rare-earth-permanent-magnets-repm/']
}, {
  slug: 'high-purity-minerals-for-semiconductors',
  no: 'S-019',
  title: 'High-Purity Minerals Enter the Semiconductor Feedstock Chain',
  domain: 'Semiconductor Ecosystems',
  date: '2026-07-19',
  dateLabel: '19 July 2026',
  status: 'live',
  excerpt: 'Gallium, germanium, electronic-grade chemicals and high-purity targets are the quiet dependencies beneath every fab. China already accounts for the dominant share of refining; India is building the demand side without the supply base.',
  readingTime: '7 min',
  body: [{
  text: 'When analysts write about semiconductor supply chains they describe the fab: the lithography, deposition and etch tools, the cleanroom, the wafer starts and the packaging lines. What they leave out is the feedstock chemistry that sits upstream of all of that — the 99.9999% pure gases, the sputtering targets, the photoresists, the CVD precursors, the high-purity gallium and germanium. Without those inputs, the most expensive fab in the world produces nothing.',
  type: 'p'
}, {
  text: 'Gallium and germanium',
  type: 'h'
}, {
  text: 'China produces the overwhelming majority of primary gallium and germanium metal and compounds. In 2023 it introduced export licences and then export restrictions on both, precisely because they are inputs into infrared optics, semiconductors and advanced substrates rather than end products. India has modest bauxite and coal-based germanium by-product streams but no high-scale refining or 7N–7N5 purity upgrading.',
  type: 'p'
}, {
  text: 'From minerals to chips',
  type: 'h'
}, {
  text: 'High-purity gallium is used to make GaAs and GaN substrates for RF, power and optoelectronic devices. Germanium enters silicon-germanium alloys for advanced logic and image sensors. Electronic-grade sulfuric acid, hydrogen peroxide and isopropanol are consumed in wafer cleaning in kilogram-per-wafer quantities. CMP slurries and photoresists are applied at every critical layer. These are not exotic niche inputs; they are the consumables that a running fab cannot run out of.',
  type: 'p'
}, {
  text: 'The Indian opportunity',
  type: 'h'
}, {
  text: 'India\'s semiconductor demand is set by the Ministry of Electronics and IT\'s own projections — USD 450–500 billion electronics output by 2029–30, with semiconductor consumption scaling from an estimated USD 20–25 billion today toward USD 60–80 billion by 2030. The materials that feed that demand are almost entirely imported. A domestic high-purity chemicals and metals base would serve every announced fab and OSAT simultaneously, giving it a market anchor from day one.',
  type: 'p'
}, {
  text: 'What to watch',
  type: 'h'
}, {
  type: 'list',
  items: ['Any gallium or germanium refining capacity announcements — even pilot-scale — as a leading indicator of strategic intent.', 'Whether DST/MeitY R&D funding for electronic-grade chemicals translates into pilot plants rather than publications.', 'Import volumes of electronic-grade acids, solvents, photoresists and high-purity metals from Korea, Japan and Taiwan.', 'Whether Indian fabs and OSATs sign long-term offtake agreements for domestic high-purity feedstock before commissioning.', 'Technology-transfer deals with Japanese, Korean or European specialty-chemical firms that include know-how rather than only equipment supply.']
}, {
  text: 'Semiconductor competitiveness is decided layer by layer, and the materials layer is the one India currently imports almost completely. The question is not whether India can build fabs; it is whether it builds the chemistry the fabs consume.',
  type: 'p'
}],
  takeaways: ['High-purity gallium, germanium, electronic-grade chemicals and CMP consumables are the quiet dependencies beneath every fab and OSAT line.', 'China dominates refining and purification of these materials; India has the demand but not the supply base.', 'A domestic high-purity materials sector would serve every Indian fab and OSAT simultaneously, making it a natural anchor investment in Semicon 2.0\'s second pillar.'],
  sources: ['https://pubs.usgs.gov/periodicals/mcs2025/mcs2025.pdf', 'https://www.iea.org/policies/17893-announcement-on-the-implementation-of-export-control-of-items-related-to-gallium-and-germanium', 'https://www.iea.org/reports/global-critical-minerals-outlook-2025/executive-summary']
}, {
  slug: 'magnet-free-motors-rare-earth-value-chain',
  no: 'S-023',
  title: 'Magnet-Free Motors Could Redraw India\'s Rare-Earth Value Chain',
  domain: 'Critical Minerals & Materials',
  date: '2026-07-19',
  dateLabel: '19 July 2026',
  status: 'live',
  excerpt: 'A Bengaluru startup\'s rare-earth-free EV motor is being read as an EV story. It is a supply-chain story: a viable magnet-free motor bends the demand curve for the entire rare-earth → magnet → motor chain — the exact chokepoint India is spending ₹7,280 crore to build.',
  readingTime: '7 min',
  body: [{
  text: 'Vimag Labs, a roughly $5 million Bengaluru startup, has secured its fifth Indian patent for a Virtual Magnet Synchronous Motor — a brushless, slip-ring-free traction motor that uses no rare-earth permanent magnets at all. Instead of a fixed magnet, it generates and controls the rotor\'s magnetic field in real time using power electronics and proprietary control algorithms. The company expects to ship between 1,000 and 10,000 motors by the end of 2026. At CES 2026, Matter showed a rare-earth-free motor built on iron-nitride magnets — the same problem, a different route. Read as EV news, this is a product launch. Read as industrial intelligence, it is something larger.',
  type: 'p'
}, {
  text: 'The motor is not the story',
  type: 'h'
}, {
  text: 'The story is what a commercially viable magnet-free motor does to a value chain that runs from rare-earth mining, through separation and refining, into sintered NdFeB magnets, into traction motors, and out into EVs, drones, robotics, industrial drives and defence platforms. China holds an estimated 91% of global rare-earth refining and 94% of sintered permanent-magnet production, and in April and October 2025 it turned that concentration into leverage with export controls on heavy rare earths and a de-minimis rule reaching any product containing Chinese rare-earth content. Anything that takes the magnet out of the motor reduces the bite of that chokepoint.',
  type: 'p'
}, {
  text: 'The tension inside India\'s own strategy',
  type: 'h'
}, {
  text: 'India is doing two things at once. On the supply side it is funding the chokepoint — the ₹7,280 crore rare-earth permanent magnet (REPM) scheme backs 6,000 MTPA of domestic sintered-magnet capacity, a bet that magnets stay essential and India should make them. On the substitution side, startups are trying to design the magnet out of the motor entirely. These are not contradictory; together they are a hedge against a dependency India does not control. But they compete for the same policy attention and capital, and the returns on domestic magnet capacity fall if magnet-free motors scale. The two should be run as one materials-resilience strategy, not as competing bets.',
  type: 'p'
}, {
  text: 'Where the value moves',
  type: 'h'
}, {
  text: 'A magnet-free motor relocates value. It shifts the cost and the moat out of materials — rare earths and sintered magnets — and into power electronics and control software: silicon, inverters, and motor-control IP. That is a different industrial base. Not mines and separation trains, but semiconductors, power-electronics manufacturing and embedded software, where India\'s design strength is genuine. Substitution does not remove the opportunity; it moves it up the stack, from the atoms to the algorithm.',
  type: 'p'
}, {
  text: 'What to watch',
  type: 'h'
}, {
  type: 'list',
  items: ['Whether Vimag and its peers convert patents into shipped, cost-competitive motors — efficiency and cost per kW versus NdFeB motors is the real test, not the patent count.', 'Whether Indian OEMs design magnet-free motors in — two- and three-wheelers first, where power density matters less — or treat them only as a hedge.', 'Whether the REPM magnet scheme and magnet-free R&D are coordinated as one strategy, or left to compete for capital and attention.', 'Traction-inverter and power-electronics localisation — the layer that captures the value if magnet-free scales.', 'Global signals: Tesla\'s next-generation rare-earth-free motor, Niron and Matter\'s iron-nitride route, and whether magnet-free stays in two- and three-wheelers and industrial drives or reaches passenger cars.']
}, {
  text: 'The most important thing a magnet-free motor does is give India optionality on a chokepoint it does not control. It will not displace NdFeB motors everywhere soon — power density still favours magnets in cars — but in two- and three-wheelers, drones and industrial drives, magnet-free is credible, and those are exactly the volumes India already makes. The opportunity is to own the substitution path — power electronics and motor-control software — not only to chase the magnets.',
  type: 'p'
}],
  takeaways: ['A rare-earth-free motor is a supply-chain signal, not an EV story: it can bend the demand curve for the rare-earth → magnet → motor chain that China dominates (~91% refining, ~94% magnets).', 'India is hedging both ways — funding domestic magnets (₹7,280 cr REPM) and designing the magnet out — and the two should be run as one materials-resilience strategy, not competing bets.', 'Magnet-free relocates value from materials to power electronics and motor-control software — the stack India should own if substitution scales.'],
  sources: ['https://electrek.co/2026/07/13/vimag-labs-magnet-free-ev-motor-patent/', 'https://gulfnews.com/technology/indian-startup-patents-rare-earth-free-electric-motor-for-evs-challenging-chinas-supply-chain-dominance-1.500609670', 'https://www.iea.org/reports/global-critical-minerals-outlook-2025/executive-summary', 'https://www.pmindia.gov.in/en/news_updates/cabinet-approves-rs-7280-crore-scheme-to-promote-manufacturing-of-sintered-rare-earth-permanent-magnets-repm/']
}, {
  slug: 'marvell-india-semiconductor-design',
  no: 'S-023',
  title: 'Marvell\'s US$250 Million India Investment Reinforces India\'s Emergence as a Global Semiconductor Design Hub',
  domain: 'Semiconductor Design & R&D Ecosystem',
  date: '2026-07-29',
  dateLabel: '29 Jul 2026',
  status: 'live',
  excerpt: 'Marvell will invest US$250 million over the next three years to expand technology, talent and infrastructure in India. The announcement is less about real estate than about concentrating advanced chip-design capability in India — architecture, ASIC design, verification, AI accelerators and cloud networking silicon.',
  readingTime: '5 min',
  body: [{
  text: 'Marvell announced it will invest US$250 million over the next three years to expand its technology, talent and infrastructure in India. The company plans to double its headcount, expand its Bengaluru facility, increase its Hyderabad presence, and use India to design advanced semiconductors for artificial intelligence, cloud and data infrastructure.',
  type: 'p'
}, {
  text: 'For years, India\'s semiconductor narrative has been dominated by fabrication incentives, outsourced assembly and testing, packaging, and government support schemes. This announcement highlights another pillar that is becoming equally important: India is becoming a global semiconductor engineering and product development centre.',
  type: 'p'
}, {
  text: 'The shift in the value chain',
  type: 'h'
}, {
  text: 'Multinational semiconductor companies are no longer using India only for support engineering. They are investing in architecture, application-specific integrated circuit design, physical-layer development, verification, firmware, AI accelerators and cloud networking chips. That creates a different class of industrial opportunity — one that depends on design talent and intellectual-property creation rather than manufacturing subsidies alone.',
  type: 'p'
}, {
  text: 'Engineering talent as strategic infrastructure',
  type: 'h'
}, {
  text: 'The scarce resource is no longer office space. It is register-transfer-level engineers, physical-design engineers, design-for-test engineers, verification engineers, AI accelerator architects, high-speed serialiser/deserialiser engineers and networking ASIC designers. Marvell\'s announcement is as much about people as facilities, and it reinforces the growing opportunity around semiconductor talent, education and ecosystem development.',
  type: 'p'
}, {
  text: 'The Bengaluru–Hyderabad semiconductor corridor',
  type: 'h'
}, {
  text: 'Marvell is expanding in both Bengaluru and Hyderabad. That reinforces the emergence of a dual-centre semiconductor research and development corridor rather than a single-city ecosystem. The concentration of design centres, talent pools and infrastructure investments across these two cities is creating a more resilient base for long-term chip-design activity in India.',
  type: 'p'
}, {
  text: 'AI infrastructure demand as the driver',
  type: 'h'
}, {
  text: 'Marvell specifically mentioned artificial intelligence, cloud and data infrastructure. These are among the fastest-growing semiconductor markets globally. India\'s position as a design hub for these segments matters because the next wave of semiconductor value is concentrating in AI training and inference silicon, network-optimised processors and data-centre connectivity chips — precisely the domains where Indian engineering teams are already active.',
  type: 'p'
}, {
  text: 'What the signal means',
  type: 'h'
}, {
  text: 'Investment announcements of this kind are useful indicators when read as a pattern rather than in isolation. They suggest that India is moving from design services toward product architecture and intellectual-property creation. That increases value capture, changes the composition of economic benefit, and creates adjacent opportunity in electronic design automation tools, verification infrastructure, university-to-industry talent pipelines and supplier ecosystems around high-value chip-design clusters.',
  type: 'p'
}],
  takeaways: ['Marvell will invest US$250 million over three years and expand its Bengaluru and Hyderabad presence, doubling Indian headcount to support advanced semiconductor design.', 'The announcement signals a structural shift in India\'s semiconductor role: from manufacturing support and assembly toward global chip architecture, ASIC design, verification and AI accelerator development.', 'The scarce resource is now engineering talent — RTL, physical design, DFT, verification, AI accelerator architecture and high-speed SerDes — which makes semiconductor education and ecosystem development a strategic industry.', 'The Bengaluru–Hyderabad corridor is strengthening as India\'s primary semiconductor design and R&D hub, creating concentrated opportunity for adjacent vendors and institutions.'],
  sources: ['https://www.thehindu.com/business/Industry/semicon-firm-marvell-to-invest-250-mn-in-technology-talent-and-infrastructure-in-india/article71281465.ece', 'https://www.marvell.com/']
}, {
  slug: 'critical-manufacturing-dependency-index-launch',
  no: 'S-024',
  title: 'India Now Has a Structured Map of Where It Stays Import-Dependent',
  domain: 'Critical Manufacturing Dependencies',
  date: '2026-07-31',
  dateLabel: '31 Jul 2026',
  status: 'live',
  excerpt: 'Techadyant\'s new Critical Manufacturing Dependency Index (CMDI) scores India\'s strategic imports on a common ruler — import value, supply risk, strategic importance, industrial multiplier and substitutability — turning a scattered import problem into a rankable, trackable dependency map.',
  readingTime: '5 min',
  body: [{
  text: 'For years India\'s import-dependence has been discussed product by product and headline by headline. The Critical Manufacturing Dependency Index (CMDI) replaces that with one structured instrument: every strategic import is scored 0-100 on the same five weighted variables — import value (0.30), supply risk (0.25), strategic importance (0.20), industrial multiplier (0.15) and substitutability (0.10).',
  type: 'p'
}, {
  text: 'Why a single index matters',
  type: 'h'
}, {
  text: 'A common ruler makes dependencies comparable. A product with a high import bill but many suppliers is a different problem from one with a small bill but a single foreign source. The CMDI separates the two, and pairs each product with a Localization Potential Index (how feasibly India can make it) and an Investment Attractiveness Index (whether the economics work). Together they turn a risk list into a decision tool.',
  type: 'p'
}, {
  text: 'From list to living monitor',
  type: 'h'
}, {
  text: 'Because the index is formula-driven, it can be re-scored as trade data, capacity and policy change — so dependency becomes something you track over time, not a one-off audit. That is the shift the CMDI enables: a repeatable read on where India remains strategically exposed and where the exposure is easing.',
  type: 'p'
}, {
  text: 'What the signal means',
  type: 'h'
}, {
  text: 'The value is not any single score but the framework: it lets capital, policy and industry argue from the same map. The next question it forces is sequencing — which of the highest-scoring dependencies are worth localising first, given that the ones with the greatest strategic weight are often the hardest to build.',
  type: 'p'
}],
  takeaways: ['The CMDI scores strategic imports on one 0-100 ruler (import value, supply risk, strategic importance, industrial multiplier, substitutability), making India\'s dependencies directly comparable for the first time.', 'Paired with a Localization Potential Index and Investment Attractiveness Index, it converts a risk list into a decision tool — separating what is worth localising from what is merely large.', 'Because it is formula-driven, dependency becomes trackable over time rather than a one-off audit — the basis for a recurring national dependency monitor.', 'The hardest dependencies (highest strategic weight) are often the least localisable, so the index\'s real use is sequencing scarce capital and policy.'],
  sources: ['https://labs.techadyant.com/research/dependencies', 'https://tradestat.commerce.gov.in']
}, {
  slug: 'india-manufacturing-chokepoints-cmdi',
  no: 'S-025',
  title: 'India\'s Deepest Chokepoints: EUV Photoresist, Leading-Edge Logic and Aero-Engines',
  domain: 'Critical Manufacturing Dependencies',
  date: '2026-07-31',
  dateLabel: '31 Jul 2026',
  status: 'live',
  excerpt: 'The products that score highest on dependency — EUV photoresists (CMDI 95), sub-7nm logic ICs (94) and combat aero-engine turbofans (92) — are precisely the ones India can least localise in the near term (localisation scores of 5-28), a mismatch that defines the sovereignty problem.',
  readingTime: '5 min',
  body: [{
  text: 'At the top of the dependency ranking sit products where India has almost no domestic capability: EUV photoresists (CMDI 95, supplier concentration HHI 8,200, Japan), logic ICs at 7nm and below (CMDI 94, Taiwan), and combat aero-engine turbofans (CMDI 92, United States). Each combines a high import bill, an extremely concentrated supplier base and deep strategic weight.',
  type: 'p'
}, {
  text: 'The chokepoint mismatch',
  type: 'h'
}, {
  text: 'What makes these chokepoints, not just imports, is that their Localization Potential is the lowest on the board — 5 for EUV resist, 8 for leading-edge logic, 28 for aero-engines. The things India most needs to make are the things it is least ready to make. Chasing them first burns capital on the slowest wins.',
  type: 'p'
}, {
  text: 'Localise the chokepoint, not the volume',
  type: 'h'
}, {
  text: 'The strategic reading is to attack the narrow, high-leverage chokepoints deliberately and over a long horizon (technology partnerships, talent, patient capital), while not mistaking a large but substitutable import for a genuine vulnerability. A concentrated single-source input worth a few hundred million dollars can matter more than a multi-billion-dollar import with many suppliers.',
  type: 'p'
}, {
  text: 'What the signal means',
  type: 'h'
}, {
  text: 'These are Position-early or Watch bets, not quick wins — worth pursuing for sovereignty reasons but not expected to pay back fast. The near-term returns live elsewhere: dependencies that are still high but far more localisable.',
  type: 'p'
}],
  takeaways: ['The highest-dependency products — EUV photoresist (CMDI 95), sub-7nm logic (94), combat aero-engines (92) — are the least localisable (scores 5-28): the core sovereignty mismatch.', 'They share extreme supplier concentration (HHI 4,800-8,200) and single-country sources (Japan, Taiwan, USA), so a cut-off risk outweighs the raw import bill.', 'These are long-horizon, partnership-and-talent bets — attack the narrow chokepoint deliberately rather than chasing volume.', 'A concentrated single-source input can matter more than a far larger import with many suppliers — the index makes that visible.'],
  sources: ['https://tradestat.commerce.gov.in', 'https://labs.techadyant.com/research/dependencies']
}, {
  slug: 'india-build-now-localisation-surfaces',
  no: 'S-026',
  title: 'Where Dependency Meets Feasibility: SiC Power and Display-Driver ICs Are the Build-Now Surfaces',
  domain: 'Critical Manufacturing Dependencies',
  date: '2026-07-31',
  dateLabel: '31 Jul 2026',
  status: 'live',
  excerpt: 'Not every deep dependency is a hard problem. Silicon-carbide power semiconductors (dependency 82, localisation 62, investment attractiveness 80) and display-driver ICs (dependency 80, localisation 62, attractiveness 78) combine high exposure with genuine feasibility — the surfaces where capital should move first.',
  readingTime: '4 min',
  body: [{
  text: 'The opposite corner of the map from the chokepoints is where the near-term opportunity sits: products India imports heavily but could realistically make. Silicon-carbide (SiC) power semiconductors score 82 on dependency yet 62 on localisation potential and 80 on investment attractiveness. Display-driver ICs are similar (80 / 62 / 78). These are not moonshots; they are viable industrial ventures with a real import to displace.',
  type: 'p'
}, {
  text: 'The three-index test',
  type: 'h'
}, {
  text: 'Reading dependency, localisation and investment attractiveness together is what separates a Build-now surface from a Watch item. EUV resist scores 95 on dependency but 5 on localisation — a Watch bet. SiC scores lower on dependency but far higher on feasibility and economics — a Build-now bet. The prize is not always where the dependency is deepest; it is where deep-enough dependency meets buildable capability and workable returns.',
  type: 'p'
}, {
  text: 'What the signal means',
  type: 'h'
}, {
  text: 'For investors and policymakers the actionable list is the high-dependency, high-localisation, high-attractiveness intersection — power electronics (SiC, GaN), display drivers and similar mid-stream components. They reduce a real import while paying back on commercial terms, which is what makes an industrial-policy bet durable rather than subsidy-dependent.',
  type: 'p'
}],
  takeaways: ['SiC power semiconductors (dependency 82, localisation 62, attractiveness 80) and display-driver ICs (80/62/78) are the clearest Build-now surfaces: deep import, buildable, bankable.', 'Reading the three indices together separates Build-now from Watch — EUV resist (95 dependency / 5 localisation) is a Watch bet; SiC is a Build-now bet.', 'The biggest prize is not the deepest dependency but where deep-enough dependency meets feasibility and returns — mid-stream power electronics and drivers.', 'Ventures at this intersection displace real imports while paying back commercially, making the policy bet durable rather than subsidy-dependent.'],
  sources: ['https://labs.techadyant.com/research/dependencies']
}, {
  slug: 'india-pli-uneven-record-component-gap',
  no: 'S-027',
  title: 'PLI\'s Uneven Record Exposes the Component Gap Beneath Assembly',
  domain: 'Critical Manufacturing Dependencies',
  date: '2026-07-31',
  dateLabel: '31 Jul 2026',
  status: 'live',
  excerpt: 'Mobile-manufacturing PLI has drawn 312% of its targeted investment, but Electronic Components sits at 68% and Bulk Drugs at 48% — evidence that incentivising finished products localises assembly while the dependency migrates one layer down, into the components.',
  readingTime: '5 min',
  body: [{
  text: 'The Production-Linked Incentive schemes have a split record. Mobile manufacturing has realised roughly 312% of its targeted investment and textiles 117% — clear outperformers. But Electronic Components sits at 68% utilisation, Bulk Drugs at 48%, and White Goods at 67%. The pattern is not random.',
  type: 'p'
}, {
  text: 'Assembly localises, dependency migrates',
  type: 'h'
}, {
  text: 'The schemes that outperformed reward finished-product assembly, where India already had a base to scale. The laggards are the upstream component and active-ingredient lines — exactly the layers that finished-goods incentives do not reach. So localising the phone or the formulation shifts the import bill from the product to its components and precursors, rather than eliminating it. The dependency moves one tier down the stack.',
  type: 'p'
}, {
  text: 'The ecosystem gap',
  type: 'h'
}, {
  text: 'This is the structural gap the dependency lens exposes: PLI targets products; the L0-L3 ecosystem layers beneath them are not incentivised. Until the component, material and equipment tiers are pulled in — with instruments matched to their longer paybacks and thinner early economics — assembly success will keep masking upstream dependence.',
  type: 'p'
}, {
  text: 'What the signal means',
  type: 'h'
}, {
  text: 'The next generation of incentive design has to fund the chain, not just the output: component-line capex, materials, test-and-certification and equipment, where the imports actually concentrate. The PLI utilisation numbers are an early map of where that redesign is most overdue — components and bulk drugs first.',
  type: 'p'
}],
  takeaways: ['PLI utilisation is split: mobile manufacturing ~312% and textiles 117% (outperformed) versus Electronic Components 68% and Bulk Drugs 48% (below target).', 'Finished-product incentives localise assembly where a base existed; the upstream component and active-ingredient tiers they do not reach are the laggards.', 'So localising the product shifts the import bill to its components and precursors — the dependency migrates one layer down the stack rather than disappearing.', 'The fix is incentive design that funds the chain (component capex, materials, test-cert, equipment), not just the output — components and bulk drugs first.'],
  sources: ['https://www.investindia.gov.in/schemes/production-linked-incentive-scheme', 'https://www.pib.gov.in']
}, {
  slug: 'india-build-the-stack-not-assembly',
  no: 'S-028',
  title: 'India\'s Real Dependency Is One Layer Below the Product',
  domain: 'Critical Manufacturing Dependencies',
  date: '2026-07-31',
  dateLabel: '31 Jul 2026',
  status: 'live',
  excerpt: 'Across sectors the same pattern repeats: India assembles the finished good but imports the layers beneath it. The dependency lens resolves this by decomposing every product into localisable units — and the vulnerability almost always sits in the component, material and equipment tiers, not the assembly.',
  readingTime: '4 min',
  body: [{
  text: 'Decompose any strategic product into its layers — finished good, sub-assembly, component, material, equipment — and India\'s position is consistent: strong at assembly, thin below it. The phone is assembled here; the display driver, the RF front-end and the memory are imported. The drone is built here; the flight controller, motors and cells are imported. The pattern is structural, not sectoral.',
  type: 'p'
}, {
  text: 'Why final-assembly metrics mislead',
  type: 'h'
}, {
  text: 'Counting finished-goods output or export value flatters the picture because it captures the layer India already holds. Value and vulnerability live upstream, in the component and material tiers where a handful of foreign firms dominate. A country can lead the world in assembling a product and still control very little of the value or the security of its supply.',
  type: 'p'
}, {
  text: 'Build the stack, not the assembly',
  type: 'h'
}, {
  text: 'The strategic implication is to industrialise the layers, not just the endpoint: pull component lines, specialty materials, and manufacturing equipment into the incentive and capital stack. That is harder and slower than final assembly — the economics are thinner early and the paybacks longer — which is precisely why it does not happen on its own and why it is the work that actually reduces dependence.',
  type: 'p'
}, {
  text: 'What the signal means',
  type: 'h'
}, {
  text: 'Read every localisation claim by asking which layer it touches. Assembly wins are real but shallow; the durable gains are the unglamorous component, material and equipment tiers where the imports concentrate and the moats are built.',
  type: 'p'
}],
  takeaways: ['Decomposed into layers, India\'s position is consistent across sectors: strong at assembly, import-dependent in the component, material and equipment tiers beneath.', 'Finished-goods output and export metrics flatter the picture because they measure the one layer India already holds; value and vulnerability sit upstream.', 'Reducing dependence means industrialising the layers — component lines, specialty materials, equipment — not just the endpoint, which is harder and slower and so does not happen on its own.', 'Every localisation claim should be read by which layer it touches: assembly wins are shallow; component/material/equipment wins are durable.'],
  sources: ['https://labs.techadyant.com/research/dependencies']
}, {
  slug: 'india-state-manufacturing-capability-rankings',
  no: 'S-029',
  title: 'Which States Are Positioned to Reduce India\'s Import Dependence',
  domain: 'Critical Manufacturing Dependencies',
  date: '2026-07-31',
  dateLabel: '31 Jul 2026',
  status: 'live',
  excerpt: 'On a composite Manufacturing Capability Index, Maharashtra (82), Gujarat (81), Tamil Nadu (79) and Karnataka (77) lead — but the forward-looking sub-scores tell the sharper story: Gujarat tops the pipeline and future-readiness axes on the back of its semiconductor and chemicals bets.',
  readingTime: '4 min',
  body: [{
  text: 'Dependency reduction is ultimately built in specific places. Scoring all states on a composite Manufacturing Capability Index across thirteen sub-dimensions puts Maharashtra first (82), then Gujarat (81), Tamil Nadu (79) and Karnataka (77), with Telangana (71) and Andhra Pradesh (68) forming the next tier.',
  type: 'p'
}, {
  text: 'Present strength versus forward trajectory',
  type: 'h'
}, {
  text: 'The composite rewards existing output and employment, where Maharashtra and Tamil Nadu are strong. But the pipeline and future-readiness sub-scores — new projects, policy momentum, sunrise sectors — favour Gujarat, which leads on both, reflecting its semiconductor (Dholera), chemicals and renewables commitments. Andhra Pradesh scores highest of all on the future axis relative to its base, a lower-ranked state moving fast.',
  type: 'p'
}, {
  text: 'Why the split matters',
  type: 'h'
}, {
  text: 'The states that will localise the deepest dependencies are not simply today\'s largest manufacturers but those combining capability with a credible forward pipeline in the high-dependency sectors — semiconductors, power electronics, specialty chemicals. That is a narrower list than the headline ranking, and it is where the next chokepoint-localisation plants will most plausibly land.',
  type: 'p'
}, {
  text: 'What the signal means',
  type: 'h'
}, {
  text: 'For investors and central policymakers the map is a siting tool: match a high-dependency, high-localisation product to the state whose capability and pipeline actually fit it, rather than defaulting to the largest incumbent.',
  type: 'p'
}],
  takeaways: ['On a 13-dimension Manufacturing Capability Index, Maharashtra (82), Gujarat (81), Tamil Nadu (79) and Karnataka (77) lead; Telangana and Andhra Pradesh form the next tier.', 'Present strength (output, employment) favours Maharashtra/Tamil Nadu, but pipeline and future-readiness favour Gujarat — its semiconductor, chemicals and renewables bets.', 'The states that localise the deepest dependencies combine capability with a credible forward pipeline in high-dependency sectors — a narrower list than the headline ranking.', 'The ranking is a siting tool: match a high-dependency, localisable product to the state whose capability and pipeline fit, not the largest incumbent by default.'],
  sources: ['https://labs.techadyant.com/corridors']
}, {
  slug: 'india-eight-structural-gaps-dependency',
  no: 'S-030',
  title: 'Eight Structural Gaps Decide Whether India\'s Dependency Actually Falls',
  domain: 'Critical Manufacturing Dependencies',
  date: '2026-07-31',
  dateLabel: '31 Jul 2026',
  status: 'live',
  excerpt: 'Below the product-level dependencies sit eight economy-wide gaps — manufacturing R&D at 0.3% of GDP versus Germany\'s 2.8%, a 500,000-worker skills shortfall, thin test-and-certification capacity, costlier project finance and absence from RCEP and CPTPP — that constrain every localisation attempt, with a ₹1.14 lakh crore fix identified.',
  readingTime: '5 min',
  body: [{
  text: 'Product-level dependency is downstream of a few structural conditions. Eight recur across sectors: an ecosystem gap (incentives target products, not the layers beneath), a talent gap (a shortage of roughly 500,000 skilled manufacturing workers), an R&D gap (manufacturing R&D at 0.3% of manufacturing GDP against Germany\'s 2.8% and Korea\'s 3.5%), a test-and-certification gap (6-12 month delays, certification done abroad), a capital gap (project finance 200-300 basis points costlier than China or Vietnam), an FTA gap (outside RCEP and CPTPP, EU and UK deals unsigned), a cluster-coordination gap, and an industrial-AI gap.',
  type: 'p'
}, {
  text: 'Why these bind',
  type: 'h'
}, {
  text: 'Each gap raises the cost or lowers the feasibility of localising anything. Cheap foreign finance and mature ecosystems are why the same plant pencils out abroad and not in India; weak test-cert adds months and dollars to every qualification; missing FTAs hand a tariff disadvantage to Vietnam and Mexico. These are horizontal constraints — fixing them lifts every dependency at once, which no single product incentive can.',
  type: 'p'
}, {
  text: 'The fix has a price tag',
  type: 'h'
}, {
  text: 'The identified incremental budget to close the gaps is about ₹1,14,500 crore over FY2026-30 — a large but bounded number, and small against the recurring import bill it is meant to reduce. The point is that dependency reduction is as much about these enabling conditions as about any marquee factory.',
  type: 'p'
}, {
  text: 'What the signal means',
  type: 'h'
}, {
  text: 'Track the horizontal reforms — an R&D uplift, a manufacturing-skills programme, national test-cert infrastructure, the UK and EU FTAs — as leading indicators. Movement there will do more for dependency across the board than another product-specific scheme.',
  type: 'p'
}],
  takeaways: ['Eight economy-wide gaps constrain every localisation attempt: ecosystem, talent (~500K shortfall), R&D (0.3% vs Germany 2.8%/Korea 3.5%), test-cert, capital, FTAs, clusters, industrial AI.', 'They are horizontal — costlier finance, weak test-cert and missing FTAs raise the cost or lower the feasibility of localising anything, so fixing them lifts all dependencies at once.', 'The identified fix is ~₹1.14 lakh crore over FY2026-30 — large but bounded, and small against the recurring import bill it targets.', 'The horizontal reforms (R&D uplift, skills, national test-cert, UK/EU FTAs) are the leading indicators to watch — they move dependency more than any single product scheme.'],
  sources: ['https://www.pib.gov.in', 'https://labs.techadyant.com/research/dependencies']
}, {
  slug: 'india-twelve-opportunity-zones-industrial-capital',
  no: 'S-031',
  title: 'Twelve Zones Where India\'s Industrial Capital Should Concentrate',
  domain: 'Critical Manufacturing Dependencies',
  date: '2026-07-31',
  dateLabel: '31 Jul 2026',
  status: 'live',
  excerpt: 'Rather than spreading effort across hundreds of imports, the dependency framework narrows the field to twelve opportunity zones and a top-ten of opportunity surfaces — the intersection of deep-enough dependency, real localisation potential and workable economics — where concentrated capital and policy would move the dependency index most.',
  readingTime: '4 min',
  body: [{
  text: 'A dependency map with hundreds of entries is a risk list, not a strategy. The framework\'s final move is to concentrate: it filters the full import surface down to twelve opportunity zones and a ranked top-ten of opportunity surfaces, selected where dependency is deep enough to matter, localisation is genuinely feasible, and the investment economics work.',
  type: 'p'
}, {
  text: 'Concentration over breadth',
  type: 'h'
}, {
  text: 'The logic mirrors how industrial policy actually succeeds — a handful of well-capitalised, well-sited bets rather than thin support spread everywhere. Concentrating capital, talent and policy on twelve zones creates the ecosystem density (suppliers, skills, test infrastructure) that no scattered approach reaches, and it is that density, not the individual plant, that durably reduces dependence.',
  type: 'p'
}, {
  text: 'An investment envelope, not a wish list',
  type: 'h'
}, {
  text: 'Because each surface carries localisation and investment-attractiveness scores, the twelve zones come with an order-of-magnitude investment envelope and a sequencing logic — which to start now (Build-now surfaces like power electronics and specialty materials) and which to position early. That turns a national dependency problem into a finite, fundable programme.',
  type: 'p'
}, {
  text: 'What the signal means',
  type: 'h'
}, {
  text: 'For anyone allocating industrial capital — private investors, DFIs or the state — the twelve zones are the shortlist worth underwriting first. The value of the exercise is subtraction: it says as clearly what to deprioritise as what to fund.',
  type: 'p'
}],
  takeaways: ['The framework narrows hundreds of imports to twelve opportunity zones and a top-ten of surfaces — the intersection of deep-enough dependency, feasible localisation and workable economics.', 'Concentration beats breadth: a few well-capitalised, well-sited bets build the ecosystem density (suppliers, skills, test infra) that durably reduces dependence.', 'Because each surface is scored, the zones carry an investment envelope and sequencing — Build-now surfaces (power electronics, specialty materials) first, others positioned early.', 'The exercise is as valuable for what it says to deprioritise as for what to fund — turning a national dependency problem into a finite, fundable programme.'],
  sources: ['https://labs.techadyant.com/research/dependencies']
}, {
  slug: 'india-critical-manufacturing-dependency-report-edition-1',
  no: 'S-032',
  title: 'Techadyant Publishes Edition I of India\'s Critical Manufacturing Dependencies',
  domain: 'Critical Manufacturing Dependencies',
  date: '2026-07-31',
  dateLabel: '31 Jul 2026',
  status: 'live',
  excerpt: 'Techadyant Labs has released Edition I of India\'s Critical Manufacturing Dependencies — a framework-led report scoring the top strategic imports on ten proprietary indices, mapping opportunity surfaces, PLI performance, state capability and the policy gaps, and seeding a recurring national dependency monitor.',
  readingTime: '3 min',
  body: [{
  text: 'Edition I of India\'s Critical Manufacturing Dependencies brings the pieces together: a five-stage analytical pipeline, a five-level product taxonomy across twelve mega-sectors, and ten proprietary indices led by the Critical Manufacturing Dependency Index. It scores the top strategic imports, maps the localisation and investment opportunity, benchmarks PLI performance and state capability, and sets out the structural gaps and a phased policy roadmap.',
  type: 'p'
}, {
  text: 'A program, not a one-off',
  type: 'h'
}, {
  text: 'The report is designed as the foundation of an ongoing effort rather than a single publication — a repeatable method for reading where India remains strategically import-dependent, how that is changing, and where the next industrial opportunities are emerging. The index it introduces can be re-scored as the data moves, which is what makes a recurring dependency monitor possible.',
  type: 'p'
}, {
  text: 'What the signal means',
  type: 'h'
}, {
  text: 'For readers it consolidates a scattered debate into one framework and one set of comparable scores. Its companion signals break out the specific findings — the deepest chokepoints, the Build-now surfaces, the PLI component gap, the state map and the structural constraints — each as a discrete piece of dependency intelligence.',
  type: 'p'
}],
  takeaways: ['Edition I introduces a five-stage pipeline, a five-level taxonomy across twelve mega-sectors and ten proprietary indices led by the CMDI, scoring India\'s top strategic imports.', 'It maps localisation and investment opportunity, benchmarks PLI performance and state capability, and sets out the structural gaps with a phased roadmap.', 'It is built as the foundation of a recurring national dependency monitor, not a one-off report — the index can be re-scored as the data moves.', 'Companion signals break out the specific findings as discrete dependency intelligence: chokepoints, Build-now surfaces, the PLI component gap, the state map and the structural gaps.'],
  sources: ['https://labs.techadyant.com/research/dependencies']
}, {
  slug: 'india-glass-substrate-frontier-entry',
  no: 'S-033',
  title: 'India\'s Deepest Chip Gap Is Being Filled at the Frontier — on Foreign Balance Sheets',
  domain: 'Semiconductor Ecosystems',
  date: '2026-08-03',
  dateLabel: '3 Aug 2026',
  status: 'live',
  excerpt: 'IC substrates are one of the few layers where India has no producer at all and three firms hold ~70% of the world market. The first plant to address it — Intel and 3DGS, US$3.3bn in Odisha — is building glass-core substrates, a technology nobody has in volume production anywhere. India is entering this layer at the frontier rather than a generation behind. It is also entering it as a host, not an owner.',
  readingTime: '6 min',
  body: [{
  text: 'India now has twelve approved semiconductor manufacturing units carrying more than Rs 1.64 lakh crore of cumulative investment, and Semicon 2.0 has formally extended incentives to the machines, materials and chemicals beneath the fab. The obvious question is who answers that call. The first substantive answer is unusual enough to be worth reading carefully.',
  type: 'p'
}, {
  text: 'The gap being filled',
  type: 'h'
}, {
  text: 'IC substrates — the engineered interposer that carries a die and connects it to the board — are among the hardest layers in the stack to enter. Three firms, Shinko, IBIDEN and Unimicron, hold roughly 70% of the world market. India has no producer at any scale. In our dependency mapping it sits in the same tier as photoresist and CMP slurry: not merely imported, but imported from a market structure with no alternative supplier to switch to.',
  type: 'p'
}, {
  text: 'In May 2026 the government announced that Intel and 3D Glass Solutions will invest about US$3.3 billion in a substrate plant in the Bhubaneswar-Khurda region of Odisha, built over five to six years. The stated output is roughly 70,000 glass substrates a year alongside some 50 million assembled units and close to 13,000 advanced 3D heterogeneous-integration modules. Ground was broken in April.',
  type: 'p'
}, {
  text: 'Why the technology choice is the real story',
  type: 'h'
}, {
  text: 'India has usually entered semiconductor layers late — mature nodes, commodity assembly, a generation or more behind the frontier. This is different. Glass-core substrates are pre-commercial almost everywhere. Intel\'\'s own first volume glass site is expected to be in New Mexico, with production so far confined to a pilot line. SKC\'\'s subsidiary Absolics is racing to be the first commercial producer by the end of 2026; Samsung Electro-Mechanics is running a pilot with mass production targeted after 2027; TSMC\'\'s panel-level packaging roadmap points to 2028.',
  type: 'p'
}, {
  text: 'So the Odisha plant is not a hand-me-down. It places India inside a technology race that is still being run, in a layer that advanced packaging is making more valuable each year as performance gains migrate from the transistor to the interconnect. That is a materially better position than being handed a depreciated line.',
  type: 'p'
}, {
  text: 'The part that should temper the enthusiasm',
  type: 'h'
}, {
  text: 'The capability is arriving, but the ownership is not Indian. This is a US firm and a US technology partner siting capacity in India — welcome, and consistent with what an incentive scheme is designed to produce, but it does not by itself create an Indian substrate industry. The distinction matters because it is the same distinction that runs through our work on assembly versus ecosystem: hosting a capability and owning one produce very different second-order effects. A hosted plant creates jobs, supplier demand and process knowledge. An owned capability creates pricing power and the option to serve other customers.',
  type: 'p'
}, {
  text: 'The same pattern is visible one layer over. Fujifilm signed an MoU with Gujarat in July 2026 to explore a chip-materials base at Dholera, aimed at the photoresist and process-chemicals gap. Two of the deepest chokepoints in India\'\'s chip stack are being addressed at once — and in both cases the entrant is the incumbent, relocating capacity, rather than an Indian firm entering.',
  type: 'p'
}, {
  text: 'What to watch',
  type: 'h'
}, {
  type: 'list',
  items: ['Whether the Odisha plant\'\'s Indian supplier base develops around it — glass handling, cleanroom services, metrology, chemicals — or whether inputs and engineers are imported for the full five-to-six-year build.', 'Whether any Indian firm or research group enters substrate development, through Semicon 2.0\'\'s second pillar or otherwise. Today there is none; the gap analysis that claims one should be treated sceptically.', 'Whether glass-core substrates reach volume anywhere. If the technology slips, a plant sited on it slips with it — frontier entry carries frontier risk.', 'Whether the Fujifilm MoU converts into a notified investment or stays an intention. MoUs and financial closes are different verbs.', 'Whether advanced packaging in India deepens toward substrate and interposer work, or stays at wire-bond and commodity assembly.']
}, {
  text: 'The strategic read',
  type: 'h'
}, {
  text: 'For a decade the honest description of India\'\'s semiconductor position was that it participated in the layers where value had already been commoditised. Two announcements in ten weeks put India inside two layers where value is still concentrated and, in the substrate case, still being created. That is a genuine change in kind, not degree. The unresolved question is whether India ends the decade as the place where these layers are made, or as the place that owns them — and nothing in the current announcements settles it either way.',
  type: 'p'
}, {
  text: 'Go deeper',
  type: 'h'
}, {
  text: 'The full dependency picture across the semiconductor stack is mapped in the [Atlas dependency view](/research/dependencies). [The Semicon 2.0 Opportunity Map](/reports/semicon-2-0-opportunity-map/) sizes and ranks the upstream streams beyond the fab.',
  type: 'p'
}],
  takeaways: ['IC substrates are one of India\'s deepest chip-stack gaps — no domestic producer, and roughly 70% of the world market held by Shinko, IBIDEN and Unimicron.', 'Intel and 3D Glass Solutions are investing about US$3.3bn in Bhubaneswar-Khurda, Odisha over five to six years — roughly 70,000 glass substrates a year plus assembled units and 3D heterogeneous-integration modules.', 'Glass-core substrates are pre-commercial worldwide (Absolics targeting end-2026, Samsung post-2027, TSMC panel-level ~2028), so India is entering this layer at the frontier rather than a generation behind.', 'Both first movers into India\'s deepest chokepoints — Intel/3DGS in substrates, Fujifilm in process chemicals — are foreign incumbents relocating capacity, not Indian firms entering. Hosting a capability and owning one are different things.'],
  sources: ['https://www.reuters.com/world/india/intel-3dgs-set-up-33-billion-substrate-plant-indias-odisha-state-2026-05-29/', 'https://www.trendforce.com/news/2026/06/01/news-intel-advances-glass-substrate-push-with-3dgs-us3-3-billion-india-plant-set-for-five-to-six-year-buildout/', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2284784', 'https://evertiq.com/design/2026-07-01-fujifilm-partners-with-gujarat-to-boost-chip-materials-manufacturing']
}, {
  slug: 'india-indigenous-turbojet-engine',
  no: 'S-034',
  title: 'India Builds the Engine Its Loitering Munitions Were Missing',
  domain: 'Defence & Dual-Use',
  date: '2026-08-05',
  dateLabel: 'August 2026',
  status: 'live',
  excerpt: 'DRDO\'s first indigenous 350 kg thrust-class expendable turbojet closes a propulsion chokepoint that had capped the range and payload of India\'s cruise missiles and loitering munitions.',
  readingTime: '2 min read',
  body: [{
  text: 'DRDO\'s Gas Turbine Research Establishment (GTRE), with Hyderabad-based Azad Engineering as the production partner, has realised India\'s first indigenous expendable turbojet in the 350 kg thrust class. The fully built engine was delivered to GTRE on 22 July 2026.',
  type: 'p'
}, {
  text: 'The significance is not the engine; it is the dependency it removes. Small jet propulsion for expendable platforms — cruise missiles, loitering munitions, target drones — has been one of the layers India could not make, forcing imports or constraining the range and payload of otherwise indigenous systems. Only a handful of countries hold this capability.',
  type: 'p'
}, {
  text: 'This is the propulsion chokepoint from our loitering-munitions and drone work made concrete. An expendable engine must be cheap enough to throw away yet reliable enough to fly once — a harder commercial problem than a reusable one, and the reason a domestic production line matters more than a one-off prototype.',
  type: 'p'
}, {
  text: 'The opening now sits downstream of GTRE: the supplier base for turbine discs, blades, combustors and fuel systems that an expendable engine consumes in volume. A private manufacturer taking the build is the signal to watch — it points to a components ecosystem, not just a lab result.',
  type: 'p'
}],
  takeaways: ['India\'s first indigenous 350 kg thrust-class expendable turbojet was delivered to GTRE on 22 July 2026.', 'Designed by DRDO\'s GTRE and built by Azad Engineering (Hyderabad) — a DRDO-plus-private-industry model.', 'Targets cruise missiles, loitering munitions and UAVs, removing an import chokepoint on range and payload.', 'Value now migrates to the expendable-engine component base — discs, blades, combustors — built for volume.'],
  sources: ['Organiser (24 Jul 2026): https://organiser.org/2026/07/24/371428/bharat/drdo-develops-indias-first-indigenous-350-kg-thrust-class-expendable-turbojet-engine/', 'IndianWeb2 (Jul 2026): https://www.indianweb2.com/2026/07/india-unveils-first-indigenous-350kg.html', 'BIS Infotech: https://www.bisinfotech.com/drdo-advances-indigenous-aerospace-with-turbojet-engine/']
}, {
  slug: 'asip-osat-visakhapatnam',
  no: 'S-035',
  title: 'India\'s Chip Strategy Moves From Design Services to a Packaging Line',
  domain: 'Semiconductor Ecosystems',
  date: '2026-08-05',
  dateLabel: 'August 2026',
  status: 'live',
  excerpt: 'PM Modi laid the foundation for ASIP Technologies\' Rs 2,500 crore OSAT plant in Visakhapatnam — South India\'s first ISM-approved chip unit, and a step down the value chain from design into physical manufacturing.',
  readingTime: '2 min read',
  body: [{
  text: 'On 1 August 2026 the Prime Minister laid the foundation stone for ASIP Technologies\' Rs 2,500 crore (about US$260 million) OSAT — outsourced semiconductor assembly and test — facility at Tarluvada, Visakhapatnam. It is South India\'s first unit approved under the India Semiconductor Mission.',
  type: 'p'
}, {
  text: 'The plant will package and test chips — not fabricate them — starting with wire-bond and flip-chip BGA and adding 2.5D/3D advanced packaging within two to three years, at a planned 96 million chips a year, with South Korea\'s APACT as technology partner.',
  type: 'p'
}, {
  text: 'India\'s semiconductor strength has been design services — the front end. Assembly, test and packaging is the back end where physical value and jobs sit, and where India has depended almost entirely on overseas lines. A domestic OSAT node narrows that gap for AI, high-performance-computing and data-centre parts.',
  type: 'p'
}, {
  text: 'OSAT is the most localisable layer of the chip stack — a Build-now surface in our dependency work. The line pulls a supplier chain behind it: leadframes, organic substrates, bonding wire, moulding compound, high-purity gases and test equipment, most still imported. The packaging plant is the anchor; the materials tail is the opportunity.',
  type: 'p'
}],
  takeaways: ['ASIP Technologies broke ground on a Rs 2,500 cr (~$260M) OSAT plant at Visakhapatnam — South India\'s first ISM-approved unit.', 'Packaging + test (not a fab): wire-bond/FC-BGA now, 2.5D/3D within 2-3 years; ~96M chips/yr; APACT (Korea) as tech partner.', 'Moves India\'s chip play from design services into physical back-end manufacturing.', 'The real opening is the imported materials tail behind OSAT — substrates, bonding wire, moulding compound, gases.'],
  sources: ['Evertiq (4 Aug 2026): https://evertiq.com/news/2026-08-04-asip-breaks-ground-on-260-million-osat-facility-in-india', 'Business Standard (1 Aug 2026): https://www.business-standard.com/india-news/pm-modi-lays-foundation-stone-asip-semiconductor-plant-visakhapatnam-126080100662_1.html', 'The Hans India: https://www.thehansindia.com/news/cities/visakhapatnam/modi-lays-stone-for-souths-1st-ism-approved-chip-unit-in-ap-1104105']
}, {
  slug: 'india-uk-autonomous-systems-working-group',
  no: 'S-036',
  title: 'India and the UK Choose Co-Development Over Procurement',
  domain: 'Defence & Dual-Use',
  date: '2026-08-05',
  dateLabel: 'August 2026',
  status: 'live',
  excerpt: 'At Farnborough, India and the UK launched an industry-led working group on autonomous and uncrewed systems — a structural shift from buying platforms to building them together.',
  readingTime: '2 min read',
  body: [{
  text: 'India and the United Kingdom launched the India-UK Autonomous Platforms and Uncrewed Systems Working Group at the Farnborough International Air Show 2026. It is industry-led, sitting under the UK India Business Council-SIDM joint framework and the India-UK Defence Industrial Roadmap within the Vision 2035 partnership.',
  type: 'p'
}, {
  text: 'The intent is to convert strategic roadmaps into joint industrial outcomes across autonomous, uncrewed and underwater systems — co-development and joint R&D rather than a buyer-seller platform sale.',
  type: 'p'
}, {
  text: 'For India the value is structural. Autonomy, counter-drone and seabed-sensor networks are complex, capability-thin layers, and developing them in isolation is slow and risky. A co-development framework is a route to the technology base India\'s own strategy flags as missing — provided it transfers capability, not just badges a purchase.',
  type: 'p'
}, {
  text: 'The test is whether the working group produces Indian-owned IP and a domestic supplier base, or becomes an import channel with a partnership label. Watch the first joint programmes and their local-content and IP terms.',
  type: 'p'
}],
  takeaways: ['India and the UK launched an industry-led Autonomous Platforms & Uncrewed Systems Working Group at Farnborough 2026.', 'Sits under the India-UK Defence Industrial Roadmap / Vision 2035; focus on autonomous, uncrewed and underwater systems.', 'Signals co-development and joint R&D over transactional procurement.', 'The value depends on real technology transfer and Indian IP — not a rebadged import.'],
  sources: ['The Print (2026): https://theprint.in/world/new-india-uk-industry-initiative-to-boost-defence-tech-collaboration/2993802/', 'Indian Defence News (Aug 2026): https://www.indiandefensenews.in/2026/08/india-and-uk-launch-autonomous.html', 'Business Upturn: https://businessupturn.com/nation/india-uk-launch-joint-industry-working-group-on-autonomous-platforms-and-uncrewed-systems/']
}];

export function getSignal(slug: string): SignalMeta | undefined {
  return signals.find((s) => s.slug === slug);
}
