"use client";

import React, { useState } from "react";

interface BrandTabsProps {
  children: React.ReactNode;
  basketballCount?: number;
  footballCount?: number;
}

export default function BrandTabs({
  children,
  basketballCount = 0,
  footballCount = 0,
}: BrandTabsProps) {
  const [activeTab, setActiveTab] = useState<"basketball" | "football">(() =>
    basketballCount > 0
      ? "basketball"
      : footballCount > 0
        ? "football"
        : "basketball"
  );

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
      <div className="mb-8 flex border-b border-border/60">
        {tabs.map(({ id, label, count }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`relative pb-3 pr-8 transition-colors ${
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
                className={`absolute inset-x-0 -bottom-px h-px origin-left bg-foreground transition-transform duration-300 ${
                  active ? "scale-x-100" : "scale-x-0"
                }`}
              />
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
