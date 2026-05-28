import type { Metadata } from 'next';
import Link from 'next/link';
import { reports, formatPrice } from './data';
import { ReportCover } from '../components/ReportCover';

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
        <div className="report-cards">
          {published.map((r) => {
            const free = r.access === 'free';
            return (
              <Link key={r.slug} href={`/reports/${r.slug}`} className="report-card">
                <div className="rc-cover-top">
                  <ReportCover report={r} variant="card" />
                  <span className={`report-card-badge ${free ? 'badge-free' : 'badge-price'}`}>
                    {free ? 'Free' : formatPrice(r)}
                  </span>
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
          })}
        </div>

        <div className="ed-kicker" style={{ margin: '56px 0 28px' }}>Forthcoming</div>
        <div className="report-cards">
          {forthcoming.map((r) => (
            <div key={r.slug} className="report-card is-forthcoming">
              <div className="rc-cover-top">
                <ReportCover report={r} variant="card" />
                <span className="report-card-badge badge-soon">Forthcoming</span>
              </div>
              <div className="report-card-body">
                <span className="report-card-domain">{r.domain}</span>
                <h3>{r.title}</h3>
                <span className="rc-card-sub">{r.subtitle}</span>
                <p className="rc-card-summary">{r.summary}</p>
                <div className="report-card-foot">
                  <span className="report-card-price">{formatPrice(r)}</span>
                  <span className="report-card-cta" style={{ color: 'var(--text-dim)' }}>{r.readingTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
