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
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 text-center">
          <p className="font-display text-2xl font-light text-destructive">
            Invalid brand name
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10 md:py-14">
        <DataStateWrapper
          isLoading={isLoading}
          error={error?.message}
          data={data}
        >
          {data && <BrandDetailsContent brandData={data} />}
        </DataStateWrapper>
      </div>
    </div>
  );
}
