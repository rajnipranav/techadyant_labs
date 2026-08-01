import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd, breadcrumb, faqLd, datasetLd, SITE } from '../research/seo';
import { signals } from '../signals/data';
import {
  products, sectorsRanked, statesRanked, topDependencies, buildNowOpportunities,
  overallIndex, latestIndex, indexHistory, productsInSector,
  DEP_TIER_COLOR, TIER_COLOR, inr, usd,
} from './data';

const totalImports = products.reduce((s, p) => s + (p.import_usd_bn || 0), 0);
const first = indexHistory[0];
const delta = +(overallIndex - (first?.overall_index ?? overallIndex)).toFixed(1);
const improving = delta < 0; // lower index = less dependent = improving

export const metadata: Metadata = {
  title: 'India Manufacturing Dependency Monitor — Critical Imports, Scored',
  description:
    `A living index of where India stays import-dependent in manufacturing: ${products.length} strategic products across 12 sectors scored on the Critical Manufacturing Dependency Index, with localisation potential, opportunity surfaces and state capability. Free from Techadyant Labs.`,
  alternates: { canonical: `${SITE}/dependencies/` },
};

const FAQ = [
  { q: 'What is the Critical Manufacturing Dependency Index (CMDI)?', a: `A 0–100 score of how strategically import-dependent India is for a product, weighting import value, supply risk, strategic importance, industrial multiplier and substitutability. India's current composite is ${overallIndex}.` },
  { q: 'Which products is India most dependent on?', a: `The deepest dependencies are ${topDependencies(3).map((p) => p.name).join(', ')} — high import value, concentrated foreign supply and low domestic capability.` },
  { q: 'Where are the best localisation opportunities?', a: `The Build-now surfaces combine high dependency with real feasibility — led by ${buildNowOpportunities(3).map((o) => o.name.replace(/^Localise:\s*/, '')).join(', ')}.` },
  { q: 'How reliable are the numbers?', a: 'The dataset is a modelled intelligence layer: every value carries a confidence tag — Verified (primary source), Reasoned estimate, or Strategic inference. Most product-level scores are reasoned estimates, flagged as such.' },
];

const depSignals = signals.filter((s) => s.domain === 'Critical Manufacturing Dependencies').slice(0, 6);

