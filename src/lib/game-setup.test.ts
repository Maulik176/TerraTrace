import { describe, expect, it } from 'vitest';

import { createRoundLocations } from './game-setup';

describe('createRoundLocations', () => {
  it('reproduces the same location IDs when seedOverride is reused', () => {
    const first = createRoundLocations({
      mode: 'CLASSIC',
      difficulty: 'MEDIUM',
      baseSeed: 'alpha-seed',
    });

    const replay = createRoundLocations({
      mode: 'CLASSIC',
      difficulty: 'MEDIUM',
      seedOverride: first.seed,
    });

    expect(replay.seed).toBe(first.seed);
    expect(replay.locations.map((location) => location.id)).toEqual(
      first.locations.map((location) => location.id),
    );
  });
});
