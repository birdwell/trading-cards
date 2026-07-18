interface BrandProgressBarProps {
  percentage: number;
  className?: string;
}

export default function BrandProgressBar({
  percentage,
  className = "",
}: BrandProgressBarProps) {
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-muted ${className}`}>
      <div
        className="h-full rounded-full bg-foreground transition-[width] duration-300"
        style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
      />
    </div>
  );
}
