"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { TRPCProvider } from "../utils/trpc";
import BottomTabBar from "./BottomTabBar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <TRPCProvider>
        <div className="min-h-screen pb-[calc(4.25rem+env(safe-area-inset-bottom))]">
          {children}
        </div>
        <BottomTabBar />
      </TRPCProvider>
    </ClerkProvider>
  );
}
