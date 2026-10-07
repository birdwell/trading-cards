// "2024-25" and "2024" share a start year; the split season ends later.
export function compareSeasons(a: string, b: string): number {
  const startA = Number.parseInt(a, 10) || 0;
  const startB = Number.parseInt(b, 10) || 0;
  if (startA !== startB) return startA - startB;
  return a.length - b.length || a.localeCompare(b);
}
