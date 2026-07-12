'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import platform from '../_platform.json';

// Only baked entities are linkable (long-tail entities show as non-link cards).
const BAKED = new Set((platform as { kind: string; slug: string }[]).map((e) => `${e.kind}/${e.slug}`));

const OBJECT_KINDS = new Set([
  'technology', 'mineral_material', 'product', 'process', 'standard', 'patent', 'university',
  'machine', 'certification', 'opportunity_surface', 'dataset', 'ipc_classification',
  'cpc_classification', 'ecosystem', 'supply_chain', 'testing_lab', 'port', 'airport',
  'power_plant', 'mine', 'funding_round', 'research_paper',
]);

type Res = { id: string; canonical_name: string; kind: string; kind_label: string; snippet: string; slug: string };

export function SearchView() {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<Res[] | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = q.trim();
    if (!t) { setRows(null); return; }
    const c = new AbortController();
    setBusy(true);
    const id = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(t)}&limit=40`, { signal: c.signal })
        .then((r) => r.json())
        .then((j) => setRows(j.ok ? (j.results || []) : []))
        .catch(() => {})
        .finally(() => setBusy(false));
    }, 250);
    return () => { clearTimeout(id); c.abort(); };
  }, [q]);

  const style: React.CSSProperties = { border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 10, padding: '12px 14px', background: 'var(--bg-2, rgba(255,255,255,.02))', textDecoration: 'none', display: 'block' };

  return (
    <>
      <input
        autoFocus placeholder="Search the Atlas — technologies, products, materials, patents, companies…"
        value={q} onChange={(e) => setQ(e.target.value)}
        style={{ width: '100%', maxWidth: 620, background: 'var(--bg-2, rgba(255,255,255,.03))', color: 'var(--text, #e9e7e0)', border: '1px solid var(--border, rgba(255,255,255,.16))', borderRadius: 10, padding: '12px 14px', fontSize: 16, marginBottom: 20 }}
      />
      {rows === null ? (
        <p style={{ color: 'var(--text-dim)' }}>Type to search the knowledge graph.</p>
      ) : rows.length === 0 ? (
        <p style={{ color: 'var(--text-dim)' }}>{busy ? 'Searching…' : 'No matches.'}</p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
          {rows.map((e) => {
            const inner = (
              <>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--brass, #C9A84C)' }}>{e.kind_label}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text, #e9e7e0)' }}>{e.canonical_name}</div>
                {e.snippet && <p style={{ fontSize: 13, color: 'var(--text-muted, #9aa3b2)', margin: '3px 0 0', lineHeight: 1.45 }}>{e.snippet}</p>}
              </>
            );
            return (
              <li key={e.id}>
                {OBJECT_KINDS.has(e.kind) && e.slug && BAKED.has(`${e.kind}/${e.slug}`)
                  ? <Link href={`/research/e/${e.kind}/${e.slug}/`} style={style}>{inner}</Link>
                  : <div style={style}>{inner}</div>}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
