import { useMemo, useState } from 'react';

type StreetViewViewerProps = {
  lat: number;
  lng: number;
};

function StreetViewViewer({ lat, lng }: StreetViewViewerProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY as string | undefined;
  const spoilerCropPx = 78;

  const directStreetViewUrl = useMemo(() => {
    return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
  }, [lat, lng]);

  const embedStreetViewUrl = useMemo(() => {
    if (!apiKey) {
      return '';
    }

    return `https://www.google.com/maps/embed/v1/streetview?key=${encodeURIComponent(apiKey)}&location=${lat},${lng}&heading=210&pitch=0&fov=80`;
  }, [apiKey, lat, lng]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(directStreetViewUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="panel overflow-hidden">
      {apiKey ? (
        <div className="relative h-[42vh] w-full overflow-hidden bg-slate-200 md:h-[52vh] lg:h-[68vh]">
          <iframe
            title="Google Street View exploration"
            src={embedStreetViewUrl}
            className="absolute left-0 top-0 w-full border-0"
            style={{
              height: `calc(100% + ${spoilerCropPx}px)`,
              transform: `translateY(-${spoilerCropPx}px)`,
            }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 h-24 w-72 bg-slate-900"
            style={{ zIndex: 2147483647 }}
          />
        </div>
      ) : (
        <div className="relative flex h-[42vh] w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 text-white md:h-[52vh] md:p-8 lg:h-[68vh]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Street View</p>
            <h2 className="mt-2 font-display text-3xl">API Key Required For Inline View</h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-200">
              Add `VITE_GOOGLE_MAPS_EMBED_API_KEY` in your `.env` file to enable the interactive embedded Street View pane.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2 px-3 py-3 md:px-4">
        <a href={directStreetViewUrl} target="_blank" rel="noreferrer" className="btn-primary text-center text-sm">
          Open Street View In New Tab
        </a>
        <button type="button" onClick={onCopy} className="btn-secondary text-sm">
          {copied ? 'Street View Link Copied' : 'Copy Street View Link'}
        </button>
      </div>
    </section>
  );
}

export default StreetViewViewer;
