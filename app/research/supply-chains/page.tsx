import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { corridorsOrdered, meta, chokepointsForCorridor, playerSlug } from '../atlas';

export const metadata: Metadata = {
  title: 'Supply Chains — India’s industrial chokepoints',
  description:
    'The dependency structure of India’s strategic ecosystems: the suppliers and chokepoints the most domestic players rely on, mapped from the relationship graph.',
};

export default function SupplyChainsPage() {
  return (
    <>
      <AtlasNav />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research">Atlas</Link><span className="sep">/</span><span>Supply Chains</span>
          </div>
          <h1>Supply Chains &amp; Chokepoints</h1>
          <p className="lede">
            Where does leverage concentrate? For each ecosystem, these are the entities the most
            players depend on or are supplied by — the chokepoints whose disruption ripples furthest.
            Mapped from the dependency graph; each node links to its profile.
          </p>
        </div>
      </header>

      {corridorsOrdered.map((c) => {
        const m = meta(c.code);
        const chokes = chokepointsForCorridor(c.code).filter((x) => x.inbound >= 2).slice(0, 8);
        if (!chokes.length) return null;
        return (
          <section key={c.code} id={m.slug} className="wrap" style={{ scrollMarginTop: 120 }}>
            <div className="section-head-ed">
              <div>
                <div className="ed-kicker" style={{ color: m.accent }}>{c.label}</div>
                <h2>Chokepoints</h2>
              </div>
            </div>
            <div className="choke-list">
              {chokes.map((ch) => (
                <div key={ch.id} className="choke-row" style={{ ['--accent' as string]: m.accent }}>
                  <Link href={`/research/players/${playerSlug(ch.id)}`} className="choke-node">{ch.name}</Link>
                  <span className="choke-count">{ch.inbound} dependent{ch.inbound > 1 ? 's' : ''}</span>
                  <div className="choke-deps">
                    {ch.players.slice(0, 10).map((d) => (
                      <Link key={d.id} href={`/research/players/${playerSlug(d.id)}`} className="choke-dep">{d.name}</Link>
                    ))}
                    {ch.players.length > 10 && <span className="choke-dep more">+{ch.players.length - 10}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
