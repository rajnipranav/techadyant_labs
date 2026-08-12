import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Support & Contact',
  description: 'Get help with access, downloads, invoices and purchases, or reach the Techadyant Labs team.',
  alternates: { canonical: 'https://labs.techadyant.com/support/' },
};

export default function SupportPage() {
  return (
    <>
      <header className="ed-page-head"><div className="wrap inner">
        <div className="ed-breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Support</span></div>
        <h1>Support &amp; Contact</h1>
        <p className="lede">Help with access, downloads, invoices and purchases — and how to reach us.</p>
      </div></header>
      <section className="wrap-narrow" style={{ paddingTop: 32, paddingBottom: 40 }}>
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: 8 }}>Get in touch</h2>
          <p>For anything to do with your account, a purchase, an invoice or a download, email
            <a href="mailto:info@techadyant.com"> info@techadyant.com</a>. We aim to reply within two working days.</p>
        </div>
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: 8 }}>Your reports and invoices</h2>
          <p>You can re-download every report and data pack you own, and open your invoice, from your
            <Link href="/account/"> account library</Link>. Sign in with the email address you used at purchase.</p>
        </div>
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: 8 }}>Commissioned research</h2>
          <p>For bespoke research, Detailed Project Reports or ongoing intelligence support, see
            <Link href="/services/"> Commission research</Link> or write to us directly.</p>
        </div>
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: 8 }}>Policies</h2>
          <p><Link href="/refund/">Refund &amp; Cancellation</Link> · <Link href="/terms/">Terms</Link> · <Link href="/privacy/">Privacy</Link></p>
        </div>
      </section>
    </>
  );
}
