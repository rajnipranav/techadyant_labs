'use client';

import { useEffect, useState, useCallback } from 'react';
import { api, CORRIDORS } from '../api';
import { Loading, ErrorBox, Pill } from '../ui';

interface Sig {
  id: number; statement: string; ecosystem: string | null; summary: string | null;
  score: number | null; s_india: number | null; classification: string | null; is_signal: boolean;
  created_at: string; themes: string[] | null; status: string; corridors: string[];
  source_url: string | null; source_name: string | null; published_at: string | null;
  nodes: string[]; processed: boolean;
}
interface Counts { active: number; archived: number; kept: number; total: number; semiconductors: number; critical_minerals: number; ai_infrastructure: number; defence: number; }

const CORR_TONE: Record<string, 'teal' | 'brass' | 'crimson' | 'neutral'> = {
  semiconductors: 'brass', ai_infrastructure: 'teal', critical_minerals: 'crimson', defence: 'neutral',
};
const CORR_SHORT: Record<string, string> = {
  semiconductors: 'Semis', ai_infrastructure: 'AI infra', critical_minerals: 'Minerals', defence: 'Defence',
};
const STATUSES = [{ k: 'active', label: 'Active' }, { k: 'kept', label: 'Kept ★' }, { k: 'archived', label: 'Archived' }, { k: 'all', label: 'All' }];

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso.replace(' ', 'T') + (iso.includes('+') ? '' : 'Z'));
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const s = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  return isToday ? `${s} · today` : s;
}
function scoreColor(n: number | null) {
  if (n == null) return 'var(--admin-muted)';
  if (n >= 72) return '#38e1c4';
  if (n >= 60) return '#e0c061';
  return 'var(--admin-muted)';
}

