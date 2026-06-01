import metaJson from './report-meta.json';

export type AccessTier = 'free' | 'paid';

export interface ReportMeta {
  slug: string;
  title: string;
  subtitle: string;
  domain: string;
  edition: string;
  published: string;       // ISO
  publishedLabel: string;
  readingTime: string;
  status: 'published' | 'forthcoming';
  summary: string;
  accent: string;          // hex

  /** Commerce */
  access: AccessTier;      // 'free' downloadable w/o registration; 'paid' requires purchase
  price?: number;          // INR (whole rupees), required when access === 'paid'
  currency?: 'INR';
  hasPdf: boolean;         // whether a downloadable PDF exists in private storage
  pages?: number;          // PDF page count (display only) — overridden by report-meta.json when present
  cover?: string;          // optional cover image URL; if absent a branded cover is generated

  /** Free abridged preview (frictionless — no signup). */
  previewObject?: string;  // filename under /public/previews/ (e.g. "india-fab-ecosystem-preview.pdf")
  previewPages?: number;   // page count of the preview PDF (display only)
  /** SEO / GEO */
  keywords?: string[];                 // per-report keywords (SEO + AI-engine topicality)
  faq?: { q: string; a: string }[];    // emitted as FAQPage schema (GEO: feeds AI Overviews)
  dateModified?: string;               // ISO; falls back to `published`
}

interface SyncedMeta {
  pages?: number;
  words?: number;
  readingMinutes?: number;
  readingTime?: string;
  sourceFile?: string;
  syncedAt?: string;
}

const synced: Record<string, SyncedMeta> = metaJson as Record<string, SyncedMeta>;

/** Static catalogue. Values for `pages` / `readingTime` are fallbacks — the
 *  real numbers come from app/reports/report-meta.json, written by
 *  `npm run sync-meta` after a PDF is added/updated. */
