import { useRouter } from "next/navigation";
import { Edit3 } from "lucide-react";
import { Card, TradingCardSet } from "@/types";
import SetHeader from "./SetHeader";
import SetStats from "./SetStats";
import CardGrid from "./CardGrid";
import { AddHolosButton, AddHolosPanel, useAddHolos } from "./AddHolos";

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
  const holos = useAddHolos(set.id, cards);

  return (
    <div>
      <section className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-muted-foreground">
            {set.sport} · {set.year}
          </p>
          <SetStats ownedCount={ownedCount} totalCount={totalCount} />
        </div>

        <div className="flex items-center justify-between gap-3">
          <SetHeader set={set} />
          <div className="flex shrink-0 items-center gap-2">
            <AddHolosButton holos={holos} />
            <button
              type="button"
              onClick={() => router.push(`/set/${set.id}/edit`)}
              aria-label="Edit set"
              className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-border px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Edit3 className="h-3 w-3" />
              Edit
            </button>
          </div>
        </div>

        <AddHolosPanel holos={holos} />
      </section>

      <section className="pt-4">
        <CardGrid cards={cards} set={set} />
      </section>
    </div>
  );
}
