import { useState } from "react";
import { Check } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import { Card } from "@/types";
import { cn } from "@/lib/utils";

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
        queryClient.invalidateQueries(
          trpc.getSetWithCards.queryOptions({ setId: card.setId })
        );
        queryClient.invalidateQueries(trpc.getSetsWithStats.queryOptions());
        onOwnershipChange?.();
      },
      onSettled: () => setIsUpdating(false),
      onError: (err) => {
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
    <button
      type="button"
      onClick={handleToggleOwnership}
      disabled={isUpdating}
      title={card.isOwned ? "Mark as not owned" : "Mark as owned"}
      className={cn(
        "group relative block w-full cursor-pointer overflow-hidden border border-border/70 bg-card/30 p-5 text-left transition-all duration-300",
        "hover:border-foreground/40 hover:bg-card",
        isUpdating && "opacity-60",
        card.isOwned && "bg-card"
      )}
    >
      {/* Owned ribbon */}
      {card.isOwned && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-px bg-accent"
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="tabular-nums">
              No. {String(card.cardNumber).padStart(3, "0")}
            </span>
          </div>

          <h3 className="mt-2 font-display text-xl font-light leading-tight tracking-tight">
            {card.playerName}
          </h3>

          <p className="mt-2 truncate text-xs text-muted-foreground">
            {card.cardType}
          </p>
        </div>

        {/* Tick mark */}
        <span
          aria-hidden="true"
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
            card.isOwned
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border text-transparent group-hover:border-foreground/40"
          )}
        >
          <Check
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-300",
              card.isOwned ? "scale-100" : "scale-50 opacity-0"
            )}
          />
        </span>
      </div>

      {/* Subtle status footer */}
      <div className="mt-5 flex items-center justify-between">
        <span
          className={cn(
            "font-mono-tight text-[10px] uppercase tracking-[0.22em]",
            card.isOwned ? "text-accent" : "text-muted-foreground/70"
          )}
        >
          {card.isOwned ? "In collection" : "Missing"}
        </span>
        <span className="font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {card.isOwned ? "Remove" : "Add"}
        </span>
      </div>
    </button>
  );
}
