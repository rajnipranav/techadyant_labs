'use client';

import { useEffect, useMemo, useState } from 'react';
import { api, CAPTURE_FILL, CAPTURE_INK, CAPTURE_LABEL } from '../../api';
import { Loading, ErrorBox } from '../../ui';

interface Cell {
  corridor: string; corridor_label: string; corridor_id: number;
  layer: string; layer_label: string; layer_order: number;
  status: number; status_label: string; rationale: string; date: string;
}
const VERIF = ['verified', 'corroborated', 'single_source', 'unverified'];

export default function CaptureMap() {
  const [cells, setCells] = useState<Cell[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [sel, setSel] = useState<Cell | null>(null);
  const [status, setStatus] = useState(0);
  const [rationale, setRationale] = useState('');
  const [verif, setVerif] = useState('single_source');
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<{ date: string; status: number; rationale: string }[]>([]);

  function reload() { api<Cell[]>('/sid/capture').then(setCells).catch((e) => setErr(String(e.message || e))); }
  useEffect(reload, []);

  function select(c: Cell) {
    setSel(c); setStatus(c.status); setRationale(c.rationale || ''); setVerif('single_source'); setHistory([]);
    api<{ date: string; status: number; rationale: string }[]>('/sid/capture-history?corridor=' + c.corridor + '&layer=' + c.layer).then(setHistory).catch(() => {});
  }

  async function saveAssessment() {
    if (!sel) return;
    setBusy(true); setErr(null);
    try {
      await api('/sid/capture-add', { method: 'POST', body: JSON.stringify({ corridor: sel.corridor, layer: sel.layer, status, rationale, verif }) });
      reload(); setSel(null);
    } catch (e) { setErr(String((e as Error).message || e)); } finally { setBusy(false); }
  }

  const { corridors, layers, byKey } = useMemo(() => {
    const cs = new Map<number, string>(), ls = new Map<number, string>(), bk = new Map<string, Cell>();
    (cells || []).forEach((c) => { cs.set(c.corridor_id, c.corridor_label); ls.set(c.layer_order, c.layer_label); bk.set(`${c.corridor_id}:${c.layer_order}`, c); });
    return { corridors: [...cs.entries()].sort((a, b) => a[0] - b[0]), layers: [...ls.entries()].sort((a, b) => a[0] - b[0]), byKey: bk };
  }, [cells]);

  if (err && !cells) return <><h1 className="admin-h1">Dependency Capture Map</h1><ErrorBox error={err} /></>;
  if (!cells) return <><h1 className="admin-h1">Dependency Capture Map</h1><Loading /></>;

  return (
    <>
      <h1 className="admin-h1">Dependency Capture Map</h1>
      <p className="admin-sub">Capture status by corridor × layer (0 import-dependent → 5 sovereign). Click a cell to view or update its assessment.</p>
      {err && <div style={{ marginBottom: 12 }}><ErrorBox error={err} /></div>}

      <div style={{ display: 'grid', gridTemplateColumns: `150px repeat(${layers.length}, 1fr)`, gap: 4, marginBottom: 12 }}>
        <div />
        {layers.map(([ord, label]) => <div key={ord} style={{ textAlign: 'center', fontSize: 11, color: 'var(--admin-muted)', paddingBottom: 2 }}>{label}</div>)}
        {corridors.map(([cid, clabel]) => (
          <Row key={cid}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 13, paddingRight: 6 }}>{clabel}</div>
            {layers.map(([ord]) => {
              const c = byKey.get(`${cid}:${ord}`);
              if (!c) return <div key={ord} />;
              const on = sel?.corridor_id === c.corridor_id && sel?.layer_order === c.layer_order;
              return (
                <button key={ord} onClick={() => select(c)} title={c.status_label}
                  style={{ height: 46, border: on ? '2px solid #f5b544' : '1px solid var(--admin-border)', borderRadius: 8, background: CAPTURE_FILL[c.status], color: CAPTURE_INK[c.status], fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--admin-mono)' }}>
                  {c.status}
                </button>
              );
            })}
          </Row>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11, color: 'var(--admin-muted)', marginBottom: 18 }}>
        {CAPTURE_FILL.map((f, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: f }} />{i} {CAPTURE_LABEL[i]}</span>
        ))}
      </div>

      {sel && (
        <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{sel.corridor_label} · {sel.layer_label}</div>
            <span style={{ fontSize: 12, color: 'var(--admin-muted)' }}>current: {sel.status} · {sel.status_label} (assessed {sel.date})</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, margin: '6px 0 14px', color: 'var(--admin-muted)' }}>{sel.rationale}</p>

          {history.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--admin-brass)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Capture trajectory ({history.length})</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, overflowX: 'auto', paddingBottom: 4 }}>
                {history.map((h, i) => (
                  <div key={i} title={h.rationale} style={{ textAlign: 'center', minWidth: 54 }}>
                    <div style={{ height: 8 + h.status * 14, width: 26, margin: '0 auto', borderRadius: 5, background: CAPTURE_FILL[h.status] }} />
                    <div style={{ fontFamily: 'var(--admin-mono)', fontSize: 12, marginTop: 4 }}>{h.status}</div>
                    <div style={{ fontSize: 10, color: 'var(--admin-muted)' }}>{h.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--admin-brass)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Record new assessment</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
              <select className="admin-select" value={status} onChange={(e) => setStatus(Number(e.target.value))}>
                {CAPTURE_LABEL.map((l, i) => <option key={i} value={i}>{i} · {l}</option>)}
              </select>
              <select className="admin-select" value={verif} onChange={(e) => setVerif(e.target.value)}>
                {VERIF.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <textarea className="admin-input" style={{ width: '100%', minHeight: 64, marginBottom: 10 }} placeholder="Rationale + source for this assessment…" value={rationale} onChange={(e) => setRationale(e.target.value)} />
            <button className="admin-btn admin-btn-go" disabled={busy} onClick={saveAssessment}>{busy ? 'Saving…' : 'Save dated assessment'}</button>
            <span style={{ fontSize: 11, color: 'var(--admin-muted)', marginLeft: 10 }}>Adds a new time-stamped point; the map shows the latest.</span>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ children }: { children: React.ReactNode }) { return <>{children}</>; }
