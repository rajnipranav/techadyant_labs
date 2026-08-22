import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CorridorTrack } from '../CorridorTrack';
import { corridors, corridorBySlug, CLASS_COLOR, CLASS_LABEL } from '../data';
import { getReport } from '../../reports/data';
import { JsonLd, breadcrumb, faqLd, datasetLd, SITE } from '../../research/seo';
import { deepDive } from '../deepdive';
import { corridorIntel, TIER_COLOR, STAGE_COLOR, STAGE_LABEL, rankOf, leaderboard } from '../corridor-intel';
import CorridorGLMap from '../CorridorGLMap';
import NodeCardGrid from '../NodeCardGrid';
import { corridorFeatures, nodeFeatures } from '../corridor-geojson';
import { deepFor, STAGE as NSTAGE, type NodeStage } from '../node-data';

export function generateStaticParams() {
  return corridors.map((c) => ({ slug: c.slug }));
}
const CORRIDOR_SEO: Record<string, { title: string; description: string }> = {
  'amritsar-kolkata': {
    title: 'Amritsar–Kolkata Industrial Corridor: Node Map & Investment Zones',
    description: 'Complete guide to the Amritsar–Kolkata Industrial Corridor: 7 states, anchor IMCs and sector-specific manufacturing opportunities for investors.',
  },
  'chennai-bengaluru': {
    title: 'Chennai–Bengaluru Industrial Corridor: Electronics & Defence Hubs',
    description: "Inside the Chennai–Bengaluru Industrial Corridor: Tamil Nadu, Karnataka and Andhra Pradesh's manufacturing spine — nodes, clusters and supply-chain infrastructure.",
  },
};


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = corridorBySlug(slug);
  if (!c) return { title: 'Industrial Corridor' };

  const nodeNames = c.nodes.slice(0, 3).map((n) => n.name).join(', ');
  const ov = CORRIDOR_SEO[slug];
  const title = ov?.title || `${c.name} (${c.abbr}): Map, Nodes & Status [2026]`;
  const description = ov?.description || `Complete investor guide & map for India's ${c.name} (${c.abbr}). Infrastructure status, state coverage (${c.states}), anchor nodes (${nodeNames}), and project developments.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE}/corridors/${c.slug}/` },
    openGraph: {
      title,
      description,
      url: `${SITE}/corridors/${c.slug}/`,
      type: 'article',
      siteName: 'Techadyant Labs',
      images: [{ url: '/og/default.png', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og/default.png'],
    },
  };
}

