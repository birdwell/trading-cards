"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import type { AppRouter } from "../../../server/api/trpc/router";

// Create tRPC context with type-safe providers and hooks
export const { TRPCProvider: TRPCContextProvider, useTRPC } =
  createTRPCContext<AppRouter>();

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

function getUrl() {
  // In production, use environment variable or same domain with /trpc path
  // In development, use localhost with backend port
  const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT || '3002';
  
  if (typeof window !== "undefined") {
    // Browser environment
    if (window.location.hostname === "localhost") {
      return `http://localhost:${backendPort}`;
    } else {
      // Production - Railway deployment, use same domain with /trpc path
      return process.env.NEXT_PUBLIC_API_URL || `${window.location.protocol}//${window.location.hostname}/trpc`;
    }
  }
  // Server-side rendering - use environment variable or default
  return process.env.NEXT_PUBLIC_API_URL || `http://localhost:${backendPort}`;
}

export function TRPCProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>
) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: getUrl(),
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCContextProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCContextProvider>
    </QueryClientProvider>
  );
}
