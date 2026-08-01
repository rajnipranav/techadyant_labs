import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd, breadcrumb, faqLd, SITE } from '../../../research/seo';
import { signals } from '../../../signals/data';
import {
  products, productBySlug, sectorBySlug, companyName, factoryById,
  DEP_TIER_COLOR, TIER_COLOR, CONF, inr, usd,
} from '../../data';

const sigTitle = new Map(signals.map((s) => [s.slug, s.title]));

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.product_id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) return { title: 'Product' };
  return {
    title: `${p.name} — India's import dependency, scored`,
    description: `${p.name}: India imports ${usd(p.import_usd_bn)} (mostly from ${p.top_source_country}); CMDI ${p.cmdi}, localisation potential ${p.lpi}. Why India imports it, who makes it, and whether it can be localised.`.slice(0, 250),
    alternates: { canonical: `${SITE}/dependencies/products/${p.product_id}/` },
  };
}

const INDICES: [string, string, string][] = [
  ['cmdi', 'CMDI', 'Dependency'], ['lpi', 'LPI', 'Localisation potential'], ['iai', 'IAI', 'Investment attractiveness'],
  ['sri', 'SRI', 'Supply risk'], ['sci', 'SCI', 'Supply-chain complexity'], ['tri', 'TRI', 'Technology readiness'],
  ['imi', 'IMI', 'Industrial multiplier'], ['nsri', 'NSRI', 'National-security relevance'], ['epi', 'EPI', 'Export potential'], ['icgi', 'ICGI', 'Capability gap'],
];

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) notFound();
  const sector = sectorBySlug(p.mega_sector);
  const conf = CONF[p.confidence];
  const projects = (p.related_projects || []).map((id) => factoryById(id)).filter(Boolean);
  const relSignals = (p.related_signals || []).filter((s) => sigTitle.has(s));

  const faqs = [
    { q: `Why does India import ${p.name}?`, a: p.why_imported },
    { q: `Can India localise ${p.name}?`, a: p.can_india_localise },
    { q: `How dependent is India on ${p.name} imports?`, a: `India imports ${usd(p.import_usd_bn)}, mostly from ${p.top_source_country}. Its Critical Manufacturing Dependency Index is ${p.cmdi}/100 (${p.dependency_tier}), with a localisation potential of ${p.lpi}.` },
  ];

  return (
    <>
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'Dependencies', path: '/dependencies/' }, { name: 'Products', path: '/dependencies/products/' }, { name: p.name, path: `/dependencies/products/${p.product_id}/` }]),
        faqLd(faqs),
        { '@context': 'https://schema.org', '@type': 'Thing', name: p.name, category: sector?.name, description: p.why_it_matters, additionalProperty: [
          { '@type': 'PropertyValue', name: 'Critical Manufacturing Dependency Index', value: p.cmdi },
          { '@type': 'PropertyValue', name: 'Localisation Potential Index', value: p.lpi },
          { '@type': 'PropertyValue', name: 'Import value (USD bn)', value: p.import_usd_bn },
          { '@type': 'PropertyValue', name: 'HS code', value: p.hs_code },
        ] },
      ]} />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/dependencies/">Dependencies</Link><span className="sep">/</span>
            <Link href="/dependencies/products/">Products</Link><span className="sep">/</span><span>{p.name}</span>
          </div>
          <h1>{p.name}</h1>
          <div className="dep-badges">
            <span className="dep-badge" style={{ background: `${DEP_TIER_COLOR[p.dependency_tier]}22`, color: DEP_TIER_COLOR[p.dependency_tier] }}>{p.dependency_tier} dependency</span>
            <span className="dep-badge" style={{ background: `${TIER_COLOR[p.localisation_verdict] || '#8593A6'}22`, color: TIER_COLOR[p.localisation_verdict] || '#8593A6' }}>{p.localisation_verdict}</span>
            {sector && <Link className="dep-badge dep-badge-link" href={`/dependencies/sectors/${sector.sector_id}/`}>{sector.name}</Link>}
            <span className="dep-badge" style={{ background: conf.bg, color: conf.color }}>{conf.label}</span>
            {p.hs_code && <span className="dep-badge" style={{ background: '#eef1f5', color: '#1a2b45' }}>HS {p.hs_code}</span>}
          </div>
        </div>
      </header>

      <section className="wrap">
        <div className="dep-kpis">
          <div className="dep-kpi"><b>{usd(p.import_usd_bn)}</b><span>Annual import</span></div>
          <div className="dep-kpi"><b>{p.india_capability_pct}%</b><span>Indian capability</span></div>
          <div className="dep-kpi"><b>{p.source_hhi.toLocaleString('en-IN')}</b><span>Supplier concentration (HHI)</span></div>
          <div className="dep-kpi"><b>{inr(p.investment_required_inr_cr)}</b><span>To localise</span></div>
        </div>
      </section>

      <section className="wrap-narrow">
        <p className="dep-para"><b>Why India imports it.</b> {p.why_imported}</p>
        <p className="dep-para"><b>Why it matters.</b> {p.why_it_matters}</p>
        <p className="dep-para"><b>Can India localise it?</b> {p.can_india_localise}</p>
        {p.top_3_sources?.length > 0 && (
          <p className="dep-para"><b>Where it comes from.</b> {p.top_3_sources.map((s) => `${s.country} (${s.share_pct}%)`).join(', ')}.</p>
        )}
      </section>

      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>Scorecard</div><h2>The ten indices</h2></div></div>
        <div className="dep-idx-grid">
          {INDICES.map(([k, ab, label]) => {
            const v = ((p as unknown as Record<string, number>)[k]) ?? 0;
            return (
              <div key={ab} className="dep-idx"><div className="dep-idx-bar"><i style={{ width: `${v}%`, background: k === 'cmdi' ? '#C0392B' : k === 'lpi' || k === 'iai' ? '#0F8E78' : '#5A7886' }} /></div>
                <div className="dep-idx-l"><span className="dep-idx-ab">{ab} {v}</span><span className="dep-idx-nm">{label}</span></div></div>
            );
          })}
        </div>
      </section>

      {(p.indian_manufacturers?.length > 0 || p.global_manufacturers?.length > 0) && (
        <section className="wrap" style={{ background: 'var(--bg-2)' }}>
          <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>Who makes it</div><h2>Manufacturers</h2></div></div>
          <div className="dep-two">
            <div><h3>In India</h3><p className="dep-chips">{p.indian_manufacturers?.length ? p.indian_manufacturers.map((c) => <span key={c} className="dep-chip">{companyName(c)}</span>) : <span className="dep-empty">No significant domestic maker.</span>}</p></div>
            <div><h3>Global leaders</h3><p className="dep-chips">{p.global_manufacturers?.length ? p.global_manufacturers.map((c) => <span key={c} className="dep-chip dep-chip-g">{companyName(c)}</span>) : <span className="dep-empty">—</span>}</p></div>
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="wrap">
          <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>On the ground</div><h2>Localisation projects</h2></div></div>
          <ul className="dep-proj">
            {projects.map((f) => f && (
              <li key={f.factory_id}><span className="dep-proj-name">{f.name}</span><span className="dep-proj-meta">{companyName(f.company_id)} · {f.state_id} · {f.status.replace(/_/g, ' ')}{f.investment_inr_cr ? ` · ${inr(f.investment_inr_cr)}` : ''}</span></li>
            ))}
          </ul>
        </section>
      )}

      {relSignals.length > 0 && (
        <section className="wrap" style={{ background: 'var(--bg-2)' }}>
          <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>Intelligence</div><h2>Related signals</h2></div></div>
          <ul className="dep-siglist">{relSignals.map((s) => <li key={s}><Link href={`/signals/${s}/`}>{sigTitle.get(s)}</Link></li>)}</ul>
        </section>
      )}

      {p.sources?.length > 0 && (
        <section className="wrap">
          <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>Sources</div><h2>Primary references</h2></div></div>
          <ul className="dep-src">{p.sources.map((u) => <li key={u}><a href={u} target="_blank" rel="noopener">{u.replace(/^https?:\/\//, '').split('/')[0]} ↗</a></li>)}</ul>
          <p className="note-fine">Confidence: {conf.label}. {p.note || ''} Part of Techadyant Labs&apos; Critical Manufacturing Dependencies (Edition I).</p>
        </section>
      )}
    </>
  );
}
