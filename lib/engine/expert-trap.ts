import { SeededRNG } from './rng';
import { GeneratedQuestion } from '@/lib/types';
import { EXPERT_TRAP_ITEMS } from '@/lib/banks/expert-trap';

export function generateExpertTrapQuestions(rng: SeededRNG): GeneratedQuestion[] {
  const items = rng.shuffle([...EXPERT_TRAP_ITEMS]).slice(0, 4);

  return items.map((item, index) => ({
    section: 'expert-trap' as const,
    index,
    type: 'causal-violation' as const,
    payload: {
      prompt: `The following passage from ${item.field} contains a common misconception that even well-educated people often accept. Identify the flaw.\n\n"${item.text}"`,
      inputType: 'text' as const,
    },
    answerKey: {
      correct: item.answer,
      keywords: item.keywords,
    },
  }));
}
