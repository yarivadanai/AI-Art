import { createSeededRng, type SeededRng } from '../rng/createRng.js';

export interface BaseLanguageItem {
  id: string;
  prompt: string;
}

export interface SpellingItem extends BaseLanguageItem {
  type: 'spelling';
  options: string[];
  correctIndex: number;
  rationale: string;
}

export interface ClozeItem extends BaseLanguageItem {
  type: 'cloze';
  textWithBlanks: string;
  optionsPerBlank: string[][];
  correctIndices: number[];
  explanation: string;
}

export interface AnalogyItem extends BaseLanguageItem {
  type: 'analogy';
  stem: [string, string];
  choices: [string, string][];
  correctIndex: number;
  explanation: string;
}

export interface MicroWritingItem extends BaseLanguageItem {
  type: 'microwrite';
  constraints: {
    maxWords: number;
    mustInclude: string[];
    styleHint: string;
  };
  rubric: {
    minCoherenceScore: number;
  };
}

export type LanguageItem = SpellingItem | ClozeItem | AnalogyItem | MicroWritingItem;

export interface LanguageSection {
  code: 'A';
  label: string;
  durationSeconds: number;
  items: LanguageItem[];
  description: string;
}

export interface SpellingResponse {
  itemId: string;
  type: 'spelling';
  selectedIndex: number;
}

export interface ClozeResponse {
  itemId: string;
  type: 'cloze';
  selectedIndices: number[];
}

export interface AnalogyResponse {
  itemId: string;
  type: 'analogy';
  selectedIndex: number;
}

export interface MicroWritingResponse {
  itemId: string;
  type: 'microwrite';
  text: string;
}

export type LanguageResponse =
  | SpellingResponse
  | ClozeResponse
  | AnalogyResponse
  | MicroWritingResponse;

export interface LanguageScoringResult {
  correctness: number;
  feedback?: string;
  details?: Record<string, unknown>;
}

export interface LanguageItemResult extends LanguageScoringResult {
  itemId: string;
  type: LanguageItem['type'];
}

export interface LanguageSectionScore {
  overall: number;
  items: LanguageItemResult[];
}

export function generateLanguageSection(seed: string): LanguageSection {
  const rng = createSeededRng(`lang-${seed}`);
  const items: LanguageItem[] = [];
  let counter = 0;

  const shuffledSpelling = shuffle(SPELLING_BANK, rng).slice(0, 3);
  const shuffledCloze = shuffle(CLOZE_BANK, rng).slice(0, 3);
  const shuffledAnalogies = shuffle(ANALOGY_BANK, rng).slice(0, 2);
  const microTemplate = pickOne(MICRO_WRITING_BANK, rng);

  shuffledSpelling.forEach((entry) => {
    const options = shuffle([entry.correct, ...entry.distractors], rng);
    const correctIndex = options.indexOf(entry.correct);
    items.push({
      id: makeItemId('A', counter++, rng),
      type: 'spelling',
      prompt: entry.prompt,
      options,
      correctIndex,
      rationale: entry.rationale,
    });
  });

  shuffledCloze.forEach((entry) => {
    items.push({
      id: makeItemId('A', counter++, rng),
      type: 'cloze',
      prompt: entry.prompt,
      textWithBlanks: entry.text,
      optionsPerBlank: entry.optionsPerBlank.map((options) => shuffle(options, rng)),
      correctIndices: entry.correctIndices,
      explanation: entry.explanation,
    });
  });

  shuffledAnalogies.forEach((entry) => {
    const choices = shuffle([entry.correct, ...entry.distractors], rng);
    const correctIndex = choices.findIndex(
      (choice) => choice[0] === entry.correct[0] && choice[1] === entry.correct[1],
    );
    items.push({
      id: makeItemId('A', counter++, rng),
      type: 'analogy',
      prompt: entry.prompt,
      stem: entry.stem,
      choices,
      correctIndex,
      explanation: entry.explanation,
    });
  });

  items.push({
    id: makeItemId('A', counter++, rng),
    type: 'microwrite',
    prompt: microTemplate.prompt,
    constraints: microTemplate.constraints,
    rubric: microTemplate.rubric,
  });

  return {
    code: 'A',
    label: 'Language as Statistical Mastery',
    durationSeconds: 150,
    description:
      'Assesses spelling robustness, grammatical reasoning, analogies, and concise constrained writing.',
    items,
  };
}

