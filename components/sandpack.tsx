'use client';

import * as React from 'react';
import {
  SandpackCodeEditor,
  SandpackFiles,
  SandpackPreview,
  SandpackProvider,
  UseSandpack,
} from '@codesandbox/sandpack-react';
import { SandpackConsole } from '@/components/sandpack-console';
import { sandpackDark, githubLight } from '@codesandbox/sandpack-themes';
import { useTheme } from 'next-themes';
import { SandpackLayout } from './sandpack-layout';
import { cn } from '../lib/utils';

export interface SandpackProps extends React.HTMLAttributes<HTMLDivElement> {
  readOnly?: boolean;
  content?: string;
  tsconfig?: Record<PropertyKey, any>;
  dependencies?: Record<string, string>;
  registryUrl?: string;
}

export const Sandpack = React.forwardRef<UseSandpack, SandpackProps>(
  (
    {
      readOnly,
      content = '// Write your code here',
      tsconfig = {
        compilerOptions: {
          module: 'commonjs',
          jsx: 'preserve',
          esModuleInterop: true,
          allowJs: true,
          rootDir: '.',
          moduleResolution: 'node',
        },
      },
      dependencies = {},
      registryUrl = 'https://registry.npmmirror.com/',
      className,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const files = React.useMemo<SandpackFiles>(
      () => ({
        '/index.ts': { code: content, readOnly },
        '/package.json': {
          code: JSON.stringify({ dependencies, main: 'index.ts' }, null, 2),
          readOnly: true,
        },
        '/tsconfig.json': {
          code: JSON.stringify(tsconfig, null, 2),
          readOnly: true,
        },
      }),
      [content, dependencies, readOnly, tsconfig]
    );

    return (
      <SandpackProvider
        {...props}
        className={cn('w-full h-auto', 'sandpack', className)}
        files={files}
        theme={theme === 'light' ? 'light' : 'dark'}
        // theme={theme === 'light' ? githubLight : sandpackDark}
        options={{
          autorun: true,
          autoReload: false,
          // bundlerURL: 'http://localhost:61674/www',
          // bundlerURL: 'https://sandpack-bundler.codesandbox.io',
        }}
        customSetup={{
          entry: '/index.ts',
          environment: 'parcel',
          npmRegistries: [
            {
              enabledScopes: [],
              limitToScopes: false,
              proxyEnabled: false,
              registryUrl,
            },
          ],
        }}
      >
        <SandpackLayout>
          <SandpackCodeEditor
            className=""
            showLineNumbers
            showTabs={false}
            showRunButton={false}
            showInlineErrors
            showReadOnly={false}
          />
          <SandpackConsole className="h-auto min-h-12" />
        </SandpackLayout>
      </SandpackProvider>
    );
  }
);
Sandpack.displayName = 'Sandpack';
