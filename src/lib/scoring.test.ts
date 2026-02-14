import { describe, expect, it } from 'vitest';

import { scoreGuess } from './scoring';

describe('scoreGuess', () => {
  it('returns perfect score when within 50 meters', () => {
    expect(scoreGuess(0.01, 'EASY')).toBe(5000);
    expect(scoreGuess(0.049, 'HARD')).toBe(5000);
  });

  it('decays score by difficulty', () => {
    const distance = 1200;

    const easy = scoreGuess(distance, 'EASY');
    const medium = scoreGuess(distance, 'MEDIUM');
    const hard = scoreGuess(distance, 'HARD');

    expect(easy).toBeGreaterThan(medium);
    expect(medium).toBeGreaterThan(hard);
  });

  it('never drops below zero and never exceeds 5000', () => {
    expect(scoreGuess(9999999, 'HARD')).toBeGreaterThanOrEqual(0);
    expect(scoreGuess(0, 'MEDIUM')).toBe(5000);
  });
});
