-- =====================================================================
-- Techadyant Labs — India Integrated Logistics Atlas: SEED (v1)
-- Run AFTER logistics-schema.sql. Idempotent (upserts).
-- Every figure below is traceable to a sources row; capture_status states
-- honestly how firmly each source is pinned. Figures without a captured
-- primary are NULL, and the row is labelled needs_human_source.
-- Retrieved/captured on 2026-10-08.
-- =====================================================================

-- ---------------------------------------------------------------- sources --
insert into logistics.sources (id, publisher, title, published_on, url, url_host, kind, is_primary, capture_status, capture_note) values
('pm-india-itla-20261006', 'Prime Minister of India (pmindia.gov.in)',
 'Cabinet approves setting up of Integrated Transport & Logistics Authority', '2026-10-06',
 'https://www.pmindia.gov.in/en/news_updates/cabinet-approves-setting-up-of-integrated-transport-logistics-authority/',
 'www.pmindia.gov.in', 'pm_india', true, 'captured',
 'Full release text captured via reader on 2026-10-08: SPV; National Transport Master Plan (10+ yr horizon); technical appraisal of GoI projects >= Rs 500 crore; monitoring/impact assessment above Rs 500 crore; NTDR integrating GSTN e-way bill, FASTag, Vahan, GPS-based systems, urban traffic management systems; Freight Flow/O-D analytics; review and updation of National Logistics Policy (2022).'),
('pib-itla-20261006', 'PIB',
 'Cabinet approves setting up of Integrated Transport & Logistics Authority', '2026-10-06',
 null, 'www.pib.gov.in', 'pib', true, 'title_date_confirmed',
 'Release title and 6 Oct 2026 date confirmed via search index. Exact PRID URL could not be resolved from the build sandbox — pin it (pib.gov.in release of 6 Oct 2026) to upgrade ITLA to verified (PM India + PIB = two primaries on file).'),
('pm-india-sgf-20261006', 'Prime Minister of India (pmindia.gov.in)',
 'Cabinet approves Commitment of Rs.10,000 Crore towards establishment of the SME Growth Fund for direct equity investments in Small and Medium Enterprises to create future champions', '2026-10-06',
 'https://www.pmindia.gov.in/en/news_updates/cabinet-approves-commitment-of-rs-10000-crore-towards-establishment-of-the-sme-growth-fund-for-direct-equity-investments-in-small-and-medium-enterprises-to-create-future-champions/',
 'www.pmindia.gov.in', 'pm_india', true, 'captured',
 'Full release text captured via reader on 2026-10-08: Rs 10,000 crore Government commitment; growth-oriented equity for SMEs; per Para 28 of Union Budget 2026-27; structural-gap rationale (existing funds focus on early-stage/micro).'),
('pib-sgf-20261006', 'PIB',
 'Small and Medium Enterprises Growth Fund', '2026-10-06',
 null, 'www.pib.gov.in', 'pib', true, 'title_date_confirmed',
 'Release title and 6 Oct 2026 date confirmed via search index (snippet: "Union Cabinet has approved a commitment of Rs 10,000 crore towards establishing the SME Growth Fund (SGF). The Fund will provide patient equity"). PRID URL to be pinned by a human to upgrade to verified.'),
('pib-doc-infra-20250401', 'PIB / Ministry of Information & Broadcasting',
 'Building Bharat — Powering Infrastructure Through Make in India (specific doc)', '2025-04-01',
 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/apr/doc202541530501.pdf',
 'static.pib.gov.in', 'pib', true, 'captured',
 'PDF downloaded and text-extracted 2026-10-08. Confirms verbatim: Bharatmala — as on Feb 28 2025, 26,425 km awarded of planned 34,800 km, 19,826 km constructed, 6,669 km greenfield awarded, 4,610 km completed, expenditure Rs 4,92,562 crore; PM Gati Shakti — as of Mar 13 2025, 115 NH/road projects, ~13,500 km, Rs 6.38 lakh crore evaluated.'),
('pib-bharatmala-20250313', 'PIB',
 'Implementation of Bharatmala Pariyojana', '2025-03-13',
 null, 'www.pib.gov.in', 'pib', true, 'snippet_confirmed',
 'Search-index snippet from pib.gov.in reads verbatim: "As on 28.02.2025, projects covering a total length of 26,425 km have been awarded and out of this, 19,826 km have already been constructed." Matches the captured I&B doc. PRID URL to be pinned as the second reference.'),
('dfccil-statement-2025', 'DFCCIL / Ministry of Railways',
 'Government statement on DFC commissioning (2025)', '2025-01-01',
 null, 'dfccil.com', 'ministry', true, 'snippet_confirmed',
 'Figure carried in the Techadyant build brief as a 2025 government statement: ~2,557 km of route length commissioned across the Eastern + Western DFCs (~90% complete). Primary link (DFCCIL annual report or PIB release) to be pinned; dfccil.com was reachable from the build sandbox but the annual-report page is menu-generated — human capture required.'),
('pib-dfc-20250319', 'PIB / Ministry of Railways',
 'Advances Infrastructure with Dedicated Freight Corridors', '2025-03-19',
 null, 'www.pib.gov.in', 'pib', true, 'title_date_confirmed',
 'Release title and 19 Mar 2025 date confirmed via search index (snippet references EDFC construction take-up by Ministry of Railways). PRID URL to be pinned.'),
