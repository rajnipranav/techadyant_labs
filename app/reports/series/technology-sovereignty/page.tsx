import type { Metadata } from 'next';
import Link from 'next/link';
import { getReport } from '../../data';

export const metadata: Metadata = {
  title: 'The Technology Sovereignty Series',
  description:
    'A multi-volume body of work mapping India’s technology dependencies layer by layer — enterprise software, cloud, AI and engineering software — on one framework stack (EDI / SSS / DIEM), building toward the India Technology Sovereignty Index.',
  alternates: { canonical: 'https://labs.techadyant.com/reports/series/technology-sovereignty/' },
};

interface Vol { n: string; title: string; sub: string; slug?: string; status: 'published' | 'forthcoming' }
const VOLUMES: Vol[] = [
  { n: 'I', title: 'The SAP Question', sub: 'India’s dependence on foreign enterprise software and the emerging sovereign-software opportunity.', slug: 'the-sap-question', status: 'published' },
  { n: 'II', title: 'The Cloud Question', sub: 'India’s dependence on foreign hyperscalers and the sovereign-cloud challenge.', status: 'forthcoming' },
  { n: 'III', title: 'The AI Question', sub: 'Who will control India’s enterprise intelligence layer.', status: 'forthcoming' },
  { n: 'IV', title: 'The Engineering Software Question', sub: 'India’s dependence on foreign industrial and design software — EDA, CAD, simulation, PLM.', status: 'forthcoming' },
  { n: 'V', title: 'The Sovereign Technology Report', sub: 'The synthesis: India’s strategic technology dependencies, from semiconductors to enterprise software.', status: 'forthcoming' },
  { n: '★', title: 'India Technology Sovereignty Index 2027', sub: 'The recurring capstone — an annual, defensible national roll-up across every layer.', status: 'forthcoming' },
];

export default function SeriesPage() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'The Technology Sovereignty Series — Techadyant Labs',
    url: 'https://labs.techadyant.com/reports/series/technology-sovereignty/',
    description: metadata.description,
    hasPart: VOLUMES.filter((v) => v.slug && getReport(v.slug)).map((v) => ({
      '@type': 'Report', name: v.title, url: `https://labs.techadyant.com/reports/${v.slug}/`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/reports/">Reports</Link><span className="sep">/</span><span>Technology Sovereignty Series</span>
          </div>
          <h1>The Technology Sovereignty Series</h1>
          <p className="lede">
            India built the world’s technology workforce and imports the technology that runs its own economy.
            The series maps that dependency layer by layer — enterprise software, cloud, AI, engineering software —
            on one framework stack (EDI / SSS / DIEM), building incrementally toward the India Technology Sovereignty Index.
            The evidence accrues volume by volume; the Index is the conclusion the body of work earns.
          </p>
        </div>
      </header>

      <section className="wrap" style={{ maxWidth: 820 }}>
        <div style={{ display: 'grid', gap: 14 }}>
          {VOLUMES.map((v) => {
            const live = v.slug && getReport(v.slug);
            const inner = (
              <div style={{
                display: 'flex', gap: 18, alignItems: 'flex-start', padding: '18px 20px',
                border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 12,
                opacity: v.status === 'forthcoming' ? 0.72 : 1,
              }}>
                <div style={{ fontFamily: 'var(--mono, monospace)', fontSize: 22, fontWeight: 700, color: 'var(--accent, #C9A84C)', minWidth: 36 }}>{v.n}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: 19 }}>{v.title}</h3>
                    <span style={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: v.status === 'published' ? 'var(--accent, #C9A84C)' : 'var(--text-dim,#9aa3b2)' }}>
                      {v.status === 'published' ? 'Published · Free' : 'Forthcoming'}
                    </span>
                  </div>
                  <p style={{ margin: '6px 0 0', color: 'var(--text-dim,#9aa3b2)', fontSize: 14 }}>{v.sub}</p>
                  {live && <p style={{ margin: '8px 0 0', fontSize: 13 }}>Read report →</p>}
                </div>
              </div>
            );
            return live ? (
              <Link key={v.title} href={`/reports/${v.slug}/`} style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</Link>
            ) : (
              <div key={v.title}>{inner}</div>
            );
          })}
        </div>
        <p style={{ marginTop: 40 }}><Link href="/reports/" className="btn-ed btn-ed-ghost">← All reports</Link></p>
      </section>
    </>
  );
}
