import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { SupplierDirectory } from './SupplierDirectory';
import { suppliers, supplierMeta, supplierFacets } from '../suppliers';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../seo';

export const metadata: Metadata = {
  title: 'India Industrial Supplier Directory — CNC, PCB, composites, precision machining, tooling',
  description:
    `A capability directory of ${supplierMeta.total} Indian manufacturing suppliers across CNC machining, PCB fabrication, composites, precision machining and tooling — searchable by capability, location, certification, tolerance and capacity. The intelligence layer beneath India's hardware supply chain.`,
  alternates: { canonical: `${SITE}/research/suppliers/` },
};

export default function SuppliersPage() {
  const m = supplierMeta;
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
          dateModified: m.updated, version: m.version,
          keywords: ['India manufacturing suppliers', 'CNC machining India', 'PCB manufacturers India', 'composite fabricators', 'precision machining', 'toolmakers', 'contract manufacturing directory'],
          isAccessibleForFree: true,
          variableMeasured: ['capability category', 'sub-specialty', 'location', 'certifications', 'tolerance band', 'monthly capacity', 'lead time', 'export experience', 'verification status'],
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
            A capability directory of {m.total} Indian manufacturing suppliers across CNC machining, PCB
            fabrication, composites, precision machining and tooling — searchable by capability, location,
            certification and capacity. The dashboard and capability data are free to browse; direct contact
            details, GSTIN and Udyam registration unlock with a work email.
          </p>
        </div>
      </header>
      <section className="wrap">
        <SupplierDirectory suppliers={suppliers} meta={m} facets={supplierFacets} />
      </section>
    </>
  );
}
