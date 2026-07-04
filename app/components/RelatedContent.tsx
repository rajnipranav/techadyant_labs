import Link from 'next/link';
import { reports } from '../reports/data';
import { signals } from '../signals/data';

interface Item {
  href: string;
  kind: 'Report' | 'Signal';
  domain: string;
  title: string;
  date: string;
}

/** "Related research" block shown at the end of a report or signal. Server
 *  component — computed from the published reports and live signals, matching
 *  on domain first, then filling with the most recent items. */
export function RelatedContent({
  kind,
  slug,
  domain,
  heading = 'Related research',
}: {
  kind: 'report' | 'signal';
  slug: string;
  domain?: string;
  heading?: string;
}) {
  const reportItems: Item[] = reports
    .filter((r) => r.status === 'published')
    .map((r) => ({ href: `/reports/${r.slug}/`, kind: 'Report', domain: r.domain, title: r.title, date: r.published }));

  const signalItems: Item[] = signals
    .filter((s) => s.status !== 'placeholder')
    .map((s) => ({ href: `/signals/${s.slug}/`, kind: 'Signal', domain: s.domain, title: s.title, date: s.date }));

  const self = `/${kind}s/${slug}/`;
  const pool = [...reportItems, ...signalItems].filter((i) => i.href !== self);

  const sameDomain = domain ? pool.filter((i) => i.domain === domain) : [];
  const rest = pool
    .filter((i) => !sameDomain.includes(i))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const items = [...sameDomain, ...rest].slice(0, 3);
  if (!items.length) return null;

  return (
    <section className="wrap-narrow" style={{ paddingTop: 8, paddingBottom: 20 }}>
      <div className="section-head-ed">
        <div>
          <div className="ed-kicker">Keep reading</div>
          <h2>{heading}</h2>
        </div>
      </div>
      <div className="atlas-entrypoints">
        {items.map((i) => (
          <Link key={i.href} href={i.href} className="atlas-entry">
            <div className="ae-k">{i.kind} · {i.domain}</div>
            <p>{i.title}</p>
            <span className="see-all">Read →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
