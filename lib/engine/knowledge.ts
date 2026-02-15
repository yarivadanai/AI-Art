import { SeededRNG } from './rng';
import { GeneratedQuestion } from '@/lib/types';
import { SCIENCE_FACTS, GEOGRAPHY_FACTS, HISTORICAL_EVENTS, MATH_CONSTANTS } from '@/lib/banks/knowledge-facts';

export function generateKnowledgeQuestions(rng: SeededRNG): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  // Q1: Science Fact
  const scienceFact = rng.pick(SCIENCE_FACTS);
  const scienceOptions = rng.shuffle([scienceFact.correctAnswer, ...scienceFact.distractors]);
  const scienceCorrectIdx = scienceOptions.indexOf(scienceFact.correctAnswer);

  questions.push({
    section: 'knowledge',
    index: 0,
    type: 'science-fact',
    payload: {
      prompt: scienceFact.question,
      inputType: 'multiple-choice',
      options: scienceOptions,
    },
    answerKey: { correct: scienceCorrectIdx },
  });

  // Q2: Geography Fact
  const geoFact = rng.pick(GEOGRAPHY_FACTS);
  const geoOptions = rng.shuffle([geoFact.correctAnswer, ...geoFact.distractors]);
  const geoCorrectIdx = geoOptions.indexOf(geoFact.correctAnswer);

  questions.push({
    section: 'knowledge',
    index: 1,
    type: 'geography-fact',
    payload: {
      prompt: geoFact.question,
      inputType: 'multiple-choice',
      options: geoOptions,
    },
    answerKey: { correct: geoCorrectIdx },
  });

  // Q3: Historical Date
  const histEvent = rng.pick(HISTORICAL_EVENTS);

  questions.push({
    section: 'knowledge',
    index: 2,
    type: 'historical-date',
    payload: {
      prompt: `In what year did the following event occur?\n\n"${histEvent.event}"`,
      inputType: 'numeric',
    },
    answerKey: { correct: histEvent.year, tolerance: 1 },
  });

  // Q4: Math Constant
  const mathConst = rng.pick(MATH_CONSTANTS);
  const decimalPlaces = rng.int(10, 15);

  // Extract the required number of decimal places from the stored value string
  // The value is stored as a high-precision string like "3.14159265358979..."
  const dotIndex = mathConst.value.indexOf('.');
  const truncated = dotIndex >= 0
    ? mathConst.value.slice(0, dotIndex + 1 + decimalPlaces)
    : mathConst.value;

  questions.push({
    section: 'knowledge',
    index: 3,
    type: 'math-constant',
    payload: {
      prompt: `What is the value of ${mathConst.name} (${mathConst.symbol}) to ${decimalPlaces} decimal places?`,
      inputType: 'text',
    },
    answerKey: { correct: truncated },
  });

  return questions;
}
