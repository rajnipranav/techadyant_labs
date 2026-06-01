'use client';

import { useEffect, useState } from 'react';
import { reports } from '../../reports/data';
import { StatCard, Panel, Pill } from '../ui';
import { api } from '../api';

/* ──────────────────────────────────────────────────────────────────────────
   Research pipeline — Strategic Risk (FREE) vs Strategic Opportunity (PAID).
   Written reports come from app/reports/data.ts (live with the catalogue).
   The upcoming backlog (with priority + readiness%) is LIVE from the SID via
   /api/admin/pipeline (sid.events [PIPELINE·*] rows + pipeline_priority /
   pipeline_readiness). Edit a readiness value in the SID and the board updates.
   FALLBACK below keeps the board working if the endpoint is unavailable.
   ────────────────────────────────────────────────────────────────────────── */

type Head = 'risk' | 'opportunity';
type Priority = 'high' | 'medium' | 'later';
interface Topic { title: string; head: Head; priority: Priority; readiness: number; note: string }
interface SidRow { title: string; head: Head; summary: string; priority: Priority; readiness: number }

const FALLBACK: Topic[] = [
  { title: 'The Engineering Software Question', head: 'risk', priority: 'high', readiness: 40, note: 'EDA/CAD/PLM dependence (Cadence, Synopsys, Ansys, CATIA, Siemens, PTC). Sovereign-EDA research done.' },
  { title: 'The Value-Retention Question', head: 'risk', priority: 'high', readiness: 45, note: 'Sceptical audit of NITI’s 55–70% value-retention target.' },
  { title: 'The Cloud Question', head: 'risk', priority: 'high', readiness: 15, note: 'TSS V2. Hyperscaler dependence, CLOUD Act, sovereign cloud.' },
  { title: 'The AI Question', head: 'risk', priority: 'high', readiness: 10, note: 'TSS V3. Who controls India’s enterprise intelligence layer.' },
  { title: 'India’s AI Power Gap', head: 'risk', priority: 'medium', readiness: 30, note: 'Can the grid + water carry the AI/fab build-out?' },
  { title: 'India’s Critical Materials Dependency', head: 'risk', priority: 'medium', readiness: 25, note: 'Gallium, rare earths, graphite, tungsten, cobalt.' },
  { title: 'Q-Day India', head: 'risk', priority: 'medium', readiness: 20, note: 'Quantum threat to crypto/financial/identity infra.' },
  { title: 'Strategic Implications of Semiconductor Sovereignty', head: 'risk', priority: 'medium', readiness: 15, note: 'Defence-electronics & AI-hardware dependence.' },
  { title: 'India’s Semiconductor Workforce Crisis', head: 'risk', priority: 'medium', readiness: 10, note: 'Talent-pipeline gap.' },
  { title: 'What India Must Learn — and Cannot Replicate — from Taiwan', head: 'risk', priority: 'later', readiness: 10, note: 'Taiwan-lessons report.' },
  { title: 'The Sovereign Technology Report', head: 'risk', priority: 'later', readiness: 5, note: 'TSS V5 synthesis.' },
  { title: 'India Technology Sovereignty Index 2027', head: 'risk', priority: 'later', readiness: 5, note: 'TSS capstone.' },
  { title: 'The Opportunity Beyond the Fab', head: 'opportunity', priority: 'high', readiness: 60, note: 'Outline docx already exists.' },
  { title: 'Semiconductor Supply Chain: Missing Links', head: 'opportunity', priority: 'high', readiness: 55, note: 'Draft docx in folder.' },
  { title: 'The Packaging Frontier', head: 'opportunity', priority: 'high', readiness: 50, note: 'Forthcoming + NITI-validated.' },
  { title: 'India’s Edge AI Economy', head: 'opportunity', priority: 'high', readiness: 35, note: 'Folder + topics doc.' },
  { title: 'The Cooling Economy of India', head: 'opportunity', priority: 'high', readiness: 25, note: 'Well-defined.' },
  { title: 'The Hidden Infrastructure Behind India’s Chip Ambitions', head: 'opportunity', priority: 'medium', readiness: 30, note: 'Vendor economy.' },
  { title: 'India’s AI Infrastructure Supply Chain', head: 'opportunity', priority: 'medium', readiness: 25, note: 'GPU racks, inference hosting.' },
  { title: 'India’s Data-Centre Ecosystem', head: 'opportunity', priority: 'medium', readiness: 20, note: 'Cooling, cabling, power, REITs.' },
  { title: 'The Industrial Water Economy', head: 'opportunity', priority: 'medium', readiness: 20, note: 'Ultra-pure water, recovery.' },
  { title: 'Hidden SME Opportunities in the Semiconductor Ecosystem', head: 'opportunity', priority: 'medium', readiness: 20, note: 'Consumables, testing, UPW.' },
  { title: 'India’s Industrial AI Transition', head: 'opportunity', priority: 'medium', readiness: 20, note: 'Factories, ports, utilities.' },
  { title: 'MSME Gold Rush in India’s Defence-Tech Ecosystem', head: 'opportunity', priority: 'medium', readiness: 20, note: 'Components, composites, secure comms.' },
  { title: 'India’s Drone Infrastructure Economy', head: 'opportunity', priority: 'medium', readiness: 15, note: 'Maintenance, logistics, software.' },
  { title: 'The Tier-2 Industrial City Opportunity Map', head: 'opportunity', priority: 'medium', readiness: 15, note: 'Dholera, Hosur, Sanand…' },
  { title: 'The Industrial Logistics Behind India’s Manufacturing', head: 'opportunity', priority: 'medium', readiness: 15, note: 'Forthcoming slug.' },
  { title: 'The Sensor Economy of India', head: 'opportunity', priority: 'medium', readiness: 15, note: 'Edge-AI series.' },
  { title: 'India’s Industrial Machine Vision', head: 'opportunity', priority: 'medium', readiness: 10, note: 'Forthcoming slug.' },
  { title: 'India’s Industrial Automation Opportunity Gap', head: 'opportunity', priority: 'medium', readiness: 10, note: 'Retrofitting, predictive maintenance.' },
  { title: 'India’s Industrial Waste & Recycling Economy', head: 'opportunity', priority: 'medium', readiness: 10, note: 'Battery, e-waste, chemical recovery.' },
  { title: 'Second-Order Economic Effects of India’s Semiconductor Push', head: 'opportunity', priority: 'later', readiness: 10, note: 'Macro signature report.' },
  { title: 'India’s Precision Manufacturing Opportunity', head: 'opportunity', priority: 'later', readiness: 10, note: 'Tooling, metrology, machining.' },
];