('pib-gatishakti-npg-20260210', 'PIB',
 'PM GatiShakti Network Planning Group Evaluates 352 Infrastructure Projects Worth Rs 16.10 Lakh Crore', '2026-02-10',
 null, 'www.pib.gov.in', 'pib', true, 'snippet_confirmed',
 'Snippet from pib.gov.in reads verbatim: "As on date, 352 infrastructure projects with total estimated cost of Rs 16.10 Lakh Crore have been evaluated through the NPG mechanism." Programme-wide scope (all infrastructure) — distinct from the 115 NH/road-project figure in the Apr 2025 I&B doc. PRID URL to be pinned.'),
('pib-iwai-20250424', 'PIB / IWAI',
 'India''s Record Cargo Movement on Inland Waterways — Achieves 145.5 million tonnes in FY 2024-25', '2025-04-24',
 null, 'www.pib.gov.in', 'pib', true, 'snippet_confirmed',
 'Snippet from pib.gov.in reads: "Achieves 145.5 million tonnes in FY 2024-25 — Fairway Maintenance — NW-1 (Ganga River) — NW-2 (Brahmaputra River) — NW-3 (West Coast Canal, Kerala)". PRID URL to be pinned.'),
('pib-sagarmala-20260411', 'PIB',
 'Sagarmala: Transforming India''s Maritime Landscape', '2026-04-11',
 null, 'www.pib.gov.in', 'pib', true, 'snippet_confirmed',
 'Snippet from pib.gov.in reads: "9.84 million tonnes per annum of cargo handling capacity. India''s major ports handled a record 915 million tonnes of cargo in FY 2025-26." Programme-totals (projects/cost) NOT yet captured — left null. PRID URL to be pinned.'),
('pib-nlp-3years-20250916', 'PIB',
 'India Marks Three Years of National Logistics Policy', '2025-09-16',
 null, 'www.pib.gov.in', 'pib', true, 'title_date_confirmed',
 'Release title and 16 Sep 2025 date confirmed via search index (snippet: DPIIT City Logistics Plans guidelines under NLP). PRID URL to be pinned.'),
('pib-ulip-nldsl-20260708', 'PIB',
 'NICDC''s Logistics Arm NLDSL and Government of Punjab (ULIP partnership)', '2026-07-08',
 null, 'www.pib.gov.in', 'pib', true, 'snippet_confirmed',
 'Snippet from pib.gov.in reads: "ULIP serves as a unified digital gateway for logistics-related data from multiple government systems through API-based integration." API/system counts deliberately NOT entered (secondary counts conflict: 114 APIs/36 systems/8 ministries vs 125 APIs/39 systems/11 ministries) — needs human capture of an official count. PRID URL to be pinned.'),
('dpiit-nlp-page', 'DPIIT',
 'National Logistics Policy (NLP) — programme page', null,
 null, 'www.dpiit.gov.in', 'ministry', true, 'title_date_confirmed',
 'dpiit.gov.in NLP page confirmed via search index; snippet: "National Logistics Policy (NLP). Launched in 2022. Complements PM Gati Shakti. Reduce Logistics Cost — comparable to global benchmarks by 2030." Page is Akamai-blocked from the build sandbox; human to capture the canonical URL.'),
('shipmin-sagarmala-page', 'Ministry of Ports, Shipping & Waterways',
 'SAGARMALA — programme page', null,
 null, 'shipmin.gov.in', 'ministry', true, 'title_date_confirmed',
 'shipmin.gov.in Sagarmala programme page confirmed via search index. Site WAF-rejected automated fetch; human to capture programme totals (projects identified/completed, estimated cost).'),
('shipmin-ar-2025-26', 'Ministry of Ports, Shipping & Waterways',
 'Annual Report 2025-26', '2026-01-01',
 null, 'shipmin.gov.in', 'ministry', true, 'snippet_confirmed',
 'Search-index snippet from the shipmin.gov.in annual report reads: "Mumbai Port achieved the highest ever cargo throughput during 2024-25 of 68.63 million [tonnes]". PDF path to be pinned by a human.'),
('newsonair-ports-fy25', 'NewsOnAir (Prasar Bharati)',
 'Cargo handled by India''s major ports surges to record 855 million tonnes', '2025-04-01',
 null, 'newsonair.gov.in', 'government', true, 'snippet_confirmed',
 'Government-broadcaster report attributing to MoPSW: FY2023-24 = 819 million tonnes; FY2024-25 = 855 million tonnes (headline). Treat as one source (Prasar Bharati); URL to be pinned.'),
('morth-yer-2025-mirror', 'MoRTH (via indiashippingnews.com mirror)',
 'Year End Review 2025 — Ministry of Road Transport & Highways', '2025-12-31',
 null, 'indiashippingnews.com', 'trade_press', false, 'lead_only',
 'LEAD ONLY — trade mirror of the MoRTH year-end review; snippet: "A network of 35 Multimodal Logistics Parks is planned to be developed as part of Bharatmala Pariyojana, with a total investment of about Rs. 46 [thousand crore]". Not entered as a figure anywhere. Human to capture the PIB/MoRTH original and reconcile with the 11-MMLPs-under-Phase-II framing.'),
('impri-dfc-2026', 'IMPRI (forum)',
 'Dedicated Freight Corridor: What A Decade Of Rail […]', '2026-08-09',
 null, 'www.impriindia.com', 'academic', false, 'lead_only',
 'LEAD ONLY — secondary commentary citing a PIB 2026 statement that "all 2,843 km of the original corridors [are] commissioned". Conflicts with the 2025 ~2,557 km statement; do not update commissioned_km until the PIB release itself is captured.'),
