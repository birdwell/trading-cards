"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import DataStateWrapper from "@/components/DataStateWrapper";
import BrandOverviewGrid, {
  BrandOverviewEmpty,
  BrandOverviewSkeleton,
} from "@/features/brand/BrandOverviewGrid";
import { buildBrandOverview } from "@/features/brand/buildBrandOverview";
import Navigation from "@/components/Navigation";

export default function BrandsPage() {
  const trpc = useTRPC();
  // Same query as Collection — cache hit when navigating between tabs
  const { data, isLoading, error } = useQuery(
    trpc.getSetsWithStats.queryOptions()
  );

  const brands = useMemo(
    () => (data ? buildBrandOverview(data) : undefined),
    [data]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="mx-auto max-w-2xl px-5 md:max-w-3xl md:px-8">
        <main className="py-6 pb-20">
          <DataStateWrapper
            isLoading={isLoading}
            error={error?.message}
            data={brands}
            loadingComponent={<BrandOverviewSkeleton />}
            emptyComponent={<BrandOverviewEmpty />}
          >
            {brands && <BrandOverviewGrid brands={brands} />}
          </DataStateWrapper>
        </main>
      </div>
    </div>
  );
}
