import { useEffect } from 'react';

type GoogleMarkerNamespace = {
  AdvancedMarkerElement: new (options: {
    map: google.maps.Map;
    position: google.maps.LatLngLiteral;
    content: HTMLElement;
    title?: string;
    zIndex?: number;
  }) => { map: google.maps.Map | null };
  PinElement: new (options: {
    background: string;
    borderColor: string;
    glyphColor: string;
    scale: number;
  }) => { element: HTMLElement };
};

type GoogleAdvancedMarkerProps = {
  map: google.maps.Map | null;
  position: google.maps.LatLngLiteral;
  background: string;
  borderColor: string;
  title?: string;
  zIndex?: number;
};

function getGoogleMarkerNamespace(): GoogleMarkerNamespace | null {
  const maps = google.maps as unknown as { marker?: GoogleMarkerNamespace };
  return maps.marker ?? null;
}

function GoogleAdvancedMarker({
  map,
  position,
  background,
  borderColor,
  title,
  zIndex,
}: GoogleAdvancedMarkerProps): null {
  useEffect(() => {
    if (!map) {
      return;
    }

    const markerNamespace = getGoogleMarkerNamespace();
    if (!markerNamespace) {
      return;
    }

    const pin = new markerNamespace.PinElement({
      background,
      borderColor,
      glyphColor: '#ffffff',
      scale: 1.1,
    });

    const marker = new markerNamespace.AdvancedMarkerElement({
      map,
      position,
      content: pin.element,
      title,
      zIndex,
    });

    return () => {
      marker.map = null;
    };
  }, [background, borderColor, map, position, title, zIndex]);

  return null;
}

export default GoogleAdvancedMarker;
