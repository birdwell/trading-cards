"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import DataStateWrapper from "@/components/DataStateWrapper";
import BrandOverviewGrid from "@/features/brand/BrandOverviewGrid";
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
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <main>
          <section className="py-8 md:py-10">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Brands
              </h1>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                View collection progress by manufacturer.
              </p>
            </div>
          </section>

          <section className="pb-16">
            <DataStateWrapper
              isLoading={isLoading}
              error={error?.message}
              data={brands}
            >
              {brands && <BrandOverviewGrid brands={brands} />}
            </DataStateWrapper>
          </section>
        </main>
      </div>
    </div>
  );
}
