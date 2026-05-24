import { ArrowUpRight } from "lucide-react";
import BrandProgressBar from "./BrandProgressBar";

interface BrandSetCardProps {
  set: {
    id: number;
    name: string;
    year: string;
    sport: string;
  };
  stats: {
    totalCards: number;
    ownedCards: number;
  };
  onSetClick: (setId: number) => void;
}

export default function BrandSetCard({
  set,
  stats,
  onSetClick,
}: BrandSetCardProps) {
  const percentage =
    stats.totalCards > 0
      ? Math.round((stats.ownedCards / stats.totalCards) * 100)
      : 0;

  return (
    <button
      type="button"
      onClick={() => onSetClick(set.id)}
      className="group w-full border border-border/70 bg-card/30 p-5 text-left transition-all hover:border-foreground/40 hover:bg-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span className="font-mono-tight text-xs tabular-nums text-muted-foreground">
            {set.year}
          </span>
          <h4 className="mt-1 font-display text-xl font-light leading-tight tracking-tight">
            {set.name}
          </h4>
        </div>
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {stats.ownedCards} / {stats.totalCards}
          </span>
          <span className="font-mono-tight text-xs tabular-nums">
            {percentage}%
          </span>
        </div>
        <BrandProgressBar percentage={percentage} />
      </div>
    </button>
  );
}
