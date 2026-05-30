import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { reports, getReport, formatPrice } from '../data';
import { ReportCommerceProvider } from '../../components/ReportCommerce';
import { ReportAccess } from '../../components/ReportAccess';
import { PremiumBody } from '../../components/PremiumBody';
import { ReportCover } from '../../components/ReportCover';
import { ReportReader, type TocItem } from '../../components/ReportReader';
import { ReportContent as FabContent, toc as fabToc } from '../content/india-fab-ecosystem';
import { ReportContent as AiTransitionContent, toc as aiTransitionToc } from '../content/india-ai-industrial-transition-2026-2035';
import { ReportContent as MineralsContent, toc as mineralsToc } from '../content/who-actually-captures-the-india-us-minerals-alliance';

interface ReportModule { toc: TocItem[]; Content: () => React.ReactElement }

const registry: Record<string, ReportModule> = {
  'india-fab-ecosystem': { toc: fabToc, Content: FabContent },
  'india-ai-industrial-transition-2026-2035': { toc: aiTransitionToc, Content: AiTransitionContent },
  'who-actually-captures-the-india-us-minerals-alliance': { toc: mineralsToc, Content: MineralsContent },
};

export function generateStaticParams() {
  return reports.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getReport(slug);
  if (!r) return {};
  return { title: r.title, description: r.summary };
}

function articleJsonLd(meta: ReturnType<typeof getReport>) {
  if (!meta) return null;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    alternativeHeadline: meta.subtitle,
    description: meta.summary,
    inLanguage: 'en-IN',
    datePublished: meta.published,
    dateModified: meta.published,
    isAccessibleForFree: meta.access === 'free',
    keywords: [
      meta.domain,
      'India AI infrastructure',
      'India semiconductors',
      'India data centres',
      'strategic intelligence',
      'industrial systems',
    ].join(', '),
    image: meta.cover ? `https://labs.techadyant.com${meta.cover}` : undefined,
    url: `https://labs.techadyant.com/reports/${meta.slug}`,
    author: {
      '@type': 'Organization',
      name: 'Techadyant Labs',
      url: 'https://labs.techadyant.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Techadyant Labs',
      url: 'https://labs.techadyant.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://labs.techadyant.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://labs.techadyant.com/reports/${meta.slug}`,
    },
  };
  return JSON.stringify(data);
}

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getReport(slug);
  if (!meta) notFound();

  const mod = registry[slug];
  const published = meta.status === 'published';
  const ldJson = articleJsonLd(meta);

  return (
    <>
      {ldJson && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: ldJson }}
        />
      )}
      <header className="report-hero">
        <div className="inner">
          <div className="report-hero-grid">
          <div>
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
          <div className="rhg-cover"><ReportCover report={meta} /></div>
          </div>
        </div>
      </header>

      {published ? (
        <ReportCommerceProvider
          slug={meta.slug}
          access={meta.access}
          priceLabel={formatPrice(meta)}
          title={meta.title}
        >
          <section className="wrap-narrow" style={{ paddingTop: 40, paddingBottom: 8 }}>
            <ReportAccess
              pages={meta.pages}
              readingTime={meta.readingTime}
              previewObject={meta.previewObject}
              previewPages={meta.previewPages}
            />
          </section>

          {mod ? (
            <ReportReader toc={mod.toc} title={meta.title}>
              <mod.Content />
              {meta.access === 'paid' ? <PremiumBody /> : null}
            </ReportReader>
          ) : (
            <section className="wrap-narrow" style={{ paddingTop: 24 }}>
              <p className="serif" style={{ color: 'var(--text-muted)' }}>The full report is coming online shortly.</p>
            </section>
          )}
        </ReportCommerceProvider>
      ) : (
        <section className="wrap-narrow" style={{ paddingTop: 56 }}>
          <div className="exec-summary">
            <div className="es-label">Forthcoming</div>
            <p className="serif" style={{ fontSize: 17 }}>{meta.summary}</p>
            <p style={{ marginTop: 12 }}>This report is in preparation. Subscribe to be notified when it publishes.</p>
          </div>
          <Link href="/#subscribe" className="btn-ed btn-ed-primary">Subscribe for updates <span className="arr">→</span></Link>
        </section>
      )}

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
