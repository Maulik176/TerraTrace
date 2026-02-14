import { Icon } from 'leaflet';

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createPinIcon(fill: string, stroke: string): Icon {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
      <ellipse cx="14" cy="36.5" rx="8" ry="2.5" fill="rgba(15,23,42,0.22)" />
      <path d="M14 1.5C7.373 1.5 2 6.873 2 13.5c0 8.697 10.678 23.523 11.795 25.047a.25.25 0 0 0 .41 0C15.322 37.023 26 22.197 26 13.5 26 6.873 20.627 1.5 14 1.5Z" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <circle cx="14" cy="13.5" r="5.2" fill="white"/>
      <circle cx="14" cy="13.5" r="2.1" fill="${stroke}"/>
    </svg>
  `;

  return new Icon({
    iconUrl: svgToDataUri(svg),
    iconRetinaUrl: svgToDataUri(svg),
    iconSize: [28, 40],
    iconAnchor: [14, 39],
    popupAnchor: [0, -34],
  });
}

export const GUESS_MARKER_ICON = createPinIcon('#0284c7', '#0c4a6e');
export const TARGET_MARKER_ICON = createPinIcon('#16a34a', '#14532d');
