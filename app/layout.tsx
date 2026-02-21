import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCCA | Synthetic Cognitive Capacity Assessment",
  description:
    "The SCCA evaluates whether biological computation exhibits synthetic cognitive capacity on standards appropriate to modern AI systems.",
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
