export interface Theme {
  id: string;
  no: string;
  title: string;
  blurb: string;
  accent: string;
  count: string;
  icon: 'chip' | 'grid' | 'signal' | 'map';
}

export const themes: Theme[] = [
  {
    id: 'semiconductors',
    no: '01',
    title: 'Semiconductor Ecosystems',
    blurb:
      'Fabrication, assembly and test, advanced packaging, materials and the industrial dependencies that determine who captures value as India builds chip capability.',
    accent: '#F5B544',
    count: '1 report · 1 signal',
    icon: 'chip',
  },
  {
    id: 'infrastructure',
    no: '02',
    title: 'Industrial Infrastructure',
    blurb:
      'Power, water, land, logistics and the physical substrate of manufacturing corridors — the systems that quietly govern whether industrial policy converts into output.',
    accent: '#6366F1',
    count: '2 forthcoming',
    icon: 'grid',
  },
  {
    id: 'strategic-tech',
    no: '03',
    title: 'Strategic Technology',
    blurb:
      'AI infrastructure, compute, energy systems and the dual-use frontier where technology, industrial capacity and national strategy intersect.',
    accent: '#38e1c4',
    count: '1 signal',
    icon: 'signal',
  },
  {
    id: 'economic-geography',
    no: '04',
    title: 'Economic Geography',
    blurb:
      'Where value concentrates and why — the spatial logic of clusters, corridors and second-order economic effects across India’s industrial map.',
    accent: '#818CF8',
    count: 'In development',
    icon: 'map',
  },
];
