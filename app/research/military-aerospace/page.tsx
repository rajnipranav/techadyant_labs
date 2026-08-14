import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { AerospaceView } from './AerospaceView';
import { AerospaceTrack } from './AerospaceTrack';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../seo';
import { meta, platforms, companies, dependencies } from './data';
import aerospaceData from '../_aerospace.json';

const m = meta;
const crit = m.dependencyByCriticality.find((x) => x.k === 'CRITICAL')?.n ?? 0;
const single = m.dependencyByConcentration.find((x) => x.k === 'single-source')?.n ?? 0;

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Who makes military transport aircraft in India?',
    a: `The Atlas tracks ${m.companies} companies in India's military transport aircraft ecosystem. The two structural anchors are Hindustan Aeronautics Limited (HAL) and the Tata-Airbus C-295 final assembly line at Vadodara (Tata Advanced Systems Limited as Indian prime), surrounded by ${m.suppliers} documented supplier relationships - ${m.supplierByTier.find((x) => x.k === 'tier-1')?.n ?? 0} at Tier 1.`,
  },
  {
    q: 'Which transport aircraft platforms are covered?',
    a: `${m.platforms} platforms - C-295, C-390 Millennium, C-130J Super Hercules, An-32, Il-76MD, A400M, C-17A, Do-228, HS-748, HTT-40 and the cancelled Indo-Russian MTA - each with specifications, Indian production status, industrial partner and a ${m.programmes}-milestone programme timeline.`,
  },
  {
    q: 'How much of the C-295 is manufactured in India?',
    a: `The C-295's documented maximum localization depth is L1 (final assembly in India at Vadodara, second FAL after Seville). Structures sub-assemblies come from Indian Tier-1 suppliers, while the engine, avionics, FADEC and mission computer remain imported (L0). Across the Atlas, ${m.localization} system-level records classify localization status per platform.`,
  },
  {
    q: 'What does India still import for its transport aircraft?',
    a: `The Atlas scores ${m.dependencies} dependencies, of which ${crit} are CRITICAL and ${single} are single-source - led by turboprop and turbofan engines (PW127G, V2500-E5, AE 2100D3, AI-20D, D-30KP), FADEC, fly-by-wire actuators, landing gear, composite prepreg and aerospace-grade titanium.`,
  },
  {
    q: 'Why is the C-390 programme labelled indicative?',
    a: `Source verification (Aug 2026) found no evidence of an IAF selection of the C-390 or of an Embraer-HAL MoU. Embraer's documented C-390 India partner is Mahindra Defence (MoU Feb 2024); the IAF Medium Transport Aircraft competition was still open. ${m.indicativeRecords} of ${m.platforms + m.companies + m.suppliers + m.systems + m.localization + m.dependencies + m.opportunities + m.geoSites + m.mro + m.programmes} records are labelled indicative in the UI where their sources could not be fully verified.`,
  },
  {
    q: 'Where is India’s aerospace manufacturing concentrated?',
    a: `${m.clusters} evidence-backed clusters across ${m.clusterByState.length} states, led by the Bengaluru Aerospace Cluster and the Vadodara C-295 cluster, mapped across ${m.geoSites} company sites.`,
  },
];

export const metadata: Metadata = {
  title: 'India Military Transport Aircraft Manufacturing — Suppliers & Dependencies',
  description:
    `India's military transport aircraft manufacturing ecosystem mapped: ${m.platforms} platforms, ${m.companies} companies, ${m.suppliers} supplier relationships, ${m.dependencies} scored import dependencies, ${m.programmes} programme milestones, MRO and geography. Every figure traces to a verified source (${m.sourcesResolved} of ${m.sources} resolved to primary documents). Free from Techadyant Labs.`,
  alternates: { canonical: `${SITE}/research/military-aerospace/` },
};

