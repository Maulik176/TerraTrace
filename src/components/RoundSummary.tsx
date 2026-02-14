import { useEffect, useMemo, useState } from 'react';
import { GoogleMap, PolylineF } from '@react-google-maps/api';

import GoogleAdvancedMarker from './GoogleAdvancedMarker';
import { formatKm } from '../lib/format';
import { useGoogleMapsLoader } from '../lib/google-maps-loader';
import type { RoundResult } from '../types/game';

const WORLD_CENTER: google.maps.LatLngLiteral = { lat: 20, lng: 0 };
const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' } as const;

type RoundSummaryProps = {
  result: RoundResult;
  onNext: () => void;
  isFinalRound: boolean;
};

function RoundSummary({ result, onNext, isFinalRound }: RoundSummaryProps): JSX.Element {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';
  const { isLoaded } = useGoogleMapsLoader(apiKey);

  const polylinePath = useMemo(() => [result.guess, result.target], [result.guess, result.target]);

  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(result.guess);
    bounds.extend(result.target);
    map.fitBounds(bounds, 80);
  }, [isLoaded, map, result.guess, result.target]);

  const options = useMemo<google.maps.MapOptions>(
    () => ({
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      clickableIcons: false,
      minZoom: 2,
      mapId,
    }),
    [mapId],
  );

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
        {!apiKey ? (
          <div className="flex h-full items-center justify-center bg-slate-50 p-4 text-center text-sm text-slate-600">
            Add `VITE_GOOGLE_MAPS_EMBED_API_KEY` to show the result map.
          </div>
        ) : !isLoaded ? (
          <div className="h-full animate-pulse bg-slate-100" />
        ) : (
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={WORLD_CENTER}
            zoom={2}
            options={options}
            onLoad={setMap}
          >
            <GoogleAdvancedMarker
              map={map}
              position={result.guess}
              background="#0284c7"
              borderColor="#0c4a6e"
              title="Your guess"
              zIndex={20}
            />
            <GoogleAdvancedMarker
              map={map}
              position={result.target}
              background="#16a34a"
              borderColor="#14532d"
              title="Actual location"
              zIndex={30}
            />
            <PolylineF
              path={polylinePath}
              options={{
                strokeColor: '#0ea5e9',
                strokeOpacity: 1,
                strokeWeight: 3,
                geodesic: true,
              }}
            />
          </GoogleMap>
        )}
      </div>

      <button type="button" className="btn-primary" onClick={onNext}>
        {isFinalRound ? 'View Final Results' : 'Next Round'}
      </button>
    </section>
  );
}

export default RoundSummary;
