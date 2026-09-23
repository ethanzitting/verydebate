const debates = {
  science: {
    label: 'Science, trust, and gender',
    data: 'data/science-debate-view.js?v=2',
    meanings: 'data/science-debate-meanings.js?v=6',
  },
  abortion: {
    label: 'Abortion debate',
    data: 'data/debate-view.js?v=3',
    meanings: 'data/debate-meanings.js?v=7',
  },
};

const requested = new URLSearchParams(location.search).get('debate');
const debateId = debates[requested] ? requested : 'science';
const debate = debates[debateId];
window.DEBATE_CONFIG = { id: debateId, ...debate };

const loadScript = (src) => new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = resolve;
  script.onerror = reject;
  document.head.append(script);
});

Promise.resolve()
  .then(() => loadScript(debate.data))
  .then(() => loadScript(debate.meanings))
  .then(() => loadScript('live-stage.js?v=31'))
  .catch(() => {
    document.querySelector('#meaning-list .load-note').textContent = 'The selected debate could not load.';
  });
