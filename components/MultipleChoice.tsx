"use client";

import { useState } from "react";

interface MultipleChoiceProps {
  options: string[];
  onSelect: (index: number) => void;
  selected?: number;
}

export function MultipleChoice({
  options,
  onSelect,
  selected,
}: MultipleChoiceProps) {
  return (
    <div className="space-y-3">
      {options.map((option, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`w-full text-left p-4 border font-sans text-sm transition-all duration-150
            ${
              selected === i
                ? "border-accent bg-accent/10 text-white"
                : "border-border bg-surface hover:border-accent/40 text-white/80 hover:text-white"
            }`}
        >
          <span className="font-mono text-accent mr-3 text-xs">
            {String.fromCharCode(65 + i)}.
          </span>
          {option}
        </button>
      ))}
    </div>
  );
}
