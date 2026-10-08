import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { JsonLd, breadcrumb, faqLd, SITE } from '../seo';
import { INDIA_OUTLINE } from '../../corridors/data';
import { IndustrialMap } from '../industrial/IndustrialMap';
import {
  industrialNodes, infraNodes, itla, mapPoints, monthYear, opportunities, projects, scoresFor, sectorLabel, sources,
} from '../industrial/data';
import { GatiShaktiContrast } from '../industrial/ui';

const URL = `${SITE}/research/industrial-nodes/`;
const TITLE = 'India Industrial Nodes: Semiconductor & Electronics Clusters, Connectivity Map';
const DESC = 'Dossiers for India’s semiconductor and electronics nodes — Dholera, Sanand, Jewar–YEIDA, Jagiroad, Sriperumbudur and Kopparthy: connectivity, gaps, opportunities.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ['India industrial clusters', 'India semiconductor manufacturing map', 'India semiconductor ecosystem', 'Dholera semiconductor ecosystem', 'India logistics infrastructure', 'PM GatiShakti industrial corridors', 'India manufacturing clusters', 'India electronics manufacturing clusters', 'Sriperumbudur electronics'],
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'website', siteName: 'Techadyant Labs', images: [{ url: '/og/default.png', width: 1200, height: 630, alt: TITLE }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ['/og/default.png'] },
};

const CHAIN = [
  'Infrastructure development',
  'Connectivity change',
  'Industrial impact',
  'Supply-chain effect',
  'Strategic dependency',
  'Second-order effect',
  'Opportunity surface',
];

