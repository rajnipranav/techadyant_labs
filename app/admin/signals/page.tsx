'use client';

import { useEffect, useState } from 'react';
import { api } from '../api';
import { Loading, ErrorBox, Pill } from '../ui';

interface Sig {
  id: number; statement: string; ecosystem: string | null; score: number | null; s_india: number | null;
  classification: string | null; is_signal: boolean; created_at: string; nodes: string[]; processed: boolean;
}

export default function Signals() {
  const [rows, setRows] = useState<Sig[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [onlySignal, setOnlySignal] = useState(true);

  useEffect(() => { api<Sig[]>('/signals?limit=120').then(setRows).catch((e) => setErr(String(e.message || e))); }, []);
  const view = (rows || []).filter((r) => !onlySignal || r.is_signal);

  return (
    <>
      <h1 className="admin-h1">Signals</h1>
      <p className="admin-sub">Live scored signals from the engine, cross-linked to SID nodes they mention.</p>
      <label style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center', marginBottom: 12 }}>
        <input type="checkbox" checked={onlySignal} onChange={(e) => setOnlySignal(e.target.checked)} /> Signals only (hide noise)
      </label>
      {err && <ErrorBox error={err} />}
      {!rows && !err && <Loading />}
      {rows && (
        <table className="admin-table">
          <thead><tr><th style={{ width: 44 }}>Score</th><th style={{ width: 40 }}>IN</th><th>Statement</th><th>Nodes</th></tr></thead>
          <tbody>
            {view.map((s) => (
              <tr key={s.id}>
                <td style={{ fontFamily: 'var(--admin-mono)', fontWeight: 600 }}>{s.score ?? '—'}</td>
                <td style={{ fontFamily: 'var(--admin-mono)' }}>{s.s_india ?? '—'}</td>
                <td>
                  <div style={{ fontSize: 13 }}>{s.statement}</div>
                  <div style={{ fontSize: 11, color: 'var(--admin-muted)' }}>{s.ecosystem}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {(s.nodes || []).slice(0, 5).map((n, i) => <Pill key={i} tone="teal">{n}</Pill>)}
                    {s.processed && <Pill>indexed</Pill>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
