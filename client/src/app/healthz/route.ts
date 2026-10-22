import { NextResponse } from "next/server";

const BACKEND_URL = `http://localhost:${process.env.BACKEND_PORT || "3002"}`;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Render health check (render.yaml healthCheckPath). Returns 200 only when both
// Next.js and the tRPC server in the same container respond, so Render
// restarts the instance if the backend process dies. Does not query Postgres.
export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/healthz`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      return new NextResponse("backend unhealthy", { status: 503 });
    }

    return new NextResponse("ok", {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return new NextResponse("backend unavailable", { status: 503 });
  }
}
