import BrandProgressBar from "./BrandProgressBar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BrandSetCardProps {
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
  onSetClick: (setId: number) => void;
}

export default function BrandSetCard({ set, stats, onSetClick }: BrandSetCardProps) {
  const calculatePercentage = (owned: number, total: number) => {
    return total > 0 ? Math.round((owned / total) * 100) : 0;
  };

  const percentage = calculatePercentage(stats.ownedCards, stats.totalCards);

  return (
    <Card
      onClick={() => onSetClick(set.id)}
      className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50"
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-primary border-primary">
            {set.year}
          </Badge>
          <span className="text-sm font-bold">
            {percentage}%
          </span>
        </div>
        
        <h4 className="font-semibold mb-3 text-base leading-tight">
          {set.name}
        </h4>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">
            {stats.ownedCards} of {stats.totalCards} cards
          </span>
        </div>
        
        <BrandProgressBar percentage={percentage} className="h-3" />
      </CardContent>
    </Card>
  );
}
