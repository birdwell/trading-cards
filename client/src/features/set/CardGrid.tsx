import EmptyState from "@/components/EmptyState";
import SetCard from "./SetCard";
import { Card, TradingCardSet } from "@/types";

interface CardGridProps {
  cards: Card[];
  set: TradingCardSet;
}

export default function CardGrid({ cards, set }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <EmptyState message="No cards found in this set." />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <SetCard key={card.id} card={card} />
      ))}
    </div>
  );
}
