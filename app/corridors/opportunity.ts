// Sector -> supplier-opportunity taxonomy ("what this node pulls").
// Derived from the Dholera Supplier Ecosystem research (which carries verified
// import-dependency and TAM data) and generalized across sector families.
// Rendered on every node page as an indicative opportunity surface: layers the
// node's anchor ecosystem typically pulls, NOT node-specific verified commitments.
// Depth tiers mirror the Dholera map: deep (researched) vs first-pass (modelled).

export interface PullLayer {
  layer: string;
  status: string;   // e.g. 'Import-dependent', 'Localising', 'Local base exists'
  what: string;     // what the anchor ecosystem pulls
  importDep?: number; // indicative import-dependency % (from sector research where available)
  tier: 'Build-now' | 'Position-early' | 'Watch';
}

export interface SectorPull {
  keys: string[];            // keywords matched against node.sectors
  label: string;
  note: string;
  layers: PullLayer[];
}

const L = (layer: string, status: string, what: string, tier: PullLayer['tier'], importDep?: number): PullLayer => ({
  layer, status, what, tier, importDep,
});

export const SECTOR_PULLS: SectorPull[] = [
  {
    keys: ['semiconductor', 'electronics', 'esdm', 'osat', 'atmp', 'packaging', 'chip', 'fab'],
    label: 'Semiconductor & electronics',
    note: 'A fab or OSAT anchor pulls a ~500-supplier cascade: bulk utilities localise first, while electronic-grade materials, metrology and specialist services stay 75-98% import-dependent - the opportunity band.',
    layers: [
      L('Ultrapure water (UPW) systems', 'Localised (strong Indian base)', 'Design, build, operate and zero-liquid-discharge for wafer/package plants', 'Build-now', 45),
      L('Bulk gases (N2/O2/Ar)', 'Localised (Indian JVs active)', 'On-site air-separation and baseload gas supply', 'Build-now', 30),
      L('Equipment calibration (NABL) & maintenance', 'Near-absent / OEM-captive', 'Accredited on-site calibration labs; spares + field service independent of AMAT/Lam/TEL', 'Build-now', 90),
      L('Electronic specialty gases', 'Distributor-only for electronic grade', 'NF3/WF6/HCDS/C4F6 - captive on-site electronic-gas plants', 'Position-early', 92),
      L('Electronic wet chemicals & CMP slurry', 'Distributor-only', 'Developers, precursors, slurry - import substitution', 'Position-early', 88),
      L('Metrology, test & failure analysis', 'Service-led opening', 'Metrology-as-a-service labs for every fab/OSAT', 'Position-early', 75),
      L('Cleanroom engineering & consumables', 'Partial (EPC local, materials imported)', 'HEPA/ULPA, garments, wipes, filter media', 'Position-early', 60),
      L('Advanced packaging / OSAT services', 'Moving (Micron/Tata/Kaynes)', 'Assembly, test, substrate supply into anchor plants', 'Position-early', 55),
      L('Photoresist & wafer handling (FOUPs)', 'Import-only', 'High-IP, long-horizon strategic items', 'Watch', 96),
    ],
  },
  {
    keys: ['ev', 'electric vehicle', 'auto', 'automobile', 'e-mobility', 'components'],
    label: 'EV & automotive',
    note: 'An auto/EV anchor pulls mechanical depth (forgings, machining, tooling) first, then the electrified layers - cells, motors, power electronics - that are still largely imported.',
    layers: [
      L('Precision machining & forgings', 'Local base exists', 'CNC machining, forgings, castings, fasteners into Tier-1 supply', 'Build-now', 45),
      L('Tooling, dies & moulds', 'Localising', 'Press tools, injection moulds for body and interior programs', 'Build-now', 60),
      L('Battery packs & cell components', 'Import-dependent', 'Cell hardware (foils, tabs, casings); pack assembly localises first', 'Position-early', 70),
      L('Motors, controllers & power electronics', 'Import-heavy', 'EV powertrain electronics and thermal management', 'Position-early', 80),
      L('Cathode/anode active material', 'Import-only', 'Highest-value cell input; localisation once cell volume is real', 'Position-early', 95),
      L('Wiring harnesses & connectors', 'Localising', 'High-labour, high-volume content that anchors fast', 'Build-now', 50),
      L('Testing, calibration & EMC labs', 'Partial', 'Agnostic to OEM - every plant needs certified validation', 'Build-now', 55),
      L('Battery recycling (black mass to metals)', 'Green-field', 'Domestic route to Li/Co/Ni that shortcuts refining', 'Build-now', 75),
    ],
  },
  {
    keys: ['aerospace', 'defence', 'defense', 'mro'],
    label: 'Aerospace & defence',
    note: 'Assembly and MRO pull immediate demand; aerostructures, special alloys and avionics content is the deeper, slower prize.',
    layers: [
      L('MRO & line maintenance', 'Green-field opening', 'Airport-linked demand from day one', 'Build-now', 70),
      L('Precision machining & forgings', 'Local base exists', 'Landing-gear, engine and structural components (Bharat Forge/HAL base)', 'Position-early', 60),
      L('Aerostructures & composite assemblies', 'Emerging Indian base', 'Fuselage/wing sections; Tata/Dynamatic give a running start', 'Position-early', 75),
      L('Special alloys & raw materials', 'Import-heavy', 'Titanium, high-temp alloys, PAN-precursor carbon fibre', 'Position-early', 85),
      L('Cabin interiors & seats', 'Lower barrier', 'Regional-jet interiors as a first venture', 'Build-now', 65),
      L('Avionics & flight systems', 'Import-only', 'Certification-locked oligopoly; long horizon', 'Watch', 90),
    ],
  },
  {
    keys: ['pharma', 'bulk drug', 'api', 'drug'],
    label: 'Pharma & bulk drugs',
    note: 'An API or pharma anchor pulls process-engineering depth - cleanrooms, solvent recovery, analytical labs - plus logistics that are heavily import-served today.',
    layers: [
      L('Cleanroom EPC & HVAC', 'Local EPC exists', 'Class 100k-10k suites, materials partly imported', 'Build-now', 50),
      L('Analytical & QC labs', 'Service-led opening', 'HPLC/GC, microbiology - every unit needs certified testing', 'Build-now', 60),
      L('Specialty glass & primary packaging', 'Import-heavy', 'Vials, ampoules, stoppers, films', 'Position-early', 75),
      L('API intermediates & solvents', 'Import-dependent', 'Backward integration into key starting materials', 'Position-early', 80),
      L('Solvent recovery & ZLD water', 'Local base', 'Environmental compliance as a service business', 'Build-now', 45),
      L('Cold-chain & pharma logistics', 'Localising', 'Temperature-controlled distribution', 'Position-early', 55),
    ],
  },
  {
    keys: ['textile', 'spinning', 'apparel'],
    label: 'Textiles & spinning',
    note: 'Spinning and garment anchors pull machinery consumables, dyes and chemicals (largely imported), automation and effluent compliance.',
    layers: [
      L('Machinery spares & consumables', 'Import-dependent', 'Spinning rings, travellers, combs, cards', 'Build-now', 70),
      L('Dyes, chemicals & auxiliaries', 'Import-heavy', 'Reactive dyes, finishes - substitution play', 'Position-early', 75),
      L('Automation & quality inspection', 'Opening', 'Vision inspection, auto-sorting for fabric/garment', 'Build-now', 60),
      L('Effluent treatment & recycling', 'Local base', 'Zero-liquid-discharge compliance services', 'Build-now', 40),
      L('Testing labs (fabric/garment)', 'Partial', 'Certified physical + chemical testing', 'Position-early', 55),
    ],
  },
  {
    keys: ['logistics', 'multi-modal', 'multimodal', 'port', 'freight'],
    label: 'Logistics & multi-modal',
    note: 'A multi-modal hub pulls handling, storage and automation infrastructure plus the telematics and compliance layer around it.',
    layers: [
      L('Warehouse automation', 'Localising', 'ASRS, sortation, WMS integration', 'Build-now', 55),
      L('Material handling & cranes', 'Local base', 'EOT cranes, reach stackers, container handling', 'Build-now', 50),
      L('Cold chain & reefer', 'Partial', 'Temperature-controlled storage and transport', 'Position-early', 65),
      L('Telematics & fleet management', 'India strength', 'Track-and-trace, compliance, e-way bill automation', 'Build-now', 35),
      L('Container freight & ICD services', 'Established', 'Third-party logistics into the corridor', 'Build-now', 40),
    ],
  },
  {
    keys: ['steel', 'metal', 'metals'],
    label: 'Steel & metals',
    note: 'A metals anchor pulls industrial gases, refractories, rolling consumables and heavy lifting - mature demand, capital-light service openings.',
    layers: [
      L('Industrial gases (O2/N2/Ar)', 'Local base', 'On-site supply for steelmaking', 'Build-now', 30),
      L('Refractories & consumables', 'Import-dependent', 'High-grade refractories, rolls, shear blades', 'Position-early', 70),
      L('EOT cranes & material handling', 'Local base', 'Heavy lifting, slag handling', 'Build-now', 45),
      L('Testing labs (metallurgy)', 'Service-led', 'UT, NDT, chemistry - compliance backbone', 'Build-now', 50),
      L('Scrap processing & recycling', 'Opening', 'Feedstock security for EAF routes', 'Position-early', 60),
    ],
  },
  {
    keys: ['petrochemical', 'chemical', 'polymer'],
    label: 'Petrochemicals & downstream',
    note: 'A petrochemical anchor pulls downstream conversion, tankage and inspection services more than greenfield capacity.',
    layers: [
      L('Polymer conversion & compounding', 'Import-dependent', 'Downstream products from anchor feedstocks', 'Position-early', 75),
      L('Storage, tankage & EPC', 'Local EPC exists', 'Terminal and inter-plant logistics', 'Position-early', 55),
      L('Inspection & NDT services', 'Service-led', 'Statutory + integrity inspection', 'Build-now', 50),
      L('Specialty additives & catalysts', 'Import-only', 'High-IP chemistry inputs', 'Watch', 90),
      L('Effluent & waste management', 'Local base', 'Compliance + recovery services', 'Build-now', 45),
    ],
  },
  {
    keys: ['medical device', 'medical'],
    label: 'Medical devices',
    note: 'A medical-device anchor pulls precision machining, sterilization and regulatory testing - services-first, materials later.',
    layers: [
      L('Precision machining & implants', 'Localising', 'CNC, Swiss machining, finishing', 'Build-now', 55),
      L('Sterilization services', 'Green-field', 'Gamma/ETO capacity around device clusters', 'Build-now', 70),
      L('Regulatory & testing labs', 'Service-led', 'BIS, ISO 13485, biocompatibility testing', 'Build-now', 60),
      L('Polymers & specialty materials', 'Import-heavy', 'Medical-grade resins, tubing, films', 'Position-early', 80),
      L('Cleanroom packaging', 'Partial', 'Sterile barrier systems', 'Position-early', 65),
    ],
  },
  {
    keys: ['machine tool', 'engineering', 'manufacturing'],
    label: 'General engineering & machine tools',
    note: 'Engineering anchors pull tooling consumables, metrology and precision components; the services layer is the fastest entry point.',
    layers: [
      L('CNC components & tooling', 'Localising', 'Cutting tools, holders, fixtures', 'Build-now', 55),
      L('Metrology & calibration labs', 'Service-led', 'CMM, gauges - agnostic to OEM', 'Build-now', 60),
      L('Hydraulics & pneumatics', 'Import-dependent', 'Actuators, valves, seals', 'Position-early', 70),
      L('Surface treatment & coatings', 'Partial', 'Plating, anodising, thermal spray', 'Build-now', 50),
      L('Industrial automation', 'India strength', 'Robotics integration, PLC/SCADA', 'Build-now', 40),
    ],
  },
  {
    keys: ['it/ites', 'software', 'datacentre', 'data centre', 'digital'],
    label: 'IT / data-centre infrastructure',
    note: 'Digital anchors are constrained by power, cooling and water - not land; the physical-infrastructure and software layers are the local opportunity.',
    layers: [
      L('Power & switchgear', 'Partly localised', 'UPS, transformers, switchgear at AI scale', 'Position-early', 50),
      L('Liquid cooling systems', 'Import-heavy', 'AI racks force liquid cooling from day one', 'Build-now', 85),
      L('DCIM & orchestration software', 'India strength', 'Low capital, high stickiness', 'Build-now', 30),
      L('Modular / prefab DC construction', 'Local EPC', 'Speed-to-power favours modular builds', 'Build-now', 40),
      L('Cooling-water & ZLD', 'Local base', 'Water-tech tied to industrial water grids', 'Build-now', 45),
    ],
  },
  {
    keys: ['agro', 'food', 'marine', 'aquaculture', 'leather'],
    label: 'Agro / food / marine processing',
    note: 'Processed-food and marine anchors pull cold chain, hygiene-certified packaging and quality labs - compliance-led opportunity.',
    layers: [
      L('Cold chain & reefer', 'Partial', 'Pre-cooling, cold storage, reefer transport', 'Build-now', 60),
      L('Processing machinery & lines', 'Import-dependent', 'Sorting, filleting, freezing lines', 'Position-early', 75),
      L('Hygienic packaging', 'Localising', 'Food-grade films, trays, aseptic systems', 'Position-early', 55),
      L('Quality & food-safety labs', 'Service-led', 'FSSAI-aligned testing', 'Build-now', 50),
      L('Effluent & waste recovery', 'Local base', 'High-BOD treatment, by-product recovery', 'Build-now', 45),
    ],
  },
];

// Match a node's sector string to taxonomy entries; returns matched pulls (max 2).
export function pullsFor(sectors: string): SectorPull[] {
  const s = (sectors || '').toLowerCase();
  const hits = SECTOR_PULLS.filter((p) => p.keys.some((k) => s.includes(k)));
  return hits.slice(0, 2);
}
