import { getBrand, normalizeBrand } from "../../../../shared/get-brand";
import type { SetWithStats } from "@/types";

export type BrandOverviewItem = {
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
    .map(([brand, data]) => ({
      brand,
      sets: data.sets,
      overallStats: {
        totalSets: data.sets.length,
        totalCards: data.totalCards,
        totalOwnedCards: data.totalOwnedCards,
        completionPercentage:
          data.totalCards > 0
            ? Math.round((data.totalOwnedCards / data.totalCards) * 100)
            : 0,
      },
    }))
    .sort((a, b) => a.brand.localeCompare(b.brand));
}
