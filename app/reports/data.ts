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
  },
];

export const getReport = (slug: string) => reports.find((r) => r.slug === slug);
