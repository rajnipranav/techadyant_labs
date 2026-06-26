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

function Field(props: { label: string; value: any; onChange: (v: string) => void; textarea?: boolean; type?: string; as?: string; options?: string[]; rows?: number; hint?: string; required?: boolean; placeholder?: string; full?: boolean }) {
  const base: React.CSSProperties = { width: '100%', background: 'var(--admin-surface)', color: '#E8E8F0', border: '1px solid var(--admin-border)', padding: '8px 10px', borderRadius: 6, fontSize: 13 };
  const control = props.textarea
    ? <textarea style={{ ...base, minHeight: props.rows || 80, fontFamily: 'monospace', fontSize: 12 }} value={props.value} placeholder={props.placeholder} onChange={(e) => props.onChange(e.target.value)} />
    : props.as === 'select'
      ? <select style={base} value={props.value} onChange={(e) => props.onChange(e.target.value)}>{props.options?.map((o) => <option key={o} value={o}>{o}</option>)}</select>
      : <input type={props.type || 'text'} style={base} value={props.value} placeholder={props.placeholder} onChange={(e) => props.onChange(e.target.value)} />;
  return (
    <label style={{ display: 'block', gridColumn: props.full ? '1 / -1' : undefined }}>
      <span style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#C7C7D2', marginBottom: 4 }}>
        {props.label}{props.required && <span style={{ color: '#E24B4A' }}> *</span>}
      </span>
      {control}
      {props.hint && <span style={{ display: 'block', fontSize: 11, color: '#8A8A98', marginTop: 4, lineHeight: 1.4, fontWeight: 400 }}>{props.hint}</span>}
    </label>
  );
}

