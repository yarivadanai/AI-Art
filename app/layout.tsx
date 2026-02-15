import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HIT-ARC | Human Intelligence Test",
  description:
    "The Abstraction Research Center evaluates whether biological computation exhibits general intelligence.",
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
