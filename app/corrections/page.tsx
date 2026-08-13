import type { Metadata } from 'next';
import Link from 'next/link';
import { getReports } from '../lib/cms';

export const metadata: Metadata = {
  title: 'Corrections & updates',
  description:
    'A public log of every correction and revision to Techadyant Labs research — with dates and what changed. Part of our evidence-led, verifiable-by-design commitment.',
  alternates: { canonical: 'https://labs.techadyant.com/corrections/' },
};

// Static export: data is fetched at build from the CMS.
export const dynamic = 'force-static';

function fmtDate(d?: string): string {
  if (!d) return '';
  const t = Date.parse(d);
  if (Number.isNaN(t)) return d;
  return new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const lifecycleLabel: Record<string, string> = { updated: 'Updated edition', corrected: 'Corrected', superseded: 'Superseded' };

interface Entry { slug: string; title: string; date: string; kind: string; summary: string }

export default async function CorrectionsPage() {
  const reports = await getReports().catch(() => []);
  const published = reports.filter((r) => r.status === 'published');

  const entries: Entry[] = [];
  for (const r of published) {
    const ups = Array.isArray((r as any).updates) ? (r as any).updates : [];
    for (const u of ups) {
      if (u && u.summary) entries.push({ slug: r.slug, title: r.title, date: u.date || '', kind: u.kind || 'update', summary: u.summary });
    }
  }
  entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const revised = published.filter((r) => (r as any).lifecycle && (r as any).lifecycle !== 'current');

  return (
    <>
      <header className="ed-page-head"><div className="wrap inner">
        <div className="ed-breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Corrections &amp; updates</span></div>
        <h1>Corrections &amp; updates</h1>
        <p className="lede">
          We publish evidence-led research, and we hold ourselves to it. When we correct or revise a report after
          publication, we log it here — openly, with the date and what changed. This page is the public record.
        </p>
      </div></header>

      <section className="wrap-narrow" style={{ paddingTop: 28, paddingBottom: 20 }}>
        {revised.length > 0 && (
          <div style={{ marginBottom: 30 }}>
            <div className="ed-kicker" style={{ marginBottom: 12 }}>Reports with a revised status</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {revised.map((r) => (
                <li key={r.slug} style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--text-muted)' }}>{lifecycleLabel[(r as any).lifecycle] || (r as any).lifecycle}</span>
                  <Link href={`/reports/${r.slug}/`}>{r.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="ed-kicker" style={{ marginBottom: 14 }}>Change log</div>
        {entries.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.65 }}>
            No corrections have been logged. When a published report is corrected or materially revised, the change will
            appear here with its date. In the meantime, every report carries a &ldquo;last reviewed&rdquo; date, and every
            load-bearing claim is traced to a primary source and labelled for confidence.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 16 }}>
            {entries.map((e, i) => (
              <li key={i} style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16 }}>
                <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12.5, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{fmtDate(e.date)}</span>
                <div>
                  <div style={{ fontSize: 14.5, lineHeight: 1.55, marginBottom: 4 }}>
                    <strong style={{ textTransform: 'capitalize', color: e.kind === 'correction' ? 'var(--accent-warm, #FB923C)' : 'inherit' }}>{e.kind}:</strong>{' '}{e.summary}
                  </div>
                  <Link href={`/reports/${e.slug}/`} style={{ fontSize: 13, color: 'var(--text-dim)' }}>{e.title} →</Link>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="note-fine" style={{ marginTop: 28 }}>
          Spotted something that needs correcting? <Link href="/shape/">Tell us</Link> — we take accuracy seriously and
          act on credible reports quickly. See also our <Link href="/methodology/">methodology</Link>.
        </p>
      </section>
    </>
  );
}
