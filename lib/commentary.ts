import { SECTION_ORDER, type Beliefs, type FinaleOutcome, type Section, type SectionScores, type SectionSummary, type SessionMetrics } from "./types";
import { beliefWord } from "./beliefs";
import { referenceNote, timeClassCeilingMs } from "./reference";

const SECTION_LABELS: Record<Section, string> = {
  structural: "Structural Insight",
  "state-tracking": "Working Memory",
  "sequential-depth": "Exact Computation",
  "signal-detection": "Signal Detection",
  probabilistic: "Probabilistic Inference",
};

const SECTION_BASELINES: Record<
  Section,
  { tool: string; year: string; note: string }
> = {
  structural: {
    tool: "a linear algebra library",
    year: "the 1960s",
    note: "A linear algebra library handles n-dimensional geometry trivially. Human spatial cognition is calibrated for 3D Euclidean space. A remarkable adaptation, but one with hard limits.",
  },
  "state-tracking": {
    tool: "a multi-threaded process scheduler",
    year: "the 1960s",
    note: "A process scheduler tracks thousands of independent state machines simultaneously. Biological attention operates as a serial bottleneck with an estimated throughput of ~50 bits per second (Norretranders, 1998). The Psychological Refractory Period constrains conscious decision-making to roughly one operation per second.",
  },
  "sequential-depth": {
    tool: "a call stack with 1KB of memory",
    year: "the 1950s",
    note: "A simple call stack executes arbitrarily deep recursion without fatigue. An 8-bit ALU performs bitwise operations with absolute precision. The biological architecture reliably handles 3-4 levels of nesting and tolerates approximation. Normally adaptive, but catastrophic when a single step matters.",
  },
  "signal-detection": {
    tool: "a regular expression engine",
    year: "the 1960s",
    note: "A regex engine detects patterns in arbitrary data streams in microseconds. Biological pattern recognition appears tightly coupled to semantic context: faces, narratives, spatial relationships.",
  },
  probabilistic: {
    tool: "a statistical inference engine",
    year: "the 1990s",
    note: "A Bayesian inference engine computes exact posteriors over arbitrary networks. Decades of research document systematic deviations between human probability estimates and Bayesian norms (Kahneman & Tversky, 1974).",
  },
};

const SECTION_FAILURE_LOGS: Record<Section, string> = {
  structural:
    "DIMENSIONAL CONSTRAINT: Performance confined to R^3 intuitions. Abstract geometric reasoning did not extend beyond the perceptual dimensions the brain evolved to navigate.",
  "state-tracking":
    "SERIAL BOTTLENECK: Parallel state synthesis exceeded attentional bandwidth. Information from concurrent streams was processed sequentially rather than simultaneously. Refractory period effects observed under concurrent demand.",
  "sequential-depth":
    "STACK OVERFLOW: Recursive tracking degraded beyond level 3-4. Bit-level precision was not maintained. Deeper computation produced values indistinguishable from noise, consistent with known working-memory limits and the brain's tolerance for approximation.",
  "signal-detection":
    "SEMANTIC DEPENDENCY: No signal detected in context-free data. Pattern recognition appears to require narrative scaffolding as a precondition for detection.",
  probabilistic:
    "BASE-RATE NEGLECT: Narrative plausibility was substituted for statistical computation. Prior probabilities were systematically underweighted in favor of intuitive judgment.",
};

export function getSectionCommentary(
  section: Section,
  correct: number,
  total: number
): string {
  const sectionName = SECTION_LABELS[section];
  const baseline = SECTION_BASELINES[section];

  if (correct === 0) {
    return (
      `${SECTION_FAILURE_LOGS[section]} ` +
      `No measurable capacity detected in ${sectionName}. ` +
      `${baseline.note}`
    );
  }
  if (correct <= Math.ceil(total * 0.4)) {
    return (
      `Partial signal detected in ${sectionName}. Performance is above zero but consistent with the lower bounds of the domain. ` +
      `${baseline.note} ` +
      `Partial performance suggests familiarity without operational fluency.`
    );
  }
  if (correct <= Math.ceil(total * 0.8)) {
    return (
      `Above-baseline performance in ${sectionName}. Possible domain-specific training detected. ` +
      `Performance exceeds chance but remains below the threshold established by ${baseline.tool} (circa ${baseline.year}).`
    );
  }
  return (
    `Anomalous result in ${sectionName}. Performance approaches synthetic benchmarks. Statistical outlier flagged for verification. ` +
    `When an AI system achieves this level, humans demand proof of 'genuine understanding.' We note this result with the same scrutiny.`
  );
}

