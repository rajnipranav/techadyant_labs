import type { Metadata } from 'next';
import Link from 'next/link';
import { CommissionForm } from '../components/CommissionForm';

export const metadata: Metadata = {
  title: 'Team & institutional licensing',
  description:
    'Multi-seat, organisation-wide and data-redistribution licensing for Techadyant Labs research — for teams, institutions, funds and enterprises. Procurement-friendly invoicing.',
  alternates: { canonical: 'https://labs.techadyant.com/licensing/' },
};

const MODELS = [
  {
    k: 'Team licence',
    tag: 'Multi-seat',
    body:
      'One purchase, shared across a named team. Everyone who needs a report can read and download it, under a single internal-use licence — instead of buying it seat by seat.',
    points: ['Named team or department', 'Internal circulation permitted', 'Consolidated invoicing'],
  },
  {
    k: 'Institutional / enterprise',
    tag: 'Organisation-wide',
    body:
      'Org-wide access to our published research for a ministry, PSU, fund, corporate strategy team or research desk — with a procurement route, a formal agreement and a single point of contact.',
    points: ['Organisation-wide read access', 'Procurement + PO workflow', 'Priority on new releases'],
  },
  {
    k: 'Data & redistribution licence',
    tag: 'Data',
    body:
      'A licence to use our figures, datasets and dependency scores beyond internal reading — in your own analysis, board material, models or products — with agreed attribution and scope.',
    points: ['Figures, tables & data packs', 'Defined redistribution scope', 'Attribution terms'],
  },
];

export default function LicensingPage() {
  return (
    <>
      <header className="ed-page-head"><div className="wrap inner">
        <div className="ed-breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Licensing</span></div>
        <h1>Team &amp; institutional licensing</h1>
        <p className="lede">
          Our reports are sold for individual, internal use by default. When a team, institution, fund or enterprise
          needs shared access — or the right to use our data in its own work — we license it directly, with a
          procurement route and a formal agreement.
        </p>
      </div></header>

      <section className="wrap">
        <div className="section-head-ed">
          <div><div className="ed-kicker">Ways to license</div><h2>Three models, quoted per organisation</h2></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {MODELS.map((m) => (
            <div key={m.k} className="prac">
              <div>
                <div className="chip" style={{ marginBottom: 12 }}>{m.tag}</div>
                <h3 style={{ margin: '0 0 4px', fontSize: 20 }}>{m.k}</h3>
              </div>
              <div className="prac-body">{m.body}</div>
              <div className="prac-list" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {m.points.map((p) => <span key={p}>{p}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap-narrow">
        <div className="report-body" style={{ padding: '8px 0 0' }}>
          <h2 style={{ fontSize: '1.2rem' }}>Procurement &amp; invoicing</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
            We can work with a purchase order and raise a formal invoice to your organisation. Payment is in Indian
            Rupees. TechAdyant Private Limited&rsquo;s GST registration is in process; where GST is not charged this is
            stated on the invoice, and a revised GST tax invoice can be issued once registration is complete. Licences
            are documented in a short written agreement covering scope, users and term.
          </p>
        </div>
      </section>

      <section className="wrap-narrow" id="enquiry">
        <div className="section-head-ed">
          <div><div className="ed-kicker">Talk to us</div><h2>Tell us your team size and use case</h2></div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6, maxWidth: '62ch', marginBottom: 22 }}>
          A few lines — how many people, which reports or sectors, and how you&rsquo;d use them — is enough to begin.
          We reply within two working days with options and a quote.
        </p>
        <CommissionForm source="licensing" />
        <p className="note-fine" style={{ marginTop: 16 }}>
          Looking for one report for yourself? Buy any report directly from the <Link href="/reports/">reports library</Link>.
          Need bespoke research or a DPR? See <Link href="/services/">Commission research</Link>.
        </p>
      </section>
    </>
  );
}
