document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('logForm');
  const userEl = document.getElementById('username');
  const passEl = document.getElementById('password');
  const msgEl = document.getElementById('confirmation');

  const startGameBtn = document.getElementById('startBtn');
  const message = document.getElementById('message');

  if (startGameBtn && message) {
    startGameBtn.addEventListener('click', function () {
      message.style.display = 'block';
    });
  }

  const storageKey = 'users';
  const sessionKey = 'currentUser';

  if (!localStorage.getItem(storageKey)) {
    localStorage.setItem(storageKey, '[]');
  }

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substring(1).toLowerCase());
  }
  const loadUsers = () => JSON.parse(localStorage.getItem(storageKey) || '[]');
  const saveUsers = (arr) => localStorage.setItem(storageKey, JSON.stringify(arr));
  const normalize = (s) => (s || '').trim().replace(/\s+/g, ' ').toLowerCase();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const uname = normalize(userEl?.value);
    const pwd = passEl?.value || '';

    if (!uname || !pwd) {
      if (msgEl) msgEl.textContent = 'Please enter username and password.';
      return;
    }

    const users = loadUsers();

    if (!Array.isArray(users) || users.length === 0) {
      if (msgEl) msgEl.textContent = 'No users registered yet. Please register first.';
      return;
    }

    const user = users.find(u => normalize(u.username) === uname);
    if (!user) {
      if (msgEl) msgEl.textContent = 'User not registered. Please register first.';
      return;
    }

    if ((user.password || '') !== pwd) {
      if (msgEl) msgEl.textContent = 'Incorrect Password';
      return;
    }

    // ---- SUCCESSFUL LOGIN ----
    // Score resets to 0. Topscore remains same.
    if (!Number.isFinite(Number(user.cash))) user.cash = 100;
    if (!Number.isFinite(Number(user.topScore))) user.topScore = 0;
    user.score = 0; // score resets to 0 when user logs in
    user.lastLoggedInAt = new Date().toISOString();

    // Persist the updated user back into the array
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
      saveUsers(users);
    }

    // Remember who is logged in (session)
    localStorage.setItem(sessionKey, JSON.stringify({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      loggedInAt: new Date().toISOString()
    }));

    if (msgEl) msgEl.textContent = `Welcome, ${toTitleCase(user.username)}!`;

    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = '../Game/game.html';
    }, 2000);
  });
});
