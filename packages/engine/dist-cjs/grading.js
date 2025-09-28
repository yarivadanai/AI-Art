"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateScores = aggregateScores;
exports.seedToColor = seedToColor;
function aggregateScores(inputs) {
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
function seedToColor(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
        hash |= 0;
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue} 70% 55%)`;
}
function clamp(value) {
    return Math.min(1, Math.max(0, value));
}