export default async function CorridorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = corridorBySlug(slug);
  if (!c) notFound();
  const accent = CLASS_COLOR[c.cls];
  const dd = deepDive(c.slug);
  const ci = corridorIntel(c.slug);
  const rank = rankOf(c.slug);
  const totalCorr = leaderboard.length;
  const nodeCards = dd
    ? dd.nodes.map((n) => ({ name: n.name, sub: '', body: n.detail }))
    : c.nodes.map((n) => ({ name: n.name, sub: n.state, body: n.note }));
  const statesCount = c.states.split(',').length;
  const idx = corridors.findIndex((x) => x.slug === c.slug);
  const prev = corridors[(idx - 1 + corridors.length) % corridors.length];
  const next = corridors[(idx + 1) % corridors.length];
  const rel = c.reports.map((s) => getReport(s)).filter(Boolean) as NonNullable<ReturnType<typeof getReport>>[];
  const label = c.name.replace(' Industrial Corridor', '').replace(' Economic Corridor', '');
  const deep = deepFor(c.slug);
  const dn = deep?.nodes ?? [];
  const MONTHS: Record<string, number> = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
  const dateKey = (d: string): number => {
    const m = String(d).match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
    const y = String(d).match(/(20\d{2})/);
    const year = y ? Number(y[1]) : 0;
    const mon = m ? (MONTHS[m[1].toLowerCase()] ?? 12) : 12;
    return year * 100 + mon;
  };
  const recent = dn
    .flatMap((n) => (n.timeline ?? []).map((tl) => ({ date: tl.date, label: tl.label, node: n.name })))
    .sort((a, b) => dateKey(b.date) - dateKey(a.date))
    .slice(0, 6);
  const stageOrder: NodeStage[] = ['construction', 'approved', 'operational', 'planned'];
  const stageSplit = stageOrder.map((stg) => ({ stage: stg, count: dn.filter((n) => n.stage === stg).length })).filter((x) => x.count > 0);
  const areaData = dn.filter((n) => n.areaAc).map((n) => ({ name: n.name.replace(/ IMC.*| \(.*/, ''), val: n.areaAc as number })).sort((a, b) => b.val - a.val);
  const areaMax = Math.max(1, ...areaData.map((d) => d.val));
  const invData = dn.filter((n) => n.investmentCr).map((n) => ({ name: n.name.replace(/ IMC.*| \(.*/, ''), val: n.investmentCr as number })).sort((a, b) => b.val - a.val);
  const invMax = Math.max(1, ...invData.map((d) => d.val));
  const extraKw = deep ? [...deep.nodes.map((n) => n.name), ...deep.nodes.flatMap((n) => (n.companies ?? []).map((co) => co.name))] : [];
  const nodeItemList = deep ? {
    '@context': 'https://schema.org', '@type': 'ItemList', name: `${c.name} — industrial nodes`,
    itemListElement: deep.nodes.map((n, i) => ({ '@type': 'ListItem', position: i + 1, name: n.name, item: `${SITE}/corridors/${c.slug}/${n.slug}/` })),
  } : null;

  return (
    <>
      <JsonLd data={[
        breadcrumb([
          { name: 'Home', path: '/' },
          { name: 'Corridors', path: '/corridors/' },
          { name: c.name, path: `/corridors/${c.slug}/` },
        ]),
        datasetLd({
          name: `${c.name} (${c.abbr}) — corridor profile`,
          description: `Status, anchor nodes, programme and related research for India’s ${c.name}.`,
          path: `/corridors/${c.slug}/`,
          keywords: [c.name, c.abbr, 'India', 'industrial corridor', 'NICDP', ...c.states.split(',').map((s) => s.trim()), ...extraKw],
        }),
        faqLd(c.faq),
        ...(nodeItemList ? [nodeItemList] : []),
      ]} />

      {/* 1 · Header */}
      <header className="ed-page-head" style={{ ['--accent' as string]: accent }}>
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/corridors/">Corridors</Link><span className="sep">/</span><span>{label}</span>
          </div>
          <span className="corr-chip" style={{ color: accent }}>
            {(c.tag ? c.tag + ' · ' : '') + 'Corridor ' + String(c.num).padStart(2, '0')}
          </span>
          <h1 style={{ marginTop: 12 }}>{c.name}</h1>
          <p className="lede">{c.blurb}</p>
          <div className="corr-stats">
            <div><span className="cs-n" style={{ color: accent }}>{c.length.split(' · ')[0]}</span><span className="cs-l">Length</span></div>
            <div><span className="cs-n">{statesCount}</span><span className="cs-l">States</span></div>
            <div><span className="cs-n">{(deep?.nodes.length ?? c.nodes.length)}</span><span className="cs-l">Anchor nodes</span></div>
            <div><span className="cs-n" style={{ color: accent, fontSize: '1rem' }}>{CLASS_LABEL[c.cls]}</span><span className="cs-l">Status</span></div>
          </div>
        </div>
      </header>

      {ci && (
        <section className="wrap" style={{ paddingBottom: 0 }}>
          <div className="ci-score">
            <div className="ci-score-num">
              <div className="n" style={{ color: accent }}>{ci.score.total}</div>
              <div className="d">/100 readiness</div>
              <div className="ci-tier" style={{ color: TIER_COLOR[ci.score.tier] }}>{ci.score.tier}</div>
            </div>
            <div className="ci-axes">
              {(([['Maturity', ci.score.maturity], ['Capital momentum', ci.score.capital], ['Connectivity', ci.score.connectivity], ['Opportunity', ci.score.opportunity]]) as [string, number][]).map(([lab, v]) => (
                <div className="ci-axis" key={lab}>
                  <span className="lab">{lab}</span>
                  <span className="ci-bar"><i style={{ width: `${(v / 25) * 100}%`, background: accent }} /></span>
                  <span className="val">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-dim)', marginTop: '10px', maxWidth: '64ch' }}>
            The Techadyant Corridor Readiness Score rates maturity, capital momentum, connectivity and opportunity openness (each 0–25). This corridor ranks <strong style={{ color: 'var(--text-muted)' }}>#{rank} of {totalCorr}</strong>. <Link href="/corridors/" style={{ color: accent }}>Compare all corridors →</Link> <Link href="/corridors/methodology/" style={{ color: accent }}>Score methodology →</Link>
          </p>
        </section>
      )}

      {/* 2 · Map */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: accent }}>Where it runs</div><h2>On the map</h2></div>
          <Link href="/corridors/" className="see-all">All 11 corridors →</Link></div>
        <CorridorGLMap corridors={corridorFeatures()} nodes={nodeFeatures()} focus={c.slug} />
      </section>

      {/* 2b · Corridor insights (charts) */}
      {deep && (
        <section className="wrap">
          <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: accent }}>The numbers</div><h2>Corridor insights</h2></div></div>
          <div className="corr-charts">
            <div className="chart-card">
              <div className="chart-title">Nodes by stage</div>
              <div className="stage-split">
                {stageSplit.map((x) => <span key={x.stage} style={{ flex: x.count, background: NSTAGE[x.stage].color }} title={`${NSTAGE[x.stage].label}: ${x.count}`} />)}
              </div>
              <div className="chart-legend">{stageSplit.map((x) => <span key={x.stage}><i style={{ background: NSTAGE[x.stage].color }} />{NSTAGE[x.stage].label} · {x.count}</span>)}</div>
            </div>
            <div className="chart-card">
              <div className="chart-title">Area by node (acres)</div>
              <ul className="bar-chart">
                {areaData.map((d) => <li key={d.name}><span className="bc-lab">{d.name}</span><span className="bc-track"><i style={{ width: `${(d.val / areaMax) * 100}%`, background: accent }} /></span><span className="bc-val">{d.val.toLocaleString('en-IN')}</span></li>)}
              </ul>
            </div>
            <div className="chart-card">
              <div className="chart-title">Investment potential (₹ cr)</div>
              <ul className="bar-chart">
                {invData.map((d) => <li key={d.name}><span className="bc-lab">{d.name}</span><span className="bc-track"><i style={{ width: `${(d.val / invMax) * 100}%`, background: accent }} /></span><span className="bc-val">{d.val.toLocaleString('en-IN')}</span></li>)}
              </ul>
            </div>
          </div>
          {deep.milestones && deep.milestones.length > 0 && (
            <div className="corr-milestones">
              <div className="chart-title">Milestones</div>
              <ul role="list">
                {deep.milestones.map((m, i) => <li key={i}><span className="cm-date">{m.date}</span><span className="cm-label">{m.label}</span></li>)}
              </ul>
            </div>
          )}
          <p className="chart-src">Source: DPIIT/NICDC status report (31 Oct 2025) + PIB / India Investment Grid. Investment-potential and jobs figures are official projections.</p>
        </section>
      )}

      {recent.length > 0 && (
        <section className="wrap" style={{ background: 'var(--bg-2)' }}>
          <div className="section-head-ed">
            <div>
              <div className="ed-kicker" style={{ color: accent }}>Tracked developments</div>
              <h2>What's new on this corridor</h2>
            </div>
          </div>
          <ul className="corr-milestones" role="list" style={{ marginTop: 4 }}>
            {recent.map((r, i) => (
              <li key={i}>
                <span className="cm-date">{r.date}</span>
                <span className="cm-label">{r.label} <em className="cm-node">— {r.node}</em></span>
              </li>
            ))}
          </ul>
          <p className="chart-src">Node-level developments tracked from DPIIT/NICDC status reports and PIB releases; each node page carries its full timeline and linked primary sources.</p>
        </section>
      )}

      {/* 3 · At a glance */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: accent }}>The basics</div><h2>At a glance</h2></div></div>
        <ul className="corr-facts">
          <li><div className="k">Route &amp; length</div><div className="v">{c.length}</div></li>
          <li><div className="k">States</div><div className="v">{c.states}</div></li>
          <li><div className="k">Programme</div><div className="v">{c.programme}</div></li>
          <li><div className="k">Status</div><div className="v">{c.status}</div></li>
        </ul>
        {ci && (
          <>
            <div className="ci-snap" style={{ marginTop: '18px' }}>
              {ci.spv ? <div><div className="k">Lead developer</div><div className="v">{ci.spv}</div></div> : null}
              {ci.funding ? <div><div className="k">Funding</div><div className="v">{ci.funding}</div></div> : null}
              {ci.dfc ? <div><div className="k">Freight corridor</div><div className="v">{ci.dfc}</div></div> : null}
              {ci.investment ? <div><div className="k">Investment</div><div className="v">{ci.investment}</div></div> : null}
              {ci.jobs ? <div><div className="k">Jobs target</div><div className="v">{ci.jobs}</div></div> : null}
            </div>
            <div className="ci-chips" style={{ marginTop: '16px' }}>
              {ci.connectivity.map((x) => <span className="ci-chip" key={x}>{x}</span>)}
            </div>
          </>
        )}
      </section>

      {/* 4 · Anchor nodes */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: accent }}>Industrial cities</div><h2>Anchor nodes</h2></div></div>
        {deep ? (
          <NodeCardGrid
            corridor={c.slug}
            nodes={deep.nodes.map((n) => ({
              slug: n.slug,
              name: n.name,
              state: n.state,
              stage: n.stage,
              areaAc: n.areaAc ?? null,
              investmentCr: n.investmentCr ?? null,
              summary0: n.summary[0] ?? null,
            }))}
          />
        ) : ci ? (
          <div className="ci-tablewrap">
            <table className="ci-table">
              <thead><tr><th>Node</th><th>Area</th><th>Sectors</th><th>Anchor / status</th><th>Stage</th></tr></thead>
              <tbody>
                {ci.nodes.map((n) => (
                  <tr key={n.name}>
                    <td><span className="nm">{n.name}</span>{n.land ? <span style={{ fontSize: '12px' }}>{n.land}</span> : null}</td>
                    <td>{n.area ?? '—'}</td>
                    <td>{n.sectors ?? '—'}</td>
                    <td>{n.anchor ?? n.note ?? '—'}</td>
                    <td><span className="ci-stage"><i style={{ background: STAGE_COLOR[n.stage] }} />{STAGE_LABEL[n.stage]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="node-cards">
            {nodeCards.map((n) => (
              <div key={n.name} className="node-card">
                <h3>{n.name}</h3>
                {n.sub ? <div className="st">{n.sub}</div> : null}
                <p>{n.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5 · Why it matters — the Techadyant view */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: accent }}>The Techadyant view</div><h2>Why it matters</h2></div></div>
        {dd ? (
          dd.view.map((para, i) => (
            <p key={i} className="lede" style={{ maxWidth: '62ch', marginBottom: '14px' }}>{para}</p>
          ))
        ) : (
          <>
            <p className="lede" style={{ maxWidth: '52ch' }}>
              Beyond the freight line, the {c.abbr} is where several of the systems we track physically
              converge. Our corridor-level analysis — the sector clusters forming here, the opportunity
              surfaces for industry and MSMEs, and who actually captures the value — is being built out
              corridor by corridor.
            </p>
            <p className="corr-soon">
              Our corridor-level analysis is being built out corridor by corridor. The official programme figures for
              the {c.abbr} are above; the related research below covers the themes that land along this corridor.
            </p>
          </>
        )}
      </section>

      
      {/* 5b · NEW SIGNAL: Western Gateway / Japan City (AKIC only) */}
      {slug === 'amritsar-kolkata' && (
        <section className="wrap" style={{ background: 'var(--brass, #C9A84C)', color: '#1a1a2e', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(46,100,151,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div className="section-head-ed" style={{ position: 'relative' }}>
            <div>
              <div className="ed-kicker" style={{ color: '#1a1a2e', opacity: 0.7, letterSpacing: '0.08em' }}>NEW SIGNAL \u00b7 AUGUST 2026</div>
              <h2 style={{ color: '#1a1a2e', marginTop: 4 }}>Japan City strengthens western UP's manufacturing gateway</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 16, position: 'relative' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8, opacity: 0.7 }}>Announcement</div>
              <p style={{ lineHeight: 1.65, fontSize: 15 }}>UP government proposed a 500-acre <strong>Japan City</strong> in YEIDA Sector 5A at the UP\u2013Japan Investment Meet (Aug 18\u201323, 2026), targeting a dedicated Japanese manufacturing and supplier ecosystem (~70% industrial, ~30% commercial/residential).</p>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8, opacity: 0.7 }}>Investment commitments</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 15, lineHeight: 1.7 }}>
                <li><strong>Escorts Kubota:</strong> \u20b92,025 cr, 154 acres, Sector 10, tractor manufacturing, 3,800+ jobs [V] <em style={{ opacity: 0.6, fontSize: 13 }}>(ground-broken Aug 2026)</em></li>
                <li><strong>Minda Corporation:</strong> \u20b91,166 cr, Sectors 10 & 24, auto components, 6,440 jobs [V] <em style={{ opacity: 0.6, fontSize: 13 }}>(virtual ground-breaking Aug 2026)</em></li>
                <li><strong>HCL-Foxconn:</strong> \u20b93,706 cr, 48 acres, Sector 28, semiconductor OSAT, 3,500+ jobs [V] <em style={{ opacity: 0.6, fontSize: 13 }}>(foundation Feb 2026, operational 2028)</em></li>
              </ul>
            </div>
          </div>
          <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(26,26,46,0.08)', borderRadius: 8, position: 'relative' }}>
            <div style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Techadyant Interpretation</div>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, marginBottom: 10 }}><strong>Fact:</strong> Japan City is a proposal at this stage \u2014 no confirmed investment figure, no land acquisition for Sector 5A, no construction timeline. The \u20b93,191 cr widely cited is Escorts Kubota + Minda in separate sectors.</p>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, marginBottom: 10 }}><strong>Interpretation:</strong> The significance is not the 500-acre proposal itself, but the density of real investment (HCL-Foxconn, Escorts Kubota, Minda) already materialising around Jewar. This cluster is forming a Japanese OEM and supplier base at the western edge of the AKIC/EDFC network.</p>
            <p style={{ fontSize: 14.5, lineHeight: 1.7 }}><strong>Implication:</strong> If this ecosystem matures, it could function as a semiconductor, automotive-electronics and logistics gateway that feeds components and technology into the wider AKIC supply chain \u2014 potentially accelerating Agra and Prayagraj node activation.</p>
          </div>
          <p className="chart-src" style={{ marginTop: 12, position: 'relative' }}>Sources: ThePrint, Moneycontrol, Economic Times, The Hindu, Financial Express, HCL.com, Invest UP (all Aug 2026). Japan City itself: proposal only; investment figures are for adjacent YEIDA sectors.</p>
        </section>
      )}

      {/* 5c · Cross-Corridor Convergence (AKIC only) */}
      {slug === 'amritsar-kolkata' && (
        <section className="wrap" style={{ paddingTop: 0 }}>
          <div className="section-head-ed"><div>
            <div className="ed-kicker" style={{ color: accent }}>Strategic framework</div>
            <h2>Cross-Corridor Convergence</h2>
          </div></div>
          <p className="lede" style={{ maxWidth: '68ch', marginBottom: 20 }}>Three separate official programmes converge physically in the Delhi NCR \u2192 Agra corridor. These are distinct governance structures \u2014 but their industrial linkages create an analytically significant network that no single corridor programme captures.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            <div style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 8 }}>DMIC / WDFC</div>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>Western Dedicated Freight Corridor</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-dim)' }}>Dadri \u2192 Greater NCR \u2192 Noida. Operational corridor. Dadri junction is the physical link point between the WDFC and the AKIC's EDFC network.</p>
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>Status: <span style={{ color: '#34D399' }}>Operational</span></div>
            </div>
            <div style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 8 }}>YEIDA / Jewar</div>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>Western UP Manufacturing Cluster</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-dim)' }}>Noida International Airport \u2192 Japan City (proposed) \u2192 HCL-Foxconn semiconductor \u2192 Escorts Kubota \u2192 Minda auto components. Not a corridor programme, but an industrial cluster of corridor-scale significance.</p>
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>Status: <span style={{ color: '#FBBF24' }}>Emerging</span></div>
            </div>
            <div style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 8 }}>AKIC / EDFC</div>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>Eastern Dedicated Freight Corridor</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-dim)' }}>Agra \u2192 Prayagraj \u2192 Varanasi \u2192 eastern manufacturing belt. Agra is the nearest AKIC IMC to the YEIDA cluster, connected via the EDFC.</p>
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>Status: <span style={{ color: '#F97316' }}>In build-out</span></div>
            </div>
          </div>
        </section>
      )}

      {/* 5d · Industrial Network Integration (AKIC only) */}
      {slug === 'amritsar-kolkata' && (
        <section className="wrap" style={{ background: 'var(--bg-2)', paddingTop: 0 }}>
          <div className="section-head-ed"><div>
            <div className="ed-kicker" style={{ color: accent }}>New analytical dimension</div>
            <h2>Industrial Network Integration</h2>
          </div></div>
          <p style={{ fontSize: 14.5, lineHeight: 1.7, maxWidth: '66ch', marginBottom: 20 }}>The degree to which an industrial corridor node is connected to adjacent manufacturing, logistics, technology, foreign-investment and infrastructure ecosystems <em>outside</em> the formal corridor boundary. We assess the AKIC's western UP interface.</p>
          <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead><tr style={{ background: 'var(--bg-2)' }}><th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>Dimension</th><th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>Assessment</th></tr></thead>
              <tbody>
                {[['EDFC connectivity','Existing — Agra and Prayagraj IMCs are on the Eastern DFC alignment'],['Manufacturing-node maturity','Developing — Agra (approved), Prayagraj (under construction)'],['Airport integration','Emerging — Jewar airport under construction; EDFC nodes lack direct airport proximity'],['Japanese FDI integration','Emerging / Accelerating — Escorts Kubota ground-broken, Japan City proposed'],['Semiconductor integration','Emerging — HCL-Foxconn OSAT approved May 2025, foundation Feb 2026, operational 2028'],['Supplier-network density','Developing — Minda, Escorts Kubota anchoring; broader clustering not yet visible'],['Cross-corridor integration','High potential — WDFC (Dadri) and EDFC (Agra) junction creates a physical freight bridge']].map(([dim,assess]) => (
                  <tr key={dim}><td style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', fontWeight: 500 }}>{dim}</td><td style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', color: 'var(--text-dim)' }}>{assess}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 5e · Emerging Research Opportunity (AKIC only) */}
      {slug === 'amritsar-kolkata' && (
        <section className="wrap" style={{ paddingTop: 0 }}>
          <div className="section-head-ed"><div>
            <div className="ed-kicker" style={{ color: accent }}>Research forward</div>
            <h2>Emerging Research Opportunity</h2>
          </div></div>
          <div style={{ border: '1px solid rgba(201,168,76,0.25)', borderRadius: 10, padding: 24 }}>
            <h3 style={{ fontSize: 17, marginBottom: 6 }}>Western Uttar Pradesh Industrial Convergence</h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-dim)', marginBottom: 12 }}>YEIDA · Jewar Airport · Japan City · Semiconductors · DMIC · AKIC · EDFC · Auto Components</p>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, marginBottom: 14 }}>The physical convergence of the WDFC and EDFC networks through the Delhi NCR → Greater Noida → Agra corridor, combined with semiconductor (HCL-Foxconn), automotive (Escorts Kubota, Minda) and airport infrastructure (Jewar), could justify a dedicated Techadyant Atlas layer tracking company-level investments, supply-chain linkages and corridor-crossing logistics flows.</p>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)' }}>Recommended as a future Atlas dataset. Track: YEIDA, Jewar Airport, Japan City, Japanese manufacturers, semiconductor projects, electronics manufacturers, automotive suppliers, DMIC, AKIC, EDFC, logistics infrastructure.</p>
          </div>
        </section>
      )}

