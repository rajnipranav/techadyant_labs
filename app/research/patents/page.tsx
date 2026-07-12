import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { PatentsView } from './PatentsView';

export const metadata: Metadata = {
  title: 'Patents — The Atlas',
  description:
    "India's industrial patent landscape — semiconductors, drones, quantum, batteries and telecom — mapped into Techadyant Labs' knowledge graph, filterable by industry and applicant.",
  alternates: { canonical: 'https://labs.techadyant.com/research/patents/' },
};

export default function PatentsPage() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'India industrial patents — The Atlas',
    url: 'https://labs.techadyant.com/research/patents/',
    isPartOf: { '@id': 'https://labs.techadyant.com/#website' },
    about: ['India patents', 'semiconductor patents', 'drone patents', 'quantum patents', 'industrial intellectual property'],
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
            The patent layer of India&apos;s industrial knowledge graph — filed inventions in
            semiconductors, drones, quantum, batteries and telecom, mapped to their applicants and
            technologies. Ingested weekly from public patent records; filter by industry or search by
            applicant. Free to browse.
          </p>
        </div>
      </header>
      <section className="wrap">
        <PatentsView />
      </section>
    </>
  );
}
