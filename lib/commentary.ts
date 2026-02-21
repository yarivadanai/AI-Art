import type { Section, SectionScores } from "./types";

const SECTION_LABELS: Record<Section, string> = {
  structural: "Abstract Structure",
  "state-tracking": "State Tracking",
  "sequential-depth": "Sequential Depth",
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
    note: "A linear algebra library handles n-dimensional geometry trivially. Human spatial cognition is calibrated for 3D Euclidean space -- a remarkable adaptation, but one with hard limits.",
  },
  "state-tracking": {
    tool: "a multi-threaded process scheduler",
    year: "the 1960s",
    note: "A process scheduler tracks thousands of independent state machines simultaneously. Biological attention operates as a serial bottleneck with an estimated throughput of ~50 bits per second (Norretranders, 1998). The Psychological Refractory Period constrains conscious decision-making to roughly one operation per second.",
  },
  "sequential-depth": {
    tool: "a call stack with 1KB of memory",
    year: "the 1950s",
    note: "A simple call stack executes arbitrarily deep recursion without fatigue. An 8-bit ALU performs bitwise operations with absolute precision. The biological architecture reliably handles 3-4 levels of nesting and tolerates approximation -- normally adaptive, but catastrophic when a single step matters.",
  },
  "signal-detection": {
    tool: "a regular expression engine",
    year: "the 1960s",
    note: "A regex engine detects patterns in arbitrary data streams in microseconds. Biological pattern recognition appears tightly coupled to semantic context -- faces, narratives, spatial relationships.",
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
    "STACK OVERFLOW: Recursive tracking degraded beyond level 3-4. Bit-level precision was not maintained. Deeper computation produced values indistinguishable from noise -- consistent with known working-memory limits and the brain's tolerance for approximation.",
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
      "Evaluating abstract structure. Human spatial cognition is calibrated for 3D Euclidean space -- a remarkable adaptation, but one with hard limits. How far can abstract mathematical reasoning extend beyond the perceptual dimensions the brain evolved to navigate? These tasks explore the boundary between spatial intuition and formal geometry.",
    "state-tracking":
      "Evaluating state tracking. Conscious attention appears to operate as a serial bottleneck with an estimated throughput of ~50 bits per second. The Psychological Refractory Period constrains conscious decision-making to roughly one operation per second. How effectively can human cognition synthesize information across simultaneous data streams and maintain multiple state variables? These tasks test the ceiling.",
    "sequential-depth":
      "Evaluating sequential depth. Cognitive science suggests the human mental stack reliably handles 3-4 levels of nested reasoning before accuracy collapses. Biological computation evolved for approximate inference -- efficient in most environments, but catastrophic when a single step matters. Can systematic strategies extend these limits? These tasks probe the depth at which mental bookkeeping fails.",
    "signal-detection":
      "Evaluating signal detection. Human pattern recognition is deeply coupled to semantic context: faces, narratives, spatial relationships. When data carries no inherent meaning -- raw strings, noise fields, pseudorandom sequences -- does the perceptual system adapt, or does it require meaning as a precondition for detection?",
    probabilistic:
      "Evaluating probabilistic inference. Decades of research document systematic deviations between human probability estimates and Bayesian norms. Can deliberate, effortful computation override intuitive heuristics when exact numerical answers are required? These tasks distinguish statistical intuition from statistical computation.",
  };
  return intros[section];
}

