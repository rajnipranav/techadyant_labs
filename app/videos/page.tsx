import type { Metadata } from 'next';
import Link from 'next/link';
import { VIDEOS, YOUTUBE_CHANNEL } from '../lib/videos';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Video Briefings on India’s Industrial Systems | Techadyant Labs',
  alternates: { canonical: 'https://labs.techadyant.com/videos/' },
  description:
    'Independent strategic video briefings on semiconductors, rare-earth magnets, battery supply chains, defence manufacturing and industrial corridors.',
  openGraph: {
    title: 'Video Briefings | Techadyant Labs',
    description:
      'Independent strategic video briefings on India’s industrial transformation, supply chains and infrastructure systems.',
    url: 'https://labs.techadyant.com/videos/',
    type: 'website',
  },
};

export default function VideosHubPage() {
  // Sort newest first
  const sorted = [...VIDEOS].sort(
    (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
  );

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Techadyant Labs Video Briefings',
    description: 'Strategic intelligence video briefings on India’s industrial transformation.',
    itemListElement: sorted.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: v.title,
      url: `https://labs.techadyant.com/videos/${v.slug}/`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Videos</span>
          </div>

          <div className="ed-kicker" style={{ marginTop: 12, marginBottom: 8, color: 'var(--brass, #f5b544)' }}>
            Video Intelligence
          </div>

          <h1>Video Briefings</h1>

          <p className="lede">
            Independent, research-driven video breakdowns on India’s industrial transformation —
            semiconductors, rare earths, defense manufacturing, battery supply chains and national infrastructure.
          </p>

          <div style={{ marginTop: 16, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {sorted.length} published briefings
            </span>
            <span style={{ color: 'var(--rule)' }}>·</span>
            <a
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ed btn-ed-ghost"
              style={{ fontSize: 13, padding: '6px 12px' }}
            >
              YouTube Channel @techadyantlabs <span className="arr">↗</span>
            </a>
          </div>
        </div>
      </header>

      <section className="wrap" style={{ paddingBottom: 64 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 28,
          }}
        >
          {sorted.map((v) => (
            <article
              key={v.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--surface, #14141e)',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid var(--rule, #222)',
                transition: 'transform .2s ease, border-color .2s ease',
              }}
            >
              <Link
                href={`/videos/${v.slug}/`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000', overflow: 'hidden' }}>
                  <img
                    src={v.localThumb}
                    alt={v.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: 10,
                      bottom: 10,
                      background: 'rgba(0,0,0,0.8)',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                    }}
                  >
                    ▶ {v.durationLabel}
                  </span>
                  {v.chapters && v.chapters.length > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        left: 10,
                        bottom: 10,
                        background: 'rgba(11, 11, 20, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: 'var(--text-muted, #ccc)',
                        padding: '3px 7px',
                        borderRadius: 4,
                        fontSize: 11,
                      }}
                    >
                      {v.chapters.length} chapters
                    </span>
                  )}
                </div>

                <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                      {v.uploadDate}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--brass, #f5b544)' }}>
                      Watch briefing <span className="arr">→</span>
                    </span>
                  </div>

                  <h2 style={{ fontSize: 18, lineHeight: 1.35, margin: '0 0 10px', fontWeight: 600 }}>
                    {v.title}
                  </h2>

                  <p
                    className="serif"
                    style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: 'var(--text-muted)',
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flex: 1,
                    }}
                  >
                    {v.description}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="report-cta" style={{ padding: 0, marginTop: 56 }}>
          <div className="report-cta-inner">
            <div>
              <h3>Subscribe on YouTube</h3>
              <p>Get instant notifications when new strategic briefings and documentary breakdowns publish.</p>
            </div>
            <a
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ed btn-ed-primary"
            >
              Subscribe @techadyantlabs <span className="arr">→</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
