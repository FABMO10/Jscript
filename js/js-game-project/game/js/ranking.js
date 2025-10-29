const LEADERBOARD_KEY = 'leaderboard';
if (!localStorage.getItem(LEADERBOARD_KEY)) {
  localStorage.setItem(LEADERBOARD_KEY, '[]');
}

function _lbLoad() {
  const raw = localStorage.getItem(LEADERBOARD_KEY);
  if (!raw) return [];
  const t = raw.trim();
  if (!(t.startsWith('[') && t.endsWith(']'))) return [];
  return JSON.parse(t);
}

function _normName(s) { return (s || '').replace(/\s+/g, ' ').trim(); }

function _sortByScore(board) {
  return [...board].sort((a, b) => {
    const sa = Number(a.score || 0), sb = Number(b.score || 0);
    if (sb !== sa) return sb - sa; // score desc
    return _normName(a.username).localeCompare(_normName(b.username)); // name asc
  });
}

function _addRanks(sorted) {
  // ties share rank by score
  let rank = 0, prevScore = null;
  return sorted.map((r, i) => {
    const s = Number(r.score || 0);
    if (s !== prevScore) { rank = i + 1; prevScore = s; }
    return { ...r, rank };
  });
}

function renderRankingBody(tbodyId = 'rankingBody') {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  const board = _lbLoad();
  const ranked = _addRanks(_sortByScore(board));

  tbody.innerHTML = '';

  if (ranked.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="3" style="text-align:center;">No entries yet — finish a game to appear here.</td>`;
    tbody.appendChild(tr);
    return;
  }

  ranked.forEach(({ rank, username, score }) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="rank">${rank}</td>
      <td>${_normName(username) || 'Guest'}</td>
      <td>${Number(score || 0)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Auto-refresh if another tab updates it
window.addEventListener('storage', (e) => {
  if (e.key === LEADERBOARD_KEY) renderRankingBody();
});

document.addEventListener('DOMContentLoaded', () => {
  renderRankingBody();
});
