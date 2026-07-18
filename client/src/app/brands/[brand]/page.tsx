"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import Navigation from "@/components/Navigation";
import DataStateWrapper from "@/components/DataStateWrapper";
import BrandDetailsContent from "@/features/brand/BrandDetailsContent";
import { buildBrandDetails } from "@/features/brand/buildBrandDetails";

export default function BrandDetailsPage() {
  const params = useParams();
  const brandName = decodeURIComponent(params.brand as string);
  const trpc = useTRPC();

  const { data: setsWithStats, isLoading, error } = useQuery(
    trpc.getSetsWithStats.queryOptions()
  );

  const data = useMemo(
    () =>
      setsWithStats && brandName
        ? buildBrandDetails(setsWithStats, brandName)
        : undefined,
    [setsWithStats, brandName]
  );

  if (!brandName) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-8">
          <p className="text-base font-medium text-destructive">
            Invalid brand name
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
        <DataStateWrapper
          isLoading={isLoading}
          error={
            error?.message ??
            (setsWithStats && !data ? "Brand not found" : undefined)
          }
          data={data}
        >
          {data && <BrandDetailsContent brandData={data} />}
        </DataStateWrapper>
      </div>
    </div>
  );
}
