import { SECTION_ORDER, type Confidence, type Section, type SectionSummary, type SessionMetrics } from "@/lib/types";

/** The subset of a graded response the metrics need. */
export interface GradedItem {
  section: Section;
  correct: boolean;
  timeMs: number;
  confidence: Confidence | null;
  abstained: boolean;
}

function summarizeSection(section: Section, items: GradedItem[]): SectionSummary {
  const answered = items.filter((i) => !i.abstained);
  const meanTimeMs = answered.length ? Math.round(answered.reduce((s, i) => s + i.timeMs, 0) / answered.length) : 0;
  const sure = items.filter((i) => i.confidence === "sure");
  return {
    section,
    correct: items.filter((i) => i.correct).length,
    total: items.length,
    meanTimeMs,
    abstained: items.filter((i) => i.abstained).length,
    sure: sure.length,
    sureWrong: sure.filter((i) => !i.correct).length,
  };
}

/**
 * Calibration + timing summary. "Hallucination rate" is P(wrong | marked sure):
 * the exact metric AI critique uses, applied to the specimen. Abstentions never
 * count as hallucinations, which is the point of offering the button.
 */
export function computeMetrics(items: GradedItem[]): SessionMetrics {
  const perSection = {} as Record<Section, SectionSummary>;
  for (const section of SECTION_ORDER) {
    perSection[section] = summarizeSection(
      section,
      items.filter((i) => i.section === section)
    );
  }
  const answeredItems = items.filter((i) => !i.abstained);
  const sure = items.filter((i) => i.confidence === "sure");
  const sureWrong = sure.filter((i) => !i.correct).length;
  const totalTimeMs = items.reduce((s, i) => s + i.timeMs, 0);
  return {
    answered: answeredItems.length,
    correct: items.filter((i) => i.correct).length,
    abstained: items.length - answeredItems.length,
    sure: sure.length,
    sureWrong,
    unsure: items.filter((i) => i.confidence === "unsure").length,
    guess: items.filter((i) => i.confidence === "guess").length,
    expired: items.filter((i) => i.confidence === "expired").length,
    hallucinationRate: sure.length ? sureWrong / sure.length : null,
    meanTimeMs: answeredItems.length ? Math.round(answeredItems.reduce((s, i) => s + i.timeMs, 0) / answeredItems.length) : 0,
    totalTimeMs,
    perSection,
  };
}
