import { TradingCardSet } from "../types";

interface TradingCardSetCardProps {
  set: TradingCardSet;
}

export default function TradingCardSetCard({ set }: TradingCardSetCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {set.name}
        </h3>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-2 py-1 rounded">
          {set.year}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-gray-600 dark:text-gray-300">
          <span className="font-medium">Sport:</span> {set.sport}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
          View Cards
        </button>
      </div>
    </div>
  );
}
