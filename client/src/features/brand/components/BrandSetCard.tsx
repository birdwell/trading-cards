import BrandProgressBar from "./BrandProgressBar";

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
    <div
      onClick={() => onSetClick(set.id)}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {set.year}
        </span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {percentage}%
        </span>
      </div>
      
      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-base leading-tight">
        {set.name}
      </h4>
      
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {stats.ownedCards} of {stats.totalCards} cards
        </span>
      </div>
      
      <BrandProgressBar percentage={percentage} className="h-3" />
    </div>
  );
}
