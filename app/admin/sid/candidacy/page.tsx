'use client';

import { useEffect, useState } from 'react';
import { api, CORRIDORS, ENTITY_TYPES } from '../../api';
import { Loading, ErrorBox, Pill } from '../../ui';

interface Cand { id: string; name: string; status: string; mentions: number; events: number; corridor: string | null; score: number | null; }
interface EntHit { id: string; name: string; }

export default function Candidacy() {
  const [rows, setRows] = useState<Cand[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [mode, setMode] = useState<'promote' | 'merge' | null>(null);
  const [etype, setEtype] = useState('company');
  const [corr, setCorr] = useState<string[]>([]);
  const [mq, setMq] = useState('');
  const [hits, setHits] = useState<EntHit[]>([]);

  function load() { setRows(null); api<Cand[]>('/sid/candidates').then(setRows).catch((e) => setErr(String(e.message || e))); }
  useEffect(load, []);

  async function act(body: Record<string, unknown>) {
    setBusy(body.candidate_id as string);
    try { await api('/sid/candidate-action', { method: 'POST', body: JSON.stringify(body) }); setOpen(null); setMode(null); load(); }
    catch (e) { setErr(String((e as Error).message || e)); }
    finally { setBusy(null); }
  }

  return (
    <>
      <h1 className="admin-h1">Candidacy review queue</h1>
      <p className="admin-sub">New entities surfaced from the signal feed, ranked by candidacy score. Promote to a watchlist node, merge into an existing node, or reject.</p>
      {err && <ErrorBox error={err} />}
      {!rows && !err && <Loading />}
      {rows && rows.length === 0 && <p className="admin-sub">No candidates pending review.</p>}
      {rows && rows.map((c) => (
        <div key={c.id} style={{ background: '#fff', border: '1px solid var(--admin-border)', borderRadius: 10, padding: '10px 14px', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name} {c.corridor && <Pill tone="brass">{c.corridor}</Pill>}</div>
              <div style={{ fontSize: 12, color: 'var(--admin-muted)' }}>{c.mentions} mentions · {c.events} events · score {c.score ?? '—'}</div>
            </div>
            <button className="admin-btn admin-btn-go" disabled={busy === c.id}
              onClick={() => { setOpen(open === c.id ? null : c.id); setMode('promote'); setCorr(c.corridor ? [c.corridor] : []); }}>Promote</button>
            <button className="admin-btn" disabled={busy === c.id}
              onClick={() => { setOpen(open === c.id ? null : c.id); setMode('merge'); setMq(''); setHits([]); }}>Merge</button>
            <button className="admin-btn admin-btn-no" disabled={busy === c.id}
              onClick={() => act({ action: 'reject', candidate_id: c.id, cooldown_days: 90 })}>Reject</button>
          </div>

          {open === c.id && mode === 'promote' && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--admin-border)', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <select className="admin-select" value={etype} onChange={(e) => setEtype(e.target.value)}>
                {ENTITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {CORRIDORS.map((cc) => (
                <label key={cc.code} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input type="checkbox" checked={corr.includes(cc.code)}
                    onChange={(e) => setCorr(e.target.checked ? [...corr, cc.code] : corr.filter((x) => x !== cc.code))} />
                  {cc.label}
                </label>
              ))}
              <button className="admin-btn admin-btn-go" disabled={!corr.length || busy === c.id}
                onClick={() => act({ action: 'promote', candidate_id: c.id, entity_type: etype, corridors: corr })}>Confirm promote</button>
            </div>
          )}

          {open === c.id && mode === 'merge' && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--admin-border)' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="admin-input" placeholder="Search existing node to merge into…" value={mq}
                  onChange={(e) => setMq(e.target.value)} style={{ flex: 1 }}
                  onKeyDown={(e) => e.key === 'Enter' && api<EntHit[]>('/sid/entities?q=' + encodeURIComponent(mq)).then(setHits)} />
                <button className="admin-btn" onClick={() => api<EntHit[]>('/sid/entities?q=' + encodeURIComponent(mq)).then(setHits)}>Find</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {hits.slice(0, 12).map((h) => (
                  <button key={h.id} className="admin-btn" onClick={() => act({ action: 'merge', candidate_id: c.id, into_entity: h.id })}>
                    {h.name} ← merge
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
