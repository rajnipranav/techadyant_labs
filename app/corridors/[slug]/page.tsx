import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CorridorTrack } from '../CorridorTrack';
import { corridors, corridorBySlug, CLASS_COLOR, CLASS_LABEL } from '../data';
import { getReport } from '../../reports/data';
import { JsonLd, breadcrumb, faqLd, datasetLd, SITE } from '../../research/seo';
import { deepDive } from '../deepdive';
import { corridorIntel, TIER_COLOR, STAGE_COLOR, STAGE_LABEL, rankOf, leaderboard } from '../corridor-intel';
import { CorridorNodeMap } from '../CorridorNodeMap';
import { deepFor, STAGE as NSTAGE, type NodeStage } from '../node-data';

export function generateStaticParams() {
  return corridors.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = corridorBySlug(slug);
  if (!c) return { title: 'Corridor' };
  return {
    title: `${c.name} (${c.abbr}) — status, nodes & investor dossier`,
    description: `${c.blurb} ${c.length}. Status, anchor nodes, programme, official sources and related research for India’s ${c.name}.`,
    alternates: { canonical: `${SITE}/corridors/${c.slug}/` },
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
            <Link href="/corridors">Corridors</Link><span className="sep">/</span><span>{label}</span>
          </div>
          <span className="corr-chip" style={{ color: accent }}>
            {(c.tag ? c.tag + ' · ' : '') + 'Corridor ' + String(c.num).padStart(2, '0')}
          </span>
          <h1 style={{ marginTop: 12 }}>{c.name}</h1>
          <p className="lede">{c.blurb}</p>
          <div className="corr-stats">
            <div><span className="cs-n" style={{ color: accent }}>{c.length.split(' · ')[0]}</span><span className="cs-l">Length</span></div>
            <div><span className="cs-n">{statesCount}</span><span className="cs-l">States</span></div>
            <div><span className="cs-n">{c.nodes.length}</span><span className="cs-l">Anchor nodes</span></div>
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
            The Techadyant Corridor Readiness Score rates maturity, capital momentum, connectivity and opportunity openness (each 0–25). This corridor ranks <strong style={{ color: 'var(--text-muted)' }}>#{rank} of {totalCorr}</strong>. <Link href="/corridors" style={{ color: accent }}>Compare all corridors →</Link>
          </p>
        </section>
      )}

      {/* 2 · Map */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: accent }}>Where it runs</div><h2>On the map</h2></div>
          <Link href="/corridors" className="see-all">All 11 corridors →</Link></div>
        {deep ? <CorridorNodeMap slug={c.slug} /> : <img src={`/figures/corridors/${c.slug}.svg`} alt={`Map of the ${c.name} — route, anchor nodes and states traversed`} className="corr-figure" loading="lazy" />}
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
          <div className="node-cards">
            {deep.nodes.map((n) => (
              <Link key={n.slug} href={`/corridors/${c.slug}/${n.slug}`} className="node-card node-card-link" style={{ ['--accent' as string]: NSTAGE[n.stage].color }}>
                <div className="ncl-top">
                  <h3>{n.name}</h3>
                  <span className="node-stage sm" style={{ color: NSTAGE[n.stage].color, borderColor: NSTAGE[n.stage].color }}>{NSTAGE[n.stage].label}</span>
                </div>
                <div className="st">{n.state}{n.areaAc ? ` · ${n.areaAc.toLocaleString('en-IN')} ac` : ''}{n.investmentCr ? ` · ₹${n.investmentCr.toLocaleString('en-IN')} cr` : ''}</div>
                <p>{n.summary[0]}</p>
                <span className="ncl-go">View node →</span>
              </Link>
            ))}
          </div>
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
            <p className="corr-soon">Deep-dive analysis in progress. The related research below covers the themes that land along this corridor.</p>
          </>
        )}
      </section>

      {/* 6 · Related research */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: accent }}>From the desk</div><h2>Related research</h2></div>
          <Link href="/reports" className="see-all">All reports →</Link></div>
        {rel.length > 0 ? (
          <div className="corr-rel">
            {rel.map((r) => (
              <Link key={r.slug} href={`/reports/${r.slug}`}>
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
          <Link href={`/corridors/${prev.slug}`}><span className="pn-k">← Previous</span>{prev.name}</Link>
          <Link href={`/corridors/${next.slug}`} style={{ textAlign: 'right' }}><span className="pn-k">Next →</span>{next.name}</Link>
        </nav>
      </section>
    </>
  );
}
