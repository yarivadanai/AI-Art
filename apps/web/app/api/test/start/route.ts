import { NextResponse } from 'next/server';
import { proxyRequest } from '../../_helpers/proxy';

export async function POST(request: Request): Promise<NextResponse> {
  return proxyRequest(request, '/test/start');
}
