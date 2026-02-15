import { SeededRNG } from './rng';
import { GeneratedQuestion } from '@/lib/types';
import { generateLanguageQuestions } from './language';
import { generateMathQuestions } from './math';
import { generateCodingQuestions } from './coding';
import { generatePerceptionQuestions } from './perception';
import { generateMemoryQuestions } from './memory';
import { generateKnowledgeQuestions } from './knowledge';

export interface TestPlan {
  seed: string;
  questions: GeneratedQuestion[];
  includesCoding: boolean;
  expiresAt: Date;
}

export function generateTestPlan(
  seed: string,
  includesCoding: boolean
): TestPlan {
  const rng = new SeededRNG(seed);

  const questions: GeneratedQuestion[] = [
    ...generateLanguageQuestions(rng),
    ...generateMathQuestions(rng),
    ...(includesCoding ? generateCodingQuestions(rng) : []),
    ...generatePerceptionQuestions(rng),
    ...generateMemoryQuestions(rng),
    ...generateKnowledgeQuestions(rng),
  ];

  const expiresAt = new Date(Date.now() + 18 * 60 * 1000); // 18 minutes

  return { seed, questions, includesCoding, expiresAt };
}
