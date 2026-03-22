'use client';

import { FC, PropsWithChildren } from 'react';
import { PasswordGate } from '@/app/components/authenticate/passwordGate';
import { DeepgramContextProvider } from '@/app/components/transcription/deepgramContextProvider';
import { MicrophoneContextProvider } from '@/app/components/microphone/microphoneContextProvider';
import { DebateSessionResettable } from '@/app/components/debate/debateSessionContext';

export const ProviderPyramid: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <PasswordGate>
      <MicrophoneContextProvider>
        <DeepgramContextProvider>
          <DebateSessionResettable>{children}</DebateSessionResettable>
        </DeepgramContextProvider>
      </MicrophoneContextProvider>
    </PasswordGate>
  );
};
