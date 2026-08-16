import { BeyondSeaDronesSummary } from './beyond-sea-drones';
import { CmddSummary } from './cmdd';
import { IafSummary } from './iaf';
import { NavySummary } from './navy';
import { SolarSummary } from './solar';
import { GhSummary } from './gh';
import { QdSummary } from './qd';
import { KpSummary } from './kp';

/** Maps executive-summary slugs to their content components. The route renders
 *  whatever this map provides; keep it in sync with EXEC_SUMMARIES (registry). */
export const EXEC_CONTENT: Record<string, () => React.ReactElement> = {
  'beyond-sea-drones-india-autonomous-maritime-systems': BeyondSeaDronesSummary,
  'india-critical-manufacturing-dependencies': CmddSummary,
  'iaf-autonomous-air-power': IafSummary,
  'indian-navy-autonomous-maritime': NavySummary,
  'beyond-solar-panels': SolarSummary,
  'india-green-hydrogen': GhSummary,
  'q-day-india': QdSummary,
  'kalpasar-economic-impact': KpSummary,
};
