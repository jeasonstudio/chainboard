import { NextRequest } from 'next/server';
import { SessionFarcaster, farcasterClient, getSession } from '@/lib/session';
import { SiweMessage } from 'viem/siwe';

export async function POST(request: NextRequest) {
  const session = await getSession<SessionFarcaster>();
  if (!session.nonce) {
    return new Response('Invalid session', { status: 401 });
  }

  const { message, signature } = await request.json();
  const domain = request.headers.get('host')!;

  if (!message || !signature) {
    return new Response('Invalid params', { status: 400 });
  }

  const result = await farcasterClient.verifySignInMessage({
    nonce: session.nonce,
    domain,
    message,
    signature,
  });

  if (result.isError) {
    return new Response(result.error?.message || 'Internal server error.', {
      status: 500,
    });
  }

  session.siwe = result.data as SiweMessage;
  session.fid = result.fid;

  await session.save();
  return Response.json(true);
}
