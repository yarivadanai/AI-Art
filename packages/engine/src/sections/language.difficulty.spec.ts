import { describe, expect, it } from 'vitest';
import {
  generateLanguageSection,
  scoreLanguageItem,
  type AnalogyItem,
  type ClozeItem,
  type LanguageResponse,
  type MicroWritingItem,
  type SpellingItem,
} from './language.js';

const EXPECTED_SPELLINGS = new Set([
  'ultracrepidarian',
  'appoggiatura',
  'psittacism',
  'floccinaucinihilipilification',
  'concupiscence',
  'legerdemain',
]);

const ANALOGY_SIGNATURES = new Set([
  'orthography|spelling->phonology|pronunciation',
  'morpheme|word->nucleotide|gene',
  'litotes|understatement->hyperbole|exaggeration',
  'grammar|syntax->law|statute',
]);

describe('Language difficulty generation', () => {
  it('emits high-complexity items across all language task types', () => {
    const section = generateLanguageSection('lexical-ordeal');

    const spellingItems = section.items.filter((item): item is SpellingItem => item.type === 'spelling');
    const clozeItems = section.items.filter((item): item is ClozeItem => item.type === 'cloze');
    const analogyItems = section.items.filter((item): item is AnalogyItem => item.type === 'analogy');
    const microWriting = section.items.find((item): item is MicroWritingItem => item.type === 'microwrite');

    expect(spellingItems).toHaveLength(3);
    spellingItems.forEach((item) => {
      const correctWord = item.options[item.correctIndex];
      expect(EXPECTED_SPELLINGS.has(correctWord)).toBe(true);
      expect(item.options).toHaveLength(4);
      expect(new Set(item.options).size).toBe(4);
    });

    expect(clozeItems).toHaveLength(3);
    clozeItems.forEach((item) => {
      expect(item.optionsPerBlank.length).toBeGreaterThanOrEqual(3);
      expect(item.textWithBlanks).toMatch(/\[1]/);
      expect(item.textWithBlanks).toMatch(/\[2]/);
      expect(item.textWithBlanks).toMatch(/\[3]/);
    });

    expect(analogyItems).toHaveLength(2);
    analogyItems.forEach((item) => {
      const signature = `${item.stem[0]}|${item.stem[1]}->${item.choices[item.correctIndex][0]}|${item.choices[item.correctIndex][1]}`;
      expect(ANALOGY_SIGNATURES.has(signature)).toBe(true);
    });

    expect(microWriting).toBeDefined();
    if (!microWriting) throw new Error('Micro-writing item missing');
    expect(microWriting.constraints.maxWords).toBeLessThanOrEqual(32);
    microWriting.constraints.mustInclude.forEach((token) => {
      // Ensure every required token is suitably obscure (>6 chars) to stay challenging.
      expect(token.length).toBeGreaterThanOrEqual(6);
    });
    expect(microWriting.rubric.minCoherenceScore).toBeGreaterThan(0.59);
  });

  it('scores micro-writing with nuanced penalties', () => {
    const section = generateLanguageSection('micro-scorer');
    const micro = section.items.find((item): item is MicroWritingItem => item.type === 'microwrite');
    if (!micro) throw new Error('Micro-writing item missing');

    const tokens = micro.constraints.mustInclude;
    const compliantButIncomplete = `Analysts map ${tokens[0]} drift alongside ${tokens[1]} dashboards, briefing leadership on variance.`;
    const missingTokenResult = scoreLanguageItem(micro, {
      itemId: micro.id,
      type: 'microwrite',
      text: compliantButIncomplete,
    });
    expect(missingTokenResult.correctness).toBeGreaterThan(0);
    expect(missingTokenResult.correctness).toBeLessThan(1);
    expect(missingTokenResult.feedback).toContain('Missing required tokens');

    const longResponse = `${tokens.join(' ')} ${Array.from({ length: micro.constraints.maxWords + 12 }, (_, index) => `filler${index}`).join(' ')}`;
    const longResult = scoreLanguageItem(micro, {
      itemId: micro.id,
      type: 'microwrite',
      text: longResponse,
    });
    expect(longResult.correctness).toBe(0);
    expect(longResult.feedback).toContain('Exceeded word limit');
  });

  it('awards partial credit for partially correct cloze selections', () => {
    const section = generateLanguageSection('cloze-precision');
    const cloze = section.items.find((item): item is ClozeItem => item.type === 'cloze');
    if (!cloze) throw new Error('Cloze item missing');

    const selections = [...cloze.correctIndices];
    const firstBlankOptions = cloze.optionsPerBlank[0];
    // Nudge the first response to an incorrect option while leaving other blanks correct.
    selections[0] = (selections[0] + 1) % firstBlankOptions.length;

    const result = scoreLanguageItem(cloze, {
      itemId: cloze.id,
      type: 'cloze',
      selectedIndices: selections,
    });
    expect(result.correctness).toBeGreaterThan(0);
    expect(result.correctness).toBeLessThan(1);
    expect(result.feedback).toBe('Partial grammatical accuracy achieved.');
  });

  it('retains deterministic grading across the entire section', () => {
    const section = generateLanguageSection('grading-consistency');
    const perfectResponses: LanguageResponse[] = section.items.map((item) => {
      switch (item.type) {
        case 'spelling':
          return { itemId: item.id, type: 'spelling', selectedIndex: item.correctIndex };
        case 'cloze':
          return { itemId: item.id, type: 'cloze', selectedIndices: [...item.correctIndices] };
        case 'analogy':
          return { itemId: item.id, type: 'analogy', selectedIndex: item.correctIndex };
        case 'microwrite':
          return {
            itemId: item.id,
            type: 'microwrite',
            text: buildPerfectMicroResponse(item),
          };
        default:
          throw new Error('Unexpected language item type');
      }
    });

    const firstGrade = section.items.map((item, index) =>
      scoreLanguageItem(item, perfectResponses[index]),
    );
    const secondGrade = section.items.map((item, index) =>
      scoreLanguageItem(item, perfectResponses[index]),
    );

    expect(firstGrade).toStrictEqual(secondGrade);
    firstGrade.forEach((entry) => expect(entry.correctness).toBe(1));
  });
});

function buildPerfectMicroResponse(item: MicroWritingItem): string {
  const tokens = item.constraints.mustInclude;
  const scaffold = [
    `We audit ${tokens[0]} variance against ${tokens[1]} telemetry baselines`,
    `then document ${tokens[2]} compliance for council review`,
  ];
  return scaffold.join(', ') + '.';
}
