"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface ScoreDistributionProps {
  distribution: number[];
  label?: string;
  highlightBin?: number;
}

export function ScoreDistribution({
  distribution,
  label = "Score Distribution",
  highlightBin,
}: ScoreDistributionProps) {
  const labels = [
    "0-9%",
    "10-19%",
    "20-29%",
    "30-39%",
    "40-49%",
    "50-59%",
    "60-69%",
    "70-79%",
    "80-89%",
    "90-100%",
  ];

  const data = {
    labels,
    datasets: [
      {
        label,
        data: distribution,
        backgroundColor: distribution.map((_, i) =>
          i === highlightBin
            ? "rgba(74, 158, 255, 0.8)"
            : "rgba(74, 158, 255, 0.25)"
        ),
        borderColor: distribution.map((_, i) =>
          i === highlightBin
            ? "rgba(74, 158, 255, 1)"
            : "rgba(74, 158, 255, 0.4)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#666", font: { family: "monospace", size: 10 } },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#666", font: { family: "monospace", size: 10 } },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: { raw: unknown }) => `${ctx.raw} specimens`,
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
}