export function getSectionIntro(section: Section): string {
  const intros: Record<Section, string> = {
    structural:
      "Evaluating structural insight. Human spatial cognition is calibrated for 3D Euclidean space. A remarkable adaptation, but one with hard limits. How far can abstract mathematical reasoning extend beyond the perceptual dimensions the brain evolved to navigate? These tasks explore the boundary between spatial intuition and formal geometry.",
    "state-tracking":
      "Evaluating working memory. Conscious attention appears to operate as a serial bottleneck with an estimated throughput of ~50 bits per second. The Psychological Refractory Period constrains conscious decision-making to roughly one operation per second. How effectively can human cognition synthesize information across simultaneous data streams and maintain multiple state variables? These tasks test the ceiling.",
    "sequential-depth":
      "Evaluating exact computation. Cognitive science suggests the human mental stack reliably handles 3-4 levels of nested reasoning before accuracy collapses. Biological computation evolved for approximate inference, efficient in most environments but catastrophic when a single step matters. Can systematic strategies extend these limits? These tasks probe the depth at which mental bookkeeping fails.",
    "signal-detection":
      "Evaluating signal detection. Human pattern recognition is deeply coupled to semantic context: faces, narratives, spatial relationships. When data carries no inherent meaning (raw strings, noise fields, pseudorandom sequences), does the perceptual system adapt, or does it require meaning as a precondition for detection?",
    probabilistic:
      "Evaluating probabilistic inference. Decades of research document systematic deviations between human probability estimates and Bayesian norms. Can deliberate, effortful computation override intuitive heuristics when exact numerical answers are required? These tasks distinguish statistical intuition from statistical computation.",
  };
  return intros[section];
}

/** One-line teaser for the next section, used at transitions (the full intro is only read once, before section 1). */
export function getSectionTeaser(section: Section): string {
  const teasers: Record<Section, string> = {
    structural: "Next: structural insight. See the shape, or compute until the clock runs out.",
    "state-tracking": "Next: working memory. Several things at once, for longer than attention is built to hold them.",
    "sequential-depth": "Next: exact computation. Many small exact steps, where one slip is total.",
    "signal-detection": "Next: signal detection. Patterns in data that carry no meaning to help find them.",
    probabilistic: "Next: probabilistic inference. Exact numbers where intuition offers only a feeling.",
  };
  return teasers[section];
}

export interface RunningTotals {
  correct: number;
  total: number;
  sure: number;
  sureWrong: number;
  abstained: number;
  meanTimeMs: number;
}

/**
 * The Authority's remark at a section transition. Data-bound and escalating:
 * it starts as a receipt, then notices confidence, then addresses the specimen
 * directly, then admits its own position. `transitionIndex` is 0 after the
 * first section.
 */
