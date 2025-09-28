"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTestPlan = generateTestPlan;
const language_js_1 = require("./sections/language.js");
const arithmetic_js_1 = require("./sections/arithmetic.js");
const grid_js_1 = require("./sections/grid.js");
const perception_js_1 = require("./sections/perception.js");
const science_js_1 = require("./sections/science.js");
const generative_js_1 = require("./sections/generative.js");
function generateTestPlan(seed, options) {
    const include = options?.includeSections ?? ['A', 'B', 'C', 'D', 'E', 'F'];
    const sections = [];
    if (include.includes('A')) {
        sections.push((0, language_js_1.generateLanguageSection)(seed));
    }
    if (include.includes('B')) {
        sections.push((0, arithmetic_js_1.generateArithmeticSection)(seed));
    }
    if (include.includes('C')) {
        sections.push((0, grid_js_1.generateGridSection)(seed));
    }
    if (include.includes('D')) {
        sections.push((0, perception_js_1.generatePerceptionSection)(seed));
    }
    if (include.includes('E')) {
        sections.push((0, science_js_1.generateScienceSection)(seed));
    }
    if (include.includes('F')) {
        sections.push((0, generative_js_1.generateGenerativeSection)(seed));
    }
    return { sections };
}
