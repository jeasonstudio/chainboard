'use client';

import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import {
  ConnectKitProvider,
  SIWEProvider,
  SIWESession,
  getDefaultConfig,
} from 'connectkit';
import { request } from '@/lib/request';
import { createSiweMessage } from 'viem/siwe';
import { useTheme } from 'next-themes';
import { Address } from 'viem';
import { SessionResponseData, SessionValue } from '@/lib/session';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const config = createConfig(
  getDefaultConfig({
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(),
    },
    multiInjectedProviderDiscovery: true,
    walletConnectProjectId: '23d914d833c97525236dc4841f22fc34',
    appName: 'Chainboard',
    appDescription: 'The shareable on-chain notebook',
    // appUrl: 'https://family.co', // your app's url
    // appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

export interface Web3ProviderProps {}

export const Web3Provider: React.FC<
  React.PropsWithChildren<Web3ProviderProps>
> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export const useQuerySession = (options?: any) => {
  return useQuery<SessionResponseData>({
    ...options,
    queryKey: ['/api/session'],
    queryFn: () => request('/api/session'),
  });
};

export interface Web3SIWEProviderProps {
  onSignIn?: (address?: Address) => void | Promise<void>;
  onSignOut?: () => void | Promise<void>;
}

export const Web3SIWEProvider: React.FC<
  React.PropsWithChildren<Web3SIWEProviderProps>
> = ({ children, onSignIn, onSignOut }) => {
  const { theme } = useTheme();
  const { refetch } = useQuerySession();
  return (
    <SIWEProvider
      enabled
      signOutOnDisconnect
      signOutOnAccountChange
      signOutOnNetworkChange={false}
      getNonce={() => request<string>('/api/siwe/nonce')}
      getSession={() => refetch().then(({ data }) => data as SIWESession)}
      signOut={() => request<boolean>('/api/siwe/signout', { method: 'POST' })}
      verifyMessage={({ message, signature }) => {
        return request<boolean>('/api/siwe/verify', {
          method: 'POST',
          body: JSON.stringify({ message, signature }),
        });
      }}
      createMessage={(args) =>
        createSiweMessage({
          ...args,
          domain: window.location.hostname,
          uri: window.location.origin,
          version: '1',
        })
      }
      onSignIn={(data) => onSignIn?.(data?.address)}
      onSignOut={() => onSignOut?.()}
    >
      <ConnectKitProvider
        mode={theme === 'light' ? 'light' : 'dark'}
        customTheme={{
          '--ck-border-radius': 'var(--radius)',
          '--ck-primary-button-border-radius': 'var(--radius)',
          '--ck-secondary-button-border-radius': 'var(--radius)',
          '--ck-tertiary-button-border-radius': 'var(--radius)',
          '--ck-qr-border-radius': 'var(--radius)',
          '--ck-recent-badge-border-radius': 'var(--radius)',
          '--ck-body-background': 'hsl(var(--card))',
          '--ck-body-background-secondary': 'hsl(var(--secondary))',
          '--ck-body-background-tertiary': 'hsl(var(--muted))',
          '--ck-font-family': 'var(--font-inter)',
        }}
      >
        {children}
      </ConnectKitProvider>
    </SIWEProvider>
  );
};
