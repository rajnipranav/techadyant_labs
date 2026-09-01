import type { Metadata } from 'next';
import { companyDossierMetadata, renderCompanyDossierPage } from '../../../../../_companyDossierPage';
import Link from 'next/link';
import { AtlasNav } from '../../../../AtlasNav';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../../../../seo';
import {
  entities, entityBySlug, entitySlug, relationshipsFor, programmes, dependencies,
  originOf, statusInfo, humanize, sourcesFor,
} from '../../data';
import { StatusBadge, OriginBadge, ServiceTag, EntityLink, SourceRefs, card, kick } from '../../ui';
import { listStaticParamsForBase } from '../../../../../../lib/loadDossier';

const BASE = '/research/pillars/defence';

export function generateStaticParams() {
  return listStaticParamsForBase("/research/pillars/defence/entity/");
}
// dynamicParams removed — thin fallback guarantees 200 for hub-linked slugs

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dossierMetadata = companyDossierMetadata(slug, 'defence');
  if (dossierMetadata) return dossierMetadata;
  const e = entityBySlug(slug);
  if (!e) return { title: 'Entity — Defence Atlas' };
  const o = originOf(e);
  return {
    title: `${e.name} — ${humanize(e.type)} | Techadyant Defence Atlas`,
    description: `${e.name}: ${humanize(e.type)} in India's defence ecosystem (${e.service.map(humanize).join(', ')}). ${o.label}${e.status ? ` · ${statusInfo(e.status).label}` : ''}. Manufacturer, suppliers, systems, programmes, procurement and dependencies.`.slice(0, 250),
    alternates: { canonical: `${SITE}${BASE}/entity/${slug}/` },
  };
}

function RelBlock({ title, items }: { title: string; items: { key: string; node: React.ReactNode }[] }) {
  if (!items.length) return null;
  return (
    <div>
      <div style={{ ...kick, marginBottom: 8 }}>{title} · {items.length}</div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
        {items.map((i) => <li key={i.key} style={{ fontSize: 13.5, color: 'var(--text-dim)', lineHeight: 1.5 }}>{i.node}</li>)}
      </ul>
    </div>
  );
}

