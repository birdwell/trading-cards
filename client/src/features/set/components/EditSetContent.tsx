import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "../../../utils/trpc";
import { TradingCardSet } from "../../../types";
import EditSetHeader from "./EditSetHeader";
import EditSetForm from "./EditSetForm";
import UpdateResult from "./UpdateResult";

interface EditSetContentProps {
  set: TradingCardSet;
}

export default function EditSetContent({ set }: EditSetContentProps) {
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const router = useRouter();
  const utils = trpc.useUtils();

  const updateSetMutation = trpc.updateSet.useMutation({
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
      utils.getSetWithCards.invalidate({ setId: set.id });
      utils.getSets.invalidate();
    },
    onError: (error) => {
      setIsUpdating(false);
      setUpdateResult({
        success: false,
        message: error.message,
      });
    },
  });

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

  const handleBackToSet = () => {
    router.push(`/set/${set.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <EditSetHeader />
        
        <EditSetForm
          name={name}
          sport={sport}
          isUpdating={isUpdating}
          onNameChange={setName}
          onSportChange={setSport}
          onSubmit={handleSubmit}
        />

        {updateResult && (
          <UpdateResult result={updateResult} onBackToSet={handleBackToSet} />
        )}
      </div>
    </div>
  );
}
