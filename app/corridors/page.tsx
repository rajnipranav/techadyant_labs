import type { Metadata } from 'next';
import Link from 'next/link';
import { CorridorMap } from './CorridorMap';
import { corridors, corridorBySlug, CLASS_COLOR, CLASS_LABEL } from './data';
import { leaderboard, TIER_COLOR } from './corridor-intel';
import { JsonLd, breadcrumb, SITE } from '../research/seo';

export const metadata: Metadata = {
  title: 'India’s 11 national industrial corridors — interactive map',
  description:
    'An interactive map of India’s eleven national industrial corridors (DMIC, CBIC, AKIC, VCIC and more). Click any corridor for its status, anchor nodes, programme, official sources and related research — in one place.',
  alternates: { canonical: `${SITE}/corridors/` },
};

const shortName = (n: string) => n.replace(' Industrial Corridor', '').replace(' Economic Corridor', ' (OEC)');

export default function CorridorsIndex() {
  const itemList = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: 'India’s national industrial corridors',
    itemListElement: corridors.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, url: `${SITE}/corridors/${c.slug}` })),
  };
  return (
    <>
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'Corridors', path: '/corridors/' }]),
        itemList,
      ]} />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="cidx-hero">
            <div>
              <div className="ed-kicker" style={{ color: '#C9A84C' }}>India · Industrial systems</div>
              <h1>India’s eleven national industrial corridors</h1>
              <p className="lede">
                The freight spines, fabs and smart cities reshaping India. Click any corridor to open its
                dossier — status, anchor nodes, programme, official sources and our research, in one place.
              </p>
              <div className="cidx-legend" aria-hidden="true">
                <span><i style={{ background: CLASS_COLOR.operational }} />{CLASS_LABEL.operational}</span>
                <span><i style={{ background: CLASS_COLOR.buildout }} />{CLASS_LABEL.buildout}</span>
                <span><i style={{ background: CLASS_COLOR.planned }} />{CLASS_LABEL.planned}</span>
              </div>
              <ul className="cidx-list">
                {corridors.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/corridors/${c.slug}`}>
                      <span className="n">{c.num}</span>
                      <span className="sw" style={{ background: CLASS_COLOR[c.cls] }} />
                      <span>{shortName(c.name)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <CorridorMap navigate />
            </div>
          </div>
        </div>
      </header>

      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>Readiness ranking</div><h2>The eleven, scored</h2></div></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '64ch', marginBottom: '16px' }}>
          Each corridor scored 0–100 on maturity, capital momentum, connectivity and opportunity openness — the Techadyant Corridor Readiness Score. Higher means closer to investable today.
        </p>
        <ul className="ci-lead">
          {leaderboard.map((row, i) => {
            const c = corridorBySlug(row.slug);
            if (!c) return null;
            return (
              <li key={row.slug}>
                <Link href={`/corridors/${row.slug}`}>
                  <span className="rk">{i + 1}</span>
                  <span className="nm">{shortName(c.name)}</span>
                  <span className="ci-leadbar"><i style={{ width: `${row.total}%`, background: TIER_COLOR[row.tier] }} /></span>
                  <span className="sc">{row.total}<span className="tr" style={{ color: TIER_COLOR[row.tier] }}>{row.tier}</span></span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
