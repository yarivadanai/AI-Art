import { generateLanguageSection, type LanguageSection } from './sections/language.js';
import { generateArithmeticSection, type ArithmeticSection } from './sections/arithmetic.js';
import { generateGridSection, type GridReasoningSection } from './sections/grid.js';
import { generatePerceptionSection, type PerceptionSection } from './sections/perception.js';
import { generateScienceSection, type ScienceSection } from './sections/science.js';
import { generateGenerativeSection, type GenerativeSection } from './sections/generative.js';

export interface TestPlan {
  sections: Array<
    | LanguageSection
    | ArithmeticSection
    | GridReasoningSection
    | PerceptionSection
    | ScienceSection
    | GenerativeSection
  >;
}

export interface GenerateTestPlanOptions {
  includeSections?: Array<'A' | 'B' | 'C' | 'D' | 'E' | 'F'>;
}

export function generateTestPlan(seed: string, options?: GenerateTestPlanOptions): TestPlan {
  const include = options?.includeSections ?? ['A', 'B', 'C', 'D', 'E', 'F'];
  const sections: Array<
    | LanguageSection
    | ArithmeticSection
    | GridReasoningSection
    | PerceptionSection
    | ScienceSection
    | GenerativeSection
  > = [];

  if (include.includes('A')) {
    sections.push(generateLanguageSection(seed));
  }
  if (include.includes('B')) {
    sections.push(generateArithmeticSection(seed));
  }
  if (include.includes('C')) {
    sections.push(generateGridSection(seed));
  }
  if (include.includes('D')) {
    sections.push(generatePerceptionSection(seed));
  }
  if (include.includes('E')) {
    sections.push(generateScienceSection(seed));
  }
  if (include.includes('F')) {
    sections.push(generateGenerativeSection(seed));
  }

  return { sections };
}

export type { LanguageSection } from './sections/language';
export type { ArithmeticSection } from './sections/arithmetic';
export type { GridReasoningSection } from './sections/grid';
export type { PerceptionSection } from './sections/perception';
export type { ScienceSection } from './sections/science';
export type { GenerativeSection } from './sections/generative';
