import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from './AtlasNav';
import { JsonLd, breadcrumb, SITE, ORG_REF } from './seo';
import {
  corridorsOrdered, meta, rollup, gridForCorridor, playersForCorridor,
  STATUS_COLORS, atlas, lastUpdated,
} from './atlas';
import { pillarStats } from './pillars';
import { reports } from '../reports/data';
import { signals } from '../signals/data';

const LATEST = [
  ...reports.filter((r) => r.status === 'published').map((r) => ({ date: r.published, kind: 'Report', label: r.domain, title: r.title, href: `/reports/${r.slug}/` })),
  ...signals.filter((s) => s.status === 'live').map((s) => ({ date: s.date, kind: 'Signal', label: s.domain, title: s.title, href: `/signals/${s.slug}/` })),
].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)).slice(0, 8);

export const metadata: Metadata = {
  title: 'The Atlas — India’s industrial systems, mapped',
  alternates: { canonical: `${SITE}/research/` },
  description:
    'A living, free map of India’s strategic industrial systems: the players in each industry, who controls each chokepoint, and the layers India still imports — semiconductors, critical minerals, AI infrastructure, defence and enterprise software.',
};

const PATHS = [
  { href: '/research/pillars/', k: '01', name: 'Explore an industry', desc: 'See any strategic industry as one system map — its value-chain layers, the chokepoints inside them, and who controls each. The best place to start.', cta: 'Open the pillar maps' },
  { href: '/research/players/', k: '02', name: 'Find a company or material', desc: `${atlas.players.length} companies, PSUs, ministries, foreign suppliers and materials — filter by industry, type and origin, and trace what each one makes.`, cta: 'Browse the directory' },
  { href: '/research/dependencies/', k: '03', name: 'See where India depends', desc: 'Every value-chain layer scored 0–5, from import-dependent to sovereign, with the rationale and source behind each score.', cta: 'Open the dependency map' },
];

const DATABASES = [
  { href: '/research/drones-uas/', name: 'Unmanned Systems', desc: 'India’s drone ecosystem end to end — platforms, makers, components, procurement.' },
  { href: '/research/counter-uas/', name: 'Counter-UAS', desc: 'The counter-drone shield: who detects, tracks and defeats the threat, mapped.' },
  { href: '/research/patents/', name: 'Patent Monitor', desc: 'India-origin patent filings across strategic technologies, by sector and applicant.' },
  { href: '/research/suppliers/', name: 'Supplier Directory', desc: '498 Indian manufacturing suppliers — CNC, PCB, composites, precision machining, toolmaking.' },
];

const TOOLS = [
  { href: '/research/search/', name: 'Search', desc: 'Find any entity across the Atlas.' },
  { href: '/research/entities/', name: 'Entities', desc: 'The full graph of tracked entities.' },
  { href: '/research/explorer/', name: 'Explorer', desc: 'Filter and slice the whole dataset.' },
  { href: '/research/supply-chains/', name: 'Supply Chains', desc: 'Trace chokepoints layer by layer.' },
  { href: '/research/corridors/', name: 'Thematic profiles', desc: 'A synthesis write-up per industry.' },
  { href: '/research/sources/', name: 'Sources', desc: 'India’s industrial-policy record, organised.' },
  { href: '/research/methodology/', name: 'Methodology', desc: 'How we score, verify and label.' },
  { href: '/resources/', name: 'Cite & Embed', desc: 'Reference the Atlas in your work, free.' },
];

