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
      // Invalidate queries to refresh data using proper tRPC query options
      queryClient.invalidateQueries(trpc.getSetWithCards.queryOptions({ setId: set.id }));
      queryClient.invalidateQueries(trpc.getSets.queryOptions());
      queryClient.invalidateQueries(trpc.getSetsWithStats.queryOptions());
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
    <div className="max-w-6xl mx-auto">
      {/* Edit Set Form - Top Row */}
      <div className="mb-6">
        <EditSetHeader setId={set.id} setName={set.name} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
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
            <div className="lg:col-span-1">
              <UpdateResult result={updateResult} setId={set.id} />
            </div>
          )}
        </div>
      </div>

      {/* Cards List - Bottom Row */}
      <div>
        <EditSetCards cards={cards} setId={set.id} />
      </div>
    </div>
  );
}
