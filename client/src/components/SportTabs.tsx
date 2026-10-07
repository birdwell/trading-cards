"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SetWithStats } from "../types";
import TradingCardSetGrid from "../features/tradingCardSet/TradingCardSetGrid";
import { compareSeasons } from "@/lib/seasons";

interface SportTabsProps {
  setsWithStats: SetWithStats[];
}

type SportTab = "Basketball" | "Football";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function SportTabs({ setsWithStats }: SportTabsProps) {
  const [activeTab, setActiveTab] = useState<SportTab>("Basketball");
  const [yearByTab, setYearByTab] = useState<Partial<Record<SportTab, string>>>(
    {}
  );

  const railRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef(new Map<string, HTMLButtonElement>());

  const setsBySport = useMemo(() => {
    const ofSport = (sport: string) =>
      setsWithStats.filter((s) => s.set.sport.toLowerCase() === sport);
    return {
      Basketball: ofSport("basketball"),
      Football: ofSport("football"),
    };
  }, [setsWithStats]);

  const years = useMemo(
    () =>
      [...new Set(setsBySport[activeTab].map((s) => s.set.year))].sort((a, b) =>
        compareSeasons(b, a)
      ),
    [setsBySport, activeTab]
  );

  const rememberedYear = yearByTab[activeTab];
  const selectedYear =
    (rememberedYear && years.includes(rememberedYear)
      ? rememberedYear
      : years[0]) ?? null;

  const currentSets = setsBySport[activeTab]
    .filter((s) => s.set.year === selectedYear)
    .sort((a, b) => a.set.name.localeCompare(b.set.name));

  // Keep the selected season centered when the strip is wider than the screen.
  useEffect(() => {
    const rail = railRef.current;
    const chip = selectedYear ? chipRefs.current.get(selectedYear) : undefined;
    if (!rail || !chip || rail.scrollWidth <= rail.clientWidth) return;

    rail.scrollTo({
      left: chip.offsetLeft - (rail.clientWidth - chip.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [selectedYear, activeTab]);

  const tabs: Array<{ id: SportTab; label: string; count: number }> = [
    { id: "Basketball", label: "Basketball", count: setsBySport.Basketball.length },
    { id: "Football", label: "Football", count: setsBySport.Football.length },
  ];

  return (
    <div>
      <div className="mb-3 flex justify-center fade-in">
        <div className="segment" role="tablist" aria-label="Sport">
          {tabs.map(({ id, label, count }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(id)}
                className="segment-item"
                data-active={active}
              >
                <span className="flex items-center gap-2">
                  <span>{label}</span>
                  <span
                    className={`tabular-nums text-xs ${
                      active ? "text-foreground/55" : "text-muted-foreground/80"
                    }`}
                  >
                    {count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {years.length > 0 && (
        <div
          ref={railRef}
          className="relative -mx-5 mb-5 overflow-x-auto py-1 [mask-image:linear-gradient(to_right,transparent,#000_20px,#000_calc(100%-20px),transparent)] [scrollbar-width:none] md:-mx-8 [&::-webkit-scrollbar]:hidden"
        >
          <div
            className="mx-auto flex w-max gap-1.5 px-5 md:px-8"
            role="tablist"
            aria-label="Season"
          >
            {years.map((year) => {
              const active = selectedYear === year;
              return (
                <button
                  key={year}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  ref={(el) => {
                    if (el) chipRefs.current.set(year, el);
                    else chipRefs.current.delete(year);
                  }}
                  onClick={() =>
                    setYearByTab((prev) => ({ ...prev, [activeTab]: year }))
                  }
                  className="chip shrink-0 tabular-nums"
                  data-active={active}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {currentSets.length > 0 ? (
        <TradingCardSetGrid setsWithStats={currentSets} />
      ) : (
        <div className="binder px-6 py-14 text-center">
          <p className="font-display text-lg font-semibold tracking-tight">
            {selectedYear
              ? `No sets for ${selectedYear}`
              : `No ${activeTab.toLowerCase()} sets`}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Import a set to begin
          </p>
        </div>
      )}
    </div>
  );
}
