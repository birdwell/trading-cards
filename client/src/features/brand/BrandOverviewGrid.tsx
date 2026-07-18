import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
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
      <div className="rounded-lg border border-dashed border-border px-6 py-16 text-center">
        <p className="text-base font-medium">No brands yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Import a set to begin
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {brands.map((brand) => {
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
            className="group rounded-lg border border-border bg-card p-5 text-left transition-colors hover:border-foreground/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  {brand.overallStats.totalSets}{" "}
                  {brand.overallStats.totalSets === 1 ? "set" : "sets"}
                </span>
                <h3 className="mt-1 text-base font-semibold">
                  {brand.brand}
                </h3>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">Progress</span>
                <span className="tabular-nums text-muted-foreground">
                  {brand.overallStats.completionPercentage}%
                </span>
              </div>
              <BrandProgressBar
                percentage={brand.overallStats.completionPercentage}
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {brand.overallStats.totalOwnedCards} /{" "}
                {brand.overallStats.totalCards} cards
              </span>
              {years.length > 0 && (
                <span className="tabular-nums">
                  {years.slice(0, 2).join(", ")}
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
