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

function Row({ s }: { s: any }) {
  const inner = (
    <>
      <div className="sr-no">{s.no}</div>
      <div>
        <div className="signal-meta">
          <span className="sig-domain">{s.domain}</span>
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

  const shown = all.filter(
    (s) => (domain === 'all' || s.domain === domain) && (status === 'all' || s.status === status),
  );

  const rowStyle: React.CSSProperties = { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 };
  const labelStyle: React.CSSProperties = { fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-dim,#9aa3b2)', marginRight: 4, minWidth: 52 };

  return (
    <>
      <div className="ed-kicker" style={{ marginBottom: 18 }}>Signals · {shown.length} of {all.length}</div>

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
            <button key={d} style={chipStyle(domain === d)} onClick={() => setDomain(d)}>{d === 'all' ? 'All domains' : d}</button>
          ))}
        </div>
      </div>

      {shown.length ? (
        <div className="rule-top">{shown.map((s) => <Row key={s.slug} s={s} />)}</div>
      ) : (
        <p className="lede" style={{ color: 'var(--text-dim)' }}>No signals match that filter yet.</p>
      )}
    </>
  );
}
