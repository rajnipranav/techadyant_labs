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
