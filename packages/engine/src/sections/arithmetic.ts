import { createSeededRng, type SeededRng } from '../rng/createRng.js';

export interface ArithmeticItem {
  id: string;
  type: 'arith';
  prompt: string;
  expression: string;
  expected: string;
  tolerance?: number;
  rationale: string;
}

export interface ArithmeticSection {
  code: 'B';
  label: string;
  durationSeconds: number;
  items: ArithmeticItem[];
  description: string;
}

export interface ArithmeticResponse {
  itemId: string;
  answer: string;
  type: 'arith';
  timeMs?: number;
}

export interface ArithmeticItemResult {
  itemId: string;
  correctness: number;
  delta?: number;
  expected: string;
  feedback?: string;
}

export interface ArithmeticSectionScore {
  overall: number;
  items: ArithmeticItemResult[];
}

export function generateArithmeticSection(seed: string): ArithmeticSection {
  const rng = createSeededRng(`arith-${seed}`);
  const items: ArithmeticItem[] = [
    buildDecimalMix(rng),
    buildCarryTrap(rng),
    buildOrderExpression(rng),
    buildFractionToDecimal(rng),
    buildPercentage(rng),
    buildMixedOperation(rng),
    buildPowerRoot(rng),
    buildRounding(rng),
  ];

  return {
    code: 'B',
    label: 'Arithmetic Reliability',
    durationSeconds: 150,
    description:
      'Exact arithmetic under time pressure. Focus on carries, multi-step order, and precise rounding.',
    items,
  };
}

export function gradeArithmeticSection(
  section: ArithmeticSection,
  responses: ArithmeticResponse[],
): ArithmeticSectionScore {
  const responseMap = new Map(responses.map((entry) => [entry.itemId, entry]));
  const results = section.items.map((item) => {
    const response = responseMap.get(item.id);
    const result = scoreArithmeticItem(item, response);
    return result;
  });

  const overall = results.reduce((sum, entry) => sum + entry.correctness, 0) / results.length;
  return { overall, items: results };
}

export function scoreArithmeticItem(
  item: ArithmeticItem,
  response?: ArithmeticResponse,
): ArithmeticItemResult {
  if (!response || response.type !== 'arith' || !response.answer.trim()) {
    return {
      itemId: item.id,
      expected: item.expected,
      correctness: 0,
      feedback: 'No answer submitted.',
    };
  }

  const parsedAnswer = sanitiseNumber(response.answer);
  const parsedExpected = sanitiseNumber(item.expected);
  const tolerance = item.tolerance ?? 0;

  const difference = Math.abs(parsedAnswer - parsedExpected);
  const correctness =
    difference <= tolerance ? 1 : Math.max(0, 1 - difference / Math.max(1, parsedExpected));

  return {
    itemId: item.id,
    expected: item.expected,
    correctness: correctness >= 0.999 ? 1 : Math.max(0, Math.min(1, correctness)),
    delta: difference,
    feedback:
      difference <= tolerance
        ? 'Exact match achieved.'
        : `Expected ${item.expected}; difference of ${difference.toExponential(2)} exceeds tolerance ${tolerance}.`,
  };
}

// -- generators ------------------------------------------------------------

function buildDecimalMix(rng: SeededRng): ArithmeticItem {
  const a = Number(randomFloat(rng, 120, 480, 3).toFixed(3));
  const b = Number(randomFloat(rng, 12, 98, 4).toFixed(4));
  const c = Number(randomFloat(rng, 6, 54, 4).toFixed(4));
  const expression = `${a.toFixed(3)} + ${b.toFixed(4)} - ${c.toFixed(4)}`;
  const expected = (a + b - c).toFixed(4);
  return makeItem(
    rng,
    expression,
    expected,
    'Balance millesimal additions and subtractions without losing precision.',
    0.0001,
  );
}

function buildCarryTrap(rng: SeededRng): ArithmeticItem {
  const a = randomInt(rng, 200000, 799999);
  const b = randomInt(rng, 400000, 899999);
  const c = randomInt(rng, 20000, 95000);
  const expression = `${a} - ${b} - ${c}`;
  const expected = (a - b - c).toString();
  return makeItem(
    rng,
    expression,
    expected,
    'Multi-stage borrowing across six digits including a negative outcome.',
  );
}

