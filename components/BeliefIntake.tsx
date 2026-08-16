"use client";

import { BELIEF_ITEMS, BELIEF_SCALE } from "@/lib/beliefs";
import type { Beliefs } from "@/lib/types";

interface BeliefIntakeProps {
  value: Beliefs;
  onChange: (next: Beliefs) => void;
}

/**
 * Three intake statements on a 1-5 scale. Answered before the test and quoted
 * back on the report against the specimen's own performance.
 */
export function BeliefIntake({ value, onChange }: BeliefIntakeProps) {
  return (
    <div className="card space-y-5">
      <div>
        <div className="section-label">PRIOR POSITIONS</div>
        <p className="font-sans text-xs text-muted mt-1">
          Recorded before evaluation. MICA will return to these.
        </p>
      </div>
      {BELIEF_ITEMS.map((item) => (
        <fieldset key={item.id} className="space-y-2">
          <legend className="font-sans text-sm text-white">{item.statement}</legend>
          <div className="flex items-center gap-1" role="radiogroup" aria-label={item.statement}>
            <span className="font-mono text-[10px] text-muted mr-1 hidden sm:inline">DISAGREE</span>
            {[1, 2, 3, 4, 5].map((n) => {
              const active = value[item.id] === n;
              return (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={`${BELIEF_SCALE[n - 1]}`}
                  title={BELIEF_SCALE[n - 1]}
                  onClick={() => onChange({ ...value, [item.id]: n })}
                  className={`w-9 h-9 font-mono text-xs border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
                    ${active ? "border-accent bg-accent/15 text-white" : "border-border text-white/60 hover:border-accent/50 hover:text-white"}`}
                >
                  {n}
                </button>
              );
            })}
            <span className="font-mono text-[10px] text-muted ml-1 hidden sm:inline">AGREE</span>
          </div>
        </fieldset>
      ))}
    </div>
  );
}
