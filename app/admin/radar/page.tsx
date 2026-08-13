'use client';

import { useEffect, useState } from 'react';
import { api } from '../api';
import { Loading, ErrorBox, Panel } from '../ui';

interface Row {
  id: string; topic: string; description: string | null; research_type: string | null;
  status: string; linked_slug: string | null; linked_type: string | null;
  from_demand: boolean; sort: number; is_public: boolean; created: string;
}

const STATUS = ['considering', 'researching', 'coming_soon', 'published'];
const fld: React.CSSProperties = { width: '100%', background: 'var(--admin-panel,#141b26)', color: 'inherit', border: '1px solid var(--admin-border)', borderRadius: 6, padding: '7px 9px', fontSize: 13 };
const lbl: React.CSSProperties = { fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 };

const EMPTY = { id: '', topic: '', description: '', research_type: '', status: 'considering', linked_slug: '', linked_type: 'report', from_demand: true, sort: 0, is_public: false };

export default function RadarAdmin() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState<any>({ ...EMPTY });
  const [busy, setBusy] = useState(false);

  function load() { api<Row[]>('/radar').then(setRows).catch((e) => setErr(String(e.message || e))); }
  useEffect(load, []);

  function edit(r: Row) { setForm({ ...r, description: r.description || '', research_type: r.research_type || '', linked_slug: r.linked_slug || '', linked_type: r.linked_type || 'report' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function reset() { setForm({ ...EMPTY }); }

  async function save() {
    if (!form.topic.trim()) { setErr('Topic is required.'); return; }
    setBusy(true); setErr(null);
    try {
      await api('/radar/save', { method: 'POST', body: JSON.stringify({ ...form, id: form.id || null, sort: Number(form.sort) || 0 }) });
      reset(); load();
    } catch (e) { setErr(String((e as Error).message || e)); }
    setBusy(false);
  }
  async function del(id: string) {
    if (!confirm('Delete this radar item?')) return;
    setBusy(true);
    try { await api('/radar/delete', { method: 'POST', body: JSON.stringify({ id }) }); load(); }
    catch (e) { setErr(String((e as Error).message || e)); }
    setBusy(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, margin: '0 0 4px' }}>Research Radar</h1>
      <p style={{ color: 'var(--admin-muted)', margin: '0 0 20px', fontSize: 14 }}>
        Curate what shows on the public &ldquo;what should we research next&rdquo; radar. Only items marked <b>Public</b> ever appear on the site — the page itself stays unpublished until you decide to launch it.
      </p>
      {err && <ErrorBox error={err} />}

      <Panel title={form.id ? 'Edit radar item' : 'Add radar item'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ gridColumn: '1 / -1' }}><label style={lbl}>Topic *</label><input style={fld} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="India’s drone battery supply chain" /></div>
          <div style={{ gridColumn: '1 / -1' }}><label style={lbl}>Short description</label><textarea style={{ ...fld, minHeight: 54 }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><label style={lbl}>Research type</label><input style={fld} value={form.research_type} onChange={(e) => setForm({ ...form, research_type: e.target.value })} placeholder="Supply-chain analysis" /></div>
          <div><label style={lbl}>Status</label><select style={fld} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{STATUS.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
          <div><label style={lbl}>Linked slug (when published)</label><input style={fld} value={form.linked_slug} onChange={(e) => setForm({ ...form, linked_slug: e.target.value })} placeholder="who-builds-indias-drones" /></div>
          <div><label style={lbl}>Linked type</label><select style={fld} value={form.linked_type} onChange={(e) => setForm({ ...form, linked_type: e.target.value })}><option value="report">report</option><option value="signal">signal</option><option value="atlas">atlas</option></select></div>
          <div><label style={lbl}>Sort</label><input type="number" style={fld} value={form.sort} onChange={(e) => setForm({ ...form, sort: e.target.value })} /></div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'end', paddingBottom: 4 }}>
            <label style={{ fontSize: 13, display: 'flex', gap: 7, alignItems: 'center' }}><input type="checkbox" checked={form.from_demand} onChange={(e) => setForm({ ...form, from_demand: e.target.checked })} /> From demand</label>
            <label style={{ fontSize: 13, display: 'flex', gap: 7, alignItems: 'center' }}><input type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} /> <b>Public</b></label>
          </div>
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
          <button className="admin-btn" disabled={busy} onClick={save}>{form.id ? 'Update' : 'Add'}</button>
          {form.id && <button className="admin-btn" style={{ opacity: .7 }} disabled={busy} onClick={reset}>Cancel edit</button>}
        </div>
      </Panel>

      {!rows ? <Loading label="Loading radar…" /> : (
        <Panel title={`Radar items (${rows.length})`}>
          {rows.length === 0 ? <p style={{ color: 'var(--admin-muted)', fontSize: 14 }}>None yet.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                {['Topic', 'Status', 'Public', 'Linked', 'Sort', ''].map((h) => <th key={h} style={{ textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--admin-muted)', padding: '8px 10px', borderBottom: '1px solid var(--admin-border)' }}>{h}</th>)}
              </tr></thead>
              <tbody>{rows.map((r) => (
                <tr key={r.id}>
                  <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--admin-border)', fontSize: 13 }}><b>{r.topic}</b>{r.from_demand && <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--admin-brassb)' }}>◆ demand</span>}{r.description && <div style={{ color: 'var(--admin-muted)', fontSize: 12 }}>{r.description}</div>}</td>
                  <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--admin-border)', fontSize: 12 }}>{r.status}</td>
                  <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--admin-border)', fontSize: 13 }}>{r.is_public ? '✓' : '—'}</td>
                  <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--admin-border)', fontSize: 12 }}>{r.linked_slug ? `${r.linked_type}:${r.linked_slug}` : '—'}</td>
                  <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--admin-border)', fontSize: 12 }}>{r.sort}</td>
                  <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--admin-border)', fontSize: 12, whiteSpace: 'nowrap' }}>
                    <button className="admin-btn" style={{ padding: '3px 10px', fontSize: 12 }} onClick={() => edit(r)}>Edit</button>{' '}
                    <button className="admin-btn" style={{ padding: '3px 10px', fontSize: 12, opacity: .7 }} onClick={() => del(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </Panel>
      )}
    </div>
  );
}
