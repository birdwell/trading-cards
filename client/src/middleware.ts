import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { isClerkConfigured } from "@/lib/is-clerk-configured";

const runClerk = clerkMiddleware();

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent
) {
  // Production Clerk throws on every request when keys are missing.
  // Keep pages available anonymously until Railway has Clerk configured.
  if (!isClerkConfigured()) {
    return NextResponse.next();
  }

  return runClerk(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
