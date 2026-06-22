export interface IssueMeta {
  slug: string;
  no: string;          // 'Issue 01'
  month: string;       // 'May 2026'
  date: string;        // display date
  published: string;   // ISO publish date (JSON-LD)
  title: string;       // 'India Buys Into the Middle of the Stack'
  standfirst: string;
  readingTime: string; // '7-min read'
  card: string;        // designed magazine cover shown on the issue card (JPG/PNG)
  cover: string;       // hero infographic (SVG/PNG — crisp + indexable)
  ogImage: string;     // social share image (PNG — SVG not supported by OG)
  pdf: string;         // public download URL
  pdfReady: boolean;   // false until the PDF is uploaded to the bucket
  status: 'live' | 'forthcoming';
}

/** Public download URL — reports-free bucket (Research Reports project). */
const PDF_BASE =
  'https://lkqojucjkpxhcngtstfy.supabase.co/storage/v1/object/public/reports-free/';

export const issues: IssueMeta[] = [
  {
    slug: 'sanket-june-2026',
    no: 'Issue 02',
    month: 'June 2026',
    date: '30 June 2026',
    published: '2026-06-30',
    title: 'Assembly Is Not Sovereignty',
    standfirst:
      'Nine reports this month, one structural finding: India assembles — but the value lives upstream, in the layers it does not own. From the parts inside its drones to the software it runs on.',
    readingTime: '9-min read',
    card: '/covers/sanket-june-2026.png',
    cover: '/newsletter/june-at-a-glance.png',
    ogImage: '/newsletter/june-at-a-glance.png',
    pdf: PDF_BASE + encodeURIComponent('sanket-june-26.pdf'),
    pdfReady: true,
    status: 'live',
  },
  {
    slug: 'sanket-may-2026',
    no: 'Issue 01',
    month: 'May 2026',
    date: '31 May 2026',
    published: '2026-05-31',
    title: 'India Buys Into the Middle of the Stack',
    standfirst:
      'A $3.3bn substrate plant, a $150bn target, and a PLI that finally bites. May was the month India stopped chasing the fab — and started claiming the one layer it can actually own.',
    readingTime: '7-min read',
    card: '/covers/sanket-may-2026.jpg',
    cover: '/newsletter/strategic-intelligence.svg',
    ogImage: '/newsletter/global_stack.png',
    pdf: PDF_BASE + encodeURIComponent('sanket-may-26.pdf'),
    pdfReady: true,
    status: 'live',
  },
];

export const getIssue = (slug: string) => issues.find((i) => i.slug === slug);
