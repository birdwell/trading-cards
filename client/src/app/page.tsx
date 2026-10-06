import { auth } from "@clerk/nextjs/server";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import HomeContent from "@/features/home/HomeContent";
import { isClerkConfigured } from "@/lib/is-clerk-configured";
import type { SetWithStats } from "@/types";
import type { AppRouter } from "../../../server/api/trpc/router";

export const dynamic = "force-dynamic";

const BACKEND_URL = `http://localhost:${process.env.BACKEND_PORT || "3002"}`;

async function getAuthToken(): Promise<string | null> {
  if (!isClerkConfigured()) {
    return null;
  }

  try {
    const { getToken } = await auth();
    return await getToken();
  } catch (error) {
    console.error("Failed to read Clerk session token", error);
    return null;
  }
}

async function loadInitialSets(token: string | null): Promise<SetWithStats[]> {
  const trpc = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: BACKEND_URL,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    ],
  });

  return trpc.getSetsWithStats.query();
}

export default async function Home() {
  let initialSetsWithStats: SetWithStats[] | undefined;

  try {
    const token = await getAuthToken();
    initialSetsWithStats = await loadInitialSets(token);
  } catch (error) {
    console.error("Failed to preload homepage sets", error);
  }

  return <HomeContent initialSetsWithStats={initialSetsWithStats} />;
}
