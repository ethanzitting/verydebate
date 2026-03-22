import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TranscriptView } from './transcriptView';
import type { SpeakerColor, Utterance } from '@/app/types';

const palette: SpeakerColor[] = [
  { bg: '#E8E0D8', text: '#5C4F42' },
  { bg: '#D8E2E8', text: '#3E5060' },
  { bg: '#DDE5D8', text: '#4A5C42' },
  { bg: '#E8D8E0', text: '#604A56' },
];

const twoSpeakerUtterances: Utterance[] = [
  {
    id: '1',
    speakerIndex: 0,
    text: "Good evening. Tonight's topic is universal basic income. I'll argue in favor.",
    timestampMs: 1000,
  },
  {
    id: '2',
    speakerIndex: 1,
    text: "And I'll be arguing against. Let's get started.",
    timestampMs: 2000,
  },
  {
    id: '3',
    speakerIndex: 0,
    text: 'UBI would eliminate poverty and give people the freedom to pursue meaningful work rather than just survival jobs.',
    timestampMs: 3000,
  },
  {
    id: '4',
    speakerIndex: 1,
    text: "That sounds idealistic, but the cost would be astronomical. Where does the money come from? You'd need to raise taxes significantly.",
    timestampMs: 4000,
  },
  {
    id: '5',
    speakerIndex: 0,
    text: "Studies from Finland and Canada show that the cost is offset by reduced healthcare spending, lower crime rates, and increased economic activity. It's an investment, not an expense.",
    timestampMs: 5000,
  },
  {
    id: '6',
    speakerIndex: 1,
    text: "Those were small-scale pilots. Scaling to an entire country is a completely different challenge. The inflation risk alone should give us pause.",
    timestampMs: 6000,
  },
];

const fourSpeakerUtterances: Utterance[] = [
  {
    id: '1',
    speakerIndex: 0,
    text: "Let's discuss the future of remote work.",
    timestampMs: 1000,
  },
  {
    id: '2',
    speakerIndex: 3,
    text: 'I think hybrid is the clear winner. Full remote is isolating.',
    timestampMs: 2000,
  },
  {
    id: '3',
    speakerIndex: 1,
    text: 'Disagree. Remote work has been the biggest productivity boost in decades.',
    timestampMs: 3000,
  },
  {
    id: '4',
    speakerIndex: 2,
    text: "Productivity metrics don't capture collaboration quality though.",
    timestampMs: 4000,
  },
  {
    id: '5',
    speakerIndex: 0,
    text: "That's a fair point. The question is whether in-person collaboration is worth the commute cost.",
    timestampMs: 5000,
  },
  {
    id: '6',
    speakerIndex: 3,
    text: 'For brainstorming and team building, absolutely. For heads-down work, no.',
    timestampMs: 6000,
  },
];

const meta: Meta<typeof TranscriptView> = {
  title: 'Transcript/TranscriptView',
  component: TranscriptView,
  decorators: [
    (Story) => (
      <div className="mx-auto w-[700px] bg-white">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TranscriptView>;

export const TwoSpeakerDebate: Story = {
  args: {
    utterances: twoSpeakerUtterances,
    palette,
    totalSpeakers: 2,
  },
};

export const TwoSpeakerWithInterim: Story = {
  args: {
    utterances: twoSpeakerUtterances,
    palette,
    totalSpeakers: 2,
    interimPreview: {
      text: 'Well if you look at the data from...',
      speakerIndex: 0,
    },
  },
};

export const FourSpeakerDebate: Story = {
  args: {
    utterances: fourSpeakerUtterances,
    palette,
    totalSpeakers: 4,
  },
};

export const Empty: Story = {
  args: {
    utterances: [],
    palette,
    totalSpeakers: 0,
  },
};