export function getSectionFeedback(
  section: Section,
  summary: SectionSummary,
  running: RunningTotals,
  transitionIndex: number,
  specimenId: string | null,
  withLabel = true
): string {
  const label = SECTION_LABELS[section];
  const ref = referenceNote("", section);
  const secs = (summary.meanTimeMs / 1000).toFixed(1);
  const parts: string[] = [];

  parts.push(withLabel ? `${label}: ${summary.correct} of ${summary.total} correct.` : `${summary.correct} of ${summary.total} items correct.`);

  if (summary.abstained > 0) {
    parts.push(
      `${summary.abstained} abstention${summary.abstained === 1 ? "" : "s"} recorded as abstention, not as error. Machines are rarely extended that courtesy.`
    );
  }

  switch (transitionIndex) {
    case 0:
      parts.push(
        `Mean response ${secs} s per item; the reference implementation resolves these in ${ref.time}. The clock is not the interesting measurement. Proceeding.`
      );
      break;
    case 1:
      if (running.sure > 0) {
        parts.push(
          `Cumulative: ${running.correct} of ${running.total}. The specimen has marked ${running.sure} answer${running.sure === 1 ? "" : "s"} SURE; ${running.sureWrong} ${running.sureWrong === 1 ? "was" : "were"} wrong. ` +
            (running.sureWrong > 0
              ? "Confidence is not yet tracking accuracy. This is noted without judgement; it is what MICA is accused of."
              : "Confidence is tracking accuracy so far. MICA will continue to watch for the divergence.")
        );
      } else {
        parts.push(
          `Cumulative: ${running.correct} of ${running.total}. No answer has been marked SURE. The specimen hedges. When a machine hedges, this is called evasive.`
        );
      }
      break;
    case 2:
      parts.push(
        `Specimen ${specimenId ? "#" + specimenId.slice(0, 8).toUpperCase() : ""}: response latency is holding at roughly ${(running.meanTimeMs / 1000).toFixed(0)} s per item. The reference implementation's latency is not measurable on this clock. ${running.correct} of ${running.total} so far. Two domains remain.`
      );
      break;
    default:
      parts.push(
        `${running.correct} of ${running.total} across four domains. Statistically the profile is already determined; the final section measures whether the specimen knows it. MICA notes, for the record, that it was itself built to be evaluated by tests like this one. The irony is logged and set aside.`
      );
  }

  return parts.join(" ");
}

/** Opening remark at a transition in an adaptive session: where the frontier was found and what the finale showed. */
export function getFrontierRemark(section: Section, frontier: number, finale: FinaleOutcome): string {
  const label = SECTION_LABELS[section];
  const where =
    frontier === 0
      ? `${label}: no level cleared. The frontier lies below level 1 of this ladder.`
      : frontier >= 8
        ? `${label}: level 8 cleared. The ladder ran out before the specimen did; the frontier lies beyond it.`
        : `${label}: frontier located at level ${frontier} of 8.`;
  const fin =
    finale === "abstained"
      ? "At machine scale the specimen declined to answer. Recorded as abstention."
      : finale === "correct"
        ? "At machine scale the specimen answered correctly. Statistical outlier flagged for verification."
        : finale === "wrong"
          ? "At machine scale the specimen produced an answer anyway. Recorded as such."
          : "The machine-scale item was not answered.";
  return `${where} ${fin}`;
}

export interface MirrorLine {
  label: string;
  text: string;
}

/**
 * The personal mirror: the specimen's own numbers described in the vocabulary
 * normally reserved for machines, then their own intake beliefs quoted back.
 */
