import TradingCardSetCard from "@/features/tradingCardSet/TradingCardSetCard";
import { compareSeasons } from "@/lib/seasons";
import { normalizeBrand } from "../../../../../shared/get-brand";

interface BrandSportTabProps {
  sport: "basketball" | "football";
  brand: string;
  yearGroups: Array<{
    year: string;
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
  }>;
}

export default function BrandSportTab({
  sport,
  brand,
  yearGroups,
}: BrandSportTabProps) {
  const allSets = yearGroups
    .flatMap((yearGroup) => yearGroup.sets)
    .sort(
      (a, b) =>
        compareSeasons(b.set.year, a.set.year) ||
        a.set.name.localeCompare(b.set.name)
    );

  if (allSets.length === 0) {
    return (
      <div className="binder px-6 py-14 text-center">
        <p className="font-display text-lg font-semibold tracking-tight">
          No {sport} sets
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Import a set to begin
        </p>
      </div>
    );
  }

  return (
    <div className="binder">
      {allSets.map((setWithStats, index) => {
        // Every row is this brand, so lead with the season and only show
        // the set name when it says something the page title doesn't.
        const { name, year } = setWithStats.set;
        const extraName =
          normalizeBrand(name) === normalizeBrand(brand) ? null : name;

        return (
          <TradingCardSetCard
            key={setWithStats.set.id}
            setWithStats={setWithStats}
            index={index}
            title={
              <>
                <span className="tabular-nums">{year}</span>
                {extraName && (
                  <span className="ml-2 font-sans text-xs font-normal tracking-normal text-muted-foreground">
                    {extraName}
                  </span>
                )}
              </>
            }
          />
        );
      })}
    </div>
  );
}
