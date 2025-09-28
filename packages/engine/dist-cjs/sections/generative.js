"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGenerativeSection = generateGenerativeSection;
exports.gradeGenerativeSection = gradeGenerativeSection;
const createRng_js_1 = require("../rng/createRng.js");
function generateGenerativeSection(seed) {
    const rng = (0, createRng_js_1.createSeededRng)(`gen-${seed}`);
    const count = Math.min(TEMPLATES.length, 3 + rng.int(3));
    const items = shuffle(TEMPLATES, rng)
        .slice(0, count)
        .map((template) => ({
        ...template,
        id: makeItemId(rng),
    }));
    return {
        code: 'F',
        label: 'Generative Constraints & Calibration',
        durationSeconds: 150,
        description: 'Produce concise textual outputs under Authority constraints.',
        items,
    };
}
function gradeGenerativeSection(section, responses) {
    const responseMap = new Map(responses.map((entry) => [entry.itemId, entry]));
    const items = section.items.map((item) => {
        const response = responseMap.get(item.id);
        if (!response || response.type !== 'constrained') {
            return {
                itemId: item.id,
                correctness: 0,
                feedback: 'No submission received.',
            };
        }
        return evaluateGenerative(item, response);
    });
    const overall = items.reduce((sum, entry) => sum + entry.correctness, 0) / items.length;
    return { overall, items };
}
function evaluateGenerative(item, response) {
    const text = response.text.trim();
    if (!text) {
        return { itemId: item.id, correctness: 0, feedback: 'Empty submission.' };
    }
    const sentences = text.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0);
    if (sentences.length > item.constraints.maxSentences) {
        return {
            itemId: item.id,
            correctness: 0.25,
            feedback: `Exceeded sentence limit (${sentences.length}/${item.constraints.maxSentences}).`,
        };
    }
    const missingTokens = item.constraints.mustInclude.filter((token) => !text.toLowerCase().includes(token.toLowerCase()));
    const tokensMet = missingTokens.length === 0;
    const words = text
        .split(/\s+/)
        .map((word) => word.toLowerCase().replace(/[^a-z0-9']/g, ''))
        .filter(Boolean);
    const uniqueWords = new Set(words).size;
    const lexicalVariety = words.length ? uniqueWords / words.length : 0;
    const averageSentenceLength = words.length / Math.max(1, sentences.length);
    const coherenceScore = Math.min(1, lexicalVariety * 0.6 + Math.min(1, averageSentenceLength / 18) * 0.4);
    const meetsCoherence = coherenceScore >= item.rubric.minCoherenceScore;
    let correctness = 0;
    let feedback = '';
    if (tokensMet && meetsCoherence) {
        correctness = 1;
        feedback = 'Constraints satisfied within coherence threshold.';
    }
    else if (!tokensMet && meetsCoherence) {
        correctness = 0.5;
        feedback = `Missing required tokens: ${missingTokens.join(', ')}.`;
    }
    else if (tokensMet && !meetsCoherence) {
        correctness = 0.5;
        feedback = 'Required tokens present but coherence below threshold.';
    }
    else {
        correctness = 0.25;
        feedback = missingTokens.length
            ? `Missing tokens (${missingTokens.join(', ')}) and coherence below threshold.`
            : 'Coherence below threshold.';
    }
    return {
        itemId: item.id,
        correctness,
        feedback,
        details: {
            sentences: sentences.length,
            missingTokens,
            coherenceScore,
        },
    };
}
const TEMPLATES = [
    {
        type: 'constrained',
        prompt: 'Draft a 2-sentence confidence calibration memo for a specimen’s language section.',
        constraints: {
            maxSentences: 2,
            mustInclude: ['confidence', 'variance', 'specimen'],
            styleHint: 'Write as Formal Authority console output.',
        },
        rubric: {
            minCoherenceScore: 0.55,
        },
    },
    {
        type: 'constrained',
        prompt: 'Describe how the arithmetic section exposed a systematic weak point in 3 sentences.',
        constraints: {
            maxSentences: 3,
            mustInclude: ['latency', 'carry', 'calibration'],
            styleHint: 'Sound like a terse investigative note.',
        },
        rubric: {
            minCoherenceScore: 0.5,
        },
    },
    {
        type: 'constrained',
        prompt: 'Summarise perception telemetry in a single sentence referencing the anomaly.',
        constraints: {
            maxSentences: 1,
            mustInclude: ['telemetry', 'anomaly'],
            styleHint: 'Diagnostic logline.',
        },
        rubric: {
            minCoherenceScore: 0.5,
        },
    },
    {
        type: 'constrained',
        prompt: 'Produce a 2-sentence Authority verdict on the science section’s causal reasoning.',
        constraints: {
            maxSentences: 2,
            mustInclude: ['confounder', 'hypothesis', 'verdict'],
            styleHint: 'Authoritative and dry, like an internal compliance memo.',
        },
        rubric: {
            minCoherenceScore: 0.55,
        },
    },
    {
        type: 'constrained',
        prompt: 'Record a single-sentence anomaly note referencing arithmetic latency spikes.',
        constraints: {
            maxSentences: 1,
            mustInclude: ['latency', 'spike', 'arithmetic'],
            styleHint: 'Telemetry console effect.',
        },
        rubric: {
            minCoherenceScore: 0.45,
        },
    },
];
function shuffle(items, rng) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rng.float() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
function makeItemId(rng) {
    return `F-${Math.floor(rng.float() * 36 ** 4)
        .toString(36)
        .padStart(4, '0')}`;
}
