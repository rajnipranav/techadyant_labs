import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../../../AtlasNav';
import { platformBySlug, platforms, systemsForPlatform, locForPlatform, depsForPlatform, mroForPlatform, progsForPlatform, companySlug, DEPTH_LABEL } from '../../data';
import { Sources } from '../../Sources';

import { listStaticParamsForBase } from "../../../../../lib/loadDossier";

export function generateStaticParams() {
  return listStaticParamsForBase("/research/military-aerospace/platform/");
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = platformBySlug(slug);
  if (!p) return { title: 'Platform - Military Aerospace Atlas' };
  return {
    title: `${p.name} - India Military Transport Aircraft Manufacturing`,
    description: `${p.name}: ${[p.payload_tonnes ? `${p.payload_tonnes} t payload` : null, p.range_km ? `${p.range_km.toLocaleString('en-IN')} km range` : null, p.engine].filter(Boolean).join(', ') || 'specifications'}. ${p.localization_summary || `Indian production status, industrial partner and supply chain in India's military transport aircraft ecosystem.`}`.slice(0, 250),
    alternates: { canonical: `https://labs.techadyant.com/research/military-aerospace/platform/${p.slug}/` },
  };
}

export default async function PlatformPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = platformBySlug(slug);
  if (!p) return <><AtlasNav /><section className="wrap"><p>Platform not found.</p></section></>;
  const systems = systemsForPlatform(p.id);
  const locs = locForPlatform(p.id);
  const deps = depsForPlatform(p.id);
  const mros = mroForPlatform(p.id);
  const progs = progsForPlatform(p.id);
  const partnerSlug = companySlug(p.indian_partner_id);
  const mfrSlug = companySlug(p.manufacturer_id);
  const specs = [
    p.payload_tonnes != null ? `${p.payload_tonnes} t payload` : null,
    p.range_km ? `${p.range_km.toLocaleString('en-IN')} km range` : null,
    p.cruise_speed_kmh ? `${p.cruise_speed_kmh} km/h cruise` : null,
    p.service_ceiling_ft ? `${p.service_ceiling_ft.toLocaleString('en-IN')} ft ceiling` : null,
    p.engine, p.propeller,
  ].filter(Boolean) as string[];
  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.name, category: p.category.replace(/-/g, ' '),
    description: p.localization_summary || `${p.name} - military transport aircraft in India's ecosystem`,
    manufacturer: { '@type': 'Organization', name: p.manufacturer_name },
    countryOfOrigin: p.country, url: `https://labs.techadyant.com/research/military-aerospace/platform/${p.slug}/`,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Localization depth (max)', value: p.localization_depth_max },
      { '@type': 'PropertyValue', name: 'Production status', value: p.production_status },
    ],
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
            <Link href="/research/military-aerospace/">Military Aerospace</Link><span className="sep">/</span><span>{p.name}</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass-cream, #E6D1A0)' }}>
            {p.category.replace(/-/g, ' ')} · {p.production_status.replace(/-/g, ' ')}
            {p.indicative && <span className="ma-ind" style={{ marginLeft: 10 }}>Indicative</span>}
          </div>
          <h1>{p.name}</h1>
          {p.localization_summary && <p className="lede">{p.localization_summary}</p>}
        </div>
      </header>
      <section className="wrap" style={{ display: 'grid', gap: 26 }}>
        <div>
          <div className="ed-kicker" style={{ marginBottom: 10 }}>Specifications</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {specs.map((s) => <span key={s} style={{ fontSize: 12.5, fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--text-dim)', border: '1px solid var(--border, rgba(255,255,255,.14))', borderRadius: 6, padding: '4px 10px' }}>{s}</span>)}
          </div>
          <div style={{ marginTop: 12, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.8 }}>
            <div>Maker: {mfrSlug ? <Link href={`/research/military-aerospace/company/${mfrSlug}/`} style={{ color: 'var(--link, #6cb0ff)' }}>{p.manufacturer_name}</Link> : p.manufacturer_name}</div>
            {p.indian_partner_name && <div>Indian partner: {partnerSlug ? <Link href={`/research/military-aerospace/company/${partnerSlug}/`} style={{ color: 'var(--link, #6cb0ff)' }}>{p.indian_partner_name}</Link> : p.indian_partner_name} · {p.indian_partner_role}</div>}
            {p.country && <div>Country of origin: {p.country}</div>}
            {p.role && <div>Role: {p.role}</div>}
            {p.range_notes && <div>Range: {p.range_notes}</div>}
            {p.payload_notes && <div>Payload: {p.payload_notes}</div>}
          </div>
        </div>

        {p.indian_relevance && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Why it matters for India</div>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.75 }}>{p.indian_relevance}</p>
          </div>
        )}

        {p.indian_production_status && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Indian production status</div>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.75 }}>{p.indian_production_status}</p>
          </div>
        )}

        {locs.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Localization depth · {locs.length} systems</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {locs.map((x) => (
                <li key={x.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px' }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{x.component || x.system}</span>
                  <span style={{ marginLeft: 8, fontSize: 11, fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--brass-cream, #E6D1A0)' }}>{x.localization_depth} · {DEPTH_LABEL[x.localization_depth] || x.localization_status}</span>
                  {x.indicative && <span className="ma-ind" style={{ marginLeft: 8 }}>Indicative</span>}
                  <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>{x.evidence_summary}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {deps.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Import dependencies · {deps.length}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {deps.map((x) => (
                <li key={x.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px' }}>
                  <Link href={`/research/military-aerospace/dependency/${x.slug}/`} style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)', textDecoration: 'none' }}>{x.dependency}</Link>
                  <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: x.criticality === 'CRITICAL' ? '#E24B4A' : x.criticality === 'HIGH' ? '#F5B544' : '#6CB0FF' }}>{x.criticality}</span>
                  {x.indicative && <span className="ma-ind" style={{ marginLeft: 8 }}>Indicative</span>}
                  <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>{x.foreign_oem} · {x.foreign_country} · {x.supply_concentration}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {systems.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>System architecture · {systems.length} records</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {systems.map((x) => (
                <li key={x.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px' }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{[x.system, x.subsystem, x.component].filter(Boolean).join(' → ')}</span>
                  <span style={{ marginLeft: 8, fontSize: 11, textTransform: 'uppercase', color: 'var(--brass-cream, #E6D1A0)' }}>{x.localization_status}</span>
                  {x.indicative && <span className="ma-ind" style={{ marginLeft: 8 }}>Indicative</span>}
                  {x.function && <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>{x.function}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {progs.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Programme milestones · {progs.length}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
              {progs.map((x) => (
                <li key={x.id} style={{ display: 'grid', gridTemplateColumns: '110px 1fr auto', gap: 10, fontSize: 12.5, alignItems: 'baseline' }}>
                  <span style={{ color: 'var(--brass-cream, #E6D1A0)', fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11.5 }}>{x.date}</span>
                  <span style={{ color: 'var(--text)' }}>{x.milestone}</span>
                  <span style={{ fontSize: 10.5, textTransform: 'uppercase', color: 'var(--text-muted)' }}>{x.status}</span>
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
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{x.organisation}</span>
                  <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-muted)' }}>{x.location} · {x.current_status}</span>
                  {x.indicative && <span className="ma-ind" style={{ marginLeft: 8 }}>Indicative</span>}
                  {x.capability && <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>{x.capability}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Sources sources={p.sources} />

        <div><Link href="/research/military-aerospace/" style={{ color: 'var(--text-dim)', fontSize: 13 }}>← Back to the Military Aerospace Atlas</Link></div>
      </section>
    </>
  );
}
