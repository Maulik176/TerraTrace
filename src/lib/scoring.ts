import type { Difficulty } from '../types/game';

const EARTH_RADIUS_KM = 6371;

export const DECAY_BY_DIFFICULTY: Record<Difficulty, number> = {
  EASY: 2500,
  MEDIUM: 1500,
  HARD: 900,
};

export function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineDistanceKm(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
): number {
  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);
  const lat1 = toRadians(fromLat);
  const lat2 = toRadians(toLat);

  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function scoreGuess(distanceKm: number, difficulty: Difficulty): number {
  if (distanceKm < 0.05) {
    return 5000;
  }

  const decayKm = DECAY_BY_DIFFICULTY[difficulty];
  const raw = Math.round(5000 * Math.exp(-distanceKm / decayKm));

  if (raw < 0) {
    return 0;
  }

  if (raw > 5000) {
    return 5000;
  }

  return raw;
}
