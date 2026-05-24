import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpdateResultProps {
  result: {
    success: boolean;
    message: string;
  };
  setId: number;
}

export default function UpdateResult({ result, setId }: UpdateResultProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "border p-5",
        result.success
          ? "border-accent/40 bg-accent/5"
          : "border-destructive/40 bg-destructive/5"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
            result.success
              ? "border-accent bg-accent text-accent-foreground"
              : "border-destructive bg-destructive text-destructive-foreground"
          )}
        >
          {result.success ? (
            <Check className="h-3 w-3" />
          ) : (
            <X className="h-3 w-3" />
          )}
        </span>
        <div>
          <p
            className={cn(
              "font-mono-tight text-[10px] uppercase tracking-[0.22em]",
              result.success ? "text-accent" : "text-destructive"
            )}
          >
            {result.success ? "Saved" : "Failed"}
          </p>
          <p className="mt-2 font-display text-lg font-light leading-snug">
            {result.message}
          </p>
          {result.success && (
            <button
              onClick={() => router.push(`/set/${setId}`)}
              className="group mt-4 inline-flex items-center gap-2 text-sm"
            >
              <span className="font-medium tracking-tight">View set</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
