import { SeededRNG } from './rng';
import { GeneratedQuestion, SceneShape, SceneData } from '@/lib/types';

const SHAPE_TYPES: SceneShape['type'][] = ['circle', 'square', 'triangle', 'star', 'hexagon'];
const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan', 'teal', 'maroon', 'lime', 'gold'];
const SIZE_RANGES: Record<SceneShape['size'], [number, number]> = {
  small: [15, 25],
  medium: [30, 45],
  large: [50, 70],
};
const SIZE_NAMES: SceneShape['size'][] = ['small', 'medium', 'large'];
const QUADRANTS: SceneShape['quadrant'][] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

function getQuadrant(x: number, y: number): SceneShape['quadrant'] {
  const midX = CANVAS_WIDTH / 2;
  const midY = CANVAS_HEIGHT / 2;
  if (x < midX && y < midY) return 'top-left';
  if (x >= midX && y < midY) return 'top-right';
  if (x < midX && y >= midY) return 'bottom-left';
  return 'bottom-right';
}

function describePosition(x: number, y: number): string {
  const midX = CANVAS_WIDTH / 2;
  const midY = CANVAS_HEIGHT / 2;
  const horizontal = x < midX ? 'left' : 'right';
  const vertical = y < midY ? 'top' : 'bottom';
  return `${vertical}-${horizontal}`;
}

function generateScene(rng: SeededRNG): SceneData {
  const numShapes = rng.int(40, 55);
  const shapes: SceneShape[] = [];

  for (let i = 0; i < numShapes; i++) {
    const shapeType = rng.pick(SHAPE_TYPES);
    const color = rng.pick(COLORS);
    const sizeName = rng.pick(SIZE_NAMES);
    const [minSize, maxSize] = SIZE_RANGES[sizeName];
    const sizeValue = rng.int(minSize, maxSize);

    // Position with margin so shapes don't clip edges
    const x = rng.int(sizeValue, CANVAS_WIDTH - sizeValue);
    const y = rng.int(sizeValue, CANVAS_HEIGHT - sizeValue);
    const quadrant = getQuadrant(x, y);

    shapes.push({
      type: shapeType,
      color,
      x,
      y,
      size: sizeName,
      sizeValue,
      filled: rng.next() > 0.3, // 70% filled
      quadrant,
    });
  }

  // Generate 6-10 text labels (2-3 digit numbers) as distractors
  const numLabels = rng.int(6, 10);
  const labels: { text: string; x: number; y: number }[] = [];
  for (let i = 0; i < numLabels; i++) {
    labels.push({
      text: String(rng.int(10, 99)),
      x: rng.int(30, CANVAS_WIDTH - 30),
      y: rng.int(30, CANVAS_HEIGHT - 30),
    });
  }

  return {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    shapes,
    labels,
  };
}

export function generatePerceptionQuestions(rng: SeededRNG): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const scene = generateScene(rng);

  // Q1: "How many [color] [shape]s?" - numeric input
  // Pick a color+shape combo that exists in the scene
  const colorShapeCombos = new Map<string, number>();
  for (const shape of scene.shapes) {
    const key = `${shape.color} ${shape.type}`;
    colorShapeCombos.set(key, (colorShapeCombos.get(key) ?? 0) + 1);
  }
  const comboEntries = Array.from(colorShapeCombos.entries());
  const [countCombo, countAnswer] = rng.pick(comboEntries);

  questions.push({
    section: 'perception',
    index: 0,
    type: 'shape-counting',
    payload: {
      prompt: `How many ${countCombo}s are in the scene?`,
      inputType: 'numeric',
      scene,
    },
    answerKey: { correct: countAnswer },
  });

  // Q2: "What color was the [size] [shape] near the [position]?" - multiple choice
  // Pick a shape with a somewhat unique size+type+position combo
  const targetShape = rng.pick(scene.shapes);
  const position = describePosition(targetShape.x, targetShape.y);
  const correctColor = targetShape.color;
  const otherColors = COLORS.filter(c => c !== correctColor);
  const colorDistractors = rng.pickN(otherColors, 3);
  const colorOptions = rng.shuffle([correctColor, ...colorDistractors]);
  const colorCorrectIdx = colorOptions.indexOf(correctColor);

  questions.push({
    section: 'perception',
    index: 1,
    type: 'color-memory',
    payload: {
      prompt: `What color is the ${targetShape.size} ${targetShape.type} near the ${position} area?`,
      inputType: 'multiple-choice',
      options: colorOptions,
    },
    answerKey: { correct: colorCorrectIdx },
  });

  // Q3: "Which was larger: A or B?" - multiple choice
  // Pick two shapes of different sizes
  const shuffledShapes = rng.shuffle([...scene.shapes]);
  let shapeA = shuffledShapes[0];
  let shapeB = shuffledShapes[1];
  // Try to find two shapes with different size values for a meaningful question
  for (let i = 2; i < shuffledShapes.length; i++) {
    if (shapeA.sizeValue !== shapeB.sizeValue) break;
    shapeB = shuffledShapes[i];
  }

  const posA = describePosition(shapeA.x, shapeA.y);
  const posB = describePosition(shapeB.x, shapeB.y);
  const labelA = `The ${shapeA.color} ${shapeA.type} (${posA} area)`;
  const labelB = `The ${shapeB.color} ${shapeB.type} (${posB} area)`;
  const largerLabel = shapeA.sizeValue >= shapeB.sizeValue ? labelA : labelB;
  const sizeOptions = rng.shuffle([labelA, labelB]);
  const sizeCorrectIdx = sizeOptions.indexOf(largerLabel);

  questions.push({
    section: 'perception',
    index: 2,
    type: 'relative-size',
    payload: {
      prompt: `Which shape was larger?`,
      inputType: 'multiple-choice',
      options: sizeOptions,
    },
    answerKey: { correct: sizeCorrectIdx },
  });

  // Q4: "How many shapes in [quadrant]?" - numeric input
  const targetQuadrant = rng.pick(QUADRANTS);
  const quadrantCount = scene.shapes.filter(s => s.quadrant === targetQuadrant).length;

  questions.push({
    section: 'perception',
    index: 3,
    type: 'quadrant-counting',
    payload: {
      prompt: `How many shapes were in the ${targetQuadrant} quadrant?`,
      inputType: 'numeric',
    },
    answerKey: { correct: quadrantCount },
  });

  return questions;
}
