import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../seo';
import { corridorsOrdered, meta as cmeta } from '../atlas';
import { PILLAR_THESIS, pillarStats } from '../pillars';

export const metadata: Metadata = {
  title: 'Pillar maps — India’s strategic industries as system maps | The Atlas',
  alternates: { canonical: `${SITE}/research/pillars/` },
  description: 'Each strategic pillar — semiconductors, critical minerals, AI infrastructure, defence, enterprise software — mapped as one connected system: streams, chokepoints, and who controls each layer.',
};

export default function PillarsIndex() {
  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' }, { name: 'Pillars', path: '/research/pillars/' }]),
        {
          '@context': 'https://schema.org', '@type': 'CollectionPage',
          name: 'Pillar maps — Techadyant Atlas',
          url: `${SITE}/research/pillars/`, isPartOf: { '@id': `${SITE}/#website` }, publisher: ORG_REF,
          hasPart: corridorsOrdered.map((c) => ({ '@type': 'WebPage', name: c.label, url: `${SITE}/research/pillars/${cmeta(c.code).slug}/` })),
        },
      ]} />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><Link href="/research/">The Atlas</Link><span className="sep">/</span><span>Pillars</span></div>
          <h1>Pillar maps</h1>
          <p className="lede">Each strategic industry as one connected system — its value-chain streams, the chokepoints inside them, who controls each layer, and how the pillars link to one another.</p>
        </div>
      </header>

      <section className="wrap">
        <div className="atlas-cards">
          {corridorsOrdered.map((c) => {
            const m = cmeta(c.code);
            const s = pillarStats(c.code);
            return (
              <Link key={c.code} href={`/research/pillars/${m.slug}/`} className="atlas-card" style={{ ['--accent' as string]: m.accent }}>
                <div className="atlas-card-head"><h3>{c.label}</h3><span className="atlas-card-no">{String(c.id).padStart(2, '0')}</span></div>
                <p className="atlas-card-tag">{PILLAR_THESIS[c.code]}</p>
                <div className="atlas-card-stats">
                  <span><b>{s.players}</b> players</span>
                  <span><b>{s.chokepoints}</b> chokepoints</span>
                </div>
                <span className="atlas-card-go">Open the pillar map →</span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
