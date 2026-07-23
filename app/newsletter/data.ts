export interface IssueMeta {
  slug: string;
  no: string;
  month: string;
  date: string;
  published: string;
  title: string;
  standfirst: string;
  readingTime: string;
  card: string;
  cover: string;
  ogImage: string;
  pdf: string;
  pdfReady: boolean;
  status: 'live' | 'forthcoming';
}

export const issues: IssueMeta[] = [{
  slug: 'sanket-july-2026',
  no: 'Issue 03',
  month: 'July 2026',
  date: '19 July 2026',
  published: '2026-07-19',
  title: 'The Opportunity Economy',
  standfirst: 'Eight reports this month, one map: the layers India can build and own — sized, ranked and mostly upstream of the platform. June named the problem; July prices the opportunity.',
  readingTime: '9-min read',
  card: 'https://library.techadyant.com/covers/sanket-july-26.png',
  cover: '/newsletter/july-at-a-glance.png',
  ogImage: '/newsletter/july-at-a-glance.png',
  pdf: 'https://library.techadyant.com/free%20reports/sanket-july-26.pdf',
  pdfReady: true,
  status: 'live'
}, {
  slug: 'sanket-june-2026',
  no: 'Issue 02',
  month: 'June 2026',
  date: '30 June 2026',
  published: '2026-06-30',
  title: 'Assembly Is Not Sovereignty',
  standfirst: 'Nine reports this month, one structural finding: India assembles — but the value lives upstream, in the layers it does not own. From the parts inside its drones to the software it runs on.',
  readingTime: '9-min read',
  card: '/covers/sanket-june-2026.png',
  cover: '/newsletter/june-at-a-glance.png',
  ogImage: '/newsletter/june-at-a-glance.png',
  pdf: 'https://library.techadyant.com/free%20reports/sanket-june-26.pdf',
  pdfReady: true,
  status: 'live'
}, {
  slug: 'sanket-may-2026',
  no: 'Issue 01',
  month: 'May 2026',
  date: '31 May 2026',
  published: '2026-05-31',
  title: 'India Buys Into the Middle of the Stack',
  standfirst: 'A $3.3bn substrate plant, a $150bn target, and a PLI that finally bites. May was the month India stopped chasing the fab — and started claiming the one layer it can actually own.',
  readingTime: '7-min read',
  card: '/covers/sanket-may-2026.jpg',
  cover: '/newsletter/strategic-intelligence.svg',
  ogImage: '/newsletter/global_stack.png',
  pdf: 'https://library.techadyant.com/free%20reports/sanket-may-26.pdf',
  pdfReady: true,
  status: 'live'
}];

export const getIssue = (slug: string) => issues.find((i) => i.slug === slug);
