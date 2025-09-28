import { describe, expect, it } from 'vitest';
import {
  generateGenerativeSection,
  gradeGenerativeSection,
  type GenerativeItem,
} from './generative.js';

describe('Generative section', () => {
  it('generates deterministic items', () => {
    const a = generateGenerativeSection('seed');
    const b = generateGenerativeSection('seed');
    expect(a).toStrictEqual(b);
    expect(a.items.length).toBeGreaterThanOrEqual(3);
    expect(a.items.length).toBeLessThanOrEqual(5);
    a.items.forEach((item) => {
      item.constraints.mustInclude.forEach((token) => {
        expect(token.length).toBeGreaterThanOrEqual(6);
      });
    });
  });

  it('grades constrained writing', () => {
    const section = generateGenerativeSection('grade');
    const responses = section.items.map((item) => ({
      itemId: item.id,
      type: 'constrained' as const,
      text: buildConformingText(item),
    }));

    const result = gradeGenerativeSection(section, responses);
    expect(result.overall).toBeGreaterThan(0.5);

    const missingTokenResponses = section.items.map((item) => ({
      itemId: item.id,
      type: 'constrained' as const,
      text: 'This sentence intentionally omits key tokens.',
    }));
    const penalised = gradeGenerativeSection(section, missingTokenResponses);
    expect(penalised.overall).toBeLessThan(result.overall);
  });
});

function buildConformingText(item: GenerativeItem) {
  const tokens = item.constraints.mustInclude.join(', ');
  const sentences = Math.min(item.constraints.maxSentences, 2);
  if (sentences === 1) {
    return `Authority log notes ${tokens} while satisfying the diagnostic narrative.`;
  }
  return `Authority log records ${tokens} as required. Secondary sentence maintains coherence for adjudication.`;
}
