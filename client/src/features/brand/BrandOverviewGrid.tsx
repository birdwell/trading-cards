import Link from "next/link";
import { ChevronRight, Upload } from "lucide-react";
import type { BrandOverviewItem } from "./buildBrandOverview";

interface BrandOverviewProps {
  brands: BrandOverviewItem[];
}

// "2024-25" ends in 2025; "1999-00" ends in 2000.
function seasonEndYear(season: string): number {
  const split = season.match(/^(\d{4})-(\d{2})$/);
  if (!split) return Number.parseInt(season, 10);
  const start = Number(split[1]);
  const end = start - (start % 100) + Number(split[2]);
  return end < start ? end + 100 : end;
}

/** Seasons are sorted oldest first; a span reads as plain calendar years. */
function formatSeasonSpan(seasons: string[]): string | null {
  if (seasons.length === 0) return null;
  if (seasons.length === 1) return seasons[0];
  const first = Number.parseInt(seasons[0], 10);
  const last = seasonEndYear(seasons[seasons.length - 1]);
  return first === last ? String(first) : `${first}–${last}`;
}

function MetaSeparator() {
  return (
    <span aria-hidden className="text-muted-foreground/40">
      ·
    </span>
  );
}

function BrandRow({
  brand,
  index,
}: {
  brand: BrandOverviewItem;
  index: number;
}) {
  const { totalOwnedCards, totalCards, totalSets } = brand.overallStats;
  const seasonSpan = formatSeasonSpan(brand.seasons);

  return (
    <li
      className="rise border-b border-border/70 last:border-b-0"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <Link
        href={`/brands/${encodeURIComponent(brand.brand)}`}
        className="group flex items-center gap-3 px-4 py-4 transition-colors hover:bg-white/[0.03] focus-visible:-outline-offset-2 sm:gap-4 sm:px-5"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display truncate text-[1.05rem] font-semibold tracking-tight text-foreground transition-colors group-hover:text-white">
              {brand.brand}
            </h2>
            <span className="shrink-0 font-mono-tight text-xs tabular-nums text-muted-foreground">
              <span className="text-foreground/90">{totalOwnedCards}</span>
              <span className="text-muted-foreground/70">/{totalCards}</span>
              <span className="sr-only"> cards owned</span>
            </span>
          </div>

          <p className="mt-1 flex min-w-0 items-center gap-x-1.5 text-xs text-muted-foreground">
            <span className="tabular-nums">
              {totalSets} {totalSets === 1 ? "set" : "sets"}
            </span>
            {seasonSpan && (
              <>
                <MetaSeparator />
                <span className="tabular-nums">{seasonSpan}</span>
              </>
            )}
          </p>

          <div aria-hidden className="foil-track mt-3">
            <div
              className="foil-fill"
              style={{
                width: `${totalCards > 0 ? (totalOwnedCards / totalCards) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <ChevronRight
          aria-hidden
          className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-foil"
        />
      </Link>
    </li>
  );
}

export function BrandOverviewSkeleton() {
  return (
    <div className="binder" aria-busy="true" aria-label="Loading brands">
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          className="border-b border-border/70 px-4 py-4 last:border-b-0 sm:px-5"
        >
          <div className="flex animate-pulse flex-col gap-2.5 motion-reduce:animate-none">
            <div className="flex items-center justify-between">
              <div className="h-4 w-36 rounded bg-muted" />
              <div className="h-3 w-12 rounded bg-muted" />
            </div>
            <div className="h-3 w-48 rounded bg-muted/70" />
            <div className="mt-1 h-[3px] w-full rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BrandOverviewEmpty() {
  return (
    <div className="binder px-6 py-14 text-center">
      <p className="font-display text-lg font-semibold tracking-tight">
        No brands yet
      </p>
      <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
        Brands appear here once you import a set from Beckett.
      </p>
      <Link
        href="/import"
        className="mt-6 inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Upload aria-hidden className="h-4 w-4" />
        Import a set
      </Link>
    </div>
  );
}

export default function BrandOverviewGrid({ brands }: BrandOverviewProps) {
  if (brands.length === 0) {
    return <BrandOverviewEmpty />;
  }

  return (
    <ul className="binder" aria-label="Brands">
      {brands.map((brand, index) => (
        <BrandRow key={brand.brand} brand={brand} index={index} />
      ))}
    </ul>
  );
}
