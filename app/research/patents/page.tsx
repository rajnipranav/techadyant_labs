import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { PatentsView } from './PatentsView';
import patentsData from '../_patents.json';

const meta = (patentsData as { meta: { total: number; india: number; byIndustry: unknown[] } }).meta;

export const metadata: Metadata = {
  title: 'India Industrial Patent Atlas — Semiconductors, Drones, Quantum, Batteries',
  description:
    `${meta.total.toLocaleString('en-IN')} patents across India's strategic industries — semiconductors, AI infrastructure, defence electronics, drones, quantum, batteries and critical minerals — mapped into Techadyant Labs' knowledge graph. ${meta.india.toLocaleString('en-IN')} India-origin filings. Filter by industry, search by applicant.`,
  alternates: { canonical: 'https://labs.techadyant.com/research/patents/' },
};

export default function PatentsPage() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'India Industrial Patent Atlas',
    description:
      `A curated dataset of ${meta.total.toLocaleString('en-IN')} patents relevant to India's strategic industries, classified by industry, applicant, technology-readiness and strategic value.`,
    url: 'https://labs.techadyant.com/research/patents/',
    isPartOf: { '@id': 'https://labs.techadyant.com/#website' },
    creator: { '@type': 'Organization', name: 'Techadyant Labs' },
    keywords: [
      'India patents', 'semiconductor patents', 'drone patents', 'quantum patents',
      'battery patents', 'critical minerals patents', 'defence electronics patents',
      'industrial intellectual property', 'Indian Patent Office',
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
          <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)' }}>Patents · India-first</div>
          <h1>Who is patenting India&apos;s industrial future?</h1>
          <p className="lede">
            The patent layer of India&apos;s industrial knowledge graph — {meta.total.toLocaleString('en-IN')} filed
            inventions across semiconductors, AI infrastructure, defence electronics, drones, quantum, batteries and
            critical minerals, mapped to their applicants and technologies and scored for industrial and strategic
            value. {meta.india.toLocaleString('en-IN')} are India-origin filings, drawn from the Indian Patent Office
            journals. Filter by industry or search by applicant. Free to browse.
          </p>
        </div>
      </header>
      <section className="wrap">
        <PatentsView data={patentsData as never} />
      </section>
    </>
  );
}