function SectionHead(props: { title: string; desc?: string }) {
  return (
    <div style={{ gridColumn: '1 / -1', marginTop: 8, marginBottom: -2, borderBottom: '1px solid var(--admin-border)', paddingBottom: 6 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#E8E8F0', letterSpacing: '.02em' }}>{props.title}</div>
      {props.desc && <div style={{ fontSize: 11, color: '#8A8A98', marginTop: 2 }}>{props.desc}</div>}
    </div>
  );
}

function CoverUpload(props: { slug: string; value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const onPick = async (file: File | null) => {
    if (!file) return;
    setBusy(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('slug', props.slug || 'cover');
      const r = await fetch('/api/cms/_upload', { method: 'POST', body: fd });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.url) throw new Error(j?.error || `HTTP ${r.status}`);
      props.onChange(j.url);
    } catch (e: any) { setErr(String(e.message || e)); }
    finally { setBusy(false); }
  };
  return (
    <label style={{ display: 'block', gridColumn: '1 / -1' }}>
      <span style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#C7C7D2', marginBottom: 4 }}>Cover image</span>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {props.value
          ? <img src={props.value} alt="cover" style={{ width: 72, height: 101, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--admin-border)' }} />
          : <div style={{ width: 72, height: 101, borderRadius: 4, border: '1px dashed var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#8A8A98' }}>no cover</div>}
        <div style={{ flex: 1 }}>
          <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" disabled={busy} onChange={(e) => onPick(e.target.files?.[0] || null)} style={{ fontSize: 12, color: '#C7C7D2' }} />
          <input type="text" value={props.value || ''} placeholder="/covers/slug.jpg or uploaded URL" onChange={(e) => props.onChange(e.target.value)}
            style={{ width: '100%', marginTop: 6, background: 'var(--admin-surface)', color: '#E8E8F0', border: '1px solid var(--admin-border)', padding: '6px 8px', borderRadius: 6, fontSize: 12 }} />
          <span style={{ display: 'block', fontSize: 11, color: '#8A8A98', marginTop: 4, lineHeight: 1.4 }}>
            {busy ? 'Uploading…' : err ? <span style={{ color: '#E24B4A' }}>{err}</span> : 'Upload a JPG/PNG/WebP (portrait, ~1000×1400) or paste an existing /covers path. Used on cards, the report page and social shares.'}
          </span>
        </div>
      </div>
    </label>
  );
}

function SeoPanel(props: { value: any; setValue: (v: any) => void }) {
  const value = props.value;
  const seo = value.seo || {};
  const setSeo = (patch: Record<string, any>) => props.setValue({ ...value, seo: { ...seo, ...patch } });

  const effTitle = (seo.metaTitle || value.title || '');
  const effDesc = (seo.metaDescription || value.summary || '');
  const slug = value.slug || '';
  const canonical = seo.canonical || `https://labs.techadyant.com/reports/${slug || 'slug'}/`;
  const kw = (seo.focusKeyword || '').trim().toLowerCase();
  const has = (s: string) => !!kw && (s || '').toLowerCase().includes(kw);
  const kwSlug = kw.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const checks = [
    { ok: !!kw, label: 'Focus keyword set' },
    { ok: has(effTitle), label: 'Focus keyword appears in the SEO title' },
    { ok: has(effDesc), label: 'Focus keyword appears in the meta description' },
    { ok: !!kw && slug.includes(kwSlug), label: 'Focus keyword appears in the URL slug' },
    { ok: effTitle.length > 0 && effTitle.length <= 60, label: `SEO title length (${effTitle.length}/60)` },
    { ok: effDesc.length >= 120 && effDesc.length <= 160, label: `Meta description length (${effDesc.length}, aim 120–160)` },
  ];
  const score = checks.filter((c) => c.ok).length;
  const scoreColor = score >= 5 ? '#1D9E75' : score >= 3 ? '#F5B544' : '#E24B4A';

  const counter = (n: number, lo: number, hi: number) => {
    const c = n === 0 ? '#8A8A98' : n > hi ? '#E24B4A' : n < lo ? '#F5B544' : '#1D9E75';
    return <span style={{ float: 'right', fontSize: 11, color: c, fontWeight: 400 }}>{n} chars</span>;
  };
  const fld: React.CSSProperties = { width: '100%', background: 'var(--admin-surface)', color: '#E8E8F0', border: '1px solid var(--admin-border)', padding: '8px 10px', borderRadius: 6, fontSize: 13 };
  const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#C7C7D2', marginBottom: 4 };

  return (
    <div style={{ gridColumn: '1 / -1', border: '1px solid var(--admin-border)', borderRadius: 8, padding: 14, background: 'rgba(255,255,255,.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#E8E8F0' }}>Search appearance</div>
        <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor }}>{score}/6 checks</span>
      </div>

      <div style={{ background: '#fff', borderRadius: 6, padding: '12px 14px', marginBottom: 14 }}>
        <div style={{ color: '#202124', fontSize: 12 }}>{canonical.replace(/^https?:\/\//, '').replace(/\/$/, '').replace(/\//g, ' › ')}</div>
        <div style={{ color: '#1a0dab', fontSize: 18, lineHeight: 1.3, margin: '2px 0' }}>{(effTitle || 'Untitled report').slice(0, 65)}</div>
        <div style={{ color: '#4d5156', fontSize: 13, lineHeight: 1.45 }}>{(effDesc || 'No description set — the report summary will be used.').slice(0, 170)}</div>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        <label><span style={lbl}>Focus keyword</span>
          <input style={fld} value={seo.focusKeyword || ''} placeholder="who builds India’s drones" onChange={(e) => setSeo({ focusKeyword: e.target.value })} /></label>
        <label><span style={lbl}>SEO title {counter(effTitle.length, 30, 60)}</span>
          <input style={fld} value={seo.metaTitle || ''} placeholder={value.title || 'Defaults to the report title'} onChange={(e) => setSeo({ metaTitle: e.target.value })} /></label>
        <label><span style={lbl}>Meta description {counter(effDesc.length, 120, 160)}</span>
          <textarea style={{ ...fld, minHeight: 64 }} value={seo.metaDescription || ''} placeholder={value.summary ? value.summary.slice(0, 120) + '…' : 'Defaults to the report summary'} onChange={(e) => setSeo({ metaDescription: e.target.value })} /></label>
        <label><span style={lbl}>Canonical URL</span>
          <input style={fld} value={seo.canonical || ''} placeholder={`https://labs.techadyant.com/reports/${slug || 'slug'}/`} onChange={(e) => setSeo({ canonical: e.target.value })} /></label>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="checkbox" checked={!!seo.noindex} onChange={(e) => setSeo({ noindex: e.target.checked })} />
          <span style={{ fontSize: 13, color: '#C7C7D2' }}>Hide this report from search engines (noindex)</span></label>

        <div style={{ fontSize: 12, fontWeight: 700, color: '#C7C7D2', marginTop: 6 }}>Social share (Open Graph / X)</div>
        <label><span style={lbl}>Social title</span>
          <input style={fld} value={seo.ogTitle || ''} placeholder={effTitle || 'Defaults to the SEO/report title'} onChange={(e) => setSeo({ ogTitle: e.target.value })} /></label>
        <label><span style={lbl}>Social description</span>
          <textarea style={{ ...fld, minHeight: 52 }} value={seo.ogDescription || ''} placeholder={value.subtitle || effDesc || 'Defaults to the subtitle'} onChange={(e) => setSeo({ ogDescription: e.target.value })} /></label>
        <label><span style={lbl}>Social image URL</span>
          <input style={fld} value={seo.ogImage || ''} placeholder={value.cover || '/og/…png'} onChange={(e) => setSeo({ ogImage: e.target.value })} />
          <span style={{ fontSize: 11, color: '#8A8A98', marginTop: 4, display: 'block' }}>1200×630. Defaults to the cover image if blank.{value.cover ? <button type="button" onClick={() => setSeo({ ogImage: value.cover })} style={{ marginLeft: 6, background: 'none', border: '1px solid var(--admin-border)', color: '#C7C7D2', borderRadius: 4, fontSize: 11, cursor: 'pointer', padding: '1px 6px' }}>Use cover</button> : null}</span></label>
        <label><span style={lbl}>X / Twitter card</span>
          <select style={fld} value={seo.twitterCard || 'summary_large_image'} onChange={(e) => setSeo({ twitterCard: e.target.value })}>
            <option value="summary_large_image">summary_large_image (big image)</option>
            <option value="summary">summary (small)</option>
          </select></label>
      </div>

      <div style={{ marginTop: 12, borderTop: '1px solid var(--admin-border)', paddingTop: 10, display: 'grid', gap: 5 }}>
        {checks.map((c) => (
          <div key={c.label} style={{ fontSize: 12, color: c.ok ? '#9fdcc4' : '#c9a06a' }}>
            <span style={{ color: c.ok ? '#1D9E75' : '#F5B544', fontWeight: 700 }}>{c.ok ? '✓' : '!'}</span> {c.label}
          </div>
        ))}
      </div>
    </div>
  );
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
  const [publishing, setPublishing] = useState(false);
  const [publishMsg, setPublishMsg] = useState<string>('');

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
    if (type === 'reports') {
      const miss: string[] = [];
      if (!editing.slug) miss.push('slug');
      if (!editing.title) miss.push('title');
      if (!editing.published) miss.push('published date');
      if (editing.access === 'paid' && !editing.price) miss.push('price (required for paid access)');
      if (miss.length) { setError('Please fill required fields: ' + miss.join(', ')); return; }
    }
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

  const publish = async () => {
    if (!confirm('Publish all CMS changes now? This triggers a full site rebuild; changes go live in ~1–2 minutes.')) return;
    setPublishing(true);
    setPublishMsg('');
    try {
      const r = await fetch(`${API}/_deploy`, { method: 'POST' });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.error || `HTTP ${r.status}`);
      setPublishMsg('✓ Rebuild triggered — changes go live in ~1–2 minutes.');
    } catch (e: any) {
      setPublishMsg('Publish failed: ' + String(e.message || e));
    } finally {
      setPublishing(false);
    }
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
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {publishMsg && <span style={{ fontSize: 12, color: publishMsg.startsWith('Publish failed') ? '#E24B4A' : '#1D9E75' }}>{publishMsg}</span>}
            <button className="admin-btn" onClick={publish} disabled={publishing} style={{ background: '#1D9E75' }} title="Trigger a site rebuild so saved changes go live">{publishing ? 'Publishing…' : 'Publish changes'}</button>
            <button className="admin-btn" onClick={startCreate}>+ New {type.slice(0, -1)}</button>
          </div>
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
        <Field label="Slug (URL)" required value={value.slug || ''} placeholder="india-fab-ecosystem"
          hint="Lowercase, hyphenated. Becomes the URL /reports/<slug>. Don't change it after publishing."
          onChange={(t) => update({ ...value, slug: t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') })} />
        <Field label="Title" required value={value.title || ''} placeholder="Who Really Builds India’s Drones?"
          hint="Display title shown on cards and the report page."
          onChange={(t) => update({ ...value, title: t, slug: value.slug ? value.slug : t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') })} />
        {props.type === 'reports' && (
          <>
            <SectionHead title="Basics" desc="Identity and positioning shown on the report card and header." />
            <Field label="Subtitle" full value={value.subtitle || ''} placeholder="One explanatory line under the title"
              hint="A single deck line under the title." onChange={(t) => update({ ...value, subtitle: t })} />
            <Field label="Domain / theme" value={value.domain || ''} placeholder="Defence & Dual-Use"
              hint="Drives the theme chip and /reports/theme/<…> hub. Reuse an existing domain to group reports."
              onChange={(t) => update({ ...value, domain: t })} />
            <Field label="Edition / series" value={value.edition || ''} placeholder="Strategic Opportunity · Edition 1 · v1.0"
              hint="Free-text edition or series label." onChange={(t) => update({ ...value, edition: t })} />
            <Field label="Status" as="select" options={['published', 'forthcoming']} value={value.status || 'published'}
              hint="'forthcoming' shows a placeholder card and is kept out of the sitemap until published."
              onChange={(t) => update({ ...value, status: t })} />
            <Field label="Published date" required type="date" value={value.published || ''} placeholder="2026-06-22"
              hint="YYYY-MM-DD. Reports are ordered newest-first by this date."
              onChange={(t) => update({ ...value, published: t })} />
            <Field label="Published label" value={value.published_label || ''} placeholder="June 2026"
              hint="Human-readable date on the card (e.g. 'June 2026')." onChange={(t) => update({ ...value, published_label: t })} />
            <Field label="Reading time" value={value.reading_time || ''} placeholder="~ 2.5h read"
              hint="Display only (e.g. '24 min read')." onChange={(t) => update({ ...value, reading_time: t })} />
            <Field label="Accent colour" value={value.accent || ''} placeholder="#2BC5B4"
              hint="Hex colour for the card accent and generated cover." onChange={(t) => update({ ...value, accent: t })} />

            <SectionHead title="Commerce" desc="Access tier and price. The price is also enforced server-side at checkout." />
            <Field label="Access" as="select" options={['free', 'paid']} value={value.access || 'free'}
              hint="'free' = open download, no price. 'paid' = requires purchase."
              onChange={(t) => update({ ...value, access: t, price: t === 'free' ? null : value.price })} />
            {value.access === 'paid'
              ? <Field label="Price (INR, whole rupees)" required type="number" value={value.price ?? ''} placeholder="6999"
                  hint={value.price ? `Enter whole rupees, not paise. Displays as ₹${Number(value.price).toLocaleString('en-IN')}.` : 'Enter whole rupees, not paise. e.g. 6999 → ₹6,999.'}
                  onChange={(t) => update({ ...value, price: t === '' ? null : Number(t) })} />
              : <div />}
            <Field label="Has PDF" as="select" options={['true', 'false']} value={String(value.has_pdf ?? false)}
              hint="Whether a downloadable PDF exists in storage." onChange={(t) => update({ ...value, has_pdf: t === 'true' })} />
            <Field label="Has deck" as="select" options={['true', 'false']} value={String(value.has_deck ?? false)}
              hint="Whether an investor/briefing deck ships with purchase." onChange={(t) => update({ ...value, has_deck: t === 'true' })} />
            <Field label="Pages" type="number" value={value.pages ?? ''} placeholder="150"
              hint="PDF page count (display only)." onChange={(t) => update({ ...value, pages: t === '' ? null : Number(t) })} />

            <SectionHead title="Media & preview" desc="Cover image and the free preview PDF." />
            <CoverUpload slug={value.slug} value={value.cover || ''} onChange={(u) => update({ ...value, cover: u })} />
            <Field label="Preview object (storage path)" value={value.preview_object || ''} placeholder="reports-free/My-Report-Free-Edition.pdf"
              hint="Filename of the free preview PDF in the reports-free bucket. Blank for none."
              onChange={(t) => update({ ...value, preview_object: t })} />
            <Field label="Preview pages" type="number" value={value.preview_pages ?? ''} placeholder="14"
              hint="Page count of the preview PDF (display only)." onChange={(t) => update({ ...value, preview_pages: t === '' ? null : Number(t) })} />

            <SectionHead title="Content & SEO basics" desc="Summary, keywords, sources and FAQ. (Full SEO/GEO panels arrive in the next phase.)" />
            <Field label="Summary" full textarea rows={120} value={value.summary || ''} placeholder="2–4 sentence abstract for the card and the meta-description fallback."
              hint="Shown on the report card; used as the search/social description if no SEO description is set."
              onChange={(t) => update({ ...value, summary: t })} />
            <Field label="Keywords (comma-separated)" full value={Array.isArray(value.keywords) ? value.keywords.join(', ') : (value.keywords || '')} placeholder="India drone manufacturing, drone supply chain, …"
              hint="Topics for SEO/GEO. Comma-separated; 6–12 is plenty."
              onChange={(t) => update({ ...value, keywords: t.split(',').map((s) => s.trim()).filter(Boolean) })} />
            <Field label="Sources (one URL per line)" full textarea value={Array.isArray(value.sources) ? value.sources.join('\n') : ''} placeholder={'https://pib.gov.in/…'}
              hint="Primary-source URLs, one per line." onChange={(t) => update({ ...value, sources: t.split('\n').map((s) => s.trim()).filter(Boolean) })} />
            <Field label="FAQ (JSON array of { q, a })" full textarea rows={140} value={jsonFields.faq || ''}
              hint={'Powers the FAQ rich result (GEO). Example: [{ "q": "…", "a": "…" }]'}
              onChange={(t) => updateJson('faq', t)} />
            <Field label="Body params (JSON)" full textarea value={jsonFields['body_params'] || ''}
              hint="Advanced: parameters passed to the report's body component. Leave as-is if unsure."
              onChange={(t) => updateJson('body_params', t)} />

            <SectionHead title="SEO" desc="Search-engine and social appearance. Each field falls back to the report defaults above if left blank." />
            <SeoPanel value={value} setValue={update} />
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
