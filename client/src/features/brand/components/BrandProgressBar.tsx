import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface BrandProgressBarProps {
  percentage: number;
  className?: string;
}

export default function BrandProgressBar({ percentage, className = "" }: BrandProgressBarProps) {
  const getProgressClasses = (percentage: number) => {
    if (percentage >= 80) return {
      bg: "bg-green-100/50 dark:bg-green-900/10",
      indicator: "[&>[data-slot=progress-indicator]]:bg-green-500"
    };
    if (percentage >= 60) return {
      bg: "bg-yellow-100/50 dark:bg-yellow-900/10", 
      indicator: "[&>[data-slot=progress-indicator]]:bg-yellow-500"
    };
    if (percentage >= 40) return {
      bg: "bg-orange-100/50 dark:bg-orange-900/10",
      indicator: "[&>[data-slot=progress-indicator]]:bg-orange-500"
    };
    return {
      bg: "bg-red-100/50 dark:bg-red-900/10",
      indicator: "[&>[data-slot=progress-indicator]]:bg-red-500"
    };
  };

  const { bg, indicator } = getProgressClasses(percentage);

  return (
    <Progress
      value={percentage}
      className={cn(
        "h-2 w-full",
        bg,
        indicator,
        className
      )}
    />
  );
}
