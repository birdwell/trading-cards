"use client";

import React, { useEffect, useState } from "react";

interface BrandTabsProps {
  children: React.ReactNode;
  basketballCount?: number;
  footballCount?: number;
}

function getDefaultTab(
  basketballCount: number,
  footballCount: number
): "basketball" | "football" {
  return basketballCount > 0
    ? "basketball"
    : footballCount > 0
      ? "football"
      : "basketball";
}

export default function BrandTabs({
  children,
  basketballCount = 0,
  footballCount = 0,
}: BrandTabsProps) {
  const [activeTab, setActiveTab] = useState<"basketball" | "football">(() =>
    getDefaultTab(basketballCount, footballCount)
  );

  useEffect(() => {
    setActiveTab((current) => {
      const currentCount =
        current === "basketball" ? basketballCount : footballCount;
      if (currentCount > 0) return current;
      return getDefaultTab(basketballCount, footballCount);
    });
  }, [basketballCount, footballCount]);

  const tabs: Array<{
    id: "basketball" | "football";
    label: string;
    count: number;
  }> = [
    { id: "basketball", label: "Basketball", count: basketballCount },
    { id: "football", label: "Football", count: footballCount },
  ];

  return (
    <div>
      <div className="mb-8 inline-flex rounded-lg border border-border p-1">
        {tabs.map(({ id, label, count }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{label}</span>
                <span className={active ? "text-background/70" : "text-muted-foreground"}>
                  {count}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {React.Children.map(children, (child) => {
        if (
          React.isValidElement(child) &&
          (child.props as { sport?: string }).sport === activeTab
        ) {
          return child;
        }
        return null;
      })}
    </div>
  );
}
