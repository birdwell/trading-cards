import { ChevronLeft } from "lucide-react";
import BrandProgressBar from "./BrandProgressBar";

interface BrandHeaderProps {
  brand: string;
  overallStats: {
    totalSets: number;
    totalCards: number;
    totalOwnedCards: number;
    completionPercentage: number;
  };
  onBackToBrands: () => void;
}

export default function BrandHeader({
  brand,
  overallStats,
  onBackToBrands,
}: BrandHeaderProps) {
  return (
    <section className="rise border-b border-border/60 pb-10">
      <button
        onClick={onBackToBrands}
        className="group mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        <span className="font-mono-tight uppercase tracking-[0.22em] text-[10px]">
          Back to brands
        </span>
      </button>

      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <div className="eyebrow mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-foreground/40" />
            <span>Publisher</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-[0.95] tracking-tight">
            {brand}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Every set from this brand across basketball and football.
          </p>
        </div>

        <div className="md:col-span-4 md:border-l md:border-border/60 md:pl-8">
          <div className="eyebrow mb-3">Completion</div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-5xl font-light tracking-tight tabular-nums">
              {overallStats.completionPercentage}
            </span>
            <span className="font-mono-tight text-sm text-muted-foreground">
              %
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between font-mono-tight text-xs tabular-nums text-foreground/80">
            <span>
              {overallStats.totalOwnedCards}
              <span className="text-muted-foreground">
                {" "}
                / {overallStats.totalCards}
              </span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {overallStats.totalSets} sets
            </span>
          </div>
          <div className="mt-3">
            <BrandProgressBar percentage={overallStats.completionPercentage} />
          </div>
        </div>
      </div>
    </section>
  );
}
