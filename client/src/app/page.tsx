"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import Navigation from "@/components/Navigation";
import DataStateWrapper from "@/components/DataStateWrapper";
import SportTabs from "@/components/SportTabs";

export default function Home() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const {
    data: setsWithStats,
    isLoading,
    error,
  } = useQuery(trpc.getSetsWithStats.queryOptions());
  const router = useRouter();

  const totals = useMemo(() => {
    if (!setsWithStats) return { sets: 0, owned: 0, cards: 0 };
    return setsWithStats.reduce(
      (acc, s) => ({
        sets: acc.sets + 1,
        owned: acc.owned + s.stats.ownedCards,
        cards: acc.cards + s.stats.totalCards,
      }),
      { sets: 0, owned: 0, cards: 0 }
    );
  }, [setsWithStats]);

  const completionPct =
    totals.cards > 0 ? Math.round((totals.owned / totals.cards) * 100) : 0;

  const handleSetDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ["getSetsWithStats"] });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <main>
          {/* Hero / Masthead */}
          <section className="border-b border-border/60 pb-10 pt-12 md:pt-20">
            <div className="rise grid gap-10 md:grid-cols-12 md:items-end">
              <div className="md:col-span-8">
                <div className="eyebrow mb-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-foreground/40" />
                  <span>The Collection — Volume I</span>
                </div>
                <h1 className="font-display text-5xl md:text-7xl font-light leading-[0.95] tracking-tight">
                  Your{" "}
                  <span className="italic text-accent">collection</span>,
                  <br />
                  catalogued.
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                  Track every set and card you own across basketball and
                  football.
                </p>
              </div>

              <div className="md:col-span-4 md:pl-8 md:border-l md:border-border/60">
                <div className="grid grid-cols-3 gap-6 md:grid-cols-1 md:gap-4">
                  <Stat
                    label="Sets"
                    value={totals.sets}
                    suffix=""
                    isLoading={isLoading}
                  />
                  <Stat
                    label="Cards Owned"
                    value={totals.owned}
                    suffix={` / ${totals.cards.toLocaleString()}`}
                    isLoading={isLoading}
                  />
                  <Stat
                    label="Complete"
                    value={completionPct}
                    suffix="%"
                    isLoading={isLoading}
                  />
                </div>

                <button
                  onClick={() => router.push("/import")}
                  className="group mt-8 inline-flex w-full items-center justify-between gap-3 border border-border bg-card/40 px-4 py-3 text-sm text-foreground transition-colors hover:border-foreground/60 hover:bg-card"
                >
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono-tight text-[10px] tracking-[0.22em] text-muted-foreground">
                      NEW
                    </span>
                    <span className="font-medium tracking-tight">
                      Import a set
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </button>
              </div>
            </div>
          </section>

          {/* Index */}
          <section className="py-10 md:py-14">
            <div className="mb-6 flex items-baseline justify-between">
              <div className="flex items-baseline gap-4">
                <span className="font-mono-tight text-[10px] tracking-[0.28em] text-muted-foreground">
                  §
                </span>
                <h2 className="font-display text-2xl font-light tracking-tight">
                  Index of Sets
                </h2>
              </div>
              <span className="hidden md:inline font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Filed by sport &amp; year
              </span>
            </div>

            <DataStateWrapper
              isLoading={isLoading}
              error={error?.message}
              data={setsWithStats}
            >
              <SportTabs
                setsWithStats={setsWithStats!}
                onSetDeleted={handleSetDeleted}
              />
            </DataStateWrapper>
          </section>
        </main>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  suffix,
  isLoading,
}: {
  label: string;
  value: number;
  suffix?: string;
  isLoading?: boolean;
}) {
  return (
    <div>
      <div className="eyebrow mb-2">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-3xl md:text-4xl font-light tracking-tight tabular-nums">
          {isLoading ? "—" : value.toLocaleString()}
        </span>
        {suffix && (
          <span className="font-mono-tight text-xs text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
