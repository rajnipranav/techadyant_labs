'use client';

import { useMemo, useState } from 'react';

type Patent = {
  n: string; t: string; i: string; s: string; d: string; fd: string; a: string; ipc?: string[]; j?: string;
};
type Meta = {
  total: number; updated: string; latestJournal: string; distinctApplicants: number;
  byIndustry: { i: string; c: number }[]; topApplicants: { a: string; n: number }[];
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

export function PatentsView({ data }: { data: Data }) {
  const { meta, patents } = data;
  const [industry, setIndustry] = useState('');
  const [applicant, setApplicant] = useState('');
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(PAGE);
  const reset = () => setLimit(PAGE);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const appn = applicant.toLowerCase();
    return patents.filter((p) => {
      if (industry && p.i !== industry) return false;
      if (appn && !p.a.toLowerCase().includes(appn)) return false;
      if (needle && !(`${p.t} ${p.a} ${p.n} ${(p.ipc || []).join(' ')}`.toLowerCase().includes(needle))) return false;
      return true;
    });
  }, [patents, industry, applicant, q]);

  const shown = filtered.slice(0, limit);

  return (
    <>
      {/* provenance strip */}
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'baseline', marginBottom: 18, color: 'var(--text-muted, #9aa3b2)', fontSize: 13 }}>
        <span><strong style={{ color: 'var(--brass, #C9A84C)', fontSize: 16 }}>{meta.total.toLocaleString('en-IN')}</strong> India filings</span>
        <span><strong style={{ color: 'var(--text, #e9e7e0)' }}>{meta.distinctApplicants.toLocaleString('en-IN')}</strong> applicants</span>
        <span>{meta.byIndustry.length} strategic sectors</span>
        <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12 }}>latest IPO journal {meta.latestJournal}</span>
      </div>

      {/* Top applicants — the differentiator: who is filing */}
      <div style={{ marginBottom: 22 }}>
        <div className="ed-kicker" style={{ marginBottom: 10 }}>Most active applicants</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {meta.topApplicants.map((t) => {
            const active = applicant === t.a;
            return (
              <button key={t.a} onClick={() => { setApplicant(active ? '' : t.a); reset(); }}
                style={{ ...chip(active), display: 'inline-flex', gap: 7, alignItems: 'center', padding: '6px 12px' }}>
                {t.a}
                <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, color: active ? 'var(--bg)' : 'var(--brass, #C9A84C)' }}>{t.n}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* sector filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <button style={chip(industry === '')} onClick={() => { setIndustry(''); reset(); }}>All sectors</button>
        {meta.byIndustry.map((f) => (
          <button key={f.i} style={chip(industry === f.i)} onClick={() => { setIndustry(f.i); reset(); }}>
            {label(f.i)} {f.c}
          </button>
        ))}
      </div>

      <input
        placeholder="Search by title, applicant, IPC class or filing number…" value={q}
        onChange={(e) => { setQ(e.target.value); reset(); }}
        style={{ width: '100%', maxWidth: 520, marginBottom: 16, background: 'var(--bg-2, rgba(255,255,255,.03))', color: 'var(--text, #e9e7e0)', border: '1px solid var(--border, rgba(255,255,255,.16))', borderRadius: 8, padding: '10px 12px', fontSize: 14 }}
      />

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
        <span className="ed-kicker">{filtered.length.toLocaleString('en-IN')} results</span>
        {applicant && (
          <button onClick={() => { setApplicant(''); reset(); }} style={{ ...chip(true), padding: '3px 10px', fontSize: 12 }}>
            {applicant} ✕
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: 'var(--text-dim)' }}>No filings match that filter.</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
            {shown.map((p) => (
              <li key={p.n} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 10, padding: '14px 16px', background: 'var(--bg-2, rgba(255,255,255,.02))' }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--brass, #C9A84C)' }}>{label(p.i)}</span>
                  {p.fd && <span style={{ fontSize: 12, color: 'var(--text-muted, #8a8a98)', fontFamily: 'var(--font-jetbrains, monospace)' }}>filed {p.fd}</span>}
                  {p.j && <span style={{ fontSize: 11, color: 'var(--text-muted, #8a8a98)' }}>· IPO journal {p.j}</span>}
                  {p.s && <span style={{ fontSize: 11, color: 'var(--text-muted, #8a8a98)', textTransform: 'capitalize' }}>· {p.s}</span>}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text, #e9e7e0)', lineHeight: 1.4 }}>{p.t || p.n}</div>
                {p.a && (
                  <button onClick={() => { setApplicant(p.a); reset(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{ background: 'none', border: 'none', padding: 0, marginTop: 3, cursor: 'pointer', fontSize: 13, color: 'var(--link, #6cb0ff)', textAlign: 'left' }}>
                    {p.a} →
                  </button>
                )}
                {(p.ipc && p.ipc.length > 0) && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                    {p.ipc.slice(0, 5).map((c) => (
                      <span key={c} style={{ fontSize: 11, fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--text-muted, #9aa3b2)', border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 5, padding: '1px 6px' }}>{c}</span>
                    ))}
                  </div>
                )}
                <div style={{ marginTop: 8 }}>
                  <a href={`https://patents.google.com/patent/${encodeURIComponent(p.n)}`} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--text-muted, #8a8a98)' }}>
                    {p.n} ↗
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
