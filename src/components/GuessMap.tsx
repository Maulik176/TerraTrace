import { useCallback, useMemo, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';

import GoogleAdvancedMarker from './GoogleAdvancedMarker';
import { useGoogleMapsLoader } from '../lib/google-maps-loader';
import type { Coordinates } from '../types/game';

type GuessMapProps = {
  guess: Coordinates | null;
  onGuess: (coords: Coordinates) => void;
  locked?: boolean;
};

const WORLD_CENTER: google.maps.LatLngLiteral = { lat: 20, lng: 0 };
const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' } as const;

function GuessMap({ guess, onGuess, locked = false }: GuessMapProps): JSX.Element {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';
  const { isLoaded } = useGoogleMapsLoader(apiKey);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const options = useMemo<google.maps.MapOptions>(
    () => ({
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      clickableIcons: false,
      gestureHandling: 'greedy',
      mapId,
    }),
    [mapId],
  );

  const onMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (locked) {
        return;
      }

      const clickedLat = event.latLng?.lat();
      const clickedLng = event.latLng?.lng();

      if (typeof clickedLat !== 'number' || typeof clickedLng !== 'number') {
        return;
      }

      onGuess({ lat: clickedLat, lng: clickedLng });
    },
    [locked, onGuess],
  );

  if (!apiKey) {
    return (
      <div className="flex h-[42vh] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600 md:h-[52vh] lg:h-[68vh]">
        Add `VITE_GOOGLE_MAPS_EMBED_API_KEY` to enable the guess map.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-[42vh] animate-pulse rounded-2xl border border-slate-200 bg-slate-100 md:h-[52vh] lg:h-[68vh]" />
    );
  }

  return (
    <div className="h-[42vh] overflow-hidden rounded-2xl border border-slate-200 md:h-[52vh] lg:h-[68vh]">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={WORLD_CENTER}
        zoom={2}
        options={options}
        onClick={onMapClick}
        onLoad={setMap}
      >
        {guess ? (
          <GoogleAdvancedMarker
            map={map}
            position={guess}
            background="#0284c7"
            borderColor="#0c4a6e"
            title="Your guess"
            zIndex={20}
          />
        ) : null}
      </GoogleMap>
    </div>
  );
}

export default GuessMap;
