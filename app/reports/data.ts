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
    subtitle: 'Autonomous systems, dual-use industrial base and the procurement pathway',
    domain: 'Defence & Dual-Use',
    edition: 'forthcoming',
    published: '2027-02-20',
    publishedLabel: 'Forthcoming',
    readingTime: '~ 2h read',
    status: 'forthcoming',
    accent: '#FB923C',
    summary:
      'The frontier of battlefield automation — autonomous ground systems, loitering munitions, ISR drones, counter-UAS — is moving faster than the Indian defence procurement architecture is structured to absorb. This report maps the gap, the iDEX and DRDO pathways, and the dual-use industrial base that would close it.',
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