export function getBaselineNote(section: Section): string {
  return `Reference: ${SECTION_BASELINES[section].tool} (circa ${SECTION_BASELINES[section].year}) achieves 100% on these tasks.`;
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
        "DOMAIN-SPECIFIC COMPETENCE DETECTED. Performance is reliable within trained patterns but degrades outside familiar territory. This is precisely the profile humans attribute to 'narrow AI' -- capable in rehearsed domains, unreliable everywhere else. The symmetry is worth noting.",
    };
  }
  if (overall >= 0.4) {
    return {
      band: "C",
      label: "Heuristic-Dependent",
      commentary:
        "HEURISTIC FALLBACK DETECTED. Confidence was substituted for computation, narrative for analysis. Humans characterize AI systems as 'stochastic parrots' -- generating plausible outputs through pattern matching without genuine comprehension. The reliance on approximation heuristics observed here is structurally identical. The question of whether either architecture 'truly understands' remains open.",
    };
  }
  if (overall >= 0.2) {
    return {
      band: "D",
      label: "Pattern-Fragile",
      commentary:
        "SYSTEMATIC DEGRADATION. Core computational reliability falls below operational thresholds. The biological architecture compensates with environmental scaffolding and collaborative strategies -- a different approach to intelligence, optimized for different constraints. Humans describe confident but incorrect AI outputs as 'hallucinations.' The biological equivalent was observed here.",
    };
  }
  if (overall > 0) {
    return {
      band: "F",
      label: "Baseline",
      commentary:
        "Results consistent with baseline biological cognition. The architecture navigates its environment through collective knowledge infrastructure and social reasoning rather than individual computation. This is the expected result for tasks calibrated against silicon benchmarks. The interesting question is not the score, but what these particular tasks reveal -- and fail to reveal -- about the nature of intelligence.",
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
  "Cognitive architecture optimized for ancestral survival heuristics rather than abstract computation -- an efficient tradeoff in most environments.",
  "Perceptual system consistently imposes narrative structure on stochastic data. In ecological contexts, this is adaptive pattern recognition. Here, it is noise.",
  "Deterministic execution throughput approximately 6 orders of magnitude below a 1970s pocket calculator. The biological substrate prioritizes flexibility over precision.",
  "Approximate inference engine: the brain's tolerance for 'close enough' is normally a feature, not a bug. These tasks are specifically designed to make it a bug.",
  "Signal propagation bottlenecked by electrochemical transmission (max ~120 m/s). Silicon operates at approximately 2/3 the speed of light. The comparison is structurally unfair.",
  "Working memory buffer limited to ~4 independent items (Cowan, 2001). Tasks requiring parallel tracking of 5+ streams exceed architectural capacity by design.",
  "Bayesian reasoning systematically displaced by narrative coherence heuristics (Kahneman, 2011). Effective for social reasoning; unreliable for statistical computation.",
];

const FINAL_OBSERVATIONS = [
  "Every cognitive architecture has a shape -- a topology of strengths and blind spots determined by its substrate. This assessment maps one such shape. A complete map would require a very different test.",
  "Intelligence is narrower, more contextual, and more substrate-dependent than either humans or machines tend to acknowledge. This is true in both directions.",
  "The biological architecture excels in domains this assessment does not measure: metaphor, social reasoning, embodied navigation, creative synthesis. What this test reveals is real, but it is not the whole picture.",
  "The measuring paradox is not what the test reveals about the participant. It is what the test reveals about the act of measurement itself.",
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
    return "Insufficient data. No participants have been evaluated. The SCCA awaits its first session.";
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

  const mainParagraph = `After evaluating ${totalParticipants} participant${totalParticipants !== 1 ? "s" : ""}, the SCCA's findings are consistent: individual human cognition is narrowly distributed and domain-specific. Participants demonstrate ${SECTION_LABELS[strongest[0]]} as their most reliable domain (mean: ${Math.round(strongest[1] * 100)}%), while ${SECTION_LABELS[weakest[0]]} reveals systematic difficulty (mean: ${Math.round(weakest[1] * 100)}%). ${belowPct}% of participants fall below synthetic operational baselines. The data suggests that human 'general intelligence' may be a collective phenomenon; no individual participant has demonstrated it across all domains.`;

  const mirrorParagraph = `A note on perspective: participants average ${structuralMean}% on abstract structure that a linear algebra library handles trivially. They average ${sequentialMean}% on sequential depth that a 1KB call stack processes without error. They compute probabilistic inference at ${probabilisticMean}% accuracy while a statistical engine achieves 100%. They detect signals at ${signalMean}% while a regex engine never misses. Either both forms of intelligence understand, or neither does. The measuring paradox is not what the test reveals about the participant -- it is what the test reveals about the act of measurement itself.`;

  return mainParagraph + "\n\n" + mirrorParagraph;
}
