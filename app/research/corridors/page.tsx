import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { corridorsOrdered, meta, rollup, gridForCorridor, playersForCorridor, STATUS_COLORS } from '../atlas';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../seo';

export const metadata: Metadata = {
  title: 'Industrial Corridors — ecosystem profiles',
  description:
    'Synthesis profiles for India’s strategic industrial ecosystems — sovereignty index, import exposure, key players and live developments for semiconductors, critical minerals, AI infrastructure, defence and enterprise software.',
  alternates: { canonical: `${SITE}/research/corridors/` },
};

export default function CorridorsIndex() {
  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' }, { name: 'Corridors', path: '/research/corridors/' }]),
        {
          '@context': 'https://schema.org', '@type': 'CollectionPage',
          name: 'Industrial Corridors — India ecosystem profiles', url: `${SITE}/research/corridors/`, publisher: ORG_REF,
          hasPart: corridorsOrdered.map((c) => ({ '@type': 'WebPage', name: `${c.label} — ecosystem profile`, url: `${SITE}/research/corridors/${meta(c.code).slug}/` })),
        },
      ]} />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research">Atlas</Link><span className="sep">/</span><span>Corridors</span>
          </div>
          <h1>Industrial Corridors</h1>
          <p className="lede">
            One page per ecosystem — the dependency picture, the players, the chokepoints and the
            latest developments, synthesised. Start with a sovereignty index derived from the
            value-chain assessments.
          </p>
        </div>
      </header>

      <section className="wrap">
        <div className="atlas-cards">
          {corridorsOrdered.map((c) => {
            const m = meta(c.code);
            const r = rollup(c.id);
            const sov = Math.round((r.avg / 5) * 100);
            const cells = gridForCorridor(c.id);
            const players = playersForCorridor(c.code).length;
            return (
              <Link key={c.code} href={`/research/corridors/${m.slug}`} className="atlas-card" style={{ ['--accent' as string]: m.accent }}>
                <div className="atlas-card-head"><h3>{c.label}</h3><span className="atlas-card-no">{String(c.id).padStart(2, '0')}</span></div>
                <p className="atlas-card-tag">{m.tagline}</p>
                <div className="corr-index">
                  <div className="corr-bar"><span style={{ width: `${sov}%`, background: m.accent }} /></div>
                  <span className="corr-index-n">{sov}<small>/100 sovereignty</small></span>
                </div>
                <div className="atlas-strip" aria-hidden="true">
                  {cells.map((c2) => <span key={c2.layer_id} style={{ background: STATUS_COLORS[c2.status] }} />)}
                </div>
                <div className="atlas-card-stats">
                  <span><b>{r.importDependent}</b> import-dependent layers</span>
                  <span>{players} players</span>
                </div>
                <span className="atlas-card-go">Open profile →</span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
