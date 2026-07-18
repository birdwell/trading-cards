import { getBrand, normalizeBrand } from "../../../../shared/get-brand";
import type { SetWithStats } from "@/types";

export function buildBrandDetails(
  setsWithStats: SetWithStats[],
  brandName: string
) {
  const brandSets = setsWithStats.filter(
    ({ set }) =>
      normalizeBrand(getBrand(set.name)).toLowerCase() ===
      brandName.toLowerCase()
  );

  if (brandSets.length === 0) {
    return null;
  }

  let totalCards = 0;
  let totalOwnedCards = 0;
  for (const { stats } of brandSets) {
    totalCards += stats.totalCards;
    totalOwnedCards += stats.ownedCards;
  }

  const yearGroups = new Map<
    string,
    { basketball: typeof brandSets; football: typeof brandSets }
  >();

  for (const setWithStats of brandSets) {
    const year = setWithStats.set.year;
    const sport = setWithStats.set.sport.toLowerCase();

    if (!yearGroups.has(year)) {
      yearGroups.set(year, { basketball: [], football: [] });
    }

    if (sport === "basketball") {
      yearGroups.get(year)!.basketball.push(setWithStats);
    } else if (sport === "football") {
      yearGroups.get(year)!.football.push(setWithStats);
    }
  }

  return {
    brand: normalizeBrand(getBrand(brandSets[0].set.name)),
    overallStats: {
      totalSets: brandSets.length,
      totalCards,
      totalOwnedCards,
      completionPercentage:
        totalCards > 0
          ? Math.round((totalOwnedCards / totalCards) * 100)
          : 0,
    },
    yearGroups: Array.from(yearGroups.entries())
      .map(([year, sports]) => ({ year, ...sports }))
      .sort((a, b) => b.year.localeCompare(a.year)),
  };
}
