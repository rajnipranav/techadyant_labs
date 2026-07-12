import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { PatentsView } from './PatentsView';
import patentsData from '../_patents.json';

const meta = (patentsData as { meta: { total: number; distinctApplicants: number; latestJournal: string; byIndustry: unknown[] } }).meta;

export const metadata: Metadata = {
  title: "India Strategic-Technology Patent Monitor — Who's Filing in Semiconductors, AI, Quantum",
  description:
    `A live monitor of ${meta.total.toLocaleString('en-IN')} Indian patent filings across strategic industries — semiconductors, AI infrastructure, defence electronics, drones, quantum, batteries and critical minerals — compiled from the Indian Patent Office weekly journals and mapped by sector and applicant. See which institutions and companies are patenting India's industrial future.`,
  alternates: { canonical: 'https://labs.techadyant.com/research/patents/' },
};

export default function PatentsPage() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'India Strategic-Technology Patent Monitor',
    description:
      `A curated monitor of ${meta.total.toLocaleString('en-IN')} Indian patent filings in strategic industries, drawn from the Indian Patent Office weekly journals and classified by sector and applicant.`,
    url: 'https://labs.techadyant.com/research/patents/',
    isPartOf: { '@id': 'https://labs.techadyant.com/#website' },
    creator: { '@type': 'Organization', name: 'Techadyant Labs' },
    spatialCoverage: { '@type': 'Country', name: 'India' },
    isBasedOn: 'Indian Patent Office weekly patent journals',
    keywords: [
      'India patents', 'Indian Patent Office', 'semiconductor patents India', 'drone patents India',
      'quantum patents India', 'battery patents India', 'critical minerals patents',
      'defence electronics patents', 'strategic technology patenting India',
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <AtlasNav />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">The Atlas</Link><span className="sep">/</span><span>Patents</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)' }}>Patent Monitor · India-only</div>
          <h1>Who is patenting India&apos;s industrial future?</h1>
          <p className="lede">
            A monitor of {meta.total.toLocaleString('en-IN')} Indian patent filings across the strategic industries we
            track — semiconductors, AI infrastructure, defence electronics, drones, quantum, batteries and critical
            minerals. Every record is an India-origin filing compiled from the Indian Patent Office weekly journals,
            classified by sector and traced to its applicant. Not another patent search — a view of which institutions
            and companies are building India&apos;s technology base, and where. Free to browse.
          </p>
        </div>
      </header>
      <section className="wrap">
        <PatentsView data={patentsData as never} />
      </section>
    </>
  );
}
