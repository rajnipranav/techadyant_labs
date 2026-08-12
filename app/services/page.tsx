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

// Indicative engagement shapes. Fees are quoted per project after scoping —
// these give a sense of size, timeline and format, not a price list.
const ENGAGEMENTS = [
  { k: 'Strategic briefing', time: '2–3 weeks', fmt: '15–30 pp', v: 'A focused answer to one question — a market, a dependency, a policy shift, a build-vs-buy call.' },
  { k: 'Full research report', time: '4–8 weeks', fmt: '60–150 pp + data', v: 'A complete study to our published standard, scoped to your decision, with figures, frameworks and a sourced data pack.' },
  { k: 'Detailed Project Report', time: '6–12 weeks', fmt: 'DPR + workbook', v: 'Investment- and approval-grade — technical scope, capacity and demand rationale, capex and phasing, regulatory pathway, risk.' },
  { k: 'Retained intelligence', time: 'Ongoing', fmt: 'Monthly', v: 'A standing brief on a sector or corridor you need to track — signals, developments and quarterly deep-dives.' },
];

// Proof assets: our published reports ARE the sample deliverables. These are
// confirmed live slugs; the free ones can be read in full without purchase.
const PROOF = [
  { slug: 'the-sap-question', label: 'The SAP Question', note: 'Free — read the full report to see the standard' },
  { slug: 'who-builds-indias-drones', label: "Who Builds India's Drones?", note: 'Flagship — frameworks, dependency mapping, 100-opportunity registry' },
  { slug: 'india-critical-manufacturing-dependencies', label: 'Critical Manufacturing Dependencies', note: 'Index-led flagship with a companion data pack' },
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
        <div className="section-head-ed">
          <div><div className="ed-kicker">Engagement types</div><h2>Pick the shape that fits the decision</h2></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 18 }}>
          {ENGAGEMENTS.map((e) => (
            <div key={e.k} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '18px 18px 16px' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>{e.k}</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                <span className="chip">{e.time}</span>
                <span className="chip">{e.fmt}</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{e.v}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 16 }}>
          Fees are fixed per project and quoted after a short scoping call — no open-ended retainers unless you want one.
        </p>
      </section>

      <section className="wrap">
        <div className="section-head-ed">
          <div><div className="ed-kicker">See the standard</div><h2>Our published work is the sample deliverable</h2></div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.65, maxWidth: '64ch', marginBottom: 18 }}>
          We don’t ask you to take the quality on trust. Commissioned work is held to exactly the standard
          of what we publish — the same evidence discipline, figures and framework rigour. Read a report end
          to end before you commission one.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
          {PROOF.map((p) => (
            <Link key={p.slug} href={`/reports/${p.slug}/`} style={{ display: 'block', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 16px 14px', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>{p.label} <span className="arr" style={{ color: 'var(--accent, #C9A84C)' }}>→</span></div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>{p.note}</p>
            </Link>
          ))}
        </div>
        <p style={{ fontSize: 14, marginTop: 16 }}>
          <Link href="/reports/">Browse all published reports →</Link>
        </p>
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
