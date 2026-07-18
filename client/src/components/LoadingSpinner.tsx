export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <span className="relative flex h-1.5 w-32 overflow-hidden rounded-full bg-muted">
        <span className="absolute inset-y-0 left-0 w-1/3 animate-[loading_1.2s_ease-in-out_infinite] rounded-full bg-foreground" />
      </span>
      <span className="text-sm text-muted-foreground">
        Loading…
      </span>
    </div>
  );
}
