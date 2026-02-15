import { SeededRNG } from './rng';
import { GeneratedQuestion } from '@/lib/types';
import { FALLACIOUS_PROOFS } from '@/lib/banks/proofs';

/** Round a number to a given number of decimal places */
function roundTo(n: number, places: number): number {
  const factor = Math.pow(10, places);
  return Math.round(n * factor) / factor;
}

/** Generate a random number with a specific number of decimal places */
function genDecimal(rng: SeededRNG, minVal: number, maxVal: number, decimalPlaces: number): number {
  const raw = rng.float(minVal, maxVal);
  return roundTo(raw, decimalPlaces);
}

export function generateMathQuestions(rng: SeededRNG): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  // Q1: Decimal Arithmetic — 3-term expression with high-precision decimals
  // Generate expression: (a × b) + (c ÷ d) - (e × f)
  const decPlacesA = rng.int(2, 4);
  const decPlacesB = rng.int(2, 4);
  const decPlacesC = rng.int(2, 4);
  const decPlacesD = rng.int(2, 3);
  const decPlacesE = rng.int(2, 4);
  const decPlacesF = rng.int(2, 3);

  const a = genDecimal(rng, -999, 999, decPlacesA);
  const b = genDecimal(rng, -5, 5, decPlacesB);
  // Ensure d is non-zero and not trivial
  let d = 0;
  while (Math.abs(d) < 0.01) {
    d = genDecimal(rng, -20, 20, decPlacesD);
  }
  const c = genDecimal(rng, -500, 500, decPlacesC);
  const e = genDecimal(rng, -100, 100, decPlacesE);
  const f = genDecimal(rng, -2, 2, decPlacesF);

  const decimalAnswer = (a * b) + (c / d) - (e * f);
  const decimalAnswerRounded = roundTo(decimalAnswer, 4);

  questions.push({
    section: 'math',
    index: 0,
    type: 'decimal-arithmetic',
    payload: {
      prompt: `Compute the following to at least 2 decimal places:\n\n(${a} × ${b}) + (${c} ÷ ${d}) − (${e} × ${f})`,
      inputType: 'numeric',
    },
    answerKey: { correct: decimalAnswerRounded, tolerance: 0.05 },
  });

  // Q2: Order of Operations — deeply nested with exponents, roots, and division
  // Generate: (a² + b)^c ÷ d − e × (f − g²) + √(h)
  const ooA = rng.int(2, 6);
  const ooB = rng.int(1, 12);
  const ooC = rng.int(2, 3);
  const ooD = rng.int(2, 9);
  const ooE = rng.int(2, 15);
  const ooF = rng.int(5, 25);
  const ooG = rng.int(1, 4);
  // Pick a perfect square for the sqrt term
  const ooSqrtBase = rng.int(2, 12);
  const ooH = ooSqrtBase * ooSqrtBase;

  const innerLeft = Math.pow(ooA * ooA + ooB, ooC);
  const ooAnswer = innerLeft / ooD - ooE * (ooF - ooG * ooG) + ooSqrtBase;
  const ooAnswerRounded = roundTo(ooAnswer, 4);

  questions.push({
    section: 'math',
    index: 1,
    type: 'order-of-operations',
    payload: {
      prompt: `Evaluate the following expression (round to 2 decimal places if needed):\n\n(${ooA}² + ${ooB})^${ooC} ÷ ${ooD} − ${ooE} × (${ooF} − ${ooG}²) + √${ooH}`,
      inputType: 'numeric',
    },
    answerKey: { correct: ooAnswerRounded, tolerance: 0.05 },
  });

  // Q3: Trig + Logarithms — compound expression with multiple trig and log operations
  // Generate: sin(α) × log_b1(n1) − cos(β) + tan(γ) ÷ log_b2(n2)
  const angles = [30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330];
  // Angles safe for tan (avoid 90, 270 where tan is undefined)
  const tanAngles = [30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330];
  const alpha = rng.pick(angles);
  const beta = rng.pick(angles);
  const gamma = rng.pick(tanAngles);

  const sinVal = Math.sin(alpha * Math.PI / 180);
  const cosVal = Math.cos(beta * Math.PI / 180);
  const tanVal = Math.tan(gamma * Math.PI / 180);

  const base1 = rng.pick([2, 3, 5, 10]);
  const exp1 = rng.int(2, 6);
  const logArg1 = Math.pow(base1, exp1);
  const logVal1 = exp1;

  const base2 = rng.pick([2, 3, 5, 10]);
  const exp2 = rng.int(2, 5);
  const logArg2 = Math.pow(base2, exp2);
  const logVal2 = exp2;

  const trigLogAnswer = roundTo(sinVal * logVal1 - cosVal + tanVal / logVal2, 4);

  questions.push({
    section: 'math',
    index: 2,
    type: 'trig-log',
    payload: {
      prompt: `Compute to 2 decimal places:\n\nsin(${alpha}°) × log₍${base1}₎(${logArg1}) − cos(${beta}°) + tan(${gamma}°) ÷ log₍${base2}₎(${logArg2})`,
      inputType: 'numeric',
    },
    answerKey: { correct: trigLogAnswer, tolerance: 0.05 },
  });

  // Q4: Definite Integral — cubic polynomial with wider range
  // ∫ from lower to upper of (ax³ + bx² + cx + d) dx
  const intA = rng.int(-3, 3) || 1; // ensure non-zero leading coefficient
  const intB = rng.int(-6, 6);
  const intC = rng.int(-8, 8);
  const intD = rng.int(-10, 10);
  const lower = rng.int(-2, 2);
  const upper = rng.int(lower + 2, 6);

  // Antiderivative: (a/4)x⁴ + (b/3)x³ + (c/2)x² + dx
  // Evaluate at bounds
  const evalAntiderivative = (x: number): number => {
    return (intA / 4) * Math.pow(x, 4) + (intB / 3) * Math.pow(x, 3) + (intC / 2) * Math.pow(x, 2) + intD * x;
  };

  const integralAnswer = roundTo(evalAntiderivative(upper) - evalAntiderivative(lower), 4);

  // Generate distractors for multiple choice
  const integralDistractors = [
    roundTo(integralAnswer + rng.float(2, 8), 2),
    roundTo(integralAnswer - rng.float(2, 8), 2),
    roundTo(integralAnswer * rng.float(1.5, 3), 2),
  ];

  const integralOptions = rng.shuffle([
    String(roundTo(integralAnswer, 2)),
    ...integralDistractors.map(String),
  ]);
  const integralCorrectIdx = integralOptions.indexOf(String(roundTo(integralAnswer, 2)));

  // Format the polynomial for display
  const formatPoly = (): string => {
    const terms: string[] = [];
    if (intA !== 0) terms.push(`${intA === 1 ? '' : intA === -1 ? '-' : intA}x³`);
    if (intB !== 0) {
      const sign = intB > 0 && terms.length > 0 ? ' + ' : terms.length > 0 ? ' ' : '';
      terms.push(`${sign}${intB === 1 ? '' : intB === -1 ? '-' : intB}x²`);
    }
    if (intC !== 0) {
      const sign = intC > 0 && terms.length > 0 ? ' + ' : terms.length > 0 ? ' ' : '';
      terms.push(`${sign}${intC === 1 ? '' : intC === -1 ? '-' : intC}x`);
    }
    if (intD !== 0) {
      const sign = intD > 0 && terms.length > 0 ? ' + ' : terms.length > 0 ? ' ' : '';
      terms.push(`${sign}${intD}`);
    }
    return terms.join('') || '0';
  };

  questions.push({
    section: 'math',
    index: 3,
    type: 'definite-integral',
    payload: {
      prompt: `Evaluate the definite integral:\n\n∫ from ${lower} to ${upper} of (${formatPoly()}) dx`,
      inputType: 'multiple-choice',
      options: integralOptions,
    },
    answerKey: { correct: integralCorrectIdx },
  });

  // Q5: Proof Error
  const proof = rng.pick(FALLACIOUS_PROOFS);
  const stepsDisplay = proof.steps
    .map((step, i) => `Step ${i + 1}: ${step}`)
    .join('\n');
  const proofOptions = rng.shuffle([
    proof.errorExplanation,
    ...proof.distractorExplanations,
  ]);
  const proofCorrectIdx = proofOptions.indexOf(proof.errorExplanation);

  questions.push({
    section: 'math',
    index: 4,
    type: 'proof-error',
    payload: {
      prompt: `The following proof contains an error. Identify the nature of the error.`,
      inputType: 'multiple-choice',
      options: proofOptions,
      display: `${proof.title}\n\n${stepsDisplay}`,
    },
    answerKey: { correct: proofCorrectIdx },
  });

  return questions;
}
