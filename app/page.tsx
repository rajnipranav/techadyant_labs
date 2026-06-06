import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroCanvas } from './components/HeroCanvas';
import { CorridorMap } from './corridors/CorridorMap';
import { Newsletter } from './components/Newsletter';
import { FeaturedTopology } from './components/ThemeIcon';
import { reports, getReport } from './reports/data';
import { signals } from './signals/data';
import { corridorsOrdered, meta, rollup } from './research/atlas';
import { briefings as allBriefings } from './briefings/data';

export const metadata: Metadata = {
  title: 'Strategic intelligence on India’s industrial systems',
  description:
    'Independent, India-first strategic research on industrial transformation, infrastructure systems, semiconductors, AI infrastructure and second-order economic change.',
};

const featured = getReport('the-opportunity-beyond-the-fab')!;
const briefings = allBriefings.slice(0, 3);

export default function HomePage() {
  return (
    <>
      {/* ── Editorial hero ── */}
      <section className="ed-hero">
        <HeroCanvas />
        <div className="veil" />
        <div className="scanlines" />

        <div className="ed-hero-map">
          <CorridorMap field={false} navigate />
        </div>

        <div className="ed-hero-inner">
          <div className="ed-hero-eyebrow">
            <span className="seg">Strategic Intelligence</span>
            <span className="div" />
            <span className="loc">India · Industrial Systems</span>
          </div>

          <h1>
            Mapping the <span className="grad">hidden systems</span> shaping India’s next industrial decade.
          </h1>

          <p className="lede">
            Independent, long-form research on industrial infrastructure, semiconductors,
            AI infrastructure and the second-order economic effects of India’s
            manufacturing transition — written for people who need to understand systems,
            not headlines.
          </p>

          <div className="ed-hero-actions">
            <Link href={`/reports/${featured.slug}`} className="btn-ed btn-ed-primary">
              Read the featured report <span className="arr">→</span>
            </Link>
            <Link href="/signals" className="btn-ed btn-ed-ghost">
              Latest signals <span className="arr">→</span>
            </Link>
          </div>
        </div>

        <div className="ed-hero-meta">
          <div>
            <div className="m-k">Focus</div>
            <div className="m-v">Industrial systems & infrastructure</div>
          </div>
          <div>
            <div className="m-k">Method</div>
            <div className="m-v">Long-form, systems-level analysis</div>
          </div>
          <div>
            <div className="m-k">Orientation</div>
            <div className="m-v">India-first · independent</div>
          </div>
          <div>
            <div className="m-k">Cadence</div>
            <div className="m-v">Reports · Signals · Briefings</div>
          </div>
        </div>
      </section>

      {/* ── Featured report ── */}
      <section className="wrap" aria-labelledby="featured-h">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">Featured report</div>
            <h2 id="featured-h">The current edition</h2>
          </div>
          <p className="section-note">
            Our flagship long-form analysis — the systems, dependencies and beneficiaries
            behind a single strategic question.
          </p>
        </div>

        <Link href={`/reports/${featured.slug}`} className="featured" aria-label={featured.title}>
          <div className="featured-visual">
            <span className="featured-tag">★ Featured</span>
            {featured.cover ? (
              <img className="featured-cover-img" src={featured.cover} alt={`${featured.title} — cover`} />
            ) : (
              <FeaturedTopology />
            )}
          </div>
          <div className="featured-body">
            <div className="featured-edition">
              <span>{featured.domain}</span>
              <span className="sep">·</span>
              <span>{featured.edition}</span>
              <span className="sep">·</span>
              <span>{featured.readingTime}</span>
            </div>
            <h3>{featured.title}</h3>
            <p className="sub">{featured.subtitle}</p>
            <p className="summary">{featured.summary}</p>
            <div className="featured-foot">
              <span className="btn-ed btn-ed-primary">Read report <span className="arr">→</span></span>
              <span className="label">Published {featured.publishedLabel}</span>
            </div>
          </div>
        </Link>
      </section>

      {/* ── Latest signals ── */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }} aria-labelledby="signals-h">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker"><span className="live" /> Latest signals</div>
            <h2 id="signals-h">Intelligence dispatches</h2>
          </div>
          <Link href="/signals" className="see-all">All signals →</Link>
        </div>

        <div className="signals-grid">
          {signals.map((s) => (
            <Link
              key={s.slug}
              href={`/signals/${s.slug}`}
              className={`signal${s.status === 'placeholder' ? ' signal-placeholder' : ''}`}
            >
              <div className="signal-meta">
                <span className="sig-no">{s.no}</span>
                <span className="sig-domain">{s.domain}</span>
                {s.status === 'live' && (
                  <span className="sig-status"><span className="dot" /> Live</span>
                )}
                {s.status === 'placeholder' && <span className="sig-status" style={{ color: 'var(--text-dim)' }}>Draft</span>}
                <span className="sig-date">{s.dateLabel}</span>
              </div>
              <div className="signal-title">{s.title}</div>
              <p className="signal-excerpt">{s.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── The Atlas ── */}
      <section className="wrap" aria-labelledby="atlas-h">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">The Atlas</div>
            <h2 id="atlas-h">India’s industrial systems, mapped</h2>
          </div>
          <Link href="/research" className="see-all">Open the Atlas →</Link>
        </div>
        <p className="section-note" style={{ maxWidth: '70ch', marginBottom: 24 }}>
          A living, free reference — the players in each ecosystem, what they make, and the
          value-chain layers India still imports.
        </p>
        <div className="atlas-cards">
          {corridorsOrdered.map((c) => {
            const m = meta(c.code);
            const r = rollup(c.id);
            return (
              <Link
                key={c.code}
                href={`/research/dependencies#${m.slug}`}
                className="atlas-card"
                style={{ ['--accent' as string]: m.accent }}
              >
                <div className="atlas-card-head">
                  <h3>{c.label}</h3>
                  <span className="atlas-card-no">{String(c.id).padStart(2, '0')}</span>
                </div>
                <p className="atlas-card-tag">{m.tagline}</p>
                <div className="atlas-card-stats">
                  <span><b>{r.importDependent}</b> of <b>{r.cells}</b> layers import-dependent</span>
                </div>
                <span className="atlas-card-go">View dependency map →</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Strategic briefings ── */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }} aria-labelledby="brief-h">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">Strategic briefings</div>
            <h2 id="brief-h">Executive-ready analysis</h2>
          </div>
          <Link href="/briefings" className="see-all">All briefings →</Link>
        </div>

        <div className="briefings">
          {briefings.map((b) => (
            <Link key={b.title} href={`/briefings/${b.slug}`} className="briefing">
              <span className="briefing-date">{b.date}</span>
              <span className="briefing-title">
                {b.title}
                <span className="b-tag">{b.tag}</span>
              </span>
              <span className="briefing-read">{b.read} →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="wrap-narrow">
        <Newsletter />
      </section>

      {/* ── About the platform ── */}
      <section className="wrap" aria-labelledby="about-h">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">About the platform</div>
            <h2 id="about-h">An independent research lab</h2>
          </div>
          <Link href="/about" className="see-all">Read more →</Link>
        </div>

        <div className="platform-band">
          <p className="pb-statement">
            Techadyant Labs is an independent strategic intelligence platform focused on
            India’s industrial transformation, infrastructure systems and emerging
            strategic technologies.
          </p>
          <div className="pb-body">
            <p>
              We study industrial systems the way analysts study capital markets — as
              interdependent structures with hidden constraints, asymmetric beneficiaries
              and second-order effects. Our work begins where the press release ends.
            </p>
            <p>
              The publication is reader-oriented and independent. We carry no sponsored
              coverage and take no position in the companies and projects we analyse.
            </p>
            <ul className="pb-principles">
              <li>
                <div className="pk">Independent</div>
                <div className="pv">No sponsored coverage, no undisclosed interests.</div>
              </li>
              <li>
                <div className="pk">Systems-level</div>
                <div className="pv">We map dependencies, not just events.</div>
              </li>
              <li>
                <div className="pk">India-first</div>
                <div className="pv">Built around India’s industrial and strategic context.</div>
              </li>
              <li>
                <div className="pk">Long-form</div>
                <div className="pv">Depth over frequency; analysis over aggregation.</div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
