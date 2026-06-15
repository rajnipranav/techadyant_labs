import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { signals, getSignal } from '../data';

export function generateStaticParams() {
  return signals.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const s = getSignal(slug);
  if (!s) return {};
  return { title: s.title, description: s.excerpt };
}

export default async function SignalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSignal(slug);
  if (!s) notFound();

  return (
    <article>
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
            <div><div className="bk">Dated</div><div className="bv">{s.dateLabel}</div></div>
            {s.readingTime.trim() && <div><div className="bk">Read</div><div className="bv">{s.readingTime}</div></div>}
          </div>
        </div>
      </header>

      <div className="wrap-narrow" style={{ paddingTop: 48, paddingBottom: 64 }}>
        {s.takeaways && s.takeaways.length > 0 && (
          <div className="exec-summary">
            <div className="es-label">Signal in brief</div>
            <ul>
              {s.takeaways.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        )}

        <div className="report-body" style={{ padding: 0 }}>
          {s.body ? (
            s.body.map((blk, i) => {
              if (blk.type === 'h') return <h3 key={i} className="serif">{blk.text}</h3>;
              if (blk.type === 'list')
                return <ul key={i}>{blk.items?.map((it, j) => <li key={j}>{it}</li>)}</ul>;
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
