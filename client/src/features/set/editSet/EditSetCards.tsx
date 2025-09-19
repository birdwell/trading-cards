import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import { Card } from "@/types";
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <UICard className="max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-destructive" />
            <CardTitle className="text-lg">Delete Card</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Are you sure you want to delete card #{card.cardNumber} - {card.playerName}? 
            This action cannot be undone.
          </p>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isDeleting}
              className="gap-2"
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
            </Button>
          </div>
        </CardContent>
      </UICard>
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
      <UICard>
        <CardHeader>
          <CardTitle>Cards in Set</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No cards found in this set.
          </p>
        </CardContent>
      </UICard>
    );
  }

  return (
    <>
      <UICard>
        <CardHeader>
          <CardTitle>Cards in Set ({cards.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      #{card.cardNumber}
                    </span>
                    <span className="font-medium">
                      {card.playerName}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {card.cardType}
                    </span>
                    {card.isOwned && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Owned
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(card)}
                  className="p-2 text-muted-foreground hover:text-destructive"
                  title="Delete card"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </UICard>

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
