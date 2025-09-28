import { describe, expect, it } from 'vitest';
import { generatePerceptionSection, gradePerceptionSection } from './perception.js';

describe('Perception section', () => {
  it('generates deterministic items', () => {
    const a = generatePerceptionSection('seed');
    const b = generatePerceptionSection('seed');
    expect(a).toStrictEqual(b);
    a.items.forEach((item) => {
      expect(item.scenario.length).toBeGreaterThan(100);
      expect(item.options[item.correctIndex]).toContain('•');
    });
  });

  it('grades responses', () => {
    const section = generatePerceptionSection('grade');
    const responses = section.items.map((item) => ({
      itemId: item.id,
      type: 'perception' as const,
      selectedIndex: item.correctIndex,
    }));
    const score = gradePerceptionSection(section, responses);
    expect(score.overall).toBe(1);

    const wrongResponses = section.items.map((item) => ({
      itemId: item.id,
      type: 'perception' as const,
      selectedIndex: (item.correctIndex + 1) % item.options.length,
    }));
    const wrongScore = gradePerceptionSection(section, wrongResponses);
    expect(wrongScore.overall).toBe(0);
  });
});
