'use client';

import { useEffect, useState } from 'react';
import { api, CORRIDORS } from '../../api';
import { Loading, ErrorBox, Pill } from '../../ui';

interface Ent { id: string; name: string; type: string; type_code: string; country: string; is_foreign: boolean; watchlist: boolean; corridors: string[]; degree: number; }
interface Detail {
  entity: { id: string; name: string; type: string; country: string; is_foreign: boolean; description: string };
  aliases: { alias: string; type: string }[];
  corridors: string[];
  out: { rel: string; target: string; target_id: string; verification: string }[];
  inbound: { rel: string; source: string; source_id: string; verification: string }[];
}

export default function Entities() {
  const [rows, setRows] = useState<Ent[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [corridor, setCorridor] = useState('');
  const [q, setQ] = useState('');
  const [detail, setDetail] = useState<Detail | null>(null);

  function load() {
    setRows(null);
    const p = new URLSearchParams();
    if (corridor) p.set('corridor', corridor);
    if (q) p.set('q', q);
    api<Ent[]>('/sid/entities?' + p.toString()).then(setRows).catch((e) => setErr(String(e.message || e)));
  }
  useEffect(load, [corridor]); // eslint-disable-line

  return (
    <>
      <h1 className="admin-h1">Entity explorer</h1>
      <p className="admin-sub">{rows ? `${rows.length} nodes` : '…'} · filter by corridor or search name/alias</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <select className="admin-select" value={corridor} onChange={(e) => setCorridor(e.target.value)}>
          <option value="">All corridors</option>
          {CORRIDORS.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
        </select>
        <input className="admin-input" placeholder="Search name or alias…" value={q}
          onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} style={{ flex: 1, minWidth: 180 }} />
        <button className="admin-btn" onClick={load}>Search</button>
      </div>

      {err && <ErrorBox error={err} />}
      {!rows && !err && <Loading />}
      {rows && (
        <table className="admin-table">
          <thead><tr><th>Entity</th><th>Type</th><th>Country</th><th>Corridors</th><th style={{ textAlign: 'right' }}>Links</th></tr></thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} style={{ cursor: 'pointer' }} onClick={() => { setDetail(null); api<Detail>('/sid/entity?id=' + e.id).then(setDetail); }}>
                <td style={{ fontWeight: 500 }}>{e.name} {e.is_foreign && <Pill tone="crimson">foreign</Pill>}</td>
                <td style={{ color: 'var(--admin-muted)' }}>{e.type}</td>
                <td style={{ fontFamily: 'var(--admin-mono)' }}>{e.country}</td>
                <td>{e.corridors.join(', ')}</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--admin-mono)' }}>{e.degree}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {detail && detail.entity && (
        <div style={{ position: 'sticky', bottom: 0, marginTop: 18, background: '#fff', border: '1px solid var(--admin-border)', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{detail.entity.name}</div>
            <button className="admin-btn" onClick={() => setDetail(null)}>Close</button>
          </div>
          <div style={{ fontSize: 12, color: 'var(--admin-muted)', margin: '2px 0 8px' }}>
            {detail.entity.type} · {detail.entity.country} · {detail.corridors.join(', ')}
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 0 }}>{detail.entity.description}</p>
          {detail.aliases.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              {detail.aliases.map((a, i) => <Pill key={i}>{a.alias}</Pill>)}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <RelList title="Depends on / supplies (out)" items={detail.out.map((r) => `${r.rel} → ${r.target}`)} />
            <RelList title="Depended on by (in)" items={detail.inbound.map((r) => `${r.source} → ${r.rel}`)} />
          </div>
        </div>
      )}
    </>
  );
}

function RelList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--admin-muted)', marginBottom: 4 }}>{title}</div>
      {items.length === 0 ? <div style={{ fontSize: 13, color: 'var(--admin-muted)' }}>—</div> :
        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, lineHeight: 1.7 }}>{items.map((s, i) => <li key={i}>{s}</li>)}</ul>}
    </div>
  );
}
