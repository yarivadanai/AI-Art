import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getVerdict } from "@/lib/commentary";
import { DOMAIN_SHORT } from "@/lib/topology";
import { SECTION_ORDER, type SessionMetrics } from "@/lib/types";

/** Open Graph metadata for a shared report: title, one-line description, and the topology image. */
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const base: Metadata = {
    title: "MICA | Cognitive Profile",
    description: "The Measuring Paradox: a cognitive profile from the Machine-Indexed Cognitive Assessment.",
  };
  try {
    const result = await prisma.result.findUnique({ where: { id: params.id } });
    if (!result) return base;
    const metrics = (result.metrics as unknown as SessionMetrics | null) ?? null;
    const scores = result.sectionScores as Record<string, number>;
    const verdict = getVerdict(result.overall);
    const specimen = result.sessionId.slice(0, 8).toUpperCase();
    const summary = SECTION_ORDER.map((s) =>
      metrics?.mode === "adaptive"
        ? `${DOMAIN_SHORT[s]} ${metrics.frontiers?.[s] ?? 0}/8`
        : `${DOMAIN_SHORT[s]} ${Math.round((scores[s] ?? 0) * 100)}%`
    ).join(" · ");
    const title = `MICA | Specimen #${specimen}: Band ${verdict.band}, ${verdict.label}`;
    const description = `Cognitive topology - ${summary}. Every mind has a shape.`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: `/api/og/${params.id}`, width: 1200, height: 630, alt: `Cognitive topology of specimen #${specimen}` }],
        type: "article",
      },
      twitter: { card: "summary_large_image", title, description, images: [`/api/og/${params.id}`] },
    };
  } catch (e) {
    console.error("generateMetadata(result) failed", e);
    return base;
  }
}

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return children;
}
