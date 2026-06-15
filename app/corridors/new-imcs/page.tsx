import type { Metadata } from 'next';
import Link from 'next/link';
import { NewImcMap } from '../NewImcMap';
import { newImcNodes } from '../node-data';
import { STAGE, type NodeStage } from '../node-data';
import { corridorBySlug } from '../data';
import { JsonLd, breadcrumb, faqLd, SITE } from '../../research/seo';

export const metadata: Metadata = {
  title: 'India’s 12 new Integrated Manufacturing Clusters (IMCs)',
  description:
    'The 12 new Integrated Manufacturing Clusters approved under India’s National Industrial Corridor Development Programme — Khurpia, Rajpura-Patiala, Hisar, Agra, Prayagraj, Gaya, Dighi, Jodhpur-Pali, Kopparthy, Orvakal, Zaheerabad and Palakkad. Status, area, investment potential, jobs and corridor for each, with a clickable map.',
  alternates: { canonical: `${SITE}/corridors/new-imcs/` },
  keywords: [
    '12 new industrial cities', 'Integrated Manufacturing Cluster', 'IMC India', 'NICDP',
    'National Industrial Corridor Development Programme', 'industrial smart cities India',
    'Khurpia', 'Rajpura Patiala', 'Hisar IMC', 'Agra IMC', 'Prayagraj IMC', 'Gaya IMC',
    'Dighi Port', 'Jodhpur Pali Marwar', 'Kopparthy', 'Orvakal', 'Zaheerabad', 'Palakkad',
  ],
};

const cr = (n?: number) => (n ? `₹${n.toLocaleString('en-IN')} cr` : '—');
const ac = (n?: number) => (n ? `${n.toLocaleString('en-IN')} ac` : '—');
const jb = (n?: number) => (n ? n.toLocaleString('en-IN') : '—');

