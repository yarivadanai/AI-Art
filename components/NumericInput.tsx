"use client";

interface NumericInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

/**
 * Numeric answer field. type="text" + inputMode="decimal" gives phones a
 * number keypad that still allows "-" and "." without the browser's number
 * spinner or silent rejection of partial input. Enter submits via the parent form.
 */
export function NumericInput({
  value,
  onChange,
  placeholder = "Enter your answer",
  label,
}: NumericInputProps) {
  return (
    <div className="w-full max-w-xs">
      <input
        type="text"
        name="answer"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        enterKeyHint="done"
        className="w-full p-4 bg-surface border border-border font-mono text-lg text-white
          placeholder:text-muted focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 transition-colors"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
    </div>
  );
}
