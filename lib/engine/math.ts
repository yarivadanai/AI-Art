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

  // Q1: Decimal Arithmetic — 4-term expression with high-precision decimals and square root
  // Generate expression: (a × b) + (c ÷ d) − (e × f) + √(g)
  const decPlacesA = rng.int(3, 5);
  const decPlacesB = rng.int(3, 5);
  const decPlacesC = rng.int(3, 5);
  const decPlacesD = rng.int(3, 4);
  const decPlacesE = rng.int(3, 5);
  const decPlacesF = rng.int(3, 4);

  const a = genDecimal(rng, -9999.9999, 9999.9999, decPlacesA);
  const b = genDecimal(rng, -99.99, 99.99, decPlacesB);
  // Ensure d is non-zero and not trivial
  let d = 0;
  while (Math.abs(d) < 0.01) {
    d = genDecimal(rng, -99.99, 99.99, decPlacesD);
  }
  const c = genDecimal(rng, -9999.9999, 9999.9999, decPlacesC);
  const e = genDecimal(rng, -9999.9999, 9999.9999, decPlacesE);
  const f = genDecimal(rng, -99.99, 99.99, decPlacesF);

  // g is a perfect square between 100 and 10000
  const gBase = rng.int(10, 100);
  const g = gBase * gBase;

  const decimalAnswer = (a * b) + (c / d) - (e * f) + Math.sqrt(g);
  const decimalAnswerRounded = roundTo(decimalAnswer, 4);

  questions.push({
    section: 'math',
    index: 0,
    type: 'decimal-arithmetic',
    payload: {
      prompt: `Compute the following to at least 2 decimal places:\n\n(${a} × ${b}) + (${c} ÷ ${d}) − (${e} × ${f}) + √(${g})`,
      inputType: 'numeric',
    },
    answerKey: { correct: decimalAnswerRounded, tolerance: 0.01 },
  });

  // Q2: Order of Operations — deeply nested with exponents, roots, modular arithmetic, and division
  // Generate: ((a² + b)^c ÷ d − e × (f − g²) + √(h)) % m
  const ooA = rng.int(3, 12);
  const ooB = rng.int(1, 12);
  const ooC = rng.int(2, 5);
  const ooD = rng.int(2, 9);
  const ooE = rng.int(2, 15);
  const ooF = rng.int(5, 25);
  const ooG = rng.int(2, 8);
  // Pick a perfect square for the sqrt term
  const ooSqrtBase = rng.int(2, 12);
  const ooH = ooSqrtBase * ooSqrtBase;
  // Modular arithmetic term
  const ooM = rng.int(7, 13);

  const innerLeft = Math.pow(ooA * ooA + ooB, ooC);
  const ooBeforeMod = innerLeft / ooD - ooE * (ooF - ooG * ooG) + ooSqrtBase;
  // JavaScript % can return negative for negative operands; use true mathematical modulo
  const ooAnswer = ((ooBeforeMod % ooM) + ooM) % ooM;
  const ooAnswerRounded = roundTo(ooAnswer, 4);

  questions.push({
    section: 'math',
    index: 1,
    type: 'order-of-operations',
    payload: {
      prompt: `Evaluate the following expression (round to 2 decimal places if needed):\n\n((${ooA}² + ${ooB})^${ooC} ÷ ${ooD} − ${ooE} × (${ooF} − ${ooG}²) + √${ooH}) % ${ooM}`,
      inputType: 'numeric',
    },
    answerKey: { correct: ooAnswerRounded, tolerance: 0.05 },
  });

  // Q3: Trig + Logarithms — compound expression with three trig functions and two log operations
  // Generate: sin(α) × log_b1(n1) − cos(β) × tan(γ) + log_b2(n2)
  // Non-standard angles that require actual computation
  const angles = [15, 18, 22.5, 36, 54, 72, 75, 105, 162, 198, 252, 288];
  // Angles safe for tan (avoid 90, 270 where tan is undefined) — all of the above are safe
  const tanAngles = [15, 18, 22.5, 36, 54, 72, 75, 105, 162, 198, 252, 288];
  const alpha = rng.pick(angles);
  const beta = rng.pick(angles);
  const gamma = rng.pick(tanAngles);

  const sinVal = Math.sin(alpha * Math.PI / 180);
  const cosVal = Math.cos(beta * Math.PI / 180);
  const tanVal = Math.tan(gamma * Math.PI / 180);

  // Logarithms with bases [2,3,5,7,11] and powers 3-11 for larger arguments
  const base1 = rng.pick([2, 3, 5, 7, 11]);
  const exp1 = rng.int(3, 11);
  const logArg1 = Math.pow(base1, exp1);
  const logVal1 = exp1;

  const base2 = rng.pick([2, 3, 5, 7, 11]);
  const exp2 = rng.int(3, 11);
  const logArg2 = Math.pow(base2, exp2);
  const logVal2 = exp2;

  // Expression: sin(α) × log_b1(n1) − cos(β) × tan(γ) + log_b2(n2)
  const trigLogAnswer = roundTo(sinVal * logVal1 - cosVal * tanVal + logVal2, 4);

  questions.push({
    section: 'math',
    index: 2,
    type: 'trig-log',
    payload: {
      prompt: `Compute to 2 decimal places:\n\nsin(${alpha}°) × log₍${base1}₎(${logArg1}) − cos(${beta}°) × tan(${gamma}°) + log₍${base2}₎(${logArg2})`,
      inputType: 'numeric',
    },
    answerKey: { correct: trigLogAnswer, tolerance: 0.05 },
  });

  // Q4: Definite Integral — quartic polynomial with wider range
  // ∫ from lower to upper of (ax⁴ + bx³ + cx² + dx + e) dx
  const intA = rng.int(-8, 8) || 1; // ensure non-zero leading coefficient
  const intB = rng.int(-8, 8);
  const intC = rng.int(-8, 8);
  const intD = rng.int(-8, 8);
  const intE = rng.int(-8, 8);
  const lower = rng.int(-5, 4);
  const upper = rng.int(lower + 4, 8);

  // Antiderivative: (a/5)x⁵ + (b/4)x⁴ + (c/3)x³ + (d/2)x² + ex
  // Evaluate at bounds
  const evalAntiderivative = (x: number): number => {
    return (intA / 5) * Math.pow(x, 5) + (intB / 4) * Math.pow(x, 4) + (intC / 3) * Math.pow(x, 3) + (intD / 2) * Math.pow(x, 2) + intE * x;
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

  // Format the quartic polynomial for display
  const formatPoly = (): string => {
    const terms: string[] = [];
    if (intA !== 0) terms.push(`${intA === 1 ? '' : intA === -1 ? '-' : intA}x⁴`);
    if (intB !== 0) {
      const sign = intB > 0 && terms.length > 0 ? ' + ' : terms.length > 0 ? ' ' : '';
      terms.push(`${sign}${intB === 1 ? '' : intB === -1 ? '-' : intB}x³`);
    }
    if (intC !== 0) {
      const sign = intC > 0 && terms.length > 0 ? ' + ' : terms.length > 0 ? ' ' : '';
      terms.push(`${sign}${intC === 1 ? '' : intC === -1 ? '-' : intC}x²`);
    }
    if (intD !== 0) {
      const sign = intD > 0 && terms.length > 0 ? ' + ' : terms.length > 0 ? ' ' : '';
      terms.push(`${sign}${intD === 1 ? '' : intD === -1 ? '-' : intD}x`);
    }
    if (intE !== 0) {
      const sign = intE > 0 && terms.length > 0 ? ' + ' : terms.length > 0 ? ' ' : '';
      terms.push(`${sign}${intE}`);
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
