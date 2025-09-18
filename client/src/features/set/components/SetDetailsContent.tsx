import { Card, TradingCardSet } from "../../../types";
import SetHeader from "./SetHeader";
import SetStats from "./SetStats";
import CardGrid from "./CardGrid";

interface SetDetailsContentProps {
  set: TradingCardSet;
  cards: Card[];
}

export default function SetDetailsContent({ set, cards }: SetDetailsContentProps) {
  const ownedCount = cards.filter(card => card.isOwned).length;
  const totalCount = cards.length;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <SetHeader set={set} />
          
          <div className="mt-4 md:mt-0">
            <SetStats ownedCount={ownedCount} totalCount={totalCount} />
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Cards ({totalCount})
        </h2>
        <CardGrid cards={cards} set={set} />
      </section>
    </>
  );
}
