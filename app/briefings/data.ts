export interface BriefingBody {
  type: 'p' | 'h' | 'list';
  text?: string;
  items?: string[];
}

export interface BriefingMeta {
  slug: string;
  date: string;
  title: string;
  tag: string;
  read: string;
  blurb: string;
  status: 'live' | 'forthcoming';
  takeaways?: string[];
  body?: BriefingBody[];
}

export const briefings: BriefingMeta[] = [{
  date: '16 July 2026',
  slug: 'semicon-2-0-executive-briefing',
  status: 'live',
  title: 'What Semicon 2.0 Means for Indian Industry',
  tag: 'Policy briefing',
  read: '6 min',
  blurb: 'India\'s Rs 1.27 lakh crore Semicon 2.0 shifts the semiconductor mission from anchor-fab incentives to complete-ecosystem building across six pillars. An executive read on what changed, who benefits, and where the opportunities emerge.',
  takeaways: ['Semicon 2.0\'s real change is scope, not the Rs 1.27 lakh crore: a shift from anchor-fab incentives to complete-ecosystem building across six pillars.', 'Machines and materials are incentivised for the first time (pillar two) - equipment, chemicals and gases are now inside the incentive tent.', 'The distributed, SME-shaped opportunity sits in equipment sub-systems, specialty chemicals, precision manufacturing and fab-support services.', 'Fabs remain central and the Rs 76,000 crore ISM 1.0 continues; execution still depends on the scheme guidelines being notified.'],
  body: [{
  text: 'On 15 July 2026 the Union Cabinet approved Semicon 2.0 - the second phase of the India Semiconductor Mission - with a Rs 1.27 lakh crore (about US$13 billion) outlay, alongside a Rs 62,500 crore second phase of the mobile-manufacturing scheme. The headline is the money; the substance is the scope. Semicon 1.0 - a Rs 76,000 crore framework - was built to attract anchor fabs and packaging plants: 12 projects, over Rs 1.6 lakh crore of investment across six states, three now in commercial production. Semicon 2.0 reorganises the mission around six pillars spanning the whole value chain. For Indian industry, the decisive change is that the incentive frame now reaches beyond the fab to the equipment, materials, chemicals and design layers a semiconductor economy actually runs on.',
  type: 'p'
}, {
  text: 'What changed',
  type: 'h'
}, {
  type: 'list',
  items: ['From project incentives to ecosystem development - the scheme now explicitly funds equipment makers, materials, chemicals and gas producers, IP and design, R&D and talent, not only fabs and packaging.', 'Machines and materials become an incentivised category for the first time (pillar two): companies making the machines, materials, chemicals and gases essential to chipmaking will be supported.', 'Design and IP are elevated to pillar one, building on 105 chip-design startups in the ecosystem (24 under the Design-Linked Incentive).', 'R&D targets node progression - from today\'s 28-110nm toward advanced nodes - with domestic and international research centres.', 'Talent is formalised as a pillar: 315 universities and roughly 68,000 students already trained on industry EDA tools.']
}, {
  text: 'What did not change',
  type: 'h'
}, {
  type: 'list',
  items: ['Fabs remain central (pillar three); the Rs 76,000 crore ISM 1.0 projects continue and are unaffected.', 'The up-to-50% fiscal-support model and the anchor-investment approach persist alongside the broadened scope.', 'Execution risk is unchanged - incentives still need detailed guidelines and notifications before money flows, and semiconductor timelines run in years, not budget cycles.']
}, {
  text: 'The six pillars at a glance',
  type: 'h'
}, {
  type: 'list',
  items: ['Pillar 1 - Design & IP: chip design, intellectual property and SoCs for strategic and commercial use.', 'Pillar 2 - Machines & materials: equipment manufacturing and R&D, plus materials, chemicals and gases.', 'Pillar 3 - Fabs: silicon and compound-semiconductor fabrication.', 'Pillar 4 - ATMP & advanced packaging: assembly, testing, marking and packaging; OSAT; advanced packaging.', 'Pillar 5 - R&D: advanced nodes and technologies, in collaboration with centres in and outside India.', 'Pillar 6 - Talent: university training, EDA skilling and research capacity.']
}, {
  text: 'Which industries benefit',
  type: 'h'
}, {
  type: 'list',
  items: ['Precision engineering & machine tools - equipment sub-systems, fab-support machinery, cleanroom systems and automation.', 'Specialty chemicals - photoresists, etchants, CMP slurries and pads, high-purity solvents and electronic gases.', 'Advanced materials - silicon, silicon carbide, gallium nitride, quartz, wafers, substrates and packaging materials.', 'Fabless & design services - SoC startups, IP developers, the EDA ecosystem and ER&D services.', 'Industrial automation & instrumentation - wafer handling, process control, metrology and calibration.', 'Construction & infrastructure - cleanroom construction, ultrapure water, gas delivery and power for fab-ready parks.', 'State clusters - Gujarat (Dholera, Sanand), Assam, Karnataka, Tamil Nadu, Uttar Pradesh and Andhra/Telangana.']
}, {
  text: 'Where the opportunity emerges',
  type: 'h'
}, {
  text: 'A fab is a billion-dollar bet made by a handful of players. The equipment, chemicals and precision-manufacturing layers Semicon 2.0 has now brought inside the tent are an SME and mid-cap opportunity - more distributed and less capital-intensive.',
  type: 'p'
}, {
  type: 'list',
  items: ['Precision machining and toolroom capability for fab sub-systems.', 'Cleanroom construction, ultrapure-water and gas-handling systems.', 'Process instrumentation, calibration and metrology services.', 'CMP consumables, wafer-handling automation and specialty packaging.', 'Maintenance, spares and sustainment services for fabs and OSATs.']
}, {
  text: 'What to do now',
  type: 'h'
}, {
  type: 'list',
  items: ['Manufacturers & CEOs: audit which fab-support products - equipment sub-systems, chemicals, precision parts - you can qualify for, and prepare for pillar-two eligibility the moment guidelines are notified.', 'Investors: the fab bets are largely made; the next value creation is in equipment, chemicals, materials and fabless design - earlier-stage, more distributed and less capital-hungry.', 'State governments: compete on the ecosystem, not just the anchor - cleanroom-ready parks, chemical and gas clusters, testing labs and talent pipelines will decide who captures pillar-two investment.', 'Startups & MSMEs: treat the second pillar as a demand signal - pick one imported sub-system or consumable, build to fab-qualification standards, and target import-substitution.']
}, {
  text: 'What to watch',
  type: 'h'
}, {
  type: 'list',
  items: ['Whether the machines-and-materials pillar is notified with real allocations and eligibility rules - the difference between a market and a line in a press release.', 'Whether the 105 design startups convert into products and IP that fabs and OSATs can build.', 'The node ambition: 28-110nm toward advanced nodes is a decade-long industrial and R&D commitment.', 'Whether ATMP and OSAT deepen into genuine advanced packaging - the value-capture layer.', 'Whether the programme genuinely broadens beyond anchor investors to the SME base the second pillar names.']
}, {
  text: 'Sources: PIB / Cabinet - India Semiconductor Mission 2.0 (pib.gov.in, PRID 2224839); Business Standard; Swarajya; IBEF; Invest India. Figures are as reported on 15-16 July 2026 and should be reconciled against the scheme guidelines once notified.',
  type: 'p'
}, {
  text: 'The full analysis',
  type: 'h'
}, {
  text: 'This briefing distils a full Techadyant Labs report: [The Semicon 2.0 Opportunity Map](/reports/semicon-2-0-opportunity-map/) — a stream-by-stream map of the Rs 45,500 crore serviceable opportunity, with all eight upstream streams ranked and sorted into three capital-allocation tiers.',
  type: 'p'
}]
}, {
  date: '29 May 2026',
  slug: 'hidden-b2b-opportunities-in-indias-ai-infrastructure-buildout',
  status: 'forthcoming',
  title: 'Hidden B2B Opportunities in India’s AI Infrastructure Buildout',
  tag: 'Executive brief',
  read: '6 min',
  blurb: 'Where Indian industrial firms can capture value as USD 95 billion of DC capex lands in seven corridors — DCIM, UPW services, BESS, fibre splicing, cleanroom commissioning and the operations-layer workforce.',
  takeaways: [],
  body: []
}, {
  date: '29 May 2026',
  slug: 'industrial-cooling-opportunities-in-india',
  status: 'forthcoming',
  title: 'Industrial Cooling Opportunities in India',
  tag: 'Strategic note',
  read: '6 min',
  blurb: 'Direct-liquid, immersion, hybrid evaporative — the AI-rack density transition opens a ₹7,500–36,000 crore addressable market through 2030, with Indian-vendor capture rising from 35% to 55% as Voltas, Blue Star, Thermax and Eureka Forbes Industrial scale.',
  takeaways: [],
  body: []
}, {
  date: '29 May 2026',
  slug: 'tier-2-industrial-city-opportunity-map',
  status: 'forthcoming',
  title: 'Tier-2 Industrial City Opportunity Map',
  tag: 'Framework',
  read: '7 min',
  blurb: '30–50 Tier-2 cities will host 1–5 MW edge AI points-of-presence by 2030. This brief positions Coimbatore, Indore, Lucknow, Mysuru, Mangaluru, Hubballi-Dharwad and Vizag against six axes of industrial-AI readiness.',
  takeaways: [],
  body: []
}, {
  date: '29 May 2026',
  slug: '100-sme-opportunities-in-indias-semiconductor-push',
  status: 'forthcoming',
  title: '100 SME Opportunities in India’s Semiconductor Push',
  tag: 'Strategic note',
  read: '8 min',
  blurb: 'A tiered map of the ₹28,000–60,000 crore SME-addressable opportunity surface — ready-now precision sheet metal and cabling, 24-month builds in chillers and edge IoT, and 3–5 year partnership plays in substrates and consumables.',
  takeaways: [],
  body: []
}, {
  date: '09 May 2026',
  slug: 'five-constraints-on-the-2026-28-fab-ramp',
  status: 'forthcoming',
  title: 'Five Constraints on the 2026–28 Fab Ramp',
  tag: 'Strategic note',
  read: '5 min',
  blurb: 'A decision-oriented read on the binding constraints — water, power, materials, talent and customs throughput — that set the realistic ramp curve.',
  takeaways: [],
  body: []
}, {
  date: '28 Apr 2026',
  slug: 'the-corridor-logic-of-industrial-policy',
  status: 'forthcoming',
  title: 'The Corridor Logic of Industrial Policy',
  tag: 'Framework',
  read: '7 min',
  blurb: 'Why Special Investment Regions matter more than individual plant decisions, and how corridor infrastructure compounds across anchor tenants.',
  takeaways: [],
  body: []
}, {
  date: '14 Apr 2026',
  slug: 'mature-nodes-are-not-a-consolation-prize',
  status: 'forthcoming',
  title: 'Mature Nodes Are Not a Consolation Prize',
  tag: 'Strategic note',
  read: '4 min',
  blurb: 'Reframing the “bleeding edge vs mature node” debate around volume, employment and the rising value of advanced packaging.',
  takeaways: [],
  body: []
}, {
  date: '22 May 2026',
  slug: 'reading-indias-semiconductor-incentive-architecture',
  status: 'forthcoming',
  title: 'Reading India’s Semiconductor Incentive Architecture',
  tag: 'Executive brief',
  read: '6 min',
  blurb: 'How the incentive stack is structured across fabrication, packaging and design — and what it reveals about the state’s actual priorities.',
  takeaways: [],
  body: []
}];

export const getBriefing = (slug: string) => briefings.find((b) => b.slug === slug);
