import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface TradingCardSetCardProps {
  setWithStats: {
    set: { id: number; name: string };
    stats: { ownedCards: number; totalCards: number };
  };
  index?: number;
  /** Replaces the set name, e.g. the season on a brand page. */
  title?: ReactNode;
}

export default function TradingCardSetCard({
  setWithStats,
  index = 0,
  title,
}: TradingCardSetCardProps) {
  const router = useRouter();

  const { set, stats } = setWithStats;
  const percentage =
    stats.totalCards > 0 ? (stats.ownedCards / stats.totalCards) * 100 : 0;

  return (
    <article
      className="rise border-b border-border/70 last:border-b-0"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <button
        type="button"
        onClick={() => router.push(`/set/${set.id}`)}
        className="group flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.03] sm:gap-4 sm:px-5"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display truncate text-[0.95rem] font-semibold tracking-tight text-foreground transition-colors group-hover:text-white">
              {title ?? set.name}
            </h3>
            <span className="shrink-0 font-mono-tight text-xs tabular-nums text-muted-foreground">
              <span className="text-foreground/90">{stats.ownedCards}</span>
              <span className="text-muted-foreground/70">
                /{stats.totalCards}
              </span>
            </span>
          </div>
          <div className="foil-track mt-2.5">
            <div
              className="foil-fill"
              style={{ width: `${Math.max(percentage, 0)}%` }}
            />
          </div>
        </div>
        <ChevronRight
          className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-foil"
          aria-hidden
        />
      </button>
    </article>
  );
}
