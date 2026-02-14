import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';

import FinalResults from '../components/FinalResults';
import { addLeaderboardEntry, getLeaderboard } from '../lib/leaderboard';
import { decodeSharePayload, encodeSharePayload } from '../lib/share';
import { useGameStore } from '../store/game-store';
import type { LeaderboardEntry } from '../types/game';

function ResultsPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const persisted = useRef(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => getLeaderboard());

  const hasStarted = useGameStore((state) => state.hasStarted);
  const gameFinished = useGameStore((state) => state.gameFinished);
  const difficulty = useGameStore((state) => state.difficulty);
  const seed = useGameStore((state) => state.seed);
  const roundResults = useGameStore((state) => state.roundResults);
  const mode = useGameStore((state) => state.mode);

  const totalScore = useMemo(
    () => roundResults.reduce((sum, round) => sum + round.score, 0),
    [roundResults],
  );

  useEffect(() => {
    if (!gameFinished || !hasStarted || persisted.current) {
      return;
    }

    setLeaderboard(
      addLeaderboardEntry({
        totalScore,
        difficulty,
        seed,
      }),
    );
    persisted.current = true;
  }, [difficulty, gameFinished, hasStarted, seed, totalScore]);

  const shareLink = useMemo(() => {
    if (!hasStarted || roundResults.length === 0) {
      return '';
    }

    const code = encodeSharePayload({
      mode,
      difficulty,
      seed,
      roundScores: roundResults.map((round) => round.score),
      totalScore,
    });

    const hashPath = `#/?share=${encodeURIComponent(code)}`;
    return `${window.location.origin}${window.location.pathname}${hashPath}`;
  }, [difficulty, hasStarted, mode, roundResults, seed, totalScore]);

  const shareCode = searchParams.get('share');
  const sharedPayload = useMemo(() => {
    return shareCode ? decodeSharePayload(shareCode) : null;
  }, [shareCode]);

  if (gameFinished && hasStarted && roundResults.length > 0) {
    return (
      <main className="app-shell fade-in gap-4">
        <FinalResults
          difficulty={difficulty}
          seed={seed}
          totalScore={totalScore}
          rounds={roundResults}
          leaderboard={leaderboard}
          shareLink={shareLink}
        />
        <Link to="/" className="btn-secondary w-full text-center md:w-auto">
          Play Again
        </Link>
      </main>
    );
  }

  if (sharedPayload) {
    return (
      <main className="app-shell fade-in">
        <section className="panel mx-auto w-full max-w-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Shared Result</p>
          <h1 className="font-display text-3xl text-slate-900">{sharedPayload.totalScore.toLocaleString()} points</h1>
          <p className="mt-2 text-sm text-slate-600">
            Difficulty: {sharedPayload.difficulty} • Seed: <code>{sharedPayload.seed}</code>
          </p>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {sharedPayload.roundScores.map((score, index) => (
              <div key={`${score}-${index}`} className="rounded-lg border border-slate-200 p-3 text-sm">
                <p className="text-slate-500">Round {index + 1}</p>
                <p className="font-semibold text-slate-900">{score.toLocaleString()} pts</p>
              </div>
            ))}
          </div>

          {shareCode ? (
            <Link to={`/?share=${encodeURIComponent(shareCode)}`} className="btn-primary mt-6 inline-block text-center">
              Play This Shared Seed
            </Link>
          ) : (
            <Link to="/" className="btn-primary mt-6 inline-block text-center">
              Start Your Own Run
            </Link>
          )}
        </section>
      </main>
    );
  }

  return <Navigate to="/" replace />;
}

export default ResultsPage;
