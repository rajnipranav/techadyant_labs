"use client";

import { useEffect, useState } from "react";

interface Props {
  slug: string;
  pdfUrl: string;
  pdfLabel: string;
  source?: string;
  intro?: string;
  buttonLabel?: string;
  downloadLabel?: string;
}

/** Email-gate for the free condensed-edition PDF. Subscribes via the site's
 *  /api/subscribe (Cloudflare Pages Function), source-attributed per report,
 *  then unlocks the download for the session (localStorage). */
export function ExecutiveSummaryGate({ slug, pdfUrl, pdfLabel, source, intro, buttonLabel, downloadLabel }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [unlocked, setUnlocked] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    try {
      if (localStorage.getItem(`exec_sum_${slug}`) === "1") setUnlocked(true);
    } catch {}
  }, [slug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "sending") return;
    setStatus("sending");
    setErr("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: source || `report:${slug}-exec-summary` }),
      });
      let data: { ok?: boolean; message?: string } | null = null;
      try { data = await res.json(); } catch {}
      if (!res.ok || !data?.ok) {
        setStatus("error");
        setErr(data?.message || "Something went wrong. Please try again.");
        return;
      }
      try { localStorage.setItem(`exec_sum_${slug}`, "1"); } catch {}
      setUnlocked(true);
      setStatus("idle");
    } catch {
      setStatus("error");
      setErr("Could not reach the server. Please check your connection and try again.");
    }
  }

  if (unlocked) {
    return (
      <div>
        <p style={{ fontSize: 14.5, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.65 }}>
          Here it is. You're on the list for updates and corrections on this and related research.
        </p>
        <a
          href={pdfUrl}
          download
          className="btn-ed btn-ed-primary"
          style={{ display: "inline-block" }}
        >
          {downloadLabel || 'Download the condensed edition (PDF)'} <span className="arr">&rarr;</span>
        </a>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: 14.5, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.65 }}>
        {intro ?? `${pdfLabel}. Free to read here; subscribe with an email to download the PDF. We'll also tell you when this assessment changes.`}
      </p>
      <form onSubmit={submit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@institution.org"
          aria-label="Email address"
          style={{
            flex: "1 1 220px",
            background: "var(--bg-2)",
            border: "1px solid var(--border-strong)",
            borderRadius: 10,
            padding: "13px 14px",
            color: "var(--text)",
            fontSize: 15,
            minWidth: 0,
          }}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-ed btn-ed-primary"
          style={{ borderRadius: 10 }}
        >
          {status === "sending" ? "Unlocking…" : (buttonLabel || 'Get the PDF')}
        </button>
      </form>
      {status === "error" && (
        <p role="alert" style={{ color: "#f87171", fontSize: 13.5, marginTop: 8 }}>
          {err}
        </p>
      )}
      <p style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 10 }}>
        Free · no spam · unsubscribe anytime ·{" "}
        <a href="/privacy/" style={{ color: "var(--gold)" }}>privacy policy</a>
      </p>
    </div>
  );
}
