import { generateSiweNonce } from 'viem/siwe';
import { getSession } from '@/lib/session';
import { NextApiRequest } from 'next';

export async function GET(request: NextApiRequest) {
  const nonce = generateSiweNonce();

  const session = await getSession();
  session.type = 'ethereum';
  session.nonce = nonce;
  await session.save();

  return Response.json(nonce);
}
