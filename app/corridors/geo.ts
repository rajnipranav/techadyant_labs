// Corridor GIS geometry (WGS84 lon,lat). SINGLE geometry source for the MapLibre map.
// Attributes/scores/status live in node-data.ts + corridor-intel.ts — NEVER duplicate them here.
// coord source: 'gis' = from the GIS package; 'gazetteer' = real town centroid supplied in
// reconciliation. All are centroid-approximate — refine node points / corridor lines in QGIS.
// Regenerate: industrial corridors/reconcile/ (extract.js + reconcile.py). Keyed 'corridor/nodeSlug'.

export type CoordSource = 'gis' | 'gazetteer' | 'affine';
export interface NodeGeo { c: [number, number]; src: CoordSource; }

export const nodeGeo: Record<string, NodeGeo> = {
  "amritsar-kolkata/rajpura-patiala": { c: [76.59, 30.484], src: "gazetteer" },
  "amritsar-kolkata/hisar": { c: [75.7217, 29.1492], src: "gazetteer" },
  "amritsar-kolkata/khurpia": { c: [79.52, 28.91], src: "gazetteer" },
  "amritsar-kolkata/agra": { c: [78.0081, 27.1767], src: "gazetteer" },
  "amritsar-kolkata/prayagraj": { c: [81.8463, 25.4358], src: "gazetteer" },
  "amritsar-kolkata/gaya": { c: [84.9994, 24.7969], src: "gazetteer" },
  "amritsar-kolkata/jharkhand": { c: [86.1511, 23.6693], src: "gazetteer" },
  "amritsar-kolkata/raghunathpur": { c: [86.63, 23.55], src: "gazetteer" },
  // Corrected 2026-08-02: was [72.61, 22.25] (~42 km east in Gulf of Khambhat).
  // Now activation-area centroid from verified plus-code coordinates.
  "delhi-mumbai/dholera-sir": { c: [72.194, 22.240], src: "verified" },
  "delhi-mumbai/auric-shendra-bidkin": { c: [75.86, 19.99], src: "gis" },
  "delhi-mumbai/iitgnl-greater-noida": { c: [77.5, 28.47], src: "gis" },
  "delhi-mumbai/vikram-udyogpuri": { c: [75.7873, 23.1765], src: "gis" },
  "delhi-mumbai/nangal-chaudhary-imlh": { c: [76.25, 28.02], src: "gis" },
  "delhi-mumbai/dadri-boraki": { c: [77.55, 28.55], src: "gis" },
  "delhi-mumbai/jodhpur-pali-marwar": { c: [73.7, 26.18], src: "gis" },
  "delhi-mumbai/khushkhera-bhiwadi-neemrana": { c: [76.35, 27.7], src: "gis" },
  "delhi-mumbai/dighi-port": { c: [72.95, 18.25], src: "gis" },
  "vizag-chennai/kopparthy": { c: [78.7, 14.63], src: "gazetteer" },
  "vizag-chennai/visakhapatnam": { c: [83.2185, 17.6868], src: "gis" },
  "vizag-chennai/chittoor": { c: [79.7, 13.75], src: "gazetteer" },
  "vizag-chennai/machilipatnam": { c: [81.1389, 16.1875], src: "gazetteer" },
  "vizag-chennai/donakonda": { c: [79.45, 15.95], src: "gazetteer" },
  "chennai-bengaluru/tumakuru": { c: [77.1, 13.34], src: "gis" },
  "chennai-bengaluru/krishnapatnam": { c: [80.05, 14.25], src: "gazetteer" },
  "chennai-bengaluru/ponneri": { c: [80.2, 13.32], src: "gis" },
  "odisha-economic/gbk": { c: [85.837, 21.51], src: "gazetteer" },
  "odisha-economic/pkds": { c: [86.615, 20.258], src: "gazetteer" },
  "hyderabad-nagpur/zaheerabad": { c: [77.61, 17.68], src: "gazetteer" },
  "hyderabad-warangal/kakatiya-textile-park": { c: [79.5941, 17.9689], src: "gazetteer" },
  "hyderabad-warangal/hyderabad-pharma-city": { c: [78.4867, 17.385], src: "gis" },
  "hyderabad-bengaluru/orvakal": { c: [78.09, 15.66], src: "gazetteer" },
  "hyderabad-bengaluru/kopparthy-hbic": { c: [78.7, 14.63], src: "gazetteer" },
  "bengaluru-mumbai/dharwad": { c: [75.0078, 15.4589], src: "gazetteer" },
  "bengaluru-mumbai/satara": { c: [74.0183, 17.6805], src: "gazetteer" },
  "cbic-kochi-extension/palakkad": { c: [76.6548, 10.7867], src: "gis" },
  "cbic-kochi-extension/salem-dharmapuri": { c: [78.146, 11.6643], src: "gazetteer" },
  "delhi-nagpur/delhi": { c: [77.227, 28.6139], src: "gis" },
  "delhi-nagpur/nagpur": { c: [79.0882, 21.1466], src: "gis" },
};

