"use client";

import { useEffect, useState } from "react";
import { useTestStore } from "@/lib/store";

export function GlobalTimer() {
  const expiresAt = useTestStore((s) => s.expiresAt);
  const phase = useTestStore((s) => s.phase);
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    if (!expiresAt || phase === "complete") return;

    const tick = () => {
      const diff = Math.max(0, expiresAt - Date.now());
      setRemaining(diff);

      if (diff <= 0) {
        useTestStore.getState().setPhase("submitting");
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, phase]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const isLow = remaining < 2 * 60 * 1000;

  return (
    <div
      className={`font-mono text-lg tabular-nums ${
        isLow ? "text-red-500 animate-pulse_accent" : "text-accent"
      }`}
    >
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
}
