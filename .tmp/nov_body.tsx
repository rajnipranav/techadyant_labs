export function IssueContent() {
  return (
    <div className="report-body" style={{ padding: 0 }}>
      {/* AT A GLANCE */}
      <h2 id="at-a-glance" style={h2}>The issue at a glance</h2>
      <Figure src="/newsletter/november-at-a-glance.png" alt="Sanket November 2026 - The Missing Middle: the Sanket Index holding at 36, the forecast, the five-corridor Board and the Signal of the Month on one page"
        caption="One-page intelligence summary - the Sanket Index at 36 (33 → 34 → 35 → 35 → 36 → 36), the forecast, the Board and the Signal of the Month." />

      {/* FOUR NUMBERS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, margin: '0 0 34px' }}>
        {[
          ['13.15 Mt', 'Monazite resource. Commercial sintered-magnet lines: none'],
          ['40 → 1.4', 'GWh of ACC cell capacity awarded vs. installed'],
          ['₹2,814 cr', 'Cabinet capex scheme for lithium and nickel processing'],
          ['35', 'Videos in the channel’s first four weeks - 12,876 views'],
        ].map(([n, c]) => (
          <div key={n} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: `3px solid ${BRASS}`, borderRadius: 10, padding: '16px 18px' }}>
            <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 26, fontWeight: 700 }}>{n}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13.5, lineHeight: 1.5, marginTop: 6 }}>{c}</div>
          </div>
        ))}
      </div>

      {/* BOTTOM LINE */}
      <Callout label="The Bottom Line" tone={BRASS}>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li><strong>India is strong at both ends and thin in the middle.</strong> The ore and the orders exist; the separation plants, magnet lines and cell factories between them mostly do not.</li>
          <li><strong>November&rsquo;s money went to the middle:</strong> a ₹2,814 crore lithium and nickel processing scheme, a 40% domestic-content rule on ₹14,500 crore of storage support, 22 bids for a 10 GWh grid-cell tranche, and 12 component projects approved under ECMS.</li>
          <li><strong>None of it is output yet.</strong> ACC cell capacity installed is 1.4 GWh against 40 GWh awarded; sintered-magnet output is zero.</li>
          <li>The Board: semiconductors +1, critical minerals +1, both on middle-layer funding. <strong>The Index holds at 36.</strong></li>
          <li><strong>Sanket is on screen.</strong> <a href="https://www.youtube.com/@techadyantlabs" target="_blank" rel="noopener noreferrer">@techadyantlabs</a> published 35 videos in four weeks; every report this month has a film beside it.</li>
        </ul>
      </Callout>

      {/* GRADED */}
      <Kicker>October, Graded</Kicker>
      <h2 id="graded" style={h2}>Four Tells, None Delivered on Time &mdash; Grade: Mixed</h2>
      <div style={{ margin: '0 0 14px' }}>
        <LedgerRow move="C-DAC 10,000-unit compute empanelment (due 29 Oct)" corr="SLIPPED" src="Careerindia, 14 Nov" why="Bid deadline extended to 30 Nov; technical opening moved to 1 Dec. No empanelment yet." />
        <LedgerRow move="Critical-minerals stockpiling policy (due Nov)" corr="OVERDUE" src="Mines Secretary, 9 Oct" why="Promised &ldquo;within a month&rdquo;; not released as of this issue." />
        <LedgerRow move="Nexon Geochem land, site work or scheme award (due Apr 2027)" corr="OPEN" src="Sanket" why="No public progress in November. October&rsquo;s +2 stays on probation." />
        <LedgerRow move="First private booking on an MoD range (Nov)" corr="NO SIGNAL" src="Sanket" why="No booking reported publicly under the revised procedure." />
      </div>
      <p style={{ marginBottom: 30 }}>October&rsquo;s forecast held &mdash; the Index stayed inside the single-digit base case &mdash; but commitments arrived on schedule and operating capacity did not. <strong>Track record: three forecasts graded &mdash; two On Track, one Mixed.</strong></p>

      {/* BOARD */}
      <Kicker>The Executive Board</Kicker>
      <h2 id="board" style={h2}>Five Corridors, Holding at 36</h2>
      <p style={{ marginBottom: 18 }}>India&rsquo;s industrial sovereignty on the Dependency Capture Framework&trade; &mdash; how much of the value India <strong>captures</strong>, not how much it hosts. Two corridors move, both on funding at the middle layer; the composite lands exactly on 36.0.</p>
      <div style={{ margin: '0 0 22px' }}>
        <BoardRow name="Defence &amp; Dual-Use" score={41} tone={BRASS} trend=" HOLD" basis="Eight Next Generation Corvettes (₹53,866.50 cr) and ~₹2.12 lakh cr of AoNs - platforms ordered at home; the Barak upgrade still goes to IAI." />
        <BoardRow name="Enterprise Software" score={40} tone={BRASS} trend=" HOLD" basis="Sovereign-cloud framework still unreleased; NPCI spins out a technology subsidiary." />
        <BoardRow name="Semiconductors" score={40} tone={GREEN} trend=" +1" basis="Semicon 2.0 portal opens; 12 ECMS component projects approved (₹7,503 cr). Funding at the component layer." />
        <BoardRow name="AI Infrastructure" score={33} tone={BRASS} trend=" HOLD" basis="C-DAC's compute empanelment slips to 30 Nov; IndiaAI foundation models released." />
        <BoardRow name="Critical Minerals" score={26} tone={CRIMSON} trend=" +1" basis="₹2,814 cr lithium-nickel processing scheme; lithium-ion black-mass export ban. Policy reaches the middle. October's +2 stays on probation." />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--border)', marginTop: 8, paddingTop: 14 }}>
          <div><div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, letterSpacing: '.12em', color: BRASS }}>THE SANKET INDEX</div><div style={{ color: 'var(--text-muted)', fontSize: 13 }}>(41+40+40+33+26) / 5 = 36.0</div></div>
          <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 30, fontWeight: 700 }}>36<span style={{ fontSize: 13, color: 'var(--text-muted)' }}> /100 · HOLDS</span></div>
        </div>
      </div>
      <Figure src="/newsletter/november-hero-board.png" alt="The five corridors, November 2026: Defence 41, Enterprise Software 40, Semiconductors 40 (+1), AI Infrastructure 33, Critical Minerals 26 (+1); Index 36"
        caption="The five corridors, November 2026 - semiconductors and critical minerals +1 on middle-layer funding; the rest hold." />
      <Figure src="/newsletter/november-index-trend.png" alt="The Sanket Index from June to November: 33, 34, 35, 35, 36, 36"
        caption="The Sanket Index, June → November: 33 → 34 → 35 → 35 → 36 → 36." />
      <Callout label="A Shadow Corridor: Battery Storage · 22/100, provisional" tone={TEAL}>
        <p style={{ margin: 0 }}>Storage is now large enough to score - a 46.69 GW / 148.53 GWh pipeline and a ₹14,500 crore support scheme - but adding it mid-year would break the June-November series. We score it alongside the Board, outside the Index, until the December Yearbook. The reading is low because the cell is the value and the cell is imported: 1.4 GWh of domestic ACC capacity is installed against 40 GWh awarded.</p>
      </Callout>

      {/* SIGNAL OF THE MONTH */}
      <Callout label="Signal of the Month · S-1795 · Score 85" tone={CRIMSON}>
        <h3 style={{ margin: '0 0 12px', fontFamily: 'Georgia, serif', fontSize: 22 }}>Cabinet Funds the Processing Layer</h3>
        <p style={{ marginBottom: 0 }}>On 4 November the Cabinet approved ₹2,814 crore over five years for four plants: two lithium processing plants of at least 30 kt each and two nickel plants of at least 50 kt. Support is a 30% capital subsidy, capped at ₹500 crore per lithium and ₹900 crore per nickel beneficiary, released in milestone tranches. It is the first scheme in the series written for the layer between the mine and the cell. <Link href="/signals/">See the signal feed</Link>.</p>
      </Callout>

      {/* THESIS */}
      <Kicker>This Month&rsquo;s Thesis</Kicker>
      <h2 id="thesis" style={h2}>The Missing Middle</h2>
      <p>Picture India&rsquo;s strategic supply chains as three layers. At the bottom are resources: ore, brine, scrap. At the top are demand and integration: the orders, the tenders, the platforms and the plants that assemble finished systems. In the middle sit the conversion steps - separation, refining, alloying, magnet-making, cell manufacturing, precision components and the test labs that qualify them. November&rsquo;s three reports, written about different industries, describe the same shape. India is credible at both ends. The middle is thin.</p>
      <p><strong>Magnets.</strong> India holds 13.15 million tonnes of monazite (about 7.23 Mt of rare-earth oxide) and mined around 2,900 tonnes of REO in 2025. Demand at the top is real: our base case takes NdFeB magnet demand from about 2,900 tonnes in 2026 to about 12,960 tonnes in 2035. In between, India operates a separation base of roughly 400 tonnes at IREL and no commercial-scale sintered-magnet line, while China holds 91% of refined output and 94% of sintered production.</p>
      <p><strong>Batteries.</strong> The top is crowded: a 46.69 GW / 148.53 GWh pipeline and a CEA requirement of 236.22 GWh of battery storage by 2031-32. The cell is the middle, and the middle is where the value is. The ACC scheme awarded 40 GWh against a 50 GWh target; 1.4 GWh is installed. <strong>Ten technologies.</strong> The free report finds the pattern across ten domains: the gap sits below the finished product, in process tools, materials, components, sensors and metrology. Imports met 59.4% of India&rsquo;s machine-tool consumption in FY26.</p>
      <p>What changed in November is that policy finally aimed at the middle: ₹2,814 crore for lithium and nickel processing; ₹14,500 crore of viability-gap funding for 92 GWh of storage with a 40% domestic-content requirement on battery projects; a ban on exporting lithium-ion black mass; 22 bids for a 10 GWh grid-scale cell tranche; and twelve ECMS component projects worth ₹7,503 crore.</p>
      <p style={{ marginBottom: 30 }}>That is why the Board moves only at the margin. Every one of those decisions funds the middle; none of them is the middle. Our magnet report ranks a NABL-accredited test lab, sub-components and NdPr separation above a sintered line as the first move, because qualification - the 18-to-36-month cycle a buyer runs before trusting a new supplier - is where the middle actually forms. The decade&rsquo;s question is now who will build and qualify the plants between the mine and the market.</p>

      {/* ONE CHART */}
      <Kicker>One Chart</Kicker>
      <h2 id="one-chart" style={h2}>Strong at Both Ends, Thin in Between</h2>
      <Figure src="/newsletter/november-one-chart.png" alt="Batteries: storage pipeline 148.53 GWh, ACC target 50 GWh, awarded 40 GWh, installed 1.4 GWh. Magnets: 2035 NdFeB demand 12,960 t, REPM target 6,000 tpa, 2026 demand 2,900 t, IREL separation 400 t, sintered output zero"
        caption="Log scales. Techadyant Labs - Grid-Scale BESS Supply Chain 2026-2035; Closing the Magnet Gap (Nov 2026)." />
      <Callout label="The Takeaway" tone={BRASS}>
        <p style={{ margin: 0, fontWeight: 600 }}>In both chains the demand bars are long and the middle bar is short. India has awarded 40 GWh of cell capacity and installed 1.4 GWh. It will need nearly 13,000 tonnes of magnets a year by 2035 and separates about 400 tonnes of rare earths today.</p>
      </Callout>

      {/* CONTRARIAN */}
      <Callout label="Contrarian View" tone={CRIMSON}>
        <h3 style={{ margin: '0 0 12px', fontFamily: 'Georgia, serif', fontSize: 22 }}>Maybe the Middle Should Stay Imported</h3>
        <p>Cells and separated oxides are commodities with brutal scale economics; China&rsquo;s cost lead is a decade of capacity, not a policy trick. Forcing 40% domestic content onto storage projects may raise tariffs and slow the very deployment the grid needs. On this reading, India&rsquo;s advantage is integration, and the smart play is diversified imports plus stockpiles.</p>
        <p style={{ marginBottom: 0 }}>We take the argument seriously and still reject it for magnets and cells: a supplier that can switch off an export licence is not a commodity market. If domestic-content rules visibly slow storage commissioning in 2027, the Board will say so.</p>
      </Callout>

      {/* LEDGER */}
      <Kicker>The Ledger</Kicker>
      <h2 id="ledger" style={h2}>What Actually Moved in November</h2>
      <div style={{ margin: '0 0 34px' }}>
        <LedgerRow move="₹2,814 cr lithium and nickel processing scheme" corr="CRIT. MINERALS" src="Union Cabinet / PIB (4 Nov)" why="Four plants (2 × 30 kt lithium, 2 × 50 kt nickel); 30% capex subsidy; FY27-FY31." />
        <LedgerRow move="₹14,500 cr VGF for 92 GWh of storage" corr="STORAGE" src="Union Cabinet / DD News (4 Nov)" why="30 GWh BESS, 60 GWh pumped storage, 2 GWh emerging; 40% domestic content on BESS; ~₹97,600 cr investment." />
        <LedgerRow move="Lithium-ion black mass export banned" corr="CRIT. MINERALS" src="DGFT (10 Nov)" why="Recycling feedstock kept in India." />
        <LedgerRow move="22 bids for a 10 GWh grid-cell tranche" corr="STORAGE" src="MHI / Autocar Pro (11-16 Nov)" why="ACC PLI tranche for stationary storage; bidders include Reliance, Amara Raja, Exide, JSW Neo, Waaree." />
        <LedgerRow move="12 ECMS component projects approved" corr="SEMICONDUCTORS" src="Signals S-1837 (6 Nov)" why="₹7,503 cr across 11 companies; Semicon 2.0 application portal opens." />
        <LedgerRow move="India joins the Pax Silica declaration" corr="SEMICONDUCTORS" src="Signals S-20018 (15 Nov)" why="US-led semiconductor supply-chain framework; five working groups." />
        <LedgerRow move="Eight Next Generation Corvettes contracted" corr="DEFENCE" src="MoD / Signals S-1784 (2 Nov)" why="₹53,866.50 cr with GRSE and Goa Shipyard." />
        <LedgerRow move="DAC accords AoN to ~₹2.12 lakh cr" corr="DEFENCE" src="DAC / Signals S-16826 (26 Oct)" why="Nearly 82% to be sourced from Indian industry." />
        <LedgerRow move="Barak point-defence upgrade" corr="DEFENCE" src="MoD / Signals S-20219" why="₹1,976.40 cr contract with Israel Aerospace Industries." />
        <LedgerRow move="Ninth critical-mineral auction tranche" corr="CRIT. MINERALS" src="Ministry of Mines / Signals S-18810" why="20 blocks; a two-bidder rule after 36 of 100 earlier blocks went unsold." />
        <LedgerRow move="C-DAC compute empanelment extended" corr="AI INFRA" src="Careerindia (14 Nov)" why="Bids now close 30 Nov; technical opening 1 Dec." />
      </div>

      {/* FROM THE LAB */}
      <Kicker>From the Lab This Month</Kicker>
      <h2 id="from-the-lab" style={h2}>Three Published This Month</h2>
      <ul style={{ margin: '0 0 30px', paddingLeft: 20, lineHeight: 1.9 }}>
        <li><Link href="/reports/closing-the-magnet-gap-india-rare-earth-ecosystem-2026-2035/">Closing the Magnet Gap</Link> - India&rsquo;s rare-earth permanent-magnet ecosystem to 2035; the gap is midstream and in qualification, not mining. 73 pp · ₹6,999 / ₹11,999.</li>
        <li><Link href="/reports/india-grid-scale-bess-supply-chain-2026-2035/">India Grid-Scale Battery Storage Supply Chain 2026-2035</Link> - a 148.53 GWh pipeline, 1.4 GWh of domestic cells; 2035 domestic value capture of 20-50% depending on the cell. 68 pp · ₹6,999 / ₹11,999.</li>
        <li><Link href="/reports/10-technologies-india-cannot-afford-to-depend-on/">10 Technologies India Cannot Afford to Depend on Others For</Link> - ten layers tested against the evidence, from chip-making tools and magnets to aero engines, sonar and machine tools. 74 pp · free.</li>
      </ul>

      {/* DEPENDENCY WATCH */}
      <Kicker>Dependency Watch</Kicker>
      <h2 id="dependency-watch" style={h2}>November&rsquo;s Middle, Numbered</h2>
      <div style={{ margin: '0 0 34px' }}>
        <LedgerRow move="94% - China's share of sintered NdFeB magnet production" corr="MAGNETS" src="Magnet Gap (IEA 2026)" why="The layer India has no commercial line in." />
        <LedgerRow move="91% - China's share of rare-earth refining" corr="MAGNETS" src="Magnet Gap (IEA 2026)" why="The midstream constraint behind the magnet." />
        <LedgerRow move="81.3% - permanent-magnet imports from China, by value (FY24-25)" corr="MAGNETS" src="10 Technologies (HS 85051190)" why="Up from 70.9% two years earlier." />
        <LedgerRow move="59.4% - machine-tool imports as share of consumption (FY26)" corr="CAPITAL GOODS" src="10 Technologies" why="The tools that make the tools." />
        <LedgerRow move="2.8% - ACC cell capacity commissioned vs. 50 GWh target" corr="STORAGE" src="10 Technologies / MHI" why="1.4 GWh installed." />
      </div>

      {/* ON SCREEN */}
      <Kicker>On Screen - New This Issue</Kicker>
      <h2 id="on-screen" style={h2}>Sanket Goes Live on YouTube</h2>
      <p>On 27 October Techadyant Labs launched <a href="https://www.youtube.com/@techadyantlabs" target="_blank" rel="noopener noreferrer">@techadyantlabs</a> - the research, in pictures, every week. In four weeks it published <strong>35 videos</strong> (14 long-form explainers, 21 Shorts; 179 minutes of long-form) and reached <strong>12,876 views</strong> (snapshot, 24 Nov 2026).</p>
      <Figure src="/newsletter/november-on-screen.png" alt="Views per upload from 27 October to 22 November: Shorts in teal, long-form in brass; top Short 1,877 views; 10 Technologies long video 1,109 views"
        caption="Views per upload, in order of publication (snapshot 24 Nov 2026). Shorts carry discovery; long-form carries the argument." />
      <h3 style={{ margin: '8px 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>Every report, a film</h3>
      <div style={{ position: 'relative', paddingTop: '56.25%', margin: '0 0 10px', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
        <iframe src="https://www.youtube-nocookie.com/embed/TYWId8h_zI0" title="India's Tech Blind Spots: 10 Technologies We Are Still Importing" loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
      </div>
      <p style={cap}>Featured film - India&rsquo;s Tech Blind Spots: 10 Technologies We Are Still Importing (16 min), the companion to this month&rsquo;s free report.</p>
      <ul style={{ margin: '0 0 24px', paddingLeft: 20, lineHeight: 1.9 }}>
        <li><a href="https://youtu.be/TYWId8h_zI0" target="_blank" rel="noopener noreferrer">India&rsquo;s Tech Blind Spots: 10 Technologies We Are Still Importing</a> - 16:06 · companion to <em>10 Technologies</em>.</li>
        <li><a href="https://youtu.be/WC2-EEncBfk" target="_blank" rel="noopener noreferrer">Why India Has Zero Rare Earth Magnets (And Can It Fix This by 2035?)</a> - 16:35 · companion to <em>Closing the Magnet Gap</em>.</li>
        <li><a href="https://youtu.be/lCTpsbZv3u8" target="_blank" rel="noopener noreferrer">The Real Battery Challenge: Can India Actually Break China&rsquo;s Monopoly?</a> - 11:19 · companion to <em>Grid-Scale BESS</em>.</li>
      </ul>
      <Callout label="What Four Weeks Taught Us" tone={TEAL}>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li><strong>Shorts find the audience.</strong> 21 Shorts drew 9,578 views - 74% of the total. The top Short, &ldquo;India Opened 4 Chip Plants. Not One Makes a Wafer&rdquo;, reached 1,877 in 47 seconds.</li>
          <li><strong>A report behind the film helps - but is not enough.</strong> The two best long videos are report companions (1,109 and 433 views); the battery film, also a companion, had 26 after ten days.</li>
          <li><strong>A sharp claim beats a topic.</strong> Every top-five Short states a fact that sounds wrong until you check it.</li>
          <li><strong>Engagement is early.</strong> 33 subscribers. We will report the channel on the same terms as the Board: monthly, sourced, and without rounding up.</li>
        </ul>
      </Callout>
      <p style={{ marginBottom: 30 }}><a href="https://www.youtube.com/@techadyantlabs?sub_confirmation=1" className="btn-ed btn-ed-primary" target="_blank" rel="noopener noreferrer">Subscribe on YouTube <span className="arr">→</span></a></p>

      {/* CORRIDOR SIGNAL */}
      <Kicker>Corridor Signal - Status</Kicker>
      <p style={{ marginBottom: 30 }}>The twelfth corridor (DSIC) we filed in September and followed in October produced no new documentary evidence in November. DPIIT has not named it in the NICDP list, and no Durgapur node approval or state SPV has followed. Status holds: a signal, not a fact.</p>

      {/* FORECAST */}
      <Kicker>Forecast · Conversion by 2035</Kicker>
      <h2 id="forecast" style={h2}>Three Ways This Plays Out &mdash; Unchanged</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, margin: '6px 0 36px' }}>
        <ForecastCard prob="45%" label="BASE CASE" tone="var(--text)">One or two corridors convert capability into owned output by 2035. Funding the middle is the precondition for this case, not evidence of it.</ForecastCard>
        <ForecastCard prob="30%" label="BULL CASE" tone={GREEN}>The processing, cell and magnet schemes produce qualified plants, and India owns a genuine chokepoint in at least one corridor.</ForecastCard>
        <ForecastCard prob="25%" label="BEAR CASE" tone={CRIMSON}>Schemes multiply, beneficiaries stall, and the middle stays imported while the top keeps growing.</ForecastCard>
      </div>

      {/* WATCHLIST */}
      <Kicker>Next Issue: The Yearbook</Kicker>
      <h2 id="watchlist" style={h2}>The December Watchlist</h2>
      <div style={{ margin: '0 0 34px' }}>
        <LedgerRow move="30 Nov 2026 - C-DAC compute empanelment bids close (extended)" corr="AI INFRA" src="C-DAC RFE" why="Technical opening 1 Dec." />
        <LedgerRow move="Overdue - Critical-minerals stockpiling policy" corr="CRIT. MINERALS" src="Mines Secretary, 9 Oct" why="Promised for November." />
        <LedgerRow move="Dec 2026 - Proterial begins its 1.2 ktpa NdFeB plant, Anakapalle" corr="CRIT. MINERALS" src="AP Govt approval (Jul 2026)" why="₹2,250 cr; trial production April 2029." />
        <LedgerRow move="FY27 - Lithium and nickel processing beneficiaries selected" corr="CRIT. MINERALS" src="Cabinet, 4 Nov" why="Two per mineral, least-cost selection." />
        <LedgerRow move="FY27 - Award of the 10 GWh grid-cell tranche" corr="STORAGE" src="MHI" why="Among 22 bidders." />
        <LedgerRow move="Apr 2027 - Probation review of the Nexon +2" corr="CRIT. MINERALS" src="Sanket" why="Land, site work or a scheme award - or the points come back." />
      </div>

      {/* MAILBAG */}
      <Callout label="The Mailbag" tone={BRASS}>
        <p style={{ marginTop: 0, fontStyle: 'italic' }}>The question we hear most: why is a research house making YouTube videos? Isn&rsquo;t that a distraction from the work?</p>
        <p style={{ marginBottom: 0 }}>Only if the video comes first. Ours does not: every long film starts from a published report or an Atlas surface, and a video goes onto this website only when it matches a research page exactly. The channel reaches people who will never open a 70-page report, and it forces us to state each finding in a sentence that survives being said out loud. <Link href="/shape/">Send yours via Shape</Link>, or in the comments on any video.</p>
      </Callout>

      {/* SOURCES */}
      <Kicker>Sources &amp; Methodology</Kicker>
      <h2 id="sources" style={h2}>Citable, Every Number</h2>
      <p style={{ marginBottom: 8 }}>The Board is an analyst-set reading on the Dependency Capture Framework&trade; (0-100 = value captured, not hosted); the Sanket Index is the rounded mean of the five corridors, persisted in board-history.json. Pre-production moves are held on probation; shadow corridors are scored but excluded.</p>
      <ul style={{ margin: '0 0 24px', paddingLeft: 20, lineHeight: 1.8, color: 'var(--text-muted)', fontSize: 14.5 }}>
        <li>Magnet figures - <em>Techadyant Labs, Closing the Magnet Gap (6 Nov 2026), citing AMD/DAE, USGS MCS 2026, IEA 2026</em>.</li>
        <li>Storage figures - <em>Techadyant Labs, India Grid-Scale BESS Supply Chain (14 Nov 2026), citing MoP, CEA, MHI</em>.</li>
        <li>Magnet import share, machine tools, ACC share - <em>Techadyant Labs, 10 Technologies India Cannot Afford to Depend on Others For (24 Nov 2026)</em>.</li>
        <li>₹2,814 cr processing scheme; ₹14,500 cr VGF and 92 GWh split - <em>Union Cabinet / PIB (4 Nov 2026)</em>.</li>
        <li>22 bids, 10 GWh grid-scale ACC tranche - <em>Ministry of Heavy Industries; Autocar Professional (16 Nov 2026)</em>.</li>
        <li>C-DAC extension - <em>Careerindia (14 Nov 2026), single source</em>. Stockpiling promise - <em>Business Standard (9 Oct 2026)</em>.</li>
        <li>Defence, semiconductor and minerals moves - <em>Techadyant Signals S-1784, S-16826, S-20219, S-1837, S-19213, S-20018, S-18810</em>.</li>
        <li>Channel figures - <em>YouTube Data API v3, @techadyantlabs snapshot, 24 Nov 2026</em>.</li>
      </ul>
      <Callout label="Independence" tone={TEAL}>
        <p style={{ margin: 0 }}>No sponsored coverage; no positions in what we analyse. Corrections to <Link href="/corrections/">labs.techadyant.com/corrections</Link>.</p>
      </Callout>
    </div>
  );
}
