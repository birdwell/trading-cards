import React, { useState } from "react";

interface BrandTabsProps {
  children: React.ReactNode;
  defaultTab?: "basketball" | "football";
}

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: string;
}

function TabButton({ isActive, onClick, children, icon }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors rounded-t-lg ${
        isActive
          ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
      }`}
    >
      <span className="text-lg">{icon}</span>
      {children}
    </button>
  );
}

export default function BrandTabs({ children, defaultTab = "basketball" }: BrandTabsProps) {
  const [activeTab, setActiveTab] = useState<"basketball" | "football">(defaultTab);

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-600">
        <TabButton
          isActive={activeTab === "basketball"}
          onClick={() => setActiveTab("basketball")}
          icon="🏀"
        >
          Basketball
        </TabButton>
        <TabButton
          isActive={activeTab === "football"}
          onClick={() => setActiveTab("football")}
          icon="🏈"
        >
          Football
        </TabButton>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && (child.props as any).sport === activeTab) {
            return child;
          }
          return null;
        })}
      </div>
    </div>
  );
}
