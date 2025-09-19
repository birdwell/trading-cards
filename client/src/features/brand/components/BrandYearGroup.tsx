import { Calendar } from "lucide-react";
import BrandSportSection from "./BrandSportSection";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">
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
            <p className="text-muted-foreground">
              No sets found for {yearGroup.year}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
