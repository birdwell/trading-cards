import { useState, useEffect, useMemo } from "react";
import { Copy, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import { TradingCardSet, Card } from "@/types";
import EditSetHeader from "./EditSetHeader";
import EditSetForm from "./EditSetForm";
import UpdateResult from "../UpdateResult";
import EditSetCards from "./EditSetCards";
import {
  baseCardTypeToHolo,
  findMissingHoloCards,
} from "../../../../../shared/base-card-type-to-holo";

interface EditSetContentProps {
  set: TradingCardSet;
  cards: Card[];
}

interface DeleteAllVariantsConfirmationProps {
  cardCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteAllVariantsConfirmation({
  cardCount,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteAllVariantsConfirmationProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-semibold">Delete all variants</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Remove all {cardCount} card{cardCount === 1 ? "" : "s"} from this set?
          Ownership for these cards will be cleared. This cannot be undone.
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
            Delete all
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditSetContent({ set, cards }: EditSetContentProps) {
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [actionResult, setActionResult] = useState<string | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const baseCount = useMemo(
    () => cards.filter((card) => baseCardTypeToHolo(card.cardType)).length,
    [cards]
  );
  const missingHoloCount = useMemo(
    () => findMissingHoloCards(cards).length,
    [cards]
  );
  const holoCount = useMemo(
    () => cards.filter((card) => /^holo\b/i.test(card.cardType.trim())).length,
    [cards]
  );

  const updateSetMutation = useMutation(
    trpc.updateSet.mutationOptions({
      onMutate: () => {
        setIsUpdating(true);
        setUpdateResult(null);
      },
      onSuccess: () => {
        setIsUpdating(false);
        setUpdateResult({
          success: true,
          message: "Saved.",
        });
        queryClient.invalidateQueries(
          trpc.getSetWithCards.queryOptions({ setId: set.id })
        );
        queryClient.invalidateQueries(trpc.getSets.queryOptions());
        queryClient.invalidateQueries(trpc.getSetsWithStats.queryOptions());
      },
      onError: (error) => {
        setIsUpdating(false);
        setUpdateResult({ success: false, message: error.message });
      },
    })
  );

  const duplicateHoloMutation = useMutation(
    trpc.duplicateBaseAsHolo.mutationOptions({
      onMutate: () => setActionResult(null),
      onSuccess: (data) => {
        setActionResult(data.message);
        queryClient.invalidateQueries(
          trpc.getSetWithCards.queryOptions({ setId: set.id })
        );
        queryClient.invalidateQueries(trpc.getSetsWithStats.queryOptions());
      },
      onError: (error) => {
        setActionResult(error.message);
      },
    })
  );

  const deleteAllCardsMutation = useMutation(
    trpc.deleteAllCardsInSet.mutationOptions({
      onSuccess: (data) => {
        setShowDeleteAllConfirm(false);
        setActionResult(data.message);
        queryClient.invalidateQueries(
          trpc.getSetWithCards.queryOptions({ setId: set.id })
        );
        queryClient.invalidateQueries(trpc.getSetsWithStats.queryOptions());
      },
      onError: (error) => {
        setActionResult(error.message);
      },
    })
  );

  useEffect(() => {
    setName(set.name);
    setSport(set.sport);
  }, [set]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sport.trim()) return;

    updateSetMutation.mutate({
      setId: set.id,
      name: name.trim(),
      sport: sport.trim(),
    });
  };

  return (
    <div>
      <EditSetHeader setId={set.id} sport={set.sport} year={set.year} />

      <section className="pt-4">
        <EditSetForm
          name={name}
          sport={sport}
          isUpdating={isUpdating}
          onNameChange={setName}
          onSportChange={setSport}
          onSubmit={handleSubmit}
        />
        {updateResult && (
          <div className="mt-3">
            <UpdateResult result={updateResult} />
          </div>
        )}
      </section>

      <section className="pt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {cards.length} cards
            {baseCount > 0 && (
              <span>
                {" "}
                · {baseCount} base
                {holoCount > 0 ? ` · ${holoCount} holo` : ""}
              </span>
            )}
          </p>

          <button
            type="button"
            disabled={missingHoloCount === 0 || duplicateHoloMutation.isPending}
            onClick={() => {
              if (
                !window.confirm(
                  `Create Holo copies of ${missingHoloCount} base-set card${missingHoloCount === 1 ? "" : "s"}? Existing Holos are skipped.`
                )
              ) {
                return;
              }
              duplicateHoloMutation.mutate({ setId: set.id });
            }}
            className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Copy className="h-3 w-3" />
            {duplicateHoloMutation.isPending
              ? "Duplicating…"
              : "Duplicate Base as Holo"}
          </button>
        </div>

        {actionResult && (
          <p className="mb-2 text-xs text-muted-foreground">{actionResult}</p>
        )}

        <EditSetCards cards={cards} setId={set.id} />

        {cards.length > 0 && (
          <div className="mt-6 border-t border-border pt-4">
            <button
              type="button"
              disabled={deleteAllCardsMutation.isPending}
              onClick={() => setShowDeleteAllConfirm(true)}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-destructive/30 px-2.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-3 w-3" />
              Delete all variants
            </button>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Removes every card from this set. The set itself is kept.
            </p>
          </div>
        )}
      </section>

      {showDeleteAllConfirm && (
        <DeleteAllVariantsConfirmation
          cardCount={cards.length}
          onConfirm={() =>
            deleteAllCardsMutation.mutate({ setId: set.id })
          }
          onCancel={() => setShowDeleteAllConfirm(false)}
          isDeleting={deleteAllCardsMutation.isPending}
        />
      )}
    </div>
  );
}
