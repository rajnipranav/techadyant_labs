// Sagarmala Intelligence Database — server-rendered sections for the Sagarmala programme page.
// Renders only when the programme carries the sagarmala database (see sagarmala-data.ts).
// Every figure keeps its citation and date; analytical statements are labelled as analysis.
import Link from 'next/link';
import { EvidenceTag } from '../industrial/ui';
import { expand } from '../industrial/data';
import type { ProvenanceRef } from '../industrial/types';
import { C, fmtDate, SectionHead } from './ui';
import {
  PILLAR_LABEL, PILLAR_LETTER, portName, projectName, opportunityClassificationLabel,
  companiesByCategory, type SagarmalaDatabase, type SagarmalaPillarKey, type SgProject, type SgSeries,
} from './sagarmala-data';

type Idx = Map<string, number>;

const inrCr = (v: number | null | undefined) => (v == null ? '—' : `₹${v.toLocaleString('en-IN')} cr`);
const mt = (v: number | null | undefined) => (v == null ? '—' : `${v.toLocaleString('en-IN')} MT`);

/* ------------------------------------------------------------------ composite: all Sagarmala sections */

import { SgProjectExplorer, type ExplorerProject } from './sagarmala-explorer';

export function SagarmalaSections({ sg, idx }: { sg: SagarmalaDatabase; idx: Idx }) {
  const explorerProjects: ExplorerProject[] = sg.projects.map((p) => ({
    id: p.id, name: p.name, pillar_key: p.pillar_key, pillar_label: PILLAR_LABEL[p.pillar_key],
    pillar_letter: PILLAR_LETTER[p.pillar_key], scheme_funded: p.scheme_funded, location: p.location,
    cost_cr: p.cost_cr, status: p.status, status_note: p.status_note ?? null, agency: p.agency,
  }));
  const pillarLabels = (Object.keys(PILLAR_LABEL) as SagarmalaPillarKey[]).map((k) => ({ key: k, label: PILLAR_LABEL[k], letter: PILLAR_LETTER[k] }));
  return (
    <>
      <SgPillarDatabase db={sg} idx={idx} />
      <h3 className="pi-h3" style={{ margin: '26px 0 10px' }}>Flagship project explorer <span className="pi-sg-sub">{sg.projects.length} documented projects · search and filter</span></h3>
      <SgProjectExplorer projects={explorerProjects} pillarLabels={pillarLabels} />
      <div className="pi-sg-projcards" style={{ marginTop: 18 }}>
        {sg.projects.filter((p) => p.id === 'sgpr:vadhavan-port' || p.id === 'sgpr:vizhinjam-phase1').map((p) => <SgProjectCard key={p.id} project={p} idx={idx} />)}
      </div>
      <SgPortRegistry db={sg} idx={idx} />
      <SgPerformance db={sg} idx={idx} />
      <SgIndustrialisation db={sg} idx={idx} />
      <SgCommunity db={sg} idx={idx} />
      <SgCompanies db={sg} idx={idx} />
    </>
  );
}

/* ------------------------------------------------------------------ 05 · five-pillar project database */

