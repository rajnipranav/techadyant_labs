import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { issues, getIssue } from '../data';
import { IssueContent } from '../content/strategic-signals-may-2026';

interface IssueModule { Content: () => React.ReactElement }

const registry: Record<string, IssueModule> = {
  'sanket-may-2026': { Content: IssueContent },
};

export function generateStaticParams() {
  return issues.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const i = getIssue(slug);
  if (!i) return {};
  const url = `https://labs.techadyant.com/newsletter/${i.slug}`;
  const img = `https://labs.techadyant.com${i.ogImage}`;
  const title = `Sanket — ${i.month}: ${i.title}`;
  return {
    title: `Sanket — ${i.month}`,
    description: i.standfirst,
    alternates: { canonical: url },
    keywords: ['Sanket', 'Techadyant Labs', 'India semiconductors', 'advanced packaging', 'AI infrastructure', 'strategic intelligence', i.month],
    openGraph: {
      type: 'article', url, title, description: i.standfirst, siteName: 'Techadyant Labs',
      images: [{ url: img, width: 1000, height: 1750 }],
    },
    twitter: { card: 'summary_large_image', title, description: i.standfirst, images: [img] },
  };
}

function issueJsonLd(i: NonNullable<ReturnType<typeof getIssue>>) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: `Sanket — ${i.month}: ${i.title}`,
    description: i.standfirst,
    inLanguage: 'en-IN',
    datePublished: '2026-05-31',
    dateModified: '2026-05-31',
    isAccessibleForFree: true,
    image: [`https://labs.techadyant.com${i.ogImage}`],
    url: `https://labs.techadyant.com/newsletter/${i.slug}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://labs.techadyant.com/newsletter/${i.slug}` },
    author: { '@type': 'Organization', name: 'Techadyant Labs', url: 'https://labs.techadyant.com' },
    publisher: {
      '@type': 'Organization', name: 'Techadyant Labs', url: 'https://labs.techadyant.com',
      logo: { '@type': 'ImageObject', url: 'https://labs.techadyant.com/logo.png' },
    },
    isPartOf: { '@type': 'Periodical', name: 'Sanket', publisher: { '@type': 'Organization', name: 'Techadyant Labs' } },
  });
}

export default async function IssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = getIssue(slug);
  if (!i) notFound();
  const mod = registry[slug];

  return (
    <article>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: issueJsonLd(i) }} />
      <header className="report-hero">
        <div className="inner" style={{ maxWidth: 860 }}>
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/newsletter">Sanket</Link><span className="sep">/</span>
            <span>{i.no}</span>
          </div>
          <div className="r-tag">◆ Sanket · {i.no} · {i.month}</div>
          <h1 style={{ fontSize: 'clamp(28px,3.6vw,44px)' }}>{i.title}</h1>
          <p className="r-sub">{i.standfirst}</p>
          <div className="report-byline">
            <div><div className="bk">Issue</div><div className="bv">{i.no}</div></div>
            <div><div className="bk">Dated</div><div className="bv">{i.date}</div></div>
            <div><div className="bk">Read</div><div className="bv">{i.readingTime}</div></div>
            <div><div className="bk">Author</div><div className="bv">Techadyant Labs · Research</div></div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
            <a href={i.pdf} className="btn-ed btn-ed-primary" download>Download PDF <span className="arr">↓</span></a>
            <Link href="/#subscribe" className="btn-ed btn-ed-ghost">Subscribe <span className="arr">→</span></Link>
          </div>
        </div>
      </header>

      <div className="wrap-narrow" style={{ paddingTop: 44, paddingBottom: 64 }}>
        {mod ? <mod.Content /> : <p className="serif">This issue is coming online shortly.</p>}
      </div>

      <div className="report-cta">
        <div className="report-cta-inner">
          <div>
            <h3>Get Sanket first</h3>
            <p>Monthly strategic intelligence on India’s industrial systems — independent and infrequent.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={i.pdf} className="btn-ed btn-ed-primary" download>Download PDF <span className="arr">↓</span></a>
            <Link href="/#subscribe" className="btn-ed btn-ed-ghost">Subscribe <span className="arr">→</span></Link>
          </div>
        </div>
      </div>
    </article>
  );
}
