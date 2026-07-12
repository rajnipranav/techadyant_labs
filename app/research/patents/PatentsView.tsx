'use client';

import { useMemo, useState } from 'react';

type Patent = {
  n: string; t: string; i: string; s: string; c: string; d: string; a: string;
  tr: number | null; is: number | null; ss: number | null; ipc?: string[]; j?: string;
};
type Meta = {
  total: number; india: number; updated: string;
  byIndustry: { i: string; c: number }[]; byCountry: { c: string; n: number }[];
};
type Data = { meta: Meta; patents: Patent[] };

const INDUSTRY_LABEL: Record<string, string> = {
  semiconductors: 'Semiconductors', critical_minerals: 'Critical Minerals',
  ai_infrastructure: 'AI Infrastructure', defence_electronics: 'Defence Electronics',
  battery_technologies: 'Batteries & Energy', robotics: 'Robotics',
  solar_manufacturing: 'Solar', aerospace: 'Aerospace', drone_technologies: 'Drones / UAV',
  quantum_technologies: 'Quantum', telecommunications: 'Telecom',
  advanced_materials: 'Advanced Materials', industrial_automation: 'Industrial Automation',
  renewable_energy: 'Renewable Energy', water_treatment: 'Water', agriculture: 'AgriTech',
  food_technology: 'Food Tech', other: 'Other',
};
const label = (k: string) => INDUSTRY_LABEL[k] || k;
const PAGE = 60;

function chip(active: boolean): React.CSSProperties {
  return {
    cursor: 'pointer', border: '1px solid var(--border, rgba(255,255,255,.16))',
    background: active ? 'var(--text, #e9e7e0)' : 'transparent',
    color: active ? 'var(--bg, #0b0b14)' : 'var(--text-dim, #9aa3b2)',
    borderRadius: 999, padding: '5px 13px', fontSize: 13, fontWeight: active ? 700 : 500,
    whiteSpace: 'nowrap',
  };
}
function score(v: number | null | undefined, lbl: string) {
  if (v == null) return null;
  return (
    <span style={{ fontSize: 11, fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--text-muted, #8a8a98)', border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 5, padding: '1px 6px' }}>
      {lbl} {v}
    </span>
  );
}

export function PatentsView({ data }: { data: Data }) {
  const { meta, patents } = data;
  const [industry, setIndustry] = useState('');
  const [indiaOnly, setIndiaOnly] = useState(false);
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(PAGE);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return patents.filter((p) => {
      if (industry && p.i !== industry) return false;
      if (indiaOnly && p.c !== 'IN') return false;
      if (needle && !(`${p.t} ${p.a} ${p.n}`.toLowerCase().includes(needle))) return false;
      return true;
    });
  }, [patents, industry, indiaOnly, q]);

  const shown = filtered.slice(0, limit);
  const reset = () => setLimit(PAGE);

  return (
    <>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'baseline', marginBottom: 16, color: 'var(--text-muted, #9aa3b2)', fontSize: 13 }}>
        <span><strong style={{ color: 'var(--text, #e9e7e0)', fontSize: 15 }}>{meta.total.toLocaleString('en-IN')}</strong> patents mapped</span>
        <span><strong style={{ color: 'var(--brass, #C9A84C)' }}>{meta.india.toLocaleString('en-IN')}</strong> India-origin filings</span>
        <span>{meta.byIndustry.length} industries</span>
        <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12 }}>updated {meta.updated}</span>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <button style={chip(industry === '')} onClick={() => { setIndustry(''); reset(); }}>All {meta.total}</button>
        {meta.byIndustry.map((f) => (
          <button key={f.i} style={chip(industry === f.i)} onClick={() => { setIndustry(f.i); reset(); }}>
            {label(f.i)} {f.c}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        <input
          placeholder="Search by title, applicant or patent number…" value={q}
          onChange={(e) => { setQ(e.target.value); reset(); }}
          style={{ flex: '1 1 320px', maxWidth: 480, background: 'var(--bg-2, rgba(255,255,255,.03))', color: 'var(--text, #e9e7e0)', border: '1px solid var(--border, rgba(255,255,255,.16))', borderRadius: 8, padding: '9px 12px', fontSize: 14 }}
        />
        <button style={chip(indiaOnly)} onClick={() => { setIndiaOnly((v) => !v); reset(); }}>
          {indiaOnly ? '✓ ' : ''}India only
        </button>
      </div>

      <div className="ed-kicker" style={{ marginBottom: 12 }}>{filtered.length.toLocaleString('en-IN')} results</div>

      {filtered.length === 0 ? (
        <p style={{ color: 'var(--text-dim)' }}>No patents match that filter.</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
            {shown.map((p) => (
              <li key={p.n} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 10, padding: '14px 16px', background: 'var(--bg-2, rgba(255,255,255,.02))' }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--brass, #C9A84C)' }}>{label(p.i)}</span>
                  <span style={{ fontSize: 11, color: p.c === 'IN' ? 'var(--brass, #C9A84C)' : 'var(--text-muted, #8a8a98)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{p.c}</span>
                  {p.d && <span style={{ fontSize: 12, color: 'var(--text-muted, #8a8a98)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{p.d}</span>}
                  {p.s && <span style={{ fontSize: 11, color: 'var(--text-muted, #8a8a98)', textTransform: 'capitalize' }}>· {p.s}</span>}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text, #e9e7e0)', lineHeight: 1.4 }}>{p.t || p.n}</div>
                {p.a && <div style={{ fontSize: 13, color: 'var(--text-dim, #c7c7d2)', marginTop: 2 }}>{p.a}</div>}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8, alignItems: 'center' }}>
                  {score(p.is, 'Industrial')}
                  {score(p.ss, 'Strategic')}
                  {p.tr != null && score(p.tr as number, 'TRL')}
                  {(p.ipc || []).slice(0, 4).map((c) => (
                    <span key={c} style={{ fontSize: 11, fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--link, #6cb0ff)', border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 5, padding: '1px 6px' }}>{c}</span>
                  ))}
                </div>
                <div style={{ marginTop: 8 }}>
                  <a href={`https://patents.google.com/patent/${encodeURIComponent(p.n)}`} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--link, #6cb0ff)' }}>
                    {p.n} — view on Google Patents ↗
                  </a>
                </div>
              </li>
            ))}
          </ul>
          {limit < filtered.length && (
            <div style={{ textAlign: 'center', marginTop: 22 }}>
              <button onClick={() => setLimit((l) => l + PAGE)} style={{ ...chip(false), padding: '9px 20px', fontSize: 14 }}>
                Show more ({(filtered.length - limit).toLocaleString('en-IN')} more)
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