('bs-itla-20261006', 'Business Standard',
 'Cabinet approves new body to integrate transport and logistics', '2026-10-06',
 null, 'www.business-standard.com', 'trade_press', false, 'lead_only',
 'Trade-press corroboration of the 6 Oct 2026 Cabinet decision (lead only; never a sole source).'),
('ddnews-itla-20261006', 'DD News (Prasar Bharati)',
 'Cabinet approves setting up of Integrated Transport & Logistics Authority', '2026-10-06',
 null, 'ddnews.gov.in', 'government', false, 'title_date_confirmed',
 'Government-broadcaster corroboration; snippet confirms the National Transport Master Plan mode coverage (roads, railways, ports and shipping, civil aviation, inland waterways, coastal shipping, urban mobility and logistics).')
on conflict (id) do update set
  publisher = excluded.publisher, title = excluded.title, published_on = excluded.published_on,
  url = coalesce(excluded.url, logistics.sources.url), url_host = excluded.url_host,
  kind = excluded.kind, is_primary = excluded.is_primary, capture_status = excluded.capture_status,
  capture_note = excluded.capture_note, retrieved_on = excluded.retrieved_on;

-- ------------------------------------------------------------- programmes --
insert into logistics.programmes (id, code, name, ministry, type, summary, key_metrics, status, primary_source_id, verification_status, rationale) values
('itla', 'ITLA', 'Integrated Transport & Logistics Authority (ITLA)', 'PMO / Cabinet (SPV)', 'authority',
 'SPV approved by the Union Cabinet on 6 Oct 2026 as the national apex institution for integrated transport and logistics planning, research, project appraisal, monitoring and data analytics. Prepares a National Transport Master Plan with a 10+ year horizon covering roads, railways, ports and shipping, civil aviation, inland waterways, coastal shipping, urban mobility and logistics; undertakes technical appraisal of Government of India projects costing Rs 500 crore or more (financial appraisal stays with existing mechanisms); monitors projects above Rs 500 crore; and builds a National Transport Data Repository integrating GSTN e-way bill, FASTag, Vahan, GPS-based systems and urban traffic data for freight-flow / O-D analytics.',
 '{"appraisal_threshold_cr": 500, "master_plan_horizon": "10+ years", "data_integrations": ["GSTN e-way bill", "FASTag", "Vahan", "GPS-based systems", "urban traffic management systems"]}',
 'approved (6 Oct 2026)', 'pm-india-itla-20261006', 'single_source',
 'One primary (PM India release) captured in full. PIB Cabinet release of the same date is title+date-confirmed but its PRID URL is unpinned — pin it to upgrade to verified. Companion signal: S-144 (SME Growth Fund + ITLA).'),
('sme-growth-fund', 'SGF', 'SME Growth Fund (SGF)', 'Government of India (Union Budget 2026-27, Para 28)', 'policy',
 'Union Cabinet commitment of Rs 10,000 crore (6 Oct 2026) toward a fund providing growth-oriented, patient direct equity for Small and Medium Enterprises — targeting champion Indian enterprises across manufacturing, services, technology, innovation-driven sectors and strategic value chains. Addresses a structural gap: existing equity funds focus on early-stage/micro enterprises.',
 '{"commitment_cr": 10000, "instrument": "direct equity (growth-stage)"}',
 'approved (6 Oct 2026)', 'pm-india-sgf-20261006', 'single_source',
 'One primary (PM India release) captured in full; PIB release title+date-confirmed, PRID unpinned. Included here because equity for manufacturing SMEs and Tier-II/III clusters is a demand-side input to the logistics system, not a transport programme.'),
('dfc', 'DFC', 'Dedicated Freight Corridors (EDFC + WDFC)', 'Ministry of Railways / DFCCIL', 'corridor_programme',
 'Two dedicated freight-corridor lines — Eastern (Ludhiana–Sonnagar/Dankuni) and Western (Dadri–JNPT) — built by DFCCIL to shift bulk rail freight off the passenger network. A 2025 government statement put ~2,557 km of route length commissioned (~90% of the network); a PIB-2026 statement reportedly covering the full network is pending capture.',
 '{"commissioned_km": 2557, "commissioned_note": "~90% of network per 2025 government statement"}',
 'commissioning (per 2025 statement)', 'dfccil-statement-2025', 'single_source',
 'Seed figure kept verbatim from the build brief (2025 government statement). Full-commissioning claim (2,843 km, PIB 2026) exists only via secondary commentary — see corridor row + leads. Second primary (DFCCIL annual report) to be captured.'),
('bharatmala', 'BPM', 'Bharatmala Pariyojana', 'Ministry of Road Transport & Highways', 'corridor_programme',
 'Umbrella highway programme approved 2017. As on 28 Feb 2025: 26,425 km awarded of a planned 34,800 km; 19,826 km constructed; 6,669 km of high-speed greenfield corridors awarded, of which 4,610 km completed; total expenditure Rs 4,92,562 crore.',
 '{"planned_km": 34800, "awarded_km": 26425, "constructed_km": 19826, "greenfield_awarded_km": 6669, "greenfield_completed_km": 4610, "expenditure_cr": 492562, "as_on": "2025-02-28"}',
 'awarding/construction in progress', 'pib-doc-infra-20250401', 'single_source',
 'Figures confirmed verbatim in the captured PIB/I&B specific doc (PDF on file) and independently matched by the PIB 13 Mar 2025 release snippet. Both are PIB-family sources, so the row remains single_source until a MoRTH/NHAI dashboard capture adds a genuinely independent primary.'),
