import { NextResponse } from 'next/server';
import { proxyJson } from '../_helpers/proxy';

export async function GET(): Promise<NextResponse> {
  return proxyJson('/stats', { method: 'GET' });
}
