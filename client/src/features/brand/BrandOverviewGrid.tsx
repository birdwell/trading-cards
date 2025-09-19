import { useRouter } from "next/navigation";
import { Package, Calendar, Trophy, Target, TrendingUp } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BrandOverviewProps {
  brands: Array<{
    brand: string;
    sets: Array<{
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
    }>;
    overallStats: {
      totalSets: number;
      totalCards: number;
      totalOwnedCards: number;
      completionPercentage: number;
    };
  }>;
}

export default function BrandOverviewGrid({ brands }: BrandOverviewProps) {
  const router = useRouter();

  const handleBrandClick = (brandName: string) => {
    // URL encode the brand name for safe routing
    const encodedBrand = encodeURIComponent(brandName);
    router.push(`/brands/${encodedBrand}`);
  };

  if (brands.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground text-lg">No brands found</p>
        <p className="text-muted-foreground/60 text-sm mt-2">
          Import some trading card sets to see brand overviews
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {brands.map((brand) => (
        <Card
          key={brand.brand}
          onClick={() => handleBrandClick(brand.brand)}
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
        >
          <CardHeader className="pb-4">
            {/* Brand Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{brand.brand}</h3>
              <Badge variant="secondary" className="gap-1">
                <Package className="w-3 h-3" />
                {brand.overallStats.totalSets}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Overall Progress
                </span>
                <span className="text-sm font-bold">
                  {brand.overallStats.completionPercentage}%
                </span>
              </div>
              <ProgressBar
                percentage={brand.overallStats.completionPercentage}
                colorCoded={false}
                className="h-3"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {brand.overallStats.totalOwnedCards}
                </div>
                <div className="text-xs text-muted-foreground">Cards Owned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {brand.overallStats.totalCards}
                </div>
                <div className="text-xs text-muted-foreground">Total Cards</div>
              </div>
            </div>

            {/* Years Available */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {[...new Set(brand.sets.map((s) => s.set.year))]
                  .sort()
                  .reverse()
                  .slice(0, 3)
                  .join(", ")}
                {[...new Set(brand.sets.map((s) => s.set.year))].length > 3 &&
                  "..."}
              </span>
            </div>

            {/* Action Hint */}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Click to view details
                </span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
