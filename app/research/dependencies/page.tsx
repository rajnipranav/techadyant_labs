import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { DependenciesView } from './DependenciesView';
import { corridorsOrdered, meta, atlas, STATUS_COLORS, STATUS_SHORT, lastUpdated } from '../atlas';

export const metadata: Metadata = {
  title: 'Import Dependency Map — what India still imports',
  description:
    'India’s strategic ecosystems scored across every value-chain layer, 0–5 from import-dependent to sovereign, with the rationale and source behind each assessment.',
};

export default function DependenciesPage() {
  const corridors = corridorsOrdered.map((c) => ({
    id: c.id, code: c.code, label: c.label, slug: meta(c.code).slug, accent: meta(c.code).accent,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'India Industrial Import-Dependency Assessments',
    description:
      'Capture-status assessments (0–5) across the value chain of India’s semiconductor, critical-minerals, AI-infrastructure, defence and enterprise-software ecosystems.',
    creator: { '@type': 'Organization', name: 'Techadyant Labs' },
    dateModified: lastUpdated,
    variableMeasured: 'Value-chain capture status (0 import-dependent → 5 sovereign)',
    isAccessibleForFree: true,
  };

  return (
    <>
      <AtlasNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research">Atlas</Link><span className="sep">/</span><span>Import Dependencies</span>
          </div>
          <h1>Import Dependency Map</h1>
          <p className="lede">
            Where does India actually stand? Each ecosystem is scored across its value chain on a
            0–5 scale — from total import-dependence to sovereign capability. Open any layer for the
            rationale and the source. This is the map of what India still buys from abroad, and where
            the gaps are closing.
          </p>
        </div>
      </header>

      <section className="wrap">
        <DependenciesView corridors={corridors} grid={atlas.grid} colors={STATUS_COLORS} short={STATUS_SHORT} />
      </section>

      <section className="wrap-narrow">
        <div className="atlas-gate">
          <div className="ed-kicker">Take it with you</div>
          <h2>Download the dependency grids</h2>
          <p>
            Get every ecosystem’s value-chain assessment as a one-page PDF, plus the underlying data
            as CSV — free, in exchange for an email. We’ll tell you when a score changes.
          </p>
          <Link href="/#subscribe" className="btn-ed btn-ed-primary">Get the download <span className="arr">→</span></Link>
          <p className="atlas-gate-fine">Free · no spam · unsubscribe anytime</p>
        </div>
      </section>
    </>
  );
}
