import { describe, expect, it } from 'vitest';
import { aggregateScores, seedToColor } from './grading.js';

describe('aggregateScores', () => {
  it('computes average score within bounds', () => {
    const result = aggregateScores([
      { code: 'A', correctness: 0.7 },
      { code: 'B', correctness: 0.8 },
    ]);

    expect(result.overall).toBeCloseTo(0.75, 2);
    expect(result.sections).toHaveLength(2);
  });

  it('handles empty input', () => {
    expect(aggregateScores([])).toStrictEqual({ overall: 0, sections: [] });
  });
});

describe('seedToColor', () => {
  it('derives a stable color', () => {
    expect(seedToColor('alpha')).toEqual(seedToColor('alpha'));
  });
});
