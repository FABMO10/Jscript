// ===== Leaderboard (no try/catch, no HTML) — const/let only =====

const LEADERBOARD_KEY = 'leaderboard';

// Seed storage so JSON.parse is safe later
if (!localStorage.getItem(LEADERBOARD_KEY)) {
  localStorage.setItem(LEADERBOARD_KEY, '[]');
}

// --- Helpers ---

function _normName(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

function _toNumber(v, fallback) {
  const n = Number(v);
  return (isFinite(n) ? n : (fallback == null ? 0 : fallback));
}

function _loadBoard() {
  // Safe because we seeded above; also falls back to '[]' when null
  return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
}

function _saveBoard(arr) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(arr));
}

// --- Public API ---

/**
 * Add/update a username’s score.
 * Keeps the **highest** score per username (case-insensitive).
 */
function upsertScore(username, score) {
  const name = _normName(username);
  const sc = _toNumber(score, NaN);

  if (!name) return;          // ignore empty names
  if (!isFinite(sc)) return;  // ignore invalid scores

  const board = _loadBoard();

  // Find existing (case-insensitive)
  const lowered = name.toLowerCase();
  let idx = -1;
  for (let i = 0; i < board.length; i++) {
    if (_normName(board[i].username).toLowerCase() === lowered) {
      idx = i; break;
    }
  }

  if (idx === -1) {
    board.push({
      username: name,
      score: sc,
      updatedAt: new Date().toISOString()
    });
  } else {
    const best = _toNumber(board[idx].score, 0);
    if (sc > best) {
      board[idx].score = sc;
      board[idx].updatedAt = new Date().toISOString();
    }
  }

  _saveBoard(board);
}

/**
 * Returns a **new array** sorted by:
 *  1) score DESC
 *  2) username ASC (case-insensitive) for ties
 */
function getSortedBoard() {
  const board = _loadBoard().slice(); // shallow copy

  for (let i = 0; i < board.length; i++) {
    board[i].username = _normName(board[i].username) || 'Unknown';
    board[i].score = _toNumber(board[i].score, 0);
  }

  board.sort((a, b) => {
    const sa = _toNumber(a.score, 0);
    const sb = _toNumber(b.score, 0);
    if (sb !== sa) return sb - sa;

    const na = a.username.toLowerCase();
    const nb = b.username.toLowerCase();
    if (na < nb) return -1;
    if (na > nb) return 1;
    return 0;
  });

  return board;
}

/** Plain-text view like "1. Alice — 300\n2. Bob — 250" */
function getBoardText(maxRows) {
  const rows = getSortedBoard();
  let limit = _toNumber(maxRows, rows.length);
  if (limit < 0) limit = 0;
  if (limit > rows.length) limit = rows.length;

  const out = [];
  for (let i = 0; i < limit; i++) {
    out.push((i + 1) + '. ' + rows[i].username + ' — ' + rows[i].score);
  }
  return out.join('\n');
}

/** Wipe all entries. */
function clearBoard() {
  localStorage.setItem(LEADERBOARD_KEY, '[]');
}

// Expose globally if you need to call from elsewhere
window.upsertScore   = upsertScore;
window.getSortedBoard= getSortedBoard;
window.getBoardText  = getBoardText;
window.clearBoard    = clearBoard;
JSON.parse(localStorage.getItem('leaderboard') || '[]')
