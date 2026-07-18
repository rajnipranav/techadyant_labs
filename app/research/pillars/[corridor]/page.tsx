import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AtlasNav } from '../../AtlasNav';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../../seo';
import { meta as cmeta, playerSlug } from '../../atlas';
import {
  PILLAR_SLUGS, PILLAR_THESIS, pillarCorridor, pillarStats, streamsOf,
  chokepoints, fmtMagnitude, playersByRole, crossPillarEdges,
} from '../../pillars';

export function generateStaticParams() {
  return PILLAR_SLUGS.map((corridor) => ({ corridor }));
}

export async function generateMetadata({ params }: { params: Promise<{ corridor: string }> }): Promise<Metadata> {
  const { corridor } = await params;
  const c = pillarCorridor(corridor);
  if (!c) return {};
  return {
    title: `${c.label} — India’s ecosystem mapped, layer by layer | The Atlas`,
    description: PILLAR_THESIS[c.code],
    alternates: { canonical: `${SITE}/research/pillars/${corridor}/` },
  };
}

const RISK_COLOR: Record<string, string> = { import: '#B23B3B', contested: '#C99A3A', india: '#4FA88B' };
const RISK_LABEL: Record<string, string> = { import: 'Import-dependent', contested: 'Contested', india: 'Indian capability' };
const KIND_CLASS: Record<string, string> = { foreign: 'pm-foreign', india: 'pm-india', neutral: 'pm-neutral' };

export default async function PillarPage({ params }: { params: Promise<{ corridor: string }> }) {
  const { corridor } = await params;
  const c = pillarCorridor(corridor);
  if (!c) notFound();
  const code = c.code;
  const accent = cmeta(code).accent;
  const stats = pillarStats(code);
  const streams = streamsOf(code);
  const chokes = chokepoints(code);
  const roles = playersByRole(code);
  const cross = crossPillarEdges(code);

  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([
          { name: 'Home', path: '/' },
          { name: 'The Atlas', path: '/research/' },
          { name: 'Pillars', path: '/research/pillars/' },
          { name: c.label, path: `/research/pillars/${corridor}/` },
        ]),
        {
          '@context': 'https://schema.org', '@type': 'Dataset',
          name: `${c.label} — Techadyant Atlas pillar map`,
          description: PILLAR_THESIS[code],
          url: `${SITE}/research/pillars/${corridor}/`,
          isPartOf: { '@id': `${SITE}/#website` }, publisher: ORG_REF,
          keywords: [c.label, 'India', 'supply chain', 'import dependency', 'strategic industries'],
        },
      ]} />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">The Atlas</Link><span className="sep">/</span>
            <Link href="/research/pillars/">Pillars</Link><span className="sep">/</span><span>{c.label}</span>
          </div>
          <div className="ed-kicker" style={{ color: accent }}>Pillar map</div>
          <h1>{c.label}</h1>
          <p className="lede">{PILLAR_THESIS[code]}</p>
          <div className="atlas-meta-row">
            <span><b>{stats.players}</b> players</span>
            <span><b>{stats.relationships}</b> relationships</span>
            <span><b>{stats.chokepoints}</b> chokepoints</span>
            <span><b>{stats.indiaPct}%</b> India-based</span>
          </div>
        </div>
      </header>

      {streams.length > 0 && (
        <section className="wrap">
          <div className="section-head-ed"><div><div className="ed-kicker">The stack</div><h2>Where the value sits</h2></div>
            <p className="section-note">Each layer and the chokepoints inside it, coloured by where India stands.</p>
          </div>
          <div className="pillar-stack">
            {streams.map((s) => (
              <div key={s.id} className="pstack-row" style={{ ['--risk' as string]: RISK_COLOR[s.risk] }}>
                <div className="pstack-head">
                  <h3><Link href={`/research/players/${playerSlug(s.id)}/`}>{s.name}</Link></h3>
                  <span className="pstack-risk">{RISK_LABEL[s.risk]}</span>
                </div>
                {s.members.length > 0 && (
                  <div className="pstack-members">
                    {s.members.map((m) => (
                      <Link key={m.id} href={`/research/players/${playerSlug(m.id)}/`} className={`pm ${KIND_CLASS[m.kind]}`}>{m.name}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="pstack-legend">
            <span><i className="pm-india" /> Indian capability</span>
            <span><i className="pm-foreign" /> Foreign-controlled</span>
            <span><i className="pm-neutral" /> Global / neutral</span>
          </div>
        </section>
      )}

      {chokes.length > 0 && (
        <section className="wrap" style={{ background: 'var(--bg-2)' }}>
          <div className="section-head-ed"><div><div className="ed-kicker">Who holds the veto</div><h2>Chokepoints</h2></div>
            <p className="section-note">Who controls each layer, and how much — ranked by concentration.</p>
          </div>
          <div className="pchoke-table">
            <div className="pchoke-row pchoke-h"><span>Controller</span><span>Layer / input</span><span>Share</span><span className="pchoke-note">Note</span></div>
            {chokes.slice(0, 30).map((k, i) => (
              <div key={i} className="pchoke-row">
                <span><Link href={`/research/players/${playerSlug(k.sourceId)}/`}>{k.source}</Link></span>
                <span className="pchoke-rel">{k.type === 'controls' ? 'controls' : 'depends on'} <Link href={`/research/players/${playerSlug(k.targetId)}/`}>{k.target}</Link></span>
                <span className="pchoke-mag">{fmtMagnitude(k.magnitude, k.unit) || '—'}</span>
                <span className="pchoke-note">{k.description}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {roles.length > 0 && (
        <section className="wrap">
          <div className="section-head-ed"><div><div className="ed-kicker">The ecosystem</div><h2>Players by role</h2></div>
            <Link href="/research/players/" className="see-all">All players →</Link>
          </div>
          {roles.map((r) => (
            <div key={r.label} className="prole">
              <div className="prole-label">{r.label} <span>({r.players.length})</span></div>
              <div className="prole-chips">
                {r.players.map((p) => (
                  <Link key={p.id} href={`/research/players/${playerSlug(p.id)}/`} className={`prole-chip ${p.type_code === 'foreign_supplier' ? 'is-foreign' : p.country === 'IN' ? 'is-india' : ''}`}>{p.name}</Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {cross.length > 0 && (
        <section className="wrap" style={{ background: 'var(--bg-2)' }}>
          <div className="section-head-ed"><div><div className="ed-kicker">The moat</div><h2>Where this pillar connects</h2></div>
            <p className="section-note">Cross-pillar links only Techadyant can show — one graph, not five silos.</p>
          </div>
          <ul className="pcross" role="list">
            {cross.map((e, i) => (
              <li key={i}>
                <span className="pcross-a">{e.inThisName}</span>
                <span className="pcross-rel">{e.rel.type_label.toLowerCase()}</span>
                <Link href={`/research/players/${playerSlug(e.otherId)}/`} className="pcross-b">{e.otherName}</Link>
                <Link href={`/research/pillars/${e.otherSlug}/`} className="pcross-pill">{e.otherLabel}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
