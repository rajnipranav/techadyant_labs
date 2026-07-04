import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatPrice } from '../../data';
import { ReportCover } from '../../../components/ReportCover';
import { THEMES, themeBySlug, reportsByTheme, themeSlug } from '../../themes';
import { signals } from '../../../signals/data';

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
  const relatedSignals: any[] = signals.filter(
    (s) => s.status !== 'placeholder' && themeSlug(s.domain) === t.slug,
  );

  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${t.domain} — Techadyant Labs`,
    url: `https://labs.techadyant.com/reports/theme/${t.slug}/`,
    about: t.domain,
    hasPart: [
      ...published.map((r) => ({
        '@type': 'Report',
        name: r.title,
        url: `https://labs.techadyant.com/reports/${r.slug}/`,
        isAccessibleForFree: r.access === 'free',
      })),
      ...relatedSignals.map((s) => ({
        '@type': 'Article',
        name: s.title,
        url: `https://labs.techadyant.com/signals/${s.slug}/`,
        isAccessibleForFree: true,
      })),
    ],
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

        {relatedSignals.length > 0 && (
          <>
            <div className="ed-kicker" style={{ margin: '56px 0 20px' }}>Signals on this ecosystem</div>
            <div className="rule-top">
              {relatedSignals.map((s) => (
                <Link key={s.slug} href={`/signals/${s.slug}/`} className="signal-row">
                  <div className="sr-no">{s.no}</div>
                  <div>
                    <div className="signal-meta">
                      <span className="sig-domain">{s.domain}</span>
                      {s.status === 'live' && <span className="sig-status"><span className="dot" /> Live</span>}
                      <span className="sig-date">{s.dateLabel ?? s.date_label}</span>
                    </div>
                    <div className="signal-title">{s.title}</div>
                    <p className="signal-excerpt">{s.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="report-cta" style={{ marginTop: 48 }}>
          <div className="report-cta-inner">
            <div>
              <h3>Map this ecosystem</h3>
              <p>See where India stands across the value chain — players, dependencies and scores — in the free Atlas.</p>
            </div>
            <Link href="/research/" className="btn-ed btn-ed-primary">Open the Atlas <span className="arr">→</span></Link>
          </div>
        </div>

        <p style={{ marginTop: 32 }}><Link href="/reports/" className="btn-ed btn-ed-ghost">← All reports</Link></p>
      </section>
    </>
  );
}
