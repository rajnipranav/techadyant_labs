'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import platform from '../_platform.json';

// Only entities that were actually baked into static pages are linkable.
// Long-tail entities (e.g. freshly-ingested patents) show as non-link cards
// so we never link to a page that wasn't generated.
const BAKED = new Set((platform as { kind: string; slug: string }[]).map((e) => `${e.kind}/${e.slug}`));

const KINDS = [
  { code: '', label: 'All' },
  { code: 'technology', label: 'Technologies' },
  { code: 'product', label: 'Products' },
  { code: 'mineral_material', label: 'Materials' },
  { code: 'process', label: 'Processes' },
  { code: 'standard', label: 'Standards' },
  { code: 'patent', label: 'Patents' },
  { code: 'company', label: 'Companies' },
  { code: 'foreign_supplier', label: 'Foreign suppliers' },
  { code: 'scheme', label: 'Schemes' },
];

// Kinds that have a static entity page at /research/e/<kind>/<slug>.
const OBJECT_KINDS = new Set([
  'technology', 'mineral_material', 'product', 'process', 'standard', 'patent', 'university',
  'machine', 'certification', 'opportunity_surface', 'dataset', 'ipc_classification',
  'cpc_classification', 'ecosystem', 'supply_chain', 'testing_lab', 'port', 'airport',
  'power_plant', 'mine', 'funding_round', 'research_paper',
]);

type Ent = { id: string; canonical_name: string; kind: string; kind_label: string; description: string | null; slug: string };

function chip(active: boolean): React.CSSProperties {
  return {
    cursor: 'pointer', border: '1px solid var(--border, rgba(255,255,255,.16))',
    background: active ? 'var(--text, #e9e7e0)' : 'transparent',
    color: active ? 'var(--bg, #0b0b14)' : 'var(--text-dim, #9aa3b2)',
    borderRadius: 999, padding: '5px 13px', fontSize: 13, fontWeight: active ? 700 : 500,
  };
}

export function ExplorerView() {
  const [kind, setKind] = useState('');
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<Ent[] | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    const c = new AbortController();
    const params = new URLSearchParams();
    if (kind) params.set('kind', kind);
    if (q.trim()) params.set('q', q.trim());
    params.set('limit', '120');
    setRows(null); setErr('');
    fetch(`/api/entities?${params.toString()}`, { signal: c.signal })
      .then((r) => r.json())
      .then((j) => { if (j.ok) setRows(j.entities || []); else setErr(j.message || 'Could not load entities.'); })
      .catch((e) => { if (e.name !== 'AbortError') setErr(String(e.message || e)); });
    return () => c.abort();
  }, [kind, q]);

  return (
    <>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {KINDS.map((k) => <button key={k.code} style={chip(kind === k.code)} onClick={() => setKind(k.code)}>{k.label}</button>)}
      </div>
      <input
        placeholder="Filter by name…" value={q} onChange={(e) => setQ(e.target.value)}
        style={{ width: '100%', maxWidth: 420, marginBottom: 18, background: 'var(--bg-2, rgba(255,255,255,.03))', color: 'var(--text, #e9e7e0)', border: '1px solid var(--border, rgba(255,255,255,.16))', borderRadius: 8, padding: '9px 12px', fontSize: 14 }}
      />
      {err && <p style={{ color: '#E24B4A' }}>{err}</p>}
      {!rows ? (
        <p style={{ color: 'var(--text-dim)' }}>Loading…</p>
      ) : rows.length === 0 ? (
        <p style={{ color: 'var(--text-dim)' }}>No entities match.</p>
      ) : (
        <>
          <div className="ed-kicker" style={{ marginBottom: 12 }}>{rows.length} entities</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {rows.map((e) => {
              const card = (
                <div style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 10, padding: '14px 16px', height: '100%', background: 'var(--bg-2, rgba(255,255,255,.02))' }}>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--brass, #C9A84C)' }}>{e.kind_label}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text, #e9e7e0)', margin: '4px 0' }}>{e.canonical_name}</div>
                  {e.description && <p style={{ fontSize: 13, color: 'var(--text-muted, #9aa3b2)', lineHeight: 1.45, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{e.description}</p>}
                </div>
              );
              return OBJECT_KINDS.has(e.kind) && e.slug && BAKED.has(`${e.kind}/${e.slug}`)
                ? <Link key={e.id} href={`/research/e/${e.kind}/${e.slug}/`} style={{ textDecoration: 'none' }}>{card}</Link>
                : <div key={e.id}>{card}</div>;
            })}
          </div>
        </>
      )}
    </>
  );
}
