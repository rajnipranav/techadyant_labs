import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AtlasNav } from '../../AtlasNav';
import { JsonLd, breadcrumb, faqLd, SITE, ORG_REF } from '../../seo';
import { IndustrialMap } from '../../industrial/IndustrialMap';
import { INDIA_OUTLINE } from '../../../corridors/data';
import { EvidenceTag, SourceList } from '../../industrial/ui';
import { metricRows } from '../../logistics/data';
import {
  programmes, programmeBySlug, sidFor, projectsFor, infraFor, nodesFor, opportunitiesFor, companiesFor,
  signalsFor, reportsFor, corridorLinks, footprintPoints, sourcesFor, sidCorridorsFor, sidNodesFor,
} from '../data';
import {
  C, fmtDate, StageChip, VerifChip, SectionHead, StageLadder, NodePaths, LogisticsSystem, SupplyPath,
  Consequences, OppCard, SignalCards, ProjectTable, RelatedProgrammes, CrossCuttingDiagram, type SystemItem,
} from '../ui';
import { STAGE_LABEL } from '../types';

export function generateStaticParams() {
  return programmes.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = programmeBySlug(slug);
  if (!p) return { title: 'Programme' };
  const title = `${p.name}: Industrial Impact, Connectivity & Opportunities`;
  const description = `${p.short_name} through an industrial lens — ${p.angle.replace(/\.$/, '')}: status, components, connected industrial nodes, supply-chain effects and opportunity surfaces. Sourced and dated.`.slice(0, 158);
  const url = `${SITE}/research/programmes/${p.slug}/`;
  return {
    title, description,
    keywords: [p.name, `${p.short_name} status`, `${p.short_name} industrial impact`, 'India infrastructure programmes', 'India logistics', 'industrial connectivity India'],
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article', siteName: 'Techadyant Labs', images: [{ url: '/og/default.png', width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/og/default.png'] },
  };
}

const TOC = [
  ['glance', 'At a glance'], ['why', 'Why it matters'], ['footprint', 'Footprint'], ['components', 'Components'],
  ['nodes', 'Industrial nodes'], ['system', 'Logistics system'], ['consequences', 'Consequences'], ['supply', 'Supply chain'],
  ['opportunities', 'Opportunities'], ['projects', 'Projects'], ['signals', 'Signals'], ['research', 'Research'], ['record', 'Delivery record'], ['sources', 'Sources'],
];

