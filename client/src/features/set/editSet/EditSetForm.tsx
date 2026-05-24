import { ArrowUpRight } from "lucide-react";
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
    <form onSubmit={onSubmit} className="space-y-10">
      <div>
        <label htmlFor="name" className="eyebrow mb-3 block">
          Set name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter set name"
          disabled={isUpdating}
          required
          className={cn(
            "w-full border-0 border-b border-border bg-transparent",
            "py-3 text-lg font-display font-light tracking-tight",
            "placeholder:text-muted-foreground/50 placeholder:font-sans placeholder:text-base",
            "outline-none transition-colors focus:border-foreground",
            "disabled:opacity-50"
          )}
        />
      </div>

      <div>
        <label htmlFor="sport" className="eyebrow mb-3 block">
          Sport
        </label>
        <select
          id="sport"
          value={sport}
          onChange={(e) => onSportChange(e.target.value)}
          disabled={isUpdating}
          className={cn(
            "w-full border-0 border-b border-border bg-transparent",
            "py-3 text-base text-foreground",
            "outline-none transition-colors focus:border-foreground",
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
          "group inline-flex items-center gap-3 border border-foreground bg-foreground px-6 py-3 text-sm text-background transition-all",
          "hover:bg-transparent hover:text-foreground",
          "disabled:cursor-not-allowed disabled:opacity-40"
        )}
      >
        {isUpdating ? (
          <>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
            <span className="font-medium tracking-tight">Saving…</span>
          </>
        ) : (
          <>
            <span className="font-medium tracking-tight">Save changes</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
