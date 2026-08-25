import Link from 'next/link';
import styles from './executive-summary.module.css';

const SLUG = 'kalpasar-economic-impact';
const REPORT_URL = `/reports/${SLUG}/`;
const SUMMARY_URL = `/reports/${SLUG}/executive-summary/`;
const PDF_URL =
  'https://library.techadyant.com/free%20reports/Kalpasar_Economic_Impact_Assessment.pdf';

const FIG = '/reports/executive-summaries/kalpasar-economic-impact/';

const COVER = '/covers/kalpasar-economic-impact.jpg';
const COVER_CAP = 'Free edition cover · 104 pages · Assessment 2026';

const keyNumbers = [
  { val: '₹1,33,246 cr', label: 'capex (current DPR, Indo-Dutch 2026); equity IRR ~1%, financial NPV −₹65,126 cr', src: 'Exec Summary - Verified' },
  { val: '7,800 MCM/yr', label: 'dependable freshwater yield — +138% over Gujarat\'s 5,650 MCM; storage 7,807–13,000 MCM', src: 'Ch 3 - Verified' },
  { val: '21.5% / 1.28', label: 'economic IRR over 30 years / benefit-cost ratio; induced industrial investment ₹2.8 lakh cr', src: 'Exec Summary - Verified' },
  { val: '₹28 lakh cr', label: 'cumulative GDP impact by 2050 (base); ₹36 lakh cr accelerated (2036); ₹12 lakh cr downside (2045+)', src: 'Scenario model - Verified' },
  { val: '~240 → ~60 km', label: 'South Gujarat↔Saurashtra road distance cut by the 8-lane crest corridor; ~₹4,000 cr/yr logistics savings', src: 'Exec Summary / Ch 5' },
  { val: '~50%', label: 'assessed probability of financial close by 2030; swing factors: environmental clearance, political continuity', src: 'Exec Summary - Verified' },
];

const findings = [
  {
    h: 'A platform, not a project',
    claim: <>Kalpasar is best evaluated on <Num>induced impact</Num>, not direct return. The Golden Quadrilateral cost ₹60,000 cr and generated ~₹4,50,000 cr of induced investment; Kalpasar&rsquo;s ₹1,33,246 cr capex is projected to catalyse <Num>₹2,80,000 cr</Num>. No single revenue stream covers the cost; the aggregate benefit-cost ratio does.</>,
    src: 'Ch 1 - Verified',
  },
  {
    h: 'The freshwater dividend is the engine',
    claim: <>At 7,800 MCM/yr dependable yield, Kalpasar <Num>more than doubles</Num> Gujarat&rsquo;s usable freshwater. Industrial offtake (2,870 MCM/yr at ₹18/m³) generates <Num>₹5,166 cr/yr</Num> and is the binding enabler of ₹2.8 lakh cr of induced industrial investment. Every cubic metre enables ~₹65 of industrial GVA.</>,
    src: 'Ch 3 - Verified',
  },
  {
    h: 'The road is the most under-appreciated component',
    claim: <>The 8-lane crest corridor cuts the South Gujarat↔Saurashtra distance from <Num>~240 km to ~60 km</Num>, integrates Saurashtra into the Dedicated Freight Corridor network, and generates <Num>~₹4,000 cr/yr</Num> of logistics savings at steady state, structured as a toll concession with 11-13% expected IRR.</>,
    src: 'Exec Summary / Ch 2 - Verified',
  },
  {
    h: 'Tidal retirement gutted the direct-revenue case',
    claim: <>The 2026 DPR retired the earlier 5,880 MW tidal concept: the <Num>₹9,075 cr/yr tidal PPA line is gone</Num>, replaced by a ~2,470 MW captive solar+wind hybrid with only a ~₹280 cr/yr merchant tail. Energy is now a <Num>cost-offset for pumping</Num>, not a revenue stream — the main reason the financial case weakened.</>,
    src: 'Ch 2 - Verified',
  },
  {
    h: 'The environmental objections are real, not manageable',
    claim: <>Tidal-flat loss, fisheries impact, sediment dynamics and salinity transition are <Num>unresolved ecological objections</Num> — 40 years of study without sanction is the evidence. The mitigation programme (₹12,800 cr capital + ₹240 cr/yr) is necessary but not sufficient; sediment management (TRL 6) and salinity transition (TRL 5) need targeted R&amp;D.</>,
    src: 'Ch 2 / Ch 11 - Verified',
  },
  {
    h: 'Only sovereign leadership can deliver it',
    claim: <>A capital stack of <Num>65% sovereign/state equity and grants, 30% multilateral concessional debt, 5% bond/InvIT</Num> achieves 7.8% WACC — but <Num>sovereign grants, not equity alone</Num>, are required to bridge the gap between economic and financial returns. Private capital should enter via offtake, operations and adjacent development, not construction risk.</>,
    src: 'Ch 7 - Verified',
  },
];