('pm-gati-shakti', 'PMGS', 'PM Gati Shakti National Master Plan', 'DPIIT (NPG mechanism)', 'policy',
 'GIS-based national master plan for multimodal infrastructure planning; Network Planning Group (NPG) evaluates major projects for network alignment. As of 13 Mar 2025, 115 NH/road projects covering ~13,500 km with Rs 6.38 lakh crore investment had been evaluated; by 10 Feb 2026 the NPG mechanism had evaluated 352 infrastructure projects worth Rs 16.10 lakh crore (programme-wide scope).',
 '{"nh_road_projects_evaluated": 115, "nh_road_km_approx": 13500, "nh_road_investment_lakh_cr": 6.38, "nh_road_as_on": "2025-03-13", "npg_projects_evaluated": 352, "npg_investment_lakh_cr": 16.10, "npg_as_on": "2026-02-10"}',
 'operational', 'pib-doc-infra-20250401', 'single_source',
 'NH/road figures confirmed verbatim in the captured PIB/I&B doc. The 352/16.10 figures come from the PIB 10 Feb 2026 release title+snippet (PRID unpinned) — same publisher family, so single_source stands.'),
('national-logistics-policy', 'NLP', 'National Logistics Policy (NLP)', 'DPIIT', 'policy',
 'Policy launched in 2022, complementary to PM Gati Shakti, with the stated goal of reducing logistics cost to levels comparable with global benchmarks by 2030. DPIIT has since issued guidelines for City Logistics Plans. ITLA is mandated to advise on and assist review/updation of NLP (2022).',
 null,
 'in force', 'dpiit-nlp-page', 'needs_human_source',
 'Programme page confirmed only at host level (Akamai-blocked sandbox). Launch date (17 Sep 2022), baseline/2022 logistics-cost figure and target percentages deliberately left null until the DPIIT/PIB primary is captured.'),
('sagarmala', 'SAGAR', 'Sagarmala Programme', 'Ministry of Ports, Shipping & Waterways', 'port',
 'Port-led development programme: port modernisation, port connectivity enhancement, port-led industrialisation, coastal shipping and inland waterways transport, and coastal community development. Programme totals (projects identified/completed, estimated cost) are not yet captured here.',
 null,
 'in progress', 'shipmin-sagarmala-page', 'needs_human_source',
 'Programme page confirmed at host level only; WAF blocked automated capture. The PIB 11 Apr 2026 feature (title+date confirmed) covers components — human to capture programme-level totals from shipmin.gov.in or the PIB release.'),
('ulip', 'ULIP', 'Unified Logistics Interface Platform (ULIP)', 'DPIIT / NICDC-NLDSL', 'policy',
 'Digital gateway that lets industry access logistics-related datasets from multiple government systems through API-based integration (freight-relevant systems include e-way bill, FASTag, Vahan and customs-related platforms).',
 null,
 'operational', 'pib-ulip-nldsl-20260708', 'needs_human_source',
 'Description sourced from the PIB 8 Jul 2026 release snippet. API/system/ministry counts conflict across secondary sources (114/36/8 vs 125/39/11) and are deliberately omitted until an official count is captured.'),
('leads', 'LEADS', 'Logistics Ease Across Different States (LEADS)', 'DPIIT', 'policy',
 'Annual DPIIT index of logistics ease across States and UTs; upgraded in recent editions to combine perception surveys with objective indicators. Used here (v1) as the reference layer for state-level logistics readiness; no edition results captured yet.',
 null,
 'annual (latest edition not yet captured)', 'dpiit-nlp-page', 'needs_human_source',
 'Exists and is DPIIT-run per secondary/edu sources, but no official LEADS edition page or PDF is captured. Human to pin the latest LEADS report from dpiit.gov.in.'),
('mmlp', 'MMLP', 'Multimodal Logistics Parks (MMLPs)', 'MoRTH / NHAI', 'policy',
 'Logistics parks planned under the Bharatmala umbrella co-locating warehousing, intermodal transfer and handling facilities. The build brief cites 11 identified under Bharatmala Phase II; a MoRTH Year-End Review 2025 (via trade mirror) refers to a planned network of 35 MMLPs with ~Rs 46,000 crore total investment. Scopes differ and neither is captured from a primary yet.',
 null,
 'planned/partial', 'morth-yer-2025-mirror', 'needs_human_source',
 'Primary-source capture required: reconcile 11 (Phase II) vs 35 (network) framings from PIB/MoRTH originals. No MMLP count or cost is asserted in any scored claim.'),
('iwai', 'IWAI', 'Inland Waterways Authority of India — National Waterways', 'Ministry of Ports, Shipping & Waterways / IWAI', 'waterway',
 'Statutory authority for national waterways (NW-1 Ganga, NW-2 Brahmaputra, NW-3 West Coast Canal among 111 declared). Record cargo movement of 145.5 million tonnes achieved in FY 2024-25.',
 '{"cargo_mmt_fy25": 145.5}',
 'operational', 'pib-iwai-20250424', 'single_source',
 'Figure from the PIB 24 Apr 2025 release (snippet captured from pib.gov.in; PRID unpinned). Human to pin the release URL and add IWAI data as second source.'),
('major-port-cargo', 'MPC', 'Major ports cargo throughput', 'Ministry of Ports, Shipping & Waterways', 'port',
 'Aggregate cargo handled by India''s major ports: record ~915 million tonnes in FY 2025-26 (per PIB 11 Apr 2026 feature), 855 million tonnes in FY 2024-25 and 819 million tonnes in FY 2023-24 (per MoPSW statement carried by Prasar Bharati''s NewsOnAir).',
 '{"cargo_mt_fy26": 915, "cargo_mt_fy25": 855, "cargo_mt_fy24": 819}',
 'operational', 'pib-sagarmala-20260411', 'single_source',
 'Two government publishers (PIB; Prasar Bharati/MoPSW) but neither URL is pinned yet; treated as one sourcing chain until pinned. Port-level breakdown lives in the nodes table.')
