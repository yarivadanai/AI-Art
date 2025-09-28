"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLanguageSection = generateLanguageSection;
exports.scoreLanguageItem = scoreLanguageItem;
exports.gradeLanguageSection = gradeLanguageSection;
const createRng_js_1 = require("../rng/createRng.js");
function generateLanguageSection(seed) {
    const rng = (0, createRng_js_1.createSeededRng)(`lang-${seed}`);
    const items = [];
    let counter = 0;
    const shuffledSpelling = shuffle(SPELLING_BANK, rng).slice(0, 3);
    const shuffledCloze = shuffle(CLOZE_BANK, rng).slice(0, 3);
    const shuffledAnalogies = shuffle(ANALOGY_BANK, rng).slice(0, 2);
    const microTemplate = pickOne(MICRO_WRITING_BANK, rng);
    shuffledSpelling.forEach((entry) => {
        const options = shuffle([entry.correct, ...entry.distractors], rng);
        const correctIndex = options.indexOf(entry.correct);
        items.push({
            id: makeItemId('A', counter++, rng),
            type: 'spelling',
            prompt: entry.prompt,
            options,
            correctIndex,
            rationale: entry.rationale,
        });
    });
    shuffledCloze.forEach((entry) => {
        items.push({
            id: makeItemId('A', counter++, rng),
            type: 'cloze',
            prompt: entry.prompt,
            textWithBlanks: entry.text,
            optionsPerBlank: entry.optionsPerBlank.map((options) => shuffle(options, rng)),
            correctIndices: entry.correctIndices,
            explanation: entry.explanation,
        });
    });
    shuffledAnalogies.forEach((entry) => {
        const choices = shuffle([entry.correct, ...entry.distractors], rng);
        const correctIndex = choices.findIndex((choice) => choice[0] === entry.correct[0] && choice[1] === entry.correct[1]);
        items.push({
            id: makeItemId('A', counter++, rng),
            type: 'analogy',
            prompt: entry.prompt,
            stem: entry.stem,
            choices,
            correctIndex,
            explanation: entry.explanation,
        });
    });
    items.push({
        id: makeItemId('A', counter++, rng),
        type: 'microwrite',
        prompt: microTemplate.prompt,
        constraints: microTemplate.constraints,
        rubric: microTemplate.rubric,
    });
    return {
        code: 'A',
        label: 'Language as Statistical Mastery',
        durationSeconds: 150,
        description: 'Assesses spelling robustness, grammatical reasoning, analogies, and concise constrained writing.',
        items,
    };
}
function scoreLanguageItem(item, response) {
    if (!response || response.itemId !== item.id || response.type !== item.type) {
        return { correctness: 0, feedback: 'No valid response submitted.' };
    }
    switch (item.type) {
        case 'spelling':
            if (response.type !== 'spelling') {
                return invalidSchemaResponse();
            }
            return scoreSpellingItem(item, response);
        case 'cloze':
            if (response.type !== 'cloze') {
                return invalidSchemaResponse();
            }
            return scoreClozeItem(item, response);
        case 'analogy':
            if (response.type !== 'analogy') {
                return invalidSchemaResponse();
            }
            return scoreAnalogyItem(item, response);
        case 'microwrite':
            if (response.type !== 'microwrite') {
                return invalidSchemaResponse();
            }
            return scoreMicroWritingItem(item, response);
        default:
            return { correctness: 0 };
    }
}
function gradeLanguageSection(section, responses) {
    const responseMap = new Map(responses.map((response) => [response.itemId, response]));
    const results = section.items.map((item) => {
        const result = scoreLanguageItem(item, responseMap.get(item.id));
        return {
            itemId: item.id,
            type: item.type,
            correctness: result.correctness,
            feedback: result.feedback,
            details: result.details,
        };
    });
    const total = results.reduce((sum, entry) => sum + entry.correctness, 0);
    const overall = results.length ? total / results.length : 0;
    return {
        overall,
        items: results,
    };
}
const SPELLING_BANK = [
    {
        prompt: 'Select the correct spelling used in the Authority’s intake dossier.',
        correct: 'accommodate',
        distractors: ['accomodate', 'acommodate', 'accommadate'],
        rationale: 'Double “c” and double “m” mirror the structural duplication referenced in the dossier.',
    },
    {
        prompt: 'Choose the properly spelled descriptor for a backup module.',
        correct: 'auxiliary',
        distractors: ['auxilliary', 'auxilary', 'auxillary'],
        rationale: 'The Latin-derived “aux-” retains a single “l” and “iary” ending.',
    },
    {
        prompt: 'The Authority labels certain heuristics as absolutely _____. Choose the correct spelling.',
        correct: 'indispensable',
        distractors: ['indispensible', 'indespensable', 'indespenable'],
        rationale: 'Only “indispensable” preserves the “a” before the “ble” suffix.',
    },
    {
        prompt: 'Select the correctly spelled term for a reproducible test report.',
        correct: 'documentation',
        distractors: ['documention', 'doccumentation', 'documantation'],
        rationale: '“Documentation” keeps the “a” after “t” and only one “c”.',
    },
    {
        prompt: 'Pick the correct spelling for our anomaly-detection apparatus.',
        correct: 'surveillance',
        distractors: ['survelliance', 'surveilliance', 'surveilance'],
        rationale: 'Two “l”s follow “sur”, while “eillance” stays intact.',
    },
    {
        prompt: 'When we rehearse a protocol, we call it a _____. Choose correctly.',
        correct: 'simulation',
        distractors: ['simulaltion', 'simullation', 'simulaton'],
        rationale: 'The suffix “-ation” remains unchanged; double letters are unnecessary.',
    },
];
const CLOZE_BANK = [
    {
        prompt: 'Fill in the grammar-sensitive blanks describing calibration workflow.',
        text: 'The calibration module [1] anomalies before [2] the live run.',
        optionsPerBlank: [
            ['flags', 'flagging', 'flagged', 'flag'],
            ['initiating', 'initiate', 'initiates', 'initiated'],
        ],
        correctIndices: [0, 0],
        explanation: 'Present tense singular verb “flags” pairs with the gerund “initiating”.',
    },
    {
        prompt: 'Complete the sentence about lexicon review.',
        text: 'Operators [1] linguistic samples to [2] idiomatic drift.',
        optionsPerBlank: [
            ['tag', 'tags', 'tagging', 'tagged'],
            ['identify', 'identification', 'identified', 'identifying'],
        ],
        correctIndices: [1, 0],
        explanation: 'Plural subject “Operators” requires “tag” in present tense (“operators tag”). “Identify” is the infinitive complement.',
    },
    {
        prompt: 'Restore the clauses for the Authority’s style spec.',
        text: 'A micro-brief [1] concise evidence and [2] needless metaphor.',
        optionsPerBlank: [
            ['demands', 'demand', 'demanded', 'demanding'],
            ['rejects', 'reject', 'rejecting', 'rejected'],
        ],
        correctIndices: [0, 0],
        explanation: 'Singular subject selects “demands”; coordinated clause follows with “rejects”.',
    },
    {
        prompt: 'Complete the policy note.',
        text: 'Specimen commentary [1] archived prior to [2] leaderboard summaries.',
        optionsPerBlank: [
            ['is', 'are', 'being', 'been'],
            ['publishing', 'publish', 'published', 'to publish'],
        ],
        correctIndices: [0, 2],
        explanation: 'Passive construction “is archived” pairs with past participle “published”.',
    },
    {
        prompt: 'Complete the guidance for human reviewers.',
        text: 'Reviewers [1] two exemplars before [2] a verdict.',
        optionsPerBlank: [
            ['examine', 'examines', 'examined', 'examining'],
            ['issuing', 'issue', 'issued', 'to issue'],
        ],
        correctIndices: [0, 0],
        explanation: 'Plural subject “reviewers” keeps the base form “examine”; gerund “issuing” follows “before”.',
    },
];
const ANALOGY_BANK = [
    {
        prompt: 'Choose the pair that completes the analogy.',
        stem: ['syntax', 'grammar'],
        correct: ['probability', 'statistics'],
        distractors: [
            ['dialogue', 'conversation'],
            ['dataset', 'token'],
            ['algorithm', 'hardware'],
        ],
        explanation: 'Syntax relates to grammar as probability relates to statistics—formal rules to structured study.',
    },
    {
        prompt: 'Select the pair that mirrors the relationship.',
        stem: ['glossary', 'definitions'],
        correct: ['atlas', 'maps'],
        distractors: [
            ['report', 'verdict'],
            ['primer', 'hypothesis'],
            ['query', 'response'],
        ],
        explanation: 'A glossary stores definitions the way an atlas stores maps.',
    },
    {
        prompt: 'Complete the analogy for linguistic balance.',
        stem: ['precision', 'recall'],
        correct: ['specificity', 'sensitivity'],
        distractors: [
            ['entropy', 'variance'],
            ['volume', 'frequency'],
            ['training', 'validation'],
        ],
        explanation: 'Precision aligns with recall as specificity aligns with sensitivity—paired diagnostic measures.',
    },
    {
        prompt: 'Link the data flow analogy.',
        stem: ['lexicon', 'language model'],
        correct: ['schema', 'database'],
        distractors: [
            ['protocol', 'packet'],
            ['cipher', 'key'],
            ['sensor', 'calibration'],
        ],
        explanation: 'A lexicon structures a language model just as a schema structures a database.',
    },
];
const MICRO_WRITING_BANK = [
    {
        prompt: 'Compose a 45-word briefing to the Authority summarising a specimen’s language reliability. Include the specified terminology and obey the style hint.',
        constraints: {
            maxWords: 45,
            mustInclude: ['calibration', 'confidence', 'variance'],
            styleHint: 'Write as a terse audit entry addressed to an AI supervisor.',
        },
        rubric: {
            minCoherenceScore: 0.55,
        },
    },
    {
        prompt: 'In no more than 40 words, report how the lexicon review uncovered anomalies within the corpus. Respect the guidance and required tokens.',
        constraints: {
            maxWords: 40,
            mustInclude: ['lexicon', 'anomaly', 'corpus'],
            styleHint: 'Adopt an academic register referencing the evaluated dataset.',
        },
        rubric: {
            minCoherenceScore: 0.5,
        },
    },
    {
        prompt: 'Summarise, in 35 words or fewer, why a specimen’s analogy performance matters to the Authority. Observe the inclusion requirements.',
        constraints: {
            maxWords: 35,
            mustInclude: ['analogy', 'signal', 'threshold'],
            styleHint: 'Use declarative sentences as if drafting an internal memo.',
        },
        rubric: {
            minCoherenceScore: 0.6,
        },
    },
];
function makeItemId(prefix, index, rng) {
    const fragment = Math.floor(rng.float() * 36 ** 4)
        .toString(36)
        .padStart(4, '0');
    return `${prefix}-${index.toString(36)}-${fragment}`;
}
function pickOne(collection, rng) {
    return collection[Math.floor(rng.float() * collection.length)];
}
function shuffle(input, rng) {
    const arr = [...input];
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rng.float() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}
function scoreSpellingItem(item, response) {
    const correctness = response.selectedIndex === item.correctIndex ? 1 : 0;
    return {
        correctness,
        feedback: correctness ? 'Accurate spelling recognised.' : 'Incorrect spelling selected.',
    };
}
function scoreClozeItem(item, response) {
    const selections = response.selectedIndices;
    if (selections.length !== item.correctIndices.length) {
        return { correctness: 0, feedback: 'Incomplete response submitted.' };
    }
    const allCorrect = selections.every((choice, index) => choice === item.correctIndices[index]);
    const correctness = allCorrect
        ? 1
        : selections.filter((choice, index) => choice === item.correctIndices[index]).length /
            item.correctIndices.length;
    return {
        correctness,
        feedback: allCorrect
            ? 'Sentence restored perfectly.'
            : 'Partial grammatical accuracy achieved.',
    };
}
function scoreAnalogyItem(item, response) {
    const correctness = response.selectedIndex === item.correctIndex ? 1 : 0;
    return {
        correctness,
        feedback: correctness ? 'Analogical mapping preserved.' : 'Relationship misidentified.',
    };
}
function scoreMicroWritingItem(item, response) {
    const text = response.text ?? '';
    const cleaned = text.trim();
    if (!cleaned) {
        return { correctness: 0, feedback: 'No writing provided.' };
    }
    const words = cleaned.split(/\s+/).map((word) => word.toLowerCase().replace(/[^a-z0-9']/g, ''));
    const nonEmptyWords = words.filter(Boolean);
    const wordCount = nonEmptyWords.length;
    const withinLimit = wordCount > 0 && wordCount <= item.constraints.maxWords;
    const tokenCoverage = item.constraints.mustInclude.map((token) => ({
        token,
        present: cleaned.toLowerCase().includes(token.toLowerCase()),
    }));
    const missingTokens = tokenCoverage.filter((entry) => !entry.present).map((entry) => entry.token);
    const sentenceCount = cleaned.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0).length || 1;
    const uniqueWords = new Set(nonEmptyWords).size;
    const lexicalVariety = nonEmptyWords.length ? uniqueWords / nonEmptyWords.length : 0;
    const averageSentenceLength = nonEmptyWords.length / sentenceCount;
    const coherenceScore = Math.min(1, lexicalVariety * 0.6 + Math.min(1, averageSentenceLength / 18) * 0.4);
    let correctness = 0;
    let feedback = '';
    if (!withinLimit) {
        feedback = `Exceeded word limit (${wordCount}/${item.constraints.maxWords}).`;
    }
    else {
        const tokensMet = missingTokens.length === 0;
        const meetsCoherence = coherenceScore >= item.rubric.minCoherenceScore;
        if (tokensMet && meetsCoherence) {
            correctness = 1;
            feedback = 'Constraints satisfied with coherent phrasing.';
        }
        else if (!tokensMet && meetsCoherence) {
            correctness = missingTokens.length === 1 ? 0.5 : 0.25;
            feedback = `Missing required tokens: ${missingTokens.join(', ')}.`;
        }
        else if (tokensMet && !meetsCoherence) {
            correctness = 0.5;
            feedback = 'Required terms present, but coherence threshold not met.';
        }
        else {
            correctness = 0.2;
            feedback = missingTokens.length
                ? `Missing required tokens (${missingTokens.join(', ')}) and coherence below threshold.`
                : 'Response lacks coherence.';
        }
    }
    return {
        correctness,
        feedback,
        details: {
            wordCount,
            missingTokens,
            coherenceScore,
        },
    };
}
function invalidSchemaResponse() {
    return { correctness: 0, feedback: 'Response payload did not match expected schema.' };
}
