// Manual likely meanings from the recorded discussion. Source lines belong to the speaker.
// Context lines can belong to any speaker and explain the surrounding exchange.
// These are interpretations for a replay prototype. They are not quotes or confirmed positions.
window.DEBATE_MEANINGS = {
  topicHeadings: {
    'Dissent against a scientific consensus': 'How much weight should an outsider’s claim get?',
    'Privacy and fair competition': 'What makes a sports category fair?',
    'Protected opportunities for women': 'How should society protect women’s opportunities now?'
  },
  breaks: [
    { at: 0, end: 69.9, kind: 'preview', label: 'Opening preview from later in the discussion' },
    { at: 1292.9, end: 1356.8, kind: 'sponsor', label: 'Sponsored break in the recording' }
  ],
  entries: [
    {
      id: 'm01', speaker: 0, topic: 'How science reaches people', contextIds: ['s0035', 's0054'],
      versions: [
        { at: 400.7, text: 'I offer science in many formats because people learn in different ways. I want useful ideas to reach people without forcing attention.', sourceIds: ['s0036', 's0039', 's0040', 's0042'] },
        { at: 539.2, text: 'I use books, documentaries, social media, humor, and pop culture to give different people an accessible path into science. I offer the material; people choose whether to use it.', sourceIds: ['s0039', 's0040', 's0042', 's0044', 's0047', 's0050', 's0053'] }
      ]
    },
    {
      id: 'm02', speaker: 2, topic: 'Public trust after the pandemic', contextIds: ['s0058'],
      versions: [
        { at: 579.1, kind: 'question', text: 'Did failed public claims during the pandemic make people less willing to trust scientists?', sourceIds: ['s0055', 's0056', 's0057'] }
      ]
    },
    {
      id: 'm03', speaker: 0, topic: 'Public trust after the pandemic', contextIds: ['s0055', 's0056', 's0057'],
      versions: [
        { at: 636.8, text: 'Science does not depend on one scientist or one opinion. A strong conclusion comes from the combined results of many observations and experiments.', sourceIds: ['s0058', 's0059', 's0060', 's0061', 's0062'] }
      ]
    },
    {
      id: 'm03b', speaker: 0, topic: 'Public trust after the pandemic', contextIds: ['s0055', 's0056', 's0057'],
      versions: [
        { at: 759.2, text: 'People often trust a passionate outsider more than a large body of evidence. Weak knowledge of probability makes that mistake easier.', sourceIds: ['s0063', 's0064', 's0065', 's0066', 's0068', 's0069', 's0071'] }
      ]
    },
    {
      id: 'm04', speaker: 0, topic: 'How institutions should communicate uncertainty',
      versions: [
        { at: 814.5, text: 'Scientific institutions did not communicate parts of the pandemic well. Scientists often lack training for clear public communication.', sourceIds: ['s0072', 's0073', 's0074', 's0075', 's0076'] }
      ]
    },
    {
      id: 'm04b', speaker: 0, topic: 'How institutions should communicate uncertainty', contextIds: ['s0072', 's0073', 's0074', 's0075', 's0076'],
      versions: [
        { at: 904.3, text: 'Officials should state what the evidence supports, explain its uncertainty, and give regular updates. They should change advice when the evidence changes.', sourceIds: ['s0077', 's0078', 's0079', 's0080', 's0081', 's0082'] }
      ]
    },
    {
      id: 'm05', speaker: 1, topic: 'How institutions should communicate uncertainty', contextIds: ['s0082', 's0084'],
      versions: [
        { at: 906.8, text: 'Neil’s proposed process sounds good to me, but public communication during the pandemic was far from it.', sourceIds: ['s0083'] }
      ]
    },
    {
      id: 'm06', speaker: 0, topic: 'What makes scientific evidence reliable?',
      versions: [
        { at: 997.2, text: 'A single study or dissenting expert is not enough. Independent work must test the result and check for bias or error.', sourceIds: ['s0084', 's0085', 's0086', 's0088', 's0089', 's0090'] }
      ]
    },
    {
      id: 'm06b', speaker: 0, topic: 'What makes scientific evidence reliable?', contextIds: ['s0091', 's0093', 's0101', 's0106'],
      versions: [
        { at: 1172.5, text: 'People can accept a weak study because it supports what they already want to believe. Good tests must measure the actual mechanism, not only reported behavior.', sourceIds: ['s0094', 's0096', 's0097', 's0098', 's0099', 's0102', 's0103', 's0104', 's0107', 's0108', 's0109'] }
      ]
    },
    {
      id: 'm07', speaker: 2, topic: 'Can expertise justify trust?', contextIds: ['s0112', 's0113'],
      versions: [
        { at: 1189.5, kind: 'question', text: 'How should the public judge respected experts who offered a different view during the pandemic?', sourceIds: ['s0111'] }
      ]
    },
    {
      id: 'm08', speaker: 0, topic: 'Can expertise justify trust?', contextIds: ['s0111', 's0112'],
      versions: [
        { at: 1286.5, text: 'A title or reputation cannot establish a scientific claim. Trust the data and the method, not the status or personal account of the speaker.', sourceIds: ['s0113', 's0114', 's0115', 's0116', 's0117', 's0119', 's0120'] }
      ]
    },
    {
      id: 'm09', speaker: 1, topic: 'Dissent against a scientific consensus', contextIds: ['s0124', 's0125'],
      versions: [
        { at: 1367.6, kind: 'question', text: 'Science history includes rejected outsiders who later proved correct. How should we allow for that possibility?', sourceIds: ['s0122', 's0123'] }
      ]
    },
    {
      id: 'm10', speaker: 0, topic: 'Dissent against a scientific consensus', contextIds: ['s0122', 's0123', 's0125'],
      versions: [
        { at: 1410.5, text: 'A rare outsider can prove correct, but thousands of other outsiders are simply wrong. The memorable exception must not set the general rule.', sourceIds: ['s0124', 's0126', 's0127'] },
        { at: 1586.0, text: 'A rare outsider can be right, but many are wrong. Judge the claim against the wider research, not only its opposition to the establishment.', sourceIds: ['s0124', 's0126', 's0127', 's0135', 's0136', 's0137', 's0138', 's0139', 's0140', 's0141'] }
      ]
    },
    {
      id: 'm11', speaker: 2, topic: 'How society should treat wrong claims', contextIds: ['s0131'],
      versions: [
        { at: 1449.6, text: 'Removing wrong speakers can make them look more important and dangerous than they are. Public censorship can strengthen the appeal of their claims.', sourceIds: ['s0128', 's0129', 's0130'] }
      ]
    },
    {
      id: 'm12', speaker: 0, topic: 'How society should treat wrong claims', contextIds: ['s0128', 's0129', 's0130'],
      versions: [
        { at: 1499.4, text: 'Free speech includes real risks. Education should help people examine persuasive claims before those claims cause lasting harm.', sourceIds: ['s0131', 's0132', 's0133', 's0134'] },
        { at: 1527.8, text: 'Free speech has risks, but I prefer it with better education. People should test a persuasive claim against the evidence behind the wider view.', sourceIds: ['s0131', 's0134', 's0135', 's0136'] }
      ]
    },
    {
      id: 'm13', speaker: 2, topic: 'Why explore space?',
      versions: [
        { at: 1609.2, kind: 'question', text: 'Do current missions and private spaceflight make this an unusually exciting time for astrophysics?', sourceIds: ['s0142', 's0143'] }
      ]
    },
    {
      id: 'm14', speaker: 0, topic: 'Why explore space?', contextIds: ['s0142', 's0143'],
      versions: [
        { at: 1705.5, text: 'I hope space travel becomes affordable to many people. Other technologies became common when their cost fell.', sourceIds: ['s0144', 's0145', 's0146', 's0148', 's0151', 's0152', 's0153', 's0154'] }
      ]
    },
    {
      id: 'm14c', speaker: 0, topic: 'Why explore space?', contextIds: ['s0142', 's0143'],
      versions: [
        { at: 1835.0, text: 'Science and technology have advanced quickly for many generations. People in many past decades could call their era exciting. I do not think our era is uniquely special.', sourceIds: ['s0155', 's0156', 's0157', 's0160', 's0161', 's0163', 's0164', 's0165', 's0166', 's0167'] }
      ]
    },
    {
      id: 'm13b', speaker: 2, topic: 'Why explore space?',
      versions: [
        { at: 1835.1, kind: 'question', text: 'Why is exploring and discovering space important to humanity?', sourceIds: ['s0168'] }
      ]
    },
    {
      id: 'm14b', speaker: 0, topic: 'Why explore space?', contextIds: ['s0168'],
      versions: [
        { at: 1959.4, text: 'Space research can protect Earth and answer basic human questions. Exploration also forces inventions that can create benefits beyond the original mission.', sourceIds: ['s0169', 's0171', 's0172', 's0173', 's0174', 's0175', 's0178', 's0179'] }
      ]
    },
    {
      id: 'm15', speaker: 1, topic: 'The limits of space travel', contextIds: ['s0186', 's0187'],
      versions: [
        { at: 1994.2, kind: 'question', text: 'Can humans reach Mars or travel farther when known physics places severe limits on spaceflight?', sourceIds: ['s0183', 's0184', 's0185'] },
        { at: 2066.6, kind: 'question', text: 'Is science making progress toward a method, such as a wormhole, that could overcome the limits of interstellar travel?', sourceIds: ['s0183', 's0184', 's0185', 's0194'] }
      ]
    },
    {
      id: 'm16', speaker: 0, topic: 'The limits of space travel', contextIds: ['s0183', 's0184', 's0185'],
      versions: [
        { at: 2050.2, text: 'Chemical rockets can reach our planets, but nearby stars remain too far away for human travel within a normal life.', sourceIds: ['s0186', 's0188', 's0189', 's0190', 's0191', 's0193'] }
      ]
    },
    {
      id: 'm16b', speaker: 0, topic: 'The limits of space travel', contextIds: ['s0192', 's0194'],
      versions: [
        { at: 2102.9, text: 'Interstellar travel needs physics that we do not yet control. Wormholes remain science fiction because we cannot create or hold them open.', sourceIds: ['s0195', 's0197', 's0198'] }
      ]
    },
    {
      id: 'm17', speaker: 0, topic: 'What a cosmic view changes', contextIds: ['s0199', 's0200'],
      versions: [
        { at: 2294.3, text: 'I think the view of Earth from the moon helped people see the planet as one system. That view may have helped build support for environmental action.', sourceIds: ['s0201', 's0203', 's0204', 's0205', 's0206', 's0207', 's0208', 's0209', 's0210', 's0211', 's0212'] }
      ]
    },
    {
      id: 'm17b', speaker: 0, topic: 'What a cosmic view changes', contextIds: ['s0213'],
      versions: [
        { at: 2361.7, text: 'People ask why we cannot solve poverty if we reached the moon. I think social problems may be harder than physics problems.', sourceIds: ['s0214', 's0215', 's0216', 's0217'] }
      ]
    },
    {
      id: 'm18', speaker: 2, topic: 'What a cosmic view changes', contextIds: ['s0214'],
      versions: [
        { at: 2301.4, text: 'The moon landings gave many people a broad sense that difficult human achievements were possible.', sourceIds: ['s0213'] }
      ]
    },
    {
      id: 'm19', speaker: 0, topic: 'Facts and persuasion', contextIds: ['s0218', 's0219', 's0225'],
      versions: [
        { at: 2452.5, text: 'An educator needs more than correct facts. The educator must understand the audience and communicate with enough care to persuade rather than repel.', sourceIds: ['s0220', 's0221', 's0222', 's0223', 's0224'] }
      ]
    },
    {
      id: 'm20', speaker: 0, topic: 'Sex, gender, and personal expression', contextIds: ['s0236', 's0237', 's0239', 's0242'], evidenceRoles: { s0238: 'Rejects the first description', s0240: 'Clarifies his role' },
      versions: [
        { at: 2565.4, text: 'I do not present my opinions as rules for other people. I try to give people enough information to form their own view.', correction: { rejected: 'I promote a fixed view', clarified: 'I add information before people form a view' }, sourceIds: ['s0238', 's0240', 's0241', 's0243'] }
      ]
    },
    {
      id: 'm20b', speaker: 0, topic: 'Sex, gender, and personal expression', contextIds: ['s0244', 's0246', 's0254'], evidenceRoles: { s0255: 'Accepts the words but says context is missing' },
      versions: [
        { at: 2657.2, text: 'Biological sex and outward gender expression are not the same question. People already change how masculine or feminine they look, and that expression can vary.', sourceIds: ['s0247', 's0248', 's0250', 's0251', 's0253', 's0255'] },
        { at: 3383.8, text: 'Biological sex is usually binary. People use clothes, hair, makeup, and body shape to express gender. They should be free to combine these signals.', sourceIds: ['s0297', 's0298', 's0299', 's0301', 's0302', 's0304', 's0305', 's0308', 's0309', 's0312', 's0313', 's0316', 's0317', 's0320', 's0321', 's0322', 's0323', 's0324', 's0325', 's0327', 's0328', 's0329', 's0330', 's0332', 's0334', 's0336', 's0338'] }
      ]
    },
    {
      id: 'm21', speaker: 1, topic: 'Sex, gender, and personal expression', contextIds: ['s0247', 's0250', 's0253', 's0255'],
      versions: [
        { at: 2702.7, kind: 'question', text: 'Most people learned that male and female categories match biological sex. What is the full case for a different view?', sourceIds: ['s0244', 's0246', 's0249', 's0252', 's0254', 's0264', 's0266', 's0267'] }
      ]
    },
    {
      id: 'm22', speaker: 1, topic: 'Personal expression and the public dispute', contextIds: ['s0338', 's0343', 's0345'], evidenceRoles: { s0342: 'Rejects a restriction that Neil described' },
      versions: [
        { at: 3434.9, text: 'I do not know anyone who wants to stop people from choosing their clothes, behavior, or name. I accept that such people exist, but I think they are few.', sourceIds: ['s0341', 's0342', 's0344'] }
      ]
    },
    {
      id: 'm22b', speaker: 1, topic: 'Where sex-based categories matter', contextIds: ['s0338', 's0342'], evidenceRoles: { s0346: 'States the actual dispute' },
      versions: [
        { at: 3521.5, text: 'The public dispute concerns sex-based access to private spaces and sport. People argue that women need protection from unfair competition and risks in female-only spaces.', sourceIds: ['s0346', 's0347', 's0348', 's0349', 's0350', 's0351', 's0353', 's0354'] }
      ]
    },
    {
      id: 'm22c', speaker: 1, topic: 'Where sex-based categories matter', contextIds: ['s0355', 's0363'],
      versions: [
        { at: 3583.9, text: 'The concern also includes female political shortlists and workplace targets. These categories aim to protect opportunities for women.', sourceIds: ['s0364', 's0366', 's0367', 's0368'] }
      ]
    },
    {
      id: 'm23', speaker: 0, topic: 'Privacy in shared spaces', contextIds: ['s0347', 's0353'],
      versions: [
        { at: 3630.5, text: 'Privacy does not require one shared space for each sex. Private stalls and individual rooms can protect everyone.', sourceIds: ['s0369', 's0370', 's0372', 's0373', 's0375'] }
      ]
    },
    {
      id: 'm23b', speaker: 0, topic: 'Privacy and fair competition', contextIds: ['s0348', 's0353', 's0388', 's0389'],
      versions: [
        { at: 3950.7, text: 'Sport needs fair matches. Male and female labels might not be enough. Categories could use weight, puberty history, physiology, and hormone levels.', sourceIds: ['s0385', 's0386', 's0387', 's0390', 's0391', 's0392', 's0394', 's0395', 's0396', 's0397', 's0398', 's0399', 's0400', 's0401', 's0402'] }
      ]
    },
    {
      id: 'm24', speaker: 1, topic: 'Privacy and fair competition', contextIds: ['s0385', 's0386', 's0387', 's0390'],
      versions: [
        { at: 3787.9, text: 'Sex differences in sport include hip angle, heart and lung capacity, and bone density. Hormone levels alone cannot define fair competition.', sourceIds: ['s0388', 's0389'] }
      ]
    },
    {
      id: 'm25q', speaker: 1, topic: 'Protected opportunities for women', contextIds: ['s0404', 's0405'],
      versions: [
        { at: 4013.5, kind: 'question', text: 'Under the current rule, should a biological male qualify for a female-only political shortlist?', sourceIds: ['s0403', 's0406', 's0408', 's0410', 's0412'] }
      ]
    },
    {
      id: 'm25', speaker: 1, topic: 'Protected opportunities for women', contextIds: ['s0403', 's0412', 's0413', 's0414'],
      versions: [
        { at: 4040.1, text: 'Women lose opportunities now when they compete with people whom I believe have an advantage, in sport and elsewhere. A future solution does not remove that cost.', sourceIds: ['s0416'] }
      ]
    },
    {
      id: 'm26', speaker: 0, topic: 'Protected opportunities for women', contextIds: ['s0403', 's0408', 's0410', 's0412'],
      versions: [
        { at: 4026.2, text: 'Female shortlists treat a symptom. Society should fix the causes of women’s low representation so quotas become unnecessary.', sourceIds: ['s0404', 's0405', 's0413', 's0414'] }
      ]
    },
    {
      id: 'm26b', speaker: 0, topic: 'Protected opportunities for women', contextIds: ['s0413', 's0414', 's0416'],
      versions: [
        { at: 4113.7, text: 'The present transition has hard problems, but society should build fair new systems. It should not return to old limits because change is difficult.', sourceIds: ['s0417', 's0418', 's0419', 's0423'] }
      ]
    },
    {
      id: 'm27', speaker: 2, topic: 'Protected opportunities for women', contextIds: ['s0425', 's0426'],
      versions: [
        { at: 4126.2, text: 'Many people resist this view because they see women lose real opportunities now. They see an unfair field in sport and public life.', sourceIds: ['s0424'] }
      ]
    },
    {
      id: 'm28', speaker: 0, topic: 'How social change should proceed', contextIds: ['s0424', 's0427', 's0429'],
      versions: [
        { at: 4150.1, text: 'Fix unfair rules before making trans women the main cause of the problem.', sourceIds: ['s0425', 's0426'] },
        { at: 4248.0, text: 'I do not have a good solution yet. Changing the rules is hard, but I still think we should try to make the field fair.', sourceIds: ['s0425', 's0426', 's0428', 's0441'] },
        { at: 4478.8, text: 'I do not have a complete solution. Social change takes time. Sports can develop fairer categories with biologists, gender specialists, and hormone specialists.', sourceIds: ['s0425', 's0426', 's0428', 's0430', 's0437', 's0439', 's0440', 's0441', 's0442', 's0443', 's0445', 's0446', 's0447', 's0450', 's0451', 's0452', 's0453', 's0454', 's0455', 's0456', 's0457', 's0458', 's0460', 's0462', 's0463', 's0464'] }
      ]
    },
    {
      id: 'm29', speaker: 2, topic: 'Responsibility for the future', contextIds: ['s0474', 's0475'],
      versions: [
        { at: 4524.7, kind: 'question', text: 'What important social problem receives too little attention?', sourceIds: ['s0471', 's0473'] }
      ]
    },
    {
      id: 'm30', speaker: 0, topic: 'Responsibility for the future', contextIds: ['s0473', 's0475'],
      versions: [
        { at: 4599.7, text: 'Humanity must become wise enough to protect its own future. We should make decisions that people many generations from now can respect.', sourceIds: ['s0474', 's0476', 's0477', 's0478', 's0479', 's0480'] }
      ]
    }
  ]
};
