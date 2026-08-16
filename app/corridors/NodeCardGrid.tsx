// Client-side stage filter for corridor anchor-node cards.
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { STAGE } from './node-data';

export interface CardNode {
  slug: string;
  name: string;
  state: string;
  stage: 'operational' | 'construction' | 'approved' | 'planned';
  areaAc?: number | null;
  investmentCr?: number | null;
  summary0?: string;
}

const ORDER: CardNode['stage'][] = ['operational', 'construction', 'approved', 'planned'];

export default function NodeCardGrid({ nodes, corridor }: { nodes: CardNode[]; corridor: string }) {
  const [filter, setFilter] = useState<'all' | CardNode['stage']>('all');
  const counts = (s: 'all' | CardNode['stage']) =>
    s === 'all' ? nodes.length : nodes.filter((n) => n.stage === s).length;
  const shown = filter === 'all' ? nodes : nodes.filter((n) => n.stage === filter);

  return (
    <>
      <div className="ncf-chips" role="group" aria-label="Filter nodes by development stage">
        {(['all', ...ORDER] as const).map((s) => (
          <button
            key={s}
            type="button"
            className={`ncf-chip${filter === s ? ' on' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? 'All' : STAGE[s].label}
            <span className="cnt">{counts(s)}</span>
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="ncf-empty">No nodes in this stage yet on this corridor.</p>
      ) : (
        <div className="node-cards">
          {shown.map((n) => (
            <Link
              key={n.slug}
              href={`/corridors/${corridor}/${n.slug}/`}
              className="node-card node-card-link"
              style={{ ['--accent' as string]: STAGE[n.stage].color }}
            >
              <div className="ncl-top">
                <h3>{n.name}</h3>
                <span className="node-stage sm" style={{ color: STAGE[n.stage].color, borderColor: STAGE[n.stage].color }}>
                  {STAGE[n.stage].label}
                </span>
              </div>
              <div className="st">
                {n.state}
                {n.areaAc ? ` · ${n.areaAc.toLocaleString('en-IN')} ac` : ''}
                {n.investmentCr ? ` · ₹${n.investmentCr.toLocaleString('en-IN')} cr` : ''}
              </div>
              {n.summary0 ? <p>{n.summary0}</p> : null}
              <span className="ncl-go">View node →</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
