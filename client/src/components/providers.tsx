"use client";

import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { hasClerkPublishableKey } from "@/lib/is-clerk-configured";
import { TRPCProvider } from "../utils/trpc";
import BottomTabBar from "./BottomTabBar";

function AppShell({ children }: { children: ReactNode }) {
  return (
    <TRPCProvider>
      <div className="min-h-screen pb-[calc(4.25rem+env(safe-area-inset-bottom))]">
        {children}
      </div>
      <BottomTabBar />
    </TRPCProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  if (!hasClerkPublishableKey()) {
    return <AppShell>{children}</AppShell>;
  }

  return (
    <ClerkProvider>
      <AppShell>{children}</AppShell>
    </ClerkProvider>
  );
}
