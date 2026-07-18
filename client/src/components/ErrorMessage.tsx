interface ErrorMessageProps {
  error: string;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-destructive/50 p-4">
      <p className="text-sm font-medium text-destructive">Couldn&apos;t load data</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {error}
      </p>
    </div>
  );
}
