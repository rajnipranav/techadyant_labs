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
import { ReportContent as BattlefieldContent, toc as battlefieldToc } from '../content/india-battlefield-automation-gap';
import { ReportContent as SapFlagshipContent, toc as sapFlagshipToc } from '../content/the-sap-question-flagship';
import { ReportContent as OppContent, toc as oppToc } from '../content/the-opportunity-beyond-the-fab';
import { ReportContent as DroneContent, toc as droneToc } from '../content/who-builds-indias-drones';
import { ReportContent as BatteryContent, toc as batteryToc } from '../content/indias-drone-battery-ecosystem';
import { ReportContent as PropulsionContent, toc as propulsionToc } from '../content/india-drone-propulsion-opportunity';

interface ReportModule { toc: TocItem[]; Content: () => React.ReactElement }

const registry: Record<string, ReportModule> = {
  'india-fab-ecosystem': { toc: fabToc, Content: FabContent },
  'india-ai-industrial-transition-2026-2035': { toc: aiTransitionToc, Content: AiTransitionContent },
  'who-actually-captures-the-india-us-minerals-alliance': { toc: mineralsToc, Content: MineralsContent },
  'india-battlefield-automation-gap': { toc: battlefieldToc, Content: BattlefieldContent },
  'the-sap-question': { toc: sapFlagshipToc, Content: SapFlagshipContent },
  'the-opportunity-beyond-the-fab': { toc: oppToc, Content: OppContent },
  'who-builds-indias-drones': { toc: droneToc, Content: DroneContent },
  'indias-drone-battery-ecosystem': { toc: batteryToc, Content: BatteryContent },
  'india-drone-propulsion-opportunity': { toc: propulsionToc, Content: PropulsionContent },
};

export function generateStaticParams() {
  return reports.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getReport(slug);
  if (!r) return {};
  const ogImage = slug === 'the-sap-question' ? '/og/the-sap-question-flagship.png' : r.cover;
  const url = `https://labs.techadyant.com/reports/${slug}/`;
  return {
    title: r.title,
    description: r.summary,
    alternates: { canonical: url },
    openGraph: {
      title: r.title,
      description: r.subtitle,
      url,
      type: 'article',
      siteName: 'Techadyant Labs',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: r.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: r.title,
      description: r.subtitle,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

function articleJsonLd(meta: ReturnType<typeof getReport>) {
  if (!meta) return null;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Report',
    headline: meta.title,
    alternativeHeadline: meta.subtitle,
    description: meta.summary,
    inLanguage: 'en-IN',
    datePublished: meta.published,
    dateModified: meta.dateModified ?? meta.published,
    isAccessibleForFree: meta.access === 'free',
    keywords: (meta.keywords && meta.keywords.length
      ? meta.keywords
      : [meta.domain, 'India technology sovereignty', 'strategic intelligence', 'industrial systems']).join(', '),
    about: (meta.keywords && meta.keywords.length ? meta.keywords : [meta.domain])
      .slice(0, 6)
      .map((k) => ({ '@type': 'Thing', name: k })),
    image: meta.cover ? `https://labs.techadyant.com${meta.cover}` : undefined,
    url: `https://labs.techadyant.com/reports/${meta.slug}/`,
    author: {
      '@type': 'Organization',
      name: 'Techadyant Labs',
      url: 'https://labs.techadyant.com',
      knowsAbout: ['India semiconductor industry', 'enterprise software sovereignty', 'AI infrastructure', 'critical minerals', 'India technology policy'],
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
      '@id': `https://labs.techadyant.com/reports/${meta.slug}/`,
    },
  };
  return JSON.stringify(data);
}

function faqJsonLd(meta: ReturnType<typeof getReport>) {
  if (!meta || !meta.faq || !meta.faq.length) return null;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: meta.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  });
}

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getReport(slug);
  if (!meta) notFound();

  const mod = registry[slug];
  const published = meta.status === 'published';
  const ldJson = articleJsonLd(meta);
  const faqJson = faqJsonLd(meta);
  const supabaseBase = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lkqojucjkpxhcngtstfy.supabase.co';
  const fullPdfUrl =
    meta.access === 'free' && meta.previewObject && meta.previewObject.includes('/')
      ? `${supabaseBase}/storage/v1/object/public/${meta.previewObject}`
      : null;

  return (
    <>
      {ldJson && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: ldJson }}
        />
      )}
      {faqJson && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: faqJson }}
        />
      )}
      <header className="report-hero">
        <div className="inner">
          <div className="report-hero-grid">
          <div>
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/reports/">Reports</Link><span className="sep">/</span>
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

          {fullPdfUrl ? (
            <section id="full-report" style={{ maxWidth: 1360, margin: '0 auto', padding: '8px 24px 28px' }}>
              <h2 style={{ marginBottom: 6 }}>Read the full report</h2>
              <p className="serif" style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
                The complete {meta.pages}-page report. Read it inline below, or open it in a new tab to download.
              </p>
              <div style={{ border: '1px solid var(--border, #2a2a3a)', borderRadius: 10, overflow: 'hidden', background: '#0b0b14' }}>
                <object data={`${fullPdfUrl}#view=FitH`} type="application/pdf" style={{ width: '100%', height: '90vh', display: 'block' }}>
                  <iframe src={fullPdfUrl} title={meta.title} style={{ width: '100%', height: '90vh', border: 0 }} />
                </object>
              </div>
              <p style={{ marginTop: 16 }}>
                <a className="btn-ed btn-ed-primary" href={fullPdfUrl} target="_blank" rel="noopener">Open / download the full PDF <span className="arr">→</span></a>
              </p>
            </section>
          ) : null}
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

      {published && meta.faq && meta.faq.length > 0 ? (
        <section className="wrap-narrow report-faq" aria-labelledby="faq-h">
          <h2 id="faq-h">Frequently asked questions</h2>
          <dl className="faq-list">
            {meta.faq.map((f, i) => (
              <div className="faq-item" key={i}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

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
