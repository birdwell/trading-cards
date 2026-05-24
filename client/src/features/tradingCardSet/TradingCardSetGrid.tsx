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
    <div className="grid grid-cols-1 gap-px bg-border/40 sm:grid-cols-2 lg:grid-cols-3 lg:gap-px">
      {setsWithStats.map((setWithStats, i) => (
        <div
          key={setWithStats.set.id}
          className="rise bg-background"
          style={{ animationDelay: `${Math.min(i * 40, 320)}ms` }}
        >
          <TradingCardSetCard
            setWithStats={setWithStats}
            onDeleted={onSetDeleted}
            index={i}
          />
        </div>
      ))}
    </div>
  );
}
