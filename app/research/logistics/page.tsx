import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../seo';
import { VizPanel, StackedBar, BarList } from '../../components/viz/Viz';
import {
  logistics, logisticsVerificationMix, LOG_VERIFICATION_LABEL, LOG_VERIFICATION_COLOR,
  LOG_VERIFICATION_DEFINITION, PROGRAMME_TYPE_LABEL, PROGRAMME_TYPE_ORDER, MODE_LABEL,
  metricRows, programmeById, sourceLine, lastUpdated,
  type LogisticsProgramme, type LogisticsSource, type VerificationStatus,
} from './data';

export const metadata: Metadata = {
  title: 'India Integrated Logistics Atlas — freight corridors & flagship programmes [2026]',
  description:
    'A reference layer of India’s freight and logistics system: national freight corridors, flagship programmes (DFC, Bharatmala, Gati Shakti, Sagarmala, NLP, ULIP, IWAI), the new ITLA appraisal tier (≥ ₹500 crore), and the source record behind every figure. Verified / single-source / needs-a-human-source labelled.',
  alternates: { canonical: `${SITE}/research/logistics/` },
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

export default function LogisticsAtlas() {
  const mix = logisticsVerificationMix();
  const updated = new Date(lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const itla = programmeById('itla');
  const sgf = programmeById('sme-growth-fund');
  const held = [
    { label: 'Programmes tracked', value: logistics.programmes.length },
    { label: 'Corridor records', value: logistics.corridors.length },
    { label: 'Nodes (ports, MMLPs, gateways)', value: logistics.nodes.length },
    { label: 'Projects ≥ ₹500 crore (v2)', value: logistics.projects.length },
    { label: 'Opportunity surfaces', value: logistics.opportunity_surfaces.length },
  ];

  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([
          { name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' },
          { name: 'Logistics Atlas', path: '/research/logistics/' },
        ]),
        {
          '@context': 'https://schema.org', '@type': 'CollectionPage',
          name: 'India Integrated Logistics Atlas', url: `${SITE}/research/logistics/`,
          isPartOf: { '@id': `${SITE}/#website` }, publisher: ORG_REF,
          about: ['India freight corridors', 'Dedicated Freight Corridors', 'Bharatmala', 'PM Gati Shakti', 'Sagarmala', 'National Logistics Policy', 'ITLA', 'logistics cost India'],
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

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">The Atlas</Link><span className="sep">/</span>
            <span>Logistics Atlas</span>
          </div>
          <h1>India Integrated Logistics Atlas</h1>
          <p className="lede">
            India’s freight and logistics system as a source-led reference layer: the corridors that move the
            country’s goods, the flagship programmes building them, and — from 6 October 2026 — the new
            Integrated Transport &amp; Logistics Authority that will appraise every Government transport project
            of ₹500 crore or more. Every figure carries its source and a verification label. Where a fact
            cannot be verified from a primary source, it is left out and marked <b>needs a human source</b>.
          </p>
          <div className="atlas-meta-row">
            <span><b>{logistics.programmes.length}</b> programmes</span>
            <span><b>{logistics.corridors.length}</b> corridor records</span>
            <span><b>{logistics.nodes.length}</b> nodes</span>
            <span className="atlas-updated">Snapshot {updated}</span>
          </div>
        </div>
      </header>

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

      {/* ── opportunity surfaces ── */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker">Reading the layer</div><h2>Opportunity surfaces</h2></div>
          <p className="section-note">Potential areas where demand or capability <em>may</em> emerge. Explicitly not claims that government will procure anything, and never forecasts of contracts.</p>
        </div>
        <div className="log-cards log-type-cards">
          {logistics.opportunity_surfaces.map((o) => (
            <article key={o.id} className="log-card log-card-opp">
              <div className="log-card-head">
                <h3>{o.title}</h3>
                <VerifChip v={o.verification_status} />
              </div>
              <p className="log-card-summary">{o.body}</p>
              <p className="log-opp-caveat">{o.caveat}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── methodology ── */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">Method</div><h2>How this layer is built</h2></div></div>
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
            Snapshot {updated} · baked from <code>{logistics.rpc.split('—')[0].trim()}</code> · sources retrieved 6–8 Oct 2026.
          </p>
        </div>
      </section>
    </>
  );
}