on conflict (id) do update set
  summary = excluded.summary, key_metrics = excluded.key_metrics, status = excluded.status,
  primary_source_id = excluded.primary_source_id, verification_status = excluded.verification_status,
  rationale = excluded.rationale, updated_at = now();

-- -------------------------------------------------------------- corridors --
insert into logistics.corridors (id, name, mode, endpoints, length_km, length_commissioned_km, status, programme_id, verification_status, rationale) values
('dfc-network', 'Dedicated Freight Corridor network (EDFC + WDFC combined)', 'rail', null, null, 2557,
 'Commissioning in progress per the 2025 government statement (~90% of network); a PIB-2026 full-commissioning statement is reportedly pending capture.', 'dfc', 'single_source',
 'Only the ~2,557 km commissioned figure (2025 statement) is carried. Network length (2,843 km per secondary commentary) and full-commissioning status stay null until DFCCIL/PIB primaries are captured.'),
('edfc', 'Eastern Dedicated Freight Corridor (EDFC)', 'rail', null, null, null,
 'Operational sections in service; lengths and endpoints pending primary capture.', 'dfc', 'needs_human_source',
 'Endpoints commonly given as Ludhiana (PB) – Dankuni (WB) in secondary literature; deliberately not stored until a DFCCIL/PIB primary is captured.'),
('wdfc', 'Western Dedicated Freight Corridor (WDFC)', 'rail', null, null, null,
 'Operational sections in service; lengths and endpoints pending primary capture.', 'dfc', 'needs_human_source',
 'Endpoints commonly given as Dadri (UP) – JNPT (MH) in secondary literature; deliberately not stored until a DFCCIL/PIB primary is captured.'),
('bharatmala-network', 'Bharatmala Pariyojana road network (Phase-I aggregate)', 'road', null, 34800, 19826,
 '26,425 km awarded; 19,826 km constructed as on 28 Feb 2025 (greenfield: 6,669 km awarded / 4,610 km completed).', 'bharatmala', 'single_source',
 'Planned (34,800 km) and constructed (19,826 km) figures confirmed in the captured PIB/I&B doc. length_commissioned_km carries "constructed" for road programmes by convention noted here.')
on conflict (id) do update set
  name = excluded.name, mode = excluded.mode, endpoints = excluded.endpoints,
  length_km = excluded.length_km, length_commissioned_km = excluded.length_commissioned_km,
  status = excluded.status, programme_id = excluded.programme_id,
  verification_status = excluded.verification_status, rationale = excluded.rationale;

-- ----------------------------------------------------------------- nodes --
insert into logistics.nodes (id, name, type, state, lat, lon, throughput, status, programme_id, verification_status, rationale) values
('mumbai-port', 'Mumbai Port', 'port', 'Maharashtra', null, null,
 '{"cargo_mt_fy25": 68.63, "note": "highest-ever throughput, FY 2024-25"}',
 'operational', 'sagarmala', 'single_source',
 'FY2024-25 figure from the MoPSW Annual Report 2025-26 (snippet captured; PDF path to be pinned). Coordinates: only the publicly published port reference point will be stored, once pinned.'),
('deendayal-port', 'Deendayal Port (Kandla)', 'port', 'Gujarat', null, null, null,
 'operational', 'sagarmala', 'needs_human_source',
 'Consistently reported as the largest major port by cargo volume in secondary sources; no primary figure captured yet, so throughput stays null.'),
('jnpa', 'Jawaharlal Nehru Port Authority (JNPA)', 'port', 'Maharashtra', null, null, null,
 'operational', 'sagarmala', 'needs_human_source',
 'India''s leading container port in secondary sources; container throughput (TEU) to be captured from JNPA/MoPSW primaries before entry.'),
('mmlp-stub-v1', 'Multimodal Logistics Park — representative stub', 'mmlp', null, null, null, null,
 'planned', 'mmlp', 'needs_human_source',
 'Schema stub for the v2 MMLP pipeline. No location, count or cost asserted — primary reconciliation of the MMLP programme is pending.')
on conflict (id) do update set
  name = excluded.name, type = excluded.type, state = excluded.state, lat = excluded.lat, lon = excluded.lon,
  throughput = excluded.throughput, status = excluded.status, programme_id = excluded.programme_id,
  verification_status = excluded.verification_status, rationale = excluded.rationale;

-- --------------------------------------------------- opportunity surfaces --
-- POTENTIAL areas where demand or capability may emerge. Not procurement
-- claims; never forecasts of contracts. Analyst judgement (unverified).
insert into logistics.opportunity_surfaces (id, title, body, basis_programme_ids, caveat, verification_status) values
('itla-appraisal-pipeline',
 'A public aperture into the >= Rs 500 crore transport project pipeline',
 'ITLA is mandated to technically appraise Government of India infrastructure projects costing Rs 500 crore or more, and to monitor and run post-implementation impact assessment on them. As the SPV stands up, this mandate may produce centralised public documentation (appraisal records, monitoring outputs) for a project tier that is today scattered across ministries. Techadyant treats this as a potential research surface — v2 of this Atlas will add projects only as their primary records are captured. This states no expectation that any specific project will be announced, approved or procured.',
 ARRAY['itla']::text[],
 'Potential, not procurement. Analyst judgement — no external primary source.',
 'unverified'),
