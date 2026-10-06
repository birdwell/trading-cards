"use client";

import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { hasClerkPublishableKey } from "@/lib/is-clerk-configured";

function ClerkAuthControls() {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex items-center">
      {isSignedIn ? (
        <UserButton />
      ) : (
        <SignInButton mode="modal">
          <button
            type="button"
            className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Sign in
          </button>
        </SignInButton>
      )}
    </div>
  );
}

export default function Navigation() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-8">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Almanac
        </Link>

        {hasClerkPublishableKey() ? <ClerkAuthControls /> : null}
      </div>
    </header>
  );
}
