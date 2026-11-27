import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { VIDEOS, getVideoBySlug, videoLd } from '../../lib/videos';
import { WatchVideoPlayer } from '../../components/WatchVideoPlayer';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return VIDEOS.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) return {};

  const cleanDesc = video.description.replace(/\s+/g, ' ').slice(0, 160);

  return {
    title: `${video.title} — Video Briefing | Techadyant Labs`,
    description: cleanDesc,
    alternates: { canonical: `https://labs.techadyant.com/videos/${video.slug}/` },
    openGraph: {
      title: video.title,
      description: cleanDesc,
      url: `https://labs.techadyant.com/videos/${video.slug}/`,
      type: 'video.other',
      images: [
        {
          url: `https://labs.techadyant.com${video.localThumb}`,
          width: 1280,
          height: 720,
          alt: video.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: video.title,
      description: cleanDesc,
      images: [`https://labs.techadyant.com${video.localThumb}`],
    },
  };
}

export default async function VideoWatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);

  if (!video) {
    notFound();
  }

  const related = video.placements[0]?.related;
  const ld = videoLd(video, `/videos/${video.slug}/`);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://labs.techadyant.com/' },
      { '@type': 'ListItem', position: 2, name: 'Videos', item: 'https://labs.techadyant.com/videos/' },
      {
        '@type': 'ListItem',
        position: 3,
        name: video.title,
        item: `https://labs.techadyant.com/videos/${video.slug}/`,
      },
    ],
  };

  // Other videos for "Next briefings"
  const otherVideos = VIDEOS.filter((v) => v.slug !== video.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <article className="watch-page">
        <header className="ed-page-head" style={{ paddingBottom: 24 }}>
          <div className="wrap inner">
            <div className="ed-breadcrumb">
              <Link href="/">Home</Link>
              <span className="sep">/</span>
              <Link href="/videos/">Videos</Link>
              <span className="sep">/</span>
              <span style={{ color: 'var(--text-muted)' }}>{video.slug}</span>
            </div>

            <div className="ed-kicker" style={{ marginTop: 12, marginBottom: 8, color: 'var(--brass, #f5b544)' }}>
              Video Briefing · {video.durationLabel} · Published {video.uploadDate}
            </div>

            <h1 style={{ fontSize: 'clamp(24px, 4vw, 38px)', lineHeight: 1.25, maxWidth: '28ch', margin: '0 0 16px' }}>
              {video.title}
            </h1>
          </div>
        </header>

        {/* Video Player is the PRIMARY, central content above the fold */}
        <section className="wrap" style={{ paddingTop: 0, paddingBottom: 48 }}>
          <WatchVideoPlayer video={video} related={related} />

          {/* More video briefings */}
          {otherVideos.length > 0 && (
            <div style={{ marginTop: 64, paddingTop: 36, borderTop: '1px solid var(--rule, #222)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <h2 style={{ fontSize: 22, margin: 0 }}>More video briefings</h2>
                <Link href="/videos/" style={{ fontSize: 14, color: 'var(--brass, #f5b544)' }}>
                  View all briefings ({VIDEOS.length}) <span className="arr">→</span>
                </Link>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 24,
                }}
              >
                {otherVideos.map((ov) => (
                  <Link
                    key={ov.id}
                    href={`/videos/${ov.slug}/`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      textDecoration: 'none',
                      color: 'inherit',
                      background: 'var(--surface, #14141e)',
                      borderRadius: 10,
                      overflow: 'hidden',
                      border: '1px solid var(--rule, #222)',
                      transition: 'border-color .2s ease',
                    }}
                  >
                    <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
                      <img
                        src={ov.localThumb}
                        alt={ov.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                      <span
                        style={{
                          position: 'absolute',
                          right: 8,
                          bottom: 8,
                          background: 'rgba(0,0,0,0.75)',
                          color: '#fff',
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 500,
                        }}
                      >
                        {ov.durationLabel}
                      </span>
                    </div>
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                        {ov.uploadDate}
                      </span>
                      <h3 style={{ fontSize: 15, margin: '6px 0 0', lineHeight: 1.4, fontWeight: 600 }}>
                        {ov.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </article>
    </>
  );
}
