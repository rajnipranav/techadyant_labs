export interface CmdChart {
  id: string;
  filename: string;
  title: string;
  chapter: string;
  description: string;
  pngPath: string;
  svgPath: string;
}

export interface CmdSection {
  id: string;
  title: string;
  body: string;
  charts: CmdChart[];
}

export const palette = {
  navyPrimary: '#334650',
  steelSecondary: '#5A7886',
  accentTeal: '#3681A6',
  accentRed: '#B43A4E',
  successGreen: '#46875C',
  warningAmber: '#A18347',
  errorRed: '#92453E',
  infoBlue: '#466A8E',
} as const;

export const charts: CmdChart[] = [
  {
    id: 'import-surface',
    filename: '01_import_treemap',
    title: `India's Annual Import Surface by Mega Sector`,
    chapter: 'Executive Summary',
    description: 'Treemap showing $506B strategic imports across 12 mega sectors, FY2024. Verified from UN Comtrade + DGCI&S.',
    pngPath: '/cmd/charts/PNG/01_import_treemap.png',
    svgPath: '/cmd/charts/SVG/01_import_treemap.svg',
  },
  {
    id: 'top-sources',
    filename: '02_top_sources',
    title: 'Top 10 Import Source Countries',
    chapter: 'Executive Summary',
    description: 'Horizontal bar chart with strategic concentration highlighted in red. Total imports in US$ Billion, FY2024.',
    pngPath: '/cmd/charts/PNG/02_top_sources.png',
    svgPath: '/cmd/charts/SVG/02_top_sources.svg',
  },
  {
    id: 'dependency-distribution',
    filename: '03_cmdi_distribution',
    title: 'CMDI Distribution — Top 50 Strategic Imports',
    chapter: 'Chapter 3 (Indices)',
    description: 'Histogram of CMDI scores with quadrant markers (Critical/High/Elevated/Moderate) plus top 8 highest-CMDI products.',
    pngPath: '/cmd/charts/PNG/03_cmdi_distribution.png',
    svgPath: '/cmd/charts/SVG/03_cmdi_distribution.svg',
  },
  {
    id: 'localization-matrix',
    filename: '04_localization_matrix',
    title: 'Localization Priority Matrix — LPI vs IAI',
    chapter: 'Chapter 13 (Frameworks)',
    description: '2x2 quadrant chart plotting 16 opportunity surfaces on Localization Potential (x) vs Investment Attractiveness (y).',
    pngPath: '/cmd/charts/PNG/04_localization_matrix.png',
    svgPath: '/cmd/charts/SVG/04_localization_matrix.svg',
  },
  {
    id: 'import-trend',
    filename: '05_import_trend',
    title: "India's Strategic Import Trend by Sector, FY2015-FY2024",
    chapter: 'Executive Summary',
    description: 'Multi-line chart of 4 key sectors (Electronics, Machinery, Chemicals, Defence) showing 10-year import trajectory.',
    pngPath: '/cmd/charts/PNG/05_import_trend.png',
    svgPath: '/cmd/charts/SVG/05_import_trend.svg',
  },
  {
    id: 'country-mva',
    filename: '06_country_mva',
    title: 'Manufacturing Value Added by Country, 2023',
    chapter: 'Chapter 6 (Benchmarks)',
    description: 'Two-panel comparison: MVA in US$B (log scale) and MVA as % of GDP for 16 comparator nations including India.',
    pngPath: '/cmd/charts/PNG/06_country_mva.png',
    svgPath: '/cmd/charts/SVG/06_country_mva.svg',
  },
  {
    id: 'state-rankings',
    filename: '07_state_rankings',
    title: 'Top 15 Indian States — Manufacturing Capability Composite',
    chapter: 'Chapter 11 (States)',
    description: 'Grouped horizontal bar chart showing composite + infrastructure + policy support scores for top 15 states.',
    pngPath: '/cmd/charts/PNG/07_state_rankings.png',
    svgPath: '/cmd/charts/SVG/07_state_rankings.svg',
  },
  {
    id: 'semi-decomposition',
    filename: '08_semi_decomposition',
    title: 'Semiconductor Import Surface Decomposition',
    chapter: 'Chapter 4.1 (Semiconductors)',
    description: 'Bar chart of 18 semiconductor import categories with CMDI scores, color-coded by criticality level.',
    pngPath: '/cmd/charts/PNG/08_semi_decomposition.png',
    svgPath: '/cmd/charts/SVG/08_semi_decomposition.svg',
  },
  {
    id: 'ev-value-chain',
    filename: '09_ev_value_chain',
    title: 'EV/Li-ion Battery Value Chain — Import vs Domestic',
    chapter: 'Chapter 4.4 (EV & Battery)',
    description: 'Paired bar chart comparing imported vs domestic supply across 9 EV value chain segments.',
    pngPath: '/cmd/charts/PNG/09_ev_value_chain.png',
    svgPath: '/cmd/charts/SVG/09_ev_value_chain.svg',
  },
  {
    id: 'pli-performance',
    filename: '10_pli_performance',
    title: 'PLI Scheme — Incentive Outlay vs Realised Investment',
    chapter: 'Executive Summary + Chapter 9 (Policy)',
    description: 'Log-scale horizontal bar chart of 12 PLI schemes showing outlay vs realised investment with ratio multiplier.',
    pngPath: '/cmd/charts/PNG/10_pli_performance.png',
    svgPath: '/cmd/charts/SVG/10_pli_performance.svg',
  },
  {
    id: 'cluster-map',
    filename: '11_cluster_map',
    title: "India's 15 Critical Industrial Clusters",
    chapter: 'Chapter 7 (Clusters)',
    description: 'Geographic bubble map of 15 industrial clusters on simplified India silhouette, color-coded by sector specialisation.',
    pngPath: '/cmd/charts/PNG/11_cluster_map.png',
    svgPath: '/cmd/charts/SVG/11_cluster_map.svg',
  },
  {
    id: 'tech-radar',
    filename: '12_tech_radar',
    title: 'Industrial Technology Readiness — India vs Frontier',
    chapter: 'Chapter 8 (Technology) + Chapter 3 (TRI)',
    description: 'Radar chart across 8 manufacturing technology dimensions comparing India, China, and Germany.',
    pngPath: '/cmd/charts/PNG/12_tech_radar.png',
    svgPath: '/cmd/charts/SVG/12_tech_radar.svg',
  },
  {
    id: 'investment-opportunity',
    filename: '13_investment_opportunity',
    title: 'Investment Opportunity by Sector — 2030 Market vs Capital Required',
    chapter: 'Executive Summary + Chapter 10 (Investment)',
    description: 'Paired bar chart for 10 sectors showing market opportunity vs capex required, with ROI multiples annotated.',
    pngPath: '/cmd/charts/PNG/13_investment_opportunity.png',
    svgPath: '/cmd/charts/SVG/13_investment_opportunity.svg',
  },
  {
    id: 'supply-heatmap',
    filename: '14_supply_heatmap',
    title: 'Supply Risk Heat Map — 18 Critical Imports × 6 Risk Dimensions',
    chapter: 'Chapter 3 (SRI) + Chapter 13 (Frameworks)',
    description: 'Color-coded heatmap (RdYlGn_r) showing supply risk scores across geographic concentration, single-source, lead time, etc.',
    pngPath: '/cmd/charts/PNG/14_supply_heatmap.png',
    svgPath: '/cmd/charts/SVG/14_supply_heatmap.svg',
  },
  {
    id: 'index-spider',
    filename: '15_index_spider',
    title: 'Techadyant 10-Index Profile — 28nm Logic Fab Worked Example',
    chapter: 'Chapter 3 (Indices)',
    description: 'Radar/spider chart showing all 10 proprietary index scores for a representative opportunity surface (28nm fab).',
    pngPath: '/cmd/charts/PNG/15_index_spider.png',
    svgPath: '/cmd/charts/SVG/15_index_spider.svg',
  },
  {
    id: 'deficit-donut',
    filename: '16_deficit_donut',
    title: "India's Trade Deficit Composition by Category — FY2024",
    chapter: 'Executive Summary',
    description: 'Donut chart showing $462B trade deficit broken into 10 categories with center total displayed.',
    pngPath: '/cmd/charts/PNG/16_deficit_donut.png',
    svgPath: '/cmd/charts/SVG/16_deficit_donut.svg',
  },
  {
    id: 'localization-timeline',
    filename: '17_localization_timeline',
    title: 'Techadyant Localization Timeline — 16 Opportunity Surfaces, 2026-2035',
    chapter: 'Executive Summary + Chapter 13',
    description: 'Gantt-style horizontal bar chart with 3 phase shadings (Quick Wins / Capability Build / Strategic Sovereignty).',
    pngPath: '/cmd/charts/PNG/17_localization_timeline.png',
    svgPath: '/cmd/charts/SVG/17_localization_timeline.svg',
  },
  {
    id: 'confidence-levels',
    filename: '18_confidence_levels',
    title: 'Confidence-Level Distribution Across Data Categories',
    chapter: 'Chapter 1 (Methodology)',
    description: 'Stacked bar chart showing % of findings classified as Verified / Reasoned / Strategic Inference across 8 data categories.',
    pngPath: '/cmd/charts/PNG/18_confidence_levels.png',
    svgPath: '/cmd/charts/SVG/18_confidence_levels.svg',
  },
  {
    id: 'export-potential',
    filename: '19_export_potential',
    title: 'Export Potential vs Current Performance — 12 Strategic Categories',
    chapter: 'Chapter 3 (EPI) + Chapter 6',
    description: 'Paired horizontal bar chart showing FY2024 actual vs FY2030 potential exports with growth multiplier annotations.',
    pngPath: '/cmd/charts/PNG/19_export_potential.png',
    svgPath: '/cmd/charts/SVG/19_export_potential.svg',
  },
  {
    id: 'multiplier',
    filename: '20_multiplier',
    title: 'Industrial Output Multiplier by Sector',
    chapter: 'Chapter 3 (IMI) + Chapter 10 (Investment)',
    description: 'Bar chart showing economy-wide GVA multiplier for 12 sectors; semiconductors and aeroengines top at 7-8x.',
    pngPath: '/cmd/charts/PNG/20_multiplier.png',
    svgPath: '/cmd/charts/SVG/20_multiplier.svg',
  },
  {
    id: 'tech-roadmap',
    filename: '21_tech_roadmap',
    title: 'Techadyant Technology Evolution Roadmap — 8 Tracks × 4 Milestones',
    chapter: 'Chapter 8 (Technology) + Chapter 13',
    description: 'Multi-track timeline chart showing 32 technology milestones across 2026-2035 for 8 manufacturing technology tracks.',
    pngPath: '/cmd/charts/PNG/21_tech_roadmap.png',
    svgPath: '/cmd/charts/SVG/21_tech_roadmap.svg',
  },
  {
    id: 'breakeven',
    filename: '22_breakeven',
    title: 'Plant Economics — Capex vs Breakeven Period for 10 Strategic Projects',
    chapter: 'Chapter 10 (Investment)',
    description: 'Log-scale paired bar chart showing capex and breakeven years for 10 manufacturing project archetypes.',
    pngPath: '/cmd/charts/PNG/22_breakeven.png',
    svgPath: '/cmd/charts/SVG/22_breakeven.svg',
  },
  {
    id: 'policy-effectiveness',
    filename: '23_policy_effectiveness',
    title: 'PLI Scheme Effectiveness — Incentive Utilisation Rate',
    chapter: 'Chapter 9 (Policy)',
    description: 'Horizontal bar chart with 50% target line showing utilisation % across 12 PLI schemes, color-coded by performance.',
    pngPath: '/cmd/charts/PNG/23_policy_effectiveness.png',
    svgPath: '/cmd/charts/SVG/23_policy_effectiveness.svg',
  },
  {
    id: 'decomp-tree',
    filename: '24_decomp_tree',
    title: 'Decomposition Tree — 28nm Logic IC',
    chapter: 'Chapter 2 (Taxonomy)',
    description: 'Hierarchical tree diagram showing 4-layer decomposition: Root → Subsystems → Components → Raw Inputs.',
    pngPath: '/cmd/charts/PNG/24_decomp_tree.png',
    svgPath: '/cmd/charts/SVG/24_decomp_tree.svg',
  },
  {
    id: 'capability-gap',
    filename: '25_capability_gap',
    title: 'Semiconductor Capability Maturity Gap — India vs China vs Taiwan',
    chapter: 'Chapter 3 (ICGI) + Chapter 4.1',
    description: 'Grouped bar chart across 16 industrial capabilities showing India severely lagging in equipment manufacturing.',
    pngPath: '/cmd/charts/PNG/25_capability_gap.png',
    svgPath: '/cmd/charts/SVG/25_capability_gap.svg',
  },
  {
    id: 'dependency-matrix',
    filename: '26_dependency_matrix',
    title: 'Strategic Dependency Matrix — Import Value vs Supply Risk',
    chapter: 'Chapter 13 (Frameworks)',
    description: '4-quadrant bubble chart with capex-as-bubble-size, plotting 18 critical imports on import value vs supply risk axes.',
    pngPath: '/cmd/charts/PNG/26_dependency_matrix.png',
    svgPath: '/cmd/charts/SVG/26_dependency_matrix.svg',
  },
  {
    id: 'capex-pipeline',
    filename: '27_capex_pipeline',
    title: 'Projected Capex Pipeline by Sector — FY2026-FY2035',
    chapter: 'Chapter 10 (Investment)',
    description: 'Stacked area chart showing annual capex projections across 5 sectors over the 10-year horizon.',
    pngPath: '/cmd/charts/PNG/27_capex_pipeline.png',
    svgPath: '/cmd/charts/SVG/27_capex_pipeline.svg',
  },
  {
    id: 'employment',
    filename: '28_employment',
    title: 'Employment Generation Potential by Sector — Direct + Indirect',
    chapter: 'Chapter 10 (Investment)',
    description: 'Stacked horizontal bar chart showing direct and indirect/induced job creation potential (lakh jobs) for 12 sectors.',
    pngPath: '/cmd/charts/PNG/28_employment.png',
    svgPath: '/cmd/charts/SVG/28_employment.svg',
  },
  {
    id: 'ecosystem-scatter',
    filename: '29_ecosystem_scatter',
    title: 'Cluster Ecosystem Density vs Maturity — 16 Industrial Clusters',
    chapter: 'Chapter 7 (Clusters)',
    description: '4-quadrant scatter plot positioning 16 Indian industrial clusters on ecosystem density vs manufacturing maturity.',
    pngPath: '/cmd/charts/PNG/29_ecosystem_scatter.png',
    svgPath: '/cmd/charts/SVG/29_ecosystem_scatter.svg',
  },
  {
    id: 'security-matrix',
    filename: '30_security_matrix',
    title: 'National Security Relevance Matrix — Defence-Critical Imports',
    chapter: 'Chapter 3 (NSRI) + Chapter 4.2',
    description: '4-quadrant scatter plot of 16 defence-critical imports on strategic importance vs localization difficulty axes.',
    pngPath: '/cmd/charts/PNG/30_security_matrix.png',
    svgPath: '/cmd/charts/SVG/30_security_matrix.svg',
  },
];

