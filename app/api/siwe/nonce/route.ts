import { generateSiweNonce } from 'viem/siwe';
import { getSession } from '@/lib/session';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const nonce = generateSiweNonce();

  const session = await getSession();
  session.type = 'ethereum';
  session.nonce = nonce;
  await session.save();

  return Response.json(nonce);
}
