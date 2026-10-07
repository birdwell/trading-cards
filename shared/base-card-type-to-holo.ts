// Base-set rookie subsets ("Rated Rookie", "Rookies", ...) get Holo parallels
// just like the veterans in "Base".
const BASE_SET_ROOKIE_TYPE = /^(?:rated\s+)?rookies?$/i;

/**
 * Map a base-set card type to its Holo parallel type, or null when the card
 * is not part of the base set (inserts, autographs, or an existing parallel
 * such as "Base Red").
 *
 * - "Base" → "Holo"
 * - "Base - Rated Rookies" → "Holo - Rated Rookies"
 * - "Rated Rookie" → "Holo - Rated Rookie"
 */
export function baseCardTypeToHolo(cardType: string): string | null {
  const trimmed = cardType.trim().replace(/\s+/g, " ");

  if (/^base$/i.test(trimmed)) {
    return "Holo";
  }

  const dashed = trimmed.match(/^base\s*-\s*(.+)$/i);
  if (dashed) {
    return `Holo - ${dashed[1]}`;
  }

  const rookie = trimmed.replace(/^base\s+/i, "");
  if (BASE_SET_ROOKIE_TYPE.test(rookie)) {
    return `Holo - ${rookie}`;
  }

  return null;
}

type CardIdentity = {
  cardNumber: number;
  playerName: string;
  cardType: string;
};

/**
 * Holo cards a set is missing: one per base-set card whose Holo parallel
 * (same number, player, and holo type) doesn't exist yet.
 */
export function findMissingHoloCards(cards: CardIdentity[]): CardIdentity[] {
  const keyOf = (card: CardIdentity) =>
    `${card.cardNumber}|${card.playerName}|${card.cardType}`;
  const existing = new Set(cards.map(keyOf));
  const missing: CardIdentity[] = [];

  for (const card of cards) {
    const holoType = baseCardTypeToHolo(card.cardType);
    if (!holoType) continue;

    const holo = {
      cardNumber: card.cardNumber,
      playerName: card.playerName,
      cardType: holoType,
    };
    const key = keyOf(holo);
    if (existing.has(key)) continue;

    existing.add(key);
    missing.push(holo);
  }

  return missing;
}
