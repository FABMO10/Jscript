const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';
const LEADERBOARD_KEY = 'leaderboard';

// seed defaults once
if (!localStorage.getItem(USERS_KEY)) localStorage.setItem(USERS_KEY, '[]');
if (!localStorage.getItem(LEADERBOARD_KEY)) localStorage.setItem(LEADERBOARD_KEY, '[]');

const parseOr = (raw, fallback) => {
    const s = (raw ?? '').trim();
    if (!s) return fallback;
    const looksArr = s.startsWith('[') && s.endsWith(']');
    const looksObj = s.startsWith('{') && s.endsWith('}');
    if (!(looksArr || looksObj)) return fallback;
    return JSON.parse(s);
};

const toNum = (v, fb = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fb;
};

// ---- users ----
export const loadUsers = () => parseOr(localStorage.getItem(USERS_KEY), []);
export const saveUsers = (arr) => localStorage.setItem(USERS_KEY, JSON.stringify(arr));

// ---- session user ----
export const getCurrentUser = () => parseOr(localStorage.getItem(CURRENT_USER_KEY), null);
export const setCurrentUser = (obj) => localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(obj));

// ---- score/cash helpers bound to session user ----
export function persistCashToUser(newCash) {
    const me = getCurrentUser();
    if (!me) return;
    const users = loadUsers();
    const idx = users.findIndex(u => u.id === me.id);
    if (idx >= 0) {
        users[idx].cash = toNum(newCash, 0);
        saveUsers(users);
    }
}

export function readStoredScore() {
    const me = getCurrentUser();
    if (!me) return null;
    const users = loadUsers();
    const idx = users.findIndex(u => u.id === me.id);
    if (idx >= 0) return toNum(users[idx].score, 0);
    return null;
}

export function writeStoredScore(val) {
    const me = getCurrentUser();
    if (!me) return;
    const users = loadUsers();
    const idx = users.findIndex(u => u.id === me.id);
    if (idx >= 0) {
        users[idx].score = toNum(val, 0);
        saveUsers(users);
    }
}

// ---- leaderboard ----
export const loadBoard = () => parseOr(localStorage.getItem(LEADERBOARD_KEY), []);
export const saveBoard = (arr) => localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(arr));
