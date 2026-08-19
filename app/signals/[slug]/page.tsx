import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { inlineLinks } from '../../lib/inlineLinks';
import { signals as staticSignals, getSignal as staticGetSignal } from '../data';
import { getSignals, getSignalBySlug } from '../../lib/cms';
import { SignalReader } from '../../components/SignalReader';
import { ShareBar } from '../../components/ShareBar';
import { RelatedContent } from '../../components/RelatedContent';
import { MicroFeedback } from '../../components/MicroFeedback';
import { Comments } from '../../components/Comments';
import { getReport } from '../../reports/data';
import { SIGNAL_TO_REPORTS } from '../report-links';

export async function generateStaticParams() {
  let signals: any[] = staticSignals;
  try {
    const cms = await getSignals(); if (cms.length) signals = cms as any[];
    if (cms.length) signals = cms;
  } catch {}
  return signals.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const s: any = await getSignalBySlug(slug) || staticGetSignal(slug);
  if (!s) return {};
  return { title: s.title, description: s.excerpt };
}

export default async function SignalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s: any = await getSignalBySlug(slug) || staticGetSignal(slug);
  if (!s) notFound();

  const breadcrumbJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://labs.techadyant.com/' },
      { '@type': 'ListItem', position: 2, name: 'Signals', item: 'https://labs.techadyant.com/signals/' },
      { '@type': 'ListItem', position: 3, name: s.title, item: `https://labs.techadyant.com/signals/${s.slug}/` },
    ],
  });

  const signalJsonLd = s.status === 'live'
    ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: s.title,
        description: s.excerpt,
        inLanguage: 'en-IN',
        datePublished: s.date,
        dateModified: s.date,
        isAccessibleForFree: true,
        url: `https://labs.techadyant.com/signals/${s.slug}/`,
        author: {
          '@type': 'Organization',
          name: 'Techadyant Labs',
          url: 'https://labs.techadyant.com',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Techadyant Labs',
          url: 'https://labs.techadyant.com',
          logo: { '@type': 'ImageObject', url: 'https://labs.techadyant.com/logo.png' },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://labs.techadyant.com/signals/${s.slug}/`,
        },
      })
    : null;

  return (
    <article>
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
        />
      )}
      {signalJsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: signalJsonLd }}
        />
      )}
      <header className="report-hero">
        <div className="inner" style={{ maxWidth: 820 }}>
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/signals/">Signals</Link><span className="sep">/</span>
            <span>{s.no}</span>
          </div>
          <div className="r-tag">
            {s.status === 'live' ? '◆ Live signal' : s.status === 'monitoring' ? '◇ Monitoring' : '◇ Draft'}
            {' · '}{s.domain}
          </div>
          <h1 style={{ fontSize: 'clamp(28px,3.6vw,42px)' }}>{s.title}</h1>
          <div className="report-byline">
            <div><div className="bk">Reference</div><div className="bv">{s.no}</div></div>
            <div><div className="bk">Domain</div><div className="bv">{s.domain}</div></div>
            <div><div className="bk">Dated</div><div className="bv">{s.dateLabel ?? s.date_label}</div></div>
            {(((s.readingTime ?? s.reading_time) || '') as string).trim() && <div><div className="bk">Read</div><div className="bv">{s.readingTime ?? s.reading_time}</div></div>}
          </div>
        </div>
      </header>

      <div className="wrap-narrow" style={{ paddingTop: 48, paddingBottom: 64 }}>
        {s.takeaways && s.takeaways.length > 0 && !(['monitoring','placeholder'].includes(s.status)) && (
          <div className="exec-summary">
            <div className="es-label">Signal in brief</div>
            <ul>
              {s.takeaways.map((t: string, i: number) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        )}

        {s.status !== 'placeholder' && ((s.takeaways && s.takeaways.length > 0) || (s.sources && s.sources.length > 0)) && (
          <div style={{
            border: '1px solid rgba(201,168,76,.25)',
            background: 'rgba(201,168,76,.06)',
            color: 'var(--text-body)',
            padding: '18px 20px',
            borderRadius: 12,
            marginBottom: 22,
            fontSize: 15,
            lineHeight: 1.55,
          }}>
            {s.takeaways && s.takeaways.length > 0 ? (
              <>
                <div style={{ textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 11, color: 'var(--accent, #C9A84C)', marginBottom: 8 }}>Key claims</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {s.takeaways.map((t: string, i: number) => <li key={i} style={{ marginBottom: 6 }}>{t}</li>)}
                </ul>
              </>
            ) : null}
            {s.sources && s.sources.length > 0 ? (
              <>
                <div style={{ textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 11, color: 'var(--accent, #C9A84C)', marginTop: 12, marginBottom: 8 }}>Primary sources</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {s.sources.map((src: string, i: number) => <li key={i} style={{ marginBottom: 6 }}>{/^https?:\/\//i.test(src) ? <a href={src} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{src}</a> : <span>{src}</span>}</li>)}
                </ul>
              </>
            ) : null}
          </div>
        )}

        <SignalReader />

        <div className="report-body" style={{ padding: 0 }}>
          {s.body ? (
            s.body.map((blk: { type: string; text?: string; items?: string[]; src?: string; alt?: string; caption?: string }, i: number) => {
              if (blk.type === 'h') return <h3 key={i} className="serif">{blk.text}</h3>;
              if (blk.type === 'list')
                return <ul key={i}>{blk.items?.map((it: string, j: number) => <li key={j}>{inlineLinks(it)}</li>)}</ul>;
              if (blk.type === 'quote')
                return (
                  <blockquote key={i} style={{ borderLeft: '3px solid var(--accent, #C9A84C)', paddingLeft: 18, margin: '24px 0', fontStyle: 'italic', fontSize: 18, lineHeight: 1.55, color: 'var(--text-body)' }}>
                    {inlineLinks(blk.text)}
                  </blockquote>
                );
              if (blk.type === 'img')
                return (
                  <figure key={i} style={{ margin: '26px 0' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={blk.src} alt={blk.alt || ''} loading="lazy" style={{ width: '100%', height: 'auto', borderRadius: 10, border: '1px solid var(--border, rgba(255,255,255,.1))' }} />
                    {blk.caption ? <figcaption style={{ fontSize: 12, color: 'var(--text-dim, #c7c7d2)', marginTop: 8, textAlign: 'center' }}>{inlineLinks(blk.caption)}</figcaption> : null}
                  </figure>
                );
              return <p key={i}>{inlineLinks(blk.text)}</p>;
            })
          ) : (
            <p className="serif" style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
              {s.excerpt}
            </p>
          )}
        </div>

        <div style={{ marginTop: 40, marginBottom: 8 }}>
          <ShareBar title={s.title} />
        </div>

        {SIGNAL_TO_REPORTS[s.slug] && SIGNAL_TO_REPORTS[s.slug].length ? (
          <div style={{ marginTop: 34, border: '1px solid rgba(201,168,76,.3)', background: 'rgba(201,168,76,.05)', borderRadius: 14, padding: '20px 22px' }}>
            <div style={{ textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 11, color: 'var(--accent, #C9A84C)', marginBottom: 12 }}>The full report</div>
            {SIGNAL_TO_REPORTS[s.slug].map((rs: string) => {
              const r = getReport(rs);
              if (!r) return null;
              return (
                <Link key={rs} href={`/reports/${rs}/`} style={{ display: 'block', marginBottom: 10, color: 'inherit', textDecoration: 'none' }}>
                  <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.4, marginBottom: 4 }}>{r.title}</div>
                  <span style={{ color: 'var(--accent, #C9A84C)', fontSize: 14 }}>Read the full report →</span>
                </Link>
              );
            })}
          </div>
        ) : null}

        <div className="report-cta" style={{ padding: 0, marginTop: 48 }}>
          <div className="report-cta-inner">
            <div>
              <h3>Track the systems we watch</h3>
              <p>Signals, reports and briefings on India’s industrial transformation.</p>
            </div>
            <Link href="/#subscribe" className="btn-ed btn-ed-primary">Subscribe <span className="arr">→</span></Link>
          </div>
        </div>
      </div>

      {s.status !== 'placeholder' && (
        <section className="wrap-narrow" style={{ paddingTop: 8, paddingBottom: 8 }}>
          <MicroFeedback contentType="signal" contentId={s.slug} prompt="Was this signal useful?" />
        </section>
      )}

      <RelatedContent kind="signal" slug={s.slug} domain={s.domain} />
      <Comments />
    </article>
  );
}
