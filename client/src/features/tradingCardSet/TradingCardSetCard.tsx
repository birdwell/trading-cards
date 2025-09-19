import { SetWithStats } from "../../types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import ProgressBar from "@/components/ProgressBar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TradingCardSetCardProps {
  setWithStats: SetWithStats;
  onDeleted?: () => void;
}

export default function TradingCardSetCard({
  setWithStats,
  onDeleted,
}: TradingCardSetCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleOnSuccess = () => {
    setIsDeleting(false);
    onDeleted?.();
  };

  const handleError = (errorMessage: string) => {
    setIsDeleting(false);
    alert(errorMessage);
  };

  const handleViewCards = () => {
    router.push(`/set/${setWithStats.set.id}`);
  };

  const { set, stats } = setWithStats;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <h3 className="text-xl font-semibold">
          {set.name}
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {set.year}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="text-destructive hover:text-destructive/80 h-8 w-8 p-0"
            title="Delete set"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {stats.ownedCards}/{stats.totalCards}
            </span>
          </div>
          <ProgressBar current={stats.ownedCards} total={stats.totalCards} />
          <p className="text-xs text-muted-foreground text-center">
            {stats.totalCards > 0
              ? `${Math.round(
                  (stats.ownedCards / stats.totalCards) * 100
                )}% complete`
              : "No cards"}
          </p>
        </div>
      </CardContent>

      {showConfirmDelete && (
        <ConfirmDeleteDialog
          set={set}
          onCancel={() => setShowConfirmDelete(false)}
          onSuccess={handleOnSuccess}
          onError={handleError}
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
        />
      )}

      <CardFooter className="pt-4">
        <Button
          onClick={handleViewCards}
          className="w-full"
        >
          View Cards
        </Button>
      </CardFooter>
    </Card>
  );
}