const faqs = [
  {
    q: 'What is Kalpasar?',
    a: 'A proposed ~60-64 km closure dam across the Gulf of Khambhat (Bhavnagar-Bharuch) — main sea-crossing ~30 km — impounding a coastal freshwater basin of 7,807-13,000 MCM, carrying an 8-lane road on its crest and a ~2,470 MW captive solar+wind hybrid to power the freshwater-pumping system. Capex ₹1,33,246 crore under the current DPR (2026, Indo-Dutch technical cooperation). Conceived in the late 1980s; unsanctioned at the time of writing.',
  },
  {
    q: 'Why has it not been built in 40 years?',
    a: 'Three complications: the multi-purpose structure has no single revenue stream covering capex (and the direct-revenue case weakened with the retirement of tidal power); unresolved environmental objections — tidal-flat loss, fisheries impact, sediment dynamics, salinity transition — are the primary reason sanction has never been granted; and India’s infrastructure financing ecosystem has moved away from mega-project risk-taking toward de-risked operational assets.',
  },
  {
    q: 'Is it financially viable?',
    a: 'Not on direct cash flows: equity IRR ~1%, financial NPV −₹65,126 crore. Yes on an economic basis: economic IRR 21.5% over 30 years, B/C ratio 1.28, ₹2.8 lakh crore of induced industrial investment, ~₹28 lakh crore cumulative GDP impact by 2050. The gap between the two is the argument for sovereign-led structuring with concessional finance and grants.',
  },
  {
    q: 'What are the environmental risks?',
    a: 'The transition of a tidal-flat ecosystem to a freshwater one: tidal-flat loss, fisheries impact, sediment dynamics in high-sediment catchments, and salinity transition during impoundment. Six of eight subsystems are at TRL 9, but sediment management (TRL 6) and salinity transition (TRL 5) need targeted R&D — about ₹500 crore over five years via a Kalpasar Knowledge Consortium with Dutch cooperation. The ₹12,800 crore mitigation programme (including ₹2,800 crore R&R for ~30 villages) is necessary but not sufficient.',
  },
  {
    q: 'What is the timeline?',
    a: 'Conditional on approvals: EIA ToR 2026-27, environmental clearance Q4 2028, financial close Q4 2030 (~50% probability), land acquisition Q4 2031, construction Q1 2032, staged impoundment Q2 2038, full operation Q1 2039. A two-year delay in any milestone pushes commissioning past 2040 and erodes the economic IRR by ~145 basis points.',
  },
  {
    q: 'What does it mean for investors and industry?',
    a: 'The primary value lies in secondary asset monetisation — water concessions, the toll road, irrigation networks — becoming available 2039-2045, not the construction contract. For venture capital it catalyses a water-tech, agri-tech and logistics-tech ecosystem. For water-intensive industry it reorders the competitive geography of Indian manufacturing — the Dahej-Hazira-Ankleshwar PCPIR has already deferred ~₹35,000 crore of capacity on water uncertainty. Positioning should be contingent on the project’s actual progress through clearances.',
  },
];

