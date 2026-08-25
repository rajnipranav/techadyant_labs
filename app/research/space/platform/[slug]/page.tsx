import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../../../AtlasNav';
import { platforms, platformBySlug, companies, crossAtlas } from '../../data';

export function generateStaticParams() { return platforms.map((p) => ({ slug: p.slug })); }
export const dynamicParams = false;

const companySlug = (name: string) => companies.find((c) => c.name === name)?.slug;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = platformBySlug(slug);
  if (!p) return { title: 'Platform — Space Atlas' };
  const bits = [p.category, p.origin === 'IN' ? 'India' : p.origin, p.mfr].filter(Boolean).join(' · ');
  return {
    title: `${p.name} — India Space Atlas${p.category ? ` (${p.category})` : ''}`,
    description: `${p.name}${p.variant ? ` (${p.variant})` : ''}: ${bits}. ${p.desc || 'Specifications, operator and role in India\'s space ecosystem.'}`.slice(0, 250),
    alternates: { canonical: `https://labs.techadyant.com/research/space/platform/${p.slug}/` },
  };
}

export default async function SpacePlatformPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = platformBySlug(slug);
  if (!p) return <><AtlasNav /><section className="wrap"><p>Platform not found.</p></section></>;
  const origin = p.origin === 'IN' ? 'India' : p.origin;
  const cslug = companySlug(p.mfr);
  const specs = [p.category, p.variant, p.orbit && `${p.orbit} orbit`, p.payload_kg != null ? `${p.payload_kg.toLocaleString('en-IN')} kg payload` : null].filter(Boolean) as string[];
  const cross = crossAtlas(`${p.category} ${p.desc}`);
  const ld = {
    '@context': 'https://schema.org', '@type': 'Thing', name: p.name, category: p.category,
    description: p.desc || `${p.name} space platform`, manufacturer: { '@type': 'Organization', name: p.mfr },
    countryOfOrigin: origin, url: `https://labs.techadyant.com/research/space/platform/${p.slug}/`,
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
            <Link href="/research/space/">Space</Link><span className="sep">/</span><span>{p.name}</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)' }}>{p.category} · {origin}{p.status ? ` · ${p.status}` : ''}</div>
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
            {p.mfr && <div>Maker: {cslug ? <Link href={`/research/space/company/${cslug}/`} style={{ color: 'var(--link, #6cb0ff)' }}>{p.mfr}</Link> : p.mfr}</div>}
            {p.operator && <div>Operator: {p.operator}</div>}
            {p.orbit && <div>Orbit: {p.orbit}</div>}
            {p.status && <div>Status: {p.status}</div>}
          </div>
        </div>

        {cross.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Cross-links</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {cross.map((l) => <Link key={l.label} href={l.href} style={{ fontSize: 12, color: 'var(--link, #6cb0ff)' }}>→ {l.label} in the Atlas</Link>)}
            </div>
          </div>
        )}

        <div style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 10, padding: '16px 18px', background: 'var(--bg-2, rgba(255,255,255,.02))' }}>
          <div className="ed-kicker" style={{ marginBottom: 8 }}>Go deeper</div>
          <Link href="/research/space/" style={{ color: 'var(--text-dim)', fontSize: 13 }}>← Back to the Space Atlas</Link>
        </div>
      </section>
    </>
  );
}
