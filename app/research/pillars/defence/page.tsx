import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../../AtlasNav';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../../seo';
import { ServiceAtlasCard, EntityLink, SourceRefs, StatusBadge, card, kick } from './ui';
import {
  VIEW_META, VIEW_SERVICES, statsForView, asOf,
  entities, programmes, dependencies, opportunities,
  isIndustry, isTech, entitySlug, humanize,
} from './data';

const BASE = '/research/pillars/defence';

const totalSystems = entities.filter((e) => ['platform', 'system', 'weapon', 'component', 'programme'].includes(e.type)).length;

export const metadata: Metadata = {
  title: 'Defence & Dual-Use — India’s defence ecosystem mapped by service | Techadyant',
  description:
    `India's defence ecosystem mapped as one relationship-driven graph across three service Atlases — Army, Navy + Coast Guard, and Air Force. ${totalSystems} systems, ${entities.filter(isIndustry).length} industry entities, ${programmes.length} programmes, ${dependencies.length} scored dependencies. Not an equipment list — the industrial base, procurement, indigenisation and foreign-dependency map behind it.`,
  alternates: { canonical: `${SITE}${BASE}/` },
};

export default function DefenceLanding() {
  const sharedIndustry = entities.filter((e) => isIndustry(e) && (e.service.length > 1 || e.service.includes('joint')));
  const techs = entities.filter(isTech);
  const critDeps = [...dependencies].sort((a, b) => (a.importance === 'critical' ? 0 : 1) - (b.importance === 'critical' ? 0 : 1));
  const procProgs = programmes.filter((p) => p.type === 'procurement');
  const indigenisationProgs = programmes.filter((p) => p.type === 'indigenisation' || p.type === 'policy');
  const crossOpps = opportunities.filter((o) => o.service.length > 1);

  const cardStats = (view: keyof typeof VIEW_SERVICES) => {
    const s = statsForView(VIEW_SERVICES[view]);
    return [
      { label: 'systems', value: s.systems },
      { label: 'industry', value: s.companies },
      { label: 'dependencies', value: s.dependencies },
    ];
  };

  const ld = [
    breadcrumb([
      { name: 'Home', path: '/' },
      { name: 'The Atlas', path: '/research/' },
      { name: 'Pillars', path: '/research/pillars/' },
      { name: 'Defence', path: `${BASE}/` },
    ]),
    {
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: 'Defence & Dual-Use — Techadyant Atlas',
      url: `${SITE}${BASE}/`, isPartOf: { '@id': `${SITE}/#website` }, publisher: ORG_REF,
      hasPart: (['army', 'maritime', 'air_force'] as const).map((v) => ({
        '@type': 'WebPage', name: VIEW_META[v].label, url: `${SITE}${BASE}/${VIEW_META[v].route}/`,
      })),
    },
  ];

  return (
    <>
      <AtlasNav />
      <JsonLd data={ld} />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">The Atlas</Link><span className="sep">/</span>
            <Link href="/research/pillars/">Pillars</Link><span className="sep">/</span><span>Defence</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass-cream, #E6D1A0)' }}>Defence &amp; Dual-Use · India</div>
          <h1>India&apos;s defence ecosystem, mapped by service</h1>
          <p className="lede">
            Not a catalogue of equipment — a relationship-driven map of the industrial base behind it. Every platform is
            tied to its manufacturer, suppliers, subsystems, programmes, procurement stage, indigenisation status and
            foreign dependencies, in one graph shared across three service Atlases. A supplier that serves the Army, Navy
            and Air Force appears once, reachable from each. Draft policy is labelled draft; every current claim carries
            its primary source.
          </p>
          <div className="atlas-meta-row">
            <span><b>{totalSystems}</b> systems</span>
            <span><b>{entities.filter(isIndustry).length}</b> industry entities</span>
            <span><b>{programmes.length}</b> programmes</span>
            <span><b>{dependencies.length}</b> dependencies</span>
            <span className="atlas-updated">Updated {new Date(asOf).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </header>

      {/* Three service Atlases */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">Three service Atlases</div><h2>Choose a service to explore</h2></div></div>
        <div className="atlas-cards">
          <ServiceAtlasCard href={`${BASE}/army/`} title="Army Atlas" kicker={VIEW_META.army.kicker} blurb={VIEW_META.army.blurb} accent={VIEW_META.army.accent} stats={cardStats('army')} />
          <ServiceAtlasCard href={`${BASE}/navy-coast-guard/`} title="Navy + Coast Guard Atlas" kicker={VIEW_META.maritime.kicker} blurb={VIEW_META.maritime.blurb} accent={VIEW_META.maritime.accent} stats={cardStats('maritime')} />
          <ServiceAtlasCard href={`${BASE}/air-force/`} title="Air Force Atlas" kicker={VIEW_META.air_force.kicker} blurb={VIEW_META.air_force.blurb} accent={VIEW_META.air_force.accent} stats={cardStats('air_force')} />
        </div>
      </section>

      {/* Cross-service intelligence */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker">Cross-service intelligence</div><h2>The industrial base beneath all three</h2></div>
          <p className="section-note">Shared suppliers, procurement, indigenisation, strategic technologies and foreign dependencies — the layer only a single graph can show. Each links into the relevant Atlas.</p>
        </div>

        <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {/* Defence industrial base */}
          <div style={card}>
            <div style={{ ...kick, marginBottom: 10 }}>Defence industrial base · shared suppliers</div>
            <p style={{ fontSize: 12.5, color: 'var(--text-dim)', margin: '0 0 10px', lineHeight: 1.55 }}>PSUs, JVs and OEMs that serve more than one service — mapped once, not duplicated.</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {sharedIndustry.map((e) => (
                <Link key={e.id} href={`${BASE}/entity/${entitySlug(e.id)}/`} style={{ fontSize: 12.5, color: 'var(--text)', textDecoration: 'none', border: '1px solid var(--border, rgba(255,255,255,.14))', borderRadius: 7, padding: '4px 9px' }}>{e.name}</Link>
              ))}
            </div>
          </div>

          {/* Strategic technologies */}
          <div style={card}>
            <div style={{ ...kick, marginBottom: 10 }}>Strategic technologies</div>
            <p style={{ fontSize: 12.5, color: 'var(--text-dim)', margin: '0 0 10px', lineHeight: 1.55 }}>Cross-cutting capability layers — sensors, EW, propulsion, materials, comms — that recur across services.</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {techs.map((e) => (
                <Link key={e.id} href={`${BASE}/entity/${entitySlug(e.id)}/`} style={{ fontSize: 12.5, color: 'var(--text)', textDecoration: 'none', border: '1px solid var(--border, rgba(255,255,255,.14))', borderRadius: 7, padding: '4px 9px' }}>{e.name}</Link>
              ))}
            </div>
          </div>

          {/* Foreign dependencies */}
          <div style={card}>
            <div style={{ ...kick, marginBottom: 10 }}>Foreign dependencies</div>
            <p style={{ fontSize: 12.5, color: 'var(--text-dim)', margin: '0 0 10px', lineHeight: 1.55 }}>Where strategic dependencies sit — only those the data marks critical are shown in red.</p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 7 }}>
              {critDeps.map((d) => (
                <li key={d.id} style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: d.importance === 'critical' ? '#E24B4A' : '#F5B544' }}>{d.importance}</span>{' '}
                  <EntityLink id={d.dependent} style={{ fontSize: 12.5 }} /> <span style={{ color: 'var(--text-muted)' }}>·</span> {humanize(d.category)} <SourceRefs refs={d.source_refs} />
                </li>
              ))}
            </ul>
          </div>

          {/* Procurement */}
          <div style={card}>
            <div style={{ ...kick, marginBottom: 10 }}>Procurement pipeline</div>
            <p style={{ fontSize: 12.5, color: 'var(--text-dim)', margin: '0 0 10px', lineHeight: 1.55 }}>Live acquisition programmes — AoN kept distinct from contract, production and delivery.</p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 7 }}>
              {procProgs.map((p) => (
                <li key={p.id} style={{ fontSize: 12.5, color: 'var(--text)', display: 'flex', gap: 6, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600 }}>{p.name}</span><StatusBadge status={p.status} /><SourceRefs refs={p.source_refs} />
                </li>
              ))}
            </ul>
          </div>

          {/* Indigenisation */}
          <div style={card}>
            <div style={{ ...kick, marginBottom: 10 }}>Indigenisation &amp; policy</div>
            <p style={{ fontSize: 12.5, color: 'var(--text-dim)', margin: '0 0 10px', lineHeight: 1.55 }}>Positive Indigenisation Lists and the acquisition-policy framework (DAP 2026 is draft, not law).</p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 7 }}>
              {indigenisationProgs.map((p) => (
                <li key={p.id} style={{ fontSize: 12.5, color: 'var(--text)', display: 'flex', gap: 6, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600 }}>{p.name}</span><StatusBadge status={p.status} /><SourceRefs refs={p.source_refs} />
                </li>
              ))}
            </ul>
          </div>

          {/* Emerging opportunities */}
          <div style={card}>
            <div style={{ ...kick, marginBottom: 10 }}>Emerging industrial opportunities</div>
            <p style={{ fontSize: 12.5, color: 'var(--text-dim)', margin: '0 0 10px', lineHeight: 1.55 }}>Evidence-backed surfaces that recur across services.</p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {crossOpps.map((o) => (
                <li key={o.id} style={{ borderLeft: '2px solid var(--brass, #F5B544)', paddingLeft: 10 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)' }}>{humanize(o.domain)} <SourceRefs refs={o.evidence_refs} /></div>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5 }}>{o.thesis}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 16, lineHeight: 1.6 }}>
          Geographic industrial-cluster mapping (facility-level locations and MRO ecosystems) is a planned enrichment layer for this Atlas and is intentionally not shown until sourced — this database is evidence-led, not an inferred order of battle.
        </p>
      </section>

      {/* Related */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">Related research</div><h2>Adjacent Atlases</h2></div></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
          <Link href="/research/military-aerospace/" style={{ color: 'var(--link, #6cb0ff)' }}>Military Aerospace Atlas — transport aircraft manufacturing</Link>
          <Link href="/research/drones-uas/" style={{ color: 'var(--link, #6cb0ff)' }}>Unmanned Systems (Drones/UAS) Atlas</Link>
          <Link href="/research/counter-uas/" style={{ color: 'var(--link, #6cb0ff)' }}>Counter-UAS Atlas</Link>
          <Link href="/research/dependencies/" style={{ color: 'var(--link, #6cb0ff)' }}>Import Dependency Map</Link>
        </div>
      </section>
    </>
  );
}
