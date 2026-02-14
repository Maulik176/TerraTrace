import { useEffect } from 'react';
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';

import { formatKm } from '../lib/format';
import { GUESS_MARKER_ICON, TARGET_MARKER_ICON } from '../lib/map-icons';
import type { RoundResult } from '../types/game';

function FitBounds({ result }: { result: RoundResult }): null {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(
      [
        [result.guess.lat, result.guess.lng],
        [result.target.lat, result.target.lng],
      ],
      {
        padding: [30, 30],
        maxZoom: 5,
      },
    );
  }, [map, result.guess.lat, result.guess.lng, result.target.lat, result.target.lng]);

  return null;
}

type RoundSummaryProps = {
  result: RoundResult;
  onNext: () => void;
  isFinalRound: boolean;
};

function RoundSummary({ result, onNext, isFinalRound }: RoundSummaryProps): JSX.Element {
  return (
    <section className="panel flex flex-col gap-4 p-4 md:p-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Round {result.round}</p>
        <h2 className="font-display text-2xl text-slate-900">{result.revealedTitle}</h2>
        <p className="text-sm text-slate-600">Country: {result.countryCode}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-sky-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Distance</p>
          <p className="text-2xl font-bold text-slate-900">{formatKm(result.distanceKm)}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Score</p>
          <p className="text-2xl font-bold text-slate-900">{result.score.toLocaleString()}</p>
        </div>
      </div>

      <div className="h-64 overflow-hidden rounded-2xl border border-slate-200">
        <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds result={result} />
          <Marker position={[result.guess.lat, result.guess.lng]} icon={GUESS_MARKER_ICON} />
          <Marker position={[result.target.lat, result.target.lng]} icon={TARGET_MARKER_ICON} />
          <Polyline
            positions={[
              [result.guess.lat, result.guess.lng],
              [result.target.lat, result.target.lng],
            ]}
            color="#0ea5e9"
          />
        </MapContainer>
      </div>

      <button type="button" className="btn-primary" onClick={onNext}>
        {isFinalRound ? 'View Final Results' : 'Next Round'}
      </button>
    </section>
  );
}

export default RoundSummary;
