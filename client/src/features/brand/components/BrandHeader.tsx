import { ArrowLeft } from "lucide-react";
import BrandProgressBar from "./BrandProgressBar";

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
      <button
        onClick={onBackToBrands}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Brands
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {brand}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Complete collection overview across all years and sports
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {overallStats.completionPercentage}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Overall Progress
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-6">
          <BrandProgressBar percentage={overallStats.completionPercentage} className="h-4" />
        </div>
      </div>
    </div>
  );
}
