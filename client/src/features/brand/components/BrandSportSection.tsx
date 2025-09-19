import BrandSetCard from "./BrandSetCard";

interface BrandSportSectionProps {
  sport: "basketball" | "football";
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
  onSetClick: (setId: number) => void;
}

export default function BrandSportSection({ sport, sets, onSetClick }: BrandSportSectionProps) {
  if (sets.length === 0) return null;

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case "basketball":
        return "🏀";
      case "football":
        return "🏈";
      default:
        return "🏀";
    }
  };

  const getSportName = (sport: string) => {
    return sport.charAt(0).toUpperCase() + sport.slice(1);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        {getSportIcon(sport)} {getSportName(sport)}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sets.map((setWithStats) => (
          <BrandSetCard
            key={setWithStats.set.id}
            set={setWithStats.set}
            stats={setWithStats.stats}
            onSetClick={onSetClick}
          />
        ))}
      </div>
    </div>
  );
}