export function scoreLanguageItem(
  item: LanguageItem,
  response: LanguageResponse | undefined,
): LanguageScoringResult {
  if (!response || response.itemId !== item.id || response.type !== item.type) {
    return { correctness: 0, feedback: 'No valid response submitted.' };
  }

  switch (item.type) {
    case 'spelling':
      if (response.type !== 'spelling') {
        return invalidSchemaResponse();
      }
      return scoreSpellingItem(item, response);
    case 'cloze':
      if (response.type !== 'cloze') {
        return invalidSchemaResponse();
      }
      return scoreClozeItem(item, response);
    case 'analogy':
      if (response.type !== 'analogy') {
        return invalidSchemaResponse();
      }
      return scoreAnalogyItem(item, response);
    case 'microwrite':
      if (response.type !== 'microwrite') {
        return invalidSchemaResponse();
      }
      return scoreMicroWritingItem(item, response);
    default:
      return { correctness: 0 };
  }
}

export function gradeLanguageSection(
  section: LanguageSection,
  responses: LanguageResponse[],
): LanguageSectionScore {
  const responseMap = new Map(responses.map((response) => [response.itemId, response]));

  const results = section.items.map<LanguageItemResult>((item) => {
    const result = scoreLanguageItem(item, responseMap.get(item.id));
    return {
      itemId: item.id,
      type: item.type,
      correctness: result.correctness,
      feedback: result.feedback,
      details: result.details,
    };
  });

  const total = results.reduce((sum, entry) => sum + entry.correctness, 0);
  const overall = results.length ? total / results.length : 0;

  return {
    overall,
    items: results,
  };
}

// -- internal helpers ------------------------------------------------------

interface SpellingBankEntry {
  prompt: string;
  correct: string;
  distractors: string[];
  rationale: string;
}

interface ClozeBankEntry {
  prompt: string;
  text: string;
  optionsPerBlank: string[][];
  correctIndices: number[];
  explanation: string;
}

interface AnalogyBankEntry {
  prompt: string;
  stem: [string, string];
  correct: [string, string];
  distractors: [string, string][];
  explanation: string;
}

interface MicroWritingTemplate {
  prompt: string;
  constraints: {
    maxWords: number;
    mustInclude: string[];
    styleHint: string;
  };
  rubric: {
    minCoherenceScore: number;
  };
}

const SPELLING_BANK: SpellingBankEntry[] = [
  {
    prompt: 'Select the correctly spelled term for commentary issued far beyond one’s remit.',
    correct: 'ultracrepidarian',
    distractors: ['ultracrepedarian', 'ultracrepidarium', 'ultracreppidarian'],
    rationale: 'The Latin root “crepida” keeps the “i”; only “-arian” closes the construction.',
  },
  {
    prompt: 'Choose the spelling the Authority assigns to an ornamental leaning note.',
    correct: 'appoggiatura',
    distractors: ['apoggiatura', 'appogiatura', 'appoggiatoura'],
    rationale: 'Italian orthography doubles the “pp” and “g”; the ending is the bare “-tura”.',
  },
  {
    prompt: 'Identify the precise spelling for rote, parroted language flagged in reports.',
    correct: 'psittacism',
    distractors: ['psittacysm', 'psitacism', 'psitticism'],
    rationale: 'Borrowed from Latin “psittacus”, the central cluster is “-tac-” followed by “-ism”.',
  },
  {
    prompt: 'Pick the exact term used for dismissing data as worthless.',
    correct: 'floccinaucinihilipilification',
    distractors: ['floccinaucinihilipilofication', 'floccinaucinilihilipilification', 'floccinaucinihilipilifcation'],
    rationale: 'The classical compound retains each mini-root once; no extra vowels or missing syllables appear.',
  },
  {
    prompt: 'Select the accurate spelling for intense, rule-bound desire patterns.',
    correct: 'concupiscence',
    distractors: ['concupesence', 'concupisciense', 'concupiscance'],
    rationale: 'The Latin “-scere” yields “-scence”; only one “s” divides the final syllables.',
  },
  {
    prompt: 'Choose the correct label the Authority applies to sleight-of-hand briefings.',
    correct: 'legerdemain',
    distractors: ['legardemain', 'legerdemein', 'legerdemane'],
    rationale: 'French “léger de main” contracts to “legerdemain”; the “de” syllable stays intact.',
  },
];

