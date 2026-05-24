interface BrandProgressBarProps {
  percentage: number;
  className?: string;
}

export default function BrandProgressBar({
  percentage,
  className = "",
}: BrandProgressBarProps) {
  return (
    <div className={`relative h-px w-full bg-border ${className}`}>
      <div
        className="absolute left-0 top-0 h-px bg-foreground transition-all duration-500"
        style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
      />
    </div>
  );
}
