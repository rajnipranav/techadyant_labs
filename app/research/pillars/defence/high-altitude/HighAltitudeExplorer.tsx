'use client';
// Filterable register of the 100 high-altitude Atlas entities. Server-rendered with every
// row visible (crawlable); filters only narrow the list client-side.
import { useMemo, useState } from 'react';

export interface HaEntity {
  id: string; name: string; category: string; organisation: string; entity_type: string;
  summary: string; status: string; claim_type: string; grade: string; role: string;
  source_ref: string; hypothesis: boolean;
}
export interface HaSource { id: string; title: string; url: string }

const CLAIM_COLOR: Record<string, string> = {
  research_need: '#94A3B8',
  technology_transfer_available: '#2BC5B4',
  demonstrated_demand_or_event: '#F5B544',
  research_thrust: '#818CF8',
  policy_or_industrial_ecosystem: '#C77D4A',
  development_programme: '#38BDF8',
  documented_operational_or_institutional_capability: '#34D399',
  innovation_pipeline: '#E6D1A0',
};

const chip = (active: boolean): React.CSSProperties => ({
  fontSize: 12, padding: '4px 10px', borderRadius: 999, cursor: 'pointer',
  border: `1px solid ${active ? 'var(--brass, #F5B544)' : 'var(--border, rgba(255,255,255,.16))'}`,
  background: active ? 'rgba(245,181,68,.12)' : 'transparent',
  color: active ? 'var(--text)' : 'var(--text-dim)',
});

export function HighAltitudeExplorer({
  entities, categories, claimLabels, claimNotes, sources,
}: {
  entities: HaEntity[]; categories: string[]; claimLabels: Record<string, string>;
  claimNotes: Record<string, string>; sources: HaSource[];
}) {
  const [cat, setCat] = useState<string>('');
  const [claim, setClaim] = useState<string>('');
  const [q, setQ] = useState('');
  const src = useMemo(() => Object.fromEntries(sources.map((s) => [s.id, s])), [sources]);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return entities.filter((e) =>
      (!cat || e.category === cat) &&
      (!claim || e.claim_type === claim) &&
      (!needle || `${e.name} ${e.organisation} ${e.summary}`.toLowerCase().includes(needle)));
  }, [entities, cat, claim, q]);

  const claimTypes = Object.keys(claimLabels).filter((k) => entities.some((e) => e.claim_type === k));

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        <button type="button" style={chip(!cat)} onClick={() => setCat('')}>All categories</button>
        {categories.map((c) => (
          <button type="button" key={c} style={chip(cat === c)} onClick={() => setCat(cat === c ? '' : c)}>
            {c} <span style={{ opacity: .6 }}>{entities.filter((e) => e.category === c).length}</span>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12, alignItems: 'center' }}>
        <button type="button" style={chip(!claim)} onClick={() => setClaim('')}>All claim types</button>
        {claimTypes.map((k) => (
          <button type="button" key={k} title={claimNotes[k]} style={chip(claim === k)} onClick={() => setClaim(claim === k ? '' : k)}>
            <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: 7, background: CLAIM_COLOR[k] ?? '#999', marginRight: 6 }} />
            {claimLabels[k]} <span style={{ opacity: .6 }}>{entities.filter((e) => e.claim_type === k).length}</span>
          </button>
        ))}
        <input
          value={q} onChange={(ev) => setQ(ev.target.value)} placeholder="Search entities, organisations…"
          aria-label="Search high-altitude entities"
          style={{ marginLeft: 'auto', minWidth: 220, fontSize: 13, padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border, rgba(255,255,255,.16))', background: 'var(--bg-2, rgba(255,255,255,.03))', color: 'var(--text)' }}
        />
      </div>
      {claim && <p style={{ fontSize: 12.5, color: 'var(--text-dim)', margin: '0 0 10px' }}>{claimNotes[claim]}</p>}
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{rows.length} of {entities.length} entities</div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-dim)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em' }}>
              <th style={{ padding: '6px 8px' }}>ID</th>
              <th style={{ padding: '6px 8px' }}>Entity</th>
              <th style={{ padding: '6px 8px' }}>Organisation</th>
              <th style={{ padding: '6px 8px' }}>Claim type</th>
              <th style={{ padding: '6px 8px' }}>Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => {
              const s = src[e.source_ref];
              return (
                <tr key={e.id} id={e.id.toLowerCase()} style={{ borderTop: '1px solid var(--border, rgba(255,255,255,.08))', verticalAlign: 'top' }}>
                  <td style={{ padding: '8px', fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    <a href={`#${e.id.toLowerCase()}`} style={{ color: 'inherit', textDecoration: 'none' }}>{e.id}</a>
                  </td>
                  <td style={{ padding: '8px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>{e.name}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: 12.5, lineHeight: 1.5 }}>{e.summary}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {e.category} · {e.entity_type}{e.hypothesis ? ' · application / relevance still to verify' : ''}
                    </div>
                  </td>
                  <td style={{ padding: '8px', color: 'var(--text-dim)', fontSize: 12.5 }}>{e.organisation}</td>
                  <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                    <span title={claimNotes[e.claim_type]} style={{ fontSize: 11, fontWeight: 700, color: CLAIM_COLOR[e.claim_type] ?? 'var(--text)', border: `1px solid ${(CLAIM_COLOR[e.claim_type] ?? '#999')}55`, borderRadius: 5, padding: '1px 7px' }}>
                      {claimLabels[e.claim_type] ?? e.claim_type}
                    </span>
                  </td>
                  <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                    {s ? (
                      <a href={s.url} target="_blank" rel="noreferrer" title={s.title} style={{ fontSize: 11, fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--brass-cream, #E6D1A0)', border: '1px solid var(--border, rgba(255,255,255,.18))', borderRadius: 4, padding: '0 5px', textDecoration: 'none' }}>
                        {s.id} · {e.grade}
                      </a>
                    ) : e.source_ref}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
