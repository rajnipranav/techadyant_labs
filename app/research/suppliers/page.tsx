import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { SupplierDirectory } from './SupplierDirectory';
import { suppliers, supplierMeta, supplierFacets } from '../suppliers';
import { CATEGORY_HUBS, STATE_HUBS, suppliersInCategory, topRated } from '../suppliers-hubs';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../seo';

export const metadata: Metadata = {
  title: 'India Industrial Supplier Directory — CNC, PCB, composites, precision machining, tooling',
  description:
    `A searchable directory of ${supplierMeta.total} Indian manufacturing suppliers across CNC machining, PCB fabrication, composites, precision machining and tooling — ${supplierMeta.verified} verified — filterable by capability, location, certification, tolerance and capacity.`,
  alternates: { canonical: `${SITE}/research/suppliers/` },
};

export default function SuppliersPage() {
  const m = supplierMeta;
  const topOverall = topRated(suppliers, 20);
  const faq = [
    { q: 'What is the India Industrial Supplier Atlas?',
      a: `It is a searchable capability directory of ${m.total} Indian manufacturing suppliers across five categories — CNC machining, PCB fabrication, composites, precision machining and tooling — built by Techadyant Labs. Each supplier is profiled by capability, location, certification, tolerance, capacity, export experience and verification status.` },
    { q: 'How many manufacturing suppliers does it cover, and how many are verified?',
      a: `The Atlas currently maps ${m.total} suppliers across ${m.states} states, of which ${m.verified} (${Math.round(m.verified / m.total * 100)}%) are independently verified. The average internal capability rating is ${m.avg.toFixed(1)} out of 5.` },
    { q: 'Which manufacturing capabilities are covered?',
      a: `Five: ${CATEGORY_HUBS.map((h) => h.label.replace(' Suppliers', '').replace(', Dies & Moulds', ' and tooling')).join(', ')}. Each has a dedicated directory filterable by sub-specialty, state, certification, tolerance band and revenue.` },
    { q: 'Which Indian states have the most manufacturing suppliers?',
      a: `${m.agg.states_top.slice(0, 4).map(([s, n]) => `${s} (${n})`).join(', ')} host the largest clusters — concentrated in India’s western and southern industrial corridors.` },
    { q: 'Are the suppliers export-ready?',
      a: `${m.export} of ${m.total} (${Math.round(m.export / m.total * 100)}%) report export experience, making the directory useful for global sourcing and China+1 diversification.` },
  ];

  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' }, { name: 'Supplier Directory', path: '/research/suppliers/' }]),
        {
          '@context': 'https://schema.org', '@type': 'Dataset',
          name: 'India Industrial Supplier Atlas',
          description: `Capability directory of ${m.total} Indian manufacturing suppliers across CNC, PCB, composites, precision machining and tooling — with location, certification, tolerance, capacity and verification status.`,
          url: `${SITE}/research/suppliers/`, creator: ORG_REF, publisher: ORG_REF,
          dateModified: m.updated, version: m.version, isAccessibleForFree: true,
          keywords: ['India manufacturing suppliers', 'CNC machining India', 'PCB manufacturers India', 'composite fabricators', 'precision machining', 'toolmakers', 'contract manufacturing directory', 'China plus one sourcing India'],
          variableMeasured: ['capability category', 'sub-specialty', 'location', 'certifications', 'tolerance band', 'monthly capacity', 'lead time', 'export experience', 'verification status'],
        },
        {
          '@context': 'https://schema.org', '@type': 'ItemList',
          name: 'Top-rated Indian manufacturing suppliers', numberOfItems: topOverall.length,
          itemListElement: topOverall.map((s, i) => ({
            '@type': 'ListItem', position: i + 1,
            item: { '@type': 'Organization', name: s.name, address: { '@type': 'PostalAddress', addressLocality: s.city, addressRegion: s.state, addressCountry: 'IN' } },
          })),
        },
        {
          '@context': 'https://schema.org', '@type': 'FAQPage',
          mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        },
      ]} />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">Atlas</Link><span className="sep">/</span><span>Supplier Directory</span>
          </div>
          <h1>Who actually makes things in India?</h1>
          <p className="lede">
            A searchable directory of {m.total} Indian manufacturing suppliers across CNC machining, PCB
            fabrication, composites, precision machining and tooling — {m.verified} verified, across {m.states} states.
            The dashboard and capability data are free to browse; direct contact details, GSTIN and Udyam
            registration unlock with a work email.
          </p>
          <div className="sa-browse-row" style={{ marginTop: 16 }}>
            {CATEGORY_HUBS.map((h) => (
              <Link key={h.slug} href={`/research/suppliers/category/${h.slug}`} className="sa-blink">
                {h.label.replace(' Suppliers', '')} <span>{suppliersInCategory(h.category).length}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      <section className="wrap">
        <SupplierDirectory suppliers={suppliers} meta={m} facets={supplierFacets} />

        <div className="sa-faq">
          <h2>India’s manufacturing supplier base — questions answered</h2>
          {faq.map((f) => <div className="sa-qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        </div>

        <div className="sa-browse">
          <div className="sa-browse-h">Browse by capability</div>
          <div className="sa-browse-row">
            {CATEGORY_HUBS.map((h) => (
              <Link key={h.slug} href={`/research/suppliers/category/${h.slug}`} className="sa-blink">{h.label} <span>{suppliersInCategory(h.category).length}</span></Link>
            ))}
          </div>
          <div className="sa-browse-h" style={{ marginTop: 18 }}>Browse by state</div>
          <div className="sa-browse-row">
            {STATE_HUBS.map((h) => (
              <Link key={h.slug} href={`/research/suppliers/state/${h.slug}`} className="sa-blink">{h.state} <span>{h.count}</span></Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
