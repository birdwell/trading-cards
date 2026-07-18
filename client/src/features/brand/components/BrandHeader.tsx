import BrandProgressBar from "./BrandProgressBar";

interface BrandHeaderProps {
  brand: string;
  overallStats: {
    totalSets: number;
    totalCards: number;
    totalOwnedCards: number;
    completionPercentage: number;
  };
}

export default function BrandHeader({ brand, overallStats }: BrandHeaderProps) {
  return (
    <section>
      <div className="grid gap-8 md:grid-cols-[1fr_240px] md:items-end">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Brand</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            {brand}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            {overallStats.totalSets} sets across your collection.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium text-muted-foreground">Completion</span>
            <span className="text-xl font-semibold tabular-nums">
              {overallStats.completionPercentage}%
            </span>
          </div>
          <div className="mt-4">
            <BrandProgressBar percentage={overallStats.completionPercentage} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {overallStats.totalOwnedCards} of {overallStats.totalCards} owned
          </p>
        </div>
      </div>
    </section>
  );
}
