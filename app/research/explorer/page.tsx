import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { ExplorerView } from './ExplorerView';

export const metadata: Metadata = {
  title: 'Explorer — The Atlas',
  description:
    "Browse India's industrial knowledge graph — technologies, products, materials, patents, companies and the dependencies between them. Live from Techadyant Labs' research database.",
  alternates: { canonical: 'https://labs.techadyant.com/research/explorer/' },
};

export default function ExplorerPage() {
  return (
    <>
      <AtlasNav />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">The Atlas</Link><span className="sep">/</span><span>Explorer</span>
          </div>
          <h1>Explorer</h1>
          <p className="lede">
            Browse the industrial knowledge graph — filter by kind, search by name, and open any
            entity to see the dependencies around it. Live from our research database.
          </p>
        </div>
      </header>
      <section className="wrap">
        <ExplorerView />
      </section>
    </>
  );
}
