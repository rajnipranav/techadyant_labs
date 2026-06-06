import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { SourcesView } from './SourcesView';
import { sources, docTypes, sourceCount } from '../sources';
import { corridorsOrdered, meta } from '../atlas';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../seo';

export const metadata: Metadata = {
  title: 'Sources — India’s industrial-policy library',
  description:
    'A curated, organised library of Government of India primary sources — roadmaps, scheme guidelines, Acts, notifications and reports across semiconductors, critical minerals, AI infrastructure, defence and enterprise software. The evidence layer under the Atlas.',
  alternates: { canonical: `${SITE}/research/sources/` },
};

export default function SourcesPage() {
  const corridors = corridorsOrdered.map((c) => ({ code: c.code, label: c.label, accent: meta(c.code).accent }));
  const itemList = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: 'India industrial-policy primary sources', url: `${SITE}/research/sources/`,
    numberOfItems: sourceCount,
    itemListElement: sources.slice(0, 60).map((s, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'CreativeWork', name: s.title, author: s.issuing_body, datePublished: s.year, url: s.source_url || s.direct_url || undefined },
    })),
  };
  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' }, { name: 'Sources', path: '/research/sources/' }]),
        { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Sources — India industrial-policy library', url: `${SITE}/research/sources/`, publisher: ORG_REF, about: 'Government of India primary-source documents on industrial policy' },
        itemList,
      ]} />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research">Atlas</Link><span className="sep">/</span><span>Sources</span>
          </div>
          <h1>Sources</h1>
          <p className="lede">
            India’s industrial-policy record is scattered across a dozen ministry sites that
            reorganise without warning. This is it in one place: {sourceCount} primary sources —
            roadmaps, scheme guidelines, Acts, notifications and reports — organised by ecosystem and
            document type, each linked to its official origin. The evidence layer under the Atlas.
          </p>
        </div>
      </header>

      <section className="wrap">
        <SourcesView sources={sources} corridors={corridors} types={docTypes} />
      </section>
    </>
  );
}
