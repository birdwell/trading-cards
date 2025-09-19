import { ArrowLeft } from "lucide-react";
import BrandProgressBar from "./BrandProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BrandHeaderProps {
  brand: string;
  overallStats: {
    completionPercentage: number;
  };
  onBackToBrands: () => void;
}

export default function BrandHeader({ brand, overallStats, onBackToBrands }: BrandHeaderProps) {
  return (
    <div className="mb-8">
      <Button
        variant="ghost"
        onClick={onBackToBrands}
        className="gap-2 mb-6 px-0 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Brands
      </Button>

      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {brand}
              </h1>
              <p className="text-muted-foreground">
                Complete collection overview across all years and sports
              </p>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-3xl font-bold text-primary">
                {overallStats.completionPercentage}%
              </div>
              <div className="text-sm text-muted-foreground">
                Overall Progress
              </div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <BrandProgressBar percentage={overallStats.completionPercentage} className="h-4" />
        </CardContent>
      </Card>
    </div>
  );
}
