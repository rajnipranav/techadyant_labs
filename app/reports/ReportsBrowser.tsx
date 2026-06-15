'use client';

import { useState } from 'react';
import Link from 'next/link';
import { reports, formatPrice, type ReportMeta } from './data';
import { ReportCover } from '../components/ReportCover';

const ACCESS = [
  { k: 'all', label: 'All' },
  { k: 'free', label: 'Free' },
  { k: 'paid', label: 'Paid' },
] as const;
type AccessKey = (typeof ACCESS)[number]['k'];

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

function Card({ r }: { r: ReportMeta }) {
  const free = r.access === 'free';
  return (
    <Link href={`/reports/${r.slug}/`} className="report-card">
      <div className="rc-cover-top">
        <ReportCover report={r} variant="card" />
        <span className={`report-card-badge ${free ? 'badge-free' : 'badge-price'}`}>{free ? 'Free' : formatPrice(r)}</span>
      </div>
      <div className="report-card-body">
        <span className="report-card-domain">{r.domain} · {r.publishedLabel}</span>
        <h3>{r.title}</h3>
        <span className="rc-card-sub">{r.subtitle}</span>
        <p className="rc-card-summary">{r.summary}</p>
        <div className="report-card-foot">
          <span className={`report-card-price ${free ? 'is-free' : ''}`}>{free ? 'Free' : formatPrice(r)}</span>
          <span className="report-card-cta">
            {r.previewObject && !free && <span className="rc-preview-pill">Free preview</span>}
            Read report →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ReportsBrowser() {
  const published = reports.filter((r) => r.status === 'published');
  const themes = ['all', ...Array.from(new Set(published.map((r) => r.domain)))];
  const [theme, setTheme] = useState('all');
  const [access, setAccess] = useState<AccessKey>('all');

  const shown = published.filter(
    (r) => (theme === 'all' || r.domain === theme) && (access === 'all' || r.access === access),
  );

  const rowStyle: React.CSSProperties = { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 };
  const labelStyle: React.CSSProperties = { fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-dim,#9aa3b2)', marginRight: 4, minWidth: 52 };

  return (
    <>
      <div className="ed-kicker" style={{ marginBottom: 18 }}>Published · {shown.length} of {published.length}</div>

      <div style={{ marginBottom: 26 }}>
        <div style={rowStyle}>
          <span style={labelStyle}>Access</span>
          {ACCESS.map((a) => (
            <button key={a.k} style={chipStyle(access === a.k)} onClick={() => setAccess(a.k)}>{a.label}</button>
          ))}
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Theme</span>
          {themes.map((t) => (
            <button key={t} style={chipStyle(theme === t)} onClick={() => setTheme(t)}>{t === 'all' ? 'All themes' : t}</button>
          ))}
        </div>
      </div>

      {shown.length ? (
        <div className="report-cards">{shown.map((r) => <Card key={r.slug} r={r} />)}</div>
      ) : (
        <p className="lede" style={{ color: 'var(--text-dim)' }}>No reports match that filter yet.</p>
      )}
    </>
  );
}
