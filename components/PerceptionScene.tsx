"use client";

import type { SceneData, SceneShape } from "@/lib/types";

function renderShape(shape: SceneShape, index: number) {
  const { type, color, x, y, sizeValue, filled } = shape;
  const strokeWidth = 2;
  const fillColor = filled ? color : "none";
  const stroke = color;

  switch (type) {
    case "circle":
      return (
        <circle
          key={index}
          cx={x}
          cy={y}
          r={sizeValue / 2}
          fill={fillColor}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    case "square":
      return (
        <rect
          key={index}
          x={x - sizeValue / 2}
          y={y - sizeValue / 2}
          width={sizeValue}
          height={sizeValue}
          fill={fillColor}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    case "triangle": {
      const h = (sizeValue * Math.sqrt(3)) / 2;
      const points = `${x},${y - h / 2} ${x - sizeValue / 2},${y + h / 2} ${x + sizeValue / 2},${y + h / 2}`;
      return (
        <polygon
          key={index}
          points={points}
          fill={fillColor}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }
    case "star": {
      const outerR = sizeValue / 2;
      const innerR = outerR * 0.4;
      const points = Array.from({ length: 10 })
        .map((_, i) => {
          const r = i % 2 === 0 ? outerR : innerR;
          const angle = (i * Math.PI) / 5 - Math.PI / 2;
          return `${x + r * Math.cos(angle)},${y + r * Math.sin(angle)}`;
        })
        .join(" ");
      return (
        <polygon
          key={index}
          points={points}
          fill={fillColor}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }
    case "hexagon": {
      const r = sizeValue / 2;
      const points = Array.from({ length: 6 })
        .map((_, i) => {
          const angle = (i * Math.PI) / 3 - Math.PI / 6;
          return `${x + r * Math.cos(angle)},${y + r * Math.sin(angle)}`;
        })
        .join(" ");
      return (
        <polygon
          key={index}
          points={points}
          fill={fillColor}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }
  }
}

interface PerceptionSceneProps {
  scene: SceneData;
  countdown: number;
}

export function PerceptionScene({ scene, countdown }: PerceptionSceneProps) {
  return (
    <div className="relative">
      {/* Countdown overlay */}
      <div className="absolute top-4 right-4 z-10 font-mono text-2xl text-accent bg-bg/80 px-3 py-1 border border-accent/30">
        {countdown}s
      </div>

      <svg
        width={scene.width}
        height={scene.height}
        viewBox={`0 0 ${scene.width} ${scene.height}`}
        className="border border-border bg-[#0d0d0d] max-w-full h-auto"
      >
        {/* Grid lines */}
        <line
          x1={scene.width / 2}
          y1={0}
          x2={scene.width / 2}
          y2={scene.height}
          stroke="#1a1a1a"
          strokeWidth="1"
        />
        <line
          x1={0}
          y1={scene.height / 2}
          x2={scene.width}
          y2={scene.height / 2}
          stroke="#1a1a1a"
          strokeWidth="1"
        />

        {/* Shapes */}
        {scene.shapes.map((shape, i) => renderShape(shape, i))}

        {/* Labels */}
        {scene.labels.map((label, i) => (
          <text
            key={`label-${i}`}
            x={label.x}
            y={label.y}
            fill="#666"
            fontSize="12"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {label.text}
          </text>
        ))}
      </svg>
    </div>
  );
}
