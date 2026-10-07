import EmptyState from "@/components/EmptyState";
import SetCard from "./SetCard";
import { Card, TradingCardSet } from "@/types";

interface CardGridProps {
  cards: Card[];
  set: TradingCardSet;
}

const isHolo = (card: Card) => /^holo\b/i.test(card.cardType.trim());

// Inside a section the "Base" / "Holo" prefix repeats the section itself;
// keep only what sets a card apart, e.g. "Rated Rookies".
function sectionTypeLabel(cardType: string): string {
  return cardType
    .trim()
    .replace(/^(base|holo)$/i, "")
    .replace(/^(base|holo)\s*-\s*/i, "");
}

function byNumberThenType(a: Card, b: Card) {
  if (a.cardNumber !== b.cardNumber) {
    return a.cardNumber - b.cardNumber;
  }
  return a.cardType.localeCompare(b.cardType);
}

export default function CardGrid({ cards, set: _set }: CardGridProps) {
  if (cards.length === 0) {
    return <EmptyState message="No cards found in this set." />;
  }

  const sorted = [...cards].sort(byNumberThenType);
  const baseCards = sorted.filter((card) => !isHolo(card));
  const holoCards = sorted.filter(isHolo);
  const holoOwned = holoCards.filter((card) => card.isOwned).length;

  return (
    <div className="space-y-6">
      {baseCards.length > 0 && (
        <div className="binder">
          {baseCards.map((card) => (
            <SetCard
              key={card.id}
              card={card}
              typeLabel={sectionTypeLabel(card.cardType)}
            />
          ))}
        </div>
      )}

      {holoCards.length > 0 && (
        <section aria-labelledby="holo-cards-heading">
          <div className="mb-2.5 flex items-baseline justify-between gap-3 px-1">
            <h2
              id="holo-cards-heading"
              className="font-display text-base font-semibold tracking-tight"
            >
              Holo
            </h2>
            <span className="font-mono-tight text-xs tabular-nums text-muted-foreground">
              <span className="text-foreground/90">{holoOwned}</span>
              <span className="text-muted-foreground/70">/{holoCards.length}</span>
              <span className="sr-only"> owned</span>
            </span>
          </div>
          <div className="binder">
            {holoCards.map((card) => (
              <SetCard
                key={card.id}
                card={card}
                typeLabel={sectionTypeLabel(card.cardType)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
