import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { decodeSharePayload } from '../lib/share';
import { useGameStore } from '../store/game-store';
import type { Difficulty, GameMode } from '../types/game';

function HomePage(): JSX.Element {
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [mode, setMode] = useState<GameMode>('CLASSIC');
  const [useDaily, setUseDaily] = useState(false);
  const [seedText, setSeedText] = useState('');
  const navigate = useNavigate();
  const startGame = useGameStore((state) => state.startGame);
  const resetGame = useGameStore((state) => state.resetGame);

  const [searchParams] = useSearchParams();

  const sharedData = useMemo(() => {
    const share = searchParams.get('share');
    return share ? decodeSharePayload(share) : null;
  }, [searchParams]);

  const onStart = () => {
    resetGame();
    startGame({
      mode,
      difficulty,
      useDailySeed: useDaily,
      manualSeed: seedText.trim() ? seedText.trim() : undefined,
    });
    navigate('/play');
  };

  const onStartShared = () => {
    if (!sharedData) {
      return;
    }

    resetGame();
    startGame({
      mode: sharedData.mode,
      difficulty: sharedData.difficulty,
      seedOverride: sharedData.seed,
    });
    navigate('/play');
  };

  return (
    <main className="app-shell fade-in">
      <section className="panel mx-auto w-full max-w-3xl p-5 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">PhotoGuessr</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-slate-900">Explore In Street View, Then Guess</h1>
        <p className="mt-3 text-sm text-slate-600 md:text-base">
          Each round opens Street View near the mystery location. Navigate around, infer where you are, then place your guess on the world map.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900">Mode</h2>
            <label className="mt-2 flex items-start gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="mode"
                value="CLASSIC"
                checked={mode === 'CLASSIC'}
                onChange={() => setMode('CLASSIC')}
              />
              <span>Classic (5 rounds)</span>
            </label>
          </article>

          <article className="rounded-xl border border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900">Difficulty</h2>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(['EASY', 'MEDIUM', 'HARD'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDifficulty(value)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                    value === difficulty
                      ? 'border-sky-600 bg-sky-600 text-white'
                      : 'border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-4 grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={useDaily} onChange={(e) => setUseDaily(e.target.checked)} />
            Daily challenge seed
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Custom seed (optional)
            <input
              value={seedText}
              onChange={(e) => setSeedText(e.target.value)}
              placeholder="e.g. stream-night-7"
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        </div>

        {sharedData ? (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <p>
              Shared run loaded: {sharedData.difficulty} • total {sharedData.totalScore.toLocaleString()} points.
            </p>
            <button type="button" className="btn-primary mt-3 w-full md:w-auto" onClick={onStartShared}>
              Play Shared Seed
            </button>
          </div>
        ) : null}

        <button type="button" className="btn-primary mt-6 w-full md:w-auto" onClick={onStart}>
          Start Game
        </button>
      </section>
    </main>
  );
}

export default HomePage;
