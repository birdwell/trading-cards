import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = `http://localhost:${process.env.BACKEND_PORT || '3002'}`;

export async function GET(request: NextRequest) {
  return proxyToBackend(request);
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request);
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

async function proxyToBackend(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const backendUrl = `${BACKEND_URL}${url.pathname.replace('/trpc', '')}${url.search}`;
    
    console.log(`Proxying request to: ${backendUrl}`);
    
    const response = await fetch(backendUrl, {
      method: request.method,
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json',
      },
      body: request.method !== 'GET' ? await request.text() : undefined,
    });

    const data = await response.text();
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('Backend unavailable', { status: 502 });
  }
}
