import { SessionFarcaster, getSession } from '@/lib/session';
import { NextApiRequest } from 'next';

export async function GET(request: NextApiRequest) {
  const session = await getSession();

  if (!session.type || !session.siwe?.address) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (session.type === 'farcaster' && !session.fid) {
    return new Response('Unauthorized', { status: 401 });
  }

  return Response.json({
    type: session.type,
    fid: (session as SessionFarcaster).fid,
    address: session.siwe.address,
    chainId: session.siwe?.chainId,
  });
}
