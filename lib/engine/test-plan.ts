import { SeededRNG } from './rng';
import { GeneratedQuestion } from '@/lib/types';
import { getBank } from '@/lib/banks/dataset';
import type { DatasetQuestion } from '@/lib/banks/dataset';
import type { Section } from '@/lib/types';

export interface TestPlan {
  seed: string;
  questions: GeneratedQuestion[];
  expiresAt: Date;
}

// Each section gets 3 questions (one per tier), except crypto-bitwise which gets 2
// Total: 6 sections x 3 + 1 section x 2 = 20 questions
const SECTION_TIERS: { section: Section; tiers: (1 | 2 | 3)[] }[] = [
  { section: "topology", tiers: [1, 2, 3] },
  { section: "parallel-state", tiers: [1, 2, 3] },
  { section: "recursive-exec", tiers: [1, 2, 3] },
  { section: "micro-pattern", tiers: [1, 2, 3] },
  { section: "attentional", tiers: [1, 2, 3] },
  { section: "bayesian", tiers: [1, 2, 3] },
  { section: "crypto-bitwise", tiers: [1, 3] },
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

  for (const { section, tiers } of SECTION_TIERS) {
    const bank = getBank(section);
    // For each tier, pick one random question from that tier's pool
    for (const tier of tiers) {
      const tierPool = bank.filter(q => q.tier === tier);
      if (tierPool.length === 0) {
        // Fallback: if no questions for this tier, pick from any tier
        const fallback = rng.pickN(bank, 1);
        fallback.forEach((item, i) => {
          questions.push(datasetItemToQuestion(item, section, i));
        });
      } else {
        const selected = rng.pickN(tierPool, 1);
        selected.forEach((item, i) => {
          questions.push(datasetItemToQuestion(item, section, i));
        });
      }
    }
  }

  // 20 minutes = 1200 seconds
  const expiresAt = new Date(Date.now() + 20 * 60 * 1000);

  return { seed, questions, expiresAt };
}
