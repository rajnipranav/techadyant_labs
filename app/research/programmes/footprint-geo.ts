// Fallback geometry for the programme footprint map. Bharatmala roads are drawn from
// data/programme-intelligence/bharatmala-routes.json (snapped onto NHAI's map by
// scripts/extract-bharatmala-network.py) when available; these guides seed that snap and
// cover the rest. Linear assets (expressways, tunnels) are
// not point-located in the registry, and some Sagarmala ports carry no coordinates. Everything
// here is a public place-name position, good to roughly ±10–20 km, joined by STRAIGHT SEGMENTS
// between towns the route is reported to pass through. It is not the surveyed alignment and must never be used for measurement.
// Each entry is [lat, lng]. Towns per route were checked against public route descriptions
// (Wikipedia pages for each expressway; themetrorailguy.com route/status pages; NHAI package
// names for Raipur–Visakhapatnam; Tribune reports for Delhi–Amritsar–Katra) on 2026-10-11.
// Sources disagree on lengths and some stretches are still being re-aligned, which is why a
// route is a chain of town-to-town segments and never a drawn alignment.
export const LINEAR_GEO: Record<string, { path: [number, number][]; note: string }> = {
  'infra:ne8-ahmedabad-dholera-expressway': { path: [[22.98, 72.5], [22.83, 72.36], [22.3, 72.19]], note: 'Ahmedabad (Sarkhej) via Bavla to Dholera' },
  'infra:bengaluru-chennai-expressway': {
    path: [[13.07, 77.8], [13.0, 77.94], [12.99, 78.18], [13.2, 78.75], [13.22, 79.1], [12.92, 79.36], [13.08, 79.67], [12.83, 79.7], [12.97, 79.95]],
    note: 'Hoskote, Malur, Bangarapet, Palamaner, Chittoor, Walajahpet, Arakkonam, Kancheepuram, Sriperumbudur',
  },
  'infra:delhi-mumbai-expressway': {
    path: [[28.58, 77.3], [28.25, 77.07], [26.89, 76.34], [26.02, 76.35], [25.18, 75.84], [24.33, 75.62], [23.33, 75.04], [22.78, 73.6], [22.31, 73.18], [21.17, 72.83], [19.46, 72.8], [18.945, 72.94]],
    note: 'DND Flyway (Delhi), Sohna, Dausa, Sawai Madhopur, Kota, Garoth, Ratlam, Godhra, Vadodara, Surat, Virar, JNPA',
  },
  'infra:delhi-amritsar-katra-expressway': {
    path: [[28.69, 76.93], [29.8, 76.1], [29.95, 76.0], [30.25, 75.84], [31.38, 75.38], [31.63, 74.87], [32.04, 75.4], [32.99, 74.93]],
    note: 'Bahadurgarh, Kalayat, Patran, Sangrur, Kapurthala, Amritsar, Gurdaspur, Katra. The Amritsar link has been revised, so this stretch is the least certain',
  },
  'infra:amritsar-jamnagar-expressway': {
    path: [[31.63, 74.87], [30.21, 74.95], [29.8, 74.47], [28.02, 73.31], [26.28, 73.02], [24.75, 71.77], [23.77, 71.18], [23.3, 70.51], [22.47, 70.07]],
    note: 'Amritsar / Tibba, Bathinda, Sangaria, Bikaner, Jodhpur, Sanchore, Santalpur, Samakhiali, Jamnagar',
  },
  'infra:raipur-visakhapatnam-ec': {
    path: [[21.05, 81.76], [20.71, 81.55], [20.27, 81.49], [19.6, 81.66], [19.1, 82.2], [18.81, 82.71], [18.11, 83.4], [17.8, 83.12], [17.69, 83.22]],
    note: 'Abhanpur (Raipur), Dhamtari, Kanker, Kondagaon, Umerkote, Koraput, Vizianagaram, Sabbavaram, Visakhapatnam',
  },
  'infra:dwarka-expressway': { path: [[28.545, 77.115], [28.552, 77.06], [28.48, 77.01], [28.395, 76.985]], note: 'Shiv Murti (Delhi) via Dwarka to Kherki Daula (Gurugram)' },
  'infra:zojila-tunnel': { path: [[34.285, 75.42], [34.28, 75.5]], note: 'Baltal (Sonamarg side) to Minamarg' },
};

