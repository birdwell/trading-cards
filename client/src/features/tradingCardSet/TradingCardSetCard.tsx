import { SetWithStats } from "../../types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import ProgressBar from "@/components/ProgressBar";

interface TradingCardSetCardProps {
  setWithStats: SetWithStats;
  onDeleted?: () => void;
}

export default function TradingCardSetCard({
  setWithStats,
  onDeleted,
}: TradingCardSetCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleOnSuccess = () => {
    setIsDeleting(false);
    onDeleted?.();
  };

  const handleError = (errorMessage: string) => {
    setIsDeleting(false);
    alert(errorMessage);
  };

  const handleViewCards = () => {
    router.push(`/set/${setWithStats.set.id}`);
  };

  const { set, stats } = setWithStats;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {set.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-2 py-1 rounded">
            {set.year}
          </span>
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors duration-200 disabled:opacity-50"
            title="Delete set"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {stats.ownedCards}/{stats.totalCards}
            </span>
          </div>
          <ProgressBar current={stats.ownedCards} total={stats.totalCards} />
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {stats.totalCards > 0
              ? `${Math.round(
                  (stats.ownedCards / stats.totalCards) * 100
                )}% complete`
              : "No cards"}
          </p>
        </div>
      </div>

      {showConfirmDelete && (
        <ConfirmDeleteDialog
          set={set}
          onCancel={() => setShowConfirmDelete(false)}
          onSuccess={handleOnSuccess}
          onError={handleError}
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
        />
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleViewCards}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          View Cards
        </button>
      </div>
    </div>
  );
}
