import Link from 'next/link';
import styles from './executive-summary.module.css';
import { ExecutiveSummaryGate } from '../../components/ExecutiveSummaryGate';

const SLUG = 'beyond-solar-panels';
const REPORT_URL = `/reports/${SLUG}/`;
const SUMMARY_URL = `/reports/${SLUG}/executive-summary/`;
const PDF_URL =
  'https://library.techadyant.com/free%20reports/Beyond-Solar-Panels-Indian-Industrial-Intelligence-Free.pdf';

const FIG = '/reports/executive-summaries/beyond-solar-panels/';

const COVER = 'https://library.techadyant.com/covers/Beyond-Solar-Panels-Indian-Industrial-Intelligence.jpg';
const COVER_CAP = 'Edition cover · 144 pages · Edition v2.1';

const keyNumbers = [
  { val: '162.15 GW', label: 'Installed solar capacity at 30 June 2026 (MNRE); 2030 objective 280 GW within 500 GW non-fossil', src: 'MNRE - Verified' },
  { val: '85% / 95%', label: 'China share of solar supply-chain capacity / PV wafer capacity (IEA 2026); wafer layer 96% concentrated', src: 'IEA ETP 2026 - Verified' },
  { val: '~172 GW', label: 'ALMM-listed module capacity vs ~48.3 GW PLI-awarded (₹24,000 cr, Tranches I+II)', src: 'PIB / MNRE - Verified' },
  { val: '16-30%', label: 'Project IRRs in Tier 1 mid-stream materials at ₹200-600 cr per GW', src: 'Localisation model - Ch 6' },
  { val: '₹1.2 lakh cr/yr', label: 'GDP leakage through 2030 under Status Quo (60% probability), easing to ₹60-80k cr by 2035', src: 'Scenario model - Ch 10' },
  { val: '35 / 40 / 18 / 7', label: 'Recommended capex split: Tier 1 materials / Tier 2 cells-wafers / Tier 3 polysilicon-equipment / cross-cutting', src: 'Boardroom playbook - Ch 12' },
];

const findings = [
  {
    h: 'India assembles; it does not yet manufacture',
    claim: <>Module capacity has scaled to <Num>~172 GW (ALMM)</Num>, but the upstream foundations - polysilicon, ingots, wafers, specialty chemicals, industrial gases, equipment - remain <Num>85-100% imported</Num>. Capability inverts value: India is strongest exactly where value is lowest. Capacity without upstream depth is assembly with a flag on it.</>,
    src: 'Exec Summary - Verified',
  },
  {
    h: 'The most valuable opportunities are materials, not polysilicon',
    claim: <>Polysilicon needs <Num>₹8,500 cr/GW</Num>, 5-7 years to commission, and returns <Num>4-9% IRR</Num> - barely above the cost of debt. Solar glass offers <Num>16-22%</Num> at ₹600 cr; industrial gases <Num>18-26%</Num> at ₹450 cr; specialty chemicals <Num>14-20%</Num> at ₹350 cr; encapsulants <Num>22-30%</Num> at ₹200 cr - and China&rsquo;s grip there is <Num>50-65%</Num>, not 80-95%.</>,
    src: 'Finding 2 - Ch 6',
  },
  {
    h: 'China&rsquo;s advantage is a 15-year policy stack',
    claim: <>Subsidised capital at <Num>2-3%</Num> (vs 8-10% in India), power at <Num>$0.03-0.04/kWh</Num> (vs $0.07-0.09), <Num>13%</Num> export VAT rebates, near-zero land, and co-located clusters worth a <Num>10-15%</Num> cost advantage. No single subsidy was decisive; the stack was.</>,
    src: 'Finding 3 - Ch 4',
  },
  {
    h: 'The window is 5-7 years',
    claim: <>Three forces narrow it after 2030: the <Num>perovskite-silicon tandem transition</Num> (crossing 30% efficiency at scale by 2031-33), Western tariffs shrinking Chinese export volumes, and rising Chinese costs. Missing 2026-2030 means <Num>importing more expensive, less reliable supply chains for decades</Num>.</>,
    src: 'Finding 5 - Ch 11',
  },
  {
    h: 'Localisation is robust to all scenarios',
    claim: <>Status Quo <Num>60%</Num> (₹1.2 lakh cr/yr leakage easing to ₹60-80k cr by 2035), Geopolitical Disruption <Num>25%</Num> (35-50% price spikes, 3-5 year delay), Technology Inflection <Num>15%</Num> (tandem strands PERC capex). <Num>Upstream localisation wins under all three</Num> - it captures GDP, removes exposure, or positions India for the next technology cycle.</>,
    src: 'Ch 10 - Scenario model',
  },
  {
    h: 'Capital is misallocated',
    claim: <>The bulk of private capital flows into modules - a saturated segment where <Num>25+ credible Indian module makers fall to 10-12 by 2030</Num> - while Tier 1 materials stay under-invested. The report&rsquo;s inversion: <Num>35% Tier 1, 40% Tier 2, 18% Tier 3, 7% cross-cutting</Num>.</>,
    src: 'Investment thesis - Ch 12',
  },
];

