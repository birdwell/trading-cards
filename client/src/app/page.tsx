"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { trpc } from "../utils/trpc";
import Header from "../components/Header";
import DataStateWrapper from "../components/DataStateWrapper";
import TradingCardSetGrid from "../components/TradingCardSetGrid";

export default function Home() {
  const { data: sets, isLoading, error } = trpc.getSets.useQuery();
  const utils = trpc.useUtils();
  const router = useRouter();

  const handleSetDeleted = () => {
    // Invalidate and refetch the sets query to update the UI
    utils.getSets.invalidate();
  };

  const handleImportClick = () => {
    router.push("/import");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Header />
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
              data={sets}
            >
              <TradingCardSetGrid sets={sets!} onSetDeleted={handleSetDeleted} />
            </DataStateWrapper>
          </section>
        </main>
      </div>
    </div>
  );
}
