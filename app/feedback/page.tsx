import type { Metadata } from 'next';
import Link from 'next/link';
import { FeedbackForm } from '../components/FeedbackForm';

export const metadata: Metadata = {
  title: 'Request a report · Feedback',
  description: 'Tell us which report you want, what you could not find, or how to make the platform more useful. We read every request.',
  alternates: { canonical: 'https://labs.techadyant.com/feedback/' },
};

export default function FeedbackPage() {
  return (
    <>
      <header className="ed-page-head"><div className="wrap inner">
        <div className="ed-breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Request a report</span></div>
        <h1>Request a report</h1>
        <p className="lede">
          Tell us which report you want, what you were looking for and couldn&rsquo;t find, or how we can make the
          platform more useful. Every request goes into our research pipeline and shapes what we publish next.
        </p>
      </div></header>
      <section className="wrap-narrow" style={{ paddingTop: 28, paddingBottom: 48 }}>
        <FeedbackForm source="feedback-page" />
        <p className="note-fine" style={{ marginTop: 18 }}>
          For a bespoke research engagement or a Detailed Project Report, see <Link href="/services/">Commission research</Link>.
          For anything else, <Link href="/support/">contact support</Link>.
        </p>
      </section>
    </>
  );
}
