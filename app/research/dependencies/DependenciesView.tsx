'use client';

import { useEffect, useState } from 'react';

interface Corr { id: number; code: string; label: string; slug: string; accent: string }
interface Cell {
  corridor_id: number; layer_id: number; layer: string; status: number;
  status_label: string; rationale: string; verification: string; date: string;
}

export function DependenciesView({
  corridors, grid, colors, short,
}: { corridors: Corr[]; grid: Cell[]; colors: string[]; short: string[] }) {
  const [sel, setSel] = useState(corridors[0]?.code ?? '');
  const [compare, setCompare] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const h = decodeURIComponent(window.location.hash.replace('#', ''));
    const match = corridors.find((c) => c.slug === h || c.code === h);
    if (match) setSel(match.code);
  }, [corridors]);

  const cur = corridors.find((c) => c.code === sel) ?? corridors[0];
  const cells = grid.filter((g) => g.corridor_id === cur.id).sort((a, b) => a.layer_id - b.layer_id);

  const sharedLayerIds = [1, 2, 3, 4, 5, 6];
  const industrial = corridors.filter((c) => grid.some((g) => g.corridor_id === c.id && sharedLayerIds.includes(g.layer_id)));
  const sharedLayers = sharedLayerIds
    .map((id) => grid.find((g) => g.layer_id === id))
    .filter((g): g is Cell => Boolean(g));

  return (
    <div className="dep">
      <div className="dep-controls">
        <div className="dep-tabs" role="tablist">
          {corridors.map((c) => (
            <button
              key={c.code}
              role="tab"
              aria-selected={!compare && c.code === sel}
              className={!compare && c.code === sel ? 'is-active' : ''}
              style={{ ['--accent' as string]: c.accent }}
              onClick={() => { setCompare(false); setSel(c.code); setOpen(null); }}
            >
              {c.label}
            </button>
          ))}
        </div>
        <button className={`dep-compare ${compare ? 'is-active' : ''}`} onClick={() => setCompare((v) => !v)}>
          {compare ? '← Single ecosystem' : 'Compare ⊞'}
        </button>
      </div>

      <div className="dep-legend">
        {short.map((s, i) => (
          <span key={s}><i style={{ background: colors[i] }} />{i} {s}</span>
        ))}
      </div>

      {!compare ? (
        <div className="dep-grid" style={{ ['--accent' as string]: cur.accent }}>
          {cells.map((c) => {
            const id = `${c.corridor_id}-${c.layer_id}`;
            const isOpen = open === id;
            return (
              <div key={id} className={`dep-row ${isOpen ? 'is-open' : ''}`}>
                <button className="dep-row-head" onClick={() => setOpen(isOpen ? null : id)} aria-expanded={isOpen}>
                  <span className="dep-band" style={{ background: colors[c.status] }} />
                  <span className="dep-layer">{c.layer}</span>
                  <span className="dep-status" style={{ color: colors[c.status] }}>{c.status} · {c.status_label}</span>
                  <span className="dep-caret">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="dep-rationale">
                    <p>{c.rationale}</p>
                    <div className="dep-foot">
                      <span className={`vtag v-${c.verification}`}>{c.verification.replace('_', ' ')}</span>
                      <span>Assessed {c.date}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="dep-compare-wrap">
          <table className="dep-matrix">
            <thead>
              <tr>
                <th>Value-chain layer</th>
                {industrial.map((c) => <th key={c.code} style={{ color: c.accent }}>{c.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {sharedLayers.map((l) => (
                <tr key={l.layer_id}>
                  <td className="dep-matrix-layer">{l.layer}</td>
                  {industrial.map((c) => {
                    const cell = grid.find((g) => g.corridor_id === c.id && g.layer_id === l.layer_id);
                    return (
                      <td key={c.code} className="dep-matrix-cell">
                        {cell ? (
                          <span className="dep-chip" style={{ background: colors[cell.status] }} title={cell.status_label}>
                            {cell.status}
                          </span>
                        ) : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="dep-note">
            Comparison shows the four industrial ecosystems, which share a six-layer value chain.
            Enterprise Software runs on its own eleven-layer software stack &mdash; view it on its own tab.
          </p>
        </div>
      )}
    </div>
  );
}
