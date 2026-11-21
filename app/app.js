// Leonida Trophy Guide — tracker for GTA VI's 55 PlayStation 5 trophies.
// Progress lives in this browser (localStorage); export/import moves it.
// Guides are the entry's own words; each cites its source beside it.
const KEY = 'leonida-trophy-guide-v1';
const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online',
  completion: '100% completion',
  platinum: 'Platinum',
};

const cardsEl = document.getElementById('cards');
const countLine = document.getElementById('count-line');
const emptyState = document.getElementById('empty-state');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kind');
const gradeEl = document.getElementById('grade');
const earnedFilterEl = document.getElementById('earned-filter');
const spoilerEl = document.getElementById('spoiler');

let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
const trophiesDoc = await (await fetch('data/trophies.json')).json();
const roadmapDoc = await (await fetch('data/roadmap.json')).json();
const trophies = trophiesDoc.trophies;

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}

function trophyMatches(t) {
  const q = searchEl.value.trim().toLowerCase();
  if (q) {
    const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (kindEl.value !== 'all' && t.kind !== kindEl.value) return false;
  if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
  const isEarned = earned.has(t.name);
  if (earnedFilterEl.value === 'earned' && !isEarned) return false;
  if (earnedFilterEl.value === 'todo' && isEarned) return false;
  return true;
}

function spoilerHides(t) {
  return spoilerEl.checked && t.kind === 'story' && !earned.has(t.name);
}

function makeCard(t) {
  const card = document.createElement('article');
  card.className = 'card' + (earned.has(t.name) ? ' earned' : '');
  const head = document.createElement('div');
  head.className = 'card-head';
  const title = document.createElement('h3');
  title.textContent = t.name;
  const grade = document.createElement('span');
  grade.className = `grade ${t.grade}`;
  grade.textContent = t.grade;
  head.append(title, grade);
  card.append(head);

  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = t.description;
  card.append(desc);

  if (spoilerHides(t)) {
    title.classList.add('spoiler-hidden');
    desc.classList.add('spoiler-hidden');
    const hidden = document.createElement('p');
    hidden.className = 'guide';
    hidden.textContent = 'Story trophy — earn it in the game to reveal its name and guide.';
    card.append(hidden);
  } else {
    const guide = document.createElement('p');
    guide.className = 'guide';
    guide.textContent = t.guide;
    card.append(guide);
  }

  const flags = document.createElement('div');
  flags.className = 'flags';
  const kindFlag = document.createElement('span');
  kindFlag.className = 'flag kind';
  kindFlag.textContent = KIND_LABELS[t.kind] ?? t.kind;
  flags.append(kindFlag);
  if (t.missable) {
    const f = document.createElement('span');
    f.className = 'flag missable';
    f.textContent = 'Missable — do it in Chapter 1';
    flags.append(f);
  }
  if (t.guide.includes('still unconfirmed')) {
    const f = document.createElement('span');
    f.className = 'flag unconfirmed';
    f.textContent = 'Method unconfirmed';
    flags.append(f);
  }
  card.append(flags);

  const source = document.createElement('p');
  source.className = 'source';
  source.textContent = 'Source: ';
  const link = document.createElement('a');
  link.href = t.source_url;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = t.source;
  source.append(link);
  card.append(source);

  const foot = document.createElement('div');
  foot.className = 'card-foot';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'earn-btn';
  btn.textContent = earned.has(t.name) ? '✓ Earned — undo' : 'Mark earned';
  btn.addEventListener('click', () => {
    if (earned.has(t.name)) earned.delete(t.name);
    else earned.add(t.name);
    save();
    render();
  });
  const id = document.createElement('span');
  id.className = 'source';
  id.textContent = `#${t.id}`;
  foot.append(btn, id);
  card.append(foot);
  return card;
}

function render() {
  const shown = trophies.filter(trophyMatches);
  cardsEl.replaceChildren(...shown.map(makeCard));
  const pct = Math.round((earned.size / trophies.length) * 100);
  document.getElementById('earned-count').textContent = earned.size;
  document.getElementById('progress-fill').style.width = `${pct}%`;
  document.getElementById('progress-text').textContent =
    `${earned.size} of ${trophies.length} earned · ${pct}% to the platinum`;
  countLine.textContent = `Showing ${shown.length} of ${trophies.length} trophies` +
    (kindEl.value === 'online' ? ' · every trophy is earned offline' : '');
  if (shown.length === 0) {
    emptyState.hidden = false;
    emptyState.textContent = kindEl.value === 'online'
      ? 'No online trophies — all 55 trophies are earned offline in single-player. Nothing here needs a connection or another player.'
      : 'No trophies match these filters. Clear the search or widen the kind and grade filters.';
  } else {
    emptyState.hidden = true;
  }
}

function renderRoadmap() {
  document.getElementById('roadmap-summary').textContent = roadmapDoc.summary;
  const facts = document.getElementById('roadmap-facts');
  facts.replaceChildren(...roadmapDoc.facts.map((f) => {
    const div = document.createElement('div');
    const dt = document.createElement('dt');
    dt.textContent = f.label;
    const dd = document.createElement('dd');
    dd.textContent = f.value;
    div.append(dt, dd);
    return div;
  }));
  const stages = document.getElementById('roadmap-stages');
  stages.replaceChildren(...roadmapDoc.stages.map((s) => {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    h3.textContent = `Stage ${s.stage}: ${s.name} `;
    const time = document.createElement('span');
    time.className = 'time';
    time.textContent = `(${s.time})`;
    h3.append(time);
    const goal = document.createElement('p');
    goal.className = 'goal';
    goal.textContent = s.goal;
    const ul = document.createElement('ul');
    ul.replaceChildren(...s.steps.map((step) => {
      const stepEl = document.createElement('li');
      stepEl.textContent = step;
      return stepEl;
    }));
    li.append(h3, goal, ul);
    return li;
  }));
  const src = document.getElementById('roadmap-source');
  src.href = roadmapDoc.source_url;
  src.textContent = roadmapDoc.source;
}

function showView(which) {
  const roadmap = which === 'roadmap';
  document.getElementById('roadmap-view').hidden = !roadmap;
  document.getElementById('guide-view').hidden = roadmap;
  document.getElementById('view-roadmap').classList.toggle('active', roadmap);
  document.getElementById('view-guide').classList.toggle('active', !roadmap);
}

document.getElementById('view-guide').addEventListener('click', () => showView('guide'));
document.getElementById('view-roadmap').addEventListener('click', () => showView('roadmap'));
for (const el of [searchEl, kindEl, gradeEl, earnedFilterEl, spoilerEl]) {
  el.addEventListener('input', render);
  el.addEventListener('change', render);
}

document.getElementById('reset').addEventListener('click', () => {
  if (earned.size === 0) return;
  if (confirm('Clear all earned trophies? Your exported backup file still works if you want them back.')) {
    earned.clear();
    save();
    render();
  }
});
document.getElementById('export').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(
    [JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned] }, null, 2)],
    { type: 'application/json' },
  ));
  a.download = 'leonida-trophy-progress.json';
  a.click();
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    const known = new Set(trophies.map((t) => t.name));
    earned = new Set((names ?? []).filter((n) => known.has(n)));
    save();
    render();
  } catch {
    alert('That file is not a trophy progress export from this guide.');
  }
});

renderRoadmap();
render();

// Fixed scenes for screenshots (?shot=cover|roadmap|spoiler|guide).
// Each sets a deterministic state, then flags window.__shotReady.
const params = new URLSearchParams(location.search);
const shot = params.get('shot');
if (shot === 'cover') {
  for (const name of [
    'Just Like Paradise', 'Paradise Lost', 'T**s Ass Drug Money', 'Vice City, Baby!',
    'Top Of The World, Ma', 'Trust', 'Break the Bank', 'Family Matters',
    'DWNFALL', 'Hi-Jacked', 'Snow Storm', 'Positive Mental Attitude',
  ]) earned.add(name);
  save();
  render();
} else if (shot === 'roadmap') {
  showView('roadmap');
} else if (shot === 'spoiler') {
  spoilerEl.checked = true;
  kindEl.value = 'story';
  render();
} else if (shot === 'guide') {
  searchEl.value = 'Positive Mental Attitude';
  render();
}
window.__shotReady = true;
