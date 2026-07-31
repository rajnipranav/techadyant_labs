import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../seo';
import { charts, sections, palette, chartById } from './data';

export const metadata: Metadata = {
  title: 'Critical Manufacturing Dependencies — India’s import dependence, mapped',
  alternates: { canonical: `${SITE}/research/critical-manufacturing-dependencies/` },
  description: 'A chart-first intelligence dashboard for India’s critical manufacturing dependencies: import surface, dependency indices, sector deep dives, cluster geography, localization timelines, and investment opportunity.',
};

const lede =
  'A living view of where India remains strategically dependent on imports, how that is changing, and where the next industrial opportunity surfaces are emerging. Built from the 2026 Techadyant CMD dataset: 30 charts, sector decompositions, and a localization roadmap through 2035.';

function SectionCharts({ section }: { section: (typeof sections)[number] }) {
  return (
    <section className="wrap" style={{ background: 'var(--bg-2)' }}>
      <div className="section-head-ed">
        <div>
          <div className="ed-kicker">{section.title}</div>
          <h2>{section.title}</h2>
        </div>
        <p className="section-note">{section.body}</p>
      </div>
      <div className="cmd-chart-grid">
        {section.charts.map((chart) => (
          <Link key={chart.id} href={chart.svgPath} className="cmd-chart-card" title={chart.description}>
            <span className="cmd-chart-id">{chart.filename.replace('_', ' ')}</span>
            <strong className="cmd-chart-title">{chart.title}</strong>
            <span className="cmd-chart-chapter">{chart.chapter}</span>
            <span className="cmd-chart-cta">Open chart →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function CmdDashboard() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'The Atlas', path: '/research/' },
            { name: 'Critical Manufacturing Dependencies', path: '/research/critical-manufacturing-dependencies/' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Critical Manufacturing Dependencies — Techadyant Labs',
            url: `${SITE}/research/critical-manufacturing-dependencies/`,
            isPartOf: { '@id': `${SITE}/#website` },
            publisher: ORG_REF,
            about: [
              'India manufacturing dependency',
              'India import dependence',
              'India semiconductor supply chain',
              'Make in India localization',
              'India industrial opportunity',
            ],
          },
        ]}
      />

      <AtlasNav />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/research/">The Atlas</Link>
            <span className="sep">/</span>
            <span>Critical Manufacturing Dependencies</span>
          </div>
          <h1>Critical Manufacturing Dependencies</h1>
          <p className="lede">{lede}</p>
          <div className="cmd-meta-row">
            <span>
              <b>{charts.length}</b> charts
            </span>
            <span>
              <b>{sections.length}</b> sections
            </span>
            <span>
              <b>2026</b> edition
            </span>
          </div>
        </div>
      </header>

      {/* Quick-links */}
      <section className="wrap">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">Start here</div>
            <h2>Jump to a section</h2>
          </div>
          <p className="section-note">Each section is chart-first. Use the datasets below as the operating system for manufacturing intelligence.</p>
        </div>
        <div className="atlas-paths">
          {sections.map((s) => (
            <Link key={s.id} href={`#${s.id}`} className="atlas-path">
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <span className="atlas-card-go">{s.charts.length} charts →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Section chart cards */}
      {sections.map((s) => (
        <SectionCharts key={s.id} section={s} />
      ))}

      {/* Integration note */}
      <section className="wrap">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">Integration</div>
            <h2>How to use this section</h2>
          </div>
          <p className="section-note">
            Use this as the dependency-intelligence layer for the rest of the Atlas. In time this becomes the sharable index
            for Signals, Pillars, Companies, and Research Reports. Report publishing is pending polish and refinement.
          </p>
        </div>
        <div className="atlas-dbs">
          <Link href="/research/pillars/" className="atlas-db">
            <h3>Pillar maps</h3>
            <p>Open the system-map view for semiconductors, critical minerals, defence, AI infrastructure, and enterprise software.</p>
            <span className="atlas-card-go">Open pillar maps →</span>
          </Link>
          <Link href="/signals/" className="atlas-db">
            <h3>Signals</h3>
            <p>Read time-stamped dependency impacts: policy moves, factory announcements, and supply-chain shifts.</p>
            <span className="atlas-card-go">Open signals →</span>
          </Link>
          <Link href="/reports/" className="atlas-db">
            <h3>Research Reports</h3>
            <p>See the full strategic-intelligence library once publishing is complete.</p>
            <span className="atlas-card-go">Browse reports →</span>
          </Link>
        </div>
      </section>
    </>
  );
}
