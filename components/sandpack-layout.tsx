'use client';

import * as React from 'react';
import { useSandpack } from '@codesandbox/sandpack-react';
import { cn, useCombinedRefs } from '@/lib/utils';

export interface SandpackLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SandpackLayout = React.forwardRef<
  HTMLDivElement,
  SandpackLayoutProps
>(({ children, className, ...props }, ref) => {
  const { sandpack } = useSandpack();
  const combinedRef = useCombinedRefs(sandpack.lazyAnchorRef, ref);
  return (
    <div
      ref={combinedRef}
      className={cn(
        'h-auto w-full flex-auto flex-col overflow-hidden flex-wrap items-stretch gap-2',
        'sandpack-layout'
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SandpackLayout.displayName = 'SandpackLayout';
