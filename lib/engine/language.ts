import { SeededRNG } from './rng';
import { GeneratedQuestion } from '@/lib/types';
import { RARE_WORDS, SPELLING_WORDS, ANALOGY_PAIRS } from '@/lib/banks/words';
import { GRAMMAR_ITEMS } from '@/lib/banks/grammar';
import { TRANSLATION_WORDS } from '@/lib/banks/translations';

export function generateLanguageQuestions(rng: SeededRNG): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  // Q1: Grammar Rule Identification
  const grammarItem = rng.pick(GRAMMAR_ITEMS);
  const grammarOptions = rng.shuffle([grammarItem.violation, ...grammarItem.distractors]);
  const grammarCorrectIdx = grammarOptions.indexOf(grammarItem.violation);
  questions.push({
    section: 'language',
    index: 0,
    type: 'grammar-rule',
    payload: {
      prompt: `Identify the grammatical violation in this sentence:\n\n"${grammarItem.sentence}"`,
      inputType: 'multiple-choice',
      options: grammarOptions,
    },
    answerKey: { correct: grammarCorrectIdx },
  });

  // Q2: Rare Word Meaning
  const rareWord = rng.pick(RARE_WORDS);
  const wordOptions = rng.shuffle([rareWord.definition, ...rareWord.distractors]);
  const wordCorrectIdx = wordOptions.indexOf(rareWord.definition);
  questions.push({
    section: 'language',
    index: 1,
    type: 'rare-word',
    payload: {
      prompt: `What is the precise meaning of "${rareWord.word}"?`,
      inputType: 'multiple-choice',
      options: wordOptions,
    },
    answerKey: { correct: wordCorrectIdx },
  });

  // Q3: Spelling
  const spellingWord = rng.pick(SPELLING_WORDS);
  const spellingOptions = rng.shuffle([spellingWord.correct, ...spellingWord.misspellings]);
  const spellingCorrectIdx = spellingOptions.indexOf(spellingWord.correct);
  questions.push({
    section: 'language',
    index: 2,
    type: 'spelling',
    payload: {
      prompt: 'Which spelling is correct?',
      inputType: 'multiple-choice',
      options: spellingOptions,
    },
    answerKey: { correct: spellingCorrectIdx },
  });

  // Q4: Translation Nuance
  const transWord = rng.pick(TRANSLATION_WORDS);
  const transOptions = rng.shuffle([transWord.correctDescription, ...transWord.distractors]);
  const transCorrectIdx = transOptions.indexOf(transWord.correctDescription);
  questions.push({
    section: 'language',
    index: 3,
    type: 'translation-nuance',
    payload: {
      prompt: `The ${transWord.language} concept "${transWord.word}" is most precisely described as:`,
      inputType: 'multiple-choice',
      options: transOptions,
    },
    answerKey: { correct: transCorrectIdx },
  });

  // Q5: Word Analogy
  const analogy = rng.pick(ANALOGY_PAIRS);
  const analogyOptions = rng.shuffle([analogy.answer, ...analogy.distractors]);
  const analogyCorrectIdx = analogyOptions.indexOf(analogy.answer);
  questions.push({
    section: 'language',
    index: 4,
    type: 'word-analogy',
    payload: {
      prompt: `"${analogy.a}" is to "${analogy.b}" as "${analogy.c}" is to ___`,
      inputType: 'multiple-choice',
      options: analogyOptions,
    },
    answerKey: { correct: analogyCorrectIdx },
  });

  return questions;
}
