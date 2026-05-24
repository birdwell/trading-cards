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

  const sorted = [...cards].sort((a, b) => a.cardNumber - b.cardNumber);

  return (
    <div className="grid grid-cols-1 gap-px bg-border/40 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sorted.map((card, i) => (
        <div
          key={card.id}
          className="rise bg-background"
          style={{ animationDelay: `${Math.min(i * 20, 480)}ms` }}
        >
          <SetCard card={card} />
        </div>
      ))}
    </div>
  );
}
