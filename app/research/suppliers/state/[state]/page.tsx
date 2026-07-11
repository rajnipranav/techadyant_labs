import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AtlasNav } from '../../../AtlasNav';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../../../seo';
import {
  STATE_HUBS, stateHubBySlug, suppliersInState, topRated, stateFaq,
  CATEGORY_HUBS,
} from '../../../suppliers-hubs';
import type { Supplier } from '../../../suppliers';

export function generateStaticParams() {
  return STATE_HUBS.map((h) => ({ state: h.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params;
  const hub = stateHubBySlug(state);
  if (!hub) return {};
  const list = suppliersInState(hub.state);
  const verified = list.filter((s) => s.verified === 'Yes').length;
  return {
    title: `${list.length} Manufacturing Suppliers in ${hub.state} — CNC, PCB, Composites, Tooling (2026)`,
    description: `Directory of ${list.length} manufacturing suppliers in ${hub.state} (${verified} verified) across CNC machining, PCB fabrication, composites, precision machining and tooling. Filter by capability, certification and capacity.`,
    alternates: { canonical: `${SITE}/research/suppliers/state/${hub.slug}/` },
  };
}

function stars(n: number | null) { const k = n || 0; return '★'.repeat(k) + '☆'.repeat(5 - k); }

function ServerCard({ s }: { s: Supplier }) {
  const certs = String(s.certifications || '').split(',').map((x) => x.trim()).filter(Boolean).slice(0, 3);
  return (
    <a className="sa-sup" href={`/research/suppliers?q=${encodeURIComponent(s.name)}`}>
      <div className="sa-suptop">
        <div><div className="sa-name">{s.name}</div><div className="sa-id">{s.id}</div></div>
        <span className="sa-bv" style={{ opacity: s.verified === 'Yes' ? 1 : 0.5 }}>{s.verified === 'Yes' ? '✓ Verified' : '◐ Partial'}</span>
      </div>
      <div className="sa-loc">📍 {s.city} · <span style={{ color: 'var(--text-dim)' }}>{s.category} · {s.subSpecialty}</span></div>
      <div className="sa-specs">
        <div><b>Tolerance</b> {s.tolerance}</div><div><b>Lead time</b> {s.leadWeeks} wks</div>
        <div><b>Revenue</b> {s.revenueBand}</div><div><b>Machines</b> {s.machineCount}</div>
      </div>
      <div className="sa-certs">{certs.map((c) => <span key={c} className="sa-cchip">{c}</span>)}</div>
      <div className="sa-meta"><span className="sa-stars">{stars(s.rating)}</span></div>
    </a>
  );
}

export default async function StateHubPage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const hub = stateHubBySlug(state);
  if (!hub) notFound();
  const list = suppliersInState(hub.state);
  const verified = list.filter((s) => s.verified === 'Yes').length;
  const exportReady = list.filter((s) => s.exportExp === 'Yes').length;
  const cats = new Map<string, number>();
  for (const s of list) cats.set(s.category, (cats.get(s.category) ?? 0) + 1);
  const catRows = [...cats.entries()].sort((a, b) => b[1] - a[1]);
  const top = topRated(list, 30);
  const faq = stateFaq(list, hub.state);

  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([
          { name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' },
          { name: 'Supplier Directory', path: '/research/suppliers/' }, { name: hub.state, path: `/research/suppliers/state/${hub.slug}/` },
        ]),
        {
          '@context': 'https://schema.org', '@type': 'CollectionPage',
          name: `Manufacturing suppliers in ${hub.state}`, url: `${SITE}/research/suppliers/state/${hub.slug}/`,
          description: `Directory of ${list.length} manufacturing suppliers in ${hub.state} across CNC, PCB, composites, precision machining and tooling.`, publisher: ORG_REF,
          isPartOf: { '@type': 'Dataset', name: 'India Industrial Supplier Atlas', url: `${SITE}/research/suppliers/` },
          spatialCoverage: { '@type': 'Place', name: `${hub.state}, India` },
        },
        {
          '@context': 'https://schema.org', '@type': 'ItemList',
          name: `Top manufacturing suppliers in ${hub.state}`, numberOfItems: top.length,
          itemListElement: top.slice(0, 20).map((s, i) => ({
            '@type': 'ListItem', position: i + 1,
            item: { '@type': 'Organization', name: s.name, address: { '@type': 'PostalAddress', addressLocality: s.city, addressRegion: hub.state, addressCountry: 'IN' } },
          })),
        },
        {
          '@context': 'https://schema.org', '@type': 'FAQPage',
          mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        },
      ]} />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">Atlas</Link><span className="sep">/</span>
            <Link href="/research/suppliers/">Suppliers</Link><span className="sep">/</span><span>{hub.state}</span>
          </div>
          <h1>Manufacturing suppliers in {hub.state}</h1>
          <p className="lede">{list.length} suppliers in {hub.state} across CNC machining, PCB fabrication, composites, precision machining and tooling — {verified} verified, {exportReady} export-ready.</p>
        </div>
      </header>

      <section className="wrap">
        <div className="sa">
          <div className="sa-kpis">
            <div className="sa-kpi k1"><div className="n">{list.length}</div><div className="l">Suppliers</div><div className="s">In {hub.state}</div></div>
            <div className="sa-kpi k2"><div className="n teal">{verified}</div><div className="l">Verified</div><div className="s">{Math.round(verified / list.length * 100)}% of state</div></div>
            <div className="sa-kpi k3"><div className="n brass">{catRows.length}</div><div className="l">Capability types</div><div className="s">Categories present</div></div>
            <div className="sa-kpi k5"><div className="n">{exportReady}</div><div className="l">Export-ready</div><div className="s">{Math.round(exportReady / list.length * 100)}% of state</div></div>
          </div>

          <div className="sa-sech" style={{ marginTop: 8 }}>
            <h2>What {hub.state} makes</h2><span className="sub">Capability mix in the state</span>
          </div>
          <div className="sa-browse-row" style={{ marginBottom: 22 }}>
            {catRows.map(([c, n]) => {
              const slug = CATEGORY_HUBS.find((h) => h.category === c)?.slug;
              return slug
                ? <Link key={c} href={`/research/suppliers/category/${slug}`} className="sa-blink">{c} <span>{n}</span></Link>
                : <span key={c} className="sa-blink">{c} <span>{n}</span></span>;
            })}
          </div>

          <div className="sa-sech">
            <h2>Top-rated suppliers in {hub.state}</h2><span className="sub">By Techadyant capability rating</span>
            <Link className="sa-pill" style={{ marginLeft: 'auto', textDecoration: 'none' }} href={`/research/suppliers?state=${encodeURIComponent(hub.state)}`}>Filter all {list.length} in the directory →</Link>
          </div>
          <div className="sa-grid">{top.map((s) => <ServerCard key={s.id} s={s} />)}</div>

          <div className="sa-faq">
            <h2>Manufacturing in {hub.state} — questions answered</h2>
            {faq.map((f) => <div className="sa-qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
          </div>

          <div className="sa-browse">
            <div className="sa-browse-h">Suppliers in other states</div>
            <div className="sa-browse-row">
              {STATE_HUBS.filter((h) => h.slug !== hub.slug).slice(0, 14).map((h) => (
                <Link key={h.slug} href={`/research/suppliers/state/${h.slug}`} className="sa-blink">{h.state} <span>{h.count}</span></Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