function LayerStrip({ corridorId }: { corridorId: number }) {
  const cells = gridForCorridor(corridorId);
  return (
    <div className="atlas-strip" aria-hidden="true">
      {cells.map((c) => <span key={c.layer_id} style={{ background: STATUS_COLORS[c.status] }} title={`${c.layer}: ${c.status_label}`} />)}
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
          name: 'The Atlas — India’s industrial systems, mapped', url: `${SITE}/research/`,
          isPartOf: { '@id': `${SITE}/#website` }, publisher: ORG_REF,
          about: ['India semiconductor industry', 'critical minerals', 'AI infrastructure', 'defence industrial base', 'enterprise software sovereignty'],
          hasPart: corridorsOrdered.map((c) => ({ '@type': 'WebPage', name: `${c.label} — pillar map`, url: `${SITE}/research/pillars/${meta(c.code).slug}/` })),
        },
      ]} />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>The Atlas</span></div>
          <h1>The Atlas</h1>
          <p className="lede">
            A living, free map of India’s strategic industrial systems — who the players are,
            who controls each chokepoint, and the layers of the value chain India still imports.
            Built from our research database, not the press release.
          </p>
          <div className="atlas-meta-row">
            <span><b>{atlas.corridors.length}</b> industries</span>
            <span><b>{atlas.players.length}</b> tracked players</span>
            <span><b>{atlas.relationships.length}</b> relationships</span>
            <span className="atlas-updated">Updated {updated}</span>
          </div>
        </div>
      </header>

      {/* ── Start here: three ways in ── */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">Start here</div><h2>Three ways in</h2></div>
          <p className="section-note">However you think about the problem — by industry, by company, or by dependency — start from one of these.</p>
        </div>
        <div className="atlas-paths">
          {PATHS.map((p) => (
            <Link key={p.href} href={p.href} className="atlas-path">
              <span className="ap-k">{p.k}</span>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <span className="atlas-card-go">{p.cta} →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── The industries (pillar maps) ── */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker">The industries</div><h2>Five strategic pillars, mapped</h2></div>
          <Link href="/research/pillars/" className="see-all">All pillar maps →</Link>
        </div>
        <div className="atlas-cards">
          {corridorsOrdered.map((c) => {
            const m = meta(c.code);
            const r = rollup(c.id);
            const s = pillarStats(c.code);
            return (
              <Link key={c.code} href={`/research/pillars/${m.slug}/`} className="atlas-card" style={{ ['--accent' as string]: m.accent }}>
                <div className="atlas-card-head"><h3>{c.label}</h3><span className="atlas-card-no">{String(c.id).padStart(2, '0')}</span></div>
                <p className="atlas-card-tag">{m.tagline}</p>
                <LayerStrip corridorId={c.id} />
                <div className="atlas-card-stats">
                  <span><b>{s.players}</b> players</span>
                  <span><b>{s.chokepoints}</b> chokepoints · <b>{r.importDependent}</b>/<b>{r.cells}</b> import-dep</span>
                </div>
                <span className="atlas-card-go">Open the pillar map →</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Deep databases ── */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">Deep databases</div><h2>Specialised datasets</h2></div>
          <p className="section-note">Vertical deep-dives with their own structured databases, updated as the picture changes.</p>
        </div>
        <div className="atlas-dbs">
          {DATABASES.map((d) => (
            <Link key={d.href} href={d.href} className="atlas-db">
              <h3>{d.name}</h3>
              <p>{d.desc}</p>
              <span className="atlas-card-go">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Latest developments ── */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker"><span className="live" /> What’s changed</div><h2>Latest developments</h2></div>
          <Link href="/reports/" className="see-all">All reports →</Link>
        </div>
        <ul className="atlas-feed" role="list">
          {LATEST.map((e) => (
            <li key={e.href}>
              <Link href={e.href} className="atlas-feed-row" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="afr-date">{new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="afr-corr" style={{ ['--accent' as string]: '#C9A84C' }}>{e.label}</span>
                <span className="afr-type">{e.kind}</span>
                <span className="afr-title">{e.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Tools & reference ── */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">Tools &amp; reference</div><h2>Everything else in the Atlas</h2></div></div>
        <div className="atlas-tools">
          {TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className="atlas-tool">
              <span className="at-name">{t.name}</span>
              <span className="at-desc">{t.desc}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
