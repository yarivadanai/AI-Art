"use client";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  monospace?: boolean;
}

export function TextInput({
  value,
  onChange,
  placeholder = "Type your answer",
  monospace = false,
}: TextInputProps) {
  return (
    <div className="w-full max-w-md">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-4 bg-surface border border-border text-lg text-white
          placeholder:text-muted focus:border-accent focus:outline-none transition-colors
          ${monospace ? "font-mono" : "font-sans"}`}
        autoFocus
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}
