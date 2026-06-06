'use client';

import { useMemo, useState } from 'react';

interface Source {
  id: string; corridor: string; title: string; issuing_body: string;
  year: string; doc_type: string; verification: string; mirror_ok: boolean;
  direct_url: string | null; source_url: string | null; mirror_url: string | null;
}
interface Corr { code: string; label: string; accent: string }

export function SourcesView({ sources, corridors, types }: { sources: Source[]; corridors: Corr[]; types: string[] }) {
  const [q, setQ] = useState('');
  const [corr, setCorr] = useState('all');
  const [type, setType] = useState('all');

  const accentFor = (c: string) => corridors.find((x) => x.code === c)?.accent ?? '#888';
  const labelFor = (c: string) => corridors.find((x) => x.code === c)?.label ?? c;

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return sources.filter((s) => {
      if (corr !== 'all' && s.corridor !== corr) return false;
      if (type !== 'all' && s.doc_type !== type) return false;
      if (n && !(s.title.toLowerCase().includes(n) || s.issuing_body.toLowerCase().includes(n))) return false;
      return true;
    });
  }, [sources, q, corr, type]);

  const best = (s: Source) => s.mirror_url || s.direct_url || s.source_url;

  return (
    <div className="src">
      <div className="src-controls">
        <input className="ply-search" placeholder="Search documents…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search documents" />
        <div className="ply-chips" role="group" aria-label="Filter by ecosystem">
          <button className={corr === 'all' ? 'is-active' : ''} onClick={() => setCorr('all')}>All ecosystems</button>
          {corridors.map((c) => (
            <button key={c.code} className={corr === c.code ? 'is-active' : ''} style={{ ['--accent' as string]: c.accent }} onClick={() => setCorr(c.code)}>{c.label}</button>
          ))}
        </div>
        <div className="ply-row2">
          <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by type">
            <option value="all">All document types</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <span className="ply-count">{filtered.length} of {sources.length}</span>
        </div>
      </div>

      <div className="src-list">
        {filtered.map((s) => {
          const link = best(s);
          return (
            <article key={s.id} className="src-card" style={{ ['--accent' as string]: accentFor(s.corridor) }}>
              <div className="src-head">
                <span className="src-type">{s.doc_type}</span>
                <span className="src-year">{s.year}</span>
                {s.verification === 'V' && <span className="src-verif" title="Link verified">✓ verified</span>}
              </div>
              <h3 className="src-title">{link ? <a href={link} target="_blank" rel="noopener">{s.title}</a> : s.title}</h3>
              <div className="src-meta">
                <span className="src-corr" style={{ ['--accent' as string]: accentFor(s.corridor) }}>{labelFor(s.corridor)}</span>
                <span className="src-body">{s.issuing_body}</span>
              </div>
              <div className="src-links">
                {s.mirror_url && <a href={s.mirror_url} className="src-link primary" target="_blank" rel="noopener">Read / download ↓</a>}
                {s.direct_url && <a href={s.direct_url} className="src-link" target="_blank" rel="noopener">Official PDF ↗</a>}
                {s.source_url && <a href={s.source_url} className="src-link" target="_blank" rel="noopener">Source page ↗</a>}
              </div>
            </article>
          );
        })}
        {filtered.length === 0 && <p className="ply-empty">No documents match these filters.</p>}
      </div>
    </div>
  );
}
