const USERS_KEY = 'users';
if (localStorage.getItem(USERS_KEY) === null) {
    localStorage.setItem(USERS_KEY, '[]'); // seed so JSON.parse is safe
}
const loadUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
const saveUsers = (arr) => localStorage.setItem(USERS_KEY, JSON.stringify(arr));

// ---- Helpers ----
const getId = () =>
    (window.crypto && window.crypto.randomUUID)
        ? window.crypto.randomUUID()
        : (Date.now() + Math.random().toString(16).slice(2));

// 1) Duplicate-username check (case-insensitive, trims)
function isUsernameTaken(users, candidate) {
    const norm = String(candidate || '').trim().toLowerCase();
    if (!norm) return false;
    return users.some(u => String(u?.username || '').trim().toLowerCase() === norm);
}

// 2) Password validator: 6–12 chars, A–Z, a–z, digit, symbol, no spaces
function buildPasswordRegex() {
    const parts = [];

    // length + classes
    parts.push('(?=.{6,12}$)');       // length
    parts.push('(?=.*[A-Z])');          // uppercase
    parts.push('(?=.*[a-z])');          // lowercase
    parts.push('(?=.*\\d)');            // digit
    parts.push('(?=.*[^A-Za-z0-9])');   // symbol
    parts.push('(?!.*\\s)');            // no whitespace

    return new RegExp('^' + parts.join('') + '.*$', 'i');
}

const rx = buildPasswordRegex();
function isPasswordValid(password) {
    return rx.test(String(password));
}
function passwordRuleText() {
    return 'Password must be 6–12 chars, include uppercase, lowercase, a digit, a symbol, and have no spaces.';
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
}

// Getting the inputs
document.getElementById('regForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = toTitleCase(document.getElementById('firstName')?.value.trim() || ''.toTitleCase());
    const lastName = toTitleCase(document.getElementById('lastName')?.value.trim() || '');
    const userName = toTitleCase(document.getElementById('userName')?.value.trim() || '');
    const password = toTitleCase(document.getElementById('password')?.value || '');
    const msgEl = document.getElementById('confirmation');

    const users = loadUsers();

    if (isUsernameTaken(users, userName)) {
        msgEl.textContent = 'That username already exists.';
        return;
    }
    if (!isPasswordValid(password)) {
        msgEl.textContent = passwordRuleText();
        return;
    }

    const user = {
        id: getId(),
        username: userName,
        firstName,
        lastName,
        password,
        created: new Date().toISOString()
    };

    users.push(user);
    saveUsers(users);

    const userElement = document.getElementById('new_USER');
    if (userElement) {
        userElement.textContent = JSON.stringify(user, null, 2);
    }
    msgEl.textContent = `Saved ${userName}`;
    e.target.reset();

    setTimeout(function () {
        window.location.href = "../Index/index.html"
    }, 2000);
});
