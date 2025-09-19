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
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Package className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">
                {overallStats.totalSets}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Total Sets
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold">
                {overallStats.totalOwnedCards}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Cards Owned
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold">
                {overallStats.totalCards}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Total Cards
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
