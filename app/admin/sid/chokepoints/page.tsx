'use client';

import { useEffect, useState } from 'react';
import { api, CORRIDORS } from '../../api';
import { Loading, ErrorBox, Pill } from '../../ui';

interface Choke { id: string; name: string; country: string; is_foreign: boolean; score: number; }

export default function Chokepoints() {
  const [rows, setRows] = useState<Choke[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [corridor, setCorridor] = useState('');

  useEffect(() => {
    setRows(null);
    const p = corridor ? '?corridor=' + corridor : '';
    api<Choke[]>('/sid/chokepoints' + p).then(setRows).catch((e) => setErr(String(e.message || e)));
  }, [corridor]);

  const max = rows && rows.length ? rows[0].score : 1;

  return (
    <>
      <h1 className="admin-h1">Chokepoint analysis</h1>
      <p className="admin-sub">Nodes ranked by dependency weight — incoming <i>depends_on</i> + outgoing <i>supplies_to</i>. The most-relied-upon nodes in the graph.</p>

      <div style={{ marginBottom: 14 }}>
        <select className="admin-select" value={corridor} onChange={(e) => setCorridor(e.target.value)}>
          <option value="">All corridors</option>
          {CORRIDORS.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
        </select>
      </div>

      {err && <ErrorBox error={err} />}
      {!rows && !err && <Loading />}
      {rows && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {rows.map((r) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ width: 220, fontSize: 13, fontWeight: 500 }}>{r.name}</div>
              <div style={{ width: 30, fontFamily: 'var(--admin-mono)', fontSize: 12 }}>{r.country}</div>
              {r.is_foreign && <Pill tone="crimson">foreign</Pill>}
              <div style={{ flex: 1, background: 'var(--admin-surface2)', borderRadius: 5, height: 14, position: 'relative' }}>
                <div style={{ width: `${(r.score / max) * 100}%`, background: r.is_foreign ? '#e2725b' : '#38e1c4', height: '100%', borderRadius: 5 }} />
              </div>
              <div style={{ width: 28, textAlign: 'right', fontFamily: 'var(--admin-mono)', fontSize: 13, fontWeight: 600 }}>{r.score}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
