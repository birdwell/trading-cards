import Link from "next/link";

interface EditSetHeaderProps {
  setId: number;
  sport: string;
  year: string;
}

export default function EditSetHeader({
  setId,
  sport,
  year,
}: EditSetHeaderProps) {
  return (
    <section className="flex items-center justify-between gap-3">
      <p className="text-xs font-medium text-muted-foreground">
        {sport} · {year}
      </p>
      <Link
        href={`/set/${setId}`}
        className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        View set
      </Link>
    </section>
  );
}
