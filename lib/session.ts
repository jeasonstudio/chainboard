import { SessionOptions, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SiweMessage } from 'viem/siwe';

export interface SessionValue {
  nonce?: string;
  siwe?: Partial<SiweMessage>;
}

export const cookieName = 'chainboard-session';

export const sessionOptions: SessionOptions = {
  cookieName,
  password: process.env.SESSION_PASSWORD!,
  cookieOptions: {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  },
};

export const getSession = async () =>
  getIronSession<SessionValue>(cookies(), sessionOptions);
