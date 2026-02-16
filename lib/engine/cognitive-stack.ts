import { SeededRNG } from './rng';
import { GeneratedQuestion } from '@/lib/types';
import { COGNITIVE_STACK_ITEMS } from '@/lib/banks/cognitive-stack';

export function generateCognitiveStackQuestions(rng: SeededRNG): GeneratedQuestion[] {
  const items = rng.shuffle([...COGNITIVE_STACK_ITEMS]).slice(0, 4);

  return items.map((item, index) => ({
    section: 'cognitive-stack' as const,
    index,
    type: item.subtype,
    payload: {
      prompt: `${item.text}\n\n${item.question}`,
      inputType: 'text' as const,
    },
    answerKey: {
      correct: item.answer,
      alternatives: item.alternatives,
    },
  }));
}
