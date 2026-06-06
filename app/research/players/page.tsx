import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { PlayersView } from './PlayersView';
import { corridorsOrdered, meta, atlas, playerSlug } from '../atlas';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../seo';

export const metadata: Metadata = {
  title: 'Ecosystems & Players — who builds India’s industrial base',
  description:
    'A directory of the companies, PSUs, ministries, foreign suppliers and materials across India’s semiconductor, critical-minerals, AI-infrastructure, defence and enterprise-software ecosystems — what each one makes and where it sits.',
  alternates: { canonical: `${SITE}/research/players/` },
};

export default function PlayersPage() {
  const corridors = corridorsOrdered.map((c) => ({ code: c.code, label: c.label, accent: meta(c.code).accent }));
  const players = atlas.players.map((p) => ({ ...p, slug: playerSlug(p.id) }));
  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' }, { name: 'Ecosystems & Players', path: '/research/players/' }]),
        {
          '@context': 'https://schema.org', '@type': 'CollectionPage',
          name: 'Ecosystems & Players — India’s industrial base',
          url: `${SITE}/research/players/`, publisher: ORG_REF,
          about: 'Companies, PSUs, ministries, foreign suppliers and materials in India’s strategic industrial systems',
        },
      ]} />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research">Atlas</Link><span className="sep">/</span><span>Ecosystems &amp; Players</span>
          </div>
          <h1>Ecosystems &amp; Players</h1>
          <p className="lede">
            The {atlas.players.length} entities we track across India’s strategic industrial systems —
            the domestic champions, the state machinery, the foreign suppliers India depends on, and
            the materials at the root of it all. Filter by ecosystem, type or origin; open any entity
            for what it makes and who it’s connected to.
          </p>
        </div>
      </header>
      <section className="wrap">
        <PlayersView players={players} corridors={corridors} />
      </section>
    </>
  );
}
