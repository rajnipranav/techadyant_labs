import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AtlasNav } from '../../AtlasNav';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../../seo';
import {
  ENTITY_KIND_LABELS,
  entityBySlug,
  graphEntities,
  relatedEdges,
  relatedEntities,
} from '../../graph';

export function generateStaticParams() {
  return graphEntities.map((entity) => ({ slug: entity.slug }));
}

const clamp = (value: string, length = 158) =>
  value.length <= length ? value : `${value.slice(0, length - 1).replace(/\s+\S*$/, '')}...`;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entity = entityBySlug(slug);
  if (!entity) return { title: 'Atlas Entity' };
  return {
    title: `${entity.title} - Atlas Entity`,
    description: clamp(entity.summary || `${entity.title} in the Techadyant Atlas knowledge graph.`),
    alternates: { canonical: `${SITE}/research/entities/${entity.slug}/` },
  };
}

function schemaType(kind: string): string {
  if (kind === 'company') return 'Organization';
  if (kind === 'state' || kind === 'industrial_corridor') return 'Place';
  if (kind === 'report' || kind === 'signal') return 'Article';
  if (kind === 'dataset') return 'Dataset';
  return 'DefinedTerm';
}

export default async function EntityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entity = entityBySlug(slug);
  if (!entity) notFound();

  const edges = relatedEdges(entity.id);
  const related = relatedEntities(entity.id).slice(0, 24);
  const crumb = breadcrumb([
    { name: 'Home', path: '/' },
    { name: 'The Atlas', path: '/research/' },
    { name: 'Entities', path: '/research/entities/' },
    { name: entity.title, path: `/research/entities/${entity.slug}/` },
  ]);

  const entityLd = {
    '@context': 'https://schema.org',
    '@type': schemaType(entity.kind),
    '@id': `${SITE}/research/entities/${entity.slug}/#entity`,
    name: entity.title,
    description: entity.summary,
    url: `${SITE}/research/entities/${entity.slug}/`,
    publisher: ORG_REF,
    ...(entity.country ? { address: { '@type': 'PostalAddress', addressCountry: entity.country } } : {}),
    ...(entity.tags.length ? { keywords: entity.tags } : {}),
  };

  return (
    <>
      <AtlasNav />
      <JsonLd data={[crumb, entityLd]} />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">Atlas</Link><span className="sep">/</span>
            <Link href="/research/entities/">Entities</Link><span className="sep">/</span><span>{entity.title}</span>
          </div>
          <h1>{entity.title}</h1>
          <div className="player-meta">
            <span className="ply-type">{ENTITY_KIND_LABELS[entity.kind]}</span>
            {entity.country ? <span className={`ply-flag ${entity.country === 'IN' ? 'dom' : 'frn'}`}>{entity.country}</span> : null}
          </div>
          <p className="lede" style={{ marginTop: 14 }}>{entity.summary}</p>
          {entity.tags.length > 0 ? (
            <div className="entity-tag-row">
              {entity.tags.slice(0, 10).map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          ) : null}
        </div>
      </header>

      <section className="wrap entity-layout">
        <div className="entity-main">
          {entity.keyFacts?.length || entity.metrics?.length ? (
            <section>
              <div className="section-head-ed compact">
                <div>
                  <div className="ed-kicker">Reference data</div>
                  <h2>Key facts</h2>
                </div>
              </div>
              <div className="entity-fact-grid">
                {(entity.keyFacts ?? []).map((fact) => (
                  <div key={`${fact.label}-${fact.value}`} className="entity-fact">
                    <span>{fact.label}</span>
                    <b>{fact.value}</b>
                    {fact.sourceTitle ? <em>{fact.sourceTitle}</em> : null}
                  </div>
                ))}
                {(entity.metrics ?? []).map((metric) => (
                  <div key={`${metric.label}-${metric.value}`} className="entity-fact">
                    <span>{metric.label}</span>
                    <b>{metric.value}{metric.unit ? ` ${metric.unit}` : ''}</b>
                    {metric.sourceTitle ? <em>{metric.sourceTitle}</em> : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {entity.scores.length > 0 ? (
            <section>
              <div className="section-head-ed compact">
                <div>
                  <div className="ed-kicker">Proprietary scores</div>
                  <h2>Strategic profile</h2>
                </div>
              </div>
              <div className="entity-score-grid">
                {entity.scores.map((score) => (
                  <div key={score.key} className="entity-score">
                    <div className="entity-score-top">
                      <span>{score.label}</span>
                      <b>{score.value}/5</b>
                    </div>
                    <div className="entity-score-track" aria-hidden="true">
                      <span style={{ width: `${Math.max(0, Math.min(5, score.value)) * 20}%` }} />
                    </div>
                    {score.rationale ? <p>{score.rationale}</p> : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <div className="section-head-ed compact">
              <div>
                <div className="ed-kicker">Knowledge graph</div>
                <h2>Mapped relationships</h2>
              </div>
            </div>
            {edges.length > 0 ? (
              <ul className="player-edges" role="list">
                {edges.slice(0, 40).map((edge) => {
                  const otherId = edge.sourceId === entity.id ? edge.targetId : edge.sourceId;
                  const other = graphEntities.find((item) => item.id === otherId);
                  return (
                    <li key={edge.id} className="player-edge">
                      <span className="pe-verb">{edge.label}</span>
                      {other ? <Link href={other.href} className="pe-other">{other.title}</Link> : <span className="pe-other">{otherId}</span>}
                      {edge.summary ? <span className="pe-desc">- {edge.summary}</span> : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="player-empty">No mapped relationships yet for this entity.</p>
            )}
          </section>
        </div>

        <aside className="entity-side">
          <section className="entity-side-panel">
            <h2>Key facts</h2>
            <dl>
              <dt>Entity type</dt><dd>{ENTITY_KIND_LABELS[entity.kind]}</dd>
              {entity.country ? <><dt>Country</dt><dd>{entity.country}</dd></> : null}
              <dt>Source system</dt><dd>{entity.sourceSystem.toUpperCase()}</dd>
              {entity.updatedAt ? <><dt>Last updated</dt><dd>{new Date(entity.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</dd></> : null}
            </dl>
          </section>

          {related.length > 0 ? (
            <section className="entity-side-panel">
              <h2>Related entities</h2>
              <ul role="list" className="entity-related-list">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link href={item.href}>{item.title}</Link>
                    <span>{ENTITY_KIND_LABELS[item.kind]}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {entity.sources.length > 0 ? (
            <section className="entity-side-panel">
              <h2>Sources</h2>
              <ul role="list" className="entity-related-list">
                {entity.sources.slice(0, 8).map((source) => (
                  <li key={source.title}>
                    {source.url ? <a href={source.url}>{source.title}</a> : <span>{source.title}</span>}
                    {source.publisher ? <span>{source.publisher}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </section>
    </>
  );
}
