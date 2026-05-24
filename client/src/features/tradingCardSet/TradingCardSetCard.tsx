import { SetWithStats } from "../../types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Trash2 } from "lucide-react";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";

interface TradingCardSetCardProps {
  setWithStats: SetWithStats;
  onDeleted?: () => void;
  index?: number;
}

export default function TradingCardSetCard({
  setWithStats,
  onDeleted,
  index,
}: TradingCardSetCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const { set, stats } = setWithStats;
  const percentage =
    stats.totalCards > 0 ? (stats.ownedCards / stats.totalCards) * 100 : 0;
  const sportIcon = set.sport.toLowerCase() === "basketball" ? "●" : "▲";

  const handleViewCards = () => {
    router.push(`/set/${set.id}`);
  };

  return (
    <article className="group relative border border-border/70 bg-card/30 transition-all duration-300 hover:border-foreground/40 hover:bg-card">
      {/* Top bar: index + sport */}
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
        <div className="flex items-center gap-3 font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {typeof index === "number" && (
            <span className="tabular-nums">
              No. {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-1.5">
            <span className="text-foreground/70">{sportIcon}</span>
            {set.sport}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowConfirmDelete(true);
          }}
          disabled={isDeleting}
          aria-label="Delete set"
          className="-mr-1.5 rounded p-1.5 text-muted-foreground/60 opacity-0 transition-all hover:text-destructive group-hover:opacity-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Clickable body */}
      <button
        onClick={handleViewCards}
        className="block w-full cursor-pointer text-left"
      >
        <div className="px-5 pb-5 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <span className="font-mono-tight text-xs tabular-nums text-muted-foreground">
                {set.year}
              </span>
              <h3 className="mt-1 font-display text-2xl font-light leading-tight tracking-tight">
                {set.name}
              </h3>
            </div>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="eyebrow">Progress</span>
              <span className="font-mono-tight text-xs tabular-nums text-foreground/80">
                {stats.ownedCards}
                <span className="text-muted-foreground"> / {stats.totalCards}</span>
              </span>
            </div>

            <div className="relative h-px w-full bg-border">
              <div
                className="absolute left-0 top-0 h-px bg-foreground transition-all duration-500"
                style={{ width: `${Math.max(percentage, 0)}%` }}
              />
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {stats.totalCards > 0 ? `${Math.round(percentage)}% complete` : "—"}
              </span>
              {percentage === 100 && (
                <span className="font-mono-tight text-[10px] uppercase tracking-[0.22em] text-accent">
                  Complete
                </span>
              )}
            </div>
          </div>
        </div>
      </button>

      {showConfirmDelete && (
        <ConfirmDeleteDialog
          set={set}
          onCancel={() => setShowConfirmDelete(false)}
          onSuccess={() => {
            setIsDeleting(false);
            onDeleted?.();
          }}
          onError={(msg) => {
            setIsDeleting(false);
            alert(msg);
          }}
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
        />
      )}
    </article>
  );
}
