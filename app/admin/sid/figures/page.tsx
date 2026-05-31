'use client';

import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Loading, ErrorBox, Pill } from '../../ui';

interface Fig { id: string; file: string; report: string; type: string; status: string; viewbox: string; labels: string; path: string; web_url: string | null; }

export default function FigureLibrary() {
  const [rows, setRows] = useState<Fig[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [status, setStatus] = useState('final');
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  function load() {
    setRows(null);
    const p = new URLSearchParams({ status });
    if (q) p.set('q', q);
    api<Fig[]>('/sid/figures?' + p.toString()).then(setRows).catch((e) => setErr(String(e.message || e)));
  }
  useEffect(load, [status]); // eslint-disable-line

  async function flip(f: Fig) {
    setBusy(f.id);
    try { await api('/sid/figure-status', { method: 'POST', body: JSON.stringify({ path: f.path, status: f.status === 'final' ? 'draft' : 'final' }) }); load(); }
    finally { setBusy(null); }
  }

  return (
    <>
      <h1 className="admin-h1">Figure library</h1>
      <p className="admin-sub">{rows ? `${rows.length} figures` : '…'} · search before drawing a new one; reuse or adapt an existing figure. Thumbnails shown for published figures.</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="final">Final (reusable)</option>
          <option value="draft">Draft / superseded</option>
          <option value="all">All</option>
        </select>
        <input className="admin-input" placeholder="Search title, label, report or type…" value={q} style={{ flex: 1, minWidth: 200 }}
          onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} />
        <button className="admin-btn" onClick={load}>Search</button>
      </div>

      {err && <ErrorBox error={err} />}
      {!rows && !err && <Loading />}
      {rows && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 14 }}>
          {rows.map((f) => (
            <div key={f.id} style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 130, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {f.web_url
                  ? <img src={f.web_url} alt={f.file} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  : <span style={{ fontSize: 11, color: '#888', padding: 10, textAlign: 'center', fontFamily: 'var(--admin-mono)' }}>{f.type}<br />{f.viewbox}</span>}
              </div>
              <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--admin-mono)' }}>{f.file}</span>
                  <Pill tone={f.status === 'final' ? 'teal' : 'crimson'}>{f.status}</Pill>
                </div>
                <div style={{ fontSize: 11, color: 'var(--admin-muted)', lineHeight: 1.4 }}>{(f.labels || '').slice(0, 110)}</div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, paddingTop: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--admin-muted)' }}>{f.report.slice(0, 22)}</span>
                  <button className="admin-btn" style={{ padding: '2px 8px', fontSize: 11 }} disabled={busy === f.id} onClick={() => flip(f)}>
                    {f.status === 'final' ? 'mark draft' : 'mark final'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
