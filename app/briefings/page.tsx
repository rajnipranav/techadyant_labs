import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Strategic briefings',
  description:
    'Short, executive-ready analytical outputs on India’s industrial systems — frameworks, notes and decision-oriented reads.',
};

const briefings = [
  {
    date: '22 May 2026',
    title: 'Reading India’s Semiconductor Incentive Architecture',
    tag: 'Executive brief',
    read: '6 min',
    blurb:
      'How the incentive stack is structured across fabrication, packaging and design — and what it reveals about the state’s actual priorities.',
  },
  {
    date: '09 May 2026',
    title: 'Five Constraints on the 2026–28 Fab Ramp',
    tag: 'Strategic note',
    read: '5 min',
    blurb:
      'A decision-oriented read on the binding constraints — water, power, materials, talent and customs throughput — that set the realistic ramp curve.',
  },
  {
    date: '28 Apr 2026',
    title: 'The Corridor Logic of Industrial Policy',
    tag: 'Framework',
    read: '7 min',
    blurb:
      'Why Special Investment Regions matter more than individual plant decisions, and how corridor infrastructure compounds across anchor tenants.',
  },
  {
    date: '14 Apr 2026',
    title: 'Mature Nodes Are Not a Consolation Prize',
    tag: 'Strategic note',
    read: '4 min',
    blurb:
      'Reframing the “bleeding edge vs mature node” debate around volume, employment and the rising value of advanced packaging.',
  },
];

export default function BriefingsPage() {
  return (
    <>
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>Briefings</span>
          </div>
          <h1>Strategic briefings</h1>
          <p className="lede">
            Short, executive-ready outputs — frameworks and decision-oriented notes distilled
            from our research. Built to be read in a sitting and used in a meeting.
          </p>
        </div>
      </header>

      <section className="wrap">
        <div className="briefings rule-top">
          {briefings.map((b) => (
            <div key={b.title} className="briefing" style={{ gridTemplateColumns: '150px 1fr auto', alignItems: 'start', padding: '26px 0' }}>
              <span className="briefing-date">{b.date}</span>
              <div>
                <span className="briefing-title">
                  {b.title}
                  <span className="b-tag">{b.tag}</span>
                </span>
                <p className="serif" style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-muted)', marginTop: 8, maxWidth: '62ch' }}>
                  {b.blurb}
                </p>
              </div>
              <span className="briefing-read">{b.read}</span>
            </div>
          ))}
        </div>

        <div className="report-cta" style={{ padding: 0, marginTop: 48 }}>
          <div className="report-cta-inner">
            <div>
              <h3>Briefings, in your inbox</h3>
              <p>Executive-ready analysis as it publishes — independent and infrequent.</p>
            </div>
            <Link href="/#subscribe" className="btn-ed btn-ed-primary">Subscribe <span className="arr">→</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
