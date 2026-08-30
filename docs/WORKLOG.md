# Techadyant Atlas Entity Dossier — Worklog

This file records all sub-agent work on the Atlas Entity Dossier project.
Each entry uses the standard template at the bottom of this file.

---

## Standard worklog entry template

```
## ENTRY — <ISO date YYYY-MM-DD> | Task ID: <id> | Agent: <type>
- Summary: <one line>
- Systems touched: <list of slugs or "none">
- Files changed: <list or "none">
- Sources consulted: <count> primary, <count> credible, <count> indicative
- Key findings: <3-5 bullet points>
- Open questions / blockers: <list>
- Next actions: <list>
```

---

<!-- Entries appended below by sub-agents -->

## ENTRY — 2026-08-29 | Task ID: 2-a (research) | Agent: general-purpose (web research)
- Summary: Researched 8 Indian Counter-UAS systems for Techadyant Atlas Entity Dossier using live web search + page fetch; returned structured markdown report (no JSON files written).
- Systems touched:
  - integrated-counter-drone-system-cus-001 (BEL IDDIS / D4)
  - zen-anti-drone-system-zads-cus-003 (Zen Technologies ZADS)
  - bhargavastra-counter-drone-system-cus-004 (SDAL — see conflict notes)
  - indrajaal-anti-drone-system-cus-005 (Indrajaal Drone Defence / Grene Robotics)
  - tata-advanced-systems-cuas-cus-056 (TASL)
  - l-t-defence-counter-drone-system-cus-057 (L&T PES)
  - kalyani-group-bharat-cuas-cus-058 (KSSL)
  - bharat-dynamics-limited-bdl-counter-drone-cus-060 (BDL)
- Files changed: /home/z/my-project/worklog.md (this file). No JSON dossiers written. Raw research artifacts cached under /home/z/my-project/research-tmp/ (not part of repo).
- Sources consulted: 8 official (bel-india.in, bdl-india.in, zentechnologies.com, indrajaal.in, grenerobotics.com, tataadvancedsystems.com, lntpes.com, kssl.in), 6 credible (Economic Times x2, The Hindu BusinessLine, Times of India, Wikipedia IDDIS & ZADS pages — credible refs), 5 indicative (IDRW, IADB, Unmanned Airspace, Bharat Shakti, IndianWeb2).
- Key findings:
  - BEL V2 == IDDIS (Integrated Drone Detection & Interdiction System), in service since March 2024, used in Operation Sindoor, May 2025 ₹572 crore contract; variants Mk-I (2 kW laser / 0.8-1 km hard kill), Mk-II (10 kW / 2 km), Mk-IIA "Sahastra Shakti" (30 kW / 5 km), Surya (300 kW planned / 20 km).
  - Zen ZADS: hard-kill = kinetic gun + net-interceptor drone; IAF ordered 2021, ₹700 crore+ MoD contracts late 2025/early 2026; official "V3" versioning not publicly confirmed by Zen.
  - Bhargavastra: Solar Defence and Aerospace Ltd (SDAL), Nagpur — confirmed by Wikipedia, ET, ToI, The Hindu, ANI, Tribune, Deccan Chronicle, Mathrubhumi, Bharat Shakti. NO public source attributes it to Big Bang Boom Solutions. BBBS makes Vajra Sentinel / ADDS — a different product. Atlas attribution is very likely an ERROR. See Bhargavastra conflict notes in the report.
  - Indrajaal: spun off from Grene Robotics in 2023; first deployed 2021 (Red Fort I-Day); 4,000 sq km coverage; deployments include Indian Army, Indonesian army, world's largest refinery, India's 3rd-largest airport; ₹100 cr MoD order (Army + Navy) + ₹155 cr Ranger orders.
  - Tata / L&T / Kalyani / BDL: very thin public primary-source record. Tata CUAS appears to be Rajak ULR 50 EO/IR + SSR radar + May 2026 white paper; L&T CDS only on product page (no deployments found); Kalyani "Bharat CUAS" is likely KSSL's CIWS + M4 vehicle-based 113mm gun concept (IDRW Dec 2025); BDL has NO counter-drone product on its official products page — only future roadmap per IADB Oct 2024.
