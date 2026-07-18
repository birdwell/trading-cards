import { Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditSetFormProps {
  name: string;
  sport: string;
  isUpdating: boolean;
  onNameChange: (name: string) => void;
  onSportChange: (sport: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EditSetForm({
  name,
  sport,
  isUpdating,
  onNameChange,
  onSportChange,
  onSubmit,
}: EditSetFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <div className="min-w-0 flex-1">
        <label htmlFor="name" className="mb-1 block text-xs text-muted-foreground">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Set name"
          disabled={isUpdating}
          required
          className={cn(
            "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm",
            "outline-none transition-colors placeholder:text-muted-foreground focus:border-ring",
            "disabled:opacity-50"
          )}
        />
      </div>

      <div className="w-full sm:w-40">
        <label
          htmlFor="sport"
          className="mb-1 block text-xs text-muted-foreground"
        >
          Sport
        </label>
        <select
          id="sport"
          value={sport}
          onChange={(e) => onSportChange(e.target.value)}
          disabled={isUpdating}
          className={cn(
            "h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground",
            "outline-none transition-colors focus:border-ring",
            "disabled:opacity-50"
          )}
        >
          <option value="Basketball">Basketball</option>
          <option value="Football">Football</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isUpdating || !name.trim() || !sport.trim()}
        className={cn(
          "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors",
          "hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        {isUpdating ? (
          <>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
            Saving…
          </>
        ) : (
          <>
            <Save className="h-3 w-3" />
            Save
          </>
        )}
      </button>
    </form>
  );
}
