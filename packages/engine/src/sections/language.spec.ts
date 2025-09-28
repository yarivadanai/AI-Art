import { describe, expect, it } from 'vitest';
import {
  generateLanguageSection,
  gradeLanguageSection,
  scoreLanguageItem,
  type LanguageResponse,
  type MicroWritingItem,
} from './language.js';

describe('Language section generator', () => {
  it('is deterministic for a given seed', () => {
    const first = generateLanguageSection('seed-123');
    const second = generateLanguageSection('seed-123');

    expect(first.items).toStrictEqual(second.items);
    expect(first.code).toBe('A');
    expect(first.items.length).toBeGreaterThanOrEqual(8);
  });

  it('scores item types correctly', () => {
    const section = generateLanguageSection('scoring-seed');

    const spelling = section.items.find((item) => item.type === 'spelling');
    if (!spelling) throw new Error('Missing spelling item');
    const spellingScore = scoreLanguageItem(spelling, {
      itemId: spelling.id,
      type: 'spelling',
      selectedIndex: spelling.correctIndex,
    });
    expect(spellingScore.correctness).toBe(1);

    const cloze = section.items.find((item) => item.type === 'cloze');
    if (!cloze) throw new Error('Missing cloze item');
    const clozeScore = scoreLanguageItem(cloze, {
      itemId: cloze.id,
      type: 'cloze',
      selectedIndices: [...cloze.correctIndices],
    });
    expect(clozeScore.correctness).toBe(1);

    const analogy = section.items.find((item) => item.type === 'analogy');
    if (!analogy) throw new Error('Missing analogy item');
    const analogyScore = scoreLanguageItem(analogy, {
      itemId: analogy.id,
      type: 'analogy',
      selectedIndex: analogy.correctIndex,
    });
    expect(analogyScore.correctness).toBe(1);

    const micro = section.items.find(
      (item): item is MicroWritingItem => item.type === 'microwrite',
    );
    if (!micro) throw new Error('Missing microwrite item');
    const microText = buildPassingMicroText(micro);
    const microScore = scoreLanguageItem(micro, {
      itemId: micro.id,
      type: 'microwrite',
      text: microText,
    });
    expect(microScore.correctness).toBe(1);
  });

  it('aggregates per-item correctness', () => {
    const section = generateLanguageSection('aggregate-seed');

    const responses: LanguageResponse[] = section.items.map((item) => {
      switch (item.type) {
        case 'spelling':
          return { itemId: item.id, type: 'spelling', selectedIndex: item.correctIndex };
        case 'cloze':
          return { itemId: item.id, type: 'cloze', selectedIndices: [...item.correctIndices] };
        case 'analogy':
          return { itemId: item.id, type: 'analogy', selectedIndex: item.correctIndex };
        case 'microwrite':
          return { itemId: item.id, type: 'microwrite', text: buildPassingMicroText(item) };
        default:
          throw new Error('Unhandled item type');
      }
    });

    const grade = gradeLanguageSection(section, responses);
    expect(grade.overall).toBeCloseTo(1);
    expect(grade.items).toHaveLength(section.items.length);
  });

  it('awards zero when response is missing', () => {
    const section = generateLanguageSection('missing-response');
    const grade = gradeLanguageSection(section, []);
    expect(grade.overall).toBe(0);
  });
});

function buildPassingMicroText(item: MicroWritingItem): string {
  const tokens = item.constraints.mustInclude;
  const base = `This memo confirms ${tokens[0]} stability, records ${tokens[1]} metrics, and quantifies ${tokens[2]} drift.`;
  return base;
}
