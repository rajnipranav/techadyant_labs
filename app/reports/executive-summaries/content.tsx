import { BeyondSeaDronesSummary } from './beyond-sea-drones';
import { CmddSummary } from './cmdd';

/** Maps executive-summary slugs to their content components. The route renders
 *  whatever this map provides; keep it in sync with EXEC_SUMMARIES (registry). */
export const EXEC_CONTENT: Record<string, () => React.ReactElement> = {
  'beyond-sea-drones-india-autonomous-maritime-systems': BeyondSeaDronesSummary,
  'india-critical-manufacturing-dependencies': CmddSummary,
};
