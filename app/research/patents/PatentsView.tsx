'use client';

import { useEffect, useState } from 'react';

type Patent = {
  patent_number: string; title: string | null; abstract: string | null;
  publication_date: string | null; source: string | null; industry: string; applicant: string | null;
};
type Facet = { industry: string; count: number };
type Payload = { ok: boolean; total: number; matched: number; industries: Facet[]; patents: Patent[]; message?: string };

const INDUSTRY_LABEL: Record<string, string> = {
  'semiconductors': 'Semiconductors', 'drones-uav': 'Drones / UAV', 'quantum': 'Quantum',
  'ai': 'AI', 'batteries-energy': 'Batteries & Energy', 'telecom': 'Telecom',
  'medical': 'Medical', 'other': 'Other', 'unclassified': 'Unclassified',
};
const label = (k: string) => INDUSTRY_LABEL[k] || k;

function chip(active: boolean): React.CSSProperties {
  return {
    cursor: 'pointer', border: '1px solid var(--border, rgba(255,255,255,.16))',
    background: active ? 'var(--text, #e9e7e0)' : 'transparent',
    color: active ? 'var(--bg, #0b0b14)' : 'var(--text-dim, #9aa3b2)',
    borderRadius: 999, padding: '5px 13px', fontSize: 13, fontWeight: active ? 700 : 500,
  };
}

export function PatentsView() {
  const [industry, setIndustry] = useState('');
  const [q, setQ] = useState('');
  const [data, setData] = useState<Payload | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    const c = new AbortController();
    const params = new URLSearchParams();
    if (industry) params.set('industry', industry);
    if (q.trim()) params.set('q', q.trim());
    params.set('limit', '120');
    setData(null); setErr('');
    const id = setTimeout(() => {
      fetch(`/api/patents?${params.toString()}`, { signal: c.signal })
        .then((r) => r.json())
        .then((j: Payload) => { if (j.ok) setData(j); else setErr(j.message || 'Could not load patents.'); })
        .catch((e) => { if (e.name !== 'AbortError') setErr(String(e.message || e)); });
    }, q ? 250 : 0);
    return () => { clearTimeout(id); c.abort(); };
  }, [industry, q]);

  return (
    <>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <button style={chip(industry === '')} onClick={() => setIndustry('')}>All{data ? ` ${data.total}` : ''}</button>
        {(data?.industries || []).map((f) => (
          <button key={f.industry} style={chip(industry === f.industry)} onClick={() => setIndustry(f.industry)}>
            {label(f.industry)} {f.count}
          </button>
        ))}
      </div>
      <input
        placeholder="Search patents by title or applicant…" value={q} onChange={(e) => setQ(e.target.value)}
        style={{ width: '100%', maxWidth: 480, marginBottom: 18, background: 'var(--bg-2, rgba(255,255,255,.03))', color: 'var(--text, #e9e7e0)', border: '1px solid var(--border, rgba(255,255,255,.16))', borderRadius: 8, padding: '9px 12px', fontSize: 14 }}
      />
      {err && <p style={{ color: '#E24B4A' }}>{err}</p>}
      {!data ? (
        <p style={{ color: 'var(--text-dim)' }}>Loading…</p>
      ) : data.total === 0 ? (
        <div style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 12, padding: '28px 24px', background: 'var(--bg-2, rgba(255,255,255,.02))', color: 'var(--text-muted, #9aa3b2)' }}>
          <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)', marginBottom: 8 }}>Ingestion in progress</div>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>
            No patents have been ingested yet. Our weekly ingestion pulls India-relevant patents in
            semiconductors, drones, quantum, batteries and telecom and stages them here. This page
            fills automatically as the feed runs — check back shortly.
          </p>
        </div>
      ) : data.patents.length === 0 ? (
        <p style={{ color: 'var(--text-dim)' }}>No patents match that filter.</p>
      ) : (
        <>
          <div className="ed-kicker" style={{ marginBottom: 12 }}>{data.matched} patents</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
            {data.patents.map((p) => (
              <li key={p.patent_number} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 10, padding: '14px 16px', background: 'var(--bg-2, rgba(255,255,255,.02))' }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--brass, #C9A84C)' }}>{label(p.industry)}</span>
                  {p.publication_date && <span style={{ fontSize: 12, color: 'var(--text-muted, #8a8a98)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{p.publication_date}</span>}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text, #e9e7e0)', lineHeight: 1.4 }}>{p.title || p.patent_number}</div>
                {p.applicant && <div style={{ fontSize: 13, color: 'var(--text-dim, #c7c7d2)', marginTop: 2 }}>{p.applicant}</div>}
                {p.abstract && <p style={{ fontSize: 13, color: 'var(--text-muted, #9aa3b2)', margin: '8px 0 0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.abstract}</p>}
                <div style={{ marginTop: 8 }}>
                  <a href={`https://patents.google.com/patent/${encodeURIComponent(p.patent_number)}`} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--link, #6cb0ff)' }}>
                    {p.patent_number} — view source ↗
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
