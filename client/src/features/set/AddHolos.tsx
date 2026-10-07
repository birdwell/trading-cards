import { useEffect, useMemo, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import { Card } from "@/types";
import { cn } from "@/lib/utils";
import { findMissingHoloCards } from "../../../../shared/base-card-type-to-holo";

type AddHolosState =
  | { step: "idle" }
  | { step: "confirming" }
  | { step: "done"; message: string }
  | { step: "error"; message: string };

export function useAddHolos(setId: number, cards: Card[]) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [state, setState] = useState<AddHolosState>({ step: "idle" });

  const missing = useMemo(() => findMissingHoloCards(cards), [cards]);
  const rookieCount = missing.filter((card) => card.cardType !== "Holo").length;

  const mutation = useMutation(
    trpc.duplicateBaseAsHolo.mutationOptions({
      onSuccess: async (data) => {
        await Promise.all([
          queryClient.invalidateQueries(
            trpc.getSetWithCards.queryOptions({ setId })
          ),
          queryClient.invalidateQueries(trpc.getSetsWithStats.queryOptions()),
        ]);
        setState({ step: "done", message: data.message });
      },
      onError: (error) => setState({ step: "error", message: error.message }),
    })
  );

  // The success note is feedback, not content; let it clear itself.
  useEffect(() => {
    if (state.step !== "done") return;
    const timer = window.setTimeout(() => setState({ step: "idle" }), 4000);
    return () => window.clearTimeout(timer);
  }, [state]);

  return {
    missingCount: missing.length,
    rookieCount,
    state,
    isPending: mutation.isPending,
    open: () => setState({ step: "confirming" }),
    cancel: () => setState({ step: "idle" }),
    confirm: () => mutation.mutate({ setId }),
  };
}

type AddHolos = ReturnType<typeof useAddHolos>;

export function AddHolosButton({ holos }: { holos: AddHolos }) {
  if (holos.missingCount === 0) return null;

  const expanded = holos.state.step === "confirming" || holos.state.step === "error";

  return (
    <button
      type="button"
      onClick={expanded ? holos.cancel : holos.open}
      aria-expanded={expanded}
      aria-controls="add-holos-panel"
      className={cn(
        "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border px-2 text-xs font-medium transition-colors",
        expanded
          ? "border-foil/50 bg-foil/10 text-foil"
          : "border-foil/30 text-foil hover:bg-foil/10"
      )}
    >
      <Sparkles aria-hidden className="h-3 w-3" />
      Add holos
    </button>
  );
}

export function AddHolosPanel({ holos }: { holos: AddHolos }) {
  const { state, missingCount, rookieCount, isPending } = holos;

  if (state.step === "done") {
    return (
      <p
        role="status"
        className="fade-in flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Check aria-hidden className="h-3.5 w-3.5 text-foil" />
        {state.message}
      </p>
    );
  }

  if (state.step !== "confirming" && state.step !== "error") return null;

  const veteranCount = missingCount - rookieCount;
  const breakdown = [
    veteranCount > 0 && `${veteranCount} base`,
    rookieCount > 0 && `${rookieCount} rookie${rookieCount === 1 ? "" : "s"}`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      id="add-holos-panel"
      onKeyDown={(e) => {
        if (e.key === "Escape" && !isPending) holos.cancel();
      }}
      className="fade-in flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 rounded-lg border border-border bg-card px-3.5 py-3"
    >
      <div className="min-w-0 text-xs leading-5">
        <p className="text-foreground">
          Add a Holo version of {missingCount} base-set card
          {missingCount === 1 ? "" : "s"}?
        </p>
        <p
          className={cn(
            state.step === "error" ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {state.step === "error"
            ? state.message
            : `${breakdown}. Holos you already have are skipped.`}
        </p>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={holos.cancel}
          disabled={isPending}
          className="inline-flex h-8 items-center rounded-md px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={holos.confirm}
          disabled={isPending}
          autoFocus
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
        >
          {isPending
            ? "Adding…"
            : state.step === "error"
              ? "Try again"
              : `Add ${missingCount} holo${missingCount === 1 ? "" : "s"}`}
        </button>
      </div>
    </div>
  );
}
