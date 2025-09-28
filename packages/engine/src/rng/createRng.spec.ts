import { describe, expect, it } from 'vitest';
import { createSeededRng } from './createRng.js';

describe('createSeededRng', () => {
  it('produces deterministic sequences', () => {
    const rngA = createSeededRng('alpha');
    const rngB = createSeededRng('alpha');

    const sequenceA = Array.from({ length: 3 }, () => rngA.float());
    const sequenceB = Array.from({ length: 3 }, () => rngB.float());

    expect(sequenceA).toStrictEqual(sequenceB);
  });

  it('produces values in range', () => {
    const rng = createSeededRng('range');
    const value = rng.int(10);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(10);
  });
});
