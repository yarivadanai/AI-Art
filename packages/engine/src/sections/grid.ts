import { createSeededRng, type SeededRng } from '../rng/createRng.js';

export interface GridExample {
  input: number[][];
  output: number[][];
}

export interface GridReasoningItem {
  id: string;
  type: 'grid';
  prompt: string;
  train: GridExample[];
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GridReasoningResponse {
  itemId: string;
  type: 'grid';
  selectedIndex: number;
}

export interface GridReasoningSection {
  code: 'C';
  label: string;
  durationSeconds: number;
  description: string;
  items: GridReasoningItem[];
}

export interface GridReasoningResult {
  overall: number;
  items: Array<{ itemId: string; correctness: number; feedback?: string }>;
}

export function generateGridSection(seed: string): GridReasoningSection {
  const rng = createSeededRng(`grid-${seed}`);
  const rules = shuffle(RULES, rng).slice(0, 6);
  const items = rules.map((rule) => buildItem(rule, rng));

  return {
    code: 'C',
    label: 'Abstraction & Reasoning',
    durationSeconds: 150,
    description: 'Infer transformation rules from sparse grid examples.',
    items,
  };
}

export function gradeGridSection(
  section: GridReasoningSection,
  responses: GridReasoningResponse[],
): GridReasoningResult {
  const responseMap = new Map(responses.map((entry) => [entry.itemId, entry]));
  const items = section.items.map((item) => {
    const response = responseMap.get(item.id);
    if (!response || response.type !== 'grid') {
      return { itemId: item.id, correctness: 0, feedback: 'No rule selected.' };
    }
    const correctness = response.selectedIndex === item.correctIndex ? 1 : 0;
    return {
      itemId: item.id,
      correctness,
      feedback: correctness ? 'Transformation identified.' : 'Rule mismatch.',
    };
  });
  const overall = items.reduce((sum, entry) => sum + entry.correctness, 0) / items.length;
  return { overall, items };
}

// -- helpers ---------------------------------------------------------------

interface RuleDefinition {
  name: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  generator: (rng: SeededRng) => GridExample[];
}

const RULES: RuleDefinition[] = [
  {
    name: 'Rotate-Invert-Cross',
    prompt: 'Deduce the precise multi-step mapping between each input grid and its output.',
    options: [
      'Rotate 180° → invert binary values → force the central cross to 1s',
      'Transpose → zero the border → invert binary values',
      'Flip horizontally → rotate 90° → mirror across the diagonal',
      'Rotate 90° clockwise → write a checkerboard overlay → keep the cross off',
    ],
    correctIndex: 0,
    explanation: 'Each output rotates the grid 180°, inverts 0/1, then activates the middle row and column.',
    generator: (rng) => generatePairs(rng, rotateInvertCross),
  },
  {
    name: 'Transpose-Checkerboard Fuse',
    prompt: 'Identify the composed transformation applied to the training grids.',
    options: [
      'Transpose the matrix → overlay 1s on even-parity (r+c) cells',
      'Rotate 270° → overlay a central cross of 1s',
      'Flip vertically → zero every odd column',
      'Transpose → replace the densest quadrant with zeros',
    ],
    correctIndex: 0,
    explanation: 'Outputs are transposes of the inputs with a parity mask forcing even (r+c) cells to 1.',
    generator: (rng) => generatePairs(rng, transposeCheckerOverlay),
  },
  {
    name: 'Mirror & Dominant Quadrant',
    prompt: 'Resolve how the transformation emphasises only one quadrant.',
    options: [
      'Mirror across the main diagonal → promote the quadrant with the most 1s to solid 1s, others to 0s',
      'Transpose → delete the sparsest quadrant',
      'Rotate 90° → invert rows with more 1s than 0s',
      'Mirror across the anti-diagonal → copy top-right into all quadrants',
    ],
    correctIndex: 0,
    explanation: 'The grid becomes diagonal-symmetric, then the quadrant containing the most 1s is saturated while others clear.',
    generator: (rng) => generatePairs(rng, mirrorAndHighlightDominantQuadrant),
  },
  {
    name: 'Flip-Mirror Zero Border',
    prompt: 'Infer the chained operations that leave only interior structure.',
    options: [
      'Flip horizontally → mirror across diagonal → set every border cell to 0',
      'Rotate 180° → invert binary → erase the centre cross',
      'Flip vertically → rotate 90° → set border cells to 1',
      'Transpose → duplicate the top row to every row',
    ],
    correctIndex: 0,
    explanation: 'Outputs result from a horizontal flip, diagonal mirroring, then zeroing the perimeter.',
    generator: (rng) => generatePairs(rng, flipMirrorZeroBorder),
  },
  {
    name: 'Parity Collapse',
    prompt: 'Work out how entire rows become uniform in the outputs.',
    options: [
      'Measure row parity → write full 1s for odd rows → full 0s for even rows',
      'Rows with majority zeros copy the row above',
      'Every second row mirrors the main diagonal',
      'Rotate 90° → erase rows with even indices',
    ],
    correctIndex: 0,
    explanation: 'Row parity is measured and collapsed: odd-parity rows become all 1s, even-parity rows become all 0s.',
    generator: (rng) => generatePairs(rng, rowParityCollapse),
  },
  {
    name: 'Rotate & Stagger',
    prompt: 'Disentangle the rotation and shifting operations visible in the examples.',
    options: [
      'Rotate 90° clockwise → shift rows downward cyclically by one → zero the new top row',
      'Rotate 270° → shift columns right by two → fill voids with 1s',
      'Flip vertically → shift rows upward by index count',
      'Transpose → append a zero row at the bottom',
    ],
    correctIndex: 0,
    explanation: 'Each output is a clockwise rotation, followed by a single-step downward cyclic shift with the promoted top row cleared.',
    generator: (rng) => generatePairs(rng, rotateShiftZeroTop),
  },
];

function buildItem(rule: RuleDefinition, rng: SeededRng): GridReasoningItem {
  return {
    id: makeItemId(rng),
    type: 'grid',
    prompt: rule.prompt,
    train: rule.generator(rng),
    options: rule.options,
    correctIndex: rule.correctIndex,
    explanation: rule.explanation,
  };
}

function generatePairs(rng: SeededRng, transform: (grid: number[][]) => number[][]): GridExample[] {
  return Array.from({ length: 3 }, () => {
    const grid = randomGrid(rng, 4, 6);
    return { input: grid, output: transform(grid) };
  });
}

function rotateClockwise(grid: number[][]): number[][] {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const rotated: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      rotated[c][rows - 1 - r] = grid[r][c];
    }
  }
  return rotated;
}

