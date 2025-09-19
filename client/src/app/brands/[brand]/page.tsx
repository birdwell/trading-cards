"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import Navigation from "@/components/Navigation";
import DataStateWrapper from "@/components/DataStateWrapper";
import BrandDetailsContent from "@/features/brand/BrandDetailsContent";

export default function BrandDetailsPage() {
  const params = useParams();
  const brandName = decodeURIComponent(params.brand as string);
  const trpc = useTRPC();

  const { data, isLoading, error } = useQuery({
    ...trpc.getBrandDetails.queryOptions({ brandName }),
    enabled: !!brandName,
  });

  if (!brandName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Invalid brand name</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <main>
          <DataStateWrapper
            isLoading={isLoading}
            error={error?.message}
            data={data}
          >
            {data && <BrandDetailsContent brandData={data} />}
          </DataStateWrapper>
        </main>
      </div>
    </div>
  );
}
