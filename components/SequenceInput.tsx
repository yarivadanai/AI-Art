"use client";

import { useState } from "react";

const COLORS = ["red", "blue", "green", "yellow", "purple", "orange"];
const COLOR_MAP: Record<string, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
};

interface SequenceInputProps {
  length: number;
  value: string[];
  onChange: (value: string[]) => void;
}

export function SequenceInput({ length, value, onChange }: SequenceInputProps) {
  const addColor = (color: string) => {
    if (value.length < length) {
      onChange([...value, color]);
    }
  };

  const removeLastColor = () => {
    onChange(value.slice(0, -1));
  };

  return (
    <div className="space-y-4">
      {/* Current sequence */}
      <div className="flex gap-2 flex-wrap min-h-[48px] p-3 border border-border bg-surface">
        {Array.from({ length }).map((_, i) => (
          <div
            key={i}
            className={`w-10 h-10 border ${
              value[i]
                ? `${COLOR_MAP[value[i]]} border-transparent`
                : "border-border border-dashed"
            }`}
          />
        ))}
      </div>

      {/* Color picker */}
      <div className="flex gap-2 flex-wrap">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => addColor(color)}
            disabled={value.length >= length}
            className={`w-12 h-12 ${COLOR_MAP[color]} border-2 border-transparent
              hover:border-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
          />
        ))}
      </div>

      {/* Undo */}
      {value.length > 0 && (
        <button
          onClick={removeLastColor}
          className="text-xs font-mono text-muted hover:text-accent transition-colors"
        >
          [UNDO LAST]
        </button>
      )}
    </div>
  );
}
