import { SessionOptions, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SiweMessage } from 'viem/siwe';
import { createAppClient, viemConnector } from '@farcaster/auth-client';

export interface SessionBase {
  type: 'ethereum' | 'farcaster';
  nonce?: string;
  siwe?: Partial<SiweMessage>;
}

export interface SessionEthereum extends SessionBase {
  type: 'ethereum';
}

export interface SessionFarcaster extends SessionBase {
  type: 'farcaster';
  fid?: number;
  channel?: string; // uuid
}

export type SessionValue = SessionEthereum | SessionFarcaster;

export interface SessionResponseData {
  type: SessionBase['type'];
  address: SiweMessage['address'];
  chainId?: number;
  fid?: number;
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

export const getSession = async <T extends SessionValue>() =>
  getIronSession<T>(cookies(), sessionOptions);

export const farcasterClient = createAppClient({
  relay: process.env.FARCASTER_RELAY || 'https://relay.farcaster.xyz',
  ethereum: viemConnector(),
});
