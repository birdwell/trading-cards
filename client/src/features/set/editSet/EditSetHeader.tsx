import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditSetHeaderProps {
  setId: number;
  setName?: string;
}

export default function EditSetHeader({ setId, setName }: EditSetHeaderProps) {
  const router = useRouter();

  return (
    <section className="rise border-b border-border/60 pb-10">
      <button
        onClick={() => router.push(`/set/${setId}`)}
        className="group mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        <span className="font-mono-tight uppercase tracking-[0.22em] text-[10px]">
          Back to set
        </span>
      </button>

      <div className="eyebrow mb-6 flex items-center gap-3">
        <span className="h-px w-8 bg-foreground/40" />
        <span>Manage</span>
      </div>
      <h1 className="font-display text-5xl md:text-6xl font-light leading-[0.95] tracking-tight">
        Edit{" "}
        <span className="italic text-accent">set</span>.
      </h1>
      {setName && (
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {setName}
        </p>
      )}
    </section>
  );
}
