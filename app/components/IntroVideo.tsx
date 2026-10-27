'use client';

import { useState } from 'react';
import { INTRO_VIDEO, YOUTUBE_CHANNEL, fmtTime } from '../lib/introVideo';

/**
 * Click-to-load YouTube embed: shows a local poster until the reader presses play,
 * so no YouTube script or cookie loads on page view (fast, privacy-friendly).
 * Uses youtube-nocookie.com once activated.
 */
export function IntroVideo({ showChapters = true }: { showChapters?: boolean }) {
  const [start, setStart] = useState<number | null>(null);
  const play = (t = 0) => setStart(t);

  return (
    <div className={`intro-video${showChapters ? '' : ' no-chapters'}`}>
      <div className="iv-frame">
        {start === null ? (
          <button type="button" className="iv-poster" onClick={() => play(0)} aria-label={`Play video: ${INTRO_VIDEO.title}`}>
            <img src={INTRO_VIDEO.localThumb} alt="" width={1280} height={720} loading="lazy" decoding="async" />
            <span className="iv-play" aria-hidden="true">
              <svg viewBox="0 0 68 48" width="68" height="48"><path d="M66.5 7.7a8.5 8.5 0 0 0-6-6C55.2.4 34 .4 34 .4s-21.2 0-26.5 1.3a8.5 8.5 0 0 0-6 6C.2 13 .2 24 .2 24s0 11 1.3 16.3a8.5 8.5 0 0 0 6 6c5.3 1.3 26.5 1.3 26.5 1.3s21.2 0 26.5-1.3a8.5 8.5 0 0 0 6-6C67.8 35 67.8 24 67.8 24s0-11-1.3-16.3z" fill="#FF0000"/><path d="M27 34V14l18 10z" fill="#fff"/></svg>
            </span>
            <span className="iv-badge">▶ Watch · {INTRO_VIDEO.durationLabel}</span>
          </button>
        ) : (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${INTRO_VIDEO.id}?autoplay=1&rel=0&modestbranding=1&start=${start}`}
            title={INTRO_VIDEO.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
      </div>
      {showChapters && (
        <ol className="iv-chapters" aria-label="Chapters">
          {INTRO_VIDEO.chapters.map((c) => (
            <li key={c.t}>
              <button type="button" onClick={() => play(c.t)}>
                <span className="iv-t">{fmtTime(c.t)}</span>
                <span>{c.label}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
      <p className="iv-foot">
        <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener">Subscribe on YouTube <span className="arr">→</span></a>
      </p>
    </div>
  );
}
