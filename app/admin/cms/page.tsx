'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

const API = '/api/cms';
const TYPES = ['reports', 'signals', 'briefings', 'newsletters', 'pages'] as const;
type CmsType = typeof TYPES[number];



function StatusBadge(props: { status: string }) {
  const colors: Record<string, string> = { published: '#1D9E75', live: '#1D9E75', forthcoming: '#6366F1', monitoring: '#F5B544', placeholder: '#666' };
  return <span style={{ background: colors[props.status] || '#666', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>{props.status}</span>;
}

function ErrorBox(props: { error: string; onClose: () => void }) {
  return (
    <div style={{ background: '#3a1f1f', border: '1px solid #E24B4A', color: '#F5B544', padding: 12, borderRadius: 6, marginBottom: 14, fontSize: 13 }}>
      <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{props.error}</pre>
      <button onClick={props.onClose} style={{ float: 'right', background: 'none', border: 'none', color: '#F5B544', cursor: 'pointer' }}>[X]</button>
    </div>
  );
}

function Field(props: { label: string; value: any; onChange: (v: string) => void; textarea?: boolean; type?: string; as?: string; options?: string[]; rows?: number }) {
  const base: React.CSSProperties = { width: '100%', background: 'var(--admin-surface)', color: '#E8E8F0', border: '1px solid var(--admin-border)', padding: '8px 10px', borderRadius: 6, fontSize: 13 };
  if (props.textarea) return <textarea style={{ ...base, minHeight: props.rows || 80, fontFamily: 'monospace', fontSize: 12 }} value={props.value} onChange={(e) => props.onChange(e.target.value)} />;
  if (props.as === 'select') return <select style={base} value={props.value} onChange={(e) => props.onChange(e.target.value)}>{props.options?.map((o) => <option key={o} value={o}>{o}</option>)}</select>;
  return <input type={props.type || 'text'} style={base} value={props.value} onChange={(e) => props.onChange(e.target.value)} />;
}

export default function CmsAdmin() {
  return (
    <Suspense fallback={<p style={{ color: '#9898A8' }}>Loading…</p>}>
      <CmsAdminInner />
    </Suspense>
  );
}

function CmsAdminInner() {
  const params = useSearchParams();
  const initial = (params.get('type') as CmsType) || 'reports';
  const [type, setType] = useState<CmsType>(initial);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<string>('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${API}/${type}`);
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.error || `HTTP ${r.status}`);
      setItems(j);
    } catch (e: any) { setError(String(e.message || e)); }
    finally { setLoading(false); }
  }, [type]);

  useEffect(() => { load(); }, [type, load]);

  const startCreate = () => {
    setEditing({
      slug: '', title: '', status: 'published', access: 'free', accent: '#C9A84C',
      summary: '', keywords: [], faq: [], sources: [], seo: {},
    });
    setCreating(true);
  };
  const startEdit = (row: any) => {
    setEditing({ ...row });
    setCreating(false);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const url = `${API}/${type}${creating ? '' : '/' + editing.slug}`;
      const method = creating ? 'POST' : 'PUT';
      const r = await fetch(url, { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(editing) });
      const text = await r.text();
      let data: any;
      try { data = JSON.parse(text); } catch { data = text; }
      if (!r.ok) throw new Error(typeof data === 'string' ? data : (data?.error || `HTTP ${r.status}`));
      await load();
      setEditing(null);
      setCreating(false);
    } catch (e: any) { setError(String(e.message || e)); }
    finally { setSaving(false); }
  };

  const remove = async (row: any) => {
    if (!confirm(`Delete ${row.slug}?`)) return;
    setError(null);
    const r = await fetch(`${API}/${type}/${row.slug}`, { method: 'DELETE' });
    if (!r.ok) {
      const t = await r.text();
      let d; try { d = JSON.parse(t); } catch { d = t; }
      setError(typeof d === 'string' ? d : (d?.error || `HTTP ${r.status}`));
      return;
    }
    await load();
  };

  const update = (key: string, value: any) => setEditing((prev: any) => ({ ...prev, [key]: value }));
  const updateJson = (key: string, raw: string) => {
    try { update(key, JSON.parse(raw)); }
    catch (e: any) { console.warn('JSON parse failed', key, e); }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
      <aside className="admin-sidebar" style={{ height: 'fit-content' }}>
        <div className="admin-brand" style={{ marginBottom: 14 }}><b>CMS</b> · Content</div>
        {TYPES.map((t) => (
          <button key={t} onClick={() => { setType(t); setEditing(null); setCreating(false); }}
            className={`admin-navlink${type === t ? ' active' : ''}`} style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13 }}>
            {t}
          </button>
        ))}
        <div style={{ marginTop: 14, borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 10, fontSize: 11, color: '#6f7a8c' }}>
          {debug}<br />{items.length} rows
        </div>
      </aside>

      <main>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 className="admin-h1" style={{ margin: 0 }}>{type} <span style={{ fontSize: 12, opacity: 0.6 }}>CMS</span></h1>
          <button className="admin-btn" onClick={startCreate}>+ New {type.slice(0, -1)}</button>
        </div>

        {error && <ErrorBox error={error} onClose={() => setError(null)} />}

        {loading && <p style={{ color: '#9898A8' }}>Loading…</p>}

        {!loading && !editing && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Slug</th>
                  <th>Title</th>
                  <th>Status</th>
                  {type === 'reports' && <th>Access</th>}
                  {type === 'reports' && <th>Price (INR)</th>}
                  <th>Updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.slug}>
                    <td><code style={{ fontSize: 12 }}>{r.slug}</code></td>
                    <td>{r.title}</td>
                    <td><StatusBadge status={r.status} /></td>
                    {type === 'reports' && <td>{r.access}</td>}
                    {type === 'reports' && <td>{r.price ?? '--'}</td>}
                    <td style={{ fontSize: 12 }}>{r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '--'}</td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button className="admin-btn" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => startEdit(r)}>Edit</button>
                      <button className="admin-btn" style={{ padding: '4px 10px', fontSize: 12, marginLeft: 6, background: '#3a1f1f' }} onClick={() => remove(r)}>Del</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: '#9898A8' }}>No rows yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {editing && (
          <CmsForm
            type={type}
            value={editing}
            onChange={setEditing}
            onSave={save}
            onCancel={() => { setEditing(null); setCreating(false); }}
            saving={saving}
            title={creating ? `New ${type.slice(0, -1)}` : `Edit ${editing.slug}`}
          />
        )}
      </main>
    </div>
  );
}

