"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateArithmeticSection = generateArithmeticSection;
exports.gradeArithmeticSection = gradeArithmeticSection;
exports.scoreArithmeticItem = scoreArithmeticItem;
const createRng_js_1 = require("../rng/createRng.js");
function generateArithmeticSection(seed) {
    const rng = (0, createRng_js_1.createSeededRng)(`arith-${seed}`);
    const items = [
        buildDecimalMix(rng),
        buildCarryTrap(rng),
        buildOrderExpression(rng),
        buildFractionToDecimal(rng),
        buildPercentage(rng),
        buildMixedOperation(rng),
        buildPowerRoot(rng),
        buildRounding(rng),
    ];
    return {
        code: 'B',
        label: 'Arithmetic Reliability',
        durationSeconds: 150,
        description: 'Exact arithmetic under time pressure. Focus on carries, multi-step order, and precise rounding.',
        items,
    };
}
function gradeArithmeticSection(section, responses) {
    const responseMap = new Map(responses.map((entry) => [entry.itemId, entry]));
    const results = section.items.map((item) => {
        const response = responseMap.get(item.id);
        const result = scoreArithmeticItem(item, response);
        return result;
    });
    const overall = results.reduce((sum, entry) => sum + entry.correctness, 0) / results.length;
    return { overall, items: results };
}
function scoreArithmeticItem(item, response) {
    if (!response || response.type !== 'arith' || !response.answer.trim()) {
        return {
            itemId: item.id,
            expected: item.expected,
            correctness: 0,
            feedback: 'No answer submitted.',
        };
    }
    const parsedAnswer = sanitiseNumber(response.answer);
    const parsedExpected = sanitiseNumber(item.expected);
    const tolerance = item.tolerance ?? 0;
    const difference = Math.abs(parsedAnswer - parsedExpected);
    const correctness = difference <= tolerance ? 1 : Math.max(0, 1 - difference / Math.max(1, parsedExpected));
    return {
        itemId: item.id,
        expected: item.expected,
        correctness: correctness >= 0.999 ? 1 : Math.max(0, Math.min(1, correctness)),
        delta: difference,
        feedback: difference <= tolerance
            ? 'Exact match achieved.'
            : `Expected ${item.expected}; difference of ${difference.toExponential(2)} exceeds tolerance ${tolerance}.`,
    };
}
// -- generators ------------------------------------------------------------
function buildDecimalMix(rng) {
    const a = randomFloat(rng, 10, 99, 1);
    const b = randomFloat(rng, 1, 9, 2);
    const expression = `${a} + ${b}`;
    const expected = (a + b).toFixed(2);
    return makeItem(rng, expression, expected, 'Add decimal quantities to two places of precision.', 0.005);
}
function buildCarryTrap(rng) {
    const a = randomInt(rng, 4000, 9999);
    const b = randomInt(rng, 4000, 9999);
    const expression = `${a} - ${b}`;
    const expected = (a - b).toString();
    return makeItem(rng, expression, expected, 'Subtraction with cascading borrows is measured for error-free carry handling.');
}
function buildOrderExpression(rng) {
    const a = randomInt(rng, 2, 9);
    const b = randomInt(rng, 3, 7);
    const c = randomInt(rng, 4, 12);
    const expression = `${a} * (${b} + ${c}) - ${b}`;
    const expected = a * (b + c) - b;
    return makeItem(rng, expression, expected.toString(), 'Order of operations with grouping.', 0);
}
function buildFractionToDecimal(rng) {
    const denominator = pick([4, 5, 8, 25, 125], rng);
    const numerator = randomInt(rng, 1, denominator - 1);
    const expression = `${numerator}/${denominator}`;
    const expected = (numerator / denominator).toFixed(5);
    return makeItem(rng, expression, expected, 'Convert fraction to decimal; five-decimal precision required.', 0.00001);
}
function buildPercentage(rng) {
    const base = randomInt(rng, 120, 980);
    const percent = pick([7.5, 12.5, 17.5, 22.5], rng);
    const expression = `${percent}% of ${base}`;
    const expected = ((percent / 100) * base).toFixed(2);
    return makeItem(rng, expression, expected, 'Percentage of a base quantity; two decimal rounding enforced.', 0.01);
}
function buildMixedOperation(rng) {
    const a = randomInt(rng, 12, 48);
    const b = randomInt(rng, 2, 9);
    const c = randomInt(rng, 3, 11);
    const expression = `${a} / ${b} + ${c}`;
    const expected = (a / b + c).toFixed(4);
    return makeItem(rng, expression, expected, 'Division followed by addition, requiring fourth-decimal accuracy.', 0.0005);
}
function buildPowerRoot(rng) {
    const base = pick([2, 3, 5, 7], rng);
    const power = randomInt(rng, 2, 4);
    const expression = `${base}^${power} + sqrt(${base * base * 4})`;
    const expected = Math.pow(base, power) + Math.sqrt(base * base * 4);
    return makeItem(rng, expression, expected.toFixed(3), 'Combines exponentiation with a square root.', 0.001);
}
function buildRounding(rng) {
    const value = randomFloat(rng, 100, 999, 3);
    const expression = `Round ${value} to nearest 0.1`;
    const expected = (Math.round(value * 10) / 10).toFixed(1);
    return makeItem(rng, expression, expected, 'Round to nearest tenth.', 0.0001);
}
function makeItem(rng, expression, expected, rationale, tolerance = 0) {
    return {
        id: makeItemId('B', rng),
        type: 'arith',
        prompt: `Evaluate ${expression}`,
        expression,
        expected,
        tolerance,
        rationale,
    };
}
function makeItemId(prefix, rng) {
    const fragment = Math.floor(rng.float() * 36 ** 4)
        .toString(36)
        .padStart(4, '0');
    return `${prefix}-${fragment}`;
}
function randomInt(rng, min, max) {
    return Math.floor(rng.float() * (max - min + 1)) + min;
}
function randomFloat(rng, min, max, decimals) {
    const factor = 10 ** decimals;
    return Math.round((rng.float() * (max - min) + min) * factor) / factor;
}
function pick(options, rng) {
    return options[randomInt(rng, 0, options.length - 1)];
}
function sanitiseNumber(input) {
    const cleaned = input
        .trim()
        .replace(/%$/, '')
        .replace(/[^0-9.+-]/g, '');
    const value = Number(cleaned);
    if (Number.isNaN(value)) {
        return Number.POSITIVE_INFINITY;
    }
    return value;
}
