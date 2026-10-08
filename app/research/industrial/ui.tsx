// Server-rendered building blocks for the Industrial Intelligence layer.
import Link from 'next/link';
import type { EvidenceClass, Provenance, ScoreResult } from './types';
import { SCORE_DEFS } from './scoring';
import './industrial.css';

export type ClaimClass = 'fact' | 'analysis' | 'score' | 'opportunity';
const CLAIM_LABEL: Record<ClaimClass, string> = {
  fact: 'Fact',
  analysis: 'Techadyant analysis',
  score: 'Techadyant score',
  opportunity: 'Opportunity surface',
};

/** Section header carrying the claim class — the FACT / ANALYSIS / SCORE / OPPORTUNITY separation. */
export function ClassedHeading({ id, title, cls, note }: { id: string; title: string; cls: ClaimClass; note?: string }) {
  return (
    <div className="ii-sec-head">
      <span className={`ii-claim ii-claim-${cls}`}>{CLAIM_LABEL[cls]}</span>
      <h2 className="node-h2" id={id}>{title}</h2>
      {note && <p className="ii-sec-note">{note}</p>}
    </div>
  );
}

const EVIDENCE_LABEL: Record<EvidenceClass, string> = { fact: 'Fact', derived: 'Derived', analysis: 'Analysis' };
export function EvidenceTag({ e }: { e: EvidenceClass }) {
  return <span className={`ii-ev ii-ev-${e}`}>{EVIDENCE_LABEL[e]}</span>;
}

/** Inline numbered source markers: [1][2] linking to the source URL. */
export function Cite({ prov, index }: { prov: Provenance[]; index: Map<string, number> }) {
  const uniq = prov.filter((p, i) => prov.findIndex((q) => q.source_id === p.source_id) === i);
  if (!uniq.length) return null;
  return (
    <span className="ii-cite">
      {uniq.map((p) => (
        <a key={p.source_id} href={p.source_url} target="_blank" rel="noopener noreferrer" title={`${p.source_name}${p.publication_date ? ` (${p.publication_date})` : ''}`}>
          [{index.get(p.source_id) ?? '?'}]
        </a>
      ))}
    </span>
  );
}

export function ScoreCard({ s }: { s: ScoreResult }) {
  const def = SCORE_DEFS.find((d) => d.key === s.key)!;
  const computed = s.status === 'computed';
  return (
    <div className={`ii-score ${computed ? '' : 'is-insufficient'}`}>
      <div className="ii-score-top">
        <span className="ii-score-key">{def.short}</span>
        <span className="ii-score-ver">v{s.methodology_version}</span>
      </div>
      <div className="ii-score-name">{s.label}</div>
      {computed ? (
        <div className="ii-score-val">
          <b>{s.score}</b><span>/100</span>
          <em className={def.higherIs === 'worse' ? 'is-gap' : ''}>{s.band}</em>
        </div>
      ) : (
        <div className="ii-score-val ii-insufficient">Insufficient Data</div>
      )}
      <div className="ii-score-meta">
        <span>Completeness {Math.round(s.data_completeness * 100)}%</span>
        {computed && <span>Confidence {s.confidence}</span>}
      </div>
      {!computed && s.note && <p className="ii-score-note">{s.note}</p>}
    </div>
  );
}

export function ScoreBreakdown({ s }: { s: ScoreResult }) {
  return (
    <table className="ii-table">
      <thead>
        <tr><th>Component</th><th>Weight</th><th>Value</th><th>Confidence</th><th>Basis</th></tr>
      </thead>
      <tbody>
        {s.components.map((c) => (
          <tr key={c.key} className={c.value === null ? 'is-missing' : ''}>
            <td><b>{c.label}</b></td>
            <td>{c.weight}</td>
            <td>{c.value === null ? <span className="ii-missing">missing</span> : c.value.toFixed(2)}</td>
            <td>{c.confidence ?? '—'}</td>
            <td>{c.rationale}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function SourceList({ items }: { items: { n: number; name: string; publisher: string; url: string; date: string | null; type: string; confidence: string }[] }) {
  return (
    <ol className="ii-sources">
      {items.map((s) => (
        <li key={s.n} value={s.n}>
          <span className="ii-src-n">[{s.n}]</span>
          <a href={s.url} target="_blank" rel="noopener noreferrer">{s.name} ↗</a>
          <span className="ii-src-meta">{s.publisher}{s.date ? ` · ${s.date}` : ' · undated'} · {s.type.replace(/_/g, ' ')} · confidence {s.confidence}</span>
        </li>
      ))}
    </ol>
  );
}

export function GatiShaktiContrast() {
  return (
    <aside className="ii-contrast" aria-label="How this differs from PM GatiShakti">
      <div className="ii-contrast-q">Why not just use PM GatiShakti?</div>
      <div className="ii-contrast-grid">
        <div>
          <div className="ii-contrast-k">PM GatiShakti shows</div>
          <p>What infrastructure exists, where it is, and how infrastructure projects connect spatially — a planning system for government.</p>
        </div>
        <div>
          <div className="ii-contrast-k">Techadyant explains</div>
          <p>What that infrastructure means for an industrial node: which companies and supply chains it serves, where connectivity falls short of what the industry needs, and which opportunities follow.</p>
        </div>
      </div>
      <p className="ii-contrast-foot">We don’t replicate India’s infrastructure databases. We interpret them — from public, cited sources, with every analytical step labelled. <Link href="/research/industrial-nodes/methodology/">Methodology →</Link></p>
    </aside>
  );
}
