'use client';

import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

export type AuthoritySealProps = ComponentPropsWithoutRef<'svg'> & {
  label?: string;
};

export function AuthoritySeal({
  className,
  label = 'HIT-ARC Authority Seal',
  ...props
}: AuthoritySealProps) {
  return (
    <svg
      {...props}
      role="img"
      aria-label={label}
      viewBox="0 0 120 120"
      className={clsx('text-authority-100 h-12 w-12', className)}
    >
      <defs>
        <radialGradient id="authority-seal-glow" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="rgba(54,88,255,0.65)" />
          <stop offset="100%" stopColor="rgba(29,46,163,0)" />
        </radialGradient>
      </defs>
      <circle
        cx="60"
        cy="60"
        r="56"
        stroke="currentColor"
        strokeWidth="2"
        fill="url(#authority-seal-glow)"
      />
      <circle
        cx="60"
        cy="60"
        r="40"
        stroke="currentColor"
        strokeDasharray="4 6"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M60 24v72M24 60h72"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M60 38c8.8 0 16 7.2 16 16 0 4.6-2 8.8-5.1 11.7L60 84l-10.9-18.3A15.6 15.6 0 0 1 44 54c0-8.8 7.2-16 16-16z"
        stroke="currentColor"
        strokeWidth="2"
        fill="rgba(54,88,255,0.2)"
      />
      <text
        x="50%"
        y="109"
        textAnchor="middle"
        fontSize="12"
        fontFamily="'IBM Plex Mono', monospace"
        letterSpacing="4"
        fill="currentColor"
        opacity="0.6"
      >
        HIT·ARC
      </text>
    </svg>
  );
}
