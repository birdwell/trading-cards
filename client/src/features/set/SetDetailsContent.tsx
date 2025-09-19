import { useRouter } from "next/navigation";
import { Edit3 } from "lucide-react";
import { Card, TradingCardSet } from "@/types";
import { Card as UICard, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <div className="max-w-6xl mx-auto">
      <UICard className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <SetHeader set={set} />

            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleEditClick}
                className="gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </Button>
              <SetStats ownedCount={ownedCount} totalCount={totalCount} />
            </div>
          </div>
        </CardContent>
      </UICard>

      <section>
        <h2 className="text-2xl font-semibold mb-6">
          Cards ({totalCount})
        </h2>
        <CardGrid cards={cards} set={set} />
      </section>
    </div>
  );
}
