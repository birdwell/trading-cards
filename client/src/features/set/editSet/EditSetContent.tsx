import { useState, useEffect } from "react";
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

export default function EditSetContent({ set, cards }: EditSetContentProps) {
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

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
          message: "Set updated successfully.",
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
    <div className="mx-auto max-w-7xl">
      <EditSetHeader setId={set.id} setName={set.name} />

      <section className="grid gap-10 py-10 md:grid-cols-12 md:py-14">
        <div className="md:col-span-7">
          <EditSetForm
            name={name}
            sport={sport}
            isUpdating={isUpdating}
            onNameChange={setName}
            onSportChange={setSport}
            onSubmit={handleSubmit}
          />
        </div>

        {updateResult && (
          <div className="md:col-span-5 md:pl-8 md:border-l md:border-border/60">
            <UpdateResult result={updateResult} setId={set.id} />
          </div>
        )}
      </section>

      <section className="border-t border-border/60 py-10 md:py-14">
        <div className="mb-6 flex items-baseline gap-4">
          <span className="font-mono-tight text-[10px] tracking-[0.28em] text-muted-foreground">
            §
          </span>
          <h2 className="font-display text-2xl font-light tracking-tight">
            Cards
          </h2>
          <span className="font-mono-tight text-xs tabular-nums text-muted-foreground">
            ({cards.length})
          </span>
        </div>
        <EditSetCards cards={cards} setId={set.id} />
      </section>
    </div>
  );
}
