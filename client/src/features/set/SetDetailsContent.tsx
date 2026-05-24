import { useRouter } from "next/navigation";
import { ChevronLeft, Edit3 } from "lucide-react";
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

  return (
    <div className="mx-auto max-w-7xl">
      {/* Back link */}
      <button
        onClick={() => {
          if (window.history.length > 1) {
            router.back();
          } else {
            router.push("/");
          }
        }}
        className="group mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        <span className="font-mono-tight uppercase tracking-[0.22em] text-[10px]">
          Back to collection
        </span>
      </button>

      {/* Editorial masthead */}
      <section className="rise border-b border-border/60 pb-10">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SetHeader set={set} />
          </div>

          <div className="md:col-span-4 md:pl-8 md:border-l md:border-border/60">
            <SetStats ownedCount={ownedCount} totalCount={totalCount} />
            <button
              onClick={() => router.push(`/set/${set.id}/edit`)}
              className="group mt-6 inline-flex w-full items-center justify-between gap-3 border border-border bg-card/40 px-4 py-3 text-sm transition-colors hover:border-foreground/60 hover:bg-card"
            >
              <span className="flex items-baseline gap-3">
                <Edit3 className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                <span className="font-medium tracking-tight">Edit set</span>
              </span>
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Manage
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Cards index */}
      <section className="py-10 md:py-14">
        <div className="mb-6 flex items-baseline justify-between">
          <div className="flex items-baseline gap-4">
            <span className="font-mono-tight text-[10px] tracking-[0.28em] text-muted-foreground">
              §
            </span>
            <h2 className="font-display text-2xl font-light tracking-tight">
              Checklist
            </h2>
            <span className="font-mono-tight text-xs tabular-nums text-muted-foreground">
              ({totalCount})
            </span>
          </div>
          <span className="hidden md:inline font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Tap a card to toggle ownership
          </span>
        </div>

        <CardGrid cards={cards} set={set} />
      </section>
    </div>
  );
}
