'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type ResearchVideoEntry, YOUTUBE_CHANNEL, fmtVideoTime } from '../lib/videos';

export function WatchVideoPlayer({
  video,
  related,
}: {
  video: ResearchVideoEntry;
  related?: { label: string; href: string };
}) {
  const [start, setStart] = useState<number | null>(null);
  const play = (t = 0) => setStart(t);

  const hasChapters = video.chapters && video.chapters.length > 0;

  return (
    <div className="watch-player-wrapper">
      <div className={`intro-video${hasChapters ? '' : ' no-chapters'}`}>
        <div className="iv-frame">
          {start === null ? (
            <button
              type="button"
              className="iv-poster"
              onClick={() => play(0)}
              aria-label={`Play video: ${video.title}`}
            >
              <img
                src={video.localThumb}
                alt={video.title}
                width={1280}
                height={720}
                loading="eager"
                decoding="async"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('img.youtube.com')) {
                    target.src = `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
                  }
                }}
              />
              <span className="iv-play" aria-hidden="true" style={{ left: '50%' }}>
                <svg viewBox="0 0 68 48" width="68" height="48">
                  <path
                    d="M66.5 7.7a8.5 8.5 0 0 0-6-6C55.2.4 34 .4 34 .4s-21.2 0-26.5 1.3a8.5 8.5 0 0 0-6 6C.2 13 .2 24 .2 24s0 11 1.3 16.3a8.5 8.5 0 0 0 6 6c5.3 1.3 26.5 1.3 26.5 1.3s21.2 0 26.5-1.3a8.5 8.5 0 0 0 6-6C67.8 35 67.8 24 67.8 24s0-11-1.3-16.3z"
                    fill="#FF0000"
                  />
                  <path d="M27 34V14l18 10z" fill="#fff" />
                </svg>
              </span>
              <span className="iv-badge">▶ Watch · {video.durationLabel}</span>
            </button>
          ) : (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&start=${start}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          )}
        </div>

        {hasChapters && (
          <div className="watch-chapters-panel">
            <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: '0 0 8px 10px' }}>
              Chapters ({video.chapters.length})
            </h3>
            <ol className="iv-chapters" aria-label="Video chapters">
              {video.chapters.map((c) => (
                <li key={c.t}>
                  <button type="button" onClick={() => play(c.t)}>
                    <span className="iv-t">{fmtVideoTime(c.t)}</span>
                    <span>{c.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div className="watch-details-section" style={{ marginTop: 28 }}>
        {related && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 8,
              background: 'rgba(245, 181, 68, 0.08)',
              border: '1px solid rgba(245, 181, 68, 0.25)',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brass, #f5b544)', fontWeight: 600 }}>
                Companion Research
              </span>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--text)' }}>
                This briefing is distilled from Techadyant’s comprehensive investigation.
              </p>
            </div>
            <Link
              href={related.href}
              className="btn-ed btn-ed-primary"
              style={{ fontSize: 13, padding: '8px 14px', whiteSpace: 'nowrap' }}
            >
              {related.label} <span className="arr">→</span>
            </Link>
          </div>
        )}

        <div className="rv-notes">
          <h2 className="rv-h" style={{ fontSize: 20, marginBottom: 12 }}>
            Key analytical takeaways
          </h2>
          <ul className="rv-takeaways" style={{ marginBottom: 24 }}>
            {video.takeaways.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--rule, #222)' }}>
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>About this briefing</h3>
            <p className="serif" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text-muted, #999)', maxWidth: '75ch' }}>
              {video.description}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'center',
              marginTop: 24,
              paddingTop: 16,
              borderTop: '1px solid var(--rule, #222)',
              fontSize: 14,
            }}
          >
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)' }}
            >
              Watch on YouTube <span className="arr">↗</span>
            </a>
            <span style={{ color: 'var(--rule)' }}>·</span>
            <a
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)' }}
            >
              Subscribe @techadyantlabs <span className="arr">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