const baseReports: ReportMeta[] = [
  {
    slug: 'the-sap-question',
    title: 'The SAP Question',
    subtitle: 'India’s Enterprise Technology Sovereignty Report 2026–2035 — Who Really Controls the Software India Runs On?',
    domain: 'Enterprise Software Sovereignty',
    edition: 'Strategic Risk Report · Edition 02 · 2026–2035 · v2.3',
    published: '2026-06-01',
    publishedLabel: 'June 2026',
    readingTime: '~ 3.5h read',
    status: 'published',
    accent: '#C9A84C',
    summary:
      'India built the world’s software workforce but imports the enterprise software its own economy runs on. More than 5,000 enterprises — the operational core of ONGC, IndianOil, NTPC, BHEL, SAIL, the PSU banks and the armed forces — run on foreign ERP. This report measures the dependency layer by layer with three proprietary frameworks (EDI, SSS, DIEM), maps where SAP runs India sector by sector, weighs it against Germany, China, South Korea and France, sets out the 2027 SAP deadline and the AI reset, and charts the sovereign-software opportunity to 2035. ~180 pages, 30+ figures, 21 data tables, eight appendices. Free.',
    access: 'free',
    hasPdf: true,
    pages: 180,
    cover: '/covers/the-sap-question.jpg',
    previewObject: 'reports-free/the-sap-questions.pdf',
    previewPages: 180,
    dateModified: '2026-06-01',
    keywords: [
      'SAP India', 'enterprise software sovereignty', 'India ERP dependency',
      'foreign software dependence India', 'SAP ECC 2027 deadline', 'sovereign software India',
      'Enterprise Dependency Index', 'India technology sovereignty', 'Zoho ERP', 'digital public infrastructure',
    ],
    faq: [
      { q: 'How dependent is India on foreign enterprise software?', a: 'A modelled ~59% of India’s software-operating formal-sector value-added depends, at the ERP, database and cloud layer, on software controlled by foreign-headquartered vendors. The dependency is deepest in public cloud and ERP.' },
      { q: 'Which Indian companies and institutions run on SAP?', a: 'More than 5,000 Indian enterprises run SAP, including the operational core of ONGC, Indian Oil, NTPC, BHEL, SAIL, Bharat Electronics and the public-sector banks. The Indian Army runs one of the largest SAP ERP deployments in the Government of India.' },
      { q: 'What is the 2027 SAP deadline?', a: 'SAP ECC mainstream support ends on 31 December 2027, forcing thousands of Indian enterprises to a migration decision — a moment that coincides with the AI reset and the emergence of credible Indian products.' },
      { q: 'Can India build sovereign enterprise software?', a: 'India has already built sovereign software at population scale through its digital public infrastructure (Aadhaar, UPI, MOSIP). The report sizes a ~USD 51 billion sovereign-software opportunity by 2035; the question is whether India extends that proven capability from its citizen rails to its enterprise core.' },
    ],
  },
  {
    slug: 'who-actually-captures-the-india-us-minerals-alliance',
    title: 'Who Actually Captures the India–US Minerals Alliance?',
    subtitle: 'Why Separation and Magnets — Not Mines — Decide India’s Place in the Hardware Century',
    domain: 'Critical Minerals & Strategic Materials',
    edition: 'Edition 01 · Strategic Intelligence · v1.0',
    published: '2026-05-30',
    publishedLabel: 'May 2026',
    readingTime: '~ 2h 30m read',
    status: 'published',
    accent: '#C9A84C',
    summary:
      'The 26 May 2026 India–US critical-minerals framework is read as a mining deal. It is better understood as a midstream deal: the leverage sits in separation, refining and magnets — roughly 85–92% controlled by China — not in reserves. Using a proprietary four-chokepoint framework, this report scores India sector by sector — semiconductors, electronics, defence, EVs, energy and AI infrastructure — and asks who actually captures the value as the alliance moves from signature to execution.',
    access: 'paid',
    price: 4900,
    currency: 'INR',
    hasPdf: true,
    pages: 125,
    cover: '/covers/who-actually-captures-the-india-us-minerals-alliance.jpg',
    previewObject: 'reports-free/who-actually-captures-the-india-us-minerals-alliance-CONDENSED.pdf',
    previewPages: 14,
  },
  {
    slug: 'india-ai-industrial-transition-2026-2035',
    title: 'India’s AI Industrial Transition and Infrastructure Transformation',
    subtitle:
      'A strategic-intelligence map of compute, semiconductors, power, water, regional corridors, and the second-order industrial reshaping of India',
    domain: 'AI Infrastructure',
    edition: 'Edition 01 · Baseline Architecture · v1.0',
    published: '2026-05-29',
    publishedLabel: 'May 2026',
    readingTime: '3h read',
    status: 'published',
    accent: '#6366F1',
    summary:
      'A baseline architecture for India’s 2026–2035 AI industrial transition: ten anchor numbers, six theses, nine analytical frameworks, seven regional corridors, three scenarios, and eight failure-mode stress tests. The transition is treated as a re-layering of compute, semiconductors, power, water, fibre, real-estate and skilled labour — not as a workforce or careers story.',
    access: 'free',
    hasPdf: true,
    cover: '/covers/india-ai-industrial-transition-2026-2035.jpg',
  },
  {
    slug: 'india-fab-ecosystem',
    title: 'Who Really Benefits from India’s Fab Ecosystem?',
    subtitle: 'The Hidden Industrial Transformation Behind India’s Semiconductor Mission',
    domain: 'Semiconductor Ecosystems',
    edition: 'Edition 01 · v1.0',
    published: '2026-05-20',
    publishedLabel: 'May 2026',
    readingTime: '24 min read',
    status: 'published',
    accent: '#F5B544',
    summary:
      'India’s semiconductor push is usually told as a story about chips. It is better understood as a story about land, water, power, packaging and people — and about who captures the value when a state decides to manufacture its way up the technology stack.',
    access: 'paid',
    price: 4900,
    currency: 'INR',
    hasPdf: true,
    pages: 28,
    cover: '/covers/india-fab-ecosystem.jpg',
    previewObject: 'india-fab-ecosystem-preview.pdf',
    previewPages: 12,
  },
  {
    slug: 'osat-and-the-packaging-frontier',
    title: 'The Packaging Frontier',
    subtitle: 'Why Assembly, Test and Advanced Packaging May Matter More Than Fabs',
    domain: 'Semiconductor Ecosystems',
    edition: 'Edition 02 · forthcoming',
    published: '2026-06-15',
    publishedLabel: 'Forthcoming',
    readingTime: '18 min read',
    status: 'forthcoming',
    accent: '#38e1c4',
    summary:
      'Back-end assembly, test and advanced packaging is where a large share of near-term semiconductor employment and value addition will accrue in India. A structural look at the OSAT layer.',
    access: 'paid',
    price: 4900,
    currency: 'INR',
    hasPdf: false,
  },
  {
    slug: 'industrial-water-economy',
    title: 'The Industrial Water Economy',
    subtitle: 'Mapping the Water Dependencies of India’s New Manufacturing Corridors',
    domain: 'Industrial Infrastructure',
    edition: 'Edition 03 · forthcoming',
    published: '2026-07-10',
    publishedLabel: 'Forthcoming',
    readingTime: '20 min read',
    status: 'forthcoming',
    accent: '#6366F1',
    summary:
      'Ultrapure water is a precondition for advanced manufacturing. This report maps the water dependencies forming around India’s emerging industrial corridors and the second-order risks they create.',
    access: 'paid',
    price: 4900,
    currency: 'INR',
    hasPdf: false,
  },

  /* ─── Hidden Infrastructure Reports — forthcoming series ─── */
  {
    slug: 'india-ai-power-infrastructure-gap',
    title: 'India’s AI Power Infrastructure Gap',
    subtitle: 'Why DC build-out is constrained by transmission, not generation',
    domain: 'AI Infrastructure',
    edition: 'forthcoming',
    published: '2026-08-15',
    publishedLabel: 'Forthcoming',
    readingTime: '~ 2h read',
    status: 'forthcoming',
    accent: '#6366F1',
    summary:
      'India’s aggregate power picture is accommodating; the disaggregated picture is not. This report maps the local transmission and DISCOM-execution constraints that will set the realistic 4.5–9 GW DC ramp curve through 2030.',
    access: 'paid',
    price: 4900,
    currency: 'INR',
    hasPdf: false,
  },
  {
    slug: 'cooling-economy-of-india',
    title: 'The Cooling Economy of India',
    subtitle: 'Industrial chillers, liquid cooling and the AI rack-density transition',
    domain: 'Industrial Infrastructure',
    edition: 'forthcoming',
    published: '2026-09-12',
    publishedLabel: 'Forthcoming',
    readingTime: '~ 90 min read',
    status: 'forthcoming',
    accent: '#38e1c4',
    summary:
      'AI workloads push rack density 4–10× above traditional IT. The cooling architecture that follows — direct-liquid, immersion, hybrid evaporative — defines a ₹7,500–36,000 crore Indian industrial market through 2030. This report sizes it.',
    access: 'paid',
    price: 4900,
    currency: 'INR',
    hasPdf: false,
  },
  {
    slug: 'industrial-logistics-behind-manufacturing-india',
    title: 'Industrial Logistics Behind Manufacturing India',
    subtitle: 'Gati Shakti, DFC, KAVACH and the AI overlay on the freight system',
    domain: 'Industrial Infrastructure',
    edition: 'forthcoming',
    published: '2026-10-10',
    publishedLabel: 'Forthcoming',
    readingTime: '~ 2h read',
    status: 'forthcoming',
    accent: '#6366F1',
    summary:
      'The logistics modernisation programme is the most institutionally-anchored AI-deployment programme in India. This report maps the layered system — DFC, KAVACH 4.0, Gati Shakti, ULIP, the PM Gati Shakti Network Planning Group — that determines manufacturing competitiveness through 2030.',
    access: 'paid',
    price: 4900,
    currency: 'INR',
    hasPdf: false,
  },
  {
    slug: 'water-behind-indias-semiconductor-ambitions',
    title: 'Water Behind India’s Semiconductor Ambitions',
    subtitle: 'Ultrapure water, treated wastewater and the corridor-level water audit',
    domain: 'Semiconductor Ecosystems',
    edition: 'forthcoming',
    published: '2026-11-14',
    publishedLabel: 'Forthcoming',
    readingTime: '~ 90 min read',
    status: 'forthcoming',
    accent: '#F5B544',
    summary:
      'A 300 mm fab consumes ~4 million litres of ultrapure water per day; an Indian advanced-packaging facility would add more. This report audits the water position of each Indian semiconductor cluster against CGWB block-level extraction data, and names the regulatory reforms that would close the supply gap.',
    access: 'paid',
    price: 4900,
    currency: 'INR',
    hasPdf: false,
  },

  /* ─── Named outlines (Reports and DPR/ folder) ─── */
  {
    slug: 'india-semiconductor-supply-chain-missing-links',
    title: 'India’s Semiconductor Supply Chain Missing Links and Industrial Opportunity Surfaces',
    subtitle: 'Substrates, gases, photoresists, equipment subcomponents — the layers no one is building',
    domain: 'Semiconductor Ecosystems',
    edition: 'forthcoming',
    published: '2026-12-12',
    publishedLabel: 'Forthcoming',
    readingTime: '~ 2h 30m read',
    status: 'forthcoming',
    accent: '#F5B544',
    summary:
      'The 12 ISM-approved projects describe what India is building. This report describes what India is not building — the materials, substrates, equipment subcomponents and consumables that determine whether the fabs and OSATs actually run at competitive yield and cost.',
    access: 'paid',
    price: 4900,
    currency: 'INR',
    hasPdf: false,
  },
  {
    slug: 'q-day-india',
    title: 'Q-Day India',
    subtitle: 'India’s readiness for post-quantum cryptography and the migration architecture',
    domain: 'Strategic Technology',
    edition: 'forthcoming',
    published: '2027-01-16',
    publishedLabel: 'Forthcoming',
    readingTime: '~ 90 min read',
    status: 'forthcoming',
    accent: '#38e1c4',
    summary:
      'The arithmetic of Q-Day — the moment large-scale quantum computers break classical public-key cryptography — is no longer purely theoretical. This report maps India’s position: the NIST PQC standards, the CERT-In and MeitY migration posture, the BFSI exposure, and the corridor-level industrial implications.',
    access: 'paid',
    price: 4900,
    currency: 'INR',
    hasPdf: false,
  },
  {
    slug: 'india-battlefield-automation-gap',
    title: 'India’s Battlefield Automation Gap',
    subtitle: 'Industrial Readiness, Strategic Risks & Emerging Opportunities (2026–2035)',
    domain: 'Defence & Dual-Use',
    edition: 'Edition 01 · Strategic Intelligence · v1.0',
    published: '2026-05-30',
    publishedLabel: 'May 2026',
    readingTime: '~ 2h 30m read',
    status: 'published',
    accent: '#FB923C',
    summary:
      'Battlefield automation is an industrial-capability race, not a procurement race. Using a proprietary Battlefield Automation Readiness Index (BARI), this report scores India against China and the United States across eight industrial layers — sensors, rugged electronics, batteries, tactical communications, autonomy software, testing and manufacturing — maps where the gap concentrates, reads it sector by sector, and identifies the startup, SME and policy opportunities that would close it. Published free, given its relevance to government-led initiatives.',
    access: 'free',
    hasPdf: true,
    pages: 130,
    cover: '/covers/india-battlefield-automation-gap.jpg',
  },
  {
    slug: 'india-edge-ai-economy',
    title: 'India’s Edge AI Economy',
    subtitle: 'The Hidden Industrial Opportunity Behind AI Hardware',
    domain: 'Edge AI & Semiconductors',
    edition: 'Edge AI Series · I · forthcoming',
    published: '2026-08-15',
    publishedLabel: 'Forthcoming',
    readingTime: '~ 2h read',
    status: 'forthcoming',
    accent: '#38e1c4',
    summary:
      'On-device AI is moving inference out of the cloud and onto the edge — and the value is moving with it, into AI SoCs, sensors, cameras, modules and the software that runs models locally. India’s first edge-AI silicon (NetraSemi’s A2000) signals a design-led opening that needs no leading-edge fab. This report maps the edge-AI hardware stack, sizes the domestic-value opportunity, and identifies where India’s fabless designers, OSATs, sensor firms and device OEMs can capture it.',
    access: 'paid',
    price: 4900,
    currency: 'INR',
    hasPdf: false,
  },
  {
    slug: 'india-sensor-economy',
    title: 'The Sensor Economy of India',
    subtitle: 'Why the next industrial bottleneck is the sensor, not the chip',
    domain: 'Edge AI & Semiconductors',
    edition: 'Edge AI Series · II · forthcoming',
    published: '2026-09-30',
    publishedLabel: 'Forthcoming',
    readingTime: '~ 2h read',
    status: 'forthcoming',
    accent: '#22D3EE',
    summary:
      'Every autonomous system, smart device and inspection line begins with a sensor — and India imports an estimated 65–75% of its sensor components by value, with domestic value-add concentrated in assembly. As the smart-sensor market scales toward ~US$9.8 billion by 2030, this report maps India’s sensor supply chain — MEMS, image, thermal, inertial and environmental — the depth of the import dependence, and the localisation, design and packaging opportunities the edge-AI wave opens.',
    access: 'paid',
    price: 4900,
    currency: 'INR',
    hasPdf: false,
  },
  {
    slug: 'india-industrial-machine-vision',
    title: 'Industrial Machine Vision in India',
    subtitle: 'The automated eye of Indian manufacturing',
    domain: 'Edge AI & Industrial Automation',
    edition: 'Edge AI Series · III · forthcoming',
    published: '2026-11-15',
    publishedLabel: 'Forthcoming',
    readingTime: '~ 90 min read',
    status: 'forthcoming',
    accent: '#818CF8',
    summary:
      'Machine vision — the cameras, optics, lighting and edge-inference software that let machines inspect and guide themselves — is becoming the quality backbone of Indian electronics, automotive and pharmaceutical manufacturing, growing at roughly 14% a year. This report maps the machine-vision stack, its import-heavy hardware layer and its software-and-integration value, and where Indian firms can move from deploying foreign systems to building them.',
    access: 'paid',
    price: 4900,
    currency: 'INR',
    hasPdf: false,
  },
];

// Apply synced PDF metadata over the static defaults.
export const reports: ReportMeta[] = baseReports.map((r) => {
  const m = synced[r.slug];
  if (!m) return r;
  return {
    ...r,
    pages: m.pages ?? r.pages,
    readingTime: m.readingTime ?? r.readingTime,
  };
});

export const getReport = (slug: string) => reports.find((r) => r.slug === slug);

export function formatPrice(r: ReportMeta): string {
  if (r.access === 'free') return 'Free';
  if (!r.price) return '';
  return '₹' + r.price.toLocaleString('en-IN');
}
