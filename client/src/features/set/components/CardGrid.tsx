import { Card, TradingCardSet } from "../../../types";
import SetCard from "./SetCard";

interface CardGridProps {
  cards: Card[];
  set: TradingCardSet;
}

export default function CardGrid({ cards, set }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No cards found in this set.
        </p>
      </div>
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
