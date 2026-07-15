import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../../../AtlasNav';
import { platforms, platformBySlug, procForPlatform, componentsForPlatform, companySlug, REPORTS, categoryReport, crossAtlas } from '../../data';

export function generateStaticParams() { return platforms.map((p) => ({ slug: p.slug })); }
export const dynamicParams = false;

const num = (v: number | null, u: string) => (v == null ? null : `${v.toLocaleString('en-IN')}${u}`);

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = platformBySlug(params.slug);
  if (!p) return { title: 'Platform — UAS Atlas' };
  const bits = [p.category, p.origin, p.mfr].filter(Boolean).join(' · ');
  return {
    title: `${p.name} — India UAS Atlas${p.category ? ` (${p.category})` : ''}`,
    description: `${p.name}${p.variant ? ` (${p.variant})` : ''}: ${bits}. ${p.desc || `Specifications, operator, procurement history and components in India's drone ecosystem.`}`.slice(0, 250),
    alternates: { canonical: `https://labs.techadyant.com/research/drones-uas/platform/${p.slug}/` },
  };
}

export default function PlatformPage({ params }: { params: { slug: string } }) {
  const p = platformBySlug(params.slug);
  if (!p) return <><AtlasNav /><section className="wrap"><p>Platform not found.</p></section></>;
  const proc = procForPlatform(p.name);
  const comps = componentsForPlatform(p.id);
  const rep = REPORTS[categoryReport(p.category)];
  const cslug = companySlug(p.mfr);
  const specs = [num(p.mtow, ' kg MTOW'), num(p.payload, ' kg payload'), num(p.endurance, ' hr endurance'), num(p.range, ' km range'), num(p.ceiling, ' m ceiling'), num(p.speed, ' km/h'), p.power].filter(Boolean) as string[];
  const totalProc = proc.reduce((s, x) => s + (x.inr_cr || 0), 0);
  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.name, category: p.category,
    description: p.desc || `${p.name} unmanned aerial system`, manufacturer: { '@type': 'Organization', name: p.mfr },
    countryOfOrigin: p.origin, url: `https://labs.techadyant.com/research/drones-uas/platform/${p.slug}/`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <AtlasNav />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">The Atlas</Link><span className="sep">/</span>
            <Link href="/research/drones-uas/">Unmanned Systems</Link><span className="sep">/</span><span>{p.name}</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)' }}>{p.category} · {p.origin}{p.status ? ` · ${p.status}` : ''}</div>
          <h1>{p.name}{p.variant ? <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '.6em' }}> {p.variant}</span> : null}</h1>
          {p.desc && <p className="lede">{p.desc}</p>}
        </div>
      </header>
      <section className="wrap" style={{ display: 'grid', gap: 26 }}>
        <div>
          <div className="ed-kicker" style={{ marginBottom: 10 }}>Specifications</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {specs.map((s) => <span key={s} style={{ fontSize: 12.5, fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--text-dim)', border: '1px solid var(--border, rgba(255,255,255,.14))', borderRadius: 6, padding: '4px 10px' }}>{s}</span>)}
          </div>
          <div style={{ marginTop: 12, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.7 }}>
            {p.mfr && <div>Maker: {cslug ? <Link href={`/research/drones-uas/company/${cslug}/`} style={{ color: 'var(--link, #6cb0ff)' }}>{p.mfr}</Link> : p.mfr}</div>}
            {p.operator && <div>Primary operator: {p.operator}</div>}
            {p.inservice != null && <div>In service: {p.inservice}</div>}
            {p.indig != null && <div>Indigenous content: <span style={{ color: 'var(--brass)' }}>{p.indig}%</span></div>}
            {p.roles && <div>Mission roles: {p.roles}</div>}
            {p.sensors && <div>Sensors: {p.sensors}</div>}
            {p.payloads && <div>Payloads: {p.payloads}</div>}
          </div>
        </div>

        {proc.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Procurement history · {proc.length} contracts · ₹{Math.round(totalProc).toLocaleString('en-IN')} cr</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {proc.map((x) => (
                <li key={x.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px', display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{x.agency}{x.qty ? ` · ${x.qty} units` : ''}{x.date ? ` · ${x.date.slice(0, 4)}` : ''}</span>
                  <span style={{ fontSize: 13, color: 'var(--brass)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{x.inr_cr != null ? `₹${Math.round(x.inr_cr).toLocaleString('en-IN')} cr` : '—'}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {comps.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Components & supply chain</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {comps.map((c) => {
                const x = crossAtlas(`${c.type} ${c.name}`);
                return (
                  <li key={c.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px' }}>
                    <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{c.name}</span>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--brass)', marginLeft: 8 }}>{c.type}</span>
                    <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>{c.supplier || c.mfr}</div>
                    {x.length > 0 && <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>{x.map((l) => <Link key={l.label} href={l.href} style={{ fontSize: 11, color: 'var(--link, #6cb0ff)' }}>→ {l.label} in the Atlas</Link>)}</div>}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 10, padding: '16px 18px', background: 'var(--bg-2, rgba(255,255,255,.02))' }}>
          <div className="ed-kicker" style={{ marginBottom: 8 }}>Go deeper</div>
          <Link href={`/reports/${rep.slug}/`} style={{ color: 'var(--brass)' }}>Read: {rep.title} →</Link>
          <div style={{ marginTop: 8 }}><Link href="/research/drones-uas/" style={{ color: 'var(--text-dim)', fontSize: 13 }}>← Back to the UAS Atlas</Link></div>
        </div>
      </section>
    </>
  );
}
