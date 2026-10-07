import { getBrand, normalizeBrand } from "../../../../shared/get-brand";
import type { SetWithStats } from "@/types";
import { compareSeasons } from "@/lib/seasons";

export type BrandOverviewItem = {
  brand: string;
  /** Oldest season first. */
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
  /** Distinct season labels, oldest first. */
  seasons: string[];
  overallStats: {
    totalSets: number;
    totalCards: number;
    totalOwnedCards: number;
    completionPercentage: number;
  };
};

export function buildBrandOverview(
  setsWithStats: SetWithStats[]
): BrandOverviewItem[] {
  const brandMap = new Map<
    string,
    {
      sets: BrandOverviewItem["sets"];
      totalCards: number;
      totalOwnedCards: number;
    }
  >();

  for (const { set, stats } of setsWithStats) {
    const brand = normalizeBrand(getBrand(set.name));
    if (!brandMap.has(brand)) {
      brandMap.set(brand, { sets: [], totalCards: 0, totalOwnedCards: 0 });
    }

    const entry = brandMap.get(brand)!;
    entry.sets.push({
      set: {
        id: set.id,
        name: set.name,
        year: set.year,
        sport: set.sport,
      },
      stats: {
        totalCards: stats.totalCards,
        ownedCards: stats.ownedCards,
      },
    });
    entry.totalCards += stats.totalCards;
    entry.totalOwnedCards += stats.ownedCards;
  }

  return Array.from(brandMap.entries())
    .map(([brand, data]) => {
      const sets = data.sets
        .slice()
        .sort(
          (a, b) =>
            compareSeasons(a.set.year, b.set.year) ||
            a.set.name.localeCompare(b.set.name)
        );

      return {
        brand,
        sets,
        seasons: [...new Set(sets.map(({ set }) => set.year))],
        overallStats: {
          totalSets: sets.length,
          totalCards: data.totalCards,
          totalOwnedCards: data.totalOwnedCards,
          completionPercentage:
            data.totalCards > 0
              ? Math.round((data.totalOwnedCards / data.totalCards) * 100)
              : 0,
        },
      };
    })
    .sort((a, b) => a.brand.localeCompare(b.brand));
}