export default function IndustrialNodesHub() {
  const verified = monthYear(industrialNodes.map((n) => n.last_verified).sort().at(-1)!);
  const cards = industrialNodes.map((n) => ({ n, s: scoresFor(n) }));
  const crumb = breadcrumb([{ name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' }, { name: 'Industrial Nodes', path: '/research/industrial-nodes/' }]);
  const faqs = [
    { q: 'How is this different from PM GatiShakti?', a: 'PM GatiShakti is the Government of India’s geospatial planning system: it shows what infrastructure exists and how projects connect. Techadyant does not copy its data. It interprets public, cited information to explain what infrastructure means for industrial nodes, companies and supply chains, where connectivity falls short, and which opportunities follow.' },
    { q: 'Which nodes are covered?', a: `Coverage: ${industrialNodes.map((n) => `${n.short_name} (${n.state})`).join(', ')}.` },
    { q: 'Are the scores real-time?', a: `No. Every dossier states when its data was verified (latest: ${verified}). Scores follow a published methodology and show “Insufficient Data” when evidence is thin.` },
  ];
  const listLd = {
    '@context': 'https://schema.org', '@type': 'ItemList', name: 'India industrial nodes — Techadyant Atlas',
    itemListElement: industrialNodes.map((n, i) => ({ '@type': 'ListItem', position: i + 1, name: n.name, url: `${SITE}/research/industrial-nodes/${n.slug}/` })),
  };

  return (
    <>
      <AtlasNav />
      <JsonLd data={[crumb, listLd, faqLd(faqs)]} />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">Atlas</Link><span className="sep">/</span><span>Industrial Nodes</span>
          </div>
          <div className="ed-kicker">Infrastructure &amp; Connectivity Intelligence · Semiconductors and electronics assembly</div>
          <h1>From infrastructure maps to industrial intelligence</h1>
          <p className="lede">
            India publishes where its roads, rail, ports and airports are. This layer of the Atlas explains what that infrastructure
            means for industrial nodes — which companies and supply chains it serves, where it falls short of what an industry needs,
            and which opportunities open as it changes.
          </p>
          <div className="node-head-meta">
            <span className="node-status-detail">{industrialNodes.length} nodes · {infraNodes.length} infrastructure assets · {projects.length} projects · {opportunities.length} opportunity surfaces · {sources.length} sources · Data verified: {verified}</span>
          </div>
        </div>
      </header>

      <section className="wrap">
        <ol className="ii-chainline" aria-label="Techadyant analytical chain">
          {CHAIN.map((c, i) => <li key={c} className={i === CHAIN.length - 1 ? 'is-end' : ''}>{c}</li>)}
        </ol>
      </section>

      <section className="wrap">
        <h2 className="node-h2">Map</h2>
        <IndustrialMap points={mapPoints()} outline={INDIA_OUTLINE} />
      </section>

      <section className="wrap">
        <h2 className="node-h2">Pilot industrial nodes</h2>
        <div className="atlas-cards">
          {cards.map(({ n, s }) => {
            const [ics, , cgi] = s;
            return (
              <Link key={n.id} href={`/research/industrial-nodes/${n.slug}/`} className="atlas-card" style={{ ['--accent' as string]: '#F5B544' }}>
                <div className="atlas-card-head"><h3>{n.short_name}</h3><span className="atlas-card-no">{n.state}</span></div>
                <p className="atlas-card-tag">{n.headline}</p>
                <div className="atlas-card-stats">
                  <span>ICS <b>{ics.status === 'computed' ? ics.score : '—'}</b>{ics.status !== 'computed' && <em className="ii-insufficient-sm"> insufficient data</em>}</span>
                  <span>CGI <b>{cgi.status === 'computed' ? cgi.score : '—'}</b>{cgi.status !== 'computed' && <em className="ii-insufficient-sm"> insufficient data</em>}</span>
                </div>
                <div className="atlas-card-weak">{n.sectors.filter((x) => !x.startsWith('sector:')).slice(0, 3).map(sectorLabel).join(' · ')}</div>
                <span className="atlas-card-go">Open dossier →</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="wrap-narrow">
        <h2 className="node-h2">Opportunity surfaces <span className="ii-claim ii-claim-opportunity">Opportunity surface</span></h2>
        <p className="node-para">Analytical hypotheses that start from a sourced infrastructure or investment development. They describe where demand or capability <em>may</em> emerge — not procurement forecasts.</p>
        <ul className="ii-opp-list" role="list">
          {opportunities.map((o) => (
            <li key={o.id}>
              <Link href={`/research/industrial-nodes/${o.node_ids[0].slice(6)}/#opportunities`}>{o.title}</Link>
              <span className="ii-src-meta"> · {o.location} · {o.opportunity_type.replace(/_/g, ' ')} · horizon {o.horizon} · confidence {o.confidence}</span>
            </li>
          ))}
        </ul>

        <GatiShaktiContrast />

        <h2 className="node-h2">What comes next</h2>
        <div className="ii-next">
          <div>
            <div className="ii-conn-k">Integrated Transport &amp; Logistics Authority</div>
            <p>Approved by the Cabinet on {itla.institution.approved_on}. Its planned national transport data repository and freight-flow analytics would let the Atlas replace distance proxies with observed flows. The schema is ready; no ITLA data is public yet, and none is modelled here. The programme-level view (DFC, Bharatmala, Gati Shakti, ITLA) is in the <Link href="/research/logistics/">India Integrated Logistics Atlas</Link>.</p>
          </div>
          <div>
            <div className="ii-conn-k">SME Growth Fund</div>
            <p>The ₹10,000 crore fund approved the same day will consider manufacturing SMEs in Tier II/III industrial clusters. A future SME layer will link SMEs to these nodes using Techadyant classifications only — never implied eligibility.</p>
          </div>
          <div>
            <div className="ii-conn-k">Phase 2</div>
            <p>Electronics, then defence, drones, aerospace, solar and EV nodes — on the same entities, so cross-sector questions can be answered on one graph.</p>
          </div>
        </div>
        <p className="node-foot ii-foot" style={{ borderTop: 'none' }}>
          <Link href="/research/infrastructure-projects/" className="see-all">Infrastructure projects →</Link>
          <Link href="/research/industrial-nodes/methodology/" className="see-all">Methodology &amp; source registry →</Link>
        </p>
      </section>
    </>
  );
}