('ntdr-freight-flow-v3',
 'Freight-flow / O-D analytics capability may emerge from the NTDR',
 'ITLA''s National Transport Data Repository is mandated to integrate GSTN e-way bill, FASTag, Vahan, GPS-based and urban traffic datasets and to run freight-flow / origin-destination analytics for planning, monitoring and impact assessment. If the NTDR or ITLA publications release flow data or analyses, they may support a sourced v3 (freight-flow / O-D) layer of this Atlas. Until such a public release exists, Techadyant will not model any flows — the v3 section stays a stub marked "needs a human source".',
 ARRAY['itla']::text[],
 'Potential, not procurement. Conditional on future public data releases that do not yet exist.',
 'unverified'),
('sgf-tier23-freight-demand',
 'SME Growth Fund equity may deepen Tier-II/III freight demand over time',
 'The SME Growth Fund''s direct-equity mandate targets growth-stage SMEs with a majority orientation toward manufacturing and Tier-II/III clusters. If implemented at scale, a deepening manufacturing SME base in these clusters may, over multi-year horizons, generate additional freight demand and supplier flows along existing corridor infrastructure (DFC, Bharatmala). This is a demand-side possibility for monitoring — not a forecast, and not a claim about any procurement or scheme disbursement.',
 ARRAY['sme-growth-fund', 'dfc', 'bharatmala']::text[],
 'Potential, not procurement. Multi-year analyst judgement — no external primary source.',
 'unverified')
on conflict (id) do update set
  title = excluded.title, body = excluded.body, basis_programme_ids = excluded.basis_programme_ids,
  caveat = excluded.caveat, verification_status = excluded.verification_status;

-- ---------------------------------------------------------- record sources --
insert into logistics.record_sources (record_table, record_id, source_id, supports, quoted_text, is_primary) values
('programmes', 'itla', 'pm-india-itla-20261006', 'SPV status; National Transport Master Plan 10+ yr horizon; >= Rs 500 crore technical appraisal; monitoring above Rs 500 crore; NTDR datasets; freight-flow/O-D analytics; NLP review mandate',
 'ITLA will undertake technical appraisal of infrastructure projects of Government of India, costing Rs.500 crore or more. […] [NTDR will] obtain relevant transport and logistics datasets from multiple sources, including GSTN e-way bill, FASTag, Vahan, GPS-based systems, urban traffic management systems […] and carry out data analytics (e.g. Freight Flow/O-D analytics).', true),
('programmes', 'itla', 'pib-itla-20261006', 'Corroborating Cabinet release (URL pin pending — gates the verified upgrade)',
 null, true),
('programmes', 'itla', 'bs-itla-20261006', 'Trade-press corroboration (lead only)', null, false),
('programmes', 'itla', 'ddnews-itla-20261006', 'Government-broadcaster corroboration; master-plan mode coverage', 'The plan will cover roads, railways, ports and shipping, civil aviation, inland waterways, coastal shipping, urban mobility and logistics.', false),
('programmes', 'sme-growth-fund', 'pm-india-sgf-20261006', 'Rs 10,000 crore commitment; direct equity; Union Budget 2026-27 Para 28 anchor; structural-gap rationale',
 'The Union Cabinet, chaired by Prime Minister Shri Narendra Modi, today approved the Government of India''s commitment of Rs.10,000 crore towards the establishment of the SME Growth Fund (SGF) aimed at catalysing growth-oriented capital for India''s Small and Medium Enterprises (SMEs).', true),
('programmes', 'sme-growth-fund', 'pib-sgf-20261006', 'Corroborating PIB release (URL pin pending — gates the verified upgrade)',
 'Union Cabinet has approved a commitment of Rs 10,000 crore towards establishing the SME Growth Fund (SGF). The Fund will provide patient equity', true),
('programmes', 'dfc', 'dfccil-statement-2025', '~2,557 km commissioned across EDFC + WDFC (~90% complete) per 2025 government statement',
 null, true),
('programmes', 'dfc', 'pib-dfc-20250319', 'PIB Ministry-of-Railways release on DFC build-out (URL pin pending)', null, true),
('programmes', 'dfc', 'impri-dfc-2026', 'LEAD ONLY: secondary claim that PIB 2026 states all 2,843 km commissioned — verify before use',
 'The DFC network is now fully operational, with all 2,843 km of the original corridors commissioned (PIB, 2026).', false),
('programmes', 'bharatmala', 'pib-doc-infra-20250401', 'Planned/awarded/constructed km; greenfield awarded/completed km; expenditure — as on 28 Feb 2025',
 'As on February 28, 2025, 26,425 km of projects awarded under the planned 34,800 km, with 19,826 km already constructed. The total Expenditure incurred under Bharatmala Pariyojana amounts to Rs. 4,92,562 crore. […] 6,669 km of high-speed greenfield corridors awarded, of which 4,610 km have been completed.', true),
('programmes', 'bharatmala', 'pib-bharatmala-20250313', 'Independent PIB release matching awarded/constructed figures (URL pin pending)',
 'As on 28.02.2025, projects covering a total length of 26,425 km have been awarded and out of this, 19,826 km have already been constructed.', true),
('programmes', 'pm-gati-shakti', 'pib-doc-infra-20250401', '115 NH/road projects, ~13,500 km, Rs 6.38 lakh crore evaluated as of 13 Mar 2025',
 'As of March 13, 2025, 115 National Highway and road projects covering approximately 13,500 km, with an investment of Rs 6.38 lakh crore, have been evaluated under the initiative.', true),