export const corridorLine: Record<string, [number, number][]> = {
  "delhi-mumbai": [[77.227, 28.6139], [77.0266, 28.4595], [76.6179, 28.1496], [76.3889, 27.4262], [75.7873, 26.9124], [74.6411, 26.4499], [74.3256, 25.9106], [73.68, 24.5833], [73.1812, 23.1765], [72.5714, 23.0225], [73.1812, 22.3094], [72.83, 21.17], [72.61, 22.25], [73.01, 19.25], [73.86, 18.99], [74.65, 17.95], [72.8777, 19.076]],
  "chennai-bengaluru": [[80.2707, 13.0827], [79.9438, 12.9698], [79.71, 12.83], [78.9067, 12.225], [77.825, 12.7416], [78.215, 12.5266], [77.1022, 13.3409], [77.5946, 12.9719]],
  "cbic-kochi-extension": [[77.5946, 12.9719], [77.104, 11.6643], [76.9558, 11.0168], [76.6548, 10.7867], [76.2136, 10.5276], [76.2673, 9.9312]],
  "amritsar-kolkata": [[74.8765, 31.634], [75.5792, 31.326], [75.8573, 30.901], [76.778, 30.378], [77.227, 28.6139], [80.3319, 26.4499], [81.8463, 25.4358], [82.9739, 25.3176], [85.1376, 25.5941], [86.9628, 23.6889], [88.3639, 22.5726]],
  "hyderabad-nagpur": [[78.4867, 17.385], [78.3344, 19.1066], [78.531, 19.6641], [79.0882, 21.1466]],
  "hyderabad-warangal": [[78.4867, 17.385], [79.313, 17.5167], [79.425, 17.725], [79.5941, 17.9689]],
  "hyderabad-bengaluru": [[78.4867, 17.385], [77.9828, 16.7488], [78.0382, 15.8281], [77.5969, 14.6819], [77.494, 13.8337], [77.5946, 12.9719]],
  "bengaluru-mumbai": [[77.5946, 12.9719], [77.1022, 13.3409], [75.1397, 15.3647], [74.4977, 15.8497], [74.2335, 16.6913], [73.8567, 18.5204], [72.8777, 19.076]],
  "vizag-chennai": [[83.2185, 17.6868], [81.8248, 16.9931], [80.648, 16.5062], [80.4534, 16.3067], [79.9739, 14.4426], [80.2707, 13.0827]],
  "odisha-economic": [[85.8245, 20.2961], [85.8985, 20.4625], [86.615, 20.258], [85.837, 21.51], [84.851, 22.229]],
  "delhi-nagpur": [[77.227, 28.6139], [78.0081, 27.1767], [78.1734, 26.2183], [78.5746, 25.4484], [79.0882, 21.1466]],
};
