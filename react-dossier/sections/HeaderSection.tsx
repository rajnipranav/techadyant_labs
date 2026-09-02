// ============================================================================
// Header section — page-head with kicker, name, one-liner, chips, maker badge
// ============================================================================

import type { EntityDossier } from "../types";

interface Props {
  dossier: EntityDossier;
}

export function HeaderSection({ dossier }: Props) {
  const { header, name, variant, status, tier } = dossier;

  return (
    <header className="ed-page-head">
      <nav className="ed-breadcrumb" aria-label="Breadcrumb">
        <span className="ed-kicker">
          {dossier.vertical.replace(/-/g, " ").toUpperCase()}
        </span>
        <span className="ed-breadcrumb-sep">/</span>
        <span className="ed-breadcrumb-current">{name}</span>
      </nav>

      <h1 className="ed-title">
        {name}
        {variant ? (
          <span className="ed-variant"> · {variant}</span>
        ) : null}
      </h1>

      <p className="lede">{header.one_liner}</p>

      <div className="ed-chips">
        {(header.chips || []).map((chip) => (
          <span key={chip} className="ed-chip">
            {chip}
          </span>
        ))}
        <span className="ed-chip ed-chip--status" data-status={status}>
          {status}
        </span>
        <span className="ed-chip ed-chip--tier" data-tier={tier}>
          Tier {tier}
        </span>
      </div>

      {header.maker ? (
        <div className="ed-maker-line">
          <span className="ed-label">Maker:</span>{" "}
          <span className="ed-value">{header.maker}</span>
        </div>
      ) : null}

      <div className="ed-meta-line">
        <span className="ed-label">Country:</span>{" "}
        <span className="ed-value">{header.country}</span>
        {header.indigenous_pct != null ? (
          <>
            <span className="ed-sep">·</span>
            <span className="ed-label">Indigenous:</span>{" "}
            <span className="ed-value">{header.indigenous_pct}%</span>
          </>
        ) : null}
        {header.mobility_or_class ? (
          <>
            <span className="ed-sep">·</span>
            <span className="ed-label">Class:</span>{" "}
            <span className="ed-value">{header.mobility_or_class}</span>
          </>
        ) : null}
      </div>

      {header.operational_domains &&
      (header.operational_domains || []).length > 0 ? (
        <div className="ed-domains">
          {header.operational_domains.map((d) => (
            <span key={d} className="ed-domain-chip">
              {d}
            </span>
          ))}
        </div>
      ) : null}

      <p className="ed-verified">
        Last verified: <time dateTime={dossier.last_verified}>{dossier.last_verified}</time>
      </p>
    </header>
  );
}
