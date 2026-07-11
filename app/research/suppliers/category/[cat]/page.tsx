import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AtlasNav } from '../../../AtlasNav';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../../../seo';
import {
  CATEGORY_HUBS, hubBySlug, suppliersInCategory, topRated, categoryFaq,
  STATE_HUBS,
} from '../../../suppliers-hubs';
import type { Supplier } from '../../../suppliers';

export function generateStaticParams() {
  return CATEGORY_HUBS.map((h) => ({ cat: h.slug }));
}
export const dynamicParams = false;

export function generateMetadata({ params }: { params: { cat: string } }): Metadata {
  const hub = hubBySlug(params.cat);
  if (!hub) return {};
  const list = suppliersInCategory(hub.category);
  const verified = list.filter((s) => s.verified === 'Yes').length;
  return {
    title: `${list.length} ${hub.kw[0].toUpperCase()}${hub.kw.slice(1)} (2026 Directory)`,
    description: `Directory of ${list.length} ${hub.kw} — ${verified} verified. ${hub.blurb} Filter by location, certification, tolerance and capacity.`,
    alternates: { canonical: `${SITE}/research/suppliers/category/${hub.slug}/` },
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
      <div className="sa-loc">📍 {s.city}, {s.state} · <span style={{ color: 'var(--text-dim)' }}>{s.subSpecialty}</span></div>
      <div className="sa-specs">
        <div><b>Tolerance</b> {s.tolerance}</div><div><b>Lead time</b> {s.leadWeeks} wks</div>
        <div><b>Revenue</b> {s.revenueBand}</div><div><b>Machines</b> {s.machineCount}</div>
      </div>
      <div className="sa-certs">{certs.map((c) => <span key={c} className="sa-cchip">{c}</span>)}</div>
      <div className="sa-meta"><span className="sa-stars">{stars(s.rating)}</span></div>
    </a>
  );
}

export default function CategoryHubPage({ params }: { params: { cat: string } }) {
  const hub = hubBySlug(params.cat);
  if (!hub) notFound();
  const list = suppliersInCategory(hub.category);
  const verified = list.filter((s) => s.verified === 'Yes').length;
  const exportReady = list.filter((s) => s.exportExp === 'Yes').length;
  const states = new Set(list.map((s) => s.state).filter(Boolean)).size;
  const top = topRated(list, 30);
  const faq = categoryFaq(list, hub.label, hub.kw);

  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([
          { name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' },
          { name: 'Supplier Directory', path: '/research/suppliers/' }, { name: hub.label, path: `/research/suppliers/category/${hub.slug}/` },
        ]),
        {
          '@context': 'https://schema.org', '@type': 'CollectionPage',
          name: `${hub.label} in India`, url: `${SITE}/research/suppliers/category/${hub.slug}/`,
          description: `Directory of ${list.length} ${hub.kw}. ${hub.blurb}`, publisher: ORG_REF,
          isPartOf: { '@type': 'Dataset', name: 'India Industrial Supplier Atlas', url: `${SITE}/research/suppliers/` },
        },
        {
          '@context': 'https://schema.org', '@type': 'ItemList',
          name: `Top ${hub.label} in India`, numberOfItems: top.length,
          itemListElement: top.slice(0, 20).map((s, i) => ({
            '@type': 'ListItem', position: i + 1,
            item: { '@type': 'Organization', name: s.name, address: { '@type': 'PostalAddress', addressLocality: s.city, addressRegion: s.state, addressCountry: 'IN' } },
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
            <Link href="/research/suppliers/">Suppliers</Link><span className="sep">/</span><span>{hub.label}</span>
          </div>
          <h1>{hub.label} in India</h1>
          <p className="lede">{hub.blurb} The Atlas maps {list.length} such suppliers — {verified} verified, {exportReady} export-ready, across {states} states.</p>
        </div>
      </header>

      <section className="wrap">
        <div className="sa">
          <div className="sa-kpis">
            <div className="sa-kpi k1"><div className="n">{list.length}</div><div className="l">Suppliers</div><div className="s">In this capability</div></div>
            <div className="sa-kpi k2"><div className="n teal">{verified}</div><div className="l">Verified</div><div className="s">{Math.round(verified / list.length * 100)}% of category</div></div>
            <div className="sa-kpi k4"><div className="n indigo">{states}</div><div className="l">States</div><div className="s">Geographic spread</div></div>
            <div className="sa-kpi k5"><div className="n">{exportReady}</div><div className="l">Export-ready</div><div className="s">{Math.round(exportReady / list.length * 100)}% of category</div></div>
          </div>

          <div className="sa-sech" style={{ marginTop: 8 }}>
            <h2>Top-rated {hub.label.toLowerCase()}</h2>
            <span className="sub">By Techadyant capability rating · open any card in the full directory</span>
            <Link className="sa-pill" style={{ marginLeft: 'auto', textDecoration: 'none' }} href={`/research/suppliers?category=${encodeURIComponent(hub.category)}`}>Filter all {list.length} in the directory →</Link>
          </div>
          <div className="sa-grid">
            {top.map((s) => <ServerCard key={s.id} s={s} />)}
          </div>

          <div className="sa-faq">
            <h2>{hub.label} in India — questions answered</h2>
            {faq.map((f) => (
              <div className="sa-qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>
            ))}
          </div>

          <div className="sa-browse">
            <div className="sa-browse-h">Other capabilities</div>
            <div className="sa-browse-row">
              {CATEGORY_HUBS.filter((h) => h.slug !== hub.slug).map((h) => (
                <Link key={h.slug} href={`/research/suppliers/category/${h.slug}`} className="sa-blink">{h.label}</Link>
              ))}
            </div>
            <div className="sa-browse-h" style={{ marginTop: 18 }}>By state</div>
            <div className="sa-browse-row">
              {STATE_HUBS.slice(0, 12).map((h) => (
                <Link key={h.slug} href={`/research/suppliers/state/${h.slug}`} className="sa-blink">{h.state} <span>{h.count}</span></Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