('programmes', 'pm-gati-shakti', 'pib-gatishakti-npg-20260210', 'NPG programme-wide evaluation totals as of 10 Feb 2026 (URL pin pending)',
 'As on date, 352 infrastructure projects with total estimated cost of Rs 16.10 Lakh Crore have been evaluated through the NPG mechanism.', true),
('programmes', 'national-logistics-policy', 'dpiit-nlp-page', 'NLP launched 2022; complements PM Gati Shakti; cost-to-global-benchmarks-by-2030 goal (URL pin pending)',
 'National Logistics Policy (NLP). Launched in 2022. Complements PM Gati Shakti. Reduce Logistics Cost — comparable to global benchmarks by 2030.', true),
('programmes', 'national-logistics-policy', 'pib-nlp-3years-20250916', 'Three-year implementation review release (URL pin pending)', null, true),
('programmes', 'sagarmala', 'shipmin-sagarmala-page', 'Programme identity and pillar structure (URL pin pending)', null, true),
('programmes', 'sagarmala', 'pib-sagarmala-20260411', 'Component/feature coverage; major-port cargo record (URL pin pending)',
 'India''s major ports handled a record 915 million tonnes of cargo in FY 2025-26.', true),
('programmes', 'ulip', 'pib-ulip-nldsl-20260708', 'ULIP as unified digital gateway (URL pin pending; official API/system counts not yet captured)',
 'ULIP serves as a unified digital gateway for logistics-related data from multiple government systems through API-based integration.', true),
('programmes', 'leads', 'dpiit-nlp-page', 'LEADS as DPIIT-run annual index (canonical report page not yet captured)', null, true),
('programmes', 'mmlp', 'morth-yer-2025-mirror', 'LEAD ONLY: 35-MMLP network framing from MoRTH year-end review (trade mirror; original not captured)',
 'A network of 35 Multimodal Logistics Parks is planned to be developed as part of Bharatmala Pariyojana, with a total investment of about Rs. 46 […].', false),
('programmes', 'iwai', 'pib-iwai-20250424', 'Record FY2024-25 cargo movement on national waterways (URL pin pending)',
 'Achieves 145.5 million tonnes in FY 2024-25 — Fairway Maintenance — NW-1 (Ganga River) — NW-2 (Brahmaputra River) — NW-3 (West Coast Canal, Kerala).', true),
('programmes', 'major-port-cargo', 'pib-sagarmala-20260411', 'Record ~915 MT in FY 2025-26 (URL pin pending)',
 'India''s major ports handled a record 915 million tonnes of cargo in FY 2025-26.', true),
('programmes', 'major-port-cargo', 'newsonair-ports-fy25', 'FY2024-25 = 855 MT; FY2023-24 = 819 MT (MoPSW attribution; URL pin pending)',
 'In a statement, the Ministry of Ports, Shipping and Waterways said that the country''s ports handled 819 million tonnes of cargo in the financial year 2023-24.', true),
('corridors', 'dfc-network', 'dfccil-statement-2025', '~2,557 km commissioned (~90% of network) per 2025 government statement', null, true),
('corridors', 'dfc-network', 'impri-dfc-2026', 'LEAD ONLY: full-commissioning claim pending PIB capture', 'The DFC network is now fully operational, with all 2,843 km of the original corridors commissioned (PIB, 2026).', false),
('corridors', 'bharatmala-network', 'pib-doc-infra-20250401', 'Planned 34,800 km; constructed 19,826 km (as on 28 Feb 2025)',
 'As on February 28, 2025, 26,425 km of projects awarded under the planned 34,800 km, with 19,826 km already constructed.', true),
('nodes', 'mumbai-port', 'shipmin-ar-2025-26', 'FY2024-25 throughput 68.63 MT (highest ever); PDF path pin pending',
 'Mumbai Port achieved the highest ever cargo throughput during 2024-25 of 68.63 mill[ion tonnes].', true)
on conflict (record_table, record_id, source_id) do nothing;

-- =====================================================================
-- DFC correction — 8 Oct 2026 (Techadyant industrial-intelligence review)
-- The 2025 "~2,557 km (~90%)" figure is superseded by primary sources:
--   EDFC Ludhiana–Sonnagar 1,337 km, construction fully completed (PIB, 13 Dec 2023)
--   WDFC Dadri–JNPT completed and fully operational (PMO 7 Sep 2026; JICA 8 Sep 2026; DFCCIL route page)
-- Mirrors scripts/logistics-seed.json. Idempotent.
-- =====================================================================
insert into logistics.sources (id, publisher, title, published_on, url, url_host, kind, is_primary, capture_status, capture_note) values
('pm-india-wdfc-20260907', 'Prime Minister of India (pmindia.gov.in)', 'PM to visit Gujarat and Maharashtra on 8th September (WDFC dedication)', '2026-09-07',
 'https://www.pmindia.gov.in/?p=16920780', 'www.pmindia.gov.in', 'pm_india', true, 'captured',
 'Captured 2026-10-08: dedication of WDFC sections New Sanand (N)–New Makarpura, New Umbergaon–New Saphale and New Saphale–New JNPT — 326 route km, > Rs 20,700 crore; the sections complete the DFC network.'),
('jica-wdfc-20260908', 'JICA India Office', 'Western Dedicated Freight Corridor completed and fully operationalised', '2026-09-08',
 'https://www.jica.go.jp/english/overseas/india/information/press/2026/1585189_70871.html', 'www.jica.go.jp', 'international', true, 'captured',
 'Captured 2026-10-08: WDFC (1,506 km, Dadri–JNPT) completed and fully operational; independent of the PMO source (lender).'),
