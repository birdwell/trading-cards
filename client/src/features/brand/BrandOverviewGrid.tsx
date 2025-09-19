import { useRouter } from "next/navigation";
import { Package, TrendingUp, Calendar } from "lucide-react";

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

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    if (percentage >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getProgressBgColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-100 dark:bg-green-900/20";
    if (percentage >= 60) return "bg-yellow-100 dark:bg-yellow-900/20";
    if (percentage >= 40) return "bg-orange-100 dark:bg-orange-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  if (brands.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No brands found
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          Import some trading card sets to see brand overviews
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {brands.map((brand) => (
        <div
          key={brand.brand}
          onClick={() => handleBrandClick(brand.brand)}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
        >
          <div className="p-6">
            {/* Brand Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {brand.brand}
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Package className="w-4 h-4" />
                <span>{brand.overallStats.totalSets}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Overall Progress
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {brand.overallStats.completionPercentage}%
                </span>
              </div>
              <div className={`w-full rounded-full h-3 ${getProgressBgColor(brand.overallStats.completionPercentage)}`}>
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(brand.overallStats.completionPercentage)}`}
                  style={{ width: `${brand.overallStats.completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {brand.overallStats.totalOwnedCards}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Cards Owned
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {brand.overallStats.totalCards}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Total Cards
                </div>
              </div>
            </div>

            {/* Years Available */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>
                {[...new Set(brand.sets.map(s => s.set.year))]
                  .sort()
                  .reverse()
                  .slice(0, 3)
                  .join(", ")}
                {[...new Set(brand.sets.map(s => s.set.year))].length > 3 && " +"}
              </span>
            </div>

            {/* Sports Available */}
            <div className="flex items-center gap-2 mt-2">
              {[...new Set(brand.sets.map(s => s.set.sport))].map(sport => (
                <span
                  key={sport}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                >
                  {sport === "Basketball" ? "🏀" : "🏈"} {sport}
                </span>
              ))}
            </div>

            {/* View Details Indicator */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Click to view details
                </span>
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
