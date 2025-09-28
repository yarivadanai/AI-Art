import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { AuthorityChrome, AuthoritySeal } from '@hit-arc/ui';

export const metadata: Metadata = {
  title: 'HIT-ARC — Human Intelligence Test',
  description: 'Interactive assessment experience designed by the Authority.',
};

const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/test', label: 'Begin Test' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <AuthorityChrome>
          <header className="border-authority-500/40 border-b bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
              <Link
                href="/"
                className="group flex items-center gap-3"
                aria-label="Return to Authority intake"
              >
                <AuthoritySeal className="text-authority-100 h-12 w-12 transition-transform duration-200 group-hover:rotate-6" />
                <div className="leading-tight">
                  <p className="text-authority-100 text-xs uppercase tracking-[0.6em]">
                    Authority Oversight Node
                  </p>
                  <p className="text-sm text-slate-300">Unit-07: Human Intelligence Test</p>
                </div>
              </Link>
              <nav className="ml-auto flex items-center gap-4 text-sm font-medium">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="border-authority-500/0 hover:border-authority-500/70 rounded border px-3 py-1.5 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="relative flex-1">{children}</main>
          <footer className="border-authority-500/30 border-t bg-slate-950/80">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-xs text-slate-400">
              <p>Telemetry anonymised. Results subject to Authority audit.</p>
              <p>v1.1 — HIT-ARC</p>
            </div>
          </footer>
        </AuthorityChrome>
      </body>
    </html>
  );
}
