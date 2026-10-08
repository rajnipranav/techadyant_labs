// Projection from WGS84 to the canonical India-outline SVG space used across the site
// (app/corridors/data.ts: VIEWBOX "0 0 550 563.58"). Fitted by least squares on the 38
// corridor nodes that carry both an SVG `coords` pair (node-data.ts) and a WGS84 point
// (geo.ts); median residual ≈ 1–2 SVG units. Good for a schematic map, not for measurement.
export const projectToSvg = (lat: number, lng: number): [number, number] => [
  14.5623 * lng - 955.12,
  -15.608 * lat + 648.469,
];
