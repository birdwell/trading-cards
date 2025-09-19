import { useRouter } from "next/navigation";
import { ArrowLeft, Package, TrendingUp, Calendar, Target } from "lucide-react";

interface BrandDetailsProps {
  brandData: {
    brand: string;
    overallStats: {
      totalSets: number;
      totalCards: number;
      totalOwnedCards: number;
      completionPercentage: number;
    };
    yearGroups: Array<{
      year: string;
      basketball: Array<{
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
      football: Array<{
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
    }>;
  };
}

export default function BrandDetailsContent({ brandData }: BrandDetailsProps) {
  const router = useRouter();

  const handleBackToBrands = () => {
    router.push("/brands");
  };

  const handleSetClick = (setId: number) => {
    router.push(`/set/${setId}`);
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

  const calculatePercentage = (owned: number, total: number) => {
    return total > 0 ? Math.round((owned / total) * 100) : 0;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={handleBackToBrands}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Brands
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {brandData.brand}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Complete collection overview across all years and sports
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {brandData.overallStats.completionPercentage}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Overall Progress
              </div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mb-6">
            <div className={`w-full rounded-full h-4 ${getProgressBgColor(brandData.overallStats.completionPercentage)}`}>
              <div
                className={`h-4 rounded-full transition-all duration-300 ${getProgressColor(brandData.overallStats.completionPercentage)}`}
                style={{ width: `${brandData.overallStats.completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Package className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {brandData.overallStats.totalSets}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Sets
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {brandData.overallStats.totalOwnedCards}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Cards Owned
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {brandData.overallStats.totalCards}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Cards
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Year Groups */}
      <div className="space-y-8">
        {brandData.yearGroups.map((yearGroup) => (
          <div key={yearGroup.year} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {yearGroup.year}
              </h2>
            </div>

            {/* Basketball Sets */}
            {yearGroup.basketball.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🏀 Basketball
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {yearGroup.basketball.map((setWithStats) => {
                    const percentage = calculatePercentage(
                      setWithStats.stats.ownedCards,
                      setWithStats.stats.totalCards
                    );
                    return (
                      <div
                        key={setWithStats.set.id}
                        onClick={() => handleSetClick(setWithStats.set.id)}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                      >
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                          {setWithStats.set.name}
                        </h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {setWithStats.stats.ownedCards}/{setWithStats.stats.totalCards}
                          </span>
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {percentage}%
                          </span>
                        </div>
                        <div className={`w-full rounded-full h-2 ${getProgressBgColor(percentage)}`}>
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Football Sets */}
            {yearGroup.football.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🏈 Football
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {yearGroup.football.map((setWithStats) => {
                    const percentage = calculatePercentage(
                      setWithStats.stats.ownedCards,
                      setWithStats.stats.totalCards
                    );
                    return (
                      <div
                        key={setWithStats.set.id}
                        onClick={() => handleSetClick(setWithStats.set.id)}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                      >
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                          {setWithStats.set.name}
                        </h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {setWithStats.stats.ownedCards}/{setWithStats.stats.totalCards}
                          </span>
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {percentage}%
                          </span>
                        </div>
                        <div className={`w-full rounded-full h-2 ${getProgressBgColor(percentage)}`}>
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {yearGroup.basketball.length === 0 && yearGroup.football.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No sets found for {yearGroup.year}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