export default function AerospacePage() {
  const topOrgs = [...companies].sort((a, b) => a.name.localeCompare(b.name)).slice(0, 20);
  const ld = [
    breadcrumb([{ name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' }, { name: 'Military Aerospace', path: '/research/military-aerospace/' }]),
    {
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: 'India Military Transport Aircraft Manufacturing Atlas',
      url: `${SITE}/research/military-aerospace/`, isPartOf: { '@id': `${SITE}/research/` }, publisher: ORG_REF,
      about: ['military transport aircraft manufacturing India', 'C-295 India', 'C-390 India', 'Indian Air Force airlift fleet', 'defence aerospace suppliers India', 'aerospace import dependencies India'],
      hasPart: [
        ...platforms.map((p) => ({ '@type': 'WebPage', name: `${p.name} - platform profile`, url: `${SITE}/research/military-aerospace/platform/${p.slug}/` })),
        ...companies.slice(0, 20).map((c) => ({ '@type': 'WebPage', name: `${c.name} - company profile`, url: `${SITE}/research/military-aerospace/company/${c.slug}/` })),
      ],
    },
    {
      '@context': 'https://schema.org', '@type': 'Dataset',
      name: 'India Military Transport Aircraft Manufacturing Ecosystem',
      description: `Structured strategic intelligence on India's military transport aircraft manufacturing ecosystem - ${m.platforms} platforms, ${m.companies} companies, ${m.suppliers} supplier relationships, ${m.dependencies} scored dependencies, ${m.programmes} programme milestones, ${m.clusters} geography clusters, ${m.mro} MRO capabilities, ${m.opportunities} industrial opportunities.`,
      url: `${SITE}/research/military-aerospace/`, creator: ORG_REF, publisher: ORG_REF,
      license: 'https://creativecommons.org/licenses/by/4.0/', isAccessibleForFree: true,
      dateModified: m.updated, version: m.atlasVersion,
      keywords: ['C-295 India', 'C-390 India', 'C-130J India', 'military transport aircraft', 'aerospace manufacturing India', 'defence aerospace suppliers', 'India aerospace import dependency', 'HAL transport aircraft', 'Tata Airbus Vadodara', 'IAF airlift fleet'],
      variableMeasured: ['platform specifications', 'localization depth L0-L5', 'supplier tier', 'dependency criticality', 'programme milestones', 'geography clusters', 'MRO readiness'],
    },
    {
      '@context': 'https://schema.org', '@type': 'ItemList',
      name: 'Companies in India\'s military transport aircraft ecosystem', numberOfItems: topOrgs.length,
      itemListElement: topOrgs.map((c, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: { '@type': 'Organization', name: c.name, description: (c.capability || '').slice(0, 200) || undefined, url: `${SITE}/research/military-aerospace/company/${c.slug}/` },
      })),
    },
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
            <Link href="/research/">The Atlas</Link><span className="sep">/</span><span>Military Aerospace</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass-cream, #E6D1A0)' }}>Military Aerospace · India</div>
          <h1>Who builds India&apos;s military transport aircraft?</h1>
          <p className="lede">
            India&apos;s military transport aircraft manufacturing ecosystem, mapped: {m.platforms} platforms, {m.companies} companies,
            {m.suppliers} supplier relationships, {m.dependencies} scored import dependencies and {m.programmes} programme milestones -
            from the Tata-Airbus C-295 FAL at Vadodara to the IAF&apos;s legacy An-32 and Il-76 fleets. Every figure traces to a verified
            source: {m.sourcesResolved} of {m.sources} sources resolved to primary documents in the August 2026 provenance audit,
            and anything still unverified is labelled as such.
          </p>
          <div className="atlas-meta-row">
            <span><b>{m.platforms}</b> platforms</span>
            <span><b>{m.companies}</b> companies</span>
            <span><b>{m.suppliers}</b> supplier relationships</span>
            <span><b>{m.dependencies}</b> dependencies ({crit} critical)</span>
            <span><b>{m.programmes}</b> milestones</span>
            <span className="atlas-updated">Updated {new Date(m.updated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </header>
      <section className="wrap"><AerospaceView data={aerospaceData as never} /></section>

      {/* Browse strips - server-rendered internal links (the client view is interactive; these are crawlable) */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">Browse</div><h2>By platform, tier and dependency</h2></div></div>
        <div className="sa-browse">
          <div className="sa-browse-h">Platforms ({platforms.length})</div>
          <div className="sa-browse-row">
            {platforms.map((p) => (
              <Link key={p.slug} href={`/research/military-aerospace/platform/${p.slug}/`} className="sa-blink">{p.name.replace(/^(Airbus|Embraer|Lockheed Martin|Antonov|Ilyushin|Boeing|HAL|Indo-Russian) /, '')}</Link>
            ))}
          </div>
          <div className="sa-browse-h" style={{ marginTop: 18 }}>Supplier tiers</div>
          <div className="sa-browse-row">
            {m.supplierByTier.map((t) => (
              <Link key={t.k} href={`/research/military-aerospace/#tier-${t.k}`} className="sa-blink">{t.k.replace('tier-', 'Tier ')} <span>{t.n}</span></Link>
            ))}
          </div>
          <div className="sa-browse-h" style={{ marginTop: 18 }}>Dependency criticality</div>
          <div className="sa-browse-row">
            {m.dependencyByCriticality.map((c) => (
              <Link key={c.k} href={`/research/military-aerospace/#dep-${c.k.toLowerCase()}`} className="sa-blink">{c.k} <span>{c.n}</span></Link>
            ))}
          </div>
          <div className="sa-browse-h" style={{ marginTop: 18 }}>Every company ({companies.length})</div>
          <div className="sa-browse-row">
            {companies.map((c) => (
              <Link key={c.slug} href={`/research/military-aerospace/company/${c.slug}/`} className="sa-blink">{c.name.split(' (')[0]}</Link>
            ))}
          </div>
          <div className="sa-browse-h" style={{ marginTop: 18 }}>Every dependency ({dependencies.length})</div>
          <div className="sa-browse-row">
            {dependencies.map((x) => (
              <Link key={x.slug} href={`/research/military-aerospace/dependency/${x.slug}/`} className="sa-blink">{x.component || x.dependency}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker">Questions</div><h2>Frequently asked</h2></div></div>
        <div className="sa-faq">
          {FAQ.map((f) => <div className="sa-qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        </div>
      </section>

      <section className="wrap">
        <div style={{ display: 'grid', gap: 22, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 12, padding: '20px 22px', background: 'var(--bg-2, rgba(255,255,255,.02))' }}>
            <div className="ed-kicker" style={{ marginBottom: 8 }}>Track this ecosystem</div>
            <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>Get an email when the Military Aerospace Atlas and our defence research are updated.</p>
            <AerospaceTrack />
          </div>
          <div style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 12, padding: '20px 22px', background: 'var(--bg-2, rgba(255,255,255,.02))' }}>
            <div className="ed-kicker" style={{ marginBottom: 8 }}>Related research</div>
            <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>The rest of the Atlas: import dependencies across industries, the drone and counter-drone ecosystems, and the defence pillar map.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5 }}>
              <Link href="/research/dependencies/" style={{ color: 'var(--link, #6cb0ff)' }}>Import Dependency Map</Link>
              <Link href="/research/drones-uas/" style={{ color: 'var(--link, #6cb0ff)' }}>Unmanned Systems (Drones/UAS) Atlas</Link>
              <Link href="/research/counter-uas/" style={{ color: 'var(--link, #6cb0ff)' }}>Counter-UAS Atlas</Link>
              <Link href="/research/pillars/defence/" style={{ color: 'var(--link, #6cb0ff)' }}>Defence pillar map</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Server-rendered directory - every platform/company/dependency page gets an incoming internal link */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">Directory</div><h2>Every platform, company &amp; dependency in the Atlas</h2></div></div>
        <div className="atlas-dir">
          <div>
            <h3>Platforms ({platforms.length})</h3>
            <ul className="atlas-dir-list">
              {platforms.map((p) => (
                <li key={p.slug}><Link href={`/research/military-aerospace/platform/${p.slug}/`}>{p.name}{p.indicative ? ' · indicative' : ''}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Companies ({companies.length})</h3>
            <ul className="atlas-dir-list">
              {companies.map((c) => (
                <li key={c.slug}><Link href={`/research/military-aerospace/company/${c.slug}/`}>{c.name.split(' (')[0]}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Dependencies ({dependencies.length})</h3>
            <ul className="atlas-dir-list">
              {dependencies.map((x) => (
                <li key={x.slug}><Link href={`/research/military-aerospace/dependency/${x.slug}/`}>{x.dependency}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
