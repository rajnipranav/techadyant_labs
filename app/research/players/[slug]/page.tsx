import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AtlasNav } from '../../AtlasNav';
import {
  allPlayers, playerSlug, playerBySlug, relationshipsFor, meta, corridorByCode,
} from '../../atlas';

export function generateStaticParams() {
  return allPlayers.map((p) => ({ slug: playerSlug(p.id) }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = playerBySlug(params.slug);
  if (!p) return { title: 'Player' };
  return {
    title: `${p.name} — ${p.type}`,
    description: p.description || `${p.name} in India’s industrial systems.`,
  };
}

const DIR_LABEL: Record<string, string> = {
  supplies_to: 'Supplies', depends_on: 'Depends on', controls: 'Controls',
  invests_in: 'Invests in', operates: 'Operates', located_in: 'Located in',
  regulates: 'Regulates', beneficiary_of: 'Beneficiary of', subsidiary_of: 'Subsidiary of',
  customer_of: 'Customer of', competes_with: 'Competes with', partners_with: 'Partners with',
};
const IN_LABEL: Record<string, string> = {
  supplies_to: 'Supplied by', depends_on: 'Depended on by', controls: 'Controlled by',
  invests_in: 'Invested in by', operates: 'Operated by', regulates: 'Regulated by',
  beneficiary_of: 'Benefits', subsidiary_of: 'Parent of', customer_of: 'Customer',
  competes_with: 'Competes with', partners_with: 'Partners with',
};

export default function PlayerPage({ params }: { params: { slug: string } }) {
  const p = playerBySlug(params.slug);
  if (!p) notFound();

  const edges = relationshipsFor(p.id);
  const corridors = (p.corridors ?? []);
  const isOrg = ['company', 'psu', 'jv', 'foreign_supplier', 'research_institution', 'industry_body', 'financial_institution'].includes(p.type_code);

  const jsonLd = isOrg ? {
    '@context': 'https://schema.org', '@type': 'Organization',
    name: p.name, description: p.description || undefined,
    address: p.country ? { '@type': 'PostalAddress', addressCountry: p.country } : undefined,
  } : null;

  return (
    <>
      <AtlasNav />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research">Atlas</Link><span className="sep">/</span>
            <Link href="/research/players">Players</Link><span className="sep">/</span><span>{p.name}</span>
          </div>
          <h1>{p.name}</h1>
          <div className="player-meta">
            <span className="ply-type">{p.type}</span>
            <span className={`ply-flag ${p.country === 'IN' ? 'dom' : 'frn'}`}>{p.country}</span>
          </div>
          {p.description && <p className="lede" style={{ marginTop: 14 }}>{p.description}</p>}
          <div className="player-corr">
            {corridors.map((code) => {
              const m = meta(code);
              return (
                <Link key={code} href={`/research/dependencies#${m.slug}`} className="player-corr-chip" style={{ ['--accent' as string]: m.accent }}>
                  {corridorByCode(code)?.label ?? code}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <section className="wrap-narrow">
        {edges.length > 0 ? (
          <>
            <h2 className="player-h2">Relationships</h2>
            <ul className="player-edges" role="list">
              {edges.map((e, i) => {
                const verb = e.dir === 'out' ? (DIR_LABEL[e.rel.type] ?? e.rel.type_label) : (IN_LABEL[e.rel.type] ?? e.rel.type_label);
                const otherP = allPlayers.find((x) => x.id === e.otherId);
                return (
                  <li key={i} className="player-edge">
                    <span className="pe-verb">{verb}</span>
                    {otherP ? (
                      <Link href={`/research/players/${playerSlug(e.otherId)}`} className="pe-other">{e.other}</Link>
                    ) : <span className="pe-other">{e.other}</span>}
                    {e.rel.description && <span className="pe-desc">— {e.rel.description}</span>}
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p className="player-empty">No mapped relationships yet for this entity.</p>
        )}

        <div className="player-foot">
          <Link href="/research/players" className="see-all">← All players</Link>
          <Link href="/reports" className="see-all">Related reports →</Link>
        </div>
      </section>
    </>
  );
}
