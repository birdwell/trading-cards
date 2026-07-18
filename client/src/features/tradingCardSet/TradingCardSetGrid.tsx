import { SetWithStats } from "@/types";
import TradingCardSetCard from "./TradingCardSetCard";

interface TradingCardSetGridProps {
  setsWithStats: SetWithStats[];
}

export default function TradingCardSetGrid({
  setsWithStats,
}: TradingCardSetGridProps) {
  return (
    <div className="binder">
      {setsWithStats.map((setWithStats, index) => (
        <TradingCardSetCard
          key={setWithStats.set.id}
          setWithStats={setWithStats}
          index={index}
        />
      ))}
    </div>
  );
}
