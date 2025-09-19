import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current?: number;
  total?: number;
  percentage?: number;
  colorCoded?: boolean;
  className?: string;
}

export default function ProgressBar({ 
  current, 
  total, 
  percentage: directPercentage, 
  colorCoded = false, 
  className = "" 
}: ProgressBarProps) {
  // Calculate percentage from current/total or use direct percentage
  const percentage = directPercentage !== undefined 
    ? directPercentage 
    : (total && total > 0 ? (current || 0) / total * 100 : 0);

  const getColorClasses = (percentage: number) => {
    if (!colorCoded) return "";
    
    if (percentage >= 80) return "bg-green-100/50 dark:bg-green-900/10 [&>[data-slot=progress-indicator]]:bg-green-500";
    if (percentage >= 60) return "bg-yellow-100/50 dark:bg-yellow-900/10 [&>[data-slot=progress-indicator]]:bg-yellow-500";
    if (percentage >= 40) return "bg-orange-100/50 dark:bg-orange-900/10 [&>[data-slot=progress-indicator]]:bg-orange-500";
    return "bg-red-100/50 dark:bg-red-900/10 [&>[data-slot=progress-indicator]]:bg-red-500";
  };
  
  return (
    <Progress
      value={percentage}
      className={cn("h-2 w-full", getColorClasses(percentage), className)}
    />
  );
}
