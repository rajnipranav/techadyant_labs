'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import 'maplibre-gl/dist/maplibre-gl.css';
import { newImcNodes, STAGE, type NodeStage } from './node-data';

// National satellite GIS map plotting all 12 NICDC "12 New Projects" IMCs.
// Same Esri World Imagery + reference-label basemap as the corridor maps, so
// every map on the site reads as one professional GIS family. Markers are
// stage-coloured and link to each IMC's profile page.
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
const shortName = (n: string) => n.replace(/ IMC.*| node.*| \(.*|–.*| NIMZ.*| Port.*/, '').trim();

export function NewImcMap() {
  const ref = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any;
    (async () => {
      const maplibregl = (await import('maplibre-gl')).default;
      if (cancelled || !ref.current) return;
      map = new maplibregl.Map({
        container: ref.current,
        style: {
          version: 8,
          sources: {
            sat: {
              type: 'raster',
              tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
              tileSize: 256,
              attribution: 'Imagery © Esri, Maxar, Earthstar Geographics',
            },
            ref: {
              type: 'raster',
              tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'],
              tileSize: 256,
              attribution: '© Esri',
            },
          },
          layers: [
            { id: 'sat', type: 'raster', source: 'sat' },
            { id: 'ref', type: 'raster', source: 'ref' },
          ],
        },
        center: [80.5, 22.4],
        zoom: 4.1,
        minZoom: 3,
        maxZoom: 12,
        attributionControl: false,
      });
      mapRef.current = map;
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: 'Satellite © Esri, Maxar, Earthstar Geographics' }));

      const ro = new ResizeObserver(() => { if (mapRef.current) mapRef.current.resize(); });
      if (ref.current) ro.observe(ref.current);
      resizeObserverRef.current = ro;

      map.on('load', () => {
        const items = newImcNodes().filter((x) => x.node.coords);
        const fc = {
          type: 'FeatureCollection',
          features: items.map(({ node: n, corridor }) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: n.coords },
            properties: {
              slug: n.slug,
              corridor,
              name: n.name,
              short: shortName(n.name),
              state: n.state,
              stage: n.stage,
              stageColor: STAGE[n.stage as NodeStage].color,
              stageLabel: STAGE[n.stage as NodeStage].label,
              url: `/corridors/${corridor}/${n.slug}/`,
            },
          })),
        };
        map.addSource('imcs', { type: 'geojson', data: fc });
        map.addLayer({
          id: 'imc-points', type: 'circle', source: 'imcs',
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 5, 8, 10],
            'circle-color': ['get', 'stageColor'],
            'circle-stroke-width': 2, 'circle-stroke-color': '#ffffff',
          },
        });
        map.addLayer({
          id: 'imc-labels', type: 'symbol', source: 'imcs', minzoom: 3.8,
          layout: { 'text-field': ['get', 'short'], 'text-size': 11, 'text-offset': [0, 1.2], 'text-anchor': 'top' },
          paint: { 'text-color': '#ffffff', 'text-halo-color': '#1a2b45', 'text-halo-width': 1.8 },
        });

        const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12, maxWidth: '240px' });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.on('mousemove', 'imc-points', (e: any) => {
          map.getCanvas().style.cursor = 'pointer';
          const p = e.features[0].properties;
          popup.setLngLat(e.lngLat).setHTML(`<strong>${esc(p.name)}</strong><br>${esc(p.state)} · ${esc(p.stageLabel)}`).addTo(map);
        });
        map.on('mouseleave', 'imc-points', () => { map.getCanvas().style.cursor = ''; popup.remove(); });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.on('click', 'imc-points', (e: any) => { const u = e.features?.[0]?.properties?.url; if (u) router.push(String(u)); });

        map.fitBounds([[68, 6], [97, 36]], { padding: 40, maxZoom: 5, duration: 0 });
        setReady(true);
      });
    })();

    return () => { cancelled = true; resizeObserverRef.current?.disconnect(); resizeObserverRef.current = null; if (map) map.remove(); };
  }, [router]);

  const items = newImcNodes().filter((x) => x.node.coords);
  const usedStages = Array.from(new Set(items.map((x) => x.node.stage)));

  return (
    <div className="nimap">
      <div
        ref={ref}
        className="nimap-gl"
        role="application"
        aria-label="Satellite map of India's 12 new Integrated Manufacturing Clusters"
      />
      {ready && (
        <div className="nimap-legend">
          {usedStages.map((s) => (
            <span key={s}><i style={{ background: STAGE[s].color }} />{STAGE[s].label}</span>
          ))}
          <span className="nimap-hint">Click any cluster for its profile →</span>
        </div>
      )}
    </div>
  );
}
