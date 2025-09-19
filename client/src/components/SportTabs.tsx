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
  const [selectedBasketballYear, setSelectedBasketballYear] = useState<
    string | null
  >(null);
  const [selectedFootballYear, setSelectedFootballYear] = useState<
    string | null
  >(null);

  // Filter sets by sport
  const basketballSets = setsWithStats.filter(
    (setWithStats) => setWithStats.set.sport.toLowerCase() === "basketball"
  );
  const footballSets = setsWithStats.filter(
    (setWithStats) => setWithStats.set.sport.toLowerCase() === "football"
  );

  // Generate available years for each sport
  const availableYears = useMemo(() => {
    const basketballYears = [...new Set(basketballSets.map((s) => s.set.year))]
      .sort()
      .reverse();
    const footballYears = [...new Set(footballSets.map((s) => s.set.year))]
      .sort()
      .reverse();

    return {
      basketball: basketballYears,
      football: footballYears,
    };
  }, [basketballSets, footballSets]);

  // Filter sets by sport and year
  const getFilteredSets = () => {
    let sets = activeTab === "Basketball" ? basketballSets : footballSets;
    const selectedYear =
      activeTab === "Basketball"
        ? selectedBasketballYear
        : selectedFootballYear;

    if (selectedYear) {
      sets = sets.filter(
        (setWithStats) => setWithStats.set.year === selectedYear
      );
    }

    return sets;
  };

  const currentSets = getFilteredSets();

  const tabButtonClass = (tab: SportTab) => `
    px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200
    ${
      activeTab === tab
        ? "bg-blue-600 text-white shadow-md"
        : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
    }
  `;

  const yearButtonClass = (isSelected: boolean) => `
    px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200
    ${
      isSelected
        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
    }
  `;

  const handleTabChange = (tab: SportTab) => {
    setActiveTab(tab);
    // Reset year filter when switching tabs
    if (tab === "Basketball") {
      setSelectedBasketballYear(null);
    } else {
      setSelectedFootballYear(null);
    }
  };

  const handleYearFilter = (year: string | null) => {
    if (activeTab === "Basketball") {
      setSelectedBasketballYear(year);
    } else {
      setSelectedFootballYear(year);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => handleTabChange("Basketball")}
          className={tabButtonClass("Basketball")}
        >
          Basketball (
          {activeTab === "Basketball"
            ? currentSets.length
            : basketballSets.length}
          )
        </button>
        <button
          onClick={() => handleTabChange("Football")}
          className={tabButtonClass("Football")}
        >
          Football (
          {activeTab === "Football" ? currentSets.length : footballSets.length})
        </button>
      </div>

      {/* Year Filters */}
      {availableYears[activeTab.toLowerCase() as keyof typeof availableYears]
        .length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400"></span>
          <button
            onClick={() => handleYearFilter(null)}
            className={yearButtonClass(
              activeTab === "Basketball"
                ? selectedBasketballYear === null
                : selectedFootballYear === null
            )}
          >
            All Years
          </button>
          {availableYears[
            activeTab.toLowerCase() as keyof typeof availableYears
          ].map((year) => (
            <button
              key={year}
              onClick={() => handleYearFilter(year)}
              className={yearButtonClass(
                activeTab === "Basketball"
                  ? selectedBasketballYear === year
                  : selectedFootballYear === year
              )}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {currentSets.length > 0 ? (
          <TradingCardSetGrid
            setsWithStats={currentSets}
            onSetDeleted={onSetDeleted}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {(() => {
                const selectedYear =
                  activeTab === "Basketball"
                    ? selectedBasketballYear
                    : selectedFootballYear;
                if (selectedYear) {
                  return `No ${activeTab.toLowerCase()} sets found for ${selectedYear}`;
                }
                return `No ${activeTab.toLowerCase()} sets found`;
              })()}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              {(() => {
                const selectedYear =
                  activeTab === "Basketball"
                    ? selectedBasketballYear
                    : selectedFootballYear;
                if (selectedYear) {
                  return `Try selecting a different year or import more ${activeTab.toLowerCase()} sets`;
                }
                return `Import some ${activeTab.toLowerCase()} sets to get started`;
              })()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
