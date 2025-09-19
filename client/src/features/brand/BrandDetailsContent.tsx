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

  const handleBackToBrands = () => {
    router.push("/brands");
  };

  const handleSetClick = (setId: number) => {
    router.push(`/set/${setId}`);
  };

  // Transform data to organize by sport first, then by year
  const transformDataBySport = (sport: "basketball" | "football") => {
    return brandData.yearGroups
      .map((yearGroup) => ({
        year: yearGroup.year,
        sets: yearGroup[sport] || [],
      }))
      .filter((yearGroup) => yearGroup.sets.length > 0)
      .sort((a, b) => b.year.localeCompare(a.year)); // Sort years descending (newest first)
  };

  const basketballData = transformDataBySport("basketball");
  const footballData = transformDataBySport("football");

  return (
    <div className="max-w-6xl mx-auto">
      <BrandHeader
        brand={brandData.brand}
        overallStats={brandData.overallStats}
        onBackToBrands={handleBackToBrands}
      />

      <BrandTabs>
        <BrandSportTab
          sport="basketball"
          yearGroups={basketballData}
          onSetClick={handleSetClick}
        />
        <BrandSportTab
          sport="football"
          yearGroups={footballData}
          onSetClick={handleSetClick}
        />
      </BrandTabs>
    </div>
  );
}
