"use client";

interface DataPayloadDisplayProps {
  data: string;
}

export function DataPayloadDisplay({ data }: DataPayloadDisplayProps) {
  return (
    <div className="w-full max-h-[500px] overflow-auto bg-[#050505] border border-border p-4 font-mono text-[10px] sm:text-xs text-green-400/80 whitespace-pre-wrap break-all leading-relaxed select-all">
      {data}
    </div>
  );
}
