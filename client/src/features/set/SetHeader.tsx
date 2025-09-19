import { TradingCardSet } from "@/types";
import { Badge } from "@/components/ui/badge";

interface SetHeaderProps {
  set: TradingCardSet;
}

export default function SetHeader({ set }: SetHeaderProps) {
  const sportIcon = set.sport.toLowerCase() === "basketball" ? "🏀" : "🏈";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        {set.name}
      </h1>
      <div className="flex items-center gap-3 text-muted-foreground">
        <span className="flex items-center gap-1">
          {sportIcon} {set.sport}
        </span>
        <Badge variant="secondary">
          {set.year}
        </Badge>
      </div>
    </div>
  );
}
