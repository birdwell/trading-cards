import { TradingCardSet } from "@/types";

interface SetHeaderProps {
  set: TradingCardSet;
}

export default function SetHeader({ set }: SetHeaderProps) {
  return (
    <h1 className="font-display min-w-0 truncate text-xl font-semibold tracking-tight md:text-2xl">
      {set.name}
    </h1>
  );
}
