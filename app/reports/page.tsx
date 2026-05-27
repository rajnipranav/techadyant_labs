import type { Metadata } from 'next';
import Link from 'next/link';
import { reports } from './data';

export const metadata: Metadata = {
  title: 'Reports',
  description:
    'Long-form strategic research on India’s industrial systems — semiconductors, infrastructure and strategic technology.',
};

export default function ReportsIndex() {
  const published = reports.filter((r) => r.status === 'published');
  const forthcoming = reports.filter((r) => r.status === 'forthcoming');

  return (
    <>
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>Reports</span>
          </div>
          <h1>Long-form strategic research</h1>
          <p className="lede">
            Flagship analysis of India’s industrial systems. Each report takes a single
            strategic question and works it through the dependencies, constraints and
            beneficiaries that determine the real outcome.
          </p>
        </div>
      </header>

      <section className="wrap">
        <div className="ed-kicker" style={{ marginBottom: 28 }}>Published</div>
        {published.map((r) => (
          <Link key={r.slug} href={`/reports/${r.slug}`} className="briefing" style={{ gridTemplateColumns: '1fr', gap: 12, alignItems: 'start', padding: '28px 0' }}>
            <div className="featured-edition" style={{ marginBottom: 4 }}>
              <span>{r.domain}</span><span className="sep">·</span><span>{r.edition}</span>
              <span className="sep">·</span><span>{r.readingTime}</span>
              <span className="sep">·</span><span>{r.publishedLabel}</span>
            </div>
            <div style={{ fontSize: 'clamp(22px,2.4vw,30px)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              {r.title}
            </div>
            <div className="serif" style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--brass-cream)' }}>{r.subtitle}</div>
            <p className="serif" style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-muted)', maxWidth: '66ch' }}>{r.summary}</p>
            <span className="see-all" style={{ marginTop: 4 }}>Read report →</span>
          </Link>
        ))}

        <div className="ed-kicker" style={{ margin: '52px 0 28px' }}>Forthcoming</div>
        <div className="briefings">
          {forthcoming.map((r) => (
            <div key={r.slug} className="briefing" style={{ opacity: 0.7 }}>
              <span className="briefing-date">{r.domain}</span>
              <span className="briefing-title">
                {r.title}
                <span className="b-tag" style={{ color: 'var(--text-dim)', borderColor: 'var(--rule-strong)' }}>Forthcoming</span>
              </span>
              <span className="briefing-read">{r.readingTime}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
