export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type GameMode = 'CLASSIC';

export type Coordinates = {
  lat: number;
  lng: number;
};

export type RegionHints = {
  continent?: string;
  biome?: string;
  urban?: boolean;
};

export type PhotoAttribution = {
  url: string;
  photographerName: string;
  photographerProfileUrl: string;
  unsplashPhotoUrl: string;
};

export type LocationItem = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  countryCode: string;
  regionHints: RegionHints;
  photos: PhotoAttribution[];
};

export type RoundResult = {
  round: number;
  locationId: string;
  guess: Coordinates;
  target: Coordinates;
  distanceKm: number;
  score: number;
  revealedTitle: string;
  countryCode: string;
};

export type LeaderboardEntry = {
  id: string;
  createdAt: string;
  difficulty: Difficulty;
  totalScore: number;
  seed: string;
};

export type SharePayload = {
  mode: GameMode;
  difficulty: Difficulty;
  seed: string;
  roundScores: number[];
  totalScore: number;
};
