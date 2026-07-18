"use client";

import { useState, useMemo } from "react";
import { SetWithStats } from "../types";
import TradingCardSetGrid from "../features/tradingCardSet/TradingCardSetGrid";

interface SportTabsProps {
  setsWithStats: SetWithStats[];
}

type SportTab = "Basketball" | "Football";

export default function SportTabs({ setsWithStats }: SportTabsProps) {
  const [activeTab, setActiveTab] = useState<SportTab>("Basketball");
  const [yearByTab, setYearByTab] = useState<Partial<Record<SportTab, string>>>(
    {}
  );

  const basketballSets = useMemo(
    () =>
      setsWithStats.filter((s) => s.set.sport.toLowerCase() === "basketball"),
    [setsWithStats]
  );
  const footballSets = useMemo(
    () =>
      setsWithStats.filter((s) => s.set.sport.toLowerCase() === "football"),
    [setsWithStats]
  );

  const availableYears = useMemo(() => {
    const dedupe = (arr: SetWithStats[]) =>
      [...new Set(arr.map((s) => s.set.year))].sort().reverse();
    return {
      Basketball: dedupe(basketballSets),
      Football: dedupe(footballSets),
    };
  }, [basketballSets, footballSets]);

  const years = availableYears[activeTab];
  const selectedYear =
    (yearByTab[activeTab] && years.includes(yearByTab[activeTab]!)
      ? yearByTab[activeTab]
      : years[0]) ?? null;

  const currentSetsAll =
    activeTab === "Basketball" ? basketballSets : footballSets;
  const currentSets = (
    selectedYear
      ? currentSetsAll.filter((s) => s.set.year === selectedYear)
      : currentSetsAll
  )
    .slice()
    .sort((a, b) => a.set.name.localeCompare(b.set.name));

  const tabs: Array<{ id: SportTab; label: string; count: number }> = [
    { id: "Basketball", label: "Basketball", count: basketballSets.length },
    { id: "Football", label: "Football", count: footballSets.length },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col items-center gap-3 fade-in">
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

        {years.length > 0 && (
          <div
            className="flex flex-wrap items-center justify-center gap-1.5"
            role="tablist"
            aria-label="Season"
          >
            {years.map((year) => (
              <button
                key={year}
                type="button"
                role="tab"
                aria-selected={selectedYear === year}
                onClick={() =>
                  setYearByTab((prev) => ({ ...prev, [activeTab]: year }))
                }
                className="chip tabular-nums"
                data-active={selectedYear === year}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>

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