export default function NewImcsPage() {
  const items = newImcNodes();

  // Programme-level facts (PIB, 28 Aug 2024) — authoritative headline numbers.
  const PROGRAMME = [
    { k: 'Programme outlay', v: '₹28,602 cr' },
    { k: 'Clusters', v: '12' },
    { k: 'States', v: '10' },
    { k: 'Corridors', v: '6' },
    { k: 'Direct jobs (est.)', v: '~1 million' },
    { k: 'Indirect jobs (est.)', v: '~3 million' },
  ];

  // Our own sums across the clusters we track in detail.
  const sumArea = items.reduce((n, x) => n + (x.node.areaAc ?? 0), 0);
  const sumInv = items.reduce((n, x) => n + (x.node.investmentCr ?? 0), 0);

  const stageCount = (['operational', 'construction', 'approved', 'planned'] as NodeStage[])
    .map((s) => ({ s, n: items.filter((x) => x.node.stage === s).length }))
    .filter((x) => x.n > 0);

  const itemList = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: 'India’s 12 new Integrated Manufacturing Clusters',
    itemListElement: items.map((x, i) => ({
      '@type': 'ListItem', position: i + 1, name: x.node.name,
      url: `${SITE}/corridors/${x.corridor}/${x.node.slug}/`,
    })),
  };

  const faqs = [
    { q: 'How many new Integrated Manufacturing Clusters has India approved?',
      a: 'Twelve. The Cabinet Committee on Economic Affairs approved 11 new IMCs on 28 August 2024 under the National Industrial Corridor Development Programme for ₹28,602 crore; NICDC files these together with Hisar (Haryana) as a set of 12 projects across 10 states and 6 corridors.' },
    { q: 'Where are the 12 new IMCs located?',
      a: 'Khurpia (Uttarakhand), Rajpura-Patiala (Punjab), Hisar (Haryana), Agra and Prayagraj (Uttar Pradesh), Gaya (Bihar), Dighi (Maharashtra), Jodhpur-Pali-Marwar (Rajasthan), Kopparthy and Orvakal (Andhra Pradesh), Zaheerabad (Telangana) and Palakkad (Kerala).' },
    { q: 'What is the difference between a corridor and an IMC?',
      a: 'A corridor is a multi-state industrial spine (India has 11). An Integrated Manufacturing Cluster (also called an industrial node or smart city) is a developed land parcel built on a corridor. These 12 IMCs sit across six of the corridors.' },
    { q: 'How many of the 12 IMCs are under construction?',
      a: `As of the latest DPIIT/NICDC status reports, ${items.filter((x) => x.node.stage === 'construction').length} of the 12 are under construction, ${items.filter((x) => x.node.stage === 'operational').length} operational and ${items.filter((x) => x.node.stage === 'approved').length} approved and in pre-construction.` },
  ];

  return (
    <>
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'Corridors', path: '/corridors/' }, { name: '12 new IMCs', path: '/corridors/new-imcs/' }]),
        itemList, faqLd(faqs),
      ]} />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/corridors/">Corridors</Link><span className="sep">/</span><span>12 new IMCs</span>
          </div>
          <p className="ed-kicker">National Industrial Corridor Development Programme</p>
          <h1>India’s 12 new Integrated Manufacturing Clusters</h1>
          <p className="lede">
            On 28 August 2024 the Cabinet approved a fresh tranche of greenfield industrial smart
            cities under the NICDP — built <em>ahead of demand</em> on “plug-n-play” and
            “walk-to-work” principles. These twelve Integrated Manufacturing Clusters (IMCs) sit
            across six corridors and ten states. Each one below links to its full intelligence
            profile.
          </p>
        </div>
      </header>

      <section className="wrap" style={{ paddingTop: 8 }}>
        <div className="ci-snap" style={{ marginBottom: 28 }}>
          {PROGRAMME.map((f) => (
            <div key={f.k} className="ci-snap-cell">
              <div className="ci-snap-v">{f.v}</div>
              <div className="ci-snap-k">{f.k}</div>
            </div>
          ))}
        </div>

        <div className="nimap-wrap">
          <NewImcMap />
        </div>

        <div className="nimap-rollup">
          {stageCount.map(({ s, n }) => (
            <span key={s} className="nimap-roll"><i style={{ background: STAGE[s].color }} />{n} {STAGE[s].label.toLowerCase()}</span>
          ))}
          <span className="nimap-roll muted">Tracked area ≈ {ac(sumArea)} · investment potential ≈ {cr(sumInv)}</span>
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 80 }}>
        <h2 className="section-head-ed" style={{ marginTop: 8 }}>The twelve clusters</h2>
        <div className="imc-grid">
          {items.map(({ node: n, corridor }) => {
            const c = corridorBySlug(corridor);
            const st = STAGE[n.stage];
            return (
              <Link key={n.slug} href={`/corridors/${corridor}/${n.slug}/`} className="imc-card">
                <div className="imc-card-top">
                  <span className="imc-stage" style={{ color: st.color, borderColor: st.color }}>{st.label}</span>
                  {c ? <span className="imc-corr">{c.abbr}</span> : null}
                </div>
                <h3>{n.name}</h3>
                <p className="imc-state">{n.state}</p>
                <p className="imc-sectors">{n.sectors}</p>
                <dl className="imc-stats">
                  <div><dt>Area</dt><dd>{ac(n.areaAc)}</dd></div>
                  <div><dt>Investment</dt><dd>{cr(n.investmentCr)}</dd></div>
                  <div><dt>Jobs</dt><dd>{jb(n.jobs)}</dd></div>
                </dl>
                <span className="imc-go">View profile →</span>
              </Link>
            );
          })}
        </div>

        <p className="imc-note">
          Corridor count (11) and cluster count (12) measure different things: a corridor is a
          multi-state spine; an IMC is a single developed parcel on one. Figures are from the
          DPIIT/NICDC status reports and PIB; investment potential and jobs are NICDC projections.
        </p>
      </section>
    </>
  );
}