export default function Signals() {
  const [rows, setRows] = useState<Sig[] | null>(null);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [signalOnly, setSignalOnly] = useState(true);
  const [corridor, setCorridor] = useState<string | null>(null);
  const [status, setStatus] = useState('active');
  const [q, setQ] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [busy, setBusy] = useState<number | null>(null);

  const load = useCallback(() => {
    setRows(null); setErr(null);
    const p = new URLSearchParams({ limit: '200', status, signal_only: signalOnly ? '1' : '0' });
    if (corridor) p.set('corridor', corridor);
    if (q.trim()) p.set('q', q.trim());
    if (minScore > 0) p.set('min_score', String(minScore));
    Promise.all([api<Sig[]>('/signals?' + p.toString()), api<Counts>('/signals/counts?signal_only=' + (signalOnly ? '1' : '0'))])
      .then(([r, c]) => { setRows(r); setCounts(c); })
      .catch((e) => setErr(String(e.message || e)));
  }, [corridor, status, signalOnly, minScore]); // q applied via button/Enter

  useEffect(() => { load(); }, [load]);

  async function setSig(id: number, st: string) {
    setBusy(id);
    try { await api('/signals/status', { method: 'POST', body: JSON.stringify({ id, status: st }) }); load(); }
    finally { setBusy(null); }
  }

  const chip = (code: string | null, label: string, n: number | null) => {
    const on = corridor === code;
    return (
      <button key={code ?? 'all'} onClick={() => setCorridor(code)}
        style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12.5, cursor: 'pointer',
          border: '1px solid ' + (on ? 'var(--admin-brass)' : 'var(--admin-border)'),
          background: on ? 'rgba(201,168,76,0.16)' : 'transparent', color: on ? '#e0c061' : 'var(--admin-text,#e8e8f0)' }}>
        {label}{n != null && <span style={{ opacity: 0.6, marginLeft: 6, fontFamily: 'var(--admin-mono)' }}>{n}</span>}
      </button>
    );
  };

  return (
    <>
      <h1 className="admin-h1">Signals</h1>
      <p className="admin-sub">Live scored signals from the engine, tagged to your four corridors and cross-linked to SID nodes. Archive noise to keep the feed sharp.</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
        {chip(null, 'All', counts?.active ?? null)}
        {CORRIDORS.map((c) => chip(c.code, CORR_SHORT[c.code] || c.label, counts ? (counts as any)[c.code] : null))}
        <span style={{ flex: 1 }} />
        <select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => <option key={s.k} value={s.k}>{s.label}{s.k === 'archived' && counts ? ` (${counts.archived})` : ''}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
        <label style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="checkbox" checked={signalOnly} onChange={(e) => setSignalOnly(e.target.checked)} /> Signals only (hide noise)
        </label>
        <input className="admin-input" placeholder="Search statement, theme…" value={q}
          onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} style={{ flex: 1, minWidth: 200 }} />
        <button className="admin-btn" onClick={load}>Search</button>
        <label style={{ fontSize: 12.5, color: 'var(--admin-muted)', display: 'flex', gap: 8, alignItems: 'center' }}>
          min score <b style={{ fontFamily: 'var(--admin-mono)', color: scoreColor(minScore || null) }}>{minScore || 'any'}</b>
          <input type="range" min={0} max={90} step={5} value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} />
        </label>
      </div>

      {err && <ErrorBox error={err} />}
      {!rows && !err && <Loading />}
      {rows && (
        <>
          <div style={{ fontSize: 12, color: 'var(--admin-muted)', marginBottom: 8 }}>{rows.length} shown</div>
          <table className="admin-table">
            <thead><tr>
              <th style={{ width: 52 }}>Score</th><th style={{ width: 34 }}>IN</th><th>Statement</th>
              <th style={{ width: 90 }}>Added</th><th style={{ width: 150 }}>Nodes</th><th style={{ width: 120 }}></th>
            </tr></thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id} style={{ opacity: s.status === 'archived' ? 0.55 : 1 }}>
                  <td style={{ fontFamily: 'var(--admin-mono)', fontWeight: 700, color: scoreColor(s.score) }}>{s.score ?? '—'}</td>
                  <td style={{ fontFamily: 'var(--admin-mono)', color: 'var(--admin-muted)' }}>{s.s_india ?? '—'}</td>
                  <td>
                    <div style={{ fontSize: 13 }}>{s.statement}{s.status === 'kept' && <span title="kept" style={{ color: '#e0c061', marginLeft: 6 }}>★</span>}</div>
                    <div style={{ fontSize: 11, color: 'var(--admin-muted)' }}>{s.ecosystem}</div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 5, alignItems: 'center' }}>
                      {(s.corridors || []).map((c) => <Pill key={c} tone={CORR_TONE[c] || 'neutral'}>{CORR_SHORT[c] || c}</Pill>)}
                      {s.source_url && <a href={s.source_url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: '#38e1c4', textDecoration: 'none' }}>↗ {s.source_name || 'source'}</a>}
                    </div>
                  </td>
                  <td style={{ fontSize: 11.5, color: 'var(--admin-muted)', fontFamily: 'var(--admin-mono)' }}>{fmtDate(s.created_at)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {(s.nodes || []).slice(0, 4).map((n, i) => <Pill key={i} tone="teal">{n}</Pill>)}
                      {s.processed && <Pill>indexed</Pill>}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                      {s.status !== 'archived' ? (
                        <>
                          {s.status !== 'kept' && <button className="admin-btn" disabled={busy === s.id} title="Keep" onClick={() => setSig(s.id, 'kept')} style={{ padding: '2px 8px', fontSize: 12 }}>★</button>}
                          <button className="admin-btn" disabled={busy === s.id} title="Archive" onClick={() => setSig(s.id, 'archived')} style={{ padding: '2px 8px', fontSize: 11 }}>archive</button>
                        </>
                      ) : (
                        <button className="admin-btn" disabled={busy === s.id} title="Restore" onClick={() => setSig(s.id, 'pending')} style={{ padding: '2px 8px', fontSize: 11 }}>restore</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}
