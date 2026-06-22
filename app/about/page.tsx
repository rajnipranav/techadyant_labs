import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroCanvas } from '../components/HeroCanvas';

export const metadata: Metadata = {
  title: 'About the platform',
  description:
    'Techadyant Labs is an independent strategic intelligence platform focused on India’s industrial transformation, infrastructure systems and emerging strategic technologies.',
};

const PRINCIPLES = [
  { k: 'Independent', v: 'No sponsored coverage, no undisclosed interests, and no position in the companies or projects we analyse.' },
  { k: 'Systems-level', v: 'We treat industrial systems the way analysts treat markets — as interdependent structures with hidden constraints and asymmetric beneficiaries.' },
  { k: 'India-first', v: 'Our work is built around India’s industrial, infrastructural and strategic context rather than imported frameworks.' },
  { k: 'Long-form', v: 'Depth over frequency. We publish when the analysis is ready, not on a content calendar.' },
  { k: 'Evidence-led', v: 'Built on public information, clearly sourced, with analytical frameworks flagged as frameworks.' },
  { k: 'Reader-oriented', v: 'The publication answers to its readers — not to advertisers, sponsors or the subjects of its coverage.' },
];

const OUTPUTS = [
  { k: 'Reports', v: 'Flagship long-form analysis of a single strategic question.' },
  { k: 'Signals', v: 'Compact intelligence dispatches — early reads on structural change.' },
  { k: 'Briefings', v: 'Short, executive-ready frameworks and decision-oriented notes.' },
];

export default function AboutPage() {
  return (
    <>
      <header className="ed-page-head">
        <HeroCanvas />
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>About</span>
          </div>
          <h1>An independent strategic intelligence platform.</h1>
          <p className="lede">
            Techadyant Labs studies India’s industrial transformation, infrastructure systems
            and emerging strategic technologies — the hidden systems shaping the next
            industrial decade.
          </p>
        </div>
      </header>

      <section className="wrap-narrow">
        <div className="report-body" style={{ padding: '8px 0 0' }}>
          <p className="dropcap serif">
            Most coverage of industrial policy stops at the announcement. A plant is unveiled,
            a figure is quoted, a node is named — and the story ends precisely where the
            interesting analysis begins. Techadyant Labs exists to do the second half of the
            work: to map the dependencies, constraints and beneficiaries that determine what
            an industrial decision actually produces.
          </p>
          <p className="serif">
            We focus on India because the next two decades of its industrial build-out will
            reorganise supply chains, regional economies and strategic capabilities in ways
            that are poorly served by either domestic news cycles or imported analytical
            frameworks. Our method is systems-level and long-form: we follow the edges of the
            graph — water, power, materials, logistics, capital, policy and talent — rather
            than the headline node.
          </p>
        </div>
      </section>

      <section className="wrap">
        <div className="section-head-ed">
          <div><div className="ed-kicker">What we publish</div><h2>Three forms of output</h2></div>
        </div>
        <div className="pull-stat" style={{ margin: 0 }}>
          {OUTPUTS.map((o) => (
            <div key={o.k} className="ps">
              <div className="n" style={{ fontSize: 22 }}>{o.k}</div>
              <div className="l">{o.v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap">
        <div className="section-head-ed">
          <div><div className="ed-kicker">Principles</div><h2>How we work</h2></div>
        </div>
        <div className="platform-band">
          <p className="pb-statement">
            The value of independent intelligence is only as good as the discipline behind it.
            These are the commitments the publication holds itself to.
          </p>
          <div className="pb-body">
            <ul className="pb-principles">
              {PRINCIPLES.map((p) => (
                <li key={p.k}>
                  <div className="pk">{p.k}</div>
                  <div className="pv">{p.v}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="wrap-narrow">
        <div className="report-cta-inner">
          <div>
            <h3>Read the work</h3>
            <p>Start with the current edition, or follow the signals as they publish.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/reports/indias-unmanned-warfare-transformation/" className="btn-ed btn-ed-primary">Featured report <span className="arr">→</span></Link>
            <Link href="/#subscribe" className="btn-ed btn-ed-ghost">Subscribe <span className="arr">→</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
