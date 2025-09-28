import { NextResponse } from 'next/server';

const API_BASE = process.env.AUTHORITY_API_URL ?? 'http://localhost:3333';

export async function proxyRequest(
  request: Request,
  path: string,
  init?: RequestInit,
): Promise<NextResponse> {
  try {
    const upstream = await fetch(`${API_BASE}${path}`, {
      method: request.method,
      headers: {
        'Content-Type': request.headers.get('content-type') ?? 'application/json',
        ...(request.headers.get('authorization')
          ? { Authorization: request.headers.get('authorization') as string }
          : {}),
        ...init?.headers,
      },
      body:
        request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
      ...init,
    });

    const payload = await upstream.text();
    const contentType = upstream.headers.get('content-type') ?? 'application/json';

    return new NextResponse(payload, {
      status: upstream.status,
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Authority API unavailable',
        detail:
          'Start the API server with `pnpm dev:api` and ensure AUTHORITY_API_URL is reachable.',
      },
      { status: 503 },
    );
  }
}

export async function proxyJson(path: string, init: RequestInit): Promise<NextResponse> {
  try {
    const upstream = await fetch(`${API_BASE}${path}`, init);
    const payload = await upstream.text();
    const contentType = upstream.headers.get('content-type') ?? 'application/json';

    return new NextResponse(payload, {
      status: upstream.status,
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Authority API unavailable',
        detail:
          'Start the API server with `pnpm dev:api` and ensure AUTHORITY_API_URL is reachable.',
      },
      { status: 503 },
    );
  }
}
