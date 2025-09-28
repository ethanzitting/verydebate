'use client';

import { LiveClient, SOCKET_STATES } from '@deepgram/sdk';

import {
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import { useConnectToDeepgramOnMicrophoneReady } from '@/app/components/transcription/useConnectToDeepgramOnMicrophoneReady';

export interface DeepgramContext {
  connection: LiveClient | null;
  connectionState: SOCKET_STATES;
}

const defaultDeepgramContext: DeepgramContext = {
  connection: null,
  connectionState: SOCKET_STATES.closed,
};

const deepgramContext = createContext<DeepgramContext>(defaultDeepgramContext);

export function useDeepgramContext(): DeepgramContext {
  return useContext(deepgramContext);
}

interface DeepgramContextProviderProps {
  children: ReactNode;
}

export const DeepgramContextProvider: FunctionComponent<
  DeepgramContextProviderProps
> = ({ children }) => {
  const { connection, connectionState } =
    useConnectToDeepgramOnMicrophoneReady();

  const value = useMemo(() => {
    return {
      connection,
      connectionState,
    };
  }, [connection, connectionState]);

  return (
    <deepgramContext.Provider value={value}>
      {children}
    </deepgramContext.Provider>
  );
};