{/* 6 · Related research */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: accent }}>From the desk</div><h2>Related research</h2></div>
          <Link href="/reports/" className="see-all">All reports →</Link></div>
        {rel.length > 0 ? (
          <div className="corr-rel">
            {rel.map((r) => (
              <Link key={r.slug} href={`/reports/${r.slug}/`}>
                <span className="rk">{r.access === 'free' ? 'Free report' : 'Paid report'}</span>
                <span className="rt">{r.title}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="corr-soon">Corridor-specific research is expanding. Meanwhile, browse the full library.</p>
        )}
      </section>

      {/* 7 · Official sources */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: accent }}>Primary links</div><h2>Official sources</h2></div></div>
        <ul className="corr-official">
          {c.official.map((o) => (
            <li key={o.url}><a href={o.url} target="_blank" rel="noopener noreferrer">↗ {o.label}</a></li>
          ))}
        </ul>
      </section>

      {/* 8 · Track this corridor */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: accent }}>Stay current</div><h2>Track this corridor</h2></div></div>
        <p className="lede" style={{ maxWidth: '50ch' }}>Get an email when this corridor’s status, nodes or our analysis changes.</p>
        <CorridorTrack slug={c.slug} label={`${label} corridor`} />

        <nav className="corr-prevnext" style={{ marginTop: 40 }}>
          <Link href={`/corridors/${prev.slug}/`}><span className="pn-k">← Previous</span>{prev.name}</Link>
          <Link href={`/corridors/${next.slug}/`} style={{ textAlign: 'right' }}><span className="pn-k">Next →</span>{next.name}</Link>
        </nav>
      </section>
    </>
  );
}
