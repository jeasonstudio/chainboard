import { NextRequest } from 'next/server';
import { parseSiweMessage } from 'viem/siwe';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { getSession } from '@/lib/session';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export async function POST(request: NextRequest) {
  const { message, signature } = await request.json();

  const valid = await publicClient.verifySiweMessage({
    message,
    signature,
  });

  const session = await getSession();
  const siwe = parseSiweMessage(message);

  if (session.type !== 'ethereum') {
    return new Response('Invalid session type.', { status: 400 });
  }

  if (!session.nonce || siwe.nonce !== session.nonce) {
    return new Response('Nonce not match.', { status: 400 });
  }

  if (!valid) {
    return new Response('Invalid signature.', { status: 400 });
  }

  session.siwe = siwe;
  await session.save();

  return Response.json(siwe.address);
}
