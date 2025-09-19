import { ArrowLeft, Package, TrendingUp, Target } from "lucide-react";
import BrandProgressBar from "./BrandProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BrandHeaderProps {
  brand: string;
  overallStats: {
    totalSets: number;
    totalCards: number;
    totalOwnedCards: number;
    completionPercentage: number;
  };
  onBackToBrands: () => void;
}

export default function BrandHeader({ brand, overallStats, onBackToBrands }: BrandHeaderProps) {
  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        onClick={onBackToBrands}
        className="gap-2 mb-4 px-0 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Brands
      </Button>

      <Card>
        <CardContent className="p-4">
          {/* Header Section with Brand Name and Overall Progress */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">
                {brand}
              </h1>
              <p className="text-sm text-muted-foreground">
                Complete collection overview across all years and sports
              </p>
            </div>
            <div className="text-center lg:text-right">
              <div className="text-2xl font-bold text-primary">
                {overallStats.completionPercentage}%
              </div>
              <div className="text-xs text-muted-foreground">
                Overall Progress
              </div>
            </div>
          </div>

          {/* Stats Grid and Progress Bar Section */}
          <div className="flex flex-col xl:flex-row xl:items-center gap-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 flex-1">
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

            {/* Progress Bar */}
            <div className="xl:w-64">
              <BrandProgressBar percentage={overallStats.completionPercentage} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
