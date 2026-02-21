import rawDataset from '@/lib/data/scca_master_dataset.json';
import type { Section, InputType, Normalization } from '@/lib/types';

export interface DatasetQuestion {
  id: string;
  section: Section;
  subtype: string;
  tier: 1 | 2 | 3;
  prompt: string;
  display: string | null;
  inputType: InputType;
  options: string[] | null;
  clientSeed: number | null;
  interactiveConfig: { type: string; params: Record<string, unknown>; durationMs: number } | null;
  answerHash: string;
  normalization: Normalization;
  decimalPlaces: number | null;
  timeLimit: number;
  _verifiedAnswer: string;
}

const dataset = rawDataset as DatasetQuestion[];

export function getBank(section: Section): DatasetQuestion[] {
  return dataset.filter(q => q.section === section);
}

export const DATASET = dataset;
