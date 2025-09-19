import { useState } from "react";
import { Check } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import { Card } from "@/types";
import { Card as UICard, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    <UICard className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              #{card.cardNumber}
            </Badge>
            {card.isOwned && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Owned
              </Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleOwnership}
            disabled={isUpdating}
            className={`p-1.5 h-auto rounded-full transition-all duration-200 ${
              card.isOwned
                ? "bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                : "bg-muted text-muted-foreground hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400"
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
          </Button>
        </div>

        <h3 className="text-lg font-semibold mb-2">
          {card.playerName}
        </h3>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {card.cardType}
          </p>
        </div>
      </CardContent>
    </UICard>
  );
}
