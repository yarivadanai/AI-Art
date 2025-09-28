import { generateSessionSeed } from './session-seed.js';

describe('generateSessionSeed', () => {
  it('produces unique-looking seeds without Math.random', () => {
    const first = generateSessionSeed();
    const second = generateSessionSeed();

    expect(first).not.toEqual(second);
    expect(first).toMatch(/^[a-z0-9]+-[a-f0-9]{10}$/);
  });
});
