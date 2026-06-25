import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { reports as staticReports, getReport as staticGetReport, formatPrice } from '../data';
import { getReports, getReportBySlug } from '../../lib/cms';
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
import { ReportContent as DroneFcContent, toc as droneFcToc } from '../content/drone-electronics-flight-controllers';
import { ReportContent as BatteryContent, toc as batteryToc } from '../content/indias-drone-battery-ecosystem';
import { ReportContent as PropulsionContent, toc as propulsionToc } from '../content/india-drone-propulsion-opportunity';
import { ReportContent as SensorsContent, toc as sensorsToc } from '../content/india-drone-sensors-payloads-imaging-market';
import { ReportContent as EoaeContent, toc as eoaeToc } from '../content/the-end-of-the-application-era';
import { ReportContent as UnmannedContent, toc as unmannedToc } from '../content/indias-unmanned-warfare-transformation';

interface ReportModule { toc: TocItem[]; Content: () => React.ReactElement }

const registry: Record<string, ReportModule> = {
  'india-fab-ecosystem': { toc: fabToc, Content: FabContent },
  'india-ai-industrial-transition-2026-2035': { toc: aiTransitionToc, Content: AiTransitionContent },
  'who-actually-captures-the-india-us-minerals-alliance': { toc: mineralsToc, Content: MineralsContent },
  'india-battlefield-automation-gap': { toc: battlefieldToc, Content: BattlefieldContent },
  'the-sap-question': { toc: sapFlagshipToc, Content: SapFlagshipContent },
  'the-opportunity-beyond-the-fab': { toc: oppToc, Content: OppContent },
  'who-builds-indias-drones': { toc: droneToc, Content: DroneContent },
  'drone-electronics-flight-controllers': { toc: droneFcToc, Content: DroneFcContent },
  'indias-drone-battery-ecosystem': { toc: batteryToc, Content: BatteryContent },
  'india-drone-propulsion-opportunity': { toc: propulsionToc, Content: PropulsionContent },
  'india-drone-sensors-payloads-imaging-market': { toc: sensorsToc, Content: SensorsContent },
  'the-end-of-the-application-era': { toc: eoaeToc, Content: EoaeContent },
  'indias-unmanned-warfare-transformation': { toc: unmannedToc, Content: UnmannedContent },
};

export async function generateStaticParams() {
  let reports: any[] = staticReports;
  try {
    const cms = await getReports(); if (cms.length) reports = cms as any[];
    if (cms.length) reports = cms as any[];
  } catch {}
  return reports.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = await getReportBySlug(slug) || staticGetReport(slug);
  if (!r) return {};
  (r as any);
  const OG_OVERRIDES: Record<string, string> = {
    'the-sap-question': '/og/the-sap-question-flagship.png',
    'india-drone-sensors-payloads-imaging-market': '/og/india-drone-sensors-payloads-imaging-market.png',
    'the-end-of-the-application-era': '/og/the-end-of-the-application-era.png',
  };
  const ogImage = OG_OVERRIDES[slug] ?? r.cover;
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

function articleJsonLd(meta: any) {
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
      .map((k: string) => ({ '@type': 'Thing', name: k })),
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

function faqJsonLd(meta: any) {
  if (!meta || !meta.faq || !meta.faq.length) return null;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: meta.faq.map((f: any) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  });
}

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let meta: any = await getReportBySlug(slug);
  if (!meta) meta = staticGetReport(slug);
  if (!meta) notFound();

  const mod = registry[slug];
  const published = meta.status === 'published';
  const ldJson = articleJsonLd(meta);
  const faqJson = faqJsonLd(meta);
  const supabaseBase = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lkqojucjkpxhcngtstfy.supabase.co';
  const fullPdfUrl =
    meta.access === 'free' && meta.preview_object && meta.preview_object.includes('/')
      ? `${supabaseBase}/storage/v1/object/public/${meta.preview_object}`
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
            <div><div className="bk">Published</div><div className="bv">{meta.published_label}</div></div>
            <div><div className="bk">Domain</div><div className="bv">{meta.domain}</div></div>
            <div><div className="bk">Reading time</div><div className="bv">{meta.reading_time}</div></div>
            <div><div className="bk">Author</div><div className="bv">Techadyant Labs · Research</div></div>
          </div>
          </div>
          <div className="rhg-cover"><ReportCover report={meta as any} /></div>
          </div>
        </div>
      </header>

      {published ? (
        <ReportCommerceProvider
          slug={meta.slug}
          access={meta.access}
          priceLabel={formatPrice(meta as any)}
          title={meta.title}
        >
          <section className="wrap-narrow" style={{ paddingTop: 40, paddingBottom: 8 }}>
            <ReportAccess
              pages={meta.pages ?? undefined}
              readingTime={meta.reading_time}
              previewObject={meta.preview_object}
              previewPages={meta.preview_pages ?? undefined}
              deckLabel={meta.has_deck ? 'Download the investor deck (PPTX)' : undefined}
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

      {published && meta.sources && meta.sources.length > 0 ? (
        <section className="wrap-narrow report-sources" style={{ paddingBottom: 24 }}>
          <h2 style={{ fontSize: 18, marginBottom: 10 }}>Primary sources</h2>
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingLeft: 18 }}>
            {meta.sources.map((src: string, idx: number) => (
              <li key={idx}>
                <a href={src} target="_blank" rel="noreferrer" style={{ color: 'var(--link, #6cb0ff)' }}>{src}</a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {published && meta.faq && meta.faq.length > 0 ? (
        <div className="report-faq" aria-labelledby="faq-h">
          <h2 id="faq-h">Frequently asked questions</h2>
          <dl className="faq-list">
            {meta.faq.map((f: { q: string; a: string }, i: number) => (
              <div className="faq-item" key={i}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {published ? (
        <section className="wrap-narrow" style={{ padding: '0 0 28px' }}>
          <div
            style={{
              borderTop: '1px solid rgba(201,168,76,.18)',
              paddingTop: 14,
              fontSize: 12,
              color: 'var(--text-muted)',
              lineHeight: 1.55,
            }}
          >
            <strong style={{ color: 'var(--accent, #C9A84C)', marginRight: 8 }}>Evidence labels</strong>
            <span>
              [V] verified · [V1] single-source · [U] unverified · [modelled] analytical projection
            </span>
          </div>
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
