import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import { Card } from "@/types";

interface EditSetCardsProps {
  cards: Card[];
  setId: number;
}

interface DeleteConfirmationProps {
  card: Card;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteConfirmation({
  card,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Delete Card
          </h3>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete card #{card.cardNumber} -{" "}
          {card.playerName}? This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Card
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditSetCards({ cards, setId }: EditSetCardsProps) {
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteCardMutation = useMutation(trpc.deleteCard.mutationOptions({
    onMutate: () => {
      setIsDeleting(true);
    },
    onSuccess: () => {
      setIsDeleting(false);
      setCardToDelete(null);
      // Invalidate queries to refresh data using proper tRPC query options
      queryClient.invalidateQueries(trpc.getSetWithCards.queryOptions({ setId }));
      queryClient.invalidateQueries(trpc.getSetsWithStats.queryOptions());
    },
    onError: (error: any) => {
      setIsDeleting(false);
      // You could add error handling here, like showing a toast
      console.error("Failed to delete card:", error.message);
    },
  }));

  const handleDeleteClick = (card: Card) => {
    setCardToDelete(card);
  };

  const handleConfirmDelete = () => {
    if (cardToDelete) {
      deleteCardMutation.mutate({ cardId: cardToDelete.id });
    }
  };

  const handleCancelDelete = () => {
    setCardToDelete(null);
  };

  if (cards.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Cards in Set
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No cards found in this set.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Cards in Set ({cards.length})
        </h3>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    #{card.cardNumber}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {card.playerName}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {card.cardType}
                  </span>
                  {card.isOwned && (
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                      Owned
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDeleteClick(card)}
                className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                title="Delete card"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {cardToDelete && (
        <DeleteConfirmation
          card={cardToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}
