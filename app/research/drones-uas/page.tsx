import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { DronesView } from './DronesView';
import { DronesTrack } from './DronesTrack';
import { companies, platforms } from './data';
import dronesData from '../_drones.json';

const meta = (dronesData as { meta: { platforms: number; companies: number; indianCompanies: number; procurementInrCr: number; agencies: number; opportunities: number; buildNow: number; criticalDeps: number } }).meta;
const inr = `₹${Math.round(meta.procurementInrCr).toLocaleString('en-IN')} crore`;

const FAQ: { q: string; a: string }[] = [
  { q: 'Which companies build drones in India?', a: `The Atlas tracks ${meta.companies} companies across India's UAS ecosystem, of which ${meta.indianCompanies} are Indian — OEMs, component makers and suppliers — filterable in the Companies tab with profiles, products and certifications.` },
  { q: 'How much has India spent on drone procurement?', a: `Disclosed contracts total ${inr} across ${meta.agencies} operators, led by the Indian Army, Air Force and Navy. The Procurement Intelligence tab shows spend by year and by buyer.` },
  { q: 'What drone components does India import?', a: `Propulsion, sensors, flight electronics and battery cells are still largely imported. The Component Sovereignty Index rates ${meta.criticalDeps} components as Critical import dependencies, scored against Chinese capability.` },
  { q: 'How do you get a drone certified in India?', a: 'Register for a UIN on DGCA Digital Sky, then obtain type certification through the QCI/NTH scheme (NTH Ghaziabad, ~₹1.5 lakh, 3–6 months), with EMI/environmental testing; defence platforms use CEMILAC airworthiness. The full pathway is on the Regulation tab.' },
  { q: 'What are the biggest drone business opportunities in India?', a: `The Atlas scores ${meta.opportunities} opportunities on the DOSF framework, with ${meta.buildNow} rated Build-now — led by autonomy software, counter-UAS and battery/BMS. The Playbook tab covers how to build each venture type.` },
];

export const metadata: Metadata = {
  title: 'India Drone & UAS Ecosystem — Platforms, Makers, Procurement, Dependencies',
  description:
    `A living map of India’s unmanned aerial systems: ${meta.platforms} platforms, ${meta.companies} companies, ${inr} of disclosed procurement across ${meta.agencies} operators, plus components, import dependencies, opportunity surfaces and the manufacturing playbook. Free from Techadyant Labs.`,
  alternates: { canonical: 'https://labs.techadyant.com/research/drones-uas/' },
};

export default function DronesPage() {
  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'Dataset',
      name: 'India Unmanned Aerial Systems (UAS) Ecosystem',
      description: `A curated map of India’s drone ecosystem — ${meta.platforms} platforms, ${meta.companies} companies, disclosed government procurement, components, import dependencies and opportunity surfaces.`,
      url: 'https://labs.techadyant.com/research/drones-uas/',
      includedInDataCatalog: { '@type': 'DataCatalog', name: 'The Atlas — Techadyant Labs', url: 'https://labs.techadyant.com/research/' }, license: 'https://creativecommons.org/licenses/by/4.0/',
      creator: { '@type': 'Organization', name: 'Techadyant Labs' },
      spatialCoverage: { '@type': 'Place', name: 'India' },
      keywords: ['India drones', 'India UAS', 'drone manufacturers India', 'drone procurement India', 'UAV platforms India', 'loitering munitions India', 'drone components import dependency', 'India defence drones', 'drone ecosystem India'],
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];
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
            {' '}{inr} of disclosed procurement across {meta.agencies} operators, and the components, import dependencies,
            opportunity surfaces and manufacturing playbooks beneath them. The free surface of Techadyant&apos;s drone
            research programme. Free to browse.
          </p>
        </div>
      </header>
      <section className="wrap">
        <DronesView data={dronesData as never} />
      </section>

      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker">Questions</div><h2>Frequently asked</h2></div></div>
        <div style={{ display: 'grid', gap: 16, maxWidth: 820 }}>
          {FAQ.map((f) => (
            <div key={f.q}>
              <h3 style={{ fontSize: 16, margin: '0 0 5px' }}>{f.q}</h3>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker">Market intelligence</div><h2>Deeper market reports</h2></div></div>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <Link href="/reports/india-cargo-drone-market/" style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 12, padding: '20px 22px', background: 'var(--bg-2, rgba(255,255,255,.02))', display: 'block', textDecoration: 'none' }}>
            <div className="ed-kicker" style={{ marginBottom: 8 }}>Cargo & logistics</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>India Cargo Drone Market 2026-2035</h3>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>124-page demand intelligence: 850 civil cargo drones in 2026 to 50,200 (base case) by 2035 - INR 18,400 crore annual revenue - across ten demand ecosystems and three scenarios.</p>
          </Link>
          <Link href="/reports/india-loitering-munitions-market/" style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 12, padding: '20px 22px', background: 'var(--bg-2, rgba(255,255,255,.02))', display: 'block', textDecoration: 'none' }}>
            <div className="ed-kicker" style={{ marginBottom: 8 }}>Defence</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>India's Loitering Munitions Market Intelligence 2026-2035</h3>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>Who arms India's loitering-munition decade - demand quantification, category specifications, the supplier map and the subsystem chokepoints that decide sovereignty.</p>
          </Link>
          <Link href="/reports/india-drone-sensors-payloads-imaging-market/" style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 12, padding: '20px 22px', background: 'var(--bg-2, rgba(255,255,255,.02))', display: 'block', textDecoration: 'none' }}>
            <div className="ed-kicker" style={{ marginBottom: 8 }}>Sensors & payloads</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>India Drone Sensors, Payloads & Imaging Systems Market</h3>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>Market size, segmentation, supply-chain dependence and the 2026-2035 forecast for the sensing layer inside India's drones.</p>
          </Link>
        </div>
      </section>

      <section className="wrap">
        <div style={{ display: 'grid', gap: 22, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 12, padding: '20px 22px', background: 'var(--bg-2, rgba(255,255,255,.02))' }}>
            <div className="ed-kicker" style={{ marginBottom: 8 }}>Track this ecosystem</div>
            <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>Get an email when the UAS Atlas and our drone research are updated.</p>
            <DronesTrack />
          </div>
          <div style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 12, padding: '20px 22px', background: 'var(--bg-2, rgba(255,255,255,.02))' }}>
            <div className="ed-kicker" style={{ marginBottom: 8 }}>Are we missing your company?</div>
            <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>Building drones, components, software or services in India? Tell us and we&apos;ll add you to the Atlas.</p>
            <a href="mailto:hello@techadyant.com?subject=Add%20my%20company%20to%20the%20UAS%20Atlas" style={{ color: 'var(--brass, #C9A84C)', fontWeight: 700 }}>Submit your company →</a>
          </div>
        </div>
      </section>

      {/* Server-rendered directory — gives every company/platform page an incoming internal link
          (the interactive DronesView is client-side, so its links weren't crawlable → orphan pages
          in Ahrefs Site Audit, July 2026). */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">Directory</div><h2>Every platform &amp; maker in the Atlas</h2></div></div>
        <div className="atlas-dir">
          <div>
            <h3>Companies ({companies.length})</h3>
            <ul className="atlas-dir-list">
              {companies.map((c) => (
                <li key={c.slug}><Link href={`/research/drones-uas/company/${c.slug}/`}>{c.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Platforms ({platforms.length})</h3>
            <ul className="atlas-dir-list">
              {platforms.map((p) => (
                <li key={p.slug}><Link href={`/research/drones-uas/platform/${p.slug}/`}>{p.name}{p.variant ? ` · ${p.variant}` : ''}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
