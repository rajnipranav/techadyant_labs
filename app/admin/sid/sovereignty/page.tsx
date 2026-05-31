'use client';

import { useEffect, useState } from 'react';
import { api, CAPTURE_FILL, CAPTURE_INK, CAPTURE_LABEL } from '../../api';
import { Loading, ErrorBox } from '../../ui';

interface Layer { layer: string; label: string; status: number }
interface Row {
  corridor: string; label: string; avg_status: number; index_pct: number;
  import_dependent_layers: number; worst: number; layers: Layer[];
}

export default function Sovereignty() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => { api<Row[]>('/sid/sovereignty').then(setRows).catch((e) => setErr(String(e.message || e))); }, []);

  return (
    <>
      <h1 className="admin-h1">Sovereignty scorecard</h1>
      <p className="admin-sub">Dependency Capture index per corridor (0 = fully import-dependent, 100 = sovereign). Lowest first — most exposed at the top.</p>
      {err && <ErrorBox error={err} />}
      {!rows && !err && <Loading />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {rows && rows.map((r) => (
          <div key={r.corridor} style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{r.label}</div>
              <div style={{ fontFamily: 'var(--admin-mono)', fontSize: 22, fontWeight: 700, color: r.index_pct < 40 ? 'var(--admin-crimson)' : r.index_pct < 65 ? '#f5b544' : 'var(--admin-teal)' }}>
                {r.index_pct}<span style={{ fontSize: 12, color: 'var(--admin-muted)' }}> /100</span>
              </div>
            </div>
            <div style={{ background: 'var(--admin-surface2)', borderRadius: 5, height: 10, marginBottom: 12 }}>
              <div style={{ width: `${r.index_pct}%`, height: '100%', borderRadius: 5, background: r.index_pct < 40 ? '#e2725b' : r.index_pct < 65 ? '#f5b544' : '#38e1c4' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
              {r.layers.map((l) => (
                <div key={l.layer} title={`${l.label}: ${CAPTURE_LABEL[l.status]}`} style={{ textAlign: 'center' }}>
                  <div style={{ height: 34, borderRadius: 8, background: CAPTURE_FILL[l.status], color: CAPTURE_INK[l.status], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontFamily: 'var(--admin-mono)', fontSize: 13 }}>{l.status}</div>
                  <div style={{ fontSize: 10, color: 'var(--admin-muted)', marginTop: 3, lineHeight: 1.2 }}>{l.label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'var(--admin-muted)', marginTop: 10 }}>
              {r.import_dependent_layers} of 6 layers import-dependent · avg capture {r.avg_status}/5
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
