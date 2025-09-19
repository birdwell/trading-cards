import { Calendar } from "lucide-react";
import BrandSportSection from "./BrandSportSection";

interface BrandYearGroupProps {
  yearGroup: {
    year: string;
    basketball: Array<{
      set: {
        id: number;
        name: string;
        year: string;
        sport: string;
      };
      stats: {
        totalCards: number;
        ownedCards: number;
      };
    }>;
    football: Array<{
      set: {
        id: number;
        name: string;
        year: string;
        sport: string;
      };
      stats: {
        totalCards: number;
        ownedCards: number;
      };
    }>;
  };
  onSetClick: (setId: number) => void;
}

export default function BrandYearGroup({ yearGroup, onSetClick }: BrandYearGroupProps) {
  const hasAnySets = yearGroup.basketball.length > 0 || yearGroup.football.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {yearGroup.year}
        </h2>
      </div>

      <BrandSportSection
        sport="basketball"
        sets={yearGroup.basketball}
        onSetClick={onSetClick}
      />

      <BrandSportSection
        sport="football"
        sets={yearGroup.football}
        onSetClick={onSetClick}
      />

      {/* Empty State */}
      {!hasAnySets && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No sets found for {yearGroup.year}
          </p>
        </div>
      )}
    </div>
  );
}
