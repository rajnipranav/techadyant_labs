// Schematic geometry for the programme footprint map. Linear assets (expressways, tunnels) are
// not point-located in the registry, and some Sagarmala ports carry no coordinates. Everything
// here is a public place-name position, good to roughly ±10–20 km, drawn as a STRAIGHT LINE
// between named termini. It is not the alignment and must never be used for measurement.
// Each entry is [lat, lng].
export const LINEAR_GEO: Record<string, { path: [number, number][]; note: string }> = {
  'infra:ne8-ahmedabad-dholera-expressway': { path: [[22.98, 72.5], [22.24, 72.19]], note: 'Ahmedabad (Sarkhej) to Dholera' },
  'infra:bengaluru-chennai-expressway': { path: [[13.07, 77.8], [12.97, 79.95]], note: 'Hoskote (Bengaluru) to Sriperumbudur (Chennai)' },
  'infra:delhi-mumbai-expressway': { path: [[28.37, 77.06], [18.945, 72.94]], note: 'Delhi NCR (Sohna) to JNPA, Mumbai' },
  'infra:delhi-amritsar-katra-expressway': { path: [[28.69, 76.93], [31.63, 74.87], [32.99, 74.93]], note: 'Delhi to Amritsar to Katra' },
  'infra:amritsar-jamnagar-expressway': { path: [[31.63, 74.87], [22.47, 70.07]], note: 'Amritsar to Jamnagar' },
  'infra:raipur-visakhapatnam-ec': { path: [[21.25, 81.63], [17.69, 83.22]], note: 'Raipur to Visakhapatnam' },
  'infra:dwarka-expressway': { path: [[28.55, 77.03], [28.39, 76.98]], note: 'Shiv Murti (Delhi) to Kherki Daula (Gurugram)' },
  'infra:zojila-tunnel': { path: [[34.28, 75.5]], note: 'Zojila pass, Sonamarg area' },
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