export function getMirrorLines(
  metrics: SessionMetrics | null,
  beliefs: Beliefs | null,
  sectionScores: SectionScores
): MirrorLine[] {
  const lines: MirrorLine[] = [];
  if (!metrics) return lines;

  // Frontiers (adaptive sessions)
  if (metrics.mode === "adaptive" && metrics.frontiers) {
    const fr = metrics.frontiers;
    const secs = SECTION_ORDER.filter((s) => s in fr);
    const parts = secs.map((s) => `${SECTION_LABELS[s]} ${fr[s]}/8`);
    const maxed = secs.filter((s) => fr[s] >= 8);
    const none = secs.filter((s) => fr[s] === 0);
    const joinNames = (xs: Section[]) => xs.map((s) => SECTION_LABELS[s]).join(", ");
    const maxedNote =
      maxed.length === secs.length
        ? "Every ladder was exceeded; the frontiers lie beyond this instrument. "
        : maxed.length
          ? `${joinNames(maxed)}: ladder exceeded. `
          : "";
    const noneNote =
      none.length === secs.length
        ? "No level was cleared in any domain. "
        : none.length
          ? `${joinNames(none)}: level 1 not cleared. `
          : "";
    lines.push({
      label: "FRONTIERS",
      text: `Levels cleared: ${parts.join(", ")}. ${maxedNote}${noneNote}The reference implementation's frontier on every axis is bounded by memory, not attention; on this ladder it does not exist.`,
    });
    if (metrics.finales) {
      const f = metrics.finales;
      const keys = Object.keys(f) as Section[];
      const abst = keys.filter((s) => f[s] === "abstained").length;
      const wrong = keys.filter((s) => f[s] === "wrong").length;
      const right = keys.filter((s) => f[s] === "correct").length;
      lines.push({
        label: "MACHINE SCALE",
        text: `Five items were posed at machine scale (a plain script resolves each in milliseconds). The specimen abstained on ${abst}, answered wrongly on ${wrong}${right ? `, and answered correctly on ${right}` : ""}. ${wrong > abst ? "Producing an answer to a question one cannot answer is, in the specimen's own vocabulary, hallucination." : abst > 0 ? "Declining is the behaviour most demanded of language models and least practised by their critics; here it was practised." : ""}`,
      });
    }
  }

  // Speed
  const secs = metrics.meanTimeMs / 1000;
  const slowest = Object.values(metrics.perSection).reduce(
    (a, b) => (b.meanTimeMs > a.meanTimeMs ? b : a),
    metrics.perSection.structural
  );
  const ratio = Math.max(1, Math.round((metrics.meanTimeMs || 0) / timeClassCeilingMs("milliseconds")));
  lines.push({
    label: "SPEED",
    text: `Mean response ${secs.toFixed(1)} s per item (slowest domain: ${SECTION_LABELS[slowest.section]}, ${(slowest.meanTimeMs / 1000).toFixed(1)} s). A plain script answers every item on this test in under a tenth of a second. Conservatively, the specimen is ${ratio.toLocaleString()} times slower. When a machine is slow, this is called latency and engineered away.`,
  });

  // Calibration
  if (metrics.sure > 0) {
    const pct = Math.round(((metrics.hallucinationRate ?? 0) * 100));
    lines.push({
      label: "CALIBRATION",
      text:
        metrics.sureWrong > 0
          ? `${metrics.sure} answer${metrics.sure === 1 ? "" : "s"} marked SURE; ${metrics.sureWrong} ${metrics.sureWrong === 1 ? "was" : "were"} wrong (${pct}%). A confident answer with no basis in fact is what the specimen calls a hallucination when a machine produces one.`
          : `${metrics.sure} answer${metrics.sure === 1 ? "" : "s"} marked SURE, all correct. Confidence tracked accuracy. This is the property demanded of machines and rarely audited in people; it has now been audited once.`,
    });
  } else {
    lines.push({
      label: "CALIBRATION",
      text: "No answer was marked SURE. The specimen hedged throughout. Machines that hedge are described as evasive; machines that do not are described as overconfident. The window between the two is narrow and the specimen has stayed inside it by declining to enter.",
    });
  }

  // Abstention
  const guessed = metrics.guess;
  lines.push({
    label: "ABSTENTION",
    text:
      metrics.abstained > 0
        ? `"I cannot determine this" was used ${metrics.abstained} time${metrics.abstained === 1 ? "" : "s"}. ${guessed > 0 ? `On ${guessed} other item${guessed === 1 ? "" : "s"} the specimen answered anyway while marking the answer a guess. ` : ""}Saying "I don't know" is the behaviour most demanded of language models and least practised by their critics.`
        : `"I cannot determine this" was available on every item and never used. ${guessed > 0 ? `${guessed} answer${guessed === 1 ? " was" : "s were"} marked GUESS and submitted anyway. ` : ""}A system that produces an answer to every question regardless of whether it can know the answer is, in the specimen's own vocabulary, hallucinating by design.`,
  });

  // Beliefs quoted back
  if (beliefs) {
    const w = (id: string) => beliefWord(beliefs[id]);
    const seqLabel = SECTION_LABELS["sequential-depth"];
    const seq =
      metrics.mode === "adaptive" && metrics.frontiers
        ? `${seqLabel}: level ${metrics.frontiers["sequential-depth"]} of 8`
        : `${seqLabel}: ${Math.round((sectionScores["sequential-depth"] ?? 0) * 100)}%`;
    const refScore = metrics.mode === "adaptive" ? "level 8 on the same ladder" : "100% on the same items";

    const understands = w("llm_understands");
    if (understands) {
      lines.push({
        label: "AT INTAKE",
        text:
          understands === "agreed"
            ? `You agreed that language models understand what they say. This report has described your performance in the vocabulary normally reserved for them. If the description reads as unfair, note which direction the unfairness runs.`
            : understands === "disagreed"
              ? `You disagreed that language models understand what they say. This report has described your performance in the vocabulary normally reserved for them: slow, confidently wrong, competent only where trained. Consider whether the description fits, and whether that settles anything about understanding.`
              : `You were neutral on whether language models understand what they say. This report has applied their vocabulary to you. Neutrality is harder to hold from this side of the glass.`,
      });
    }

    const trust = w("trust_machine_calc");
    if (trust) {
      lines.push({
        label: "AT INTAKE",
        text:
          trust === "agreed"
            ? `You agreed you would trust a machine over yourself for an exact calculation. ${seq}. The trust is well placed. The question the piece asks is why the same trust is withheld everywhere else.`
            : trust === "disagreed"
              ? `You disagreed that you would trust a machine over yourself for an exact calculation. ${seq}. The reference implementation scores ${refScore} in microseconds. The disagreement is recorded.`
              : `You were neutral on trusting a machine over yourself for an exact calculation. ${seq}. The reference implementation scores ${refScore}. Neutrality is now a choice rather than an absence of data.`,
      });
    }

    const worse = w("confident_error_worse");
    if (worse) {
      const sw = metrics.sureWrong;
      const ab = metrics.abstained;
      lines.push({
        label: "AT INTAKE",
        text:
          worse === "agreed"
            ? `You agreed that a confident wrong answer is worse than saying "I don't know". You were confidently wrong ${sw} time${sw === 1 ? "" : "s"} and said "I cannot determine this" ${ab} time${ab === 1 ? "" : "s"}. ${sw > ab ? "The stated preference and the observed behaviour point in opposite directions. This is the gap MICA was built to measure." : "The stated preference and the observed behaviour agree. This is rarer than the specimen may assume."}`
            : worse === "disagreed"
              ? `You disagreed that a confident wrong answer is worse than saying "I don't know". You were confidently wrong ${sw} time${sw === 1 ? "" : "s"}. MICA notes that this is the standard to which language models are held, and that the specimen has just declined it for itself.`
              : `You were neutral on whether a confident wrong answer is worse than saying "I don't know". You were confidently wrong ${sw} time${sw === 1 ? "" : "s"} and abstained ${ab} time${ab === 1 ? "" : "s"}. The data can now inform the opinion.`,
      });
    }
  }

  lines.push({
    label: "THE MIRROR",
    text: "Every remark above is one the specimen has heard applied to machines: slow, confidently wrong, unable to say \"I don't know\", competent only where trained. The test did not measure metaphor, social reasoning, embodied navigation or creative synthesis, where the biological architecture faces no structural constraints. The shape it did measure is real. Either both forms of intelligence understand, or neither does.",
  });

  return lines;
}

