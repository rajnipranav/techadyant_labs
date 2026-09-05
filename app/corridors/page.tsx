import type { Metadata } from 'next';
import Link from 'next/link';
import { CorridorMap } from './CorridorMap';
import StateFilter from './StateFilter';
import CorridorGLMap from './CorridorGLMap';
import { corridorFeatures, nodeFeatures } from './corridor-geojson';
import { corridors, corridorBySlug, CLASS_COLOR, CLASS_LABEL } from './data';
import { leaderboard, TIER_COLOR, corridorIntel } from './corridor-intel';
import { deepFor, corridorDeep } from './node-data';
import { JsonLd, breadcrumb, datasetLd, SITE } from '../research/seo';

export const metadata: Metadata = {
  title: "India's 11 National Industrial Corridors — Interactive Map & Investor Dossier [2026]",
  description:
    "Interactive map of India's 11 NICDP corridors: DMIC, AKIC, CBIC, VCIC, HNIC and more. Click any corridor for IMC node status, investment programme, state coverage, and related reports.",
  alternates: { canonical: `${SITE}/corridors/` },
  openGraph: {
    title: "India's 11 National Industrial Corridors — Interactive Map & Investor Dossier [2026]",
    description:
      "Interactive map of India's 11 NICDP corridors: DMIC, AKIC, CBIC, VCIC, HNIC and more. Click any corridor for IMC node status, investment programme, state coverage, and related reports.",
    url: `${SITE}/corridors/`,
    type: 'website',
    siteName: 'Techadyant Labs',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'India Industrial Corridors Map' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "India's 11 National Industrial Corridors — Interactive Map & Investor Dossier [2026]",
    description:
      "Interactive map of India's 11 NICDP corridors: DMIC, AKIC, CBIC, VCIC, HNIC and more. Click any corridor for IMC node status, investment programme, state coverage, and related reports.",
    images: ['/og/default.png'],
  },
};

const shortName = (n: string) => n.replace(' Industrial Corridor', '').replace(' Economic Corridor', ' (OEC)');

// Recent node-level developments across all corridors (quarterly delta surface).
const MONTHS: Record<string, number> = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
const dateKey = (d: string): number => {
  const m = String(d).match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
  const y = String(d).match(/(20\d{2})/);
  return (y ? Number(y[1]) : 0) * 100 + (m ? (MONTHS[m[1].toLowerCase()] ?? 12) : 12);
};
const abbrOf: Record<string, string> = Object.fromEntries(corridors.map((c) => [c.slug, c.abbr]));
const recentDevelopments = Object.values(corridorDeep)
  .flatMap((cd) => cd.nodes.flatMap((n) => (n.timeline ?? []).map((tl) => ({ date: tl.date, label: tl.label, node: n.name, corr: cd.slug }))))
  .filter((x) => dateKey(x.date) <= 202608 && !/target|horizon|reappraisal|projected|build-out/i.test(x.label))
  .sort((a, b) => dateKey(b.date) - dateKey(a.date))
  .slice(0, 6);

