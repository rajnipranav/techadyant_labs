import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { PlayersView } from './PlayersView';
import { corridorsOrdered, meta, atlas } from '../atlas';

export const metadata: Metadata = {
  title: 'Ecosystems & Players — who builds India’s industrial base',
  description:
    'A directory of the companies, PSUs, ministries, foreign suppliers and materials across India’s semiconductor, critical-minerals, AI-infrastructure, defence and enterprise-software ecosystems — what each one makes and where it sits.',
};

export default function PlayersPage() {
  const corridors = corridorsOrdered.map((c) => ({ code: c.code, label: c.label, accent: meta(c.code).accent }));
  return (
    <>
      <AtlasNav />
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
            the materials at the root of it all. Filter by ecosystem, type or origin; each entry says
            what they make and where they sit in the chain.
          </p>
        </div>
      </header>
      <section className="wrap">
        <PlayersView players={atlas.players} corridors={corridors} />
      </section>
    </>
  );
}
