import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { JsonLd, breadcrumb, faqLd, datasetLd, SITE } from '../research/seo';
import { signals } from '../signals/data';
import {
  products, sectorsRanked, statesRanked, topDependencies, buildNowOpportunities,
  overallIndex, latestIndex, indexHistory, productsInSector, pliSchemes, sectorBySlug,
  DEP_TIER_COLOR, TIER_COLOR, inr, usd,
} from './data';

const totalImports = products.reduce((s, p) => s + (p.import_usd_bn || 0), 0);
const first = indexHistory[0];
const delta = +(overallIndex - (first?.overall_index ?? overallIndex)).toFixed(1);
const improving = delta < 0; // lower index = less dependent = improving

// Posture + tier distribution across all tracked products
const verdictCounts = products.reduce((m, p) => { m[p.localisation_verdict] = (m[p.localisation_verdict] || 0) + 1; return m; }, {} as Record<string, number>);
const tierCounts = products.reduce((m, p) => { m[p.dependency_tier] = (m[p.dependency_tier] || 0) + 1; return m; }, {} as Record<string, number>);
const buildNowCount = verdictCounts['Build-now'] || 0;
const positionCount = verdictCounts['Position-early'] || 0;
const watchCount = verdictCounts['Watch'] || 0;
const postureTotal = buildNowCount + positionCount + watchCount || 1;
const criticalCount = tierCounts['Critical'] || 0;
const highCount = tierCounts['High'] || 0;
const moderateCount = (tierCounts['Moderate'] || 0) + (tierCounts['Low'] || 0);

// PLI schemes ranked by outlay
const pliRanked = [...pliSchemes].sort((a, b) => b.outlay_inr_cr - a.outlay_inr_cr).slice(0, 11);

// Latest dependency-domain signals
const depSignals = signals.filter((s) => s.domain === 'Critical Manufacturing Dependencies').slice(0, 6);

// ── Index gauge geometry (semicircle, 0→left, 100→right) ──
const gA = Math.PI * (1 - overallIndex / 100);
const gX = +(110 + 92 * Math.cos(gA)).toFixed(1);
const gY = +(118 - 92 * Math.sin(gA)).toFixed(1);

// ── 12-month sparkline path ──
const spVals = indexHistory.map((h) => h.overall_index);
const spMin = Math.min(...spVals) - 0.4;
const spMax = Math.max(...spVals) + 0.4;
const SPW = 320, SPH = 52;
const spPts = spVals.map((v, i) => `${((i / (spVals.length - 1)) * SPW).toFixed(1)},${(SPH - ((v - spMin) / (spMax - spMin)) * SPH).toFixed(1)}`);
const spLine = spPts.join(' ');
const spArea = `0,${SPH} ${spLine} ${SPW},${SPH}`;

const GAUGE_GRAD = ['#5bb37f', '#d6a94e', '#e5566c'];
const barColor = (v: number) => (v >= 72 ? '#e5566c' : v >= 67 ? '#d6a94e' : 'var(--text-muted)');
const sectorBarPct = (v: number) => Math.max(4, Math.min(100, ((v - 55) / (80 - 55)) * 100));
const utilColor = (u: number) => (u >= 25 ? '#5bb37f' : u >= 12 ? '#d6a94e' : '#e5566c');

export const metadata: Metadata = {
  title: 'India Import Dependency Index 2026: Critical Manufacturing & Market Share Map',
  description:
    `Comprehensive index of India’s manufacturing import dependencies: 12 sectors, semiconductor & defence import substitution, market sizes, and localization opportunities. Scored on the CMDI index.`,
  alternates: { canonical: `${SITE}/dependencies/` },
  openGraph: {
    title: 'India Import Dependency Index 2026: Critical Manufacturing & Market Share Map',
    description:
      `Comprehensive index of India’s manufacturing import dependencies: 12 sectors, semiconductor & defence import substitution, market sizes, and localization opportunities. Scored on the CMDI index.`,
    url: `${SITE}/dependencies/`,
    type: 'website',
    siteName: 'Techadyant Labs',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'India Manufacturing Dependency Monitor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India Import Dependency Index 2026: Critical Manufacturing & Market Share Map',
    description:
      `Comprehensive index of India’s manufacturing import dependencies: 12 sectors, semiconductor & defence import substitution, market sizes, and localization opportunities. Scored on the CMDI index.`,
    images: ['/og/default.png'],
  },
};

