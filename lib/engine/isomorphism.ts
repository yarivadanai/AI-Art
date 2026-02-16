import { SeededRNG } from './rng';
import { GeneratedQuestion } from '@/lib/types';
import { ISOMORPHISM_ITEMS } from '@/lib/banks/isomorphisms';

export function generateIsomorphismQuestions(rng: SeededRNG): GeneratedQuestion[] {
  const items = rng.shuffle([...ISOMORPHISM_ITEMS]).slice(0, 4);

  return items.map((item, index) => ({
    section: 'isomorphism' as const,
    index,
    type: 'cross-domain-mapping' as const,
    payload: {
      prompt: `In ${item.sourceField}, "${item.sourceConcept}" refers to the following:\n\n${item.sourceDescription}\n\nWhat is the structurally analogous concept in ${item.targetField}?`,
      inputType: 'text' as const,
    },
    answerKey: {
      correct: item.answer,
      keywords: item.keywords,
    },
  }));
}
