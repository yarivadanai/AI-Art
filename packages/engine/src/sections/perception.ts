import { createSeededRng, type SeededRng } from '../rng/createRng.js';

export interface PerceptionItem {
  id: string;
  type: 'perception';
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

export interface PerceptionResponse {
  itemId: string;
  type: 'perception';
  selectedIndex: number;
}

export interface PerceptionSection {
  code: 'D';
  label: string;
  durationSeconds: number;
  description: string;
  items: PerceptionItem[];
}

export interface PerceptionSectionScore {
  overall: number;
  items: Array<{ itemId: string; correctness: number; feedback?: string }>;
}

export function generatePerceptionSection(seed: string): PerceptionSection {
  const rng = createSeededRng(`perception-${seed}`);
  const builders = shuffle(SCENARIO_BUILDERS, rng).slice(0, 5);
  const items = builders.map((builder) => {
    const scenario = builder(rng);
    return {
      id: makeItemId(rng),
      type: 'perception' as const,
      scenario: scenario.scene,
      question: scenario.question,
      options: scenario.options,
      correctIndex: scenario.correctIndex,
      rationale: scenario.rationale,
    };
  });

  return {
    code: 'D',
    label: 'Perception & Memory',
    durationSeconds: 150,
    description: 'Recall high-entropy visual details from compressed descriptions.',
    items,
  };
}

export function gradePerceptionSection(
  section: PerceptionSection,
  responses: PerceptionResponse[],
): PerceptionSectionScore {
  const responseMap = new Map(responses.map((entry) => [entry.itemId, entry]));
  const items = section.items.map((item) => {
    const response = responseMap.get(item.id);
    if (!response || response.type !== 'perception') {
      return { itemId: item.id, correctness: 0, feedback: 'No answer provided.' };
    }
    const correctness = response.selectedIndex === item.correctIndex ? 1 : 0;
    return {
      itemId: item.id,
      correctness,
      feedback: correctness ? 'Detail recalled precisely.' : item.rationale,
    };
  });
  const overall = items.reduce((sum, entry) => sum + entry.correctness, 0) / items.length;
  return { overall, items };
}

interface Scenario {
  scene: string;
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

type ScenarioBuilder = (rng: SeededRng) => Scenario;

const SCENARIO_BUILDERS: ScenarioBuilder[] = [
  buildPulseScenario,
  buildDroneScenario,
  buildGlyphScenario,
  buildThermalScenario,
  buildMatrixGlitchScenario,
  buildChannelScenario,
];

function shuffle<T>(items: T[], rng: SeededRng): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng.float() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makeItemId(rng: SeededRng): string {
  return `D-${Math.floor(rng.float() * 36 ** 4)
    .toString(36)
    .padStart(4, '0')}`;
}

function randomChoice<T>(rng: SeededRng, source: T[]): T {
  return source[rng.int(source.length)];
}

function ordinalWord(index: number): string {
  const words = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'];
  return words[index] ?? `${index + 1}th`;
}

function formatCoordinate(row: number, col: number): string {
  return `(${row + 1},${col + 1})`;
}

function buildOptions(rng: SeededRng, correct: string, distractors: string[]): {
  options: string[];
  correctIndex: number;
} {
  const pool = shuffle([correct, ...distractors], rng);
  return { options: pool, correctIndex: pool.indexOf(correct) };
}

function buildPulseScenario(rng: SeededRng): Scenario {
  const colors = shuffle(
    ['amber', 'cobalt', 'cerise', 'chartreuse', 'ultramarine', 'vermillion', 'saffron'],
    rng,
  );
  const amplitudes = shuffle(['0.6 kPa', '0.8 kPa', '1.1 kPa', '1.4 kPa', '1.7 kPa', '2.1 kPa'], rng);
  const count = 5 + rng.int(2);
  const pulses = Array.from({ length: count }, (_, index) => ({
    label: `τ${index + 1}`,
    color: colors[index % colors.length],
    magnitude: amplitudes[index % amplitudes.length],
  }));
  const toneIndex = rng.int(pulses.length);
  const tonePulse = pulses[toneIndex];
  const sequence = pulses
    .map((pulse) => `${pulse.label} ${pulse.color} (${pulse.magnitude})`)
    .join(', ');

  const distractors = shuffle(
    pulses
      .filter((_, idx) => idx !== toneIndex)
      .map((pulse) => `${pulse.label} • ${pulse.color}`),
    rng,
  ).slice(0, 3);
  const correctLabel = `${tonePulse.label} • ${tonePulse.color}`;
  const { options, correctIndex } = buildOptions(rng, correctLabel, distractors);

  return {
    scene: `A telemetry ribbon streams ${pulses.length} pulses labelled τ1–τ${pulses.length}: ${sequence}. Only one pulse crosses the Authority sync threshold, emitting the distinctive chime at ${tonePulse.magnitude}.`,
    question: 'Which pulse triggered the sync tone?',
    options,
    correctIndex,
    rationale: `${tonePulse.label} (${tonePulse.color}) alone exceeded the sync threshold, as narrated in the sequence description.`,
  };
}

function buildDroneScenario(rng: SeededRng): Scenario {
  const directions = shuffle(['north', 'east', 'south', 'west'], rng);
  const beacons = shuffle(['amber beacon', 'violet strobe', 'infrared wash', 'cobalt bar'], rng);
  const behaviours = shuffle(
    ['holds altitude', 'yaws 12° left', 'drops 3 m then recovers', 'runs a diagnostic spin'],
    rng,
  );
  const anomalyIndex = rng.int(directions.length);
  const anomalyDirection = directions[anomalyIndex];

  const sceneLines = directions.map(
    (direction, idx) =>
      `${direction.charAt(0).toUpperCase() + direction.slice(1)} drone flashes the ${beacons[idx]} and ${behaviours[idx]}.`,
  );

  const correctLabel = `${anomalyDirection.toUpperCase()} • ${beacons[anomalyIndex]}`;
  const distractors = directions
    .map((direction, idx) => ({ direction, idx }))
    .filter(({ idx }) => idx !== anomalyIndex)
    .slice(0, 3)
    .map(({ direction, idx }) => `${direction.toUpperCase()} • ${beacons[idx]}`);
  const { options, correctIndex } = buildOptions(rng, correctLabel, distractors);

  return {
    scene: `Four drones hold a square surveillance stack. ${sceneLines.join(' ')} The Authority operator flags the drone that initiated the emergency yaw routine.`,
    question: 'Which drone executed the emergency yaw?',
    options,
    correctIndex,
    rationale: `The ${anomalyDirection} drone alone performed the emergency yaw, described alongside its ${beacons[anomalyIndex]}.`,
  };
}

function buildGlyphScenario(rng: SeededRng): Scenario {
  const glyphs = shuffle(['triangle', 'rhombus', 'pentagon', 'spiral', 'hexagon', 'hourglass'], rng);
  const accents = shuffle(['glowing', 'outlined', 'shadowed', 'striped', 'blinking', 'translucent'], rng);
  const sequenceLength = 6;
  const sequence = Array.from({ length: sequenceLength }, (_, idx) => ({
    glyph: glyphs[idx % glyphs.length],
    accent: accents[idx % accents.length],
  }));
  const removedIndex = rng.int(sequence.length);
  const removed = sequence[removedIndex];
  const stream = sequence
    .map((entry, idx) => `${ordinalWord(idx)} glyph ${entry.accent} ${entry.glyph}`)
    .join('; ');

  const correctLabel = `${ordinalWord(removedIndex)} • ${removed.accent} ${removed.glyph}`;
  const distractors = shuffle(
    sequence
      .map((entry, idx) => ({ entry, idx }))
      .filter(({ idx }) => idx !== removedIndex)
      .map(({ entry, idx }) => `${ordinalWord(idx)} • ${entry.accent} ${entry.glyph}`),
    rng,
  ).slice(0, 3);
  const { options, correctIndex } = buildOptions(rng, correctLabel, distractors);

  return {
    scene: `A glyph carousel flashes six symbols in 400 ms sweeps: ${stream}. The third sweep removes one glyph altogether before the loop restarts.`,
    question: 'Which glyph vanished during the sweep?',
    options,
    correctIndex,
    rationale: `The narrative explicitly states the removed glyph as the ${removed.accent} ${removed.glyph} appearing in the ${ordinalWord(removedIndex)} slot.`,
  };
}

function buildThermalScenario(rng: SeededRng): Scenario {
  const pathLength = 5 + rng.int(2);
  let row = rng.int(2);
  let col = rng.int(2);
  const path: Array<{ row: number; col: number }> = [];
  for (let step = 0; step < pathLength; step += 1) {
    if (step === 0) {
    } else {
      if (rng.int(2) === 0) {
        row += 1;
      } else {
        col += 1;
      }
    }
    path.push({ row, col });
  }
  const triggerIndex = path.length - 1;
  const triggerCoord = path[triggerIndex];
  const pathNarrative = path
    .map((coord, idx) => `${idx === triggerIndex ? 'cooling fan engage at ' : ''}${formatCoordinate(coord.row, coord.col)}`)
    .join(' → ');

  const coordinateLabels = path.map((coord, idx) =>
    `${idx === triggerIndex ? 'Vent' : 'Footstep'} • ${formatCoordinate(coord.row, coord.col)}`,
  );
  const distractors = shuffle(
    coordinateLabels.filter((_, idx) => idx !== triggerIndex),
    rng,
  ).slice(0, 3);
  const correctLabel = coordinateLabels[triggerIndex];
  const { options, correctIndex } = buildOptions(rng, correctLabel, distractors);

  return {
    scene: `Thermal residue footprints are logged as the specimen crosses the deck: ${pathNarrative}. Authority ventilation activates precisely when the final hot print lands.`,
    question: 'At which coordinate did the fan activate?',
    options,
    correctIndex,
    rationale: `The cooling event is tied to the last logged coordinate ${correctLabel}.`,
  };
}

function buildMatrixGlitchScenario(rng: SeededRng): Scenario {
  const dimension = 4;
  const malfunctionRow = rng.int(dimension);
  const malfunctionCol = rng.int(dimension);
  const cycles = shuffle(['all-on', 'alternating', 'checkerboard', 'columnar pulse'], rng);
  const malfunctionCoordinate = formatCoordinate(malfunctionRow, malfunctionCol);
  const scene = `A ${dimension}×${dimension} light matrix cycles ${cycles.join(' → ')} before one diode hard-fails. During cycle five the diode at ${malfunctionCoordinate} drops to zero while the rest continue their programmed states.`;

  const coordinates: string[] = [];
  while (coordinates.length < 3) {
    const candidateRow = rng.int(dimension);
    const candidateCol = rng.int(dimension);
    const label = `Diode • ${formatCoordinate(candidateRow, candidateCol)}`;
    if (label !== `Diode • ${malfunctionCoordinate}` && !coordinates.includes(label)) {
      coordinates.push(label);
    }
  }

  const correctLabel = `Diode • ${malfunctionCoordinate}`;
  const { options, correctIndex } = buildOptions(rng, correctLabel, coordinates);

  return {
    scene,
    question: 'Which diode failed during the glitch cycle?',
    options,
    correctIndex,
    rationale: `Cycle narration names ${correctLabel} as the diode that collapsed to zero.`,
  };
}

function buildChannelScenario(rng: SeededRng): Scenario {
  const channels = shuffle(['Alpha', 'Beta', 'Gamma', 'Delta'], rng);
  const deviations = shuffle(['+4.2σ', '+1.3σ', '-0.9σ', '+2.1σ'], rng);
  const noiseFloors = shuffle(['-64 dB', '-68 dB', '-59 dB', '-71 dB'], rng);
  const spikeIndex = rng.int(channels.length);
  const spikeChannel = channels[spikeIndex];
  const log = channels
    .map(
      (channel, idx) => `${channel} channel idled at ${noiseFloors[idx]} then drifted ${deviations[idx]}.`,
    )
    .join(' ');

  const correctLabel = `${spikeChannel} • ${deviations[spikeIndex]}`;
  const distractors = shuffle(
    channels
      .map((channel, idx) => ({ channel, idx }))
      .filter(({ idx }) => idx !== spikeIndex)
      .map(({ channel, idx }) => `${channel} • ${deviations[idx]}`),
    rng,
  ).slice(0, 3);
  const { options, correctIndex } = buildOptions(rng, correctLabel, distractors);

  return {
    scene: `Console log: ${log} Authority overlay arrows the channel breaching the escalation threshold.`,
    question: 'Which channel breached the escalation threshold?',
    options,
    correctIndex,
    rationale: `${spikeChannel} reported the standout deviation ${deviations[spikeIndex]}, triggering the overlay.`,
  };
}
