"use client";

import { useQuery } from "@tanstack/react-query";
import DataStateWrapper from "@/components/DataStateWrapper";
import Navigation from "@/components/Navigation";
import SportTabs from "@/components/SportTabs";
import { SetWithStats } from "@/types";
import { useTRPC } from "@/utils/trpc";

interface HomeContentProps {
  initialSetsWithStats: SetWithStats[];
}

export default function HomeContent({
  initialSetsWithStats,
}: HomeContentProps) {
  const trpc = useTRPC();
  const {
    data: setsWithStats,
    isLoading,
    error,
  } = useQuery({
    ...trpc.getSetsWithStats.queryOptions(),
    initialData: initialSetsWithStats,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-2xl px-5 md:max-w-3xl md:px-8">
        <main className="py-6 pb-20">
          <DataStateWrapper
            isLoading={isLoading}
            error={error?.message}
            data={setsWithStats}
          >
            <SportTabs setsWithStats={setsWithStats} />
          </DataStateWrapper>
        </main>
      </div>
    </div>
  );
}
