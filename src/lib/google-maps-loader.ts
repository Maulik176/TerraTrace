import { useMemo } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_LOADER_ID = 'google-maps-js-loader';
const GOOGLE_MAPS_LIBRARIES: ('marker')[] = ['marker'];

export function useGoogleMapsLoader(apiKey?: string): { isLoaded: boolean } {
  const loaderOptions = useMemo(
    () => ({
      id: GOOGLE_MAPS_LOADER_ID,
      googleMapsApiKey: apiKey ?? '',
      libraries: GOOGLE_MAPS_LIBRARIES,
    }),
    [apiKey],
  );

  return useJsApiLoader(loaderOptions);
}
