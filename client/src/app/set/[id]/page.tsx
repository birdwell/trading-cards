"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import Navigation from "@/components/Navigation";
import DataStateWrapper from "@/components/DataStateWrapper";
import SetDetailsContent from "@/features/set/SetDetailsContent";

export default function SetDetailsPage() {
  const params = useParams();
  const setId = parseInt(params.id as string);
  const trpc = useTRPC();

  const { data, isLoading, error } = useQuery({
    ...trpc.getSetWithCards.queryOptions({ setId }),
    enabled: !isNaN(setId),
  });

  if (isNaN(setId)) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 text-center">
          <p className="font-display text-2xl font-light text-destructive">
            Invalid set ID
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
          {data && <SetDetailsContent set={data.set} cards={data.cards} />}
        </DataStateWrapper>
      </div>
    </div>
  );
}
