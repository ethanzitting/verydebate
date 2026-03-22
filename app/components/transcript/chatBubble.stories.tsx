import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChatBubble } from './chatBubble';
import type { SpeakerColor } from '@/app/types';

const palette: SpeakerColor[] = [
  { bg: '#E8E0D8', text: '#5C4F42' }, // warm taupe
  { bg: '#D8E2E8', text: '#3E5060' }, // muted slate blue
  { bg: '#DDE5D8', text: '#4A5C42' }, // sage green
  { bg: '#E8D8E0', text: '#604A56' }, // dusty rose
];

const meta: Meta<typeof ChatBubble> = {
  title: 'Transcript/ChatBubble',
  component: ChatBubble,
  decorators: [
    (Story) => (
      <div className="w-[600px] bg-white p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatBubble>;

export const SingleSpeaker: Story = {
  args: {
    text: 'I think we need to consider the economic implications of this policy before moving forward.',
    speakerIndex: 0,
    speakerColor: palette[0],
    totalSpeakers: 1,
  },
};

export const TwoSpeakers_Speaker0: Story = {
  name: '2 Speakers — Speaker 0 (right)',
  args: {
    text: 'The data clearly shows that this approach has worked in other countries.',
    speakerIndex: 0,
    speakerColor: palette[0],
    totalSpeakers: 2,
  },
};

export const TwoSpeakers_Speaker1: Story = {
  name: '2 Speakers — Speaker 1 (left)',
  args: {
    text: "But the circumstances are entirely different here. You can't compare those economies directly.",
    speakerIndex: 1,
    speakerColor: palette[1],
    totalSpeakers: 2,
  },
};

export const FourSpeakers_AllPositions: Story = {
  name: '4 Speakers — All positions',
  render: () => (
    <div className="flex flex-col gap-2">
      <ChatBubble
        text="Speaker 0 — all the way right."
        speakerIndex={0}
        speakerColor={palette[0]}
        totalSpeakers={4}
      />
      <ChatBubble
        text="Speaker 1 — slightly indented from right."
        speakerIndex={1}
        speakerColor={palette[1]}
        totalSpeakers={4}
      />
      <ChatBubble
        text="Speaker 2 — slightly indented from left."
        speakerIndex={2}
        speakerColor={palette[2]}
        totalSpeakers={4}
      />
      <ChatBubble
        text="Speaker 3 — all the way left."
        speakerIndex={3}
        speakerColor={palette[3]}
        totalSpeakers={4}
      />
    </div>
  ),
};

export const InterimPreview: Story = {
  args: {
    text: 'And furthermore I believe that the...',
    speakerIndex: 0,
    speakerColor: palette[0],
    totalSpeakers: 2,
    isInterim: true,
  },
};
