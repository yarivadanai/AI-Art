"use client";

interface NumericInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function NumericInput({
  value,
  onChange,
  placeholder = "Enter your answer",
}: NumericInputProps) {
  return (
    <div className="w-full max-w-xs">
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 bg-surface border border-border font-mono text-lg text-white
          placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
        autoFocus
      />
    </div>
  );
}
