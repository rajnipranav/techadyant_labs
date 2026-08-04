import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../../../research/seo';
import { corridors, CLASS_COLOR, CLASS_LABEL } from '../../data';

export const metadata: Metadata = {
  title: 'India’s Industrial Corridors Explained: Map, Nodes & Status [2026]',
  description:
    'Comprehensive guide to India’s 11 National Industrial Corridors under NICDP: DMIC, AKIC, CBIC, VCIC, HNIC, and IMC node developments.',
  alternates: { canonical: `${SITE}/corridors/explainers/industrial-corridors-guide/` },
  openGraph: {
    title: 'India’s Industrial Corridors Explained: Map, Nodes & Status [2026]',
    description:
      'Comprehensive guide to India’s 11 National Industrial Corridors under NICDP: DMIC, AKIC, CBIC, VCIC, HNIC, and IMC node developments.',
    url: `${SITE}/corridors/explainers/industrial-corridors-guide/`,
    type: 'article',
    siteName: 'Techadyant Labs',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'India Industrial Corridors Guide' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India’s Industrial Corridors Explained: Map, Nodes & Status [2026]',
    description:
      'Comprehensive guide to India’s 11 National Industrial Corridors under NICDP: DMIC, AKIC, CBIC, VCIC, HNIC, and IMC node developments.',
    images: ['/og/default.png'],
  },
};

const FAQ_ITEMS = [
  {
    q: 'How many National Industrial Corridors are being developed in India?',
    a: 'India is developing 11 National Industrial Corridors under the National Industrial Corridor Development Programme (NICDP), managed by NICDC and DPIIT.',
  },
  {
    q: 'What is the longest industrial corridor in India?',
    a: 'The Amritsar–Kolkata Industrial Corridor (AKIC) is the longest at 1,839 km, spanning 7 states along the Eastern Dedicated Freight Corridor.',
  },
  {
    q: 'What is the flagship industrial corridor in India?',
    a: 'The Delhi–Mumbai Industrial Corridor (DMIC) is the flagship corridor spanning 1,504 km across 6 states along the Western Dedicated Freight Corridor.',
  },
  {
    q: 'What are Industrial Smart Cities / IMCs?',
    a: 'Industrial Manufacturing Clusters (IMCs) or Industrial Smart Cities are plug-and-play greenfield manufacturing nodes equipped with ICT infrastructure, multi-modal logistics hubs, and pre-cleared industrial plots.',
  },
];

