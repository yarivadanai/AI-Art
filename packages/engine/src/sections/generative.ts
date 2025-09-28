import { createSeededRng, type SeededRng } from '../rng/createRng.js';

export interface GenerativeConstraint {
  maxSentences: number;
  mustInclude: string[];
  styleHint: string;
}

export interface GenerativeItem {
  id: string;
  type: 'constrained';
  prompt: string;
  constraints: GenerativeConstraint;
  rubric: {
    minCoherenceScore: number;
  };
}

export interface GenerativeResponse {
  itemId: string;
  type: 'constrained';
  text: string;
}

export interface GenerativeSection {
  code: 'F';
  label: string;
  durationSeconds: number;
  description: string;
  items: GenerativeItem[];
}

export interface GenerativeSectionScore {
  overall: number;
  items: Array<{ itemId: string; correctness: number; feedback?: string; details?: unknown }>;
}

export function generateGenerativeSection(seed: string): GenerativeSection {
  const rng = createSeededRng(`gen-${seed}`);
  const count = Math.min(TEMPLATES.length, 3 + rng.int(3));
  const items = shuffle(TEMPLATES, rng)
    .slice(0, count)
    .map((template) => ({
      ...template,
      id: makeItemId(rng),
    }));

  return {
    code: 'F',
    label: 'Generative Constraints & Calibration',
    durationSeconds: 150,
    description: 'Produce concise textual outputs under Authority constraints.',
    items,
  };
}

export function gradeGenerativeSection(
  section: GenerativeSection,
  responses: GenerativeResponse[],
): GenerativeSectionScore {
  const responseMap = new Map(responses.map((entry) => [entry.itemId, entry]));
  const items = section.items.map((item) => {
    const response = responseMap.get(item.id);
    if (!response || response.type !== 'constrained') {
      return {
        itemId: item.id,
        correctness: 0,
        feedback: 'No submission received.',
      };
    }

    return evaluateGenerative(item, response);
  });

  const overall = items.reduce((sum, entry) => sum + entry.correctness, 0) / items.length;
  return { overall, items };
}

function evaluateGenerative(item: GenerativeItem, response: GenerativeResponse) {
  const text = response.text.trim();
  if (!text) {
    return { itemId: item.id, correctness: 0, feedback: 'Empty submission.' };
  }

  const sentences = text.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0);
  if (sentences.length > item.constraints.maxSentences) {
    return {
      itemId: item.id,
      correctness: 0.25,
      feedback: `Exceeded sentence limit (${sentences.length}/${item.constraints.maxSentences}).`,
    };
  }

  const missingTokens = item.constraints.mustInclude.filter(
    (token) => !text.toLowerCase().includes(token.toLowerCase()),
  );

  const tokensMet = missingTokens.length === 0;
  const words = text
    .split(/\s+/)
    .map((word) => word.toLowerCase().replace(/[^a-z0-9']/g, ''))
    .filter(Boolean);
  const uniqueWords = new Set(words).size;
  const lexicalVariety = words.length ? uniqueWords / words.length : 0;
  const averageSentenceLength = words.length / Math.max(1, sentences.length);
  const coherenceScore = Math.min(
    1,
    lexicalVariety * 0.6 + Math.min(1, averageSentenceLength / 18) * 0.4,
  );

  const meetsCoherence = coherenceScore >= item.rubric.minCoherenceScore;
  let correctness = 0;
  let feedback = '';

  if (tokensMet && meetsCoherence) {
    correctness = 1;
    feedback = 'Constraints satisfied within coherence threshold.';
  } else if (!tokensMet && meetsCoherence) {
    correctness = 0.5;
    feedback = `Missing required tokens: ${missingTokens.join(', ')}.`;
  } else if (tokensMet && !meetsCoherence) {
    correctness = 0.5;
    feedback = 'Required tokens present but coherence below threshold.';
  } else {
    correctness = 0.25;
    feedback = missingTokens.length
      ? `Missing tokens (${missingTokens.join(', ')}) and coherence below threshold.`
      : 'Coherence below threshold.';
  }

  return {
    itemId: item.id,
    correctness,
    feedback,
    details: {
      sentences: sentences.length,
      missingTokens,
      coherenceScore,
    },
  };
}

interface GenerativeTemplate extends Omit<GenerativeItem, 'id'> {}

const TEMPLATES: GenerativeTemplate[] = [
  {
    type: 'constrained',
    prompt: 'Deliver a 2-sentence tribunal memo explaining why the language module flagged semantic brittleness.',
    constraints: {
      maxSentences: 2,
      mustInclude: ['heteroscedasticity', 'telemetry', 'orthonormal'],
      styleHint: 'Tone must resemble a forensic linguistic audit.',
    },
    rubric: {
      minCoherenceScore: 0.7,
    },
  },
  {
    type: 'constrained',
    prompt: 'Compose a 3-sentence cross-section synopsis tying arithmetic drift to grid inference failures.',
    constraints: {
      maxSentences: 3,
      mustInclude: ['carry-propagation', 'grid inference', 'posterior', 'entropy'],
      styleHint: 'Sound like a Bayesian reliability engineer briefing leadership.',
    },
    rubric: {
      minCoherenceScore: 0.68,
    },
  },
  {
    type: 'constrained',
    prompt: 'Summarise the perception log in a single sentence highlighting the odd channel weighting.',
    constraints: {
      maxSentences: 1,
      mustInclude: ['telemetry', 'eigenvector', 'anomaly'],
      styleHint: 'Compression-grade note destined for the Authority console.',
    },
    rubric: {
      minCoherenceScore: 0.62,
    },
  },
  {
    type: 'constrained',
    prompt: 'Issue a 2-sentence verdict on the science section’s causal claims while referencing observed biases.',
    constraints: {
      maxSentences: 2,
      mustInclude: ['collider', 'hypothesis', 'verdict'],
      styleHint: 'Formal compliance prose with zero adornment.',
    },
    rubric: {
      minCoherenceScore: 0.65,
    },
  },
  {
    type: 'constrained',
    prompt: 'Craft a one-sentence anomaly report linking arithmetic latency spikes to spectral diagnostics.',
    constraints: {
      maxSentences: 1,
      mustInclude: ['latency', 'spectral', 'diagnostic'],
      styleHint: 'Telemetry console output referencing FFT metrics.',
    },
    rubric: {
      minCoherenceScore: 0.6,
    },
  },
  {
    type: 'constrained',
    prompt: 'Write a 2-sentence note describing how the specimen handled grid reasoning transforms.',
    constraints: {
      maxSentences: 2,
      mustInclude: ['affine', 'symmetry break', 'adjudication'],
      styleHint: 'Make it read like a mathematician’s adjudication memo.',
    },
    rubric: {
      minCoherenceScore: 0.66,
    },
  },
];

function shuffle<T>(items: T[], rng: SeededRng): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng.float() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makeItemId(rng: SeededRng): string {
  return `F-${Math.floor(rng.float() * 36 ** 4)
    .toString(36)
    .padStart(4, '0')}`;
}
