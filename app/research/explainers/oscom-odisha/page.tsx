import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../../AtlasNav';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../../seo';

export const metadata: Metadata = {
  title: 'OSCOM Odisha: Full Form, Location & IREL Plant Products',
  description:
    'OSCOM is IREL’s Orissa Sands Complex at Chhatrapur, Odisha. Learn its full form, location, mineral products and role in rare-earth extraction.',
  alternates: { canonical: `${SITE}/research/explainers/oscom-odisha/` },
  openGraph: {
    title: 'OSCOM Odisha: Full Form, Location & IREL Plant Products',
    description:
      'OSCOM is IREL’s Orissa Sands Complex at Chhatrapur, Odisha. Learn its full form, location, mineral products and role in rare-earth extraction.',
    url: `${SITE}/research/explainers/oscom-odisha/`,
    type: 'article',
    siteName: 'Techadyant Labs',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'OSCOM Odisha & IREL Operations' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OSCOM Odisha: Full Form, Location & IREL Plant Products',
    description:
      'OSCOM is IREL’s Orissa Sands Complex at Chhatrapur, Odisha. Learn its full form, location, mineral products and role in rare-earth extraction.',
    images: ['/og/default.png'],
  },
};

const FAQ_ITEMS = [
  {
    q: 'What is OSCOM Odisha?',
    a: 'IREL officially expands OSCOM as Orissa Sands Complex. The unit is at Chhatrapur in Ganjam district, Odisha, and processes beach-sand minerals.',
  },
  {
    q: 'What does OSCOM produce?',
    a: 'IREL lists ilmenite, rutile, zircon, sillimanite and garnet as OSCOM mineral products. Its Rare Earth Extraction Plant produces mixed rare-earth chloride and associated products, including trisodium phosphate.',
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
    name: 'OSCOM Odisha: Full Form, Location & IREL Plant Products',
    description:
      'OSCOM is IREL’s Orissa Sands Complex at Chhatrapur, Odisha. Learn its full form, location, mineral products and role in rare-earth extraction.',
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
          <h1 style={{ marginTop: 12 }}>OSCOM Odisha: Full Form, Location & Mineral Products</h1>
          <p className="lede">
            OSCOM stands for Orissa Sands Complex, IREL’s mineral-sands unit at Chhatrapur in Ganjam district, Odisha.
            This guide explains its location, mineral products and rare-earth extraction role.
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
              <div><strong style={{ display: 'block', color: 'var(--fg-dim)', fontSize: '0.85rem' }}>Strategic Outputs</strong>Ilmenite, Rutile, Zircon, Mixed Rare-Earth Chloride</div>
            </div>
          </div>

          <h2 style={{ fontSize: '1.5rem', marginTop: 32 }}>1. What is the full form of OSCOM?</h2>
          <p>
            IREL’s official name is <strong>Orissa Sands Complex (OSCOM)</strong>, a unit of <strong>IREL (India) Limited</strong> (formerly Indian Rare Earths Limited), a Central Public Sector Undertaking under the Department of Atomic Energy (DAE).
          </p>
          <p>
            Located near Chhatrapur along the Bay of Bengal coastline in southern Odisha, OSCOM is designed to extract, separate, and refine heavy minerals present in coastal sand deposits. IREL lists mining and mineral separation among the unit’s activities.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: 32 }}>2. The Mineral Separation Process & Output Portfolio</h2>
          <p>
            The raw beach sand dredged from coastal deposits undergoes physical separation utilizing magnetic, electrostatic, and gravity methods to produce individual mineral fractions:
          </p>
          <ul style={{ lineHeight: 1.7 }}>
            <li><strong>Ilmenite (FeTiO3):</strong> The primary raw material for titanium dioxide (TiO2) pigment and synthetic rutile production. Ilmenite is one of OSCOM’s listed mineral products.</li>
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
            IREL’s Rare Earth Extraction Plant (REEP) at OSCOM produces mixed rare-earth chloride and associated products.
            Mixed concentrate is an intermediate supply-chain product; it should not be treated as evidence that OSCOM
            manufactures finished permanent magnets or individual high-purity rare-earth metals.
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

          <h2 style={{ fontSize: '1.5rem', marginTop: 32 }}>Official sources</h2>
          <p>
            <a href="https://www.irel.co.in/oscom" target="_blank" rel="noopener noreferrer">IREL’s OSCOM unit profile</a>
            {' '}documents the location and mineral products. The{' '}
            <a href="https://www.irel.co.in/en-GB/oscom-rare-earth-extraction-plant" target="_blank" rel="noopener noreferrer">IREL Rare Earth Extraction Plant profile</a>
            {' '}describes the mixed rare-earth chloride output. [V1]
          </p>

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
