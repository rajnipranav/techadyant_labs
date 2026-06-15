import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { corridors, CLASS_COLOR } from '../../data';
import { deepFor, nodeBySlugs, allCorridorNodePairs, STAGE } from '../../node-data';
import { JsonLd, breadcrumb, faqLd, SITE } from '../../../research/seo';

export function generateStaticParams() {
  return allCorridorNodePairs().map((p) => ({ slug: p.corridor, node: p.node }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; node: string }> }): Promise<Metadata> {
  const { slug, node } = await params;
  const n = nodeBySlugs(slug, node);
  if (!n) return { title: 'Node' };
  const cor = corridors.find((c) => c.slug === slug);
  const lead = n.companies?.[0]?.name;
  const sectorKw = String(n.sectors).split(',').map((x) => x.trim()).filter(Boolean);
  const statBits = [
    n.areaAc != null && `${n.areaAc.toLocaleString('en-IN')} acres`,
    n.investmentCr != null && `₹${n.investmentCr.toLocaleString('en-IN')} cr`,
    n.jobs != null && `${n.jobs.toLocaleString('en-IN')} jobs`,
  ].filter(Boolean).join(' · ');
  const metaDesc = `${n.name} (${n.state}) — ${cor?.abbr ?? ''} ${STAGE[n.stage].label}.${statBits ? ` ${statBits}.` : ''} ${n.summary?.[0] ?? ''}`.replace(/\s+/g, ' ').trim().replace(/^(.{0,155}\S)(?:\s[\s\S]*)?$/, '$1');
  return {
    title: `${n.name} — ${cor?.abbr ?? 'corridor'} node`,
    description: metaDesc,
    keywords: [n.name, `${n.name} ${cor?.abbr ?? ''}`.trim(), `${n.state} industrial corridor`, cor?.name ?? '', 'NICDP', 'industrial node', ...sectorKw, ...((n.companies ?? []).map((c) => c.name))].filter(Boolean) as string[],
    alternates: { canonical: `https://labs.techadyant.com/corridors/${slug}/${node}/` },
    openGraph: { title: `${n.name} — ${cor?.abbr ?? ''} node`, description: `${n.name} (${n.state}): ${STAGE[n.stage].label}.`, url: `https://labs.techadyant.com/corridors/${slug}/${node}/`, type: 'article' },
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

  const placeLd = {
    '@context': 'https://schema.org', '@type': 'Place', name: n.name,
    address: { '@type': 'PostalAddress', addressRegion: n.state, addressCountry: 'IN' },
    description: n.summary[0],
    url: `${SITE}/corridors/${slug}/${node}/`,
    containedInPlace: { '@type': 'Place', name: cor.name },
    keywords: [n.sectors, ...((n.companies ?? []).map((c) => c.name))].join(', '),
    additionalProperty: [
      n.areaAc != null && { '@type': 'PropertyValue', name: 'Planned area (acres)', value: n.areaAc },
      n.investmentCr != null && { '@type': 'PropertyValue', name: 'Investment potential (INR crore)', value: n.investmentCr },
      n.jobs != null && { '@type': 'PropertyValue', name: 'Projected jobs', value: n.jobs },
      { '@type': 'PropertyValue', name: 'Development stage', value: st.label },
    ].filter(Boolean),
  };
  const orgLd = (n.companies ?? []).map((co) => ({
    '@context': 'https://schema.org', '@type': 'Organization', name: co.name,
    ...(co.sector ? { description: co.sector } : {}),
    location: { '@type': 'Place', name: n.name, address: { '@type': 'PostalAddress', addressRegion: n.state, addressCountry: 'IN' }, containedInPlace: { '@type': 'Place', name: cor.name } },
  }));
  const faqs: { q: string; a: string }[] = [
    { q: `What is the status of ${n.name}?`, a: `${n.name} in ${n.state} is ${st.label.toLowerCase()} (${n.statusLabel}) on India’s ${cor.name}. ${n.summary[0]}` },
  ];
  if (n.companies && n.companies.length) {
    faqs.push({ q: `Which companies are investing in ${n.name}?`, a: n.companies.map((co) => `${co.name}${co.sector ? ` (${co.sector})` : ''}${(co.commitment ?? co.note) ? ` — ${co.commitment ?? co.note}` : ''}`).join('; ') + '.' });
  } else if (n.industries && n.industries.length) {
    faqs.push({ q: `What industries are coming up at ${n.name}?`, a: `${n.industries.join(', ')}. (No anchor tenants are publicly named at this stage.)` });
  }
  if (stats.length) {
    faqs.push({ q: `How big is ${n.name} and what is the investment?`, a: stats.map((s) => `${s.label}: ${s.value}`).join('; ') + '. Figures are official projections or verified allotments where available.' });
  }
  if (n.developer) {
    faqs.push({ q: `Who is developing ${n.name}?`, a: n.developer });
  }
  faqs.push({ q: `What sectors does ${n.name} target?`, a: `${n.sectors}.` });
  const crumb = breadcrumb([
    { name: 'Home', path: '/' }, { name: 'Corridors', path: '/corridors/' },
    { name: cor.abbr, path: `/corridors/${slug}/` }, { name: n.name, path: `/corridors/${slug}/${node}/` },
  ]);

  return (
    <>
      <JsonLd data={[crumb, placeLd, faqLd(faqs), ...orgLd]} />
      <header className="ed-page-head" style={{ ['--accent' as string]: accent }}>
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/corridors/">Corridors</Link><span className="sep">/</span>
            <Link href={`/corridors/${slug}/`}>{cor.abbr}</Link><span className="sep">/</span><span>{n.name}</span>
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
          {prev ? <Link href={`/corridors/${slug}/${prev.slug}/`} className="see-all">← {prev.name.replace(/ IMC.*| \(.*/, '')}</Link> : <span />}
          <Link href={`/corridors/${slug}/`} className="see-all">All {cor.abbr} nodes</Link>
          {next ? <Link href={`/corridors/${slug}/${next.slug}/`} className="see-all">{next.name.replace(/ IMC.*| \(.*/, '')} →</Link> : <span />}
        </div>
      </section>
    </>
  );
}
