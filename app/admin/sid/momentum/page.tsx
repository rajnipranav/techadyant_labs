'use client';

import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Loading, ErrorBox } from '../../ui';

interface Row { id: string; name: string; recent: number; total: number }

export default function Momentum() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [days, setDays] = useState(30);
  useEffect(() => {
    setRows(null);
    api<Row[]>('/sid/momentum?days=' + days).then(setRows).catch((e) => setErr(String(e.message || e)));
  }, [days]);

  const max = rows && rows.length ? Math.max(...rows.map((r) => r.recent), 1) : 1;

  return (
    <>
      <h1 className="admin-h1">Momentum</h1>
      <p className="admin-sub">Watchlist nodes ranked by recent signal activity — where structural change is accelerating. Feeds the Signals desk.</p>
      <div style={{ marginBottom: 14 }}>
        <select className="admin-select" value={days} onChange={(e) => setDays(Number(e.target.value))}>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>
      {err && <ErrorBox error={err} />}
      {!rows && !err && <Loading />}
      {rows && rows.length === 0 && <p className="admin-sub">No signal activity matched watchlist nodes in this window.</p>}
      {rows && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {rows.map((r) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ width: 240, fontSize: 13, fontWeight: 500 }}>{r.name}</div>
              <div style={{ flex: 1, background: 'var(--admin-surface2)', borderRadius: 5, height: 14 }}>
                <div style={{ width: `${(r.recent / max) * 100}%`, height: '100%', borderRadius: 5, background: '#38e1c4' }} />
              </div>
              <div style={{ width: 70, textAlign: 'right', fontFamily: 'var(--admin-mono)', fontSize: 12, color: 'var(--admin-muted)' }}>
                <b style={{ color: 'var(--admin-text)' }}>{r.recent}</b> / {r.total}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
