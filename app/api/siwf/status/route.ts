import { SessionFarcaster, farcasterClient, getSession } from '@/lib/session';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await getSession<SessionFarcaster>();
  const channelToken = request.nextUrl.searchParams.get('channelToken');

  if (!channelToken) {
    return new Response('Invalid param: channelToken', { status: 400 });
  }

  if (session.type !== 'farcaster' || channelToken !== session.channel) {
    return new Response('Invalid channel', { status: 400 });
  }

  const result = await farcasterClient.status({ channelToken });

  if (result.isError) {
    return new Response(result.error?.message || 'Internal server error.', {
      status: 500,
    });
  }

  const { nonce, signature, message, fid, state } = result.data;

  if (nonce !== session.nonce) {
    return new Response('Internal server error.', {
      status: 500,
    });
  }

  return Response.json({ signature, message, fid, state });
}