export default async function ProgrammePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = programmeBySlug(slug);
  if (!p) notFound();

  const sid = sidFor(p);
  const srcs = sourcesFor(p);
  const idx = new Map(srcs.map((s, i) => [s.id, i + 1]));
  const projs = projectsFor(p);
  const nodes = nodesFor(p);
  const opps = opportunitiesFor(p);
  const sigs = signalsFor(p);
  const reps = reportsFor(p);
  const comps = companiesFor(p);
  const cors = corridorLinks(p);
  const points = footprintPoints(p);
  const sidCors = sidCorridorsFor(p);
  const sidNodes = sidNodesFor(p);

  const system: SystemItem[] = [
    ...infraFor(p).map((i) => ({ name: i.name, type: i.type, status: i.status, via: (() => { const pn = projs.find((x) => x.project.infra_ids.includes(i.id))?.project.name ?? ''; return pn && pn.slice(0, 12) !== i.name.slice(0, 12) ? `via ${pn}` : 'linked project'; })() })),
    ...sidCors.map((c) => ({ name: c.name, type: c.mode === 'rail' ? 'freight_corridor' : c.mode === 'road' ? 'expressway' : 'seaport', status: 'reference record', via: 'SID logistics layer' })),
    ...sidNodes.map((n) => ({ name: n.name, type: n.type === 'port' ? 'seaport' : n.type === 'mmlp' ? 'mmlp' : n.type === 'airport' ? 'airport' : 'icd', status: n.status ?? 'status not recorded', via: 'SID logistics layer' })),
  ];

  const url = `${SITE}/research/programmes/${p.slug}/`;
  const faqs = [
    { q: `What is the current status of ${p.name}?`, a: `${STAGE_LABEL[p.stage]}. ${p.stage_note} ${p.glance.slice(0, 4).map((g) => `${g.label}: ${g.value}${g.as_of ? ` (${fmtDate(g.as_of)})` : ''}`).join('; ')}.` },
    { q: `Why does ${p.short_name} matter for Indian industry?`, a: p.why_it_matters.map((c) => c.text).join(' ') },
    { q: `Which industrial nodes does ${p.short_name} reach?`, a: nodes.length ? `Through evidenced projects: ${nodes.map((n) => `${n.node.short_name} (${n.node.state})`).join(', ')}.` : 'No industrial node in the Techadyant Atlas is linked to it by an evidenced project yet.' },
  ];

  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' }, { name: 'Programmes', path: '/research/programmes/' }, { name: p.short_name, path: `/research/programmes/${p.slug}/` }]),
        {
          '@context': 'https://schema.org', '@type': 'WebPage', name: `${p.name} — Programme Intelligence`, url,
          description: p.angle, isPartOf: { '@id': `${SITE}/#website` }, publisher: ORG_REF, dateModified: p.last_verified,
          about: { '@type': 'GovernmentService', name: p.name, provider: { '@type': 'GovernmentOrganization', name: p.lead_ministry }, areaServed: { '@type': 'Country', name: 'India' } },
          mentions: nodes.map((n) => ({ '@type': 'Place', name: n.node.name, url: `${SITE}/research/industrial-nodes/${n.node.slug}/` })),
        },
        faqLd(faqs),
      ]} />

      <header className="pi-hero">
        <div className="wrap">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">Atlas</Link><span className="sep">/</span>
            <Link href="/research/programmes/">Programmes</Link><span className="sep">/</span><span>{p.short_name}</span>
          </div>
          <div className="pi-eyebrow">Programme Intelligence{p.role === 'cross_cutting' ? ' · cross-cutting layer' : ''}</div>
          <h1>{p.name}</h1>
          <p className="pi-sub">{p.angle}</p>
          <p className="pi-q"><span>The Techadyant question</span>{p.question}</p>
          <dl className="pi-meta">
            <div><dt>Status</dt><dd><StageChip s={p.stage} /></dd></div>
            <div><dt>Time horizon</dt><dd>{p.time_horizon.text}</dd></div>
            <div><dt>Footprint</dt><dd>{p.geography}</dd></div>
            <div><dt>Sectors affected</dt><dd>{p.sectors.filter((s) => !s.startsWith('sector:')).join(' · ')}</dd></div>
          </dl>
          <div className="pi-ctas">
            <a href="#glance" className="pi-btn is-primary">Explore programme ↓</a>
            <a href="#nodes" className="pi-btn">View related Atlas</a>
          </div>
        </div>
      </header>

      <nav className="pi-toc" aria-label="On this page"><ul>{TOC.map(([id, l]) => <li key={id}><a href={`#${id}`}>{l}</a></li>)}</ul></nav>

      <main className="wrap pi-body">
        <SectionHead id="glance" kicker="01 · Programme at a glance" title="What is verifiably true today" cls="fact"
          note={<>Only figures with a source on file. Each carries its own date — programme figures are published at different times, so they are not summed or compared across dates.</>} />
        <dl className="pi-glance">
          {p.glance.map((g) => (
            <div key={g.label}><dt>{g.label}</dt><dd>{g.value} <C p={g.provenance} idx={idx} /><span className="pi-asof">{g.as_of ? `As of ${fmtDate(g.as_of)}` : 'Undated source'}</span></dd></div>
          ))}
          <div><dt>Lead ministry</dt><dd>{p.lead_ministry}</dd></div>
          <div><dt>Launch</dt><dd>{p.launch.label} <C p={p.launch.provenance} idx={idx} /></dd></div>
        </dl>
        {sid && (
          <div className="pi-sid">
            <span>SID reference record:</span><VerifChip v={sid.verification_status} />
            {metricRows(sid).slice(0, 3).map((r) => <span key={r.label}>· {r.label}: <b>{r.value}</b></span>)}
            {typeof sid.key_metrics?.as_on === 'string' && <span>· as on {fmtDate(sid.key_metrics.as_on)}</span>}
            <Link href={`/research/logistics/#${sid.id}`}>Source record →</Link>
          </div>
        )}
        <h3 className="pi-h3" style={{ margin: '26px 0 10px', fontSize: 15 }}>Announced → approved → under implementation → completed → operational</h3>
        <StageLadder p={p} idx={idx} />

        <SectionHead id="why" kicker="02 · Why it matters" title={`How ${p.short_name} is changing India’s industrial system`} cls="analysis"
          note="Interpretation, labelled. Sourced statements are marked Fact." />
        <div className="pi-why">
          {p.why_it_matters.map((c, i) => <p key={i} className={`pi-claim-${c.evidence}`}><EvidenceTag e={c.evidence} /> {c.text} <C p={c.provenance} idx={idx} /></p>)}
        </div>
        {p.role === 'cross_cutting' && <div style={{ marginTop: 22 }}><CrossCuttingDiagram /></div>}

        <SectionHead id="footprint" kicker="03 · Geographic footprint" title={`Where ${p.short_name} meets India’s industrial geography`} cls="derived"
          note={<>Shows only industrial nodes and infrastructure reached through an evidenced project link, not the programme’s full national network. Techadyant does not replicate PM GatiShakti’s GIS. National footprint: {p.geography.toLowerCase()}.</>} />
        {points.length ? <IndustrialMap points={points} outline={INDIA_OUTLINE} /> : <p className="pi-empty">No linked node or infrastructure with recorded coordinates yet.</p>}
        {cors.length > 0 && (
          <ul className="pi-links" style={{ marginTop: 14 }}>
            {cors.map((c) => <li key={c.id}><Link href={c.href!}>{c.name}</Link><span className="pi-l-meta">{c.meta} · {c.note}</span><C p={c.provenance} idx={idx} /></li>)}
          </ul>
        )}

        <SectionHead id="components" kicker="04 · Programme components" title="How the programme is built" cls="fact" note="Expand a component for its scope and the latest sourced progress." />
        <div className="pi-comps">
          {p.components.map((c) => (
            <details key={c.key} className="pi-comp">
              <summary>
                <span className="pi-comp-name">{c.name}</span>
                {c.scale && <span className="pi-comp-scale">{c.scale}</span>}
                <span>{c.stage ? <StageChip s={c.stage} /> : null}</span>
              </summary>
              <div className="pi-comp-body">
                <p>{c.description}</p>
                {c.progress ? <p className="pi-comp-prog">Progress: {c.progress}</p> : <p>Progress: not captured from a primary source.</p>}
                <C p={c.provenance} idx={idx} />
              </div>
            </details>
          ))}
        </div>

        <SectionHead id="nodes" kicker="05 · Connected industrial nodes" title="Industrial nodes affected" cls="derived"
          note="Each card shows the evidence path from programme to node. A node appears only when a sourced project links them; two locations being close is not enough." />
        <NodePaths p={p} nodes={nodes} />

        <SectionHead id="system" kicker="06 · Connected logistics system" title="The connected logistics system" cls="derived"
          note="Road → rail → DFC → logistics parks → ports → air cargo → industrial nodes. Filled only from records linked to this programme (Atlas projects and the SID logistics layer). An empty row means no linked record yet, not that nothing exists." />
        <LogisticsSystem items={system} nodes={nodes} />

        <SectionHead id="consequences" kicker="07 · Industrial consequences" title={`What ${p.short_name} changes for industry`} cls="analysis" note="Each statement is tagged Fact (sourced) or Analysis (Techadyant interpretation)." />
        <Consequences p={p} idx={idx} />

        <SectionHead id="supply" kicker="08 · Supply-chain implications" title="Where the programme sits in the supply chain" note="Input → manufacturing node → freight network → logistics node → port / airport → market." />
        <SupplyPath p={p} idx={idx} />

        <SectionHead id="opportunities" kicker="09 · Opportunity surfaces" title="Where new opportunity may appear" cls="opportunity"
          note="Analytical hypotheses with a sourced trigger, stated constraints and a confidence label (High / Medium / Emerging). Not forecasts, and not procurement signals." />
        {opps.length ? <div className="pi-opps">{opps.map(({ opp, why }) => <OppCard key={opp.id} opp={opp} why={why} idx={idx} />)}</div> : <p className="pi-empty">No opportunity surface recorded yet.</p>}
        <p className="pi-caveat">Programme scorecard (industrial connectivity, supply-chain impact, strategic importance, opportunity potential): not published. Techadyant shows a score only once its methodology is documented and the inputs exist — see the <Link href="/research/industrial-nodes/methodology/">node-level methodology</Link>.</p>

        <SectionHead id="projects" kicker="10 · Related projects" title="Projects linked to the programme" cls="fact" note="Projects in the Atlas that carry a sourced link to this programme. New linked projects appear here automatically." />
        <ProjectTable rows={projs} idx={idx} />

        <div className="pi-two">
          <div>
            <SectionHead id="companies" kicker="11 · Related companies" title="Companies at connected nodes" cls="derived" />
            {comps.length ? (
              <ul className="pi-links">
                {comps.map((c) => <li key={c.link.id}>{c.link.href ? <Link href={c.link.href}>{c.link.name}</Link> : <b>{c.link.name}</b>}<span className="pi-l-meta">{c.role} · {c.node.short_name}</span></li>)}
              </ul>
            ) : <p className="pi-empty">None yet.</p>}
            <p className="pi-caveat">Location context only. No company listed here is claimed to hold a contract, grant or role under the programme.</p>
          </div>
          <div>
            <SectionHead id="related" kicker="12 · Related programmes" title="How it connects to other programmes" />
            <RelatedProgrammes p={p} idx={idx} />
          </div>
        </div>

        <SectionHead id="signals" kicker="13 · Related signals" title={`Latest ${p.short_name} signals`}
          note="Surfaced automatically when a Signal names the programme, is linked to it by Techadyant, or covers a node or project it reaches. The reason is shown on each card." />
        <SignalCards items={sigs} programme={p.short_name} />

        <SectionHead id="research" kicker="14 · Related research" title="Reports and briefings" />
        {reps.length ? (
          <ul className="pi-links">
            {reps.map((r) => <li key={r.link.id}><Link href={r.link.href!}>{r.link.name}</Link><span className="pi-l-meta">{r.link.meta} · {r.reasons.join(' · ')}</span></li>)}
          </ul>
        ) : <p className="pi-empty">No linked report yet.</p>}

        <SectionHead id="record" kicker="15 · Delivery record" title="Timeline, gaps and delays" cls="fact" />
        <div className="pi-two">
          <ol className="pi-timeline">
            {p.timeline.map((t) => <li key={t.date + t.label}><time dateTime={t.date}>{fmtDate(t.date)}</time><span>{t.label} <C p={t.provenance} idx={idx} /></span></li>)}
          </ol>
          <div className="pi-gaps">
            {p.gaps.map((g) => <div key={g.title} className="pi-gap"><b>{g.title} <EvidenceTag e={g.evidence} /></b><p>{g.detail} <C p={g.provenance} idx={idx} /></p></div>)}
          </div>
        </div>

        <SectionHead id="gaps" kicker="Data gaps" title="What this page does not yet know" />
        <ul className="pi-datagaps">{p.data_gaps.map((g) => <li key={g}>{g}</li>)}</ul>

        <SectionHead id="sources" kicker="Sources" title="Source record" note={`Data as of ${fmtDate(p.data_as_of)} · verified ${fmtDate(p.last_verified)}. Numbers in brackets throughout the page refer to this list.`} />
        <SourceList items={srcs.map((s, i) => ({ n: i + 1, name: s.source_name, publisher: s.publisher, url: s.source_url, date: s.publication_date, type: s.source_type, confidence: s.confidence }))} />

        <SectionHead id="method" kicker="Method" title="How this page is built" />
        <div className="pi-method">
          <p>Facts and headline metrics come from the SID logistics reference layer and the shared Techadyant source registry; every figure carries a date and a numbered source. The Techadyant reading — why it matters, consequences, opportunity surfaces — is labelled as analysis.</p>
          <p>Connected projects, industrial nodes, opportunities, signals and reports are not hand-listed. They are derived at build time from evidenced links in the Atlas graph, so a new project, signal or report linked to {p.short_name} appears here on the next build. We don’t replicate India’s infrastructure databases. We interpret them.</p>
        </div>
      </main>
    </>
  );
}
