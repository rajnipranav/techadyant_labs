import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroCanvas } from '../components/HeroCanvas';
import { PortraitImage } from '../components/PortraitImage';

export const metadata: Metadata = {
  title: 'About — TechAdyant Labs · Principal-led agentic software studio',
  description:
    'TechAdyant Labs is a principal-led, studio-model software and AI-agents practice, operated by Rajni Sharma from Delhi, India. Sub-brand of TechAdyant Pvt. Ltd.',
};

const FACTS = [
  { k: 'Founded',          v: 'Parent 2019 · Labs sub-brand 2026' },
  { k: 'Location',         v: 'Delhi, India · serving globally' },
  { k: 'Projects shipped', v: '100+ across WP, Woo, SaaS' },
  { k: 'Current focus',    v: 'Agentic workflows · Agent Ops' },
  { k: 'Client regions',   v: 'UK · US · EU · Australia · India' },
  { k: 'Operating entity', v: 'TechAdyant Pvt. Ltd. (Delhi, India)' },
];

const PRINCIPLES = [
  { title: 'Principal on every engagement',  body: 'No bait-and-switch. The person who sold the project ships the project.' },
  { title: 'Fixed ceilings',                 body: 'Quotes are ceilings, not estimates. Overruns are our problem, not yours.' },
  { title: 'No lock-in',                     body: 'Your code in your GitHub org. Your infra in your cloud accounts. Cancel retainers any month.' },
  { title: 'Written over spoken',            body: 'Short weekly async updates, monthly retainer reports, decision docs for anything important. Meetings are for genuine ambiguity.' },
  { title: 'Turn down bad-fit work',         body: "We'd rather say no than deliver an expensive disappointment. Mostly we say so on the intake call." },
  { title: 'Tell you when to stop',          body: 'If your retainer isn\'t earning its keep, we\'ll recommend pausing. Quiet-billing is the fastest way to lose a client forever.' },
];

