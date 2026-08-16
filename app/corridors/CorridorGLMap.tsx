'use client';

// Interactive MapLibre GL map of the 11 corridors + their deep nodes.
// Data is passed in from the server (built by corridor-geojson.ts from the authoritative
// modules), so node-data.ts never enters the client bundle — only the small GeoJSON does.
// Free tiles: OpenFreeMap (no API key). maplibre-gl is imported inside the effect so it
// never runs during SSR / static export.
//
// Modes:
//   default            → national overview, all 11 corridors, tier filter chips.
//   focus=<corridor>   → one corridor + its nodes, fit to bounds, no chips.
//   focus + focusNode  → same, with the node highlighted and a tighter fit.

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { FeatureCollection } from './corridor-geojson';

const TIERS: { key: string; label: string; color?: string }[] = [
  { key: 'all', label: 'All corridors' },
  { key: 'Build-now', label: 'Build-now', color: '#0F8E78' },
  { key: 'Position-early', label: 'Position-early', color: '#B5891E' },
  { key: 'Watch', label: 'Watch', color: '#8593A6' },
];

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));

interface Props {
  corridors: FeatureCollection;
  nodes: FeatureCollection;
  focus?: string;       // corridor slug to isolate
  focusNode?: string;   // node slug to highlight (within focus corridor)
  compact?: boolean;    // shorter map (node pages)
}

