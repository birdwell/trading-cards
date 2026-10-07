import { Check } from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hasClerkPublishableKey } from "@/lib/is-clerk-configured";
import { useTRPC } from "@/utils/trpc";
import { Card, SetWithStats, TradingCardSet } from "@/types";
import { cn } from "@/lib/utils";

interface SetCardProps {
  card: Card;
  onOwnershipChange?: () => void;
  /** Overrides the card type shown on the row; empty hides it. */
  typeLabel?: string;
}

type SetWithCardsData = {
  set: TradingCardSet;
  cards: Card[];
};

function SetCardRow({
  card,
  onClick,
  typeLabel = card.cardType,
}: {
  card: Card;
  onClick: () => void;
  typeLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={card.isOwned ? "Mark as not owned" : "Mark as owned"}
      className={cn(
        "group flex w-full items-center gap-3 border-b border-border/70 px-3 py-2 text-left transition-colors last:border-b-0",
        "hover:bg-white/[0.03]",
        card.isOwned && "bg-foil/[0.04]"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
          card.isOwned
            ? "border-foil bg-foil text-primary-foreground"
            : "border-border text-transparent group-hover:border-foreground/40"
        )}
      >
        <Check className="h-3 w-3" />
      </span>

      <span className="w-8 shrink-0 font-mono-tight text-xs tabular-nums text-muted-foreground">
        #{card.cardNumber}
      </span>

      <span className="min-w-0 flex-1 truncate text-sm font-medium">
        {card.playerName}
      </span>

      {typeLabel && (
        <span className="max-w-[40%] shrink-0 truncate text-xs text-muted-foreground">
          {typeLabel}
        </span>
      )}
    </button>
  );
}

function useOwnershipMutation(
  card: Card,
  onOwnershipChange?: () => void
) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const setQuery = trpc.getSetWithCards.queryOptions({ setId: card.setId });
  const setsWithStatsQuery = trpc.getSetsWithStats.queryOptions();

  return useMutation(
    trpc.updateCardOwnership.mutationOptions({
      onMutate: async (input) => {
        await queryClient.cancelQueries(setQuery);

        const previousSet = queryClient.getQueryData<SetWithCardsData>(
          setQuery.queryKey
        );
        const previousSetsWithStats = queryClient.getQueryData<SetWithStats[]>(
          setsWithStatsQuery.queryKey
        );

        queryClient.setQueryData<SetWithCardsData>(setQuery.queryKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            cards: old.cards.map((c) =>
              c.id === input.cardId ? { ...c, isOwned: input.isOwned } : c
            ),
          };
        });

        const ownedDelta = input.isOwned ? 1 : -1;
        queryClient.setQueryData<SetWithStats[]>(
          setsWithStatsQuery.queryKey,
          (old) => {
            if (!old) return old;
            return old.map((entry) => {
              if (entry.set.id !== card.setId) return entry;
              return {
                ...entry,
                stats: {
                  ...entry.stats,
                  ownedCards: Math.max(0, entry.stats.ownedCards + ownedDelta),
                },
              };
            });
          }
        );

        onOwnershipChange?.();
        return { previousSet, previousSetsWithStats };
      },
      onError: (err, _input, context) => {
        if (context?.previousSet) {
          queryClient.setQueryData(setQuery.queryKey, context.previousSet);
        }
        if (context?.previousSetsWithStats) {
          queryClient.setQueryData(
            setsWithStatsQuery.queryKey,
            context.previousSetsWithStats
          );
        }
        console.error("Failed to update card ownership:", err);
      },
    })
  );
}

function ClerkSetCard({ card, onOwnershipChange, typeLabel }: SetCardProps) {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const updateOwnershipMutation = useOwnershipMutation(card, onOwnershipChange);

  const handleToggleOwnership = () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    updateOwnershipMutation.mutate({
      cardId: card.id,
      isOwned: !card.isOwned,
    });
  };

  return (
    <SetCardRow
      card={card}
      onClick={handleToggleOwnership}
      typeLabel={typeLabel}
    />
  );
}

function GuestSetCard({ card, typeLabel }: SetCardProps) {
  return (
    <SetCardRow card={card} onClick={() => undefined} typeLabel={typeLabel} />
  );
}

export default function SetCard(props: SetCardProps) {
  return hasClerkPublishableKey() ? (
    <ClerkSetCard {...props} />
  ) : (
    <GuestSetCard {...props} />
  );
}