/** Sagarmala registry ports with no coordinates on file: town-level positions only. */
export const PORT_FALLBACK: Record<string, [number, number]> = {
  'sgport:sikka': [22.43, 69.83],
  'sgport:dahej': [21.7, 72.53],
  'sgport:magdalla': [21.15, 72.73],
  'sgport:dharamtar': [18.73, 73.0],
  'sgport:kakinada-dw': [16.97, 82.32],
  'sgport:gopalpur': [19.26, 84.91],
};

/** Ports named on the "String of Ports in India" slide (JNPA / PIB Mumbai Sagarmala deck,
 *  src:pib-mumbai-sagarmala-vision) that are not in the Atlas port registry. Names are the
 *  slide's; positions are town-level and set by Techadyant (±10–20 km). */
export const LISTED_PORTS: { name: string; state: string; lat: number; lng: number }[] = [
  { name: 'Jakhau', state: 'Gujarat', lat: 23.22, lng: 68.72 }, { name: 'Mandvi', state: 'Gujarat', lat: 22.83, lng: 69.35 },
  { name: 'Salaya', state: 'Gujarat', lat: 22.32, lng: 69.6 }, { name: 'Okha', state: 'Gujarat', lat: 22.47, lng: 69.07 },
  { name: 'Pindhara', state: 'Gujarat', lat: 22.2, lng: 69.15 }, { name: 'Bedi', state: 'Gujarat', lat: 22.47, lng: 70.02 },
  { name: 'Porbandar', state: 'Gujarat', lat: 21.64, lng: 69.61 }, { name: 'Veraval', state: 'Gujarat', lat: 20.91, lng: 70.37 },
  { name: 'Jafrabad', state: 'Gujarat', lat: 20.87, lng: 71.37 }, { name: 'Bhavnagar', state: 'Gujarat', lat: 21.77, lng: 72.15 },
  { name: 'Honavar', state: 'Karnataka', lat: 14.28, lng: 74.44 }, { name: 'Malpe', state: 'Karnataka', lat: 13.35, lng: 74.7 },
  { name: 'Kozhikode (Calicut)', state: 'Kerala', lat: 11.25, lng: 75.77 }, { name: 'Alappuzha (Alleppey)', state: 'Kerala', lat: 9.49, lng: 76.33 },
  { name: 'Neendakara', state: 'Kerala', lat: 8.94, lng: 76.55 }, { name: 'Kollam (Quilon)', state: 'Kerala', lat: 8.89, lng: 76.58 },
  { name: 'Colachel', state: 'Tamil Nadu', lat: 8.17, lng: 77.25 }, { name: 'Cuddalore', state: 'Tamil Nadu', lat: 11.75, lng: 79.77 },
  { name: 'Puducherry (Pondicherry)', state: 'Puducherry', lat: 11.93, lng: 79.83 }, { name: 'Nagapattinam', state: 'Tamil Nadu', lat: 10.77, lng: 79.84 },
  { name: 'Machilipatnam', state: 'Andhra Pradesh', lat: 16.17, lng: 81.14 },
];

/** Dedicated freight corridors, drawn through the stations they are known to pass. Schematic. */
export const FREIGHT_GEO: Record<string, { name: string; note: string; path: [number, number][] }> = {
  wdfc: { name: 'Western Dedicated Freight Corridor (Dadri–JNPA)', note: 'Dadri, Rewari, Phulera, Marwar Jn, Palanpur, Mahesana, Sanand, Vadodara, Bharuch, Surat, Vaitarna to JNPA. Ends at JNPA, a major Sagarmala port.',
    path: [[28.55, 77.55], [28.19, 76.62], [26.87, 75.24], [25.73, 73.62], [24.17, 72.43], [23.6, 72.38], [22.99, 72.38], [22.3, 73.18], [21.7, 72.99], [21.1, 72.85], [19.6, 72.92], [18.945, 72.94]] },
  edfc: { name: 'Eastern Dedicated Freight Corridor (Ludhiana–Dankuni)', note: 'Ludhiana, Ambala, Saharanpur, Khurja, Tundla, Kanpur, Prayagraj, Pt DDU Nagar, Sonnagar to Dankuni, near Kolkata port.',
    path: [[30.9, 75.85], [30.38, 76.78], [29.97, 77.55], [28.25, 77.85], [27.2, 78.2], [26.45, 80.35], [25.43, 81.85], [25.28, 83.12], [24.95, 84.07], [22.7, 88.3]] },
};
