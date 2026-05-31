export interface IssueMeta {
  slug: string;
  no: string;          // 'Issue 01'
  month: string;       // 'May 2026'
  date: string;        // display date
  title: string;       // 'India Buys Into the Middle of the Stack'
  standfirst: string;
  readingTime: string; // '7-min read'
  cover: string;       // hero infographic (SVG — crisp + indexable text)
  ogImage: string;     // social share image (PNG — SVG not supported by OG)
  pdf: string;         // public download URL
  status: 'live' | 'forthcoming';
}

/** Public download URL — reports-free bucket (Research Reports project). */
const PDF_BASE =
  'https://lkqojucjkpxhcngtstfy.supabase.co/storage/v1/object/public/reports-free/';

export const issues: IssueMeta[] = [
  {
    slug: 'strategic-signals-may-2026',
    no: 'Issue 01',
    month: 'May 2026',
    date: '31 May 2026',
    title: 'India Buys Into the Middle of the Stack',
    standfirst:
      'A $3.3bn substrate plant, a $150bn target, and a PLI that finally bites. May was the month India stopped chasing the fab — and started claiming the one layer it can actually own.',
    readingTime: '7-min read',
    cover: '/newsletter/strategic-intelligence.svg',
    ogImage: '/newsletter/global_stack.png',
    pdf: PDF_BASE + encodeURIComponent('Strategic Signals - Issue 01 - May 2026.pdf'),
    status: 'live',
  },
];

export const getIssue = (slug: string) => issues.find((i) => i.slug === slug);
