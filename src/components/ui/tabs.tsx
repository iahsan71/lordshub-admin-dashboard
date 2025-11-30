import { useState } from "react";
import { cn } from "@/lib/utils";

const TAB_NAMES = [
  "Speed Ups",
  "War Materials",
  "Boost",
  "Resources",
  "Chests",
  "Buildings Material",
  "Familiar",
  "Energy",
] as const;

export type TabName = (typeof TAB_NAMES)[number];

interface TabsProps {
  onTabChange?: (tab: TabName) => void;
  defaultTab?: TabName;
}

export function Tabs({ onTabChange, defaultTab = "Speed Ups" }: TabsProps) {
  const [activeTab, setActiveTab] = useState<TabName>(defaultTab);

  const handleTabClick = (tab: TabName) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="w-full border-b border-gray-200">
      <div className="flex overflow-x-auto">
        {TAB_NAMES.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={cn(
              "px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors",
              "border-b-2 hover:text-gray-700 hover:border-gray-300",
              activeTab === tab
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

export { TAB_NAMES };
