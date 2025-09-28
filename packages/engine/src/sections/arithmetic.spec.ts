import { describe, expect, it } from 'vitest';
import {
  generateArithmeticSection,
  gradeArithmeticSection,
  scoreArithmeticItem,
  type ArithmeticResponse,
} from './arithmetic.js';

describe('Arithmetic section generator', () => {
  it('produces deterministic items', () => {
    const a = generateArithmeticSection('seed');
    const b = generateArithmeticSection('seed');
    expect(a).toStrictEqual(b);
    expect(a.items).toHaveLength(8);
  });

  it('scores answers correctly', () => {
    const section = generateArithmeticSection('answers');
    const responses: ArithmeticResponse[] = section.items.map((item) => ({
      itemId: item.id,
      type: 'arith',
      answer: item.expected,
    }));

    const result = gradeArithmeticSection(section, responses);
    expect(result.overall).toBeCloseTo(1, 5);

    const first = scoreArithmeticItem(section.items[0], {
      itemId: section.items[0].id,
      type: 'arith',
      answer: section.items[0].expected,
    });
    expect(first.correctness).toBe(1);
  });

  it('handles incorrect responses', () => {
    const section = generateArithmeticSection('wrong');
    const item = section.items[0];
    const response: ArithmeticResponse = { itemId: item.id, type: 'arith', answer: '0' };

    const result = scoreArithmeticItem(item, response);
    expect(result.correctness).toBeLessThan(1);
  });
});
