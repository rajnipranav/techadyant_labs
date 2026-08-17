import type { Metadata } from 'next';
import Link from 'next/link';
import { signals as staticSignals } from './data';
import { getSignals } from '../lib/cms';
import SignalsBrowser from './SignalsBrowser';

export const metadata: Metadata = {
  title: 'Strategic Signals on India’s Industrial Systems',
  alternates: { canonical: 'https://labs.techadyant.com/signals/' },
  description:
    'Concise strategic intelligence dispatches on India’s industrial systems — observations and analytical notes, not opinion or news aggregation.',
};

export default async function SignalsIndex() {
  let signals: any[] = staticSignals;
  try {
    const cms = await getSignals(); if (cms.length) signals = cms as any[];
    if (cms.length) signals = cms;
  } catch {}
  // Display in serial order, newest signal first (by signal number desc).
  const signalNo = (s: any) => parseInt(String(s.no ?? '').replace(/\D/g, ''), 10) || 0;
  signals = [...signals].sort((a, b) => signalNo(b) - signalNo(a));
  return (
    <>
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>Signals</span>
          </div>
          <h1>Intelligence signals</h1>
          <p className="lede">
            Compact, information-dense dispatches — strategic observations and analytical
            notes on the systems we track. Signals are not opinion, blogging or news
            aggregation; they are early reads on structural change.
          </p>
        </div>
      </header>

      <section className="wrap">
        <SignalsBrowser initialData={signals} />
      </section>
    </>
  );
}
