import { TradingCardSet } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteDialogProps {
  set: TradingCardSet;
  onSuccess: () => void;
  onError: (errorMessage: string) => void;
  isDeleting: boolean;
  setIsDeleting: (isDeleting: boolean) => void;
  onCancel: () => void;
}

export default function ConfirmDeleteDialog({
  set,
  onSuccess,
  onError,
  isDeleting,
  setIsDeleting,
  onCancel,
}: ConfirmDeleteDialogProps) {
  const trpc = useTRPC();
  
  const deleteSetMutation = useMutation(trpc.deleteSet.mutationOptions({
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: any) => {
      onError(error.message);
    },
  }));

  const handleDelete = async () => {
    setIsDeleting(true);
    deleteSetMutation.mutate({ setId: set.id });
  };

  return (
    <AlertDialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Set</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{set.name}"? This will also delete all
            cards in this set. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
