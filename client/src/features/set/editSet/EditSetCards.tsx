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
      <div className="mx-4 w-full max-w-md border border-border bg-card p-6">
        <p className="font-mono-tight text-[10px] uppercase tracking-[0.22em] text-destructive">
          Delete card
        </p>
        <p className="mt-3 font-display text-xl font-light leading-snug">
          Remove #{card.cardNumber} — {card.playerName}?
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          This cannot be undone.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 border border-destructive bg-destructive px-4 py-2 text-sm text-destructive-foreground"
          >
            {isDeleting ? (
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
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

  const sorted = [...cards].sort((a, b) => a.cardNumber - b.cardNumber);

  if (sorted.length === 0) {
    return <EmptyState message="No cards in this set." />;
  }

  return (
    <>
      <div className="max-h-[28rem] overflow-y-auto border border-border/70">
        {sorted.map((card) => (
          <div
            key={card.id}
            className="flex items-center justify-between gap-4 border-b border-border/60 px-5 py-4 last:border-b-0"
          >
            <div className="min-w-0 flex-1">
              <div className="font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                No. {String(card.cardNumber).padStart(3, "0")}
              </div>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-lg font-light tracking-tight">
                  {card.playerName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {card.cardType}
                </span>
                {card.isOwned && (
                  <span className="font-mono-tight text-[10px] uppercase tracking-[0.22em] text-accent">
                    Owned
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCardToDelete(card)}
              aria-label={`Delete ${card.playerName}`}
              className="rounded p-2 text-muted-foreground/60 transition-colors hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
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
