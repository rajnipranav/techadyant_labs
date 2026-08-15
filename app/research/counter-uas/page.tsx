import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { CuasView } from './CuasView';
import { CuasTrack } from './CuasTrack';
import { systems, manufacturers } from './data';
import cuasData from '../_cuas.json';

const meta = (cuasData as { meta: { systems: number; indianSystems: number; manufacturers: number; indianManufacturers: number; agencies: number; procurementCr: number; deployments: number; components: number; criticalComponents: number; technologies: number; incidents: number; trials: number; avgIndigenous: number } }).meta;

const FAQ: { q: string; a: string }[] = [
  { q: "How big is India's counter-UAS market?", a: `The observable market surface is INR ${meta.procurementCr} crore of disclosed procurement across ${meta.agencies} agencies, tracked in this Atlas: ${meta.systems} systems (${meta.indianSystems} Indian) from ${meta.manufacturers} manufacturers, with Rafael, DroneShield, BEL, IAI, RTX and Elbit leading. Demand is accelerating - the August 2026 Indian Army order for 840 one-way attack drones widens the threat surface these systems must counter.` },
  { q: 'What counter-drone (C-UAS) systems does India have?', a: `The Atlas tracks ${meta.systems} counter-UAS systems, of which ${meta.indianSystems} are Indian-made — from BEL, DRDO, Zen Technologies, Big Bang Boom and others — filterable by class, mobility and the drone types they counter.` },
  { q: 'How much has India spent on counter-UAS procurement?', a: `Disclosed contracts total ₹${meta.procurementCr.toLocaleString('en-IN')} crore across ${meta.deployments} known deployments, led by the Army, Air Force and paramilitary — a market that accelerated sharply after Operation Sindoor.` },
  { q: 'How does a counter-drone system work?', a: 'Through a kill chain: detect (radar, RF, EO/IR, acoustic), track, identify, then defeat the drone by soft-kill (RF jamming / GNSS spoofing), hard-kill (kinetic), directed energy (laser/microwave), or an interceptor drone. The Kill Chain tab breaks down each layer.' },
  { q: 'Which companies make counter-UAS systems in India?', a: `${meta.manufacturers} manufacturers are tracked; the Indian leaders are BEL and DRDO, with Zen Technologies, Big Bang Boom Solutions, Grene Robotics, Adani and Paras among the growing private field.` },
  { q: 'What are the import dependencies in Indian counter-UAS?', a: `${meta.criticalComponents} components are rated Critical import dependencies — chiefly AESA radar GaN T/R modules, FPGAs and AI processors — the same semiconductor chokepoints that run through the rest of the Atlas.` },
];

export const metadata: Metadata = {
  title: 'India Counter-UAS Market & Atlas: 60 Systems, 43 Makers, INR 374 Cr Procurement',
  description:
    `India's counter-UAS (counter-drone) market: ${meta.systems} systems tracked, ${meta.manufacturers} manufacturers, ${meta.indianSystems} Indian-built, and INR ${meta.procurementCr} crore of disclosed procurement across ${meta.agencies} agencies - the detect-to-defeat kill chain, components, import dependencies and the market map. Free from Techadyant Labs.`,
  alternates: { canonical: 'https://labs.techadyant.com/research/counter-uas/' },
};

