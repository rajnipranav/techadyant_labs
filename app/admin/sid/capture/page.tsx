'use client';

import { useEffect, useMemo, useState } from 'react';
import { api, CAPTURE_FILL, CAPTURE_INK, CAPTURE_LABEL } from '../../api';
import { Loading, ErrorBox } from '../../ui';

interface Cell {
  corridor: string; corridor_label: string; corridor_id: number;
  layer: string; layer_label: string; layer_order: number;
  status: number; status_label: string; rationale: string; date: string;
}

export default function CaptureMap() {
  const [cells, setCells] = useState<Cell[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [sel, setSel] = useState<Cell | null>(null);

  useEffect(() => { api<Cell[]>('/sid/capture').then(setCells).catch((e) => setErr(String(e.message || e))); }, []);

  const { corridors, layers, byKey } = useMemo(() => {
    const cs = new Map<number, string>(), ls = new Map<number, string>(), bk = new Map<string, Cell>();
    (cells || []).forEach((c) => { cs.set(c.corridor_id, c.corridor_label); ls.set(c.layer_order, c.layer_label); bk.set(`${c.corridor_id}:${c.layer_order}`, c); });
    return {
      corridors: [...cs.entries()].sort((a, b) => a[0] - b[0]),
      layers: [...ls.entries()].sort((a, b) => a[0] - b[0]),
      byKey: bk,
    };
  }, [cells]);

  if (err) return <><h1 className="admin-h1">Dependency Capture Map</h1><ErrorBox error={err} /></>;
  if (!cells) return <><h1 className="admin-h1">Dependency Capture Map</h1><Loading /></>;

  return (
    <>
      <h1 className="admin-h1">Dependency Capture Map</h1>
      <p className="admin-sub">Capture status by corridor × layer (0 import-dependent → 5 sovereign). Click a cell for the assessment.</p>

      <div style={{ display: 'grid', gridTemplateColumns: `150px repeat(${layers.length}, 1fr)`, gap: 4, marginBottom: 12 }}>
        <div />
        {layers.map(([ord, label]) => (
          <div key={ord} style={{ textAlign: 'center', fontSize: 11, color: 'var(--admin-muted)', paddingBottom: 2 }}>{label}</div>
        ))}
        {corridors.map(([cid, clabel]) => (
          <Row key={cid}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 13, paddingRight: 6 }}>{clabel}</div>
            {layers.map(([ord]) => {
              const c = byKey.get(`${cid}:${ord}`);
              if (!c) return <div key={ord} />;
              const on = sel === c;
              return (
                <button key={ord} onClick={() => setSel(c)} title={c.status_label}
                  style={{ height: 46, border: on ? '2px solid #0F1828' : 'none', borderRadius: 8, background: CAPTURE_FILL[c.status], color: CAPTURE_INK[c.status], fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--admin-mono)' }}>
                  {c.status}
                </button>
              );
            })}
          </Row>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11, color: 'var(--admin-muted)', marginBottom: 18 }}>
        {CAPTURE_FILL.map((f, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 11, height: 11, borderRadius: 3, background: f }} />{i} {CAPTURE_LABEL[i]}
          </span>
        ))}
      </div>

      {sel && (
        <div style={{ background: '#fff', border: '1px solid var(--admin-border)', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{sel.corridor_label} · {sel.layer_label}</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}>
            <span style={{ background: CAPTURE_FILL[sel.status], color: CAPTURE_INK[sel.status], padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>{sel.status} · {sel.status_label}</span>
            <span style={{ color: 'var(--admin-muted)', marginLeft: 8 }}>assessed {sel.date}</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>{sel.rationale}</p>
        </div>
      )}
    </>
  );
}

function Row({ children }: { children: React.ReactNode }) { return <>{children}</>; }
