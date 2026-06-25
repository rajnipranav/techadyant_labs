export type AccessTier = 'free' | 'paid';

export interface ReportMeta {
  slug: string;
  title: string;
  subtitle: string;
  domain: string;
  edition: string;
  published: string;
  publishedLabel: string;
  readingTime: string;
  status: 'published' | 'forthcoming';
  summary: string;
  accent: string;
  access: AccessTier;
  price?: number;
  currency?: 'INR';
  hasPdf: boolean;
  hasDeck?: boolean;
  pages?: number;
  cover?: string;
  previewObject?: string;
  previewPages?: number;
  keywords?: string[];
  faq?: { q: string; a: string }[];
  sources?: string[];
  dateModified?: string;
}

export const syncedAt = new Date().toISOString();

export const reports: ReportMeta[] = [{
  slug: 'india-fab-ecosystem',
  title: 'Who Really Benefits from India’s Fab Ecosystem?',
  subtitle: 'The Hidden Industrial Transformation Behind India’s Semiconductor Mission',
  domain: 'Semiconductor Ecosystems',
  edition: 'Edition 01 · v1.0',
  published: '2026-05-20',
  publishedLabel: 'May 2026',
  readingTime: '24 min read',
  status: 'published',
  summary: 'India’s semiconductor push is usually told as a story about chips. It is better understood as a story about land, water, power, packaging and people — and about who captures the value when a state decides to manufacture its way up the technology stack.',
  accent: '#F5B544',
  access: 'paid',
  price: 4900,
  currency: 'INR',
  hasPdf: true,
  hasDeck: false,
  pages: 28,
  cover: '/covers/india-fab-ecosystem.jpg',
  previewObject: 'reports-free/Who-Really-Benefits-from-Indias-Fab-Ecosystem-Free-Edition.pdf',
  previewPages: 12,
  keywords: [],
  faq: [],
  sources: [],
  dateModified: '2026-05-20'
}, {
  slug: 'india-ai-industrial-transition-2026-2035',
  title: 'India’s AI Industrial Transition and Infrastructure Transformation',
  subtitle: 'A strategic-intelligence map of compute, semiconductors, power, water, regional corridors, and the second-order industrial reshaping of India',
  domain: 'AI Infrastructure',
  edition: 'Edition 01 · Baseline Architecture · v1.0',
  published: '2026-05-29',
  publishedLabel: 'May 2026',
  readingTime: '3h read',
  status: 'published',
  summary: 'A baseline architecture for India’s 2026–2035 AI industrial transition: ten anchor numbers, six theses, nine analytical frameworks, seven regional corridors, three scenarios, and eight failure-mode stress tests. The transition is treated as a re-layering of compute, semiconductors, power, water, fibre, real-estate and skilled labour — not as a workforce or careers story.',
  accent: '#6366F1',
  access: 'free',
  price: undefined,
  currency: 'INR',
  hasPdf: true,
  hasDeck: false,
  pages: undefined,
  cover: '/covers/india-ai-industrial-transition-2026-2035.jpg',
  previewObject: '',
  previewPages: undefined,
  keywords: [],
  faq: [],
  sources: [],
  dateModified: '2026-05-29'
}, {
  slug: 'india-battlefield-automation-gap',
  title: 'India’s Battlefield Automation Gap',
  subtitle: 'Industrial Readiness, Strategic Risks & Emerging Opportunities (2026–2035)',
  domain: 'Defence & Dual-Use',
  edition: 'Edition 01 · Strategic Intelligence · v1.0',
  published: '2026-05-30',
  publishedLabel: 'May 2026',
  readingTime: '~ 2h 30m read',
  status: 'published',
  summary: 'Battlefield automation is an industrial-capability race, not a procurement race. Using a proprietary Battlefield Automation Readiness Index (BARI), this report scores India against China and the United States across eight industrial layers — sensors, rugged electronics, batteries, tactical communications, autonomy software, testing and manufacturing — maps where the gap concentrates, reads it sector by sector, and identifies the startup, SME and policy opportunities that would close it. Published free, given its relevance to government-led initiatives.',
  accent: '#FB923C',
  access: 'free',
  price: undefined,
  currency: 'INR',
  hasPdf: true,
  hasDeck: false,
  pages: 130,
  cover: '/covers/india-battlefield-automation-gap.jpg',
  previewObject: '',
  previewPages: undefined,
  keywords: [],
  faq: [],
  sources: [],
  dateModified: '2026-05-30'
}, {
  slug: 'who-actually-captures-the-india-us-minerals-alliance',
  title: 'Who Actually Captures the India–US Minerals Alliance?',
  subtitle: 'Why Separation and Magnets — Not Mines — Decide India’s Place in the Hardware Century',
  domain: 'Critical Minerals & Strategic Materials',
  edition: 'Edition 01 · Strategic Intelligence · v1.0',
  published: '2026-05-30',
  publishedLabel: 'May 2026',
  readingTime: '~ 2h 30m read',
  status: 'published',
  summary: 'The 26 May 2026 India–US critical-minerals framework is read as a mining deal. It is better understood as a midstream deal: the leverage sits in separation, refining and magnets — roughly 85–92% controlled by China — not in reserves. Using a proprietary four-chokepoint framework, this report scores India sector by sector — semiconductors, electronics, defence, EVs, energy and AI infrastructure — and asks who actually captures the value as the alliance moves from signature to execution.',
  accent: '#C9A84C',
  access: 'paid',
  price: 4900,
  currency: 'INR',
  hasPdf: true,
  hasDeck: false,
  pages: 125,
  cover: '/covers/who-actually-captures-the-india-us-minerals-alliance.jpg',
  previewObject: 'reports-free/who-actually-captures-the-india-us-minerals-alliance-CONDENSED.pdf',
  previewPages: 14,
  keywords: [],
  faq: [],
  sources: [],
  dateModified: '2026-05-30'
}, {
  slug: 'the-sap-question',
  title: 'The SAP Question',
  subtitle: 'India’s Enterprise Technology Sovereignty Report 2026–2035 — Who Really Controls the Software India Runs On?',
  domain: 'Enterprise Software Sovereignty',
  edition: 'Strategic Risk Report · Edition 02 · 2026–2035 · v2.3',
  published: '2026-06-01',
  publishedLabel: 'June 2026',
  readingTime: '~ 3.5h read',
  status: 'published',
  summary: 'India built the world’s software workforce but imports the enterprise software its own economy runs on. More than 5,000 enterprises — the operational core of ONGC, IndianOil, NTPC, BHEL, SAIL, the PSU banks and the armed forces — run on foreign ERP. This report measures the dependency layer by layer with three proprietary frameworks (EDI, SSS, DIEM), maps where SAP runs India sector by sector, weighs it against Germany, China, South Korea and France, sets out the 2027 SAP deadline and the AI reset, and charts the sovereign-software opportunity to 2035. ~180 pages, 30+ figures, 21 data tables, eight appendices. Free.',
  accent: '#C9A84C',
  access: 'free',
  price: undefined,
  currency: 'INR',
  hasPdf: true,
  hasDeck: false,
  pages: 180,
  cover: '/covers/the-sap-question.jpg',
  previewObject: 'reports-free/the-sap-questions.pdf',
  previewPages: 180,
  keywords: ['SAP India', 'enterprise software sovereignty', 'India ERP dependency', 'foreign software dependence India', 'SAP ECC 2027 deadline', 'sovereign software India', 'Enterprise Dependency Index', 'India technology sovereignty', 'Zoho ERP', 'digital public infrastructure'],
  faq: [{
  a: 'A modelled ~59% of India’s software-operating formal-sector value-added depends, at the ERP, database and cloud layer, on software controlled by foreign-headquartered vendors. The dependency is deepest in public cloud and ERP.',
  q: 'How dependent is India on foreign enterprise software?'
}, {
  a: 'More than 5,000 Indian enterprises run SAP, including the operational core of ONGC, Indian Oil, NTPC, BHEL, SAIL, Bharat Electronics and the public-sector banks. The Indian Army runs one of the largest SAP ERP deployments in the Government of India.',
  q: 'Which Indian companies and institutions run on SAP?'
}, {
  a: 'SAP ECC mainstream support ends on 31 December 2027, forcing thousands of Indian enterprises to a migration decision — a moment that coincides with the AI reset and the emergence of credible Indian products.',
  q: 'What is the 2027 SAP deadline?'
}, {
  a: 'India has already built sovereign software at population scale through its digital public infrastructure (Aadhaar, UPI, MOSIP). The report sizes a ~USD 51 billion sovereign-software opportunity by 2035; the question is whether India extends that proven capability from its citizen rails to its enterprise core.',
  q: 'Can India build sovereign enterprise software?'
}],
  sources: [],
  dateModified: '2026-06-01'
}, {
  slug: 'the-opportunity-beyond-the-fab',
  title: 'The Opportunity Beyond the Fab',
  subtitle: 'Startup and MSME Opportunities Emerging from India’s Technology Sovereignty Economy (2026–2035)',
  domain: 'Technology Sovereignty Opportunity',
  edition: 'Strategic Opportunity · Technology Sovereignty Series · v1.0',
  published: '2026-06-03',
  publishedLabel: 'June 2026',
  readingTime: '~ 3h read',
  status: 'published',
  summary: 'India has committed roughly ₹1.6 lakh crore to semiconductor manufacturing — thirteen projects across seven states. The fab gets the headlines, but it is the visible peak of a ten-layer industrial pyramid, and the layers around it are where most of the capturable value sits and where India’s existing MSME and talent base can actually compete. This report identifies, scores and ranks 100 startup and MSME opportunities across the full technology-sovereignty stack — materials, precision components, industrial software, AI, engineering software, cybersecurity and export — using five proprietary frameworks (TOMI, TSVI, IRR, GEM, SOE). 144 pages, 43 figures, 100 one-page scorecards, 10 state dashboards, a master opportunity map. The opportunity is around the fab, not instead of it.',
  accent: '#2BC5B4',
  access: 'paid',
  price: 6999,
  currency: 'INR',
  hasPdf: true,
  hasDeck: false,
  pages: 144,
  cover: '/covers/the-opportunity-beyond-the-fab.jpg?v=2',
  previewObject: 'reports-free/Opportunity-Beyond-Fab-Executive-Brief.pdf',
  previewPages: 20,
  keywords: ['India semiconductor opportunity', 'startup opportunities India semiconductors', 'MSME semiconductor supply chain', 'OSAT India', 'advanced packaging India', 'RISC-V India', 'chip design services export', 'technology sovereignty India', 'India Semiconductor Mission opportunity', 'beyond the fab'],
  faq: [{
  a: 'Not the fab. The two highest-scoring opportunities of the 100 we rank are engineering-R&D services export and chip-design services export — capabilities India already has at world scale. The strongest opportunities are where India brings an existing industrial or talent asset, not the most capital-intensive ones.',
  q: 'What is the biggest opportunity in India’s semiconductor push?'
}, {
  a: 'One hundred, each scored on a single reproducible system of five proprietary indices — TOMI (headline), with TSVI, IRR and GEM as diagnostics and the SOE engine sorting them into Strategic Quick Wins, National Bets, Cash Engines and Watch.',
  q: 'How many opportunities does the report cover, and how are they scored?'
}, {
  a: 'Yes — that is the central finding. A front-end fab costs USD 5–15bn; an OSAT line USD 200–800m; a precision-component line a fraction of that. The report maps the lower-capital entry points across materials, software, AI, security and services, with one-page scorecards for all 100.',
  q: 'Can an MSME or startup enter the semiconductor economy without building a fab?'
}],
  sources: [],
  dateModified: '2026-06-03'
}, {
  slug: 'who-builds-indias-drones',
  title: 'Who Builds India’s Drones?',
  subtitle: 'India’s Drone Manufacturing Ecosystem — Strategic Dependencies, Supply-Chain Gaps, and the Opportunity Surfaces Beyond Assembly',
  domain: 'Defence & Dual-Use',
  edition: 'Strategic Opportunity · Edition 1 · v1.0',
  published: '2026-06-09',
  publishedLabel: 'June 2026',
  readingTime: '~ 2.5h read',
  status: 'published',
  summary: 'India has built a drone assembly industry, not a drone manufacturing one — and its own customs data prove it: in FY2025-26 India imported about US$8 million of finished drones but roughly US$767 million of drone and aircraft parts. The 2022 import ban relocated the dependency upstream rather than removing it, into the rare-earth magnets, lithium-ion cells and flight-controller silicon that are 78–90% Chinese. This report maps that dependency layer by layer, scores 100 opportunity surfaces and 50 components on six proprietary frameworks (DLI, DSCDM, DCS, DIRM, DCRI, DOSF), quantifies the value India leaves on the table (≈43% captured today, ≈66% achievable — a reshoring prize of ~US$1.1bn a year by 2030), and sets out a selective-sovereignty path to 2035. Thirteen chapters, sixteen figures, a 100-opportunity registry, a 50-component Drone Sovereignty Index and thirteen reference appendices.',
  accent: '#2BC5B4',
  access: 'paid',
  price: 6999,
  currency: 'INR',
  hasPdf: true,
  hasDeck: false,
  pages: 150,
  cover: '/covers/who-builds-indias-drones.jpg',
  previewObject: 'reports-free/Who-Builds-Indias-Drones-Free-Edition.pdf',
  previewPages: 6,
  keywords: ['who builds India’s drones', 'India drone manufacturing', 'India drone supply chain', 'drone component import dependence', 'rare-earth magnets drones India', 'lithium-ion cells drones', 'flight controller silicon India', 'counter-UAS India', 'drone localization India', 'Make in India drones', 'drone opportunity India', 'selective sovereignty drones'],
  faq: [{
  a: 'Largely no — India assembles drones rather than manufacturing them. In FY2025-26 India imported only about US$8 million of finished drones but roughly US$767 million of drone and aircraft parts, about a hundred times more. The platforms are integrated in India; the components that decide what they can do are imported.',
  q: 'Does India manufacture its own drones?'
}, {
  a: 'The 2022 ban prohibited finished foreign drones but left components free to import. It created a protected market for assembly without building the component base beneath it, so the dependency moved upstream — from the finished drone to the magnets, cells and chips inside it — rather than disappearing.',
  q: 'Why did India’s 2022 drone import ban not build a domestic supply chain?'
}, {
  a: 'The critical ones. China supplies about 78% of India’s rare-earth permanent-magnet imports, about 84% of its lithium-ion cell imports, and the bulk of small-drone flight controllers and motors. China’s 2025 rare-earth export controls showed this dependency can be used as leverage.',
  q: 'Which drone components does India import from China?'
}, {
  a: 'By a value-weighted model of component localisation, India captures roughly 43% of its drone market’s value today and could reach about two-thirds if the upstream gaps were closed — a reshoring prize of roughly US$1.1 billion a year by 2030, concentrated in propulsion, sensors, electronics and power.',
  q: 'How much economic value does India capture from its drone industry?'
}, {
  a: 'On the report’s Drone Opportunity Surface Framework, four surfaces clear the Build-now bar: autonomy and mission software, counter-unmanned-systems, battery packs and management systems, and test-and-certification infrastructure — each combining real strategic value with capability India already has.',
  q: 'What are the best drone-economy opportunities in India?'
}],
  sources: [],
  dateModified: '2026-06-09'
}, {
  slug: 'indias-drone-battery-ecosystem',
  title: 'India’s Drone Battery Ecosystem',
  subtitle: 'Flight Risk — Securing India’s Drone Battery Ecosystem from Strategic Dependencies to an Industrial Opportunity',
  domain: 'Defence & Dual-Use',
  edition: 'Strategic Opportunity · Edition 1 · v1.0',
  published: '2026-06-11',
  publishedLabel: 'June 2026',
  readingTime: '~ 2.5h read',
  status: 'published',
  summary: 'India is building a world-class drone industry on an imported energy core. Of every ₹100 of value an Indian drone OEM earns, more than ₹50 leaves the country for a concentrated, overwhelmingly Chinese, battery supply chain; India scores just 30/100 on the Drone Battery Sovereignty Index. The report maps the dependency layer by layer, quantifies the ~US$10.8bn opportunity by 2030, and shows why the fastest route to value is the intelligent layer — BMS, analytics, certification and recycling — where capture jumps from ~5% to 35–40% without first solving cell manufacturing. Two proprietary frameworks (the DBSI and the five-level Readiness Model), thirty-plus figures, a ten-chart CXO dashboard, four 2035 scenarios, six appendices and a companion Excel data pack.',
  accent: '#2BC5B4',
  access: 'paid',
  price: 6999,
  currency: 'INR',
  hasPdf: true,
  hasDeck: false,
  pages: 145,
  cover: '/covers/indias-drone-battery-ecosystem.jpg',
  previewObject: 'reports-free/India-Drone-Battery-Ecosystem-Free-Edition.pdf',
  previewPages: 14,
  keywords: ['India drone batteries', 'drone battery supply chain', 'China battery dependency', 'high-C cells drones', 'BMS India', 'battery sovereignty India', 'lithium-ion imports India', 'sodium-ion drones', 'battery recycling India', 'drone certification India', 'Drone Battery Sovereignty Index', 'India drone battery market'],
  faq: [{
  a: 'China controls roughly 78–84% of the lithium-ion cells and permanent magnets India’s drone fleet depends on, by customs value. There is no domestic aviation-grade high-C cell manufacturer and almost no buffer stock, so a single export halt could idle commercial and defence drone lines within weeks.',
  q: 'How dependent is India on China for drone batteries?'
}, {
  a: 'Techadyant Labs estimates the India-addressable drone-battery market at about US$10.8 billion by 2030, across defence, agriculture, logistics and mapping.',
  q: 'How big is India’s drone battery market?'
}, {
  a: 'About 40%. The cell is roughly 60% of pack cost and ~100% imported, but the enclosure, thermal management, BMS firmware, analytics, integration and certification — the other ~40% — are capturable in India today, and carry the highest margins.',
  q: 'How much of a drone battery’s value can India capture?'
}, {
  a: 'A 0–100 index scoring a country across the six battery value-chain layers. India scores 30 — last among major battery nations — but leads at the pack and software layers where margin concentrates.',
  q: 'What is the Drone Battery Sovereignty Index?'
}, {
  a: 'Capture the intelligent layer now — smart BMS, analytics, certification and recycling — which lifts value capture from ~5% to 35–40% without first solving cell manufacturing. Cell and material sovereignty are a parallel, longer-horizon national programme.',
  q: 'What should India do first to build battery sovereignty?'
}],
  sources: [],
  dateModified: '2026-06-11'
}, {
  slug: 'india-drone-propulsion-opportunity',
  title: 'India’s Drone Propulsion Opportunity',
  subtitle: 'How Domestic Manufacturing, Defence Demand and Policy Tailwinds Are Building a $1 Billion Market for Motors, ESCs and Jet Propulsion by 2036',
  domain: 'Defence & Dual-Use',
  edition: 'Strategic Opportunity · Edition 1 · v1.0',
  published: '2026-06-14',
  publishedLabel: 'June 2026',
  readingTime: '~ 2h read',
  status: 'published',
  summary: 'India has localised drone assembly faster than almost any advanced-manufacturing sector — drone-component imports fell from over 80% in 2020 to below 40% by 2025 — but the dependency moved upstream rather than disappearing. This report puts the propulsion stack (motors, ESCs, propellers and the emerging jet/hybrid segment) under the lens: a US$95M market in 2025 growing to US$350M by 2030 at a 29.8% CAGR, where motors and ESCs are now assembled in India while the rare-earth magnets and ESC microcontrollers inside them remain 80–100% imported. It maps the supply chain layer by layer, scores margins and the competitive landscape, models defence demand (15,650+ propulsion units to 2030) and landed costs, and runs a ten-year forecast with three scenarios. Fifteen chapters, 45+ figures and tables, and a companion Excel data pack with a 50+ supplier directory and technical-specifications database.',
  accent: '#2BC5B4',
  access: 'paid',
  price: 4999,
  currency: 'INR',
  hasPdf: true,
  hasDeck: false,
  pages: 196,
  cover: '/covers/india-drone-propulsion-opportunity.jpg',
  previewObject: 'reports-free/Indias-Drone-Propulsion-Opportunity-Free-Edition.pdf',
  previewPages: 14,
  keywords: ['India drone propulsion', 'drone motor manufacturing India', 'BLDC drone motors India', 'drone ESC India', 'electronic speed controller India', 'drone propulsion market India', 'rare-earth magnet drones India', 'REPM scheme', 'drone propeller manufacturing', 'micro turbojet India', 'drone propulsion supply chain', 'Make in India drones', 'defence drone procurement India', 'drone propulsion investment'],
  faq: [{
  a: 'About US$95 million in 2025, modelled to reach roughly US$350 million by 2030 (a 29.8% CAGR) and US$600 million–1.3 billion by 2036 depending on scenario. Motors are the largest segment, ESCs hold the highest margins, and the jet/hybrid segment is the fastest-growing.',
  q: 'How big is India’s drone propulsion market?'
}, {
  a: 'It assembles them. Motor and ESC assembly have genuinely localised — Reflex Drive, Vector Technics and Zepco hold a combined ~65% domestic share — but the rare-earth magnets inside motors are roughly 80% Chinese and the microcontrollers and power MOSFETs inside ESCs are effectively 100% imported.',
  q: 'Does India manufacture its own drone motors and ESCs?'
}, {
  a: 'No longer. After customs duty, GST, freight and financing, Chinese motors, ESCs and propellers now land in India 5–10% more expensively than comparable domestic parts — a structural price inversion that saves OEMs roughly US$50–100 per propulsion set.',
  q: 'Are Chinese drone components still cheaper than Indian ones?'
}, {
  a: 'Every Indian ESC relies on imported microcontrollers (predominantly STMicroelectronics and Texas Instruments) and power MOSFETs. A global shortage or export restriction would halt domestic drone production within weeks, and a commercial domestic alternative is three to five years away.',
  q: 'What is the ESC semiconductor bottleneck in India’s drone industry?'
}, {
  a: 'The highest-risk, highest-return surface is fabless ESC semiconductor design; the moderate play is motor-assembly scaling for export; the lowest-risk is composite (CFRP) propeller manufacturing. Defence is the demand engine, with over 15,650 propulsion units projected for induction between 2025 and 2030.',
  q: 'Where are the best drone-propulsion opportunities in India?'
}],
  sources: [],
  dateModified: '2026-06-14'
}, {
  slug: 'osat-and-the-packaging-frontier',
  title: 'The Packaging Frontier',
  subtitle: 'Why Assembly, Test and Advanced Packaging May Matter More Than Fabs',
  domain: 'Semiconductor Ecosystems',
  edition: 'Edition 02 · forthcoming',
  published: '2026-06-15',
  publishedLabel: 'Forthcoming',
  readingTime: '18 min read',
  status: 'forthcoming',
  summary: 'Back-end assembly, test and advanced packaging is where a large share of near-term semiconductor employment and value addition will accrue in India. A structural look at the OSAT layer.',
  accent: '#38e1c4',
  access: 'paid',
  price: 4900,
  currency: 'INR',
  hasPdf: false,
  hasDeck: false,
  pages: undefined,
  cover: '',
  previewObject: '',
  previewPages: undefined,
  keywords: [],
  faq: [],
  sources: ['https://www.meity.gov.in/content/semiconductor', 'https://www.indiaincorner.com/ism/', 'https://pib.gov.in/PressReleasePage.aspx?PRID=2134567'],
  dateModified: '2026-06-15'
}, {
  slug: 'the-end-of-the-application-era',
  title: 'Who Captures Computing When the Application Disappears?',
  subtitle: 'The End of the Application Era — How Agentic AI Forces the First Operating-System Redesign Since the Cloud, and Where India Can Capture the Next Layer',
  domain: 'AI Infrastructure',
  edition: 'Strategic Foresight · Technology Sovereignty Series · v1.0',
  published: '2026-06-16',
  publishedLabel: 'June 2026',
  readingTime: '~ 2.5h read',
  status: 'published',
  summary: 'Every fifteen-to-twenty years the operating system is redesigned, and agentic AI is the trigger for the next one. As work shifts from applications a human opens to goals an agent pursues, the three foundations of the modern OS — CPU-centric scheduling, human-login security and application-siloed state — break at once. This report argues that value migrates down from the application layer into four control primitives — accelerated inference, identity, memory and scheduling (AIMS) — and scores who is positioned to own them on a proprietary Agent-Native Capture Index (ANCI): in 2026 there is no Primitive Owner, and the leaders win on breadth, not depth. It maps the Post-Application Stack layer by layer, traces the hardware chokepoints (advanced packaging, HBM, export policy), and sets out where India — strong in public digital infrastructure and sovereign compute, dependent on the AIMS primitives — can capture the next layer rather than the last one. Eight parts, twenty-six chapters, eighteen figures and the PAS / AIMS / ANCI framework family. Free, and readable in full on this page.',
  accent: '#818CF8',
  access: 'free',
  price: undefined,
  currency: 'INR',
  hasPdf: true,
  hasDeck: false,
  pages: 151,
  cover: '/covers/the-end-of-the-application-era.jpg',
  previewObject: 'reports-free/The-End-of-the-Application-Era.pdf',
  previewPages: 151,
  keywords: ['end of the application era', 'agentic AI operating system', 'post-application stack', 'AIMS framework', 'agent-native capture index', 'future of computing', 'AI operating system', 'agent infrastructure', 'India AI sovereignty', 'sovereign compute India', 'advanced packaging chokepoint', 'operating system redesign AI'],
  faq: [{
  a: 'It means the application — the unit we install, trust and open — is becoming friction as work shifts to AI agents that pursue goals across many tools at once. Operating-system dominance has shifted roughly every one to two decades, always when the dominant workload rebalances rather than when features grow; agentic AI is that rebalancing, and it breaks CPU-centric scheduling, human-login security and application-siloed state simultaneously.',
  q: 'What does “the end of the application era” mean?'
}, {
  a: 'Four control primitives the report groups as AIMS — Accelerated inference, Identity, Memory and Scheduling. Value migrates down from the application layer into these primitives, which become the real operating system of the agent era. The report formalises them in an eight-layer Post-Application Stack (PAS).',
  q: 'What replaces the application as the unit of computing?'
}, {
  a: 'ANCI is the report’s 0–100 framework scoring who controls the AIMS primitives. Its headline finding for 2026 is that there is no Primitive Owner: today’s leaders win on breadth across the stack, not depth in any single primitive — which is precisely why the layer is still contestable.',
  q: 'What is the Agent-Native Capture Index (ANCI)?'
}, {
  a: 'It inverts it. Existing models secure human logins, but machine workloads are now using those logins. The report argues trust will move to capability tokens and delegation policy — securing what an agent is permitted to do, for whom, and for how long — rather than who is signed in.',
  q: 'How does agentic AI change operating-system security?'
}, {
  a: 'India is AIMS-dependent but sovereignty-strong: its public digital infrastructure (Aadhaar, UPI, MOSIP) and expanding sovereign compute give it a credible, time-limited advantage. The leapfrog runs through agent-aware design of that public infrastructure and through the identity and consent layer — not through trying to out-build hyperscalers on raw compute.',
  q: 'Where can India capture value in the post-application era?'
}],
  sources: [],
  dateModified: '2026-06-16'
}, {
  slug: 'india-drone-sensors-payloads-imaging-market',
  title: 'India Drone Sensors, Payloads & Imaging Systems Market',
  subtitle: 'Market Size, Segmentation, Supply-Chain Dependence and 2026–2035 Forecast for the Sensing Layer Inside India’s Drones',
  domain: 'Defence & Dual-Use',
  edition: 'Strategic Opportunity · Edition 1 · v1.0',
  published: '2026-06-16',
  publishedLabel: 'June 2026',
  readingTime: '~ 2h read',
  status: 'published',
  summary: 'A drone is only as capable as what it can sense, and India imports most of that capability. The market for drone sensors, payloads and imaging systems is valued at roughly US$190–210 million in 2026 and modelled to reach US$1.1–1.5 billion by 2035 at a 22–26% CAGR — but 70–80% of high-grade sensor demand is met by imports: LiDAR is about 85% imported, thermal about 80%, and inertial measurement units about 70%, sourced mainly from China, Taiwan and the United States. This report sizes the market segment by segment (sensor type, end-use sector, UAV class, component tier and region), maps the import-dependence and localisation roadmap, profiles the competitive landscape — ideaForge, Eon Space Labs, Garuda Aerospace, BEL and the international suppliers — and runs a ten-year forecast across three scenarios. It tracks the structural shifts now reshaping value capture: the move from discrete sensors to integrated, pre-calibrated payloads, the rise of Drone-as-a-Service and data monetisation over hardware, and indigenous breakthroughs such as Eon Space Labs’ germanium-free thermal imaging that cuts system cost 60–70%. Thirteen chapters, 50 figures, 137 tables, and a full segmentation and forecast model.',
  accent: '#2BC5B4',
  access: 'paid',
  price: 6999,
  currency: 'INR',
  hasPdf: true,
  hasDeck: false,
  pages: 143,
  cover: '/covers/india-drone-sensors-payloads-imaging-market.jpg',
  previewObject: 'reports-free/India-Drone-Sensors-Payloads-Imaging-Free-Edition.pdf',
  previewPages: 6,
  keywords: ['India drone sensors', 'drone payloads India', 'drone imaging systems India', 'LiDAR drones India', 'thermal imaging drones India', 'germanium-free thermal imaging', 'drone sensor market India', 'drone payload integration', 'Eon Space Labs', 'drone sensor import dependence', 'drone-as-a-service India', 'multispectral drone sensors'],
  faq: [{
  a: 'About US$190–210 million in 2026, modelled to reach US$1.1–1.5 billion by 2035 — a 22–26% CAGR. LiDAR is the fastest-growing category at over 35% CAGR, driven by infrastructure inspection, mining volumetrics and corridor mapping.',
  q: 'How big is India’s drone sensors and payloads market?'
}, {
  a: 'Heavily. Roughly 70–80% of high-grade drone-sensor demand is imported — about 85% of LiDAR, 80% of thermal cores and 70% of inertial measurement units — sourced mainly from China, Taiwan and the United States. The localisation gap, not the platform, is where the strategic exposure sits.',
  q: 'How dependent is India on imported drone sensors?'
}, {
  a: 'It is an indigenous thermal-imaging approach pioneered by Eon Space Labs that avoids germanium optics, whose 2024 supply crisis brought seven-month lead times and ten-fold cost spikes. The germanium-free architecture lowers system cost by 60–70% and reaches roughly 80% local manufacturing, proving import dependence can be engineered around rather than simply replicated.',
  q: 'What is germanium-free thermal imaging and why does it matter?'
}, {
  a: 'Drone-as-a-Service. Value is shifting from selling hardware to monetising the data the sensors capture, with DaaS margins of 50–65% against hardware margins of 25–35%. Buyers increasingly want actionable intelligence — orthomosaics, point clouds, NDVI layers — not raw sensors.',
  q: 'Which business model is winning in India’s drone-sensing market?'
}, {
  a: 'ideaForge leads on certification and integrated payload ecosystems; Eon Space Labs holds proprietary germanium-free thermal with about 80% localisation; Garuda Aerospace runs the largest agricultural DaaS fleet; and BEL brings defence-PSU radar capability. International suppliers still hold the high-spec LiDAR and thermal cores.',
  q: 'Who are the leading players in India’s drone sensor and payload market?'
}],
  sources: [],
  dateModified: '2026-06-16'
}, {
  slug: 'drone-electronics-flight-controllers',
  title: 'Who Controls India’s Drones?',
  subtitle: 'Flight Controllers, AI Autonomy, and India’s Strategic Dependency in the Drone Control Stack',
  domain: 'Defence & Dual-Use',
  edition: 'Strategic Opportunity · Edition 1 · v1.0',
  published: '2026-06-21',
  publishedLabel: 'June 2026',
  readingTime: '~ 2h read',
  status: 'published',
  summary: 'India assembles drones it cannot fully control. Official data placed before the Lok Sabha in April 2025 record 39% of flight controllers in DGCA-certified small drones as Chinese-sourced; across the whole fleet the effective figure is 70–80%, and the processors and MEMS inertial sensors at the base of the stack are roughly 100% imported. This report maps that control-stack dependency layer by layer and scores it on four proprietary frameworks — the Drone Autonomy Value Chain, the Strategic Vulnerability Index, the Import Vulnerability Matrix and a five-level Autonomy Maturity Model. It sizes the domestic substitution opportunity the new INR 2,000 crore PLI scheme unlocks (USD 500 million+ a year in addressable value), names the winners and losers across four policy levers (PLI, the Army 515 model, BVLOS and procurement preference), and sets out five costed recommendations and a selective-sovereignty path to 2035. Seventeen chapters, thirty-five figures, the Strategic Vulnerability Index and the Drone Autonomy Opportunity Map.',
  accent: '#2BC5B4',
  access: 'paid',
  price: 6999,
  currency: 'INR',
  hasPdf: true,
  hasDeck: false,
  pages: 130,
  cover: '/covers/Drone-Electronics-Flight-Controllers.jpg',
  previewObject: 'reports-free/Who-Controls-Indias-Drones-Free-Edition.pdf',
  previewPages: 14,
  keywords: ['who controls India’s drones', 'India flight controller', 'drone autonomy India', 'flight controller import dependence China', 'GPS-denied navigation', 'electronic warfare drones India', 'drone PLI scheme 40% localisation', 'indigenous flight controller', 'Zuppa Tsalla ideaForge', 'RISC-V flight controller', 'counter-UAS India', 'drone control stack', 'MEMS IMU India'],
  faq: [{
  a: 'Largely no. Official data placed before the Lok Sabha in April 2025 record 39% of flight controllers in DGCA-certified small drones as Chinese-sourced, and across the whole fleet the effective figure is 70–80%. The processors and MEMS inertial sensors at the base of the stack are roughly 100% imported, so even “indigenous” controllers are assembled on foreign silicon.',
  q: 'Does India make its own drone flight controllers?'
}, {
  a: 'The new INR 2,000 crore (about USD 240 million) scheme mandates 40% domestic value addition in flight controllers, navigation systems and communication modules by FY2027-28, and for the first time covers autonomy software. Continued reliance on imported Pixhawk-class boards risks both PLI eligibility and government-tender access.',
  q: 'What does the new drone PLI scheme require?'
}, {
  a: 'It is the brain of the drone — it decides where the aircraft goes and what it does. Electronic-warfare resilience and GPS-denied navigation depend on it, and Operation Sindoor in May 2025 showed that imported controllers lack the anti-jam and anti-spoof resilience contested environments demand.',
  q: 'Why is the flight controller so strategically important?'
}, {
  a: 'ideaForge (listed on the NSE and BSE since 2023) leads the integrated stack; Zuppa holds a patented flight-control architecture; Tsalla is building GPS-denied / EW-resilient autonomy; Inferigence Quotient and Yaanendriya are emerging; and defence primes BEL and Raphe mPhibr anchor the defence segment.',
  q: 'Which Indian companies lead drone flight control and autonomy?'
}, {
  a: 'The silicon. Flight-control processors and MEMS inertial sensors are roughly 100% imported and a credible indigenous alternative (a RISC-V flight-control system-on-chip) is a five-to-eight-year undertaking. Localisation plateaus near 40% unless the processor layer is addressed or deliberately exempted from the count.',
  q: 'What is the hardest part of localising flight controllers?'
}],
  sources: [],
  dateModified: '2026-06-21'
}, {
  slug: 'indias-unmanned-warfare-transformation',
  title: 'India’s Unmanned Warfare Transformation',
  subtitle: 'Reconstructing the Indian Army Roadmap for Unmanned Aerial Systems and Loitering Munitions, 2026–2035 — and Pricing the Industrial Opportunity Beneath It',
  domain: 'Defence & Dual-Use',
  edition: 'Strategic Intelligence · Edition 2 · v2.0',
  published: '2026-06-22',
  publishedLabel: 'June 2026',
  readingTime: '~ 2h read',
  status: 'published',
  summary: 'India’s Army is not buying drones — it is rebuilding the architecture of land warfare around unmanned, autonomous and attritable systems, a procurement signal of INR 1.0–1.9 lakh crore through 2035 against a INR 2–3 lakh crore economic footprint. This report reconstructs that roadmap and prices the opportunity beneath it, and its central finding is uncomfortable for an industry organised around airframes: the money, the margin and the sovereignty sit not in the platform the Army buys but in the subsystems it buys again with every unit — a roughly INR 40,000 crore import-substitution prize in sensors, seekers, propulsion, RF and silicon. Eighteen chapters, thirty-one figures and fifty-three tables; three proprietary frameworks (the Autonomous Warfare Stack, the Attritable Warfare Index and the Drone Industrial Sovereignty Matrix); a full market model (TAM/SAM/SOM, a procurement-wave model and an indigenous-content model); the competitive landscape and capability-gap map; strategic implications with playbooks for startups, MSMEs, large firms and venture investors; three quantified scenarios and a risk heat map. Every purchase includes a twenty-five-slide investor briefing deck (editable).',
  accent: '#C9A84C',
  access: 'paid',
  price: 7499,
  currency: 'INR',
  hasPdf: true,
  hasDeck: true,
  pages: 172,
  cover: '/covers/indias-unmanned-warfare-transformation.jpg',
  previewObject: 'reports-free/Unmanned-Warfare-Free-Edition.pdf',
  previewPages: 20,
  keywords: ['India unmanned warfare', 'Indian Army drone roadmap', 'loitering munitions India', 'counter-UAS India', 'drone subsystem opportunity', 'defence electronics India', 'rare-earth magnets drones', 'flight-control silicon India', 'India drone market 2035', 'attritable warfare', 'autonomous systems India', 'drone investment opportunity India'],
  faq: [{
  a: 'The reconstructed Indian Army roadmap implies a procurement pool of about INR 1.0–1.9 lakh crore through 2035 (a mid case near INR 1,45,000 crore), with a broader economic footprint of INR 2–3 lakh crore. Of that, roughly 78 per cent is policy-addressable by Indian industry and about INR 84,000 crore is realistically capturable. These are transparent reconstructions, not official figures.',
  q: 'How big is India’s military drone and loitering-munition market?'
}, {
  a: 'A loitering munition is bought and consumed once, but its seeker, flight-control silicon, radio and magnets are bought again across every variant, refresh and export order. Integration earns 8–12 per cent; the subsystem layers earn 30–70 per cent. The roughly INR 40,000 crore import-substitution prize sits almost entirely below the platform.',
  q: 'Why is the value in drone subsystems rather than the airframe?'
}, {
  a: 'The decisive ones. Rare-earth magnets are near-100 per cent imported and under Chinese export control; flight-control silicon is about 90 per cent Chinese-origin; cooled-infrared seekers and gallium-nitride RF are foreign-sourced. India is 45–55 per cent import-dependent on components, and the imported half is the militarily decisive half.',
  q: 'Which drone subsystems is India most dependent on imports for?'
}, {
  a: 'On the layer below the airframe. Autonomy and mission software and sensing are the clearest build-now calls — highest margins, strongest defensibility, shortest time to capability. Counter-UAS is the second market and the logical anchor for component sovereignty. The report scores each layer and sets out playbooks for startups, MSMEs, large firms and venture investors.',
  q: 'Where should investors and manufacturers focus in India’s drone economy?'
}, {
  a: 'Eighteen chapters, thirty-one figures and fifty-three tables, with three proprietary frameworks, a full market model, the competitive landscape, strategic implications, three scenarios and a risk register. Every purchase also includes an editable twenty-five-slide investor briefing deck for taking the thesis into a room.',
  q: 'What does the report include, and what comes with purchase?'
}],
  sources: [],
  dateModified: '2026-06-22'
}, {
  slug: 'industrial-water-economy',
  title: 'The Industrial Water Economy',
  subtitle: 'Mapping the Water Dependencies of India’s New Manufacturing Corridors',
  domain: 'Industrial Infrastructure',
  edition: 'Edition 03 · forthcoming',
  published: '2026-07-10',
  publishedLabel: 'Forthcoming',
  readingTime: '20 min read',
  status: 'forthcoming',
  summary: 'Ultrapure water is a precondition for advanced manufacturing. This report maps the water dependencies forming around India’s emerging industrial corridors and the second-order risks they create.',
  accent: '#6366F1',
  access: 'paid',
  price: 4900,
  currency: 'INR',
  hasPdf: false,
  hasDeck: false,
  pages: undefined,
  cover: '',
  previewObject: '',
  previewPages: undefined,
  keywords: [],
  faq: [],
  sources: [],
  dateModified: '2026-07-10'
}, {
  slug: 'india-edge-ai-economy',
  title: 'India’s Edge AI Economy',
  subtitle: 'The Hidden Industrial Opportunity Behind AI Hardware',
  domain: 'Edge AI & Semiconductors',
  edition: 'Edge AI Series · I · forthcoming',
  published: '2026-08-15',
  publishedLabel: 'Forthcoming',
  readingTime: '~ 2h read',
  status: 'forthcoming',
  summary: 'On-device AI is moving inference out of the cloud and onto the edge — and the value is moving with it, into AI SoCs, sensors, cameras, modules and the software that runs models locally. India’s first edge-AI silicon (NetraSemi’s A2000) signals a design-led opening that needs no leading-edge fab. This report maps the edge-AI hardware stack, sizes the domestic-value opportunity, and identifies where India’s fabless designers, OSATs, sensor firms and device OEMs can capture it.',
  accent: '#38e1c4',
  access: 'paid',
  price: 4900,
  currency: 'INR',
  hasPdf: false,
  hasDeck: false,
  pages: undefined,
  cover: '',
  previewObject: '',
  previewPages: undefined,
  keywords: [],
  faq: [],
  sources: [],
  dateModified: '2026-08-15'
}, {
  slug: 'india-ai-power-infrastructure-gap',
  title: 'India’s AI Power Infrastructure Gap',
  subtitle: 'Why DC build-out is constrained by transmission, not generation',
  domain: 'AI Infrastructure',
  edition: 'forthcoming',
  published: '2026-08-15',
  publishedLabel: 'Forthcoming',
  readingTime: '~ 2h read',
  status: 'forthcoming',
  summary: 'India’s aggregate power picture is accommodating; the disaggregated picture is not. This report maps the local transmission and DISCOM-execution constraints that will set the realistic 4.5–9 GW DC ramp curve through 2030.',
  accent: '#6366F1',
  access: 'free',
  price: 4900,
  currency: 'INR',
  hasPdf: false,
  hasDeck: false,
  pages: undefined,
  cover: '',
  previewObject: '',
  previewPages: undefined,
  keywords: [],
  faq: [],
  sources: [],
  dateModified: '2026-08-15'
}, {
  slug: 'cooling-economy-of-india',
  title: 'The Cooling Economy of India',
  subtitle: 'Industrial chillers, liquid cooling and the AI rack-density transition',
  domain: 'Industrial Infrastructure',
  edition: 'forthcoming',
  published: '2026-09-12',
  publishedLabel: 'Forthcoming',
  readingTime: '~ 90 min read',
  status: 'forthcoming',
  summary: 'AI workloads push rack density 4–10× above traditional IT. The cooling architecture that follows — direct-liquid, immersion, hybrid evaporative — defines a ₹7,500–36,000 crore Indian industrial market through 2030. This report sizes it.',
  accent: '#38e1c4',
  access: 'paid',
  price: 4900,
  currency: 'INR',
  hasPdf: false,
  hasDeck: false,
  pages: undefined,
  cover: '',
  previewObject: '',
  previewPages: undefined,
  keywords: [],
  faq: [],
  sources: [],
  dateModified: '2026-09-12'
}, {
  slug: 'india-sensor-economy',
  title: 'The Sensor Economy of India',
  subtitle: 'Why the next industrial bottleneck is the sensor, not the chip',
  domain: 'Edge AI & Semiconductors',
  edition: 'Edge AI Series · II · forthcoming',
  published: '2026-09-30',
  publishedLabel: 'Forthcoming',
  readingTime: '~ 2h read',
  status: 'forthcoming',
  summary: 'Every autonomous system, smart device and inspection line begins with a sensor — and India imports an estimated 65–75% of its sensor components by value, with domestic value-add concentrated in assembly. As the smart-sensor market scales toward ~US$9.8 billion by 2030, this report maps India’s sensor supply chain — MEMS, image, thermal, inertial and environmental — the depth of the import dependence, and the localisation, design and packaging opportunities the edge-AI wave opens.',
  accent: '#22D3EE',
  access: 'paid',
  price: 4900,
  currency: 'INR',
  hasPdf: false,
  hasDeck: false,
  pages: undefined,
  cover: '',
  previewObject: '',
  previewPages: undefined,
  keywords: [],
  faq: [],
  sources: [],
  dateModified: '2026-09-30'
}, {
  slug: 'industrial-logistics-behind-manufacturing-india',
  title: 'Industrial Logistics Behind Manufacturing India',
  subtitle: 'Gati Shakti, DFC, KAVACH and the AI overlay on the freight system',
  domain: 'Industrial Infrastructure',
  edition: 'forthcoming',
  published: '2026-10-10',
  publishedLabel: 'Forthcoming',
  readingTime: '~ 2h read',
  status: 'forthcoming',
  summary: 'The logistics modernisation programme is the most institutionally-anchored AI-deployment programme in India. This report maps the layered system — DFC, KAVACH 4.0, Gati Shakti, ULIP, the PM Gati Shakti Network Planning Group — that determines manufacturing competitiveness through 2030.',
  accent: '#6366F1',
  access: 'paid',
  price: 4900,
  currency: 'INR',
  hasPdf: false,
  hasDeck: false,
  pages: undefined,
  cover: '',
  previewObject: '',
  previewPages: undefined,
  keywords: [],
  faq: [],
  sources: [],
  dateModified: '2026-10-10'
}, {
  slug: 'water-behind-indias-semiconductor-ambitions',
  title: 'Water Behind India’s Semiconductor Ambitions',
  subtitle: 'Ultrapure water, treated wastewater and the corridor-level water audit',
  domain: 'Semiconductor Ecosystems',
  edition: 'forthcoming',
  published: '2026-11-14',
  publishedLabel: 'Forthcoming',
  readingTime: '~ 90 min read',
  status: 'forthcoming',
  summary: 'A 300 mm fab consumes ~4 million litres of ultrapure water per day; an Indian advanced-packaging facility would add more. This report audits the water position of each Indian semiconductor cluster against CGWB block-level extraction data, and names the regulatory reforms that would close the supply gap.',
  accent: '#F5B544',
  access: 'free',
  price: 4900,
  currency: 'INR',
  hasPdf: false,
  hasDeck: false,
  pages: undefined,
  cover: '',
  previewObject: '',
  previewPages: undefined,
  keywords: [],
  faq: [],
  sources: [],
  dateModified: '2026-11-14'
}, {
  slug: 'india-industrial-machine-vision',
  title: 'Industrial Machine Vision in India',
  subtitle: 'The automated eye of Indian manufacturing',
  domain: 'Edge AI & Industrial Automation',
  edition: 'Edge AI Series · III · forthcoming',
  published: '2026-11-15',
  publishedLabel: 'Forthcoming',
  readingTime: '~ 90 min read',
  status: 'forthcoming',
  summary: 'Machine vision — the cameras, optics, lighting and edge-inference software that let machines inspect and guide themselves — is becoming the quality backbone of Indian electronics, automotive and pharmaceutical manufacturing, growing at roughly 14% a year. This report maps the machine-vision stack, its import-heavy hardware layer and its software-and-integration value, and where Indian firms can move from deploying foreign systems to building them.',
  accent: '#818CF8',
  access: 'paid',
  price: 4900,
  currency: 'INR',
  hasPdf: false,
  hasDeck: false,
  pages: undefined,
  cover: '',
  previewObject: '',
  previewPages: undefined,
  keywords: [],
  faq: [],
  sources: [],
  dateModified: '2026-11-15'
}, {
  slug: 'india-semiconductor-supply-chain-missing-links',
  title: 'India’s Semiconductor Supply Chain Missing Links and Industrial Opportunity Surfaces',
  subtitle: 'Substrates, gases, photoresists, equipment subcomponents — the layers no one is building',
  domain: 'Semiconductor Ecosystems',
  edition: 'forthcoming',
  published: '2026-12-12',
  publishedLabel: 'Forthcoming',
  readingTime: '~ 2h 30m read',
  status: 'forthcoming',
  summary: 'The 12 ISM-approved projects describe what India is building. This report describes what India is not building — the materials, substrates, equipment subcomponents and consumables that determine whether the fabs and OSATs actually run at competitive yield and cost.',
  accent: '#F5B544',
  access: 'paid',
  price: 4900,
  currency: 'INR',
  hasPdf: false,
  hasDeck: false,
  pages: undefined,
  cover: '',
  previewObject: '',
  previewPages: undefined,
  keywords: [],
  faq: [],
  sources: [],
  dateModified: '2026-12-12'
}, {
  slug: 'q-day-india',
  title: 'Q-Day India',
  subtitle: 'India’s readiness for post-quantum cryptography and the migration architecture',
  domain: 'Strategic Technology',
  edition: 'forthcoming',
  published: '2027-01-16',
  publishedLabel: 'Forthcoming',
  readingTime: '~ 90 min read',
  status: 'forthcoming',
  summary: 'The arithmetic of Q-Day — the moment large-scale quantum computers break classical public-key cryptography — is no longer purely theoretical. This report maps India’s position: the NIST PQC standards, the CERT-In and MeitY migration posture, the BFSI exposure, and the corridor-level industrial implications.',
  accent: '#38e1c4',
  access: 'free',
  price: 4900,
  currency: 'INR',
  hasPdf: false,
  hasDeck: false,
  pages: undefined,
  cover: '',
  previewObject: '',
  previewPages: undefined,
  keywords: [],
  faq: [],
  sources: [],
  dateModified: '2027-01-16'
}];

export function formatPrice(r: ReportMeta): string {
  if (!r.price) return r.access === 'free' ? 'Free' : '';
  return `₹${(r.price / 100).toLocaleString('en-IN')}`;
}

export function getReport(slug: string): ReportMeta | undefined {
  return reports.find((r) => r.slug === slug);
}
