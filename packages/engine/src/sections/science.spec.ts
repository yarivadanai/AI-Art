import { describe, expect, it } from 'vitest';
import { generateScienceSection, gradeScienceSection } from './science.js';

describe('Science section', () => {
  it('generates deterministic items', () => {
    const a = generateScienceSection('seed');
    const b = generateScienceSection('seed');
    expect(a).toStrictEqual(b);
  });

  it('grades correctly', () => {
    const section = generateScienceSection('grade');
    expect(section.items).toHaveLength(6);
    section.items.forEach((item) => {
      expect(item.options).toHaveLength(4);
      expect(item.prompt.length).toBeGreaterThan(40);
    });
    const responses = section.items.map((item) => ({
      itemId: item.id,
      type: item.type,
      selectedIndex: item.correctIndex,
    }));
    const result = gradeScienceSection(section, responses);
    expect(result.overall).toBe(1);

    const incorrect = section.items.map((item) => ({
      itemId: item.id,
      type: item.type,
      selectedIndex: (item.correctIndex + 1) % item.options.length,
    }));
    const wrongResult = gradeScienceSection(section, incorrect);
    expect(wrongResult.overall).toBe(0);
  });
});
