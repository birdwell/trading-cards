interface SetStatsProps {
  ownedCount: number;
  totalCount: number;
}

export default function SetStats({ ownedCount, totalCount }: SetStatsProps) {
  const pct = totalCount > 0 ? (ownedCount / totalCount) * 100 : 0;
  const rounded = Math.round(pct);

  return (
    <div>
      <div className="eyebrow mb-3">Completion</div>

      <div className="flex items-baseline gap-2">
        <span className="font-display text-5xl font-light tracking-tight tabular-nums">
          {rounded}
        </span>
        <span className="font-mono-tight text-sm text-muted-foreground">%</span>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="font-mono-tight text-xs tabular-nums text-foreground/80">
          {ownedCount}
          <span className="text-muted-foreground"> / {totalCount}</span>
        </span>
        <span className="font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Owned
        </span>
      </div>

      <div className="relative mt-3 h-px w-full bg-border">
        <div
          className="absolute left-0 top-0 h-px bg-foreground transition-all duration-700"
          style={{ width: `${Math.max(pct, 0)}%` }}
        />
      </div>
    </div>
  );
}
