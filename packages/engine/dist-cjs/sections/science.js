"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateScienceSection = generateScienceSection;
exports.gradeScienceSection = gradeScienceSection;
const createRng_js_1 = require("../rng/createRng.js");
function generateScienceSection(seed) {
    const rng = (0, createRng_js_1.createSeededRng)(`science-${seed}`);
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
function gradeScienceSection(section, responses) {
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
const FERMI_BANK = [
    {
        type: 'fermi',
        prompt: 'Estimate the number of piano tunings in a 5 million resident city per year.',
        options: ['~5,000', '~50,000', '~500,000', '~5,000,000'],
        correctIndex: 1,
        rationale: 'Reasonable order of magnitude is tens of thousands given households and maintenance cycle.',
    },
    {
        type: 'fermi',
        prompt: 'Approximate the number of liters of air an adult breathes in a day.',
        options: ['~10 L', '~100 L', '~10,000 L', '~100,000 L'],
        correctIndex: 2,
        rationale: 'Roughly 10,000 liters (20,000 breaths × 0.5 L).',
    },
    {
        type: 'fermi',
        prompt: 'Order of magnitude estimate: how many cups of coffee are sold daily in a 40-floor office tower?',
        options: ['~200', '~2,000', '~20,000', '~200,000'],
        correctIndex: 1,
        rationale: 'Assume ~2000 workers with ~1 drink/day; thousands not tens of thousands.',
    },
];
const UNITS_BANK = [
    {
        type: 'units',
        prompt: 'Select the quantity with units of acceleration.',
        options: ['m/s', 'N/kg', 'J/s', 'kg·m'],
        correctIndex: 1,
        rationale: 'Newton per kilogram reduces to m/s².',
    },
    {
        type: 'units',
        prompt: 'Which expression has units of electrical resistance?',
        options: ['V/A', 'A·V', 'V·C', 'A²'],
        correctIndex: 0,
        rationale: 'Ohms equal volts per ampere.',
    },
    {
        type: 'units',
        prompt: 'Identify the SI base units represented by torque.',
        options: ['kg·m/s²', 'kg·m²/s²', 'kg·m/s', 'kg/s²'],
        correctIndex: 1,
        rationale: 'Torque equals newton-meters, or kg·m²/s².',
    },
];
const CAUSAL_BANK = [
    {
        type: 'causal',
        prompt: 'Increasing study time correlates with higher test scores. Which interpretation is most valid?',
        options: [
            'Studying more causes higher scores.',
            'High scores cause more studying.',
            'External diligence leads to both studying and higher scores.',
            'Scores and studying are unrelated but coincidental.',
        ],
        correctIndex: 2,
        rationale: 'Confounder (diligence) explains both; correlation alone not causal.',
    },
    {
        type: 'causal',
        prompt: 'A factory adds warning lights and reports fewer accidents. What conclusion is safest?',
        options: [
            'Warning lights caused the reduction.',
            'The reduction might reflect broader safety changes alongside lights.',
            'Accidents drop randomly regardless of lights.',
            'Workers manipulated results to look safer.',
        ],
        correctIndex: 1,
        rationale: 'Lights correlate, but other interventions or regression may contribute.',
    },
    {
        type: 'causal',
        prompt: 'Data show that people carrying umbrellas have higher accident rates. Best interpretation?',
        options: [
            'Umbrellas cause accidents.',
            'Accident risk causes umbrella use.',
            'Rainy conditions lead to both umbrella use and riskier streets.',
            'The sample size is zero.',
        ],
        correctIndex: 2,
        rationale: 'Weather is the confounder affecting both variables.',
    },
];
function chooseMany(arr, count, rng) {
    const pool = shuffle(arr, rng);
    return pool.slice(0, Math.min(count, pool.length));
}
function makeItemId(rng) {
    return `E-${Math.floor(rng.float() * 36 ** 4)
        .toString(36)
        .padStart(4, '0')}`;
}
function shuffle(items, rng) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rng.float() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