export const sections: CmdSection[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    body: 'A chart-first landing view of India’s critical manufacturing dependency picture: import surface, trade deficit, top source countries, and the headline dependency distribution.',
    charts: charts.filter((c) =>
      ['import-surface', 'deficit-donut', 'top-sources', 'dependency-distribution', 'import-trend'].includes(c.id),
    ),
  },
  {
    id: 'policy',
    title: 'Policy & economics',
    body: 'PLI effectiveness, capex pipeline, breakeven economics, investment opportunity, and export potential — the policy and capital layer beneath localization.',
    charts: charts.filter((c) =>
      ['pli-performance', 'capex-pipeline', 'breakeven', 'investment-opportunity', 'export-potential', 'multiplier', 'employment'].includes(c.id),
    ),
  },
  {
    id: 'sectors',
    title: 'Sector deep dives',
    body: 'Semiconductors, EV/battery, and sector-level decomposition — where imports concentrate, which links are missing, and how far domestic substitution has progressed.',
    charts: charts.filter((c) =>
      ['semi-decomposition', 'ev-value-chain', 'supply-heatmap'].includes(c.id),
    ),
  },
  {
    id: 'clusters',
    title: 'Clusters, states & geography',
    body: 'Where manufacturing capability actually sits: industrial clusters, state capability rankings, and ecosystem maturity.',
    charts: charts.filter((c) =>
      ['cluster-map', 'state-rankings', 'ecosystem-scatter'].includes(c.id),
    ),
  },
  {
    id: 'frameworks',
    title: 'Frameworks & indices',
    body: 'Proprietary Techadyant indices — localization priority, dependency matrix, 10-index profile, technology roadmap, and national-security relevance.',
    charts: charts.filter((c) =>
      ['localization-matrix', 'dependency-matrix', 'index-spider', 'tech-roadmap', 'security-matrix', 'localization-timeline', 'confidence-levels'].includes(c.id),
    ),
  },
  {
    id: 'benchmarks',
    title: 'Benchmarks & comparators',
    body: 'International benchmarks for manufacturing value added and technology readiness — the baseline against which India’s position is scored.',
    charts: charts.filter((c) => ['country-mva', 'tech-radar'].includes(c.id)),
  },
];

export const syncedAt = '2026-07-31T10:00:13.300366';

export function chartById(id: string): CmdChart | undefined {
  return charts.find((c) => c.id === id);
}

export function sectionById(id: string): CmdSection | undefined {
  return sections.find((s) => s.id === id);
}
