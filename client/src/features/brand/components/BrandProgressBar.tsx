import ProgressBar from "@/components/ProgressBar";

interface BrandProgressBarProps {
  percentage: number;
  className?: string;
}

export default function BrandProgressBar({ percentage, className = "" }: BrandProgressBarProps) {
  return (
    <ProgressBar 
      percentage={percentage}
      colorCoded={false}
      className={className}
    />
  );
}
