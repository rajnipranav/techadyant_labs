'use client';

import { useEffect, useState } from 'react';
import { api, CORRIDORS } from '../../api';
import { Loading, ErrorBox, Pill } from '../../ui';

interface Ent { id: string; name: string; type: string; type_code: string; country: string; is_foreign: boolean; watchlist: boolean; corridors: string[]; degree: number; }
interface Edge { rid: string; rel: string; target?: string; target_id?: string; source?: string; source_id?: string; verification: string; }
interface Detail {
  entity: { id: string; name: string; type: string; type_code: string; country: string; description: string; watchlist: boolean; status: string };
  aliases: { alias: string; type: string }[];
  corridors: string[];
  out: Edge[]; inbound: Edge[];
}
interface Lookups {
  corridors: { code: string; label: string }[];
  entity_types: { code: string; label: string }[];
  relationship_types: { code: string; label: string }[];
  verification: string[];
}
interface Form { id: string | null; name: string; type: string; country: string; description: string; watchlist: boolean; corridors: string[]; aliases: string; }

const BLANK: Form = { id: null, name: '', type: 'company', country: 'IN', description: '', watchlist: true, corridors: [], aliases: '' };

export default function Entities() {
  const [rows, setRows] = useState<Ent[] | null>(null);
  const [lu, setLu] = useState<Lookups | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [corridor, setCorridor] = useState('');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<Ent | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [busy, setBusy] = useState(false);
  // relationship add
  const [relTarget, setRelTarget] = useState('');
  const [relHits, setRelHits] = useState<{ id: string; name: string }[]>([]);
  const [relType, setRelType] = useState('depends_on');

  function load() {
    setRows(null);
    const p = new URLSearchParams();
    if (corridor) p.set('corridor', corridor);
    if (q) p.set('q', q);
    api<Ent[]>('/sid/entities?' + p.toString()).then(setRows).catch((e) => setErr(String(e.message || e)));
  }
  useEffect(load, [corridor]); // eslint-disable-line
  useEffect(() => { api<Lookups>('/lookups').then(setLu).catch(() => {}); }, []);

  function openDetail(e: Ent) { setSel(e); setForm(null); setDetail(null); api<Detail>('/sid/entity?id=' + e.id).then(setDetail); }
  function refreshDetail() { if (sel) api<Detail>('/sid/entity?id=' + sel.id).then(setDetail); }

  function startNew() { setSel(null); setDetail(null); setForm({ ...BLANK }); }
  function startEdit() {
    if (!sel) return;
    setForm({ id: sel.id, name: sel.name, type: sel.type_code, country: sel.country || '', description: detail?.entity.description || '', watchlist: sel.watchlist, corridors: sel.corridors || [], aliases: '' });
  }

  async function saveEntity() {
    if (!form) return;
    setBusy(true); setErr(null);
    try {
      await api('/sid/entity-save', { method: 'POST', body: JSON.stringify({ ...form, aliases: form.aliases.split(',').map((s) => s.trim()).filter(Boolean) }) });
      setForm(null); load();
    } catch (e) { setErr(String((e as Error).message || e)); } finally { setBusy(false); }
  }
  async function retire() {
    if (!sel || !confirm('Retire (set dormant) ' + sel.name + '?')) return;
    setBusy(true);
    try { await api('/sid/entity-retire', { method: 'POST', body: JSON.stringify({ id: sel.id, status: 'dormant' }) }); setSel(null); setDetail(null); load(); }
    finally { setBusy(false); }
  }
  async function addRel(targetId: string) {
    if (!sel) return;
    setBusy(true);
    try { await api('/sid/relationship-add', { method: 'POST', body: JSON.stringify({ src: sel.id, tgt: targetId, rel: relType }) }); setRelTarget(''); setRelHits([]); refreshDetail(); }
    finally { setBusy(false); }
  }
  async function removeRel(rid: string) {
    setBusy(true);
    try { await api('/sid/relationship-close', { method: 'POST', body: JSON.stringify({ id: rid, delete: true }) }); refreshDetail(); }
    finally { setBusy(false); }
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h1 className="admin-h1">Entity explorer</h1>
        <button className="admin-btn admin-btn-go" onClick={startNew}>+ New entity</button>
      </div>
      <p className="admin-sub">{rows ? `${rows.length} nodes` : '…'} · search, edit, retire, and wire relationships</p>

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
              <tr key={e.id} style={{ cursor: 'pointer' }} onClick={() => openDetail(e)}>
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

      {form && lu && (
        <Card title={form.id ? 'Edit entity' : 'New entity'} onClose={() => setForm(null)}>
          <Field label="Name"><input className="admin-input" style={{ width: '100%' }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Type"><select className="admin-select" style={{ width: '100%' }} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{lu.entity_types.map((t) => <option key={t.code} value={t.code}>{t.label}</option>)}</select></Field>
            <Field label="Country (ISO-2)"><input className="admin-input" style={{ width: '100%' }} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></Field>
          </div>
          <Field label="Description"><textarea className="admin-input" style={{ width: '100%', minHeight: 60 }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Corridors">
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {lu.corridors.map((c) => (
                <label key={c.code} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <input type="checkbox" checked={form.corridors.includes(c.code)} onChange={(ev) => setForm({ ...form, corridors: ev.target.checked ? [...form.corridors, c.code] : form.corridors.filter((x) => x !== c.code) })} />{c.label}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Add aliases (comma-separated)"><input className="admin-input" style={{ width: '100%' }} value={form.aliases} onChange={(e) => setForm({ ...form, aliases: e.target.value })} placeholder="abbreviation, ticker, former name…" /></Field>
          <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, margin: '6px 0 12px' }}>
            <input type="checkbox" checked={form.watchlist} onChange={(e) => setForm({ ...form, watchlist: e.target.checked })} /> Watchlist node (load-bearing)
          </label>
          <button className="admin-btn admin-btn-go" disabled={busy || !form.name} onClick={saveEntity}>{busy ? 'Saving…' : form.id ? 'Save changes' : 'Create entity'}</button>
        </Card>
      )}

      {!form && detail && detail.entity && lu && (
        <Card title={detail.entity.name} onClose={() => { setSel(null); setDetail(null); }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <button className="admin-btn" onClick={startEdit}>Edit</button>
            <button className="admin-btn admin-btn-no" onClick={retire} disabled={busy}>Retire</button>
            {detail.entity.status !== 'active' && <Pill tone="crimson">{detail.entity.status}</Pill>}
          </div>
          <div style={{ fontSize: 12, color: 'var(--admin-muted)', marginBottom: 8 }}>{detail.entity.type} · {detail.entity.country} · {detail.corridors.join(', ')}</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 0 }}>{detail.entity.description}</p>
          {detail.aliases.length > 0 && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>{detail.aliases.map((a, i) => <Pill key={i}>{a.alias}</Pill>)}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
            <EdgeList title="Out (depends_on / supplies / controls…)" edges={detail.out} dir="out" onRemove={removeRel} busy={busy} />
            <EdgeList title="In (depended on by)" edges={detail.inbound} dir="in" onRemove={removeRel} busy={busy} />
          </div>

          <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--admin-muted)', marginBottom: 6 }}>Add relationship (this node → target)</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <select className="admin-select" value={relType} onChange={(e) => setRelType(e.target.value)}>{lu.relationship_types.map((t) => <option key={t.code} value={t.code}>{t.label}</option>)}</select>
              <input className="admin-input" placeholder="find target node…" value={relTarget} style={{ flex: 1, minWidth: 160 }}
                onChange={(e) => setRelTarget(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && api<{ id: string; name: string }[]>('/sid/entities?q=' + encodeURIComponent(relTarget)).then(setRelHits)} />
              <button className="admin-btn" onClick={() => api<{ id: string; name: string }[]>('/sid/entities?q=' + encodeURIComponent(relTarget)).then(setRelHits)}>Find</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {relHits.filter((h) => h.id !== sel?.id).slice(0, 12).map((h) => (
                <button key={h.id} className="admin-btn" disabled={busy} onClick={() => addRel(h.id)}>→ {h.name}</button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </>
  );
}

function Card({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 18, background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 14, padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>
        <button className="admin-btn" onClick={onClose}>Close</button>
      </div>
      {children}
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 10 }}><label style={{ display: 'block', fontSize: 12, color: 'var(--admin-muted)', marginBottom: 4 }}>{label}</label>{children}</div>;
}
function EdgeList({ title, edges, dir, onRemove, busy }: { title: string; edges: Edge[]; dir: 'out' | 'in'; onRemove: (rid: string) => void; busy: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--admin-muted)', marginBottom: 4 }}>{title}</div>
      {edges.length === 0 ? <div style={{ fontSize: 13, color: 'var(--admin-muted)' }}>—</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {edges.map((e) => (
            <div key={e.rid} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <span style={{ flex: 1 }}>{dir === 'out' ? `${e.rel} → ${e.target}` : `${e.source} → ${e.rel}`}</span>
              <button className="admin-btn admin-btn-no" style={{ padding: '1px 7px' }} disabled={busy} onClick={() => onRemove(e.rid)} title="remove">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