function Num({ children }: { children: React.ReactNode }) {
  return <span className={styles.findingNum}>{children}</span>;
}

function jsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Techadyant Labs',
        url: 'https://labs.techadyant.com',
        logo: 'https://labs.techadyant.com/assets/logo.png',
      },
      {
        '@type': 'Report',
        headline: 'Kalpasar Economic Impact Assessment: India’s Rs 1.33 Lakh Crore Bay Project',
        author: { '@type': 'Organization', name: 'Techadyant Labs' },
        publisher: { '@type': 'Organization', name: 'Techadyant Labs' },
        datePublished: '2026-08-09',
        dateModified: '2026-08-09',
        description:
          'Free strategic assessment of the 60-64 km Gulf of Khambhat closure dam: Rs 1,33,246 crore capex, 21.5% economic IRR vs ~1% equity IRR, and why it is unsanctioned after 40 years.',
        url: 'https://labs.techadyant.com' + SUMMARY_URL,
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://labs.techadyant.com' },
          { '@type': 'ListItem', position: 2, name: 'Reports', item: 'https://labs.techadyant.com/reports/' },
          { '@type': 'ListItem', position: 3, name: 'Kalpasar Economic Impact Assessment', item: 'https://labs.techadyant.com' + REPORT_URL },
          { '@type': 'ListItem', position: 4, name: 'Executive Summary', item: 'https://labs.techadyant.com' + SUMMARY_URL },
        ],
      },
    ],
  };
}

const scenarios = [
  ['Accelerated', '2036', '₹36 lakh cr', 'Staged impoundment pulled forward; first full operating year 2036'],
  ['Base', '2039', '₹28 lakh cr', 'EIA 2028, financial close 2030, construction 2032; 302,000 jobs; ~₹11,528 cr/yr direct revenue by 2045'],
  ['Downside', '2045+', '₹12 lakh cr', '36-month aggregate delay; commissioning pushed past 2042; economic IRR eroded ~145 bps per 2-year slippage'],
];

const allocation = [
  ['Irrigation (Saurashtra-Kutch)', '42%', '16%', '1.2 million ha; +38% command-area agricultural GVA'],
  ['Industrial (Dahej-Hazira-Ankleshwar)', '28%', '75%', '2,870 MCM/yr at ₹18/m³ = ₹5,166 cr/yr'],
  ['Drinking water (25 million people, 30 districts)', '14%', '8%', 'Cross-subsidised by industrial tariffs'],
  ['Ecological reserve', '10%', '—', 'No direct revenue'],
  ['Net evaporation and seepage', '6%', '—', 'No direct revenue'],
];

const watch = [
  { date: '2026-27', text: <><strong>EIA ToR approval</strong> and final DPR review; ~₹500 cr project preparation facility; Kalpasar Knowledge Consortium R&amp;D (₹500 cr) on sediment and salinity gaps.</> },
  { date: 'Q4 2028', text: <><strong>Environmental clearance</strong> - the binding gate; EIA process can extend 12-24 months depending on resolution of ecological objections.</> },
  { date: 'Q4 2030', text: <><strong>Financial close</strong> at ~50% probability; capital stack 65% sovereign/state, 30% multilateral concessional, 5% bond/InvIT; WACC 7.8%.</> },
  { date: '2031-32', text: <><strong>Land acquisition complete</strong>; closure-dam construction begins - 6-year main sea-crossing, monsoon-window constrained; Indian lead (L&amp;T, Afcons, HCC) + Dutch specialist.</> },
  { date: '2038-39', text: <><strong>Staged impoundment → full operation</strong>; de-risked operational assets (water concessions, toll road, irrigation networks) begin to monetise.</> },
  { date: '2040s', text: <><strong>Secondary monetisation</strong>; reordered competitive geography of water-intensive manufacturing; ~₹24 lakh cr cost of delay already foregone if slippage persists.</> },
];

