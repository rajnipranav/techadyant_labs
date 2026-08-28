// Server component shell shared by the three service Atlas routes (Army, Navy + Coast
// Guard, Air Force). Parameterised by `view` — one implementation, no duplication.
import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../../AtlasNav';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../../seo';
import { DefenceAtlasView } from './DefenceAtlasView';
import { DefenceTrack } from './DefenceTrack';
import {
  VIEW_META, VIEW_SERVICES, ROUTE_BY_VIEW, entitiesForServices, statsForView,
  domainsForView, isSystem, isIndustry, entitySlug, asOf,
  layersForServices, signalsForServices,
  type ViewCode,
} from './data';
import { LayerScores, SignalsTimeline } from '../../AtlasLayers';

const BASE = '/research/pillars/defence';

export function serviceMetadata(view: ViewCode): Metadata {
  const m = VIEW_META[view];
  const s = statsForView(VIEW_SERVICES[view]);
  return {
    title: `${m.label} — India's defence ecosystem mapped by service | Techadyant`,
    description: `${m.blurb} ${s.systems} systems, ${s.companies} industry entities, ${s.programmes} programmes and ${s.dependencies} scored dependencies — every figure sourced.`,
    alternates: { canonical: `${SITE}${BASE}/${ROUTE_BY_VIEW[view]}/` },
  };
}

export function ServiceAtlasShell({ view }: { view: ViewCode }) {
  const m = VIEW_META[view];
  const svc = VIEW_SERVICES[view];
  const s = statsForView(svc);
  const ents = entitiesForServices(svc);
  const systems = ents.filter(isSystem);
  const industry = ents.filter(isIndustry);
  const domains = domainsForView(svc);
  const route = ROUTE_BY_VIEW[view];
  const packLayers = layersForServices(svc);
  const packSignals = signalsForServices(svc);

  const ld = [
    breadcrumb([
      { name: 'Home', path: '/' },
      { name: 'The Atlas', path: '/research/' },
      { name: 'Defence', path: `${BASE}/` },
      { name: m.label, path: `${BASE}/${route}/` },
    ]),
    {
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: `${m.label} — Techadyant Defence Atlas`,
      url: `${SITE}${BASE}/${route}/`, isPartOf: { '@id': `${SITE}${BASE}/` }, publisher: ORG_REF,
      hasPart: [...systems, ...industry].slice(0, 40).map((e) => ({
        '@type': 'WebPage', name: e.name, url: `${SITE}${BASE}/entity/${entitySlug(e.id)}/`,
      })),
    },
    {
      '@context': 'https://schema.org', '@type': 'Dataset',
      name: `${m.label} — India defence industrial intelligence`,
      description: m.blurb,
      url: `${SITE}${BASE}/${route}/`, creator: ORG_REF, publisher: ORG_REF,
      license: 'https://creativecommons.org/licenses/by/4.0/', isAccessibleForFree: true,
      dateModified: asOf, spatialCoverage: { '@type': 'Place', name: 'India' },
      variableMeasured: ['procurement stage', 'indigenisation tier', 'dependency importance', 'service'],
    },
  ];

  return (
    <>
      <JsonLd data={ld} />
      <AtlasNav />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">The Atlas</Link><span className="sep">/</span>
            <Link href={`${BASE}/`}>Defence</Link><span className="sep">/</span><span>{m.label}</span>
          </div>
          <div className="ed-kicker" style={{ color: m.accent }}>{m.kicker}</div>
          <h1>{m.label}</h1>
          <p className="lede">{m.blurb}</p>
          <div className="atlas-meta-row">
            <span><b>{s.systems}</b> systems</span>
            <span><b>{s.companies}</b> industry entities</span>
            <span><b>{s.programmes}</b> programmes</span>
            <span><b>{s.dependencies}</b> dependencies</span>
            <span><b>{s.indigenousPct}%</b> indigenous</span>
            <span className="atlas-updated">Updated {new Date(asOf).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </header>

      <section className="wrap"><DefenceAtlasView view={view} /></section>

      {/* Server-rendered browse strip — crawlable links to every entity in this Atlas */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">Browse</div><h2>Every system, company &amp; domain</h2></div></div>
        <div className="sa-browse">
          <div className="sa-browse-h">Capability domains ({domains.length})</div>
          <div className="sa-browse-row">
            {domains.map((d) => <span key={d.domain} className="sa-blink">{d.label} <span>{d.entities.length}</span></span>)}
          </div>
          <div className="sa-browse-h" style={{ marginTop: 18 }}>Systems &amp; platforms ({systems.length})</div>
          <div className="sa-browse-row">
            {systems.map((e) => <Link key={e.id} href={`${BASE}/entity/${entitySlug(e.id)}/`} className="sa-blink">{e.name}</Link>)}
          </div>
          <div className="sa-browse-h" style={{ marginTop: 18 }}>Industry ({industry.length})</div>
          <div className="sa-browse-row">
            {industry.map((e) => <Link key={e.id} href={`${BASE}/entity/${entitySlug(e.id)}/`} className="sa-blink">{e.name}</Link>)}
          </div>
        </div>
      </section>

      {(packLayers.length > 0 || packSignals.length > 0) && (
        <section className="wrap">
          <div style={{ display: 'grid', gap: 26 }}>
            <LayerScores layers={packLayers} heading={`${m.label} — value chain, scored`} note="0 import-dependent to 5 sovereign. Aug 2026 research pack; each layer traces to a sourced record." />
            <SignalsTimeline signals={packSignals} />
          </div>
        </section>
      )}

      <section className="wrap">
        <div style={{ display: 'grid', gap: 22, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 12, padding: '20px 22px', background: 'var(--bg-2, rgba(255,255,255,.02))' }}>
            <div className="ed-kicker" style={{ marginBottom: 8 }}>Track this ecosystem</div>
            <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>Get an email when the {m.label} and our defence research are updated.</p>
            <DefenceTrack source={`defence-${route}-watch`} />
          </div>
          <div style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 12, padding: '20px 22px', background: 'var(--bg-2, rgba(255,255,255,.02))' }}>
            <div className="ed-kicker" style={{ marginBottom: 8 }}>The rest of Defence</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5 }}>
              <Link href={`${BASE}/`} style={{ color: 'var(--link, #6cb0ff)' }}>Defence &amp; Dual-Use — overview</Link>
              <Link href={`${BASE}/army/`} style={{ color: 'var(--link, #6cb0ff)' }}>Army Atlas</Link>
              <Link href={`${BASE}/navy-coast-guard/`} style={{ color: 'var(--link, #6cb0ff)' }}>Navy + Coast Guard Atlas</Link>
              <Link href={`${BASE}/air-force/`} style={{ color: 'var(--link, #6cb0ff)' }}>Air Force Atlas</Link>
              <Link href="/research/military-aerospace/" style={{ color: 'var(--link, #6cb0ff)' }}>Military Aerospace Atlas</Link>
              <Link href="/research/drones-uas/" style={{ color: 'var(--link, #6cb0ff)' }}>Unmanned Systems Atlas</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
