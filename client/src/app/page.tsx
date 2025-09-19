"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import Navigation from "@/components/Navigation";
import DataStateWrapper from "@/components/DataStateWrapper";
import SportTabs from "@/components/SportTabs";
import { Button } from "@/components/ui/button";

export default function Home() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const {
    data: setsWithStats,
    isLoading,
    error,
  } = useQuery(trpc.getSetsWithStats.queryOptions());
  const router = useRouter();

  const handleSetDeleted = () => {
    // Invalidate and refetch the sets query to update the UI
    queryClient.invalidateQueries({ queryKey: ["getSetsWithStats"] });
  };

  const handleImportClick = () => {
    router.push("/import");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <main>
          <section className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Trading Card Sets</h1>
                <p className="text-muted-foreground">
                  Manage and track your trading card collection progress
                </p>
              </div>
              <Button onClick={handleImportClick} className="gap-2">
                <Plus className="w-4 h-4" />
                Import New Set
              </Button>
            </div>

            <DataStateWrapper
              isLoading={isLoading}
              error={error?.message}
              data={setsWithStats}
            >
              <SportTabs
                setsWithStats={setsWithStats!}
                onSetDeleted={handleSetDeleted}
              />
            </DataStateWrapper>
          </section>
        </main>
      </div>
    </div>
  );
}
