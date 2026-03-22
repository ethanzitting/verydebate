import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PasswordGate } from './passwordGate';

const meta: Meta<typeof PasswordGate> = {
  title: 'Auth/PasswordGate',
  component: PasswordGate,
  decorators: [
    (Story) => {
      // Clear auth so the gate always shows in stories
      localStorage.removeItem('verydebate-auth');
      return (
        <div className="h-[500px] w-[700px]">
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    // Disable the default fetch mock so the story can hit the real API or show the form
    mockData: [],
  },
};

export default meta;
type Story = StoryObj<typeof PasswordGate>;

export const Default: Story = {
  render: () => (
    <PasswordGate>
      <div className="flex h-full items-center justify-center text-neutral-500">
        You are authenticated.
      </div>
    </PasswordGate>
  ),
};
