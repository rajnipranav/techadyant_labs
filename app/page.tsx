import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroCanvas } from './components/HeroCanvas';
import { CorridorMap } from './corridors/CorridorMap';
import { corridors as nicdpCorridors } from './corridors/data';
import { Newsletter } from './components/Newsletter';
import { FeaturedTopology } from './components/ThemeIcon';
import { reports } from './reports/data';
import { signals } from './signals/data';
import { corridorsOrdered, meta, rollup } from './research/atlas';
import { EXTRA_ECOSYSTEMS, ExtraEcosystemCardSimple } from './research/extra-ecosystems';
import { briefings as allBriefings } from './briefings/data';
import { allCorridorNodePairs } from './corridors/node-data';
import { issues as newsletterIssues } from './newsletter/data';

export const metadata: Metadata = {
  title: 'Strategic intelligence on India’s industrial systems',
  description:
    'Independent, India-first strategic research on industrial transformation, infrastructure systems, semiconductors, AI infrastructure and second-order economic change — with living surfaces: national corridor maps, import-dependency atlases and a monthly strategic brief.',
  alternates: { canonical: 'https://labs.techadyant.com/' },
};

// RULE: the home page always features the newest PUBLISHED report (by published date).
// `reports` is CMS-generated at build, so publishing a new report auto-updates this on
// the next deploy — no manual change needed. Falls back to the first entry if none are
// yet published.
const featured =
  [...reports]
    .filter((r) => r.status === 'published')
    .sort((a, b) => (b.published || '').localeCompare(a.published || ''))[0] ?? reports[0];
const briefings = allBriefings.slice(0, 3);

// Latest signals for the homepage "Intelligence dispatches" grid.
const latestSignals = [...signals]
  .filter((s) => s.status === 'live')
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  .slice(0, 6);

// ── Platform-wide numbers (auto-derived from data modules; never stale) ──
const corridorsCount = nicdpCorridors.length;
const nodesCount = allCorridorNodePairs().length;
const ecosystemsCount = corridorsOrdered.length + EXTRA_ECOSYSTEMS.length;
const liveSignalsCount = signals.filter((s) => s.status === 'live').length;
const reportCount = reports.length;
const depLayersCount = corridorsOrdered.reduce(
  (acc, c) => acc + (rollup(c.id)?.importDependent ?? 0), 0);
const latestIssue = [...newsletterIssues].filter((i) => i.status === 'live')[0] ?? newsletterIssues[0];

