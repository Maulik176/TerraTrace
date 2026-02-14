import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

import { GUESS_MARKER_ICON } from '../lib/map-icons';
import type { Coordinates } from '../types/game';

type GuessMapProps = {
  guess: Coordinates | null;
  onGuess: (coords: Coordinates) => void;
  locked?: boolean;
};

function EnsureMapSize(): null {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [map]);

  return null;
}

function GuessPinSetter({
  onGuess,
  locked,
}: {
  onGuess: (coords: Coordinates) => void;
  locked: boolean;
}): null {
  useMapEvents({
    click(event) {
      if (locked) {
        return;
      }

      onGuess({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });

  return null;
}

function GuessMap({ guess, onGuess, locked = false }: GuessMapProps): JSX.Element {
  return (
    <div className="h-[42vh] overflow-hidden rounded-2xl border border-slate-200 md:h-[52vh] lg:h-[68vh]">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        worldCopyJump
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <EnsureMapSize />
        <GuessPinSetter onGuess={onGuess} locked={locked} />
        {guess ? <Marker position={[guess.lat, guess.lng]} icon={GUESS_MARKER_ICON} /> : null}
      </MapContainer>
    </div>
  );
}

export default GuessMap;
