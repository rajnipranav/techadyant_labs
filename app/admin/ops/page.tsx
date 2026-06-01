'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import { Loading, ErrorBox, Pill } from '../ui';

interface WfStatus { name: string; active: boolean; last_run: string | null; last_status: string | null; last_success: string | null; runs_24h: number; errors_24h: number; runs_7d: number; }
interface Run { id: number; workflow: string | null; started: string | null; stopped: string | null; status: string | null; mode: string | null; finished: boolean; secs: number | null; }

const WF = [{ key: 'ingest', label: 'Ingest', match: 'Ingest' }, { key: 'analyze', label: 'Analyze', match: 'Analyze' }, { key: 'digest', label: 'Digest', match: 'Digest' }];

function ago(iso: string | null) {
  if (!iso) return 'never';
  const s = Math.floor((Date.now() - new Date(iso.replace(' ', 'T') + (iso.includes('+') ? '' : 'Z')).getTime()) / 1000);
  if (s < 0) return 'just now';
  if (s < 60) return s + 's ago';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
}
function tone(st: string | null): 'teal' | 'crimson' | 'brass' { return st === 'success' ? 'teal' : st === 'error' ? 'crimson' : 'brass'; }

export default function WorkflowOps() {
  const [status, setStatus] = useState<WfStatus[] | null>(null);
  const [runs, setRuns] = useState<Run[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(() => {
    Promise.all([api<WfStatus[]>('/ops/workflows'), api<Run[]>('/ops/runs?limit=40')])
      .then(([s, r]) => { setStatus(s); setRuns(r); })
      .catch((e) => setErr(String(e.message || e)));
  }, []);
  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, [load]);

  async function trigger(wf: string) {
    setBusy(wf); setToast(null);
    try {
      const res: any = await api('/ops/trigger', { method: 'POST', body: JSON.stringify({ wf }) });
      setToast(res?.ok ? `${wf} triggered ✓ (HTTP ${res.status}, ${res.ms}ms)` : `${wf}: HTTP ${res?.status} — ${String(res?.body || res?.error || '').slice(0, 140)}`);
      setTimeout(load, 2500);
    } catch (e: any) { setToast(`${wf} failed: ${String(e.message || e).slice(0, 160)}`); }
    finally { setBusy(null); }
  }

  const find = (m: string) => status?.find((s) => (s.name || '').includes(m));

  return (
    <>
      <h1 className="admin-h1">Workflow runs</h1>
      <p className="admin-sub">Live execution history from the n8n signal engine. Auto-refreshes every 30s. Use the buttons to fire a workflow on demand.</p>

      {err && <ErrorBox error={err} />}
      {!status && !err && <Loading />}

      {toast && (
        <div style={{ margin: '0 0 14px', padding: '10px 14px', borderRadius: 10, background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', fontFamily: 'var(--admin-mono)', fontSize: 13 }}>{toast}</div>
      )}

      {status && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 24 }}>
          {WF.map((w) => {
            const s = find(w.match);
            return (
              <div key={w.key} style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <strong style={{ fontSize: 15 }}>{w.label}</strong>
                  <span style={{ width: 9, height: 9, borderRadius: 9, background: s?.active ? 'var(--admin-teal,#38e1c4)' : '#555' }} title={s?.active ? 'active' : 'inactive'} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Pill tone={tone(s?.last_status || null)}>{s?.last_status || 'no runs'}</Pill>
                  <span style={{ fontSize: 12, color: 'var(--admin-muted)' }}>last run {ago(s?.last_run || null)}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--admin-muted)', fontFamily: 'var(--admin-mono)', marginBottom: 4 }}>
                  last success {ago(s?.last_success || null)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--admin-muted)', fontFamily: 'var(--admin-mono)', marginBottom: 12 }}>
                  24h: {s?.runs_24h ?? 0} runs · <span style={{ color: (s?.errors_24h || 0) > 0 ? 'var(--admin-crimson,#e2725b)' : 'inherit' }}>{s?.errors_24h ?? 0} errors</span> · 7d: {s?.runs_7d ?? 0}
                </div>
                <button className="admin-btn" disabled={busy === w.key} onClick={() => trigger(w.key)} style={{ width: '100%' }}>
                  {busy === w.key ? 'triggering…' : `▶ Run ${w.label} now`}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {runs && (
        <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--admin-border)', fontSize: 13, fontWeight: 600 }}>Recent executions ({runs.length})</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--admin-muted)', fontFamily: 'var(--admin-mono)', fontSize: 11 }}>
                  <th style={{ padding: '8px 16px' }}>#</th><th style={{ padding: '8px 16px' }}>Workflow</th>
                  <th style={{ padding: '8px 16px' }}>Started</th><th style={{ padding: '8px 16px' }}>Status</th>
                  <th style={{ padding: '8px 16px' }}>Took</th><th style={{ padding: '8px 16px' }}>Mode</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((r) => (
                  <tr key={r.id} style={{ borderTop: '1px solid var(--admin-border)' }}>
                    <td style={{ padding: '8px 16px', fontFamily: 'var(--admin-mono)', color: 'var(--admin-muted)' }}>{r.id}</td>
                    <td style={{ padding: '8px 16px' }}>{(r.workflow || '—').replace('Techadyant Signal — ', '')}</td>
                    <td style={{ padding: '8px 16px', color: 'var(--admin-muted)' }}>{ago(r.started)}</td>
                    <td style={{ padding: '8px 16px' }}><Pill tone={tone(r.status)}>{r.status || '—'}</Pill></td>
                    <td style={{ padding: '8px 16px', fontFamily: 'var(--admin-mono)' }}>{r.secs != null ? r.secs + 's' : '—'}</td>
                    <td style={{ padding: '8px 16px', color: 'var(--admin-muted)', fontFamily: 'var(--admin-mono)' }}>{r.mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
