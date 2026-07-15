import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../../../AtlasNav';
import { companies, companyBySlug, platformsForCompany, componentsForCompany } from '../../data';

export function generateStaticParams() { return companies.map((c) => ({ slug: c.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = companyBySlug(slug);
  if (!c) return { title: 'Company — UAS Atlas' };
  return {
    title: `${c.name} — India UAS Atlas${c.country ? ` (${c.country})` : ''}`,
    description: `${c.name}: ${[c.type, c.country, c.hq].filter(Boolean).join(' · ')}. ${c.products || 'Drone platforms, components and profile in India\'s UAS ecosystem.'}`.slice(0, 250),
    alternates: { canonical: `https://labs.techadyant.com/research/drones-uas/company/${c.slug}/` },
  };
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = companyBySlug(slug);
  if (!c) return <><AtlasNav /><section className="wrap"><p>Company not found.</p></section></>;
  const plats = platformsForCompany(c.name);
  const comps = componentsForCompany(c.name);
  const ld = {
    '@context': 'https://schema.org', '@type': 'Organization', name: c.name, foundingDate: c.founded || undefined,
    address: c.hq || undefined, url: c.web ? (c.web.startsWith('http') ? c.web : `https://${c.web}`) : undefined,
    description: c.products || `${c.name} — India UAS ecosystem`,
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
            <Link href="/research/drones-uas/">Unmanned Systems</Link><span className="sep">/</span><span>{c.name}</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)' }}>{[c.type, c.country].filter(Boolean).join(' · ')}</div>
          <h1>{c.name}</h1>
          {c.products && <p className="lede">{c.products}</p>}
        </div>
      </header>
      <section className="wrap" style={{ display: 'grid', gap: 26 }}>
        <div style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.8 }}>
          {c.hq && <div>Headquarters: {c.hq}</div>}
          {c.founded && <div>Founded: {c.founded}</div>}
          {c.parent && c.parent !== 'Independent' && <div>Parent: {c.parent}</div>}
          {c.indig && <div>Indigenous content: <span style={{ color: 'var(--brass)' }}>{c.indig}</span></div>}
          {c.dgca && c.dgca.toLowerCase().startsWith('y') && <div>DGCA-certified</div>}
          {c.web && <div>Website: <a href={c.web.startsWith('http') ? c.web : `https://${c.web}`} target="_blank" rel="noreferrer" style={{ color: 'var(--link, #6cb0ff)' }}>{c.web} ↗</a></div>}
        </div>

        {plats.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Platforms · {plats.length}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {plats.map((p) => (
                <li key={p.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px' }}>
                  <Link href={`/research/drones-uas/platform/${p.slug}/`} style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', textDecoration: 'none' }}>{p.name}</Link>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--brass)', marginLeft: 8 }}>{p.category}</span>
                  {p.status && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}> · {p.status}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {comps.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Components supplied · {comps.length}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {comps.map((x) => (
                <li key={x.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px' }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{x.name}</span>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--brass)', marginLeft: 8 }}>{x.type}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div><Link href="/research/drones-uas/" style={{ color: 'var(--text-dim)', fontSize: 13 }}>← Back to the UAS Atlas</Link></div>
      </section>
    </>
  );
}
