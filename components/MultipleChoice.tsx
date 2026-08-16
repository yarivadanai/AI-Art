"use client";

import { useEffect } from "react";

interface MultipleChoiceProps {
  options: string[];
  onSelect: (index: number) => void;
  selected?: number;
}

/**
 * Radio-style option list. Keyboard: press the option letter (A-H) or its
 * number (1-8) to select; Enter submits via the parent form.
 */
export function MultipleChoice({
  options,
  onSelect,
  selected,
}: MultipleChoiceProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const k = e.key.toUpperCase();
      let idx = -1;
      if (k.length === 1 && k >= "A" && k <= "Z") idx = k.charCodeAt(0) - 65;
      else if (k.length === 1 && k >= "1" && k <= "9") idx = parseInt(k, 10) - 1;
      if (idx >= 0 && idx < options.length) {
        e.preventDefault();
        onSelect(idx);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [options.length, onSelect]);

  return (
    <div className="space-y-3" role="radiogroup" aria-label="Answer options">
      {options.map((option, i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={selected === i}
          onClick={() => onSelect(i)}
          className={`w-full text-left p-4 border font-sans text-sm transition-all duration-150
            focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
            ${
              selected === i
                ? "border-accent bg-accent/10 text-white"
                : "border-border bg-surface hover:border-accent/40 text-white/80 hover:text-white"
            }`}
        >
          <span className="font-mono text-accent mr-3 text-xs" aria-hidden="true">
            {String.fromCharCode(65 + i)}.
          </span>
          {option}
        </button>
      ))}
    </div>
  );
}
