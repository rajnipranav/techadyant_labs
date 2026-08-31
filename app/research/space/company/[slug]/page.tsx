import type { Metadata } from 'next';
import { companyDossierMetadata, renderCompanyDossierPage } from '../../../../_companyDossierPage';
import Link from 'next/link';
import { AtlasNav } from '../../../AtlasNav';
import { companies, companyBySlug, platformsForCompany } from '../../data';
import { listStaticParamsForBase } from '../../../../../lib/loadDossier';
import { getThinRecordBySlug } from "@/lib/thinRegistry";
import { ThinEntityPage } from "@/app/_thinEntityPage";
export function generateStaticParams() { return listStaticParamsForBase("/research/space/company/"); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dossierMetadata = companyDossierMetadata(slug, 'space');
  if (dossierMetadata) return dossierMetadata;
  const thin = getThinRecordBySlug(slug);
  if (thin) {
    return {
      title: `${thin.name} — India Space Atlas`,
      description: thin.summary,
      alternates: { canonical: `https://labs.techadyant.com${thin.path}` },
      robots: { index: false, follow: true },
    };
  }
  const c = companyBySlug(slug);
  if (!c) return { title: 'Company — Space Atlas' };
  return {
    title: `${c.name} — India Space Atlas${c.country && c.country !== 'IN' ? ` (${c.country})` : ''}`,
    description: `${c.name}: ${[c.type, c.hq].filter(Boolean).join(' · ')}. ${c.products || 'Profile in India\'s space ecosystem.'}`.slice(0, 250),
    alternates: { canonical: `https://labs.techadyant.com/research/space/company/${c.slug}/` },
  };
}

export default async function SpaceCompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dossierPage = renderCompanyDossierPage(slug, 'space');
  if (dossierPage) return dossierPage;
  const thin = getThinRecordBySlug(slug);
  if (thin) return <ThinEntityPage record={thin} />;
  const c = companyBySlug(slug);
  if (!c) return <><AtlasNav /><section className="wrap"><p>Company not found.</p></section></>;
  const plats = platformsForCompany(c.name);
  const country = c.country === 'IN' ? 'India' : c.country;
  const ld = {
    '@context': 'https://schema.org', '@type': 'Organization', name: c.name, foundingDate: c.founded && c.founded !== '—' ? c.founded : undefined,
    address: c.hq || undefined, url: c.web ? (c.web.startsWith('http') ? c.web : `https://${c.web}`) : undefined,
    description: c.products || `${c.name} — India space ecosystem`,
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
            <Link href="/research/space/">Space</Link><span className="sep">/</span><span>{c.name}</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)' }}>{[c.type, country].filter(Boolean).join(' · ')}</div>
          <h1>{c.name}</h1>
          {c.products && <p className="lede">{c.products}</p>}
        </div>
      </header>
      <section className="wrap" style={{ display: 'grid', gap: 26 }}>
        <div style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.8 }}>
          {c.hq && <div>Headquarters: {c.hq}</div>}
          {c.founded && c.founded !== '—' && <div>Founded: {c.founded}</div>}
          {c.parent && <div>Parent: {c.parent}</div>}
          {c.status && <div>Status: {c.status}</div>}
          {c.indig && <div>Indigenous capability: <span style={{ color: 'var(--brass)' }}>{c.indig}</span></div>}
          {c.funding_usd_mn != null && <div>Private funding: <span style={{ color: 'var(--brass)' }}>~${c.funding_usd_mn.toLocaleString('en-IN')} Mn</span></div>}
          {c.web && <div>Website: <a href={c.web.startsWith('http') ? c.web : `https://${c.web}`} target="_blank" rel="noreferrer" style={{ color: 'var(--link, #6cb0ff)' }}>{c.web} ↗</a></div>}
        </div>

        {c.notes && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 8 }}>Notes</div>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.7 }}>{c.notes}</p>
          </div>
        )}

        {plats.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Platforms · {plats.length}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {plats.map((p) => (
                <li key={p.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px' }}>
                  <Link href={`/research/space/platform/${p.slug}/`} style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', textDecoration: 'none' }}>{p.name}</Link>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--brass)', marginLeft: 8 }}>{p.category}</span>
                  {p.status && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}> · {p.status}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div><Link href="/research/space/" style={{ color: 'var(--text-dim)', fontSize: 13 }}>← Back to the Space Atlas</Link></div>
      </section>
    </>
  );
}




