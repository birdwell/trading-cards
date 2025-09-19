"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import Header from "@/components/Header";
import DataStateWrapper from "@/components/DataStateWrapper";
import BrandOverviewGrid from "@/features/brand/BrandOverviewGrid";
import Navigation from "@/components/Navigation";

export default function BrandsPage() {
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(
    trpc.getBrandOverview.queryOptions()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Header />

        <main>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Brand Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
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
