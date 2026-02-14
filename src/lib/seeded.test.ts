import { describe, expect, it } from 'vitest';

import { LOCATIONS } from '../data/locations';
import { sampleUniqueLocations } from './seeded';

describe('sampleUniqueLocations', () => {
  it('returns the same IDs for the same seed', () => {
    const a = sampleUniqueLocations(LOCATIONS, 5, 'same-seed').map((location) => location.id);
    const b = sampleUniqueLocations(LOCATIONS, 5, 'same-seed').map((location) => location.id);

    expect(a).toEqual(b);
  });

  it('returns unique IDs', () => {
    const ids = sampleUniqueLocations(LOCATIONS, 5, 'unique-seed').map((location) => location.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
