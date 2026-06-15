'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { reports } from '../reports/data';
import { signals } from '../signals/data';
import { allPlayers, playerSlug, corridorsOrdered, meta, corridorByCode } from '../research/atlas';

type Kind = 'report' | 'signal' | 'player' | 'corridor';
interface Item { kind: Kind; title: string; url: string; summary?: string; extra?: string; score: number; }
interface ResultGroup { key: string; label: string; items: Item[]; }

function normalize(s: string) { return s.toLowerCase().replace(/[\s\-/]+/g, ' ').trim(); }
function matchScore(text: string, q: string) {
  const norm = normalize(text); const query = normalize(q);
  if (!query) return 0;
  if (norm === query) return 10;
  if (norm.startsWith(query)) return 7;
  if (norm.includes(query)) return 5;
  return query.split(' ').filter((t) => t && norm.includes(t)).length;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const q = query.trim();

  useEffect(() => { setQuery(searchParams.get('q') ?? ''); }, [searchParams]);

  const groups = useMemo<ResultGroup[]>(() => {
    if (!q) return [];

    const reportItems: Item[] = reports
      .filter((r) => r.status === 'published')
      .map((r): Item | null => {
        const score = Math.max(matchScore(r.title, q), matchScore(r.summary, q), matchScore(r.domain, q));
        return score > 0 ? { kind: 'report' as const, title: r.title, url: `/reports/${r.slug}`, summary: r.summary, extra: `${r.domain} · ${r.publishedLabel} · ${r.readingTime}`, score } : null;
      })
      .filter((x): x is Item => Boolean(x)).sort((a, b) => b.score - a.score).slice(0, 12);

    const signalItems: Item[] = signals
      .filter((s) => s.status !== 'placeholder')
      .map((s): Item | null => {
        const score = Math.max(matchScore(s.title, q), matchScore(s.excerpt, q), matchScore(s.domain, q));
        return score > 0 ? { kind: 'signal' as const, title: s.title, url: `/signals/${s.slug}`, summary: s.excerpt, extra: `${s.domain} · ${s.dateLabel} · ${s.readingTime}`, score } : null;
      })
      .filter((x): x is Item => Boolean(x)).sort((a, b) => b.score - a.score).slice(0, 12);

    const corridorItems: Item[] = corridorsOrdered
      .map((c): Item | null => {
        const cm = meta(c.code);
        const score = Math.max(matchScore(c.label, q), matchScore(cm.tagline, q));
        return score > 0 ? { kind: 'corridor' as const, title: c.label, url: `/research/corridors/${cm.slug}`, summary: cm.tagline, extra: 'Industrial ecosystem', score } : null;
      })
      .filter((x): x is Item => Boolean(x)).sort((a, b) => b.score - a.score);

    const playerItems: Item[] = allPlayers
      .map((p): Item | null => {
        const score = Math.max(matchScore(p.name, q), matchScore(p.description ?? '', q), matchScore(p.type, q));
        return score > 0 ? { kind: 'player' as const, title: p.name, url: `/research/players/${playerSlug(p.id)}`, summary: p.description ?? undefined, extra: `${p.type}${corridorByCode((p.corridors ?? [])[0] ?? '') ? ' · ' + (corridorByCode((p.corridors ?? [])[0])?.label ?? '') : ''} · ${p.country}`, score } : null;
      })
      .filter((x): x is Item => Boolean(x)).sort((a, b) => b.score - a.score).slice(0, 20);

    return ([
      { key: 'reports', label: 'Reports', items: reportItems },
      { key: 'corridors', label: 'Corridors', items: corridorItems },
      { key: 'signals', label: 'Signals', items: signalItems },
      { key: 'players', label: 'Players & suppliers', items: playerItems },
    ] as ResultGroup[]).filter((g) => g.items.length > 0);
  }, [q]);

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>Search</span>
          </div>
          <h1>Search Techadyant Labs</h1>
          <p className="lede">Search across reports, signals, corridors and ecosystem players.</p>
          <div style={{ marginTop: 22 }}>
            <form
              method="get" action="/search"
              style={{ display: 'flex', gap: 10, maxWidth: 720 }}
              onSubmit={(e) => {
                e.preventDefault();
                const value = (new FormData(e.currentTarget).get('q') as string || '').trim();
                if (value) router.push(`/search/?q=${encodeURIComponent(value)}`);
              }}
            >
              <input
                name="q" defaultValue={query} key={query}
                placeholder="Search reports, signals, corridors, players…"
                style={{ flex: 1, padding: '14px 16px', borderRadius: 12, border: '1px solid var(--rule, var(--border))', background: 'var(--bg-2, var(--surface))', color: 'var(--text)', fontSize: 16, outline: 'none' }}
              />
              <button type="submit" className="btn-ed btn-ed-primary" style={{ padding: '14px 18px', borderRadius: 12, border: '1px solid transparent' }}>Search</button>
            </form>
          </div>
        </div>
      </header>

      <section className="wrap" style={{ paddingBottom: 80 }}>
        {!q ? (
          <div style={{ marginTop: 28, color: 'var(--text-muted)' }}>Enter a query to search reports, signals, corridors and players.</div>
        ) : total === 0 ? (
          <div style={{ color: 'var(--text-muted)', marginTop: 28 }}>
            No results for “{query}”. Try simpler terms, or browse <Link href="/reports/">reports</Link> and <Link href="/research/">the Atlas</Link> directly.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36, marginTop: 28 }}>
            {groups.map((group) => (
              <div key={group.key}>
                <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--text-dim)', marginBottom: 12 }}>
                  {group.label} <span style={{ color: 'var(--text-dim)' }}>· {group.items.length}</span>
                </div>
                <ul className="rule-top" style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none', padding: 0, margin: 0 }}>
                  {group.items.slice(0, 8).map((item) => (
                    <li key={`${group.key}-${item.url}`}>
                      <Link href={item.url} style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '14px 0', textDecoration: 'none', color: 'inherit' }}>
                        <span style={{ fontWeight: 600, fontSize: 16 }}>{item.title}</span>
                        {item.summary ? (
                          <span style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.summary}</span>
                        ) : null}
                        {item.extra ? <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{item.extra}</span> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<section className="wrap" style={{ padding: '60px 0', color: 'var(--text-muted)' }}>Loading search…</section>}>
      <SearchResults />
    </Suspense>
  );
}
