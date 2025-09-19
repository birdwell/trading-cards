import { Progress } from "@/components/ui/progress";

interface SetStatsProps {
  ownedCount: number;
  totalCount: number;
}

export default function SetStats({ ownedCount, totalCount }: SetStatsProps) {
  const completionPercentage = totalCount > 0 ? (ownedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-muted/50 rounded-lg p-4 min-w-[140px]">
      <div className="text-center">
        <div className="text-xl font-bold">
          {ownedCount}/{totalCount}
        </div>
        <div className="text-sm text-muted-foreground">
          Cards Owned
        </div>
        <div className="mt-2">
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </div>
    </div>
  );
}
