import { useRouter } from "next/navigation";
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
  const router = useRouter();

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

      <section className="pt-12 md:pt-16">
        <div className="mb-8">
          <h2 className="text-xl font-semibold tracking-tight">Sets</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Filter by sport.
          </p>
        </div>

        <BrandTabs
          basketballCount={basketballCount}
          footballCount={footballCount}
        >
          <BrandSportTab
            sport="basketball"
            yearGroups={basketballData}
            onSetClick={(setId) => router.push(`/set/${setId}`)}
          />
          <BrandSportTab
            sport="football"
            yearGroups={footballData}
            onSetClick={(setId) => router.push(`/set/${setId}`)}
          />
        </BrandTabs>
      </section>
    </div>
  );
}
