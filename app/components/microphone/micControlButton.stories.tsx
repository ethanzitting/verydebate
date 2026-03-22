import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MicrophoneState } from './typesAndConstants';
import { FC } from 'react';

const StaticMicButton: FC<{
  state: MicrophoneState;
  errorMessage?: string | null;
}> = ({ state, errorMessage = null }) => {
  const isOpen = state === MicrophoneState.Open;
  const isError = state === MicrophoneState.Error;

  return (
    <div className="flex flex-col items-center gap-2">
      <button className="relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 border-neutral-300 bg-white transition-colors hover:border-neutral-400">
        {isOpen && (
          <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-20" />
        )}
        {isOpen ? (
          <i
            className="fa-sharp fa-solid fa-pause"
            style={{ width: '24px', height: '24px' }}
          />
        ) : (
          <i
            className="fa-sharp fa-solid fa-microphone"
            style={{ width: '24px', height: '24px' }}
          />
        )}
        {isOpen && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
        )}
      </button>
      {isError && errorMessage && (
        <p className="max-w-64 text-center text-xs text-red-600">
          {errorMessage}
        </p>
      )}
      {state === MicrophoneState.Paused && (
        <p className="text-xs text-neutral-400">Paused</p>
      )}
    </div>
  );
};

const meta: Meta<typeof StaticMicButton> = {
  title: 'Microphone/MicControlButton',
  component: StaticMicButton,
  decorators: [
    (Story) => (
      <div className="flex h-40 w-40 items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StaticMicButton>;

export const NotRequested: Story = {
  args: { state: MicrophoneState.NotRequested },
};

export const Recording: Story = {
  args: { state: MicrophoneState.Open },
};

export const Paused: Story = {
  args: { state: MicrophoneState.Paused },
};

export const Error: Story = {
  args: {
    state: MicrophoneState.Error,
    errorMessage:
      'Microphone permission denied. Please allow access in your browser settings.',
  },
};
