import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = `http://localhost:${process.env.BACKEND_PORT || "3002"}`;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return proxyToBackend(request);
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

async function proxyToBackend(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const backendUrl = `${BACKEND_URL}${url.pathname.replace("/trpc", "")}${url.search}`;

    const headers: Record<string, string> = {};
    const contentType = request.headers.get("content-type");
    if (contentType) {
      headers["Content-Type"] = contentType;
    }
    const authorization = request.headers.get("authorization");
    if (authorization) {
      headers.Authorization = authorization;
    }

    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body:
        request.method !== "GET" && request.method !== "HEAD"
          ? await request.arrayBuffer()
          : undefined,
      // @ts-expect-error Node fetch streaming request body requires duplex
      duplex: "half",
    });

    const responseHeaders = new Headers(corsHeaders());
    const passThroughHeaders = [
      "content-type",
      "cache-control",
      "connection",
      "transfer-encoding",
      "x-accel-buffering",
    ] as const;

    for (const header of passThroughHeaders) {
      const value = response.headers.get(header);
      if (value) {
        responseHeaders.set(header, value);
      }
    }

    // Prevent reverse proxies from buffering streamed tRPC responses.
    responseHeaders.set("X-Accel-Buffering", "no");
    responseHeaders.set("Cache-Control", "no-cache, no-transform");

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Backend unavailable", { status: 502 });
  }
}
