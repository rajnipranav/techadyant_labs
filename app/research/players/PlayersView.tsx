'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

interface Player {
  id: string; name: string; type_code: string; type: string;
  country: string; description: string; corridors: string[] | null; slug: string;
}
interface Corr { code: string; label: string; accent: string }

export function PlayersView({ players, corridors }: { players: Player[]; corridors: Corr[] }) {
  const [q, setQ] = useState('');
  const [corr, setCorr] = useState('all');
  const [type, setType] = useState('all');
  const [origin, setOrigin] = useState<'all' | 'domestic' | 'foreign'>('all');

  const accentFor = (code: string) => corridors.find((c) => c.code === code)?.accent ?? '#888';
  const types = useMemo(
    () => Array.from(new Set(players.map((p) => p.type))).sort(),
    [players],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return players.filter((p) => {
      if (corr !== 'all' && !(p.corridors ?? []).includes(corr)) return false;
      if (type !== 'all' && p.type !== type) return false;
      if (origin === 'domestic' && p.country !== 'IN') return false;
      if (origin === 'foreign' && p.country === 'IN') return false;
      if (needle && !(p.name.toLowerCase().includes(needle) || p.description.toLowerCase().includes(needle))) return false;
      return true;
    });
  }, [players, q, corr, type, origin]);

  return (
    <div className="ply">
      <div className="ply-controls">
        <input
          className="ply-search"
          placeholder="Search players…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search players"
        />
        <div className="ply-chips" role="group" aria-label="Filter by ecosystem">
          <button className={corr === 'all' ? 'is-active' : ''} onClick={() => setCorr('all')}>All ecosystems</button>
          {corridors.map((c) => (
            <button
              key={c.code}
              className={corr === c.code ? 'is-active' : ''}
              style={{ ['--accent' as string]: c.accent }}
              onClick={() => setCorr(c.code)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="ply-row2">
          <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by type">
            <option value="all">All types</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="ply-origin" role="group" aria-label="Filter by origin">
            {(['all', 'domestic', 'foreign'] as const).map((o) => (
              <button key={o} className={origin === o ? 'is-active' : ''} onClick={() => setOrigin(o)}>
                {o === 'all' ? 'All' : o === 'domestic' ? 'Indian' : 'Foreign'}
              </button>
            ))}
          </div>
          <span className="ply-count">{filtered.length} of {players.length}</span>
        </div>
      </div>

      <div className="ply-grid">
        {filtered.map((p) => (
          <Link key={p.id} href={`/research/players/${p.slug}`} className="ply-card">
            <header>
              <h3>{p.name}</h3>
              <span className={`ply-flag ${p.country === 'IN' ? 'dom' : 'frn'}`}>{p.country}</span>
            </header>
            <div className="ply-type">{p.type}</div>
            {p.description && <p className="ply-desc">{p.description}</p>}
            <div className="ply-corr">
              {(p.corridors ?? []).map((code) => (
                <span key={code} style={{ ['--accent' as string]: accentFor(code) }}>
                  {corridors.find((c) => c.code === code)?.label ?? code}
                </span>
              ))}
            </div>
          </Link>
        ))}
        {filtered.length === 0 && <p className="ply-empty">No players match these filters.</p>}
      </div>
    </div>
  );
}
