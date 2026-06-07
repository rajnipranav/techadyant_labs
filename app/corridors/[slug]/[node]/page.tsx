import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { corridors, CLASS_COLOR } from '../../data';
import { deepFor, nodeBySlugs, allCorridorNodePairs, STAGE } from '../../node-data';

export function generateStaticParams() {
  return allCorridorNodePairs().map((p) => ({ slug: p.corridor, node: p.node }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; node: string }> }): Promise<Metadata> {
  const { slug, node } = await params;
  const n = nodeBySlugs(slug, node);
  if (!n) return { title: 'Node' };
  const cor = corridors.find((c) => c.slug === slug);
  return {
    title: `${n.name} — ${cor?.abbr ?? 'corridor'} node`,
    description: `${n.name} (${n.state}): ${STAGE[n.stage].label}. ${n.summary[0]?.slice(0, 150) ?? ''}`,
    alternates: { canonical: `https://labs.techadyant.com/corridors/${slug}/${node}/` },
  };
}

const inr = (cr?: number) => (cr == null ? null : cr >= 100000 ? `₹${(cr / 100000).toFixed(2)} lakh cr` : `₹${cr.toLocaleString('en-IN')} cr`);

export default async function NodePage({ params }: { params: Promise<{ slug: string; node: string }> }) {
  const { slug, node } = await params;
  const n = nodeBySlugs(slug, node);
  const cor = corridors.find((c) => c.slug === slug);
  const deep = deepFor(slug);
  if (!n || !cor || !deep) notFound();

  const accent = CLASS_COLOR[cor.cls];
  const st = STAGE[n.stage];
  const idx = deep.nodes.findIndex((x) => x.slug === node);
  const prev = deep.nodes[idx - 1], next = deep.nodes[idx + 1];

  const stats = [
    n.areaAc != null && { label: 'Area', value: `${n.areaAc.toLocaleString('en-IN')} acres` },
    n.projectCostCr != null && { label: 'Trunk-infra cost', value: inr(n.projectCostCr) },
    n.investmentCr != null && { label: 'Investment potential', value: inr(n.investmentCr) },
    n.jobs != null && { label: 'Projected jobs', value: n.jobs.toLocaleString('en-IN') },
  ].filter(Boolean) as { label: string; value: string }[];

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Place', name: n.name,
    address: { '@type': 'PostalAddress', addressRegion: n.state, addressCountry: 'IN' },
    description: n.summary[0],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="ed-page-head" style={{ ['--accent' as string]: accent }}>
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/corridors">Corridors</Link><span className="sep">/</span>
            <Link href={`/corridors/${slug}`}>{cor.abbr}</Link><span className="sep">/</span><span>{n.name}</span>
          </div>
          <h1>{n.name}</h1>
          <div className="node-head-meta">
            <span className="node-stage" style={{ color: st.color, borderColor: st.color }}>{st.label}</span>
            <span className="node-state">{n.state}</span>
            <span className="node-status-detail">{n.statusLabel}</span>
          </div>
        </div>
      </header>

      {stats.length > 0 && (
        <section className="wrap">
          <div className="node-stats">
            {stats.map((s) => (
              <div key={s.label} className="node-stat"><span className="ns-v" style={{ color: accent }}>{s.value}</span><span className="ns-l">{s.label}</span></div>
            ))}
          </div>
        </section>
      )}

      <section className="wrap-narrow">
        {n.summary.map((p, i) => <p key={i} className="node-para">{p}</p>)}

        <div className="node-facts">
          <div><dt>Sectors</dt><dd>{n.sectors}</dd></div>
          {n.anchors && <div><dt>Anchor</dt><dd>{n.anchors}</dd></div>}
          {n.nearest && <div><dt>Nearest hub</dt><dd>{n.nearest}</dd></div>}
          {n.developer && <div><dt>Developer / SPV</dt><dd>{n.developer}</dd></div>}
          {n.epc && <div><dt>EPC contractor</dt><dd>{n.epc}</dd></div>}
          <div><dt>Status</dt><dd>{n.statusLabel}</dd></div>
        </div>

        {n.companies && n.companies.length > 0 && (
          <>
            <h2 className="node-h2">Companies &amp; commitments</h2>
            <table className="node-companies">
              <thead><tr><th>Company</th><th>Sector</th><th>Commitment</th></tr></thead>
              <tbody>
                {n.companies.map((co, i) => (
                  <tr key={i}><td>{co.name}</td><td>{co.sector ?? '—'}</td><td>{co.commitment ?? co.note ?? '—'}</td></tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {n.industries && n.industries.length > 0 && (
          <>
            <h2 className="node-h2">Industries coming up</h2>
            <div className="node-chips">{n.industries.map((x, i) => <span key={i}>{x}</span>)}</div>
          </>
        )}

        {n.infrastructure && n.infrastructure.length > 0 && (
          <>
            <h2 className="node-h2">Infrastructure &amp; connectivity</h2>
            <ul className="node-infra" role="list">{n.infrastructure.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </>
        )}

        {n.incentives && <p className="node-para"><strong>Incentives &amp; land:</strong> {n.incentives}</p>}

        {n.sections && n.sections.map((sec, i) => (
          <div key={i}>
            <h2 className="node-h2">{sec.heading}</h2>
            {sec.body.map((para, j) => <p key={j} className="node-para">{para}</p>)}
          </div>
        ))}

        {n.timeline && n.timeline.length > 0 && (
          <>
            <h2 className="node-h2">Timeline</h2>
            <ul className="node-timeline" role="list">
              {n.timeline.map((t, i) => (
                <li key={i}><span className="nt-date">{t.date}</span><span className="nt-label">{t.label}</span></li>
              ))}
            </ul>
          </>
        )}

        <h2 className="node-h2">Sources</h2>
        <ul className="node-sources" role="list">
          {n.sources.map((s, i) => <li key={i}><a href={s.url} target="_blank" rel="noopener">{s.label} ↗</a></li>)}
        </ul>

        <div className="node-foot">
          {prev ? <Link href={`/corridors/${slug}/${prev.slug}`} className="see-all">← {prev.name.replace(/ IMC.*| \(.*/, '')}</Link> : <span />}
          <Link href={`/corridors/${slug}`} className="see-all">All {cor.abbr} nodes</Link>
          {next ? <Link href={`/corridors/${slug}/${next.slug}`} className="see-all">{next.name.replace(/ IMC.*| \(.*/, '')} →</Link> : <span />}
        </div>
      </section>
    </>
  );
}
