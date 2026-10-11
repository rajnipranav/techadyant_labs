import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../../../AtlasNav';
import { JsonLd, breadcrumb, faqLd, SITE, ORG_REF } from '../../../seo';
import { SourceList } from '../../../industrial/ui';
import { C, fmtDate, SectionHead } from '../../ui';
import {
  byOperator, byState, gctCoverage, gctSources, terminalsSorted,
  OPERATOR_LABEL, STATUS_LABEL, GCT_PATH,
} from '../../cargo-terminals-data';

const URL = `${SITE}${GCT_PATH}`;
const TITLE = 'PM GatiShakti Cargo Terminals: Commissioned GCT Inventory, Operators & Commodities';
const DESC = 'Atlas-verified inventory of PM GatiShakti Cargo Terminals — commissioning dates, operators, railway zones, commodity focus and connectivity, each with a primary source.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    'Gati Shakti cargo terminal', 'GCT list India', 'PM GatiShakti cargo terminal policy',
    'Indian Railways freight terminals', 'DFCCIL cargo terminal', 'India rail freight infrastructure',
    'private freight terminal India', 'Gati Shakti multi modal cargo terminal',
  ],
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'website', siteName: 'Techadyant Labs', images: [{ url: '/og/default.png', width: 1200, height: 630, alt: TITLE }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ['/og/default.png'] },
};

