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

  const updateSetMutation = useMutation(trpc.updateSet.mutationOptions({
    onMutate: () => {
      setIsUpdating(true);
      setUpdateResult(null);
    },
    onSuccess: () => {
      setIsUpdating(false);
      setUpdateResult({
        success: true,
        message: "Set updated successfully!",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['getSetWithCards', { setId: set.id }] });
      queryClient.invalidateQueries({ queryKey: ['getSets'] });
    },
    onError: (error: any) => {
      setIsUpdating(false);
      setUpdateResult({
        success: false,
        message: error.message,
      });
    },
  }));

  // Initialize form with current data
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
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Set Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <EditSetHeader setId={set.id} setName={set.name} />

          <EditSetForm
            name={name}
            sport={sport}
            isUpdating={isUpdating}
            onNameChange={setName}
            onSportChange={setSport}
            onSubmit={handleSubmit}
          />

          {updateResult && (
            <UpdateResult result={updateResult} setId={set.id} />
          )}
        </div>

        {/* Cards Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <EditSetCards cards={cards} setId={set.id} />
        </div>
      </div>
    </div>
  );
}