const CLOZE_BANK: ClozeBankEntry[] = [
  {
    prompt: 'Resolve the conditional phrasing in the escalation protocol.',
    text: 'If the adjudication panel [1] lexical drift, it would [2] deployment unless linguists [3] the corpus.',
    optionsPerBlank: [
      ['detects', 'detected', 'detect', 'was detecting'],
      ['suspend', 'suspends', 'suspending', 'suspended'],
      ['certify', 'certified', 'will certify', 'certifying'],
    ],
    correctIndices: [1, 0, 0],
    explanation:
      'Past-tense “detected” aligns with the conditional “would suspend”; the subordinate clause keeps the bare infinitive “certify”.',
  },
  {
    prompt: 'Complete the directive issued after the rhetoric audit.',
    text: 'The calibration memo [1] that reviewers [2] hedging unless evidence [3] it outright.',
    optionsPerBlank: [
      ['insists', 'insisted', 'insist', 'insisting'],
      ['avoid', 'avoids', 'avoided', 'avoiding'],
      ['contradicts', 'contradicted', 'would contradict', 'contradicting'],
    ],
    correctIndices: [1, 0, 1],
    explanation:
      'Past-tense reporting verb “insisted” triggers the subjunctive “avoid”, while the final clause requires simple past “contradicted”.',
  },
  {
    prompt: 'Restore the clause describing archival chain of custody.',
    text: 'Although the summary [1] contested, the panel required it [2] accessible until archivists [3] replacements.',
    optionsPerBlank: [
      ['was', 'were', 'being', 'been'],
      ['remain', 'remains', 'remaining', 'remained'],
      ['delivered', 'deliver', 'had delivered', 'delivering'],
    ],
    correctIndices: [0, 0, 0],
    explanation:
      'Singular “summary” governs “was”; the mandate uses base-form “remain”; a simple past “delivered” closes the timeline.',
  },
  {
    prompt: 'Fill in the live-transcription guidance for human monitors.',
    text: 'While the intake bot [1] candidate phrases, supervisors [2] the outputs so any drift [3] annotated.',
    optionsPerBlank: [
      ['suggested', 'suggests', 'suggesting', 'suggest'],
      ['sanitize', 'sanitise', 'sanitised', 'sanitising'],
      ['was', 'were', 'is', 'be'],
    ],
    correctIndices: [1, 0, 2],
    explanation:
      'Present-progressive scene keeps “suggests”; supervisors act with imperative “sanitize”; present “is” matches the clause “drift is annotated”.',
  },
  {
    prompt: 'Finish the instruction for testimony summarisation.',
    text: 'The tribunal expects witnesses [1] succinctly and [2] qualifiers when testimony [3] certainty.',
    optionsPerBlank: [
      ['to speak', 'speaking', 'speak', 'spoken'],
      ['discard', 'discards', 'discarded', 'discarding'],
      ['signals', 'signalled', 'signal', 'signalling'],
    ],
    correctIndices: [0, 0, 0],
    explanation:
      'Infinitive “to speak” pairs with verb “discard”; present “signals” matches singular “testimony”.',
  },
];

