import { useState, useEffect, useMemo } from "react";
import { Copy } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import { TradingCardSet, Card } from "@/types";
import EditSetHeader from "./EditSetHeader";
import EditSetForm from "./EditSetForm";
import UpdateResult from "../UpdateResult";
import EditSetCards from "./EditSetCards";

interface EditSetContentProps {
  set: TradingCardSet;
  cards: Card[];
}

function isBaseCardType(cardType: string): boolean {
  return /^base\b/i.test(cardType.trim());
}

export default function EditSetContent({ set, cards }: EditSetContentProps) {
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [holoResult, setHoloResult] = useState<string | null>(null);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const baseCount = useMemo(
    () => cards.filter((card) => isBaseCardType(card.cardType)).length,
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
      onMutate: () => setHoloResult(null),
      onSuccess: (data) => {
        setHoloResult(data.message);
        queryClient.invalidateQueries(
          trpc.getSetWithCards.queryOptions({ setId: set.id })
        );
        queryClient.invalidateQueries(trpc.getSetsWithStats.queryOptions());
      },
      onError: (error) => {
        setHoloResult(error.message);
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
            disabled={baseCount === 0 || duplicateHoloMutation.isPending}
            onClick={() => {
              if (
                !window.confirm(
                  `Create Holo copies of ${baseCount} Base card${baseCount === 1 ? "" : "s"}? Existing Holos are skipped.`
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

        {holoResult && (
          <p className="mb-2 text-xs text-muted-foreground">{holoResult}</p>
        )}

        <EditSetCards cards={cards} setId={set.id} />
      </section>
    </div>
  );
}
