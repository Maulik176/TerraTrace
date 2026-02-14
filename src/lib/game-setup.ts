import { LOCATIONS, ROUND_COUNT } from '../data/locations';
import { buildSeed, sampleUniqueLocations } from './seeded';
import type { Difficulty, GameMode, LocationItem } from '../types/game';

const EASY_IDS = new Set([
  'paris-eiffel',
  'rome-colosseum',
  'newyork-times-square',
  'tokyo-shibuya',
  'sydney-opera',
  'rio-christ',
  'sanfrancisco-golden-gate',
  'london-big-ben',
  'barcelona-sagrada',
  'dubai-burj-khalifa',
  'cairo-pyramids',
  'agra-taj-mahal',
  'beijing-great-wall',
  'machu-picchu',
  'singapore-marina',
]);

const HARD_IDS = new Set([
  'iceland-kirkjufell',
  'norway-geiranger',
  'newzealand-milford',
  'antarctica-peninsula',
  'namibia-dune45',
  'tanzania-kili',
  'bali-terraces',
  'banff-lake-louise',
  'swiss-matterhorn',
  'petra-jordan',
  'mexico-chichen-itza',
  'cape-town-table',
]);

function datasetByDifficulty(difficulty: Difficulty): LocationItem[] {
  if (difficulty === 'EASY') {
    return LOCATIONS.filter((location) => EASY_IDS.has(location.id));
  }

  if (difficulty === 'HARD') {
    return LOCATIONS.filter((location) => HARD_IDS.has(location.id));
  }

  return LOCATIONS;
}

export function createRoundLocations(input: {
  mode: GameMode;
  difficulty: Difficulty;
  baseSeed?: string;
  dailyDate?: string;
  seedOverride?: string;
}): { locations: LocationItem[]; seed: string } {
  const seed =
    input.seedOverride ||
    buildSeed({
      mode: input.mode,
      difficulty: input.difficulty,
      baseSeed: input.baseSeed,
      dailyDate: input.dailyDate,
    });

  const source = datasetByDifficulty(input.difficulty);

  return {
    seed,
    locations: sampleUniqueLocations(source, ROUND_COUNT, seed),
  };
}
