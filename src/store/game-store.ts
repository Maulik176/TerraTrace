import { create } from 'zustand';

import { createRoundLocations } from '../lib/game-setup';
import { formatLocalDateSeed } from '../lib/seeded';
import { haversineDistanceKm, scoreGuess } from '../lib/scoring';
import type {
  Coordinates,
  Difficulty,
  GameMode,
  LocationItem,
  RoundResult,
  SharePayload,
} from '../types/game';

type StartOptions = {
  mode: GameMode;
  difficulty: Difficulty;
  manualSeed?: string;
  useDailySeed?: boolean;
  seedOverride?: string;
};

type GameStore = {
  mode: GameMode;
  difficulty: Difficulty;
  seed: string;
  roundLocations: LocationItem[];
  roundIndex: number;
  currentGuess: Coordinates | null;
  roundResults: RoundResult[];
  hasStarted: boolean;
  gameFinished: boolean;
  startGame: (options: StartOptions) => void;
  setGuess: (guess: Coordinates) => void;
  clearGuess: () => void;
  confirmGuess: () => void;
  goNextRound: () => void;
  resetGame: () => void;
  getTotalScore: () => number;
  getCurrentRoundLocation: () => LocationItem | null;
  getCurrentRoundResult: () => RoundResult | null;
  getSharePayload: () => SharePayload | null;
};

const INITIAL_MODE: GameMode = 'CLASSIC';
const INITIAL_DIFFICULTY: Difficulty = 'MEDIUM';

const initialState = {
  mode: INITIAL_MODE,
  difficulty: INITIAL_DIFFICULTY,
  seed: '',
  roundLocations: [] as LocationItem[],
  roundIndex: 0,
  currentGuess: null as Coordinates | null,
  roundResults: [] as RoundResult[],
  hasStarted: false,
  gameFinished: false,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  startGame: (options) => {
    const dailyDate = options.useDailySeed ? formatLocalDateSeed() : undefined;
    const baseSeed =
      options.manualSeed?.trim() ||
      (options.useDailySeed ? 'daily-challenge' : crypto.randomUUID().slice(0, 8));
    const run = createRoundLocations({
      mode: options.mode,
      difficulty: options.difficulty,
      baseSeed,
      dailyDate,
      seedOverride: options.seedOverride,
    });

    set({
      mode: options.mode,
      difficulty: options.difficulty,
      seed: run.seed,
      roundLocations: run.locations,
      roundIndex: 0,
      currentGuess: null,
      roundResults: [],
      hasStarted: true,
      gameFinished: false,
    });
  },

  setGuess: (guess) => {
    set({ currentGuess: guess });
  },

  clearGuess: () => {
    set({ currentGuess: null });
  },

  confirmGuess: () => {
    const state = get();
    const location = state.roundLocations[state.roundIndex];

    if (!state.currentGuess || !location) {
      return;
    }

    const distanceKm = haversineDistanceKm(
      state.currentGuess.lat,
      state.currentGuess.lng,
      location.lat,
      location.lng,
    );

    const score = scoreGuess(distanceKm, state.difficulty);

    const result: RoundResult = {
      round: state.roundIndex + 1,
      locationId: location.id,
      guess: state.currentGuess,
      target: { lat: location.lat, lng: location.lng },
      distanceKm,
      score,
      revealedTitle: location.title,
      countryCode: location.countryCode,
    };

    const updated = [...state.roundResults];
    updated[state.roundIndex] = result;

    set({
      roundResults: updated,
      currentGuess: null,
      gameFinished: state.roundIndex === state.roundLocations.length - 1,
    });
  },

  goNextRound: () => {
    const state = get();
    const isLastRound = state.roundIndex >= state.roundLocations.length - 1;

    if (isLastRound) {
      set({ gameFinished: true });
      return;
    }

    set({ roundIndex: state.roundIndex + 1, currentGuess: null });
  },

  resetGame: () => {
    set({ ...initialState });
  },

  getTotalScore: () => get().roundResults.reduce((sum, round) => sum + round.score, 0),

  getCurrentRoundLocation: () => {
    const state = get();
    return state.roundLocations[state.roundIndex] ?? null;
  },

  getCurrentRoundResult: () => {
    const state = get();
    return state.roundResults[state.roundIndex] ?? null;
  },

  getSharePayload: () => {
    const state = get();

    if (!state.hasStarted || state.roundResults.length === 0) {
      return null;
    }

    return {
      mode: state.mode,
      difficulty: state.difficulty,
      seed: state.seed,
      roundScores: state.roundResults.map((round) => round.score),
      totalScore: state.roundResults.reduce((sum, round) => sum + round.score, 0),
    };
  },
}));
