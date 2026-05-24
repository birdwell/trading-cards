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
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <main>
          <section className="border-b border-border/60 pb-10 pt-12 md:pt-20">
            <div className="rise">
              <div className="eyebrow mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-foreground/40" />
                <span>Publishers — Volume I</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-light leading-[0.95] tracking-tight">
                By{" "}
                <span className="italic text-accent">brand</span>.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Collection progress grouped by manufacturer across every set
                you&apos;ve imported.
              </p>
            </div>
          </section>

          <section className="py-10 md:py-14">
            <DataStateWrapper
              isLoading={isLoading}
              error={error?.message}
              data={data}
            >
              {data && <BrandOverviewGrid brands={data} />}
            </DataStateWrapper>
          </section>
        </main>
      </div>
    </div>
  );
}
