import { createSeededRng, type SeededRng } from '../rng/createRng.js';

export type ScienceItemType = 'fermi' | 'units' | 'causal';

export interface ScienceItem {
  id: string;
  type: ScienceItemType;
  prompt: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

export interface ScienceResponse {
  itemId: string;
  type: ScienceItemType;
  selectedIndex: number;
}

export interface ScienceSection {
  code: 'E';
  label: string;
  durationSeconds: number;
  description: string;
  items: ScienceItem[];
}

export interface ScienceSectionScore {
  overall: number;
  items: Array<{ itemId: string; correctness: number; feedback?: string }>;
}

export function generateScienceSection(seed: string): ScienceSection {
  const rng = createSeededRng(`science-${seed}`);
  const fermi = chooseMany(FERMI_BANK, 2, rng);
  const units = chooseMany(UNITS_BANK, 2, rng);
  const causal = chooseMany(CAUSAL_BANK, 2, rng);
  const templates = [...fermi, ...units, ...causal];
  const items = templates.map((template) => ({
    ...template,
    id: makeItemId(rng),
  }));

  return {
    code: 'E',
    label: 'Science & Quantitative Reasoning',
    durationSeconds: 150,
    description: 'Fermi estimates, dimensional analysis, and causal traps.',
    items,
  };
}

export function gradeScienceSection(
  section: ScienceSection,
  responses: ScienceResponse[],
): ScienceSectionScore {
  const responseMap = new Map(responses.map((entry) => [entry.itemId, entry]));
  const items = section.items.map((item) => {
    const response = responseMap.get(item.id);
    if (!response || response.type !== item.type) {
      return { itemId: item.id, correctness: 0, feedback: 'No answer submitted.' };
    }
    const correctness = response.selectedIndex === item.correctIndex ? 1 : 0;
    return {
      itemId: item.id,
      correctness,
      feedback: correctness ? 'Response within expected bounds.' : item.rationale,
    };
  });
  const overall = items.reduce((sum, entry) => sum + entry.correctness, 0) / items.length;
  return { overall, items };
}

interface ScienceTemplate extends Omit<ScienceItem, 'id'> {}

const FERMI_BANK: ScienceTemplate[] = [
  {
    type: 'fermi',
    prompt:
      'Order-of-magnitude: how many telemetry packets (8 KB each) do 2,400 sensors streaming at 32 Hz emit over a 10-minute diagnostic?',
    options: ['≈5×10⁵ packets', '≈5×10⁶ packets', '≈5×10⁷ packets', '≈5×10⁸ packets'],
    correctIndex: 2,
    rationale:
      '2,400 × 32 Hz × 600 s ≈ 4.6×10⁷ samples, so tens of millions of packets is the right scale.',
  },
  {
    type: 'fermi',
    prompt:
      'Approximate the kilowatt-hours consumed by a 1.2 MW data hall operating continuously for 48 hours.',
    options: ['≈6×10³ kWh', '≈6×10⁴ kWh', '≈6×10⁵ kWh', '≈6×10⁶ kWh'],
    correctIndex: 1,
    rationale: '1.2 MW = 1,200 kW; ×48 h ≈ 5.8×10⁴ kWh, i.e. tens of thousands.',
  },
  {
    type: 'fermi',
    prompt:
      'An RNA polymerase advances at 3×10⁻⁷ m/s. In 90 s, roughly how many bases (0.34 nm spacing) are transcribed?',
    options: ['≈8×10³ bases', '≈8×10⁴ bases', '≈8×10⁵ bases', '≈8×10⁶ bases'],
    correctIndex: 1,
    rationale:
      'Distance ≈ 2.7×10⁻⁵ m; dividing by 3.4×10⁻¹⁰ m/base gives ≈8×10⁴ bases.',
  },
];

const UNITS_BANK: ScienceTemplate[] = [
  {
    type: 'units',
    prompt: 'Which expression carries the dimensions of dynamic viscosity?',
    options: ['Pa·s', 'N·s', 'kg/m²', 'A·s'],
    correctIndex: 0,
    rationale: 'Dynamic viscosity η has SI units Pa·s (equivalently kg·m⁻¹·s⁻¹).',
  },
  {
    type: 'units',
    prompt: 'Select the combination matching inductance units.',
    options: ['V·s/A', 'A·s/V', 'V·A', 'C/s'],
    correctIndex: 0,
    rationale: 'Henries equal volt-seconds per ampere.',
  },
  {
    type: 'units',
    prompt: 'Which construction reduces to the SI base units of spectral radiance?',
    options: ['W·sr⁻¹·m⁻³', 'W·m⁻²', 'W·sr·m', 'J·m⁻³'],
    correctIndex: 0,
    rationale: 'Spectral radiance is power per steradian per unit area per unit wavelength: W·sr⁻¹·m⁻³.',
  },
];

const CAUSAL_BANK: ScienceTemplate[] = [
  {
    type: 'causal',
    prompt:
      'A/B test shows users who enable dark mode churn less, but enabling is optional. Which explanation best fits the data?',
    options: [
      'Dark mode directly lowers churn for everyone.',
      'Opting in signals conscientious users who churn less regardless.',
      'Reduced churn causes users to enable dark mode later.',
      'The effect is pure measurement noise.',
    ],
    correctIndex: 1,
    rationale: 'Self-selection introduces a confounder (user conscientiousness).',
  },
  {
    type: 'causal',
    prompt:
      'In a medical study, treatment and adverse outcome both depend on frailty. Conditioning on hospital admission reverses the treatment effect. What bias appeared?',
    options: [
      'Confounding by frailty.',
      'Collider bias from conditioning on admission.',
      'Simpson’s paradox due to subgrouping.',
      'Post-treatment bias from adjusting on the outcome.',
    ],
    correctIndex: 1,
    rationale: 'Admission is a collider influenced by treatment and frailty; conditioning induces spurious association.',
  },
  {
    type: 'causal',
    prompt:
      'Alert logs show engineers paging more often during high-traffic weeks, and incidents also spike. Which interpretation holds?',
    options: [
      'Paging causes incidents.',
      'Incidents cause paging.',
      'Traffic load drives both paging volume and incidents.',
      'Paging volume and incidents are causally unrelated.',
    ],
    correctIndex: 2,
    rationale: 'Traffic load is the latent driver of both variables.',
  },
];

function chooseMany<T>(arr: T[], count: number, rng: SeededRng): T[] {
  const pool = shuffle(arr, rng);
  return pool.slice(0, Math.min(count, pool.length));
}

function makeItemId(rng: SeededRng): string {
  return `E-${Math.floor(rng.float() * 36 ** 4)
    .toString(36)
    .padStart(4, '0')}`;
}

function shuffle<T>(items: T[], rng: SeededRng): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng.float() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
