import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatPrice } from '../../data';
import { ReportCover } from '../../../components/ReportCover';
import { THEMES, themeBySlug, reportsByTheme } from '../../themes';

export function generateStaticParams() {
  return THEMES.map((t) => ({ theme: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ theme: string }> }): Promise<Metadata> {
  const { theme } = await params;
  const t = themeBySlug(theme);
  if (!t) return {};
  const url = `https://labs.techadyant.com/reports/theme/${t.slug}/`;
  const description = `Techadyant Labs research on ${t.domain} in India — strategic-intelligence reports on the dependencies, constraints and opportunity surfaces that shape the sector.`;
  return {
    title: `${t.domain} — Reports`,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${t.domain} · Techadyant Labs`, description, url, type: 'website', siteName: 'Techadyant Labs' },
  };
}

export default async function ThemeHub({ params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params;
  const t = themeBySlug(theme);
  if (!t) notFound();

  const all = reportsByTheme(t.slug);
  const published = all.filter((r) => r.status === 'published');
  const forthcoming = all.filter((r) => r.status === 'forthcoming');

  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${t.domain} — Techadyant Labs`,
    url: `https://labs.techadyant.com/reports/theme/${t.slug}/`,
    about: t.domain,
    hasPart: published.map((r) => ({
      '@type': 'Report',
      name: r.title,
      url: `https://labs.techadyant.com/reports/${r.slug}/`,
      isAccessibleForFree: r.access === 'free',
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/reports/">Reports</Link><span className="sep">/</span><span>{t.domain}</span>
          </div>
          <h1>{t.domain}</h1>
          <p className="lede">
            Techadyant Labs research on {t.domain.toLowerCase()} in India — the dependencies, constraints and
            opportunity surfaces that decide the real outcome. {published.length} published · {forthcoming.length} forthcoming.
          </p>
        </div>
      </header>

      <section className="wrap">
        {published.length > 0 && (
          <>
            <div className="ed-kicker" style={{ marginBottom: 28 }}>Published</div>
            <div className="report-cards">
              {published.map((r) => {
                const free = r.access === 'free';
                return (
                  <Link key={r.slug} href={`/reports/${r.slug}/`} className="report-card">
                    <div className="rc-cover-top">
                      <ReportCover report={r} variant="card" />
                      <span className={`report-card-badge ${free ? 'badge-free' : 'badge-price'}`}>{free ? 'Free' : formatPrice(r)}</span>
                    </div>
                    <div className="report-card-body">
                      <span className="report-card-domain">{r.domain} · {r.publishedLabel}</span>
                      <h3>{r.title}</h3>
                      <span className="rc-card-sub">{r.subtitle}</span>
                      <p className="rc-card-summary">{r.summary}</p>
                      <div className="report-card-foot">
                        <span className={`report-card-price ${free ? 'is-free' : ''}`}>{free ? 'Free' : formatPrice(r)}</span>
                        <span className="report-card-cta">Read report →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {forthcoming.length > 0 && (
          <>
            <div className="ed-kicker" style={{ margin: '56px 0 28px' }}>Forthcoming</div>
            <div className="report-cards">
              {forthcoming.map((r) => (
                <div key={r.slug} className="report-card is-forthcoming">
                  <div className="rc-cover-top">
                    <ReportCover report={r} variant="card" />
                    <span className="report-card-badge badge-soon">Forthcoming</span>
                  </div>
                  <div className="report-card-body">
                    <span className="report-card-domain">{r.domain}</span>
                    <h3>{r.title}</h3>
                    <span className="rc-card-sub">{r.subtitle}</span>
                    <p className="rc-card-summary">{r.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <p style={{ marginTop: 48 }}><Link href="/reports/" className="btn-ed btn-ed-ghost">← All reports</Link></p>
      </section>
    </>
  );
}
