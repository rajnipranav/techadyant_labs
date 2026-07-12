import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { SearchView } from './SearchView';

export const metadata: Metadata = {
  title: 'Search — The Atlas',
  description:
    "Search Techadyant Labs' industrial knowledge graph — technologies, products, materials, patents, companies, schemes and the dependencies between them.",
  alternates: { canonical: 'https://labs.techadyant.com/research/search/' },
};

export default function AtlasSearchPage() {
  return (
    <>
      <AtlasNav />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">The Atlas</Link><span className="sep">/</span><span>Search</span>
          </div>
          <h1>Search the Atlas</h1>
          <p className="lede">
            Full-text search across the industrial knowledge graph — names and descriptions of
            every tracked technology, component, material, patent and player.
          </p>
        </div>
      </header>
      <section className="wrap-narrow" style={{ paddingTop: 24 }}>
        <SearchView />
      </section>
    </>
  );
}