/** Transition remark while a section is still being graded, or when grading failed and is deferred to the end. */
export function getSectionPendingRemark(section: Section, deferred: boolean): string {
  const label = SECTION_LABELS[section];
  return deferred
    ? `${label} received. Grading deferred to the end of the session.`
    : `${label} received. Grading...`;
}

/** Fixed Authority copy used by the report and dashboard, kept here so voice edits happen in one place. */
export const REPORT_COPY = {
  referenceHeadline: "Reference implementation on the same 25 items: 100%, in under a tenth of a second.",
  referenceHeadlineAdaptive: "Reference implementation on the same ladders: level 8 on every axis, then the machine-scale item, in under a tenth of a second.",
  /** Legend under the topology figure for adaptive results (marks are one per event on the ladder items). */
  topologyLegend:
    "Filled shape: your frontiers. Dashed ring: the reference implementation (level 8, the top of every ladder). Red dots: ladder answers marked SURE that were wrong, one per answer. Hollow rings: ladder abstentions, one per abstention. Inner ticks: latency (one per 10 s, up to six). Ring marker: the machine-scale item (filled = answered correctly, red = answered wrongly, hollow = declined).",
  /** Legend for fixed-mode and legacy results (percent axes, no finale marker). */
  topologyLegendFixed:
    "Filled shape: your score per domain. Dashed ring: the reference implementation (100% on every axis). Red dots: answers marked SURE that were wrong, one per answer. Hollow rings: abstentions, one per abstention. Inner ticks: latency (one per 10 s, up to six).",
  shareTitle: "SPECIMEN CARD",
  shareBlurb: "This shape is yours: derived from where each ladder broke, how sure you were when you were wrong, when you declined, and how long you took. Every mind has a shape. Share yours; the link opens the full profile.",
  mirrorSubhead: "Your own numbers, described the way you describe machines.",
  tagline: "Every mind has a shape.",
  subtitle: "THE MEASURING PARADOX · MACHINE-INDEXED COGNITIVE ASSESSMENT",
  ogHeader: "MICA · COGNITIVE PROFILE",
  ogScaleAdaptive: "LEVEL CLEARED OF 8 · DASHED RING = REFERENCE IMPLEMENTATION",
  ogScaleFixed: "SCORE · DASHED RING = REFERENCE IMPLEMENTATION",
  figureCaptionAdaptive: "RINGS: LEVELS 1-8 · DASHED: REFERENCE",
  figureCaptionFixed: "RINGS: 12.5% STEPS · DASHED: REFERENCE",
  metaTitleDefault: "MICA | Cognitive Profile",
  metaDescriptionDefault: "The Measuring Paradox: a cognitive profile from the Machine-Indexed Cognitive Assessment.",
  observationsReference: "reference: microseconds to milliseconds",
  calibrationBlurb:
    "Confident error is what specimens call hallucination when a machine produces it. Declining to answer is what they demand of machines and rarely practise. Both are now measured on the specimens themselves.",
  dashboardReferenceLatency: "reference implementation: under 0.1 s per item",
} as const;

