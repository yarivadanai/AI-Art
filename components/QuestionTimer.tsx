"use client";

import { useEffect, useState, useRef } from "react";

interface QuestionTimerProps {
  timeLimit: number;
  onExpire: () => void;
  questionId: string;
}

export function QuestionTimer({ timeLimit, onExpire, questionId }: QuestionTimerProps) {
  const [remaining, setRemaining] = useState(timeLimit);
  const expiredRef = useRef(false);

  useEffect(() => {
    // Reset on question change
    setRemaining(timeLimit);
    expiredRef.current = false;
  }, [questionId, timeLimit]);

  useEffect(() => {
    if (remaining <= 0 && !expiredRef.current) {
      expiredRef.current = true;
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0 && !expiredRef.current) {
          expiredRef.current = true;
          // Call onExpire in next tick to avoid state update during render
          setTimeout(() => onExpire(), 0);
        }
        return Math.max(0, next);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining, onExpire, questionId]);

  const isUrgent = remaining <= 5;
  const isCritical = remaining <= 3;

  return (
    <div className="flex items-center gap-2">
      {isCritical && (
        <span className="font-mono text-xs text-red-500 animate-pulse_accent tracking-wider">
          TIME CRITICAL
        </span>
      )}
      <div
        className={`font-mono text-lg tabular-nums ${
          isCritical
            ? "text-red-500 animate-pulse_accent"
            : isUrgent
              ? "text-orange-400"
              : "text-accent"
        }`}
      >
        {remaining}s
      </div>
    </div>
  );
}
