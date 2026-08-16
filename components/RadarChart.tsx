"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import type { SectionScores } from "@/lib/types";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

interface RadarChartProps {
  scores: SectionScores;
  /** Draw the reference implementation's outline (100% on every axis). */
  showReference?: boolean;
}

const RADAR_LABELS: Record<string, string> = {
  structural: "Structure",
  "state-tracking": "State",
  "sequential-depth": "Depth",
  "signal-detection": "Signal",
  probabilistic: "Inference",
};

export function RadarChart({ scores, showReference = true }: RadarChartProps) {
  const labels = Object.keys(scores).map(
    (s) => RADAR_LABELS[s] || s.charAt(0).toUpperCase() + s.slice(1)
  );
  const values = Object.values(scores).map((v) => Math.round(v * 100));

  const data = {
    labels,
    datasets: [
      ...(showReference
        ? [
            {
              label: "Reference implementation",
              data: values.map(() => 100),
              backgroundColor: "rgba(255,255,255,0.02)",
              borderColor: "rgba(255,255,255,0.25)",
              borderDash: [4, 4],
              borderWidth: 1,
              pointRadius: 0,
            },
          ]
        : []),
      {
        label: "Specimen",
        data: values,
        backgroundColor: "rgba(74, 158, 255, 0.18)",
        borderColor: "rgba(74, 158, 255, 0.9)",
        borderWidth: 2,
        pointBackgroundColor: "#4a9eff",
        pointBorderColor: "#4a9eff",
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          color: "#666",
          backdropColor: "transparent",
          font: { family: "var(--font-jetbrains-mono), monospace", size: 10 },
        },
        grid: { color: "rgba(255,255,255,0.06)" },
        angleLines: { color: "rgba(255,255,255,0.06)" },
        pointLabels: {
          color: "#ccc",
          font: { family: "var(--font-jetbrains-mono), monospace", size: 12 },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: { dataset: { label?: string }; raw: unknown }) => `${ctx.dataset.label}: ${ctx.raw}%`,
        },
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Radar data={data} options={options} />
    </div>
  );
}
