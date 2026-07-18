import EmptyState from "@/components/EmptyState";
import SetCard from "./SetCard";
import { Card, TradingCardSet } from "@/types";

interface CardGridProps {
  cards: Card[];
  set: TradingCardSet;
}

export default function CardGrid({ cards, set: _set }: CardGridProps) {
  if (cards.length === 0) {
    return <EmptyState message="No cards found in this set." />;
  }

  const sorted = [...cards].sort((a, b) => {
    if (a.cardNumber !== b.cardNumber) {
      return a.cardNumber - b.cardNumber;
    }
    return a.cardType.localeCompare(b.cardType);
  });

  return (
    <div className="binder">
      {sorted.map((card) => (
        <SetCard key={card.id} card={card} />
      ))}
    </div>
  );
}
