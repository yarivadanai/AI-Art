"use client";

import { useMemo } from "react";
import { computeTopology, polygonPath, DOMAIN_SHORT, type TopologyInput } from "@/lib/topology";

interface TopologyProps {
  input: TopologyInput;
  size?: number;
  /** Show domain labels and the caption line. */
  labels?: boolean;
  className?: string;
}

const ACCENT = "#4a9eff";
const RED = "#f87171";
const MUTED = "#666666";

/**
 * The specimen's cognitive topology as an SVG. Fixed axes, eight ladder rings,
 * the frontier polygon, red dots for confident errors, hollow rings for
 * abstentions, latency ticks inside the outer ring, and a finale marker on it.
 */
export function Topology({ input, size = 400, labels = true, className }: TopologyProps) {
  const g = useMemo(() => computeTopology(input, size), [input, size]);
  const hatchId = useMemo(() => `hatch-${Math.round((g.hallucinationRate ?? 0) * 100)}`, [g.hallucinationRate]);
  const hatchGap = 6 - Math.round((g.hallucinationRate ?? 0) * 4); // denser hatch = more confident error

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="100%"
      className={className}
      role="img"
      aria-label={`Cognitive topology: ${g.axes.map((a) => `${DOMAIN_SHORT[a.section]} ${Math.round(a.frontier.x === g.cx && a.frontier.y === g.cy ? 0 : 100 * Math.hypot(a.frontier.x - g.cx, a.frontier.y - g.cy) / g.R)}%`).join(", ")}`}
    >
      <defs>
        <pattern id={hatchId} width={hatchGap} height={hatchGap} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2={hatchGap} stroke={ACCENT} strokeWidth="1" strokeOpacity="0.35" />
        </pattern>
      </defs>

      {/* Ladder rings */}
      {g.ringRadii.map((r, i) => (
        <circle
          key={r}
          cx={g.cx}
          cy={g.cy}
          r={r}
          fill="none"
          stroke={i === g.ringRadii.length - 1 ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.07)"}
          strokeWidth={i === g.ringRadii.length - 1 ? 1 : 0.75}
          strokeDasharray={i === g.ringRadii.length - 1 ? "4 4" : undefined}
        />
      ))}

      {/* Axes */}
      {g.axes.map((a) => (
        <line key={a.section} x1={g.cx} y1={g.cy} x2={a.outer.x} y2={a.outer.y} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      ))}

      {/* Frontier polygon */}
      <path d={polygonPath(g.polygon)} fill={`url(#${hatchId})`} stroke="none" />
      <path d={polygonPath(g.polygon)} fill={ACCENT} fillOpacity={0.14} stroke={ACCENT} strokeWidth={2} strokeLinejoin="round" />

      {/* Per-axis marks */}
      {g.axes.map((a) => (
        <g key={a.section}>
          {/* frontier vertex */}
          <circle cx={a.frontier.x} cy={a.frontier.y} r={3.5} fill={ACCENT} />
          {/* latency ticks */}
          {a.latencyTicks.map((t, i) => (
            <circle key={i} cx={t.x} cy={t.y} r={1.2} fill="rgba(255,255,255,0.45)" />
          ))}
          {/* confident errors */}
          {a.errorDots.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={2.4} fill={RED} />
          ))}
          {/* abstentions */}
          {a.abstainRings.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={2.6} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={1} />
          ))}
          {/* finale marker on the reference ring */}
          {a.finale === "correct" && <circle cx={a.outer.x} cy={a.outer.y} r={4} fill={ACCENT} />}
          {a.finale === "wrong" && <circle cx={a.outer.x} cy={a.outer.y} r={4} fill={RED} fillOpacity={0.9} />}
          {a.finale === "abstained" && (
            <circle cx={a.outer.x} cy={a.outer.y} r={4} fill="#0a0a0a" stroke="rgba(255,255,255,0.8)" strokeWidth={1.2} />
          )}
          {labels && (
            <text
              x={a.label.x}
              y={a.label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace"
              fontSize={size * 0.03}
              fill="#cccccc"
              letterSpacing="0.08em"
            >
              {DOMAIN_SHORT[a.section].toUpperCase()}
            </text>
          )}
        </g>
      ))}

      {labels && (
        <text
          x={g.cx}
          y={size - size * 0.03}
          textAnchor="middle"
          fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace"
          fontSize={size * 0.024}
          fill={MUTED}
          letterSpacing="0.15em"
        >
          {g.levels ? "RINGS: LEVELS 1-8 · DASHED: REFERENCE" : "RINGS: 12.5% STEPS · DASHED: REFERENCE"}
        </text>
      )}
    </svg>
  );
}
