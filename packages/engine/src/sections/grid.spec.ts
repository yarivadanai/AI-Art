import { describe, expect, it } from 'vitest';
import { generateGridSection, gradeGridSection, type GridReasoningResponse } from './grid.js';

describe('Grid reasoning section', () => {
  it('generates deterministic items', () => {
    const a = generateGridSection('seed');
    const b = generateGridSection('seed');
    expect(a).toStrictEqual(b);
    expect(a.items.length).toBeGreaterThanOrEqual(6);
    a.items.forEach((item) => {
      expect(item.train).toHaveLength(3);
      expect(item.options[item.correctIndex]).toMatch(/→/);
    });
  });

  it('grades responses correctly', () => {
    const section = generateGridSection('score');
    const responses: GridReasoningResponse[] = section.items.map((item) => ({
      itemId: item.id,
      type: 'grid',
      selectedIndex: item.correctIndex,
    }));
    const score = gradeGridSection(section, responses);
    expect(score.overall).toBe(1);

    const failures: GridReasoningResponse[] = section.items.map((item) => ({
      itemId: item.id,
      type: 'grid',
      selectedIndex: (item.correctIndex + 1) % item.options.length,
    }));
    const failureScore = gradeGridSection(section, failures);
    expect(failureScore.overall).toBe(0);
  });
});