export default async function EntityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dossierPage = renderCompanyDossierPage(slug, 'defence');
  if (dossierPage) return dossierPage;
  const e = entityBySlug(slug);
  if (!e) return <><AtlasNav /><section className="wrap"><p>Entity not found.</p></section></>;

  const edges = relationshipsFor(e.id);
  const outEdges = edges.filter((x) => x.dir === 'out');
  const inEdges = edges.filter((x) => x.dir === 'in');
  // Link programmes that share a distinctive token with this entity's name (programmes and
  // entities live in separate id-spaces, e.g. entity nav-p17a ↔ programme prg-p17a).
  const tokens = (s: string) => s.toLowerCase().match(/[a-z0-9]{4,}/g) ?? [];
  const eTokens = new Set(tokens(e.name).filter((t) => !['main', 'battle', 'tank', 'system', 'class', 'gun', 'weapon', 'aircraft', 'combat'].includes(t)));
  const relatedProgs = eTokens.size
    ? programmes.filter((p) => tokens(p.name).some((t) => eTokens.has(t)))
    : [];
  const asDependent = dependencies.filter((d) => d.dependent === e.id);
  const asDependency = dependencies.filter((d) => d.dependency === e.id);
  const o = originOf(e);

  // Collect all sources referenced by edges/deps for this entity.
  const refSet = new Set<string>();
  edges.forEach((x) => (x.rel.source_refs ?? []).forEach((r) => refSet.add(r)));
  [...asDependent, ...asDependency].forEach((d) => (d.source_refs ?? []).forEach((r) => refSet.add(r)));
  const srcList = sourcesFor([...refSet].sort());

  const ld = {
    '@context': 'https://schema.org',
    '@type': e.type === 'company' || e.type === 'psu' || e.type === 'jv' || e.type === 'foreign_supplier' ? 'Organization' : 'Product',
    name: e.name,
    url: `${SITE}${BASE}/entity/${slug}/`,
    ...(e.country ? { countryOfOrigin: e.country } : {}),
    publisher: ORG_REF,
  };

  const out = (verb: string, x: { otherId: string; otherName: string; rel: { source_refs?: string[] } }) => ({
    key: `${verb}-${x.otherId}`,
    node: <span><span style={{ color: 'var(--text-muted)' }}>{verb} </span><EntityLink id={x.otherId} /> <SourceRefs refs={x.rel.source_refs} /></span>,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <AtlasNav />
      <JsonLd data={breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'The Atlas', path: '/research/' },
        { name: 'Defence', path: `${BASE}/` },
        { name: e.name, path: `${BASE}/entity/${slug}/` },
      ])} />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">The Atlas</Link><span className="sep">/</span>
            <Link href={`${BASE}/`}>Defence</Link><span className="sep">/</span><span>{e.name}</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass-cream, #E6D1A0)' }}>{humanize(e.type)}{e.country ? ` · ${e.country}` : ''}</div>
          <h1>{e.name}</h1>
          <div className="atlas-meta-row" style={{ marginTop: 10 }}>
            {e.service.map((s) => <span key={s}><ServiceTag code={s} /></span>)}
            <span><OriginBadge entity={e} /></span>
            {e.status && <span><StatusBadge status={e.status} /></span>}
          </div>
        </div>
      </header>

      <section className="wrap" style={{ display: 'grid', gap: 26 }}>
        {e.domain.length > 0 && (
          <div>
            <div style={{ ...kick, marginBottom: 8 }}>Capability domains</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {e.domain.map((d) => <span key={d} style={{ fontSize: 12.5, color: 'var(--text-dim)', border: '1px solid var(--border, rgba(255,255,255,.14))', borderRadius: 6, padding: '4px 10px' }}>{humanize(d)}</span>)}
            </div>
          </div>
        )}

        <div style={{ ...card, display: 'grid', gap: 6, fontSize: 13.5, color: 'var(--text-dim)' }}>
          <div>Type: <span style={{ color: 'var(--text)' }}>{humanize(e.type)}</span></div>
          <div>Services: <span style={{ color: 'var(--text)' }}>{e.service.map(humanize).join(', ')}</span></div>
          <div>Country of origin: <span style={{ color: 'var(--text)' }}>{e.country || '—'}</span></div>
          <div>Indigenisation: <span style={{ color: o.color }}>{o.label}</span></div>
          {e.status && <div>Status: <span style={{ color: statusInfo(e.status).color }}>{statusInfo(e.status).label}</span></div>}
        </div>

        {(outEdges.length > 0 || inEdges.length > 0) && (
          <div style={{ display: 'grid', gap: 22, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            <RelBlock title="This entity →" items={outEdges.map((x) => out(x.rel.type.replace(/_/g, ' '), x))} />
            <RelBlock title="← Referenced by" items={inEdges.map((x) => ({
              key: `in-${x.otherId}-${x.rel.type}`,
              node: <span><EntityLink id={x.otherId} /> <span style={{ color: 'var(--text-muted)' }}>{x.rel.type.replace(/_/g, ' ')} this</span> <SourceRefs refs={x.rel.source_refs} /></span>,
            }))} />
          </div>
        )}

        {(asDependent.length > 0 || asDependency.length > 0) && (
          <div>
            <div style={{ ...kick, marginBottom: 8 }}>Dependencies</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {asDependent.map((d) => (
                <li key={d.id} style={{ ...card, padding: '10px 14px', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>depends on </span>{humanize(d.dependency)}
                  <span style={{ marginLeft: 8, fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: d.importance === 'critical' ? '#E24B4A' : '#F5B544' }}>{d.importance}</span>
                  <span style={{ marginLeft: 8 }}><SourceRefs refs={d.source_refs} /></span>
                </li>
              ))}
              {asDependency.map((d) => (
                <li key={d.id} style={{ ...card, padding: '10px 14px', fontSize: 13 }}>
                  <EntityLink id={d.dependent} /> <span style={{ color: 'var(--text-muted)' }}>depends on this</span>
                  <span style={{ marginLeft: 8, fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: d.importance === 'critical' ? '#E24B4A' : '#F5B544' }}>{d.importance}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {relatedProgs.length > 0 && (
          <div>
            <div style={{ ...kick, marginBottom: 8 }}>Programmes</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {relatedProgs.map((p) => (
                <li key={p.id} style={{ ...card, padding: '10px 14px', fontSize: 13 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text)' }}>{p.name}</span>
                  <span style={{ marginLeft: 8 }}><StatusBadge status={p.status} /></span>
                  <span style={{ marginLeft: 8 }}><SourceRefs refs={p.source_refs} /></span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {srcList.length > 0 && (
          <div>
            <div style={{ ...kick, marginBottom: 8 }}>Sources · {srcList.length}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {srcList.map((s) => (
                <li key={s.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px', fontSize: 12.5 }}>
                  <a href={s.url} target="_blank" rel="noreferrer" style={{ color: 'var(--link, #6cb0ff)', fontWeight: 600 }}>{s.title}</a>
                  <span style={{ marginLeft: 8, fontSize: 10.5, color: 'var(--text-muted)' }}>{s.date} · {s.id}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div><Link href={`${BASE}/`} style={{ color: 'var(--text-dim)', fontSize: 13 }}>← Back to the Defence Atlas</Link></div>
      </section>
    </>
  );
}




