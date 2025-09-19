import { Package, TrendingUp, Target } from "lucide-react";

interface BrandOverallStatsProps {
  overallStats: {
    totalSets: number;
    totalCards: number;
    totalOwnedCards: number;
  };
}

export default function BrandOverallStats({ overallStats }: BrandOverallStatsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Package className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {overallStats.totalSets}
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
              {overallStats.totalOwnedCards}
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
              {overallStats.totalCards}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Cards
          </div>
        </div>
      </div>
    </div>
  );
}
