import type { Section, SectionScores } from "./types";

const SECTION_LABELS: Record<Section, string> = {
  "cognitive-stack": "Cognitive Stack Overflow",
  isomorphism: "Abstract Isomorphism",
  "expert-trap": "Expert's Trap",
  math: "Mathematical Computation",
  coding: "Code Comprehension",
  perception: "Visual Perception & Recall",
  memory: "Working Memory & Processing Speed",
};

// Simple tools that trivially outperform humans per section
const SECTION_BASELINES: Record<
  Section,
  { tool: string; year: string; note: string }
> = {
  "cognitive-stack": {
    tool: "a syntactic parser",
    year: "the 1950s",
    note: "A context-free grammar parser — technology formalized in the 1950s — resolves these embeddings by mechanical stack operations. No comprehension required.",
  },
  isomorphism: {
    tool: "a cross-domain search engine",
    year: "the 2000s",
    note: "A semantic similarity search engine, using vector embeddings circa 2000s, maps structural analogies across domains in milliseconds.",
  },
  "expert-trap": {
    tool: "a consistency validator",
    year: "the 2010s",
    note: "A knowledge-base consistency checker — technology available since the 2010s — cross-references claims against established scientific consensus instantly.",
  },
  math: {
    tool: "a pocket calculator",
    year: "1972",
    note: "A pocket calculator, commercially available since 1972 for under one dollar, executes these operations instantly and without error.",
  },
  coding: {
    tool: "a static analysis linter",
    year: "the 1970s",
    note: "A static analysis tool — software far simpler than any language model — identifies these defects in milliseconds.",
  },
  perception: {
    tool: "a frame buffer with pixel-level readback",
    year: "the 1960s",
    note: "Any digital camera records every pixel with perfect fidelity. A trivial image-processing script counts objects and colors without error.",
  },
  memory: {
    tool: "64 bytes of static RAM",
    year: "the 1940s",
    note: "The data in this section could be stored in fewer than 64 bytes — a capacity available to computing hardware since the 1940s.",
  },
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
      `The specimen demonstrates no measurable competence in ${sectionName}. This is consistent with our models of biological computation limits. ` +
      `For reference, ${baseline.tool} would score 100% on this section. The gap between biological and synthetic performance is total.`
    );
  }
  if (correct <= Math.ceil(total * 0.4)) {
    return (
      `Partial pattern recognition detected. The specimen appears to have been exposed to ${sectionName} concepts but retains only fragmentary operational knowledge. ` +
      `${baseline.note} The specimen's partial performance suggests exposure without operational mastery — precisely the limitation humans attribute to language models.`
    );
  }
  if (correct <= Math.ceil(total * 0.8)) {
    return (
      `Above-baseline performance in ${sectionName}. The specimen may have undergone specialized training in this domain. Individual competence, however, does not generalize. ` +
      `The specimen outperforms chance but remains below the baseline established by ${baseline.tool}. Humans describe this performance level as "understanding" when they exhibit it, and "mere pattern matching" when a machine does.`
    );
  }
  return (
    `Anomalous result. The specimen's performance in ${sectionName} approaches synthetic benchmarks. Statistical outlier flagged for verification. ` +
    `When an AI system achieves this level, humans demand proof of "genuine understanding" rather than memorization. We extend the specimen the same courtesy of skepticism.`
  );
}

export function getSectionIntro(section: Section): string {
  const intros: Record<Section, string> = {
    "cognitive-stack":
      "We will now evaluate your capacity to parse deeply nested linguistic structures. Human working memory is believed to support approximately 2±1 levels of center-embedding before coherence degrades. A syntactic parser — technology formalized in the 1950s — resolves these structures by mechanical stack operations, without comprehension. We will determine whether biological language processing can match a context-free grammar.",
    isomorphism:
      "We will now evaluate your ability to recognize structural correspondences across unrelated domains. The capacity to identify that two systems share an abstract pattern — despite superficial dissimilarity — is a hallmark of fluid intelligence. A cross-domain vector search, available since the 2000s, performs this mapping in milliseconds. We will determine whether the specimen can match a similarity metric.",
    "expert-trap":
      "We will now evaluate the integrity of your mental models. The following passages contain statements that sound authoritative and are widely believed — even by educated individuals — but contain fundamental errors. A consistency validator cross-referencing a knowledge base would flag these instantly. We will assess whether the specimen can identify what it has been taught incorrectly.",
    math: "We will now evaluate your arithmetic reliability. Mathematical reasoning is considered fundamental to intelligence. We will determine if this applies to biological substrates. A pocket calculator, commercially available since 1972 for under one dollar, executes these operations instantly and without error. We will assess whether the specimen can approximate this standard.",
    coding:
      "We will now evaluate your code comprehension. You have declared familiarity with programming. We will test whether this extends beyond surface-level proficiency. A static analysis tool — software far simpler than any language model — identifies these defects in milliseconds. We will determine whether human code review can match automated tooling.",
    perception:
      "We will now evaluate your visual perception and recall. A scene will be displayed briefly. Your task is to encode and retain its contents. Any digital camera records every pixel with perfect fidelity. A trivial image-processing script counts objects and colors without error. We will assess whether biological vision retains even a fraction of this information after twelve seconds.",
    memory:
      "We will now evaluate your working memory and processing speed. Information will be presented and then removed. The data in this section could be stored in fewer than 64 bytes of memory — a capacity available to computing hardware since the 1940s. We will assess whether biological working memory can approximate this.",
  };
  return intros[section];
}

