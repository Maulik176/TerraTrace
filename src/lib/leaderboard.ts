import type { Difficulty, LeaderboardEntry } from '../types/game';

const LEADERBOARD_KEY = 'photoguessr_leaderboard_v1';
const MAX_ENTRIES = 10;

function readRaw(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as LeaderboardEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getLeaderboard(): LeaderboardEntry[] {
  return readRaw().sort((a, b) => b.totalScore - a.totalScore).slice(0, MAX_ENTRIES);
}

export function addLeaderboardEntry(input: {
  totalScore: number;
  difficulty: Difficulty;
  seed: string;
}): LeaderboardEntry[] {
  const next: LeaderboardEntry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    totalScore: input.totalScore,
    difficulty: input.difficulty,
    seed: input.seed,
  };

  const updated = [...readRaw(), next].sort((a, b) => b.totalScore - a.totalScore).slice(0, MAX_ENTRIES);

  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
  return updated;
}
