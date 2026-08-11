import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../../AtlasNav';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../../seo';

export const metadata: Metadata = {
  title: 'OSCOM Odisha & IREL Mineral Sands: Map, Monazite & Rare Earth Operations',
  description:
    'Complete guide to IREL’s Odisha Sands Complex (OSCOM) in Chhatrapur, Odisha. Maps mineral sands processing, monazite refining, titanium dioxide, and India’s rare earths supply chain.',
  alternates: { canonical: `${SITE}/research/explainers/oscom-odisha/` },
  openGraph: {
    title: 'OSCOM Odisha & IREL Mineral Sands: Map, Monazite & Rare Earth Operations',
    description:
      'Complete guide to IREL’s Odisha Sands Complex (OSCOM) in Chhatrapur, Odisha. Maps mineral sands processing, monazite refining, titanium dioxide, and India’s rare earths supply chain.',
    url: `${SITE}/research/explainers/oscom-odisha/`,
    type: 'article',
    siteName: 'Techadyant Labs',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'OSCOM Odisha & IREL Operations' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OSCOM Odisha & IREL Mineral Sands: Map, Monazite & Rare Earth Operations',
    description:
      'Complete guide to IREL’s Odisha Sands Complex (OSCOM) in Chhatrapur, Odisha. Maps mineral sands processing, monazite refining, titanium dioxide, and India’s rare earths supply chain.',
    images: ['/og/default.png'],
  },
};

const FAQ_ITEMS = [
  {
    q: 'What is OSCOM Odisha?',
    a: 'OSCOM stands for Odisha Sands Complex, the flagship industrial plant of IREL (India) Limited located at Chhatrapur in Ganjam district, Odisha. It processes coastal beach sand minerals including ilmenite, rutile, zircon, monazite, sillimanite, and garnet.',
  },
  {
    q: 'What does OSCOM produce?',
    a: 'OSCOM produces mineral sand concentrates (ilmenite, rutile, zircon, garnet, sillimanite), synthetic rutile (for titanium dioxide and titanium sponge production), and processes monazite to extract strategic rare earth compounds, thorium, and uranium.',
  },
  {
    q: 'Why is monazite processing at OSCOM strategic for India?',
    a: 'Monazite is the primary ore containing light rare earth elements (neodymium, praseodymium, lanthanum, cerium) and thorium. Because monazite is radioactive, its extraction and processing are legally restricted to state PSUs like IREL. OSCOM anchors India’s domestic rare earths and atomic minerals supply chain.',
  },
  {
    q: 'Where is OSCOM located?',
    a: 'OSCOM is situated at Matikhalo near Chhatrapur in Ganjam district, Odisha, approximately 150 km south of Bhubaneswar, along the mineral-rich Bay of Bengal coast.',
  },
];

