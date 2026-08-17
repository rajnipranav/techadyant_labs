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

const bibtexAtlas = `@misc{techadyant:atlas:2026,
  author       = {{Techadyant Labs}},
  title        = {The Atlas — India’s Industrial Systems, Mapped},
  year         = {2026},
  howpublished = {${SITE}/research/},
  note         = {Accessed August 2026}
}`;
const bibtexCorridors = `@misc{techadyant:corridor-nodes:2026,
  author       = {{Techadyant Labs}},
  title        = {India’s Industrial Corridors — Node Dataset (38 nodes, 11 corridors)},
  year         = {2026},
  howpublished = {${SITE}/data/corridor-nodes.csv},
  note         = {CC BY 4.0. Version: August 2026}
}`;

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
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">What to cite</div>
            <h2>Flagship assets</h2>
          </div>
        </div>
        <p className="serif" style={{ color: 'var(--text-muted, #9aa3b2)', marginTop: 0 }}>
          The most-cited Techadyant surfaces, with the preferred title and stable URL to use in attribution.
        </p>
        <ul className="node-infra" role="list" style={{ marginTop: 14 }}>
          <li><b>The Atlas</b> — India’s industrial systems, mapped. <Link href="/research/">/research/</Link></li>
          <li><b>Industrial corridors</b> — India’s eleven national industrial corridors. <Link href="/corridors/">/corridors/</Link></li>
          <li><b>Corridor Readiness Score</b> — how the 0–100 score is built. <Link href="/corridors/methodology/">/corridors/methodology/</Link></li>
          <li><b>Corridor node dataset</b> — 38 nodes, open CSV. <Link href="/data/corridor-nodes.csv">/data/corridor-nodes.csv</Link></li>
          <li><b>Research methodology</b> — evidence layers and claim labels. <Link href="/methodology/">/methodology/</Link></li>
          <li><b>Signals</b> — time-sensitive research dispatches. <Link href="/signals/">/signals/</Link></li>
        </ul>
      </section>

      <section className="wrap-narrow">
        <div className="section-head-ed">
          <div>
            <div className="ed-kicker">Citation formats</div>
            <h2>BibTeX</h2>
          </div>
        </div>
        <p className="serif" style={{ color: 'var(--text-muted, #9aa3b2)', marginTop: 0 }}>
          Machine-readable citations for the Atlas and the corridor node dataset. Plain-text and APA-style citations are shown under “Cite the Atlas” above.
        </p>
        <CopyField label="BibTeX (Atlas)" value={bibtexAtlas} multiline />
        <CopyField label="BibTeX (corridor dataset)" value={bibtexCorridors} multiline />
      </section>

      <section className="wrap-narrow">
        <div className="report-body" style={{ padding: '8px 0 0' }}>
          <div className="section-head-ed">
            <div>
              <div className="ed-kicker">Dataset licence &amp; version</div>
              <h2>Reuse terms</h2>
            </div>
          </div>
          <p className="serif" style={{ color: 'var(--text-muted, #9aa3b2)' }}>
            The corridor node dataset (<code>corridor-nodes.csv</code>) is published under{' '}
            <b>CC BY 4.0</b> — reuse, adapt and redistribute with attribution to Techadyant Labs.
            Current dataset version: <b>August 2026</b>. Each dossier carries a last-updated date and
            a per-claim verification label ([V] verified, [V1] announced, [U] unverified); please
            preserve those labels when you reuse the data.
          </p>
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
