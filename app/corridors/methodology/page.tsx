import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd, breadcrumb, SITE } from '../../research/seo';

export const metadata: Metadata = {
  title: 'Corridor Readiness Score — Methodology | Techadyant Labs',
  description:
    "How the Techadyant Corridor Readiness Score works: four axes (maturity, capital momentum, connectivity, opportunity) scored 0-25 each, tier thresholds, node staging, verification labels and sources.",
  alternates: { canonical: `${SITE}/corridors/methodology/` },
  openGraph: {
    title: 'Corridor Readiness Score — Methodology',
    description:
      'How the 0-100 Techadyant Corridor Readiness Score is built, the tier thresholds, node staging and verification labels behind every corridor dossier.',
    url: `${SITE}/corridors/methodology/`,
    type: 'article',
    siteName: 'Techadyant Labs',
  },
};

const AXES: { k: string; n: string; d: string }[] = [
  { k: 'Maturity', n: '0-25', d: 'How much is actually built and operating today, not announced. Node activation, trunk infrastructure delivered, anchor tenants with ground truth, operating assets.' },
  { k: 'Capital momentum', n: '0-25', d: 'Scale and credibility of committed capital: CCEA-approved programme size, EPC awards, anchor-tenant commitments with signed agreements, funding structure (GoI, JICA/ADB, state SPVs).' },
  { k: 'Connectivity', n: '0-25', d: 'Freight corridors, ports, airports, expressways and grid capacity that make the corridor manufacturable: dedicated freight corridor linkage, ICDs, port distance, power availability.' },
  { k: 'Opportunity', n: '0-25', d: 'Openness of the corridor to new entrants: land availability for non-anchor suppliers, sector breadth, second-tier vendor surface, and how much value is capturable by domestic firms.' },
];

const TIERS: { t: string; r: string; d: string }[] = [
  { t: 'Build-now', r: '65-100', d: 'Investable today: activation is real, anchors are committed and construction is underway. Entry is about speed and land.' },
  { t: 'Position-early', r: '40-64', d: 'Credible momentum with gaps: some anchors, partial infrastructure. Best for early positioning while land and vendor slots are still open.' },
  { t: 'Watch', r: '0-39', d: 'Mostly planned: funding or approvals still pending. Track for trigger events rather than committing.' },
];

const STAGES: { s: string; d: string }[] = [
  { s: 'Operational', d: 'Node is live: plots allotted, anchors operating or under construction, trunk infrastructure delivered.' },
  { s: 'Under construction', d: 'CCEA/EPC approved and works underway; not yet allotting at scale.' },
  { s: 'Approved', d: 'Programme sanctioned; land assembly or pre-construction stage.' },
  { s: 'Planned', d: 'Announced in the NICDP programme; no construction commitment yet.' },
];

const VERIFY: { v: string; d: string }[] = [
  { v: '[V]', d: 'Verified from primary sources (official filings, signed agreements, confirmed on satellite or ground).' },
  { v: '[V1]', d: 'Single-source or announced: credible official announcement, not yet independently confirmed.' },
  { v: '[U]', d: 'Unverified or conflicting reports; treat as indicative.' },
];

export default function MethodologyPage() {
  return (
    <>
      <JsonLd data={[
        breadcrumb([
          { name: 'Home', path: '/' },
          { name: 'Corridors', path: '/corridors/' },
          { name: 'Methodology', path: '/corridors/methodology/' },
        ]),
      ]} />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/corridors/">Corridors</Link><span className="sep">/</span><span>Methodology</span>
          </div>
          <div className="ed-kicker" style={{ color: '#C9A84C' }}>How we score</div>
          <h1>Corridor Readiness Score — methodology</h1>
          <p className="lede">
            Every corridor on this site carries a 0-100 readiness score built from four axes. This page explains
            exactly what the score measures, what the tiers mean, and how we label evidence — so the ranking can be
            audited, not just read.
          </p>
        </div>
      </header>

      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>The four axes</div><h2>Score = Maturity + Capital momentum + Connectivity + Opportunity</h2></div></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', maxWidth: '72ch', lineHeight: 1.7 }}>
          Each axis scores 0-25; the four sum to the 0-100 readiness score. Axes are scored from primary documents
          (DPIIT/NICDC status reports, CCEA/EPC records, PIB releases, state IDC portals, India Investment Grid),
          not from media coverage alone.
        </p>
        <div className="node-cards" style={{ marginTop: 18 }}>
          {AXES.map((a) => (
            <div key={a.k} className="node-card">
              <h3>{a.k} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>({a.n})</span></h3>
              <p>{a.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>Tiers</div><h2>What the bands mean</h2></div></div>
        <ul className="node-timeline" role="list" style={{ marginTop: 14 }}>
          {TIERS.map((x) => (
            <li key={x.t}><span className="nt-date">{x.r}</span><span className="nt-label"><b>{x.t}</b> — {x.d}</span></li>
          ))}
        </ul>
      </section>

      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>Node staging</div><h2>How nodes are classified</h2></div></div>
        <ul className="node-infra" role="list" style={{ marginTop: 14 }}>
          {STAGES.map((x) => (
            <li key={x.s}><b>{x.s}:</b> {x.d}</li>
          ))}
        </ul>
      </section>

      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>Evidence labels</div><h2>Verification tags on every claim</h2></div></div>
        <ul className="node-infra" role="list" style={{ marginTop: 14 }}>
          {VERIFY.map((x) => (
            <li key={x.v}><b>{x.v}</b> — {x.d}</li>
          ))}
        </ul>
        <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', maxWidth: '72ch', marginTop: 14, lineHeight: 1.6 }}>
          Sources are listed per corridor and per node at the bottom of each page, linked to the original document
          wherever it is public. Where a figure is an official projection (investment potential, jobs), it is labelled
          as such rather than presented as fact.
        </p>
      </section>

      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>The dataset</div><h2>Take the data with you</h2></div></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '72ch', lineHeight: 1.7 }}>
          The full node dataset — 38 nodes across the eleven corridors, with stage, area, investment, jobs, sectors and
          anchor tenants — is available as an open CSV under CC BY 4.0 (attribution: Techadyant Labs):
        </p>
        <p style={{ marginTop: 8 }}>
          <Link href="/data/corridor-nodes.csv" className="see-all" style={{ fontSize: 14 }}>Download corridor-nodes.csv &#8595;</Link>
        </p>
      </section>

      <section className="wrap-narrow">
        <Link href="/corridors/" className="see-all">&#8592; Back to all corridors</Link>
      </section>
    </>
  );
}
