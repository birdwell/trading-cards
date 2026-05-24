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
    <div className="mx-auto max-w-7xl">
      <BrandHeader
        brand={brandData.brand}
        overallStats={brandData.overallStats}
        onBackToBrands={() => router.push("/brands")}
      />

      <section className="py-10 md:py-14">
        <div className="mb-6 flex items-baseline gap-4">
          <span className="font-mono-tight text-[10px] tracking-[0.28em] text-muted-foreground">
            §
          </span>
          <h2 className="font-display text-2xl font-light tracking-tight">
            Sets
          </h2>
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
