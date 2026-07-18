import { ChevronRight } from "lucide-react";
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
      className="group w-full rounded-lg border border-border bg-card p-5 text-left transition-colors hover:border-foreground/30"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <span className="text-xs font-medium text-muted-foreground">{set.year}</span>
          <h4 className="mt-1 text-base font-semibold leading-6">
            {set.name}
          </h4>
        </div>
        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {stats.ownedCards} / {stats.totalCards}
          </span>
          <span className="tabular-nums">{percentage}%</span>
        </div>
        <BrandProgressBar percentage={percentage} />
      </div>
    </button>
  );
}