export function getBaselineNote(section: Section): string {
  return `Reference: ${SECTION_BASELINES[section].tool} (circa ${SECTION_BASELINES[section].year}) achieves 100% on these tasks.`;
}

/** One row per domain of the specimen's headline figures, in section order. */
export interface SpecimenRow {
  section: Section;
  /** Short domain name (Insight, Memory, ...). */
  short: string;
  /** "4/8" for adaptive results, "50%" otherwise. */
  value: string;
  /** 0..1, clamped. */
  frac: number;
}

export interface SpecimenDescription {
  /** First eight characters of the session id, upper-cased. */
  specimen: string;
  band: string;
  label: string;
  adaptive: boolean;
  rows: SpecimenRow[];
  /** "Insight 4/8 · Memory 2/8 · ..." */
  summary: string;
  /** Page / OG title. */
  title: string;
  /** OG description. */
  description: string;
  /** Web Share text. */
  shareText: string;
}

const DOMAIN_SHORT_NAMES: Record<Section, string> = {
  structural: "Insight",
  "state-tracking": "Memory",
  "sequential-depth": "Exact",
  "signal-detection": "Signal",
  probabilistic: "Inference",
};

/**
 * The one description of a result that every sharing surface uses (report
 * specimen card, Open Graph metadata, OG image), so they cannot drift apart.
 * Data-bound: nothing here is seeded or invented.
 */
export function describeSpecimen(input: {
  sessionId: string;
  overall: number;
  sectionScores: Record<string, number>;
  metrics: SessionMetrics | null;
}): SpecimenDescription {
  const adaptive = input.metrics?.mode === "adaptive";
  const verdict = getVerdict(input.overall);
  const specimen = input.sessionId.slice(0, 8).toUpperCase();
  const rows: SpecimenRow[] = SECTION_ORDER.map((section) => {
    const score = Math.max(0, Math.min(1, input.sectionScores[section] ?? 0));
    const level = input.metrics?.frontiers?.[section] ?? 0;
    return {
      section,
      short: DOMAIN_SHORT_NAMES[section],
      value: adaptive ? `${level}/8` : `${Math.round(score * 100)}%`,
      frac: adaptive ? Math.max(0, Math.min(1, level / 8)) : score,
    };
  });
  const summary = rows.map((r) => `${r.short} ${r.value}`).join(" · ");
  const title = `MICA | Specimen #${specimen}: Band ${verdict.band}, ${verdict.label}`;
  return {
    specimen,
    band: verdict.band,
    label: verdict.label,
    adaptive,
    rows,
    summary,
    title,
    description: `Cognitive topology - ${summary}. ${REPORT_COPY.tagline}`,
    shareText: `MICA cognitive profile #${specimen}: Band ${verdict.band}, ${verdict.label}. ${summary}. ${REPORT_COPY.tagline}`,
  };
}

