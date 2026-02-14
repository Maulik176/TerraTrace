export function formatKm(value: number): string {
  if (value < 1) {
    return `${Math.round(value * 1000)} m`;
  }

  return `${value.toLocaleString(undefined, {
    maximumFractionDigits: value < 100 ? 1 : 0,
  })} km`;
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
