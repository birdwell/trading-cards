import { SetWithStats } from "@/types";
import TradingCardSetCard from "./TradingCardSetCard";

interface TradingCardSetGridProps {
  setsWithStats: SetWithStats[];
  onSetDeleted?: () => void;
}

export default function TradingCardSetGrid({
  setsWithStats,
  onSetDeleted,
}: TradingCardSetGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {setsWithStats.map((setWithStats) => (
        <TradingCardSetCard
          key={setWithStats.set.id}
          setWithStats={setWithStats}
          onDeleted={onSetDeleted}
        />
      ))}
    </div>
  );
}
