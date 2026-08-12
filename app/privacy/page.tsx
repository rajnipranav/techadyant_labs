import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Techadyant Labs collects, uses and protects your personal data.',
  alternates: { canonical: 'https://labs.techadyant.com/privacy/' },
};

const S: [string, React.ReactNode][] = [
  ['What we collect',
    <p key="1">We collect the email address you provide when you subscribe, create an account or make a purchase; basic
      account and order details; and metadata about your purchases. When you submit the feedback or report-request form,
      we collect what you send us. We also collect standard usage analytics. We do <strong>not</strong> collect or store
      your card details — payments are handled entirely by our processor.</p>],
  ['How we use it',
    <p key="2">We use your data to deliver the reports you buy, send receipts and account emails, keep you informed about
      relevant new research (which you can unsubscribe from at any time), respond to your enquiries and feedback, and
      improve the platform.</p>],
  ['Payments',
    <p key="3">Payments are processed by <strong>Razorpay</strong>, a PCI-DSS-compliant payment provider. We receive
      confirmation and limited transaction metadata but never see or store your full card details.</p>],
  ['Analytics and cookies',
    <p key="4">We use Google Analytics and Google Search Console to understand how the platform is used and how it is
      found in search. These may set cookies. You can control cookies through your browser settings.</p>],
  ['Who we share it with',
    <p key="5">We do not sell your personal data. We share it only with the service providers that run the platform —
      including Supabase (database), Cloudflare (hosting and storage), Resend (email delivery), Razorpay (payments) and
      Google (analytics) — and only to the extent needed to provide the service, or where required by law.</p>],
  ['Your rights',
    <p key="6">You may ask us to access, correct or delete your personal data, and you can unsubscribe from marketing
      emails at any time. Write to <a href="mailto:info@techadyant.com">info@techadyant.com</a> and we will respond
      within a reasonable time.</p>],
  ['Retention and security',
    <p key="7">We keep personal data only for as long as needed to provide the service and meet legal and accounting
      obligations, and we apply reasonable technical and organisational measures to protect it.</p>],
  ['Contact',
    <p key="8">For any privacy question or request, contact TechAdyant Private Limited at
      <a href="mailto:info@techadyant.com"> info@techadyant.com</a>. We may update this policy from time to time and will
      post the current version here.</p>],
];

export default function PrivacyPage() {
  return (
    <>
      <header className="ed-page-head"><div className="wrap inner">
        <div className="ed-breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Privacy</span></div>
        <h1>Privacy Policy</h1>
        <p className="lede">What we collect, why, and the choices you have.</p>
        <p className="note-fine">Effective August 2026 · TechAdyant Private Limited</p>
      </div></header>
      <section className="wrap-narrow" style={{ paddingTop: 32, paddingBottom: 40 }}>
        {S.map(([h, b], i) => (<div key={i} style={{ marginBottom: 22 }}><h2 style={{ fontSize: '1.15rem', marginBottom: 8 }}>{h}</h2>{b}</div>))}
      </section>
    </>
  );
}
