import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroCanvas } from '../components/HeroCanvas';
import { CommissionForm } from '../components/CommissionForm';

export const metadata: Metadata = {
  title: 'Commission research & DPRs',
  description:
    'Commission bespoke strategic research and Detailed Project Reports (DPRs) for technology, industrial and strategic projects — independent, systems-level analysis from Techadyant Labs.',
};

const OFFERINGS = [
  {
    k: 'Bespoke research',
    tag: 'Custom analysis',
    body:
      'A focused study built around a single decision you need to make. We map the dependencies, constraints, beneficiaries and second-order effects the same way we do in our published reports — but aimed at your question, your market, your timeline.',
    points: ['Market & ecosystem mapping', 'Supply-chain & dependency analysis', 'Policy & scheme assessment', 'Competitive & beneficiary analysis'],
  },
  {
    k: 'Detailed Project Reports',
    tag: 'DPRs',
    body:
      'Investment- and approval-grade DPRs for technology, industrial and strategic projects. Structured for lenders, partners and government counterparts — technical scope, demand and capacity rationale, capex and phasing, risk and regulatory pathway, all sourced and defensible.',
    points: ['Technical & capacity scope', 'Capex, phasing & financial logic', 'Regulatory & approval pathway', 'Risk and sensitivity analysis'],
  },
];

const PROCESS = [
  { n: '01', k: 'Scope', v: 'A short call to define the question, the decision it serves, and what “done” looks like. We tell you plainly if we’re the right fit.' },
  { n: '02', k: 'Proposal', v: 'A written brief: methodology, sources, deliverable, timeline and a fixed fee. No open-ended retainers unless you want one.' },
  { n: '03', k: 'Research', v: 'Primary-source-first analysis. You get a mid-point check-in so the direction is right before the writing hardens.' },
  { n: '04', k: 'Delivery', v: 'A decision-grade document — and a walkthrough. Revisions within the agreed scope are included.' },
];

export default function ServicesPage() {
  return (
    <>
      <header className="ed-page-head">
        <HeroCanvas />
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>Services</span>
          </div>
          <h1>Commission research &amp; DPRs.</h1>
          <p className="lede">
            The same systems-level analysis behind our published work — commissioned for your
            decision. Independent strategic research and investment-grade Detailed Project
            Reports for technology, industrial and strategic projects.
          </p>
        </div>
      </header>

      <section className="wrap-narrow">
        <div className="report-body" style={{ padding: '8px 0 0' }}>
          <p className="dropcap serif">
            Most decisions in industry and infrastructure are made on incomplete maps. The
            announcement is public, but the dependencies, the real beneficiaries and the
            second-order effects are not. We do the second half of that work — privately, for
            the organisations that have to act on it.
          </p>
        </div>
      </section>

      <section className="wrap">
        <div className="section-head-ed">
          <div><div className="ed-kicker">What we do</div><h2>Two ways to work with us</h2></div>
        </div>
        <div className="prac-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
          {OFFERINGS.map((o) => (
            <div key={o.k} className="prac">
              <div>
                <div className="chip" style={{ marginBottom: 12 }}>{o.tag}</div>
                <h3 style={{ margin: '0 0 4px', fontSize: 21 }}>{o.k}</h3>
              </div>
              <div className="prac-body">{o.body}</div>
              <div className="prac-list" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {o.points.map((p) => <span key={p}>{p}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap">
        <div className="section-head-ed">
          <div><div className="ed-kicker">How it works</div><h2>From question to decision-grade document</h2></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>
          {PROCESS.map((s) => (
            <div key={s.n} style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{s.n}</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>{s.k}</div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap">
        <div className="platform-band">
          <p className="pb-statement">
            We hold commissioned work to the same standard as our published research: independent,
            evidence-led, and free of undisclosed interest.
          </p>
          <div className="pb-body">
            <p style={{ color: 'var(--text-muted)', fontSize: 14.5, lineHeight: 1.65 }}>
              We do not take equity in the projects we assess, and we disclose any prior work that
              could bear on objectivity. The deliverable is yours; the judgement is ours. Where the
              evidence is thin, we say so — a report you can’t defend is worse than no report at all.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap-narrow" id="enquiry">
        <div className="section-head-ed">
          <div><div className="ed-kicker">Start here</div><h2>Tell us what you’re deciding</h2></div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6, maxWidth: '62ch', marginBottom: 22 }}>
          A few lines is enough to begin. We’ll reply within two working days to discuss scope,
          timeline and whether we’re the right fit — at no cost and no obligation.
        </p>
        <CommissionForm source="services" />
      </section>
    </>
  );
}
