import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { signals as staticSignals, getSignal as staticGetSignal } from '../data';
import { getSignals, getSignalBySlug } from '../../lib/cms';

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
                  {s.sources.map((src: string, i: number) => <li key={i} style={{ marginBottom: 6 }}><a href={src} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{src}</a></li>)}
                </ul>
              </>
            ) : null}
          </div>
        )}

        <div className="report-body" style={{ padding: 0 }}>
          {s.body ? (
            s.body.map((blk: { type: string; text?: string; items?: string[] }, i: number) => {
              if (blk.type === 'h') return <h3 key={i} className="serif">{blk.text}</h3>;
              if (blk.type === 'list')
                return <ul key={i}>{blk.items?.map((it: string, j: number) => <li key={j}>{it}</li>)}</ul>;
              return <p key={i}>{blk.text}</p>;
            })
          ) : (
            <p className="serif" style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
              {s.excerpt}
            </p>
          )}
        </div>

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
    </article>
  );
}