- Open questions / blockers:
  - Zen "V3" label not confirmed by vendor primary source; Atlas may need to switch to "ZADS (current generation, May 2026 radar update)" or similar.
  - Kalyani "Bharat CUAS" — no product page on kssl.in/air-defence that exactly matches this name. May be a KSSL CIWS+113mm cannon combo marketed as Bharat CUAS, but no primary source.
  - BDL "Counter Drone" — confirmed only as exploration item in CMD interview; no product, no spec.
  - Import dependency data (FPGA, GaN RF, IMU, EO/IR country of origin) is essentially absent from public sources for all 8 systems. Only confirmed import dependency found: Indrajaal EO/IR sensors from Israel; IDDIS laser source from Germany (per Wikipedia).
- Next actions:
  - User to review the full structured markdown report (delivered in the agent's final message).
  - Recommend Atlas correction for Bhargavastra maker (BBBS → SDAL).
  - Recommend Atlas downgrade for BDL, L&T, Tata, Kalyani entries from "system" to "capability/exploration" status where primary sources don't support a deployed product.
  - For deeper import-dependency data, a follow-on research pass on DRDO CHESS / LASTEC supply chain filings and BEL vendor tenders would be needed.


## ENTRY — 2026-08-29 | Task ID: 2-b (research) | Agent: general-purpose (web research)
- Summary: Researched 10 Indian Tier A defence manufacturers (BEL, DRDO, Zen, Adani, TASL, L&T, Kalyani/Bharat Forge, HAL, BDL, BrahMos) for Atlas Entity Dossier; returned structured markdown report with FY26 financials, programmes, import dependencies, JVs and primary-source URLs.
- Systems touched:
  - bharat-electronics-limited-bel-mfg-001
  - defence-research-and-development-organisation-drdo-mfg-002
  - zen-technologies-mfg-003
  - adani-defence-and-aerospace-mfg-005
  - tata-advanced-systems-tasl-mfg-014
  - larsen-toubro-l-t-defence-mfg-015
  - kalyani-strategic-systems-bharat-forge-mfg-016
  - hindustan-aeronautics-limited-hal-mfg-017
  - bharat-dynamics-limited-bdl-mfg-018
  - brahmos-aerospace-mfg-019
- Files changed: /home/z/my-project/worklog.md (this file). No JSON dossiers written. Raw research artifacts cached under /home/z/my-project/research-tmp/t2/ (40+ search/page-fetch JSON files).
- Sources consulted: 22 official (bel-india.in, bdl-india.in, hal-india.co.in, drdo.gov.in, brahmos.com, zentechnologies.com, kssl.in, tataadvancedsystems.com, larsentoubro.com, adani.com, adanienterprises.com, leonardo.com, news.lockheedmartin.com, pib.gov.in, nseindia.com, bseindia.com, finance.yahoo.com company pages); 18 credible (Economic Times x3, The Hindu x2, The Hindu BusinessLine x2, Times of India x2, LiveMint x2, Reuters x2, Janes, Financial Express, Business Standard, Investing.com, Sahi.com x2, Asian Military Review, Naval News); 8 indicative (IDRW, IDB, Defence.in, Ajaishukla, Machinist.in, Mobility Outlook, Strategicfront, LinkedIn/FB summary posts).
- Key findings:
  - BEL FY26: revenue ₹27,479.6 cr (+16.1%), PAT ₹6,048.5 cr (+14.4%), order book ₹73,882 cr as of 1 Apr 2026; FY26 orders booked ₹30,000 cr incl. $346M export; export sales FY26 $141.9M. Navratna PSU, HQ Bengaluru.
  - HAL FY26: revenue ₹33,050 cr (+7%), order book ₹2,54,538 cr (7-8 yrs visibility); Maharatna PSU, HQ Bengaluru. Major dependency: GE F404-IN20 (USA) for Tejas Mk-1A — only 6 of 99 engines delivered so far, HAL has levied damages on GE Aerospace; F414 (USA) locked in for Tejas Mk-2 + AMCA Mk1 despite 3x price hike risk; Shakti (Safran/France) for Dhruv ALH; RD-33 (Russia) for MiG-29UPG.
  - BDL FY26: revenue ~₹2,442 cr (-27% YoY), PAT ₹420 cr (-23%), Q4 PAT ₹113 cr (-59%); order book ₹26,176 cr as of 31 Mar 2026 (10.6x revenue, mostly Akash SAM + BrahMos components + MRSAM + torpedoes). Miniratna PSU, HQ Hyderabad.
  - Zen FY26: revenue ₹687.7 cr (-29.4% YoY), PAT -31% YoY, order book ₹1,336 cr (2x revenue); Q1 FY27 rev ₹141.6 cr (-10%); private listed BSE/NSE; HQ Hyderabad. Atlas slug: zen-anti-drone-system-zads-cus-003.
  - Bharat Forge (KSSL parent) FY26: consolidated revenue ₹16,812 cr (+11.2%); defence revenue ₹1,562 cr; defence order book ₹10,961 cr (3-4 yrs visibility); ₹4,814 cr new orders in FY26; biggest win ₹4,140 cr ATAGS order (Mar 2025, 184 guns, 60% of ₹6,900 cr MoD deal split with TASL).
  - BrahMos Aerospace: JV DRDO (50.5%) + NPOM Russia (49.5%); auth capital $300M; HQ New Delhi; first export $375M Philippines (3 shore batteries, deliveries 2024-25); Indonesia $450M deal (Jul 2026); Vietnam showcasing; BrahMos-II hypersonic reportedly paused (EIT May 2026); BrahMos-NG in dev (range extended 290→450 km).
  - DRDO: HQ Rajaji Marg, New Delhi-110011; ~50-52 labs across India; Adani-DRDO Vehicle-Mounted CUAS launched at Aero India 2025 (4x4 platform, 10km range, 7.62mm gun + high-energy laser + radar + SIGINT + EO/IR + jammers); DRDO CHESS 30kW Laser DEW ToT to Indian vendors (3 licences); D4 counter-drone developed by LRDE (Bangalore) + DLRL/CHESS (Hyderabad) + IRDE (Dehradun).
  - TASL: HQ Hyderabad (Maheshwaram Mandal) + registered office Barakhamba Road, New Delhi; wholly owned Tata Sons subsidiary, founded 2007; not listed. Key programmes: WhAP 8x8 (first export batch to Morocco, Dec 2025), Akash Army/Air Force Launchers (joint with DRDO), AAD MLS, C-295 aerostructures (Airbus), F-21 partnership (Lockheed Martin), C-130J MRO facility (groundbreaking Dec 2025, ops early 2027), MRSAM Army launchers, Pinaka overhaul with Army EME.
  - L&T Defence: parent L&T HQ Mumbai (L&T House, Ballard Estate); K9 Vajra-T repeat order Dec 2024 ₹7,629 cr for 100 units (PIB), manufactured at Hazira Armoured Systems Complex, Gujarat; co-developed with Hanwha Aerospace (South Korea); ~82% indigenous content at work-package level; L&T also building Arihant-class SSBN hulls (S3/S4 at SBC Visakhapatnam); targeting indigenous diesel-electric submarine design under P-76 by 2027.
  - Adani Defence & Aerospace: flagship defence arm of Adani Enterprises Ltd; HQ Ahmedabad (Adani Corporate House, Shantigram); Kanpur ammunition complex 500 acres (target 300M small-cal rounds + millions of grenades); 11 Feb 2025 launched Vehicle-Mounted CUAS with DRDO at Aero India 2025 (10km range, 7.62mm gun + laser + EO/IR + radar + SIGINT + jammers); 3 Feb 2026 signed MoU with Leonardo (Italy) for AW169M + AW109 Trekker helicopter manufacturing ecosystem in India; SR-1 loitering munition (Janes Nov 2025); ULM-ER ULPGM V3.
  - Counter-UAS Atlas cross-reference (from Task 2-a): BEL → cus-001 (IDDIS); Zen → cus-003 (ZADS); TASL → cus-056; L&T → cus-057; Kalyani → cus-058; BDL → cus-060. Adani-DRDO Vehicle-Mounted CUAS and DRDO D4/CHESS 30kW Laser DEW are NOT yet mapped to Atlas slugs.
- Open questions / blockers:
  - Adani "Bhargavastra" attribution remains ambiguous — Wikipedia lists it as "Indian private sector company" but Task 2-a strongly concluded maker is SDAL (Nagpur), not Adani. Recommend NOT attributing Bhargavastra to Adani in Atlas.
  - HAL import dependency figures (F404 delivery delays) are well documented; HAL has imposed damages on GE Aerospace for missing engine delivery deadlines. No public number for damages amount.
  - L&T Defence order book: A LinkedIn post cites ₹20,000+ cr defence order book (unverified); L&T does not separately disclose defence revenue in its consolidated financials. Confirmed K9 Vajra-T orders alone total ~₹12,000+ cr (₹4,500 cr 2017 + ₹7,629 cr 2024).
  - DRDO is not a commercial entity; no revenue/profit. Only "programme value" disclosure via PIB when MoD contracts a production agency (BEL/BDL/BrahMos etc.). DRDO ATLAS financials will need to remain qualitative.
  - Zen "V3" label not confirmed by vendor primary source (carry-over from Task 2-a open question).
  - FPGA / GaN RF / EO/IR / IMU country-of-origin: still essentially absent from public primary sources for Indian OEMs. Inferences are based on global supply-chain norms (USA for FPGA/GaN, Israel/Germany for EO/IR, France/USA for IMU). Recommend flagging as "indicative — supply chain inference" in Atlas.
  - BrahMos Aerospace revenue/profit: not disclosed (private JV, no public annual report URL found). Only order values via PIB.
- Next actions:
  - User to review the full structured markdown report (delivered in the agent's final message).
  - Recommend Atlas assign new slugs for: Adani-DRDO Vehicle-Mounted CUAS (cus-061?), DRDO D4 / CHESS 30kW Laser DEW (cus-062?), BrahMos-NG (aerospace platform slug), HAL AMCA (aerospace platform slug), L&T indigenous P-76 submarine (naval platform slug).
  - Recommend Atlas financial-fields for DRDO be set to "n/a — R&D wing of MoD, not a commercial entity" rather than zero.
  - For deeper import-dependency data on BEL/DRDO supply chain (FPGA/GaN/IMU/EO-IR), a follow-on research pass on DPEP (Defence Public Sector Undertakings Empowered Committee) negative-indigenisation lists and BEL vendor tenders would be needed.


## ENTRY — 2026-08-29 | Task ID: 2-c (research) | Agent: general-purpose (web research)
- Summary: Researched 12 Indian defence platforms/programmes (Zorawar LT, Pinaka MBRL, Tejas Mk1A, Akash-NG, QRSAM/Anant Shastra, MRSAM/Barak-8, P15B Visakhapatnam-class, P17A Nilgiri-class, P-75I submarine, S-400, Rafale, C295 India-build) for Atlas Entity Dossier; returned structured markdown report (no JSON dossiers written).
- Systems touched:
  - zorawar-light-tank-def-001
  - pinaka-mbrl-def-002
  - tejas-mk1a-def-003
  - akash-ng-def-004
  - qrsam-def-005 (renamed Anant Shastra)
  - mrsam-def-006 (Barak-8 / LR-SAM / MR-SAM)
  - p15b-destroyer-def-007 (Visakhapatnam-class)
  - p17a-frigate-def-008 (Nilgiri-class)
  - p75i-submarine-def-009 (Type 214 derivative)
  - s-400-india-def-010
  - rafale-india-def-011 (IAF + Rafale Marine)
  - c295-india-def-012 (Tata-Airbus Vadodara FAL)
- Files changed: /home/z/my-project/worklog.md (this file). No JSON dossiers written. Raw research artifacts cached under /home/z/my-project/research-tmp/t2c/ (~30+ search/page-fetch JSON files including Wikipedia, Airbus, PIB, BEL, Dassault, ET, ToI, Janes, Naval News).
- Sources consulted: 4 official (bel-india.in QRSAM product page, airbus.com C295 FAL inauguration press release, dassault-aviation.com Rafale Marine press kit, pib.gov.in C295 release PRID 2068818), 7 Wikipedia deep articles used as cross-check anchors with primary citations (Zorawar, Pinaka, HAL Tejas, Akash-NG, Anant Shastra, Barak-8, Visakhapatnam-class, Nilgiri-class (2019), Project-75 (India), S-400 missile system, Dassault Rafale, Airbus C295), 14 credible (Economic Times x3, The Hindu x2, Times of India x2, Hindustan Times, NDTV, Livefist/Naval News x3, Janes x2, Reuters/Flightglobal, Army Recognition, IDSA), 8 indicative (IDRW, Defence.in, Overt Defense, Defence Standard, RNAMedia, India Sentinels, Sputnik India News, Aerospace Global News).
- Key findings:
  - Zorawar LT: 25-tonne light tank developed by DRDO (CVRDE) with L&T as development-cum-production partner; induction 2028–29 confirmed by Army chief Gen Upendra Dwivedi on 4 June 2026 (revised from 2027); 59 tanks on initial order (1 regiment), 295 more planned under Make-I; total programme ~354 tanks est. ₹17,500 cr ($1.8B); per-unit ~₹70 cr; key imports: Cummins VTA903E-T760 engine (USA — replaced MTU 199MTU 8V199 due to German export controls), John Cockerill 3105 turret w/ 105mm HP gun (Belgium), Safran Paseo EO/IR (France), RENK America HMPT-800 transmission (USA/Germany).
  - Pinaka MBRL: 7 regiments operational as of Mar 2026 (target 10 by mid-2026, 22 long-term); LRGR-120 (Mk-III) maiden flight 29 Nov 2025, second successful trial 8 Jul 2026 at user-defined minimum range 60 km; ₹2,500 cr LRGR-120 project cleared by DAC 29 Dec 2025; ₹10,147 cr ammunition order signed 6 Feb 2025 (EEL ₹4,500 cr ADM + MIL ₹5,647 cr HEPF Mk-1(E)); TASL and L&T are launcher OEMs, BEML supplies vehicles; key import: Tatra truck chassis (Czech), some seekers/components via Israel.
  - Tejas Mk1A: HAL prime contractor; Mk1A Mk-I indigenous content 50% rising to 60% (2021 contract) / 64%+ (2025 second contract); 83 a/c contract Feb 2021 (₹48,000 cr) + 97 a/c contract Sep 2025 (₹62,370 cr) = 180 Mk1A total on order; F404-IN20 engines from GE Aerospace (USA) — critical-path bottleneck: only 6 of 99 engines delivered as of Apr 2026, HAL levying liquidated damages; 113 more F404 engines contracted Nov 2025 (₹8,870 cr / $921M) for second batch; first two Mk1A deliveries slipped from Feb 2024 to ~May 2026 (pending ASQR cert); Uttam AESA radar indigenous (Astra Microwave ₹2,205 cr order Jul 2026).
  - Akash-NG: DRDO developed, BEL + BDL production partners; range 30 km proven, 50 km with new rocket motor (Jan 2026); final user evaluation trials completed 23 Dec 2025; cleared for induction; Ku-band active radar seeker (indigenous, BDL-supplied from Aug 2023); AESA Multi-Function Radar (fire control 80 km / surveillance 120 km); no specific Akash-NG production contract value disclosed yet (separate from older Akash ₹499 cr BDL contract of Jul 2021).
  - QRSAM (Anant Shastra): Renamed "Anant Shastra" — DRDO + BEL + BDL; range 30 km, ceiling 6-14 km; 90% indigenous content (projected 99%); ₹30,000 cr ($3.1B / $3.4B) tender issued by Indian Army to BEL on 27 Sep 2025 (AoN cleared 3 Jul 2025); BEL Chitrakoot UP facility investment ₹562 cr (8 Apr 2026) for QRSAM production; uses RF seeker from RCI (DRDO), BEL BSR/BMFR radars; launcher by L&T on Ashok Leyland 8x8; AIP-style solid-propellant missile.
  - MRSAM/Barak-8: Joint DRDO-IAI (Israel); BDL lead integrator in India, components from KRAS (Kalyani-Rafael JV), TASL CMS, BEL launchers; ₹17,000 cr ($2.5B) Army deal (5 regiments, 2017); ₹10,000 cr ($2.6B) IAF deal (9 squadrons, 2009); ₹9,200 cr Navy LRSAM contract for 7 Nilgiri-class frigates (Sep 2018); latest ₹2,960 cr ($310M) BDL contract Jan 2025 for 70+ Navy missiles; DAC cleared ₹30,000 cr for 700+ missiles Dec 2025; range 70-100 km (LR-SAM), 150 km Barak-8ER in development; major import: IAI EL/M-2248 MF-STAR radar, IAI/Rafael missiles subsystems.
  - P15B Visakhapatnam-class: 4 destroyers built by MDL, all commissioned (Visakhapatnam 21 Nov 2021, Mormugao 18 Dec 2022, Imphal 26 Dec 2023, Surat 15 Jan 2025); ₹29,643 cr original contract (Jan 2011); displacement 7,400 t; speed 30+ kn; range 9,000 nmi @ 18 kn; armament: 32 Barak-8 LRSAM + 16 BrahMos; primary radar IAI EL/M-2248 MF-STAR (450 km); 72% indigenous content; major imports: Zorya M36E gas turbines (Ukraine), Bergen/GRSE diesel engines (Norway), Wärtsilä generators (Finland), Cummins KTA50G3 (USA), EL/M-2248 MF-STAR radar (Israel).
  - P17A Nilgiri-class: 7 frigates split between MDL (4: Nilgiri, Udaygiri, Taragiri, Mahendragiri) and GRSE (3: Himgiri, Dunagiri, Vindhyagiri); ₹45,381 cr total deal (Feb 2015); displacement 6,670 t; speed 32 kn; range 5,500 nmi @ 16-18 kn; armament: 32 Barak-8 + 8 BrahMos + OTO Melara 76mm; primary radar EL/M-2248 MF-STAR; first-of-class INS Nilgiri commissioned 15 Jan 2025; all 7 launched, all to be commissioned by 2026 (Taragiri 3 Apr 2026, Mahendragiri 11 Jul 2026, Himgiri 26 Aug 2025, Udaygiri 26 Aug 2025, Dunagiri 21 Jun 2026); 75% indigenous content; major imports: GE LM2500 gas turbines (USA, HAL license-assembly), MAN 12V28/33D STC diesels (Germany, assembled in Aurangabad), Rolls-Royce MTU 12V 396 TE54 gensets (UK/Germany), Fincantieri modular construction consulting (Italy), Indra Lanza radar (Spain).
  - P-75I Submarine: 6 AIP diesel-electric SSKs; est. ₹99,000 cr (~$10B); MDL sole qualified bidder with TKMS (Germany) Type 214 derivative after L&T-Navantia (Spain S-80+) rejected Jan 2025 (AIP not sea-proven); IGA signed during German Chancellor Merz visit 12-13 Jan 2026; CCS clearance awaited (expected Sep 2026 per Jun 2026 reports); first delivery within 7 years of contract; 3,000 tonne displacement, 18 heavyweight torpedoes + 12 cruise missiles; first sub 60% indigenous content vs IN 45% baseline; TKMS partnership with VEM Technologies (Hyderabad) for torpedoes; major imports: TKMS Type 214 design + AIP + combat system (Germany).
  - S-400 Triumf India: 5 squadrons for $5.43B (₹40,000 cr) signed 5 Oct 2018; deliveries: SQN-1 Dec 2021 (Pathankot/Adampur), SQN-2 Jul 2022, SQN-3 Feb 2023, SQN-4 May 2026, SQN-5 expected Nov 2026; named "Sudarshan Chakra" in IAF service; combat-used in May 2025 Op Sindoor (claimed AWACS kill 314 km inside Pakistan); 5 additional squadrons cleared by DPB 3 Mar 2026, DAC 27 Mar 2026, est. ₹63,000 cr ($6.1B); 288 missile replenishment (120 SR + 168 LR) AoN 12 Feb 2026; OEM Almaz-Antey (Russia), range 40N6E 380-400 km / 48N6E3 240 km / 9M96E2 120 km; CAATSA sanctions never imposed on India (Trump-era waiver expected); MRO facility in India planned.
  - Rafale India: 36 IAF Rafale F3-R for €7.8B signed 23 Sep 2016, all delivered by Apr 2022; deployed at Ambala AFS (No. 17 Sqn "Golden Arrows") and Hasimara AFS (No. 101 Sqn "Falcons"); used in Op Sindoor May 2025 (loss of at least one Rafale confirmed by French officials per Reuters, BBC Verify, Washington Post); 26 Rafale Marine for Indian Navy signed 28 Apr 2025 for ₹63,000 cr (~$7.5B, replacing MiG-29K on INS Vikrant); 22 single-seat + 4 twin-seat; first Rafale-M delivery 2028; 114 more Rafales under MRFA cleared by DPB 16 Jan 2026 ₹3.25 lakh cr (€30B), DAC AoN 12 Feb 2026 (18 fly-away + 96 India-built, 25% indigenous); Dassault-TASL fuselage manufacturing partnership announced 5 Jun 2025 (Hyderabad, 2/month, first rollout FY2028); earlier DRAL Nagpur facility makes 5 components; major imports: airframe/engine/avionics all France (Dassault, Safran M88, Thales RBE2 AA AESA, SPECTRA EW); weapons MBDA Meteor/SCALP (France/UK/EU), AASM Hammer (Safran).
  - C295 India-build: Prime contractor Tata Advanced Systems Limited (TASL) with Airbus Defence & Space (Spain); ₹21,935 cr (~$3B / $2.5B depending on source) contract signed 24 Sep 2021 for 56 aircraft (16 fly-away Spain + 40 India-built); Vadodara FAL inaugurated 28 Oct 2024 by PM Modi + Spanish PM Sanchez; first 6 Spain-built delivered to IAF by Aug 2025 (last one 2 Aug 2025); first India-built C295 maiden flight 10 Jun 2026; first India C295 rollout Sep 2026 (ahead of schedule); FAL delivery to complete by Aug 2031; 85% structural & final assembly in India, 13,000 detail parts, 37 India suppliers, 21 special processes certified; local content 48% first 16, 75% last 24; BDL/BEL EW suite; Pratt & Whitney Canada PW127G turboprop engines (not localised), avionics from Thales/Honeywell/Collins (not localised); additional 15 C295 MPA variants for Navy (9) + Coast Guard (6) cleared by DAC Feb 2024 worth ₹29,000 cr; 50 more planned as An-32 replacement.
- Open questions / blockers:
  - Akash-NG production contract value not yet publicly disclosed (only the older Akash ₹499 cr BDL contract Jul 2021 is on record). Atlas may need to flag Akash-NG as "Ordered (post-trials, value not disclosed)".
  - S-400 5 additional squadrons deal value ₹63,000 cr is "expected cost" per Wikipedia — not yet contracted. Likely signed after Sep 2026 once CCS clears; Trump-era CAATSA waiver assumed but not formally documented as granted.
  - P-75I contract not yet signed as of Aug 2026 (Wikipedia says "expected by Sep 2026"). Final value estimates vary ₹99,000-₹1,20,000 cr depending on source. Atlas should flag as "Negotiation/CCS pending" not "Ordered".
  - QRSAM ₹30,000 cr tender issued 27 Sep 2025 by Army to BEL — but tender ≠ contract. BEL optimistic on signing by end-FY26 per IDRW Jul 2026. Atlas should flag as "Tender issued" not "Ordered".
  - 114 Rafale MRFA deal cleared by DPB + DAC AoN but RfP not yet issued as of Apr 2026 (expected May 2026). Fly-away deliveries not before 2032.
  - Rafale Marine 26-deal: contract signed 28 Apr 2025 but actual first delivery only in 2028. India is also reportedly negotiating 31 additional Rafale Marines per La Tribune Feb 2026.
  - C295 maritime patrol variants (9 Navy + 6 Coast Guard) cleared DAC Feb 2024 but not yet contracted; TASL targeting 78% indigenous content for the 12 India-built MPA variants.
  - For import-dependency data on seekers/IMU/GaN/FPGA at sub-component level: still mostly absent from public primary sources. Inferences drawn from global supply chain norms (USA for FPGA/GaN, Israel/Germany for EO/IR, France/USA for IMU).
  - The Zorawar second-batch production (295 tanks beyond initial 59) is open to competitive bidding per Wikipedia — Bharat Forge and AVNL also developing 25-tonne LT competitors under the "Futuristic Light Tank programme". Atlas may want a separate slug for AVNL's Bharat tank.
- Next actions:
  - User to review the full structured markdown report (delivered in the agent's final message).
  - Recommend Atlas flag QRSAM as "Tender issued" (not Ordered) until BEL contract signing is confirmed; rename entry from "QRSAM" to "Anant Shastra (QRSAM)".
  - Recommend Atlas flag P-75I as "Negotiation / CCS pending" (not Ordered) and update cost band to "₹99,000–₹1,20,000 cr (~$10B)"; flag OEM as "MDL-TKMS JV (Type 214 derivative)".
  - Recommend Atlas capture both Rafale variants: (a) IAF Rafale F3-R (36 delivered, in service); (b) Rafale Marine for IN (contract signed Apr 2025, delivery from 2028); and (c) 114 MRFA deal (AoN cleared, RfP pending). May warrant separate slugs.
  - Recommend Atlas split C295 programme into: (a) 56-aircraft IAF tactical transport (Spain fly-away done, India FAL Sep 2026); (b) 15-aircraft MPA variant for IN/ICG (DAC-cleared, not contracted).
  - Recommend Atlas add S-400 status as "4 of 5 squadrons delivered (May 2026), 5th by Nov 2026; 5 additional sqns approved DAC Mar 2026 (₹63,000 cr)".
  - For deeper sub-component import-dependency data (seekers/IMU/GaN), follow-on research on DRDO ARDE/RCI/IRDE supply chain and BEL/BDL vendor filings would be needed.
