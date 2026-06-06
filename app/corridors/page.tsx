import type { Metadata } from 'next';
import Link from 'next/link';
import { CorridorMap } from './CorridorMap';
import { corridors, CLASS_COLOR, CLASS_LABEL } from './data';
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
    </>
  );
}
