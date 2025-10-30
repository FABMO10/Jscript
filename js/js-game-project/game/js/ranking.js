// Key used to store the leaderboard array in localStorage
const LEADERBOARD_KEY = 'leaderboard';

// Initialise the leaderboard in storage the first time the app runs
if (!localStorage.getItem(LEADERBOARD_KEY)) {
  localStorage.setItem(LEADERBOARD_KEY, '[]'); // store an empty JSON array
}

/**
 * Load and parse the leaderboard from localStorage.
 * Returns a safe empty array if the data is missing or malformed.
 */
function _lbLoad() {
  const raw = localStorage.getItem(LEADERBOARD_KEY);
  if (!raw) return [];
  const t = raw.trim();
  // quick sanity check before JSON.parse to avoid throwing on garbage
  if (!(t.startsWith('[') && t.endsWith(']'))) return []; // [{ username, score }, ...]
  return JSON.parse(t);
}

/**
 * Normalise a name: collapse internal whitespace and trim.
 * Helps keep sorting and display consistent.
 */
function _normName(s) { return (s || '').replace(/\s+/g, ' ').trim(); }

/**
 * Return a new array sorted by:
 *  1) score descending
 *  2) username ascending
 */
function _sortByScore(board) {
  return [...board].sort((a, b) => {
    const sa = Number(a.score || 0), sb = Number(b.score || 0);
    if (sb !== sa) return sb - sa; // score desc
    return _normName(a.username).localeCompare(_normName(b.username)); // name asc
  });
}

// new score -> new rank position
function _addRanks(sorted) {
  // ties share rank by score
  let rank = 0, prevScore = null;
  return sorted.map((r, i) => {
    const s = Number(r.score || 0);
    if (s !== prevScore) { rank = i + 1; prevScore = s; }
    return { ...r, rank };
  });
}

/**
 * Render the leaderboard rows into a <tbody> (default id="rankingBody").
 * If the board is empty, show a friendly placeholder row.
 */
function renderRankingBody(tbodyId = 'rankingBody') {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  const board = _lbLoad();
  const ranked = _addRanks(_sortByScore(board));

  // Clear current rows
  tbody.innerHTML = '';

  // Empty state
  if (ranked.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="3" style="text-align:center;">No entries yet — finish a game to appear here.</td>`;
    tbody.appendChild(tr);
    return;
  }

  // Populate table with rank, username, score
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

// Initial render once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  renderRankingBody();
});