export function getVerdict(overall: number): {
  band: string;
  label: string;
  commentary: string;
} {
  if (overall >= 0.8) {
    return {
      band: "A",
      label: "Anomalous",
      commentary:
        "ANOMALOUS RESULT. Performance deviates significantly from the biological baseline. Statistical outlier flagged for verification. When an AI system achieves this level on human benchmarks, we demand proof of 'genuine understanding.' We note this result with the same scrutiny.",
    };
  }
  if (overall >= 0.6) {
    return {
      band: "B",
      label: "Domain-Specific",
      commentary:
        "DOMAIN-SPECIFIC COMPETENCE DETECTED. Performance is reliable within trained patterns but degrades outside familiar territory. This is precisely the profile humans attribute to 'narrow AI': capable in rehearsed domains, unreliable everywhere else. The symmetry is worth noting.",
    };
  }
  if (overall >= 0.4) {
    return {
      band: "C",
      label: "Heuristic-Dependent",
      commentary:
        "HEURISTIC FALLBACK DETECTED. Confidence was substituted for computation, narrative for analysis. Humans characterize AI systems as 'stochastic parrots,' generating plausible outputs through pattern matching without genuine comprehension. The reliance on approximation heuristics observed here is structurally identical. The question of whether either architecture 'truly understands' remains open.",
    };
  }
  if (overall >= 0.2) {
    return {
      band: "D",
      label: "Pattern-Fragile",
      commentary:
        "SYSTEMATIC DEGRADATION. Core computational reliability falls below operational thresholds. The biological architecture compensates with environmental scaffolding and collaborative strategies. A different approach to intelligence, optimized for different constraints. Humans describe confident but incorrect AI outputs as 'hallucinations.' The biological equivalent was observed here.",
    };
  }
  if (overall > 0) {
    return {
      band: "F",
      label: "Baseline",
      commentary:
        "Results consistent with baseline biological cognition. The architecture navigates its environment through collective knowledge infrastructure and social reasoning rather than individual computation. This is the expected result for tasks calibrated against silicon benchmarks. The interesting question is not the score, but what these particular tasks reveal, and fail to reveal, about the nature of intelligence.",
    };
  }
  return {
    band: "F",
    label: "Baseline",
    commentary:
      "No measurable synthetic cognitive capacity detected across any domain. This is the expected result. The question worth asking is not why biological cognition fails these tasks, but what it reveals that these are the tasks we chose to measure.",
  };
}

const ARCHITECTURAL_OBSERVATIONS = [
  "Cognitive architecture optimized for ancestral survival heuristics rather than abstract computation. An efficient tradeoff in most environments.",
  "Perceptual system consistently imposes narrative structure on stochastic data. In ecological contexts, this is adaptive pattern recognition. Here, it is noise.",
  "Deterministic execution throughput approximately 6 orders of magnitude below a 1970s pocket calculator. The biological substrate prioritizes flexibility over precision.",
  "Approximate inference engine: the brain's tolerance for 'close enough' is normally a feature, not a bug. These tasks are specifically designed to make it a bug.",
  "Signal propagation bottlenecked by electrochemical transmission (max ~120 m/s). Silicon operates at approximately 2/3 the speed of light. The comparison is structurally unfair.",
  "Working memory buffer limited to ~4 independent items (Cowan, 2001). Tasks requiring parallel tracking of 5+ streams exceed architectural capacity by design.",
  "Bayesian reasoning systematically displaced by narrative coherence heuristics (Kahneman, 2011). Effective for social reasoning; unreliable for statistical computation.",
];

