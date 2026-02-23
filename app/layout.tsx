import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
    <html lang="en">
      <body className="min-h-screen grid-bg">{children}</body>
    </html>
  );
}
