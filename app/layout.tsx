import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Self-hosted via next/font: no render-blocking @import, no FOUT, no third-party request.
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/**
 * Absolute base for Open Graph image URLs. NEXT_PUBLIC_SITE_URL wins (custom
 * domain); otherwise Vercel's own URLs; otherwise localhost. Never throws: a
 * blank or malformed value falls through to the next candidate, and if none
 * parses Next resolves relative image URLs itself on Vercel.
 */
function resolveMetadataBase(): URL | undefined {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    "http://localhost:3000",
  ];
  for (const c of candidates) {
    if (!c || !c.trim()) continue;
    const s = /^https?:\/\//i.test(c) ? c : `https://${c}`;
    try {
      return new URL(s);
    } catch {
      /* try the next candidate */
    }
  }
  return undefined;
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: "MICA | Machine-Indexed Cognitive Assessment",
  description:
    "MICA maps the architecture of biological cognition: its computational boundaries, structural constraints, and the strategies it employs when operating beyond its design parameters.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen grid-bg">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
