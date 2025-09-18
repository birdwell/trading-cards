import { TradingCardSet } from "../types";
import TradingCardSetCard from "./TradingCardSetCard";

interface TradingCardSetGridProps {
  sets: TradingCardSet[];
  onSetDeleted?: () => void;
}

export default function TradingCardSetGrid({ sets, onSetDeleted }: TradingCardSetGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sets.map((set) => (
        <TradingCardSetCard key={set.id} set={set} onDeleted={onSetDeleted} />
      ))}
    </div>
  );
}
