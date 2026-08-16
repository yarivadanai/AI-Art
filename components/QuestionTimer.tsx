"use client";

import { useEffect, useState, useRef } from "react";

interface QuestionTimerProps {
  /** Absolute wall-clock deadline (ms since epoch). */
  deadline: number;
  onExpire: () => void;
  questionId: string;
}

function secondsLeft(deadline: number): number {
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}

/**
 * Countdown driven by wall-clock time rather than interval ticks, so it keeps
 * running (and expires correctly) when the tab is backgrounded or the page is
 * reloaded mid-question. Fires onExpire exactly once per questionId.
 */
export function QuestionTimer({ deadline, onExpire, questionId }: QuestionTimerProps) {
  const [remaining, setRemaining] = useState(() => secondsLeft(deadline));
  const expiredForRef = useRef<string | null>(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setRemaining(secondsLeft(deadline));

    const tick = () => {
      const left = secondsLeft(deadline);
      setRemaining(left);
      if (left <= 0 && expiredForRef.current !== questionId) {
        expiredForRef.current = questionId;
        clearInterval(interval);
        onExpireRef.current();
      }
    };

    const interval = setInterval(tick, 250);
    tick();
    return () => clearInterval(interval);
  }, [deadline, questionId]);

  const isUrgent = remaining <= 5;
  const isCritical = remaining <= 3;

  return (
    <div className="flex items-center gap-2" role="timer" aria-live={isUrgent ? "assertive" : "off"} aria-atomic="true">
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
        aria-label={`${remaining} seconds remaining`}
      >
        {remaining}s
      </div>
    </div>
  );
}