export default function IndustrialCorridorsGuidePage() {
  const crumb = breadcrumb([
    { name: 'Home', path: '/' },
    { name: 'Corridors', path: '/corridors/' },
    { name: 'Explainers', path: '/corridors/explainers/' },
    { name: 'Industrial Corridors Guide', path: '/corridors/explainers/industrial-corridors-guide/' },
  ]);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    name: 'India’s Industrial Corridors Explained: Map, Nodes & Status [2026]',
    description:
      'Comprehensive guide to India’s 11 National Industrial Corridors under NICDP: DMIC, AKIC, CBIC, VCIC, HNIC, and IMC node developments.',
    url: `${SITE}/corridors/explainers/industrial-corridors-guide/`,
    publisher: ORG_REF,
  };

  return (
    <>
      <JsonLd data={[crumb, faqLd, articleLd]} />

      <header className="ed-page-head" style={{ ['--accent' as string]: '#C9A84C' }}>
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/corridors/">Corridors</Link><span className="sep">/</span>
            <span>Corridors Guide</span>
          </div>
          <span className="corr-chip" style={{ color: '#C9A84C' }}>National Strategy</span>
          <h1 style={{ marginTop: 12 }}>India’s Industrial Corridors: Map, Nodes & Infrastructure Guide</h1>
          <p className="lede">
            An independent strategic guide to India’s 11 National Industrial Corridors under the National Industrial
            Corridor Development Programme (NICDP). Discover state coverage, freight connectivity, and smart city nodes.
          </p>
        </div>
      </header>

      <main className="wrap inner" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <div className="prose-container" style={{ maxWidth: 840, margin: '0 auto' }}>
          {/* Quick Summary Grid */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 24, marginBottom: 32 }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: 16 }}>Programme Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div><strong style={{ display: 'block', color: 'var(--fg-dim)', fontSize: '0.85rem' }}>Apex Body</strong>NICDIT / DPIIT (Ministry of Commerce)</div>
              <div><strong style={{ display: 'block', color: 'var(--fg-dim)', fontSize: '0.85rem' }}>Implementation</strong>National Industrial Corridor Dev Corp (NICDC)</div>
              <div><strong style={{ display: 'block', color: 'var(--fg-dim)', fontSize: '0.85rem' }}>Corridors</strong>11 Approved National Corridors</div>
              <div><strong style={{ display: 'block', color: 'var(--fg-dim)', fontSize: '0.85rem' }}>Anchors</strong>Western & Eastern Dedicated Freight Corridors</div>
            </div>
          </div>

          <h2 style={{ fontSize: '1.5rem', marginTop: 32 }}>1. What are India’s National Industrial Corridors?</h2>
          <p>
            India’s National Industrial Corridors represent multi-billion-dollar infrastructure spines designed to transform Greenfield locations into smart industrial cities and logistics hubs.
          </p>
          <p>
            Integrated with the <strong>PM GatiShakti National Master Plan</strong> and the National Logistics Policy, these corridors leverage dedicated freight rail, high-speed expressways, deep-draft seaports, and reliable industrial power to host advanced manufacturing.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: 32 }}>2. The 11 Industrial Corridors at a Glance</h2>
          <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
            {corridors.map((c) => (
              <div key={c.slug} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                    <Link href={`/corridors/${c.slug}/`} style={{ color: 'var(--fg)' }}>{c.name} ({c.abbr})</Link>
                  </h3>
                  <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: 4, background: CLASS_COLOR[c.cls] + '22', color: CLASS_COLOR[c.cls], border: `1px solid ${CLASS_COLOR[c.cls]}44` }}>
                    {CLASS_LABEL[c.cls]}
                  </span>
                </div>
                <p style={{ margin: '8px 0', fontSize: '0.9rem', color: 'var(--fg-dim)' }}>{c.blurb}</p>
                <div style={{ fontSize: '0.85rem', color: 'var(--fg-dim)' }}>
                  <strong>States:</strong> {c.states} | <strong>Length:</strong> {c.length}
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '1.5rem', marginTop: 40 }}>3. Anchor Industrial Nodes & Smart Cities</h2>
          <p>
            Key greenfield smart industrial cities operational or progressing across these corridors include:
          </p>
          <ul style={{ lineHeight: 1.7 }}>
            <li><strong>Dholera Special Investment Region (SIR), Gujarat (DMIC):</strong> India’s premier semiconductor and heavy manufacturing smart city.</li>
            <li><strong>AURIC (Shendra–Bidkin), Maharashtra (DMIC):</strong> Operational smart industrial city near Chhatrapati Sambhajinagar.</li>
            <li><strong>Greater Noida MMLH/IITGN, Uttar Pradesh (DMIC/AKIC):</strong> Integrated industrial township and multi-modal logistics hub at Dadri.</li>
            <li><strong>Tumakuru Industrial Township, Karnataka (CBIC):</strong> South India’s major electronic & defense manufacturing activation hub.</li>
            <li><strong>Khurpia & Rajpura Nodes (AKIC):</strong> Emerging industrial nodes in Uttarakhand and Punjab along the Eastern DFC.</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', marginTop: 40 }}>Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16 }}>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 8px 0' }}>{item.q}</h3>
                <p style={{ margin: 0, color: 'var(--fg-dim)', lineHeight: 1.6 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
