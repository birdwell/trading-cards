interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="border border-dashed border-border/80 py-16 text-center">
      <p className="font-display text-xl font-light text-foreground/80">
        {message}
      </p>
      <p className="mt-2 font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Nothing on file
      </p>
    </div>
  );
}