export default function OscomOdishaPage() {
  const crumb = breadcrumb([
    { name: 'Home', path: '/' },
    { name: 'The Atlas', path: '/research/' },
    { name: 'Explainers', path: '/research/explainers/' },
    { name: 'OSCOM Odisha', path: '/research/explainers/oscom-odisha/' },
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
    name: 'OSCOM Odisha & IREL Mineral Sands: Map, Monazite & Rare Earth Operations',
    description:
      'Complete guide to IREL’s Odisha Sands Complex (OSCOM) in Chhatrapur, Odisha. Maps mineral sands processing, monazite refining, titanium dioxide, and India’s rare earths supply chain.',
    url: `${SITE}/research/explainers/oscom-odisha/`,
    publisher: ORG_REF,
    about: [
      'IREL India Limited',
      'OSCOM Odisha',
      'monazite processing',
      'mineral sands',
      'ilmenite',
      'rare earth elements',
    ],
  };

  return (
    <>
      <AtlasNav />
      <JsonLd data={[crumb, faqLd, articleLd]} />

      <header className="ed-page-head" style={{ ['--accent' as string]: '#2BC5B4' }}>
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">Atlas</Link><span className="sep">/</span>
            <span>OSCOM Odisha Explainer</span>
          </div>
          <span className="corr-chip" style={{ color: '#2BC5B4' }}>Strategic Mineral Node</span>
          <h1 style={{ marginTop: 12 }}>OSCOM Odisha: IREL’s Mineral Sands & Monazite Refining Hub</h1>
          <p className="lede">
            The Odisha Sands Complex (OSCOM) at Chhatrapur, Ganjam is India’s flagship coastal mineral separation plant
            and the strategic nerve center of IREL (India) Limited. Here is how OSCOM processes beach sands into
            ilmenite, synthetic rutile, monazite, and rare earths.
          </p>
        </div>
      </header>

      <main className="wrap inner" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <div className="prose-container" style={{ maxWidth: 840, margin: '0 auto' }}>
          {/* Key Facts Summary */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 24, marginBottom: 32 }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: 16 }}>OSCOM at a Glance</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div><strong style={{ display: 'block', color: 'var(--fg-dim)', fontSize: '0.85rem' }}>Operator</strong>IREL (India) Limited (DAE PSU)</div>
              <div><strong style={{ display: 'block', color: 'var(--fg-dim)', fontSize: '0.85rem' }}>Location</strong>Chhatrapur, Ganjam, Odisha</div>
              <div><strong style={{ display: 'block', color: 'var(--fg-dim)', fontSize: '0.85rem' }}>Primary Ores</strong>Beach Heavy Minerals (BHM)</div>
              <div><strong style={{ display: 'block', color: 'var(--fg-dim)', fontSize: '0.85rem' }}>Strategic Outputs</strong>Monazite, Ilmenite, Synthetic Rutile, Rare Earths</div>
            </div>
          </div>

          <h2 style={{ fontSize: '1.5rem', marginTop: 32 }}>1. What is OSCOM?</h2>
          <p>
            OSCOM stands for the <strong>Odisha Sands Complex</strong>, a unit of <strong>IREL (India) Limited</strong> (formerly Indian Rare Earths Limited), a Central Public Sector Undertaking under the Department of Atomic Energy (DAE).
          </p>
          <p>
            Located near Chhatrapur along the Bay of Bengal coastline in southern Odisha, OSCOM is designed to extract, separate, and refine heavy minerals present in coastal sand deposits. The Ganjam beach sand deposit is one of the richest heavy mineral reserves in India.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: 32 }}>2. The Mineral Separation Process & Output Portfolio</h2>
          <p>
            The raw beach sand dredged from coastal deposits undergoes physical separation utilizing magnetic, electrostatic, and gravity methods to produce individual mineral fractions:
          </p>
          <ul style={{ lineHeight: 1.7 }}>
            <li><strong>Ilmenite (FeTiO3):</strong> The primary raw material for titanium dioxide (TiO2) pigment and synthetic rutile production. OSCOM produces hundreds of thousands of tonnes of ilmenite annually.</li>
            <li><strong>Rutile (TiO2):</strong> High-grade natural rutile used in welding electrodes, titanium metal production, and high-performance alloys.</li>
            <li><strong>Monazite:</strong> A phosphate mineral rich in Rare Earth Elements (REEs), thorium, and small amounts of uranium. Monazite is legally restricted under India’s Atomic Energy Act.</li>
            <li><strong>Zircon (ZrSiO4):</strong> Essential for ceramics, foundry sand, refractory materials, and nuclear-grade zirconium metal.</li>
            <li><strong>Sillimanite & Garnet:</strong> Used in refractories, industrial abrasives, and waterjet cutting.</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', marginTop: 32 }}>3. Why Monazite Processing Makes OSCOM a Strategic Asset</h2>
          <p>
            Monazite is India’s main indigenous source of light rare earth elements (including Neodymium, Praseodymium, Lanthanum, and Cerium). Because of its radioactive thorium content, private entities are prohibited from processing monazite.
          </p>
          <p>
            At OSCOM’s specialized Monazite Processing Plant (MoPP), monazite is chemically cracked to produce rare earth chloride, which is then further refined into individual high-purity rare earth oxide and metal compounds. This makes OSCOM indispensable for India’s permanent magnet industry, EV motors, wind power generators, and defense electronics.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: 32 }}>4. Related Atlas Research & Reports</h2>
          <p>
            To dive deeper into India’s critical minerals and rare earths supply chain, explore our dedicated intelligence resources:
          </p>
          <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
            <Link href="/research/entities/irel-india-limited/" className="atlas-path" style={{ display: 'block' }}>
              <strong>IREL (India) Limited Company Profile →</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--fg-dim)' }}>Trace IREL’s corporate structure, facility locations, and mineral processing output.</p>
            </Link>
            <Link href="/reports/who-actually-captures-the-india-us-minerals-alliance/" className="atlas-path" style={{ display: 'block' }}>
              <strong>Report: India-US Critical Minerals Alliance →</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--fg-dim)' }}>Analysis of India’s strategic mineral partnerships, processing bottlenecks, and supply chain security.</p>
            </Link>
            <Link href="/reports/critical-minerals-strategic-roadmap/" className="atlas-path" style={{ display: 'block' }}>
              <strong>Report: Critical Minerals Strategic Roadmap →</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--fg-dim)' }}>National roadmap for securing 30 critical minerals, refining infrastructure, and recycling.</p>
            </Link>
          </div>

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
