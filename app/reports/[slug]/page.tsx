import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { reports, getReport } from '../data';
import { ReportReader, type TocItem } from '../../components/ReportReader';
import {
  ReportContent as FabContent,
  toc as fabToc,
} from '../content/india-fab-ecosystem';

interface ReportModule {
  toc: TocItem[];
  Content: () => React.ReactElement;
}

const registry: Record<string, ReportModule> = {
  'india-fab-ecosystem': { toc: fabToc, Content: FabContent },
};

export function generateStaticParams() {
  return reports.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const r = getReport(slug);
  if (!r) return {};
  return {
    title: r.title,
    description: r.summary,
  };
}

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getReport(slug);
  if (!meta) notFound();

  const mod = registry[slug];

  return (
    <>
      <header className="report-hero">
        <div className="inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/reports">Reports</Link><span className="sep">/</span>
            <span>{meta.domain}</span>
          </div>
          <div className="r-tag">★ {meta.edition}</div>
          <h1>{meta.title}</h1>
          <p className="r-sub">{meta.subtitle}</p>
          <div className="report-byline">
            <div><div className="bk">Published</div><div className="bv">{meta.publishedLabel}</div></div>
            <div><div className="bk">Domain</div><div className="bv">{meta.domain}</div></div>
            <div><div className="bk">Reading time</div><div className="bv">{meta.readingTime}</div></div>
            <div><div className="bk">Author</div><div className="bv">Techadyant Labs · Research</div></div>
          </div>
        </div>
      </header>

      {mod ? (
        <ReportReader toc={mod.toc} title={meta.title}>
          <mod.Content />
        </ReportReader>
      ) : (
        <section className="wrap-narrow" style={{ paddingTop: 56 }}>
          <div className="exec-summary">
            <div className="es-label">Forthcoming</div>
            <p className="serif" style={{ fontSize: 17 }}>{meta.summary}</p>
            <p style={{ marginTop: 12 }}>
              This report is in preparation. Subscribe to be notified when it publishes.
            </p>
          </div>
          <Link href="/#subscribe" className="btn-ed btn-ed-primary">Subscribe for updates <span className="arr">→</span></Link>
        </section>
      )}

      {/* Report CTA */}
      <div className="report-cta">
        <div className="report-cta-inner">
          <div>
            <h3>Read the next edition first</h3>
            <p>New reports, signals and briefings on India’s industrial systems — infrequent and independent.</p>
          </div>
          <Link href="/#subscribe" className="btn-ed btn-ed-primary">Subscribe <span className="arr">→</span></Link>
        </div>
      </div>
    </>
  );
}
