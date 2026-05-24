"use client";

import { useState, useMemo } from "react";
import { SetWithStats } from "../types";
import TradingCardSetGrid from "../features/tradingCardSet/TradingCardSetGrid";

interface SportTabsProps {
  setsWithStats: SetWithStats[];
  onSetDeleted?: () => void;
}

type SportTab = "Basketball" | "Football";

export default function SportTabs({
  setsWithStats,
  onSetDeleted,
}: SportTabsProps) {
  const [activeTab, setActiveTab] = useState<SportTab>("Basketball");
  const [yearByTab, setYearByTab] = useState<Record<SportTab, string | null>>({
    Basketball: null,
    Football: null,
  });

  const basketballSets = setsWithStats.filter(
    (s) => s.set.sport.toLowerCase() === "basketball"
  );
  const footballSets = setsWithStats.filter(
    (s) => s.set.sport.toLowerCase() === "football"
  );

  const availableYears = useMemo(() => {
    const dedupe = (arr: SetWithStats[]) =>
      [...new Set(arr.map((s) => s.set.year))].sort().reverse();
    return {
      Basketball: dedupe(basketballSets),
      Football: dedupe(footballSets),
    };
  }, [basketballSets, footballSets]);

  const currentSetsAll =
    activeTab === "Basketball" ? basketballSets : footballSets;
  const selectedYear = yearByTab[activeTab];
  const currentSets = selectedYear
    ? currentSetsAll.filter((s) => s.set.year === selectedYear)
    : currentSetsAll;

  const handleYearFilter = (year: string | null) => {
    setYearByTab((prev) => ({ ...prev, [activeTab]: year }));
  };

  const tabs: Array<{ id: SportTab; label: string; count: number }> = [
    { id: "Basketball", label: "Basketball", count: basketballSets.length },
    { id: "Football", label: "Football", count: footballSets.length },
  ];

  return (
    <div>
      {/* Editorial tabs */}
      <div className="mb-8 flex items-end justify-between border-b border-border/60">
        <div className="flex">
          {tabs.map(({ id, label, count }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative px-1 pb-3 pr-8 transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-display text-lg tracking-tight">
                    {label}
                  </span>
                  <span className="font-mono-tight text-[10px] tabular-nums text-muted-foreground">
                    {String(count).padStart(2, "0")}
                  </span>
                </span>
                <span
                  className={`absolute inset-x-0 -bottom-px h-px origin-left transform bg-foreground transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {selectedYear && (
          <span className="hidden md:inline mb-3 font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Filtered · {selectedYear}
          </span>
        )}
      </div>

      {/* Year filter chips */}
      {availableYears[activeTab].length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-2">Year</span>
          <button
            onClick={() => handleYearFilter(null)}
            className="chip"
            data-active={selectedYear === null}
          >
            All
          </button>
          {availableYears[activeTab].map((year) => (
            <button
              key={year}
              onClick={() => handleYearFilter(year)}
              className="chip tabular-nums"
              data-active={selectedYear === year}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="min-h-[200px]">
        {currentSets.length > 0 ? (
          <TradingCardSetGrid
            setsWithStats={currentSets}
            onSetDeleted={onSetDeleted}
          />
        ) : (
          <div className="border border-dashed border-border/80 py-16 text-center">
            <p className="font-display text-xl font-light text-foreground/80">
              {selectedYear
                ? `Nothing on file for ${selectedYear}.`
                : `No ${activeTab.toLowerCase()} sets just yet.`}
            </p>
            <p className="mt-2 font-mono-tight text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Import a set to begin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
