import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from './AtlasNav';
import { JsonLd, breadcrumb, SITE, ORG_REF } from './seo';
import {
  corridorsOrdered, meta, rollup, gridForCorridor, playersForCorridor,
  STATUS_COLORS, STATUS_SHORT, atlas, lastUpdated, recentEvents, corridorById,
} from './atlas';

export const metadata: Metadata = {
  title: 'The Atlas — India’s industrial systems, mapped',
  alternates: { canonical: `${SITE}/research/` },
  description:
    'A living map of India’s strategic industrial ecosystems: the main players in each, what they make, and the layers India still imports. Free research workbench from Techadyant Labs.',
};

function LayerStrip({ corridorId }: { corridorId: number }) {
  const cells = gridForCorridor(corridorId);
  return (
    <div className="atlas-strip" aria-hidden="true">
      {cells.map((c) => (
        <span key={c.layer_id} style={{ background: STATUS_COLORS[c.status] }} title={`${c.layer}: ${c.status_label}`} />
      ))}
    </div>
  );
}

export default function AtlasOverview() {
  const updated = new Date(lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' }]),
        {
          '@context': 'https://schema.org', '@type': 'CollectionPage',
          name: 'The Atlas — India’s industrial systems, mapped',
          url: `${SITE}/research/`,
          isPartOf: { '@id': `${SITE}/#website` },
          publisher: ORG_REF,
          about: ['India semiconductor industry', 'critical minerals', 'AI infrastructure', 'defence industrial base', 'enterprise software sovereignty'],
          hasPart: corridorsOrdered.map((c) => ({ '@type': 'WebPage', name: `${c.label} — ecosystem profile`, url: `${SITE}/research/corridors/${meta(c.code).slug}/` })),
        },
      ]} />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>The Atlas</span>
          </div>
          <h1>The Atlas</h1>
          <p className="lede">
            A living map of India’s strategic industrial systems — the players in each
            ecosystem, what they actually make, and the layers of the value chain India still
            imports. Built from our research database, not the press release. Free to use; updated
            as the picture changes.
          </p>
          <div className="atlas-meta-row">
            <span><b>{atlas.corridors.length}</b> ecosystems</span>
            <span><b>{atlas.players.length}</b> tracked players</span>
            <span><b>{atlas.grid.length}</b> dependency assessments</span>
            <span className="atlas-updated">Updated {updated}</span>
          </div>
        </div>
      </header>

      <section className="wrap">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">Start here</div>
            <h2>The five ecosystems</h2>
          </div>
          <p className="section-note">
            Each ecosystem is scored across its value chain on a 0–5 capture scale — from
            import-dependent to sovereign. Pick one to see where India stands and who the players are.
          </p>
        </div>

        <div className="atlas-cards">
          {corridorsOrdered.map((c) => {
            const m = meta(c.code);
            const r = rollup(c.id);
            const players = playersForCorridor(c.code).length;
            return (
              <Link
                key={c.code}
                href={`/research/dependencies#${m.slug}`}
                className="atlas-card"
                style={{ ['--accent' as string]: m.accent }}
              >
                <div className="atlas-card-head">
                  <h3>{c.label}</h3>
                  <span className="atlas-card-no">{String(c.id).padStart(2, '0')}</span>
                </div>
                <p className="atlas-card-tag">{m.tagline}</p>
                <LayerStrip corridorId={c.id} />
                <div className="atlas-card-stats">
                  <span>
                    <b>{r.importDependent}</b> of <b>{r.cells}</b> layers import-dependent
                  </span>
                  <span>{players} players</span>
                </div>
                {r.weakest && (
                  <div className="atlas-card-weak">
                    Weakest link: <strong>{r.weakest.layer}</strong> · {STATUS_SHORT[r.weakest.status]}
                  </div>
                )}
                <span className="atlas-card-go">View dependency map →</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="wrap">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker"><span className="live" /> What’s changed</div>
            <h2>Latest developments</h2>
          </div>
          <Link href="/signals" className="see-all">All signals →</Link>
        </div>
        <ul className="atlas-feed" role="list">
          {recentEvents(7).map((e) => {
            const c = e.corridor_id ? corridorById(e.corridor_id) : null;
            const m = c ? meta(c.code) : null;
            return (
              <li key={e.id} className="atlas-feed-row">
                <span className="afr-date">{new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                {c && m && <span className="afr-corr" style={{ ['--accent' as string]: m.accent }}>{c.label}</span>}
                <span className="afr-type">{e.type}</span>
                <span className="afr-title">{e.title}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="atlas-entrypoints">
          <Link href="/research/dependencies" className="atlas-entry">
            <div className="ae-k">Import Dependency Map</div>
            <p>Where India stands across every value-chain layer, with the rationale and source behind each score.</p>
            <span className="see-all">Open the map →</span>
          </Link>
          <Link href="/research/players" className="atlas-entry">
            <div className="ae-k">Ecosystems &amp; Players</div>
            <p>{atlas.players.length} companies, PSUs, ministries, foreign suppliers and materials — filter by ecosystem, type and origin.</p>
            <span className="see-all">Browse players →</span>
          </Link>
          <Link href="/research/sources" className="atlas-entry">
            <div className="ae-k">Sources</div>
            <p>India’s industrial-policy record — roadmaps, schemes, Acts and notifications — in one organised, searchable library.</p>
            <span className="see-all">Open the library →</span>
          </Link>
        </div>
      </section>
    </>
  );
}
