import { TradingCardSet } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";

interface ConfirmDeleteDialogProps {
  set: TradingCardSet;
  onSuccess: () => void;
  onError: (errorMessage: string) => void;
  isDeleting: boolean;
  setIsDeleting: (isDeleting: boolean) => void;
  onCancel: () => void;
}

export default function ConfirmDeleteDialog({
  set,
  onSuccess,
  onError,
  isDeleting,
  setIsDeleting,
  onCancel,
}: ConfirmDeleteDialogProps) {
  const trpc = useTRPC();
  
  const deleteSetMutation = useMutation(trpc.deleteSet.mutationOptions({
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: any) => {
      onError(error.message);
    },
  }));

  const handleDelete = async () => {
    setIsDeleting(true);
    deleteSetMutation.mutate({ setId: set.id });
  };

  return (
    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
      <p className="text-red-800 dark:text-red-200 text-sm mb-3">
        Are you sure you want to delete "{set.name}"? This will also delete all
        cards in this set. This action cannot be undone.
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-1 px-3 rounded transition-colors duration-200 disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 text-sm font-medium py-1 px-3 rounded transition-colors duration-200 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
