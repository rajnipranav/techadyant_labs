import type { Metadata } from 'next';
import Link from 'next/link';
import { reports as staticReports, formatPrice } from './data';
import { ReportCover } from '../components/ReportCover';
import ReportsBrowser from './ReportsBrowser';

import { THEMES } from './themes';
import { getReportsMeta } from '../lib/cms';
import { FeedbackForm } from '../components/FeedbackForm';

export const metadata: Metadata = {
  title: "Strategic Intelligence Reports on India's Industrial Systems [2026]",
  description:
    "Free & paid research on India's industrial transformation: semiconductors, AI infrastructure, critical minerals, defence drones, and enterprise software sovereignty. Each report maps dependencies, chokepoints and beneficiaries.",
  openGraph: {
    title: "Strategic Intelligence Reports on India's Industrial Systems [2026]",
    description:
      "Free & paid research on India's industrial transformation: semiconductors, AI infrastructure, critical minerals, defence drones, and enterprise software sovereignty.",
    url: 'https://labs.techadyant.com/reports/',
    type: 'website',
    siteName: 'Techadyant Labs',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Techadyant Labs Strategic Reports' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Strategic Intelligence Reports on India's Industrial Systems [2026]",
    description:
      "Free & paid research on India's industrial transformation: semiconductors, AI infrastructure, critical minerals, defence drones, and enterprise software sovereignty.",
    images: ['/og/default.png'],
  },
};

const WHY = [
  {
    h: 'See it early',
    p: 'Identify emerging industrial opportunities before they become consensus — and before the capital and policy crowd in.',
  },
  {
    h: 'Map the dependencies',
    p: 'Trace the components, suppliers and chokepoints that decide who actually captures value in a sector, not who appears to.',
  },
  {
    h: 'Price the risk',
    p: 'Assess policy, supply-chain and technology exposure across a value chain before the market puts a number on it.',
  },
  {
    h: 'Decide with evidence',
    p: 'Inform investment, sourcing and localisation choices from primary sources — filings, procurement data, government records.',
  },
  {
    h: 'Track sovereignty',
    p: 'Follow India’s path toward technology self-reliance, sector by sector, so you can see where the gaps are closing and where they are not.',
  },
];

export default async function ReportsIndex() {
  let reports: any[] = staticReports;
  try {
    const cms = await getReportsMeta();
    if (cms.length) {
      const cmsSlugs = new Set(cms.map((r) => r.slug));
      reports = [...cms, ...staticReports.filter((r) => !cmsSlugs.has(r.slug))];
    }
  } catch {}

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
            Decision-grade research for the people shaping India’s strategic industries —
            policymakers, defence and manufacturing leaders, investors and technology
            executives. Each report takes a single strategic question and works it through
            the dependencies, constraints and beneficiaries that determine the real outcome.
          </p>
        </div>
      </header>

      <section className="wrap">
        <div className="why-reports">
          <div className="why-head">
            <span className="ed-kicker">Why these reports matter</span>
            <p className="why-lede">
              Most analysis tells you what is happening. These reports tell you what it
              means for a decision you have to make — what to build, fund, source, localise
              or guard against.
            </p>
          </div>
          <div className="why-grid">
            {WHY.map((w) => (
              <div key={w.h} className="why-item">
                <h3>{w.h}</h3>
                <p>{w.p}</p>
              </div>
            ))}
          </div>
          <p className="why-method">
            Every load-bearing claim is traced to a primary source and labelled for
            confidence — the same evidence discipline used inside institutional and
            government research.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 22, fontSize: 13 }}>
          <span style={{ color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: 11 }}>Browse by theme</span>
          {THEMES.filter((t) => t.count > 0).map((t) => (
            <Link key={t.slug} href={`/reports/theme/${t.slug}/`} style={{ color: 'var(--text-dim)', borderBottom: '1px solid transparent' }}>{t.domain}</Link>
          ))}
          <Link href="/reports/series/technology-sovereignty/" style={{ color: 'var(--accent, #C9A84C)', borderBottom: '1px solid transparent' }}>Technology Sovereignty Series →</Link>
          <Link href="/licensing/" style={{ color: 'var(--text-dim)', borderBottom: '1px solid transparent', marginLeft: 'auto' }}>Team &amp; institutional licensing →</Link>
        </div>

        <ReportsBrowser initialData={published} />

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

        <div style={{ margin: '64px auto 8px', maxWidth: 620 }}>
          <div className="ed-kicker" style={{ marginBottom: 12 }}>Didn&rsquo;t find what you were looking for?</div>
          <p style={{ color: 'var(--text-dim)', fontSize: 15, lineHeight: 1.65, margin: '0 0 20px' }}>
            Tell us the report or sector you need. We publish based on what our readers are actually trying to
            decide — every request goes into our research pipeline.
          </p>
          <FeedbackForm source="reports-index" />
        </div>
      </section>
    </>
  );
}
