import { SECTION_ORDER, type FinaleOutcome, type Section, type SessionMetrics } from "./types";

/**
 * "Every mind has a shape. We map the topology."
 *
 * Pure geometry for the specimen's cognitive topology figure. Deterministic
 * from the result: five fixed axes (one per domain, always the same order and
 * orientation so shapes are comparable between specimens), eight faint ladder
 * rings, the frontier polygon, and per-domain marks for confident errors,
 * abstentions, latency and the machine-scale finale. Used by the report SVG
 * and by the OG image so what is shared is exactly what was seen.
 */

export interface TopologyDomain {
  section: Section;
  /** 0..1 (adaptive: frontier/8; legacy: fraction correct). */
  score: number;
  /** Mean answered time in ms (0 if unknown). */
  meanTimeMs: number;
  /** Answers marked SURE that were wrong. */
  sureWrong: number;
  abstained: number;
  finale: FinaleOutcome | null;
}

export interface TopologyInput {
  domains: TopologyDomain[];
  /** 0..1 or null. Drives the fill hatch density. */
  hallucinationRate: number | null;
  /** True for adaptive results (rings are levels); false for legacy percentages. */
  levels: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface AxisGeometry {
  section: Section;
  angle: number; // radians
  outer: Point; // point on the reference ring
  frontier: Point; // point at the domain's score
  label: Point; // label anchor just outside the ring
  /** Small ticks along the axis representing latency: one per 10 s of mean time, max 6. */
  latencyTicks: Point[];
  /** Red dots for confident errors, spread around the frontier point. */
  errorDots: Point[];
  /** Hollow rings for abstentions. */
  abstainRings: Point[];
  finale: FinaleOutcome | null;
}

export interface TopologyGeometry {
  size: number;
  cx: number;
  cy: number;
  R: number;
  ringRadii: number[];
  axes: AxisGeometry[];
  polygon: Point[];
  /** Area of the frontier polygon as a fraction of the reference pentagon (0..1). */
  coverage: number;
  hallucinationRate: number | null;
  levels: boolean;
}

const RINGS = 8;

function polar(cx: number, cy: number, r: number, angle: number): Point {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function polygonArea(pts: Point[]): number {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    a += p.x * q.y - q.x * p.y;
  }
  return Math.abs(a) / 2;
}

/** Build the input from a result's scores and metrics. */
export function topologyInputFromResult(
  sectionScores: Record<string, number>,
  metrics: SessionMetrics | null
): TopologyInput {
  const domains: TopologyDomain[] = SECTION_ORDER.map((section) => {
    const per = metrics?.perSection?.[section];
    return {
      section,
      score: Math.max(0, Math.min(1, sectionScores[section] ?? 0)),
      meanTimeMs: per?.meanTimeMs ?? 0,
      sureWrong: per?.sureWrong ?? 0,
      abstained: per?.abstained ?? 0,
      finale: metrics?.finales?.[section] ?? null,
    };
  });
  return {
    domains,
    hallucinationRate: metrics?.hallucinationRate ?? null,
    levels: metrics?.mode === "adaptive",
  };
}

export function computeTopology(input: TopologyInput, size = 400): TopologyGeometry {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.36;
  const n = input.domains.length;
  const ringRadii = Array.from({ length: RINGS }, (_, i) => (R * (i + 1)) / RINGS);

  const axes: AxisGeometry[] = input.domains.map((d, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const outer = polar(cx, cy, R, angle);
    const frontier = polar(cx, cy, R * d.score, angle);
    const label = polar(cx, cy, R + size * 0.075, angle);
    const nTicks = Math.min(6, Math.round(d.meanTimeMs / 10_000));
    // Latency ticks sit just inside the ring, marching inward.
    const latencyTicks = Array.from({ length: nTicks }, (_, k) => polar(cx, cy, R - size * 0.012 * (k + 1), angle));
    // Error dots fan out perpendicular to the axis at the frontier point.
    const perp = angle + Math.PI / 2;
    const spread = size * 0.014;
    const errorDots = Array.from({ length: Math.min(6, d.sureWrong) }, (_, k) => {
      const off = (k - (Math.min(6, d.sureWrong) - 1) / 2) * spread;
      return { x: frontier.x + off * Math.cos(perp), y: frontier.y + off * Math.sin(perp) };
    });
    // Abstain rings sit on the axis just outside the frontier point.
    const abstainRings = Array.from({ length: Math.min(4, d.abstained) }, (_, k) =>
      polar(cx, cy, R * d.score + size * 0.02 * (k + 1), angle)
    );
    return { section: d.section, angle, outer, frontier, label, latencyTicks, errorDots, abstainRings, finale: d.finale };
  });

  const polygon = axes.map((a) => a.frontier);
  const reference = axes.map((a) => a.outer);
  const refArea = polygonArea(reference);
  const coverage = refArea > 0 ? polygonArea(polygon) / refArea : 0;

  return {
    size,
    cx,
    cy,
    R,
    ringRadii,
    axes,
    polygon,
    coverage,
    hallucinationRate: input.hallucinationRate,
    levels: input.levels,
  };
}

/** SVG path data for the frontier polygon. */
export function polygonPath(pts: Point[]): string {
  if (pts.length === 0) return "";
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") + " Z";
}

/** Two-letter glyph per domain for tight labels. */
export const DOMAIN_GLYPH: Record<Section, string> = {
  structural: "IN",
  "state-tracking": "WM",
  "sequential-depth": "EX",
  "signal-detection": "SG",
  probabilistic: "PR",
};

export const DOMAIN_SHORT: Record<Section, string> = {
  structural: "Insight",
  "state-tracking": "Memory",
  "sequential-depth": "Exact",
  "signal-detection": "Signal",
  probabilistic: "Inference",
};
