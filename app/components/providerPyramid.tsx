import { FC, PropsWithChildren } from 'react';
import { DeepgramContextProvider } from '@/app/components/transcription/deepgramContextProvider';
import { MicrophoneContextProvider } from '@/app/components/microphone/microphoneContextProvider';

export const ProviderPyramid: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <MicrophoneContextProvider>
      <DeepgramContextProvider>{children}</DeepgramContextProvider>
    </MicrophoneContextProvider>
  );
};
