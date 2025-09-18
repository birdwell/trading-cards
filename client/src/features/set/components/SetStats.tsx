interface SetStatsProps {
  ownedCount: number;
  totalCount: number;
}

export default function SetStats({ ownedCount, totalCount }: SetStatsProps) {
  const completionPercentage = totalCount > 0 ? (ownedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {ownedCount}/{totalCount}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Cards Owned
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${completionPercentage}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