const FAQ = [
  { q: 'What is the Critical Manufacturing Dependency Index (CMDI)?', a: `A 0–100 score of how strategically import-dependent India is for a product, weighting import value, supply risk, strategic importance, industrial multiplier and substitutability. India's current composite is ${overallIndex}.` },
  { q: 'Which products is India most dependent on?', a: `The deepest dependencies are ${topDependencies(3).map((p) => p.name).join(', ')} — high import value, concentrated foreign supply and low domestic capability.` },
  { q: 'Where are the best localisation opportunities?', a: `The Build-now surfaces combine high dependency with real feasibility — led by ${buildNowOpportunities(3).map((o) => o.name.replace(/^Localise:\s*/, '')).join(', ')}.` },
  { q: 'How reliable are the numbers?', a: 'The dataset is a modelled intelligence layer: every value carries a confidence tag — Verified (primary source), Reasoned estimate, or Strategic inference. Most product-level scores are reasoned estimates, flagged as such.' },
];

const GOLD = '#C9A84C';
const card: CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 };

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
          <div className="ed-kicker" style={{ color: GOLD }}>India · Manufacturing sovereignty · CMDR Edition I</div>
          <h1>India&apos;s Manufacturing Dependency Monitor</h1>
          <p className="lede">
            Where does India remain strategically dependent on imports, how is that changing, and where are the next
            industrial opportunities emerging? A living index over {products.length} strategic products — a curated
            subset of the CMDD&apos;s 312 tracked opportunity surfaces — across twelve sectors and thirty-six states,
            scored, sourced and confidence-tagged.
          </p>
        </div>
      </header>

      {/* ── The Index: gauge + trend + stats ── */}
      <section className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.15fr)', gap: 18, alignItems: 'stretch' }} className="dep-hero-grid">
          {/* Gauge */}
          <div style={{ ...card, padding: '20px 22px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Dependency Index</span>
              <span className="dep-delta" style={{ color: improving ? '#5bb37f' : '#e5566c', fontSize: 12, fontWeight: 600 }}>
                {improving ? '▼' : '▲'} {Math.abs(delta)} over 12 months
              </span>
            </div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
              <svg viewBox="0 0 220 132" style={{ width: '100%', maxWidth: 300 }} role="img" aria-label={`Dependency index ${overallIndex} of 100`}>
                <defs>
                  <linearGradient id="depGauge" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={GAUGE_GRAD[0]} />
                    <stop offset="55%" stopColor={GAUGE_GRAD[1]} />
                    <stop offset="100%" stopColor={GAUGE_GRAD[2]} />
                  </linearGradient>
                </defs>
                <path d="M18 118 A92 92 0 0 1 202 118" fill="none" stroke="var(--border)" strokeWidth="14" strokeLinecap="round" />
                <path d="M18 118 A92 92 0 0 1 202 118" fill="none" stroke="url(#depGauge)" strokeWidth="14" strokeLinecap="round" />
                <circle cx={gX} cy={gY} r="9" fill="var(--surface)" />
                <circle cx={gX} cy={gY} r="6" fill="var(--text)" />
                <text x="110" y="112" textAnchor="middle" style={{ fontFamily: 'var(--font-serif)', fontSize: 46, fontWeight: 600, fill: 'var(--text)' }}>{overallIndex}</text>
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--text-muted)', marginTop: -2 }}>
              <span>0 · self-reliant</span><span>100 · import-bound</span>
            </div>
          </div>

          {/* Trend + note */}
          <div style={{ ...card, padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Index — last 12 months</span>
              <span style={{ fontSize: 12, color: improving ? '#5bb37f' : '#e5566c' }}>{improving ? '↓' : '↑'} {Math.abs(delta)} pts</span>
            </div>
            <svg viewBox={`0 0 ${SPW} ${SPH}`} preserveAspectRatio="none" style={{ width: '100%', height: 88, margin: '10px 0' }} aria-hidden="true">
              <polygon points={spArea} fill="rgba(91,179,127,0.10)" />
              <polyline points={spLine} fill="none" stroke="#5bb37f" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: 0 }}>
              <b style={{ color: 'var(--text)' }}>{first?.overall_index}</b> ({first?.month}) → <b style={{ color: 'var(--text)' }}>{overallIndex}</b> ({latestIndex?.month}). {improving ? 'Dependence is easing, slowly.' : 'Dependence has deepened.'}
            </p>
          </div>
        </div>

        {/* Stat strip */}
        <div className="dep-stats" style={{ marginTop: 14, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div><b>{products.length}</b><span>strategic products tracked</span></div>
          <div><b>{usd(totalImports)}</b><span>annual strategic imports</span></div>
          <div><b>{criticalCount}</b><span>critical-tier products (80+)</span></div>
          <div><b style={{ color: GOLD }}>{buildNowOpportunities(99).length}</b><span>Build-now opportunities</span></div>
        </div>
        <p className="dep-disclaimer">A modelled intelligence layer — every score is confidence-tagged (Verified / Reasoned estimate / Strategic inference). See <Link href="/dependencies/products/">the full product list</Link> and each product page for sources.</p>
      </section>

      {/* ── 01 · Sector landscape ── */}
      <section className="wrap">
        <div className="section-head-ed">
          <div><div className="ed-kicker" style={{ color: GOLD }}>01 · The landscape</div><h2>Where the dependency concentrates</h2></div>
          <Link href="/dependencies/products/" className="see-all">Explore all {products.length} products →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: 18, marginBottom: 18 }} className="dep-hero-grid">
          {/* Sector bar chart */}
          <div style={{ ...card, padding: '18px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Sector dependency index</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {sectorsRanked.map((s) => (
                <div key={s.sector_id} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 34px', gap: 10, alignItems: 'center' }}>
                  <Link href={`/dependencies/sectors/${s.sector_id}/`} style={{ fontSize: 11.5, color: 'var(--text-muted)', textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</Link>
                  <div style={{ height: 9, background: 'var(--bg-2)', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${sectorBarPct(s.sector_dependency_index)}%`, background: barColor(s.sector_dependency_index), borderRadius: 5 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textAlign: 'right' }}>{s.sector_dependency_index}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Posture + tiers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ ...card, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Recommended posture</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 14 }}>Across all {products.length} products</div>
              <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{ width: `${(buildNowCount / postureTotal) * 100}%`, background: '#5bb37f' }} />
                <div style={{ width: `${(positionCount / postureTotal) * 100}%`, background: '#d6a94e' }} />
                <div style={{ width: `${(watchCount / postureTotal) * 100}%`, background: '#e5566c' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}><span style={{ color: '#5bb37f' }}>●</span> Build-now</span><b style={{ color: 'var(--text)' }}>{buildNowCount}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}><span style={{ color: '#d6a94e' }}>●</span> Position-early</span><b style={{ color: 'var(--text)' }}>{positionCount}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}><span style={{ color: '#e5566c' }}>●</span> Watch</span><b style={{ color: 'var(--text)' }}>{watchCount}</b></div>
              </div>
            </div>
            <div style={{ ...card, padding: '16px 18px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', textAlign: 'center' }}>
              <div><div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, color: '#e5566c' }}>{criticalCount}</div><div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2 }}>Critical 80+</div></div>
              <div style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}><div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, color: '#d6a94e' }}>{highCount}</div><div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2 }}>High 70–79</div></div>
              <div><div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, color: 'var(--text)' }}>{moderateCount}</div><div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2 }}>Moderate &lt;70</div></div>
            </div>
          </div>
        </div>

        {/* Sector cards (links) */}
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

      {/* ── 02 · Deepest dependencies ── */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed">
          <div><div className="ed-kicker" style={{ color: '#e5566c' }}>02 · The chokepoints</div><h2>India&apos;s deepest dependencies</h2></div>
          <Link href="/dependencies/products/" className="see-all">All {products.length} products →</Link>
        </div>
        <ul className="dep-list">
          {topDependencies(12).map((p) => (
            <li key={p.product_id}>
              <Link href={`/dependencies/products/${p.product_id}/`}>
                <span className="dep-cmdi" style={{ color: DEP_TIER_COLOR[p.dependency_tier] || '#8593A6' }}>{p.cmdi}</span>
                <span className="dep-pname">{p.name}</span>
                <span className="dep-psrc">{p.top_source_country} · {usd(p.import_usd_bn)} · {p.india_capability_pct}% made in India</span>
                <span className="dep-ptag" style={{ background: `${(TIER_COLOR[p.localisation_verdict] || '#8593A6')}22`, color: TIER_COLOR[p.localisation_verdict] || '#8593A6' }}>{p.localisation_verdict}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 03 · Opportunity radar ── */}
      <section className="wrap">
        <div className="section-head-ed">
          <div><div className="ed-kicker" style={{ color: '#5bb37f' }}>03 · The opportunity</div><h2>Where to build now</h2></div>
        </div>
        <div className="dep-opp-grid">
          {buildNowOpportunities(9).map((o) => (
            <div key={o.opportunity_id} className="dep-opp">
              <div className="dep-opp-top"><span className="dep-opp-tier" style={{ color: TIER_COLOR[o.tier] }}>{o.tier}</span><span className="dep-opp-score" style={{ color: GOLD }}>{o.opportunity_score}</span></div>
              <div className="dep-opp-name">{o.name.replace(/^Localise:\s*/, '')}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '4px 8px', fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                <span>Entry</span><span style={{ color: 'var(--text)', textAlign: 'right' }}>{inr(o.investment_required_inr_cr)}</span>
                {o.tam_usd_bn != null && (<><span>Market (TAM)</span><span style={{ color: 'var(--text)', textAlign: 'right' }}>{usd(o.tam_usd_bn)}</span></>)}
                <span>Gov support</span><span style={{ color: o.govt_support === 'High' ? '#5bb37f' : '#d6a94e', textAlign: 'right' }}>{o.govt_support}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 04 · PLI execution ── */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed">
          <div><div className="ed-kicker" style={{ color: '#5aa9cc' }}>04 · The policy engine</div><h2>How the incentives are landing</h2></div>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 720, margin: '0 0 18px', lineHeight: 1.6 }}>
          Production-Linked Incentive schemes are India&apos;s principal de-risking instrument. Outlay is committed; realisation is what has actually been disbursed against production. The gap shows where localisation is real — and where it is still on paper.
        </p>
        <div style={{ ...card, overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 640, borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.03em' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Scheme</th>
                <th style={{ padding: '12px 8px', fontWeight: 600, textAlign: 'right' }}>Outlay</th>
                <th style={{ padding: '12px 8px', fontWeight: 600, textAlign: 'right' }}>Realised</th>
                <th style={{ padding: '12px 8px', fontWeight: 600, width: '30%' }}>Utilisation</th>
                <th style={{ padding: '12px 8px', fontWeight: 600 }}>Assessment</th>
              </tr>
            </thead>
            <tbody>
              {pliRanked.map((p) => (
                <tr key={p.scheme_id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ color: 'var(--text)', fontWeight: 500 }}>{p.name.replace(/^PLI (for |Scheme )?/i, '').replace(/^\/Scheme.*?-\s*/, '')}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sectorBySlug(p.sector_id)?.name || p.sector_id}</div>
                  </td>
                  <td style={{ padding: '11px 8px', textAlign: 'right', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{inr(p.outlay_inr_cr)}</td>
                  <td style={{ padding: '11px 8px', textAlign: 'right', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{inr(p.realised_inr_cr)}</td>
                  <td style={{ padding: '11px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 7, background: 'var(--bg-2)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.max(p.utilisation_pct, 1.5)}%`, background: utilColor(p.utilisation_pct), borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 34, textAlign: 'right' }}>{p.utilisation_pct.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 8px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{p.assessment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="dep-disclaimer">Figures in ₹ crore. Realisation is cumulative disbursement to date; utilisation = realised ÷ outlay.</p>
      </section>

      {/* ── 05 · State readiness ── */}
      <section className="wrap">
        <div className="section-head-ed">
          <div><div className="ed-kicker" style={{ color: GOLD }}>05 · The map</div><h2>Who is positioned to reduce the dependency</h2></div>
          <Link href="/dependencies/products/" className="see-all">Product explorer →</Link>
        </div>

        {/* Leaderboard (top 10) */}
        <div style={{ ...card, padding: '10px 12px', marginBottom: 16 }}>
          {statesRanked.slice(0, 10).map((st, i) => (
            <Link key={st.state_id} href={`/dependencies/states/${st.state_id}/`} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '9px 8px', textDecoration: 'none', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 20 }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 500, width: 140, flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{st.name}</span>
              <span style={{ flex: 1, height: 8, background: 'var(--bg-2)', borderRadius: 5, overflow: 'hidden', display: 'inline-block' }}>
                <span style={{ display: 'block', height: '100%', width: `${(st.mci_composite / statesRanked[0].mci_composite) * 100}%`, background: st.mci_composite >= 70 ? GOLD : '#5aa9cc', borderRadius: 5 }} />
              </span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 600, color: st.mci_composite >= 70 ? GOLD : 'var(--text)', width: 46, textAlign: 'right' }}>{st.mci_composite}</span>
            </Link>
          ))}
        </div>

        {/* All-state grid (de-orphans state pages) */}
        <div className="dep-state-grid">
          {statesRanked.map((st) => (
            <Link key={st.state_id} href={`/dependencies/states/${st.state_id}/`} className="dep-state">
              <span className="dep-state-mci">{st.mci_composite}</span>
              <span className="dep-state-name">{st.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 06 · Latest signals ── */}
      {depSignals.length > 0 && (
        <section className="wrap" style={{ background: 'var(--bg-2)' }}>
          <div className="section-head-ed">
            <div><div className="ed-kicker" style={{ color: GOLD }}>06 · Intelligence</div><h2>Latest dependency signals</h2></div>
            <Link href="/signals/" className="see-all">All signals →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
            {depSignals.map((s) => (
              <Link key={s.slug} href={`/signals/${s.slug}/`} style={{ ...card, padding: '20px 22px', textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em', color: GOLD, marginBottom: 10 }}>{s.domain}</span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 19, fontWeight: 500, color: 'var(--text)', lineHeight: 1.3, margin: '0 0 8px' }}>{s.title}</h3>
                {s.excerpt && <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.55, margin: 0, flex: 1 }}>{s.excerpt}</p>}
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 14 }}>{s.date}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Full product directory grouped by sector — server-rendered internal links (no orphans) */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: GOLD }}>Directory</div><h2>Every tracked product</h2></div>
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
