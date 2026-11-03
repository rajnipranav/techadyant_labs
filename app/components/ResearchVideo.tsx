'use client';

import { useState } from 'react';
import Link from 'next/link';
import { fmtVideoTime, type ResearchVideoEntry } from '../lib/videos';

/**
 * Contextual research video: click-to-load YouTube (youtube-nocookie, no script or cookie
 * until the reader presses play), chapters, and written takeaways so the page stands on
 * its own without the video. Styles reuse .intro-video plus .rv-* in globals.css.
 */
export function ResearchVideo({ video, related }: { video: ResearchVideoEntry; related?: { label: string; href: string } }) {
  const [start, setStart] = useState<number | null>(null);
  const play = (t = 0) => setStart(t);

  return (
    <div className="intro-video research-video">
      <div className="iv-frame">
        {start === null ? (
          <button type="button" className="iv-poster" onClick={() => play(0)} aria-label={`Play video: ${video.title}`}>
            <img src={video.localThumb} alt="" width={1280} height={720} loading="lazy" decoding="async" />
            <span className="iv-play" aria-hidden="true">
              <svg viewBox="0 0 68 48" width="68" height="48"><path d="M66.5 7.7a8.5 8.5 0 0 0-6-6C55.2.4 34 .4 34 .4s-21.2 0-26.5 1.3a8.5 8.5 0 0 0-6 6C.2 13 .2 24 .2 24s0 11 1.3 16.3a8.5 8.5 0 0 0 6 6c5.3 1.3 26.5 1.3 26.5 1.3s21.2 0 26.5-1.3a8.5 8.5 0 0 0 6-6C67.8 35 67.8 24 67.8 24s0-11-1.3-16.3z" fill="#FF0000"/><path d="M27 34V14l18 10z" fill="#fff"/></svg>
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
      <ol className="iv-chapters" aria-label="Chapters">
        {video.chapters.map((c) => (
          <li key={c.t}>
            <button type="button" onClick={() => play(c.t)}>
              <span className="iv-t">{fmtVideoTime(c.t)}</span>
              <span>{c.label}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="rv-notes">
        <p className="rv-caption">Video: {video.title} · {video.durationLabel}</p>
        <h3 className="rv-h">Key takeaways</h3>
        <ul className="rv-takeaways">
          {video.takeaways.map((t) => <li key={t}>{t}</li>)}
        </ul>
        {related && (
          <p className="iv-foot"><Link href={related.href}>{related.label} <span className="arr">→</span></Link></p>
        )}
      </div>
    </div>
  );
}