export default function CuasPage() {
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Dataset', name: 'India Counter-UAS (Counter-Drone) Ecosystem',
      description: `A curated map of India’s counter-drone ecosystem — ${meta.systems} systems, ${meta.manufacturers} manufacturers, deployments, procurement, the counter-UAS kill chain, components and import dependencies.`,
      url: 'https://labs.techadyant.com/research/counter-uas/', includedInDataCatalog: { '@type': 'DataCatalog', name: 'The Atlas — Techadyant Labs', url: 'https://labs.techadyant.com/research/' }, license: 'https://creativecommons.org/licenses/by/4.0/',
      creator: { '@type': 'Organization', name: 'Techadyant Labs' }, spatialCoverage: { '@type': 'Place', name: 'India' },
      keywords: ['India counter-UAS', 'counter-drone systems India', 'C-UAS India', 'anti-drone systems', 'drone jammer India', 'directed energy weapon India', 'BEL counter drone', 'DRDO counter drone', 'India air defence drones'] },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <AtlasNav />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">The Atlas</Link><span className="sep">/</span><span>Counter-UAS</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)' }}>Counter-UAS · India</div>
          <h1>Who defends India against drones?</h1>
          <p className="lede">
            A living map of India&apos;s counter-drone ecosystem — {meta.systems} C-UAS systems, {meta.manufacturers} manufacturers,
            {' '}₹{meta.procurementCr.toLocaleString('en-IN')} crore of procurement and {meta.deployments} deployments, mapped across the
            detect-to-defeat kill chain with their components and import dependencies. The companion to the{' '}
            <Link href="/research/drones-uas/">Drone Atlas</Link>, and the free surface of our unmanned-warfare research.
          </p>
        </div>
      </header>
      <section className="wrap"><CuasView data={cuasData as never} /></section>

      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker">Questions</div><h2>Frequently asked</h2></div></div>
        <div style={{ display: 'grid', gap: 16, maxWidth: 820 }}>
          {FAQ.map((f) => (<div key={f.q}><h3 style={{ fontSize: 16, margin: '0 0 5px' }}>{f.q}</h3><p style={{ margin: 0, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>{f.a}</p></div>))}
        </div>
      </section>

      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker">Market intelligence</div><h2>Deeper market reports</h2></div></div>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <Link href="/reports/india-loitering-munitions-market/" style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 12, padding: '20px 22px', background: 'var(--bg-2, rgba(255,255,255,.02))', display: 'block', textDecoration: 'none' }}>
            <div className="ed-kicker" style={{ marginBottom: 8 }}>Defence</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>India's Loitering Munitions Market Intelligence 2026-2035</h3>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>Demand quantification, category specifications, supplier map and subsystem chokepoints for India's loitering-munition decade.</p>
          </Link>
          <Link href="/reports/india-drone-sensors-payloads-imaging-market/" style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 12, padding: '20px 22px', background: 'var(--bg-2, rgba(255,255,255,.02))', display: 'block', textDecoration: 'none' }}>
            <div className="ed-kicker" style={{ marginBottom: 8 }}>Sensors & payloads</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>India Drone Sensors, Payloads & Imaging Systems Market</h3>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>Sensing-layer market size, segmentation and 2026-2035 forecast - the sensors a counter-UAS effort must detect and defeat.</p>
          </Link>
        </div>
      </section>

      <section className="wrap">
        <div style={{ display: 'grid', gap: 22, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 12, padding: '20px 22px', background: 'var(--bg-2, rgba(255,255,255,.02))' }}>
            <div className="ed-kicker" style={{ marginBottom: 8 }}>Track this ecosystem</div>
            <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>Get an email when the Counter-UAS Atlas and our unmanned-warfare research are updated.</p>
            <CuasTrack />
          </div>
          <div style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 12, padding: '20px 22px', background: 'var(--bg-2, rgba(255,255,255,.02))' }}>
            <div className="ed-kicker" style={{ marginBottom: 8 }}>Are we missing your system?</div>
            <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>Building counter-drone systems, sensors or effectors in India? Tell us and we&apos;ll add you to the Atlas.</p>
            <a href="mailto:hello@techadyant.com?subject=Add%20my%20counter-UAS%20system%20to%20the%20Atlas" style={{ color: 'var(--brass, #C9A84C)', fontWeight: 700 }}>Submit your system →</a>
          </div>
        </div>
      </section>

      {/* Server-rendered directory — gives every system/manufacturer page an incoming internal
          link (the interactive CuasView is client-side → its links were orphaned in Ahrefs, Jul 2026). */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">Directory</div><h2>Every system &amp; maker in the Atlas</h2></div></div>
        <div className="atlas-dir">
          <div>
            <h3>Systems ({systems.length})</h3>
            <ul className="atlas-dir-list">
              {systems.map((s) => (
                <li key={s.slug}><Link href={`/research/counter-uas/system/${s.slug}/`}>{s.name}{s.variant ? ` · ${s.variant}` : ''}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Manufacturers ({manufacturers.length})</h3>
            <ul className="atlas-dir-list">
              {manufacturers.map((m) => (
                <li key={m.slug}><Link href={`/research/counter-uas/manufacturer/${m.slug}/`}>{m.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
