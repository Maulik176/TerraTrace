import type { LocationItem } from '../types/game';

function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }

  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSeededRng(seedText: string): () => number {
  const seedFn = xmur3(seedText);
  const seed = seedFn();
  return mulberry32(seed);
}

export function sampleUniqueLocations(
  dataset: LocationItem[],
  count: number,
  seedText: string,
): LocationItem[] {
  if (count > dataset.length) {
    throw new Error(`Requested ${count} locations but dataset only has ${dataset.length}.`);
  }

  const rng = createSeededRng(seedText);
  const indexes = dataset.map((_, i) => i);

  for (let i = indexes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }

  return indexes.slice(0, count).map((index) => dataset[index]);
}

export function buildSeed(input: {
  mode: string;
  difficulty: string;
  baseSeed?: string;
  dailyDate?: string;
}): string {
  return [input.mode, input.difficulty, input.baseSeed ?? 'default', input.dailyDate ?? 'none'].join(
    '::',
  );
}

export function formatLocalDateSeed(date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
