import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FC, useState } from 'react';

/**
 * Static visual representation of the reset button states,
 * since the real component depends on DebateSessionContext.
 */
const ResetButtonPreview: FC<{ confirming?: boolean }> = ({
  confirming = false,
}) => {
  const [isConfirming, setIsConfirming] = useState(confirming);

  return (
    <button
      onClick={() => setIsConfirming((c) => !c)}
      className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:border-red-300 hover:text-red-600 cursor-pointer"
    >
      {isConfirming ? 'Confirm reset?' : 'Reset'}
    </button>
  );
};

const meta: Meta<typeof ResetButtonPreview> = {
  title: 'Debate/ResetButton',
  component: ResetButtonPreview,
  decorators: [
    (Story) => (
      <div className="flex h-20 items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ResetButtonPreview>;

export const Default: Story = {
  args: { confirming: false },
};

export const Confirming: Story = {
  args: { confirming: true },
};
