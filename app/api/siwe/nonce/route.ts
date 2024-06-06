import { NextRequest } from 'next/server';
import { generateSiweNonce } from 'viem/siwe';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const nonce = generateSiweNonce();

  const session = await getSession();
  session.nonce = nonce;
  await session.save();

  return Response.json(nonce);
}