export function SgPillarDatabase({ db, idx }: { db: SagarmalaDatabase; idx: Idx }) {
  const { portfolio } = db;
  const schemeRows = portfolio.scheme_funded_pillar_split.rows;
  const split839 = new Map(portfolio.pillar_split_839.rows.map((r) => [r.pillar_key, r]));
  return (
    <>
      <SectionHead id="pillars" kicker="05 · Five-pillar project database" title="The portfolio, pillar by pillar" cls="fact"
        note={<>Two scopes, never summed: the <b>programme portfolio</b> (all funding modes) and the <b>scheme-funded projects</b> (MoPSW financial assistance). Each snapshot carries its own date — portfolio figures published at different times are not compared across dates.</>} />

      <div className="pi-sg-snapshots" role="list" aria-label="Portfolio snapshots">
        {portfolio.snapshots.map((s) => (
          <div key={s.label ?? s.as_of ?? 'undated'} className="pi-sg-snapshot" role="listitem">
            <div className="pi-sg-snap-date">{s.as_of ? fmtDate(s.as_of) : 'undated source'}</div>
            <b>{s.projects.toLocaleString('en-IN')} projects · ₹{s.cost_lakh_cr.toLocaleString('en-IN')} lakh crore</b>
            <span>{s.completed.count} completed{typeof s.completed.cost_cr === 'number' ? ` (₹${s.completed.cost_cr.toLocaleString('en-IN')} cr)` : typeof s.completed.cost_lakh_cr === 'number' ? ` (₹${s.completed.cost_lakh_cr} lakh cr)` : ''}</span>
            <em>{s.scope} · {s.verification}</em>
            <C p={s.provenance} idx={idx} />
          </div>
        ))}
      </div>

      <h3 className="pi-h3">Scheme-funded projects by pillar <span className="pi-sg-sub">as of {fmtDate(portfolio.scheme_funded_pillar_split.as_of)} · Lok Sabha reply</span></h3>
      <div className="pi-table-wrap">
        <table className="pi-table pi-sg-table">
          <thead><tr><th>Pillar</th><th>Completed</th><th>Completed cost</th><th>Under impl.</th><th>UI cost</th><th>Portfolio split (Mar 2025)</th></tr></thead>
          <tbody>
            {schemeRows.map((r) => {
              const split = split839.get(r.pillar_key);
              return (
                <tr key={r.pillar_key}>
                  <td><b>{PILLAR_LETTER[r.pillar_key]} · {PILLAR_LABEL[r.pillar_key]}</b></td>
                  <td>{r.completed.count}</td>
                  <td className="pi-nowrap">{inrCr(r.completed.cost_cr)}</td>
                  <td>{r.under_implementation.count}</td>
                  <td className="pi-nowrap">{inrCr(r.under_implementation.cost_cr)}</td>
                  <td className="pi-td-sub">{split ? `${split.projects} projects · ₹${split.cost_cr.toLocaleString('en-IN')} cr` : '—'}</td>
                </tr>
              );
            })}
            <tr key="industrialisation" className="pi-sg-row-flag">
              <td><b>C · {PILLAR_LABEL.port_led_industrialisation}</b></td>
              <td>0</td><td>—</td><td>0</td><td>—</td>
              <td className="pi-td-sub">{split839.get('port_led_industrialisation')?.projects} projects · ₹{split839.get('port_led_industrialisation')?.cost_cr?.toLocaleString('en-IN')} cr identified</td>
            </tr>
            <tr key="total" className="pi-sg-total">
              <td><b>Scheme-funded total</b></td>
              <td><b>{portfolio.scheme_funded_pillar_split.grand_total.completed.count}</b></td>
              <td className="pi-nowrap"><b>{inrCr(portfolio.scheme_funded_pillar_split.grand_total.completed.cost_cr)}</b></td>
              <td><b>{portfolio.scheme_funded_pillar_split.grand_total.under_implementation.count}</b></td>
              <td className="pi-nowrap"><b>{inrCr(portfolio.scheme_funded_pillar_split.grand_total.under_implementation.cost_cr)}</b></td>
              <td className="pi-td-sub">845 projects · ₹6.06 lakh crore (portfolio, Mar 2026)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="pi-sg-note">
        <EvidenceTag e="fact" /> {portfolio.scheme_funded_pillar_split.note} <C p={portfolio.scheme_funded_pillar_split.provenance} idx={idx} />
        {' '}Scheme lifecycle: {portfolio.scheme_funded.sanctioned_total} sanctioned · {portfolio.scheme_funded.withdrawn} withdrawn · {portfolio.scheme_funded.funded} funded ({portfolio.scheme_funded.completed} completed, {portfolio.scheme_funded.under_implementation} under implementation) as of {fmtDate(portfolio.scheme_funded.as_of)}. <C p={portfolio.scheme_funded.provenance} idx={idx} />
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ 06 · port registry */

const TYPE_LABEL: Record<string, string> = {
  major: 'Major port', major_dock_system: 'Dock system', major_under_construction: 'Major port (under construction)', non_major: 'Non-major port',
};

export function SgPortRegistry({ db, idx }: { db: SagarmalaDatabase; idx: Idx }) {
  const major = db.ports.filter((x) => x.type === 'major' || x.type === 'major_dock_system');
  const uc = db.ports.filter((x) => x.type === 'major_under_construction');
  const nonMajor = db.ports.filter((x) => x.type === 'non_major');
  const row = (p: (typeof major)[number]) => (
    <tr key={p.id}>
      <td><b>{p.name}</b>{p.rank_fy26 ? <span className="pi-td-sub">FY26 rank #{p.rank_fy26}</span> : null}</td>
      <td>{p.state}</td>
      <td>{TYPE_LABEL[p.type] ?? p.type}</td>
      <td className="pi-nowrap">{mt(p.throughput?.fy2024_25_mt)}</td>
      <td className="pi-nowrap">{mt(p.throughput?.fy2025_26_mt)}</td>
      <td>{p.sagarmala_project_ids.length ? p.sagarmala_project_ids.map((id) => projectName(id)) : <span className="pi-td-sub">—</span>}</td>
    </tr>
  );
  return (
    <>
      <SectionHead id="ports" kicker="06 · National port registry" title="The gateways, with their numbers" cls="fact"
        note={<>Throughput keeps its reporting period and source: FY 2024-25 is final Basic Port Statistics; FY 2025-26 is the advance estimate. Port-level totals never include terminal-level figures. A missing Sagarmala project link means no documented project on file, not absence of relevance.</>} />
      <div className="pi-table-wrap">
        <table className="pi-table pi-sg-table">
          <thead><tr><th>Port</th><th>State</th><th>Type</th><th>FY 2024-25</th><th>FY 2025-26 (adv.)</th><th>Sagarmala projects</th></tr></thead>
          <tbody>
            {major.map(row)}
            {uc.map(row)}
            {nonMajor.map(row)}
          </tbody>
        </table>
      </div>
      <p className="pi-sg-note"><EvidenceTag e="fact" /> {db.nonMajorSystem.text} <C p={db.nonMajorSystem.provenance} idx={idx} /></p>
    </>
  );
}

/* ------------------------------------------------------------------ 07 · performance trends */

function Spark({ series }: { series: SgSeries }) {
  const pts = series.points;
  if (pts.length < 2) return null;
  const w = 240, h = 56, pad = 4;
  const vals = pts.map((p) => p.value);
  const min = Math.min(...vals), max = Math.max(...vals);
  const x = (i: number) => pad + (i * (w - 2 * pad)) / (pts.length - 1);
  const y = (v: number) => h - pad - ((v - min) * (h - 2 * pad)) / (max - min || 1);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  return (
    <svg className="pi-sg-spark" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${series.scope} ${series.metric} trend`}>
      <path d={d} fill="none" stroke="var(--brass)" strokeWidth="2" />
      {pts.map((p, i) => <circle key={p.period} cx={x(i)} cy={y(p.value)} r="2.4" fill="var(--primary-bright)"><title>{`${p.period}: ${p.value.toLocaleString('en-IN')} ${series.unit}`}</title></circle>)}
    </svg>
  );
}

export function SgPerformance({ db, idx }: { db: SagarmalaDatabase; idx: Idx }) {
  const show = ['sgs:major-cargo', 'sgs:nonmajor-cargo', 'sgs:major-containers', 'sgs:iwt-cargo', 'sgs:coastal-cargo-major'];
  const series = show.map((id) => db.performance.series.find((s) => s.id === id)).filter(Boolean) as SgSeries[];
  return (
    <>
      <SectionHead id="performance" kicker="07 · Port performance trends" title="What the throughput record shows" cls="fact"
        note={<>Annual series with a source on every point. Incompatible series (financial-year vs calendar, PIB narrative vs revised BPS definition) are kept separate — never combined into one trend.</>} />
      <div className="pi-sg-perf">
        {series.map((s) => (
          <div key={s.id} className="pi-sg-perf-row">
            <div className="pi-sg-perf-k">
              <b>{s.scope}</b>
              <span>{s.metric.replace(/_/g, ' ')} · {s.unit}</span>
              <Spark series={s} />
            </div>
            <div className="pi-sg-perf-v">
              {s.points.map((p) => (
                <span key={p.period} className="pi-sg-pt">
                  <em>{p.period}</em>
                  <b>{p.value.toLocaleString('en-IN')}</b>
                  <C p={p.provenance} idx={idx} />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ul className="pi-sg-notes">
        {db.performance.benchmarks.map((b, i) => <li key={i}><EvidenceTag e={b.evidence as 'fact'} /> {b.text} <C p={b.provenance} idx={idx} /></li>)}
      </ul>
    </>
  );
}

/* ------------------------------------------------------------------ 08 · port-led industrialisation */

export function SgIndustrialisation({ db, idx }: { db: SagarmalaDatabase; idx: Idx }) {
  const st = db.industrialisationStatus;
  return (
    <>
      <SectionHead id="industrialisation" kicker="08 · Port-led industrialisation" title="Fourteen zones, zero sanctioned projects" cls="fact"
        note={<>The Atlas&rsquo;s differentiator pillar. The status is verified, not assumed: proposed zones are never described as operating clusters.</>} />
      <div className="pi-sg-callout">
        <EvidenceTag e="fact" /> {st.pillar_status.text} <C p={st.pillar_status.provenance} idx={idx} />
      </div>
      <div className="pi-table-wrap">
        <table className="pi-table pi-sg-table">
          <thead><tr><th>Coastal Economic Zone</th><th>State</th><th>Linkage ports</th><th>Intended sectors</th><th>Status</th></tr></thead>
          <tbody>
            {db.cezs.map((z) => (
              <tr key={z.id}>
                <td><b>{z.name}</b></td>
                <td>{z.state}</td>
                <td>{z.linkage_ports.length ? z.linkage_ports.map((id) => portName(id)).join(' · ') : <span className="pi-td-sub">—</span>}</td>
                <td>{z.sectors.join(' · ')}</td>
                <td><span className="pi-td-status">{z.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="pi-sg-notes">
        <li><EvidenceTag e="fact" /> {st.ceu_definition.text} <C p={st.ceu_definition.provenance} idx={idx} /></li>
        {st.hinterland_reading.map((h, i) => <li key={i}><EvidenceTag e="analysis" /> {h.text}</li>)}
      </ul>
    </>
  );
}

/* ------------------------------------------------------------------ 09 · coastal communities */

const CATEGORY_LABEL: Record<string, string> = {
  fisheries_infrastructure: 'Fisheries infrastructure', skill_development: 'Skill development',
  coastal_tourism: 'Coastal tourism', community_connectivity: 'Community connectivity',
};

export function SgCommunity({ db, idx }: { db: SagarmalaDatabase; idx: Idx }) {
  return (
    <>
      <SectionHead id="community" kicker="09 · Coastal community development" title="The human dimension, reported not inferred" cls="fact"
        note="Beneficiary counts are ministry-reported outputs with their dates — not independently measured outcomes, and never a basis for inferred income effects." />
      <div className="pi-sg-cards">
        {db.community.initiatives.map((i) => (
          <article key={i.id} className="pi-sg-card">
            <div className="pi-sg-card-top"><span className="pi-sg-chip">{CATEGORY_LABEL[i.category] ?? i.category}</span>{typeof i.cost_cr === 'number' && <span className="pi-sg-cost">{inrCr(i.cost_cr)}</span>}</div>
            <h3>{i.name}</h3>
            {i.outcomes && (
              <dl className="pi-sg-dl">
                {Object.entries(i.outcomes).map(([k, v]) => <div key={k}><dt>{k.replace(/_/g, ' ')}</dt><dd>{v}</dd></div>)}
              </dl>
            )}
            {typeof i.completed?.count === 'number' && <p className="pi-sg-card-sub">{i.completed.count} completed</p>}
            <C p={i.provenance} idx={idx} />
          </article>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ 10 · maritime companies */

const REL_LABEL: Record<string, string> = {
  operates: 'operates', acquired: 'acquired', concessionaire: 'concession', exited: 'exited',
  contractor: 'contract', supplier: 'supply', implements: 'implements', owner: 'owns',
  co_located: 'co-located with', ownership: 'ownership', support: 'supports',
};

export function SgCompanies({ db, idx }: { db: SagarmalaDatabase; idx: Idx }) {
  const groups = companiesByCategory();
  return (
    <>
      <SectionHead id="companies-sg" kicker="10 · Maritime company ecosystem" title="Who runs the gateways" cls="fact"
        note={<>Only relationships a source documents (operator, concession, acquisition, contract, fleet). No company here is claimed to be an official Sagarmala partner or beneficiary — that claim needs evidence for the precise relationship.</>} />
      <div className="pi-sg-companies">
        {groups.map((g) => (
          <details key={g.key} className="pi-sg-comp-group">
            <summary><b>{g.label}</b><span>{g.rows.length} compan{g.rows.length === 1 ? 'y' : 'ies'}</span></summary>
            <ul>
              {g.rows.map((c) => (
                <li key={c.id}>
                  <b>{c.name}</b>
                  <ul className="pi-sg-rels">
                    {(c.relationships ?? []).map((r, i) => (
                      <li key={i}>
                        <span className="pi-sg-rel">{REL_LABEL[r.type] ?? r.type} → {r.to.startsWith('sgport:') ? portName(r.to) : r.to.startsWith('sgpr:') ? projectName(r.to) : r.to}</span>
                        <span className="pi-sg-rel-d">{r.detail} <C p={r.provenance} idx={idx} /></span>
                      </li>
                    ))}
                    {c.fleet && <li className="pi-sg-fleet">Fleet: {c.fleet.vessels ?? '—'} vessels{c.fleet.gt ? ` · ${(c.fleet.gt / 1e6).toFixed(2)} M GT` : ''}</li>}
                  </ul>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ opportunities register */

export function SgOpportunityRegister({ db, idx }: { db: SagarmalaDatabase; idx: Idx }) {
  const order = ['documented_demand', 'emerging', 'hypothesis', 'research_lead'];
  const sorted = [...db.opportunities].sort((a, b) => order.indexOf(a.classification) - order.indexOf(b.classification));
  return (
    <div className="pi-sg-oppreg">
      {sorted.map((o) => (
        <article key={o.id} className={`pi-sg-opp pi-sg-opp-${o.classification}`}>
          <div className="pi-sg-opp-top">
            <span className={`pi-sg-chip pi-sg-chip-${o.classification}`}>{opportunityClassificationLabel[o.classification]}</span>
            <span className="pi-sg-opp-pillar">{PILLAR_LETTER[o.pillar_key]} · {PILLAR_LABEL[o.pillar_key]}</span>
            <span className={`pi-opp-conf pi-opp-conf-${o.confidence}`}>Confidence: {o.confidence}</span>
          </div>
          <h3>{o.title}</h3>
          <dl>
            <div><dt>Trigger</dt><dd>{o.trigger.text} <C p={o.trigger.provenance} idx={idx} /></dd></div>
            <div><dt>Techadyant reasoning</dt><dd className="pi-sg-analysis">{o.reasoning}</dd></div>
            <div><dt>Plausible customers</dt><dd>{o.customers.join(' · ')}</dd></div>
            <div><dt>Dependencies &amp; constraints</dt><dd>{[...o.dependencies, ...o.constraints].join(' · ')}</dd></div>
            <div><dt>Evidence still needed</dt><dd>{o.evidence_needed}</dd></div>
          </dl>
          <p className="pi-opp-foot">Reviewed {fmtDate(o.last_reviewed)} · a hypothesis register, not a forecast or procurement signal.</p>
        </article>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ coverage */

const TIER_LABEL: Record<string, string> = {
  tier_a_programme_foundation: 'Tier A · Programme foundation',
  tier_b_national_maritime_infrastructure: 'Tier B · National maritime infrastructure',
  tier_c_industrial_and_commercial_depth: 'Tier C · Industrial & commercial depth',
  tier_d_analytical_intelligence: 'Tier D · Analytical intelligence',
};

export function SgCoverage({ db }: { db: SagarmalaDatabase }) {
  const c = db.coverage;
  return (
    <>
      <SectionHead id="coverage" kicker="Coverage" title="What this database does and does not hold" cls="derived"
        note={<>Record counts are enforced against the data files by the build validator — the manifest cannot drift from the records. Verified facts, official reported values, inferred relationships and unverified research leads are kept separate throughout.</>} />
      <div className="pi-sg-tiers">
        {Object.entries(c.tiers).map(([k, t]) => (
          <div key={k} className={`pi-sg-tier pi-sg-tier-${t.status}`}>
            <b>{TIER_LABEL[k] ?? k}</b>
            <span className="pi-sg-chip">{t.status.replace(/_/g, ' ')}</span>
            <ul>{t.contents.map((x, i) => <li key={i}>{x}</li>)}</ul>
            {t.not_covered && <p className="pi-sg-not">Not covered: {t.not_covered.join(' · ')}</p>}
          </div>
        ))}
      </div>
      <h3 className="pi-h3">Discrepancy register</h3>
      <ul className="pi-sg-notes">
        {c.discrepancies.map((d) => <li key={d.id}><b>{d.subject}:</b> {d.observations} <em>Resolution: {d.resolution}</em></li>)}
      </ul>
      <h3 className="pi-h3">Known gaps</h3>
      <ul className="pi-datagaps">{c.known_gaps.map((g) => <li key={g}>{g}</li>)}</ul>
      <p className="pi-caveat">Downloadable research extracts (CSV): <a href="/downloads/sagarmala/sagarmala-projects.csv">projects</a> · <a href="/downloads/sagarmala/sagarmala-ports.csv">ports</a> · <a href="/downloads/sagarmala/sagarmala-performance.csv">performance</a> · <a href="/downloads/sagarmala/sagarmala-companies.csv">companies</a> · <a href="/downloads/sagarmala/sagarmala-sources.csv">sources</a>. Data dictionary, methodology and update procedure: <Link href="/research/programmes/methodology/">Sagarmala database methodology</Link>.</p>
    </>
  );
}

/* ------------------------------------------------------------------ flagship project card (for the explorer fallback view) */

export function SgProjectCard({ project, idx }: { project: SgProject; idx: Idx }) {
  return (
    <article className="pi-sg-card pi-sg-projcard">
      <div className="pi-sg-card-top">
        <span className="pi-sg-chip">{PILLAR_LETTER[project.pillar_key]} · {PILLAR_LABEL[project.pillar_key]}</span>
        {project.scheme_funded && <span className="pi-sg-chip pi-sg-chip-scheme">scheme-funded</span>}
      </div>
      <h3>{project.name}</h3>
      <dl className="pi-sg-dl">
        <div><dt>Location</dt><dd>{project.location}</dd></div>
        <div><dt>Status</dt><dd>{project.status.replace(/_/g, ' ')}{project.status_note ? <span className="pi-td-sub"> · {project.status_note}</span> : null}</dd></div>
        <div><dt>Cost</dt><dd>{inrCr(project.cost_cr)}{project.cost_note ? <span className="pi-td-sub"> · {project.cost_note}</span> : null}</dd></div>
        <div><dt>Agency</dt><dd>{project.agency}</dd></div>
        {project.planned_capacity && <div><dt>Planned capacity</dt><dd>{project.planned_capacity.value} {project.planned_capacity.unit}</dd></div>}
      </dl>
      <p className="pi-sg-scope">{project.scope}</p>
      {project.milestones?.length ? (
        <ol className="pi-sg-ms">
          {project.milestones.map((m) => <li key={m.date + m.label}><time dateTime={m.date}>{fmtDate(m.date)}</time><span>{m.label} <C p={m.provenance} idx={idx} /></span></li>)}
        </ol>
      ) : null}
      <p className="pi-sg-cons"><EvidenceTag e={project.consequence_evidence as 'analysis'} /> {project.operational_consequences}</p>
      <C p={project.provenance} idx={idx} />
    </article>
  );
}

export const sgExpand = (refs: ProvenanceRef[]) => expand(refs);
