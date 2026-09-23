const record = window.DEBATE_DATA;
const meanings = window.DEBATE_MEANINGS;
const debateConfig = window.DEBATE_CONFIG;
const meaningList = document.getElementById('meaning-list');
const meaningScroll = document.getElementById('meaning-scroll');
const meaningSection = document.querySelector('.meaning-section');
const followButton = document.getElementById('follow-button');
const replayButton = document.getElementById('replay-button');
const messageList = document.getElementById('messages');
const chat = document.getElementById('transcript-content');
const transcriptPanel = document.getElementById('transcript-panel');
const transcriptGrip = document.getElementById('transcript-grip');
const transcriptPreview = document.getElementById('transcript-preview');
const clearTranscriptFilter = document.getElementById('clear-transcript-filter');
const positionLabel = document.getElementById('position-label');
const speakerName = (speaker) => record?.speakerNames?.[speaker] ?? `Speaker ${speaker}`;
let insertSegmentsById = new Map();

const clock = (seconds) => {
  const whole = Math.floor(seconds);
  return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`;
};

const openDialog = (id) => document.getElementById(id)?.showModal();
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-dialog]');
  if (!button) return;
  if (button.dataset.insertId) {
    const insert = insertSegmentsById.get(button.dataset.insertId);
    if (insert) {
      document.getElementById('insert-title').textContent = insert.label || 'Recorded insert';
      document.getElementById('insert-description').textContent = insert.kind === 'sponsor'
        ? 'The recording contains an advertisement here. The page keeps it apart from the discussion.'
        : 'The recording contains a preview from a later part of the discussion.';
      document.getElementById('insert-transcript').textContent = insert.text;
    }
  }
  openDialog(button.dataset.dialog);
});
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

if (!record?.segments?.length || !meanings?.entries?.length) {
  meaningList.querySelector('.load-note').textContent = 'The debate data is not available. Open this page from the concepts directory.';
} else {
  const speakerIds = Object.keys(record.speakerNames).map(Number).sort((a, b) => a - b);
  document.body.dataset.speakerCount = String(speakerIds.length);
  document.documentElement.style.setProperty('--speaker-columns', String(speakerIds.length));
  const debatePicker = document.getElementById('debate-picker');
  debatePicker.value = debateConfig?.id || 'science';
  debatePicker.addEventListener('change', () => {
    const url = new URL(location.href);
    url.searchParams.set('debate', debatePicker.value);
    location.href = url;
  });
  document.title = `${debateConfig?.label || 'Recorded debate'} — The Record`;
  document.getElementById('speaker-title').textContent = speakerIds.map(speakerName).join(', ');
  document.getElementById('speaker-method').textContent = record.method;
  document.getElementById('speaker-count-label').textContent = `${speakerIds.length} displayed speakers`;
  document.getElementById('speaker-list').textContent = speakerIds.map((id) => `ID ${id}: ${speakerName(id)}`).join(' · ');
  const segmentsById = new Map(record.segments.map((segment) => [segment.id, segment]));
  insertSegmentsById = new Map(record.segments.filter((segment) => segment.kind !== 'speech').map((segment) => [segment.id, segment]));
  const entriesById = new Map(meanings.entries.map((entry) => [entry.id, entry]));
  const topicHeadings = meanings.topicHeadings || {};
  const versionReadyAt = (version) => Math.max(
    version.at,
    ...version.sourceIds.map((id) => segmentsById.get(id)?.end ?? version.at)
  ) + 3;
  const committedVersions = new Map(meanings.entries.map((entry) => [entry.id,
    entry.versions.filter((version, index) => {
      const next = entry.versions[index + 1];
      return !next || next.at >= versionReadyAt(version) + 1.5;
    })
  ]));
  let currentTime = Infinity;
  let following = true;
  let lastUserScroll = -Infinity;
  let replayTimer = null;
  let selectedMeaning = null;

  messageList.replaceChildren();
  let previousSpeech;
  for (const segment of record.segments) {
    const item = document.createElement('li');
    if (segment.kind !== 'speech') {
      item.className = 'insert-marker';
      const time = document.createElement('span');
      time.className = 'insert-time';
      time.textContent = `${clock(segment.start)}–${clock(segment.end)}`;
      const title = document.createElement('strong');
      title.textContent = segment.label || (segment.kind === 'sponsor' ? 'Sponsored break' : 'Recorded insert');
      const note = document.createElement('p');
      note.textContent = segment.kind === 'sponsor' ? 'The recording breaks for an advertisement.' : 'The recording shows a preview here.';
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.dialog = 'insert-dialog';
      button.dataset.insertId = segment.id;
      button.textContent = 'Read transcript';
      item.append(time, title, note, button);
      previousSpeech = undefined;
    } else {
      item.className = `message message-speaker-${segment.speaker} ${segment.speaker === 0 ? 'message-left' : 'message-right'}`;
      item.id = segment.id;
      if (previousSpeech?.speaker === segment.speaker && segment.start - previousSpeech.end < 1.2) {
        item.classList.add('message-continuation');
      }
      const meta = document.createElement('div');
      meta.className = 'message-meta';
      const speaker = document.createElement('strong');
      speaker.textContent = speakerName(segment.speaker);
      const time = document.createElement('time');
      time.textContent = clock(segment.start);
      meta.append(speaker, time);
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.textContent = segment.text;
      item.append(meta, bubble);
      if (segment.wordConfidence < 0.8 || segment.identityUncertain) {
        const warning = document.createElement('p');
        warning.className = 'transcript-warning';
        warning.textContent = segment.identityUncertain && segment.wordConfidence < 0.8
          ? 'The words or speaker may be wrong'
          : (segment.identityUncertain ? 'The speaker may be wrong' : 'Some words may be wrong');
        item.append(warning);
      }
      previousSpeech = segment;
    }
    messageList.append(item);
  }
  const allTranscriptItems = [...messageList.children];
  const transcriptItemById = new Map(record.segments.map((segment, index) => [segment.id, allTranscriptItems[index]]));
  const transcriptIndexById = new Map(record.segments.map((segment, index) => [segment.id, index]));

  const visibleVersion = (entry, at) => committedVersions.get(entry.id).filter((version) => versionReadyAt(version) <= at).at(-1);
  const jumpLatest = () => {
    if (!following) return;
    meaningScroll.scrollTop = meaningScroll.scrollHeight;
  };
  const updateFollowButton = () => {
    const remaining = meaningScroll.scrollHeight - meaningScroll.scrollTop - meaningScroll.clientHeight;
    const atEnd = remaining < 55;
    if (atEnd) following = true;
    else if (performance.now() - lastUserScroll < 1200) following = false;
    followButton.hidden = following;
    meaningSection.classList.toggle('has-more-below', remaining > 35);
    meaningSection.classList.toggle('has-more-above', meaningScroll.scrollTop > 35);
  };

  const makeTopic = (label, id, earlierId, gridRow) => {
    const item = document.createElement('li');
    item.className = 'meaning-topic';
    item.id = id;
    item.style.gridRow = String(gridRow);
    const title = document.createElement('span');
    title.textContent = topicHeadings[label] || label;
    item.append(title);
    if (earlierId) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.topicTarget = earlierId;
      button.setAttribute('aria-label', `See the earlier discussion of ${label}`);
      button.textContent = 'See earlier discussion';
      item.append(button);
    }
    return item;
  };
  const makeBreak = (item, gridRow) => {
    const row = document.createElement('li');
    row.className = 'meaning-break';
    row.style.gridRow = String(gridRow);
    const label = document.createElement('span');
    label.textContent = item.label;
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.dialog = 'insert-dialog';
    const insert = record.segments.find((segment) => segment.kind === item.insertKind && Math.abs(segment.start - item.at) <= 1.1);
    if (insert) button.dataset.insertId = insert.id;
    button.textContent = 'Read insert';
    row.append(label, button);
    return row;
  };
  const appendChangedWords = (element, before, after) => {
    const oldWords = before.match(/\S+/g) || [];
    const newWords = after.match(/\S+/g) || [];
    const plain = (word) => word.toLocaleLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
    const rows = Array.from({ length: oldWords.length + 1 }, () => new Uint16Array(newWords.length + 1));
    for (let i = oldWords.length - 1; i >= 0; i--) {
      for (let j = newWords.length - 1; j >= 0; j--) {
        rows[i][j] = plain(oldWords[i]) === plain(newWords[j])
          ? rows[i + 1][j + 1] + 1 : Math.max(rows[i + 1][j], rows[i][j + 1]);
      }
    }
    const unchanged = new Set();
    let i = 0;
    let j = 0;
    while (i < oldWords.length && j < newWords.length) {
      if (plain(oldWords[i]) === plain(newWords[j])) {
        unchanged.add(j);
        i++;
        j++;
      } else if (rows[i + 1][j] >= rows[i][j + 1]) i++;
      else j++;
    }
    let changed = null;
    let run = '';
    const flush = () => {
      if (!run) return;
      if (changed) {
        const trailing = run.match(/\s+$/)?.[0] || '';
        const mark = document.createElement('mark');
        mark.className = 'meaning-change';
        mark.textContent = trailing ? run.slice(0, -trailing.length) : run;
        element.append(mark);
        if (trailing) element.append(document.createTextNode(trailing));
      } else element.append(document.createTextNode(run));
      run = '';
    };
    newWords.forEach((word, index) => {
      const nextChanged = !unchanged.has(index);
      if (changed !== null && nextChanged !== changed) flush();
      changed = nextChanged;
      run += word + (index < newWords.length - 1 ? ' ' : '');
    });
    flush();
  };
  const makeMeaning = ({ entry, version, versionIndex }, activeIds, changedId, presentation = {}) => {
    const item = document.createElement('li');
    const isCurrent = activeIds.has(entry.id);
    item.className = `meaning-entry meaning-speaker-${entry.speaker}${isCurrent ? ' is-current' : ''}${changedId === entry.id ? ' just-updated' : ''}`;
    if (presentation.gridRow) item.style.gridRow = String(presentation.gridRow);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'meaning-card';
    card.dataset.meaningId = entry.id;
    card.dataset.versionIndex = versionIndex;
    card.setAttribute('aria-pressed', String(selectedMeaning?.id === entry.id && selectedMeaning.versionIndex === versionIndex));
    card.setAttribute('aria-label', `${speakerName(entry.speaker)}. Topic: ${entry.topic}. ${version.kind === 'question' ? 'Question raised' : 'Likely meaning, not confirmed'}: ${version.text} Show speech behind this meaning.`);
    const changeLabel = isCurrent && changedId === entry.id ? (versionIndex > 0 ? 'Changed' : 'New') : null;
    const text = document.createElement('span');
    text.className = 'meaning-text';
    if (isCurrent) {
      const name = document.createElement('span');
      name.className = 'meaning-speaker-name';
      name.textContent = speakerName(entry.speaker);
      name.setAttribute('aria-hidden', 'true');
      card.append(name);
    }
    if (isCurrent && changedId === entry.id && !version.correction && presentation.priorText && presentation.priorText !== version.text) {
      appendChangedWords(text, presentation.priorText, version.text);
    } else text.textContent = version.text;
    card.append(text);
    if (isCurrent && changedId === entry.id && version.correction) {
      const correction = document.createElement('span');
      correction.className = 'meaning-correction';
      const rejected = document.createElement('span');
      rejected.className = 'correction-rejected';
      rejected.textContent = `Not: ${version.correction.rejected}`;
      const clarified = document.createElement('span');
      clarified.className = 'correction-clarified';
      clarified.textContent = `Instead: ${version.correction.clarified}`;
      correction.append(rejected, clarified);
      card.append(correction);
    }
    const footer = document.createElement('span');
    footer.className = 'meaning-card-footer';
    const action = document.createElement('span');
    action.className = 'meaning-action';
    action.textContent = 'Show speech';
    footer.append(action);
    if (version.kind === 'question') {
      const kind = document.createElement('span');
      kind.className = 'meaning-kind';
      kind.textContent = 'Question';
      footer.append(kind);
    }
    if (changeLabel) {
      const revised = document.createElement('span');
      revised.className = `meaning-revised${isCurrent ? ' is-live' : ''}`;
      revised.textContent = changeLabel;
      footer.append(revised);
    }
    card.append(footer);
    item.append(card);
    return item;
  };

  const renderThrough = (at, changedId = null) => {
    const oldTop = meaningScroll.scrollTop;
    const priorTextById = new Map([...meaningList.querySelectorAll('.meaning-entry.is-current .meaning-card')].map((card) => [
      card.dataset.meaningId, card.querySelector('.meaning-text')?.textContent || ''
    ]));
    currentTime = at;
    const visible = meanings.entries.flatMap((entry) => {
      const version = visibleVersion(entry, at);
      if (!version) return [];
      return [{ entry, version, versionIndex: entry.versions.indexOf(version), at: versionReadyAt(version) }];
    });
    const chronological = [...visible].sort((a, b) => a.at - b.at);
    const latestTopic = chronological.at(-1)?.entry.topic;
    let episodeStart = chronological.length - 1;
    while (episodeStart > 0 && chronological[episodeStart - 1].entry.topic === latestTopic) episodeStart--;
    const latestBySpeaker = new Map();
    for (const item of chronological.slice(Math.max(0, episodeStart))) {
      const prior = latestBySpeaker.get(item.entry.speaker);
      if (!prior || item.at > prior.at) latestBySpeaker.set(item.entry.speaker, item);
    }
    const activeIds = new Set([...latestBySpeaker.values()].map((item) => item.entry.id));
    const presentationFor = (item) => ({ priorText: priorTextById.get(item.entry.id) });
    const events = [
      ...visible.map((item) => ({ kind: 'meaning', ...item })),
      ...meanings.breaks.filter((item) => item.at <= at).map((item) => ({ ...item, insertKind: item.kind, kind: 'break' }))
    ].sort((a, b) => a.at - b.at);
    const fragment = document.createDocumentFragment();
    const rowEntries = new Map();
    let lastTopic = null;
    let topicNumber = 0;
    let nextGridRow = 1;
    let topicRowStart = 1;
    let topicDepth = 0;
    let speakerDepth = new Map();
    const earlierTopics = new Map();
    const closeTopic = () => {
      if (lastTopic !== null) nextGridRow = topicRowStart + Math.max(1, topicDepth);
    };
    for (const event of events) {
      if (event.kind === 'break') {
        closeTopic();
        fragment.append(makeBreak(event, nextGridRow++));
        lastTopic = null;
      } else {
        if (event.entry.topic !== lastTopic) {
          closeTopic();
          const headingId = `meaning-topic-${++topicNumber}`;
          fragment.append(makeTopic(event.entry.topic, headingId, earlierTopics.get(event.entry.topic), nextGridRow++));
          earlierTopics.set(event.entry.topic, headingId);
          topicRowStart = nextGridRow;
          topicDepth = 0;
          speakerDepth = new Map();
        }
        const depth = speakerDepth.get(event.entry.speaker) || 0;
        speakerDepth.set(event.entry.speaker, depth + 1);
        topicDepth = Math.max(topicDepth, depth + 1);
        const gridRow = topicRowStart + depth;
        const item = makeMeaning(event, activeIds, changedId, { ...presentationFor(event), gridRow });
        if (!rowEntries.has(gridRow)) rowEntries.set(gridRow, []);
        rowEntries.get(gridRow).push({ item, speaker: event.entry.speaker });
        fragment.append(item);
        lastTopic = event.entry.topic;
      }
    }
    closeTopic();
    if (speakerIds.length === 3) {
      for (const items of rowEntries.values()) {
        const layout = items.map((item) => item.speaker).sort((a, b) => a - b).join('');
        for (const { item } of items) item.dataset.rowLayout = layout;
        if (items.length > 1) items.forEach(({ item }, index) => {
          item.dataset.rowSequence = String(index);
        });
      }
    }
    meaningList.replaceChildren(fragment);
    if (changedId) {
      const updatedItems = [...document.querySelectorAll('.meaning-entry.just-updated')]
        .filter((item) => item.querySelector('.meaning-card')?.dataset.meaningId === changedId);
      window.setTimeout(() => updatedItems.forEach((item) => {
        if (!item.isConnected) return;
        item.classList.remove('just-updated');
        item.querySelector('.meaning-revised.is-live')?.remove();
        item.querySelector('.meaning-correction')?.remove();
        item.querySelectorAll('mark.meaning-change').forEach((mark) => mark.replaceWith(document.createTextNode(mark.textContent)));
        item.querySelector('.meaning-text')?.normalize();
      }), 3200);
    }
    if (following) {
      jumpLatest();
      requestAnimationFrame(() => { jumpLatest(); updateFollowButton(); });
    } else {
      meaningScroll.scrollTop = oldTop;
      requestAnimationFrame(updateFollowButton);
    }
  };

  const evidenceIds = (entry, version) => {
    const speechEnd = versionReadyAt(version) - 3;
    return [...new Set([...version.sourceIds, ...(entry.contextIds || [])])]
      .filter((id) => segmentsById.get(id)?.kind === 'speech' && segmentsById.get(id).end <= speechEnd + .01)
      .sort((a, b) => transcriptIndexById.get(a) - transcriptIndexById.get(b));
  };
  const makeOmission = () => {
    const item = document.createElement('li');
    item.className = 'transcript-omission';
    item.textContent = 'Other transcript lines omitted';
    return item;
  };
  const clearEvidenceCues = () => {
    for (const item of allTranscriptItems) {
      item.classList.remove('message-decisive');
      item.querySelector('.evidence-cue')?.remove();
    }
  };
  const showAllSpeech = () => {
    selectedMeaning = null;
    clearEvidenceCues();
    transcriptPanel.classList.remove('has-filter');
    messageList.classList.remove('is-filtered');
    messageList.replaceChildren(...allTranscriptItems);
    clearTranscriptFilter.hidden = true;
    transcriptPreview.textContent = transcriptHeight > 110 ? 'Automatic transcript · Scroll to review' : previewText;
    chat.setAttribute('aria-label', 'Debate transcript. Scroll up for earlier speech.');
    document.querySelectorAll('.meaning-card[aria-pressed="true"]').forEach((card) => card.setAttribute('aria-pressed', 'false'));
    transcriptInteracted = false;
    if (transcriptHeight > 110) requestAnimationFrame(focusExcerpt);
  };
  const keepMeaningVisible = (card) => {
    if (!card?.isConnected) return;
    const viewport = meaningScroll.getBoundingClientRect();
    const bounds = card.getBoundingClientRect();
    const top = viewport.top + Math.min(72, Math.max(20, viewport.height * .12));
    const bottom = viewport.bottom - Math.min(120, Math.max(24, viewport.height * .21));
    if (bounds.height > bottom - top || bounds.top < top) {
      meaningScroll.scrollTop += bounds.top - top;
    } else if (bounds.bottom > bottom) {
      meaningScroll.scrollTop += bounds.bottom - bottom;
    }
    updateFollowButton();
  };
  const showMeaningSpeech = (entry, versionIndex) => {
    const version = entry.versions[versionIndex];
    if (!version || versionReadyAt(version) > currentTime) return;
    const ids = evidenceIds(entry, version);
    if (!ids.length) return;
    clearEvidenceCues();
    selectedMeaning = { id: entry.id, versionIndex };
    transcriptPanel.classList.add('has-filter');
    const rows = [];
    let previousIndex = null;
    for (const id of ids) {
      const index = transcriptIndexById.get(id);
      if (previousIndex !== null && index > previousIndex + 1) rows.push(makeOmission());
      const row = transcriptItemById.get(id);
      const role = entry.evidenceRoles?.[id];
      if (role) {
        row.classList.add('message-decisive');
        const cue = document.createElement('span');
        cue.className = 'evidence-cue';
        cue.textContent = role;
        row.querySelector('.message-meta').append(cue);
      }
      rows.push(row);
      previousIndex = index;
    }
    messageList.classList.add('is-filtered');
    messageList.replaceChildren(...rows);
    transcriptPreview.textContent = `Speech behind ${speakerName(entry.speaker)}’s meaning · ${ids.length} lines`;
    chat.setAttribute('aria-label', `Speech behind ${speakerName(entry.speaker)}’s meaning. The transcript can include speech from all speakers.`);
    clearTranscriptFilter.hidden = false;
    document.querySelectorAll('.meaning-card').forEach((card) => {
      card.setAttribute('aria-pressed', String(card.dataset.meaningId === entry.id && Number(card.dataset.versionIndex) === versionIndex));
    });
    const selectedCard = [...meaningList.querySelectorAll('.meaning-card')]
      .find((card) => card.dataset.meaningId === entry.id && Number(card.dataset.versionIndex) === versionIndex);
    transcriptInteracted = true;
    setTranscriptHeight(Math.max(220, body.clientHeight * .36));
    requestAnimationFrame(() => {
      keepMeaningVisible(selectedCard);
      chat.scrollTop = 0;
    });
  };

  const onMeaningClick = (event) => {
    const button = event.target.closest('[data-meaning-id]');
    if (!button) return;
    const entry = entriesById.get(button.dataset.meaningId);
    if (entry) showMeaningSpeech(entry, Number(button.dataset.versionIndex));
  };
  meaningList.addEventListener('click', onMeaningClick);
  meaningList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-topic-target]');
    if (!button) return;
    const earlier = document.getElementById(button.dataset.topicTarget);
    if (!earlier) return;
    following = false;
    lastUserScroll = performance.now();
    const offset = earlier.getBoundingClientRect().top - meaningScroll.getBoundingClientRect().top;
    meaningScroll.scrollTo({
      top: meaningScroll.scrollTop + offset - 18,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
    earlier.tabIndex = -1;
    earlier.focus({ preventScroll: true });
    earlier.classList.add('is-targeted');
    window.setTimeout(() => earlier.classList.remove('is-targeted'), 2200);
  });
  clearTranscriptFilter.addEventListener('click', showAllSpeech);
  for (const eventName of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
    meaningScroll.addEventListener(eventName, () => { lastUserScroll = performance.now(); }, { passive: true });
  }
  meaningScroll.addEventListener('scroll', updateFollowButton, { passive: true });
  followButton.addEventListener('click', () => {
    following = true;
    lastUserScroll = -Infinity;
    followButton.hidden = true;
    jumpLatest();
  });

  const allReplayEvents = meanings.entries.flatMap((entry) =>
    committedVersions.get(entry.id).map((version) => ({ at: versionReadyAt(version), id: entry.id, topic: entry.topic }))
  ).sort((a, b) => a.at - b.at);
  const lastReplayTopic = allReplayEvents.at(-1)?.topic;
  const replayEvents = allReplayEvents.filter((event) => event.topic === lastReplayTopic);
  const replayStart = replayEvents[0]?.at ?? 0;
  const stopReplay = (showEnd) => {
    if (replayTimer) window.clearInterval(replayTimer);
    replayTimer = null;
    replayButton.textContent = 'Replay last exchange';
    if (showEnd) renderThrough(Infinity);
    positionLabel.textContent = 'Recorded debate';
  };
  replayButton.addEventListener('click', () => {
    if (replayTimer) {
      stopReplay(true);
      return;
    }
    following = true;
    lastUserScroll = -Infinity;
    renderThrough(Math.max(0, replayStart - .1));
    replayButton.textContent = 'Stop replay';
    positionLabel.textContent = `Replay begins at ${clock(replayStart)}`;
    let index = 0;
    replayTimer = window.setInterval(() => {
      const event = replayEvents[index++];
      if (!event) {
        stopReplay(false);
        return;
      }
      renderThrough(event.at, event.id);
      positionLabel.textContent = `Replay at ${clock(event.at)}`;
      if (index === replayEvents.length) stopReplay(false);
    }, 2800);
  });

  const requestedMoment = new URLSearchParams(location.search).get('moment');
  const initialTime = debateConfig?.id === 'science' && requestedMoment === 'shortlist' ? 4045 : Infinity;
  renderThrough(initialTime);
  requestAnimationFrame(jumpLatest);
  document.fonts?.ready.then(() => requestAnimationFrame(jumpLatest));
  window.setTimeout(jumpLatest, 250);

  const body = document.querySelector('.chat-body');
  const speechSegments = record.segments.filter((segment) => segment.kind === 'speech');
  const visibleSpeech = speechSegments.filter((segment) => segment.end <= initialTime);
  const peek = visibleSpeech.at(-1);
  const previewText = 'Transcript available';
  let transcriptHeight = 76;
  let transcriptInteracted = false;
  const focusExcerpt = () => {
    if (transcriptInteracted) return;
    const anchor = document.getElementById(visibleSpeech.at(-3)?.id || peek?.id);
    if (!anchor) return;
    chat.scrollTop += anchor.getBoundingClientRect().top - chat.getBoundingClientRect().top - 6;
  };
  const maxTranscriptHeight = () => Math.max(76, Math.floor(body.clientHeight * (matchMedia('(max-width: 600px)').matches ? .36 : .5)));
  const setTranscriptHeight = (height) => {
    const wasOpen = !transcriptPanel.classList.contains('is-collapsed');
    transcriptHeight = Math.max(76, Math.min(Math.round(height), maxTranscriptHeight()));
    const open = transcriptHeight > 110;
    transcriptPanel.style.setProperty('--transcript-height', `${transcriptHeight}px`);
    transcriptPanel.classList.toggle('is-collapsed', !open);
    chat.hidden = !open;
    transcriptGrip.setAttribute('aria-expanded', String(open));
    transcriptGrip.setAttribute('aria-label', open ? 'Drag down or select to close the transcript' : 'Drag up or select to open the transcript');
    transcriptPreview.textContent = selectedMeaning
      ? `Speech behind ${speakerName(entriesById.get(selectedMeaning.id).speaker)}’s meaning · ${evidenceIds(entriesById.get(selectedMeaning.id), entriesById.get(selectedMeaning.id).versions[selectedMeaning.versionIndex]).length} lines`
      : (open ? 'Automatic transcript · Scroll to review' : previewText);
    if (open && !wasOpen) requestAnimationFrame(focusExcerpt);
  };
  let dragStart = null;
  let ignoreClick = false;
  transcriptGrip.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    dragStart = { y: event.clientY, height: transcriptHeight, moved: false };
    transcriptGrip.setPointerCapture(event.pointerId);
  });
  transcriptGrip.addEventListener('pointermove', (event) => {
    if (!dragStart) return;
    const distance = dragStart.y - event.clientY;
    if (Math.abs(distance) > 4) dragStart.moved = true;
    if (dragStart.moved) setTranscriptHeight(dragStart.height + distance);
  });
  transcriptGrip.addEventListener('pointerup', () => {
    if (!dragStart) return;
    if (dragStart.moved) {
      if (transcriptHeight <= 110) setTranscriptHeight(76);
      ignoreClick = true;
      window.setTimeout(() => { ignoreClick = false; }, 0);
    }
    dragStart = null;
  });
  transcriptGrip.addEventListener('pointercancel', () => { dragStart = null; });
  transcriptGrip.addEventListener('click', () => {
    if (ignoreClick) return;
    setTranscriptHeight(transcriptHeight > 110 ? 76 : Math.max(220, body.clientHeight * (matchMedia('(max-width: 600px)').matches ? .3 : .4)));
  });
  transcriptGrip.addEventListener('keydown', (event) => {
    if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') setTranscriptHeight(76);
    else if (event.key === 'End') setTranscriptHeight(maxTranscriptHeight());
    else setTranscriptHeight(transcriptHeight + (event.key === 'ArrowUp' ? 80 : -80));
  });
  for (const eventName of ['wheel', 'touchstart', 'keydown']) {
    chat.addEventListener(eventName, () => { transcriptInteracted = true; }, { passive: true });
  }
  window.addEventListener('resize', () => {
    setTranscriptHeight(transcriptHeight);
    requestAnimationFrame(jumpLatest);
  });
  setTranscriptHeight(76);
  if (Number.isFinite(initialTime)) positionLabel.textContent = 'Direct-question example';
}
