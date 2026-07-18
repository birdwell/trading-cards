/** Map Base / Base-* types to Holo / Holo-*. Returns null if not a base type. */
export function baseCardTypeToHolo(cardType: string): string | null {
  const trimmed = cardType.trim();
  if (/^base$/i.test(trimmed)) {
    return "Holo";
  }
  if (/^base\b/i.test(trimmed)) {
    return trimmed.replace(/^base/i, "Holo");
  }
  return null;
}
