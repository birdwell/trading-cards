import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpdateResultProps {
  result: {
    success: boolean;
    message: string;
  };
}

export default function UpdateResult({ result }: UpdateResultProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border px-3 py-2 text-xs",
        result.success
          ? "border-border bg-card text-muted-foreground"
          : "border-destructive/50 text-destructive"
      )}
    >
      {result.success ? (
        <Check className="h-3 w-3 shrink-0 text-foreground" />
      ) : (
        <X className="h-3 w-3 shrink-0" />
      )}
      <span>{result.message}</span>
    </div>
  );
}