export function KpSummary() {
  return (
    <div className={styles.sumWrap}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
      <Link href={REPORT_URL} className={styles.backLink}>
        ← Back to the full report
      </Link>

      <header className={styles.hero}>
        <div className={styles.heroGrid}>
          <div>
            <div className={styles.kicker}>Industrial &amp; Deep Tech · Assessment · 2026 Free Edition</div>
            <h1 className={styles.h1}>Kalpasar Economic Impact Assessment</h1>
            <p className={styles.subtitle}>
              A 60-64 km closure dam across the Gulf of Khambhat to impound 7,800 MCM of freshwater
              a year - 40 years studied, never sanctioned. ₹1,33,246 crore of capex, an equity IRR
              of ~1% and an economic IRR of 21.5%. The platform thesis versus the environmental
              objection.
            </p>
            <div className={styles.metaRow}>
              <span>Published <b>09 Aug 2026</b></span>
              <span>Domain <b>Industrial &amp; Deep Tech</b></span>
              <span>Reading time <b>~7 min</b></span>
              <span>Edition <b>Free - 104 pages</b></span>
              <span>Author <b>Techadyant Labs · Research</b></span>
            </div>
          </div>
          <figure className={styles.coverCard}>
            <img src={COVER} alt="Kalpasar Economic Impact Assessment report cover" loading="eager" />
            <figcaption className={styles.coverCap}>{COVER_CAP}</figcaption>
          </figure>
        </div>
      </header>

      <section className={styles.section} id="thesis">
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>01</span>
          <h2>The Thesis</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
        <p className={styles.lead}>
          Kalpasar is not a project to be evaluated on its standalone financial IRR - which is now{' '}
          <Num>~1% on equity</Num>. It is a <strong>platform investment</strong> whose value lies in
          the industrial, agricultural and urban ecosystems it enables: <Num>7,800 MCM/yr</Num> of
          freshwater, a <Num>240 → 60 km</Num> road corridor, and <Num>₹2.8 lakh crore</Num> of
          induced industrial investment. The economic case is robust (<Num>21.5% IRR</Num>, B/C{' '}
          <Num>1.28</Num>); the direct financial case is not. The honest conclusion: this is a
          project that <strong>only sovereign leadership can deliver</strong>, and only if the
          environmental objections - tidal-flat loss, fisheries, sediment, salinity - are genuinely
          resolved. Techadyant Labs assesses the probability of financial close by 2030 at{' '}
          <Num>approximately 50%</Num>.
        </p>
      </section>

      <section className={styles.section} id="key-numbers">
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>02</span>
          <h2>Key Numbers</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
        <div className={styles.statsGrid}>
          {keyNumbers.map((s) => (
            <div className={styles.statCard} key={s.label}>
              <div className={styles.statVal}>{s.val}</div>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statSrc}>{s.src}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} id="findings">
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>03</span>
          <h2>Key Findings</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
        <div className={styles.findingsGrid}>
          {findings.map((f) => (
            <div className={styles.findingCard} key={f.h}>
              <h3>{f.h}</h3>
              <p className={styles.findingClaim}>{f.claim}</p>
              <span className={styles.findingSrc}>[{f.src}]</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} id="framework">
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>04</span>
          <h2>The Framework</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
        <div className={styles.frameworkBox}>
          <p>
            The assessment applies a <strong>platform-infrastructure lens</strong>: direct returns
            (equity IRR ~1%, financial NPV −₹65,126 cr) are separated from economic returns
            (21.5% IRR, B/C 1.28) and induced impact (₹2.8 lakh cr), benchmarked against the Golden
            Quadrilateral, Dedicated Freight Corridor, Sardar Sarovar and the National Solar
            Mission. A <strong>PESTLE frame</strong> scores five of six dimensions favourable with
            the environmental dimension binding; a <strong>TRL assessment</strong> finds six of
            eight subsystems at TRL 9; a <strong>water-allocation model</strong> distributes the
            7,800 MCM/yr dividend (42/28/14/10/6); <strong>six strategic control points</strong>{' '}
            structure the political economy; and a <strong>six-gate critical path</strong> maps
            EIA ToR (2026-27) to full operation (2039). All outputs are Techadyant Labs conditional
            models based on the current DPR design.
          </p>
        </div>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-platform.svg'} alt="Platform comparators capex vs induced investment: Golden Quadrilateral 60k to 450k, Kalpasar 133k to 280k crore" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 1 - Platform comparators: India&rsquo;s four prior platforms generated multiples
            of cost in induced activity; Kalpasar is projected to follow the same pattern.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-water.svg'} alt="Kalpasar water allocation: irrigation 42, industrial 28, drinking 14, ecological 10, losses 6 percent" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 2 - The freshwater dividend: irrigation gets the largest volume, industry
            generates 75% of revenue from 28% of volume.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-capex.svg'} alt="Kalpasar capex packages: closure dam 49800, road 16700, RE and pumping 14600, sluice 13200, environment 12800, reservoir 6900 crore" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 3 - Capex packages of the ₹1,33,246 cr current-DPR estimate; closure-dam civil
            works is the largest single package at 37.4%.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-scenarios.svg'} alt="Kalpasar GDP scenarios by 2050: accelerated 36, base 28, downside 12 lakh crore" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 4 - Cumulative GDP impact by 2050: ₹28 lakh cr base, ₹36 lakh cr accelerated,
            ₹12 lakh cr downside - a ~₹24 lakh cr cost of delay.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-gates.svg'} alt="Kalpasar critical path gates from EIA terms of reference 2026 to full operation 2039" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 5 - The six-gate critical path, every milestone conditional on approvals not yet
            granted.
          </figcaption>
        </figure>
      </section>

      <section className={`${styles.section} ${styles.impl}`} id="implications">
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>05</span>
          <h2>What It Means</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
        <p>
          <strong>For the Government of India:</strong> Kalpasar belongs in the same category of
          national priority as the Dedicated Freight Corridor and the National Infrastructure
          Pipeline - but with explicit recognition that it requires sovereign grants, not just
          equity, to bridge the economic-financial gap. Without a step-change in freshwater,
          Gujarat&rsquo;s industrial GVA growth decelerates from 8.5% to 6.0-6.5% (2025-35) with a
          cumulative GDP loss of ~₹15 lakh crore by 2050.
        </p>
        <p>
          <strong>For the Government of Gujarat:</strong> the project is the single most
          consequential industrial-policy lever available to the state over the next decade,
          conditional on resolution of the environmental objections.
        </p>
        <p>
          <strong>For institutional investors:</strong> the primary value lies in the pipeline of
          de-risked operational assets - water concessions, the toll road, irrigation networks -
          that becomes available between 2039 and 2045, not in the primary construction contract.
        </p>
        <p>
          <strong>For venture capital:</strong> the project catalyses a water-tech, agri-tech and
          logistics-tech ecosystem requiring patient capital - the same pattern the Golden
          Quadrilateral created for logistics.
        </p>
        <p>
          <strong>For water-intensive industry:</strong> the project reorders the competitive
          geography of Indian manufacturing - the Dahej-Hazira-Ankleshwar PCPIR has already
          deferred ~₹35,000 crore of capacity on water uncertainty. Strategic positioning should be
          contingent on the project&rsquo;s actual progress through clearances.
        </p>
      </section>

      <section className={styles.section} id="tables">
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>06</span>
          <h2>The Numbers, Tabulated</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="sr-only">Scenarios with commissioning year and cumulative GDP impact by 2050</caption>
            <thead>
              <tr><th>Scenario</th><th>Commissioning</th><th>Cumulative GDP by 2050</th><th>Path</th></tr>
            </thead>
            <tbody>
              {scenarios.map((r) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="sr-only">Water allocation by use with share of volume and revenue</caption>
            <thead>
              <tr><th>Use</th><th>Share of volume</th><th>Share of revenue</th><th>Detail</th></tr>
            </thead>
            <tbody>
              {allocation.map((r) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.tableNote}>
          All figures are Techadyant Labs conditional model outputs based on the current DPR design
          (Indo-Dutch technical cooperation, ~2,470 MW captive solar+wind, capex ₹1,33,246 crore).
          The project is unsanctioned at the time of writing: DPR in final review, EIA Terms of
          Reference applied to MoEF&amp;CC, no financial close, no construction.
        </p>
      </section>

      <section className={styles.section} id="watch">
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>07</span>
          <h2>What to Watch</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
        <ul className={styles.watchList}>
          {watch.map((w) => (
            <li key={w.date}>
              <span className={styles.watchDate}>{w.date}</span>
              <div className={styles.watchText}>{w.text}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${styles.section} ${styles.faq}`} id="faq">
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>08</span>
          <h2>Frequently Asked Questions</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
        {faqs.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <div className={styles.faqAnswer}><p>{f.a}</p></div>
          </details>
        ))}
      </section>

      <section className={`${styles.section} ${styles.sources}`} id="sources">
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>09</span>
          <h2>Sources &amp; Methodology</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 14.5, lineHeight: 1.7, marginBottom: 14 }}>
          Derived from the <em>Kalpasar Economic Impact Assessment</em> free edition (v2, current
          DPR). All IRR, BCR, NPV and scenario figures are Techadyant Labs conditional model
          outputs. Primary sources:
        </p>
        <ol>
          <li>Current DPR (2026, Indo-Dutch technical cooperation) - project configuration, capex, critical path [Verified]</li>
          <li>Gujarat government project documentation; PIB release PRID 2289927 (2026); MoEF&amp;CC EIA and CRZ notifications [Verified]</li>
          <li>Engineering precedent - Afsluitdijk (1932), Zuiderzee Works, Delta Works; UK Swansea Bay tidal lagoon decision (2018) [Verified]</li>
          <li>Company disclosures - ANDRITZ, BHEL, Alstom, Adani Green, Tata Power, ReNew, L&amp;T, Afcons, HCC, Boskalis, Van Oord [Verified]</li>
          <li>Water allocation, LCOW, scenario, TRL and control-point models - Techadyant Labs [Model]</li>
        </ol>
        <p style={{ marginTop: 18 }}>
          <Link href="/research/methodology/" style={{ color: 'var(--gold)' }}>
            Read the full methodology and scoring rubrics →
          </Link>
        </p>
      </section>

      <div className={styles.conversionGrid}>
        <div className={styles.buyCard}>
          <h3>Kalpasar Economic Impact - Free Edition</h3>
          <div className={styles.price}>Free · 104 pages</div>
          <p>
            The complete assessment - strategic context, engineering architecture, water economics,
            financing pathways, implementation risk analysis and the structured pre-project
            roadmap.
          </p>
          <a href={PDF_URL} className={styles.btnPrimary} download>
            Download the full report (PDF)
          </a>
          <Link href={REPORT_URL} className={styles.btnSecondary}>Open the report page</Link>
        </div>
        <div className={styles.emailGate}>
          <h3>What&rsquo;s inside</h3>
          <p>
            Strategic context and the Indian water constraint · project architecture and
            engineering scope (TRL assessment, six strategic control points) · the freshwater
            dividend · Kalpasar and India&rsquo;s water-security architecture · financing pathways
            and lender conditions · milestone dependencies: DPR, peer review, inter-state
            agreement, land acquisition, long-lead marine procurement and financial close.
          </p>
        </div>
      </div>

      <div className={styles.related}>
        <Link href="/reports/">All reports</Link>
        <Link href="/signals/">Related signals</Link>
        <Link href="/newsletter/">Briefings</Link>
        <Link href="/research/">Research</Link>
        <Link href="/reports/theme/industrial-deep-tech/">Industrial &amp; Deep Tech</Link>
      </div>
    </div>
  );
}