export default function DependenciesHub() {
  return (
    <>
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'Dependencies', path: '/dependencies/' }]),
        datasetLd({ name: 'India Critical Manufacturing Dependencies', description: `${products.length} strategic imports scored on the CMDI and ten proprietary indices, with localisation potential, opportunity surfaces, state capability and PLI performance.`, path: '/dependencies/', keywords: ['India import dependency', 'critical manufacturing', 'import substitution', 'localisation India', 'CMDI', 'supply chain sovereignty'] }),
        faqLd(FAQ),
      ]} />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-kicker" style={{ color: '#C9A84C' }}>India · Manufacturing sovereignty</div>
          <h1>India&apos;s Manufacturing Dependency Monitor</h1>
          <p className="lede">
            Where does India remain strategically dependent on imports, how is that changing, and where are the next
            industrial opportunities emerging? A living index over {products.length} strategic products — a curated
            subset of the CMDD&apos;s 312 tracked opportunity surfaces — across twelve sectors and thirty-six states,
            scored, sourced and confidence-tagged.
          </p>
        </div>
      </header>

      {/* The Index */}
      <section className="wrap">
        <div className="dep-index">
          <div className="dep-index-num">
            <div className="dep-index-v">{overallIndex}</div>
            <div className="dep-index-l">Dependency Index<span>0 = self-reliant · 100 = fully import-dependent</span></div>
          </div>
          <div className="dep-index-trend">
            <span className="dep-delta" style={{ color: improving ? '#0F8E78' : '#C0392B' }}>
              {improving ? '▼' : '▲'} {Math.abs(delta)} over 12 months
            </span>
            <span className="dep-trend-note">{first?.overall_index} ({first?.month}) → {overallIndex} ({latestIndex?.month}). {improving ? 'Dependence is easing, slowly.' : 'Dependence has deepened.'}</span>
          </div>
          <div className="dep-stats">
            <div><b>{products.length}</b><span>products tracked</span></div>
            <div><b>{usd(totalImports)}</b><span>strategic imports</span></div>
            <div><b>12</b><span>mega-sectors</span></div>
            <div><b>{buildNowOpportunities(99).length}</b><span>Build-now opportunities</span></div>
          </div>
        </div>
        <p className="dep-disclaimer">A modelled intelligence layer — every score is confidence-tagged (Verified / Reasoned estimate / Strategic inference). See <Link href="/dependencies/products/">the full product list</Link> and each product page for sources.</p>
      </section>

      {/* Sectors */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>By sector</div><h2>Where the dependency concentrates</h2></div></div>
        <div className="dep-sector-grid">
          {sectorsRanked.map((s) => (
            <Link key={s.sector_id} href={`/dependencies/sectors/${s.sector_id}/`} className="dep-sector">
              <div className="dep-sector-top"><span className="dep-sector-idx">{s.sector_dependency_index}</span><span className="dep-sector-trend" style={{ color: s.index_trend.direction === 'up' ? '#C0392B' : s.index_trend.direction === 'down' ? '#0F8E78' : '#8593A6' }}>{s.index_trend.direction === 'up' ? '▲' : s.index_trend.direction === 'down' ? '▼' : '■'} {Math.abs(s.index_trend.delta)}</span></div>
              <div className="dep-sector-name">{s.name}</div>
              <div className="dep-sector-meta">{usd(s.total_import_usd_bn)} · {s.critical_product_count} critical products</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Deepest dependencies */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>High risk</div><h2>India&apos;s deepest dependencies</h2></div>
          <Link href="/dependencies/products/" className="see-all">All {products.length} products →</Link></div>
        <ul className="dep-list">
          {topDependencies(12).map((p) => (
            <li key={p.product_id}>
              <Link href={`/dependencies/products/${p.product_id}/`}>
                <span className="dep-cmdi" style={{ color: DEP_TIER_COLOR[p.dependency_tier] || '#8593A6' }}>{p.cmdi}</span>
                <span className="dep-pname">{p.name}</span>
                <span className="dep-psrc">{p.top_source_country}</span>
                <span className="dep-ptag" style={{ background: `${(TIER_COLOR[p.localisation_verdict] || '#8593A6')}22`, color: TIER_COLOR[p.localisation_verdict] || '#8593A6' }}>{p.localisation_verdict}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Opportunity radar */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>Opportunity radar</div><h2>Where to build now</h2></div></div>
        <div className="dep-opp-grid">
          {buildNowOpportunities(9).map((o) => (
            <div key={o.opportunity_id} className="dep-opp">
              <div className="dep-opp-top"><span className="dep-opp-score">{o.opportunity_score}</span><span className="dep-opp-tier" style={{ color: TIER_COLOR[o.tier] }}>{o.tier}</span></div>
              <div className="dep-opp-name">{o.name.replace(/^Localise:\s*/, '')}</div>
              <div className="dep-opp-meta">{inr(o.investment_required_inr_cr)} entry · gov support {o.govt_support}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest signals */}
      {depSignals.length > 0 && (
        <section className="wrap" style={{ background: 'var(--bg-2)' }}>
          <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>Intelligence</div><h2>Latest dependency signals</h2></div>
            <Link href="/signals/" className="see-all">All signals →</Link></div>
          <ul className="dep-siglist">
            {depSignals.map((s) => (
              <li key={s.slug}><Link href={`/signals/${s.slug}/`}>{s.title}</Link></li>
            ))}
          </ul>
        </section>
      )}

      {/* State scorecards + directory (de-orphans state pages) */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>State scorecards</div><h2>Who is positioned to reduce the dependency</h2></div></div>
        <div className="dep-state-grid">
          {statesRanked.map((st) => (
            <Link key={st.state_id} href={`/dependencies/states/${st.state_id}/`} className="dep-state">
              <span className="dep-state-mci">{st.mci_composite}</span>
              <span className="dep-state-name">{st.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Full product directory grouped by sector — server-rendered internal links (no orphans) */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>Directory</div><h2>Every tracked product</h2></div>
          <Link href="/dependencies/products/" className="see-all">Product explorer →</Link></div>
        <div className="dep-dir">
          {sectorsRanked.map((s) => {
            const ps = productsInSector(s.sector_id);
            if (!ps.length) return null;
            return (
              <div key={s.sector_id}>
                <h3><Link href={`/dependencies/sectors/${s.sector_id}/`}>{s.name}</Link> <span>({ps.length})</span></h3>
                <ul className="dep-dir-list">
                  {ps.sort((a, b) => b.cmdi - a.cmdi).map((p) => (
                    <li key={p.product_id}><Link href={`/dependencies/products/${p.product_id}/`}>{p.name}</Link></li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="wrap">
        <p className="note-fine">
          Source: Techadyant Labs — Critical Manufacturing Dependencies (Edition I). This monitor is a modelled intelligence
          layer — the Edition-I snapshot — re-scored over time. Every value is
          confidence-tagged and, where verified, sourced.
        </p>
      </section>
    </>
  );
}
