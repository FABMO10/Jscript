const USERS_KEY = 'users'; // localStorage key where the users array is stored
const CURRENT_USER_KEY = 'currentUser'; // localStorage key for the currently signed-in user object
const LEADERBOARD_KEY = 'leaderboard'; // localStorage key for the leaderboard array

// seed defaults once
if (!localStorage.getItem(USERS_KEY)) localStorage.setItem(USERS_KEY, '[]'); // if no users array exists, create an empty one
if (!localStorage.getItem(LEADERBOARD_KEY)) localStorage.setItem(LEADERBOARD_KEY, '[]'); // if no leaderboard exists, create an empty one

const parseOr = (raw, fallback) => { // utility: try to parse JSON string; otherwise return fallback
    const s = (raw ?? '').trim(); // ensure we have a string, default to '', then trim whitespace
    if (!s) return fallback; // if empty after trimming, return fallback immediately
    const looksArr = s.startsWith('[') && s.endsWith(']'); // quick check: string appears to be a JSON array
    const looksObj = s.startsWith('{') && s.endsWith('}'); // quick check: string appears to be a JSON object
    if (!(looksArr || looksObj)) return fallback; // if it looks like neither, do not parse; return fallback
    return JSON.parse(s); // parse and return the JSON value
};

const toNum = (v, fb = 0) => { // utility: coerce a value to a finite number or use fallback
    const n = Number(v); // attempt numeric conversion
    return Number.isFinite(n) ? n : fb; // return n if finite; otherwise the fallback
};

// ---- users ----
export const loadUsers = () => parseOr(localStorage.getItem(USERS_KEY), []); // read users from storage (or [] if missing/invalid)
export const saveUsers = (arr) => localStorage.setItem(USERS_KEY, JSON.stringify(arr)); // write users array back to storage

// ---- session user ----
export const getCurrentUser = () => parseOr(localStorage.getItem(CURRENT_USER_KEY), null); // read current user object (or null)
export const setCurrentUser = (obj) => localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(obj)); // store/replace current user object

// ---- score/cash helpers bound to session user ----
export function persistCashToUser(newCash) { // save a new cash value into the current user's record
    const me = getCurrentUser(); // fetch current user
    if (!me) return; // if no current user, stop
    const users = loadUsers(); // load full users array
    const idx = users.findIndex(u => u.id === me.id); // find index of current user by id
    if (idx >= 0) { // if found
        users[idx].cash = toNum(newCash, 0); // set cash to a safe numeric value
        saveUsers(users); // persist updated users array
    }
}

export function readStoredScore() { // read the stored score for the current user
    const me = getCurrentUser(); // fetch current user
    if (!me) return null; // if none, return null
    const users = loadUsers(); // load users array
    const idx = users.findIndex(u => u.id === me.id); // find current user's index
    if (idx >= 0) return toNum(users[idx].score, 0); // if found, return numeric score (default 0)
    return null; // if not found, return null
}

export function writeStoredScore(val) { // write/update the score for the current user
    const me = getCurrentUser(); // fetch current user
    if (!me) return; // if none, stop
    const users = loadUsers(); // load users array
    const idx = users.findIndex(u => u.id === me.id); // find current user's index
    if (idx >= 0) { // if found
        users[idx].score = toNum(val, 0); // set score to a safe numeric value
        saveUsers(users); // persist updated users array
    }
}

// ---- leaderboard ----
export const loadBoard = () => parseOr(localStorage.getItem(LEADERBOARD_KEY), []); // read leaderboard array (or [] if missing/invalid)
export const saveBoard = (arr) => localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(arr)); // write leaderboard array back to storage
