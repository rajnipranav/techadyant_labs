import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { briefings, getBriefing } from '../data';
import { inlineLinks } from '../../lib/inlineLinks';

export function generateStaticParams() {
  return briefings.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const b = getBriefing(slug);
  if (!b) return {};
  return { title: b.title, description: b.blurb };
}

export default async function BriefingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = getBriefing(slug);
  if (!b) notFound();

  const live = b.status === 'live';

  return (
    <article>
      <header className="report-hero">
        <div className="inner" style={{ maxWidth: 820 }}>
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/briefings/">Briefings</Link><span className="sep">/</span>
            <span>{b.tag}</span>
          </div>
          <div className="r-tag">{live ? '◆ Briefing' : '◇ In preparation'}{' · '}{b.tag}</div>
          <h1 style={{ fontSize: 'clamp(28px,3.6vw,42px)' }}>{b.title}</h1>
          <div className="report-byline">
            <div><div className="bk">Format</div><div className="bv">{b.tag}</div></div>
            <div><div className="bk">Dated</div><div className="bv">{b.date}</div></div>
            {b.read.trim() && <div><div className="bk">Read</div><div className="bv">{b.read}</div></div>}
          </div>
        </div>
      </header>

      <div className="wrap-narrow" style={{ paddingTop: 48, paddingBottom: 64 }}>
        {b.takeaways && b.takeaways.length > 0 && (
          <div className="exec-summary">
            <div className="es-label">In brief</div>
            <ul>{b.takeaways.map((t, i) => <li key={i}>{t}</li>)}</ul>
          </div>
        )}

        <div className="report-body" style={{ padding: 0 }}>
          {live && b.body ? (
            b.body.map((blk, i) => {
              if (blk.type === 'h') return <h3 key={i} className="serif">{blk.text}</h3>;
              if (blk.type === 'list')
                return <ul key={i}>{blk.items?.map((it, j) => <li key={j}>{inlineLinks(it)}</li>)}</ul>;
              return <p key={i}>{inlineLinks(blk.text)}</p>;
            })
          ) : (
            <>
              <p className="serif" style={{ fontSize: 17, lineHeight: 1.7 }}>{b.blurb}</p>
              <div className="exec-summary" style={{ marginTop: 28 }}>
                <div className="es-label">Full briefing in preparation</div>
                <p className="serif" style={{ fontSize: 15.5 }}>
                  This briefing is being finalised from our research desk. Subscribe to receive it
                  the moment it publishes — executive-ready, in a single sitting.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="report-cta" style={{ padding: 0, marginTop: 48 }}>
          <div className="report-cta-inner">
            <div>
              <h3>Briefings, in your inbox</h3>
              <p>Executive-ready analysis on India’s industrial systems — independent and infrequent.</p>
            </div>
            <Link href="/#subscribe" className="btn-ed btn-ed-primary">Subscribe <span className="arr">→</span></Link>
          </div>
        </div>
      </div>
    </article>
  );
}
