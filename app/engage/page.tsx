import type { Metadata } from 'next';
import Link from 'next/link';
import { Newsletter } from '../components/Newsletter';

export const metadata: Metadata = {
  title: 'Engage with Techadyant',
  description:
    'Subscribe to the intelligence brief, shape what we research next, or get in touch. Everything you need to engage with Techadyant Labs — in one place.',
  alternates: { canonical: 'https://labs.techadyant.com/engage/' },
};

const cardStyle: React.CSSProperties = {
  border: '1px solid var(--border)', borderRadius: 16, padding: '24px 22px',
  background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: 12,
};
const kicker: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, letterSpacing: '.16em',
  textTransform: 'uppercase', color: 'var(--brass-cream, #C9A84C)',
};

const WORK = [
  { href: '/services/', k: 'Commission research', d: 'Bespoke studies and investment-grade DPRs, held to the standard of our published work.' },
  { href: '/licensing/', k: 'Team & institutional licensing', d: 'Multi-seat, organisation-wide and data-redistribution licensing, with a procurement route.' },
];

const SUPPORT = [
  { href: '/support/', l: 'Support' },
  { href: '/corrections/', l: 'Corrections & updates' },
  { href: '/refund/', l: 'Refund & cancellation' },
  { href: '/terms/', l: 'Terms' },
  { href: '/privacy/', l: 'Privacy' },
];

export default function EngagePage() {
  return (
    <>
      <header className="ed-page-head"><div className="wrap inner">
        <div className="ed-breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Engage</span></div>
        <h1>Engage with Techadyant</h1>
        <p className="lede">
          Three ways to be part of the work: get our intelligence brief, help decide what we research next, or reach
          us directly. Everything is in one place — no hunting.
        </p>
      </div></header>

      <section className="wrap" style={{ paddingTop: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
          {/* Subscribe — inline, frictionless */}
          <div style={cardStyle}>
            <div style={kicker}>Subscribe</div>
            <h2 style={{ margin: 0, fontSize: 21 }}>Get the intelligence brief</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14.5, lineHeight: 1.6 }}>
              Long-form reports, intelligence signals and briefings on India&rsquo;s industrial systems. Infrequent, no
              sponsored coverage, unsubscribe anytime.
            </p>
            <div style={{ marginTop: 'auto' }}><Newsletter source="engage" /></div>
          </div>

          {/* Shape */}
          <div style={cardStyle}>
            <div style={kicker}>Shape our research</div>
            <h2 style={{ margin: 0, fontSize: 21 }}>Tell us what to research next</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14.5, lineHeight: 1.6 }}>
              We research the questions our readers actually need answered. Suggest a topic, ask a research question,
              flag a gap, or help improve the Atlas — your input shapes what we publish and build.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: 8 }}>
              <Link className="btn-ed btn-ed-primary" href="/shape/">Shape Techadyant <span className="arr">→</span></Link>
            </div>
          </div>

          {/* Contact */}
          <div style={cardStyle}>
            <div style={kicker}>Contact</div>
            <h2 style={{ margin: 0, fontSize: 21 }}>Talk to us</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14.5, lineHeight: 1.6 }}>
              For editorial enquiries, media, partnerships or anything about a purchase or your account. We reply within
              two working days.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link className="btn-ed btn-ed-ghost" href="/contact/">Contact us <span className="arr">→</span></Link>
              <a href="mailto:labs@techadyant.com" style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>labs@techadyant.com</a>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap">
        <div className="section-head-ed">
          <div><div className="ed-kicker">Work with us</div><h2>Commission or license the research</h2></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 18 }}>
          {WORK.map((w) => (
            <Link key={w.href} href={w.href} style={{ ...cardStyle, textDecoration: 'none', color: 'inherit', gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>{w.k} <span className="arr" style={{ color: 'var(--accent, #C9A84C)' }}>→</span></h3>
              <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.55 }}>{w.d}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap-narrow" style={{ paddingBottom: 44 }}>
        <div className="ed-kicker" style={{ marginBottom: 12 }}>Support &amp; policies</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 22px', fontSize: 14.5 }}>
          {SUPPORT.map((s, i) => (
            <span key={s.href} style={{ display: 'inline-flex', gap: '10px 22px' }}>
              <Link href={s.href}>{s.l}</Link>
              {i < SUPPORT.length - 1 && <span style={{ color: 'var(--text-dim)' }} aria-hidden>·</span>}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
