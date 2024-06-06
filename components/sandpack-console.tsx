'use client';

import {
  DependenciesProgress,
  ErrorOverlay,
  LoadingOverlay,
  SandpackStack,
  useSandpack,
  useSandpackClient,
  useSandpackTheme,
} from '@codesandbox/sandpack-react';
import React from 'react';
import { Console } from 'console-feed';
import { Decode } from 'console-feed/lib/Transform';
import { Message } from 'console-feed/lib/definitions/Console';
import { Styles } from 'console-feed/lib/definitions/Styles';
import { cn } from '../lib/utils';

export interface SandpackConsoleProps {
  className?: string;
  style?: React.CSSProperties;
}

export const SandpackConsole: React.FC<SandpackConsoleProps> = ({
  className,
  style,
}) => {
  const { iframe, clientId } = useSandpackClient();
  const { theme, themeMode } = useSandpackTheme();

  const [messages, setMessages] = React.useState<Message[]>([]);
  const { listen } = useSandpack();

  React.useEffect(() => {
    const unsubscribe = listen((message) => {
      if (message.type === 'start') {
        setMessages([]);
      } else if (message.type === 'console' && message.codesandbox) {
        const msg = Decode(message.log);
        setMessages((prev) => [...prev, msg]);
      }
    }, clientId);

    return unsubscribe;
  }, [clientId, listen]);

  const variant = React.useMemo(
    () => (themeMode === 'dark' ? 'dark' : 'light'),
    [themeMode]
  );

  const styles = React.useMemo<Styles>(
    () => ({
      BASE_FONT_FAMILY: theme.font.mono,
      TREENODE_FONT_FAMILY: theme.font.mono,
      BASE_FONT_SIZE: theme.font.size,
      TREENODE_FONT_SIZE: theme.font.size,
      BASE_LINE_HEIGHT: theme.font.lineHeight,
      TREENODE_LINE_HEIGHT: theme.font.lineHeight,
      BASE_BACKGROUND_COLOR: theme.colors.surface1,
      LOG_BORDER: 'none',
    }),
    [theme]
  );

  return (
    <SandpackStack
      className={cn('bg-transparent', 'sandpack-console', className)}
      style={style}
    >
      <ErrorOverlay />
      <LoadingOverlay clientId={clientId} showOpenInCodeSandbox={false} />
      <Console logs={messages as any} variant={variant} styles={styles} />

      <DependenciesProgress clientId={clientId} />
      <iframe ref={iframe} className="hidden" />
    </SandpackStack>
  );
};
