import { useState } from "react";
import { Check } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import { Card } from "@/types";

interface SetCardProps {
  card: Card;
  onOwnershipChange?: () => void;
}

export default function SetCard({ card, onOwnershipChange }: SetCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateOwnershipMutation = useMutation(
    trpc.updateCardOwnership.mutationOptions({
      onMutate: () => setIsUpdating(true),
      onSuccess: () => {
        // Invalidate the specific query using the exact same query key structure
        queryClient.invalidateQueries(
          trpc.getSetWithCards.queryOptions({ setId: card.setId })
        );
        // Also invalidate the sets with stats query to update the main page
        queryClient.invalidateQueries(trpc.getSetsWithStats.queryOptions());
        // Call the optional callback
        onOwnershipChange?.();
      },
      onSettled: () => {
        setIsUpdating(false);
      },
      onError: (err: any) => {
        console.error("Failed to update card ownership:", err);
      },
    })
  );

  const handleToggleOwnership = () => {
    updateOwnershipMutation.mutate({
      cardId: card.id,
      isOwned: !card.isOwned,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-2 py-1 rounded">
            #{card.cardNumber}
          </span>
          {card.isOwned && (
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2 py-1 rounded">
              Owned
            </span>
          )}
        </div>

        <button
          onClick={handleToggleOwnership}
          disabled={isUpdating}
          className={`p-1.5 rounded-full transition-all duration-200 ${
            card.isOwned
              ? "bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
              : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600 dark:bg-gray-700 dark:text-gray-500 dark:hover:bg-green-900/30 dark:hover:text-green-400"
          } ${
            isUpdating
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:scale-105"
          }`}
          title={card.isOwned ? "Mark as not owned" : "Mark as owned"}
        >
          <Check
            className={`w-4 h-4 transition-all duration-200 ${
              card.isOwned ? "scale-100" : "scale-75 opacity-60"
            }`}
          />
        </button>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {card.playerName}
      </h3>

      <div className="space-y-1">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {card.cardType}
        </p>
      </div>
    </div>
  );
}