const faqs = [
  {
    q: 'Why is India&rsquo;s solar story framed as a problem?',
    a: "India has built one of the world's largest solar-deployment machines - 162.15 GW installed by 30 June 2026 (MNRE) - but deployment has outrun manufacturing depth. Module capacity (~172 GW ALMM-listed) is strong while cells, wafers, polysilicon, specialty chemicals, gases and equipment remain 85-100% imported. Capability inverts value: India is strongest downstream, where value is lowest.",
  },
  {
    q: 'What exactly does India still import?',
    a: 'Polysilicon (no domestic capacity), ingots and wafers (~95% of wafer capacity is Chinese), plus specialty chemicals, industrial gases, solar glass and manufacturing equipment. IEA 2026 places China at about 85% of solar supply-chain production capacity; the wafer layer is ~96% concentrated. Mid-stream materials - glass, gases, chemicals - are the exception at 50-65% Chinese share.',
  },
  {
    q: 'What should India localise first?',
    a: 'Tier 1 mid-stream materials: solar glass (16-22% IRR at ₹600 cr/GW), industrial gases (18-26% at ₹450 cr), specialty chemicals (14-20% at ₹350 cr) and encapsulants (22-30% at ₹200 cr). These clear the private-equity hurdle today. Polysilicon - the conventional priority - is the least attractive first move: ₹8,500 cr/GW, 5-7 years, 4-9% IRR.',
  },
  {
    q: 'How much capital, and where?',
    a: 'The report recommends inverting current allocation: 35% of solar-manufacturing capex to Tier 1 materials, 40% to Tier 2 cells/wafers/ingots (PLI-supported, where sovereignty is won), 18% to Tier 3 polysilicon/equipment/tandem R&D (sovereign-backed), and 7% to cross-cutting research, test infrastructure and standards.',
  },
  {
    q: 'Is the 5-7 year window real?',
    a: 'Yes - and it narrows after 2030 from three directions: the perovskite-silicon tandem transition resets equipment and materials requirements, Western tariff regimes compress Chinese export volumes and accelerate consolidation, and Chinese costs rise. Localisation is robust across all three scenarios - Status Quo (60%), Geopolitical Disruption (25%) and Technology Inflection (15%).',
  },
  {
    q: 'What should startups build?',
    a: 'Factory intelligence, inspection and metrology equipment, and module recycling. These are software-and-engineering-intensive niches with moderate capital needs (₹100-400 cr), where the moat is IP rather than scale, and where Indian engineering talent is globally competitive. Avoid commodity layers like modules where Chinese cluster economics dominate.',
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
        headline: 'Beyond Solar Panels: India\'s Hidden Industrial Foundations, 2026-2035',
        author: { '@type': 'Organization', name: 'Techadyant Labs' },
        publisher: { '@type': 'Organization', name: 'Techadyant Labs' },
        datePublished: '2026-08-02',
        dateModified: '2026-08-02',
        description:
          'Strategic industrial intelligence on India solar manufacturing: 162.15 GW deployed vs shallow upstream depth; three investment tiers from 16-30% IRR materials to sovereign-backed polysilicon.',
        url: 'https://labs.techadyant.com' + SUMMARY_URL,
      },
      {
        '@type': 'Product',
        name: 'Beyond Solar Panels (Full Report)',
        description:
          '144-page strategic intelligence report with the companion Excel workbook and full appendices (Report + Data tier).',
        offers: {
          '@type': 'Offer',
          price: '6999',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: 'https://labs.techadyant.com' + REPORT_URL,
        },
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
          { '@type': 'ListItem', position: 3, name: 'Beyond Solar Panels', item: 'https://labs.techadyant.com' + REPORT_URL },
          { '@type': 'ListItem', position: 4, name: 'Executive Summary', item: 'https://labs.techadyant.com' + SUMMARY_URL },
        ],
      },
    ],
  };
}

