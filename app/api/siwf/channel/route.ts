import { SessionFarcaster, farcasterClient, getSession } from '@/lib/session';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await getSession<SessionFarcaster>();
  session.type = 'farcaster';

  const siweUri = request.headers.get('referer');
  const domain = request.headers.get('host');

  if (!siweUri || !domain) {
    return new Response('Invalid api call.', { status: 400 });
  }

  const { isError, data, error } = await farcasterClient.createChannel({
    siweUri,
    domain,
  });

  if (isError) {
    return new Response(error?.message || 'Internal server error.', {
      status: 500,
    });
  }

  const { nonce, url, channelToken } = data;
  session.nonce = nonce;
  session.channel = channelToken;

  await session.save();
  return Response.json({ channelUrl: url, channelToken });
}