('dfccil-wdfc-route', 'DFCCIL', 'Western Corridor (route page)', null,
 'https://dfccil.com/Home/DynemicPages?MenuId=77', 'dfccil.com', 'ministry', true, 'captured',
 'Captured 2026-10-08: WDFC JNPT–Dadri via Vadodara, Ahmedabad, Palanpur, Phulera, Rewari; 1,504 km double-line electric; joins the Eastern Corridor at Dadri. Page undated.'),
('pib-edfc-complete-20231213', 'PIB / Ministry of Railways', 'Construction of Eastern Dedicated Freight Corridor fully completed', '2023-12-13',
 'https://pib.gov.in/PressReleaseIframePage.aspx?PRID=1985782', 'pib.gov.in', 'pib', true, 'captured',
 'Captured 2026-10-08: EDFC Ludhiana–Sonnagar, 1,337 km; construction fully completed (13 Dec 2023).')
on conflict (id) do update set url = excluded.url, capture_status = excluded.capture_status, capture_note = excluded.capture_note;

update logistics.programmes set
  summary = 'Two dedicated freight-corridor lines built by DFCCIL to shift bulk rail freight off the passenger network. Eastern (Ludhiana–Sonnagar, 1,337 km): construction fully completed, Dec 2023 (PIB). Western (Dadri–JNPT, ~1,504–1,506 km): completed and fully operational after the final three sections were dedicated on 8 Sep 2026 (PMO; JICA). The Sonnagar–Dankuni extension of the EDFC is not part of the completed figure.',
  key_metrics = '{"edfc_km": 1337, "edfc_status": "construction fully completed (13 Dec 2023)", "wdfc_km": 1506, "wdfc_km_note": "DFCCIL route page states 1,504 km; JICA states 1,506 km", "wdfc_status": "completed and fully operational (8 Sep 2026)", "final_sections_dedicated_km": 326}',
  status = 'complete — EDFC (Dec 2023) and WDFC (Sep 2026)',
  primary_source_id = 'jica-wdfc-20260908',
  verification_status = 'verified',
  rationale = 'WDFC completion rests on two independent primaries (PMO release + JICA, the project lender) plus the DFCCIL route page; EDFC completion on a PIB release. Supersedes the 2025 ''~2,557 km (~90%)'' seed figure. 8 Oct 2026 correction.',
  updated_at = now()
where id = 'dfc';

update logistics.corridors set endpoints = 'Ludhiana (PB) – Sonnagar (BR)', length_km = 1337, length_commissioned_km = 1337,
  status = 'Construction fully completed (13 Dec 2023).', verification_status = 'single_source',
  rationale = 'One primary (PIB, Dec 2023). The Sonnagar–Dankuni section is not included.' where id = 'edfc';
update logistics.corridors set endpoints = 'Dadri (UP) – JNPT (MH)', length_km = 1506, length_commissioned_km = 1506,
  status = 'Completed and fully operational (final sections dedicated 8 Sep 2026).', verification_status = 'verified',
  rationale = 'Two independent primaries (PMO release; JICA). DFCCIL route page gives 1,504 km; JICA 1,506 km — the higher figure is shown, the discrepancy noted.' where id = 'wdfc';
update logistics.corridors set length_km = null, length_commissioned_km = 2843,
  status = 'EDFC construction complete (Dec 2023) and WDFC fully operational (Sep 2026); 1,337 km + 1,506 km.', verification_status = 'verified',
  rationale = 'Combined figure derived from the two corridor rows (EDFC 1,337 km per PIB; WDFC 1,506 km per JICA). Total network length kept null because the Sonnagar–Dankuni extension is outside the completed figure.' where id = 'dfc-network';

delete from logistics.record_sources where record_id in ('dfc','dfc-network') and source_id = 'impri-dfc-2026';
delete from logistics.record_sources where record_table = 'corridors' and record_id = 'dfc-network' and source_id = 'dfccil-statement-2025';
insert into logistics.record_sources (record_table, record_id, source_id, supports, quoted_text, is_primary) values
('programmes', 'dfc', 'pib-edfc-complete-20231213', 'EDFC Ludhiana–Sonnagar 1,337 km — construction fully completed', null, true),
('programmes', 'dfc', 'pm-india-wdfc-20260907', 'Final 326 route km of WDFC dedicated 8 Sep 2026; completes the network', null, true),
('programmes', 'dfc', 'jica-wdfc-20260908', 'WDFC 1,506 km completed and fully operational', null, true),
('programmes', 'dfc', 'dfccil-wdfc-route', 'WDFC route and 1,504 km length', null, true),
('corridors', 'dfc-network', 'pib-edfc-complete-20231213', 'EDFC 1,337 km complete', null, true),
('corridors', 'dfc-network', 'jica-wdfc-20260908', 'WDFC 1,506 km fully operational', null, true),
('corridors', 'dfc-network', 'pm-india-wdfc-20260907', 'WDFC final sections dedicated 8 Sep 2026', null, true),
('corridors', 'edfc', 'pib-edfc-complete-20231213', 'Ludhiana–Sonnagar, 1,337 km, construction fully completed', null, true),
('corridors', 'wdfc', 'pm-india-wdfc-20260907', 'Final sections dedicated; network complete', null, true),
('corridors', 'wdfc', 'jica-wdfc-20260908', '1,506 km Dadri–JNPT fully operational', null, true),
('corridors', 'wdfc', 'dfccil-wdfc-route', 'JNPT–Dadri, 1,504 km', null, true)
on conflict (record_table, record_id, source_id) do nothing;
