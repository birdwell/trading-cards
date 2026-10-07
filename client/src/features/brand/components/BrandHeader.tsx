import SetStats from "@/features/set/SetStats";

interface BrandHeaderProps {
  brand: string;
  overallStats: {
    totalCards: number;
    totalOwnedCards: number;
  };
}

export default function BrandHeader({ brand, overallStats }: BrandHeaderProps) {
  return (
    <section className="flex items-center justify-between gap-3">
      <h1 className="font-display min-w-0 truncate text-xl font-semibold tracking-tight md:text-2xl">
        {brand}
      </h1>
      <SetStats
        ownedCount={overallStats.totalOwnedCards}
        totalCount={overallStats.totalCards}
      />
    </section>
  );
}
