import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import { Card } from "@/types";
import EmptyState from "@/components/EmptyState";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-semibold">Delete card</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Remove #{card.cardNumber} — {card.playerName}?
        </p>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-2.5 py-1.5 text-xs font-medium text-destructive-foreground"
          >
            {isDeleting ? (
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
            ) : (
              <Trash2 className="h-3 w-3" />
            )}
            Delete
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

  const deleteCardMutation = useMutation(
    trpc.deleteCard.mutationOptions({
      onMutate: () => setIsDeleting(true),
      onSuccess: () => {
        setIsDeleting(false);
        setCardToDelete(null);
        queryClient.invalidateQueries(
          trpc.getSetWithCards.queryOptions({ setId })
        );
        queryClient.invalidateQueries(trpc.getSetsWithStats.queryOptions());
      },
      onError: (error) => {
        setIsDeleting(false);
        console.error("Failed to delete card:", error.message);
      },
    })
  );

  const sorted = [...cards].sort((a, b) => {
    if (a.cardNumber !== b.cardNumber) {
      return a.cardNumber - b.cardNumber;
    }
    return a.cardType.localeCompare(b.cardType);
  });

  if (sorted.length === 0) {
    return <EmptyState message="No cards in this set." />;
  }

  return (
    <>
      <div className="binder max-h-[32rem] overflow-y-auto">
        {sorted.map((card) => (
          <div
            key={card.id}
            className="flex items-center gap-3 border-b border-border/70 px-3 py-2 last:border-b-0"
          >
            <span className="w-8 shrink-0 font-mono-tight text-xs tabular-nums text-muted-foreground">
              #{card.cardNumber}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {card.playerName}
            </span>
            <span className="max-w-[35%] shrink-0 truncate text-xs text-muted-foreground">
              {card.cardType}
            </span>
            {card.isOwned && (
              <span className="shrink-0 text-[11px] font-medium text-foil">
                Owned
              </span>
            )}
            <button
              type="button"
              onClick={() => setCardToDelete(card)}
              aria-label={`Delete ${card.playerName}`}
              className="rounded p-1.5 text-muted-foreground/50 transition-colors hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {cardToDelete && (
        <DeleteConfirmation
          card={cardToDelete}
          onConfirm={() =>
            deleteCardMutation.mutate({ cardId: cardToDelete.id })
          }
          onCancel={() => setCardToDelete(null)}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}
