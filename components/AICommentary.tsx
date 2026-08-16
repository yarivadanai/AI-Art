"use client";

import { useEffect, useRef, useState } from "react";

interface AICommentaryProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  /** Extra classes for the text container (size/colour); defaults to the accent voice. */
  className?: string;
  /** Render fully typed immediately (e.g. reduced motion or non-primary text). */
  instant?: boolean;
}

/**
 * The Authority's typed voice. Click (or press Space/Enter while focused) to
 * skip the animation and show the full text; paragraph breaks ("\n\n") are
 * preserved. Respects prefers-reduced-motion by rendering instantly.
 */
export function AICommentary({
  text,
  speed = 30,
  onComplete,
  className,
  instant = false,
}: AICommentaryProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const skipRef = useRef(false);

  useEffect(() => {
    skipRef.current = false;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (instant || reduced) {
      setDisplayed(text);
      setDone(true);
      onCompleteRef.current?.();
      return;
    }

    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (skipRef.current) {
        setDisplayed(text);
        setDone(true);
        clearInterval(interval);
        onCompleteRef.current?.();
        return;
      }
      i++;
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
      } else {
        clearInterval(interval);
        setDone(true);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, instant]);

  const skip = () => {
    if (!done) skipRef.current = true;
  };

  return (
    <div
      className={`font-mono text-sm leading-relaxed whitespace-pre-wrap ${className ?? "text-accent/90"} ${done ? "" : "cursor-pointer"}`}
      onClick={skip}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          skip();
        }
      }}
      role={done ? undefined : "button"}
      tabIndex={done ? -1 : 0}
      aria-live="polite"
      title={done ? undefined : "Click to show the full text"}
    >
      <span className="text-muted text-xs mr-2 select-none">&gt;</span>
      {displayed}
      {!done && (
        <span className="inline-block w-2 h-4 bg-accent/80 ml-0.5 animate-blink align-text-bottom" aria-hidden="true" />
      )}
    </div>
  );
}
