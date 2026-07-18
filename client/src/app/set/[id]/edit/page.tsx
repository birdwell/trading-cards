"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import Navigation from "@/components/Navigation";
import DataStateWrapper from "@/components/DataStateWrapper";
import EditSetContent from "@/features/set/editSet/EditSetContent";

export default function EditSetPage() {
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
        <div className="mx-auto max-w-6xl px-6 py-4 md:px-8">
          <p className="text-sm font-medium text-destructive">Invalid set ID</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="mx-auto max-w-6xl px-6 py-4 pb-16 md:px-8">
        <DataStateWrapper
          isLoading={isLoading}
          error={error?.message}
          data={data}
        >
          {data && <EditSetContent set={data.set} cards={data.cards} />}
        </DataStateWrapper>
      </div>
    </div>
  );
}
