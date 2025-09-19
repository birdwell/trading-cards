"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import DataStateWrapper from "@/components/DataStateWrapper";
import BrandOverviewGrid from "@/features/brand/BrandOverviewGrid";
import Navigation from "@/components/Navigation";

export default function BrandsPage() {
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(
    trpc.getBrandOverview.queryOptions()
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <main>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Brand Overview
            </h1>
            <p className="text-muted-foreground">
              View your collection progress across different trading card brands
            </p>
          </div>

          <DataStateWrapper
            isLoading={isLoading}
            error={error?.message}
            data={data}
          >
            {data && <BrandOverviewGrid brands={data} />}
          </DataStateWrapper>
        </main>
      </div>
    </div>
  );
}
