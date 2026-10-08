import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../../AtlasNav';
import { JsonLd, breadcrumb, SITE } from '../../seo';
import { COMPLETENESS_THRESHOLD, DISTANCE_BANDS, METHODOLOGY_VERSION, SCORE_DEFS, CGI_PROFILES, CGI_LABELS } from '../../industrial/scoring';
import { sources } from '../../industrial/data';

const URL = `${SITE}/research/industrial-nodes/methodology/`;
export const metadata: Metadata = {
  title: 'Industrial Connectivity Methodology & Source Registry',
  description: 'How Techadyant scores industrial nodes: Industrial Connectivity Score, Connectivity Gap Index, Supply Chain Connectivity, Opportunity and Strategic Node scores — weights, rules, missing-data policy and sources.',
  alternates: { canonical: URL },
  openGraph: { title: 'Industrial Connectivity Methodology', url: URL, type: 'article', siteName: 'Techadyant Labs' },
};

export default function MethodologyPage() {
  const crumb = breadcrumb([{ name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' }, { name: 'Industrial Nodes', path: '/research/industrial-nodes/' }, { name: 'Methodology', path: '/research/industrial-nodes/methodology/' }]);
  const governed = sources.filter((s) => s.access);
  return (
    <>
      <AtlasNav />
      <JsonLd data={crumb} />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/industrial-nodes/">Industrial Nodes</Link><span className="sep">/</span><span>Methodology</span>
          </div>
          <div className="ed-kicker">Methodology v{METHODOLOGY_VERSION}</div>
          <h1>How the industrial-node scores work</h1>
          <p className="lede">No score without a method, and no method without its missing-data rule. Unknown inputs are treated as missing, never as zero.</p>
        </div>
      </header>

      <section className="wrap-narrow">
        <h2 className="node-h2">Shared rules</h2>
        <ul className="node-infra" role="list">
          <li>Score = weighted mean of evidenced components × 100, rounded to the nearest 5. Components without evidence are excluded from the mean and counted against completeness.</li>
          <li>If evidenced components carry less than {Math.round(COMPLETENESS_THRESHOLD * 100)}% of the weight, the score reads <b>Insufficient Data</b>.</li>
          <li>Confidence is the lower of a completeness tier (≥90% high, ≥80% medium) and an evidence tier (share of weight resting on high- vs low-confidence inputs).</li>
          <li>Distances are great-circle (straight-line) between approximate coordinates, rounded to 5 km and banded; road distances appear only when a source states them.</li>
          <li>Every dossier separates <b>Fact</b>, <b>Techadyant analysis</b>, <b>Techadyant score</b> and <b>Opportunity surface</b>.</li>
          <li>Data is dated (“Data verified: Month Year”). Nothing here is real-time.</li>
        </ul>

        {SCORE_DEFS.map((d) => (
          <div key={d.key} id={d.key}>
            <h2 className="node-h2">{d.label} ({d.short}) <span className={`ii-claim ${d.phase1 === 'computed' ? 'ii-claim-score' : 'ii-claim-analysis'}`}>{d.phase1 === 'computed' ? 'Computed' : 'Defined — not yet computed'}</span></h2>
            <p className="node-para">{d.question}</p>
            {d.key === 'cgi' ? (
              <table className="ii-table">
                <thead><tr><th>Requirement</th><th>Fab weight</th><th>Backend (OSAT) weight</th><th>Electronics assembly weight</th></tr></thead>
                <tbody>
                  {Object.keys(CGI_PROFILES.semiconductor_fab).map((k) => (
                    <tr key={k}><td><b>{CGI_LABELS[k]}</b></td><td>{CGI_PROFILES.semiconductor_fab[k]}</td><td>{CGI_PROFILES.semiconductor_backend[k]}</td><td>{CGI_PROFILES.electronics_assembly[k]}</td></tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="ii-table">
                <thead><tr><th>Component</th><th>Weight</th><th>Rule / input</th></tr></thead>
                <tbody>{d.components.map((c) => <tr key={c.key}><td><b>{c.label}</b></td><td>{c.weight}</td><td>{c.rule}</td></tr>)}</tbody>
              </table>
            )}
            {d.key === 'cgi' && <p className="ii-fine">Each requirement is assessed met (0), partial (0.5), gap (1) or unknown (missing). High CGI means a large gap — a constraint and, often, an opportunity.</p>}
            {d.whyNotComputed && <p className="ii-fine"><b>Why not computed yet:</b> {d.whyNotComputed}</p>}
          </div>
        ))}

        <h2 className="node-h2">Distance bands (ICS)</h2>
        <table className="ii-table">
          <thead><tr><th>Component</th><th>Bands (straight-line km → value)</th></tr></thead>
          <tbody>
            {Object.entries(DISTANCE_BANDS).map(([k, bands]) => (
              <tr key={k}><td><b>{k.replace('_', ' ')}</b></td><td>{bands.map((b) => `${b.maxKm === Infinity ? '>' + bands[bands.length - 2].maxKm : '≤' + b.maxKm} → ${b.value}`).join(' · ')}</td></tr>
            ))}
          </tbody>
        </table>

        <h2 className="node-h2" id="registry">Source registry — data governance</h2>
        <p className="node-para">Programme and platform sources with their access terms, and what Techadyant does with each. We do not scrape, reproduce or redistribute PM GatiShakti, ULIP or any other restricted dataset.</p>
        <table className="ii-table">
          <thead><tr><th>Source</th><th>Access</th><th>Licence / redistribution</th><th>Techadyant use</th></tr></thead>
          <tbody>
            {governed.map((s) => (
              <tr key={s.id}>
                <td><a href={s.source_url} target="_blank" rel="noopener noreferrer">{s.source_name}</a><div className="ii-src-meta">{s.publisher}{s.publication_date ? ` · ${s.publication_date}` : ''}</div></td>
                <td>{s.access!.model.replace(/_/g, ' ')}; API {s.access!.api}; download {s.access!.download}</td>
                <td>{s.access!.licence ?? 'No licence published'}; redistribution {s.access!.redistribution.replace(/_/g, ' ')}</td>
                <td>{s.access!.techadyant_use}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="node-h2">All sources ({sources.length})</h2>
        <ol className="ii-sources">
          {sources.map((s) => (
            <li key={s.id}>
              <a href={s.source_url} target="_blank" rel="noopener noreferrer">{s.source_name} ↗</a>
              <span className="ii-src-meta">{s.publisher}{s.publication_date ? ` · ${s.publication_date}` : ' · undated'} · {s.source_type.replace(/_/g, ' ')} · confidence {s.confidence} · accessed {s.accessed_date}</span>
            </li>
          ))}
        </ol>
        <p className="node-foot ii-foot" style={{ borderTop: 'none' }}><Link href="/research/industrial-nodes/" className="see-all">← Industrial nodes</Link></p>
      </section>
    </>
  );
}
