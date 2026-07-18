import { auth } from "@clerk/nextjs/server";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import HomeContent from "@/features/home/HomeContent";
import type { AppRouter } from "../../../server/api/trpc/router";

const BACKEND_URL = `http://localhost:${process.env.BACKEND_PORT || "3002"}`;

export default async function Home() {
  const { getToken } = await auth();
  const token = await getToken();
  const trpc = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: BACKEND_URL,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    ],
  });
  const initialSetsWithStats = await trpc.getSetsWithStats.query();

  return <HomeContent initialSetsWithStats={initialSetsWithStats} />;
}
