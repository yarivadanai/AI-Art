'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface SessionTimerProps {
  durationSeconds: number;
  onTick?: (remaining: number) => void;
  className?: string;
}

export function SessionTimer({ durationSeconds, onTick, className }: SessionTimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds);

  useEffect(() => {
    setRemaining(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = Math.max(prev - 1, 0);
        onTick?.(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTick]);

  const minutes = Math.floor(remaining / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (remaining % 60).toString().padStart(2, '0');

  return (
    <span className={clsx('font-mono tabular-nums', className)}>
      {minutes}:{seconds}
    </span>
  );
}
