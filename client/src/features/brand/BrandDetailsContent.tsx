import { BrandHeader, BrandTabs, BrandSportTab } from "./components";

interface BrandDetailsProps {
  brandData: {
    brand: string;
    overallStats: {
      totalSets: number;
      totalCards: number;
      totalOwnedCards: number;
      completionPercentage: number;
    };
    yearGroups: Array<{
      year: string;
      basketball: Array<{
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
      football: Array<{
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
  };
}

export default function BrandDetailsContent({ brandData }: BrandDetailsProps) {
  const transformDataBySport = (sport: "basketball" | "football") => {
    return brandData.yearGroups
      .map((yearGroup) => ({
        year: yearGroup.year,
        sets: yearGroup[sport] || [],
      }))
      .filter((yearGroup) => yearGroup.sets.length > 0)
      .sort((a, b) => b.year.localeCompare(a.year));
  };

  const basketballData = transformDataBySport("basketball");
  const footballData = transformDataBySport("football");
  const basketballCount = basketballData.reduce(
    (n, g) => n + g.sets.length,
    0
  );
  const footballCount = footballData.reduce((n, g) => n + g.sets.length, 0);

  return (
    <div>
      <BrandHeader
        brand={brandData.brand}
        overallStats={brandData.overallStats}
      />

      <section className="pt-4">
        <BrandTabs
          basketballCount={basketballCount}
          footballCount={footballCount}
        >
          <BrandSportTab
            sport="basketball"
            brand={brandData.brand}
            yearGroups={basketballData}
          />
          <BrandSportTab
            sport="football"
            brand={brandData.brand}
            yearGroups={footballData}
          />
        </BrandTabs>
      </section>
    </div>
  );
}
