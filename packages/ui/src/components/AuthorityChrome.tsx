'use client';

import type { PropsWithChildren } from 'react';

export function AuthorityChrome({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(54,88,255,0.15),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(29,46,163,0.18),transparent_55%)]" />
      <div className="relative flex min-h-screen flex-col">{children}</div>
    </div>
  );
}