export default function CargoTerminalsPage() {
  const rows = terminalsSorted();
  const srcs = gctSources();
  const idx = new Map(srcs.map((s, i) => [s.id, i + 1]));
  const agg07 = gctCoverage.network_aggregate_2026_07;
  const agg09 = gctCoverage.network_aggregate_2026_09;
  const verified = rows.map((t) => t.last_verified ?? '').sort().at(-1) ?? null;

  const faqs = [
    {
      q: 'How many Gati Shakti Cargo Terminals have been commissioned?',
      a: `${agg09.commissioned_count} GCTs were reported commissioned as of ${fmtDate(agg09.as_of)}, up from ${agg07.commissioned_count} as of ${fmtDate(agg07.as_of)}. This page carries ${gctCoverage.tier_a_commissioned_count} of them as individually verified records with their own primary source; it is a sample, not the full network.`,
    },
    {
      q: 'What is a Gati Shakti Cargo Terminal?',
      a: 'A rail-side freight handling facility developed under the Ministry of Railways’ Gati Shakti Multi-Modal Cargo Terminal policy, introduced on 15 December 2021. Terminals may be built and run by Indian Railways, DFCCIL or private operators on railway or private land.',
    },
    {
      q: 'Who operates Gati Shakti Cargo Terminals?',
      a: byOperator().map((o) => `${OPERATOR_LABEL[o.type]}: ${o.count}`).join('; ') + '. Operator type is recorded as stated in each terminal’s own source.',
    },
    {
      q: 'What capacity do Gati Shakti Cargo Terminals handle?',
      a: `Network capacity is reported at ${agg07.capacity_mtpa} MTPA handling ${agg07.freight_mt_2025_26} MT of freight in FY 2025-26 (${fmtDate(agg07.as_of)}). Terminal-level capacity is published only rarely, so most records here carry no capacity figure rather than an estimated one.`,
    },
  ];

  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([
          { name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' },
          { name: 'Programmes', path: '/research/programmes/' },
          { name: 'PM GatiShakti', path: '/research/programmes/gati-shakti/' },
          { name: 'Cargo Terminals', path: GCT_PATH },
        ]),
        {
          '@context': 'https://schema.org', '@type': 'Dataset',
          name: 'PM GatiShakti Cargo Terminals — Techadyant Atlas', description: DESC, url: URL,
          isAccessibleForFree: true, creator: ORG_REF, publisher: ORG_REF,
          dateModified: verified ?? undefined,
          spatialCoverage: { '@type': 'Place', name: 'India' },
          variableMeasured: 'Terminal status, operator type, railway zone, commodity focus and commissioning date',
          keywords: ['Gati Shakti cargo terminal', 'India rail freight', 'logistics infrastructure'],
        },
        faqLd(faqs),
      ]} />

      <main className="wrap inner pi-body">
        <p className="pi-eyebrow">
          <Link href="/research/programmes/">Programme Intelligence</Link> ·{' '}
          <Link href="/research/programmes/gati-shakti/">PM GatiShakti</Link>
        </p>
        <h1>PM GatiShakti Cargo Terminals</h1>
        <p className="pi-hero">
          Rail-side freight terminals developed under the Ministry of Railways’ Gati Shakti Multi-Modal Cargo
          Terminal policy. Each record below carries its own commissioning date and primary source.
        </p>

        <SectionHead
          id="coverage" kicker="01 · What this dataset covers" title="A verified sample, not a census" cls="fact"
          note="Network totals and individually verified records are deliberately kept apart. The counts below are not derived from one another and should never be reconciled." />
        <dl className="pi-glance">
          <div><dt>Atlas-verified records</dt><dd>{gctCoverage.total_records}<span className="pi-asof">This page</span></dd></div>
          <div><dt>Commissioned, individually sourced</dt><dd>{gctCoverage.tier_a_commissioned_count}<span className="pi-asof">Each with its own primary source</span></dd></div>
          <div><dt>Sanctioned, not commissioned</dt><dd>{gctCoverage.tier_b_sanctioned_count}</dd></div>
          <div><dt>Network commissioned</dt><dd>{agg09.commissioned_count} <C p={[{ source_id: agg09.source_id }]} idx={idx} /><span className="pi-asof">As of {fmtDate(agg09.as_of)}</span></dd></div>
          <div><dt>Network capacity</dt><dd>{agg07.capacity_mtpa} MTPA <C p={[{ source_id: agg07.source_id }]} idx={idx} /><span className="pi-asof">As of {fmtDate(agg07.as_of)}</span></dd></div>
          <div><dt>Freight handled, FY 2025-26</dt><dd>{agg07.freight_mt_2025_26} MT <C p={[{ source_id: agg07.source_id }]} idx={idx} /><span className="pi-asof">As of {fmtDate(agg07.as_of)}</span></dd></div>
        </dl>
        <p className="pi-caveat">
          Of the {gctCoverage.tier_a_commissioned_count} commissioned records, {gctCoverage.tier_a_commissioned_with_full_date} carry a full
          commissioning date and {gctCoverage.tier_a_commissioned_with_partial_date} a partial one. The ministry reports{' '}
          {agg07.approved_in_principle_locations} locations approved in principle ({fmtDate(agg07.as_of)}); no itemised national
          register is published, so the gap between {gctCoverage.total_records} and {agg09.commissioned_count} is a coverage limit, not a discrepancy.
        </p>

        <SectionHead id="terminals" kicker="02 · Terminal register" title="Verified cargo terminals" cls="fact"
          note="Status, operator and commodity focus are recorded as stated in each terminal’s source. Capacity is left blank where no figure is published." />
        <div className="pi-table-wrap">
          <table className="pi-table pi-gct-table">
            <thead>
              <tr>
                <th>Terminal</th><th>State / district</th><th>Railway</th>
                <th>Operator</th><th>Commodities</th><th>Status</th><th>Commissioned</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id}>
                  <td>
                    <b>{t.canonical_name}</b> <C p={t.provenance} idx={idx} />
                    {t.locality && <span className="pi-gct-sub">{t.locality}</span>}
                    {t.status_note && <span className="pi-gct-sub">{t.status_note}</span>}
                  </td>
                  <td>{t.state ?? '—'}{t.district ? <span className="pi-gct-sub">{t.district}</span> : null}</td>
                  <td>{t.railway_zone ?? '—'}{t.railway_division ? <span className="pi-gct-sub">{t.railway_division}</span> : null}</td>
                  <td>{OPERATOR_LABEL[t.operator_type]}{t.operating_entity ? <span className="pi-gct-sub">{t.operating_entity}</span> : null}</td>
                  <td>{t.commodity_focus.length ? t.commodity_focus.join(', ') : '—'}</td>
                  <td><span className={`pi-gct-st pi-gct-st-${t.status}`}>{STATUS_LABEL[t.status]}</span></td>
                  <td className="pi-nowrap">{t.commissioning_date ? fmtDate(t.commissioning_date) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SectionHead id="distribution" kicker="03 · Distribution" title="Where the verified terminals sit" cls="derived"
          note="Counts over the verified sample only — they are not a national distribution." />
        <div className="pi-two">
          <div>
            <h3 className="pi-h3">By state</h3>
            <ul className="pi-gct-dist">
              {byState().map((s) => <li key={s.state}><span>{s.state}</span><b>{s.count}</b></li>)}
            </ul>
          </div>
          <div>
            <h3 className="pi-h3">By operator type</h3>
            <ul className="pi-gct-dist">
              {byOperator().map((o) => <li key={o.type}><span>{OPERATOR_LABEL[o.type]}</span><b>{o.count}</b></li>)}
            </ul>
          </div>
        </div>

        <SectionHead id="constraints" kicker="04 · Recorded constraints" title="What limits each terminal" cls="fact" />
        <ul className="pi-datagaps">
          {rows.filter((t) => t.constraints).map((t) => (
            <li key={t.id}><b>{t.canonical_name}:</b> {t.constraints}</li>
          ))}
        </ul>

        <SectionHead id="gaps" kicker="Data gaps" title="What this page does not yet know" />
        <ul className="pi-datagaps">
          <li>No itemised national GCT register is published; this is a source-quality sample, so the record count must not be read as network coverage.</li>
          <li>Terminal-level capacity is rarely published. Records carry a capacity figure only where a source states one — the rest are blank, not estimated.</li>
          <li>Approval and construction-start dates are largely unpublished; most records carry only a commissioning date.</li>
          <li>Land ownership and investment values per terminal are not captured.</li>
        </ul>

        <SectionHead id="sources" kicker="Sources" title="Source record"
          note={`Verified ${fmtDate(verified)}. Numbers in brackets throughout the page refer to this list.`} />
        <SourceList items={srcs.map((s, i) => ({ n: i + 1, name: s.source_name, publisher: s.publisher, url: s.source_url, date: s.publication_date, type: s.source_type, confidence: s.confidence }))} />

        <p className="pi-ctas">
          <Link className="pi-btn" href="/research/programmes/gati-shakti/">← PM GatiShakti programme page</Link>
        </p>
      </main>
    </>
  );
}
