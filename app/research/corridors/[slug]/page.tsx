import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AtlasNav } from '../../AtlasNav';
import { TrackCorridor } from '../../TrackCorridor';
import { JsonLd, breadcrumb, faqLd, datasetLd, corridorFaq, SITE } from '../../seo';
import { sourcesByCorridor, bestLink } from '../../sources';
import {
  corridorsOrdered, meta, corridorByCode, rollup, gridForCorridor, playersForCorridor,
  chokepointsForCorridor, eventsForCorridor, playerSlug, STATUS_COLORS, STATUS_SHORT,
} from '../../atlas';

export function generateStaticParams() {
  return corridorsOrdered.map((c) => ({ slug: meta(c.code).slug }));
}

const bySlug = (slug: string) => corridorsOrdered.find((c) => meta(c.code).slug === slug);

const clampDesc = (s: string, n = 158): string => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…');

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = bySlug(slug);
  if (!c) return { title: 'Corridor' };
  return {
    title: `${c.label} — ecosystem profile`,
    description: clampDesc(`India’s ${c.label} ecosystem: import dependency, key players, chokepoints and developments. ${meta(c.code).tagline}`),
    alternates: { canonical: `${SITE}/research/corridors/${meta(c.code).slug}/` },
  };
}

export default async function CorridorProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = bySlug(slug);
  if (!c) notFound();
  const m = meta(c.code);
  const r = rollup(c.id);
  const sov = Math.round((r.avg / 5) * 100);
  const cells = gridForCorridor(c.id);
  const players = playersForCorridor(c.code);
  const domestic = players.filter((p) => p.country === 'IN').length;
  const chokes = chokepointsForCorridor(c.code).filter((x) => x.inbound >= 2).slice(0, 6);
  const events = eventsForCorridor(c.id).slice(0, 8);
  const sources = sourcesByCorridor(c.code);

  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' }, { name: 'Corridors', path: '/research/corridors/' }, { name: c.label, path: `/research/corridors/${m.slug}/` }]),
        datasetLd({
          name: `${c.label} — India dependency & ecosystem profile`,
          description: `Value-chain capture assessment, key players, chokepoints and developments for India’s ${c.label} ecosystem.`,
          path: `/research/corridors/${m.slug}/`,
          keywords: [c.label, 'India', 'import dependency', 'supply chain', 'industrial policy'],
          csv: ['/data/atlas/dependency-grid.csv'],
        }),
        faqLd(corridorFaq(c.id)),
      ]} />

      <header className="ed-page-head" style={{ ['--accent' as string]: m.accent }}>
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">Atlas</Link><span className="sep">/</span>
            <Link href="/research/corridors/">Corridors</Link><span className="sep">/</span><span>{c.label}</span>
          </div>
          <h1>{c.label}</h1>
          <p className="lede">{m.tagline}</p>
          <div className="corr-stats">
            <div><span className="cs-n" style={{ color: m.accent }}>{sov}<small>/100</small></span><span className="cs-l">Sovereignty index</span></div>
            <div><span className="cs-n">{r.importDependent}</span><span className="cs-l">Import-dependent layers</span></div>
            <div><span className="cs-n">{players.length}</span><span className="cs-l">Players ({domestic} Indian)</span></div>
            <div><span className="cs-n">{events.length}</span><span className="cs-l">Recent developments</span></div>
          </div>
        </div>
      </header>

      {/* Dependency grid */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: m.accent }}>Value chain</div><h2>Where India stands</h2></div>
          <Link href={`/research/dependencies/#${m.slug}`} className="see-all">Full detail →</Link></div>
        <div className="corr-grid">
          {cells.map((cell) => (
            <div key={cell.layer_id} className="corr-grid-row">
              <span className="corr-grid-band" style={{ background: STATUS_COLORS[cell.status] }} />
              <span className="corr-grid-layer">{cell.layer}</span>
              <span className="corr-grid-status" style={{ color: STATUS_COLORS[cell.status] }}>{cell.status} · {STATUS_SHORT[cell.status]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Chokepoints */}
      {chokes.length > 0 && (
        <section className="wrap" style={{ background: 'var(--bg-2)' }}>
          <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: m.accent }}>Dependency</div><h2>Chokepoints</h2></div>
            <Link href={`/research/supply-chains/#${m.slug}`} className="see-all">Supply chains →</Link></div>
          <div className="choke-list">
            {chokes.map((ch) => (
              <div key={ch.id} className="choke-row" style={{ ['--accent' as string]: m.accent }}>
                <Link href={`/research/players/${playerSlug(ch.id)}/`} className="choke-node">{ch.name}</Link>
                <span className="choke-count">{ch.inbound} dependents</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Players */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: m.accent }}>Ecosystem</div><h2>Key players</h2></div>
          <Link href="/research/players/" className="see-all">All players →</Link></div>
        <div className="corr-players">
          {players.slice(0, 18).map((p) => (
            <Link key={p.id} href={`/research/players/${playerSlug(p.id)}/`} className="corr-player" style={{ ['--accent' as string]: m.accent }}>
              <span className="cp-name">{p.name}</span>
              <span className={`ply-flag ${p.country === 'IN' ? 'dom' : 'frn'}`}>{p.country}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Developments */}
      {events.length > 0 && (
        <section className="wrap" style={{ background: 'var(--bg-2)' }}>
          <div className="section-head-ed"><div><div className="ed-kicker"><span className="live" /> Activity</div><h2>Recent developments</h2></div></div>
          <ul className="atlas-feed" role="list">
            {events.map((e) => (
              <li key={e.id} className="atlas-feed-row">
                <span className="afr-date">{new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="afr-type">{e.type}</span>
                <span className="afr-title">{e.title}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {sources.length > 0 && (
        <section className="wrap">
          <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: m.accent }}>Evidence</div><h2>Primary sources</h2></div>
            <Link href="/research/sources/" className="see-all">All sources →</Link></div>
          <div className="corr-sources">
            {sources.map((src) => {
              const link = bestLink(src);
              return (
                <a key={src.id} href={link ?? '#'} target="_blank" rel="noopener" className="corr-source" style={{ ['--accent' as string]: m.accent }}>
                  <span className="cs-type">{src.doc_type} · {src.year}</span>
                  <span className="cs-title">{src.title}</span>
                  <span className="cs-body">{src.issuing_body} ↗</span>
                </a>
              );
            })}
          </div>
        </section>
      )}

      <section className="wrap-narrow">
        <TrackCorridor code={c.code} label={c.label} accent={m.accent} />
        <div className="player-foot">
          <Link href="/research/corridors/" className="see-all">← All corridors</Link>
          <Link href="/reports/" className="see-all">Related reports →</Link>
        </div>
      </section>
    </>
  );
}
