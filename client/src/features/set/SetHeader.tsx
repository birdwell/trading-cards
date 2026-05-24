import { TradingCardSet } from "@/types";

interface SetHeaderProps {
  set: TradingCardSet;
}

export default function SetHeader({ set }: SetHeaderProps) {
  const sportGlyph = set.sport.toLowerCase() === "basketball" ? "●" : "▲";

  return (
    <div>
      <div className="eyebrow mb-6 flex items-center gap-3">
        <span className="h-px w-8 bg-foreground/40" />
        <span className="flex items-center gap-2">
          <span className="text-foreground/70">{sportGlyph}</span>
          {set.sport}
        </span>
        <span className="h-3 w-px bg-border" />
        <span className="tabular-nums">{set.year}</span>
      </div>

      <h1 className="font-display text-5xl md:text-6xl font-light leading-[0.95] tracking-tight">
        {set.name}
      </h1>

      <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Tap a card to toggle whether you own it.
      </p>
    </div>
  );
}
