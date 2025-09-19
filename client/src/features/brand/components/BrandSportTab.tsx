import BrandSetCard from "./BrandSetCard";

interface BrandSportTabProps {
  sport: "basketball" | "football";
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
  onSetClick: (setId: number) => void;
}

export default function BrandSportTab({ sport, yearGroups, onSetClick }: BrandSportTabProps) {
  // Flatten all sets from all years and sort by year (newest first)
  const allSets = yearGroups
    .flatMap(yearGroup => yearGroup.sets)
    .sort((a, b) => b.set.year.localeCompare(a.set.year));

  if (allSets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">{sport === "basketball" ? "🏀" : "🏈"}</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No {sport === "basketball" ? "Basketball" : "Football"} Sets Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          This brand doesn't have any {sport === "basketball" ? "basketball" : "football"} sets in your collection yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {allSets.map((setWithStats) => (
        <BrandSetCard
          key={setWithStats.set.id}
          set={setWithStats.set}
          stats={setWithStats.stats}
          onSetClick={onSetClick}
        />
      ))}
    </div>
  );
}
