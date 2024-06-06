'use client';

import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ConnectKitProvider,
  SIWEProvider,
  SIWESession,
  getDefaultConfig,
} from 'connectkit';
import { request } from '@/lib/request';
import { createSiweMessage } from 'viem/siwe';
import { useTheme } from 'next-themes';

const queryClient = new QueryClient();
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
  const { theme } = useTheme();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SIWEProvider
          enabled
          signOutOnDisconnect
          signOutOnAccountChange
          signOutOnNetworkChange={false}
          getNonce={() => request<string>('/api/siwe/nonce')}
          getSession={() => request<SIWESession>('/api/siwe/session')}
          signOut={() =>
            request<boolean>('/api/siwe/signout', { method: 'POST' })
          }
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
              '--ck-body-background': 'hsl(var(--background))',
              '--ck-body-background-secondary': 'hsl(var(--secondary))',
              '--ck-body-background-tertiary': 'hsl(var(--muted))',
            }}
          >
            {children}
          </ConnectKitProvider>
        </SIWEProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
