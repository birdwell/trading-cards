import { useRouter } from "next/navigation";
import { Edit3 } from "lucide-react";
import { Card, TradingCardSet } from "@/types";
import SetHeader from "./SetHeader";
import SetStats from "./SetStats";
import CardGrid from "./CardGrid";

interface SetDetailsContentProps {
  set: TradingCardSet;
  cards: Card[];
}

export default function SetDetailsContent({
  set,
  cards,
}: SetDetailsContentProps) {
  const ownedCount = cards.filter((card) => card.isOwned).length;
  const totalCount = cards.length;
  const router = useRouter();

  const handleEditClick = () => {
    router.push(`/set/${set.id}/edit`);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <SetHeader set={set} />

          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <button
              onClick={handleEditClick}
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-3 rounded-lg transition-colors duration-200"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
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
