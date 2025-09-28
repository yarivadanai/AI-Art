"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGridSection = generateGridSection;
exports.gradeGridSection = gradeGridSection;
const createRng_js_1 = require("../rng/createRng.js");
function generateGridSection(seed) {
    const rng = (0, createRng_js_1.createSeededRng)(`grid-${seed}`);
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
function gradeGridSection(section, responses) {
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
const RULES = [
    {
        name: 'Flip Horizontal',
        prompt: 'Deduce the transformation applied from input to output grids.',
        options: ['Flip horizontally', 'Rotate 90° clockwise', 'Invert colors', 'Translate right'],
        correctIndex: 0,
        explanation: 'The pattern mirrors across the vertical axis.',
        generator: (rng) => generatePairs(rng, flipHorizontal),
    },
    {
        name: 'Rotate Clockwise',
        prompt: 'Determine the mapping between input and output grids.',
        options: ['Rotate 90° clockwise', 'Flip vertically', 'Duplicate rows', 'Apply threshold'],
        correctIndex: 0,
        explanation: 'Each output rotates the input 90 degrees clockwise.',
        generator: (rng) => generatePairs(rng, rotateClockwise),
    },
    {
        name: 'Invert Binary',
        prompt: 'Identify the rule linking training grids to outputs.',
        options: [
            'Invert black/white',
            'Add diagonal stripe',
            'Shift rows upward',
            'Flatten to single row',
        ],
        correctIndex: 0,
        explanation: 'Binary colors swap (0 ↔ 1).',
        generator: (rng) => generatePairs(rng, invertBinary),
    },
    {
        name: 'Border Highlight',
        prompt: 'Infer the transformation applied to each grid.',
        options: ['Turn border cells on', 'Rotate 180°', 'Transpose grid', 'Erase corners'],
        correctIndex: 0,
        explanation: 'Every border cell is set to 1 regardless of interior.',
        generator: (rng) => generatePairs(rng, emphasizeBorder),
    },
    {
        name: 'Transpose',
        prompt: 'Identify the rule mapping each training grid to its output.',
        options: ['Transpose across main diagonal', 'Flip vertically', 'Invert colors', 'Rotate 270°'],
        correctIndex: 0,
        explanation: 'Rows become columns; output is the matrix transpose.',
        generator: (rng) => generatePairs(rng, transposeMatrix),
    },
    {
        name: 'Quadrant Highlight',
        prompt: 'Determine how the highlighted quadrant is selected.',
        options: [
            'Top-left quadrant emphasized',
            'Bottom-right quadrant erased',
            'Central cross activated',
            'Random noise added',
        ],
        correctIndex: 0,
        explanation: 'All cells in the top-left quadrant are set to 1, others preserved.',
        generator: (rng) => generatePairs(rng, highlightQuadrant),
    },
    {
        name: 'Diagonal Mirror',
        prompt: 'What rule produces the output grid from the input?',
        options: [
            'Reflect across main diagonal and merge',
            'Flip horizontally',
            'Shift columns cyclically',
            'Double the grid size',
        ],
        correctIndex: 0,
        explanation: 'Cells below the diagonal mirror the cells above it.',
        generator: (rng) => generatePairs(rng, mirrorDiagonal),
    },
];
function buildItem(rule, rng) {
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
function generatePairs(rng, transform) {
    return Array.from({ length: 2 }, () => {
        const grid = randomGrid(rng, 4, 6);
        return { input: grid, output: transform(grid) };
    });
}
function flipHorizontal(grid) {
    return grid.map((row) => [...row].reverse());
}
function rotateClockwise(grid) {
    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;
    const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));
    for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
            rotated[c][rows - 1 - r] = grid[r][c];
        }
    }
    return rotated;
}
function invertBinary(grid) {
    return grid.map((row) => row.map((cell) => (cell === 0 ? 1 : 0)));
}
function emphasizeBorder(grid) {
    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;
    const output = grid.map((row) => [...row]);
    for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
            if (r === 0 || c === 0 || r === rows - 1 || c === cols - 1) {
                output[r][c] = 1;
            }
        }
    }
    return output;
}
function transposeMatrix(grid) {
    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;
    const output = Array.from({ length: cols }, () => Array(rows).fill(0));
    for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
            output[c][r] = grid[r][c];
        }
    }
    return output;
}
function highlightQuadrant(grid) {
    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;
    const output = grid.map((row) => [...row]);
    const midRow = Math.ceil(rows / 2);
    const midCol = Math.ceil(cols / 2);
    for (let r = 0; r < midRow; r += 1) {
        for (let c = 0; c < midCol; c += 1) {
            output[r][c] = 1;
        }
    }
    return output;
}
function mirrorDiagonal(grid) {
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
function randomGrid(rng, minSize, maxSize) {
    const rows = randomInt(rng, minSize, maxSize);
    const cols = randomInt(rng, minSize, maxSize);
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => (rng.float() > 0.5 ? 1 : 0)));
}
function shuffle(items, rng) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rng.float() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
function makeItemId(rng) {
    return `C-${Math.floor(rng.float() * 36 ** 4)
        .toString(36)
        .padStart(4, '0')}`;
}
function randomInt(rng, min, max) {
    return Math.floor(rng.float() * (max - min + 1)) + min;
}
