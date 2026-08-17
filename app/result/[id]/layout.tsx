import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { REPORT_COPY, describeSpecimen } from "@/lib/commentary";
import type { SessionMetrics } from "@/lib/types";

/** Open Graph metadata for a shared report: title, one-line description, and the topology image. */
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const base: Metadata = {
    title: REPORT_COPY.metaTitleDefault,
    description: REPORT_COPY.metaDescriptionDefault,
  };
  try {
    const result = await prisma.result.findUnique({ where: { id: params.id } });
    if (!result) return base;
    const d = describeSpecimen({
      sessionId: result.sessionId,
      overall: result.overall,
      sectionScores: result.sectionScores as Record<string, number>,
      metrics: (result.metrics as unknown as SessionMetrics | null) ?? null,
    });
    return {
      title: d.title,
      description: d.description,
      openGraph: {
        title: d.title,
        description: d.description,
        images: [{ url: `/api/og/${params.id}`, width: 1200, height: 630, alt: `Cognitive topology of specimen #${d.specimen}` }],
        type: "article",
      },
      twitter: { card: "summary_large_image", title: d.title, description: d.description, images: [`/api/og/${params.id}`] },
    };
  } catch (e) {
    console.error("generateMetadata(result) failed", e);
    return base;
  }
}

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return children;
}
