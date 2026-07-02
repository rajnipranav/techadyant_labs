import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { JsonLd, breadcrumb, datasetLd, SITE } from '../seo';
import { ENTITY_KIND_LABELS, ENTITY_KIND_ORDER, atlasGraph, entitiesByKind } from '../graph';

export const metadata: Metadata = {
  title: 'Atlas Entities - Companies, technologies, materials and supply chains',
  description:
    'Browse the Techadyant Atlas entity graph across companies, technologies, materials, reports, signals, supply chains, ecosystems and opportunity surfaces.',
  alternates: { canonical: `${SITE}/research/entities/` },
};

export default function EntitiesPage() {
  const populatedKinds = ENTITY_KIND_ORDER
    .map((kind) => ({ kind, label: ENTITY_KIND_LABELS[kind], entities: entitiesByKind(kind) }))
    .filter((group) => group.entities.length > 0);

  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' }, { name: 'Entities', path: '/research/entities/' }]),
        datasetLd({
          name: 'Techadyant Atlas Entity Graph',
          description: 'A static industrial knowledge graph of companies, technologies, materials, products, reports, signals, ecosystems and supply-chain entities relevant to India.',
          path: '/research/entities/',
          keywords: ['India industrial ecosystem', 'knowledge graph', 'supply chains', 'import dependency'],
        }),
      ]} />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">Atlas</Link><span className="sep">/</span><span>Entities</span>
          </div>
          <h1>Atlas Entities</h1>
          <p className="lede">
            The canonical industrial knowledge graph behind the Atlas: companies, technologies,
            materials, products, policies, reports, signals, datasets, ecosystems and supply chains.
          </p>
          <div className="atlas-meta-row">
            <span><b>{atlasGraph.entities.length}</b> entities</span>
            <span><b>{atlasGraph.edges.length}</b> relationships</span>
            <span><b>{populatedKinds.length}</b> populated types</span>
          </div>
        </div>
      </header>

      <section className="wrap">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">Explore by type</div>
            <h2>Entity taxonomy</h2>
          </div>
          <p className="section-note">
            Phase 1 maps the existing SID and site data into this taxonomy. Empty entity classes
            are intentional placeholders for the researched database expansion.
          </p>
        </div>

        <div className="entity-kind-grid">
          {ENTITY_KIND_ORDER.map((kind) => {
            const entities = entitiesByKind(kind);
            return (
              <section key={kind} className="entity-kind-panel">
                <div className="entity-kind-head">
                  <h3>{ENTITY_KIND_LABELS[kind]}</h3>
                  <span>{entities.length}</span>
                </div>
                {entities.length > 0 ? (
                  <ul role="list" className="entity-link-list">
                    {entities.slice(0, 8).map((entity) => (
                      <li key={entity.id}>
                        <Link href={entity.href}>{entity.title}</Link>
                        {entity.subtitle ? <span>{entity.subtitle}</span> : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="entity-empty">Ready for researched seed data.</p>
                )}
              </section>
            );
          })}
        </div>
      </section>
    </>
  );
}