const tiers = [
  ['Tier 1 - Act Now', 'Private capital', 'Solar glass, industrial gases, specialty chemicals, encapsulants, aluminium frames, junction boxes, tracking systems, factory software, utility-scale inverters', '₹200-600 cr/GW', '16-30%'],
  ['Tier 2 - Co-Invest', 'PLI-supported', 'Cells (TOPCon, HJT), wafers, ingots, test and metrology equipment', '₹1,500-1,800 cr/GW', '6-14%'],
  ['Tier 3 - Sovereign patience', 'Strategic capital', 'Polysilicon, manufacturing equipment, tandem perovskite R&D', '₹3,000-8,500 cr/GW', '3-9%'],
];

const materials = [
  ['Polysilicon', '₹8,500 cr', '5-7 years', '4-9%'],
  ['Solar glass', '₹600 cr', '18-24 months', '16-22%'],
  ['Industrial gases', '₹450 cr', '-', '18-26%'],
  ['Specialty chemicals', '₹350 cr', '-', '14-20%'],
  ['Encapsulants', '₹200 cr', '-', '22-30%'],
];

const watch = [
  { date: '2026-28', text: <><strong>Phase 1 - Tier 1 materials</strong> scale-up (glass, gases, chemicals, encapsulants); <strong>PLI Tranche 3</strong> announced, targeting equipment, specialty chemicals and tandem perovskite R&D.</> },
  { date: '2027-28', text: <>Module <strong>oversupply consolidation</strong>: 25+ credible Indian module makers fall to 10-12 by 2030; avoid pure-PERC capacity additions post-2027.</> },
  { date: '2028-31', text: <><strong>Phase 2 - cells, wafers, ingots</strong> (TOPCon volume mainstream, HJT premium tier); ALMM extended to cells and progressively to wafers and materials.</> },
  { date: '2031-33', text: <><strong>Perovskite-silicon tandem</strong> crosses 30% cell efficiency at commercial scale; PERC capex stranded; <strong>Phase 3</strong> polysilicon and equipment.</> },
  { date: '2035', text: <><strong>430+ GW cumulative installed</strong>; domestic share of build-out 80-90%, but value capture 55-65% (base case) - the deployment-value gap is the decade&rsquo;s central economic risk.</> },
];

