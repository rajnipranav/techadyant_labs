'use client';

import { useState } from 'react';
import Link from 'next/link';

const STATUS = [
  { k: 'all', label: 'All' },
  { k: 'live', label: 'Live' },
  { k: 'monitoring', label: 'Monitoring' },
] as const;
type StatusKey = (typeof STATUS)[number]['k'];

function chipStyle(active: boolean): React.CSSProperties {
  return {
    appearance: 'none',
    cursor: 'pointer',
    border: '1px solid var(--border, rgba(255,255,255,.16))',
    background: active ? 'var(--text, #e9e7e0)' : 'transparent',
    color: active ? 'var(--bg, #0b0b14)' : 'var(--text-dim, #9aa3b2)',
    borderRadius: 999,
    padding: '5px 13px',
    fontSize: 13,
    fontWeight: active ? 700 : 500,
    transition: 'all .12s',
  };
}

const PALETTE = ['#818CF8', '#38E1C4', '#F5B544', '#FB923C', '#34D399', '#E26B5B', '#6CB0FF', '#A78BFA', '#C77D4A', '#2BC5B4'];
const colorFor = (domains: string[], d: string) => PALETTE[Math.max(0, domains.indexOf(d)) % PALETTE.length];

/** Signals per week over the 12 weeks ending at the newest signal in view. */
function weekly(items: any[]) {
  const ts = items.map((s) => Date.parse(s.date)).filter((t) => !Number.isNaN(t));
  if (!ts.length) return { bars: [] as number[], end: '' };
  const end = Math.max(...ts); const W = 7 * 86_400_000;
  const bars = Array.from({ length: 12 }, () => 0);
  for (const t of ts) { const i = Math.floor((end - t) / W); if (i < 12) bars[11 - i] += 1; }
  return { bars, end: new Date(end).toISOString().slice(0, 10) };
}

function Row({ s, color, card }: { s: any; color: string; card?: boolean }) {
  const inner = (
    <>
      <div className="sr-no">{s.no}</div>
      <div>
        <div className="signal-meta">
          <span className="sig-domain"><i className="sig-dot" style={{ background: color }} />{s.domain}</span>
          {s.status === 'live' && <span className="sig-status"><span className="dot" /> Live</span>}
          {s.status === 'monitoring' && <span style={{ color: 'var(--text-muted)' }}>Monitoring</span>}
          {s.status === 'placeholder' && <span style={{ color: 'var(--text-dim)' }}>Draft · placeholder</span>}
          <span className="sig-date">
            {s.dateLabel ?? s.date_label}
            {(((s.readingTime ?? s.reading_time) || '') as string).trim() ? ` · ${s.readingTime ?? s.reading_time}` : ''}
          </span>
        </div>
        <div
          className="signal-title"
          style={s.status === 'placeholder' ? { fontStyle: 'italic', color: 'var(--text-dim)' } : undefined}
        >
          {s.title}
        </div>
        <p className="signal-excerpt">{s.excerpt}</p>
      </div>
    </>
  );
  if (card) {
    const body = (
      <>
        <div className="signal-meta"><span className="sig-no">{s.no}</span><span className="sig-date">{s.dateLabel ?? s.date_label}</span></div>
        <div className="signal-meta"><span className="sig-domain"><i className="sig-dot" style={{ background: color }} />{s.domain}</span>
          {s.status === 'live' && <span className="sig-status"><span className="dot" /> Live</span>}</div>
        <div className="signal-title">{s.title}</div>
        <p className="signal-excerpt">{s.excerpt}</p>
      </>
    );
    return s.status === 'placeholder'
      ? <div className="sig-card" style={{ ['--sig-c' as string]: color, opacity: 0.62 }}>{body}</div>
      : <Link href={`/signals/${s.slug}/`} className="sig-card" style={{ ['--sig-c' as string]: color }}>{body}</Link>;
  }
  return s.status === 'placeholder' ? (
    <div className="signal-row" style={{ opacity: 0.62 }}>{inner}</div>
  ) : (
    <Link href={`/signals/${s.slug}/`} className="signal-row">{inner}</Link>
  );
}

export default function SignalsBrowser({ initialData }: { initialData?: any[] }) {
  const all = initialData || [];
  const domains = ['all', ...Array.from(new Set(all.map((s) => s.domain)))];
  const [domain, setDomain] = useState('all');
  const [status, setStatus] = useState<StatusKey>('all');
  const [view, setView] = useState<'list' | 'cards'>('cards');

  const shown = all.filter(
    (s) => (domain === 'all' || s.domain === domain) && (status === 'all' || s.status === status),
  );

  const spark = weekly(shown);
  const rowStyle: React.CSSProperties = { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 };
  const labelStyle: React.CSSProperties = { fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-dim,#9aa3b2)', marginRight: 4, minWidth: 52 };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
        <div className="ed-kicker" style={{ margin: 0 }}>Signals · {shown.length} of {all.length}</div>
        <div className="sig-view" role="group" aria-label="View">
          <button type="button" aria-pressed={view === 'cards'} onClick={() => setView('cards')}>Cards</button>
          <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>List</button>
        </div>
      </div>
      {spark.bars.length > 0 && (
        <>
          <div className="sig-spark" role="img" aria-label={`Signals per week, last 12 weeks: ${spark.bars.join(', ')}`}>
            {spark.bars.map((b, i) => <i key={i} style={{ height: `${Math.max(6, (b / Math.max(1, ...spark.bars)) * 100)}%` }} title={`${b} signals`} />)}
          </div>
          <div className="sig-spark-cap">Signals per week in this view, 12 weeks to {spark.end}</div>
        </>
      )}

      <div style={{ marginBottom: 22 }}>
        <div style={rowStyle}>
          <span style={labelStyle}>Status</span>
          {STATUS.map((a) => (
            <button key={a.k} style={chipStyle(status === a.k)} onClick={() => setStatus(a.k)}>{a.label}</button>
          ))}
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Domain</span>
          {domains.map((d) => (
            <button key={d} style={chipStyle(domain === d)} onClick={() => setDomain(d)}>{d !== 'all' && <i className="sig-dot" style={{ background: colorFor(domains, d) }} />}{d === 'all' ? 'All domains' : d}</button>
          ))}
        </div>
      </div>

      {shown.length ? (
        view === 'cards'
          ? <div className="sig-cards">{shown.map((s) => <Row key={s.slug} s={s} color={colorFor(domains, s.domain)} card />)}</div>
          : <div className="rule-top">{shown.map((s) => <Row key={s.slug} s={s} color={colorFor(domains, s.domain)} />)}</div>
      ) : (
        <p className="lede" style={{ color: 'var(--text-dim)' }}>No signals match that filter yet.</p>
      )}
    </>
  );
}
