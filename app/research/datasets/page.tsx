import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { JsonLd, breadcrumb, faqLd, SITE, ORG_ID } from '../seo';
import { lastUpdated } from '../atlas';

export const metadata: Metadata = {
  title: 'Datasets — download the India industrial dependency data',
  alternates: { canonical: `${SITE}/research/datasets/` },
  description:
    'Three open CSV datasets from the Techadyant Atlas: a 45-row import-dependency grid, 788 named industry players and 39 industrial-corridor nodes. 872 rows, CC BY 4.0, no login or API key.',
};

interface Ds {
  slug: string;
  name: string;
  rows: number;
  cols: number;
  csv: string;
  href: string;
  hrefLabel: string;
  desc: string;
  keywords: string[];
}

const DATASETS: Ds[] = [
  {
    slug: 'india-industrial-import-dependency-grid',
    name: 'India Industrial Import-Dependency Grid',
    rows: 45,
    cols: 7,
    csv: '/data/atlas/dependency-grid.csv',
    href: '/research/dependencies/',
    hrefLabel: 'Open the Import Dependency Map',
    desc:
      'Six strategic ecosystems scored across 27 value-chain layers on a 0–5 capture scale, from import-dependent to sovereign. Each row carries a verification label, an assessment date and the written rationale behind the score.',
    keywords: ['India import dependency', 'value chain', 'supply chain', 'sovereign capability', 'semiconductors', 'critical minerals'],
  },
  {
    slug: 'india-industrial-players',
    name: 'India Industrial Players',
    rows: 788,
    cols: 5,
    csv: '/data/atlas/players.csv',
    href: '/research/players/',
    hrefLabel: 'Open Ecosystems & Players',
    desc:
      'Named organisations across the Atlas — companies, foreign suppliers, research institutions, technologies and regulators — each with its type, country and the corridors it appears in.',
    keywords: ['India industry directory', 'companies', 'suppliers', 'research institutions', 'ecosystem map'],
  },
  {
    slug: 'india-industrial-corridor-nodes',
    name: 'India Industrial Corridor Nodes',
    rows: 39,
    cols: 17,
    csv: '/data/corridor-nodes.csv',
    href: '/corridors/',
    hrefLabel: 'Open the industrial corridors map',
    desc:
      '39 nodes across India’s 11 national industrial corridors: development stage, land area, project cost, investment potential, projected jobs, target sectors, developer, EPC contractor and anchor tenants.',
    keywords: ['industrial corridors India', 'DMIC', 'manufacturing nodes', 'land bank', 'anchor tenants'],
  },
];

const TOTAL_ROWS = DATASETS.reduce((n, d) => n + d.rows, 0);

const FAQ: { q: string; a: string }[] = [
  {
    q: 'What is in the Techadyant Atlas datasets?',
    a: `${TOTAL_ROWS} rows across three CSV files: a ${DATASETS[0].rows}-row import-dependency grid scoring six Indian strategic ecosystems across 27 value-chain layers, a ${DATASETS[1].rows}-row directory of named industry players, and a ${DATASETS[2].rows}-row table of nodes across India's 11 national industrial corridors.`,
  },
  {
    q: 'Are the Techadyant Atlas datasets free to use?',
    a: 'Yes. All three datasets are released under CC BY 4.0 and are directly downloadable as CSV. There is no account, login, API key or payment required.',
  },
  {
    q: 'How are the import-dependency scores verified?',
    a: 'Each assessment carries a verification label. "Verified" means two or more independent primary sources, "single-source" cites one official source, and analyst-assessed scores carry a written rationale with sourcing in progress. The method is set out in full on the Atlas methodology page.',
  },
  {
    q: 'How often are the datasets updated?',
    a: `They are rebuilt from the Atlas whenever the underlying assessments change. The current build is dated ${lastUpdated}.`,
  },
  {
    q: 'How should I cite the Techadyant Atlas datasets?',
    a: 'Cite as Techadyant Labs, the dataset name, the version date and the URL of the page the data was downloaded from, under CC BY 4.0. Ready-made BibTeX and citation formats are on the Cite & Embed page.',
  },
];

export default function DatasetsPage() {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Techadyant Atlas datasets',
    numberOfItems: DATASETS.length,
    itemListElement: DATASETS.map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Dataset',
        name: d.name,
        description: d.desc,
        url: `${SITE}${d.href}`,
        license: 'https://creativecommons.org/licenses/by/4.0/',
        creator: { '@type': 'Organization', name: 'Techadyant Labs', '@id': ORG_ID },
        dateModified: lastUpdated,
        keywords: d.keywords.join(', '),
        variableMeasured: d.slug === 'india-industrial-import-dependency-grid'
          ? 'Value-chain capture status (0 import-dependent → 5 sovereign)'
          : undefined,
        distribution: [{
          '@type': 'DataDownload',
          encodingFormat: 'text/csv',
          contentUrl: `${SITE}${d.csv}`,
        }],
      },
    })),
  };

  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([
          { name: 'Home', path: '/' },
          { name: 'The Atlas', path: '/research/' },
          { name: 'Datasets', path: '/research/datasets/' },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Techadyant Atlas datasets',
          url: `${SITE}/research/datasets/`,
          publisher: { '@id': `${SITE}/#org` },
          about: 'Open CSV datasets on India’s industrial dependency, industry players and industrial corridors',
          isAccessibleForFree: true,
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
        itemList,
        faqLd(FAQ),
      ]} />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">Atlas</Link><span className="sep">/</span><span>Datasets</span>
          </div>
          <h1>Datasets</h1>
          <p className="lede">
            The Atlas is built on structured data, and the underlying data is open. Three CSV
            files — {TOTAL_ROWS} rows in total — covering India’s strategic value chains, the
            organisations that operate in them, and the industrial corridors being built to
            host them. Download them directly, use them in your own analysis, and cite them
            under CC BY 4.0.
          </p>
        </div>
      </header>

      <section className="wrap">
        <div className="atlas-cards">
          {DATASETS.map((d, i) => (
            <article className="atlas-card" key={d.slug}>
              <div className="atlas-card-head">
                <h3>{d.name}</h3>
                <span className="atlas-card-no">CSV · {String(i + 1).padStart(2, '0')}</span>
              </div>
              <p className="atlas-card-tag">{d.desc}</p>
              <div className="atlas-card-stats">
                <span><b>{d.rows}</b> rows</span>
                <span><b>{d.cols}</b> columns</span>
                <span><b>CC BY 4.0</b></span>
              </div>
              <a className="atlas-card-go" href={d.csv} download>
                Download CSV ↓
              </a>
              <Link className="atlas-card-go" href={d.href}>
                {d.hrefLabel} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap-narrow">
        <div className="sa-faq">
          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div className="sa-qa" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap-narrow">
        <p style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.7 }}>
          All datasets are published under a{' '}
          <a href="https://creativecommons.org/licenses/by/4.0/" rel="license noopener" target="_blank">
            Creative Commons Attribution 4.0 licence
          </a>
          , with no account or API key required. Citation formats, including BibTeX, are on the{' '}
          <Link href="/resources/">Cite &amp; Embed page</Link>. The scoring method and
          verification labels are documented on the <Link href="/research/methodology/">methodology page</Link>.
        </p>
      </section>
    </>
  );
}
