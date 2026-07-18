interface SetStatsProps {
  ownedCount: number;
  totalCount: number;
}

export default function SetStats({ ownedCount, totalCount }: SetStatsProps) {
  const pct = totalCount > 0 ? (ownedCount / totalCount) * 100 : 0;
  const rounded = Math.round(pct);

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div className="foil-track w-16 shrink-0 sm:w-20">
        <div className="foil-fill" style={{ width: `${Math.max(pct, 0)}%` }} />
      </div>
      <span className="shrink-0 font-mono-tight text-xs tabular-nums text-muted-foreground">
        <span className="text-foreground">{ownedCount}</span>/{totalCount}
        <span className="ml-1.5 text-muted-foreground">{rounded}%</span>
      </span>
    </div>
  );
}
