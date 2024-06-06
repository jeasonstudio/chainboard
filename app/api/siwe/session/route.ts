import { NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (session.siwe?.address) {
    return Response.json({
      address: session.siwe.address,
      chainId: session.siwe?.chainId,
    });
  }

  return new Response('Unauthorized', { status: 401 });
}
