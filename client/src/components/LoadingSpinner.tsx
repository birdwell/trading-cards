export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <span className="relative flex h-2 w-32 overflow-hidden bg-border">
        <span className="absolute inset-y-0 left-0 w-1/3 animate-[loading_1.2s_ease-in-out_infinite] bg-foreground" />
      </span>
      <span className="font-mono-tight text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        Gathering the catalog
      </span>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
