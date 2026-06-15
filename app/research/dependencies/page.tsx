import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { DependenciesView } from './DependenciesView';
import { corridorsOrdered, meta, atlas, STATUS_COLORS, STATUS_SHORT } from '../atlas';
import { DownloadGate } from '../DownloadGate';
import { JsonLd, breadcrumb, faqLd, datasetLd, corridorFaq, SITE } from '../seo';

export const metadata: Metadata = {
  title: 'Import Dependency Map — what India still imports',
  alternates: { canonical: `${SITE}/research/dependencies/` },
  description:
    'India’s strategic ecosystems scored across every value-chain layer, 0–5 from import-dependent to sovereign, with the rationale and source behind each assessment.',
};

export default function DependenciesPage() {
  const corridors = corridorsOrdered.map((c) => ({
    id: c.id, code: c.code, label: c.label, slug: meta(c.code).slug, accent: meta(c.code).accent,
  }));

  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' }, { name: 'Import Dependencies', path: '/research/dependencies/' }]),
        datasetLd({
          name: 'India Industrial Import-Dependency Assessments',
          description: 'Capture-status assessments (0 import-dependent → 5 sovereign) across the value chain of India’s semiconductor, critical-minerals, AI-infrastructure, defence and enterprise-software ecosystems.',
          path: '/research/dependencies/',
          keywords: ['India import dependency', 'semiconductor supply chain', 'critical minerals', 'AI infrastructure', 'defence indigenisation', 'enterprise software sovereignty'],
          csv: ['/data/atlas/dependency-grid.csv', '/data/atlas/players.csv'],
        }),
        faqLd(corridorsOrdered.flatMap((c) => corridorFaq(c.id))),
      ]} />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">Atlas</Link><span className="sep">/</span><span>Import Dependencies</span>
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
        <DownloadGate />
      </section>
    </>
  );
}