function buildOrderExpression(rng: SeededRng): ArithmeticItem {
  const a = randomInt(rng, 3, 7);
  const b = randomInt(rng, 4, 9);
  const c = randomInt(rng, 2, 6);
  const d = randomInt(rng, 3, 7);
  const e = randomInt(rng, 5, 12);
  const expression = `((${a}^3 - ${b} * ${c}) / ${d}) + sqrt(${e * e * 3})`;
  const expected = ((Math.pow(a, 3) - b * c) / d + Math.sqrt(e * e * 3)).toFixed(3);
  return makeItem(
    rng,
    expression,
    expected,
    'Nested exponents, division, and radicals demand strict order tracking.',
    0.0005,
  );
}

function buildFractionToDecimal(rng: SeededRng): ArithmeticItem {
  const denominator = pick([7, 11, 13, 17, 19, 23], rng);
  const numerator = randomInt(rng, 1, denominator - 1);
  const expression = `${numerator}/${denominator}`;
  const expected = (numerator / denominator).toFixed(7);
  return makeItem(
    rng,
    expression,
    expected,
    'Convert awkward proper fractions to a seven-decimal expansion.',
    0.0000005,
  );
}

function buildPercentage(rng: SeededRng): ArithmeticItem {
  const base = randomInt(rng, 240, 960);
  const increase = pick([18.75, 22.4, 27.5], rng);
  const decrease = pick([9.5, 12.5, 16.75], rng);
  const expression = `Apply +${increase}% then -${decrease}% to ${base}`;
  const expected = (base * (1 + increase / 100) * (1 - decrease / 100)).toFixed(3);
  return makeItem(
    rng,
    expression,
    expected,
    'Sequential percentage adjustments; cubic-mill precision enforced.',
    0.001,
  );
}

function buildMixedOperation(rng: SeededRng): ArithmeticItem {
  const a = randomInt(rng, 18, 54);
  const b = randomInt(rng, 6, 12);
  const c = randomInt(rng, 5, 11);
  const d = randomInt(rng, 3, 9);
  const expression = `(((${a} / ${b})^2) + ${c}/${d}) * ${b - 1}`;
  const expected = (
    (Math.pow(a / b, 2) + c / d) * (b - 1)
  ).toFixed(4);
  return makeItem(
    rng,
    expression,
    expected,
    'Compound rational terms with a squared quotient amplified by scaling.',
    0.0005,
  );
}

function buildPowerRoot(rng: SeededRng): ArithmeticItem {
  const base = pick([3, 5, 7, 11], rng);
  const power = randomInt(rng, 3, 5);
  const multiplier = randomInt(rng, 2, 6);
  const radical = Math.pow(base, 3) * multiplier;
  const expression = `${base}^${power} + cbrt(${radical})`;
  const expected = Math.pow(base, power) + Math.cbrt(radical);
  return makeItem(
    rng,
    expression,
    expected.toFixed(5),
    'High powers combined with an exact cube-root evaluation.',
    0.00001,
  );
}

function buildRounding(rng: SeededRng): ArithmeticItem {
  const value = randomFloat(rng, 100, 999, 3);
  const expression = `Round ${value} to three significant figures`;
  const expectedNumber = Number.parseFloat(value.toPrecision(3));
  const expected = expectedNumber.toString();
  return makeItem(
    rng,
    expression,
    expected,
    'Significant-figure rounding with potential carry propagation.',
    0.0001,
  );
}

function makeItem(
  rng: SeededRng,
  expression: string,
  expected: string,
  rationale: string,
  tolerance = 0,
): ArithmeticItem {
  return {
    id: makeItemId('B', rng),
    type: 'arith',
    prompt: `Evaluate ${expression}`,
    expression,
    expected,
    tolerance,
    rationale,
  };
}

function makeItemId(prefix: string, rng: SeededRng): string {
  const fragment = Math.floor(rng.float() * 36 ** 4)
    .toString(36)
    .padStart(4, '0');
  return `${prefix}-${fragment}`;
}

function randomInt(rng: SeededRng, min: number, max: number): number {
  return Math.floor(rng.float() * (max - min + 1)) + min;
}

function randomFloat(rng: SeededRng, min: number, max: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round((rng.float() * (max - min) + min) * factor) / factor;
}

function pick<T>(options: T[], rng: SeededRng): T {
  return options[randomInt(rng, 0, options.length - 1)];
}

function sanitiseNumber(input: string): number {
  const cleaned = input
    .trim()
    .replace(/%$/, '')
    .replace(/[^0-9.+-]/g, '');
  const value = Number(cleaned);
  if (Number.isNaN(value)) {
    return Number.POSITIVE_INFINITY;
  }
  return value;
}
