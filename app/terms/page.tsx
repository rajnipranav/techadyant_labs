import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use & Sale',
  description: 'Terms governing use of the Techadyant Labs platform and the purchase of its research products.',
  alternates: { canonical: 'https://labs.techadyant.com/terms/' },
};

const S: [string, React.ReactNode][] = [
  ['Who we are',
    <p key="1">This platform (labs.techadyant.com) is operated by <strong>TechAdyant Private Limited</strong>, a company
      incorporated in India (CIN U62099KA2026PTC220459), with its registered office at Belagavi, Karnataka. By using the
      platform or purchasing our products, you agree to these terms.</p>],
  ['Nature of our content',
    <p key="2">Our reports, signals, data and analysis are provided for information and research purposes. They are not
      investment, legal, financial or professional advice, and must not be relied upon as such. Figures are
      confidence-labelled and, where estimated or modelled, disclosed as such; we make no guarantee of any outcome and
      accept no liability for decisions taken on the basis of our work.</p>],
  ['Licence and permitted use',
    <p key="3">On purchase you receive a non-exclusive, non-transferable licence to access and use the report and any
      included data pack for your own and your organisation&rsquo;s internal use. You may cite short extracts with
      attribution to Techadyant Labs and a link. You may not resell, redistribute, publish, sub-licence, or post the
      material publicly, and you may not scrape or bulk-extract the platform. All intellectual property in the content
      remains with TechAdyant Private Limited.</p>],
  ['Accounts and access',
    <p key="4">Access to purchased material is tied to your account and is personal to you. You are responsible for
      keeping your login secure and for activity under your account.</p>],
  ['Payments',
    <p key="5">Prices are shown in Indian Rupees and are payable through our payment processor, Razorpay. TechAdyant
      Private Limited&rsquo;s GST registration is in process; where GST is not charged this is stated on the invoice, and
      a revised GST tax invoice can be issued on request once registration is complete. Refunds are governed by our
      <Link href="/refund/"> Refund &amp; Cancellation Policy</Link>.</p>],
  ['Disclaimers and liability',
    <p key="6">The platform and its content are provided on an &ldquo;as is&rdquo; basis. To the fullest extent permitted
      by law, TechAdyant Private Limited excludes all warranties and shall not be liable for any indirect or
      consequential loss. Nothing in these terms limits liability that cannot be limited under applicable law.</p>],
  ['Governing law',
    <p key="7">These terms are governed by the laws of India, and the courts at Belagavi, Karnataka shall have
      jurisdiction. We may update these terms from time to time; continued use constitutes acceptance of the updated
      terms.</p>],
];

export default function TermsPage() {
  return (
    <>
      <header className="ed-page-head"><div className="wrap inner">
        <div className="ed-breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Terms</span></div>
        <h1>Terms of Use &amp; Sale</h1>
        <p className="lede">The terms on which we provide the platform and sell our research.</p>
        <p className="note-fine">Effective August 2026 · TechAdyant Private Limited</p>
      </div></header>
      <section className="wrap-narrow" style={{ paddingTop: 32, paddingBottom: 40 }}>
        {S.map(([h, b], i) => (<div key={i} style={{ marginBottom: 22 }}><h2 style={{ fontSize: '1.15rem', marginBottom: 8 }}>{h}</h2>{b}</div>))}
      </section>
    </>
  );
}
