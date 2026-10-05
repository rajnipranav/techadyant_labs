'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

export interface CompareNode {
  key: string; corridor: string; corridorName: string; slug: string; name: string; state: string;
  stage: string; stageLabel: string; stageColor: string;
  areaAc?: number; investmentCr?: number; jobs?: number;
  sectors: string; anchors?: string; developer?: string; lead: string;
}

const MAX = 4;
const num = (v?: number, pre = '', post = '') => (v == null ? '—' : `${pre}${Math.round(v).toLocaleString('en-IN')}${post}`);

/** Pick 2–4 nodes and read them side by side. Figures are shown only where the node dossier states them. */
export default function NodeCompare({ nodes }: { nodes: CompareNode[] }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [q, setQ] = useState('');
  const byKey = useMemo(() => new Map(nodes.map((n) => [n.key, n])), [nodes]);
  const options = useMemo(() => {
    const t = q.trim().toLowerCase();
    return nodes.filter((n) => !picked.includes(n.key) && (!t || `${n.name} ${n.state} ${n.corridorName}`.toLowerCase().includes(t))).slice(0, 8);
  }, [nodes, picked, q]);
  const sel = picked.map((k) => byKey.get(k)!).filter(Boolean);

  const rows: [string, (n: CompareNode) => string][] = [
    ['Corridor', (n) => n.corridorName],
    ['State', (n) => n.state],
    ['Area', (n) => num(n.areaAc, '', ' ac')],
    ['Investment (stated)', (n) => num(n.investmentCr, '₹', ' cr')],
    ['Jobs (stated)', (n) => num(n.jobs)],
    ['Sectors', (n) => n.sectors || '—'],
    ['Anchor tenants', (n) => n.anchors || 'None recorded'],
    ['Developer', (n) => n.developer || '—'],
  ];

  return (
    <div className="cmpn">
      <div className="cmpn-pick">
        <label className="cmpn-search">
          <span className="viz-eyebrow">Add a node ({sel.length}/{MAX})</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search node, state or corridor…" disabled={sel.length >= MAX} />
        </label>
        {sel.length < MAX && (
          <div className="cmpn-opts" role="listbox" aria-label="Nodes to add">
            {options.map((n) => (
              <button key={n.key} type="button" role="option" aria-selected="false" onClick={() => { setPicked([...picked, n.key]); setQ(''); }}>
                <i style={{ background: n.stageColor }} />{n.name}<small>{n.state}</small>
              </button>
            ))}
            {!options.length && <span className="cmpn-empty">No matching node.</span>}
          </div>
        )}
      </div>

      {sel.length === 0 && <p className="viz-note">Choose two to four nodes to compare status, scale and tenants side by side.</p>}
      {sel.length === 1 && <p className="viz-note">Add at least one more node to compare.</p>}

      {sel.length > 0 && (
        <div className="cmpn-scroll">
          <table className="cmpn-table">
            <thead>
              <tr>
                <th scope="col"><span className="viz-eyebrow">Node</span></th>
                {sel.map((n) => (
                  <th key={n.key} scope="col">
                    <Link href={`/corridors/${n.corridor}/${n.slug}/`}>{n.name}</Link>
                    <span className="cmpn-stage" style={{ borderColor: n.stageColor, color: n.stageColor }}>{n.stageLabel}</span>
                    <button type="button" className="cmpn-x" aria-label={`Remove ${n.name}`} onClick={() => setPicked(picked.filter((k) => k !== n.key))}>×</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, f]) => (
                <tr key={label}><th scope="row">{label}</th>{sel.map((n) => <td key={n.key}>{f(n)}</td>)}</tr>
              ))}
              <tr><th scope="row">Read</th>{sel.map((n) => <td key={n.key} className="cmpn-lead">{n.lead}</td>)}</tr>
            </tbody>
          </table>
        </div>
      )}
      {sel.length > 0 && <button type="button" className="cmpn-clear" onClick={() => setPicked([])}>Clear comparison</button>}
    </div>
  );
}
