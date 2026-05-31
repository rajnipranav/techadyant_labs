import type { Metadata } from 'next';
import Link from 'next/link';
import { issues } from './data';

export const metadata: Metadata = {
  title: 'Strategic Signals — monthly intelligence',
  description:
    'Strategic Signals is Techadyant Labs’ monthly strategic-intelligence brief on India’s industrial systems — distilled from a live signal engine into the few signals that move the board.',
};

export default function NewsletterPage() {
  const latest = issues[0];
  return (
    <>
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>Strategic Signals</span>
          </div>
          <h1>Strategic Signals</h1>
          <p className="lede">
            Monthly strategic intelligence on India’s industrial systems — semiconductors, AI
            infrastructure, critical minerals and defence. Distilled from a live signal engine
            into the few signals that move the board. Independent, infrequent, free of sponsored coverage.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 22 }}>
            <Link href="/#subscribe" className="btn-ed btn-ed-primary">Subscribe <span className="arr">→</span></Link>
            <Link href={`/newsletter/${latest.slug}`} className="btn-ed btn-ed-ghost">Read the latest issue <span className="arr">→</span></Link>
          </div>
        </div>
      </header>

      {/* Featured issue */}
      <section className="wrap">
        <div className="section-head-ed">
          <div><div className="ed-kicker">Latest issue</div><h2>{latest.no} · {latest.month}</h2></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,1fr)', gap: 36, alignItems: 'center' }} className="nl-feature">
          <Link href={`/newsletter/${latest.slug}`} style={{ display: 'block' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={latest.cover} alt={`Strategic Signals — ${latest.month}`} style={{ width: '100%', borderRadius: 14, border: '1px solid var(--border)', display: 'block' }} />
          </Link>
          <div>
            <div className="r-tag" style={{ marginBottom: 14 }}>◆ {latest.no} · {latest.month} · {latest.readingTime}</div>
            <h3 className="serif" style={{ fontSize: 'clamp(22px,2.6vw,30px)', margin: '0 0 14px', lineHeight: 1.25 }}>{latest.title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.65, fontSize: 16, marginBottom: 22 }}>{latest.standfirst}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href={`/newsletter/${latest.slug}`} className="btn-ed btn-ed-primary">Read online <span className="arr">→</span></Link>
              <a href={latest.pdf} className="btn-ed btn-ed-ghost" download>Download PDF <span className="arr">↓</span></a>
            </div>
          </div>
        </div>
      </section>

      {/* Archive list */}
      <section className="wrap">
        <div className="section-head-ed">
          <div><div className="ed-kicker">Archive</div><h2>All issues</h2></div>
        </div>
        <div className="briefings rule-top">
          {issues.map((i) => (
            <Link key={i.slug} href={`/newsletter/${i.slug}`} className="briefing" style={{ gridTemplateColumns: '150px 1fr auto', alignItems: 'start', padding: '26px 0' }}>
              <span className="briefing-date">{i.month}</span>
              <div>
                <span className="briefing-title">
                  {i.no} — {i.title}
                  <span className="b-tag">Strategic Signals</span>
                </span>
                <p className="serif" style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-muted)', marginTop: 8, maxWidth: '62ch' }}>
                  {i.standfirst}
                </p>
              </div>
              <span className="briefing-read">{i.readingTime}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works / cross-links */}
      <section className="wrap">
        <div className="platform-band">
          <p className="pb-statement">
            Strategic Signals is the editorial layer on top of our live signal engine — the few
            items that name a forming ecosystem, not the daily noise.
          </p>
          <div className="pb-body">
            <p style={{ color: 'var(--text-muted)', fontSize: 14.5, lineHeight: 1.65 }}>
              It pairs with our long-form work. Start with a flagship report —{' '}
              <Link href="/reports">Reports</Link> — track structural change as it surfaces in{' '}
              <Link href="/signals">Signals</Link>, or commission bespoke research and DPRs via{' '}
              <Link href="/services">Services</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap-narrow">
        <div className="report-cta" style={{ padding: 0, marginTop: 8 }}>
          <div className="report-cta-inner">
            <div>
              <h3>Strategic Signals, in your inbox</h3>
              <p>Monthly, independent, and free of sponsored coverage.</p>
            </div>
            <Link href="/#subscribe" className="btn-ed btn-ed-primary">Subscribe <span className="arr">→</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
