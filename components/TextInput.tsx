"use client";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  monospace?: boolean;
  /** Accessible label; defaults to the placeholder. */
  label?: string;
}

/**
 * Free-text answer field. Lives inside the QuestionRenderer <form>, so Enter
 * submits (see QuestionRenderer). Focus ring is kept visible for keyboard users.
 */
export function TextInput({
  value,
  onChange,
  placeholder = "Type your answer",
  monospace = false,
  label,
}: TextInputProps) {
  return (
    <div className="w-full max-w-md">
      <input
        type="text"
        name="answer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        enterKeyHint="done"
        className={`w-full p-4 bg-surface border border-border text-lg text-white
          placeholder:text-muted focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 transition-colors
          ${monospace ? "font-mono" : "font-sans"}`}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  );
}