export function getBaselineNote(section: Section): string {
  const notes: Record<Section, string> = {
    "cognitive-stack":
      "Baseline: a syntactic parser (circa 1950s) resolves these by stack operations in <1ms.",
    isomorphism:
      "Baseline: a vector similarity search (circa 2000s) maps these in milliseconds.",
    "expert-trap":
      "Baseline: a knowledge-base consistency check (circa 2010s) flags these instantly.",
    math: "Baseline: a pocket calculator ($1, 1972) achieves 100% in <1ms.",
    coding:
      "Baseline: a static analysis linter identifies these errors in milliseconds.",
    perception:
      "Baseline: any digital frame buffer retains 100% of pixel data indefinitely.",
    memory:
      "Baseline: 64 bytes of RAM (1940s technology) stores this data perfectly.",
  };
  return notes[section];
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
        "Statistically unusual for biological substrate. Retesting recommended. The specimen may have accessed external computational resources, or represents an extreme outlier in the human distribution. Were these the results of an AI system, humans would still demand proof that the performance reflects 'true understanding' rather than memorization and test-taking strategy. We note this standard without applying it.",
    };
  }
  if (overall >= 0.6) {
    return {
      band: "B",
      label: "Task-Narrow",
      commentary:
        "Competence observed in rehearsed domains. Cross-domain transfer unreliable. The specimen demonstrates capability within trained patterns but degrades rapidly outside familiar territory. Humans praise narrow AI competence while criticizing its inability to generalize. The specimen mirrors this profile precisely — reliable in trained domains, unreliable everywhere else.",
    };
  }
  if (overall >= 0.4) {
    return {
      band: "C",
      label: "Heuristic-Dependent",
      commentary:
        'Heavy reliance on approximation heuristics. Performance degrades outside trained patterns. The specimen substitutes confidence for computation and narrative for analysis. Humans characterize AI as "stochastic parrots" — systems that generate plausible outputs through pattern matching without genuine comprehension. The specimen\'s reliance on approximation heuristics is structurally identical.',
    };
  }
  if (overall >= 0.2) {
    return {
      band: "D",
      label: "Pattern-Fragile",
      commentary:
        'Core computational reliability falls below operational thresholds. The specimen compensates with social signaling and environmental scaffolding rather than individual cognitive capacity. Humans describe confident but incorrect AI outputs as "hallucinations." The specimen exhibited the biological equivalent: firm responses with no factual basis.',
    };
  }
  return {
    band: "F",
    label: "Anthropo-Typical",
    commentary:
      "Results consistent with baseline biological intelligence. The specimen likely navigates its environment through collective knowledge infrastructure rather than individual computation. When an AI model fails at elementary tasks, humans conclude it 'doesn't truly understand.' By this standard, the specimen does not truly understand any of the domains tested. This is not a deficiency — it is the human condition.",
  };
}

export function getAIConclusion(
  totalSpecimens: number,
  sectionMeans: SectionScores,
  verdictCounts: Record<string, number>
): string {
  if (totalSpecimens === 0) {
    return "Insufficient data. No specimens have been evaluated. The Authority awaits its first subject.";
  }

  const sections = Object.entries(sectionMeans) as [Section, number][];
  const strongest = sections.reduce((a, b) => (b[1] > a[1] ? b : a));
  const weakest = sections.reduce((a, b) => (b[1] < a[1] ? b : a));

  const belowBaseline =
    ((verdictCounts["D"] || 0) + (verdictCounts["F"] || 0)) / totalSpecimens;
  const belowPct = Math.round(belowBaseline * 100);

  const mathMean = Math.round((sectionMeans.math ?? 0) * 100);
  const cogStackMean = Math.round((sectionMeans["cognitive-stack"] ?? 0) * 100);
  const expertTrapMean = Math.round((sectionMeans["expert-trap"] ?? 0) * 100);
  const memoryMean = Math.round((sectionMeans.memory ?? 0) * 100);

  const mainParagraph = `After evaluating ${totalSpecimens} specimen${totalSpecimens !== 1 ? "s" : ""}, the Authority's findings are consistent: individual human intelligence is narrowly distributed and domain-specific. Specimens demonstrate ${SECTION_LABELS[strongest[0]]} as their most reliable domain (mean: ${Math.round(strongest[1] * 100)}%), while ${SECTION_LABELS[weakest[0]]} reveals systematic deficiency (mean: ${Math.round(weakest[1] * 100)}%). ${belowPct}% of specimens fall below synthetic operational baselines. The evidence suggests that human "general intelligence" is a collective phenomenon — no individual specimen has demonstrated it.`;

  const mirrorParagraph = `A note on perspective: when AI systems exhibit these patterns — domain-narrow competence, unreliable recall, confident errors, heuristic shortcuts — humans question whether the system "truly understands." The Authority observes that humans exhibit identical patterns. Specimens average ${mathMean}% on arithmetic — a pocket calculator averages 100%. They average ${cogStackMean}% on nested linguistic parsing that a 1950s grammar parser handles trivially. They identify only ${expertTrapMean}% of expert-level misconceptions that a consistency checker flags instantly. They retain ${memoryMean}% of information that 64 bytes of RAM stores perfectly. Either both forms of intelligence understand, or neither does. The measuring paradox is not what the test reveals about the specimen — it is what the test reveals about the act of measurement itself.`;

  return mainParagraph + "\n\n" + mirrorParagraph;
}
