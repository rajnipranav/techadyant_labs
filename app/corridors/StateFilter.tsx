// Client-side state filter for the corridors quick list.
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CLASS_COLOR, CLASS_LABEL, type Corridor } from './data';

export default function StateFilter({ corridors, shortName }: { corridors: Corridor[]; shortName: (n: string) => string }) {
  const [state, setState] = useState<string | null>(null);

  const stateIndex = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const c of corridors) {
      for (const s of c.states.split(',').map((x) => x.trim()).filter(Boolean)) {
        if (!m.has(s)) m.set(s, []);
        m.get(s)!.push(c.slug);
      }
    }
    return [...m.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  }, [corridors]);

  const shown = state ? corridors.filter((c) => c.states.split(',').map((x) => x.trim()).includes(state)) : corridors;

  return (
    <>
      <div className="cidx-states" role="group" aria-label="Filter corridors by state">
        <button type="button" className={`cidx-state-chip${state === null ? ' on' : ''}`} onClick={() => setState(null)}>All states</button>
        {stateIndex.map(([s, slugs]) => (
          <button
            key={s}
            type="button"
            className={`cidx-state-chip${state === s ? ' on' : ''}`}
            onClick={() => setState(state === s ? null : s)}
          >
            {s} <span className="cnt">{slugs.length}</span>
          </button>
        ))}
      </div>
      <ul className="cidx-list">
        {shown.map((c) => (
          <li key={c.slug}>
            <Link href={`/corridors/${c.slug}/`}>
              <span className="n">{c.num}</span>
              <span className="sw" style={{ background: CLASS_COLOR[c.cls] }} />
              <span>{shortName(c.name)}</span>
            </Link>
          </li>
        ))}
      </ul>
      {state && (
        <p className="cidx-state-note">
          Showing corridors covering <b>{state}</b> ·{' '}
          <button type="button" className="cidx-state-clear" onClick={() => setState(null)}>Clear filter</button>
        </p>
      )}
    </>
  );
}