const PLATFORM: { k: string; href: string; n: string; l: string }[] = [
  { k: 'Reports', href: '/reports/', n: `${reportCount}`, l: 'Long-form research + executive summaries, one strategic question at a time.' },
  { k: 'Corridors', href: '/corridors/', n: `${corridorsCount} · ${nodesCount}`, l: 'National corridors, node dossiers, satellite GIS maps and opportunity surfaces.' },
  { k: 'Atlas', href: '/research/', n: `${ecosystemsCount}`, l: 'A free interactive map of India’s industrial ecosystems, players and import layers.' },
  { k: 'Dependencies', href: '/research/dependencies/', n: `${depLayersCount}`, l: 'Import-dependency layers — what India still imports, ecosystem by ecosystem.' },
  { k: 'Signals', href: '/signals/', n: `${liveSignalsCount}`, l: 'Compact, information-dense dispatches on structural change as it happens.' },
  { k: 'Sanket', href: '/newsletter/', n: 'monthly', l: 'The monthly strategic-intelligence brief, distilled from the signal engine.' },
  { k: 'Services', href: '/services/', n: 'DPR-ready', l: 'Commissioned research, investment-grade DPRs, briefings and licensing.' },
];

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
            Independent, long-form research on industrial infrastructure, semiconductors and
            AI infrastructure — plus living intelligence surfaces: national corridor maps,
            import-dependency atlases and a monthly strategic brief. Built for people who
            need to understand systems, not headlines.
          </p>

          <div className="ed-hero-actions">
            <Link href={`/reports/${featured.slug}/`} className="btn-ed btn-ed-primary">
              Read the featured report <span className="arr">→</span>
            </Link>
            <Link href="/corridors/" className="btn-ed btn-ed-ghost">
              Explore corridors <span className="arr">→</span>
            </Link>
          </div>

          <div className="ed-hero-links">
            <Link href="/signals/">Signals</Link><span className="sep">·</span>
            <Link href="/research/">Atlas</Link><span className="sep">·</span>
            <Link href="/services/">Commission research</Link>
          </div>
        </div>

        <div className="ed-hero-meta">
          <div>
            <div className="m-k">Focus</div>
            <div className="m-v">Industrial systems & infrastructure</div>
          </div>
          <div>
            <div className="m-k">Surfaces</div>
            <div className="m-v">Reports · Corridors · Atlas · Signals</div>
          </div>
          <div>
            <div className="m-k">Orientation</div>
            <div className="m-v">India-first · independent</div>
          </div>
          <div>
            <div className="m-k">Cadence</div>
            <div className="m-v">Reports · Signals · Sanket monthly</div>
          </div>
        </div>
      </section>

      {/* ── The platform (breadth at first sight) ── */}
      <section className="wrap" style={{ paddingTop: 30 }} aria-labelledby="platform-h">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">The platform</div>
            <h2 id="platform-h">Seven surfaces, one intelligence stack</h2>
          </div>
          <p className="section-note">Long-form research, living maps, dispatches and commissioned work — everything the lab produces, in one place.</p>
        </div>
        <div className="platform-strip">
          {PLATFORM.map((p) => (
            <Link key={p.k} href={p.href} className="platform-card">
              <div className="pc-head"><span className="pc-k">{p.k}</span><span className="pc-n">{p.n}</span></div>
              <p className="pc-l">{p.l}</p>
              <span className="pc-go">Open <span className="arr">→</span></span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── By the numbers (platform-wide) ── */}
      <section className="wrap" style={{ paddingTop: 6, paddingBottom: 10 }} aria-label="Platform by the numbers">
        <div className="home-stats">
          {[
            { n: `${corridorsCount}`, l: 'National corridors', href: '/corridors/' },
            { n: `${nodesCount}`, l: 'Deep-researched nodes', href: '/corridors/' },
            { n: `${liveSignalsCount}`, l: 'Live signals', href: '/signals/' },
            { n: `${ecosystemsCount}`, l: 'Ecosystems in the Atlas', href: '/research/' },
            { n: `${depLayersCount}`, l: 'Import-dependent layers', href: '/research/dependencies/' },
            { n: `${reportCount}`, l: 'Report editions', href: '/reports/' },
          ].map((s, i) => (
            <Link key={s.l} href={s.href} className="home-stat" style={{ borderLeft: i === 0 ? 'none' : undefined }}>
              <div className="hs-n">{s.n}</div>
              <div className="hs-l">{s.l} <span className="arr">→</span></div>
            </Link>
          ))}
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

        <Link href={`/reports/${featured.slug}/`} className="featured" aria-label={featured.title}>
          <div className="featured-visual">
            <span className="featured-tag">★ Featured</span>
            {featured.cover ? (
              <img className="featured-cover-img" src={featured.cover} alt={`${featured.title} — cover`} loading="lazy" decoding="async" />
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

      {/* ── Corridors teaser ── */}
      <section className="wrap" aria-labelledby="corr-h">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">Corridors intelligence</div>
            <h2 id="corr-h">India’s industrial corridors, mapped to the node</h2>
          </div>
          <Link href="/corridors/" className="see-all">Open the corridors map →</Link>
        </div>
        <div className="corr-teaser">
          <div className="corr-teaser-map">
            <CorridorMap navigate={false} />
          </div>
          <div className="corr-teaser-body">
            <p>
              The lab’s most interactive surface: all {corridorsCount} national industrial corridors and{' '}
              {nodesCount} deep-researched nodes on satellite GIS maps — with opportunity maps for Dholera,
              AURIC, IITGNL and Tumakuru, a state filter, an 11×9 comparison table and a full dataset export.
            </p>
            <div className="corr-teaser-stats">
              <span><b>{corridorsCount}</b> corridors</span>
              <span><b>{nodesCount}</b> deep nodes</span>
              <span><b>4</b> opportunity maps</span>
              <span><b>CSV</b> dataset export</span>
            </div>
            <Link href="/corridors/" className="btn-ed btn-ed-primary">Explore the corridors <span className="arr">→</span></Link>
          </div>
        </div>
      </section>

      {/* ── Latest signals ── */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }} aria-labelledby="signals-h">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker"><span className="live" /> Latest signals</div>
            <h2 id="signals-h">Intelligence dispatches</h2>
          </div>
          <Link href="/signals/" className="see-all">All signals →</Link>
        </div>

        <div className="signals-grid">
          {latestSignals.map((s) => (
            <Link
              key={s.slug}
              href={`/signals/${s.slug}/`}
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

      {/* ── Dependencies heatmap teaser ── */}
      <section className="wrap" aria-labelledby="dep-h">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">Dependencies</div>
            <h2 id="dep-h">The layers India still imports</h2>
          </div>
          <Link href="/research/dependencies/" className="see-all">Open the dependency atlas →</Link>
        </div>
        <p className="section-note" style={{ maxWidth: '70ch', marginBottom: 20 }}>
          For each ecosystem the Atlas tracks, how many value-chain layers are import-dependent.
          The bars are live data from the rollup — the longer the bar, the thinner India’s ownership.
        </p>
        <div className="dep-heat">
          {corridorsOrdered.map((c) => {
            const m = meta(c.code);
            const r = rollup(c.id);
            const pct = r.cells ? Math.round((r.importDependent / r.cells) * 100) : 0;
            return (
              <Link key={c.code} href={`/research/dependencies/#${m.slug}`} className="dep-row" style={{ ['--accent' as string]: m.accent }}>
                <span className="dep-name">{c.label}</span>
                <span className="dep-bar"><i style={{ width: `${pct}%`, background: m.accent }} /></span>
                <span className="dep-num">{r.importDependent}/{r.cells} layers</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── The Atlas ── */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }} aria-labelledby="atlas-h">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">The Atlas</div>
            <h2 id="atlas-h">India’s industrial systems, mapped</h2>
          </div>
          <Link href="/research/" className="see-all">Open the Atlas →</Link>
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
                href={`/research/dependencies/#${m.slug}`}
                className="atlas-card"
                style={{ ['--accent' as string]: m.accent }}
              >
                <div className="atlas-card-head">
                  <h3>{c.label}</h3>
                </div>
                <p className="atlas-card-tag">{m.tagline}</p>
                <div className="atlas-card-stats">
                  <span><b>{r.importDependent}</b> of <b>{r.cells}</b> layers import-dependent</span>
                </div>
                <span className="atlas-card-go">View dependency map →</span>
              </Link>
            );
          })}
          {EXTRA_ECOSYSTEMS.map((e) => <ExtraEcosystemCardSimple key={e.key} e={e} />)}
        </div>
      </section>

      {/* ── Strategic briefings ── */}
      <section className="wrap" aria-labelledby="brief-h">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">Strategic briefings</div>
            <h2 id="brief-h">Executive-ready analysis</h2>
          </div>
          <Link href="/briefings/" className="see-all">All briefings →</Link>
        </div>

        <div className="briefings">
          {briefings.map((b) => (
            <Link key={b.title} href={`/briefings/${b.slug}/`} className="briefing">
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

      {/* ── Services ── */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }} aria-labelledby="svc-h">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">Services</div>
            <h2 id="svc-h">The lab, commissioned</h2>
          </div>
          <Link href="/services/" className="see-all">All services →</Link>
        </div>
        <div className="svc-band">
          <Link href="/services/" className="svc-card">
            <div className="svc-k">Bespoke research</div>
            <p>Market &amp; ecosystem mapping, supply-chain dependency analysis, policy and beneficiary assessment — aimed at your decision.</p>
            <span className="svc-go">Commission research →</span>
          </Link>
          <Link href="/services/" className="svc-card">
            <div className="svc-k">Detailed Project Reports</div>
            <p>Investment- and approval-grade DPRs for technology, industrial and strategic projects — sourced, structured for lenders and government counterparts.</p>
            <span className="svc-go">Commission a DPR →</span>
          </Link>
          <Link href="/engage/" className="svc-card">
            <div className="svc-k">Briefings &amp; licensing</div>
            <p>Executive strategic briefings on demand, plus licensing of the Atlas, corridor datasets and report content.</p>
            <span className="svc-go">Engage the lab →</span>
          </Link>
        </div>
      </section>

      {/* ── Sanket spotlight ── */}
      <section className="wrap" aria-labelledby="sanket-h">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">Sanket · monthly</div>
            <h2 id="sanket-h">The strategic-intelligence brief</h2>
          </div>
          <Link href="/newsletter/" className="see-all">All issues →</Link>
        </div>
        <div className="sanket-spot">
          {latestIssue && (
            <Link href={`/newsletter/${latestIssue.slug}/`} className="sanket-issue" aria-label={`Read Sanket ${latestIssue.no}: ${latestIssue.title}`}>
              <img src={latestIssue.cover} alt={`${latestIssue.no} cover — ${latestIssue.title}`} loading="lazy" decoding="async" />
              <span className="sanket-issue-shade" aria-hidden="true" />
              <span className="sanket-issue-body">
                <span className="si-badge">{latestIssue.no} · {latestIssue.month} · {latestIssue.readingTime}</span>
                <span className="si-title">{latestIssue.title}</span>
                <span className="si-stand">{latestIssue.standfirst}</span>
                <span className="si-cta">Read the issue <span className="arr">→</span></span>
              </span>
            </Link>
          )}
          <div className="sanket-signup">
            <p className="ss-lead">One issue a month. The few signals that move the board — semiconductors, AI infrastructure, critical minerals, defence.</p>
            <Newsletter />
          </div>
        </div>
      </section>

      {/* ── About the platform ── */}
      <section className="wrap" aria-labelledby="about-h">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">About the platform</div>
            <h2 id="about-h">An independent research lab</h2>
          </div>
          <Link href="/about/" className="see-all">Read more →</Link>
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