function transposeMatrix(grid: number[][]): number[][] {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const output: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      output[c][r] = grid[r][c];
    }
  }
  return output;
}

function flipHorizontal(grid: number[][]): number[][] {
  return grid.map((row) => [...row].reverse());
}

function invertBinary(grid: number[][]): number[][] {
  return grid.map((row) => row.map((cell) => (cell === 0 ? 1 : 0)));
}

function rotate180(grid: number[][]): number[][] {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const output: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      output[rows - 1 - r][cols - 1 - c] = grid[r][c];
    }
  }
  return output;
}

function activateCentralCross(grid: number[][]): number[][] {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const output = grid.map((row) => [...row]);
  const midRow = Math.floor(rows / 2);
  const midCol = Math.floor(cols / 2);
  for (let c = 0; c < cols; c += 1) {
    output[midRow][c] = 1;
  }
  for (let r = 0; r < rows; r += 1) {
    output[r][midCol] = 1;
  }
  return output;
}

function rotateInvertCross(grid: number[][]): number[][] {
  return activateCentralCross(invertBinary(rotate180(grid)));
}

function transposeCheckerOverlay(grid: number[][]): number[][] {
  const transposed = transposeMatrix(grid);
  const rows = transposed.length;
  const cols = transposed[0]?.length ?? 0;
  return transposed.map((row, r) =>
    row.map((cell, c) => (cell === 1 ? 1 : ((r + c) % 2 === 0 ? 1 : 0))),
  );
}

function mirrorDiagonal(grid: number[][]): number[][] {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const output = grid.map((row) => [...row]);
  const limit = Math.min(rows, cols);
  for (let r = 0; r < limit; r += 1) {
    for (let c = r + 1; c < limit; c += 1) {
      output[c][r] = grid[r][c];
    }
  }
  return output;
}

function mirrorAndHighlightDominantQuadrant(grid: number[][]): number[][] {
  const mirrored = mirrorDiagonal(grid);
  const rows = mirrored.length;
  const cols = mirrored[0]?.length ?? 0;
  const midRow = Math.floor(rows / 2);
  const midCol = Math.floor(cols / 2);
  const quadrantSums = [0, 0, 0, 0];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const quadrant = (r < midRow ? 0 : 2) + (c < midCol ? 0 : 1);
      quadrantSums[quadrant] += mirrored[r][c];
    }
  }
  const dominantIndex = quadrantSums.indexOf(Math.max(...quadrantSums));
  const output = mirrored.map((row) => [...row]);
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const quadrant = (r < midRow ? 0 : 2) + (c < midCol ? 0 : 1);
      output[r][c] = quadrant === dominantIndex ? 1 : 0;
    }
  }
  return output;
}

function zeroBorder(grid: number[][]): number[][] {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const output = grid.map((row) => [...row]);
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (r === 0 || c === 0 || r === rows - 1 || c === cols - 1) {
        output[r][c] = 0;
      }
    }
  }
  return output;
}

function flipMirrorZeroBorder(grid: number[][]): number[][] {
  return zeroBorder(mirrorDiagonal(flipHorizontal(grid)));
}

function rowParityCollapse(grid: number[][]): number[][] {
  return grid.map((row) => {
    const ones = row.reduce((sum, cell) => sum + cell, 0);
    const value = ones % 2 === 1 ? 1 : 0;
    return Array.from({ length: row.length }, () => value);
  });
}

function rotateShiftZeroTop(grid: number[][]): number[][] {
  const rotated = rotateClockwise(grid);
  const rows = rotated.length;
  if (rows === 0) return rotated;
  const cols = rotated[0]?.length ?? 0;
  const shifted = Array.from({ length: rows }, (_, index) => {
    const sourceRow = (index + rows - 1) % rows;
    return [...rotated[sourceRow]];
  });
  for (let c = 0; c < cols; c += 1) {
    shifted[0][c] = 0;
  }
  return shifted;
}

function randomGrid(rng: SeededRng, minSize: number, maxSize: number): number[][] {
  const rows = randomInt(rng, minSize, maxSize);
  const cols = randomInt(rng, minSize, maxSize);
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (rng.float() > 0.5 ? 1 : 0)),
  );
}

function shuffle<T>(items: T[], rng: SeededRng): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng.float() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makeItemId(rng: SeededRng): string {
  return `C-${Math.floor(rng.float() * 36 ** 4)
    .toString(36)
    .padStart(4, '0')}`;
}

function randomInt(rng: SeededRng, min: number, max: number): number {
  return Math.floor(rng.float() * (max - min + 1)) + min;
}