function CmsForm(props: { type: CmsType; value: any; onChange: (v: any) => void; onSave: () => void; onCancel: () => void; saving: boolean; title: string }) {
  const value = props.value;
  const update = props.onChange;
  const [jsonFields, setJsonFields] = useState<Record<string, string>>({});

  useEffect(() => {
    const init: Record<string, string> = {};
    for (const k of ['faq', 'body_params', 'seo', 'body']) {
      if (value[k] !== undefined) init[k] = JSON.stringify(value[k], null, 2);
    }
    setJsonFields(init);
  }, [value.slug]);

  const updateJson = (key: string, raw: string) => {
    setJsonFields((p) => ({ ...p, [key]: raw }));
    try { update({ ...value, [key]: JSON.parse(raw) }); }
    catch (e) { console.warn('JSON parse failed', key, e); }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>{props.title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Field label="slug" value={value.slug || ''} onChange={(t) => update({ ...value, slug: t })} />
        <Field label="title" value={value.title || ''} onChange={(t) => update({ ...value, title: t })} />
        {props.type === 'reports' && (
          <>
            <Field label="subtitle" value={value.subtitle || ''} onChange={(t) => update({ ...value, subtitle: t })} />
            <Field label="domain" value={value.domain || ''} onChange={(t) => update({ ...value, domain: t })} />
            <Field label="edition" value={value.edition || ''} onChange={(t) => update({ ...value, edition: t })} />
            <Field label="published (ISO)" value={value.published || ''} onChange={(t) => update({ ...value, published: t })} />
            <Field label="published_label" value={value.published_label || ''} onChange={(t) => update({ ...value, published_label: t })} />
            <Field label="reading_time" value={value.reading_time || ''} onChange={(t) => update({ ...value, reading_time: t })} />
            <Field label="status" value={value.status || 'published'} onChange={(t) => update({ ...value, status: t })} as="select" options={['published', 'forthcoming']} />
            <Field label="accent" value={value.accent || ''} onChange={(t) => update({ ...value, accent: t })} />
            <Field label="access" value={value.access || 'free'} onChange={(t) => update({ ...value, access: t })} as="select" options={['free', 'paid']} />
            <Field label="price" value={value.price ?? ''} onChange={(t) => update({ ...value, price: t === '' ? null : Number(t) })} type="number" />
            <Field label="currency" value={value.currency || 'INR'} onChange={(t) => update({ ...value, currency: t })} />
            <Field label="has_pdf" value={String(value.has_pdf ?? false)} onChange={(t) => update({ ...value, has_pdf: t === 'true' })} as="select" options={['true', 'false']} />
            <Field label="cover" value={value.cover || ''} onChange={(t) => update({ ...value, cover: t })} />
            <Field label="preview_object" value={value.preview_object || ''} onChange={(t) => update({ ...value, preview_object: t })} />
            <Field label="preview_pages" value={value.preview_pages ?? ''} onChange={(t) => update({ ...value, preview_pages: t === '' ? null : Number(t) })} type="number" />
            <Field label="summary" value={value.summary || ''} onChange={(t) => update({ ...value, summary: t })} textarea />
            <Field label="keywords (comma-separated)" value={Array.isArray(value.keywords) ? value.keywords.join(', ') : (value.keywords || '')} onChange={(t) => update({ ...value, keywords: t.split(',').map((s) => s.trim()).filter(Boolean) })} textarea />
            <Field label="sources (comma-separated)" value={Array.isArray(value.sources) ? value.sources.join('\n') : ''} onChange={(t) => update({ ...value, sources: t.split('\n').map((s) => s.trim()).filter(Boolean) })} textarea />
            <Field label="faq (JSON)" value={jsonFields.faq || ''} onChange={(t) => updateJson('faq', t)} textarea />
            <Field label="body_params (JSON)" value={jsonFields['body_params'] || ''} onChange={(t) => updateJson('body_params', t)} textarea />
            <Field label="seo (JSON)" value={jsonFields.seo || ''} onChange={(t) => updateJson('seo', t)} textarea />
          </>
        )}

        {props.type === 'signals' && (
          <>
            <Field label="no" value={value.no || ''} onChange={(t) => update({ ...value, no: t })} />
            <Field label="domain" value={value.domain || ''} onChange={(t) => update({ ...value, domain: t })} />
            <Field label="date (ISO)" value={value.date || ''} onChange={(t) => update({ ...value, date: t })} />
            <Field label="date_label" value={value.date_label || ''} onChange={(t) => update({ ...value, date_label: t })} />
            <Field label="reading_time" value={value.reading_time || ''} onChange={(t) => update({ ...value, reading_time: t })} />
            <Field label="category" value={value.category || ''} onChange={(t) => update({ ...value, category: t })} />
            <Field label="priority" value={value.priority || 'medium'} onChange={(t) => update({ ...value, priority: t })} as="select" options={['high', 'medium', 'low']} />
            <Field label="excerpt" value={value.excerpt || ''} onChange={(t) => update({ ...value, excerpt: t })} textarea />
            <Field label="takeaways (comma-separated)" value={Array.isArray(value.takeaways) ? value.takeaways.join('\n') : ''} onChange={(t) => update({ ...value, takeaways: t.split('\n').map((s) => s.trim()).filter(Boolean) })} textarea />
            <Field label="sources (comma-separated)" value={Array.isArray(value.sources) ? value.sources.join('\n') : ''} onChange={(t) => update({ ...value, sources: t.split('\n').map((s) => s.trim()).filter(Boolean) })} textarea />
            <Field label="body (JSON)" value={jsonFields.body || ''} onChange={(t) => updateJson('body', t)} textarea />
            <Field label="seo (JSON)" value={jsonFields.seo || ''} onChange={(t) => updateJson('seo', t)} textarea />
          </>
        )}

        {props.type === 'briefings' && (
          <>
            <Field label="published (ISO)" value={value.published || ''} onChange={(t) => update({ ...value, published: t })} />
            <Field label="summary" value={value.summary || ''} onChange={(t) => update({ ...value, summary: t })} textarea />
            <Field label="seo (JSON)" value={jsonFields.seo || ''} onChange={(t) => updateJson('seo', t)} textarea />
          </>
        )}

        {props.type === 'newsletters' && (
          <>
            <Field label="date" value={value.date || ''} onChange={(t) => update({ ...value, date: t })} />
            <Field label="description" value={value.description || ''} onChange={(t) => update({ ...value, description: t })} textarea />
            <Field label="seo (JSON)" value={jsonFields.seo || ''} onChange={(t) => updateJson('seo', t)} textarea />
          </>
        )}

        {props.type === 'pages' && (
          <>
            <Field label="title" value={value.title || ''} onChange={(t) => update({ ...value, title: t })} />
            <Field label="content (HTML/markdown)" value={value.content || ''} onChange={(t) => update({ ...value, content: t })} textarea rows={12} />
            <Field label="seo (JSON)" value={jsonFields.seo || ''} onChange={(t) => updateJson('seo', t)} textarea />
          </>
        )}

        <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
          <button className="admin-btn" onClick={props.onSave} disabled={props.saving}>{props.saving ? 'Saving…' : 'Save'}</button>
          <button className="admin-btn" style={{ background: '#333' }} onClick={props.onCancel} disabled={props.saving}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
