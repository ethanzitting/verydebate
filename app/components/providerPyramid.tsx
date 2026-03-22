'use client';

import { FC, PropsWithChildren } from 'react';
import { PasswordGate } from '@/app/components/authenticate/passwordGate';
import { DeepgramContextProvider } from '@/app/components/transcription/deepgramContextProvider';
import { MicrophoneContextProvider } from '@/app/components/microphone/microphoneContextProvider';

export const ProviderPyramid: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <PasswordGate>
      <MicrophoneContextProvider>
        <DeepgramContextProvider>{children}</DeepgramContextProvider>
      </MicrophoneContextProvider>
    </PasswordGate>
  );
};
