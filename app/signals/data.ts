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
  date: string;          // ISO
  dateLabel: string;
  status: 'live' | 'monitoring' | 'placeholder';
  excerpt: string;
  readingTime: string;
  body?: SignalBody[];
  takeaways?: string[];
}

export const signals: SignalMeta[] = [
  {
    slug: 'osat-bottleneck',
    no: 'S-003',
    title: 'India’s Hidden OSAT Bottleneck',
    domain: 'Semiconductors',
    date: '2026-05-24',
    dateLabel: '24 May 2026',
    status: 'live',
    readingTime: '4 min',
    excerpt:
      'Front-end fabrication attracts the headlines, but the binding constraint on near-term output is back-end assembly, test and packaging capacity — and the specialised inputs it quietly depends on.',
    takeaways: [
      'Assembly, test and packaging (ATMP/OSAT) is the layer most exposed to near-term ramp risk.',
      'Substrate, lead-frame and high-purity chemical supply are thin and largely imported.',
      'Packaging capacity, not wafer starts, is the more realistic 2026–28 employment story.',
    ],
    body: [
      { type: 'p', text: 'Public attention on India’s semiconductor effort concentrates almost entirely on the front end — wafer fabrication. Yet the part of the value chain most likely to determine how quickly the country can convert policy into shipped product is the back end: outsourced assembly, test and packaging.' },
      { type: 'p', text: 'Packaging is less capital-intensive than a leading-edge fab and ramps faster, which is precisely why it tends to absorb the first wave of manufacturing employment in a new cluster. But it depends on a thin layer of specialised inputs — organic substrates, lead-frames, bonding wire and a long list of high-purity chemicals and gases — most of which are currently imported.' },
      { type: 'h', text: 'Why it matters' },
      { type: 'p', text: 'If substrate and consumable supply does not localise in step with assembly capacity, the bottleneck simply migrates one layer up the chain. The strategic question is not whether India can stand up packaging lines, but whether the inputs feeding them are secured before the lines are commissioned.' },
      { type: 'list', items: [
        'Watch substrate and lead-frame sourcing announcements as a leading indicator of genuine localisation.',
        'Treat packaging employment figures as the more reliable near-term metric than wafer-fab headcount.',
        'Specialised-chemical supply agreements are an under-reported tell on cluster maturity.',
      ] },
    ],
  },
  {
    slug: 'talent-constraint',
    no: 'S-002',
    title: 'Why Talent May Become the Real Constraint',
    domain: 'Strategic Technology',
    date: '2026-05-18',
    dateLabel: '18 May 2026',
    status: 'monitoring',
    readingTime: '5 min',
    excerpt:
      'Capital and policy can be assembled quickly. The deep process-engineering and yield-management talent that makes a fab productive cannot — and that asymmetry shapes the realistic ramp curve.',
    takeaways: [
      'Equipment can be bought; tacit process knowledge has to be grown or imported.',
      'Yield ramp — not construction — is where talent depth becomes decisive.',
      'Expatriate seeding plus domestic pipelines is the standard pattern; both take years.',
    ],
    body: [
      { type: 'p', text: 'A fab can be financed in a board meeting and built in roughly two to three years. The capability to run it at competitive yield is a different kind of asset — accumulated tacit knowledge held by process engineers, equipment specialists and yield-management teams that cannot be procured on the same timeline as the tools.' },
      { type: 'p', text: 'Every late-entrant manufacturing economy has confronted the same asymmetry. The usual answer is a blend: seed lines with experienced expatriate engineers while building domestic pipelines through universities, vendor training and on-the-job ramp. Both halves take years to mature, which is why talent — not capital or policy — tends to set the binding pace once construction is complete.' },
      { type: 'h', text: 'The signal to watch' },
      { type: 'p', text: 'Track returning-diaspora hiring, equipment-vendor training footprints and university-to-fab placement programmes. These are slower-moving but more predictive of sustained output than groundbreaking ceremonies.' },
    ],
  },
  {
    slug: 'dholera-water-signal',
    no: 'S-001',
    title: 'Dholera Water Signal',
    domain: 'Industrial Infrastructure',
    date: '2026-05-12',
    dateLabel: '12 May 2026',
    status: 'placeholder',
    readingTime: '— ',
    excerpt:
      'Placeholder — analysis of water sourcing, allocation and resilience dependencies forming around the Dholera industrial corridor. To be published.',
  },
];

export const getSignal = (slug: string) => signals.find((s) => s.slug === slug);
