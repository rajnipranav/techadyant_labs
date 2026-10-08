import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../seo';
import { programmes, programmeHref, flagshipCards, projectsFor, nodesFor, opportunitiesFor, signalsFor } from './data';
import { FlagshipCardView, CrossCuttingDiagram, StageChip } from './ui';
import { logistics } from '../logistics/data';

const URL = `${SITE}/research/programmes/`;
const TITLE = 'Programme Intelligence: India’s National Infrastructure Programmes, Read for Industry';
const DESC = 'How Gati Shakti, Bharatmala, Sagarmala, the freight corridors, industrial corridors and ULIP are reshaping India’s industrial geography — status, links and opportunities.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ['PM Gati Shakti', 'Bharatmala Pariyojana', 'Sagarmala', 'Dedicated Freight Corridor', 'India infrastructure programmes', 'India logistics programmes', 'industrial corridors India'],
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'website', siteName: 'Techadyant Labs', images: [{ url: '/og/default.png', width: 1200, height: 630, alt: TITLE }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ['/og/default.png'] },
};

const CHAIN = ['National programme', 'Infrastructure', 'Connectivity', 'Industrial node', 'Supply chain', 'Company / ecosystem', 'Second-order effect', 'Opportunity surface'];
const FUTURE = ['National Logistics Policy', 'UDAN', 'National Infrastructure Pipeline', 'Sagarmala and Bharatmala sub-programmes', 'PM MITRA (where relevant)'];

export default function ProgrammesIndex() {
  const cards = flagshipCards();
  const linkedProjects = new Set(programmes.flatMap((p) => projectsFor(p).map((x) => x.project.id))).size;
  const linkedNodes = new Set(programmes.flatMap((p) => nodesFor(p).map((x) => x.node.id))).size;
  const linkedOpps = new Set(programmes.flatMap((p) => opportunitiesFor(p).map((x) => x.opp.id))).size;
  const linkedSignals = new Set(programmes.flatMap((p) => signalsFor(p).map((x) => x.signal.slug))).size;

  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' }, { name: 'Programmes', path: '/research/programmes/' }]),
        { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Programme Intelligence', url: URL, description: DESC, isPartOf: { '@id': `${SITE}/#website` }, publisher: ORG_REF,
          mainEntity: { '@type': 'ItemList', itemListElement: programmes.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${SITE}${programmeHref(p.slug)}` })) } },
      ]} />

      <header className="pi-hero">
        <div className="wrap">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">Atlas</Link><span className="sep">/</span><span>Programmes</span>
          </div>
          <div className="pi-eyebrow">The Atlas · Programme Intelligence</div>
          <h1>The programmes reshaping India’s industrial geography</h1>
          <p className="pi-sub">Tracking the national programmes that reshape India’s infrastructure, industrial geography and economic connectivity — read for what they change in industry, not what they announce.</p>
          <p className="pi-q"><span>The Techadyant question</span>A government page asks what a programme is. News asks what happened today. We ask: how is this programme changing India’s industrial system?</p>
          <dl className="pi-meta">
            <div><dt>Programme pages</dt><dd>{programmes.length} live · {cards.filter((c) => !c.live).length} in preparation</dd></div>
            <div><dt>Linked projects</dt><dd>{linkedProjects}</dd></div>
            <div><dt>Industrial nodes reached</dt><dd>{linkedNodes}</dd></div>
            <div><dt>Opportunity surfaces · signals</dt><dd>{linkedOpps} · {linkedSignals}</dd></div>
          </dl>
        </div>
      </header>

      <main className="wrap pi-body">
        <div className="pi-sec-head" id="chain">
          <div className="pi-kicker">The analytical chain</div>
          <h2>From programme to opportunity</h2>
          <p className="pi-sec-note">Every programme page is built to let you walk this chain. Each step is either sourced or labelled as Techadyant analysis.</p>
        </div>
        <ol className="pi-xc-chain" style={{ justifyContent: 'flex-start' }}>{CHAIN.map((c) => <li key={c}><span>{c}</span></li>)}</ol>

        <div className="pi-sec-head" id="flagships">
          <div className="pi-kicker">First wave</div>
          <h2>Six flagship programmes</h2>
          <p className="pi-sec-note">Three programme pages are live. The freight corridors, industrial corridors and ULIP follow in Phase 2. Until then their cards open the existing reference record or Atlas surface.</p>
        </div>
        <div className="pi-cards">{cards.map((c) => <FlagshipCardView key={c.key} c={c} />)}</div>

        <div className="pi-sec-head" id="layer">
          <div className="pi-kicker">Architecture</div>
          <h2>Gati Shakti is a layer, not a peer</h2>
          <p className="pi-sec-note">The other programmes build roads, ports, rail and parks. PM GatiShakti plans and evaluates them against one map. Techadyant models it as the cross-cutting layer they all pass through on the way to an industrial node.</p>
        </div>
        <CrossCuttingDiagram />

        <div className="pi-sec-head" id="status">
          <div className="pi-kicker">Status at a glance</div>
          <h2>Where each live programme stands</h2>
        </div>
        <div className="pi-table-wrap">
          <table className="pi-table">
            <thead><tr><th>Programme</th><th>Stage</th><th>Lead ministry</th><th>Data as of</th><th>Projects · nodes · opportunities</th></tr></thead>
            <tbody>
              {programmes.map((p) => (
                <tr key={p.id}>
                  <td><Link href={programmeHref(p.slug)}><b>{p.name}</b></Link><span className="pi-td-sub">{p.angle}</span></td>
                  <td><StageChip s={p.stage} /><span className="pi-td-sub">{p.stage_note}</span></td>
                  <td>{p.lead_ministry}</td>
                  <td className="pi-nowrap">{p.data_as_of}</td>
                  <td>{projectsFor(p).length} · {nodesFor(p).length} · {opportunitiesFor(p).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pi-two">
          <div>
            <div className="pi-sec-head" id="future">
              <div className="pi-kicker">Designed for, not yet built</div>
              <h2>Future programmes</h2>
            </div>
            <ul className="pi-datagaps">{FUTURE.map((f) => <li key={f}>{f}</li>)}</ul>
            <p className="pi-caveat">The schema takes these without change: each needs a record in the SID logistics layer, a programme-intelligence entry, and sourced links from its projects. The SID already tracks {logistics.programmes.length} programmes and authorities.</p>
          </div>
          <div>
            <div className="pi-sec-head" id="method">
              <div className="pi-kicker">Method</div>
              <h2>How a programme earns a link</h2>
            </div>
            <div className="pi-method">
              <p>A project links to a programme only when a source says so: “built under Bharatmala”, “planned on the PM-Gati Shakti National Master Plan”, “funded under Sagarmala”. Industrial nodes, opportunities, signals and reports then attach through the graph.</p>
              <p>Geographic proximity alone never creates a link. Scores are not published until their methodology is. See the <Link href="/research/logistics/">Logistics &amp; Mobility gateway</Link> and the <Link href="/research/industrial-nodes/">industrial nodes</Link>.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
