import { NextResponse } from 'next/server';
import { proxyJson } from '../../_helpers/proxy';

interface Params {
  params: { specimenId: string };
}

export async function GET(_: Request, context: Params): Promise<NextResponse> {
  return proxyJson(`/result/${context.params.specimenId}`, {
    method: 'GET',
  });
}
