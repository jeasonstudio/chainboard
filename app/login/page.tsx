'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { SigninButton } from '@/components/signin-button';
import { Web3Provider, Web3SIWEProvider } from '@/components/web3-provider';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { toast } from '@/components/ui/use-toast';
import { SIWFButton } from '@/components/siwf-button';

export default function LoginPage() {
  return (
    <Web3Provider>
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 lg:flex dark:border-r">
          <div className="absolute inset-0 dark:bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Logo className="mr-2 h-6 w-6" />
            Chainboard
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="mt-6 border-l-2 pl-6 italic">
              <p className="text-lg">
                “This library has saved me countless hours of work and helped me
                deliver stunning designs to my clients faster than ever before.”
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>

        <div className="lg:p-8">
          <ThemeSwitcher className="absolute right-4 top-4" />
          <div className="mx-auto flex w-full flex-col justify-center space-y-12 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-4xl font-semibold tracking-tight">
                Chainboard Login
              </h1>
              <p className="text-sm text-muted-foreground">
                The shareable on-chain notebook, login for insight.
              </p>
            </div>

            <div className="grid gap-4">
              <Web3SIWEProvider
                onSignIn={() => {
                  toast({
                    title: 'Successfully',
                    description:
                      'You have successfully signed in with Ethereum',
                    duration: 3000,
                  });
                }}
              >
                <SigninButton />
              </Web3SIWEProvider>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <SIWFButton variant="outline" />
            </div>

            <p className="lg:px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our&nbsp;
              <a
                className="underline underline-offset-4 hover:text-primary"
                href="#"
              >
                Terms of Service
              </a>
              &nbsp;and&nbsp;
              <a
                className="underline underline-offset-4 hover:text-primary"
                href="#"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </Web3Provider>
  );
}
