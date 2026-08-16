"use client";

import { useState } from "react";
import { Topology } from "./Topology";
import { REPORT_COPY } from "@/lib/commentary";
import { DOMAIN_SHORT, type TopologyInput } from "@/lib/topology";
import { SECTION_ORDER, type SessionMetrics } from "@/lib/types";

interface ShareCardProps {
  resultId: string;
  specimen: string;
  band: string;
  verdict: string;
  topology: TopologyInput;
  metrics: SessionMetrics | null;
}

/**
 * The specimen card: the topology figure with the classification, a
 * frontier line, and share actions. The link's Open Graph image is rendered
 * by /api/og/:id from the same geometry.
 */
export function ShareCard({ resultId, specimen, band, verdict, topology, metrics }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/result/${resultId}` : `/result/${resultId}`;
  const adaptive = metrics?.mode === "adaptive";
  const summary = SECTION_ORDER.map((s) =>
    adaptive ? `${DOMAIN_SHORT[s]} ${metrics?.frontiers?.[s] ?? 0}/8` : `${DOMAIN_SHORT[s]} ${Math.round((topology.domains.find((d) => d.section === s)?.score ?? 0) * 100)}%`
  ).join(" · ");
  const shareText = `MICA cognitive profile #${specimen}: Band ${band}, ${verdict}. ${summary}. Every mind has a shape.`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked; the URL is visible below */
    }
  };
  const share = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as Navigator & { share: (d: { title: string; text: string; url: string }) => Promise<void> }).share({
          title: `MICA | Specimen #${specimen}`,
          text: shareText,
          url,
        });
        return;
      } catch {
        /* cancelled */
      }
    }
    copy();
  };

  return (
    <section className="card border-accent/30">
      <div className="section-label mb-4">{REPORT_COPY.shareTitle}</div>
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 items-center">
        <div className="w-full max-w-[260px] mx-auto aspect-square bg-bg border border-border">
          <Topology input={topology} size={260} labels={false} />
        </div>
        <div className="space-y-4">
          <div>
            <div className="font-mono text-lg font-bold">SPECIMEN #{specimen}</div>
            <div className="font-mono text-sm text-accent">
              BAND {band}: {verdict.toUpperCase()}
            </div>
            <div className="font-mono text-xs text-muted mt-1">{summary}</div>
          </div>
          <p className="font-sans text-sm text-white/70 leading-relaxed">{REPORT_COPY.shareBlurb}</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={share} className="btn-primary">
              SHARE
            </button>
            <button onClick={copy} className="btn-secondary">
              {copied ? "LINK COPIED" : "COPY LINK"}
            </button>
            <a href={`/api/og/${resultId}`} target="_blank" rel="noopener noreferrer" className="btn-secondary text-center">
              OPEN IMAGE
            </a>
          </div>
          <div className="font-mono text-[10px] text-muted break-all">{url}</div>
        </div>
      </div>
    </section>
  );
}
