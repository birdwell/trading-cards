import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import BrandProgressBar from "./components/BrandProgressBar";

interface BrandOverviewProps {
  brands: Array<{
    brand: string;
    sets: Array<{
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
    }>;
    overallStats: {
      totalSets: number;
      totalCards: number;
      totalOwnedCards: number;
      completionPercentage: number;
    };
  }>;
}

export default function BrandOverviewGrid({ brands }: BrandOverviewProps) {
  const router = useRouter();

  if (brands.length === 0) {
    return (
      <div className="border border-dashed border-border/80 py-16 text-center">
        <p className="font-display text-xl font-light text-foreground/80">
          No brands on file yet.
        </p>
        <p className="mt-2 font-mono-tight text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Import a set to begin
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-px bg-border/40 sm:grid-cols-2 lg:grid-cols-3">
      {brands.map((brand, i) => {
        const years = [...new Set(brand.sets.map((s) => s.set.year))]
          .sort()
          .reverse();

        return (
          <button
            key={brand.brand}
            type="button"
            onClick={() =>
              router.push(`/brands/${encodeURIComponent(brand.brand)}`)
            }
            className="group rise border border-border/70 bg-card/30 p-6 text-left transition-all hover:border-foreground/40 hover:bg-card"
            style={{ animationDelay: `${Math.min(i * 40, 320)}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {brand.overallStats.totalSets}{" "}
                  {brand.overallStats.totalSets === 1 ? "set" : "sets"}
                </span>
                <h3 className="mt-1 font-display text-2xl font-light tracking-tight">
                  {brand.brand}
                </h3>
              </div>
              <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="eyebrow">Progress</span>
                <span className="font-mono-tight text-xs tabular-nums">
                  {brand.overallStats.completionPercentage}%
                </span>
              </div>
              <BrandProgressBar
                percentage={brand.overallStats.completionPercentage}
              />
            </div>

            <div className="mt-4 flex items-baseline justify-between font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <span>
                {brand.overallStats.totalOwnedCards} /{" "}
                {brand.overallStats.totalCards} cards
              </span>
              {years.length > 0 && (
                <span className="tabular-nums">
                  {years.slice(0, 3).join(" · ")}
                  {years.length > 3 ? " …" : ""}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
