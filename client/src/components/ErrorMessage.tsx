interface ErrorMessageProps {
  error: string;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="border border-destructive/40 bg-destructive/5 p-5">
      <p className="font-mono-tight text-[10px] uppercase tracking-[0.22em] text-destructive">
        Error
      </p>
      <p className="mt-2 font-display text-lg font-light leading-snug text-foreground/90">
        {error}
      </p>
    </div>
  );
}