export function SolarSummary() {
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
            <div className={styles.kicker}>Solar &amp; Clean-Energy Manufacturing · Strategic Opportunity · Edition v2.1</div>
            <h1 className={styles.h1}>Beyond Solar Panels</h1>
            <p className={styles.subtitle}>
              India built the world&rsquo;s largest solar-deployment machine &mdash; 162.15 GW by
              June 2026. Value and vulnerability live upstream of the panel: polysilicon, wafers,
              cells, glass, gases, chemicals and equipment.
            </p>
            <div className={styles.metaRow}>
              <span>Published <b>02 Aug 2026</b></span>
              <span>Domain <b>Solar &amp; Clean-Energy</b></span>
              <span>Reading time <b>~6 min</b></span>
              <span>Last reviewed <b>02 Aug 2026</b></span>
              <span>Author <b>Techadyant Labs · Research</b></span>
            </div>
          </div>
          <figure className={styles.coverCard}>
            <img src={COVER} alt="Beyond Solar Panels report cover" loading="eager" />
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
          India assembles solar modules; it does not yet manufacture them. Deployment has outrun
          industrial depth: <Num>162.15 GW</Num> installed against <Num>~172 GW</Num> of ALMM-listed
          module capacity, while the upstream foundations &mdash; polysilicon, ingots, wafers,
          specialty chemicals, industrial gases, equipment &mdash; remain <Num>85-100% imported</Num>.
          The strategic question is not how many gigawatts India can install; it is{' '}
          <strong>how much industrial value it captures along the way</strong>, and whether it owns
          the industrial base that determines its energy autonomy through 2050.
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
            The report&rsquo;s analytical core is the <strong>localisation-economics model</strong>:
            16 layers of the solar manufacturing stack, each assessed as a greenfield 1
            GW-equivalent facility under baseline assumptions (debt-equity 70:30, cost of debt
            9.5% post-PLI, 15% straight-line depreciation, 25.17% corporate tax). Three
            supporting frameworks sit on top: the <strong>Solar Capability Maturity Model</strong>,
            the <strong>State Readiness Index</strong>, and a three-tier{' '}
            <strong>Investment Tiering Framework</strong> mapping opportunity layers to investor
            categories and horizons. External facts are traced to dated sources; modelled outputs
            are labelled; <strong>projections are scenarios, not forecasts</strong>. The companion
            workbook carries the underlying datasets for every exhibit.
          </p>
        </div>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-pyramid.svg'} alt="India solar capability by layer: modules 172 GW, cells 27 GW, wafers nil, polysilicon nil" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 1 - Capability inverts value: ~172 GW of ALMM module capacity against ~nil wafer
            and polysilicon capability. Upstream foundations are 85-100% imported.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-irr.svg'} alt="Project IRR by layer from 22 to 30 percent for encapsulants down to 4 to 9 percent for polysilicon" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 2 - IRR by layer: encapsulants 22-30% at ₹200 cr/GW, industrial gases 18-26%,
            solar glass 16-22%, specialty chemicals 14-20% - against polysilicon&rsquo;s 4-9% at
            ₹8,500 cr/GW.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-china.svg'} alt="China share of solar capacity: wafer 96 percent, PV wafer 95 percent, supply chain 85 percent, mid-stream 50 to 65 percent" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 3 - China&rsquo;s grip: ~96% wafer-layer concentration, ~95% of PV wafer
            capacity, ~85% of supply-chain capacity - but only 50-65% in mid-stream materials.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-capital.svg'} alt="Capital allocation: Tier 1 35 percent, Tier 2 40 percent, Tier 3 18 percent, cross-cutting 7 percent" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 4 - Recommended capital allocation: Tier 1 materials 35%, Tier 2 cells-wafers
            40%, Tier 3 polysilicon-equipment 18%, cross-cutting 7%.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-scenarios.svg'} alt="Three scenarios: Status Quo 60 percent, Geopolitical Disruption 25 percent, Technology Inflection 15 percent" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 5 - Three scenarios, one robust strategy: Status Quo (60%), Geopolitical
            Disruption (25%), Technology Inflection (15%). Upstream localisation wins under all three.
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
          <strong>For policymakers:</strong> expedite PLI Tranche 3 targeting equipment, specialty
          chemicals and tandem perovskite R&amp;D; maintain the 20% BCD + 20% AIDC structure through
          2030; designate co-located clusters in Gujarat, Tamil Nadu and Telangana; build
          domestic test and certification (NISE, NABL, IEC).
        </p>
        <p>
          <strong>For industry:</strong> the sequence is not optional - materials first (2026-28),
          cells and wafers next (2028-31), polysilicon and equipment last (2031-35). Avoid pure-PERC
          module additions post-2027; move to TOPCon now, prepare HJT and back-contact by 2028, and
          tandem pilots by 2029-31.
        </p>
        <p>
          <strong>For investors:</strong> invert the allocation. Tier 1 materials clear private-equity
          hurdles today (16-30% IRR); Tier 2 needs PLI co-investment; Tier 3 needs sovereign patience.
          The most defensible startup niches are factory intelligence, inspection and metrology, and
          module recycling - IP moats, not scale.
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
            <caption className="sr-only">Investment tiers with capital intensity and IRR ranges</caption>
            <thead>
              <tr><th>Tier</th><th>Capital source</th><th>Layers</th><th>Capex / GW</th><th>IRR</th></tr>
            </thead>
            <tbody>
              {tiers.map((r) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
                  <td>{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="sr-only">Layer economics: capex, commissioning time, IRR</caption>
            <thead>
              <tr><th>Layer</th><th>Capex / GW-equivalent</th><th>Commission time</th><th>Project IRR</th></tr>
            </thead>
            <tbody>
              {materials.map((r) => (
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
          Illustrative 2026 Techadyant model for a specified crystalline-silicon configuration; shares
          vary with cell architecture, format and price cycle. Use the workbook sensitivity cases before
          committing capital.
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
          Derived from <em>Beyond Solar Panels</em> Edition v2.1 (2026). External facts are traced
          to dated sources; modelled outputs are labelled; projections are scenarios. Primary sources:
        </p>
        <ol>
          <li>MNRE physical-progress data, 30 June 2026 (162.15 GW); PIB release on 150.26 GW at 31 March 2026 and ~172 GW ALMM module capacity [Verified]</li>
          <li>MNRE PLI scheme: Tranche I ₹4,500 cr / 8,737 MW; Tranche II ₹19,500 cr / 39,600 MW [Verified]</li>
          <li>2025 Budget explanatory memorandum: 20% BCD + 20% AIDC on solar cells and modules from 2 Feb 2025 [Verified]</li>
          <li>IEA Energy Technology Perspectives 2026: ~85% supply-chain and ~95% wafer capacity in China [Verified]</li>
          <li>CEA National Electricity Plan (364.6 GW solar, 2031-32); company filings; NREL cost benchmarks; BNEF Tier-1 survey [Verified]</li>
          <li>Techadyant Labs localisation-economics model and investment-tiering framework [Model]</li>
        </ol>
        <p style={{ marginTop: 18 }}>
          <Link href="/research/methodology/" style={{ color: 'var(--gold)' }}>
            Read the full methodology and scoring rubrics →
          </Link>
        </p>
      </section>

      <div className={styles.conversionGrid}>
        <div className={styles.buyCard}>
          <h3>Get the Full Report</h3>
          <div className={styles.price}>₹6,999</div>
          <p>
            144-page PDF · 13 chapters · 53 tables · 22 exhibits · companion Excel workbook
            with the full model and source data (Report + Data pack).
          </p>
          <Link href={REPORT_URL} className={styles.btnPrimary}>Buy Report - ₹6,999</Link>
          <Link href={REPORT_URL} className={styles.btnSecondary}>Report + Data pack - ₹9,999</Link>
        </div>
        <div className={styles.emailGate}>
          <h3>Free Condensed Edition</h3>
          <p>22 pages - the thesis, the frameworks and the headline findings, with figures.</p>
          <div style={{ marginTop: 14 }}>
            <ExecutiveSummaryGate slug={SLUG} pdfUrl={PDF_URL} pdfLabel="22-page condensed edition (PDF)" />
          </div>
        </div>
      </div>

      <div className={styles.related}>
        <Link href="/reports/">All reports</Link>
        <Link href="/signals/">Related signals</Link>
        <Link href="/newsletter/">Briefings</Link>
        <Link href="/research/">Research</Link>
        <Link href="/reports/theme/solar-clean-energy/">Solar &amp; Clean-Energy</Link>
      </div>
    </div>
  );
}
