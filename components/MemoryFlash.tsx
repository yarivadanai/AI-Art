"use client";

import { useEffect, useState } from "react";

interface DigitFlashProps {
  digits: string;
  durationMs: number;
  onComplete: () => void;
}

export function DigitFlash({ digits, durationMs, onComplete }: DigitFlashProps) {
  const [visible, setVisible] = useState(true);
  const [countdown, setCountdown] = useState(Math.ceil(durationMs / 1000));

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, durationMs);

    const countdownInterval = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [durationMs, onComplete]);

  if (!visible) return null;

  return (
    <div className="text-center space-y-4">
      <div className="section-label">Memorize this sequence</div>
      <div className="font-mono text-4xl tracking-[0.5em] text-accent py-8 px-4 border border-accent/20 bg-surface">
        {digits}
      </div>
      <div className="font-mono text-sm text-muted">{countdown}s remaining</div>
    </div>
  );
}

interface FactFlashProps {
  facts: string[];
  displayTimeMs: number;
  onComplete: () => void;
}

export function FactFlash({ facts, displayTimeMs, onComplete }: FactFlashProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const timePerFact = displayTimeMs / facts.length;

  useEffect(() => {
    if (currentIdx >= facts.length) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCurrentIdx((i) => i + 1);
    }, timePerFact);

    return () => clearTimeout(timer);
  }, [currentIdx, facts.length, timePerFact, onComplete]);

  if (currentIdx >= facts.length) return null;

  return (
    <div className="text-center space-y-4">
      <div className="section-label">
        Memorize these facts ({currentIdx + 1}/{facts.length})
      </div>
      <div className="font-sans text-xl text-white py-8 px-6 border border-accent/20 bg-surface min-h-[120px] flex items-center justify-center">
        {facts[currentIdx]}
      </div>
      <div className="w-full bg-border h-1">
        <div
          className="bg-accent h-1 transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / facts.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

const COLOR_BG_MAP: Record<string, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
};

interface ColorFlashProps {
  colors: string[];
  displayTimeMs: number;
  onComplete: () => void;
}

export function ColorFlash({ colors, displayTimeMs, onComplete }: ColorFlashProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const timePerColor = displayTimeMs / colors.length;

  useEffect(() => {
    if (currentIdx >= colors.length) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCurrentIdx((i) => i + 1);
    }, timePerColor);

    return () => clearTimeout(timer);
  }, [currentIdx, colors.length, timePerColor, onComplete]);

  if (currentIdx >= colors.length) return null;

  return (
    <div className="text-center space-y-4">
      <div className="section-label">
        Memorize this color sequence ({currentIdx + 1}/{colors.length})
      </div>
      <div className="flex justify-center py-8">
        <div
          className={`w-32 h-32 ${COLOR_BG_MAP[colors[currentIdx]] || "bg-gray-500"} transition-colors`}
        />
      </div>
      <div className="font-mono text-sm text-muted capitalize">
        {colors[currentIdx]}
      </div>
    </div>
  );
}

interface ExpressionFlashProps {
  expression: string;
  durationMs: number;
  onComplete: () => void;
}

export function ExpressionFlash({
  expression,
  durationMs,
  onComplete,
}: ExpressionFlashProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [durationMs, onComplete]);

  if (!visible) return null;

  return (
    <div className="text-center space-y-4">
      <div className="section-label">Calculate this expression</div>
      <div className="font-mono text-3xl text-accent py-8 px-4 border border-accent/20 bg-surface">
        {expression}
      </div>
      <div className="font-mono text-sm text-muted">Disappearing soon...</div>
    </div>
  );
}
