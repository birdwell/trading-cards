"use client";

import { useEffect, useState } from "react";
import { api } from "../utils/trpc";
import { TradingCardSet } from "../types";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import TradingCardSetGrid from "../components/TradingCardSetGrid";

export default function Home() {
  const [sets, setSets] = useState<TradingCardSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        setIsLoading(true);
        const data = await api.getSets();
        setSets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch sets");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSets();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <main>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              Current Sets
            </h2>

            {isLoading && <LoadingSpinner />}

            {error && <ErrorMessage error={error} />}

            {!isLoading && !error && sets.length === 0 && <EmptyState />}

            {!isLoading && !error && sets.length > 0 && (
              <TradingCardSetGrid sets={sets} />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
