import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '../research/seo';
import { reports } from '../reports/data';
import { atlas } from '../research/atlas';
import { CopyField } from '../components/CopyField';

export const metadata: Metadata = {
  title: 'Cite & embed the research',
  alternates: { canonical: `${SITE}/resources/` },
  description:
    'Cite, embed and share Techadyant Labs research — free with attribution. Ready-made citations, embed/link-back snippets, and open-access reports on India’s industrial systems.',
};

const freeReports = reports.filter((r) => r.status === 'published' && r.access === 'free');

const atlasUrl = `${SITE}/research/`;
const citationText = `Techadyant Labs, “The Atlas — India’s industrial systems, mapped,” Techadyant Labs, ${atlasUrl}`;
const embedAtlas = `<a href="${atlasUrl}">The Atlas — India’s industrial systems, mapped (Techadyant Labs)</a>`;
const embedBadge = `<p>Source: <a href="${SITE}/">Techadyant Labs</a> — strategic intelligence on India’s industrial systems.</p>`;

export default function ResourcesPage() {
  return (
    <>
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>Resources</span>
          </div>
          <h1>Cite &amp; share the research.</h1>
          <p className="lede">
            Techadyant Labs research is free to cite, quote and link with attribution. Use the
            ready-made citations and embed snippets below — for a report, a briefing, or the live
            Atlas of India’s industrial systems.
          </p>
        </div>
      </header>

      <section className="wrap-narrow">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)' }}>Cite the Atlas</div>
            <h2>Suggested citation</h2>
          </div>
        </div>
        <p className="serif" style={{ color: 'var(--text-muted, #9aa3b2)', marginTop: 0 }}>
          The Atlas is a living dataset of {atlas.corridors.length} strategic ecosystems,
          {' '}{atlas.players.length} tracked players and {atlas.grid.length} dependency
          assessments. If you reference it in a report, article or brief, this is the citation
          we suggest.
        </p>
        <CopyField label="Citation" value={citationText} />
      </section>

      <section className="wrap-narrow">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">Embed / link back</div>
            <h2>Add a link on your site</h2>
          </div>
        </div>
        <p className="serif" style={{ color: 'var(--text-muted, #9aa3b2)', marginTop: 0 }}>
          Paste either snippet into your page to link back to the research. A followed link is the
          most useful way to credit the work.
        </p>
        <CopyField label="Atlas link (HTML)" value={embedAtlas} multiline />
        <CopyField label="Source credit (HTML)" value={embedBadge} multiline />
      </section>

      <section className="wrap">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">Open access</div>
            <h2>Free-to-read reports</h2>
          </div>
          <Link href="/reports/" className="see-all">All reports →</Link>
        </div>
        <div className="atlas-entrypoints">
          {freeReports.map((r) => (
            <Link key={r.slug} href={`/reports/${r.slug}/`} className="atlas-entry">
              <div className="ae-k">{r.domain}</div>
              <p>{r.title}</p>
              <span className="see-all">Read the report →</span>
            </Link>
          ))}
          <Link href="/research/" className="atlas-entry">
            <div className="ae-k">The Atlas</div>
            <p>The live, free research workbench — every ecosystem, player and dependency, mapped.</p>
            <span className="see-all">Open the Atlas →</span>
          </Link>
        </div>
      </section>

      <section className="wrap-narrow">
        <div className="report-body" style={{ padding: '8px 0 0' }}>
          <div className="section-head-ed">
            <div>
              <div className="ed-kicker">Permissions</div>
              <h2>How you may use this work</h2>
            </div>
          </div>
          <p className="serif" style={{ color: 'var(--text-muted, #9aa3b2)' }}>
            You are welcome to quote, cite and link Techadyant Labs research in journalism,
            policy work, academic writing and industry analysis, provided the work is clearly
            attributed to Techadyant Labs with a link to the source page. For syndication,
            re-publication of full reports, or commercial licensing, please get in touch first.
            As an independent publication, we carry no sponsored coverage and hold no position in
            the companies or projects we analyse.
          </p>
        </div>
      </section>
    </>
  );
}