const PRIO_ORDER: Record<Priority, number> = { high: 0, medium: 1, later: 2 };
const PRIO_TONE: Record<Priority, 'crimson' | 'brass' | 'neutral'> = { high: 'crimson', medium: 'brass', later: 'neutral' };
const PRIO_LABEL: Record<Priority, string> = { high: 'High', medium: 'Medium', later: 'Later' };
const byPrio = (a: Topic, b: Topic) => PRIO_ORDER[a.priority] - PRIO_ORDER[b.priority] || b.readiness - a.readiness;

function Bar({ pct, tone }: { pct: number; tone: string }) {
  return (
    <div style={{ height: 7, borderRadius: 4, background: 'rgba(255,255,255,.08)', overflow: 'hidden', minWidth: 90 }}>
      <div style={{ width: `${Math.max(2, Math.min(100, pct))}%`, height: '100%', background: tone }} />
    </div>
  );
}

function TopicList({ topics, accent }: { topics: Topic[]; accent: string }) {
  return (
    <table className="admin-table" style={{ width: '100%' }}>
      <thead><tr><th style={{ width: '42%' }}>Topic</th><th>Priority</th><th style={{ width: 150 }}>Readiness</th><th>Note</th></tr></thead>
      <tbody>
        {[...topics].sort(byPrio).map((t) => (
          <tr key={t.title}>
            <td style={{ fontWeight: 600 }}>{t.title}</td>
            <td><Pill tone={PRIO_TONE[t.priority]}>{PRIO_LABEL[t.priority]}</Pill></td>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bar pct={t.readiness} tone={accent} />
                <span style={{ fontFamily: 'var(--admin-mono)', fontSize: 12, color: 'var(--admin-muted)' }}>{t.readiness}%</span>
              </div>
            </td>
            <td style={{ fontSize: 12.5, color: 'var(--admin-muted)' }}>{t.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AdminPipeline() {
  const [upcoming, setUpcoming] = useState<Topic[]>(FALLBACK);
  const [live, setLive] = useState(false);

  useEffect(() => {
    api<SidRow[]>('/pipeline')
      .then((rows) => {
        if (Array.isArray(rows) && rows.length) {
          setUpcoming(rows.map((r) => ({ title: r.title, head: r.head, priority: r.priority || 'medium', readiness: r.readiness || 0, note: r.summary })));
          setLive(true);
        }
      })
      .catch(() => { /* keep FALLBACK */ });
  }, []);

  const published = reports.filter((r) => r.status === 'published');
  const writtenRisk = published.filter((r) => r.access === 'free');
  const writtenOpp = published.filter((r) => r.access === 'paid');
  const upRisk = upcoming.filter((t) => t.head === 'risk');
  const upOpp = upcoming.filter((t) => t.head === 'opportunity');

  const plannedRisk = writtenRisk.length + upRisk.length;
  const plannedOpp = writtenOpp.length + upOpp.length;
  const totalWritten = published.length;
  const totalPlanned = plannedRisk + plannedOpp;
  const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);
  const next3 = [...upcoming].sort(byPrio).slice(0, 3);

  const TEAL = 'var(--admin-teal, #2BC5B4)';
  const BRASS = '#C9A84C';

  return (
    <>
      <h1 className="admin-h1">Research pipeline</h1>
      <p className="admin-sub">
        Strategic Risk (free) vs Strategic Opportunity (paid) · target mix 40 / 60 ·{' '}
        <Pill tone={live ? 'teal' : 'neutral'}>{live ? 'live from SID' : 'static fallback'}</Pill>
      </p>

      <Panel title="Next 3 to write">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 }}>
          {next3.map((t, i) => (
            <div key={t.title} style={{ border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--admin-mono)', fontSize: 12, color: 'var(--admin-muted)' }}>#{i + 1}</span>
                <Pill tone={t.head === 'risk' ? 'teal' : 'brass'}>{t.head === 'risk' ? 'Risk · free' : 'Opportunity · paid'}</Pill>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{t.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bar pct={t.readiness} tone={t.head === 'risk' ? TEAL : BRASS} />
                <span style={{ fontFamily: 'var(--admin-mono)', fontSize: 12, color: 'var(--admin-muted)' }}>{t.readiness}% ready · {PRIO_LABEL[t.priority]}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="admin-grid-kpi">
        <StatCard label="Reports written" value={`${totalWritten} / ${totalPlanned}`} />
        <StatCard label="Portfolio complete" value={`${pct(totalWritten, totalPlanned)}%`} />
        <StatCard label="Risk (free) written" value={`${writtenRisk.length} / ${plannedRisk}`} />
        <StatCard label="Opportunity (paid) written" value={`${writtenOpp.length} / ${plannedOpp}`} />
      </div>

      <Panel title="Progress by head">
        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span><b style={{ color: TEAL }}>Strategic Risk · FREE</b> — {writtenRisk.length} of {plannedRisk} written</span>
              <span style={{ fontFamily: 'var(--admin-mono)', color: 'var(--admin-muted)' }}>{pct(writtenRisk.length, plannedRisk)}%</span>
            </div>
            <Bar pct={pct(writtenRisk.length, plannedRisk)} tone={TEAL} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span><b style={{ color: BRASS }}>Strategic Opportunity · PAID</b> — {writtenOpp.length} of {plannedOpp} written</span>
              <span style={{ fontFamily: 'var(--admin-mono)', color: 'var(--admin-muted)' }}>{pct(writtenOpp.length, plannedOpp)}%</span>
            </div>
            <Bar pct={pct(writtenOpp.length, plannedOpp)} tone={BRASS} />
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--admin-muted)', margin: 0 }}>
            Planned mix: <b>{pct(plannedRisk, totalPlanned)}% risk / {pct(plannedOpp, totalPlanned)}% opportunity</b> — target 40 / 60.
            Written so far: {pct(writtenRisk.length, totalWritten)}% free / {pct(writtenOpp.length, totalWritten)}% paid.
          </p>
        </div>
      </Panel>

      <Panel title={`Currently written · ${totalWritten}`}>
        <table className="admin-table" style={{ width: '100%' }}>
          <thead><tr><th>Report</th><th>Head</th><th>Access</th><th>Published</th></tr></thead>
          <tbody>
            {published.map((r) => (
              <tr key={r.slug}>
                <td style={{ fontWeight: 600 }}>{r.title}</td>
                <td>{r.access === 'free' ? <Pill tone="teal">Strategic Risk</Pill> : <Pill tone="brass">Strategic Opportunity</Pill>}</td>
                <td>{r.access === 'free' ? 'Free' : `₹${(r.price ?? 0).toLocaleString('en-IN')}`}</td>
                <td style={{ color: 'var(--admin-muted)', fontSize: 12.5 }}>{r.publishedLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title={`Upcoming · Strategic Risk (FREE) · ${upRisk.length}`}>
        <TopicList topics={upRisk} accent={TEAL} />
      </Panel>

      <Panel title={`Upcoming · Strategic Opportunity (PAID) · ${upOpp.length}`}>
        <TopicList topics={upOpp} accent={BRASS} />
      </Panel>
    </>
  );
}
