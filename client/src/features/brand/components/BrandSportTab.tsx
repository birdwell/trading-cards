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
      <div className="border border-dashed border-border/80 py-16 text-center">
        <p className="font-display text-xl font-light text-foreground/80">
          No {sport} sets for this brand.
        </p>
        <p className="mt-2 font-mono-tight text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Import a set to begin
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-px bg-border/40 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {allSets.map((setWithStats, i) => (
        <div
          key={setWithStats.set.id}
          className="rise bg-background"
          style={{ animationDelay: `${Math.min(i * 30, 360)}ms` }}
        >
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
