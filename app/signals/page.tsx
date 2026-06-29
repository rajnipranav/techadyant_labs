import type { Metadata } from 'next';
import Link from 'next/link';
import { signals as staticSignals } from './data';
import { getSignals } from '../lib/cms';

export const metadata: Metadata = {
  title: 'Signals',
  description:
    'Concise strategic intelligence dispatches on India’s industrial systems — observations and analytical notes, not opinion or news aggregation.',
};

export default async function SignalsIndex() {
  let signals: any[] = staticSignals;
  try {
    const cms = await getSignals(); if (cms.length) signals = cms as any[];
    if (cms.length) signals = cms;
  } catch {}
  return (
    <>
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>Signals</span>
          </div>
          <h1>Intelligence signals</h1>
          <p className="lede">
            Compact, information-dense dispatches — strategic observations and analytical
            notes on the systems we track. Signals are not opinion, blogging or news
            aggregation; they are early reads on structural change.
          </p>
        </div>
      </header>

      <section className="wrap">
        <div className="rule-top">
          {signals.map((s) => {
            const inner = (
              <>
                <div className="sr-no">{s.no}</div>
                <div>
                  <div className="signal-meta">
                    <span className="sig-domain">{s.domain}</span>
                    {s.status === 'live' && <span className="sig-status"><span className="dot" /> Live</span>}
                    {s.status === 'monitoring' && <span style={{ color: 'var(--text-muted)' }}>Monitoring</span>}
                    {s.status === 'placeholder' && <span style={{ color: 'var(--text-dim)' }}>Draft · placeholder</span>}
                    <span className="sig-date">{s.dateLabel ?? s.date_label}{(((s.readingTime ?? s.reading_time) || '') as string).trim() ? ` · ${s.readingTime ?? s.reading_time}` : ''}</span>
                  </div>
                  <div className="signal-title" style={s.status === 'placeholder' ? { fontStyle: 'italic', color: 'var(--text-dim)' } : undefined}>
                    {s.title}
                  </div>
                  <p className="signal-excerpt">{s.excerpt}</p>
                </div>
              </>
            );
            return s.status === 'placeholder' ? (
              <div key={s.slug} className="signal-row" style={{ opacity: 0.62 }}>{inner}</div>
            ) : (
              <Link key={s.slug} href={`/signals/${s.slug}/`} className="signal-row">{inner}</Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
