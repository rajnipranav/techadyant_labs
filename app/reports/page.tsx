import type { Metadata } from 'next';
import Link from 'next/link';
import { reports, formatPrice } from './data';
import { ReportCover } from '../components/ReportCover';
import ReportsBrowser from './ReportsBrowser';
import { THEMES } from './themes';

export const metadata: Metadata = {
  title: 'Reports',
  description:
    'Long-form strategic research on India’s industrial systems — semiconductors, infrastructure and strategic technology.',
};

export default function ReportsIndex() {
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
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 22, fontSize: 13 }}>
          <span style={{ color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: 11 }}>Browse by theme</span>
          {THEMES.filter((t) => t.count > 0).map((t) => (
            <Link key={t.slug} href={`/reports/theme/${t.slug}`} style={{ color: 'var(--text-dim)', borderBottom: '1px solid transparent' }}>{t.domain}</Link>
          ))}
          <Link href="/reports/series/technology-sovereignty" style={{ color: 'var(--accent, #C9A84C)', borderBottom: '1px solid transparent' }}>Technology Sovereignty Series →</Link>
        </div>

        <ReportsBrowser />

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
                  <span className="report-card-cta