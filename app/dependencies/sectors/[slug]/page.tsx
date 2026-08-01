import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd, breadcrumb, faqLd, datasetLd, SITE } from '../../../research/seo';
import {
  sectors, sectorBySlug, productsInSector, opportunitiesInSector, companyName,
  pliSchemes, DEP_TIER_COLOR, TIER_COLOR, inr, usd,
} from '../../data';

export function generateStaticParams() {
  return sectors.map((s) => ({ slug: s.sector_id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = sectorBySlug(slug);
  if (!s) return { title: 'Sector' };
  return {
    title: `${s.name} — India's Import Dependency & Localisation Map`,
    description: `India's ${s.name.toLowerCase()} import dependency: ${usd(s.total_import_usd_bn)} of strategic imports across ${s.critical_product_count} critical products, dependency index ${s.sector_dependency_index}, with the localisation opportunities, manufacturers and policies. Free from Techadyant Labs.`.slice(0, 250),
    alternates: { canonical: `${SITE}/dependencies/sectors/${s.sector_id}/` },
  };
}

export default async function SectorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = sectorBySlug(slug);
  if (!s) notFound();
  const prods = productsInSector(s.sector_id).sort((a, b) => b.cmdi - a.cmdi);
  const opps = opportunitiesInSector(s.sector_id).sort((a, b) => b.opportunity_score - a.opportunity_score);
  const plis = pliSchemes.filter((x) => x.sector_id === s.sector_id);
  const faqs = [
    { q: `How import-dependent is India in ${s.name.toLowerCase()}?`, a: `${s.narrative} Its sector dependency index is ${s.sector_dependency_index}/100, on ${usd(s.total_import_usd_bn)} of tracked imports across ${s.critical_product_count} critical products.` },
    { q: `What are the biggest ${s.name.toLowerCase()} localisation opportunities?`, a: opps.slice(0, 3).map((o) => o.name.replace(/^Localise:\s*/, '')).join(', ') || 'See the opportunity list.' },
  ];

  return (
    <>
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'Dependencies', path: '/dependencies/' }, { name: 'Sectors', path: '/dependencies/' }, { name: s.name, path: `/dependencies/sectors/${s.sector_id}/` }]),
        datasetLd({ name: `India ${s.name} import dependency`, description: s.narrative, path: `/dependencies/sectors/${s.sector_id}/`, keywords: [`India ${s.name}`, 'import dependency', 'localisation'] }),
        faqLd(faqs),
      ]} />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/dependencies/">Dependencies</Link><span className="sep">/</span><span>{s.name}</span>
          </div>
          <h1>{s.name}</h1>
          <p className="lede">{s.narrative}</p>
        </div>
      </header>
      <section className="wrap">
        <div className="dep-kpis">
          <div className="dep-kpi"><b>{s.sector_dependency_index}</b><span>Dependency index</span></div>
          <div className="dep-kpi"><b>{usd(s.total_import_usd_bn)}</b><span>Strategic imports</span></div>
          <div className="dep-kpi"><b>{s.critical_product_count}</b><span>Critical products</span></div>
          <div className="dep-kpi"><b style={{ color: s.index_trend.direction === 'up' ? '#C0392B' : s.index_trend.direction === 'down' ? '#0F8E78' : '#8593A6' }}>{s.index_trend.direction === 'up' ? '▲' : s.index_trend.direction === 'down' ? '▼' : '■'} {Math.abs(s.index_trend.delta)}</b><span>12-month trend</span></div>
        </div>
      </section>

      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>Critical products</div><h2>Where the dependency sits</h2></div></div>
        <table className="dep-table">
          <thead><tr><th>Product</th><th>CMDI</th><th>Source</th><th>Import</th><th>Verdict</th></tr></thead>
          <tbody>
            {prods.map((p) => (
              <tr key={p.product_id}>
                <td><Link href={`/dependencies/products/${p.product_id}/`}>{p.name}</Link></td>
                <td><span style={{ color: DEP_TIER_COLOR[p.dependency_tier] || '#8593A6', fontWeight: 700 }}>{p.cmdi}</span></td>
                <td>{p.top_source_country}</td><td>{usd(p.import_usd_bn)}</td>
                <td><span className="dep-vtag" style={{ background: `${(TIER_COLOR[p.localisation_verdict] || '#8593A6')}22`, color: TIER_COLOR[p.localisation_verdict] || '#8593A6' }}>{p.localisation_verdict}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {opps.length > 0 && (
        <section className="wrap" style={{ background: 'var(--bg-2)' }}>
          <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>Opportunity radar</div><h2>Localisation opportunities</h2></div></div>
          <div className="dep-opp-grid">
            {opps.slice(0, 9).map((o) => (
              <div key={o.opportunity_id} className="dep-opp">
                <div className="dep-opp-top"><span className="dep-opp-score">{o.opportunity_score}</span><span className="dep-opp-tier" style={{ color: TIER_COLOR[o.tier] || '#8593A6' }}>{o.tier}</span></div>
                <div className="dep-opp-name">{o.name.replace(/^Localise:\s*/, '')}</div>
                <div className="dep-opp-meta">{inr(o.investment_required_inr_cr)} · gov support {o.govt_support}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {(s.key_indian_manufacturers?.length > 0 || plis.length > 0) && (
        <section className="wrap">
          <div className="dep-two">
            {s.key_indian_manufacturers?.length > 0 && (
              <div><h3>Key Indian manufacturers</h3><p className="dep-chips">{s.key_indian_manufacturers.map((c) => <span key={c} className="dep-chip">{companyName(c)}</span>)}</p></div>
            )}
            {plis.length > 0 && (
              <div><h3>PLI performance</h3><ul className="dep-pli">{plis.map((x) => <li key={x.scheme_id}><span>{x.name.replace(/^PLI (for |Scheme )?/i, '')}</span><b style={{ color: x.utilisation_pct >= 90 ? '#0F8E78' : x.utilisation_pct >= 60 ? '#B5891E' : '#C0392B' }}>{Math.round(x.utilisation_pct)}%</b></li>)}</ul></div>
            )}
          </div>
        </section>
      )}
      <section className="wrap"><p className="note-fine">Confidence: {s.confidence === 'V' ? 'Verified' : s.confidence === 'R' ? 'Reasoned estimate' : 'Strategic inference'}. Part of Techadyant Labs&apos; Critical Manufacturing Dependencies (Edition I).</p></section>
    </>
  );
}