const ANALOGY_BANK: AnalogyBankEntry[] = [
  {
    prompt: 'Choose the pair that preserves the linguistic hierarchy.',
    stem: ['orthography', 'spelling'],
    correct: ['phonology', 'pronunciation'],
    distractors: [
      ['syntax', 'sentence'],
      ['semantics', 'meaning'],
      ['morphology', 'affix'],
    ],
    explanation:
      'Orthography governs visible spelling in the same way phonology governs audible pronunciation.',
  },
  {
    prompt: 'Select the pair that mirrors unit-to-structure assembly.',
    stem: ['morpheme', 'word'],
    correct: ['nucleotide', 'gene'],
    distractors: [
      ['vector', 'matrix'],
      ['pixel', 'display'],
      ['dataset', 'query'],
    ],
    explanation: 'Morphemes combine to form words just as nucleotides combine to form genes.',
  },
  {
    prompt: 'Complete the rhetorical balance analogy.',
    stem: ['litotes', 'understatement'],
    correct: ['hyperbole', 'exaggeration'],
    distractors: [
      ['metaphor', 'comparison'],
      ['allusion', 'reference'],
      ['ellipsis', 'omission'],
    ],
    explanation:
      'Litotes is a deliberate understatement just as hyperbole is a deliberate exaggeration.',
  },
  {
    prompt: 'Link the governance relationship noted in policy briefs.',
    stem: ['grammar', 'syntax'],
    correct: ['law', 'statute'],
    distractors: [
      ['theory', 'experiment'],
      ['algorithm', 'runtime'],
      ['archive', 'record'],
    ],
    explanation: 'Syntax is a subsystem within grammar just as a statute is a specific instrument within law.',
  },
];

const MICRO_WRITING_BANK: MicroWritingTemplate[] = [
  {
    prompt:
      'Deliver a 32-word briefing to the Authority summarising language reliability metrics. Include each required term and heed the style guidance.',
    constraints: {
      maxWords: 32,
      mustInclude: ['polysemy', 'entropy', 'orthography'],
      styleHint: 'Maintain a clipped intelligence-register that references analytic dashboards.',
    },
    rubric: {
      minCoherenceScore: 0.65,
    },
  },
  {
    prompt:
      'In no more than 28 words, report how the discourse review surfaced problematic turns. Use the mandated lexicon.',
    constraints: {
      maxWords: 28,
      mustInclude: ['pragmatics', 'anomaly', 'telemetry'],
      styleHint: 'Adopt a formal research voice and outline the next diagnostic step.',
    },
    rubric: {
      minCoherenceScore: 0.6,
    },
  },
  {
    prompt:
      'Summarise, in 30 words or fewer, why the Authority is elevating its verbal difficulty profile. Respect every inclusion requirement.',
    constraints: {
      maxWords: 30,
      mustInclude: ['analogy', 'benchmark', 'stringency'],
      styleHint: 'Write as if briefing a standards council contemplating tougher evaluations.',
    },
    rubric: {
      minCoherenceScore: 0.68,
    },
  },
];

function makeItemId(prefix: string, index: number, rng: SeededRng): string {
  const fragment = Math.floor(rng.float() * 36 ** 4)
    .toString(36)
    .padStart(4, '0');
  return `${prefix}-${index.toString(36)}-${fragment}`;
}

function pickOne<T>(collection: T[], rng: SeededRng): T {
  return collection[Math.floor(rng.float() * collection.length)];
}

function shuffle<T>(input: T[], rng: SeededRng): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng.float() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

