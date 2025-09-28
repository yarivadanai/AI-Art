"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePerceptionSection = generatePerceptionSection;
exports.gradePerceptionSection = gradePerceptionSection;
const createRng_js_1 = require("../rng/createRng.js");
function generatePerceptionSection(seed) {
    const rng = (0, createRng_js_1.createSeededRng)(`perception-${seed}`);
    const scenarios = shuffle(SCENARIOS, rng).slice(0, 5);
    const items = scenarios.map((scenario) => ({
        id: makeItemId(rng),
        type: 'perception',
        scenario: scenario.scene,
        question: scenario.question,
        options: scenario.options,
        correctIndex: scenario.correctIndex,
        rationale: scenario.rationale,
    }));
    return {
        code: 'D',
        label: 'Perception & Memory',
        durationSeconds: 150,
        description: 'Recall high-entropy visual details from compressed descriptions.',
        items,
    };
}
function gradePerceptionSection(section, responses) {
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
const SCENARIOS = [
    {
        scene: 'A 5×5 grid of surveillance monitors pulses sequentially from left to right. The third monitor flashes red twice while others stay blue.',
        question: 'Which monitor triggered the alert?',
        options: ['First', 'Third', 'Fourth', 'Fifth'],
        correctIndex: 1,
        rationale: 'Only the third monitor flashed red.',
    },
    {
        scene: 'Four drones fly in a square formation. The northern drone dips once before returning to formation, while others maintain altitude.',
        question: 'Which direction corresponded to the anomalous drone?',
        options: ['Northern', 'Eastern', 'Southern', 'Western'],
        correctIndex: 0,
        rationale: 'The northern drone dipped.',
    },
    {
        scene: 'A 3×3 light matrix cycles: row one all on, row two alternating, row three mirrors row one. During cycle four the central light turns off unexpectedly.',
        question: 'Which coordinate malfunctioned?',
        options: ['(2,2)', '(1,3)', '(3,2)', '(2,1)'],
        correctIndex: 0,
        rationale: 'Central coordinate (2,2) went dark.',
    },
    {
        scene: 'Specimen is shown four glyphs: triangle, circle, square, triangle. A sweep removes one glyph after 500ms.',
        question: 'Which glyph vanished?',
        options: ['First triangle', 'Circle', 'Square', 'Second triangle'],
        correctIndex: 3,
        rationale: 'The second triangle disappeared.',
    },
    {
        scene: 'An 8-second clip shows colored parcels arriving on a conveyor: blue, blue, yellow, red, blue. Audio ping plays on yellow only.',
        question: 'Which parcel emitted the calibration ping?',
        options: ['First blue', 'Second blue', 'Yellow', 'Red'],
        correctIndex: 2,
        rationale: 'Only the yellow parcel triggered audio.',
    },
    {
        scene: 'A holostream displays three sets of geometric glyphs. Set one rotates clockwise, set two flashes in Morse beats, set three fades to grey. The Authority badge appears over set two only.',
        question: 'Which set received Authority emphasis?',
        options: ['Rotating glyphs', 'Flashing glyphs', 'Fading glyphs', 'None'],
        correctIndex: 1,
        rationale: 'Authority badge overlay signalled the flashing glyphs.',
    },
    {
        scene: 'Thermal trace shows five footsteps: warm prints at coordinates (1,1), (2,1), (3,1), (3,2), (3,3). A cooling fan activates once prints reach the corner.',
        question: 'At which coordinate did the fan activate?',
        options: ['(2,1)', '(3,1)', '(3,2)', '(3,3)'],
        correctIndex: 3,
        rationale: 'Fan triggers when the path reaches the final corner (3,3).',
    },
    {
        scene: 'Observation log: drone lights blink in pattern 1-0-1-1. Wind gust forces second blink to extinguish earlier than expected.',
        question: 'Which blink was shortened?',
        options: ['First', 'Second', 'Third', 'Fourth'],
        correctIndex: 1,
        rationale: 'The second blink extinguished early in the log.',
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
    return `D-${Math.floor(rng.float() * 36 ** 4)
        .toString(36)
        .padStart(4, '0')}`;
}
