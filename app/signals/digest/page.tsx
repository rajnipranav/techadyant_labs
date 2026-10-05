import type { Metadata } from 'next';
import Link from 'next/link';
import { signals as staticSignals } from '../data';
import { colorFor } from '../palette';

export const metadata: Metadata = {
  title: 'Weekly Signals Digest — India’s Industrial Systems',
  alternates: { canonical: 'https://labs.techadyant.com/signals/digest/' },
  description:
    'A seven-day digest of the latest live strategic signals on India’s industrial systems, grouped by domain. Early reads on structural change, not news aggregation.',
};

const DAY = 86_400_000;
const WINDOW_DAYS = 7;
const MAX_CARDS = 8;

const signalNo = (s: any) => parseInt(String(s.no ?? '').replace(/\D/g, ''), 10) || 0;
const fmt = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/**
 * Last 7 days of LIVE signals, anchored to the most recent live signal in the
 * dataset (static data has no live clock, so anchoring to wall-time would show
 * an empty page between publishing runs — the window is honest about its span).
 * If the 7-day window holds fewer than 6, widen to the 6 most-recent live
 * signals so the digest always has substance; cap at 8 cards.
 */
function buildDigest(all: any[]) {
  const live = all
    .filter((s) => s.status === 'live' && /^\d{4}-\d{2}-\d{2}/.test(String(s.date)))
    .sort((a, b) => (b.date < a.date ? -1 : b.date > a.date ? 1 : signalNo(b) - signalNo(a)));
  if (!live.length) return { cards: [] as any[], asOf: '', windowStart: '', widened: false };

  const anchor = Date.parse(live[0].date + 'T00:00:00Z');
  const cutoff = anchor - (WINDOW_DAYS - 1) * DAY;
  let inWindow = live.filter((s) => Date.parse(s.date + 'T00:00:00Z') >= cutoff);
  const widened = inWindow.length < 6;
  if (widened) inWindow = live.slice(0, 6);

  const cards = inWindow.slice(0, MAX_CARDS);
  const windowStart = cards.length ? cards[cards.length - 1].date : live[0].date;
  return { cards, asOf: live[0].date, windowStart, widened };
}

export default function SignalsDigest() {
  // Canonical domain ordering mirrors the Signals index so a domain keeps the
  // same colour here as on the main list.
  const ordered = [...staticSignals].sort((a, b) => signalNo(b) - signalNo(a));
  const domains = ['all', ...Array.from(new Set(ordered.map((s) => s.domain)))];

  const { cards, asOf, windowStart, widened } = buildDigest(staticSignals);

  // Group by domain, domains ordered by how recently each last appears in the set.
  const groups: { domain: string; items: any[] }[] = [];
  for (const s of cards) {
    let g = groups.find((x) => x.domain === s.domain);
    if (!g) { g = { domain: s.domain, items: [] }; groups.push(g); }
    g.items.push(s);
  }

  return (
    <>
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/signals/">Signals</Link><span className="sep">/</span><span>Digest</span>
          </div>
          <h1>Weekly signals digest</h1>
          <p className="lede">
            The most recent live signals, grouped by domain — a fast read on what moved this week
            across the systems we track. For the full, filterable archive see{' '}
            <Link href="/signals/">all signals</Link>.
          </p>
          {asOf && (
            <div className="ed-kicker" style={{ marginTop: 10 }}>
              Data as of {fmt(asOf)}
              {widened
                ? ' · most recent live signals'
                : ` · 7 days to ${fmt(asOf)} (from ${fmt(windowStart)})`}
              {` · ${cards.length} signal${cards.length === 1 ? '' : 's'}`}
            </div>
          )}
        </div>
      </header>

      <section className="wrap" style={{ paddingBottom: 56 }}>
        {cards.length === 0 ? (
          <p className="lede" style={{ color: 'var(--text-dim)' }}>No live signals to digest yet.</p>
        ) : (
          groups.map((g) => {
            const color = colorFor(domains, g.domain);
            return (
              <div key={g.domain} style={{ marginBottom: 30 }}>
                <div
                  className="ed-kicker"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}
                >
                  <i className="sig-dot" style={{ background: color }} />
                  {g.domain} · {g.items.length}
                </div>
                <div className="sig-cards">
                  {g.items.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/signals/${s.slug}/`}
                      className="sig-card"
                      style={{ ['--sig-c' as string]: color }}
                    >
                      <div className="signal-meta">
                        <span className="sig-no">{s.no}</span>
                        <span className="sig-date">{s.dateLabel ?? s.date_label}</span>
                      </div>
                      <div className="signal-meta">
                        <span className="sig-domain"><i className="sig-dot" style={{ background: color }} />{s.domain}</span>
                        <span className="sig-status"><span className="dot" /> Live</span>
                      </div>
                      <div className="signal-title">{s.title}</div>
                      <p className="signal-excerpt">{s.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
        )}

        <div style={{ marginTop: 8 }}>
          <Link href="/signals/" className="btn-ed btn-ed-ghost">Browse all signals →</Link>
        </div>
      </section>
    </>
  );
}
