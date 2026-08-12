import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroCanvas } from '../components/HeroCanvas';

export const metadata: Metadata = {
  title: 'Contact Techadyant Labs',
  description:
    'Get in touch with Techadyant Labs for commissioned research, Detailed Project Reports (DPRs), or editorial enquiries. Independent strategic intelligence on India\'s industrial systems.',
};

export default function ContactPage() {
  return (
    <>
      <header className="ed-page-head">
        <HeroCanvas />
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>Contact</span>
          </div>
          <h1>Contact Techadyant Labs.</h1>
          <p className="lede">
            We work with organisations that need to understand India's industrial systems
            before they commit capital, policy or strategy.
          </p>
        </div>
      </header>

      <section className="wrap-narrow" aria-labelledby="contact-details">
        <h2 id="contact-details" style={{ marginBottom: 24 }}>Contact details</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          <div className="prac" style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div className="chip" style={{ marginBottom: 12 }}>Email</div>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7 }}>
              <a href="mailto:labs@techadyant.com" style={{ color: 'var(--text)' }}>labs@techadyant.com</a>
              <br />
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Editorial, partnerships, press</span>
            </p>
          </div>

          <div className="prac" style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div className="chip" style={{ marginBottom: 12 }}>Commissioned research & DPRs</div>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7 }}>
              <a href="/services/" style={{ color: 'var(--text)' }}>Start a project →</a>
              <br />
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>We reply within two working days</span>
            </p>
          </div>

          <div className="prac" style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div className="chip" style={{ marginBottom: 12 }}>Postal address</div>
            <address style={{ fontStyle: 'normal', margin: 0, fontSize: 15, lineHeight: 1.7, color: 'var(--text-muted)' }}>
              TechAdyant Private Limited<br />
              House No. 550 (A), Datta Galli<br />
              Vadagaon, M. Vadgaon<br />
              Belagavi (Belgaum) – 590005, Karnataka, India<br />
              <span style={{ color: 'var(--text-dim)' }}>Service area: Pan-India</span>
            </address>
          </div>

          <div className="prac" style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div className="chip" style={{ marginBottom: 12 }}>Business hours</div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: 'var(--text-muted)' }}>
              Monday – Friday: 09:00 – 18:00 IST<br />
              Saturday – Sunday: Closed
            </p>
          </div>
        </div>
      </section>

      <section className="wrap-narrow" aria-labelledby="commission" style={{ marginTop: 48 }}>
        <div className="section-head-ed">
          <div><div className="ed-kicker">Commission research</div><h2 id="commission">Tell us what you're deciding</h2></div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6, maxWidth: '62ch', marginBottom: 22 }}>
          A few lines is enough to begin. We'll reply within two working days to discuss scope,
          timeline and whether we're the right fit — at no cost and no obligation.
        </p>
        <Link href="/services/" className="btn-ed btn-ed-primary" style={{ display: 'inline-block' }}>
          Commission a study <span className="arr">→</span>
        </Link>
      </section>

      <section className="wrap-narrow" aria-labelledby="press" style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
        <h3 id="press" style={{ marginBottom: 12 }}>Press & speaking enquiries</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6, maxWidth: '62ch' }}>
          For media requests, speaking invitations, or content syndication, email
          <a href="mailto:labs@techadyant.com" style={{ color: 'var(--brass)' }}>labs@techadyant.com</a>
          with "Press" in the subject line.
        </p>
      </section>

      <section className="wrap-narrow" aria-labelledby="related" style={{ marginTop: 48 }}>
        <h3 id="related" style={{ marginBottom: 16 }}>Related</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/about/" className="btn-ed btn-ed-ghost">About the platform</Link>
          <Link href="/methodology/" className="btn-ed btn-ed-ghost">Methodology</Link>
          <Link href="/services/" className="btn-ed btn-ed-ghost">Services & DPRs</Link>
          <Link href="/#subscribe" className="btn-ed btn-ed-ghost">Subscribe to Sanket</Link>
        </div>
      </section>
    </>
  );
}