// ============================================================================
// Kill chain / capability — stage coverage table + threat classes
// ============================================================================

import type { KillChainOrCapability, Source } from "../types";

interface Props {
  data: KillChainOrCapability;
  sources: Source[];
}

const STAGE_LABEL_DEFAULT: Record<string, string> = {
  detect: "Detect",
  classify: "Classify",
  track: "Track",
  decide: "Decide",
  defeat: "Defeat",
  assess: "Assess",
};

export function KillChainSection({ data, sources }: Props) {
  const cited = data.sources
    .map((id) => sources.find((s) => s.id === id))
    .filter((s): s is Source => Boolean(s));

  return (
    <section
      className="ed-section ed-kill-chain"
      aria-labelledby="kill-chain-h"
    >
      <h2 id="kill-chain-h" className="ed-section-h">
        Kill Chain / Capability
      </h2>

      <table className="ed-stage-table">
        <thead>
          <tr>
            <th>Stage</th>
            <th>Covered</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {data.stages.map((stage) => (
            <tr key={stage.id} data-covered={stage.covered}>
              <td>
                <strong>{stage.label || STAGE_LABEL_DEFAULT[stage.id]}</strong>
              </td>
              <td>
                <span
                  className={`ed-covered ed-covered--${stage.covered ? "yes" : "no"}`}
                  aria-label={stage.covered ? "Covered" : "Not covered"}
                >
                  {stage.covered ? "✓" : "—"}
                </span>
              </td>
              <td>{stage.note || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.threat_or_target_classes.length > 0 ? (
        <div className="ed-threat-classes">
          <h3 className="ed-sub-h">Threat / Target Classes</h3>
          <div className="ed-chips">
            {data.threat_or_target_classes.map((c) => (
              <span key={c} className="ed-chip ed-chip--threat">
                {c}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {cited.length > 0 ? (
        <p className="ed-cite-line">
          Sources:{" "}
          {cited.map((s, i) => (
            <span key={s.id}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="ed-cite"
              >
                [{i + 1}]
              </a>
            </span>
          ))}
        </p>
      ) : null}
    </section>
  );
}
