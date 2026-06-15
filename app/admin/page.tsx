'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, CAPTURE_FILL, CAPTURE_INK } from './api';
import { Loading, ErrorBox, StatCard, Panel } from './ui';

interface Overview {
  entities: number; watchlist: number; relationships: number; candidates_active: number;
  signals_processed: number; last_signal_processed: string | null; last_capture_date: string | null;
  by_corridor: Record<string, number>; by_type: Record<string, number>;
}
interface Cell { corridor_label: string; corridor_id: number; layer_label: string; layer_order: number; status: number }
interface Activity {
  window_days: number; promoted: { name: string; when: string }[]; rejected: number;
  new_candidates: number; signals_processed: number; capture_updates: number;
}

export default function AdminOverview() {
  const [d, setD] = useState<Overview | null>(null);
  const [cells, setCells] = useState<Cell[]>([]);
  const [act, setAct] = useState<Activity | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<Overview>('/overview').then(setD).catch((e) => setErr(String(e.message || e)));
    api<Cell[]>('/sid/capture').then(setCells).catch(() => {});
    api<Activity>('/recent-activity').then(setAct).catch(() => {});
  }, []);

  if (err) return <><h1 className="admin-h1">Overview</h1><ErrorBox error={err} /></>;
  if (!d) return <><h1 className="admin-h1">Overview</h1><Loading /></>;

  const corr = Object.entries(d.by_corridor || {});
  const maxCorr = corr.length ? Math.max(...corr.map(([, v]) => v)) : 1;

  // pivot capture cells -> corridor rows x layer cols
  const corridors = [...new Map(cells.map((c) => [c.corridor_id, c.corridor_label])).entries()].sort((a, b) => a[0] - b[0]);
  const layers = [...new Map(cells.map((c) => [c.layer_order, c.layer_label])).entries()].sort((a, b) => a[0] - b[0]);
  const byKey = new Map(cells.map((c) => [`${c.corridor_id}:${c.layer_order}`, c.status]));

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

      {act && (
        <Panel title={`What's new · last ${act.window_days} days`}>
          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', fontSize: 13, marginBottom: act.promoted.length ? 12 : 0 }}>
            <span><b style={{ fontFamily: 'var(--admin-mono)', color: 'var(--admin-teal)' }}>{act.promoted.length}</b> <span style={{ color: 'var(--admin-muted)' }}>promoted</span></span>
            <span><b style={{ fontFamily: 'var(--admin-mono)' }}>{act.rejected}</b> <span style={{ color: 'var(--admin-muted)' }}>rejected</span></span>
            <span><b style={{ fontFamily: 'var(--admin-mono)' }}>{act.new_candidates}</b> <span style={{ color: 'var(--admin-muted)' }}>new candidates</span></span>
            <span><b style={{ fontFamily: 'var(--admin-mono)' }}>{act.signals_processed}</b> <span style={{ color: 'var(--admin-muted)' }}>signals indexed</span></span>
            <span><b style={{ fontFamily: 'var(--admin-mono)' }}>{act.capture_updates}</b> <span style={{ color: 'var(--admin-muted)' }}>capture updates</span></span>
          </div>
          {act.promoted.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {act.promoted.map((p, i) => (
                <span key={i} style={{ background: 'rgba(56,225,196,0.12)', color: '#38e1c4', borderRadius: 6, padding: '2px 8px', fontSize: 12 }}>+ {p.name}</span>
              ))}
            </div>
          )}
        </Panel>
      )}

      <Panel title="Entities by corridor" action={<Link className="admin-btn" href="/admin/sid/entities/">Open explorer</Link>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {corr.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 130, fontSize: 13 }}>{k}</div>
              <div style={{ flex: 1, background: 'var(--admin-surface2)', borderRadius: 5, height: 14 }}>
                <div style={{ width: `${(v / maxCorr) * 100}%`, height: '100%', borderRadius: 5, background: '#c9a84c' }} />
              </div>
              <div style={{ width: 30, textAlign: 'right', fontFamily: 'var(--admin-mono)', fontSize: 13 }}>{v}</div>
            </div>
          ))}
        </div>
      </Panel>

      {corridors.length > 0 && (
        <Panel title="Dependency Capture map" action={<Link className="admin-btn" href="/admin/sid/capture/">Open map</Link>}>
          <div style={{ display: 'grid', gridTemplateColumns: `120px repeat(${layers.length}, 1fr)`, gap: 4 }}>
            <div />
            {layers.map(([ord, label]) => <div key={ord} style={{ fontSize: 10, color: 'var(--admin-muted)', textAlign: 'center' }}>{label}</div>)}
            {corridors.map(([cid, clabel]) => (
              <Frag key={cid}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 12 }}>{clabel}</div>
                {layers.map(([ord]) => {
                  const s = byKey.get(`${cid}:${ord}`);
                  if (s === undefined) return <div key={ord} />;
                  return <div key={ord} style={{ height: 30, borderRadius: 6, background: CAPTURE_FILL[s], color: CAPTURE_INK[s], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--admin-mono)', fontSize: 12, fontWeight: 600 }}>{s}</div>;
                })}
              </Frag>
            ))}
          </div>
        </Panel>
      )}

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

function Frag({ children }: { children: React.ReactNode }) { return <>{children}</>; }
