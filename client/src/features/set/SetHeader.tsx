import { TradingCardSet } from "@/types";

interface SetHeaderProps {
  set: TradingCardSet;
}

export default function SetHeader({ set }: SetHeaderProps) {
  const sportIcon = set.sport.toLowerCase() === "basketball" ? "🏀" : "🏈";

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {set.name}
      </h1>
      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
        <span className="flex items-center gap-1">
          {sportIcon} {set.sport}
        </span>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-2 py-1 rounded">
          {set.year}
        </span>
      </div>
    </div>
  );
}
