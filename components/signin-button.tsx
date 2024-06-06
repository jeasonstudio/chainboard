'use client';

import { ConnectKitButton, SIWESession, useSIWE } from 'connectkit';
import React from 'react';
import { Button, ButtonProps } from './ui/button';
import { LoaderCircle, LogOut } from 'lucide-react';
import { SiEthereum } from '@icons-pack/react-simple-icons';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDisconnect } from 'wagmi';

export interface SigninButtonProps extends ButtonProps {
  onSignIn?: (session?: SIWESession) => void;
  onSignOut?: () => void;
}

export const SigninButton = React.forwardRef<
  HTMLButtonElement,
  SigninButtonProps
>(({ onSignIn, onSignOut, ...props }, ref) => {
  const { disconnectAsync } = useDisconnect();
  const { isSignedIn, signIn, isLoading } = useSIWE({
    onSignIn: (data?: SIWESession) => {
      onSignIn?.(data);
    },
    onSignOut: () => {
      onSignOut?.();
      disconnectAsync();
    },
  });

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress }) => {
        if (isConnected && isSignedIn) {
          return (
            <Button {...props} ref={ref} onClick={show}>
              {truncatedAddress}
            </Button>
          );
        }

        if (isConnected && !isSignedIn) {
          return (
            <div className="flex flex-row flex-nowrap gap-1">
              <Button
                {...props}
                ref={ref}
                className={cn('grow', props.className)}
                onClick={signIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="animate-spin mr-2 h-4" />
                    Loading...
                  </>
                ) : (
                  <>Sign({truncatedAddress})</>
                )}
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      {...props}
                      ref={ref}
                      size="icon"
                      onClick={() => disconnectAsync()}
                      disabled={isLoading}
                    >
                      <LogOut size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Disconnect Wallet</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        }

        return (
          <Button {...props} ref={ref} onClick={show}>
            <SiEthereum className="mr-2 h-4 w-4" />
            Sign-In With Ethereum
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
});

SigninButton.displayName = 'SigninButton';
