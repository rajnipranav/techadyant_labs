import Link from 'next/link';
import type { ReactNode } from 'react';

/** Horizontal stacked bar with an inline legend. Segments with value 0 are dropped from the bar, kept in the legend. */
export function StackedBar({ segments, label }: { segments: { label: string; value: number; color: string }[]; label: string }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  return (
    <figure className="viz-stack" aria-label={label}>
      <div className="viz-stack-bar" role="img" aria-label={segments.map((s) => `${s.label} ${s.value}`).join(', ')}>
        {segments.filter((s) => s.value > 0).map((s) => (
          <i key={s.label} style={{ width: `${(s.value / (total || 1)) * 100}%`, background: s.color }} title={`${s.label}: ${s.value}`} />
        ))}
      </div>
      <figcaption className="viz-stack-legend">
        {segments.map((s) => (
          <span key={s.label}><i style={{ background: s.color }} />{s.label} <b>{s.value}</b></span>
        ))}
      </figcaption>
    </figure>
  );
}

export interface PulseItem { label: string; value: string; delta?: number; deltaLabel?: string; note: string; href: string }

/** KPI strip: value, optional signed delta, one-line insight, links through. Numbers are build-time derived. */
export function PulseStrip({ items, asOf, title }: { items: PulseItem[]; asOf: string; title: string }) {
  return (
    <section className="wrap viz-pulse-wrap" aria-label={title}>
      <div className="viz-pulse-head">
        <span className="viz-eyebrow">{title}</span>
        {asOf && <span className="viz-asof">Data as of {asOf}</span>}
      </div>
      <div className="viz-pulse">
        {items.map((it) => (
          <Link key={it.label} href={it.href} className="viz-kpi">
            <span className="viz-kpi-l">{it.label}</span>
            <span className="viz-kpi-v">
              {it.value}
              {typeof it.delta === 'number' && it.delta !== 0 && (
                <small className={it.delta > 0 ? 'up' : 'down'} title={it.deltaLabel}>
                  {it.delta > 0 ? '▲' : '▼'} {Math.abs(it.delta)}
                </small>
              )}
            </span>
            <span className="viz-kpi-n">{it.note}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Horizontal bars for a short ranked list (label · bar · value). */
export function BarList({ rows, max, color = 'var(--primary-bright)', label }: { rows: { label: string; value: number }[]; max?: number; color?: string; label: string }) {
  const top = max ?? Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="viz-bars" aria-label={label}>
      {rows.map((r) => (
        <li key={r.label}>
          <span className="viz-bars-l">{r.label}</span>
          <span className="viz-bars-t"><i style={{ width: `${(r.value / top) * 100}%`, background: color }} /></span>
          <span className="viz-bars-v">{r.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function VizPanel({ kicker, title, children, note }: { kicker: string; title: string; children: ReactNode; note?: string }) {
  return (
    <div className="viz-panel">
      <div className="viz-panel-head"><span className="viz-eyebrow">{kicker}</span><h3>{title}</h3></div>
      {children}
      {note && <p className="viz-note">{note}</p>}
    </div>
  );
}
