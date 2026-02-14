import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import GuessMap from '../components/GuessMap';
import RoundActions from '../components/RoundActions';
import RoundSummary from '../components/RoundSummary';
import StreetViewViewer from '../components/StreetViewViewer';
import { ROUND_COUNT } from '../data/locations';
import { useGameStore } from '../store/game-store';

function PlayPage(): JSX.Element {
  const navigate = useNavigate();
  const [mapOpen, setMapOpen] = useState(true);

  const hasStarted = useGameStore((state) => state.hasStarted);
  const roundIndex = useGameStore((state) => state.roundIndex);
  const difficulty = useGameStore((state) => state.difficulty);
  const currentGuess = useGameStore((state) => state.currentGuess);
  const setGuess = useGameStore((state) => state.setGuess);
  const confirmGuess = useGameStore((state) => state.confirmGuess);
  const nextRound = useGameStore((state) => state.goNextRound);
  const roundLocations = useGameStore((state) => state.roundLocations);
  const roundResults = useGameStore((state) => state.roundResults);

  const currentLocation = useMemo(() => roundLocations[roundIndex] ?? null, [roundIndex, roundLocations]);
  const currentResult = useMemo(() => roundResults[roundIndex] ?? null, [roundIndex, roundResults]);

  const roundNumber = roundIndex + 1;
  const isFinalRound = roundNumber === ROUND_COUNT;
  const showingSummary = Boolean(currentResult);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !showingSummary && currentGuess) {
        confirmGuess();
      }

      const isSpace = event.code === 'Space' || event.key === ' ';
      if ((event.key === 'Enter' || event.key.toLowerCase() === 'n' || isSpace) && showingSummary) {
        event.preventDefault();
        if (isFinalRound) {
          navigate('/results');
        } else {
          nextRound();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [confirmGuess, currentGuess, isFinalRound, navigate, nextRound, showingSummary]);

  const runningTotal = useMemo(
    () => roundResults.reduce((sum, round) => sum + round.score, 0),
    [roundResults],
  );

  if (!hasStarted || !currentLocation) {
    return <Navigate to="/" replace />;
  }

  if (showingSummary && currentResult) {
    return (
      <main className="app-shell app-shell-play fade-in">
        <RoundSummary
          result={currentResult}
          isFinalRound={isFinalRound}
          onNext={() => {
            if (isFinalRound) {
              navigate('/results');
              return;
            }

            nextRound();
          }}
        />
      </main>
    );
  }

  return (
    <main className="app-shell app-shell-play fade-in gap-4">
      <header className="panel flex flex-wrap items-center justify-between gap-2 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Classic • {difficulty}</p>
          <h1 className="font-display text-2xl text-slate-900">
            Round {roundNumber} / {ROUND_COUNT}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-slate-500">Current total</p>
          <p className="text-2xl font-bold text-slate-900">{runningTotal.toLocaleString()}</p>
        </div>
      </header>

      <section className="grid flex-1 gap-4 lg:grid-cols-[1.45fr,1fr]">
        <StreetViewViewer lat={currentLocation.lat} lng={currentLocation.lng} />

        <div className="panel p-3 md:p-4">
          <div className="mb-2 flex items-center justify-between lg:hidden">
            <h2 className="font-semibold text-slate-900">Map</h2>
            <button type="button" className="btn-secondary px-3 py-2 text-sm" onClick={() => setMapOpen((v) => !v)}>
              {mapOpen ? 'Hide Map' : 'Show Map'}
            </button>
          </div>

          <div className={`${mapOpen ? 'block' : 'hidden'} lg:block`}>
            <GuessMap guess={currentGuess} onGuess={setGuess} />
            <p className="mt-2 text-xs text-slate-500">
              Explore the round in Street View, then tap/click on this map to place your final guess.
            </p>
          </div>
        </div>
      </section>

      <section className="panel space-y-3 p-4">
        <RoundActions hasGuess={Boolean(currentGuess)} onConfirm={confirmGuess} />
      </section>
    </main>
  );
}

export default PlayPage;