export default function CorridorsIndex() {
  const itemList = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: 'India’s national industrial corridors',
    itemListElement: corridors.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, url: `${SITE}/corridors/${c.slug}/` })),
  };
  const cmpRows = corridors.map((c) => {
    const ci = corridorIntel(c.slug);
    const deep = deepFor(c.slug);
    return {
      c,
      score: ci?.score,
      inv: ci?.investment ?? '--',
      jobs: ci?.jobs ?? '--',
      nodeCount: deep?.nodes.length ?? c.nodes.length,
      topNode: deep?.nodes[0]?.name ?? c.nodes[0]?.name,
    };
  });
  return (
    <>
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'Corridors', path: '/corridors/' }]),
        itemList,
        datasetLd({
          name: "India's 11 national industrial corridors - comparison dataset",
          description: 'Corridor readiness scores, status, length, states, anchor-node counts and investment programme for all 11 NICDP corridors, plus the 38 deep node profiles (stage, area, investment, jobs, anchor tenants).',
          path: '/data/corridor-nodes.csv',
          keywords: ['industrial corridor', 'NICDP', 'DMIC', 'Dholera', 'readiness score', 'anchor nodes', 'India manufacturing'],
          csv: ['https://labs.techadyant.com/data/corridor-nodes.csv'],
        }),
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
              <p className="cmp-fresh">
                Sources: DPIIT/NICDC status reports (31 Oct &amp; 30 Nov 2025), NICDIT Apex Monitoring Authority review (Aug 2026), PIB, India Investment Grid · Updated 5 Sep 2026
                · <Link href="/corridors/methodology/">Score methodology</Link>
                · <Link href="/data/corridor-nodes.csv">Download node dataset (CSV)</Link>
              </p>
              <div className="cidx-legend" aria-hidden="true">
                <span><i style={{ background: CLASS_COLOR.operational }} />{CLASS_LABEL.operational}</span>
                <span><i style={{ background: CLASS_COLOR.buildout }} />{CLASS_LABEL.buildout}</span>
                <span><i style={{ background: CLASS_COLOR.planned }} />{CLASS_LABEL.planned}</span>
              </div>
              <StateFilter corridors={corridors} />
            </div>
            <div>
              <CorridorMap navigate />
            </div>
          </div>
        </div>
      </header>

      <section className="wrap">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker" style={{ color: '#C9A84C' }}>Programme at a glance</div>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '72ch', marginBottom: '6px' }}>
          Programme-wide position as reported at the NICDIT Apex Monitoring Authority review (August 2026): 20 approved projects across 13 states, with four smart cities already at production stage — Dholera SIR, Shendra–Bidkin (AURIC), IIT Greater Noida and Vikram Udyogpuri.
        </p>
        <div className="corr-stats">
          <div><span className="cs-n">20</span><span className="cs-l">Approved projects · 13 states</span></div>
          <div><span className="cs-n">4</span><span className="cs-l">Production-stage smart cities</span></div>
          <div><span className="cs-n">469</span><span className="cs-l">Plots allotted · ~5,348 acres</span></div>
          <div><span className="cs-n">₹2.21 L cr</span><span className="cs-l">Investment potential on allotted plots</span></div>
          <div><span className="cs-n">1.29 L</span><span className="cs-l">Jobs potential on allotted plots</span></div>
          <div><span className="cs-n">134 / 95</span><span className="cs-l">Units in production / under construction</span></div>
          <div><span className="cs-n">₹16,173 cr</span><span className="cs-l">Released to NICDIT · ₹14,570 cr on to SPVs</span></div>
        </div>
        <p className="chart-src">Source: PIB — NICDIT Apex Monitoring Authority review (Aug 2026) · Budget 2026–27 allocates a further ₹3,000 cr to NICDIT; NICDP-wide aggregates, shown alongside the corridor table below.</p>
      </section>

      <section className="wrap">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker" style={{ color: '#C9A84C' }}>Tracked developments</div>
            <h2>What changed this quarter</h2>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '70ch', marginBottom: '6px' }}>
          The latest node-level developments across the eleven corridors, from DPIIT/NICDC status reports and PIB releases.
        </p>
        <ul className="corr-milestones" role="list" style={{ marginTop: 4 }}>
          {recentDevelopments.map((w, i) => (
            <li key={i}>
              <span className="cm-date">{w.date}</span>
              <span className="cm-label">
                <Link href={`/corridors/${w.corr}/`} style={{ color: 'var(--link, #6cb0ff)' }}>{w.label}</Link>
                <em className="cm-node">— {w.node} · {abbrOf[w.corr]}</em>
              </span>
            </li>
          ))}
        </ul>
        <p className="chart-src">Node-level developments tracked from DPIIT/NICDC status reports and PIB releases · each dossier carries the full timeline and linked sources.</p>
      </section>

      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>Interactive map</div><h2>Explore the corridors geographically</h2></div></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '64ch', marginBottom: '16px' }}>
          The eleven corridors and their anchor nodes on a live map — coloured by readiness tier and node stage. Click any line or node to open its dossier.
        </p>
        <CorridorGLMap corridors={corridorFeatures()} nodes={nodeFeatures()} />
      </section>

      <section className="wrap">
        <Link href="/corridors/new-imcs/" className="imc-banner">
          <div>
            <div className="ed-kicker" style={{ color: '#C9A84C' }}>NICDP · August 2024</div>
            <strong>India’s 12 new Integrated Manufacturing Clusters</strong>
            <span>The fresh ₹28,602 cr tranche of greenfield smart cities — mapped, scored and linked to each profile.</span>
          </div>
          <span className="imc-banner-go">Open the map →</span>
        </Link>
      </section>

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
                <Link href={`/corridors/${row.slug}/`}>
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

      <section className="wrap">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker" style={{ color: '#C9A84C' }}>Side-by-side</div>
            <h2>Compare the eleven</h2>
          </div>
          <Link href="/corridors/methodology/" className="see-all">How the score works &#8599;</Link>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '72ch', marginBottom: '16px' }}>
          One table, all eleven corridors: readiness score, build status, route, state coverage, anchor-node depth and
          headline investment programme. Scroll sideways on mobile; every row opens the full dossier.
        </p>
        <div className="cmp-wrap" role="region" aria-label="Corridor comparison table" tabIndex={0}>
          <table className="cmp-table">
            <thead>
              <tr>
                <th>Corridor</th>
                <th>Status</th>
                <th>Readiness</th>
                <th>Length</th>
                <th>States</th>
                <th>Anchor nodes</th>
                <th>Headline node</th>
                <th>Investment</th>
                <th>Jobs</th>
              </tr>
            </thead>
            <tbody>
              {cmpRows.map((r) => (
                <tr key={r.c.slug}>
                  <td><Link href={`/corridors/${r.c.slug}/`}>{shortName(r.c.name)}</Link></td>
                  <td>
                    <span className="cmp-stag" style={{ background: CLASS_COLOR[r.c.cls] }} />
                    {CLASS_LABEL[r.c.cls]}
                  </td>
                  <td>
                    {r.score ? (
                      <>
                        <span className="cmp-score" style={{ color: TIER_COLOR[r.score.tier] }}>{r.score.total}</span>
                        <span className="cmp-tier" style={{ background: `${TIER_COLOR[r.score.tier]}22`, color: TIER_COLOR[r.score.tier] }}>{r.score.tier}</span>
                      </>
                    ) : '--'}
                  </td>
                  <td>{r.c.length.split(' · ')[0]}</td>
                  <td>{r.c.states}</td>
                  <td>{r.nodeCount}</td>
                  <td>{r.topNode}</td>
                  <td>{r.inv}</td>
                  <td>{r.jobs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="cmp-fresh">
          Investment and jobs figures are official programme projections; node counts include deep-researched profiles.
          Full source list on each dossier. Data as CSV: <Link href="/data/corridor-nodes.csv">corridor-nodes.csv</Link>.
        </p>
      </section>
    </>
  );
}
