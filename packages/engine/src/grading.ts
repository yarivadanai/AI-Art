export interface SectionScoreInput {
  code: string;
  correctness: number;
}

export interface AggregatedScore {
  overall: number;
  sections: Array<{ code: string; score: number }>;
}

export function aggregateScores(inputs: SectionScoreInput[]): AggregatedScore {
  if (!inputs.length) {
    return { overall: 0, sections: [] };
  }

  const sections = inputs.map((input) => ({
    code: input.code,
    score: clamp(input.correctness),
  }));
  const overall = sections.reduce((sum, item) => sum + item.score, 0) / sections.length;
  return { overall, sections };
}

export function seedToColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 70% 55%)`;
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}
