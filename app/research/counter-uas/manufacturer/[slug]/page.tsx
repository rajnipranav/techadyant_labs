import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../../../AtlasNav';
import { manufacturers, mfrBySlug, systemsForMfr } from '../../data';

export function generateStaticParams() { return manufacturers.map((m) => ({ slug: m.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = mfrBySlug(slug);
  if (!m) return { title: 'Counter-UAS maker — Atlas' };
  return {
    title: `${m.name} — India Counter-UAS Atlas${m.country ? ` (${m.country})` : ''}`,
    description: `${m.name}: ${[m.country, m.hq].filter(Boolean).join(' · ')}. ${m.portfolio || 'Counter-UAS systems, portfolio and profile in India’s counter-drone ecosystem.'}`.slice(0, 250),
    alternates: { canonical: `https://labs.techadyant.com/research/counter-uas/manufacturer/${m.slug}/` },
  };
}

export default async function MfrPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = mfrBySlug(slug);
  if (!m) return <><AtlasNav /><section className="wrap"><p>Manufacturer not found.</p></section></>;
  const sys = systemsForMfr(m.name);
  const ld = { '@context': 'https://schema.org', '@type': 'Organization', name: m.name, foundingDate: m.founded || undefined, address: m.hq || undefined, description: m.portfolio || `${m.name} — India counter-UAS ecosystem` };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <AtlasNav />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">The Atlas</Link><span className="sep">/</span>
            <Link href="/research/counter-uas/">Counter-UAS</Link><span className="sep">/</span><span>{m.name}</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)' }}>{[m.indigenous, m.country].filter(Boolean).join(' · ')}</div>
          <h1>{m.name}</h1>
          {m.portfolio && <p className="lede">{m.portfolio}</p>}
        </div>
      </header>
      <section className="wrap" style={{ display: 'grid', gap: 26 }}>
        <div style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.8 }}>
          {m.hq && <div>Headquarters: {m.hq}</div>}
          {m.founded && <div>Founded: {m.founded}</div>}
          {m.locations && <div>Manufacturing: {m.locations}</div>}
          {m.exports && <div>Exports: {m.exports}</div>}
          {m.certifications && <div>Certifications: {m.certifications}</div>}
        </div>
        {sys.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Counter-UAS systems · {sys.length}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {sys.map((s) => (
                <li key={s.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px' }}>
                  <Link href={`/research/counter-uas/system/${s.slug}/`} style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', textDecoration: 'none' }}>{s.name}</Link>
                  {s.classification && <span style={{ fontSize: 11, color: 'var(--brass)', marginLeft: 8 }}>{s.classification}</span>}
                  {s.status && <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>· {s.status}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div><Link href="/research/counter-uas/" style={{ color: 'var(--text-dim)', fontSize: 13 }}>← Back to the Counter-UAS Atlas</Link></div>
      </section>
    </>
  );
}
