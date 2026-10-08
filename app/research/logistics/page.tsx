import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../seo';
import { VizPanel, StackedBar, BarList } from '../../components/viz/Viz';
import { reports } from '../../reports/data';
import { industrialNodes, scoresFor, opportunities } from '../industrial/data';
import {
  programmes, programmeHref, programmeBySlug, flagshipCards, logisticsSignals, programmesForNode, programmeRef,
} from '../programmes/data';
import { FlagshipCardView, CrossCuttingDiagram, fmtDate } from '../programmes/ui';
import { OPP_CONFIDENCE_LABEL } from '../programmes/types';
import {
  logistics, logisticsVerificationMix, LOG_VERIFICATION_LABEL, LOG_VERIFICATION_COLOR,
  LOG_VERIFICATION_DEFINITION, PROGRAMME_TYPE_LABEL, PROGRAMME_TYPE_ORDER, MODE_LABEL,
  metricRows, programmeById, sourceLine, lastUpdated,
  type LogisticsProgramme, type LogisticsSource, type VerificationStatus,
} from './data';

const TITLE = 'India Logistics & Mobility Intelligence — programmes, corridors, industrial impact [2026]';
const DESC = 'What India’s changing logistics infrastructure means for industrial competitiveness: Gati Shakti, Bharatmala, Sagarmala, freight corridors and ports — read for bottlenecks, industrial nodes and opportunities.';
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ['India logistics', 'India logistics infrastructure', 'PM Gati Shakti', 'Bharatmala', 'Sagarmala', 'Dedicated Freight Corridor', 'ITLA', 'India industrial connectivity', 'logistics cost India'],
  alternates: { canonical: `${SITE}/research/logistics/` },
  openGraph: { title: TITLE, description: DESC, url: `${SITE}/research/logistics/`, type: 'website', siteName: 'Techadyant Labs', images: [{ url: '/og/default.png', width: 1200, height: 630, alt: TITLE }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ['/og/default.png'] },
};

const fmtIN = (n: number) => n.toLocaleString('en-IN');

function VerifChip({ v }: { v: VerificationStatus }) {
  return (
    <span className="log-chip" style={{ ['--c' as string]: LOG_VERIFICATION_COLOR[v] }}>
      {LOG_VERIFICATION_LABEL[v]}
    </span>
  );
}

function SourceItem({ s }: { s: LogisticsSource }) {
  const pending = !s.url;
  return (
    <li className="log-source">
      <span className="log-source-main">
        {s.url ? (
          <a href={s.url} target="_blank" rel="noopener noreferrer nofollow">{sourceLine(s)}</a>
        ) : (
          <>{sourceLine(s)} <em className="log-src-host">({s.url_host ?? 'host on file'} — URL pin pending)</em></>
        )}
        {!s.is_primary && <em className="log-src-lead">lead only — never a sole source</em>}
      </span>
      {s.supports && <span className="log-source-supports">Supports: {s.supports}</span>}
      {s.quoted_text && <span className="log-source-quote">“{s.quoted_text}”</span>}
      {s.capture_note && pending && <span className="log-source-note">{s.capture_note}</span>}
    </li>
  );
}

function SourceList({ sources }: { sources: LogisticsSource[] }) {
  if (!sources.length) return <p className="log-nosrc">No source captured yet — deliberately empty pending human capture.</p>;
  return <ul className="log-sources" role="list">{sources.map((s) => <SourceItem key={s.id} s={s} />)}</ul>;
}