function scoreSpellingItem(item: SpellingItem, response: SpellingResponse): LanguageScoringResult {
  const correctness = response.selectedIndex === item.correctIndex ? 1 : 0;
  return {
    correctness,
    feedback: correctness ? 'Accurate spelling recognised.' : 'Incorrect spelling selected.',
  };
}

function scoreClozeItem(item: ClozeItem, response: ClozeResponse): LanguageScoringResult {
  const selections = response.selectedIndices;
  if (selections.length !== item.correctIndices.length) {
    return { correctness: 0, feedback: 'Incomplete response submitted.' };
  }

  const allCorrect = selections.every((choice, index) => choice === item.correctIndices[index]);
  const correctness = allCorrect
    ? 1
    : selections.filter((choice, index) => choice === item.correctIndices[index]).length /
      item.correctIndices.length;

  return {
    correctness,
    feedback: allCorrect
      ? 'Sentence restored perfectly.'
      : 'Partial grammatical accuracy achieved.',
  };
}

function scoreAnalogyItem(item: AnalogyItem, response: AnalogyResponse): LanguageScoringResult {
  const correctness = response.selectedIndex === item.correctIndex ? 1 : 0;
  return {
    correctness,
    feedback: correctness ? 'Analogical mapping preserved.' : 'Relationship misidentified.',
  };
}

function scoreMicroWritingItem(
  item: MicroWritingItem,
  response: MicroWritingResponse,
): LanguageScoringResult {
  const text = response.text ?? '';
  const cleaned = text.trim();
  if (!cleaned) {
    return { correctness: 0, feedback: 'No writing provided.' };
  }

  const words = cleaned.split(/\s+/).map((word) => word.toLowerCase().replace(/[^a-z0-9']/g, ''));
  const nonEmptyWords = words.filter(Boolean);
  const wordCount = nonEmptyWords.length;

  const withinLimit = wordCount > 0 && wordCount <= item.constraints.maxWords;
  const tokenCoverage = item.constraints.mustInclude.map((token) => ({
    token,
    present: cleaned.toLowerCase().includes(token.toLowerCase()),
  }));

  const missingTokens = tokenCoverage.filter((entry) => !entry.present).map((entry) => entry.token);

  const sentenceCount =
    cleaned.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0).length || 1;
  const uniqueWords = new Set(nonEmptyWords).size;
  const lexicalVariety = nonEmptyWords.length ? uniqueWords / nonEmptyWords.length : 0;
  const averageSentenceLength = nonEmptyWords.length / sentenceCount;
  const coherenceScore = Math.min(
    1,
    lexicalVariety * 0.6 + Math.min(1, averageSentenceLength / 18) * 0.4,
  );

  let correctness = 0;
  let feedback = '';

  if (!withinLimit) {
    feedback = `Exceeded word limit (${wordCount}/${item.constraints.maxWords}).`;
  } else {
    const tokensMet = missingTokens.length === 0;
    const meetsCoherence = coherenceScore >= item.rubric.minCoherenceScore;

    if (tokensMet && meetsCoherence) {
      correctness = 1;
      feedback = 'Constraints satisfied with coherent phrasing.';
    } else if (!tokensMet && meetsCoherence) {
      correctness = missingTokens.length === 1 ? 0.5 : 0.25;
      feedback = `Missing required tokens: ${missingTokens.join(', ')}.`;
    } else if (tokensMet && !meetsCoherence) {
      correctness = 0.5;
      feedback = 'Required terms present, but coherence threshold not met.';
    } else {
      correctness = 0.2;
      feedback = missingTokens.length
        ? `Missing required tokens (${missingTokens.join(', ')}) and coherence below threshold.`
        : 'Response lacks coherence.';
    }
  }

  return {
    correctness,
    feedback,
    details: {
      wordCount,
      missingTokens,
      coherenceScore,
    },
  };
}

function invalidSchemaResponse(): LanguageScoringResult {
  return { correctness: 0, feedback: 'Response payload did not match expected schema.' };
}
