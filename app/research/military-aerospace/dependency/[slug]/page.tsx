import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../../../AtlasNav';
import { dependencies, dependencyBySlug, platforms, companySlug } from '../../data';
import { Sources } from '../../Sources';

export function generateStaticParams() { return dependencies.map((x) => ({ slug: x.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = dependencyBySlug(slug);
  if (!d) return { title: 'Dependency - Military Aerospace Atlas' };
  return {
    title: `${d.dependency} - Import Dependency in India's Military Transport Aircraft`,
    description: `${d.dependency}: ${d.criticality} dependency for ${d.aircraft}, supplied by ${d.foreign_oem} (${d.foreign_country}), ${d.supply_concentration}. ${d.explanation || 'India’s localization potential and the industrial opportunity.'}`.slice(0, 250),
    alternates: { canonical: `https://labs.techadyant.com/research/military-aerospace/dependency/${d.slug}/` },
  };
}

export default async function DependencyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = dependencyBySlug(slug);
  if (!d) return <><AtlasNav /><section className="wrap"><p>Dependency not found.</p></section></>;
  const plat = platforms.find((p) => p.id === d.aircraft_id);
  const oemSlug = companySlug(d.foreign_oem_id);
  const critColor: Record<string, string> = { CRITICAL: '#E24B4A', HIGH: '#F5B544', MEDIUM: '#6CB0FF', LOW: '#34D399' };
  const ld = {
    '@context': 'https://schema.org', '@type': 'Thing', name: d.dependency,
    description: `${d.criticality} import dependency in India's military transport aircraft manufacturing ecosystem${d.aircraft ? `, affecting the ${d.aircraft}` : ''}.`,
    url: `https://labs.techadyant.com/research/military-aerospace/dependency/${d.slug}/`,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Criticality', value: d.criticality },
      { '@type': 'PropertyValue', name: 'Supply concentration', value: d.supply_concentration },
      { '@type': 'PropertyValue', name: 'Substitution difficulty', value: d.substitution_difficulty },
      { '@type': 'PropertyValue', name: 'Foreign supplier', value: d.foreign_oem },
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
            <Link href="/research/military-aerospace/">Military Aerospace</Link><span className="sep">/</span><span>{d.dependency}</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass-cream, #E6D1A0)' }}>
            {d.criticality} dependency · {d.aircraft || 'multiple platforms'}
            {d.indicative && <span className="ma-ind" style={{ marginLeft: 10 }}>Indicative</span>}
          </div>
          <h1>{d.dependency}</h1>
          {d.explanation && <p className="lede">{d.explanation}</p>}
        </div>
      </header>
      <section className="wrap" style={{ display: 'grid', gap: 26 }}>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {[
            ['Criticality', d.criticality, critColor[d.criticality] || 'var(--text)' ],
            ['Supply concentration', d.supply_concentration === 'single-source' ? 'Single source' : 'Oligopolistic', 'var(--text)'],
            ['Substitution difficulty', d.substitution_difficulty, 'var(--text)'],
            ['Geopolitical sensitivity', d.geopolitical_sensitivity, 'var(--text)'],
            ['Foreign country', d.foreign_country, 'var(--text)'],
            ['Foreign supplier', d.foreign_oem, 'var(--text)'],
          ].map(([k, v, col]) => (
            <div key={k as string} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 10, padding: '12px 14px', background: 'var(--bg-2, rgba(255,255,255,.02))' }}>
              <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-dim)' }}>{k}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 3, color: col as string }}>{v}</div>
            </div>
          ))}
        </div>

        {d.indian_capability && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 8 }}>Indian capability</div>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.7 }}>{d.indian_capability}</p>
          </div>
        )}
        {d.localization_potential && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 8 }}>Localization potential</div>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.7 }}>{d.localization_potential}</p>
          </div>
        )}

        {d.component && (
          <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
            Component: <b style={{ color: 'var(--text)' }}>{d.component}</b> {d.system ? `· System: ${d.system}` : ''}
          </div>
        )}

        {plat && (
          <div style={{ fontSize: 13 }}>
            Affected platform: <Link href={`/research/military-aerospace/platform/${plat.slug}/`} style={{ color: 'var(--link, #6cb0ff)' }}>{plat.name}</Link>
          </div>
        )}

        {oemSlug && (
          <div style={{ fontSize: 13 }}>
            Supplier profile: <Link href={`/research/military-aerospace/company/${oemSlug}/`} style={{ color: 'var(--link, #6cb0ff)' }}>{d.foreign_oem}</Link>
          </div>
        )}

        <Sources sources={d.sources} />

        <div><Link href="/research/military-aerospace/" style={{ color: 'var(--text-dim)', fontSize: 13 }}>← Back to the Military Aerospace Atlas</Link></div>
      </section>
    </>
  );
}
