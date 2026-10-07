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
  // A brand with one sport needs no switcher.
  const showTabs = tabs.every(({ count }) => count > 0);

  return (
    <div>
      {showTabs && (
        <div className="segment mb-4" role="tablist" aria-label="Sport">
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
      )}

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
