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
}

const RADAR_LABELS: Record<string, string> = {
  structural: "Structure",
  "state-tracking": "State",
  "sequential-depth": "Depth",
  "signal-detection": "Signal",
  probabilistic: "Inference",
};

export function RadarChart({ scores }: RadarChartProps) {
  const labels = Object.keys(scores).map(
    (s) => RADAR_LABELS[s] || s.charAt(0).toUpperCase() + s.slice(1)
  );
  const values = Object.values(scores).map((v) => v * 100);

  const data = {
    labels,
    datasets: [
      {
        label: "Specimen Score",
        data: values,
        backgroundColor: "rgba(74, 158, 255, 0.15)",
        borderColor: "rgba(74, 158, 255, 0.8)",
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
        max: 100,
        ticks: {
          stepSize: 20,
          color: "#666",
          backdropColor: "transparent",
          font: { family: "monospace", size: 10 },
        },
        grid: { color: "rgba(255,255,255,0.05)" },
        angleLines: { color: "rgba(255,255,255,0.05)" },
        pointLabels: {
          color: "#ccc",
          font: { family: "monospace", size: 12 },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: { raw: unknown }) => `${ctx.raw}%`,
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
