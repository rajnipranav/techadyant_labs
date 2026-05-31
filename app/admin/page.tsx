'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from './api';
import { Loading, ErrorBox, StatCard, Panel } from './ui';

interface Overview {
  entities: number; watchlist: number; relationships: number; candidates_active: number;
  signals_processed: number; last_signal_processed: string | null; last_capture_date: string | null;
  by_corridor: Record<string, number>; by_type: Record<string, number>;
}

export default function AdminOverview() {
  const [d, setD] = useState<Overview | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { api<Overview>('/overview').then(setD).catch((e) => setErr(String(e.message || e))); }, []);

  if (err) return <><h1 className="admin-h1">Overview</h1><ErrorBox error={err} /></>;
  if (!d) return <><h1 className="admin-h1">Overview</h1><Loading /></>;

  return (
    <>
      <h1 className="admin-h1">Overview</h1>
      <p className="admin-sub">Strategic Intelligence Database · live from n8ndb</p>

      <div className="admin-grid-kpi">
        <StatCard label="Watchlist nodes" value={d.watchlist} />
        <StatCard label="Relationships" value={d.relationships} />
        <StatCard label="Candidates pending" value={d.candidates_active} />
        <StatCard label="Signals processed" value={d.signals_processed} />
      </div>

      <Panel title="Entities by corridor" action={<Link className="admin-btn" href="/admin/sid/entities">Open explorer</Link>}>
        <table className="admin-table">
          <tbody>
            {Object.entries(d.by_corridor || {}).map(([k, v]) => (
              <tr key={k}><td>{k}</td><td style={{ textAlign: 'right', fontFamily: 'var(--admin-mono)' }}>{v}</td></tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Entities by type">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Object.entries(d.by_type || {}).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
            <span key={k} style={{ background: 'var(--admin-surface2)', border: '1px solid var(--admin-border)', borderRadius: 7, padding: '4px 10px', fontSize: 12 }}>
              {k} <b style={{ fontFamily: 'var(--admin-mono)' }}>{v}</b>
            </span>
          ))}
        </div>
      </Panel>

      <p className="admin-sub">
        Last signal processed: {d.last_signal_processed ? new Date(d.last_signal_processed).toLocaleString() : '—'} ·
        DCF baseline: {d.last_capture_date || '—'}
      </p>
    </>
  );
}
