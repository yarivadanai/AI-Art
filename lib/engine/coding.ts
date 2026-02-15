import { SeededRNG } from './rng';
import { GeneratedQuestion } from '@/lib/types';
import {
  BUG_TEMPLATES,
  RECURSIVE_TEMPLATES,
  ASSEMBLY_TEMPLATES,
  LONG_FUNCTION_TEMPLATES,
} from '@/lib/banks/code-templates';

export function generateCodingQuestions(rng: SeededRNG): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  // Q1: Bug Finding
  const bug = rng.pick(BUG_TEMPLATES);
  const bugOptions = rng.shuffle([...bug.options]);
  const correctBugOption = bug.options[bug.correctOptionIndex];
  const bugCorrectIdx = bugOptions.indexOf(correctBugOption);

  questions.push({
    section: 'coding',
    index: 0,
    type: 'bug-finding',
    payload: {
      prompt: `The following ${bug.language} code has a bug. Which line contains the error?`,
      inputType: 'multiple-choice',
      options: bugOptions,
      display: bug.code,
      displayLanguage: bug.language,
    },
    answerKey: { correct: bugCorrectIdx },
  });

  // Q2: Recursive Trace
  const recursive = rng.pick(RECURSIVE_TEMPLATES);

  questions.push({
    section: 'coding',
    index: 1,
    type: 'recursive-trace',
    payload: {
      prompt: `Trace the following ${recursive.language} function and determine the output for f(${recursive.inputN}).`,
      inputType: 'numeric',
      display: recursive.code,
      displayLanguage: recursive.language,
    },
    answerKey: { correct: recursive.expectedOutput },
  });

  // Q3: Assembly Reading
  const assembly = rng.pick(ASSEMBLY_TEMPLATES);
  const asmOptions = assembly.options.map(String);
  const asmShuffled = rng.shuffle([...asmOptions]);
  const correctAsmOption = asmOptions[assembly.correctOptionIndex];
  const asmCorrectIdx = asmShuffled.indexOf(correctAsmOption);

  questions.push({
    section: 'coding',
    index: 2,
    type: 'assembly-reading',
    payload: {
      prompt: 'What value will be in the EAX register after this x86 assembly executes?',
      inputType: 'multiple-choice',
      options: asmShuffled,
      display: assembly.code,
      displayLanguage: 'x86asm',
    },
    answerKey: { correct: asmCorrectIdx },
  });

  // Q4: Long Function
  const longFn = rng.pick(LONG_FUNCTION_TEMPLATES);
  const longFnOptions = rng.shuffle([...longFn.options]);
  const correctLongFnOption = longFn.options[longFn.correctOptionIndex];
  const longFnCorrectIdx = longFnOptions.indexOf(correctLongFnOption);

  questions.push({
    section: 'coding',
    index: 3,
    type: 'long-function',
    payload: {
      prompt: `Given the following ${longFn.language} function, what is the output when called with ${longFn.inputDescription} = ${longFn.inputValue}?`,
      inputType: 'multiple-choice',
      options: longFnOptions,
      display: longFn.code,
      displayLanguage: longFn.language,
    },
    answerKey: { correct: longFnCorrectIdx },
  });

  return questions;
}
