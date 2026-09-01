import type { Metadata } from 'next';
import { companyDossierMetadata, renderCompanyDossierPage } from '../../../../_companyDossierPage';
import Link from 'next/link';
import { AtlasNav } from '../../../AtlasNav';
import { companies, companyBySlug, platformsForCompany, suppliersForCompany, geoForCompany, mroForCompany, TIER_LABEL } from '../../data';
import { Sources } from '../../Sources';
import { listStaticParamsForBase } from '../../../../../lib/loadDossier';
import { getThinRecordBySlug } from "@/lib/thinRegistry";
import { ThinEntityPage } from "@/app/_thinEntityPage";

export function generateStaticParams() { return listStaticParamsForBase("/research/military-aerospace/company/"); }
// dynamicParams removed — thin fallback guarantees 200 for hub-linked slugs

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dossierMetadata = companyDossierMetadata(slug, 'military-aerospace');
  if (dossierMetadata) return dossierMetadata;
  const thin = getThinRecordBySlug(slug);
  if (thin) {
    return {
      title: `${thin.name} — India Military Aerospace Atlas`,
      description: thin.summary,
      alternates: { canonical: `https://labs.techadyant.com${thin.path}` },
      robots: { index: false, follow: true },
    };
  }
  const c = companyBySlug(slug);
  if (!c) return { title: 'Company - Military Aerospace Atlas' };
  return {
    title: `${c.name} - India Military Transport Aircraft Manufacturing`,
    description: `${c.name}: ${[c.type, c.country, c.headquarters].filter(Boolean).join(', ')}. ${c.capability || 'Profile in India\'s military transport aircraft manufacturing ecosystem.'}`.slice(0, 250),
    alternates: { canonical: `https://labs.techadyant.com/research/military-aerospace/company/${c.slug}/` },
  };
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dossierPage = renderCompanyDossierPage(slug, 'military-aerospace');
  if (dossierPage) return dossierPage;
  const thin = getThinRecordBySlug(slug);
  if (thin) return <ThinEntityPage record={thin} />;
  const c = companyBySlug(slug);
  if (!c) return <><AtlasNav /><section className="wrap"><p>Company not found.</p></section></>;
  const plats = platformsForCompany(c.id);
  const rels = suppliersForCompany(c.id);
  const sites = geoForCompany(c.id);
  const mros = mroForCompany(c.id);
  const tiers = Array.isArray(c.tier_per_programme) ? c.tier_per_programme : [];
  const ld = {
    '@context': 'https://schema.org', '@type': 'Organization', name: c.name,
    address: c.headquarters || undefined,
    description: c.capability || `${c.name} - India military transport aircraft ecosystem`,
    knowsAbout: (Array.isArray(c.programmes) ? c.programmes : String(c.programmes || '').split(',')).map((s: string) => String(s).trim()).filter(Boolean).slice(0, 12),
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
            <Link href="/research/military-aerospace/">Military Aerospace</Link><span className="sep">/</span><span>{c.name.split(' (')[0]}</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass-cream, #E6D1A0)' }}>
            {[c.type, c.ownership, c.country].filter(Boolean).join(' · ')}
            {c.indicative && <span className="ma-ind" style={{ marginLeft: 10 }}>Indicative</span>}
          </div>
          <h1>{c.name}</h1>
          {c.capability && <p className="lede">{c.capability}</p>}
        </div>
      </header>
      <section className="wrap" style={{ display: 'grid', gap: 26 }}>
        <div style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.8 }}>
          {c.headquarters && <div>Headquarters: {c.headquarters}</div>}
          {c.country && <div>Country: {c.country}</div>}
          {c.ownership && <div>Ownership: {c.ownership}</div>}
          {c.locations && <div>Locations: {c.locations}</div>}
          {c.indian_manufacturing && <div>Manufacturing in India: {c.indian_manufacturing}</div>}
          {c.partnership && <div>Partnerships: {c.partnership}</div>}
          {c.role && <div>Role: {c.role}</div>}
        </div>

        {plats.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Platforms · {plats.length}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {plats.map((p) => (
                <li key={p.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px' }}>
                  <Link href={`/research/military-aerospace/platform/${p.slug}/`} style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', textDecoration: 'none' }}>{p.name}</Link>
                  <span style={{ marginLeft: 8, fontSize: 11, textTransform: 'uppercase', color: 'var(--brass-cream, #E6D1A0)' }}>{p.category.replace(/-/g, ' ')}</span>
                  <span style={{ marginLeft: 8, fontSize: 11, fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--text-muted)' }}>{p.localization_depth_max}</span>
                  {p.indicative && <span className="ma-ind" style={{ marginLeft: 8 }}>Indicative</span>}
                  {p.indian_partner_name && p.manufacturer_id !== c.id && <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>Indian partner: {p.indian_partner_name}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {rels.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Supplier relationships · {rels.length}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {rels.map((r) => (
                <li key={r.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px' }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{r.context || `${r.source} → ${r.target}`}</span>
                  <span style={{ marginLeft: 8, fontSize: 11, textTransform: 'uppercase', color: 'var(--brass-cream, #E6D1A0)' }}>{TIER_LABEL[r.tier] || r.tier}</span>
                  <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-muted)' }}>{r.confidence}</span>
                  {r.indicative && <span className="ma-ind" style={{ marginLeft: 8 }}>Indicative</span>}
                  {r.evidence_summary && <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>{r.evidence_summary}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tiers.length > 0 && (
          <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
            Tier per programme: {tiers.map((t) => `${t.programme_id.replace('prog-', '')} (${t.tier})`).join(', ')}
          </div>
        )}

        {sites.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Sites · {sites.length}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {sites.map((g) => (
                <li key={g.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px' }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{g.location}</span>
                  <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-muted)' }}>{g.city}, {g.state}</span>
                  {g.indicative && <span className="ma-ind" style={{ marginLeft: 8 }}>Indicative</span>}
                  {g.capability && <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>{g.capability}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {mros.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>MRO · {mros.length}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {mros.map((x) => (
                <li key={x.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px' }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{x.aircraft}</span>
                  <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-muted)' }}>{x.location} · {x.current_status}</span>
                  {x.indicative && <span className="ma-ind" style={{ marginLeft: 8 }}>Indicative</span>}
                  {x.capability && <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>{x.capability}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Sources sources={c.sources} />

        <div><Link href="/research/military-aerospace/" style={{ color: 'var(--text-dim)', fontSize: 13 }}>← Back to the Military Aerospace Atlas</Link></div>
      </section>
    </>
  );
}


