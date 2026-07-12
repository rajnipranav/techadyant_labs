import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import platform from '../../../_platform.json';
import { AtlasNav } from '../../../AtlasNav';

type Rel = { name: string; kind: string; predicate: string; dir: 'in' | 'out' };
type Ent = {
  id: string; name: string; kind: string; kind_label: string;
  description: string | null; country: string | null; slug: string; relationships: Rel[];
};

const ENTS = platform as unknown as Ent[];
const SITE = 'https://labs.techadyant.com';

export const dynamicParams = false;

export function generateStaticParams() {
  return ENTS.map((e) => ({ kind: e.kind, slug: e.slug }));
}

function find(kind: string, slug: string) {
  return ENTS.find((e) => e.kind === kind && e.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ kind: string; slug: string }> }): Promise<Metadata> {
  const { kind, slug } = await params;
  const e = find(kind, slug);
  if (!e) return {};
  const desc = (e.description || `${e.name} — ${e.kind_label} in India's industrial systems.`).slice(0, 200);
  const url = `${SITE}/research/e/${kind}/${slug}/`;
  return {
    title: `${e.name} — ${e.kind_label}`,
    description: desc,
    alternates: { canonical: url },
    openGraph: { title: e.name, description: desc, url, type: 'article', siteName: 'Techadyant Labs' },
  };
}

export default async function EntityPage({ params }: { params: Promise<{ kind: string; slug: string }> }) {
  const { kind, slug } = await params;
  const e = find(kind, slug);
  if (!e) notFound();

  const outRels = e.relationships.filter((r) => r.dir === 'out');
  const inRels = e.relationships.filter((r) => r.dir === 'in');
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: e.name,
    description: e.description || undefined,
    inDefinedTermSet: `${SITE}/research/`,
    url: `${SITE}/research/e/${kind}/${slug}/`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <AtlasNav />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">The Atlas</Link><span className="sep">/</span><span>{e.kind_label}</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)' }}>{e.kind_label}{e.country ? ` · ${e.country}` : ''}</div>
          <h1>{e.name}</h1>
          {e.description && <p className="lede">{e.description}</p>}
        </div>
      </header>

      <section className="wrap-narrow" style={{ paddingTop: 24 }}>
        {(outRels.length > 0 || inRels.length > 0) ? (
          <div style={{ display: 'grid', gap: 24 }}>
            {outRels.length > 0 && (
              <div>
                <div className="ed-kicker" style={{ marginBottom: 10 }}>This {e.kind_label.toLowerCase()} —</div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 7 }}>
                  {outRels.map((r, i) => (
                    <li key={i} style={{ fontSize: 14.5, color: 'var(--text-dim, #c7c7d2)', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--brass, #C9A84C)' }}>{r.predicate}</span> {r.name}{' '}
                      <span style={{ color: 'var(--text-muted, #8a8a98)', fontSize: 12 }}>({r.kind})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {inRels.length > 0 && (
              <div>
                <div className="ed-kicker" style={{ marginBottom: 10 }}>Connected from —</div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 7 }}>
                  {inRels.map((r, i) => (
                    <li key={i} style={{ fontSize: 14.5, color: 'var(--text-dim, #c7c7d2)', lineHeight: 1.5 }}>
                      {r.name}{' '}
                      <span style={{ color: 'var(--text-muted, #8a8a98)', fontSize: 12 }}>({r.kind})</span>{' '}
                      <span style={{ color: 'var(--brass, #C9A84C)' }}>{r.predicate}</span> this
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="serif" style={{ color: 'var(--text-muted)' }}>Relationships for this entity are being mapped.</p>
        )}
        <p style={{ marginTop: 30 }}>
          <Link href="/research/" className="see-all">← Back to The Atlas</Link>
        </p>
      </section>
    </>
  );
}
