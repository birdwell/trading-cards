"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import Navigation from "@/components/Navigation";
import DataStateWrapper from "@/components/DataStateWrapper";
import SportTabs from "@/components/SportTabs";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <main>
          <section className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Current Sets
              </h2>
              <button
                onClick={handleImportClick}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
                Import New Set
              </button>
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
