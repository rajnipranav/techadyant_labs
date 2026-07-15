import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { DronesView } from './DronesView';
import dronesData from '../_drones.json';

const meta = (dronesData as { meta: { platforms: number; companies: number; indianCompanies: number; procurementInrCr: number; agencies: number } }).meta;
const inr = `₹${Math.round(meta.procurementInrCr).toLocaleString('en-IN')} crore`;

export const metadata: Metadata = {
  title: 'India Drone & UAS Ecosystem — Platforms, Makers, Procurement, Dependencies',
  description:
    `A living map of India’s unmanned aerial systems: ${meta.platforms} platforms, ${meta.companies} companies, ${inr} of disclosed procurement across ${meta.agencies} operators, plus components, import dependencies and opportunity surfaces. Free from Techadyant Labs.`,
  alternates: { canonical: 'https://labs.techadyant.com/research/drones-uas/' },
};

export default function DronesPage() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'India Unmanned Aerial Systems (UAS) Ecosystem',
    description:
      `A curated map of India’s drone ecosystem — ${meta.platforms} platforms, ${meta.companies} companies, disclosed government procurement, components, import dependencies and opportunity surfaces.`,
    url: 'https://labs.techadyant.com/research/drones-uas/',
    isPartOf: { '@id': 'https://labs.techadyant.com/#website' },
    creator: { '@type': 'Organization', name: 'Techadyant Labs' },
    spatialCoverage: { '@type': 'Country', name: 'India' },
    keywords: [
      'India drones', 'India UAS', 'drone manufacturers India', 'drone procurement India',
      'UAV platforms India', 'loitering munitions India', 'drone components import dependency',
      'India defence drones', 'drone ecosystem India',
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
            <Link href="/research/">The Atlas</Link><span className="sep">/</span><span>Unmanned Systems</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)' }}>Unmanned Systems · India</div>
          <h1>Who flies, builds and buys India&apos;s drones?</h1>
          <p className="lede">
            A living map of India&apos;s unmanned aerial systems — {meta.platforms} platforms, {meta.companies} companies,
            {' '}{inr} of disclosed procurement across {meta.agencies} operators, and the components, import dependencies and
            opportunity surfaces beneath them. The free surface of Techadyant&apos;s drone research programme. Free to browse.
          </p>
        </div>
      </header>
      <section className="wrap">
        <DronesView data={dronesData as never} />
      </section>
    </>
  );
}
