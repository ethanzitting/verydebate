import { useEffect, useState } from 'react';
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

const streamingUtterances: Utterance[] = [
  { id: '1', speakerIndex: 0, text: 'Welcome everyone. Let me lay out the ground rules for tonight.', timestampMs: 1000 },
  { id: '2', speakerIndex: 1, text: 'Sounds good. I have a lot to say on this topic.', timestampMs: 2000 },
  { id: '3', speakerIndex: 0, text: 'Each speaker gets two minutes for opening statements. No interruptions.', timestampMs: 3000 },
  { id: '4', speakerIndex: 1, text: "Fair enough. I'll go first if that's alright.", timestampMs: 4000 },
  { id: '5', speakerIndex: 0, text: 'Please, go ahead.', timestampMs: 5000 },
  { id: '6', speakerIndex: 1, text: 'The fundamental problem with the current approach is that it ignores decades of research showing the opposite conclusion.', timestampMs: 6000 },
  { id: '7', speakerIndex: 0, text: "That's a bold claim. Can you cite specific studies?", timestampMs: 7000 },
  { id: '8', speakerIndex: 1, text: 'Absolutely. The Stanford meta-analysis from 2023 reviewed over 400 papers and found consistent results.', timestampMs: 8000 },
  { id: '9', speakerIndex: 0, text: "I'm familiar with that study. But the methodology has been widely criticized.", timestampMs: 9000 },
  { id: '10', speakerIndex: 1, text: 'By whom? The criticism came from a single lab with a known conflict of interest.', timestampMs: 10000 },
  { id: '11', speakerIndex: 0, text: "That's not entirely accurate. Several independent reviewers raised concerns about sample selection.", timestampMs: 11000 },
  { id: '12', speakerIndex: 1, text: 'Minor methodological quibbles that did not affect the core findings.', timestampMs: 12000 },
];

const meta: Meta<typeof TranscriptView> = {
  title: 'Transcript/TranscriptView',
  component: TranscriptView,
  decorators: [
    (Story) => (
      <div className="mx-auto h-[500px] w-[700px] bg-white">
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

/**
 * Appends utterances one at a time on a 1.5s interval.
 * Auto-scrolls to bottom. Scroll up to see the "New messages" button.
 */
export const AutoScrollDemo: Story = {
  render: () => {
    const [utterances, setUtterances] = useState<Utterance[]>([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
      if (index >= streamingUtterances.length) return;

      const timer = setTimeout(() => {
        setUtterances((prev) => [...prev, streamingUtterances[index]]);
        setIndex((i) => i + 1);
      }, 1500);

      return () => clearTimeout(timer);
    }, [index]);

    return (
      <TranscriptView
        utterances={utterances}
        palette={palette}
        totalSpeakers={2}
      />
    );
  },
};
