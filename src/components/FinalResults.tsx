import { useMemo, useState } from 'react';

import { formatDateTime, formatKm } from '../lib/format';
import type { Difficulty, LeaderboardEntry, RoundResult } from '../types/game';

type FinalResultsProps = {
  difficulty: Difficulty;
  seed: string;
  totalScore: number;
  rounds: RoundResult[];
  leaderboard: LeaderboardEntry[];
  shareLink: string;
};

function difficultyLabel(difficulty: Difficulty): string {
  if (difficulty === 'EASY') return 'Easy';
  if (difficulty === 'HARD') return 'Hard';
  return 'Medium';
}

function FinalResults({
  difficulty,
  seed,
  totalScore,
  rounds,
  leaderboard,
  shareLink,
}: FinalResultsProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const maxRoundScore = useMemo(
    () => rounds.reduce((max, round) => Math.max(max, round.score), 1),
    [rounds],
  );

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
      <section className="panel p-4 md:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Final Score</p>
        <h1 className="font-display text-4xl text-slate-900">{totalScore.toLocaleString()}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {difficultyLabel(difficulty)} difficulty • seed <code>{seed}</code>
        </p>

        <div className="mt-5 space-y-3">
          {rounds.map((round) => (
            <article key={round.round} className="rounded-xl border border-slate-200 p-3">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-900">Round {round.round}</span>
                <span className="text-slate-600">{round.score.toLocaleString()} pts</span>
              </div>
              <div className="h-2 overflow-hidden rounded bg-slate-200">
                <div
                  className="h-full rounded bg-sky-500"
                  style={{ width: `${(round.score / maxRoundScore) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Distance: {formatKm(round.distanceKm)} • {round.revealedTitle} ({round.countryCode})
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <article className="panel p-4">
          <h2 className="font-display text-lg text-slate-900">Share Result</h2>
          <p className="mt-1 text-sm text-slate-600">Copy this link to share your run metadata.</p>
          <input
            readOnly
            value={shareLink}
            className="mt-3 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-700"
            aria-label="Share link"
          />
          <button type="button" className="btn-primary mt-3 w-full" onClick={onCopy}>
            {copied ? 'Copied' : 'Copy Share Link'}
          </button>
        </article>

        <article className="panel p-4">
          <h2 className="font-display text-lg text-slate-900">Local Leaderboard</h2>
          <ol className="mt-3 space-y-2 text-sm">
            {leaderboard.length === 0 ? <li className="text-slate-500">No scores saved yet.</li> : null}
            {leaderboard.map((entry, i) => (
              <li key={entry.id} className="rounded-lg border border-slate-200 p-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    #{i + 1} {entry.totalScore.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500">{entry.difficulty}</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">{formatDateTime(entry.createdAt)}</div>
              </li>
            ))}
          </ol>
        </article>
      </section>
    </div>
  );
}

export default FinalResults;
