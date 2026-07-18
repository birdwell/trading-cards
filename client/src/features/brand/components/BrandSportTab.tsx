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

export default function BrandSportTab({
  sport,
  yearGroups,
  onSetClick,
}: BrandSportTabProps) {
  const allSets = yearGroups
    .flatMap((yearGroup) => yearGroup.sets)
    .sort((a, b) => b.set.year.localeCompare(a.set.year));

  if (allSets.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border px-6 py-16 text-center">
        <p className="text-base font-medium">No {sport} sets</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Import a set to begin
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {allSets.map((setWithStats) => (
        <div key={setWithStats.set.id}>
          <BrandSetCard
            set={setWithStats.set}
            stats={setWithStats.stats}
            onSetClick={onSetClick}
          />
        </div>
      ))}
    </div>
  );
}
