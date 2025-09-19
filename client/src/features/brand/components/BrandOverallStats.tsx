import { Package, TrendingUp, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface BrandOverallStatsProps {
  overallStats: {
    totalSets: number;
    totalCards: number;
    totalOwnedCards: number;
  };
}

export default function BrandOverallStats({ overallStats }: BrandOverallStatsProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Package className="w-3 h-3 text-primary" />
              <span className="text-lg font-semibold">
                {overallStats.totalSets}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Total Sets
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-3 h-3 text-green-500" />
              <span className="text-lg font-semibold">
                {overallStats.totalOwnedCards}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Cards Owned
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-purple-500" />
              <span className="text-lg font-semibold">
                {overallStats.totalCards}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Total Cards
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
