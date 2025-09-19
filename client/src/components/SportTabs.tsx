"use client";

import { useState, useMemo } from "react";
import { SetWithStats } from "../types";
import TradingCardSetGrid from "../features/tradingCardSet/TradingCardSetGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  const handleTabChange = (value: string) => {
    const tab = value as SportTab;
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
    <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
      <TabsList>
        <TabsTrigger value="Basketball">
          Basketball
          <Badge variant="secondary" className="ml-2">
            {activeTab === "Basketball" ? currentSets.length : basketballSets.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="Football">
          Football
          <Badge variant="secondary" className="ml-2">
            {activeTab === "Football" ? currentSets.length : footballSets.length}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="Basketball" className="space-y-4">
        {/* Year Filters for Basketball */}
        {availableYears.basketball.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={selectedBasketballYear === null ? "default" : "outline"}
              size="sm"
              onClick={() => handleYearFilter(null)}
            >
              All Years
            </Button>
            {availableYears.basketball.map((year) => (
              <Button
                key={year}
                variant={selectedBasketballYear === year ? "default" : "outline"}
                size="sm"
                onClick={() => handleYearFilter(year)}
              >
                {year}
              </Button>
            ))}
          </div>
        )}

        {/* Basketball Content */}
        <div className="min-h-[200px]">
          {currentSets.length > 0 ? (
            <TradingCardSetGrid
              setsWithStats={currentSets}
              onSetDeleted={onSetDeleted}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {selectedBasketballYear
                  ? `No basketball sets found for ${selectedBasketballYear}`
                  : "No basketball sets found"}
              </p>
              <p className="text-muted-foreground/60 text-sm mt-2">
                {selectedBasketballYear
                  ? "Try selecting a different year or import more basketball sets"
                  : "Import some basketball sets to get started"}
              </p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="Football" className="space-y-4">
        {/* Year Filters for Football */}
        {availableYears.football.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={selectedFootballYear === null ? "default" : "outline"}
              size="sm"
              onClick={() => handleYearFilter(null)}
            >
              All Years
            </Button>
            {availableYears.football.map((year) => (
              <Button
                key={year}
                variant={selectedFootballYear === year ? "default" : "outline"}
                size="sm"
                onClick={() => handleYearFilter(year)}
              >
                {year}
              </Button>
            ))}
          </div>
        )}

        {/* Football Content */}
        <div className="min-h-[200px]">
          {currentSets.length > 0 ? (
            <TradingCardSetGrid
              setsWithStats={currentSets}
              onSetDeleted={onSetDeleted}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {selectedFootballYear
                  ? `No football sets found for ${selectedFootballYear}`
                  : "No football sets found"}
              </p>
              <p className="text-muted-foreground/60 text-sm mt-2">
                {selectedFootballYear
                  ? "Try selecting a different year or import more football sets"
                  : "Import some football sets to get started"}
              </p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
