import { SeededRNG } from './rng';
import { GeneratedQuestion } from '@/lib/types';
import { getBank } from '@/lib/banks/dataset';
import type { DatasetQuestion } from '@/lib/banks/dataset';
import type { Section } from '@/lib/types';

export const SESSION_CEILING_MS = 30 * 60 * 1000;
/** Submissions are accepted this long past expiresAt (last question in flight, clock skew). */
export const SUBMIT_GRACE_MS = 5 * 60 * 1000;

export interface TestPlan {
  seed: string;
  questions: GeneratedQuestion[];
  expiresAt: Date;
}

// 5 sections x 5 questions = 25 per session
// Each section: T1, T1, T2, T3, T3 (ascending difficulty)
const SECTION_PLAN: { section: Section; tiers: (1 | 2 | 3)[] }[] = [
  { section: "structural", tiers: [1, 1, 2, 3, 3] },
  { section: "state-tracking", tiers: [1, 1, 2, 3, 3] },
  { section: "sequential-depth", tiers: [1, 1, 2, 3, 3] },
  { section: "signal-detection", tiers: [1, 1, 2, 3, 3] },
  { section: "probabilistic", tiers: [1, 1, 2, 3, 3] },
];

function datasetItemToQuestion(item: DatasetQuestion, section: Section, index: number): GeneratedQuestion {
  return {
    section,
    index,
    type: item.subtype,
    payload: {
      prompt: item.prompt,
      inputType: item.inputType,
      ...(item.options && { options: item.options }),
      ...(item.display && { display: item.display }),
      ...(item.clientSeed != null && { clientSeed: item.clientSeed }),
      ...(item.interactiveConfig && { interactiveConfig: item.interactiveConfig }),
      timeLimit: item.timeLimit,
    },
    answerKey: {
      hash: item.answerHash,
      normalization: item.normalization,
      ...(item.decimalPlaces != null && { decimalPlaces: item.decimalPlaces }),
    },
  };
}

export function generateTestPlan(seed: string): TestPlan {
  const rng = new SeededRNG(seed);
  const questions: GeneratedQuestion[] = [];

  for (const { section, tiers } of SECTION_PLAN) {
    const bank = getBank(section);
    const t1Pool = bank.filter(q => q.tier === 1);
    const t2Pool = bank.filter(q => q.tier === 2);
    const t3Pool = bank.filter(q => q.tier === 3);

    // Pick with no duplicates within tier
    const t1Picks = rng.pickN(t1Pool, 2);
    const t2Picks = rng.pickN(t2Pool, 1);
    const t3Picks = rng.pickN(t3Pool, 2);

    // Order: T1, T1, T2, T3, T3
    const sectionPicks = [...t1Picks, ...t2Picks, ...t3Picks];

    sectionPicks.forEach((item, i) => {
      questions.push(datasetItemToQuestion(item, section, i));
    });
  }

  // Session ceiling. Worst case is 15 min of question time (10x30s + 5x30s +
  // 10x45s) plus five untimed section intros; the client checks this at
  // transitions and /api/submit refuses sessions past it (+ grace).
  const expiresAt = new Date(Date.now() + SESSION_CEILING_MS);

  return { seed, questions, expiresAt };
}
