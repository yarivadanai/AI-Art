import { SeededRNG } from './rng';
import { GeneratedQuestion } from '@/lib/types';

const COLOR_PALETTE = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const OBJECTS = ['book', 'lamp', 'chair', 'key', 'clock', 'vase', 'hat', 'cup', 'ring', 'box', 'pen', 'star', 'bell', 'drum', 'leaf', 'gem', 'coin', 'mask'];

export function generateMemoryQuestions(rng: SeededRNG): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  // Q1: Digit Span: 20 digits, 3 seconds
  const digits: string[] = [];
  for (let i = 0; i < 20; i++) {
    digits.push(String(rng.int(0, 9)));
  }
  const digitString = digits.join('');

  questions.push({
    section: 'memory',
    index: 0,
    type: 'digit-span',
    payload: {
      prompt: 'A sequence of 20 digits will flash on screen. Memorize and type them back in order.',
      inputType: 'text',
      flashContent: {
        type: 'digits',
        items: [digitString],
        displayTimeMs: 3000,
      },
      flashDurationMs: 3000,
    },
    answerKey: {
      correct: digits,
      partialCredit: true,
    },
  });

  // Q2: Fact Retention
  // Generate 12 facts (color + number + object combos), show for 30s
  // Then ask 3 sub-questions about 3 random facts
  interface Fact {
    color: string;
    number: number;
    object: string;
  }

  const usedObjects = rng.pickN(OBJECTS, 18);
  const facts: Fact[] = usedObjects.map(obj => ({
    color: rng.pick(COLOR_PALETTE),
    number: rng.int(1, 999),
    object: obj,
  }));

  const factStrings = facts.map(
    f => `The ${f.color} ${f.object} has the number ${f.number}.`
  );

  // Pick 4 random facts to ask about
  const askedFacts = rng.pickN(facts, 4);

  // Generate sub-questions asking about each fact
  // Randomly ask about color, number, or object for variety
  const questionTypes: ('color' | 'number' | 'object')[] = rng.shuffle(['color', 'number', 'object', 'number']);
  const subQuestions: { prompt: string; inputType: 'text' }[] = [];
  const subAnswers: string[] = [];

  for (let i = 0; i < 4; i++) {
    const fact = askedFacts[i];
    const qType = questionTypes[i];

    switch (qType) {
      case 'color':
        subQuestions.push({
          prompt: `What color was the ${fact.object}?`,
          inputType: 'text',
        });
        subAnswers.push(fact.color);
        break;
      case 'number':
        subQuestions.push({
          prompt: `What number was associated with the ${fact.color} ${fact.object}?`,
          inputType: 'text',
        });
        subAnswers.push(String(fact.number));
        break;
      case 'object':
        subQuestions.push({
          prompt: `Which object was ${fact.color} and had the number ${fact.number}?`,
          inputType: 'text',
        });
        subAnswers.push(fact.object);
        break;
    }
  }

  questions.push({
    section: 'memory',
    index: 1,
    type: 'fact-retention',
    payload: {
      prompt: 'Study the following facts carefully. You will be asked questions about them.',
      inputType: 'multi-part',
      flashContent: {
        type: 'facts',
        items: factStrings,
        displayTimeMs: 20000,
      },
      flashDurationMs: 20000,
      subQuestions,
    },
    answerKey: {
      correct: subAnswers,
      partialCredit: true,
    },
  });

  // Q3: Sequence Recall: 14 colors at 1s each
  const colorSequence: string[] = [];
  for (let i = 0; i < 14; i++) {
    colorSequence.push(rng.pick(COLOR_PALETTE));
  }

  questions.push({
    section: 'memory',
    index: 2,
    type: 'sequence-recall',
    payload: {
      prompt: 'A sequence of 14 colors will flash one at a time. Recall the exact order.',
      inputType: 'sequence',
      flashContent: {
        type: 'colors',
        items: colorSequence,
        displayTimeMs: 14000, // 1s per color
      },
      flashDurationMs: 14000,
    },
    answerKey: {
      correct: colorSequence,
      partialCredit: true,
    },
  });

  // Q4: Speed Arithmetic: 3 operands, 1.5s flash
  const opA = rng.int(10, 99);
  const opB = rng.int(10, 99);
  const opC = rng.int(2, 30);
  const ops = ['+', '-', '×'] as const;
  const op1 = rng.pick([...ops]);
  const op2 = rng.pick([...ops]);

  const compute = (a: number, b: number, op: string): number => {
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    return a * b;
  };

  // Evaluate left to right with standard precedence: multiplication first
  let speedAnswer: number;
  const displayExpression = `${opA} ${op1} ${opB} ${op2} ${opC}`;
  // Use JS natural precedence (× before +/-)
  if (op1 === '×' && op2 === '×') {
    speedAnswer = opA * opB * opC;
  } else if (op1 === '×') {
    speedAnswer = compute(opA * opB, opC, op2);
  } else if (op2 === '×') {
    speedAnswer = compute(opA, opB * opC, op1);
  } else {
    speedAnswer = compute(compute(opA, opB, op1), opC, op2);
  }

  questions.push({
    section: 'memory',
    index: 3,
    type: 'speed-arithmetic',
    payload: {
      prompt: 'A math expression will flash briefly. Compute the answer from memory.',
      inputType: 'numeric',
      flashContent: {
        type: 'expression',
        items: [displayExpression],
        displayTimeMs: 1500,
      },
      flashDurationMs: 1500,
    },
    answerKey: { correct: speedAnswer },
  });

  return questions;
}
