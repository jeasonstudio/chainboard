import { NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  const session = await getSession();
  session.destroy();

  return Response.json(true);
}