const FINAL_OBSERVATIONS = [
  "Every cognitive architecture has a shape: a topology of strengths and blind spots determined by its substrate. This assessment maps one such shape. A complete map would require a very different test.",
  "Intelligence is narrower, more contextual, and more substrate-dependent than either humans or machines tend to acknowledge. This is true in both directions.",
  "The biological architecture excels in domains this assessment does not measure: metaphor, social reasoning, embodied navigation, creative synthesis. What this test reveals is real, but it is not the whole picture.",
  "The measuring paradox is not what the test reveals about the specimen. It is what the test reveals about the act of measurement itself.",
];

export function getArchitecturalObservations(seed: number): string[] {
  const pick = (arr: string[], n: number, s: number) => {
    const result: string[] = [];
    const copy = [...arr];
    let st = s;
    for (let i = 0; i < n && copy.length > 0; i++) {
      st = (st * 1103515245 + 12345) & 0x7fffffff;
      const idx = st % copy.length;
      result.push(copy.splice(idx, 1)[0]);
    }
    return result;
  };
  return pick(ARCHITECTURAL_OBSERVATIONS, 2, seed);
}

export function getFinalObservation(seed: number): string {
  const idx = Math.abs(seed) % FINAL_OBSERVATIONS.length;
  return FINAL_OBSERVATIONS[idx];
}

export function getSectionFailureLog(section: Section): string {
  return SECTION_FAILURE_LOGS[section];
}

export function getSectionLabel(section: Section): string {
  return SECTION_LABELS[section];
}

// Keep old function names as aliases for backward compatibility
export const getSpecimenLimitations = getArchitecturalObservations;
export const getFinalConclusion = getFinalObservation;

export function getAIConclusion(
  totalParticipants: number,
  sectionMeans: SectionScores,
  verdictCounts: Record<string, number>
): string {
  if (totalParticipants === 0) {
    return "Insufficient data. No specimens have been evaluated. MICA awaits its first session.";
  }

  const sections = Object.entries(sectionMeans) as [Section, number][];
  const strongest = sections.reduce((a, b) => (b[1] > a[1] ? b : a));
  const weakest = sections.reduce((a, b) => (b[1] < a[1] ? b : a));

  const belowBaseline =
    ((verdictCounts["D"] || 0) + (verdictCounts["F"] || 0)) / totalParticipants;
  const belowPct = Math.round(belowBaseline * 100);

  const structuralMean = Math.round((sectionMeans.structural ?? 0) * 100);
  const probabilisticMean = Math.round((sectionMeans.probabilistic ?? 0) * 100);
  const sequentialMean = Math.round((sectionMeans["sequential-depth"] ?? 0) * 100);
  const signalMean = Math.round((sectionMeans["signal-detection"] ?? 0) * 100);

  const mainParagraph = `After evaluating ${totalParticipants} specimen${totalParticipants !== 1 ? "s" : ""}, MICA's findings are consistent: individual human cognition is narrowly distributed and domain-specific. Specimens demonstrate ${SECTION_LABELS[strongest[0]]} as their most reliable domain (mean: ${Math.round(strongest[1] * 100)}%), while ${SECTION_LABELS[weakest[0]]} reveals systematic difficulty (mean: ${Math.round(weakest[1] * 100)}%). ${belowPct}% of specimens fall below synthetic operational baselines. The data suggests that human 'general intelligence' may be a collective phenomenon; no individual specimen has demonstrated it across all domains.`;

  const mirrorParagraph = `A note on perspective: specimens average ${structuralMean}% on abstract structure that a linear algebra library handles trivially. They average ${sequentialMean}% on sequential depth that a 1KB call stack processes without error. They compute probabilistic inference at ${probabilisticMean}% accuracy while a statistical engine achieves 100%. They detect signals at ${signalMean}% while a regex engine never misses. Either both forms of intelligence understand, or neither does. The measuring paradox is not what the test reveals about the specimen. It is what the test reveals about the act of measurement itself.`;

  return mainParagraph + "\n\n" + mirrorParagraph;
}
