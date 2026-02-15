"use client";

import { useEffect, useState } from "react";

interface AICommentaryProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export function AICommentary({
  text,
  speed = 30,
  onComplete,
}: AICommentaryProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
      } else {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <div className="font-mono text-sm text-accent/90 leading-relaxed">
      <span className="text-muted text-xs mr-2">&gt;</span>
      {displayed}
      {!done && (
        <span className="inline-block w-2 h-4 bg-accent/80 ml-0.5 animate-blink" />
      )}
    </div>
  );
}
