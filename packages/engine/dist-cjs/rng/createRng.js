"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSeededRng = createSeededRng;
const UINT32_MAX = 0xffffffff;
function createSeededRng(seed) {
    let state = hashSeed(seed);
    const next = () => {
        // mulberry32 variant for reproducibility
        state += 0x6d2b79f5;
        let t = Math.imul(state ^ (state >>> 15), state | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / (UINT32_MAX + 1);
    };
    return {
        float: next,
        int: (max) => Math.floor(next() * max),
    };
}
function hashSeed(seed) {
    let h = 0x811c9dc5;
    for (let i = 0; i < seed.length; i += 1) {
        h ^= seed.charCodeAt(i);
        h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h;
}