function ProgrammeCard({ p }: { p: LogisticsProgramme }) {
  const rows = metricRows(p);
  return (
    <article className="log-card" id={p.id}>
      <div className="log-card-head">
        <h3>{p.name}</h3>
        <VerifChip v={p.verification_status} />
      </div>
      <p className="log-card-meta">
        {p.ministry}{p.status ? ` · ${p.status}` : ''}
      </p>
      <p className="log-card-summary">{p.summary}</p>
      {rows.length > 0 && (
        <dl className="log-metrics">
          {rows.map((r) => (
            <div key={r.label} className="log-metric">
              <dt>{r.label}</dt><dd>{r.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {rows.length === 0 && (
        <p className="log-gap">No figures asserted — <b>needs a human source</b> before any metric is entered.</p>
      )}
      {p.rationale && <p className="log-rationale">{p.rationale}</p>}
      <details className="log-src-details">
        <summary>Source record ({p.sources.length})</summary>
        <SourceList sources={p.sources} />
      </details>
    </article>
  );
}

/** A dated headline figure for the system-at-a-glance strip; only from a sourced record. */
interface Tile { label: string; value: string; asOf: string; href: string; basis: string; verif?: VerificationStatus }
function glance(slug: string, label: string) {
  const p = programmeBySlug(slug);
  const g = p?.glance.find((x) => x.label === label);
  return p && g ? { value: g.value, asOf: g.as_of ?? p.data_as_of, href: `${programmeHref(slug)}#glance` } : null;
}

const LOGISTICS_REPORT_RE = /logistic|freight|cargo|shipping|container/i;

export default function LogisticsAtlas() {
  const mix = logisticsVerificationMix();
  const updated = new Date(lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const itla = programmeById('itla');
  const sgf = programmeById('sme-growth-fund');
  const dfc = programmeById('dfc');
  const ports = programmeById('major-port-cargo');
  const iwai = programmeById('iwai');
  const num = (v: unknown) => (typeof v === 'number' ? v.toLocaleString('en-IN') : String(v));

  const tiles: Tile[] = [];
  if (dfc?.key_metrics?.edfc_km && dfc.key_metrics.wdfc_km) tiles.push({ label: 'Dedicated freight corridors built', value: `${num(Number(dfc.key_metrics.edfc_km) + Number(dfc.key_metrics.wdfc_km))} km`, asOf: '2026-09-08', href: '#dfc', basis: `EDFC ${num(dfc.key_metrics.edfc_km)} km complete (Dec 2023) + WDFC ${num(dfc.key_metrics.wdfc_km)} km fully operational (Sep 2026)`, verif: dfc.verification_status });
  const bm = glance('bharatmala', 'Constructed');
  if (bm) tiles.push({ label: 'Bharatmala Phase-I constructed', value: bm.value.replace(/ \(.*\)/, ''), asOf: bm.asOf, href: bm.href, basis: 'of 34,800 km approved in 2017; new sanctions discontinued since Nov 2023' });
  if (ports?.key_metrics?.cargo_mt_fy26) tiles.push({ label: 'Major-port cargo, FY 2025-26', value: `${num(ports.key_metrics.cargo_mt_fy26)} MT`, asOf: '2026-04-11', href: '#major-port-cargo', basis: `record; ${num(ports.key_metrics.cargo_mt_fy25)} MT in FY 2024-25`, verif: ports.verification_status });
  if (iwai?.key_metrics?.cargo_mmt_fy25) tiles.push({ label: 'Inland-waterway cargo, FY 2024-25', value: `${num(iwai.key_metrics.cargo_mmt_fy25)} MT`, asOf: '2025-04-24', href: '#iwai', basis: 'record movement on national waterways', verif: iwai.verification_status });
  const npg = glance('gati-shakti', 'Projects evaluated (NPG)');
  if (npg) tiles.push({ label: 'Projects evaluated on the Gati Shakti NMP', value: npg.value.split(' worth')[0], asOf: npg.asOf, href: npg.href, basis: npg.value.includes('worth') ? `worth ${npg.value.split('worth ')[1]}` : '' });
  const smc = glance('sagarmala', 'Completed');
  if (smc) tiles.push({ label: 'Sagarmala projects completed', value: smc.value.split(' · ')[0], asOf: smc.asOf, href: smc.href, basis: `${smc.value.split(' · ')[1] ?? ''} of an 845-project, ₹6.06 lakh crore portfolio` });


  const held = [
    { label: 'Programmes tracked', value: logistics.programmes.length },
    { label: 'Corridor records', value: logistics.corridors.length },
    { label: 'Nodes (ports, MMLPs, gateways)', value: logistics.nodes.length },
    { label: 'Projects ≥ ₹500 crore (v2)', value: logistics.projects.length },
    { label: 'Opportunity surfaces', value: logistics.opportunity_surfaces.length },
  ];
  const cards = flagshipCards();
  const sigs = logisticsSignals(6);
  const featured = reports.filter((r) => LOGISTICS_REPORT_RE.test(`${r.title} ${r.subtitle} ${r.summary}`)).slice(0, 4);
  const progOpps = opportunities.filter((o) => o.programme_ids?.length);
  const nodeRows = industrialNodes.map((n) => ({ n, ics: scoresFor(n)[0], progs: programmesForNode(n.id) }));

  const watching: { title: string; detail: string; href: string; date: string }[] = [
    ...(itla ? [{ title: 'ITLA stands up', detail: 'The new authority will technically appraise every Government transport project of ₹500 crore or more and build a National Transport Data Repository. Watch for its first appraisals and data releases.', href: '#itla', date: '2026-10-06' }] : []),
    { title: 'What follows Bharatmala Phase-I', detail: 'New Phase-I sanctions have been discontinued since Nov 2023 while awarded corridors are completed. The successor framework will decide which industrial routes get the next highway money.', href: `${programmeHref('bharatmala')}#record`, date: '2026-07-22' },
    { title: 'Does the full WDFC move freight off the road?', detail: 'The Western DFC became fully operational on 8 Sep 2026. Whether manufacturers on the corridor shift volume depends on terminals and tariffs, not track length.', href: '#dfc', date: '2026-09-08' },
    { title: 'Cargo terminals reach the nodes', detail: '118 of 306 approved Gati Shakti Cargo Terminals were commissioned by Jan 2026. Their locations relative to industrial nodes are the next layer to map.', href: `${programmeHref('gati-shakti')}#components`, date: '2026-01-13' },
    { title: 'Sagarmala 2.0 and the Coastal Economic Zones', detail: 'A Sagarmala 2.0 (₹3.6 lakh crore total investment) is proposed; the 14 CEZs remain at perspective-plan stage. Port-led industrialisation is the pillar to watch.', href: `${programmeHref('sagarmala')}#opportunities`, date: '2026-04-11' },
  ];

  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([
          { name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' },
          { name: 'Logistics & Mobility', path: '/research/logistics/' },
        ]),
        {
          '@context': 'https://schema.org', '@type': 'CollectionPage',
          name: 'Logistics & Mobility — Techadyant Atlas', url: `${SITE}/research/logistics/`, description: DESC,
          isPartOf: { '@id': `${SITE}/#website` }, publisher: ORG_REF,
          about: ['India logistics infrastructure', 'Dedicated Freight Corridors', 'Bharatmala', 'PM Gati Shakti', 'Sagarmala', 'ULIP', 'ITLA', 'industrial connectivity'],
          hasPart: programmes.map((p) => ({ '@type': 'WebPage', name: p.name, url: `${SITE}${programmeHref(p.slug)}` })),
        },
        {
          '@context': 'https://schema.org', '@type': 'Dataset',
          name: 'India Integrated Logistics Atlas — reference layer v1',
          description: 'National freight corridors, flagship logistics programmes and the ITLA ≥₹500 crore appraisal tier, with a verification label and source record on every figure.',
          url: `${SITE}/research/logistics/`, isAccessibleForFree: true,
          creator: { '@type': 'Organization', name: 'Techadyant Labs' },
          spatialCoverage: { '@type': 'Place', name: 'India' },
          keywords: ['India logistics', 'freight corridors', 'DFC', 'Bharatmala', 'Gati Shakti', 'Sagarmala', 'ITLA'],
        },
      ]} />

      {/* ── HERO ── */}
      <header className="pi-hero">
        <div className="wrap">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">The Atlas</Link><span className="sep">/</span>
            <span>Logistics &amp; Mobility</span>
          </div>
          <div className="pi-eyebrow">The Atlas · Logistics &amp; Mobility</div>
          <h1>What India’s changing logistics infrastructure means for industrial competitiveness</h1>
          <p className="pi-sub">The gateway to Techadyant’s infrastructure intelligence: the national programmes building India’s freight system, the industrial nodes they reach, and the bottlenecks and opportunities that follow.</p>
          <div className="lg-contrast" aria-label="How Techadyant reads logistics">
            <div><span>A logistics website asks</span>What is happening in logistics?</div>
            <div><span>A government platform asks</span>Where is the infrastructure?</div>
            <div className="is-us"><span>Techadyant asks</span>What does it mean for industrial competitiveness?</div>
          </div>
          <p className="lg-questions">Where are the bottlenecks? · Which industrial nodes benefit? · Which supply chains change? · Which technologies become relevant? · Where do new opportunity surfaces appear?</p>
          <div className="pi-ctas">
            <Link href="/research/programmes/" className="pi-btn is-primary">Programme Intelligence →</Link>
            <Link href="/research/industrial-nodes/" className="pi-btn">Industrial nodes</Link>
            <a href="#reference" className="pi-btn">Reference layer</a>
          </div>
        </div>
      </header>

      <main className="wrap pi-body">
        {/* ── SYSTEM AT A GLANCE ── */}
        <div className="pi-sec-head" id="glance">
          <div className="pi-kicker">01 · The logistics system at a glance<span className="pi-cls pi-cls-fact">Fact</span></div>
          <h2>The freight system, measured</h2>
          <p className="pi-sec-note">Headline figures with a source on file, each with its own date. Figures from different dates are not combined.</p>
        </div>
        <dl className="pi-glance lg-tiles">
          {tiles.map((t) => (
            <div key={t.label}>
              <dt>{t.label}</dt>
              <dd><span className="lg-big">{t.value}</span><span className="pi-asof">{t.basis}</span><span className="pi-asof">As of {fmtDate(t.asOf)} · {t.verif ? LOG_VERIFICATION_LABEL[t.verif] : 'sourced on programme page'} · <Link href={t.href}>source →</Link></span></dd>
            </div>
          ))}
        </dl>

        {/* ── PROGRAMME INTELLIGENCE ── */}
        <div className="pi-sec-head" id="programmes">
          <div className="pi-kicker">02 · Programme Intelligence</div>
          <h2>National infrastructure programmes</h2>
          <p className="pi-sec-note">The programmes reshaping India’s physical and digital logistics architecture, each read for what it changes in industry. <Link href="/research/programmes/">All programmes →</Link></p>
        </div>
        <div className="pi-cards">{cards.map((c) => <FlagshipCardView key={c.key} c={c} />)}</div>
        <div style={{ marginTop: 18 }}><CrossCuttingDiagram compact /></div>

        {/* ── FEATURED RESEARCH + SIGNALS ── */}
        <div className="pi-two">
          <div>
            <div className="pi-sec-head" id="research">
              <div className="pi-kicker">03 · Featured research</div>
              <h2>Reports on the system</h2>
            </div>
            {featured.length ? (
              <ul className="pi-links">
                {featured.map((r) => <li key={r.slug}><Link href={`/reports/${r.slug}/`}>{r.title}</Link><span className="pi-l-meta">{r.status === 'forthcoming' ? 'Forthcoming' : r.publishedLabel} · {r.domain}</span></li>)}
              </ul>
            ) : <p className="pi-empty">No logistics report yet.</p>}
          </div>
          <div>
            <div className="pi-sec-head" id="watching">
              <div className="pi-kicker">04 · What we are watching</div>
              <h2>Open questions</h2>
            </div>
            <div className="pi-gaps">
              {watching.map((w) => <div key={w.title} className="pi-gap lg-watch"><b><Link href={w.href}>{w.title}</Link> <span className="pi-l-meta">{fmtDate(w.date)}</span></b><p>{w.detail}</p></div>)}
            </div>
          </div>
        </div>

        <div className="pi-sec-head" id="signals">
          <div className="pi-kicker">05 · Signals from the system</div>
          <h2>Latest logistics signals</h2>
          <p className="pi-sec-note">Signals on freight, ports, rail, corridors and terminals — selected automatically from the Signals feed. <Link href="/signals/">All signals →</Link></p>
        </div>
        {sigs.length ? (
          <div className="pi-signals">
            {sigs.map((s) => (
              <article key={s.slug} className="pi-signal">
                <div className="pi-signal-meta">{s.no} · {s.dateLabel}</div>
                <h3><Link href={`/signals/${s.slug}/`}>{s.title}</Link></h3>
                <p>{s.excerpt}</p>
                <Link href={`/signals/${s.slug}/`} className="pi-more">Read Signal →</Link>
              </article>
            ))}
          </div>
        ) : <p className="pi-empty">No logistics signal yet.</p>}

        {/* ── INDUSTRIAL CONSEQUENCES ── */}
        <div className="pi-sec-head" id="consequences">
          <div className="pi-kicker">06 · Industrial consequences<span className="pi-cls pi-cls-analysis">Techadyant analysis</span></div>
          <h2>What the programmes change for industry</h2>
          <p className="pi-sec-note">One consequence from each programme page, where the full reasoning, sources and the other dimensions sit.</p>
        </div>
        <div className="pi-cons">
          {programmes.map((p) => {
            const c = p.consequences[0];
            const a = c.claims.find((x) => x.evidence === 'analysis') ?? c.claims[0];
            return (
              <section key={p.id} className="pi-con">
                <div className="pi-con-k">{p.short_name}</div>
                <h3>{c.headline}</h3>
                <p className="pi-claim pi-claim-analysis">{a.text}</p>
                <Link href={`${programmeHref(p.slug)}#consequences`} className="pi-more">All consequences →</Link>
              </section>
            );
          })}
        </div>

        {/* ── INDUSTRIAL CONNECTIVITY / ATLAS ── */}
        <div className="pi-sec-head" id="connectivity">
          <div className="pi-kicker">07 · Industrial connectivity</div>
          <h2>Industrial nodes and the programmes that reach them</h2>
          <p className="pi-sec-note">Industrial Connectivity Score from the <Link href="/research/industrial-nodes/methodology/">node methodology</Link>. A programme is listed only where an evidenced project links it to the node.</p>
        </div>
        <div className="pi-table-wrap">
          <table className="pi-table">
            <thead><tr><th>Industrial node</th><th>State</th><th>Connectivity (ICS)</th><th>Programmes reaching it</th></tr></thead>
            <tbody>
              {nodeRows.map(({ n, ics, progs }) => (
                <tr key={n.id}>
                  <td><Link href={`/research/industrial-nodes/${n.slug}/`}><b>{n.name}</b></Link></td>
                  <td>{n.state}</td>
                  <td className="pi-nowrap">{ics.status === 'computed' ? `${ics.score}/100 · ${ics.band}` : 'Insufficient Data'}</td>
                  <td>{progs.length ? progs.map((x) => <span key={x.ref.id} className="pi-td-sub">{x.ref.href ? <Link href={x.ref.href}>{x.ref.name}</Link> : x.ref.name} — via {x.via}</span>) : <span className="pi-td-sub">No evidenced programme link yet</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── OPPORTUNITY SURFACES ── */}
        <div className="pi-sec-head" id="opportunities">
          <div className="pi-kicker">08 · Opportunity surfaces<span className="pi-cls pi-cls-opportunity">Opportunity surface</span></div>
          <h2>Where opportunity may appear</h2>
          <p className="pi-sec-note">Hypotheses with a sourced trigger and stated constraints. Not claims that government will procure anything, and never forecasts of contracts.</p>
        </div>
        <div className="pi-opps">
          {progOpps.map((o) => (
            <article key={o.id} className="pi-opp">
              <div className="pi-opp-top"><span className="pi-opp-tag">{(o.programme_ids ?? []).map((id) => programmeRef(id).name).join(' · ')}</span><span className="pi-opp-conf">Confidence: {OPP_CONFIDENCE_LABEL[o.confidence]}</span></div>
              <h3>{o.title}</h3>
              <dl><div><dt>Trigger</dt><dd>{o.triggering_development.text}</dd></div></dl>
              {(() => { const pr = (o.programme_ids ?? []).map((id) => programmeRef(id)).find((r) => r.href?.startsWith('/research/programmes/')); return pr ? <Link href={`${pr.href}#opportunities`} className="pi-more">Read on the programme page →</Link> : null; })()}
            </article>
          ))}
          {logistics.opportunity_surfaces.map((o) => (
            <article key={o.id} className="pi-opp">
              <div className="pi-opp-top"><span className="pi-opp-tag">Logistics reference layer</span><VerifChip v={o.verification_status} /></div>
              <h3>{o.title}</h3>
              <dl><div><dt>Reading</dt><dd>{o.body}</dd></div><div><dt>Caveat</dt><dd>{o.caveat}</dd></div></dl>
            </article>
          ))}
        </div>

        {/* ── RELATED ECOSYSTEMS ── */}
        <div className="pi-sec-head" id="ecosystems">
          <div className="pi-kicker">09 · Related industrial ecosystems</div>
          <h2>Where to go next in the Atlas</h2>
        </div>
        <ul className="pi-links lg-eco">
          <li><Link href="/research/industrial-nodes/">Industrial nodes &amp; connectivity</Link><span className="pi-l-meta">Semiconductor and electronics nodes with connectivity, gap and supply-chain scores</span></li>
          <li><Link href="/corridors/">Industrial corridors (NICDP)</Link><span className="pi-l-meta">Corridor and node dossiers — the manufacturing geography the freight system serves</span></li>
          <li><Link href="/research/infrastructure-projects/">Infrastructure projects</Link><span className="pi-l-meta">Projects linked to nodes and programmes</span></li>
          <li><Link href="/research/pillars/semiconductors/">Semiconductor Atlas</Link><span className="pi-l-meta">The ecosystem behind Dholera, Sanand, Jewar and Jagiroad</span></li>
          <li><Link href="/research/supply-chains/">Supply chains</Link><span className="pi-l-meta">Layer-by-layer dependency maps</span></li>
          <li><Link href="/research/dependencies/">Critical manufacturing dependencies</Link><span className="pi-l-meta">Imports that set the logistics requirement</span></li>
        </ul>
      </main>

      {/* ── REFERENCE LAYER (SID logistics schema) ── */}
      <section className="wrap" id="reference" style={{ paddingBottom: 0 }}>
        <div className="pi-sec-head">
          <div className="pi-kicker">10 · Reference layer<span className="pi-cls pi-cls-fact">Fact</span></div>
          <h2>India Integrated Logistics Atlas — the source record</h2>
          <p className="pi-sec-note">Every programme, corridor and node held in the SID logistics schema, with its verification label and captured sources. Programme pages build on these records. Snapshot {updated}.</p>
        </div>
      </section>
      {/* ── What this module holds + evidence ── */}
      <section className="wrap" style={{ paddingBottom: 0 }}>
        <div className="viz-grid">
          <VizPanel kicker="Module contents" title="What the Logistics Atlas holds"
            note={`Snapshot ${updated}. Baked from the SID logistics schema at build time (logistics_export() RPC); the committed snapshot is a seed fallback until the SID is populated.`}>
            <BarList label="Module contents" rows={held} />
          </VizPanel>
          <VizPanel kicker="Evidence" title="How each record is evidenced"
            note={`"Verified" means two or more independent primary sources — a deliberately strict bar, identical to the dependency Atlas. Records marked "needs a human source" assert no figures at all.`}>
            <StackedBar label="Records by verification" segments={mix} />
            <ul className="log-defs" role="list">
              {mix.map((m) => (
                <li key={m.key}>
                  <i style={{ background: m.color }} /><b>{m.label}</b> — {LOG_VERIFICATION_DEFINITION[m.key as VerificationStatus]}
                </li>
              ))}
            </ul>
          </VizPanel>
          <VizPanel kicker="The hook" title="The two Cabinet decisions of 6 October 2026">
            {itla && (
              <div className="log-hook">
                <p>
                  <b>{itla.name}</b> — an SPV mandated to technically appraise Government of India transport
                  projects of <b>₹500 crore or more</b>, monitor them, and build a National Transport Data
                  Repository integrating GSTN e-way bill, FASTag, Vahan, GPS and urban-traffic data to run
                  <b> freight-flow / O-D analytics</b>. That mandate organises this module: v1 is the reference
                  layer below; v2 is the ≥₹500 crore project pipeline; v3 is the freight-flow layer — built
                  only where public data genuinely supports it.
                </p>
                {sgf && (
                  <p>
                    The companion decision, the <b>{sgf.name}</b> (₹10,000 crore of direct equity for
                    growth-stage SMEs, majority-oriented to manufacturing and Tier-II/III clusters), enters this
                    module as a demand-side input: what may, over years, generate more freight — not a transport
                    programme itself.
                  </p>
                )}
                <p className="log-hook-note">Companion signal: S-144 (SME Growth Fund + ITLA), published 6 Oct 2026. Sources on each record below.</p>
              </div>
            )}
          </VizPanel>
        </div>
      </section>

      {/* ── v1 reference layer: programmes ── */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">v1 — Reference layer</div><h2>Flagship programmes &amp; authorities</h2></div>
          <p className="section-note">Announced vs built is stated on every row. Figures appear only where a primary source is on file; a blank row is a sourcing gap, not a zero.</p>
        </div>
        <div className="log-cards">
          {PROGRAMME_TYPE_ORDER.map((t) => {
            const rows = logistics.programmes.filter((p) => p.type === t);
            if (!rows.length) return null;
            return (
              <div key={t} className="log-type-group">
                <h3 className="log-type-title">{PROGRAMME_TYPE_LABEL[t]}</h3>
                <div className="log-type-cards">
                  {rows.map((p) => <ProgrammeCard key={p.id} p={p} />)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── corridors ── */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker">v1 — Reference layer</div><h2>National freight corridors</h2></div>
          <p className="section-note">Corridor records. Length and endpoint fields are filled only from a captured DFCCIL / PIB / MoRTH primary — endpoints from secondary literature are not stored. What these corridors mean for specific industrial nodes: <Link href="/research/industrial-nodes/">Industrial Nodes &amp; Connectivity</Link>.</p>
        </div>
        <div className="log-table-wrap">
          <table className="log-table">
            <thead>
              <tr><th>Corridor</th><th>Mode</th><th>Length</th><th>Commissioned / constructed</th><th>Status</th><th>Evidence</th></tr>
            </thead>
            <tbody>
              {logistics.corridors.map((c) => (
                <tr key={c.id}>
                  <td><b>{c.name}</b></td>
                  <td>{MODE_LABEL[c.mode]}</td>
                  <td>{c.length_km != null ? `${fmtIN(Number(c.length_km))} km` : <span className="log-td-gap">needs a human source</span>}</td>
                  <td>{c.length_commissioned_km != null ? `${fmtIN(Number(c.length_commissioned_km))} km` : <span className="log-td-gap">needs a human source</span>}</td>
                  <td className="log-td-status">{c.status}</td>
                  <td><VerifChip v={c.verification_status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <details className="log-src-details log-table-src">
          <summary>Corridor source record</summary>
          {logistics.corridors.filter((c) => c.sources.length).map((c) => (
            <div key={c.id} className="log-src-group">
              <b>{c.name}</b>
              <SourceList sources={c.sources} />
              {c.rationale && <p className="log-rationale">{c.rationale}</p>}
            </div>
          ))}
        </details>
      </section>

      {/* ── nodes ── */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">v1 — Reference layer</div><h2>Nodes — ports &amp; logistics parks</h2></div>
          <p className="section-note">A starter node set. Coordinates are stored only where publicly published; throughput only with a source on file. The full node layer ships with v2.</p>
        </div>
        <div className="log-table-wrap">
          <table className="log-table">
            <thead>
              <tr><th>Node</th><th>Type</th><th>State</th><th>Throughput</th><th>Status</th><th>Evidence</th></tr>
            </thead>
            <tbody>
              {logistics.nodes.map((n) => (
                <tr key={n.id}>
                  <td><b>{n.name}</b></td>
                  <td>{n.type.toUpperCase()}</td>
                  <td>{n.state ?? '—'}</td>
                  <td>
                    {n.throughput
                      ? <span dangerouslySetInnerHTML={{ __html: Object.entries(n.throughput).map(([k, v]) => `<b>${String(v)}</b> ${k.replace(/_/g, ' ')}`).join(' · ') }} />
                      : <span className="log-td-gap">needs a human source</span>}
                  </td>
                  <td className="log-td-status">{n.status}</td>
                  <td><VerifChip v={n.verification_status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── v2 projects ── */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker">v2 — Project pipeline</div><h2>Projects ≥ ₹500 crore (ITLA appraisal tier)</h2></div></div>
        {logistics.projects.length > 0 ? (
          <div className="log-table-wrap">
            <table className="log-table">
              <thead><tr><th>Project</th><th>Mode</th><th>Cost</th><th>Status</th><th>Evidence</th></tr></thead>
              <tbody>
                {logistics.projects.map((j) => (
                  <tr key={j.id}>
                    <td><b>{j.name}</b></td>
                    <td>{j.mode ?? '—'}</td>
                    <td>{j.cost_cr != null ? `₹${fmtIN(Number(j.cost_cr))} crore` : '—'}</td>
                    <td className="log-td-status">{j.status}</td>
                    <td><VerifChip v={j.verification_status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="log-stub">
            <p>
              <b>Not yet built — by design.</b> v2 will list verified transport and logistics projects of
              ₹500 crore or more: the tier ITLA is mandated to technically appraise. A project enters only when
              its primary record (PIB release, ministry document, or dashboard entry) is captured and stored in
              the SID <code>logistics.projects</code> table. No project is listed from memory or trade press.
            </p>
          </div>
        )}
      </section>

      {/* ── v3 freight-flow ── */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">v3 — Freight-flow / O-D layer</div><h2>Freight flows &amp; origin–destination</h2></div></div>
        <div className="log-stub">
          <p>
            <b>Stub — needs a human source.</b> ITLA’s National Transport Data Repository is mandated to integrate
            e-way bill, FASTag, Vahan, GPS and urban-traffic data and run freight-flow / O-D analytics. Until a
            public, citable flow dataset or ITLA publication exists, Techadyant will not model any flow: an
            origin–destination layer built on unsourced numbers would be exactly the fabrication this module
            exists to prevent. When ITLA (or a ministry dashboard) publishes usable flow data, this section
            becomes v3.
          </p>
        </div>
      </section>

      {/* ── methodology ── */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">Method</div><h2>How this module is built</h2></div></div>
        <div className="log-method">
          <p>
            The module follows the same architecture as the dependency Atlas: records live in a dedicated
            <code> logistics</code> schema on the SID Supabase project, are exported by a
            <code> logistics_export()</code> RPC, and are baked to a static snapshot at build time by
            <code> scripts/bake-logistics.mjs</code>. Nothing on this page is hand-edited — a figure changes by
            changing the schema record (with its source link), then rebuilding. <code>verified</code>,
            <code> single-source</code> and <code>analyst-assessed</code> carry the same definitions as the rest
            of the Atlas (see <Link href="/research/methodology/">Methodology</Link>); the fourth label,
            <b> needs a human source</b>, marks a deliberate gap: a row or field we will not fill from memory or
            trade press. Primary sources on file are listed per record above, including what each source
            supports and, where captured, the supporting text. Trade press appears only as a flagged lead,
            never as a sole source.
          </p>
          <p className="log-hook-note">
            Programme Intelligence adds a second layer on top of these records — the Techadyant reading of each programme — in <code>data/programme-intelligence/</code>, with links derived from evidenced project, node, signal and report records. Snapshot {updated} · baked from <code>{logistics.rpc.split('—')[0].trim()}</code> · sources retrieved 6–8 Oct 2026.
          </p>
        </div>
      </section>
    </>
  );
}
