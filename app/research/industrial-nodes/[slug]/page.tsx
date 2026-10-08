import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AtlasNav } from '../../AtlasNav';
import { JsonLd, breadcrumb, faqLd, SITE } from '../../seo';
import {
  CONNECTIVITY_LABELS, connectivityFor, corridorNodeLink, expand, getInfra, icsComponents, industrialNodes,
  inrCr, monthYear, nodeBySlug, opportunitiesForNode, playerLink, projectsForNode, relationshipsFor, reportLinks,
  scoresFor, sectorLabel, signalsForNode, sourcesForNode, straightLineKm,
} from '../../industrial/data';
import { ClassedHeading, Cite, EvidenceTag, ScoreBreakdown, ScoreCard, SourceList, GatiShaktiContrast } from '../../industrial/ui';
import type { Connectivity } from '../../industrial/types';

export function generateStaticParams() {
  return industrialNodes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = nodeBySlug(slug);
  if (!n) return { title: 'Industrial node' };
  const ics = scoresFor(n)[0];
  const title = `${n.short_name} Semiconductor Ecosystem: Connectivity, Supply Chain & Opportunities`;
  const desc = `${n.short_name} (${n.state}) industrial-node dossier: anchor companies, road/rail/port/airport connectivity, connectivity gaps and opportunity surfaces${ics.status === 'computed' ? ` — Industrial Connectivity Score ${ics.score}/100` : ''}. Sourced, dated.`.slice(0, 158);
  const url = `${SITE}/research/industrial-nodes/${n.slug}/`;
  return {
    title, description: desc,
    keywords: [`${n.short_name} semiconductor`, `${n.short_name} industrial cluster`, `${n.state} semiconductor ecosystem`, 'India semiconductor manufacturing map', 'industrial connectivity', 'PM GatiShakti industrial corridors'],
    alternates: { canonical: url },
    openGraph: { title, description: desc, url, type: 'article', siteName: 'Techadyant Labs', images: [{ url: '/og/default.png', width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description: desc, images: ['/og/default.png'] },
  };
}

const MODES: (keyof Connectivity)[] = ['road', 'rail', 'freight_corridors', 'airports', 'ports', 'logistics_nodes', 'waterways'];

export default async function IndustrialNodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = nodeBySlug(slug);
  if (!n) notFound();

  const scores = scoresFor(n);
  const [ics, , cgi] = scores;
  const srcs = sourcesForNode(n);
  const idx = new Map(srcs.map((s, i) => [s.id, i + 1]));
  const conn = connectivityFor(n);
  const rels = relationshipsFor(n.id);
  const projects = projectsForNode(n.id);
  const opps = opportunitiesForNode(n.id);
  const signals = signalsForNode(n.id);
  const reports = reportLinks(n.related_reports);
  const corridorRefs = n.corridor_node_refs.map(corridorNodeLink).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const icsView = icsComponents(n);
  const verified = monthYear(n.last_verified);

  const url = `${SITE}/research/industrial-nodes/${n.slug}/`;
  const crumb = breadcrumb([
    { name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' },
    { name: 'Industrial Nodes', path: '/research/industrial-nodes/' }, { name: n.short_name, path: `/research/industrial-nodes/${n.slug}/` },
  ]);
  const placeLd = {
    '@context': 'https://schema.org', '@type': 'Place', name: n.name, url,
    description: n.headline,
    address: { '@type': 'PostalAddress', addressRegion: n.state, ...(n.district ? { addressLocality: n.district } : {}), addressCountry: 'IN' },
    ...(n.coordinates.lat !== null ? { geo: { '@type': 'GeoCoordinates', latitude: n.coordinates.lat, longitude: n.coordinates.lng } } : {}),
    keywords: n.sectors.map(sectorLabel).join(', '),
    ...(ics.status === 'computed' ? { additionalProperty: [{ '@type': 'PropertyValue', name: 'Techadyant Industrial Connectivity Score (v' + ics.methodology_version + ')', value: ics.score, maxValue: 100 }] } : {}),
  };
  const faqs = [
    { q: `What semiconductor projects are at ${n.short_name}?`, a: n.companies.filter((c) => !c.role.startsWith('Cluster')).map((c) => `${c.name} (${c.role}): ${c.status}`).join('; ') + '.' },
    { q: `How is ${n.short_name} connected?`, a: MODES.filter((m) => conn[m].length).map((m) => `${CONNECTIVITY_LABELS[m]}: ${conn[m].map((x) => getInfra(x.infra_id)?.name).join(', ')}`).join('. ') + '.' },
    { q: `What is ${n.short_name}'s Industrial Connectivity Score?`, a: ics.status === 'computed' ? `${ics.score}/100 (${ics.band}, confidence ${ics.confidence}) under Techadyant methodology v${ics.methodology_version}, with ${Math.round(ics.data_completeness * 100)}% of inputs evidenced.` : `Insufficient data: evidenced inputs cover ${Math.round(ics.data_completeness * 100)}% of the score weight.` },
  ];

  return (
    <>
      <AtlasNav />
      <JsonLd data={[crumb, placeLd, faqLd(faqs)]} />

      <header className="ed-page-head" style={{ ['--accent' as string]: '#F5B544' }}>
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">Atlas</Link><span className="sep">/</span>
            <Link href="/research/industrial-nodes/">Industrial Nodes</Link><span className="sep">/</span><span>{n.short_name}</span>
          </div>
          <div className="ed-kicker">Industrial node · {n.state}{n.district ? ` · ${n.district} district` : ''}</div>
          <h1>{n.name}</h1>
          <p className="lede">{n.headline}</p>
          <div className="node-head-meta">
            <span className="node-stage" style={{ color: '#F5B544', borderColor: '#F5B544' }}>{n.type.replace(/_/g, ' ')}</span>
            {n.sectors.slice(0, 4).map((s) => <span key={s} className="node-state">{sectorLabel(s)}</span>)}
            <span className="node-status-detail">Data verified: {verified} · as of {n.data_as_of}</span>
          </div>
        </div>
      </header>

      <section className="wrap" aria-labelledby="scores-h">
        <ClassedHeading id="scores-h" title="Techadyant indicators" cls="score" note="Scores are shown only when evidenced inputs cover at least 70% of the weight; otherwise they read Insufficient Data." />
        <div className="ii-scores">{scores.map((s) => <ScoreCard key={s.key} s={s} />)}</div>
        <p className="ii-fine"><Link href="/research/industrial-nodes/methodology/">How these are calculated →</Link></p>
      </section>

      <section className="wrap-narrow">
        <ClassedHeading id="overview-h" title="Strategic overview" cls="analysis" />
        {n.strategic_overview.map((p, i) => <p key={i} className="node-para">{p}</p>)}

        <ClassedHeading id="facts-h" title="Key facts" cls="fact" />
        <table className="ii-table">
          <thead><tr><th>Item</th><th>Detail</th><th>As of</th></tr></thead>
          <tbody>
            {n.facts.map((f, i) => (
              <tr key={i}><td><b>{f.label}</b></td><td>{f.value} <Cite prov={expand(f.provenance)} index={idx} /></td><td className="ii-nowrap">{f.as_of ?? '—'}</td></tr>
            ))}
          </tbody>
        </table>

        <ClassedHeading id="ecosystem-h" title="Industrial ecosystem" cls="fact" note="Linked to existing Atlas entities. Where the Atlas holds duplicate records for one company, all are linked here and flagged for merging." />
        <table className="ii-table">
          <thead><tr><th>Company / facility</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>
            {n.companies.map((c) => {
              const link = c.primary_player_id ? playerLink(c.primary_player_id) : null;
              return (
                <tr key={c.name}>
                  <td>{link?.href ? <Link href={link.href}>{c.name}</Link> : c.name}{c.player_ids.length > 1 && <span className="ii-dup"> · {c.player_ids.length} Atlas records</span>}</td>
                  <td>{c.role}</td>
                  <td>{c.status} <Cite prov={expand(c.provenance)} index={idx} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <ClassedHeading id="connectivity-h" title="Infrastructure connectivity" cls="fact" note="Distances marked ‘straight-line’ are computed from approximate coordinates and rounded to 5 km; ‘road’ distances are quoted from the cited source." />
        {corridorRefs.length > 0 && (
          <p className="node-para">Corridor context: {corridorRefs.map((c, i) => <span key={c.id}>{i > 0 && ', '}<Link href={c.href!}>{c.name}</Link> <span className="ii-src-meta">({c.meta})</span></span>)}.</p>
        )}
        <div className="ii-conn">
          {MODES.filter((m) => conn[m].length).map((m) => (
            <div key={m} className="ii-conn-mode">
              <div className="ii-conn-k">{CONNECTIVITY_LABELS[m]}</div>
              <ul role="list">
                {conn[m].map((ref) => {
                  const infra = getInfra(ref.infra_id)!;
                  const rel = rels.find((r) => r.id === ref.relation_id)!;
                  const sl = straightLineKm(n, infra);
                  return (
                    <li key={ref.infra_id}>
                      <b>{infra.name}</b> <span className="ii-status">{infra.status.replace(/_/g, ' ')}</span> <EvidenceTag e={rel.evidence} />
                      <div className="ii-conn-d">
                        {rel.sourced_distance && <span>{rel.sourced_distance.km} km by {rel.sourced_distance.kind} (sourced) · </span>}
                        {sl !== null && <span>≈{sl} km straight-line · </span>}
                        {rel.note} <Cite prov={expand([...rel.provenance, ...infra.provenance.slice(0, 1)])} index={idx} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <ClassedHeading id="position-h" title="Supply-chain position" cls="analysis" />
        <ol className="ii-flow" aria-label="Supply-chain position">
          <li><span>Suppliers &amp; inputs</span>{n.supply_chain_position.upstream.join(' · ')}</li>
          <li className="is-node"><span>Industrial node</span>{n.supply_chain_position.node}</li>
          <li><span>Logistics network</span>{n.supply_chain_position.logistics.join(' · ')}</li>
          <li><span>Gateways</span>{n.supply_chain_position.gateways.join(' · ')}</li>
          <li><span>Markets</span>{n.supply_chain_position.markets.join(' · ')}</li>
        </ol>

        <ClassedHeading id="dependencies-h" title="Strategic dependencies" cls="analysis" note="Each item is tagged as a sourced fact or as Techadyant analysis." />
        <ul className="ii-deps" role="list">
          {n.strategic_dependencies.map((d) => (
            <li key={d.title}><b>{d.title}</b> <EvidenceTag e={d.evidence} /><p>{d.detail} <Cite prov={expand(d.provenance)} index={idx} /></p></li>
          ))}
        </ul>

        <ClassedHeading id="gaps-h" title="Connectivity gaps" cls="score" note={`Connectivity Gap Index — requirement profile: ${n.requirement_profile.replace('_', ' ')}. High = larger gap between what the anchor industry needs and what exists.`} />
        <div className="ii-scores ii-scores-2"><ScoreCard s={cgi} /><ScoreCard s={ics} /></div>
        <h3 className="ii-h3">CGI — requirement assessment</h3>
        <ScoreBreakdown s={cgi} />
        <h3 className="ii-h3">ICS — connectivity components</h3>
        <ScoreBreakdown s={{ ...ics, components: icsView }} />

        <div id="opportunities">
          <ClassedHeading id="opps-h" title="Opportunity surfaces" cls="opportunity" note="Analytical hypotheses, not forecasts of procurement or contracts. Each starts from a sourced development; every later step is labelled." />
          {opps.length === 0 && <p className="node-para">No opportunity surface recorded yet.</p>}
          {opps.map((o) => (
            <article key={o.id} className="ii-opp">
              <h3>{o.title}</h3>
              <div className="ii-opp-meta">
                <span>{o.opportunity_type.replace(/_/g, ' ')}</span><span>Horizon: {o.horizon}</span><span>Confidence: {o.confidence}</span>
              </div>
              <p className="ii-opp-trigger"><b>Trigger (fact):</b> {o.triggering_development.text} <Cite prov={expand(o.triggering_development.provenance)} index={idx} /></p>
              <ol className="ii-chain">
                {o.chain.map((c, i) => (
                  <li key={i}><span className="ii-chain-stage">{c.stage.replace(/_/g, ' ')}</span> <EvidenceTag e={c.evidence} /> {c.text} <Cite prov={expand(c.provenance)} index={idx} /></li>
                ))}
              </ol>
              <p className="node-para"><b>Why it matters:</b> {o.strategic_rationale}</p>
              <div className="ii-opp-cols">
                <div><div className="ii-conn-k">Constraints</div><ul role="list">{o.constraints.map((c) => <li key={c}>{c}</li>)}</ul></div>
                <div>
                  <div className="ii-conn-k">Relevant companies</div>
                  <ul role="list">{o.relevant_player_ids.map((pid) => { const l = playerLink(pid); return <li key={pid}>{l.href ? <Link href={l.href}>{l.name}</Link> : l.name}</li>; })}</ul>
                  {o.affected_supply_chains.length > 0 && <><div className="ii-conn-k" style={{ marginTop: 10 }}>Supply chains</div><p className="ii-src-meta">{o.affected_supply_chains.join(' · ')}</p></>}
                </div>
              </div>
            </article>
          ))}
        </div>

        {projects.length > 0 && (
          <>
            <ClassedHeading id="projects-h" title="Related infrastructure projects" cls="fact" />
            <table className="ii-table">
              <thead><tr><th>Project</th><th>Status</th><th>Cost</th><th>Industrial consequence <span className="ii-ev ii-ev-analysis">Analysis</span></th></tr></thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td><Link href={`/research/infrastructure-projects/#${p.id.slice(5)}`}>{p.name}</Link></td>
                    <td>{p.status.replace(/_/g, ' ')}{p.expected_completion ? ` · ${p.expected_completion}` : ''} <Cite prov={expand(p.provenance)} index={idx} /></td>
                    <td>{inrCr(p.estimated_cost_cr)}</td>
                    <td>{p.strategic_significance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {(signals.length > 0 || reports.length > 0) && (
          <div className="ii-related">
            {signals.length > 0 && (
              <div>
                <h2 className="node-h2">Related Signals</h2>
                <ul className="node-sources" role="list">{signals.map((s) => <li key={s.id}><Link href={s.href!}>{s.name}</Link> <span className="ii-src-meta">{s.meta}</span></li>)}</ul>
              </div>
            )}
            {reports.length > 0 && (
              <div>
                <h2 className="node-h2">Related reports</h2>
                <ul className="node-sources" role="list">{reports.map((r) => <li key={r.id}><Link href={r.href!}>{r.name}</Link> <span className="ii-src-meta">{r.meta}</span></li>)}</ul>
              </div>
            )}
          </div>
        )}

        <h2 className="node-h2">Known data gaps</h2>
        <ul className="node-infra" role="list">{n.data_gaps.map((g) => <li key={g}>{g}</li>)}</ul>

        <GatiShaktiContrast />

        <h2 className="node-h2" id="sources">Sources</h2>
        <SourceList items={srcs.map((s, i) => ({ n: i + 1, name: s.source_name, publisher: s.publisher, url: s.source_url, date: s.publication_date, type: s.source_type, confidence: s.confidence }))} />
        <p className="ii-fine">Accessed {monthYear(n.last_verified)}. Techadyant cites and interprets these sources; it does not reproduce PM GatiShakti or other restricted datasets.</p>

        <div className="node-foot ii-foot">
          <Link href="/research/industrial-nodes/" className="see-all">← All industrial nodes</Link>
          <Link href="/research/infrastructure-projects/" className="see-all">Infrastructure projects →</Link>
        </div>
      </section>
    </>
  );
}

