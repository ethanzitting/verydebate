// Manual likely meanings from the recorded debate. Source lines belong to the speaker.
// Context lines can belong to either speaker and explain the surrounding exchange.
// These are interpretations for a replay prototype, not quotes or confirmed positions.
window.DEBATE_MEANINGS = {
  breaks: [
    { at: 398.27, end: 470.1, label: 'Sponsored break in the recording' }
  ],
  entries: [
    {
      id: 'm01', speaker: 0, topic: 'Who should make abortion laws?', contextIds: ['s012', 's014', 's016', 's017', 's018', 's019', 's020'], evidenceRoles: { s017: 'Accepts Charlie’s example', s019: 'Rejects Charlie’s summary', s021: 'Clarifies Sarah’s view' },
      versions: [
        { at: 50.55, kind: 'question', text: 'How can lawmakers write abortion laws if they do not understand the female reproductive system?', sourceIds: ['s010', 's011'] },
        { at: 58.36, text: 'Men can have views on abortion. People who write these laws still need to understand the reproductive system they regulate.', sourceIds: ['s010', 's011', 's013'] },
        { at: 95.9, text: 'I am not saying men must stay silent. I am saying lawmakers need to understand the female reproductive system before they write abortion laws.', correction: { rejected: 'Men must stay silent', clarified: 'Lawmakers need to understand the reproductive system' }, sourceIds: ['s010', 's011', 's013', 's019', 's021'] }
      ]
    },
    {
      id: 'm02', speaker: 1, topic: 'Who should make abortion laws?', contextIds: ['s011', 's013', 's015'], evidenceRoles: { s015: 'Agrees men can have views' },
      versions: [
        { at: 56.12, text: 'Men should be allowed to have views about abortion.', sourceIds: ['s012'] },
        { at: 69.8, text: 'Men can have views about abortion because moral questions are not limited to women.', sourceIds: ['s012', 's014'] }
      ]
    },
    {
      id: 'm03', speaker: 1, topic: 'When does life deserve protection?', contextIds: ['s041', 's061', 's063', 's065'],
      versions: [
        { at: 155.96, text: 'I believe abortion kills a baby, so I see it as morally wrong.', sourceIds: ['s039', 's040'] },
        { at: 225.77, text: 'I believe human life starts at conception. That is why I see abortion as ending a life that deserves protection.', sourceIds: ['s039', 's040', 's062'] },
        { at: 255.73, text: 'I believe a person’s life begins when egg and sperm meet, because that person’s unique DNA begins then. That life deserves protection.', sourceIds: ['s062', 's066', 's067'] }
      ]
    },
    {
      id: 'm04', speaker: 0, topic: 'When does life deserve protection?', contextIds: ['s040', 's042', 's044', 's048'],
      versions: [
        { at: 160.69, text: 'I do not see an embryo as a baby.', sourceIds: ['s041'] },
        { at: 174.22, text: 'I do not see an embryo as a baby. I think it becomes a baby at birth.', sourceIds: ['s041', 's043', 's049'] }
      ]
    },
    {
      id: 'm05', speaker: 0, topic: 'When does life deserve protection?', contextIds: ['s048', 's049', 's050'],
      versions: [
        { at: 177.26, text: 'I do not support abortion at full term.', sourceIds: ['s051'] }
      ]
    },
    {
      id: 'm06', speaker: 1, topic: 'When does life deserve protection?', contextIds: ['s049', 's051'],
      versions: [
        { at: 182.06, kind: 'question', text: 'If it only becomes a baby at birth, what justifies a limit on abortion before birth?', sourceIds: ['s052'] }
      ]
    },
    {
      id: 'm07', speaker: 0, topic: 'Medical emergencies', contextIds: ['s071', 's075', 's079', 's080', 's085'],
      versions: [
        { at: 284.17, kind: 'question', text: 'If a pregnant person may die without an abortion, what should happen?', sourceIds: ['s070'] },
        { at: 332.13, kind: 'question', text: 'If a C-section is not possible, what happens when a pregnant person needs an abortion to survive?', sourceIds: ['s070', 's086'] }
      ]
    },
    {
      id: 'm08', speaker: 1, topic: 'Medical emergencies', contextIds: ['s070', 's076', 's078', 's080', 's086'],
      versions: [
        { at: 296.71, kind: 'question', text: 'At 27 weeks, why not deliver by C-section instead of ending the pregnancy?', sourceIds: ['s075'] },
        { at: 340.09, text: 'At 27 weeks, I believe a C-section can save both lives when a pregnant person faces a life-threatening emergency.', sourceIds: ['s075', 's079', 's091'] }
      ]
    },
    {
      id: 'm09', speaker: 0, topic: 'Children after birth', contextIds: ['s101', 's103', 's105'],
      versions: [
        { at: 486.19, kind: 'question', text: 'What happens to a child who is born into an unsafe home?', sourceIds: ['s102'] },
        { at: 501.64, kind: 'question', text: 'What is the plan for a child who could enter an unsafe home or an orphanage?', sourceIds: ['s102', 's106'] }
      ]
    },
    {
      id: 'm10', speaker: 1, topic: 'Children after birth', contextIds: ['s102', 's106'], evidenceRoles: { s107: 'Rejects Sarah’s summary' },
      versions: [
        { at: 508.36, text: 'We should make adoption easier. A child should not lose protection because others call that child unwanted.', sourceIds: ['s107'] }
      ]
    },
    {
      id: 'm13', speaker: 0, topic: 'When does life deserve protection?', contextIds: ['s115', 's117', 's119', 's121', 's123', 's125', 's127'],
      versions: [
        { at: 570.22, text: 'I accept that an embryo is human, but I do not see it as a child with full rights.', sourceIds: ['s116', 's120', 's122'] },
        { at: 587.29, text: 'An embryo is biologically human, but I do not see it as a child with full rights. I think that changes at birth.', sourceIds: ['s116', 's120', 's122', 's124', 's128'] }
      ]
    },
    {
      id: 'm14', speaker: 1, topic: 'When does life deserve protection?', contextIds: ['s116', 's118', 's120', 's122', 's124', 's128'],
      versions: [
        { at: 607.75, text: 'If human life begins at conception, its starting point should be protected.', sourceIds: ['s062', 's130'] },
        { at: 634.88, text: 'Human life deserves protection from conception. Size or stage of development should not remove that protection.', sourceIds: ['s130', 's131', 's132'] }
      ]
    },
    {
      id: 'm11', speaker: 0, topic: 'The cost of an unplanned pregnancy', contextIds: ['s137', 's139', 's143', 's145', 's147'], evidenceRoles: { s138: 'Rejects Charlie’s reading' },
      versions: [
        { at: 663.88, text: 'If I became pregnant and had to carry the pregnancy, it could upend my life.', sourceIds: ['s136'] },
        { at: 675.77, text: 'I mean an unplanned pregnancy, not rape. Having to carry it could upend my life.', correction: { rejected: 'Rape or incest', clarified: 'An unplanned pregnancy' }, sourceIds: ['s136', 's138'] },
        { at: 699.46, text: 'If I had to carry an unplanned pregnancy, I might have to leave college.', sourceIds: ['s136', 's144', 's146'] },
        { at: 707.7, text: 'If I carry an unplanned pregnancy, I will have to leave college to support a child. I want Charlie to address that cost.', sourceIds: ['s136', 's138', 's144', 's146', 's148'] }
      ]
    },
    {
      id: 'm12', speaker: 1, topic: 'The cost of an unplanned pregnancy', contextIds: ['s136', 's138', 's144', 's146', 's148'],
      versions: [
        { at: 684.26, text: 'People should take responsibility for sex rather than end what I see as a human life.', sourceIds: ['s062', 's143'] },
        { at: 693.63, text: 'I see a child as a blessing, not a problem to remove. Responsibility for sex still matters.', sourceIds: ['s143', 's145'] },
        { at: 712.25, text: 'I believe abortion ends a child’s life, which I see as a blessing rather than a problem to remove. People who have sex should accept that pregnancy can follow, or wait until marriage.', sourceIds: ['s062', 's143', 's145', 's149'] }
      ]
    }
  ]
};
