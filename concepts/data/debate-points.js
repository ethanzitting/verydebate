// Curated point notes for the static replay. These are not fact checks or speaker confirmations.
window.DEBATE_POINTS = [
  {
    id: 'p01', speaker: 0, start: 50.55,
    text: 'How can men write abortion laws without this knowledge?',
    sourceIds: ['s010', 's011']
  },
  {
    id: 'p02', speaker: 1, start: 56.12,
    text: 'Can men have opinions on abortion?',
    sourceIds: ['s012'], relation: { id: 'p01', label: 'Replies to' }
  },
  {
    id: 'p03', speaker: 0, start: 58.36,
    text: 'Men can have opinions. Making laws is different.',
    sourceIds: ['s013'], relation: { id: 'p02', label: 'Answers' }
  },
  {
    id: 'p04', speaker: 1, start: 155.96,
    text: 'Abortion is wrong because it kills a baby.',
    sourceIds: ['s039', 's040'], relation: { id: 'p03', label: 'Changes the focus after' }
  },
  {
    id: 'p05', speaker: 0, start: 160.69,
    text: 'An embryo is not a baby.',
    sourceIds: ['s041', 's043'], relation: { id: 'p04', label: 'Disputes' }
  },
  {
    id: 'p06', speaker: 1, start: 172.3,
    text: 'When does an embryo become a baby?',
    sourceIds: ['s048'], relation: { id: 'p05', label: 'Questions' }
  },
  {
    id: 'p07', speaker: 0, start: 174.22,
    text: 'At birth.',
    sourceIds: ['s049'], relation: { id: 'p06', label: 'Answers' }
  },
  {
    id: 'p08', speaker: 0, start: 177.26,
    text: 'I do not support abortion until birth.',
    sourceIds: ['s051']
  },
  {
    id: 'p09', speaker: 1, start: 182.06,
    text: 'Why set a limit before birth if it is not yet a baby?',
    sourceIds: ['s052'], relation: { id: 'p08', label: 'Questions' }
  },
  {
    id: 'p10', speaker: 0, start: 284.17,
    text: 'What if the mother will die without an abortion?',
    sourceIds: ['s070']
  },
  {
    id: 'p11', speaker: 1, start: 296.71,
    text: 'At 27 weeks, why not deliver by C-section?',
    sourceIds: ['s075'], relation: { id: 'p10', label: 'Offers an alternative to' }
  },
  { id: 'break', kind: 'break', start: 398.27, end: 470.1 },
  {
    id: 'p12', speaker: 0, start: 486.19,
    text: 'What happens to children born into bad households?',
    sourceIds: ['s102']
  },
  {
    id: 'p13', speaker: 1, start: 508.36,
    text: 'Adoption should be easier. No child is unwanted.',
    sourceIds: ['s107'], relation: { id: 'p12', label: 'Replies to' }
  },
  {
    id: 'p14', speaker: 0, start: 663.88,
    text: 'An unplanned pregnancy could ruin my life.',
    sourceIds: ['s136']
  },
  {
    id: 'p15', speaker: 1, start: 668.91,
    text: 'Rape and incest are rare reasons for abortion.',
    sourceIds: ['s137'], relation: { id: 'p14', label: 'Changes the focus after' },
    status: 'Factual claim not checked'
  },
  {
    id: 'p16', speaker: 0, start: 675.77,
    text: 'I mean an unplanned pregnancy, not rape.',
    sourceIds: ['s138'], relation: { id: 'p15', label: 'Clarifies after' }
  },
  {
    id: 'p17', speaker: 1, start: 684.26,
    text: 'People should take responsibility for sex.',
    sourceIds: ['s143'], relation: { id: 'p16', label: 'Replies to' }
  },
  {
    id: 'p18', speaker: 0, start: 689.87, currentAt: 707.7, current: true,
    text: 'If I carry this baby, I may have to leave college.',
    sourceIds: ['s144', 's146', 's148'],
    reading: {
      text: 'If I became pregnant, carrying a baby could force me to leave college. I want that consequence addressed.',
      sourceIds: ['s136', 's144', 's146', 's148']
    },
    relatedSourceIds: ['s145', 's147', 's149', 's150'],
    status: 'No clear answer about college',
    detail: 'Charlie disputes the word “ruin” and discusses responsibility. This exchange does not give a college plan.'
  },
  {
    id: 'p19', speaker: 1, start: 693.63,
    text: 'A child is a blessing, not an annoyance.',
    reading: {
      text: 'I believe a child’s life starts at conception and deserves protection. That is why I oppose abortion.',
      sourceIds: ['s062', 's130', 's145']
    },
    sourceIds: ['s145'], relation: { id: 'p18', label: 'Replies to the wording at' }
  },
  {
    id: 'p20', speaker: 1, start: 712.25, currentAt: 712.25, current: true,
    text: 'Sex can lead to pregnancy. People can wait until marriage.',
    sourceIds: ['s149', 's150'],
    reading: {
      text: 'I believe abortion ends a child’s life. People who have sex should accept the chance of pregnancy or wait until marriage.',
      sourceIds: ['s062', 's143', 's149', 's150']
    },
    relation: { id: 'p18', label: 'Follows the college question from' },
    status: 'No direct answer about college',
    detail: 'Charlie argues that sex can cause pregnancy and that people can wait until marriage. He does not give a direct answer about leaving college.'
  }
];
