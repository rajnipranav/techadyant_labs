import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: 'Refund and cancellation terms for Techadyant Labs digital research reports and data packs.',
  alternates: { canonical: 'https://labs.techadyant.com/refund/' },
};

const S: [string, React.ReactNode][] = [
  ['Digital products are non-refundable once accessed',
    <p key="1">Our reports and data packs are digital products delivered electronically and made available for immediate
      download on your account. Because access is granted instantly and the material cannot be returned, all sales are
      final and <strong>non-refundable once the report or data pack has been accessed or downloaded</strong>.</p>],
  ['Evaluate before you buy',
    <p key="2">To reduce the risk of an unwanted purchase, most paid reports offer a free condensed edition or preview so
      you can assess the thesis, structure and headline findings before purchasing. We encourage you to review the
      preview and the report description before completing a purchase.</p>],
  ['When we will refund',
    <p key="3">We will review and, where appropriate, refund a purchase in the following cases: (a) a duplicate or
      erroneous charge; (b) you were charged but access was not granted, or the files could not be delivered, owing to a
      technical fault on our side that we are unable to resolve within a reasonable time; or (c) an incorrect item was
      delivered. In each case we may first attempt to restore your access rather than refund.</p>],
  ['How to request',
    <p key="4">Email <a href="mailto:info@techadyant.com">info@techadyant.com</a> within 7 days of purchase with your
      order or payment ID and a short description of the issue. We aim to respond within two working days. Approved
      refunds are returned to the original payment method through our payment processor (Razorpay), typically within
      5–7 working days.</p>],
  ['Commissioned research and DPRs',
    <p key="5">Bespoke research engagements and Detailed Project Reports are governed by the individual engagement
      agreement — including its milestone, fee and cancellation terms — and are not covered by this policy.</p>],
  ['Newsletter and free content',
    <p key="6">Subscriptions to our newsletter and free reports carry no charge. You may unsubscribe at any time using
      the link in any email or by writing to us.</p>],
];

export default function RefundPage() {
  return (
    <>
      <header className="ed-page-head"><div className="wrap inner">
        <div className="ed-breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Refund &amp; Cancellation</span></div>
        <h1>Refund &amp; Cancellation Policy</h1>
        <p className="lede">How refunds and cancellations work for our digital research products.</p>
        <p className="note-fine">Effective August 2026 · TechAdyant Private Limited</p>
      </div></header>
      <section className="wrap-narrow" style={{ paddingTop: 32, paddingBottom: 40 }}>
        {S.map(([h, b], i) => (<div key={i} style={{ marginBottom: 22 }}><h2 style={{ fontSize: '1.15rem', marginBottom: 8 }}>{h}</h2>{b}</div>))}
        <p className="note-fine">Questions? <Link href="/support/">Contact support</Link> or email info@techadyant.com.</p>
      </section>
    </>
  );
}
