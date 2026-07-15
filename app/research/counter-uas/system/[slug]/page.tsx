import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../../../AtlasNav';
import { systems, systemBySlug, deploymentsForSystem, intelForSystem, mfrSlug, REPORT } from '../../data';

export function generateStaticParams() { return systems.map((s) => ({ slug: s.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = systemBySlug(slug);
  if (!s) return { title: 'Counter-UAS system — Atlas' };
  return {
    title: `${s.name} — India Counter-UAS Atlas${s.classification ? ` (${s.classification})` : ''}`,
    description: `${s.name}${s.variant ? ` ${s.variant}` : ''}: ${[s.mfr, s.country, s.classification].filter(Boolean).join(' · ')}. Counter-drone system — kill chain, deployments, drone types countered and import dependencies.`.slice(0, 250),
    alternates: { canonical: `https://labs.techadyant.com/research/counter-uas/system/${s.slug}/` },
  };
}

export default async function SystemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = systemBySlug(slug);
  if (!s) return <><AtlasNav /><section className="wrap"><p>System not found.</p></section></>;
  const deps = deploymentsForSystem(s.id, s.name);
  const it = intelForSystem(s.name, s.id);
  const cslug = mfrSlug(s.mfr);
  const ld = { '@context': 'https://schema.org', '@type': 'Product', name: s.name, category: 'Counter-UAS system', manufacturer: { '@type': 'Organization', name: s.mfr }, countryOfOrigin: s.country, url: `https://labs.techadyant.com/research/counter-uas/system/${s.slug}/` };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <AtlasNav />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">The Atlas</Link><span className="sep">/</span>
            <Link href="/research/counter-uas/">Counter-UAS</Link><span className="sep">/</span><span>{s.name}</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)' }}>{[s.classification, s.country, s.status].filter(Boolean).join(' · ')}</div>
          <h1>{s.name}{s.variant ? <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '.6em' }}> {s.variant}</span> : null}</h1>
        </div>
      </header>
      <section className="wrap" style={{ display: 'grid', gap: 26 }}>
        <div style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.8 }}>
          <div>Maker: {cslug ? <Link href={`/research/counter-uas/manufacturer/${cslug}/`} style={{ color: 'var(--link, #6cb0ff)' }}>{s.mfr}</Link> : s.mfr}</div>
          {s.indig != null && <div>Indigenous content: <span style={{ color: 'var(--brass)' }}>{s.indig}%</span>{s.makeInIndia ? ` (${s.makeInIndia})` : ''}</div>}
          {s.mobility && <div>Mobility: {s.mobility}</div>}
          {s.domain && <div>Operational domain: {s.domain}</div>}
          {(s.detRange || s.neutRange) && <div>Ranges: {[s.detRange && `${s.detRange} km detect`, s.neutRange && `${s.neutRange} km neutralise`].filter(Boolean).join(' · ')}</div>}
          {(s.reaction || s.simTargets) && <div>{[s.reaction && `${s.reaction}s reaction`, s.simTargets && `${s.simTargets} simultaneous targets`, s.ai && 'AI-enabled', s.fusion && 'sensor fusion'].filter(Boolean).join(' · ')}</div>}
          {s.partners && <div>Technology partners: {s.partners}</div>}
        </div>
        {s.kill.length > 0 && <div><div className="ed-kicker" style={{ marginBottom: 8 }}>Kill chain</div><div style={{ fontSize: 14, color: 'var(--text)' }}>{s.kill.join('  ›  ')}</div></div>}
        {s.counters.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 8 }}>Drone types countered</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {s.counters.map((cc) => <span key={cc} style={{ fontSize: 12.5, color: 'var(--text-dim)', border: '1px solid var(--border, rgba(255,255,255,.14))', borderRadius: 6, padding: '3px 10px' }}>{cc}</span>)}
            </div>
            <div style={{ marginTop: 8 }}><Link href="/research/drones-uas/" style={{ fontSize: 12.5, color: 'var(--link, #6cb0ff)' }}>→ See these drone classes in the Drone Atlas</Link></div>
          </div>
        )}
        {deps.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Deployments · {deps.length}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {deps.map((d) => (
                <li key={d.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px' }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{d.location}</span>
                  <span style={{ fontSize: 11, color: 'var(--brass)', marginLeft: 8 }}>{d.state}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>{d.status}</span>
                  {d.agency && <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>{d.agency}{d.purpose ? ` — ${d.purpose}` : ''}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}
        {it && (
          <div style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 10, padding: '16px 18px', background: 'var(--bg-2, rgba(255,255,255,.02))' }}>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Intelligence assessment</div>
            <div style={{ display: 'grid', gap: 4, fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }}>
              {([['TRL', it.trl], ['Indigenous', it.indig], ['Chinese dependency', it.china], ['Semiconductor dependency', it.semi], ['AI maturity', it.ai], ['Swarm readiness', it.swarm], ['EW resistance', it.ew], ['GPS-denied', it.gps]] as [string, string][]).filter(([, v]) => v).map(([l, v]) => (
                <div key={l}><span style={{ color: 'var(--brass)', fontWeight: 600 }}>{l}:</span> {v}</div>
              ))}
            </div>
          </div>
        )}
        <div style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 10, padding: '16px 18px' }}>
          <Link href={`/reports/${REPORT.slug}/`} style={{ color: 'var(--brass)' }}>Read: {REPORT.title} →</Link>
          <div style={{ marginTop: 8 }}><Link href="/research/counter-uas/" style={{ color: 'var(--text-dim)', fontSize: 13 }}>← Back to the Counter-UAS Atlas</Link></div>
        </div>
      </section>
    </>
  );
}
