import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroCanvas } from '../components/HeroCanvas';

export const metadata: Metadata = {
  title: 'Methodology & Expertise',
  description:
    'How Techadyant Labs maps systems — primary intelligence, quantitative modelling and value-chain dependency mapping, with a strict independence policy and verification-labelled claims.',
  alternates: { canonical: 'https://labs.techadyant.com/methodology/' },
};

const STACK = [
  {
    n: '01',
    k: 'Primary Intelligence',
    v: 'Field audits, procurement-signal reconstruction, and expert interviews. We rebuild what is being bought, built and deployed from the primary record — tenders, filings, customs lines, parliamentary answers and on-the-ground checks — rather than from secondary reporting.',
    points: ['Field audits & site verification', 'Procurement-signal reconstruction', 'Practitioner & expert interviews'],
  },
  {
    n: '02',
    k: 'Quantitative Modeling',
    v: 'Proprietary TAM / SAM / SOM models and procurement-wave forecasting. Every market figure is built bottom-up and stress-tested across scenarios, so a number can be traced to its assumptions rather than asserted.',
    points: ['Bottom-up TAM / SAM / SOM', 'Procurement-wave forecasting', 'Multi-scenario sensitivity testing'],
  },
  {
    n: '03',
    k: 'Systems Mapping',
    v: 'Identifying dependencies across the industrial value chain — power, water, silicon and talent. We treat an industry as an interdependent system and locate the hidden constraints and second-order effects that decide who actually captures value.',
    points: ['Value-chain dependency mapping', 'Chokepoint & constraint analysis', 'Second-order effect tracing'],
  },
];

const LABELS = [
  { k: '[V]', v: 'Verified against two or more independent primary sources.' },
  { k: '[V1]', v: 'Single authoritative primary source.' },
  { k: '[U]', v: 'Unverified — flagged explicitly, never presented as fact.' },
  { k: '[modelled]', v: 'Our estimate, with the model and assumptions disclosed.' },
];

const card: React.CSSProperties = {
  border: '1px solid var(--border, rgba(255,255,255,.12))',
  borderRadius: 12,
  padding: '24px 22px',
  background: 'var(--bg-2, rgba(255,255,255,.02))',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

export default function MethodologyPage() {
  return (
    <>
      <header className="ed-page-head">
        <HeroCanvas />
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>Methodology</span>
          </div>
          <h1>How We Map Systems.</h1>
          <p className="lede">
            Our research begins where the press release ends. We use systems-level analysis
            to identify hidden constraints and second-order effects — the structure beneath
            the announcement.
          </p>
        </div>
      </header>

      {/* The Techadyant Stack */}
      <section className="wrap">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)' }}>The Techadyant Stack</div>
            <h2>Three layers of evidence</h2>
          </div>
          <p className="section-note" style={{ maxWidth: '62ch' }}>
            Every report is built on the same disciplined stack — primary intelligence at the
            base, quantitative models in the middle, and systems mapping on top.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
          {STACK.map((s) => (
            <div key={s.k} style={card}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: 19 }}>{s.k}</h3>
                <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 13, color: 'var(--brass, #C9A84C)' }}>{s.n}</span>
              </div>
              <p style={{ margin: 0, color: 'var(--text-muted, #9aa3b2)', fontSize: 14.5, lineHeight: 1.6 }}>{s.v}</p>
              <ul style={{ listStyle: 'none', margin: '4px 0 0', padding: 0, display: 'grid', gap: 7 }}>
                {s.points.map((p) => (
                  <li key={p} style={{ fontSize: 13, color: 'var(--text-dim, #c7c7d2)', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--brass, #C9A84C)' }}>—</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Verification labels */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)' }}>Verification discipline</div>
            <h2>Every claim is labelled</h2>
          </div>
          <p className="section-note" style={{ maxWidth: '62ch' }}>
            We do not blur the line between fact and estimate. Each load-bearing claim carries
            a label, so a reader can weigh the evidence themselves.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {LABELS.map((l) => (
            <div key={l.k} style={{ ...card, gap: 8, padding: '18px 18px' }}>
              <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 15, color: 'var(--brass, #C9A84C)' }}>{l.k}</span>
              <p style={{ margin: 0, color: 'var(--text-muted, #9aa3b2)', fontSize: 13.5, lineHeight: 1.55 }}>{l.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Independence Clause */}
      <section className="wrap-narrow" id="independence">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)' }}>The Independence Clause</div>
            <h2>Who we answer to</h2>
          </div>
        </div>
        <blockquote
          style={{
            margin: 0,
            borderLeft: '3px solid var(--brass, #C9A84C)',
            padding: '8px 0 8px 24px',
            fontSize: 21,
            lineHeight: 1.5,
            fontWeight: 600,
            color: 'var(--text, #e9e7e0)',
          }}
        >
          Techadyant Labs carries <strong>no sponsored coverage</strong> and holds{' '}
          <strong>no undisclosed interests</strong>. We take no position in the companies,
          schemes or projects we analyse, and accept no payment to shape a finding. The
          publication answers to its readers — not to advertisers, sponsors, or the subjects
          of its coverage.
        </blockquote>
      </section>

      {/* CTA */}
      <section className="wrap-narrow">
        <div className="report-cta-inner">
          <div>
            <h3>Commission bespoke research</h3>
            <p>The same method, applied to a question specific to your mandate.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/services/" className="btn-ed btn-ed-primary">Commission research <span className="arr">→</span></Link>
            <Link href="/reports/" className="btn-ed btn-ed-ghost">Read the work <span className="arr">→</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
