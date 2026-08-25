import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { SpaceView } from './SpaceView';
import { SpaceTrack } from './SpaceTrack';
import { meta, companies, platforms } from './data';
import spaceData from '../_space.json';

const FAQ: { q: string; a: string }[] = [
  {
    q: 'How many private space companies are there in India?',
    a: `The Atlas tracks ${meta.companies} companies across India’s space ecosystem, of which ${meta.indianCompanies} are Indian — launch providers, satellite makers, propulsion, ground segment, SSA and downstream analytics. IN-SPACe has authorised ${meta.ngeEntities} non-government entities (${meta.startupAuthorisations} startups).`,
  },
  {
    q: 'Has any Indian private company reached orbit?',
    a: 'Yes. Skyroot Aerospace’s Vikram-1 became the first privately-developed Indian rocket to reach orbit in July 2026. Agnikul Cosmos and others are targeting orbital campaigns in 2026–27. Two commercial private launches are planned for FY 2026–27 and more than six for FY 2027–28.',
  },
  {
    q: 'What does India still import for space systems?',
    a: `Space-grade electronics and radiation-hardened components remain the most critical import dependency. High-performance propulsion, global ground-station coverage and parts of advanced EO/SAR payloads are also partially import-dependent. The Atlas scores ${meta.criticalDeps} layers as Critical or High dependence.`,
  },
  {
    q: 'How is private participation regulated?',
    a: 'IN-SPACe is the single-window authoriser and promoter under the Department of Space. The Indian Space Policy 2023 opened end-to-end activities to non-government entities. FDI rules allow up to 100% in selected activities (with automatic-route limits varying by segment).',
  },
  {
    q: 'What are the biggest space business opportunities in India?',
    a: `The Atlas scores ${meta.opportunities} opportunity surfaces, with ${meta.buildNow} rated Build-now — led by domestic launch cadence, space-grade electronics, green/electric propulsion, sovereign SSA and EO analytics verticals.`,
  },
];

export const metadata: Metadata = {
  title: 'India Space Ecosystem — Launch, Satellites, Propulsion, Dependencies | Techadyant Labs',
  description: `A living map of India’s space industrial system: ${meta.platforms} platforms, ${meta.companies} companies, $${meta.fundingUsdMn} Mn private funding, IN-SPACe authorisations, import dependencies and opportunity surfaces. Free from Techadyant Labs.`,
  openGraph: {
    title: 'India Space Ecosystem — Who builds, launches and operates in space',
    description: `Skyroot orbital milestone, ${meta.indianCompanies} Indian companies, critical electronics & propulsion dependencies. Living Atlas from Techadyant Labs.`,
  },
};

export default function SpacePage() {
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'India Space Ecosystem Atlas',
      description: metadata.description,
      url: 'https://labs.techadyant.com/research/space/',
      license: 'https://creativecommons.org/licenses/by/4.0/',
      creator: { '@type': 'Organization', name: 'Techadyant Labs' },
      spatialCoverage: { '@type': 'Place', name: 'India' },
      keywords: [
        'India space',
        'Indian space startups',
        'Skyroot',
        'Agnikul',
        'Pixxel',
        'IN-SPACe',
        'private launch India',
        'space economy India',
        'space-grade electronics',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <AtlasNav />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/research/">The Atlas</Link>
            <span className="sep">/</span>
            <span>Space</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)' }}>
            Space · India
          </div>
          <h1>Who builds, launches and operates in India&apos;s space economy?</h1>
          <p className="lede">
            A living map of India&apos;s space industrial system — {meta.platforms} platforms,{' '}
            {meta.companies} companies ({meta.indianCompanies} Indian), ${meta.fundingUsdMn} Mn
            private funding, {meta.authorisations} IN-SPACe authorisations, and the components,
            import dependencies and opportunity surfaces beneath them. From ISRO heritage to
            Skyroot&apos;s first private orbital flight. Free to browse.
          </p>
        </div>
      </header>

      <section className="wrap">
        <SpaceView data={spaceData as never} />
      </section>

      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">Questions</div>
            <h2>Frequently asked</h2>
          </div>
        </div>
        <div style={{ display: 'grid', gap: 16, maxWidth: 820 }}>
          {FAQ.map((f) => (
            <div key={f.q}>
              <h3 style={{ fontSize: 16, margin: '0 0 5px' }}>{f.q}</h3>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap">
        <SpaceTrack />
      </section>

      {/* Server-rendered directory — gives every company/platform page an incoming internal link.
          The interactive SpaceView is client-side, so its links aren't crawlable on their own
          (same orphan-page fix applied to the UAS Atlas). */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">Directory</div><h2>Every company &amp; platform in the Space Atlas</h2></div></div>
        <div className="atlas-dir">
          <div>
            <h3>Companies ({companies.length})</h3>
            <ul className="atlas-dir-list">
              {companies.map((c) => (
                <li key={c.slug}><Link href={`/research/space/company/${c.slug}/`}>{c.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Platforms ({platforms.length})</h3>
            <ul className="atlas-dir-list">
              {platforms.map((p) => (
                <li key={p.slug}><Link href={`/research/space/platform/${p.slug}/`}>{p.name}{p.variant ? ` · ${p.variant}` : ''}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