const STACK_CHIPS = [
  'Next.js 14+', 'TypeScript', 'React Server Components', 'Tailwind · shadcn/ui', 'Astro',
  'WordPress', 'WooCommerce', 'PHP', 'Supabase', 'Neon', 'Postgres · pgvector', 'Stripe',
  'Resend · Postmark', 'Vercel', 'Cloudflare Pages · Workers',
];
const STACK_HOT = ['LangGraph', 'CrewAI', 'AutoGen', 'n8n', 'OpenAI', 'Anthropic'];
const STACK_TOOLS = ['LangSmith · Langfuse', 'Sentry · PostHog'];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="hero-section">
        <HeroCanvas />
        <div className="vignette" />
        <div className="scanlines" />
        <div className="hero-corner hero-c-tl"><svg viewBox="0 0 24 24" fill="none"><path d="M0 24 L0 0 L24 0" stroke="#e8c96d" strokeWidth="1.5" opacity="0.5"/></svg></div>
        <div className="hero-corner hero-c-tr"><svg viewBox="0 0 24 24" fill="none"><path d="M0 24 L0 0 L24 0" stroke="#e8c96d" strokeWidth="1.5" opacity="0.5"/></svg></div>
        <div className="hero-corner hero-c-bl"><svg viewBox="0 0 24 24" fill="none"><path d="M0 24 L0 0 L24 0" stroke="#e8c96d" strokeWidth="1.5" opacity="0.5"/></svg></div>
        <div className="hero-corner hero-c-br"><svg viewBox="0 0 24 24" fill="none"><path d="M0 24 L0 0 L24 0" stroke="#e8c96d" strokeWidth="1.5" opacity="0.5"/></svg></div>

        <div className="hero-inner-content">
          <div className="hero-eyebrow-container">
            <div className="hero-eyebrow-line" />
            <span className="hero-eyebrow-text">Principal-led · studio model · Delhi-based</span>
            <div className="hero-eyebrow-dot" />
          </div>
          <h1 className="hero-main-title">
            Small studio. <span className="accent">Senior hands.</span> Delivering accountable software engineering.
          </h1>
          <p className="hero-description">
            TechAdyant Labs is a sub-brand of TechAdyant Pvt. Ltd. focused on agentic software, serverless product engineering and ongoing partnerships. Principal-led, deliberately small, accountable for every ticket.
          </p>
          <div className="hero-actions-container">
            <button className="hero-btn-primary" data-open-modal="contact">
              Book an intake call <span className="hero-btn-arrow">→</span>
            </button>
            <Link href="/work" className="hero-btn-secondary">
              See the work <span className="hero-btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Founder section ── */}
      <section>
        <div className="wrap">
          <div className="founder">
            <div className="portrait-wrap">
              <PortraitImage
                src="https://i.ibb.co/8DRMkdYL/Rajni-Sharma-Creator-Pagenest.jpg"
                alt="Rajni Sharma"
              />
            </div>

            <div className="about-body">
              <p>Hi — I&apos;m Rajni Sharma. I run TechAdyant Labs out of Delhi, India. I&apos;ve been shipping software for clients across the UK, US, EU and Australia for over a decade — starting in graphic design and branding, moving steadily through WordPress and WooCommerce, then into serverless product engineering, and now concentrated on AI agents.</p>

              <p>TechAdyant Pvt. Ltd. is the registered parent company. TechAdyant Labs is the engineering sub-brand — the thing clients book when they need working code, not pitch decks.</p>

              <p>I believe small studios beat big agencies on craft, price, and accountability — but only if they specialize. So we&apos;ve taken a barbell position: commodity Web &amp; Commerce work priced to feed the funnel, and premium AI Agents work priced where the real margin lives. The squeezed middle we do honestly but quietly.</p>

              <p>Every engagement is led by me. I don&apos;t farm work out to a bench of anonymous juniors. If you hire TechAdyant Labs, you get me on every status call and my name in every commit.</p>

              <div className="facts">
                {FACTS.map((f) => (
                  <div key={f.k}>
                    <div className="fact-k">{f.k}</div>
                    <div className="fact-v">{f.v}</div>
                  </div>
                ))}
              </div>

              <div className="contact-row">
                <a className="cc" href="mailto:labs@techadyant.com">labs@techadyant.com</a>
                <Link className="cc" href="/contact">Book intake call →</Link>
                <a className="cc" href="https://techadyant.com" target="_blank" rel="noopener noreferrer">Parent site →</a>
              </div>

              <div className="lineage">
                <strong>Lineage.</strong> The parent brand, TechAdyant, started as a design and brand studio. Labs is the natural evolution — what the same principal-led studio looks like when the primary deliverable becomes production software and live AI agents, not static assets.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Principles ── */}
      <section style={{ background: 'var(--bg-2)' }}>
        <div className="wrap-narrow">
          <div className="sec-head">
            <div className="sec-kicker">How we work</div>
            <h2 className="sec-title">Six principles, non-negotiable.</h2>
          </div>

          <ul className="delivs">
            {PRINCIPLES.map((p) => (
              <li key={p.title}>
                <div>
                  <strong>{p.title}</strong>
                  <span>{p.body}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Stack ── */}
      <section>
        <div className="wrap-narrow">
          <div className="sec-head">
            <div className="sec-kicker">What we run on</div>
            <h2 className="sec-title">Stack we know deeply.</h2>
            <p className="sec-sub">
              Breadth is a liability at our size. We&apos;ve picked a handful of tools, we use them on every project, and we&apos;ve been stuck in production with every one of them at three in the morning. That&apos;s the bar.
            </p>
          </div>
          <div className="stack-inner" style={{ marginTop: '24px' }}>
            {STACK_CHIPS.map((c) => <span key={c} className="chip">{c}</span>)}
            {STACK_HOT.map((c) => <span key={c} className="chip hot">{c}</span>)}
            {STACK_TOOLS.map((c) => <span key={c} className="chip">{c}</span>)}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--bg-2)' }}>
        <div className="wrap">
          <div className="cta-band">
            <h2>Let&apos;s have the intake call.</h2>
            <p>30 minutes, async-friendly if time zones are hard, no sales motion. You leave with a clear answer.</p>
            <div className="cta-actions">
              <button className="btn-primary" data-open-modal="contact">Book an intake call</button>
              <Link href="/work" className="btn-ghost">See the work</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
