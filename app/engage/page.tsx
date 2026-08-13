import type { Metadata } from 'next';
import Link from 'next/link';
import { EngageSubscribe } from './EngageSubscribe';

export const metadata: Metadata = {
  title: 'Engage with Techadyant',
  description:
    'Subscribe to the intelligence brief, shape what we research next, or get in touch. One place for every way to engage with Techadyant Labs.',
  alternates: { canonical: 'https://labs.techadyant.com/engage/' },
};

/* Inline icons (stroke, currentColor) */
const IconMail = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>);
const IconTarget = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.6" fill="currentColor" /></svg>);
const IconChat = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" /></svg>);
const IconBrief = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>);
const IconBuilding = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v16" /><path d="M13 9h5a1 1 0 0 1 1 1v11" /><path d="M8 8h2M8 12h2M8 16h2" /></svg>);
const IconInfo = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 7.5h.01" /></svg>);
const IconBook = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19a2 2 0 0 0 2 2h13" /><path d="M9 7h6M9 11h6" /></svg>);

const BRASS = '#F5B544';
const INDIGO = '#818CF8';
const TEAL = '#2BC5B4';

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
      <div className="eng-hero">
        <span className="eng-eyebrow">Engage</span>
        <h1>Get involved with Techadyant</h1>
        <p>Three clear ways to be part of the work — subscribe for the brief, tell us what to research next, or reach us directly.</p>
      </div>

      <div className="eng-wrap">
        {/* PRIMARY — three big tiles */}
        <div className="eng-grid">
          {/* Subscribe (form inline) */}
          <div className="eng-tile" style={{ ['--ic' as any]: BRASS }}>
            <div className="eng-ic"><IconMail /></div>
            <h2>Subscribe</h2>
            <p>Reports, signals and briefings on India&rsquo;s industrial systems — delivered when they publish. Infrequent, no sponsored coverage.</p>
            <div className="eng-foot"><EngageSubscribe /></div>
          </div>

          {/* Shape (whole tile links) */}
          <Link className="eng-tile" href="/shape/" style={{ ['--ic' as any]: INDIGO }}>
            <div className="eng-ic"><IconTarget /></div>
            <h2>Shape our research</h2>
            <p>Suggest a topic, ask a research question, flag a gap or improve the Atlas. Your input decides what we publish and build next.</p>
            <div className="eng-foot"><span className="eng-cta">Shape Techadyant →</span></div>
          </Link>

          {/* Contact (whole tile links) */}
          <Link className="eng-tile" href="/contact/" style={{ ['--ic' as any]: TEAL }}>
            <div className="eng-ic"><IconChat /></div>
            <h2>Contact us</h2>
            <p>Editorial enquiries, media, partnerships, or anything about a purchase or your account. We reply within two working days.</p>
            <div className="eng-foot"><span className="eng-cta">Get in touch →</span></div>
          </Link>
        </div>

        {/* WHO WE ARE — About now lives inside Engage */}
        <div className="eng-sec-h">Who we are</div>
        <div className="eng-secondary">
          <Link className="eng-wide" href="/about/" style={{ ['--ic' as any]: TEAL }}>
            <div className="eng-ic"><IconInfo /></div>
            <div><h3>About the platform</h3><p>An independent, India-first research lab — who we are, how we think, and what we stand for.</p></div>
            <span className="eng-arrow" aria-hidden>→</span>
          </Link>
          <Link className="eng-wide" href="/methodology/" style={{ ['--ic' as any]: INDIGO }}>
            <div className="eng-ic"><IconBook /></div>
            <div><h3>How we work</h3><p>Our research methodology, evidence and confidence standards, and independence policy.</p></div>
            <span className="eng-arrow" aria-hidden>→</span>
          </Link>
        </div>

        {/* SECONDARY — work with us */}
        <div className="eng-sec-h">Work with us</div>
        <div className="eng-secondary">
          <Link className="eng-wide" href="/services/" style={{ ['--ic' as any]: BRASS }}>
            <div className="eng-ic"><IconBrief /></div>
            <div><h3>Commission research</h3><p>Bespoke studies and investment-grade DPRs, to the standard of our published work.</p></div>
            <span className="eng-arrow" aria-hidden>→</span>
          </Link>
          <Link className="eng-wide" href="/licensing/" style={{ ['--ic' as any]: INDIGO }}>
            <div className="eng-ic"><IconBuilding /></div>
            <div><h3>Team &amp; institutional licensing</h3><p>Multi-seat, organisation-wide and data-redistribution licensing, with a procurement route.</p></div>
            <span className="eng-arrow" aria-hidden>→</span>
          </Link>
        </div>

        {/* SUPPORT & POLICIES — visible pills */}
        <div className="eng-sec-h">Support &amp; policies</div>
        <div className="eng-pills">
          {SUPPORT.map((s) => <Link key={s.href} className="eng-pill" href={s.href}>{s.l}</Link>)}
        </div>
      </div>
    </>
  );
}
