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
  access: AccessTier;      // 'free' => downloadable without registration; 'paid' => requires purchase
  price?: number;          // INR (whole rupees), required when access === 'paid'
  currency?: 'INR';
  hasPdf: boolean;         // whether a downloadable PDF exists in private storage
  pages?: number;          // PDF page count (display only)
  cover?: string;          // optional cover image URL; if absent a branded cover is generated
}

export const reports: ReportMeta[] = [
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
];

export const getReport = (slug: string) => reports.find((r) => r.slug === slug);

export function formatPrice(r: ReportMeta): string {
  if (r.access === 'free') return 'Free';
  if (!r.price) return '';
  return '₹' + r.price.toLocaleString('en-IN');
}
