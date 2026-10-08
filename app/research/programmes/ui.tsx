// Server-rendered building blocks for Programme Intelligence pages.
import Link from 'next/link';
import { Cite, EvidenceTag } from '../industrial/ui';
import { expand, inrCr } from '../industrial/data';
import type { EvidenceClass, ProvenanceRef } from '../industrial/types';
import { LOG_VERIFICATION_LABEL, LOG_VERIFICATION_COLOR, type VerificationStatus } from '../logistics/data';
import {
  STAGE_LABEL, STAGE_ORDER, DIMENSION_LABEL, SUPPLY_STAGE_LABEL, RELATION_LABEL, LINK_LABEL, OPP_CONFIDENCE_LABEL,
  type ProgrammeIntel, type ProgrammeStage,
} from './types';
import type { ConnectedNode, MatchedSignal, ProgrammeProject, FlagshipCard } from './data';
import { programmeRef, relLabel } from './data';
import type { OpportunitySurface } from '../industrial/types';
import './programmes.css';

type Idx = Map<string, number>;
export const C = ({ p, idx }: { p?: ProvenanceRef[]; idx: Idx }) => (p?.length ? <Cite prov={expand(p)} index={idx} /> : null);

export const fmtDate = (d: string | null) => {
  if (!d) return '';
  if (/^\d{4}$/.test(d)) return d;
  if (/^\d{4}-\d{2}$/.test(d)) return new Date(`${d}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  return new Date(`${d.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
};

export function StageChip({ s }: { s: ProgrammeStage }) {
  return <span className={`pi-stage pi-stage-${s}`}>{STAGE_LABEL[s]}</span>;
}

export function VerifChip({ v }: { v: VerificationStatus }) {
  return <span className="pi-verif" style={{ ['--c' as string]: LOG_VERIFICATION_COLOR[v] }}>{LOG_VERIFICATION_LABEL[v]}</span>;
}

export function SectionHead({ id, kicker, title, cls, note }: { id: string; kicker: string; title: string; cls?: 'fact' | 'analysis' | 'opportunity' | 'derived'; note?: React.ReactNode }) {
  const label = cls === 'fact' ? 'Fact' : cls === 'analysis' ? 'Techadyant analysis' : cls === 'opportunity' ? 'Opportunity surface' : cls === 'derived' ? 'Derived from the graph' : null;
  return (
    <div className="pi-sec-head" id={id}>
      <div className="pi-kicker">{kicker}{label && <span className={`pi-cls pi-cls-${cls}`}>{label}</span>}</div>
      <h2>{title}</h2>
      {note && <p className="pi-sec-note">{note}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ status ladder */

export function StageLadder({ p, idx }: { p: ProgrammeIntel; idx: Idx }) {
  return (
    <ol className="pi-ladder" aria-label="Announced versus built">
      {STAGE_ORDER.map((s) => {
        const rows = p.ledger.filter((l) => l.stage === s);
        return (
          <li key={s} className={`pi-ladder-step ${rows.length ? 'has' : 'empty'} ${p.stage === s ? 'is-current' : ''}`}>
            <div className="pi-ladder-k">{STAGE_LABEL[s]}</div>
            {rows.length ? rows.map((r) => (
              <div key={r.label} className="pi-ladder-row">
                <b>{r.label}</b>
                <span>{r.value}</span>
                <em>{r.as_of ? fmtDate(r.as_of) : 'undated'} <C p={r.provenance} idx={idx} /></em>
              </div>
            )) : <div className="pi-ladder-none">—</div>}
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ chains */

/** Programme → project → infrastructure → industrial node, one row per evidenced path. */
export function NodePaths({ p, nodes }: { p: ProgrammeIntel; nodes: ConnectedNode[] }) {
  if (!nodes.length) return <p className="pi-empty">No industrial node in the Atlas is linked to this programme by an evidenced project yet. Proximity alone is not treated as a link.</p>;
  return (
    <div className="pi-node-grid">
      {nodes.map(({ node, paths }) => (
        <article key={node.id} className="pi-node">
          <div className="pi-node-top">
            <Link href={`/research/industrial-nodes/${node.slug}/`} className="pi-node-name">{node.name}</Link>
            <span className="pi-node-state">{node.state}</span>
          </div>
          <ol className="pi-path">
            <li><span>Programme</span><b>{p.short_name}</b></li>
            {paths.slice(0, 2).map((x) => (
              <li key={x.project.id + (x.infra?.id ?? '')} className="pi-path-group">
                <span>Project</span><b>{x.project.name}</b>
                {x.via === 'gateway' && x.infra && x.relationship && (
                  <>
                    <span>Infrastructure</span><b>{x.infra.name}</b>
                    <span>Relationship</span><b>{node.short_name} — {relLabel(x.relationship)} — {x.infra.name}</b>
                  </>
                )}
              </li>
            ))}
            <li><span>Industrial node</span><b>{node.short_name}</b></li>
          </ol>
          <p className="pi-node-foot">{node.headline}</p>
        </article>
      ))}
    </div>
  );
}

const MODE_ROWS: { key: string; label: string; types: string[] }[] = [
  { key: 'road', label: 'Road', types: ['expressway', 'national_highway', 'state_highway'] },
  { key: 'rail', label: 'Rail', types: ['railway_line', 'railway_station'] },
  { key: 'dfc', label: 'Dedicated freight corridor', types: ['freight_corridor', 'dfc_station'] },
  { key: 'logistics', label: 'Logistics parks & terminals', types: ['mmlp', 'mmlh', 'icd', 'cfs', 'freight_terminal', 'logistics_cluster'] },
  { key: 'ports', label: 'Ports', types: ['seaport', 'inland_waterway', 'river_terminal'] },
  { key: 'air', label: 'Air cargo', types: ['airport'] },
];

export interface SystemItem { name: string; type: string; status: string; via: string }
/** Road → rail → DFC → logistics → ports → air → industrial nodes, filled only from linked records. */
export function LogisticsSystem({ items, nodes }: { items: SystemItem[]; nodes: ConnectedNode[] }) {
  return (
    <ol className="pi-system">
      {MODE_ROWS.map((m) => {
        const hits = items.filter((i) => m.types.includes(i.type));
        return (
          <li key={m.key} className={hits.length ? 'has' : 'empty'}>
            <div className="pi-system-k">{m.label}</div>
            <div className="pi-system-v">
              {hits.length ? hits.map((h) => <span key={h.name + h.via}><b>{h.name}</b> <em>{h.status.replace(/_/g, ' ')} · {h.via}</em></span>) : <em>No linked record</em>}
            </div>
          </li>
        );
      })}
      <li className={nodes.length ? 'has is-end' : 'empty is-end'}>
        <div className="pi-system-k">Industrial nodes</div>
        <div className="pi-system-v">
          {nodes.length ? nodes.map(({ node }) => <span key={node.id}><Link href={`/research/industrial-nodes/${node.slug}/`}><b>{node.short_name}</b></Link> <em>{node.state}</em></span>) : <em>No evidenced link yet</em>}
        </div>
      </li>
    </ol>
  );
}

export function SupplyPath({ p, idx }: { p: ProgrammeIntel; idx: Idx }) {
  return (
    <ol className="pi-supply">
      {p.supply_chain.map((s) => (
        <li key={s.stage}>
          <div className="pi-supply-k">{SUPPLY_STAGE_LABEL[s.stage]}</div>
          <p>{s.text} <EvidenceTag e={s.evidence as EvidenceClass} /> <C p={s.provenance} idx={idx} /></p>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ consequences */

export function Consequences({ p, idx }: { p: ProgrammeIntel; idx: Idx }) {
  return (
    <div className="pi-cons">
      {p.consequences.map((c) => (
        <section key={c.dimension} className="pi-con">
          <div className="pi-con-k">{DIMENSION_LABEL[c.dimension]}</div>
          <h3>{c.headline}</h3>
          {c.claims.map((x, i) => (
            <p key={i} className={`pi-claim pi-claim-${x.evidence}`}>
              <EvidenceTag e={x.evidence} /> {x.text} <C p={x.provenance} idx={idx} />
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ opportunities */

export function OppCard({ opp, why, idx }: { opp: OpportunitySurface; why: string; idx: Idx }) {
  const effect = opp.chain.filter((c) => c.stage !== 'opportunity' && c.stage !== 'infrastructure_change').map((c) => c.text);
  const potential = opp.chain.find((c) => c.stage === 'opportunity')?.text;
  return (
    <article className="pi-opp">
      <div className="pi-opp-top">
        <span className="pi-opp-tag">Opportunity surface</span>
        <span className={`pi-opp-conf pi-opp-conf-${opp.confidence}`}>Confidence: {OPP_CONFIDENCE_LABEL[opp.confidence]}</span>
      </div>
      <h3>{opp.title}</h3>
      <dl>
        <div><dt>Trigger</dt><dd>{opp.triggering_development.text} <C p={opp.triggering_development.provenance} idx={idx} /></dd></div>
        {effect.length > 0 && <div><dt>Industrial effect</dt><dd>{effect.join(' ')}</dd></div>}
        {potential && <div><dt>Potential opportunity</dt><dd>{potential}</dd></div>}
        <div><dt>Affected sectors</dt><dd>{opp.sectors.filter((s) => !s.startsWith('sector:')).join(' · ') || '—'}</dd></div>
        <div><dt>Constraints</dt><dd><ul>{opp.constraints.map((c) => <li key={c}>{c}</li>)}</ul></dd></div>
      </dl>
      <p className="pi-opp-foot">{why} · horizon {opp.horizon} · a hypothesis, not a forecast or procurement signal.</p>
    </article>
  );
}

/* ------------------------------------------------------------------ signals */

export function SignalCards({ items, programme }: { items: MatchedSignal[]; programme: string }) {
  if (!items.length) return <p className="pi-empty">No Techadyant Signal is linked to {programme} yet. New signals that name the programme, or that cover a node or project it reaches, appear here automatically.</p>;
  return (
    <div className="pi-signals">
      {items.slice(0, 6).map(({ signal: s, reasons }) => (
        <article key={s.slug} className="pi-signal">
          <div className="pi-signal-meta">{s.no} · {s.dateLabel}</div>
          <h3><Link href={`/signals/${s.slug}/`}>{s.title}</Link></h3>
          <p>{s.excerpt}</p>
          <div className="pi-signal-why">Why it is here: {reasons.join(' · ')}</div>
          <Link href={`/signals/${s.slug}/`} className="pi-more">Read Signal →</Link>
        </article>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ projects */

export function ProjectTable({ rows, idx }: { rows: ProgrammeProject[]; idx: Idx }) {
  if (!rows.length) return <p className="pi-empty">No project in the Atlas carries an evidenced link to this programme yet.</p>;
  return (
    <div className="pi-table-wrap">
      <table className="pi-table">
        <thead><tr><th>Project</th><th>Link</th><th>Status</th><th>Cost</th><th>Industrial node</th></tr></thead>
        <tbody>
          {rows.map(({ project: x, link }) => (
            <tr key={x.id}>
              <td><b>{x.name}</b><span className="pi-td-sub">{x.project_type}{x.states.length ? ` · ${x.states.join(', ')}` : ''}</span></td>
              <td>{LINK_LABEL[link.type]} <C p={link.provenance} idx={idx} /></td>
              <td><span className="pi-td-status">{x.status.replace(/_/g, ' ')}</span><span className="pi-td-sub">{x.status_note}</span></td>
              <td className="pi-nowrap">{inrCr(x.estimated_cost_cr)}</td>
              <td>{x.affected_node_ids.length ? x.affected_node_ids.map((n) => <Link key={n} href={`/research/industrial-nodes/${n.slice(6)}/`}>{n.slice(6)}</Link>) : <span className="pi-td-sub">None directly</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ related programmes */

export function RelatedProgrammes({ p, idx }: { p: ProgrammeIntel; idx: Idx }) {
  return (
    <ul className="pi-rel">
      {p.related_programmes.map((r) => {
        const ref = programmeRef(r.logistics_id);
        return (
          <li key={r.logistics_id}>
            <span className="pi-rel-verb">{p.short_name} {RELATION_LABEL[r.relation]}</span>
            {ref.href ? <Link href={ref.href}><b>{ref.name}</b></Link> : <b>{ref.name}</b>}
            {ref.meta && <span className="pi-rel-meta">{ref.meta}</span>}
            <span className="pi-rel-note">{r.note} <C p={r.provenance} idx={idx} /></span>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ Gati Shakti cross-cutting diagram */

export function CrossCuttingDiagram({ compact = false }: { compact?: boolean }) {
  const lanes = [
    { k: 'Bharatmala', d: 'Roads & economic corridors', href: '/research/programmes/bharatmala/' },
    { k: 'Sagarmala', d: 'Ports & port-led industry', href: '/research/programmes/sagarmala/' },
    { k: 'Freight corridors', d: 'Rail freight backbone', href: '/research/logistics/#dfc' },
    { k: 'Industrial corridors', d: 'Manufacturing geography', href: '/corridors/' },
    { k: 'ULIP', d: 'Digital logistics', href: '/research/logistics/#ulip' },
  ];
  return (
    <figure className={`pi-xc ${compact ? 'is-compact' : ''}`} aria-label="Gati Shakti as the cross-cutting planning layer">
      <Link href="/research/programmes/gati-shakti/" className="pi-xc-top">
        <span className="pi-xc-k">Cross-cutting layer</span>
        <b>PM GatiShakti National Master Plan</b>
        <span>One geospatial plan · project evaluation through the Network Planning Group</span>
      </Link>
      <div className="pi-xc-lanes">
        {lanes.map((l) => (
          <Link key={l.k} href={l.href} className="pi-xc-lane"><b>{l.k}</b><span>{l.d}</span></Link>
        ))}
      </div>
      <ol className="pi-xc-chain">
        <li><Link href="/research/industrial-nodes/">Industrial nodes</Link></li>
        <li><Link href="/research/supply-chains/">Supply chains</Link></li>
        <li><span>Opportunity surfaces</span></li>
      </ol>
      {!compact && <figcaption>Techadyant reading of how the programmes relate. It describes planning relationships documented in public sources; it is not a reproduction of the PM GatiShakti platform.</figcaption>}
    </figure>
  );
}

/* ------------------------------------------------------------------ flagship card (index + gateway) */

export function FlagshipCardView({ c }: { c: FlagshipCard }) {
  const body = (
    <>
      <div className="pi-card-top">
        <span className="pi-card-k">{c.live ? 'Programme Intelligence' : `Phase ${c.phase}`}</span>
        {c.sid && <VerifChip v={c.sid.verification_status} />}
      </div>
      <h3>{c.name}</h3>
      <p className="pi-card-angle">{c.angle}</p>
      {c.sid?.status && <p className="pi-card-status"><span>Status</span> {c.sid.status}</p>}
      {c.sectors.length > 0 && <p className="pi-card-sectors">{c.sectors.join(' · ')}</p>}
      {c.counts && (
        <p className="pi-card-counts">{c.counts.projects} linked project{c.counts.projects === 1 ? '' : 's'} · {c.counts.nodes} industrial node{c.counts.nodes === 1 ? '' : 's'} · {c.counts.signals} signal{c.counts.signals === 1 ? '' : 's'}</p>
      )}
      <span className="pi-more">{c.live ? 'Explore intelligence →' : c.href?.startsWith('/corridors') ? 'Open the corridor Atlas →' : 'Reference record →'}</span>
    </>
  );
  return c.href ? <Link href={c.href} className={`pi-card ${c.live ? 'is-live' : 'is-next'}`}>{body}</Link> : <div className="pi-card is-next">{body}</div>;
}
