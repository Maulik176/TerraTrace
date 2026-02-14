import { useMemo, useState } from 'react';

import type { PhotoAttribution } from '../types/game';

type PhotoViewerProps = {
  photos: PhotoAttribution[];
  round: number;
};

function PhotoViewer({ photos, round }: PhotoViewerProps): JSX.Element {
  const [index, setIndex] = useState(0);
  const [loadedMap, setLoadedMap] = useState<Record<number, boolean>>({});

  const activePhoto = useMemo(() => photos[index], [index, photos]);

  if (!activePhoto) {
    return (
      <section className="panel p-4">
        <p className="text-sm text-slate-500">No photos for this round.</p>
      </section>
    );
  }

  return (
    <section className="panel overflow-hidden">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200 md:aspect-[16/10]">
        {!loadedMap[index] ? <div className="absolute inset-0 animate-pulse bg-slate-300/70" /> : null}
        <img
          key={activePhoto.url}
          src={activePhoto.url}
          alt={`Round ${round} location photo ${index + 1}`}
          className="h-full w-full object-cover"
          onLoad={() => setLoadedMap((prev) => ({ ...prev, [index]: true }))}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-3 text-xs text-slate-100">
          <span className="font-medium">Photo by </span>
          <a
            href={activePhoto.photographerProfileUrl}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {activePhoto.photographerName}
          </a>
          <span> on </span>
          <a
            href={activePhoto.unsplashPhotoUrl}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Unsplash
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-3 py-3 md:px-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Round {round} photo {index + 1}/{photos.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary px-3 py-2 text-sm"
            onClick={() => setIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}
            aria-label="Previous photo"
          >
            Prev
          </button>
          <button
            type="button"
            className="btn-secondary px-3 py-2 text-sm"
            onClick={() => setIndex((prev) => (prev + 1) % photos.length)}
            aria-label="Next photo"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

export default PhotoViewer;
