import { describe, expect, it } from 'vitest';
import {
  generateArithmeticSection,
  scoreArithmeticItem,
  type ArithmeticItem,
} from './arithmetic.js';

describe('Arithmetic difficulty generation', () => {
  it('produces high-precision, multi-stage computations', () => {
    const section = generateArithmeticSection('rigorous-arithmetic');

    const findByRationale = (needle: string): ArithmeticItem | undefined =>
      section.items.find((item) => item.rationale.includes(needle));

    const decimalItem = findByRationale('millesimal');
    expect(decimalItem).toBeDefined();
    if (!decimalItem) throw new Error('Decimal mix item missing');
    expect(decimalItem.expected).toMatch(/^-?\d+\.\d{4}$/);
    const decimalMatch = decimalItem.expression.match(
      /^(\d+\.\d{3}) \+ (\d+\.\d{4}) - (\d+\.\d{4})$/,
    );
    expect(decimalMatch).not.toBeNull();
    if (!decimalMatch) throw new Error('Decimal expression malformed');
    const decimalComputed =
      parseFloat(decimalMatch[1]) + parseFloat(decimalMatch[2]) - parseFloat(decimalMatch[3]);
    expect(Number(decimalItem.expected)).toBeCloseTo(decimalComputed, 4);

    const borrowItem = findByRationale('borrowing across six digits');
    expect(borrowItem).toBeDefined();
    if (!borrowItem) throw new Error('Carry-trap item missing');
    const borrowMatch = borrowItem.expression.match(/^(\d{6}) - (\d{6}) - (\d{2,5})$/);
    expect(borrowMatch).not.toBeNull();
    if (!borrowMatch) throw new Error('Borrow expression malformed');
    const borrowComputed =
      parseInt(borrowMatch[1], 10) - parseInt(borrowMatch[2], 10) - parseInt(borrowMatch[3], 10);
    expect(Number(borrowItem.expected)).toBe(borrowComputed);
    expect(borrowComputed).toBeLessThan(0);

    const orderItem = findByRationale('Nested exponents');
    expect(orderItem).toBeDefined();
    if (!orderItem) throw new Error('Order-of-operations item missing');
    const orderMatch = orderItem.expression.match(
      /^\(\((\d)\^3 - (\d) \* (\d)\) \/ (\d)\) \+ sqrt\((\d+)\)$/,
    );
    expect(orderMatch).not.toBeNull();
    if (!orderMatch) throw new Error('Order expression malformed');
    const [a, b, c, d, radicand] = orderMatch.slice(1).map((value) => parseInt(value, 10));
    const orderComputed = ((a ** 3 - b * c) / d) + Math.sqrt(radicand);
    expect(Number(orderItem.expected)).toBeCloseTo(orderComputed, 3);

    const fractionItem = findByRationale('seven-decimal expansion');
    expect(fractionItem).toBeDefined();
    if (!fractionItem) throw new Error('Fraction item missing');
    expect(fractionItem.expected).toMatch(/^0\.\d{7}$/);

    const percentageItem = findByRationale('Sequential percentage adjustments');
    expect(percentageItem).toBeDefined();
    if (!percentageItem) throw new Error('Percentage cascade missing');
    const percentageMatch = percentageItem.expression.match(
      /^Apply \+(\d+\.\d+)% then -(\d+\.\d+)% to (\d+)$/,
    );
    expect(percentageMatch).not.toBeNull();
    if (!percentageMatch) throw new Error('Percentage expression malformed');
    const increase = parseFloat(percentageMatch[1]);
    const decrease = parseFloat(percentageMatch[2]);
    const base = parseInt(percentageMatch[3], 10);
    const percentageComputed = base * (1 + increase / 100) * (1 - decrease / 100);
    expect(Number(percentageItem.expected)).toBeCloseTo(percentageComputed, 3);

    const mixedItem = findByRationale('Compound rational terms');
    expect(mixedItem).toBeDefined();
    if (!mixedItem) throw new Error('Mixed-operation item missing');
    const mixedMatch = mixedItem.expression.match(
      /^\(\(\((\d+) \/ (\d+)\)\^2\) \+ (\d+)\/(\d+)\) \* (\d+)$/,
    );
    expect(mixedMatch).not.toBeNull();
    if (!mixedMatch) throw new Error('Mixed expression malformed');
    const [numA, denA, numC, denC, scale] = mixedMatch.slice(1).map((value) => parseInt(value, 10));
    const mixedComputed = (Math.pow(numA / denA, 2) + numC / denC) * scale;
    expect(Number(mixedItem.expected)).toBeCloseTo(mixedComputed, 4);

    const powerItem = findByRationale('cube-root');
    expect(powerItem).toBeDefined();
    if (!powerItem) throw new Error('Power-root item missing');
    const powerMatch = powerItem.expression.match(/^(\d+)\^(\d) \+ cbrt\((\d+)\)$/);
    expect(powerMatch).not.toBeNull();
    if (!powerMatch) throw new Error('Power-root expression malformed');
    const basePower = parseInt(powerMatch[1], 10);
    const exponent = parseInt(powerMatch[2], 10);
    const radical = parseInt(powerMatch[3], 10);
    const powerComputed = Math.pow(basePower, exponent) + Math.cbrt(radical);
    expect(Number(powerItem.expected)).toBeCloseTo(powerComputed, 5);

    const roundingItem = findByRationale('Significant-figure');
    expect(roundingItem).toBeDefined();
    if (!roundingItem) throw new Error('Rounding item missing');
    const roundingMatch = roundingItem.expression.match(/^Round ([\d.]+) to three significant figures$/);
    expect(roundingMatch).not.toBeNull();
    if (!roundingMatch) throw new Error('Rounding expression malformed');
    const original = parseFloat(roundingMatch[1]);
    const expected = Number.parseFloat(original.toPrecision(3)).toString();
    expect(roundingItem.expected).toBe(expected);
  });

  it('honours tight tolerances and reports overages', () => {
    const section = generateArithmeticSection('tolerance-check');
    const decimalItem = section.items.find((item) => item.rationale.includes('millesimal'));
    if (!decimalItem) throw new Error('Decimal item missing');

    const expectedValue = Number(decimalItem.expected);
    const tolerance = decimalItem.tolerance ?? 0;
    expect(tolerance).toBeGreaterThan(0);

    const withinAnswer = (expectedValue + tolerance / 2).toFixed(4);
    const withinScore = scoreArithmeticItem(decimalItem, {
      itemId: decimalItem.id,
      type: 'arith',
      answer: withinAnswer,
    });
    expect(withinScore.correctness).toBe(1);

    const outsideAnswer = (expectedValue * 1.05).toFixed(4);
    const outsideScore = scoreArithmeticItem(decimalItem, {
      itemId: decimalItem.id,
      type: 'arith',
      answer: outsideAnswer,
    });
    expect(outsideScore.correctness).toBeLessThan(1);
    expect(outsideScore.feedback).toContain('difference');
  });

  it('returns zero correctness when no numeric answer is supplied', () => {
    const section = generateArithmeticSection('blank-answer');
    const item = section.items[0];
    const score = scoreArithmeticItem(item, {
      itemId: item.id,
      type: 'arith',
      answer: '   ',
    });
    expect(score.correctness).toBe(0);
    expect(score.feedback).toBe('No answer submitted.');
  });
});
