'use client';

import React from 'react';
import { Button, ButtonProps } from './ui/button';
import { SiFarcaster } from '@icons-pack/react-simple-icons';
import { StatusAPIResponse } from '@farcaster/auth-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { request } from '../lib/request';
import { LoaderCircle, Smartphone } from 'lucide-react';
import { useInterval } from 'usehooks-ts';

import { useQuerySession } from './web3-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QRCode } from './qrcode';
import { Address } from 'viem';
import { SessionResponseData } from '../lib/session';

const REFETCH_TIMES = 90;
const REFETCH_INTERVAL = 2000;
const HUB_ENDPOINT = process.env.FARCASTER_HUB_URL || 'hub.pinata.cloud';

export interface SIWFButtonProps extends ButtonProps {
  onSignIn?: (address: Address) => void | Promise<void>;
  onSignOut?: () => void | Promise<void>;
}

export const SIWFButton = React.forwardRef<HTMLButtonElement, SIWFButtonProps>(
  ({ onSignIn, onSignOut, ...props }, ref) => {
    const {
      data: session,
      isFetching: getSessionLoading,
      refetch: refetchSession,
    } = useQuerySession();

    const [info, setInfo] = React.useState<
      Partial<{ name: string; username: string; pfp: string; bio: string }>
    >({});

    const { data: userInfo, isFetching: getUserInfoLoading } = useQuery({
      throwOnError: false,
      enabled: !!session?.fid,
      queryKey: ['getUserInfoFromHub', session?.fid],
      refetchOnWindowFocus: true,
      queryFn: () =>
        fetch(
          `https://${HUB_ENDPOINT}/v1/userDataByFid?fid=${session?.fid}`
        ).then((res) => res.json()),
    });

    React.useEffect(() => {
      const pickValue = (key: string): string | undefined => {
        const target = userInfo?.messages?.find(
          (item: any) => item?.data?.userDataBody?.type === key
        );
        return target?.data?.userDataBody?.value;
      };
      setInfo({
        name: pickValue('USER_DATA_TYPE_DISPLAY'),
        username: pickValue('USER_DATA_TYPE_USERNAME'),
        pfp: pickValue('USER_DATA_TYPE_PFP'),
        bio: pickValue('USER_DATA_TYPE_BIO'),
      });
    }, [userInfo]);

    const [open, setOpen] = React.useState(false);
    const [delay, setDelay] = React.useState<number | null>(null);
    const refetchTimesRef = React.useRef(0);

    const { mutateAsync: verifySignInMessage } = useMutation<
      Address,
      Error,
      { message?: string; signature?: string }
    >({
      mutationKey: ['/api/siwf/verify'],
      mutationFn: (params) =>
        request(`/api/siwf/verify`, {
          method: 'POST',
          body: JSON.stringify(params),
        }),
      onSuccess: async (address) => {
        setOpen(false);
        onSignIn?.(address);
        await refetchSession();
      },
    });

    const { mutateAsync: getChannelStatus } = useMutation<
      StatusAPIResponse,
      Error,
      string
    >({
      mutationKey: ['/api/siwf/status'],
      mutationFn: (channelToken) =>
        request(`/api/siwf/status?channelToken=${channelToken}`),
      onSuccess: async (result) => {
        if (
          result.state === 'completed' ||
          refetchTimesRef.current >= REFETCH_TIMES
        ) {
          setDelay(null);
          refetchTimesRef.current = 0;
          await verifySignInMessage({
            message: result.message,
            signature: result.signature,
          });
        } else {
          refetchTimesRef.current += 1;
        }
      },
    });

    const {
      data: channelResult,
      mutateAsync: getChannelUrl,
      isPending: getChannelLoading,
    } = useMutation<{ channelUrl?: string; channelToken?: string }>({
      mutationKey: ['/api/siwf/channel'],
      mutationFn: () => request('/api/siwf/channel'),
      onSuccess: () => setDelay(REFETCH_INTERVAL),
    });
    const { channelUrl, channelToken } = channelResult || {};

    useInterval(async () => {
      await getChannelStatus(channelToken!);
    }, delay);

    const { mutateAsync: signOut } = useMutation({
      mutationKey: ['/api/siwf/signout'],
      mutationFn: () => request('/api/siwf/signout', { method: 'POST' }),
      onSuccess: async () => {
        setInfo({});
        onSignOut?.();
        await refetchSession();
      },
    });

    if (getUserInfoLoading || getSessionLoading) {
      return (
        <Button {...props} ref={ref} disabled>
          <LoaderCircle className="animate-spin mr-2 h-4" />
          Loading...
        </Button>
      );
    }

    if (info.username) {
      return (
        <Button {...props} ref={ref} onClick={() => signOut()}>
          {info.name} (@{info.username})
        </Button>
      );
    }

    return (
      <>
        <Button
          {...props}
          ref={ref}
          onClick={async () => {
            setOpen(true);
            await getChannelUrl();
          }}
        >
          <SiFarcaster className="mr-2 h-4 w-4" />
          Sign-In with Farcaster
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="w-[336px] rounded">
            <DialogHeader>
              <DialogTitle>Sign-In with Farcaster</DialogTitle>
              <DialogDescription className="grid gap-3">
                <div className="size-72 relative flex justify-center items-center border rounded-md mt-3">
                  <QRCode
                    uri={channelUrl || 'https://warpcast.com/'}
                    size={288}
                    loading={getChannelLoading}
                    ecl="low"
                  />
                  <div className="size-12 p-1 absolute rounded-md top-0 left-0 translate-y-[7.5rem] translate-x-[7.5rem] bg-background">
                    {getChannelLoading ? (
                      <LoaderCircle className="size-10 text-foreground animate-spin" />
                    ) : (
                      <SiFarcaster className="size-10 text-foreground" />
                    )}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-background px-2 text-muted-foreground">
                      or continue with
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = channelUrl!;
                    setOpen(false);
                  }}
                  disabled={getChannelLoading}
                >
                  <Smartphone className="mr-2 h-4" />
                  I&apos;m using my phone.
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);
SIWFButton.displayName = 'SIWFButton';