export default function CorridorGLMap({ corridors, nodes, focus, focusNode, compact }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const router = useRouter();
  const [tier, setTier] = useState('all');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any;
    (async () => {
      const maplibregl = (await import('maplibre-gl')).default;
      if (cancelled || !ref.current) return;
      map = new maplibregl.Map({
        container: ref.current,
        style: 'https://tiles.openfreemap.org/styles/positron',
        center: [81, 22.5],
        zoom: 3.7,
        minZoom: 3,
        maxZoom: 12,
        attributionControl: false,
      });
      mapRef.current = map;
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: '© OpenFreeMap · © OpenStreetMap contributors' }));

      // Keep the map correct on resize / mobile rotation (MapLibre needs an explicit resize()).
      const ro = new ResizeObserver(() => { if (mapRef.current) mapRef.current.resize(); });
      if (ref.current) ro.observe(ref.current);
      resizeObserverRef.current = ro;

      map.on('load', () => {
        map.addSource('corridors', { type: 'geojson', data: corridors });
        map.addSource('nodes', { type: 'geojson', data: nodes });

        map.addLayer({
          id: 'corridor-lines', type: 'line', source: 'corridors',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': ['get', 'color'], 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 2, 8, 4], 'line-opacity': 0.85 },
        });
        map.addLayer({
          id: 'node-points', type: 'circle', source: 'nodes',
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 4, 8, 9],
            'circle-color': ['get', 'stageColor'],
            'circle-stroke-width': 1.5, 'circle-stroke-color': '#ffffff',
          },
        });
        map.addLayer({
          id: 'node-labels', type: 'symbol', source: 'nodes', minzoom: focus ? 5 : 5.5,
          layout: { 'text-field': ['get', 'name'], 'text-size': 11, 'text-offset': [0, 1.1], 'text-anchor': 'top' },
          paint: { 'text-color': '#1a2b45', 'text-halo-color': '#ffffff', 'text-halo-width': 1.2 },
        });
        // highlight ring for the focused node
        if (focusNode) {
          map.addLayer({
            id: 'node-focus', type: 'circle', source: 'nodes',
            filter: focus
              ? ['all', ['==', ['get', 'slug'], focusNode], ['==', ['get', 'corridor'], focus]]
              : ['==', ['get', 'slug'], focusNode],
            paint: { 'circle-radius': 11, 'circle-color': 'rgba(0,0,0,0)', 'circle-stroke-width': 3, 'circle-stroke-color': '#C9A84C' },
          });
        }

        const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12, maxWidth: '260px' });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const showP = (e: any, html: (p: any) => string) => {
          map.getCanvas().style.cursor = 'pointer';
          popup.setLngLat(e.lngLat).setHTML(html(e.features[0].properties)).addTo(map);
        };
        const hideP = () => { map.getCanvas().style.cursor = ''; popup.remove(); };
        map.on('mousemove', 'node-points', (e: unknown) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          showP(e as any, (p) => `<strong>${esc(p.name)}</strong><br>${esc(p.stageLabel)} · ${esc(p.state)}${p.sectors ? `<br><span style="color:#5b6b82">${esc(p.sectors)}</span>` : ''}`));
        map.on('mouseleave', 'node-points', hideP);
        map.on('mousemove', 'corridor-lines', (e: unknown) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          showP(e as any, (p) => `<strong>${esc(p.name)}</strong><br>Readiness ${esc(p.readiness)} · ${esc(p.tier)}`));
        map.on('mouseleave', 'corridor-lines', hideP);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const go = (e: any) => { const u = e.features?.[0]?.properties?.url; if (u) router.push(String(u)); };
        map.on('click', 'node-points', go);
        map.on('click', 'corridor-lines', go);

        // ── focus mode: isolate one corridor + fit ──
        if (focus) {
          map.setFilter('corridor-lines', ['==', ['get', 'slug'], focus]);
          map.setFilter('node-points', ['==', ['get', 'corridor'], focus]);
          map.setFilter('node-labels', ['==', ['get', 'corridor'], focus]);
          let w = 180, s = 40, e2 = 60, n = 5;
          for (const f of corridors.features) {
            if (f.properties.slug !== focus || f.geometry.type !== 'LineString') continue;
            for (const [x, y] of f.geometry.coordinates) { w = Math.min(w, x); e2 = Math.max(e2, x); s = Math.min(s, y); n = Math.max(n, y); }
          }
          for (const f of nodes.features) {
            if (f.properties.corridor !== focus || f.geometry.type !== 'Point') continue;
            const [x, y] = f.geometry.coordinates; w = Math.min(w, x); e2 = Math.max(e2, x); s = Math.min(s, y); n = Math.max(n, y);
          }
          if (w <= e2 && s <= n) {
            map.fitBounds([[w, s], [e2, n]], { padding: focusNode ? 90 : 60, maxZoom: focusNode ? 8.5 : 7.5, duration: 0 });
          }
        }
        setReady(true);
      });
    })();

    return () => { cancelled = true; resizeObserverRef.current?.disconnect(); resizeObserverRef.current = null; if (map) map.remove(); };
  }, [corridors, nodes, focus, focusNode, router]);

  // tier filter — national view only (never fight the focus filter)
  useEffect(() => {
    if (focus) return;
    const map = mapRef.current;
    if (!map || !ready) return;
    const f = tier === 'all' ? null : (['==', ['get', 'tier'], tier] as unknown);
    ['corridor-lines', 'node-points', 'node-labels'].forEach((id) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (map.getLayer(id)) map.setFilter(id, f as any);
    });
  }, [tier, ready, focus]);

  return (
    <div className={`cgl${compact ? ' cgl-compact' : ''}`}>
      <div className="cgl-bar">
        {!focus && (
          <>
            <span className="cgl-title">Readiness tier</span>
            {TIERS.map((t) => (
              <button key={t.key} type="button" className={`cgl-chip${tier === t.key ? ' on' : ''}`} onClick={() => setTier(t.key)}>
                {t.color && <i style={{ background: t.color }} />}{t.label}
              </button>
            ))}
          </>
        )}
        <span className="cgl-legend">
          <b>Node stage</b>
          <span><i style={{ background: '#0F8E78' }} />Operational</span>
          <span><i style={{ background: '#B5891E' }} />Construction</span>
          <span><i style={{ background: '#2E86C1' }} />Approved</span>
          <span><i style={{ background: '#8593A6' }} />Planned</span>
        </span>
      </div>
      <div ref={ref} className="cgl-map" aria-label="Interactive map of India’s national industrial corridors" />
      <p className="cgl-note">Click a corridor or node to open its dossier. Node positions are centroid-approximate. Base map © OpenFreeMap · © OpenStreetMap contributors.</p>
    </div>
  );
}
